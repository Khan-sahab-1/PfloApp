import {useEffect} from 'react';
import {AppState} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {subscribeSession, getSavedAccount} from './session';
import {autoSync} from './autoSync';
import {enableBackgroundSync, disableBackgroundSync} from './backgroundSync';

export default function AutoSyncProvider() {
  useEffect(() => {
    let mounted = true;
    const sync = () => autoSync().catch(error => console.warn('[Attendance auto sync]', error.message));
    const configure = async (syncNow = true) => {
      if (!mounted) { return; }
      if (await getSavedAccount()) {
        if (mounted && syncNow) { await sync(); }
        if (mounted) { await enableBackgroundSync(); }
      } else { await disableBackgroundSync(); }
    };
    const refresh = (syncNow = true) => configure(syncNow).catch(error => console.warn('[Attendance scheduler]', error.message));
    refresh();
    // Login changes scheduler authorization; uploads have independent triggers.
    const subscription = subscribeSession(() => refresh(false));
    const network = NetInfo.addEventListener(state => {
      if (mounted && state.isConnected === true && state.isInternetReachable !== false) { sync(); }
    });
    const foreground = AppState.addEventListener('change', state => { if (state === 'active') { refresh(); } });
    // Retry transient failures even when connectivity does not emit another change.
    const retry = setInterval(() => {
      if (mounted && AppState.currentState === 'active') { sync(); }
    }, 15000);
    return () => { mounted = false; clearInterval(retry); subscription(); network(); foreground.remove(); };
  }, []);
  return null;
}
