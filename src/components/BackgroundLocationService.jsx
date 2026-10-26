import BackgroundService from 'react-native-background-actions';
import DeviceInfo from 'react-native-device-info';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  hasAcceptedLocationDisclosure,
  requestGooglePlayCompliantPermissions,
} from '../utils/locationDisclosure';

const TRACKING_PATH = '/employee_live_tracking/api/ping';
const REQUEST_TIMEOUT_MS = 25_000;
const LOG_TAG = '[PFLO Tracking]';
const MINUTE_MS = 60_000;
const DEFAULT_ACTIVE_MINUTES = 3;
const DEFAULT_OFFLINE_MINUTES = 10;

const sleep = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

const getDayName = date =>
  ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
    date.getDay()
  ];

const getDecimalHour = date =>
  date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

const isInWindow = (currentHour, fromValue, toValue) => {
  const from = Number(fromValue);
  const to = Number(toValue);
  if (!Number.isFinite(from) || !Number.isFinite(to)) {
    return false;
  }

  return from <= to
    ? currentHour >= from && currentHour < to
    : currentHour >= from || currentHour < to;
};

const validMinutes = (value, fallback) => {
  const minutes = Number(value);
  return Number.isFinite(minutes) && minutes >= 1 && minutes <= 24 * 60
    ? minutes
    : fallback;
};

export const getTrackingIntervals = userinfo => ({
  activeMs:
    validMinutes(userinfo?.tracking_active_minutes, DEFAULT_ACTIVE_MINUTES) *
    MINUTE_MS,
  offlineMs:
    validMinutes(userinfo?.tracking_offline_minutes, DEFAULT_OFFLINE_MINUTES) *
    MINUTE_MS,
});

export const isWithinTrackingSchedule = (userinfo, date = new Date()) => {
  if (!userinfo?.live_tracking_enabled) {
    return false;
  }

  const day = getDayName(date);
  if (userinfo.tracking_active_days?.[day] === false) {
    return false;
  }

  const windows = userinfo.tracking_working_hours?.[day];
  const currentHour = getDecimalHour(date);
  if (Array.isArray(windows)) {
    return windows.some(window =>
      isInWindow(currentHour, window?.hour_from, window?.hour_to),
    );
  }

  if (
    userinfo.tracking_start_time !== undefined &&
    userinfo.tracking_end_time !== undefined
  ) {
    return isInWindow(
      currentHour,
      userinfo.tracking_start_time,
      userinfo.tracking_end_time,
    );
  }

  // Fail closed: missing/invalid schedule must never cause unrestricted tracking.
  return false;
};

const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 20_000,
      maximumAge: 15_000,
      showLocationDialog: true,
      forceRequestLocation: true,
    });
  });

export const buildTrackingPayload = async (userinfo, position) => {
  if (!position?.coords) {
    throw new Error('A valid location is required');
  }

  const batteryLevel = await DeviceInfo.getBatteryLevel().catch(() => -1);
  const speed = Number(position.coords.speed);

  return {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      employee_code: userinfo.emp_code,
      token: userinfo.live_tracking_api_token,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: Number.isFinite(speed)
        ? Math.max(0, Math.round(speed * 36) / 10)
        : 0,
      battery:
        batteryLevel >= 0 ? Math.round(Math.min(1, batteryLevel) * 100) : null,
      accuracy: Number.isFinite(position.coords.accuracy)
        ? Math.round(position.coords.accuracy)
        : null,
      address: null,
    },
    id: Date.now(),
  };
};

export const sendTrackingPing = async ({serverOrigin, userinfo, position}) => {
  if (!serverOrigin || !userinfo?.emp_code || !userinfo?.live_tracking_api_token) {
    throw new Error('Live tracking configuration is incomplete');
  }

  const url = `${serverOrigin.replace(/\/$/, '')}${TRACKING_PATH}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
      body: JSON.stringify(await buildTrackingPayload(userinfo, position)),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Live tracking request failed (${response.status})`);
    }

    const body = await response.json();
    console.log(LOG_TAG, 'Tracking ping response=>>>>>>>>>>>', {body});
    if (body?.error) {
      throw new Error(body.error.message || 'Live tracking was rejected');
    }
    return body;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('Live tracking request timed out');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const trackingTask = async ({serverOrigin, userinfo}) => {
  const {activeMs, offlineMs} = getTrackingIntervals(userinfo);
  let waitRemainingMs = 0;

  while (BackgroundService.isRunning()) {
    // Schedule is checked before requesting GPS and again before the API call.
    if (!isWithinTrackingSchedule(userinfo)) {
      await BackgroundService.stop();
      return;
    }

    // Wake at least once per minute so shift-end/logout rules are applied
    // promptly even when the backend configured a longer retry interval.
    if (waitRemainingMs > 0) {
      const sleepMs = Math.min(waitRemainingMs, MINUTE_MS);
      await sleep(sleepMs);
      waitRemainingMs -= sleepMs;
      continue;
    }

    try {
      const position = await getCurrentPosition();
      if (BackgroundService.isRunning() && isWithinTrackingSchedule(userinfo)) {
        await sendTrackingPing({serverOrigin, userinfo, position});
      }
      waitRemainingMs = activeMs;
    } catch (error) {
      console.warn(LOG_TAG, 'Tracking cycle failed', {
        message: error?.message,
        code: error?.code,
      });
      waitRemainingMs = offlineMs;
    }
  }
};

const requestAndroidPermissions = async () => {
  if (Platform.OS !== 'android') {
    return false;
  }

  const fineLocation = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Live location permission',
      message:
        'PFLO shares your duty location only during configured working hours.',
      buttonPositive: 'Allow',
      buttonNegative: 'Cancel',
    },
  );
  if (fineLocation !== PermissionsAndroid.RESULTS.GRANTED) {
    return false;
  }

  if (Platform.Version >= 33) {
    const notification = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return notification === PermissionsAndroid.RESULTS.GRANTED;
  }

  return true;
};

export const startTracking = async ({userinfo, serverOrigin}) => {
  if (
    !userinfo?.live_tracking_enabled ||
    !userinfo?.emp_code ||
    !userinfo?.live_tracking_api_token ||
    !serverOrigin ||
    !isWithinTrackingSchedule(userinfo)
  ) {
    return false;
  }

  // Google Play Compliance: Verify prominent location disclosure is accepted
  const disclosureAccepted = await hasAcceptedLocationDisclosure();
  if (!disclosureAccepted) {
    console.warn(LOG_TAG, 'Cannot start live tracking: prominent disclosure has not been accepted by user');
    return false;
  }

  if (!(await requestGooglePlayCompliantPermissions())) {
    return false;
  }

  if (BackgroundService.isRunning()) {
    await BackgroundService.stop();
  }

  await BackgroundService.start(trackingTask, {
    taskName: 'PFLOTracking',
    taskTitle: 'PFLO live tracking is active',
    taskDesc: 'Location is shared only during your working hours',
    taskIcon: {name: 'ic_launcher', type: 'mipmap'},
    color: '#2196F3',
    linkingURI: 'pflo://home',
    foregroundServiceType: ['location'],
    parameters: {serverOrigin, userinfo},
  });

  return true;
};

export const stopTracking = async () => {
  if (BackgroundService.isRunning()) {
    await BackgroundService.stop();
  }
};

export const isTrackingRunning = () => BackgroundService.isRunning();
