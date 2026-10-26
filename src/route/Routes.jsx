import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainStack from './MainStack';
import {AuthContext} from '../Screens/Context';
import {restoreStartup} from '../offline/startup';

const Stack = createNativeStackNavigator();

export default function Routes() {
  const {setCurrentUrl} = useContext(AuthContext);
  const [initialRoute, setInitialRoute] = useState(null);
  useEffect(() => {
    let active = true;
    // Resolve the saved employee before mounting any protected screen.
    restoreStartup()
      .then(account => {
        if (active) {
          if (account) { setCurrentUrl(account.server); }
          setInitialRoute(account ? 'OfflineDashboard' : 'Login');
        }
      })
      .catch(() => { if (active) { setInitialRoute('Login'); } });
    return () => { active = false; };
    // Server selection changes on Login; bootstrap runs only on app launch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return initialRoute ? MainStack(Stack, initialRoute) : <ActivityIndicator size="large" />;
}
