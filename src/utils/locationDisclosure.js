import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid, Platform } from 'react-native';

const LOCATION_DISCLOSURE_KEY = '@pflo_location_disclosure_accepted_v1';

/**
 * Checks whether the user has previously accepted the prominent location disclosure.
 */
export const hasAcceptedLocationDisclosure = async () => {
  try {
    const value = await AsyncStorage.getItem(LOCATION_DISCLOSURE_KEY);
    return value === 'true';
  } catch (e) {
    console.warn('[LocationDisclosure] Error reading disclosure consent:', e);
    return false;
  }
};

/**
 * Saves user's consent for the prominent location disclosure.
 */
export const setLocationDisclosureAccepted = async (accepted = true) => {
  try {
    await AsyncStorage.setItem(LOCATION_DISCLOSURE_KEY, accepted ? 'true' : 'false');
  } catch (e) {
    console.warn('[LocationDisclosure] Error saving disclosure consent:', e);
  }
};

/**
 * Requests location and background location permissions in accordance with Google Play Policy.
 * Note: Android 11+ (API 30+) requires fine location to be requested first, followed by background location.
 */
export const requestGooglePlayCompliantPermissions = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    // 1. Request Foreground Fine & Coarse Location
    const foregroundResult = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    const fineGranted =
      foregroundResult[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED;

    if (!fineGranted) {
      return false;
    }

    // 2. Request Notification Permission for Foreground Service on Android 13+ (API 33+)
    if (Platform.Version >= 33) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    // 3. Request Background Location if declared in manifest (Android 10+ / API 29+)
    // if (Platform.Version >= 29 && PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION) {
    //   try {
    //     const bgStatus = await PermissionsAndroid.check(
    //       PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    //     );
    //     if (!bgStatus) {
    //       const bgResult = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    //         {
    //           title: 'Background Location Permission',
    //           message:
    //             'To track your duty location while your screen is locked or app is minimized, please choose "Allow all the time".',
    //           buttonPositive: 'Allow All The Time',
    //           buttonNegative: 'Only While Using App',
    //         },
    //       );
    //       console.log('[LocationDisclosure] Background location result:', bgResult);
    //     }
    //   } catch (bgError) {
    //     console.warn('[LocationDisclosure] Background permission check error:', bgError);
    //   }
    // }

    return true;
  } catch (error) {
    console.warn('[LocationDisclosure] Permission request error:', error);
    return false;
  }
};

