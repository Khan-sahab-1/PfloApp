// // Jamshed start 2555
// // Description: This file defines the CalendarScreen component, which displays a calendar view with marked dates for meetings and a list of meetings for the selected date. It fetches meeting data from the server, formats it for display, and allows users to create, edit, and delete meetings. The component also handles time zone adjustments and provides a user-friendly interface for managing calendar events within the app.
// import React, {useContext, useEffect, useState} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
//   useColorScheme,
// } from 'react-native';
// import {Calendar} from 'react-native-calendars';
// import {useSelector} from 'react-redux';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
// import {AuthContext} from '../../Screens/Context';
// import urls from '../../../url';
// import makeApiCall from '../../utils/apiHelper';
// import {COLORS} from '../../styles/Colors';
// import {showFlashMessage} from '../../utils/fleshmessage';
// import RNCalendarEvents from 'react-native-calendar-events';
// import {
//   addMeetingToCalendar,
//   scheduleNotification,
// } from '../../utils/calendarUtils';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import CreateMeetingForm from '../../constaints/CreateMeetingForm';
// import {Header} from '@react-navigation/stack';
// import HeaderCompo from '../../components/HeaderCompo';
// import EditMeetingModal from '../../constaints/EditMeetingModal';
// import CreatemeetingModal from '../../constaints/CreatemeetingModal';

// dayjs.extend(utc);
// dayjs.extend(timezone);

// const CalendarScreen = () => {
//   const user = useSelector(state => state.user.userDatainfo);
//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const [isVisible, setIsVisible] = useState(false);
//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';
//   const [iseditModalalVisible, setIseditModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   const [state, setState] = useState({
//     selectedDate: dayjs().format('YYYY-MM-DD'),
//     loading: false,
//     markedDates: {},
//     allMeetings: [],
//     filteredMeetings: [],
//   });

//   const updateState = newState => {
//     setState(prev => ({...prev, ...newState}));
//   };

//   const formatMeetingData = meetings => {
//     const marked = {};
//     const validMeetings = [];

//     meetings.forEach(meeting => {
//       if (meeting.date && dayjs(meeting.date).isValid()) {
//         const localDate = dayjs(meeting.date).add(5, 'hour').add(30, 'minute'); // Apply IST shift
//         const formattedDate = localDate.format('YYYY-MM-DD');

//         marked[formattedDate] = {
//           selected: true,
//           selectedColor: '#007AFF',
//           marked: true,
//           dotColor: '#007AFF',
//         };

//         validMeetings.push({
//           ...meeting,
//           date: localDate.toISOString(), // update meeting date to local
//         });
//       }
//     });

//     return {marked, validMeetings};
//   };

//   const fetchMeetings = async () => {
//     updateState({loading: true});

//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.getcalndermeetingData,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {employeeCode: user.result.emp_code, auto_sync: true},
//         },
//       );

//       // console.log(response?.result || [], 'Responce------');
//       (response?.result || []).forEach((item, index) => {
//         // console.log(`\n📅 Meeting ${index + 1}: ${item.name}`);
//         // console.log(`👥 emp_attendees:`, JSON.stringify(item.emp_attendees));
//         // console.log(`📌 res_attendees:`, JSON.stringify(item.res_attendees));
//       });

//       const {marked, validMeetings} = formatMeetingData(response?.result || []);

//       updateState({
//         markedDates: marked,
//         allMeetings: validMeetings,
//         filteredMeetings: validMeetings.filter(
//           m => dayjs(m.date).format('YYYY-MM-DD') === state.selectedDate,
//         ),
//       });
//     } catch (error) {
//       console.error('Fetch meetings error:', error);
//       Alert.alert('Error', 'Failed to fetch calendar data');
//     } finally {
//       updateState({loading: false});
//     }
//   };

//   const handleDeleteMeeting = async cal_id => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.deletemeeting,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {cal_id},
//         },
//       );

//       if (response?.result?.success) {
//         showFlashMessage({
//           message: 'Success',
//           description: 'Meeting deleted successfully.',
//           type: 'success',
//         });
//         fetchMeetings();
//       } else {
//         Alert.alert(
//           'Failed',
//           response?.result?.message || 'Unable to delete meeting',
//         );
//       }
//     } catch (error) {
//       console.error('Delete meeting error:', error);
//     }
//   };

//   const handleDayPress = day => {
//     const selectedDate = day.dateString;
//     const filtered = state.allMeetings.filter(
//       meeting => dayjs(meeting.date).format('YYYY-MM-DD') === selectedDate,
//     );
//     updateState({selectedDate, filteredMeetings: filtered});
//   };

