jest.mock('react-native-background-actions', () => ({
  __esModule: true,
  default: {
    isRunning: jest.fn(() => false),
    start: jest.fn(),
    stop: jest.fn(),
  },
}));

jest.mock('react-native-device-info', () => ({
  __esModule: true,
  default: {getBatteryLevel: jest.fn().mockResolvedValue(0.85)},
}));

jest.mock('react-native-geolocation-service', () => ({
  __esModule: true,
  default: {getCurrentPosition: jest.fn()},
}));

import {
  buildTrackingPayload,
  getTrackingIntervals,
  isWithinTrackingSchedule,
  sendTrackingPing,
} from '../src/components/BackgroundLocationService';

const userinfo = {
  emp_code: 'IT071',
  live_tracking_enabled: true,
  live_tracking_api_token: 'test-token',
  tracking_active_minutes: 3,
  tracking_offline_minutes: 10,
  tracking_active_days: {monday: true, sunday: false},
  tracking_working_hours: {
    monday: [{hour_from: 9, hour_to: 17.5}],
    sunday: [],
  },
};

const position = {
  coords: {
    latitude: 17.3735936,
    longitude: 78.4171008,
    speed: 10,
    accuracy: 10.4,
  },
};

describe('live tracking', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('tracks only inside an active working window', () => {
    expect(
      isWithinTrackingSchedule(userinfo, new Date(2026, 7, 17, 10, 0)),
    ).toBe(true);
    expect(
      isWithinTrackingSchedule(userinfo, new Date(2026, 7, 17, 18, 0)),
    ).toBe(false);
    expect(
      isWithinTrackingSchedule(userinfo, new Date(2026, 7, 16, 10, 0)),
    ).toBe(false);
  });

  test('stops exactly at shift end and fails closed without a schedule', () => {
    expect(
      isWithinTrackingSchedule(userinfo, new Date(2026, 7, 17, 17, 29, 59)),
    ).toBe(true);
    expect(
      isWithinTrackingSchedule(userinfo, new Date(2026, 7, 17, 17, 30)),
    ).toBe(false);
    expect(
      isWithinTrackingSchedule({...userinfo, tracking_working_hours: undefined}),
    ).toBe(false);
  });

  test('builds the expected JSON-RPC location payload', async () => {
    const payload = await buildTrackingPayload(userinfo, position);

    expect(payload.params).toMatchObject({
      employee_code: 'IT071',
      token: 'test-token',
      latitude: 17.3735936,
      longitude: 78.4171008,
      speed: 36,
      battery: 85,
      accuracy: 10,
      address: null,
    });
  });

  test('uses backend-provided active and offline intervals', () => {
    expect(getTrackingIntervals(userinfo)).toEqual({
      activeMs: 180_000,
      offlineMs: 600_000,
    });
  });

  test('uses safe defaults for invalid intervals', () => {
    expect(
      getTrackingIntervals({
        tracking_active_minutes: 0,
        tracking_offline_minutes: 'invalid',
      }),
    ).toEqual({activeMs: 180_000, offlineMs: 600_000});
  });

  test('posts a ping to the configured server', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({result: {success: true}}),
    });

    await sendTrackingPing({
      serverOrigin: 'https://example.com/',
      userinfo,
      position,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://example.com/employee_live_tracking/api/ping',
      expect.objectContaining({method: 'POST'}),
    );
  });
});
