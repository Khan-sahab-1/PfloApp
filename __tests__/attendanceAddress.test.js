jest.mock('react-native', () => ({NativeModules: {AttendanceGeocoder: {reverseGeocode: jest.fn()}}}));
jest.mock('../src/offline/queue', () => ({saveAttendanceAddress: jest.fn()}));
import {NativeModules} from 'react-native';
import {saveAttendanceAddress} from '../src/offline/queue';
import {getAttendanceAddress} from '../src/offline/address';

const account = {server: 'https://example.com', employee: {id: 144}};
const record = {attendance_id: 'one', latitude: 30, longitude: 78};
const geocoder = NativeModules.AttendanceGeocoder;
beforeEach(() => {
  jest.clearAllMocks();
  NativeModules.AttendanceGeocoder = geocoder;
  geocoder.reverseGeocode.mockResolvedValue('Dehradun, India');
  saveAttendanceAddress.mockResolvedValue();
});
afterEach(() => { jest.useRealTimers(); });

test('resolves captured coordinates through native Geocoder and persists the address', async () => {
  expect(await getAttendanceAddress(record, account)).toBe('Dehradun, India');
  expect(geocoder.reverseGeocode).toHaveBeenCalledWith(30, 78);
  expect(saveAttendanceAddress).toHaveBeenCalledWith(account, 'one', 'Dehradun, India');
});
test('reuses the saved address on retry without another lookup', async () => {
  expect(await getAttendanceAddress({...record, emp_address: ' Saved address '}, account)).toBe('Saved address');
  expect(geocoder.reverseGeocode).not.toHaveBeenCalled();
});
test.each(['Captured offline', ' Captured offline ', 'CAPTURED OFFLINE'])('resolves old placeholder %s instead of reusing it', async emp_address => {
  expect(await getAttendanceAddress({...record, emp_address}, account)).toBe('Dehradun, India');
  expect(geocoder.reverseGeocode).toHaveBeenCalledTimes(1);
});
test.each(['', null, 'Captured offline'])('empty or placeholder native result %s does not save a fake address', async result => {
  geocoder.reverseGeocode.mockResolvedValue(result);
  await expect(getAttendanceAddress(record, account)).rejects.toThrow('Address not found');
  expect(saveAttendanceAddress).not.toHaveBeenCalled();
});
test.each([{latitude: 91}, {longitude: 181}, {latitude: NaN}])('invalid coordinates %p skip the native service', async coordinates => {
  await expect(getAttendanceAddress({...record, ...coordinates}, account)).rejects.toThrow('coordinates are invalid');
  expect(geocoder.reverseGeocode).not.toHaveBeenCalled();
});
test('service failure leaves attendance saved for retry', async () => {
  geocoder.reverseGeocode.mockRejectedValueOnce(new Error('Device address lookup failed'));
  await expect(getAttendanceAddress(record, account)).rejects.toThrow('Device address lookup failed');
  expect(saveAttendanceAddress).not.toHaveBeenCalled();
});
test('missing module requires the new APK and makes no paid API fallback', async () => {
  NativeModules.AttendanceGeocoder = undefined;
  await expect(getAttendanceAddress(record, account)).rejects.toThrow('Install the updated Android APK');
  expect(saveAttendanceAddress).not.toHaveBeenCalled();
});
test('an already cancelled background task skips the lookup', async () => {
  const controller = new AbortController();
  controller.abort();
  await expect(getAttendanceAddress(record, account, {signal: controller.signal})).rejects.toThrow('cancelled');
  expect(geocoder.reverseGeocode).not.toHaveBeenCalled();
});
test('cancelled background lookup ignores a late native result', async () => {
  let complete;
  geocoder.reverseGeocode.mockImplementationOnce(() => new Promise(resolve => {complete = resolve;}));
  const controller = new AbortController();
  const result = getAttendanceAddress(record, account, {signal: controller.signal});
  const rejection = expect(result).rejects.toThrow('cancelled');
  await Promise.resolve();
  controller.abort();
  await rejection;
  complete('Late address');
  await Promise.resolve();
  expect(saveAttendanceAddress).not.toHaveBeenCalled();
});
test('a stalled native bridge times out without saving an address', async () => {
  jest.useFakeTimers();
  geocoder.reverseGeocode.mockImplementationOnce(() => new Promise(() => {}));
  const result = getAttendanceAddress(record, account);
  const rejection = expect(result).rejects.toThrow('timed out');
  await Promise.resolve();
  jest.advanceTimersByTime(12000);
  await rejection;
  expect(saveAttendanceAddress).not.toHaveBeenCalled();
});
