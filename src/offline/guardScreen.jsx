import React, {useCallback, useRef, useSyncExternalStore} from 'react';
import {Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getSession, subscribeSession, restoreOnlineSession} from './session';
import {routeRedirect} from './routeAccess';

const screens = new Map();
// Stable wrapper identities keep screen state intact across stack renders.
export function guardScreen(Component) {
  if (!screens.has(Component)) {
    function GuardedScreen(props) {
      const session = useSyncExternalStore(subscribeSession, getSession, getSession);
      const destination = routeRedirect(props.route.name, session);
      const alertShownRef = useRef(false);

      useFocusEffect(useCallback(() => {
        if (destination && props.navigation.isFocused()) {
          // Attempt restoring saved online session if session is currently null
          if (!session && typeof restoreOnlineSession === 'function') {
            restoreOnlineSession().then(restored => {
              if (restored) {
                // Successfully restored session, stay on current screen
                return;
              }
              handleRedirect();
            }).catch(() => {
              handleRedirect();
            });
            return;
          }
          handleRedirect();
        }

        function handleRedirect() {
          if (!props.navigation.isFocused()) { return; }
          if (destination === 'Login' && props.route.name !== 'Login' && props.route.name !== 'ForgetPin') {
            if (!alertShownRef.current) {
              alertShownRef.current = true;
              Alert.alert(
                'Session Expired',
                'Aapka session expire ho gaya hai ya valid nahi hai. Kripya dobara login karein.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      alertShownRef.current = false;
                      if (props.navigation.isFocused()) {
                        props.navigation.reset({index: 0, routes: [{name: 'Login'}]});
                      }
                    },
                  },
                ],
                {cancelable: false}
              );
            }
          } else {
            props.navigation.reset({index: 0, routes: [{name: destination}]});
          }
        }
      }, [destination, props.navigation, props.route.name, session]));
      return destination && props.route.name !== 'Login' && !session && alertShownRef.current ? null : <Component {...props} />;
    }
    screens.set(Component, GuardedScreen);
  }
  return screens.get(Component);
}
