import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import RNFS from 'react-native-fs';
import urls from '../../url';
import {getSession, isDisconnected} from './session';
import {pendingAttendance, transitionAttendance, saveSyncError} from './queue';
import {getAttendanceAddress} from './address';
import {setEmployeePunchTime, removeEmployeePunchTime} from '../utils/attendanceStorage';

export function toOdooUtc(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) { throw new Error('Saved attendance time is invalid.'); }
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

let requestSequence = 0;
const SYNC_BATCH_SIZE = 10;

// V3 JSON-RPC contract. Values come from the saved event, never sample data.
export async function buildSyncRequest(records, account) {
  const events = [];
  for (const record of records) {
    const picture = await RNFS.readFile(record.selfie_path, 'base64');
    if (!picture) { throw new Error('Saved attendance selfie is empty.'); }
    events.push({
      local_event_id: record.attendance_id,
      device_id: account.employee.emp_code,
      emp_address: await getAttendanceAddress(record, account),
      gps_accuracy: 0,
      latitude: record.latitude,
      longitude: record.longitude,
      picture,
      punch_time: toOdooUtc(record.recorded_at),
    });
  }
  return {jsonrpc: '2.0', method: 'call', params: {events}, id: ++requestSequence};
}

export function describeSyncFailure(error, stage) {
  const detail = typeof error?.message === 'string' ? error.message.slice(0, 250) : 'Unknown error';
  if (stage === 'local-save') { return `Server acknowledged attendance; local save failed: ${detail}`; }
  if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT') {
    return `Sync request timed out after 30 seconds (${error.code}). Server save status is unknown.`;
  }
  if (error?.response?.status) { return `Sync API returned HTTP ${error.response.status}: ${detail}`; }
  return `${stage === 'upload' ? 'Sync request failed' : 'Sync response handling failed'}${error?.code ? ` (${error.code})` : ''}: ${detail}`;
}

// Support the deployed v3 contract as well as the original controller contract.
export function syncResultId(item) {
  return item?.attendance_id ?? item?.local_event_id;
}
export function syncResultConfirmed(item) {
  if (item?.success === false || item?.error || item?.status === 'rejected') { return false; }
  return item?.success === true || (item?.status === 'synced' && Boolean(item.server_record_id));
}

let worker = null;
export function syncPendingAttendance() {
  if (getSession()?.employee?.offline_attendance === true) { return require('./autoSync').autoSync(); }
  if (worker) { return worker; }
  const account = getSession();
  worker = sync(account).finally(() => { worker = null; });
  return worker;
}

async function sync(account) {
  if (!account?.employee?.id || account.mode !== 'online') {
    return {synced: 0, reason: 'Please log in online to sync attendance.'};
  }
  const records = await pendingAttendance(account);
  // No unsynced SQLite records means there is nothing to send.
  if (!records.length) { return {synced: 0, reason: null}; }
  let synced = 0;
  // Keep each request bounded while sending multiple events in server order.
  for (let offset = 0; offset < records.length; offset += SYNC_BATCH_SIZE) {
    const result = await syncOne(account, records.slice(offset, offset + SYNC_BATCH_SIZE));
    synced += result.synced;
    if (result.reason) { return {synced, reason: result.reason}; }
  }
  return {synced, reason: null};
}

