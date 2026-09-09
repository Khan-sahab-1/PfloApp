// Jamshed start 
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  useColorScheme
} from 'react-native';
import { Calendar } from 'react-native-calendars';
// import PushNotification from 'react-native-push-notification';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CreateMeetingForm from '../constaints/CreateMeetingForm';
import HeaderCompo from '../components/HeaderCompo';
import urls from '../../url';
import makeApiCall from '../utils/apiHelper';
import { useDispatch, useSelector } from 'react-redux';
import RNCalendarEvents from 'react-native-calendar-events';
import requestCalendarPermission from '../utils/CalenderPermission';
import { COLORS } from '../styles/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { showFlashMessage } from '../utils/fleshmessage';
import { AuthContext } from './Context';
import { fetchUserData } from '../redux/reducers/Userinforeducers';
import { useFocusEffect } from '@react-navigation/native';

dayjs.extend(utc);
dayjs.extend(timezone);

const CheckCalendar = ({ route, navigation }) => {
  const { meetings: initialMeetings = [] } = route.params || {};
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;

  console.log(server_origin, 'Server to mil raha h')
  const [state, setState] = useState({
    selectedDate: dayjs().format('YYYY-MM-DD'),
    loading: false,
    markedDates: {},
    filteredMeetings: [],
    modalVisible: false,
    attendeesData: [],
    allMeetings: []
  });

  const user = useSelector((state) => state.user.userDatainfo)
  // console.log(userinfo,'UserInfo daata')
  const colorschema = useColorScheme();
  const isDark = colorschema === 'dark';

  const updateState = (newState) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  // Helper function to safely parse meeting date
  // Updated getMeetingDate function to handle ISO strings
  const getMeetingDate = (meeting) => {
    if (!meeting || !meeting.date) return null;

    try {
      // Handle ISO string dates
      if (typeof meeting.date === 'string' && dayjs(meeting.date).isValid()) {
        return dayjs(meeting.date).format('YYYY-MM-DD');
      }
      // Handle Date objects
      else if (meeting.date instanceof Date) {
        return dayjs(meeting.date).format('YYYY-MM-DD');
      }
      return null;
    } catch (error) {
      console.warn('Error parsing meeting date:', error);
      return null;
    }
  };

  // Updated fetchAllCalendarMeetings function
  const fetchAllCalendarMeetings = async () => {
    console.log(server_origin, urls.getCalendarData, 'kiya url mila h')
    updateState({ loading: true });
    try {
      const [calendarData, calendarMeetingData] = await Promise.all([
        makeApiCall(server_origin, urls.getCalendarData, 'POST', {
          jsonrpc: '2.0',
          method: 'call',
          params: { employeeCode: user.result.emp_code, auto_sync: true },
        }),
        makeApiCall(server_origin, urls.getcalndermeetingData, 'POST', {
          jsonrpc: '2.0',
          method: 'call',
          params: { employeeCode: user.result.emp_code, auto_sync: true },
        }),
      ]);

      // Process all meetings with strict validation
      const allMeetingsRaw = [
        ...(calendarData?.result || []),
        ...(calendarMeetingData?.result || []),
        ...initialMeetings
      ].filter(meeting => {
        // Filter out invalid meetings
        return meeting &&
          !meeting.archive &&
          meeting.date !== false &&
          dayjs(meeting.date).isValid();
      });

      // Process valid meetings
      const marked = {};
      const validMeetings = allMeetingsRaw.map(meeting => {
        const date = dayjs(meeting.date).format('YYYY-MM-DD');
        marked[date] = {
          selected: true,
          selectedColor: '#007AFF',
          marked: true,
          dotColor: 'white',
        };
        return {
          ...meeting,
          date: dayjs(meeting.date).toISOString() // Normalize date format
        };
      });

      updateState({
        allMeetings: validMeetings,
        markedDates: marked,
        filteredMeetings: validMeetings.filter(m =>
          dayjs(m.date).format('YYYY-MM-DD') === state.selectedDate
        )
      });

      // Sync valid meetings with device calendar
      await Promise.all(validMeetings.map(addMeetingToCalendar));

    } catch (error) {
      console.error('Error fetching calendar data:', error);
      Alert.alert('Error', 'Failed to fetch calendar data');
    } finally {
      updateState({ loading: false });
    }
  };
  const handledelete = async (cal_id) => {
    console.log(cal_id, 'Cal Id Mila H ')
    try {
      const responce = await makeApiCall(server_origin, urls.deletemeeting, 'POST', {
        jsonrpc: '2.0',
        method: 'call',
        params: { cal_id: cal_id },
      })
      // console.log(responce,'kiya responce mila')
      if (responce?.result?.success === true) {
        showFlashMessage({
          message: "Success!",
          description: `Successfully Deleted meeting`,
          type: "success",
        })
        fetchAllCalendarMeetings();
      } else {
        // Handle error, e.g., display response?.result?.message
        Alert.alert('Operation Failed', responce?.result?.message || 'An unknown error occurred.');
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handledeletePlane = async (plan_id) => {
    console.log(plan_id, 'Plane Id Mila H ')
    try {
      const responce = await makeApiCall(server_origin, urls.deletemeetingPlane, 'POST', {
        jsonrpc: '2.0',
        method: 'call',
        params: { plan_id: plan_id },
      })
      // console.log(responce,'kiya responce mila')
      if (responce?.result?.success === true) {
        showFlashMessage({
          message: "Success!",
          description: `Successfully Deleted meeting`,
          type: "success",
        })
        fetchAllCalendarMeetings();
      } else {
        // Handle error, e.g., display response?.result?.message
        Alert.alert('Operation Failed', responce?.result?.message || 'An unknown error occurred.');
      }
    } catch (error) {
      console.log(error)
    }
  }
  // Updated useEffect for filtering
useEffect(() => {
  if (state.selectedDate) {
    const filtered = state.allMeetings
      .filter(meeting => getMeetingDate(meeting) === state.selectedDate)
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());

    updateState({ filteredMeetings: filtered });
  }
}, [state.selectedDate, state.allMeetings]);


  const addMeetingToCalendar = async (meeting) => {
    // Skip if meeting has invalid date
    if (!meeting || meeting.date === false || !dayjs(meeting.date).isValid()) {
      console.warn('Skipping calendar add - invalid meeting date:', meeting);
      return null;
    }

    const granted = await requestCalendarPermission();
    if (!granted) {
      Alert.alert('Permission Denied', 'Cannot access calendar without permission.');
      return null;
    }

    try {
      const calendars = await RNCalendarEvents.findCalendars();
      const primaryCalendar = calendars.find(c => c.isPrimary && c.allowsModifications);
      if (!primaryCalendar) {
        Alert.alert('No modifiable calendar found');
        return null;
      }

      // Skip if already synced
      if (meeting.event_id || meeting.auto_sync) {
        console.log(`Skipping creation for meeting "${meeting.name}" as it's already synced`);
        return null;
      }

      // Parse reminder time (default to 15 minutes before)
      let reminderMinutes = 15;
      if (typeof meeting.reminders === 'string') {
        const reminderMatch = meeting.reminders.match(/(\d+)\s*(Hour|Minute|Day)/);
        if (reminderMatch) {
          const reminderValue = parseInt(reminderMatch[1], 10);
          if (reminderMatch[2] === 'Hour') {
            reminderMinutes = reminderValue * 60;
          } else if (reminderMatch[2] === 'Day') {
            reminderMinutes = reminderValue * 24 * 60;
          } else {
            reminderMinutes = reminderValue;
          }
        }
      }

      // Convert to local timezone
      const meetingDate = dayjs(meeting.date);
      if (!meetingDate.isValid()) {
        console.warn('Invalid meeting date format, skipping:', meeting);
        return null;
      }

      const startDateISO = meetingDate.toISOString();
      const endDateISO = meetingDate.add(meeting.duration || 1, 'hour').toISOString();

      const newEventId = await RNCalendarEvents.saveEvent(meeting.name || 'Untitled Meeting', {
        calendarId: primaryCalendar.id,
        startDate: startDateISO,
        endDate: endDateISO,
        location: meeting.location || '',
        alarms: [{ date: reminderMinutes }],
        notes: meeting.notes || '',
      });

      if (newEventId) {
        // console.log(`Added to calendar: "${meeting.name}" (ID: ${newEventId})`);
        return newEventId;
      }
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      return null;
    }
  };

  //  const fetchAllCalendarMeetings = async () => {
  //   updateState({ loading: true });
  //   try {
  //     const [calendarData, calendarMeetingData] = await Promise.all([
  //       makeApiCall(urls.getCalendarData, 'POST', {
  //         jsonrpc: '2.0',
  //         method: 'call',
  //         params: { employeeCode: user.result.emp_code, auto_sync: true },
  //       }),
  //       makeApiCall(urls.getcalndermeetingData, 'POST', {
  //         jsonrpc: '2.0',
  //         method: 'call',
  //         params: { employeeCode: user.result.emp_code, auto_sync: true },
  //       }),
  //     ]);

  //     // Process all meetings with strict validation
  //     const allMeetingsRaw = [
  //       ...(calendarData?.result || []),
  //       ...(calendarMeetingData?.result || []),
  //       ...initialMeetings
  //     ].filter(meeting => {
  //       // Filter out invalid meetings
  //       return meeting && 
  //              !meeting.archive && 
  //              meeting.date !== false && 
  //              dayjs(meeting.date).isValid();
  //     });

  //     // Process valid meetings
  //     const marked = {};
  //     const validMeetings = allMeetingsRaw.map(meeting => {
  //       const date = dayjs(meeting.date).format('YYYY-MM-DD');
  //       marked[date] = {
  //         selected: true,
  //         selectedColor: '#007AFF',
  //         marked: true,
  //         dotColor: 'white',
  //       };
  //       return {
  //         ...meeting,
  //         date: dayjs(meeting.date).toISOString() // Normalize date format
  //       };
  //     });

  //     updateState({ 
  //       allMeetings: validMeetings,
  //       markedDates: marked,
  //       filteredMeetings: validMeetings.filter(m => 
  //         dayjs(m.date).format('YYYY-MM-DD') === state.selectedDate
  //       )
  //     });

  //     // Sync valid meetings with device calendar
  //     await Promise.all(validMeetings.map(addMeetingToCalendar));

  //   } catch (error) {
  //     console.error('Error fetching calendar data:', error);
  //     Alert.alert('Error', 'Failed to fetch calendar data');
  //   } finally {
  //     updateState({ loading: false });
  //   }
  // };

  const fetchAttendeesData = async () => {
    updateState({ loading: true });
    try {
      const data = await makeApiCall(server_origin, urls.getAttendeesData, 'POST', {
        jsonrpc: '2.0',
        method: 'call',
        params: {},
      });
      updateState({ attendeesData: data?.result || [] });
    } catch (error) {
      console.error('Error fetching attendees data:', error);
      Alert.alert('Error', 'Failed to fetch attendees data');
    } finally {
      updateState({ loading: false });
    }
  };

  const scheduleNotification = (meeting) => {
    if (!meeting || !meeting.date || !meeting.name) return;

    try {
      // PushNotification.localNotification({
      //   channelId: 'meeting-reminders',
      //   title: 'Meeting Reminder',
      //   message: `You have a meeting: ${meeting.name} at ${meeting.date}`,
      //   date: new Date(meeting.date),
      // });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;
    const filtered = state.allMeetings.filter(meeting =>
      getMeetingDate(meeting) === selectedDate
    );
    updateState({
      selectedDate,
      filteredMeetings: filtered
    });
  };

  const handleSaveMeeting = async (newMeeting) => {
    if (!newMeeting || !newMeeting.date) {
      Alert.alert('Error', 'Invalid meeting data');
      return;
    }

    try {
      const newEventId = await addMeetingToCalendar(newMeeting);
      const updatedMeeting = newEventId ? { ...newMeeting, event_id: newEventId } : newMeeting;

      const updatedMeetings = [...state.allMeetings, updatedMeeting];
      const marked = { ...state.markedDates };
      const date = getMeetingDate(updatedMeeting);

      if (date) {
        marked[date] = {
          selected: true,
          selectedColor: '#007AFF',
          marked: true,
          dotColor: 'white',
        };

        updateState({
          allMeetings: updatedMeetings,
          markedDates: marked,
          modalVisible: false,
          selectedDate: date,
          filteredMeetings: updatedMeetings.filter(m =>
            getMeetingDate(m) === date
          )
        });
        await fetchAllCalendarMeetings();
        scheduleNotification(updatedMeeting);
      } else {
        Alert.alert('Error', 'Could not parse meeting date');
      }
    } catch (error) {
      console.error('Error saving meeting:', error);
      Alert.alert('Error', 'Failed to save meeting');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAttendeesData();
      fetchAllCalendarMeetings();
    }, [])
  );


  useEffect(() => {
    if (state.selectedDate) {
      const filtered = state.allMeetings.filter(meeting =>
        getMeetingDate(meeting) === state.selectedDate
      );
      updateState({ filteredMeetings: filtered });
    }
  }, [state.selectedDate, state.allMeetings]);

  return (
    <>
      <HeaderCompo
        title={'Calendar'}
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <View style={{ ...styles.container, backgroundColor: isDark ? COLORS.black : COLORS.BACKGROUND }}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            ...state.markedDates,
            ...(state.selectedDate && {
              [state.selectedDate]: {
                ...(state.markedDates[state.selectedDate] || {}),
                selected: true,
                selectedColor: '#007AFF',
              },
            }),
          }}
          theme={{
            selectedDayBackgroundColor: '#007AFF',
            todayTextColor: '#007AFF',
            arrowColor: '#007AFF',
          }}
        />

        {state.loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <FlatList
            data={state.filteredMeetings}
            keyExtractor={(item, index) =>
              `${item.id || index}_${dayjs(item.date).valueOf()}`
            }

            renderItem={({ item }) => (
              <View style={styles.meetingCard}>
                <View>
                  <Text style={styles.meetingTitle}>{item.name || 'Untitled Meeting'}</Text>
                  <Text style={styles.meetingDetail}>
                    🗓 {item.date ? dayjs(item.date).format('MMMM D, YYYY [at] h:mm A') : 'Date not set'}
                  </Text>
                  <Text style={styles.meetingDetail}>📍 {item.location || 'Not set'}</Text>
                  <Text style={styles.meetingDetail}>
                    👥 {item.attendee_name?.join?.(', ') || 'No attendees'}
                  </Text>
                  <Text style={styles.meetingDetail}>⏱ {item.duration || '?'} hours</Text>
                  <Text style={styles.meetingDetail}>🔔 {item.reminders || 'None'}</Text>
                  <Text style={styles.meetingDetail}>📌 Activity: {item.activity_name || 'None'}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                  if (item?.cal_id) {
                    handledelete(item.cal_id); // Use cal_id API
                  } else if (item?.plan_id) {
                    handledeletePlane(item.plan_id); // Use plan_id API
                  } else {
                    Alert.alert('Error', 'No valid meeting ID found to delete.');
                  }

                }}
                >
                  <FontAwesome5 name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ ...styles.noMeetingText, color: isDark ? COLORS.white : COLORS.black }}>
                No meetings for the selected date.
              </Text>
            }
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => updateState({ modalVisible: true })}
        >
          <AntDesign name="pluscircle" size={60} color="#007AFF" />
        </TouchableOpacity>

        <CreateMeetingForm
          isvisible={state.modalVisible}
          onclose={() => updateState({ modalVisible: false })}
          attandiesData={state.attendeesData}
          selectedDate={state.selectedDate}
          onClose={() => updateState({ modalVisible: false })}
          onSave={handleSaveMeeting}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC'
  },
  meetingCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  meetingDetail: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
  noMeetingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});

export default CheckCalendar;
// Jamshed start 