//   useEffect(() => {
//     fetchMeetings();
//   }, []);

//   return (
//     <View
//       style={{
//         ...styles.container,
//         backgroundColor: isDarkMode ? COLORS.black : COLORS.BACKGROUND,
//       }}>
//       <HeaderCompo title={'Calendar'} />
//       <Calendar
//         onDayPress={handleDayPress}
//         markedDates={{
//           ...state.markedDates,
//           [state.selectedDate]: {
//             ...(state.markedDates[state.selectedDate] || {}),
//             selected: true,
//             selectedColor: '#007AFF',
//           },
//         }}
//         theme={{
//           selectedDayBackgroundColor: '#007AFF',
//           todayTextColor: '#007AFF',
//           arrowColor: '#007AFF',
//         }}
//       />

//       {state.loading ? (
//         <ActivityIndicator
//           size="large"
//           color="#007AFF"
//           style={{marginTop: 20}}
//         />
//       ) : (
//         <FlatList
//           data={state.filteredMeetings}
//           keyExtractor={(item, index) => `${item.cal_id || index}_${item.date}`}
//           renderItem={({item}) => (
//             <View style={styles.meetingCard}>
//               <View style={{flex: 1}}>
//                 <Text style={styles.meetingTitle}>
//                   {item.name || 'Untitled Meeting'}
//                 </Text>
//                 <Text style={styles.meetingDetail}>
//                   🗓{' '}
//                   {dayjs(item.date)
//                     // .add(5, 'hour')
//                     // .add(30, 'minute')
//                     .format('MMMM D, YYYY [at] h:mm A')}
//                 </Text>
//                 <Text style={styles.meetingDetail}>
//                   📍 {item.location || 'Location not set'}
//                 </Text>
//                 {Array.isArray(item.res_attendees) &&
//                   item.res_attendees.length > 0 && (
//                     <Text style={styles.meetingDetail}>
//                       👥{' '}
//                       {item.res_attendees
//                         .map(a =>
//                           typeof a[0] === 'string'
//                             ? a[0].replace(/\t/g, '').trim()
//                             : '',
//                         )
//                         .filter(Boolean)
//                         .join(', ') || 'No attendees'}
//                     </Text>
//                   )}

//                 {Array.isArray(item.emp_attendees) &&
//                   item.emp_attendees.length > 0 && (
//                     <Text style={styles.meetingDetail}>
//                       👥{' '}
//                       {item.emp_attendees
//                         .map(a =>
//                           typeof a[0] === 'string'
//                             ? a[0].replace(/\t/g, '').trim()
//                             : '',
//                         )
//                         .filter(Boolean)
//                         .join(', ') || 'No attendees'}
//                     </Text>
//                   )}

//                 <Text style={styles.meetingDetail}>
//                   ⏱ {item.duration || '1'} hour(s)
//                 </Text>
//                 <Text style={styles.meetingDetail}>
//                   Description: {item.description || 'NA'}
//                 </Text>

//                 <Text style={{...styles.meetingDetail, flex: 1}}>
//                   🔔 {item.reminders || 'None'}
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setSelectedItem(item);
//                     setIseditModalVisible(true);
//                   }}
//                   style={{...styles.edit}}>
//                   <FontAwesome5 name="edit" size={20} color="red" />
//                 </TouchableOpacity>
//               </View>
//               <TouchableOpacity
//                 onPress={() => handleDeleteMeeting(item.cal_id)}>
//                 <FontAwesome5 name="trash" size={20} color="red" />
//               </TouchableOpacity>
//             </View>
//           )}
//           ListEmptyComponent={
//             <Text style={styles.noMeetingText}>
//               No meetings for the selected date.
//             </Text>
//           }
//         />
//       )}
//       <TouchableOpacity style={styles.fab} onPress={() => setIsVisible(true)}>
//         <AntDesign name="pluscircle" size={60} color="#007AFF" />
//       </TouchableOpacity>
//       {/* <CreateMeetingForm
//              isvisible={isVisible}
//              onclose={()=>setIsVisible(false)}/> */}
//       <EditMeetingModal
//         isVisible={iseditModalalVisible}
//         onclose={() => setIseditModalVisible(false)}
//         editItem={selectedItem}
//       />
//       <CreatemeetingModal
//         isVisible={isVisible}
//         // onclose={() => setIsVisible(false)}
//         onclose={() => {
//           setIsVisible(false);
//           fetchMeetings(); 
//         }}
//         onSelectDate={state.selectedDate}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.BACKGROUND || '#F7F9FC',
//   },
//   meetingCard: {
//     backgroundColor: '#fff',
//     margin: 10,
//     padding: 16,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   meetingTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#007AFF',
//     marginBottom: 4,
//   },
//   meetingDetail: {
//     fontSize: 14,
//     color: '#333',
//     marginVertical: 2,
//   },
//   noMeetingText: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#999',
//   },
//   fab: {
//     position: 'absolute',
//     bottom: 24,
//     right: 24,
//   },
//   edit: {
//     padding: 10,
//     backgroundColor: COLORS.BLUE,
//     width: 80,
//     alignItems: 'center',
//     borderRadius: 50,
//     marginTop: 10,
//   },
// });

