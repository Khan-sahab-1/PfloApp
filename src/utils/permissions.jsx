// utils/permissions.jsx

// Description: Added utility functions for requesting and checking permissions for camera and location access.
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export const requestPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      return (
        granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve(position.coords);
      },
      error => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });

export function formatDateTime(date) {
      const istDate = new Date(date);
    
      // Subtract 5 hours 30 minutes (convert to UTC)
      const utcDate = new Date(istDate.getTime() - 5.5 * 60 * 60 * 1000);
    
      const year = utcDate.getFullYear();
      const month = String(utcDate.getMonth() + 1).padStart(2, '0');
      const day = String(utcDate.getDate()).padStart(2, '0');
      const hours = String(utcDate.getHours()).padStart(2, '0');
      const minutes = String(utcDate.getMinutes()).padStart(2, '0');
      const seconds = String(utcDate.getSeconds()).padStart(2, '0');
    
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
    // Jamshed Ali Added End - Bug ID 2555
 
