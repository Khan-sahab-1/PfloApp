jest.mock('axios', () => ({post: jest.fn()}));
jest.mock('../src/offline/address', () => ({getAttendanceAddress: jest.fn()}));
jest.mock('@react-native-community/netinfo', () => ({fetch: jest.fn()}));
jest.mock('react-native-fs', () => ({exists: jest.fn(), readFile: jest.fn()}));
jest.mock('../src/offline/session', () => ({getSession: jest.fn(), isDisconnected: s => s.isConnected === false}));
jest.mock('../src/offline/queue', () => ({pendingAttendance: jest.fn(), transitionAttendance: jest.fn(), saveSyncError: jest.fn()}));
jest.mock('../src/utils/attendanceStorage', () => ({setEmployeePunchTime: jest.fn(), removeEmployeePunchTime: jest.fn()}));
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import {getAttendanceAddress} from '../src/offline/address';
import {getSession} from '../src/offline/session';
import {pendingAttendance, transitionAttendance} from '../src/offline/queue';
import {syncPendingAttendance, retryVerifiedAttendance, toOdooUtc, buildSyncRequest, describeSyncFailure} from '../src/offline/sync';
const account = {server: 'https://example.com', mode: 'online', employee: {id: 144, emp_code: 'IT201'}};
const record = {attendance_id: 'one', status: 'pending', selfie_path: '/private/one.jpg', recorded_at: '2026-09-10T09:00:00.000Z', action: 'CHECK_IN', latitude: 28, longitude: 77};
beforeEach(() => {
  jest.clearAllMocks();
  getAttendanceAddress.mockResolvedValue('Dehradun, Uttarakhand, India');
  getSession.mockReturnValue(account);
  pendingAttendance.mockResolvedValue([record]);
  transitionAttendance.mockResolvedValue(true);
  NetInfo.fetch.mockResolvedValue({isConnected: true});
  RNFS.exists.mockResolvedValue(true);
  RNFS.readFile.mockResolvedValue('aGVsbG8=');
  axios.post.mockResolvedValue({data: {success: true, results: [{local_event_id: 'one', status: 'synced', server_record_id: 1, duplicate: false}]}});
});
test('uploads original timestamp and only acknowledges the matching account after confirmation', async () => {
  expect(await syncPendingAttendance()).toEqual({synced: 1, reason: null});
  expect(pendingAttendance).toHaveBeenCalledWith(account);
  expect(axios.post.mock.calls[0][0]).toBe('https://example.com/attendance/offline/sync/v4');
  expect(axios.post.mock.calls[0][1].params).toMatchObject({
    events: [
      {
        local_event_id: 'one',
        punch_time: '2026-09-10 09:00:00',
        latitude: 28,
        longitude: 77,
        picture: 'aGVsbG8=',
        emp_address: 'Dehradun, Uttarakhand, India',
        device_id: 'IT201',
        gps_accuracy: 0,
      },
    ],
  });
  expect(transitionAttendance).toHaveBeenLastCalledWith(account, 'one', 'uploading', 'synced');
});
test('empty SQLite queue skips network checks and sync API', async () => {
  pendingAttendance.mockResolvedValue([]);
  expect(await syncPendingAttendance()).toEqual({synced: 0, reason: null});
  expect(axios.post).not.toHaveBeenCalled();
  expect(NetInfo.fetch).not.toHaveBeenCalled();
  expect(RNFS.readFile).not.toHaveBeenCalled();
  expect(transitionAttendance).not.toHaveBeenCalled();
});
test('backend rejection keeps the record for review', async () => {
  axios.post.mockResolvedValue({data: {success: false, results: [{local_event_id: 'one', status: 'rejected', message: 'Validation failed'}]}});
  expect((await syncPendingAttendance()).synced).toBe(0);
  expect(transitionAttendance).toHaveBeenLastCalledWith(account, 'one', 'uploading', 'review_required');
});
test('timeout is retained for review, never automatically replayed', async () => {
  axios.post.mockRejectedValueOnce(new Error('timeout'));
  await syncPendingAttendance();
  pendingAttendance.mockResolvedValue([{...record, status: 'review_required'}]);
  await syncPendingAttendance();
  expect(axios.post).toHaveBeenCalledTimes(1);
});
test('abandoned uploading after restart blocks later records', async () => {
  pendingAttendance.mockResolvedValue([{...record, status: 'uploading'}, {...record, attendance_id: 'two'}]);
  await syncPendingAttendance();
  expect(axios.post).not.toHaveBeenCalled();
});
test('offline session cannot upload', async () => {
  getSession.mockReturnValue({...account, mode: 'offline'});
  await syncPendingAttendance();
  expect(axios.post).not.toHaveBeenCalled();
});
test('only one worker sends a pending record', async () => {
  await Promise.all([syncPendingAttendance(), syncPendingAttendance()]);
  expect(axios.post).toHaveBeenCalledTimes(1);
});
test('failed first record prevents later punches uploading', async () => {
  pendingAttendance.mockResolvedValue([record, {...record, attendance_id: 'two', action: 'CHECK_OUT'}]);
  axios.post.mockRejectedValueOnce(new Error('network'));
  await syncPendingAttendance();
  expect(axios.post).toHaveBeenCalledTimes(1);
});
test('account switching before upload prevents sending with another session', async () => {
  RNFS.exists.mockImplementationOnce(async () => {getSession.mockReturnValue({...account, employee: {id: 999}}); return true;});
  await syncPendingAttendance();
  expect(axios.post).not.toHaveBeenCalled();
});

