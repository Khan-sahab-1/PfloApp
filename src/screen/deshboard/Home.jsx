// Jamshed start bug id   2555
// Description: This file defines the Home component, which serves as the main dashboard for the application. It displays user information, attendance status, and provides navigation to various features such as leave requests, notifications, and sign-out. The component fetches user data from the server, manages check-in/check-out functionality with time tracking, and integrates with the device's calendar to manage meetings. The design is responsive to light and dark themes, and it includes error handling for API calls and user interactions to ensure a smooth user experience.

import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Alert,
  AppState,
  PermissionsAndroid,
  useColorScheme,
  Platform,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../styles/Colors';
import ButtonCompo from '../../components/ButtonCompo';
import {AuthContext} from '../../Screens/Context';
import urls from '../../../url';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserData} from '../../redux/reducers/Userinforeducers';
import requestCalendarPermission from '../../utils/CalenderPermission';
import RNCalendarEvents from 'react-native-calendar-events';
import {requestLocationPermission} from '../../utils/permissionUtils';
import Geolocation from 'react-native-geolocation-service';
import makeApiCall from '../../utils/apiHelper';
import {getGreeting} from '../../utils/greeting';
import {launchImageLibrary} from 'react-native-image-picker';
import navigationString from '../../route/navigationString';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../components/Loader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import BackgroundService from 'react-native-background-actions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  isTrackingRunning,
  startTracking,
  stopTracking,
} from '../../components/BackgroundLocationService';
import {
  getEmployeePunchTime,
  removeLegacyPunchTime,
} from '../../utils/attendanceStorage';
import DeviceInfo from 'react-native-device-info';
const DashboardScreen = ({navigation, route}) => {
  // console.log(route?.,'Route Params in Home Screen')
  const [userData, setUserData] = useState(null);
  const [checkInTime, setCheckInTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [meetings, setMeetings] = useState([]);
  const contextType = useContext(AuthContext);
  const [imageUri, setImageUri] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  // console.log(checkInTime, 'TimePunhsfshgshs');
  const [isPressed, setIsPressed] = useState(false);

  const server_origin = contextType.currentUrl;
  const getHomePageData = server_origin + urls.getHomepageData;
  const getMeetingData = server_origin + urls.getCalendarData;
  const isLeaveManager = userData?.result?.leave_manager;
  const getNotification = server_origin + urls.getNotificationData;
  const isParent =
    userData?.result?.parent && userData.result.parent !== 'hr.employee()';
  const natificationCount = notificationCount || 0;
  const employeeLeaveCode = userData?.result?.emp_code;
  // console.log(employeeLeaveCode, 'Employee Code');
  // console.log(meetings, 'server Mil raha h');
  console.log(userData, 'User data->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  const colorschema = useColorScheme();
  const isDark = colorschema === 'dark';
  const [isTodayPunched, setIsTodayPunched] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('Check In');
  const [punchType, setPunchType] = useState(null);
  const [isLoding, setisLoding] = useState(false);
  const [trackingActive, setTrackingActive] = useState(isTrackingRunning());

  const isTablet = DeviceInfo.isTablet();
  let type = DeviceInfo.getDeviceType();

console.log('Tablet:', isTablet,type);

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          setImageUri(uri);
        }
      }
    });
  };

  useEffect(() => {
    // getCurrentLocation()
    // fetchlocationdata()
  }, []);
  const fetchUserDataApi = async () => {
    try {
      setisLoding(true);
      const response = await fetch(getHomePageData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {},
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const userData = await response.json();
      console.log('&&&&&&&&&&&&', userData);
      setUserData(userData);
      // fetchCalendarData(userData.result.emp_code);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setisLoding(false);
    }
  };

  // jamshed ali start bug id 2810 notification count not updating in home screen after approval or reject leave request
  const fetchNotificationData = async () => {
    try {
      const response = await fetch(getNotification, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {employeeLeaveCode},
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Notification data----', data);
      // setNotificationData(data.result);
      const draftRecords = data.result.filter(item => item.state === 'confirm');
      setNotificationCount(draftRecords.length);
      console.log(draftRecords.length, 'Notification count in home screen');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchNotificationData();
    }, [employeeLeaveCode]),
  );

  const fetchCalendarData = async () => {
    if (!userData || !userData.result || !userData.result.emp_code) {
      console.error('Employee code is missing or user data is not available');
      return;
    }
    try {
      const response = await fetch(getMeetingData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {employeeCode: userData.result.emp_code},
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const meetData = await response.json();
      console.log('======Meeting Data=======', meetData);
      const validMeetings = meetData.result.filter(meeting => !meeting.archive);
      setMeetings(validMeetings);
      for (const meeting of validMeetings) {
        if (!meeting.event_id && !meeting.auto_sync) {
          const newEventId = await addMeetingToCalendar(meeting);
          if (newEventId) {
            await updateEventId(newEventId, meeting.activity_id);
          }
        }
      }
      const archivedMeetings = meetData.result.filter(
        meeting => meeting.archive,
      );
      for (const meeting of archivedMeetings) {
        await removeMeetingFromCalendar(meeting);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
  };

  const removeMeetingFromCalendar = async meeting => {
    if (meeting.event_id) {
      try {
        await RNCalendarEvents.removeEvent(meeting.event_id);
        console.log(
          `Meeting "${meeting.name}" removed from calendar with event ID: ${meeting.event_id}`,
        );
      } catch (error) {
        console.error('Error removing event from calendar:', error);
      }
    } else {
      console.log('No event ID found to remove from calendar.');
    }
  };

  const updateEventId = async (newEventId, oldEventId) => {
    const response = await fetch(`${server_origin}/calendar/update_event_id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          employeeCode: userData.result.emp_code,
          oldEventId: oldEventId,
          newEventId: newEventId,
        },
      }),
    });
    const result = await response.json();
    console.log('Update Event ID Response:', result);
  };

  const addMeetingToCalendar = async meeting => {
    const granted = await requestCalendarPermission();
    if (!granted) {
      Alert.alert(
        'Permission Denied',
        'Cannot access calendar without permission.',
      );
      return;
    }
    console.log('Attendee Emails:', meeting.attendee_name);
    try {
      const calendars = await RNCalendarEvents.findCalendars();
      const primaryCalendar = calendars.find(
        c => c.isPrimary && c.allowsModifications,
      );
      if (!primaryCalendar) {
        // Alert.alert('No modifiable calendar found');
        return;
      }
      if (meeting.event_id || meeting.auto_sync) {
        console.log(
          `Skipping creation for meeting "${meeting.name}" as auto_sync is true`,
        );
        return;
      }
      let reminderMinutes = 15;
      if (typeof meeting.reminders === 'string') {
        const reminderMatch = meeting.reminders.match(
          /(\d+)\s*(Hour|Minute|Day)/,
        );
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
      const utcDate = new Date(meeting.date);
      const timezoneOffset = new Date().getTimezoneOffset();
      const localDate = new Date(
        utcDate.getTime() - timezoneOffset * 60 * 1000,
      );
      const localEndDate = new Date(
        localDate.getTime() + meeting.duration * 60 * 60 * 1000,
      );
      const startDateISO = localDate.toISOString();
      const endDateISO = localEndDate.toISOString();
      const attendeesString = meeting.attendee_name.join(', ');
      const newEventId = await RNCalendarEvents.saveEvent(meeting.name, {
        calendarId: primaryCalendar.id,
        startDate: startDateISO,
        endDate: endDateISO,
        location: meeting.location,
        alarms: [{date: reminderMinutes}],
      });
      if (newEventId) {
        console.log(
          `Meeting "${meeting.name}" added to calendar with event ID: ${newEventId}`,
        );
        return newEventId;
      }
    } catch (error) {
      console.error('Error adding event to calendar:', error);
    }
  };
  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  // useEffect(() => {
  //   const loadCheckInTime = async () => {
  //     const storedTime = await AsyncStorage.getItem('checkInTime');
  //     if (storedTime) {
  //       setCheckInTime(parseInt(storedTime, 10));
  //     }
  //   };
  //   loadCheckInTime();
  // }, []);

  useEffect(() => {
    fetchUserDataApi();
    // getPunchTime();
  }, []);
  useFocusEffect(
    useCallback(() => {
      const employeeCode = userData?.result?.emp_code;
      setCheckInTime(null);
      setButtonLabel('Check In');
      setPunchType('OUT');
      if (employeeCode) {
        getPunchTime(employeeCode);
      }
    }, [userData?.result?.emp_code]),
  );

  const handleLeaveRequest = () => {
    if (userData) {
      navigation.navigate(navigationString.LEAVEREQUEST, {
        userName: userData.result.name,
        employeeCode: userData.result.emp_code,
        userId: userData.result.emp_id,
        isManager: userData.result.parent,
        leaveManager: userData.result.leave_manager,
      });
    } else {
      console.error('User data is not available');
    }
  };

  const handleLeaveData = () => {
    if (userData) {
      navigation.navigate('LeaveData', {
        userName: userData.result.name,
        employeeCode: userData.result.emp_code,
        userId: userData.result.emp_id,
      });
    } else {
      console.error('User data is not available');
    }
  };
  const handlesignout = async () => {
    try {
      await stopTracking();
      setTrackingActive(false);
      // await AsyncStorage.removeItem('userData');
      // await AsyncStorage.removeItem('token');
      navigation.reset({index: 0, routes: [{name: 'Login'}]});
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNotification = () => {
    if (
      userData &&
      ((userData.result.parent && userData.result.parent !== 'hr.employee()') ||
        userData.result.leave_manager)
    ) {
      navigation.navigate('NotificationPage', {
        userName: userData.result.name,
        employeeCode: userData.result.emp_code,
        userId: userData.result.emp_id,
      });
    } else {
      console.error('User data is not available or parent field is empty');
    }
  };

  const getPunchTime = async employeeCode => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await removeLegacyPunchTime();
      const punchTime = await getEmployeePunchTime(employeeCode);

      if (punchTime) {
        const punchDate = new Date(punchTime).toISOString().split('T')[0];
        if (punchDate === today) {
          setButtonLabel('Check Out');
          setPunchType('IN');
          setCheckInTime(punchTime);
        } else {
          setButtonLabel('Check In');
          setPunchType('OUT');
          setCheckInTime(null);
        }
      } else {
        setButtonLabel('Check In');
        setPunchType('OUT');
        setCheckInTime(null);
      }
    } catch (error) {
      console.error('Error fetching punch time:', error);
      setButtonLabel('Check In');
      setPunchType('OUT');
      setCheckInTime(null);
    }
  };
const handleLiveTracking = () => {
  navigation.navigate(navigationString.MAPSPREVIEW, {
    userinfo: userData?.result,
  });
};


  const activeTracking = (
    <View style={styles.activeTrackingContainer}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.statusLabel}>Tracking Status</Text>
          <Text style={styles.statusText}>
            {trackingActive ? 'Active' : 'Inactive'}
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <Icon name="heart-pulse" size={34} color="#20C05C" />
        </View>
      </View>

      <Text style={styles.dutyText}>
        You are on duty{'\n'}
        <Text style={styles.sinceText}>Since {checkInTime}</Text>
      </Text>

      <TouchableOpacity
        style={styles.liveButton}
        onPress={() => {
          // console.log("Button Pressed");
          trackingActive ? onStop() : onStart();
          // onStop();
          // navigation.navigate(navigationString.MAPSPREVIEW, {
          // latitude: 37.78825, // Replace with actual latitude
          // longitude: -122.4324, // Replace with actual longitude
          // })
        }}>
        <Text style={styles.liveButtonText}>
          {trackingActive ? 'Stop Tracking' : 'Start Tracking'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const onStart = async () => {
    try {
      console.log('[PFLO Tracking] Start button pressed', {
        employeeCode: userData?.result?.emp_code,
        trackingEnabled: userData?.result?.live_tracking_enabled,
        hasToken: Boolean(userData?.result?.live_tracking_api_token),
        serverOrigin: server_origin,
      });
      const started = await startTracking({
        userinfo: userData?.result,
        serverOrigin: server_origin,
      });
      console.log('[PFLO Tracking] Start result', {started});
      setTrackingActive(started);
      if (!started) {
        Alert.alert(
          'Live tracking unavailable',
          'Tracking must be enabled for your account and location permission must be allowed.',
        );
      }
    } catch (e) {
      console.error('[PFLO Tracking] Start failed', {
        message: e?.message,
        stack: e?.stack,
      });
    }
  };

  const onStop = async () => {
    try {
      await stopTracking();
      setTrackingActive(false);
    } catch (e) {
      console.error('[PFLO Tracking] Stop failed', {
        message: e?.message,
        stack: e?.stack,
      });
    }
  };

  const canReviewLeaves =
    userData &&
    ((userData.result.parent && userData.result.parent !== 'hr.employee()') ||
      userData.result.leave_manager);

  const ActionCard = ({
    icon,
    title,
    subtitle,
    color,
    background,
    onPress,
    badge,
  }) => (
    <TouchableOpacity
      activeOpacity={0.82}
      style={[styles.quickAction, {backgroundColor: background}]}
      onPress={onPress}>
      <View style={[styles.quickActionIcon, {backgroundColor: color}]}>
        <Ionicons name={icon} size={22} color="#FFFFFF" />
        {badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.quickActionCopy}>
        <Text style={[styles.actionLabel, isDark && styles.textLight]}>
          {title}
        </Text>
        <Text style={styles.actionSubtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <Ionicons name="arrow-forward" size={18} color={color} />
    </TouchableOpacity>
  );

  return (
    <>
      {/* <StatusBar barStyle="light-content" backgroundColor="#071B35" /> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        >
        <View style={styles.hero}>
          {/* <View style={styles.heroOrbOne} /> */}
          {/* <View style={styles.heroOrbTwo} /> */}
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.name} numberOfLines={1}>
                {userData?.result?.name || 'Welcome back'}
              </Text>
            </View>
            {/* <TouchableOpacity
              activeOpacity={0.8}
              style={styles.avatarButton}
              onPress={openImagePicker}>
              <Image
                source={
                  imageUri ? {uri: imageUri} : require('../../assets/User.jpeg')
                }
                resizeMode="cover"
                style={styles.profileImage}
              />
              <View style={styles.avatarStatus} />
            </TouchableOpacity> */}
          </View>
          <View style={styles.datePill}>
            <Ionicons name="calendar-outline" size={14} color="#BFD7FF" />
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                day: '2-digit',
                month: 'short',
              })}
            </Text>
          </View>
          <View style={styles.attendanceCard}>
            <View style={styles.attendanceTopRow}>
              <View style={styles.attendanceHeading}>
                <Text style={styles.attendanceEyebrow}>TODAY'S ATTENDANCE</Text>
                <Text style={styles.attendanceTitle}>
                  {checkInTime ? 'Checked in' : 'Ready when you are'}
                </Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  checkInTime && styles.statusPillActive,
                ]}>
                <View
                  style={[
                    styles.statusDot,
                    checkInTime && styles.statusDotActive,
                  ]}
                />
                <Text
                  style={[
                    styles.statusPillText,
                    checkInTime && styles.statusPillTextActive,
                  ]}>
                  {checkInTime ? 'On duty' : 'Not started'}
                </Text>
              </View>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.attendanceTime}>
                {checkInTime ? moment(checkInTime).format('hh:mm') : '--:--'}
              </Text>
              <Text style={styles.attendancePeriod}>
                {checkInTime ? moment(checkInTime).format('A') : ''}
              </Text>
            </View>
            <Text style={styles.timeCaption}>
              {checkInTime
                ? 'Your check-in time'
                : 'You have not checked in today'}
            </Text>
            <ButtonCompo
              title={buttonLabel}
              backgroundColor={checkInTime ? '#EEF4FF' : '#176BFF'}
              textColor={checkInTime ? '#176BFF' : '#FFFFFF'}
              borderRadius={16}
              padding={10}
              style={styles.attendanceButton}
              textStyle={styles.attendanceButtonText}
              onPress={() =>
                navigation.navigate('Selfie', {
                  attendanceAction:
                    buttonLabel === 'Check In' ? 'CHECK_IN' : 'CHECK_OUT',
                  userinfo: userData?.result,
                })
              }
            />
          </View>
        </View>

        <View style={[styles.content, isDark && styles.contentDark]}>
          {/* {userData?.result?.live_tracking_enabled ? activeTracking : null} */}
          <View style={styles.sectionHeadingRow}>
            <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
              Quick actions
            </Text>
            <Text style={styles.sectionSubtitle}>
              Everything you need, one tap away
            </Text>
          </View>
          <View style={styles.actionsGrid}>
            <ActionCard
              icon="add-circle-outline"
              title="Request leave"
              subtitle="Create a new request"
              color="#176BFF"
              background={isDark ? '#132238' : '#EDF4FF'}
              onPress={handleLeaveRequest}
            />
            <ActionCard
              icon="document-text-outline"
              title="Leave records"
              subtitle="View your history"
              color="#7C3AED"
              background={isDark ? '#211A38' : '#F4F0FF'}
              onPress={handleLeaveData}
            />
            {canReviewLeaves && (
              <ActionCard
                icon="notifications-outline"
                title="Notifications"
                subtitle="Review team requests"
                color="#E8590C"
                background={isDark ? '#342117' : '#FFF3E9'}
                badge={natificationCount}
                onPress={handleNotification}
              />
            )}
            {canReviewLeaves &&  <ActionCard
              icon="map"
              title="Live Tracking"
              subtitle="End this session"
              color="#26b2dc"
              background={isDark ? '#351B22' : '#c2daf7'}
              onPress={handleLiveTracking}
            />}
           { <ActionCard
              icon="log-out-outline"
              title="Sign out"
              subtitle="End this session"
              color="#DC2626"
              background={isDark ? '#351B22' : '#FFF0F1'}
              onPress={handlesignout}
            />}
            
          </View>
          {/* <Text style={styles.footerText}>PFLO • WORK, BEAUTIFULLY</Text> */}
        </View>
        <Loader visible={isLoding} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#071B35'},
  safeAreaDark: {backgroundColor: '#07111F'},
  scrollContent: {flexGrow: 1, backgroundColor: '#F6F8FC'},
  hero: {
    backgroundColor: '#071B35',
    paddingHorizontal: 20,
    // paddingTop: 12,
    paddingBottom: 10,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: 'hidden',
  },

 
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerCopy: {flex: 1, paddingRight: 16},
  greeting: {
    fontSize: 12,
    color: '#9EB7D5',
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  avatarButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 3,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  profileImage: {width: 50, height: 50, borderRadius: 25},
  avatarStatus: {
    position: 'absolute',
    width: 13,
    height: 13,
    borderRadius: 7,
    right: 1,
    bottom: 3,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#071B35',
  },
  datePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 14,
  },
  dateText: {color: '#D7E7FA', fontSize: 10, fontWeight: '600'},
  attendanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 14},
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  attendanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  attendanceHeading: {flex: 1, paddingRight: 8},
  attendanceEyebrow: {
    fontSize: 8,
    color: '#718096',
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  attendanceTitle: {
    fontSize: 14,
    color: '#10233E',
    fontWeight: '800',
    marginTop: 5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },
  statusPillActive: {backgroundColor: '#E9FAF1'},
  statusDot: {width: 7, height: 7, borderRadius: 4, backgroundColor: '#94A3B8'},
  statusDotActive: {backgroundColor: '#18A957'},
  statusPillText: {fontSize: 10, color: '#64748B', fontWeight: '700'},
  statusPillTextActive: {color: '#108443'},
  timeRow: {flexDirection: 'row', alignItems: 'baseline', marginTop: 10},
  attendanceTime: {
    fontSize: 20,
    color: '#0C1F3A',
    fontWeight: '800',
    letterSpacing: -2,
  },
  attendancePeriod: {
    fontSize: 14,
    color: '#176BFF',
    fontWeight: '800',
    marginLeft: 8,
  },
  timeCaption: {fontSize: 10, color: '#7B8CA4', marginTop: 1},
  attendanceButton: {marginTop: 16, marginBottom: 0},
  attendanceButtonText: {fontSize: 13, fontWeight: '800'},
  content: {
    flex: 1,
    backgroundColor: '#F6F8FC',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  contentDark: {backgroundColor: '#08111F'},
  textLight: {color: '#F8FAFC'},
  sectionHeadingRow: {marginBottom: 12},
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10233E',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {fontSize: 10, color: '#8290A5', marginTop: 4},
  actionsGrid: {gap: 11},
  quickAction: {
    minHeight: 78,
    borderRadius: 20,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionCopy: {flex: 1, marginLeft: 13},
  actionLabel: {fontSize: 12, color: '#13243D', fontWeight: '800'},
  actionSubtitle: {fontSize: 10, color: '#7C899C', marginTop: 4},
  badge: {
    position: 'absolute',
    top: -6,
    right: -7,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {color: '#FFFFFF', fontSize: 9, fontWeight: '800'},
  activeTrackingContainer: {
    backgroundColor: '#0D8F55',
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
  },
  topRow: {flexDirection: 'row', justifyContent: 'space-between'},
  statusLabel: {fontSize: 12, color: '#CCFBE1', fontWeight: '700'},
  statusText: {fontSize: 28, fontWeight: '800', color: '#FFFFFF'},
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dutyText: {color: '#FFFFFF', fontSize: 14, fontWeight: '600', lineHeight: 22},
  sinceText: {fontSize: 12, color: '#D1FAE5'},
  liveButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  liveButtonText: {color: '#0D8F55', fontSize: 13, fontWeight: '800'},
  footerText: {
    textAlign: 'center',
    color: '#A8B2C1',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginTop: 28,
  },
});

export default DashboardScreen;
// Jamshed end bug id   2555
