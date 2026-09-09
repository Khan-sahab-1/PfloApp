// utils/permissionUtils.js
// Jamshed Ali Added Start - Bug ID 2555
// Description: Added utility functions for requesting and checking permissions for camera and location access.
import { PermissionsAndroid, Platform } from 'react-native';

export const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    // iOS handles location permission automatically via Info.plist
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.warn('Permission error:', error);
    return false;
  }
};
// Jamshed Ali Added End - Bug ID 2555