test('verified retry resets only the first matching review record', async () => {
  pendingAttendance.mockResolvedValueOnce([{...record, status: 'review_required'}]);
  expect((await retryVerifiedAttendance('one')).synced).toBe(1);
  expect(transitionAttendance).toHaveBeenCalledWith(account, 'one', 'review_required', 'pending');
});
test('retry cannot reset an unrelated attendance id', async () => {
  pendingAttendance.mockResolvedValueOnce([{...record, status: 'review_required'}]);
  await expect(retryVerifiedAttendance('other')).rejects.toThrow('state changed');
  expect(transitionAttendance).not.toHaveBeenCalled();
  expect(axios.post).not.toHaveBeenCalled();
});

test('accepts the actual Odoo JSON-RPC response envelope', async () => {
  axios.post.mockResolvedValue({data: {jsonrpc: '2.0', result: {results: [{local_event_id: 'one', status: 'synced', server_record_id: 9}]}}});
  expect((await syncPendingAttendance()).synced).toBe(1);
  expect(axios.post.mock.calls[0][1]).toMatchObject({jsonrpc: '2.0', method: 'call', params: {events: expect.any(Array)}});
});
test('syncs pending records preceding a review record', async () => {
  pendingAttendance.mockResolvedValue([record, {...record, attendance_id: 'two', status: 'review_required'}]);
  const result = await syncPendingAttendance();
  expect(result.synced).toBe(1);
  expect(result.reason).toBeTruthy();
  expect(axios.post.mock.calls[0][1].params.events).toHaveLength(1);
});
test('preserves the backend error from a JSON-RPC response', async () => {
  axios.post.mockResolvedValue({data: {result: {error: 'A non-empty events list is required', results: []}}});
  expect((await syncPendingAttendance()).reason).toBe('A non-empty events list is required');
});

test('shows the backend exception message rather than generic Server Error', async () => {
  axios.post.mockResolvedValue({data: {jsonrpc: '2.0', error: {message: 'Server Error', data: {message: 'Invalid punch_time format'}}}});
  expect((await syncPendingAttendance()).reason).toBe('Invalid punch_time format');
});

test('converts stored ISO time to UTC Odoo time without changing the instant', () => {
  expect(toOdooUtc('2026-09-11T12:32:55.876+05:30')).toBe('2026-09-11 07:02:55');
  expect(() => toOdooUtc('invalid')).toThrow('invalid');
});

test('large queues send bounded batches and retain order', async () => {
  const records = Array.from({length: 20}, (_, i) => ({...record, attendance_id: `id-${i}`}));
  pendingAttendance.mockResolvedValue(records);
  axios.post.mockImplementation(async (_, body) => ({data: {result: {results: body.params.events.map(event => ({local_event_id: event.local_event_id, status: 'synced', server_record_id: 10}))}}}));
  expect((await syncPendingAttendance()).synced).toBe(20);
  expect(axios.post.mock.calls.map(call => call[1].params.events.length)).toEqual([10, 10]);
  expect(axios.post.mock.calls.flatMap(call => call[1].params.events.map(event => event.local_event_id))).toEqual(records.map(r => r.attendance_id));
});