// export default CalendarScreen;
// // Jamshed end 2555


// CalendarScreen.jsx — Professionally Refactored
// Author: Jamshed | Refactored for UI excellence & clean architecture

import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  useColorScheme,
  Animated,
  Dimensions,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { AuthContext } from '../../Screens/Context';
import urls from '../../../url';
import makeApiCall from '../../utils/apiHelper';
import { showFlashMessage } from '../../utils/fleshmessage';
import HeaderCompo from '../../components/HeaderCompo';
import EditMeetingModal from '../../constaints/EditMeetingModal';
import CreatemeetingModal from '../../constaints/CreatemeetingModal';
import { COLORS } from '../../styles/Colors';

dayjs.extend(utc);
dayjs.extend(timezone);

// ─── Constants ───────────────────────────────────────────────────────────────

const IST_OFFSET_HOURS = 5;
const IST_OFFSET_MINUTES = 30;
const ACCENT = COLORS.BUTTON || '#007AFF';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const THEME = {
  light: {
    background: '#F0F4FF',
    card: '#FFFFFF',
    text: '#1A1D2E',
    subText: '#6B7280',
    border: '#E5E9F2',
    calendarBg: '#FFFFFF',
    emptyText: '#9CA3AF',
    shadow: '#000',
  },
  dark: {
    background: '#0F1117',
    card: '#1C1F2E',
    text: '#F1F3FF',
    subText: '#8B92A5',
    border: '#2A2D3E',
    calendarBg: '#1C1F2E',
    emptyText: '#4B5563',
    shadow: '#000',
  },
};

// ─── Utility Functions ───────────────────────────────────────────────────────

/** Converts a UTC date string to IST (UTC+5:30) */
const toIST = (dateStr) =>
  dayjs(dateStr).add(IST_OFFSET_HOURS, 'hour').add(IST_OFFSET_MINUTES, 'minute');

/** Formats a date string to 'YYYY-MM-DD' in IST */
const toISTDateKey = (dateStr) => toIST(dateStr).format('YYYY-MM-DD');

/** Returns a display-friendly datetime string */
const formatDisplayDate = (dateStr) =>
  dayjs(dateStr).format('MMMM D, YYYY [at] h:mm A');

/** Cleans attendee name from raw tuple array */
const extractAttendeeName = (a) =>
  typeof a[0] === 'string' ? a[0].replace(/\t/g, '').trim() : '';

/** Formats attendees array into a readable string */
const formatAttendees = (attendees) =>
  Array.isArray(attendees) && attendees.length > 0
    ? attendees.map(extractAttendeeName).filter(Boolean).join(', ')
    : null;
const formatDuration = (duration) => {
  if (!duration) return '1 hr';

  let hours = Math.floor(duration);
  let minutes = Math.round((duration - hours) * 60);

  if (minutes === 60) {
    hours += 1;
    minutes = 0;
  }

  let result = '';

  if (hours > 0) {
    result += `${hours} hr${hours > 1 ? 's' : ''}`;
  }

  if (minutes > 0) {
    result += `${hours > 0 ? ' ' : ''}${minutes} min`;
  }

  return result || '0 min';
};

// ─── Sub-Components ──────────────────────────────────────────────────────────

const MeetingBadge = ({ label }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

const DetailRow = ({ icon, text, color = '#6B7280' }) => {
  if (!text) return null;
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <Text style={[styles.detailText, { color }]} numberOfLines={2}>
        {text}
      </Text>
    </View>
  );
};

