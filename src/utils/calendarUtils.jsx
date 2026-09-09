import RNCalendarEvents from 'react-native-calendar-events';

const getReminderMinutes = reminder => {
  if (typeof reminder === 'number' && reminder > 0) return reminder;
  const match = String(reminder || '').trim().match(/(\d+)\s*(minute|hour|day)/i);
  if (!match) return 15;
  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit.startsWith('hour')) return value * 60;
  if (unit.startsWith('day')) return value * 24 * 60;
  return value;
};

const isGoogleCalendar = calendar =>
  /com\.google|google/i.test(
    `${calendar.type || ''} ${calendar.source || ''} ${calendar.title || ''}`,
  );

const selectWritableCalendar = calendars =>
  calendars.find(
    calendar =>
      calendar.allowsModifications &&
      calendar.isPrimary &&
      isGoogleCalendar(calendar),
  ) ||
  calendars.find(
    calendar => calendar.allowsModifications && isGoogleCalendar(calendar),
  ) ||
  calendars.find(calendar => calendar.allowsModifications && calendar.isPrimary) ||
  calendars.find(
    calendar =>
      calendar.allowsModifications &&
      /local|phone|device|icloud|google/i.test(
        `${calendar.type || ''} ${calendar.source || ''} ${calendar.title || ''}`,
      ),
  ) ||
  calendars.find(calendar => calendar.allowsModifications);

/** Saves a meeting and its reminder in the device Calendar app. */
export const addMeetingToCalendar = async ({
  title,
  startDate,
  endDate,
  location = '',
  description = '',
  reminder = '15 Minutes',
}) => {
  try {
    const permission = await RNCalendarEvents.requestPermissions();
    if (permission !== 'authorized') {
      return {success: false, code: 'permission_denied', message: 'Calendar permission was not granted.'};
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return {success: false, code: 'invalid_date', message: 'Invalid meeting date or duration.'};
    }

    const calendars = await RNCalendarEvents.findCalendars();
    const calendar = selectWritableCalendar(calendars);
    if (!calendar) {
      return {success: false, code: 'no_calendar', message: 'No writable calendar is available on this device.'};
    }

    const minutesBefore = getReminderMinutes(reminder);
    const reminderDate = new Date(start.getTime() - minutesBefore * 60_000);
    const alarms = reminderDate > new Date() ? [{date: reminderDate.toISOString()}] : [];
  // console.log(alarms,'Alerm Ki Timing ')
    const eventId = await RNCalendarEvents.saveEvent(title || 'Meeting', {
      calendarId: calendar.id,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      location,
      notes: description || `Reminder: ${minutesBefore} minute(s) before`,
      alarms,
    });

    return {
      success: true,
      eventId,
      calendarId: calendar.id,
      calendarTitle: calendar.title || calendar.source || 'Default Calendar',
      minutesBefore,
    };
  } catch (error) {
    console.warn('[calendarUtils] Unable to save calendar event:', error);
    return {success: false, code: 'calendar_error', message: error.message};
  }
};
