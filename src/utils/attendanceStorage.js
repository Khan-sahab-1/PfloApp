import AsyncStorage from '@react-native-async-storage/async-storage';

const LEGACY_PUNCH_TIME_KEY = 'punch_time';

export const getPunchTimeKey = employeeCode =>
  `punch_time:${String(employeeCode).trim()}`;

export const getEmployeePunchTime = employeeCode => {
  if (!employeeCode) {
    return Promise.resolve(null);
  }
  return AsyncStorage.getItem(getPunchTimeKey(employeeCode));
};

export const setEmployeePunchTime = (employeeCode, punchTime) => {
  if (!employeeCode) {
    throw new Error('Employee code is required to save punch time');
  }
  return AsyncStorage.setItem(
    getPunchTimeKey(employeeCode),
    String(punchTime),
  );
};

export const removeEmployeePunchTime = employeeCode => {
  if (!employeeCode) {
    return Promise.resolve();
  }
  return AsyncStorage.removeItem(getPunchTimeKey(employeeCode));
};

// Remove data written by older builds. It cannot safely be assigned to a user.
export const removeLegacyPunchTime = () =>
  AsyncStorage.removeItem(LEGACY_PUNCH_TIME_KEY);