test('matches the supplied v3 request using saved coordinates, time and actual image data', async () => {
  const saved = {...record, attendance_id: '2787715ffbb334b1eac8e364969dd8cd', latitude: 30.05358, longitude: 78.2200133, recorded_at: '2026-09-11T07:02:55.037Z'};
  expect(await buildSyncRequest([saved], account)).toEqual({
    jsonrpc: '2.0', method: 'call', id: expect.any(Number), params: {events: [{
      local_event_id: saved.attendance_id, device_id: 'IT201',
      emp_address: 'Dehradun, Uttarakhand, India', gps_accuracy: 0,
      latitude: 30.05358, longitude: 78.2200133, picture: 'aGVsbG8=',
      punch_time: '2026-09-11 07:02:55',
    }]},
  });
});
test('empty selfie fails before the queue is marked uploading', async () => {
  RNFS.readFile.mockResolvedValueOnce('');
  await expect(syncPendingAttendance()).rejects.toThrow('selfie is empty');
  expect(transitionAttendance).not.toHaveBeenCalled();
  expect(axios.post).not.toHaveBeenCalled();
});

test('distinguishes timeout from acknowledged attendance local-save failure', () => {
  expect(describeSyncFailure({code: 'ECONNABORTED', message: 'timeout'}, 'upload')).toContain('timed out after 30 seconds');
  expect(describeSyncFailure(new Error('disk full'), 'local-save')).toBe('Server acknowledged attendance; local save failed: disk full');
  expect(describeSyncFailure({response: {status: 500}, message: 'Request failed'}, 'upload')).toContain('HTTP 500');
});
test('returns the actual upload exception instead of a generic verification message', async () => {
  axios.post.mockRejectedValueOnce(Object.assign(new Error('Network Error'), {code: 'ERR_NETWORK'}));
  expect((await syncPendingAttendance()).reason).toBe('Sync request failed (ERR_NETWORK): Network Error');
});

test('two saved punches share one JSON-RPC batch and acknowledgments map by ID', async () => {
  pendingAttendance.mockResolvedValue([record, {...record, attendance_id: 'two', action: 'CHECK_OUT'}]);
  axios.post.mockResolvedValue({data: {jsonrpc: '2.0', result: {results: [
    {local_event_id: 'two', status: 'synced', server_record_id: 22},
    {local_event_id: 'one', status: 'synced', server_record_id: 21},
  ]}}});
  expect((await syncPendingAttendance()).synced).toBe(2);
  expect(axios.post).toHaveBeenCalledTimes(1);
  expect(axios.post.mock.calls[0][1]).toMatchObject({id: expect.any(Number), params: {events: [expect.objectContaining({local_event_id: 'one'}), expect.objectContaining({local_event_id: 'two'})]}});
});

test('accepts deployed v3 attendance_id/success response without server_record_id', async () => {
  axios.post.mockResolvedValue({data: {jsonrpc: '2.0', result: {success: true, results: [{attendance_id: 'one', success: true, message: 'Attendance synced successfully'}]}}});
  expect(await syncPendingAttendance()).toEqual({synced: 1, reason: null});
  expect(transitionAttendance).toHaveBeenCalledWith(account, 'one', 'uploading', 'synced');
});
test('shows actual deployed rejection instead of incomplete-response error', async () => {
  const message = "argument should be a bytes-like object or ASCII string, not 'NoneType'";
  axios.post.mockResolvedValue({data: {jsonrpc: '2.0', result: {success: false, results: [{attendance_id: 'one', success: false, message}]}}});
  expect(await syncPendingAttendance()).toEqual({synced: 0, reason: message});
});
test('reports incomplete sync responses clearly when the matching attendance result is missing', async () => {
  axios.post.mockResolvedValue({data: {jsonrpc: '2.0', result: {results: []}}});
  expect(await syncPendingAttendance()).toEqual({synced: 0, reason: 'Sync response was incomplete. Attendance needs verification.'});
});
test('top-level success cannot acknowledge a different event', async () => {
  axios.post.mockResolvedValue({data: {result: {success: true, results: [{attendance_id: 'other', success: true}]}}});
  expect((await syncPendingAttendance()).synced).toBe(0);
});
test('explicit failure overrides contradictory success status', async () => {
  axios.post.mockResolvedValue({data: {result: {results: [{attendance_id: 'one', success: false, status: 'synced', server_record_id: 10, message: 'Rejected'}]}}});
  expect((await syncPendingAttendance()).synced).toBe(0);
});
