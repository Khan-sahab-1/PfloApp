jest.mock('../src/offline/autoSync', () => ({autoSync: jest.fn().mockResolvedValue({synced: 0})}));
jest.mock('../src/offline/backgroundSync', () => ({enableBackgroundSync: jest.fn().mockResolvedValue()}));
jest.mock('react-native-sqlite-storage', () => ({enablePromise: jest.fn(), openDatabase: jest.fn()}));
jest.mock('react-native-fs', () => ({DocumentDirectoryPath: '/private', mkdir: jest.fn(), copyFile: jest.fn(), unlink: jest.fn().mockResolvedValue()}));
jest.mock('../src/offline/session', () => ({getSession: jest.fn(), requireAttendanceAccess: jest.fn()}));
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';
import {getSession, requireAttendanceAccess} from '../src/offline/session';
import {saveOfflineAttendance, pendingAttendance} from '../src/offline/queue';
const account = {server: 'https://example.com', employee: {id: 144}};
const executeSql = jest.fn();
const input = {server: account.server, employeeCode: 'IT201', action: 'CHECK_IN', latitude: 28, longitude: 77, picture: {uri: 'file:///selfie.jpg'}};
beforeEach(() => {
  jest.clearAllMocks();
  getSession.mockReturnValue(account);
  requireAttendanceAccess.mockResolvedValue('offline');
  SQLite.openDatabase.mockResolvedValue({executeSql});
  executeSql.mockImplementation(async sql => [{rows: {length: 0, item: () => ({id: 'stable-id'})}}]);
});
test('copies selfie before inserting a pending, account-scoped record', async () => {
  await saveOfflineAttendance(input);
  expect(RNFS.copyFile).toHaveBeenCalledWith('/selfie.jpg', '/private/pending-attendance/stable-id.jpg');
  const insert = executeSql.mock.calls.find(([sql]) => sql.includes('INSERT INTO'));
  expect(insert[1].slice(0, 4)).toEqual(['stable-id', account.server, '144', 'CHECK_IN']);
  expect(RNFS.copyFile.mock.invocationCallOrder[0]).toBeLessThan(executeSql.mock.invocationCallOrder[executeSql.mock.calls.indexOf(insert)]);
});
test('never inserts when permission check fails', async () => {
  requireAttendanceAccess.mockRejectedValue(new Error('not enabled'));
  await expect(saveOfflineAttendance(input)).rejects.toThrow('not enabled');
  expect(RNFS.copyFile).not.toHaveBeenCalled();
  expect(executeSql).not.toHaveBeenCalled();
});
test('copy failure does not create an attendance record', async () => {
  RNFS.copyFile.mockRejectedValueOnce(new Error('storage full'));
  await expect(saveOfflineAttendance(input)).rejects.toThrow('storage full');
  expect(executeSql.mock.calls.some(([sql]) => sql.includes('INSERT INTO'))).toBe(false);
});
test('pending queries isolate employees and servers', async () => {
  await pendingAttendance(account);
  expect(executeSql).toHaveBeenCalledWith(expect.stringContaining('WHERE server = ? AND employee_id = ?'), [account.server, '144', 'synced']);
});

test('committed attendance triggers immediate sync without waiting for a network change', async () => {
  await saveOfflineAttendance(input);
  await Promise.resolve();
  expect(require('../src/offline/autoSync').autoSync).toHaveBeenCalledTimes(1);
});
test('failed insert never triggers an upload', async () => {
  executeSql.mockImplementationOnce(async () => [{rows: {length: 0}}]);
  executeSql.mockImplementationOnce(async () => [{rows: {item: () => ({id: 'stable-id'})}}]);
  executeSql.mockRejectedValueOnce(new Error('disk full'));
  await expect(saveOfflineAttendance(input)).rejects.toThrow('disk full');
  expect(require('../src/offline/autoSync').autoSync).not.toHaveBeenCalled();
});
