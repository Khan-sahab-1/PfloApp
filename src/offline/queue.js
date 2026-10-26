import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';
import {getSession, requireAttendanceAccess} from './session';

SQLite.enablePromise(true);
let database;
async function db() {
  if (!database) {
    database = (async () => {
      const connection = await SQLite.openDatabase({name: 'offline-attendance.db', location: 'default'});
      await connection.executeSql(`CREATE TABLE IF NOT EXISTS attendance_events (
        sequence INTEGER PRIMARY KEY AUTOINCREMENT,
        attendance_id TEXT NOT NULL UNIQUE,
        server TEXT NOT NULL, employee_id TEXT NOT NULL,
        action TEXT NOT NULL, recorded_at TEXT NOT NULL,
        latitude REAL NOT NULL, longitude REAL NOT NULL,
        selfie_path TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending'
      )`);
      const [columns] = await connection.executeSql('PRAGMA table_info(attendance_events)');
      const columnNames = new Set(Array.from({length: columns.rows.length}, (_, i) => columns.rows.item(i).name));
      const hasError = columnNames.has('last_error');
      if (!hasError) { await connection.executeSql('ALTER TABLE attendance_events ADD COLUMN last_error TEXT'); }
      const hasAddress = columnNames.has('emp_address');
      if (!hasAddress) { await connection.executeSql('ALTER TABLE attendance_events ADD COLUMN emp_address TEXT'); }
      return connection;
    })().catch(error => { database = null; throw error; });
  }
  return database;
}

export async function pendingAttendance(account = getSession()) {
  if (!account?.employee?.id) { return []; }
  const connection = await db();
  const [result] = await connection.executeSql(
    'SELECT * FROM attendance_events WHERE server = ? AND employee_id = ? AND status != ? ORDER BY sequence',
    [account.server, String(account.employee.id), 'synced'],
  );
  return Array.from({length: result.rows.length}, (_, index) => result.rows.item(index));
}

let saving = false;
export async function saveOfflineAttendance({server, employeeCode, action, latitude, longitude, picture}) {
  if (saving) { throw new Error('Attendance is already being saved.'); }
  saving = true;
  let path;
  try {
    if (await requireAttendanceAccess(server, employeeCode) !== 'offline') {
      throw new Error('Connect and log in again to mark online attendance.');
    }
    const account = getSession();
    if (!['CHECK_IN', 'CHECK_OUT'].includes(action) || !picture?.uri ||
        !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      throw new Error('A selfie, location and attendance action are required.');
    }
    const existing = await pendingAttendance(account);
    if (existing.length && existing[existing.length - 1].action === action) {
      throw new Error('This attendance action is already pending. Return to the dashboard.');
    }
    const connection = await db();
    const [idResult] = await connection.executeSql('SELECT lower(hex(randomblob(16))) AS id');
    const id = idResult.rows.item(0).id;
    const directory = `${RNFS.DocumentDirectoryPath}/pending-attendance`;
    await RNFS.mkdir(directory);
    path = `${directory}/${id}.jpg`;
    await RNFS.copyFile(picture.uri.replace(/^file:\/\//, ''), path);
    const recordedAt = new Date().toISOString();
    if (getSession() !== account) { throw new Error('Session changed. Please try again.'); }
    await connection.executeSql(
      `INSERT INTO attendance_events
       (attendance_id, server, employee_id, action, recorded_at, latitude, longitude, selfie_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, account.server, String(account.employee.id), action, recordedAt, latitude, longitude, path],
    );
    Promise.resolve().then(() => require('./autoSync').autoSync()).catch(error => console.warn('[Attendance auto sync]', error.message));
    // Scheduling failure must not discard the committed attendance or selfie.
    Promise.resolve().then(() => require('./backgroundSync').enableBackgroundSync()).catch(error => console.warn('[Attendance scheduler]', error.message));
    return {attendance_id: id, recorded_at: recordedAt};
  } catch (error) {
    if (path) { await RNFS.unlink(path).catch(() => {}); }
    throw error;
  } finally { saving = false; }
}

// Compare-and-set prevents two workers from sending the same event.
export async function transitionAttendance(account, id, from, to) {
  const connection = await db();
  const [result] = await connection.executeSql(
    'UPDATE attendance_events SET status = ? WHERE attendance_id = ? AND server = ? AND employee_id = ? AND status = ?',
    [to, id, account.server, String(account.employee.id), from],
  );
  return result.rowsAffected === 1;
}

export async function saveSyncError(account, id, message) {
  const connection = await db();
  await connection.executeSql(
    'UPDATE attendance_events SET last_error = ? WHERE attendance_id = ? AND server = ? AND employee_id = ?',
    [message, id, account.server, String(account.employee.id)],
  );
}

export async function saveAttendanceAddress(account, id, address) {
  const connection = await db();
  const [result] = await connection.executeSql(
    'UPDATE attendance_events SET emp_address = ? WHERE attendance_id = ? AND server = ? AND employee_id = ?',
    [address, id, account.server, String(account.employee.id)],
  );
  if (result.rowsAffected !== 1) { throw new Error('Could not save attendance address.'); }
}
