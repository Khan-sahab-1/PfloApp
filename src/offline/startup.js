import NetInfo from '@react-native-community/netinfo';
import {isDisconnected, restoreSavedAccess} from './session';

const resolved = state => isDisconnected(state) ||
  (state.isConnected === true && state.isInternetReachable === true);

export async function startupConnection() {
  const initial = await NetInfo.fetch();
  if (resolved(initial)) { return initial; }
  // Native connectivity can still be unknown during a JS reload.
  return new Promise(resolve => {
    let unsubscribe;
    let finished = false;
    const finish = state => {
      if (finished) { return; }
      finished = true;
      clearTimeout(timer);
      unsubscribe?.();
      resolve(state);
    };
    const timer = setTimeout(() => finish(initial), 3000);
    unsubscribe = NetInfo.addEventListener(state => {
      if (resolved(state)) { finish(state); }
    });
    if (finished) { unsubscribe(); }
  });
}

export async function restoreStartup() {
  const state = await startupConnection();
  return isDisconnected(state) ? restoreSavedAccess() : null;
}
