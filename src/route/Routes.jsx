import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainStack from './MainStack';
import {AuthContext} from '../Screens/Context';
import {getSavedAccount} from '../offline/session';

const Stack = createNativeStackNavigator();

export default function Routes() {
  const {setCurrentUrl} = useContext(AuthContext);
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const wasCameraActive = await AsyncStorage.getItem('pflo:camera_active');
        if (wasCameraActive === 'true') {
          await AsyncStorage.removeItem('pflo:camera_active');
        }

        // Configure saved server URL so custom URLs are remembered
        const account = await getSavedAccount();
        if (account?.server) {
          setCurrentUrl(account.server);
        }

        // Per user requirement: Every time app opens, require fresh Login!
        if (active) {
          setInitialRoute('Login');
        }
      } catch (err) {
        if (active) {
          setInitialRoute('Login');
        }
      }
    })();
    return () => { active = false; };
  }, [setCurrentUrl]);

  return initialRoute ? MainStack(Stack, initialRoute) : <ActivityIndicator size="large" />;
}
