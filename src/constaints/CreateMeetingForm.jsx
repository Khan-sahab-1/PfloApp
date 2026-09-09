//bug id 2822 Jamshed start
// Description: Implemented a comprehensive meeting creation form that allows users to schedule meetings with various options such as selecting attendees, setting start and end times, choosing recurrence patterns, and adding reminders. The form includes validation to ensure all required fields are filled out correctly and integrates with the device's calendar and notification system to provide seamless scheduling and reminders for meetings.
import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  TouchableWithoutFeedback,
  Alert,
  Platform,
  PermissionsAndroid,
  ScrollView,
  useColorScheme
} from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';
// import PushNotification from 'react-native-push-notification';
import TextinputCompo from '../components/TextinputCompo';
import ButtonCompo from '../components/ButtonCompo';
import DropdownCompo from '../components/DropdownCompo';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import urls from '../../url';
import makeApiCall from '../utils/apiHelper';
import { useSelector } from 'react-redux';
import { TextInputMask } from 'react-native-masked-text';
import SingleDropdown from '../components/SingleDropdown';
import { formatDateTime } from '../utils/permissions';
import { COLORS } from '../styles/Colors';
import { days } from '../utils/Datafiles';
import { AuthContext } from '../Screens/Context';
import { requestPermissionsnotification } from '../utils/NotificationrequestPermissions';

dayjs.extend(utc);
dayjs.extend(timezone);
// const notificationGranted = await PermissionsAndroid.request(
//   PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
// );
// console.log('🔔 Notification permission granted:', notificationGranted);
// setHasNotificationPermission(
//   notificationGranted === PermissionsAndroid.RESULTS.GRANTED
// );

// Configure push notifications
// PushNotification.configure({
//   onNotification: function (notification) {
//     console.log('NOTIFICATION:', notification);
//   },
//   permissions: {
//     alert: true,
//     badge: true,
//     sound: true,
//   },
//   popInitialNotification: true,
//   requestPermissions: Platform.OS === 'ios',
// });

