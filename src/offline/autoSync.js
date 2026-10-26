import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import {setEmployeePunchTime, removeEmployeePunchTime} from '../utils/attendanceStorage';
import {getSavedAccount} from './session';
import {pendingAttendance, transitionAttendance, saveSyncError} from './queue';
import {getAttendanceAddress} from './address';

export const PUBLIC_SYNC_PATH = '/attendance/offline/sync/v4';
const listeners = new Set();
export const subscribeAutoSync = listener => { listeners.add(listener); return () => listeners.delete(listener); };
let running;
export function autoSync(options = {}) {
  if (running) { return running; }
  running = run(options).finally(() => { running = null; listeners.forEach(listener => listener()); });
  return running;
}
async function run({signal, maxRecords = Infinity} = {}) {
  const account = await getSavedAccount();
  if (!account) { return {synced: 0, reason: null}; }
  const records = (await pendingAttendance(account)).slice(0, maxRecords);
  // Check SQLite before doing any network or upload work.
  if (!records.length) { return {synced: 0, reason: null}; }
  const active = async () => {
    const saved = await getSavedAccount();
    return !signal?.aborted && saved && saved.authorization_id === account.authorization_id &&
      saved.server === account.server && saved.employee.id === account.employee.id;
  };
  let synced = 0;
  for (const row of records) {
    if (!await active()) { break; }
    const network = await NetInfo.fetch();
    if (network.isConnected !== true || network.isInternetReachable === false) { break; }
    // V4 deduplicates the stable event ID in a DB transaction, including retries.
    if (!['pending', 'review_required', 'uploading', 'retry'].includes(row.status)) { break; }
    if (!await RNFS.exists(row.selfie_path)) { return {synced, reason: 'Saved selfie is missing.'}; }
    const picture = await RNFS.readFile(row.selfie_path, 'base64');
    const date = new Date(row.recorded_at);
    if (!picture || !Number.isFinite(date.getTime())) { return {synced, reason: 'Invalid saved attendance data.'}; }
    let address;
    try { address = await getAttendanceAddress(row, account, {signal}); }
    catch (error) {
      await saveSyncError(account, row.attendance_id, error.message);
      return {synced, reason: error.message};
    }
    if (!await active()) { break; }
    if (!await transitionAttendance(account, row.attendance_id, row.status, 'uploading')) { break; }
    try {
      if (!await active()) {
        await transitionAttendance(account, row.attendance_id, 'uploading', 'pending');
        break;
      }
      const response = await axios.post(account.server + PUBLIC_SYNC_PATH, {
        jsonrpc: '2.0', method: 'call', id: Date.now(),
        params: {employee_id: account.employee.id, employee_code: account.employee.emp_code, events: [{
          local_event_id: row.attendance_id, device_id: account.employee.emp_code,
          emp_address: address, gps_accuracy: 0,
          latitude: row.latitude, longitude: row.longitude, picture,
          punch_time: date.toISOString().slice(0, 19).replace('T', ' '),
        }]},
      }, {headers: {'Content-Type': 'application/json'}, withCredentials: false, timeout: 20000, signal});
      const result = response.data?.result;
      const item = result?.results?.find(event => event.attendance_id === row.attendance_id);
      if (item?.success !== true || !item.server_record_id) {
        const message = item?.message || result?.error || response.data?.error?.message || 'Sync acknowledgment missing.';
        await saveSyncError(account, row.attendance_id, String(message).slice(0, 500));
        await transitionAttendance(account, row.attendance_id, 'uploading', item?.retryable === false ? 'rejected' : 'retry');
        return {synced, reason: String(message)};
      }
      if (row.action === 'CHECK_IN') { await setEmployeePunchTime(account.employee.emp_code, row.recorded_at); }
      else { await removeEmployeePunchTime(account.employee.emp_code); }
      await saveSyncError(account, row.attendance_id, null);
      if (!await transitionAttendance(account, row.attendance_id, 'uploading', 'synced')) {
        throw new Error('Could not save acknowledgment');
      }
      synced++;
    } catch (error) {
      const reason = error.response?.status ? `Sync HTTP ${error.response.status}` : (error.code || error.message || 'Sync interrupted');
      await saveSyncError(account, row.attendance_id, String(reason).slice(0, 500));
      await transitionAttendance(account, row.attendance_id, 'uploading', 'retry');
      return {synced, reason: String(reason)};
    }
  }
  return {synced, reason: null};
}