async function syncOne(account, allRecords) {
  let synced = 0;
  let reason = null;
  if (!account?.employee?.id || account.mode !== 'online') {
    return {synced, reason: 'Please log in online to sync attendance.'};
  }
  if (!allRecords.length) { return {synced, reason: null}; }
  const blockedAt = allRecords.findIndex(record => record.status !== 'pending');
  const records = blockedAt < 0 ? allRecords : allRecords.slice(0, blockedAt);
  if (!records.length) {
    return {synced, reason: allRecords[0].last_error || 'An earlier upload needs backend verification.'};
  }
  for (const record of records) {
    if (getSession() !== account || account.mode !== 'online') {
      return {synced, reason: 'Session changed. Log in again to continue syncing.'};
    }
    if (isDisconnected(await NetInfo.fetch())) {
      return {synced, reason: 'Offline records are saved. Log in when internet is available.'};
    }
    if (!await RNFS.exists(record.selfie_path)) {
      return {synced, reason: 'A saved selfie is missing. Contact your administrator.'};
    }
  }

  const requestBody = await buildSyncRequest(records, account);

  if (getSession() !== account) { return {synced, reason: 'Session changed. Please log in again.'}; }

  const claimed = [];
  try {
    for (const record of records) {
      if (!await transitionAttendance(account, record.attendance_id, 'pending', 'uploading')) {
        throw new Error('Attendance state changed. Please log in again.');
      }
      claimed.push(record);
    }
  } catch (error) {
    // No request was sent: release rows already claimed by this batch.
    for (const record of claimed) {
      await transitionAttendance(account, record.attendance_id, 'uploading', 'pending');
    }
    return {synced, reason: error.message};
  }

  const acknowledged = new Set();
  let stage = 'upload';
  try {
    if (getSession() !== account) {
      await Promise.all(records.map(async record =>
        transitionAttendance(account, record.attendance_id, 'uploading', 'pending'),
      ));
      return {synced, reason: 'Session changed. Please log in again.'};
    }

    const response = await axios.post(account.server + urls.offlineAttendance, requestBody, {
      withCredentials: true, timeout: 30000,
      headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
    });

    stage = 'response';
    const payload = response.data?.result ?? response.data;
    const results = Array.isArray(payload?.results) ? payload.results : [];
    const rpcError = response.data?.error;
    const serverError = typeof payload?.error === 'string' ? payload.error.slice(0, 500) :
      (typeof rpcError?.data?.message === 'string' ? rpcError.data.message.slice(0, 500) :
        (typeof rpcError?.message === 'string' ? rpcError.message.slice(0, 500) : null));
    const byId = new Map(results.filter(item => syncResultId(item)).map(item => [syncResultId(item), item]));

    for (const record of records) {
      stage = 'response';
      const item = byId.get(record.attendance_id);

      if (!item) {
        const msg = serverError || 'Sync response was incomplete. Attendance needs verification.';
        await saveSyncError(account, record.attendance_id, msg);
        await transitionAttendance(account, record.attendance_id, 'uploading', 'review_required');
        reason = reason || msg;
        continue;
      }

      if (syncResultConfirmed(item)) {
        stage = 'local-save';
        if (record.action === 'CHECK_IN') {
          await setEmployeePunchTime(account.employee.emp_code, record.recorded_at);
        } else {
          await removeEmployeePunchTime(account.employee.emp_code);
        }
        await saveSyncError(account, record.attendance_id, null);
        if (!await transitionAttendance(account, record.attendance_id, 'uploading', 'synced')) {
          throw new Error('Unable to persist attendance acknowledgment');
        }
        acknowledged.add(record.attendance_id);
        synced += 1;
        continue;
      }

      const msg = typeof item.message === 'string' && item.message
        ? item.message.slice(0, 500)
        : 'Server rejected this attendance record.';
      await saveSyncError(account, record.attendance_id, msg);
      await transitionAttendance(account, record.attendance_id, 'uploading', 'review_required');
      reason = reason || msg;
    }

    return {synced, reason: reason || (blockedAt >= 0 ? allRecords[blockedAt].last_error || 'An earlier upload needs backend verification.' : null)};
  } catch (error) {
    const fallbackReason = describeSyncFailure(error, stage);
    console.warn('[Attendance sync] failed', {
      stage, code: error?.code || null, httpStatus: error?.response?.status || null,
      attendanceIds: records.map(record => record.attendance_id), message: fallbackReason,
    });

    for (const record of records) {
      if (acknowledged.has(record.attendance_id)) { continue; }
      await saveSyncError(account, record.attendance_id, fallbackReason);
      await transitionAttendance(account, record.attendance_id, 'uploading', 'review_required');
    }

    return {synced, reason: fallbackReason};
  }
}

// Caller must have confirmed this exact record is absent on the backend.
export async function retryVerifiedAttendance(id) {
  if (worker) { throw new Error('Sync is running. Wait for it to finish.'); }
  const account = getSession();
  if (!account || account.mode !== 'online') { throw new Error('Please log in online first.'); }
  const records = await pendingAttendance(account);
  const first = records[0];
  if (getSession() !== account || first?.attendance_id !== id || first.status !== 'review_required') {
    throw new Error('Attendance state changed. Reopen the attendance screen.');
  }
  if (!await transitionAttendance(account, id, 'review_required', 'pending')) {
    throw new Error('Could not prepare attendance for retry.');
  }
  return syncPendingAttendance();
}
