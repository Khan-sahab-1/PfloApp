import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const KEY = 'attendance:last-authorized-employee:v1';
const SIGNED_OUT_KEY = 'attendance:signed-out:v1';
let session = null;
let generation = 0;
const listeners = new Set();
const normalizeCode = value => {
  if (value === null || value === undefined) { return null; }
  const text = String(value).trim();
  return text || null;
};
const normalizeEmployee = employee => {
  if (!employee || typeof employee !== 'object') { return null; }
  return {
    ...employee,
    emp_code: normalizeCode(employee.emp_code ?? employee.employee_code ?? employee.employeeCode ?? employee.employee_code),
    emp_punch_code: normalizeCode(employee.emp_punch_code ?? employee.employee_code ?? employee.employeeCode ?? employee.employee_code),
  };
};
export const subscribeSession = listener => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const notifySession = () => listeners.forEach(listener => listener());
export const normalizeServer = server => String(server).trim().replace(/\/+$/, '');
export const isDisconnected = state => state.isConnected === false || state.isInternetReachable === false;
export const getSession = () => session;
export const requiresOnlineLogin = () => !session || session.mode !== 'online';
export const lockSession = () => { generation += 1; session = null; notifySession(); };

export async function saveLogin(result, server) {
  generation += 1;
  const employee = normalizeEmployee(result.employee_name || result.employee);
  const version = generation;
  session = null;
  let account = {
    authorization_id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    server: normalizeServer(server),
    employee: employee && {
      id: employee.id,
      name: employee.name,
      emp_code: employee.emp_code,
      emp_punch_code: employee.emp_punch_code,
      offline_attendance: employee.offline_attendance === true,
    },
  };
  if (account.employee?.id && account.employee.offline_attendance === true && account.employee.emp_code) {
    const saved = await getSavedAccount();
    if (saved) {
      // The fixed cache belongs to its first authorized employee until it is deleted.
      if (saved.server === account.server && String(saved.employee.id) === String(account.employee.id)) {
        account = saved;
      }
    } else {
      await AsyncStorage.setItem(KEY, JSON.stringify(account));
    }
  } else {
    // Keep the existing online-only flow, including revoked offline permission.
    await AsyncStorage.removeItem(KEY);
  }
  await AsyncStorage.removeItem(SIGNED_OUT_KEY);
  if (version !== generation) { return; }
  session = {...account, mode: 'online'};
  notifySession();
}

export async function getSavedAccount() {
  try {
    const account = JSON.parse(await AsyncStorage.getItem(KEY));
    return account?.employee?.id && account.employee.offline_attendance === true && account.employee.emp_code && account.server ? account : null;
  } catch { return null; }
}

export async function restoreSavedAccess() {
  const version = generation;
  if (await AsyncStorage.getItem(SIGNED_OUT_KEY) === 'true') { return null; }
  const account = await getSavedAccount();
  if (!account || version !== generation) { return null; }
  session = {...account, mode: 'offline'};
  notifySession();
  return session;
}

export async function restoreOffline(server, username = '') {
  const version = generation;
  if (!isDisconnected(await NetInfo.fetch())) { return null; }
  const raw = await AsyncStorage.getItem(KEY);
  let account;
  try { account = JSON.parse(raw); } catch { return null; }
  if (!account?.employee?.id || account.employee.offline_attendance !== true || !account.employee.emp_code ||
      (server !== undefined && account.server !== normalizeServer(server))) { return null; }
  if (version !== generation) { return null; }
  if (username.trim() && ![account.employee.emp_code, account.employee.emp_punch_code]
    .some(code => String(code).toUpperCase() === username.trim().toUpperCase())) { return null; }
  await AsyncStorage.removeItem(SIGNED_OUT_KEY);
  if (version !== generation) { return null; }
  session = {...account, mode: 'offline'};
  notifySession();
  return session;
}

export async function logoutAttendance() {
  generation += 1;
  session = null;
  // Retain authorization so the saved employee can explicitly sign in offline.
  await AsyncStorage.setItem(SIGNED_OUT_KEY, 'true');
  notifySession();
}

export async function requireAttendanceAccess(server, employeeCode) {
  const state = await NetInfo.fetch();
  const current = session;
  if (!current || current.server !== normalizeServer(server) ||
      (current.employee && current.employee.emp_code !== employeeCode)) {
    throw new Error('Please log in again before marking attendance.');
  }
  if (isDisconnected(state)) {
    if (current.employee?.offline_attendance !== true) {
      throw new Error('Offline attendance is not enabled. Connect to the internet and log in.');
    }
    if (current.mode !== 'offline') {
      session = {...current, mode: 'offline'};
      notifySession();
    }
    return 'offline';
  }
  if (current.mode !== 'online') {
    if (current.employee?.offline_attendance === true) { return 'offline'; }
    throw new Error('Please log in before marking attendance.');
  }
  return 'online';
}