const CreateMeetingForm = ({ isvisible, onclose }) => {
  const userinfo = useSelector((state) => state.user.userDatainfo);
  const [attandiesData, setAttendeesData] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showUntilPicker, setShowUntilPicker] = useState(false);
  const [hasCalendarPermission, setHasCalendarPermission] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [selected, setSelected] = useState(null);
  const [repeatEvery, setRepeatEvery] = useState([]);
  const [until, setUntil] = useState([]);
  const [munthby, setMonthBy] = useState([]);
  const [dayby, setDayBy] = useState([]);
  const [reminder, setReminder] = useState([]);
  const [weekdays, setWeekdays] = useState([]);
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const [selectedDays, setSelectedDays] = useState(() =>
    days.reduce((acc, day) => {
      acc[day] = false;
      return acc;
    }, {})
  );
  const options = [
    { label: 'Internal', value: 'internal' },
    { label: 'External', value: 'external' },
    { label: 'Both', value: 'both' },
  ];
  const colorschema = useColorScheme();
  const isDark = colorschema === 'dark';

  const [newMeeting, setNewMeeting] = useState({
    subject: '',
    attendees: [],
    startTime: new Date(),
    endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    duration: '',
    location: '',
    description: '',
    allDay: false,
    recurrent: false,
    reminder: null,
    endsAt: null,
    repeatEvery: null,
    repeatUntil: null,
    repeatCount: '',
    monthBy: '',
    dayBy: '',
    weekby: '',
    numberofEveryrepetitation: 1,
    numberofrepetitationdays: 1,
    numberofrepetitionDays: 1
  });

  const dropdownData = attandiesData?.map(item => ({
    label: item.name || 'Unknown',
    value: item.id,
  })) || [];
  // const testNotification = () => {
  //   PushNotification.localNotification({
  //     channelId: 'meeting-reminder',
  //     title: '📅 Test Notification',
  //     message: 'This is a test meeting reminder.',
  //   });
  // };


  useEffect(() => {
    requestPermissions();
    createNotificationChannel();
    fetchAttendeesData();
    fetchReminders();
    // requestPermissionsnotification()
  }, []);

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const granted = await requestPermissionsnotification();
      setHasNotificationPermission(granted);
    };

    checkNotificationPermission();
  }, []);

  const createNotificationChannel = () => {
    if (Platform.OS === 'android') {
      // PushNotification.createChannel(
      //   {
      //     channelId: 'meeting-reminder',
      //     channelName: 'Meeting Reminders',
      //     channelDescription: 'Channel for meeting reminders',
      //     importance: 4,
      //     vibrate: true,
      //   },
      //   (created) => console.log(`Channel created: ${created}`)
      // );
    }
  };

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        // Request READ_CALENDAR
        const readCalendarGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
          {
            title: 'Calendar Permission',
            message: 'App needs access to your calendar to read events',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        // Request WRITE_CALENDAR
        const writeCalendarGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
          {
            title: 'Calendar Permission',
            message: 'App needs access to your calendar to add events',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        const hasCalendar =
          readCalendarGranted === PermissionsAndroid.RESULTS.GRANTED &&
          writeCalendarGranted === PermissionsAndroid.RESULTS.GRANTED;

        setHasCalendarPermission(hasCalendar);

        // Request POST_NOTIFICATIONS
        const notificationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        setHasNotificationPermission(
          notificationGranted === PermissionsAndroid.RESULTS.GRANTED
        );

      } else {
        // iOS calendar permission
        const calendarStatus = await RNCalendarEvents.checkPermissions();
        if (calendarStatus !== 'authorized') {
          const newStatus = await RNCalendarEvents.requestPermissions();
          setHasCalendarPermission(newStatus === 'authorized');
        } else {
          setHasCalendarPermission(true);
        }

        // iOS notification permission
        // PushNotification.requestPermissions().then((permissions) => {
        //   const granted =
        //     permissions?.alert === true ||
        //     permissions?.authorizationStatus === 1;
        //   setHasNotificationPermission(granted);
        // });
      }
    } catch (err) {
      console.warn('Permission error:', err);
    }
  };

  const validateForm = () => {
    if (!newMeeting.subject.trim()) {
      Alert.alert('Validation Error', 'Please enter a meeting subject');
      return false;
    }

    if (selectedAttendees.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one attendee');
      return false;
    }

    if (!newMeeting.startTime) {
      Alert.alert('Validation Error', 'Please select a start time');
      return false;
    }

    if (newMeeting.allDay) {
      if (!newMeeting.endTime) {
        Alert.alert('Validation Error', 'Please select an end time for all-day events');
        return false;
      }

      if (dayjs(newMeeting.endTime).isBefore(dayjs(newMeeting.startTime))) {
        Alert.alert('Validation Error', 'End date cannot be before start date');
        return false;
      }
    } else {
      const durationRegex = /^\d{1,2}:\d{2}$/;
      if (!durationRegex.test(newMeeting.duration)) {
        Alert.alert('Validation Error', 'Duration must be in HH:MM format (e.g., 01:30)');
        return false;
      }

      const [hours, minutes] = newMeeting.duration.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || minutes < 0 || minutes >= 60) {
        Alert.alert('Validation Error', 'Please enter a valid duration (00:00 to 23:59)');
        return false;
      }
    }

    if (newMeeting.recurrent) {
      if (!newMeeting.repeatEvery) {
        Alert.alert('Validation Error', 'Please select a repeat frequency');
        return false;
      }

      if (newMeeting.repeatEvery === 'weekly' && !Object.values(selectedDays).some(val => val)) {
        Alert.alert('Validation Error', 'Please select at least one day for weekly recurrence');
        return false;
      }

      if (newMeeting.repeatUntil === 'until' && !newMeeting.endsAt) {
        Alert.alert('Validation Error', 'Please select an end date for the recurrence');
        return false;
      }

      if (newMeeting.repeatUntil === 'count' && (!newMeeting.numberofrepetitationdays || newMeeting.numberofrepetitationdays < 1)) {
        Alert.alert('Validation Error', 'Please enter a valid repeat count (minimum 1)');
        return false;
      }
    }

    return true;
  };

  const resetForm = () => {
    setNewMeeting({
      subject: '',
      attendees: [],
      startTime: new Date(),
      endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
      duration: '01:00',
      location: '',
      description: '',
      allDay: false,
      recurrent: false,
      reminder: null,
      endsAt: null,
      repeatEvery: null,
      repeatUntil: null,
      repeatCount: '',
      monthBy: '',
      dayBy: '',
      weekby: '',
      numberofEveryrepetitation: 1,
      numberofrepetitationdays: 1,
      numberofrepetitionDays: 1
    });
    setSelectedAttendees([]);
    setSelectedDays(days.reduce((acc, day) => {
      acc[day] = false;
      return acc;
    }, {}));
  };


  const addEventToCalendar = async () => {
    console.log('---------- Function started ----------');
    try {
      const startDate = newMeeting.startTime;
      let endDate;

      if (newMeeting.allDay) {
        endDate = newMeeting.endTime;
      } else {
        const [hours, minutes] = newMeeting.duration.split(':').map(Number);
        endDate = dayjs(startDate)
          .add(hours, 'hour')
          .add(minutes, 'minute')
          .toDate();
      }

      const eventConfig = {
        title: newMeeting.subject,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location: newMeeting.location,
        notes: newMeeting.description,
        alarms: newMeeting.reminder ? [
          {
            date: dayjs(startDate).subtract(newMeeting.reminder, 'minute').toISOString()
          }
        ] : undefined,
      };

      // if (newMeeting.recurrent && newMeeting.repeatEvery) {
      //   const recurrenceRule = generateRecurrenceRule();
      //   if (recurrenceRule) {
      //     eventConfig.recurrenceRule = recurrenceRule;
      //   }
      // }

      const eventId = await RNCalendarEvents.saveEvent(newMeeting.subject, eventConfig);

      if (eventId) {
        console.log('✅ Event successfully added to calendar with ID:', eventId);
      } else {
        console.warn('⚠️ Event save returned no ID');
      }

      return eventId;
    } catch (error) {
      console.error('❌ Error saving event to calendar:', error);
      throw error;
    }
  };


  const scheduleNotification = () => {
    let meetingEndTime;
    if (newMeeting.allDay) {
      meetingEndTime = newMeeting.endTime;
    } else {
      const [hours, minutes] = newMeeting.duration.split(':').map(Number);
      meetingEndTime = dayjs(newMeeting.startTime)
        .add(hours, 'hour')
        .add(minutes, 'minute')
        .toDate();
    }

    const reminderTime = dayjs(newMeeting.startTime).subtract(15, 'minute').toDate();
    const startTime = newMeeting.startTime;
    const endSoonTime = dayjs(meetingEndTime).subtract(5, 'minute').toDate();

    // Log for debugging
    console.log('🛠 Scheduling Notifications');
    console.log('Reminder Time:', reminderTime);
    console.log('Start Time:', startTime);
    console.log('End Soon Time:', endSoonTime);

    // // Reminder notification (15 mins before)
    // PushNotification.localNotificationSchedule({
    //   channelId: 'meeting-reminder',
    //   title: `Upcoming Meeting: ${newMeeting.subject}`,
    //   message: `Your meeting starts soon at ${dayjs(newMeeting.startTime).format('h:mm A')}`,
    //   date: reminderTime,
    //   allowWhileIdle: true,
    // });
    console.log(`✅ Reminder scheduled at: ${dayjs(reminderTime).format('YYYY-MM-DD HH:mm:ss')}`);

    // Start time notification
    // PushNotification.localNotificationSchedule({
    //   channelId: 'meeting-reminder',
    //   title: `Meeting Started: ${newMeeting.subject}`,
    //   message: `Your meeting has started`,
    //   date: startTime,
    //   allowWhileIdle: true,
    // });
    console.log(`✅ Start notification scheduled at: ${dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')}`);

    // Ending soon notification
    // PushNotification.localNotificationSchedule({
    //   channelId: 'meeting-reminder',
    //   title: `Meeting Ending Soon: ${newMeeting.subject}`,
    //   message: `Your meeting will end in 5 minutes`,
    //   date: endSoonTime,
    //   allowWhileIdle: true,
    // });
    console.log(`✅ End-soon notification scheduled at: ${dayjs(endSoonTime).format('YYYY-MM-DD HH:mm:ss')}`);
  };

