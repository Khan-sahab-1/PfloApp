import React, {useCallback, useSyncExternalStore} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {getSession, subscribeSession} from './session';
import {routeRedirect} from './routeAccess';

const screens = new Map();
// Stable wrapper identities keep screen state intact across stack renders.
export function guardScreen(Component) {
  if (!screens.has(Component)) {
    function GuardedScreen(props) {
      const session = useSyncExternalStore(subscribeSession, getSession, getSession);
      const destination = routeRedirect(props.route.name, session);
      useFocusEffect(useCallback(() => {
        if (destination && props.navigation.isFocused()) {
          props.navigation.reset({index: 0, routes: [{name: destination}]});
        }
      }, [destination, props.navigation]));
      return destination ? null : <Component {...props} />;
    }
    screens.set(Component, GuardedScreen);
  }
  return screens.get(Component);
}