const MeetingCard = ({ item, onEdit, onDelete, colors }) => {
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

const resourceAttendees = formatAttendees(item?.res_attendees);
const employeeAttendees = formatAttendees(item?.emp_attendees);
const tagAttendees = formatAttendees(item?.tags);
console.log(tagAttendees,'tagAttendees')




// 💪 Fully safe function
const fixNames = (arr) => {
  if (!arr) return [];

  // Agar string hai
  if (typeof arr === 'string') {
    return arr.trim() ? [arr.trim()] : [];
  }

  // Agar array hai
  if (Array.isArray(arr)) {
    return arr
      .map(name => {
        if (!name) return null;

        // Agar character array hai → join karo
        if (Array.isArray(name)) {
          return name.join('').trim();
        }

        // Agar string hai
        if (typeof name === 'string') {
          return name.trim();
        }

        return null;
      })
      .filter(Boolean); // null/empty remove
  }

  return [];
};

const attendeesinfo = [
  ...fixNames(resourceAttendees),
  ...fixNames(employeeAttendees),
];

// ❌ empty values remove + duplicate remove (optional)
const uniqueAttendees = [...new Set(attendeesinfo.filter(Boolean))];

// ✅ Final output
const attendees = uniqueAttendees.join(', ');

console.log(attendees, 'oooo');


  // const attendees =
  //   formatAttendees(item.res_attendees) || formatAttendees(item.emp_attendees);

  return (
    <Animated.View style={[styles.meetingCard, { backgroundColor: colors.card, opacity: fadeAnim }]}>
      {/* Left accent strip */}
      <View style={styles.cardAccent} />

      <View style={styles.cardContent}>
        {/* Header Row */}
        <View style={styles.cardHeader}>
          <Text style={[styles.meetingTitle, { color: ACCENT }]} numberOfLines={1}>
            {item.name || 'Untitled Meeting'}
          </Text>
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => onEdit(item)}>
              <FontAwesome5 name="edit" size={15} color={ACCENT} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, styles.deleteBtn]} onPress={() => onDelete(item.cal_id)}>
              <FontAwesome5 name="trash" size={15} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Details */}
        <DetailRow icon="🗓" text={formatDisplayDate(item.date)} />
        <DetailRow icon="📍" text={item.location || 'Location not set'} />
        {tagAttendees && <DetailRow icon="🏷️" text={tagAttendees} />}
        {attendees && <DetailRow icon="👥" text={attendees} />}
        {/* <DetailRow icon="⏱" text={`${item.duration || '1'} hour(s)`} /> */}
        <DetailRow icon="⏱" text={`${formatDuration(item.duration)}`} />
        {item.description && <DetailRow icon="📝" text={item.description} />}

        {/* Footer */}
        <View style={styles.cardFooter}>
          {item.reminders && item.reminders !== 'None' && (
            <MeetingBadge label={`🔔 ${item.reminders}`} />
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const EmptyState = ({ colors }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyIcon}>📭</Text>
    <Text style={[styles.emptyTitle, { color: colors.text }]}>No Meetings</Text>
    <Text style={[styles.emptySubtitle, { color: colors.emptyText }]}>
      Nothing scheduled for this day.{'\n'}Tap + to create one.
    </Text>
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const CalendarScreen = () => {
  const user = useSelector((state) => state.user.userDatainfo);
  const { currentUrl: server_origin } = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];

  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);
  const [allMeetings, setAllMeetings] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // ── Derived State ──────────────────────────────────────────────────────────

  const filteredMeetings = useMemo(
    () => allMeetings.filter((m) => dayjs(m.date).format('YYYY-MM-DD') === selectedDate),
    [allMeetings, selectedDate],
  );

  const calendarMarks = useMemo(
    () => ({
      ...markedDates,
      [selectedDate]: {
        ...(markedDates[selectedDate] || {}),
        selected: true,
        selectedColor: ACCENT,
      },
    }),
    [markedDates, selectedDate],
  );

  // ── Data Processing ────────────────────────────────────────────────────────

  const processMeetings = useCallback((meetings = []) => {
    const marked = {};
    const valid = [];

    meetings.forEach((meeting) => {
      if (!meeting.date || !dayjs(meeting.date).isValid()) return;

      const istDate = toIST(meeting.date);
      const dateKey = istDate.format('YYYY-MM-DD');

      marked[dateKey] = {
        marked: true,
        dotColor: ACCENT,
      };

      valid.push({ ...meeting, date: istDate.toISOString() });
    });

    return { marked, valid };
  }, []);

  // ── API Calls ──────────────────────────────────────────────────────────────

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    console.log('calinggggggg')
    try {
      const response = await makeApiCall(server_origin, urls.getcalndermeetingData, 'POST', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          employeeCode: user.result.emp_code,
          auto_sync: true,
        },
      });
      // console.log(response,'response,response')

      const { marked, valid } = processMeetings(response?.result);
      setMarkedDates(marked);
      setAllMeetings(valid);
    } catch (error) {
      console.error('[CalendarScreen] fetchMeetings error:', error);
      Alert.alert('Error', 'Failed to fetch calendar data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [server_origin, user, processMeetings]);

  const handleDeleteMeeting = useCallback(
    (cal_id) => {
      Alert.alert(
        'Delete Meeting',
        'Are you sure you want to delete this meeting?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                const response = await makeApiCall(server_origin, urls.deletemeeting, 'POST', {
                  jsonrpc: '2.0',
                  method: 'call',
                  params: { cal_id },
                });

                if (response?.result?.success) {
                  showFlashMessage({
                    message: 'Deleted',
                    description: 'Meeting removed successfully.',
                    type: 'success',
                  });
                  fetchMeetings();
                } else {
                  Alert.alert('Failed', response?.result?.message || 'Unable to delete meeting.');
                }
              } catch (error) {
                console.error('[CalendarScreen] handleDeleteMeeting error:', error);
                Alert.alert('Error', 'Something went wrong. Please try again.');
              }
            },
          },
        ],
      );
    },
    [server_origin, fetchMeetings],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleDayPress = useCallback(({ dateString }) => {
    setSelectedDate(dateString);
  }, []);

  const handleEditPress = useCallback((item) => {
    console.log(item,'wowowowowo')
    setSelectedItem(item);
    setIsEditVisible(true);
  }, []);

  const handleCreateClose = useCallback(() => {
    setIsCreateVisible(false);
    fetchMeetings();
  }, [fetchMeetings]);

  
  const handleEditClose = useCallback(() => {
    setIsEditVisible(false);
    setSelectedItem(null);
     fetchMeetings();
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderCompo title="Calendar" />

      {/* Calendar */}
      <View style={[styles.calendarWrapper, { backgroundColor: colors.calendarBg }]}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={calendarMarks}
          theme={{
            backgroundColor: colors.calendarBg,
            calendarBackground: colors.calendarBg,
            textSectionTitleColor: colors.subText,
            selectedDayBackgroundColor: ACCENT,
            selectedDayTextColor: '#ffffff',
            todayTextColor: ACCENT,
            dayTextColor: colors.text,
            textDisabledColor: colors.emptyText,
            dotColor: ACCENT,
            selectedDotColor: '#ffffff',
            arrowColor: ACCENT,
            monthTextColor: colors.text,
            indicatorColor: ACCENT,
            textDayFontWeight: '500',
            textMonthFontWeight: '700',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 14,
            textMonthFontSize: 16,
          }}
        />
      </View>

      {/* Meeting Count Badge */}
      <View style={[styles.sectionHeader, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {dayjs(selectedDate).format('dddd, MMMM D')}
        </Text>
        {filteredMeetings.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{filteredMeetings.length}</Text>
          </View>
        )}
      </View>

      {/* Meetings List */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={ACCENT} />
          <Text style={[styles.loadingText, { color: colors.subText }]}>Loading meetings…</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMeetings}
          keyExtractor={(item, index) => `${item.cal_id ?? index}_${item.date}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MeetingCard
              item={item}
              onEdit={handleEditPress}
              onDelete={handleDeleteMeeting}
              colors={colors}
            />
          )}
          ListEmptyComponent={<EmptyState colors={colors} />}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsCreateVisible(true)}
        activeOpacity={0.85}>
        <View style={styles.fabInner}>
          <AntDesign name="plus" size={26} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Modals */}
      <EditMeetingModal
        isVisible={isEditVisible}
        onclose={handleEditClose}
        editItem={selectedItem}
      />
      <CreatemeetingModal
        isVisible={isCreateVisible}
        onclose={handleCreateClose}
        onSelectDate={selectedDate}
      />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Calendar
  calendarWrapper: {
    marginHorizontal: 12,
    // marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  countBadge: {
    backgroundColor: ACCENT,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  countBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  // List
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },

  // Meeting Card
  meetingCard: {
    flexDirection: 'row',
    borderRadius: 14,
    marginVertical: 6,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  cardAccent: {
    width: 4,
    backgroundColor: ACCENT,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  meetingTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EBF3FF',
  },
  deleteBtn: {
    backgroundColor: '#FFF0EF',
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 6,
  },

  // Detail Row
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
    gap: 6,
  },
  detailIcon: {
    fontSize: 13,
    marginTop: 1,
  },
  detailText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },

  // Badge
  badge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    color: '#E65100',
    fontWeight: '600',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Loader
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 22,
  },
  fabInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
});

export default CalendarScreen;