jest.mock('axios', () => ({post: jest.fn()}));
jest.mock('../src/offline/address', () => ({getAttendanceAddress: jest.fn()}));
jest.mock('@react-native-community/netinfo', () => ({fetch: jest.fn()}));
jest.mock('react-native-fs', () => ({exists: jest.fn(), readFile: jest.fn()}));
jest.mock('../src/offline/session', () => ({getSavedAccount: jest.fn()}));
jest.mock('../src/offline/queue', () => ({pendingAttendance: jest.fn(), transitionAttendance: jest.fn(), saveSyncError: jest.fn()}));
jest.mock('../src/utils/attendanceStorage', () => ({setEmployeePunchTime: jest.fn(), removeEmployeePunchTime: jest.fn()}));
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import {getSavedAccount} from '../src/offline/session';
import {pendingAttendance, transitionAttendance} from '../src/offline/queue';
import {autoSync} from '../src/offline/autoSync';
import {getAttendanceAddress} from '../src/offline/address';
const account = {server: 'https://example.com', authorization_id: 'login-one', employee: {id: 144, emp_code: 'IT201', offline_attendance: true}};
const row = {attendance_id: 'one', status: 'pending', selfie_path: '/photo.jpg', action: 'CHECK_IN', recorded_at: '2026-09-11T07:02:55.037Z', latitude: 30, longitude: 78};
beforeEach(() => {
  jest.clearAllMocks();
  getAttendanceAddress.mockResolvedValue('Dehradun, Uttarakhand, India');
  getSavedAccount.mockResolvedValue(account);
  pendingAttendance.mockResolvedValue([row]);
  transitionAttendance.mockResolvedValue(true);
  NetInfo.fetch.mockResolvedValue({isConnected: true});
  RNFS.exists.mockResolvedValue(true); RNFS.readFile.mockResolvedValue('photo');
  axios.post.mockResolvedValue({data: {result: {results: [{attendance_id: 'one', success: true, server_record_id: 12}]}}});
});
test('headless sync uses saved employee without session/token', async () => {
  expect((await autoSync()).synced).toBe(1);
  expect(axios.post.mock.calls[0][0]).toBe(account.server+'/attendance/offline/sync/v4');
  expect(axios.post.mock.calls[0][1].params).toMatchObject({employee_id: 144, employee_code: 'IT201'});
  expect(axios.post.mock.calls[0][2].withCredentials).toBe(false);
  expect(axios.post.mock.calls[0][1].params.events[0].emp_address).toBe('Dehradun, Uttarakhand, India');
});
test('address lookup failure keeps the event unclaimed and skips upload', async () => {
  getAttendanceAddress.mockRejectedValueOnce(new Error('Address lookup failed'));
  expect(await autoSync()).toEqual({synced: 0, reason: 'Address lookup failed'});
  expect(axios.post).not.toHaveBeenCalled();
  expect(transitionAttendance).not.toHaveBeenCalled();
});
test('logout prevents upload', async () => {
  getSavedAccount.mockResolvedValue(null); await autoSync(); expect(axios.post).not.toHaveBeenCalled();
});
test('empty SQLite queue skips network checks and sync API on repeated triggers', async () => {
  pendingAttendance.mockResolvedValue([]);
  for (let trigger = 0; trigger < 3; trigger++) {
    expect(await autoSync()).toEqual({synced: 0, reason: null});
  }
  expect(axios.post).not.toHaveBeenCalled();
  expect(NetInfo.fetch).not.toHaveBeenCalled();
  expect(RNFS.readFile).not.toHaveBeenCalled();
  expect(transitionAttendance).not.toHaveBeenCalled();
  expect(getAttendanceAddress).not.toHaveBeenCalled();
});
test('account change while reading photo prevents upload', async () => {
  RNFS.readFile.mockImplementationOnce(async () => {getSavedAccount.mockResolvedValue({...account, authorization_id: 'new-login'});return 'photo';});
  await autoSync();expect(axios.post).not.toHaveBeenCalled();
});
test('v4 retries uncertain events using the same event id', async () => {
  pendingAttendance.mockResolvedValue([{...row, status: 'review_required'}]);
  await autoSync();expect(axios.post.mock.calls[0][1].params.events[0].local_event_id).toBe('one');
});
test('timeout remains durable for a later wake-up', async () => {
  axios.post.mockRejectedValueOnce(new Error('timeout')); await autoSync();
  expect(transitionAttendance).toHaveBeenLastCalledWith(account, 'one', 'uploading', 'retry');
});
test('background execution respects the record limit', async () => {
  pendingAttendance.mockResolvedValue([row,{...row,attendance_id:'two'}]);await autoSync({maxRecords:1});expect(axios.post).toHaveBeenCalledTimes(1);
});
test('only a matching acknowledgment can mark synced', async () => {
  axios.post.mockResolvedValue({data:{result:{results:[{attendance_id:'other',success:true,server_record_id:1}]}}});
  expect((await autoSync()).synced).toBe(0);
});
