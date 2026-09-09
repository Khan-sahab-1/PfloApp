// Jamshed Ali Added Start - Bug ID 2555
// Description: Implemented calendar event creation and local push notification
// reminder for meetings using react-native-calendar-events and
// react-native-push-notification with timezone support (IST).
import {PermissionsAndroid, Platform} from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';

  const requestCalendarPermission = async () => {
    if (Platform.OS === 'android') {
      const readGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CALENDAR);
      const writeGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR);

      console.log('READ_CALENDAR granted:', readGranted === PermissionsAndroid.RESULTS.GRANTED);
      console.log('WRITE_CALENDAR granted:', writeGranted === PermissionsAndroid.RESULTS.GRANTED);

      return readGranted === PermissionsAndroid.RESULTS.GRANTED && writeGranted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const authStatus = await RNCalendarEvents.requestPermissions({ read: true, write: true });
      console.log('iOS permission status:', authStatus);
      return authStatus === 'authorized';
    }
  };
  export  default requestCalendarPermission
  // Jamshed Ali Added End - Bug ID 2555