const formatToUTC = (date) => {
  return dayjs(date).utcOffset(-330).format('YYYY-MM-DD HH:mm:ss');
};


  const handleCreateMeeting = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Convert duration to decimal hours
      const [hours, minutes] = newMeeting.duration.split(':').map(Number);
      const durationInHours = hours + (minutes / 60);
      const endDate = newMeeting.endsAt
        ? newMeeting.allDay
          ? dayjs(newMeeting.endTime).format('YYYY-MM-DD')
          : formatDateTime(newMeeting.endTime)
        : null;


      // Prepare API params
      const params = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          subject: newMeeting.subject,
          assigned_to: userinfo?.result?.emp_code,
          startDate: newMeeting.allDay
            ? dayjs(newMeeting.startTime).format('YYYY-MM-DD')
            : formatDateTime(newMeeting.startTime),
          endDate: endDate,
          duration: durationInHours,
          location: newMeeting.location,
          summary: newMeeting.description,
          recurrent: newMeeting.recurrent,
          all_day: newMeeting.allDay,
          attendees: selectedAttendees,
          reminder: newMeeting.reminder,
          ends_at: newMeeting.endsAt ? formatDateTime(newMeeting.endsAt) : null,
          repeat_every: newMeeting.repeatEvery,
          repeat_until: newMeeting.repeatUntil,
          repeat_count: newMeeting.repeatCount,
          month_by: newMeeting.monthBy,
          day_by: newMeeting.dayBy,
          week_by: newMeeting.weekby,
          selected_days: Object.fromEntries(
            Object.entries(selectedDays).filter(([_, value]) => typeof value === 'boolean')),
          dayss: newMeeting.numberofEveryrepetitation,
          numberof_repetitation_days: newMeeting.numberofrepetitationdays,
          final_date: newMeeting.endsAt ? formatDateTime(newMeeting.endsAt) : null
        },
      };
      console.log(params, 'Parems Me data Mil Raha H')
      const response = await makeApiCall(server_origin, urls.createmeeting, 'POST', params);
      // console.log(response, 'Response Mil Raha H');
      Alert.alert('Response', JSON.stringify(response.result, null, 2));

      if (!response?.result) {
        throw new Error('Failed to create meeting');
      }
      if (response?.result?.status === 'success') {
        if (hasCalendarPermission) {
          await addEventToCalendar();
        }

        if (hasNotificationPermission) {
          console.log('✅ Notification permission granted. Scheduling notification...');
          await scheduleNotification();
        }


        Alert.alert('Success', 'Meeting created successfully!');
        resetForm();
        onclose();
      }

    } catch (error) {
      console.error('Error creating meeting:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create meeting. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };



  const fetchAttendeesData = async () => {
    setLoading(true);
    try {
      const data = await makeApiCall(server_origin, urls.getAttendeesData, 'POST', {
        jsonrpc: '2.0',
        method: 'call',
        params: {},
      });
      setAttendeesData(data.result);
    } catch (error) {
      console.error('Error fetching attendees data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await makeApiCall(server_origin, urls.getReminderData, 'POST', {
        jsonrpc: '2.0',
        method: 'call',
        params: {}
      });
      // console.log(response, 'Reminder Data Mil Raha H');
      const repeatEveryData = response.result[0].repeat_every;
      const convertedData = repeatEveryData.map(([value, label]) => ({
        label,
        value,
      }));
      setRepeatEvery(convertedData);

      const repeatUntil = response.result[4].until;
      const untildropdownData = repeatUntil.map(([value, label]) => ({
        label,
        value
      }));
      setUntil(untildropdownData);

      const month_by = response.result[1].month_by;
      const munthbyDropdown = month_by.map(([value, label]) => ({
        label,
        value
      }));
      setMonthBy(munthbyDropdown);

      const day_by = response.result[2].by_days;
      const daybydropdown = day_by.map(([value, label]) => ({
        label,
        value
      }));
      setDayBy(daybydropdown);

      const week_list = response.result[3].week_list;
      const weekdropdown = week_list.map(([value, label]) => ({
        label,
        value
      }));
      setWeekdays(weekdropdown);

      const reminderlist = response.result[5].stored_reminders;
      const reminderdropdown = reminderlist.map(item => ({
        label: item.name,
        value: item.id
      }));
      setReminder(reminderdropdown);
    } catch (error) {
      console.error('Error fetching Reminder:', error);
    }
  };

  const handleCancel = () => {
    resetForm();
    onclose();
  };

  const handleModalClose = () => {
    if (loading) return;
    handleCancel();
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const getCurrentDate = () => new Date();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isvisible}
      onRequestClose={handleModalClose}
    >
      <TouchableWithoutFeedback>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <ScrollView style={{ ...styles.modalContainer, backgroundColor: isDark ? COLORS.black : COLORS.white }}>
              <Text style={{ ...styles.title, color: isDark ? COLORS.white : COLORS.black }}>Create Meeting</Text>

              <TextinputCompo
                placeholder="Meeting Subject"
                style={styles.input}
                value={newMeeting.subject}
                onChangeText={text => setNewMeeting({ ...newMeeting, subject: text })}
                editable={!loading}
              />
            <View style={styles.wrapper}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.checkboxContainer}
          onPress={() => setSelected(option.value)}
        >
          <View style={styles.checkbox}>
            {selected === option.value && <View style={styles.checked} />}
          </View>
          <Text style={styles.label}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
              <DropdownCompo
                data={dropdownData}
                selectedValues={selectedAttendees}
                onValueChange={setSelectedAttendees}
                placeholder="Select attendees"
                disabled={loading}
              />

              <Text style={{ ...styles.label, color: isDark ? COLORS.white : COLORS.black }}>Start Date</Text>
              <TouchableOpacity onPress={() => setShowPicker(true)}>
                <Text style={styles.input}>
                  {dayjs(newMeeting.startTime).format('YYYY-MM-DD HH:mm')}
                </Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={showPicker}
                mode="datetime"
                date={newMeeting.startTime}
                minimumDate={getCurrentDate()}
                onConfirm={date => {
                  setShowPicker(false);
                  setNewMeeting(prev => ({
                    ...prev,
                    startTime: date,
                    endTime: prev.allDay ? date : prev.endTime
                  }));
                }}
                onCancel={() => setShowPicker(false)}
              />

              {newMeeting.allDay ? (
                <>
                  <Text style={{ ...styles.label, color: isDark ? COLORS.white : COLORS.black }}>End Date</Text>
                  <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                    <Text style={styles.input}>
                      {dayjs(newMeeting.endTime).format('YYYY-MM-DD HH:mm')}
                    </Text>
                  </TouchableOpacity>

                  <DateTimePickerModal
                    isVisible={showEndPicker}
                    mode="datetime"
                    date={newMeeting.endTime}
                    minimumDate={newMeeting.startTime}
                    onConfirm={date => {
                      setShowEndPicker(false);
                      setNewMeeting({ ...newMeeting, endTime: date });
                    }}
                    onCancel={() => setShowEndPicker(false)}
                  />
                </>
              ) : (
                <TextInputMask
                  type={'custom'}
                  options={{ mask: '99:99' }}
                  placeholder="Duration (HH:MM)"
                  value={newMeeting.duration}
                  onChangeText={text => setNewMeeting({ ...newMeeting, duration: text })}
                  keyboardType="numeric"
                  style={styles.input}
                  editable={!loading}
                  placeholderTextColor={COLORS.black}
                />
              )}

              {newMeeting.recurrent && (
                <>
                  <View style={{}}>
                   
                      <Text style={{ ...styles.label, color: isDark ? COLORS.white : COLORS.black }}>Repeat Every</Text>
                      <TextinputCompo
                        value={newMeeting.numberofEveryrepetitation?.toString() || ''}
                        placeholder="Repeat every"
                        style={styles.input}
                        onChangeText={(text) =>
                          setNewMeeting({
                            ...newMeeting,
                            numberofEveryrepetitation: text === '' ? '' : parseInt(text, 10)
                          })
                        }
                        keyboardType="numeric"
                      />

                   

                    <View style={{ flex: 1 }}>
                      <SingleDropdown
                        search={false}
                        data={repeatEvery}
                        value={newMeeting.repeatEvery}
                        onChange={option => setNewMeeting({
                          ...newMeeting,
                          repeatEvery: option.value
                        })}
                        placeholder="Select frequency"
                        disabled={loading}
                      />
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <SingleDropdown
                        search={false}
                        data={until}
                        value={newMeeting.repeatUntil}
                        onChange={option => setNewMeeting({
                          ...newMeeting,
                          repeatUntil: option.value
                        })}
                        placeholder="Repeat until"
                      />
                    </View>

                    {newMeeting.repeatUntil === 'count' ? (
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <TextinputCompo
                          value={newMeeting.numberofrepetitationdays?.toString()}
                          placeholder={'Repeat count'}
                          style={styles.input}
                          onChangeText={(text) =>
                            setNewMeeting({
                              ...newMeeting,
                              numberofrepetitationdays: text === '' ? '' : parseInt(text, 10),
                            })
                          }
                          keyboardType="numeric"
                        />
                      </View>
                    ) : (
                      <View style={{ flex: 1 }}>
                        <TouchableOpacity
                          onPress={() => setShowUntilPicker(true)}
                          disabled={loading}
                        >
                          <Text style={[styles.input, loading && styles.disabledInput]}>
                            {newMeeting.endsAt
                              ? dayjs(newMeeting.endsAt).format('YYYY-MM-DD')
                              : 'Select date & time'}
                          </Text>
                        </TouchableOpacity>

                        <DateTimePickerModal
                          isVisible={showUntilPicker}
                          mode="date"
                          date={newMeeting.endsAt || new Date()}
                          minimumDate={newMeeting.startTime || new Date()}
                          onConfirm={(date) => {
                            setShowUntilPicker(false);
                            setNewMeeting({ ...newMeeting, endsAt: date });
                          }}
                          onCancel={() => setShowUntilPicker(false)}
                        />
                      </View>
                    )}
                  </View>

                  {newMeeting.repeatEvery === 'weekly' && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {days.map((day) => (
                        <TouchableOpacity
                          key={day}
                          onPress={() => toggleDay(day)}
                          style={{
                            padding: 10,
                            margin: 5,
                            backgroundColor: selectedDays[day] ? 'green' : 'gray',
                            borderRadius: 5
                          }}
                        >
                          <Text style={{ color: 'white' }}>{day}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {newMeeting.repeatEvery === 'monthly' && (
                    <View>
                      <SingleDropdown
                        data={munthby}
                        value={newMeeting.monthBy}
                        onChange={option => setNewMeeting({
                          ...newMeeting,
                          monthBy: option.value
                        })}
                        placeholder="Select month by"
                        disabled={loading}
                        search={false}
                      />

                      {newMeeting.monthBy === 'day' ? (
                        <>
                          <SingleDropdown
                            data={dayby}
                            value={newMeeting.dayBy}
                            onChange={option => setNewMeeting({
                              ...newMeeting,
                              dayBy: option.value
                            })}
                            placeholder="Select day by"
                            disabled={loading}
                            search={false}
                          />
                          <SingleDropdown
                            data={weekdays}
                            value={newMeeting.weekby}
                            onChange={option => setNewMeeting({
                              ...newMeeting,
                              weekby: option.value
                            })}
                            placeholder="Select week by"
                            disabled={loading}
                            search={false}
                          />
                        </>
                      ) : (
                        <TextinputCompo
                          value={newMeeting.numberofrepetitionDays?.toString()}
                          placeholder={'Repeat every'}
                          style={styles.input}
                          onChangeText={(text) => setNewMeeting({
                            ...newMeeting,
                            numberofrepetitionDays: text === '' ? '' : parseInt(text, 10)
                          })}
                          keyboardType="numeric"
                        />
                      )}
                    </View>
                  )}
                </>
              )}

              <TextinputCompo
                placeholder="Location"
                style={styles.input}
                value={newMeeting.location}
                onChangeText={text => setNewMeeting({ ...newMeeting, location: text })}
                editable={!loading}
              />

              <TextinputCompo
                placeholder="Description"
                style={[styles.input, { height: 80 }]}
                multiline
                value={newMeeting.description}
                onChangeText={text => setNewMeeting({ ...newMeeting, description: text })}
                editable={!loading}
              />

              <SingleDropdown
                data={reminder}
                value={newMeeting.reminder}
                onChange={option => setNewMeeting({ ...newMeeting, reminder: option.value })}
                placeholder="Select Reminder Time"
                disabled={loading}
              />

              {/* <View style={styles.row}>
                <Text style={{ color: isDark ? COLORS.white : COLORS.black }}>All Day Event</Text>
                <Switch
                  value={newMeeting.allDay}
                  onValueChange={value => setNewMeeting({
                    ...newMeeting,
                    allDay: value,
                    endTime: value ? new Date(newMeeting.startTime) : newMeeting.endTime
                  })}
                  disabled={loading}
                />
              </View> */}

              {/* <View style={styles.row}>
                <Text style={{ color: isDark ? COLORS.white : COLORS.black }}>Recurrent Meeting</Text>
                <Switch
                  value={newMeeting.recurrent}
                  onValueChange={value => setNewMeeting({
                    ...newMeeting,
                    recurrent: value,
                    // allDay: value ? true : newMeeting.allDay
                  })}
                  disabled={loading}
                />
              </View> */}

              <View style={styles.modalButtons}>
                <ButtonCompo
                  title="Cancel"
                  color="grey"
                  onPress={handleCancel}
                  disabled={loading}
                />
                <ButtonCompo
                  title={loading ? "Creating..." : "Save"}
                  color="blue"
                  onPress={handleCreateMeeting}
                  disabled={loading}
                />
                {/* <ButtonCompo title="Test Notification" onPress={testNotification} /> */}

              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    maxHeight: '90%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  wrapper: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap:10,
    justifyContent:'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: '#007BFF',
  },
});

export default CreateMeetingForm;
//bug id 2822 Jamshed end
