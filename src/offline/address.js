import {NativeModules} from 'react-native';
import {saveAttendanceAddress} from './queue';

function lookupAddress(latitude, longitude, signal) {
  if (signal?.aborted) { return Promise.reject(new Error('Address lookup cancelled.')); }
  const geocoder = NativeModules.AttendanceGeocoder;
  if (!geocoder?.reverseGeocode) {
    return Promise.reject(new Error('Native address service unavailable. Install the updated Android APK.'));
  }
  return new Promise((resolve, reject) => {
    let settled = false;
    let timer;
    const finish = (error, address) => {
      if (settled) { return; }
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener('abort', cancel);
      if (error) { reject(error); } else { resolve(address); }
    };
    const cancel = () => finish(new Error('Address lookup cancelled. Attendance remains saved.'));
    signal?.addEventListener('abort', cancel);
    timer = setTimeout(() => finish(new Error('Address lookup timed out. Attendance remains saved.')), 12000);
    Promise.resolve().then(() => {
      if (!settled) { return geocoder.reverseGeocode(latitude, longitude); }
    }).then(address => finish(null, address), error => finish(error));
  });
}

export async function getAttendanceAddress(record, account, {signal} = {}) {
  if (signal?.aborted) { throw new Error('Address lookup cancelled.'); }
  const savedAddress = typeof record.emp_address === 'string' ? record.emp_address.trim() : '';
  if (savedAddress && savedAddress.toLowerCase() !== 'captured offline') {
    return savedAddress;
  }
  if (!Number.isFinite(record.latitude) || !Number.isFinite(record.longitude) ||
      Math.abs(record.latitude) > 90 || Math.abs(record.longitude) > 180) {
    throw new Error('Saved attendance coordinates are invalid.');
  }
  const result = await lookupAddress(record.latitude, record.longitude, signal);
  const address = typeof result === 'string' ? result.trim() : '';
  if (!address || address.toLowerCase() === 'captured offline') {
    throw new Error('Address not found for saved coordinates. Attendance remains saved.');
  }
  if (signal?.aborted) { throw new Error('Address lookup cancelled.'); }
  await saveAttendanceAddress(account, record.attendance_id, address);
  return address;
}
