import Geolocation from 'react-native-geolocation-service';
import {Platform} from 'react-native';

export const validAttendanceCoordinates = coords =>
  Number.isFinite(coords?.latitude) && Number.isFinite(coords?.longitude) &&
  Math.abs(coords.latitude) <= 90 && Math.abs(coords.longitude) <= 180;

// Native single-shot requests cannot be cancelled individually. Settle once and
// ignore late callbacks without stopping the app's other location watchers.
export function getAttendanceLocation({signal} = {}) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timer;
    const finish = (error, coords) => {
      if (settled) { return; }
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', cancel);
      if (error) { reject(error); } else { resolve(coords); }
    };
    const cancel = () => finish(new Error('Location request cancelled.'));
    if (signal?.aborted) { cancel(); return; }
    signal?.addEventListener('abort', cancel);
    timer = setTimeout(() => finish(new Error('Location timed out. Enable GPS and try again.')), 20000);
    try {
      Geolocation.getCurrentPosition(position => {
        if (Platform.OS === 'android' && position?.mocked) {
          finish(new Error('Please disable mock location and try again.'));
        } else if (!validAttendanceCoordinates(position?.coords)) {
          finish(new Error('Valid location was not received. Please try again.'));
        } else { finish(null, position.coords); }
      }, error => finish(new Error(
        typeof error?.message === 'string' && error.message
          ? error.message : 'Unable to get location. Enable GPS and try again.',
      )), {
        enableHighAccuracy: true, timeout: 15000, maximumAge: 0,
        forceRequestLocation: true, showLocationDialog: true,
      });
    } catch (error) {
      finish(new Error(typeof error?.message === 'string' ? error.message : 'Location service unavailable.'));
    }
  });
}
