jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn(),
}));
jest.mock('@react-native-community/netinfo', () => ({fetch: jest.fn()}));
import Storage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {saveLogin, restoreOffline, logoutAttendance, getSession, getSavedAccount, requireAttendanceAccess, lockSession, restoreSavedAccess} from '../src/offline/session';

const server = 'https://example.com';
const result = flag => ({success: true, employee_name: {
  id: 144, name: 'Employee', emp_code: 'IT201', emp_punch_code: '194', offline_attendance: flag,
}});
let saved;
let signedOut;
beforeEach(() => {
  jest.clearAllMocks();
  saved = null;
  signedOut = null;
  lockSession();
  const map = {};
  Storage.setItem.mockImplementation(async (key, value) => {
    map[key] = value;
    if (key === 'attendance:signed-out:v1') { signedOut = value; }
    if (key === 'attendance:last-authorized-employee:v1') { saved = value; }
  });
  Storage.removeItem.mockImplementation(async key => {
    delete map[key];
    if (key === 'attendance:signed-out:v1') { signedOut = null; }
    if (key === 'attendance:last-authorized-employee:v1') { saved = null; }
  });
  Storage.getItem.mockImplementation(async key => {
    if (key === 'attendance:signed-out:v1') { return signedOut; }
    if (key === 'attendance:last-authorized-employee:v1') { return saved; }
    return map[key] || null;
  });
  NetInfo.fetch.mockResolvedValue({isConnected: false});
});

test.each([false, undefined, 'true', 1, null])('denies offline permission for %p', async flag => {
  await saveLogin(result(true), server);
  await saveLogin(result(flag), server);
  expect(await restoreOffline(server)).toBeNull();
  await expect(requireAttendanceAccess(server, 'IT201')).rejects.toThrow('not enabled');
});
test('restores only matching saved employee and server, without credentials', async () => {
  await saveLogin(result(true), server);
  expect(await restoreOffline('https://other.com')).toBeNull();
  expect(await restoreOffline(server, 'OTHER')).toBeNull();
  expect((await restoreOffline(server, '194')).employee.id).toBe(144);
  expect(JSON.parse(saved)).not.toHaveProperty('password');
});
test('uses employee_code as fallback when emp_code is missing', async () => {
  await saveLogin({success: true, employee_name: {
    id: 144, name: 'Employee', employee_code: 'IT201', emp_punch_code: '194', offline_attendance: true,
  }}, server);
  const account = await restoreOffline(server);
  expect(account?.employee?.emp_code).toBe('IT201');
  expect(await getSavedAccount()).not.toBeNull();
});
test('first offline login is refused', async () => {
  expect(await restoreOffline(server)).toBeNull();
});
test('logout retains offline authorization for explicit sign in', async () => {
  await saveLogin(result(true), server);
  await logoutAttendance();
  expect(getSession()).toBeNull();
  expect(await restoreSavedAccess()).toBeNull();
  expect((await restoreOffline(server, 'IT201')).employee.id).toBe(144);
  expect(signedOut).toBeNull();
});
test('reconnection keeps saved employee attendance access without a new login', async () => {
  await saveLogin(result(true), server);
  await restoreOffline(server);
  NetInfo.fetch.mockResolvedValue({isConnected: true});
  await expect(requireAttendanceAccess(server, 'IT201')).resolves.toBe('offline');
  await saveLogin(result(true), server);
  await expect(requireAttendanceAccess(server, 'IT201')).resolves.toBe('online');
});
test('unknown connectivity does not enable offline login', async () => {
  await saveLogin(result(true), server);
  NetInfo.fetch.mockResolvedValue({isConnected: null});
  expect(await restoreOffline(server)).toBeNull();
});
test('restoration in flight cannot undo logout', async () => {
  await saveLogin(result(true), server);
  let finish;
  Storage.getItem.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  const value = saved;
  const restoring = restoreOffline(server);
  await Promise.resolve();
  await logoutAttendance();
  finish(value);
  expect(await restoring).toBeNull();
  expect(getSession()).toBeNull();
});

 test('repeated offline-enabled login preserves the first info without writing authorization again', async () => {
  await saveLogin(result(true), server);
  const original = saved;
  await logoutAttendance();
  Storage.setItem.mockClear();
  const updated = result(true);
  updated.employee_name.name = 'Changed name';
  await saveLogin(updated, server);
  expect(saved).toBe(original);
  expect(getSession().employee.name).toBe('Employee');
  expect(Storage.setItem).not.toHaveBeenCalled();
});
test('deleting cached info allows the next online login to save new info', async () => {
  await saveLogin(result(true), server);
  saved = null;
  const updated = result(true);
  updated.employee_name.name = 'Changed name';
  await saveLogin(updated, server);
  expect(getSession().employee.name).toBe('Changed name');
  expect(JSON.parse(saved).employee.name).toBe('Changed name');
});
test('another employee cannot overwrite or restore the first cached employee', async () => {
  await saveLogin(result(true), server);
  const original = saved;
  const other = result(true);
  other.employee_name.id = 200;
  other.employee_name.emp_code = 'OTHER';
  other.employee_name.emp_punch_code = '200';
  await saveLogin(other, server);
  expect(getSession().employee.id).toBe(200);
  expect(saved).toBe(original);
  await logoutAttendance();
  expect(await restoreOffline(server, 'OTHER')).toBeNull();
});
