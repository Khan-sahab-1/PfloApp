// src/utils/notificationUtils.js
// import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

// ── Call once at app startup (e.g. in App.js) ──────────────────────────────
export const configurePushNotifications = () => {
  // PushNotification.configure({
  //   onRegister: () => {},           // not needed for local notifications
  //   onNotification: notification => {
  //     console.log('Notification received:', notification);
  //   },
  //   permissions: { alert: true, badge: true, sound: true },
  //   popInitialNotification: true,
  //   requestPermissions: Platform.OS === 'ios',
  // });

  // Create a default channel (Android 8+)
  // PushNotification.createChannel(
  //   {
  //     channelId: 'meeting-reminders',
  //     channelName: 'Meeting Reminders',
  //     channelDescription: 'Reminders for scheduled meetings',
  //     playSound: true,
  //     soundName: 'default',
  //     importance: 4,   // HIGH
  //     vibrate: true,
  //   },
  //   created => console.log(`Notification channel created: ${created}`),
  // );
};

/**
 * Schedule a local notification before the meeting.
 * @param {object} params
 * @param {string} params.title          - Meeting subject
 * @param {string} params.message        - Body text
 * @param {Date}   params.meetingDate    - The actual meeting start Date object
 * @param {number} params.minutesBefore  - How many minutes before to fire (default 15)
 */
export const scheduleMeetingNotification = ({
  title,
  message,
  meetingDate,
  minutesBefore = 15,
}) => {
  const fireDate = new Date(meetingDate.getTime() - minutesBefore * 60 * 1000);

  // Don't schedule if the fire time is already in the past
  if (fireDate <= new Date()) {
    console.warn('Notification fire time is in the past — skipping.');
    return;
  }

  // PushNotification.localNotificationSchedule({
  //   channelId: 'meeting-reminders',       // Android
  //   title,
  //   message: message || `Your meeting starts in ${minutesBefore} minutes.`,
  //   date: fireDate,
  //   allowWhileIdle: true,                 // fires even in doze mode (Android)
  //   playSound: true,
  //   soundName: 'default',
  //   vibrate: true,
  //   userInfo: { meetingDate: meetingDate.toISOString() }, // iOS extra data
  // });

  console.log(`Notification scheduled for ${fireDate.toISOString()}`);
};