import {useEffect} from 'react';
import {Alert, AppState} from 'react-native';
import {getSession, isDisconnected, lockSession, restoreOffline, subscribeSession} from './session';
import {autoSync} from './autoSync';
import {stopTracking} from '../components/BackgroundLocationService';
import NetInfo from '@react-native-community/netinfo';

export default function ConnectionGuard({navigationRef}) {
  useEffect(() => {
    let active = true;
    let revision = 0;
    const update = async state => {
      const current = getSession();
      if (!active || !current || !navigationRef.isReady()) { return; }
      const version = ++revision;
      let destination;
      if (isDisconnected(state) && current.mode === 'online') {
        const account = await restoreOffline(current.server);
        if (account) {
          destination = 'OfflineDashboard';
        }
      }
      if (state.isConnected === true && state.isInternetReachable !== false && current.mode === 'offline') {
        // Lock UI access, but retain saved authorization for automatic uploads.
        lockSession();
        destination = 'Login';
        autoSync().catch(error => console.warn('[Attendance auto sync]', error.message));
      }
      if (destination && active && version === revision) {
        if (destination === 'Login') {
          Alert.alert(
            'Internet Reconnected',
            'Internet wapas connect ho gaya hai. Pending attendance auto-sync ho rahi hai. Kripya login karein.',
            [{text: 'OK'}]
          );
        }
        navigationRef.resetRoot({index: 0, routes: [{name: destination}]});
        stopTracking().catch(() => {});
      }
    };
    const check = state => update(state).catch(err => {
      console.warn('[ConnectionGuard check error]', err);
    });
    const recheck = () => {
      if (active && getSession() && navigationRef.isReady()) {
        NetInfo.fetch().then(check).catch(() => {});
      }
    };
    const unsubscribe = NetInfo.addEventListener(check);
    const sessionSubscription = subscribeSession(recheck);
    const navigationSubscription = navigationRef.addListener('state', recheck);
    recheck();
    const foreground = AppState.addEventListener('change', state => {
      if (state === 'active') { NetInfo.fetch().then(check).catch(() => {}); }
    });
    return () => { active = false; unsubscribe(); sessionSubscription(); navigationSubscription(); foreground.remove(); };
  }, [navigationRef]);
  return null;
}
