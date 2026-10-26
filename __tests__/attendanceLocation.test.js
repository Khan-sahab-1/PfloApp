jest.mock('react-native-geolocation-service', () => ({getCurrentPosition: jest.fn()}));
import {Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {getAttendanceLocation, validAttendanceCoordinates} from '../src/utils/attendanceLocation';

beforeEach(() => { jest.useFakeTimers(); jest.resetAllMocks(); });
afterEach(() => jest.useRealTimers());
const position = {coords: {latitude: 28.6, longitude: 77.2}};
test('accepts valid coordinates including zero', async () => {
  Geolocation.getCurrentPosition.mockImplementation(success => success(position));
  await expect(getAttendanceLocation()).resolves.toEqual(position.coords);
  expect(validAttendanceCoordinates({latitude: 0, longitude: 0})).toBe(true);
  expect(jest.getTimerCount()).toBe(0);
});
test.each([null, {}, {coords: {}}, {coords: {latitude: NaN, longitude: 0}}, {coords: {latitude: 91, longitude: 0}}, {coords: {latitude: 0, longitude: 181}}])('rejects invalid native result %p', async value => {
  Geolocation.getCurrentPosition.mockImplementation(success => success(value));
  await expect(getAttendanceLocation()).rejects.toThrow('Valid location');
});
test('handles missing error data and synchronous native failure', async () => {
  Geolocation.getCurrentPosition.mockImplementation((_, error) => error());
  await expect(getAttendanceLocation()).rejects.toThrow('Unable to get location');
  Geolocation.getCurrentPosition.mockImplementation(() => { throw new Error('native failure'); });
  await expect(getAttendanceLocation()).rejects.toThrow('native failure');
});
test('cancels on blur and ignores late native callbacks', async () => {
  const controller = new AbortController();
  const request = getAttendanceLocation({signal: controller.signal});
  const rejected = expect(request).rejects.toThrow('cancelled');
  controller.abort();
  Geolocation.getCurrentPosition.mock.calls[0][0](position);
  await rejected;
  expect(jest.getTimerCount()).toBe(0);
});
test('already cancelled request never reaches native code', async () => {
  const controller = new AbortController();
  controller.abort();
  await expect(getAttendanceLocation({signal: controller.signal})).rejects.toThrow('cancelled');
  expect(Geolocation.getCurrentPosition).not.toHaveBeenCalled();
});
test('times out even if native code never calls back', async () => {
  const request = getAttendanceLocation();
  const rejected = expect(request).rejects.toThrow('timed out');
  jest.advanceTimersByTime(20000);
  Geolocation.getCurrentPosition.mock.calls[0][0](position);
  await rejected;
});
test('duplicate native callbacks settle only once', async () => {
  Geolocation.getCurrentPosition.mockImplementation((success, error) => {
    success(position); error({message: 'late error'}); success(null);
  });
  await expect(getAttendanceLocation()).resolves.toEqual(position.coords);
});
test('rejects mock location on Android', async () => {
  const os = Platform.OS;
  Platform.OS = 'android';
  try {
  Geolocation.getCurrentPosition.mockImplementation(success => success({...position, mocked: true}));
  await expect(getAttendanceLocation()).rejects.toThrow('mock location');
  } finally { Platform.OS = os; }
});
