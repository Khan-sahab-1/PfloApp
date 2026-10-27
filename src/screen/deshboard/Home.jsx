import {logoutAttendance} from '../../offline/session';
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
import LocationDisclosureModal from '../../components/LocationDisclosureModal';
import {
  hasAcceptedLocationDisclosure,
  setLocationDisclosureAccepted,
  requestGooglePlayCompliantPermissions,
} from '../../utils/locationDisclosure';
import {
  getEmployeePunchTime,
  removeLegacyPunchTime,
} from '../../utils/attendanceStorage';
import DeviceInfo from 'react-native-device-info';
const DashboardScreen = ({navigation, route}) => {
  // console.log(route?.,'Route Params in Home Screen')
  const [userData, setUserData] = useState(null);
  const [checkInTime, setCheckInTime] = useState(null);
  const [showLocationDisclosure, setShowLocationDisclosure] = useState(false);
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
      await logoutAttendance();
      await stopTracking().catch(() => {});
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
          <Icon name="heart-pulse" size={26} color="#20C05C" />
        </View>
      </View>

      <Text style={styles.dutyText}>
        You are on duty{'\n'}
        <Text style={styles.sinceText}>Since {checkInTime}</Text>
      </Text>

      <TouchableOpacity
        style={styles.liveButton}
        onPress={() => {
          trackingActive ? onStop() : onStart();
        }}>
        <Text style={styles.liveButtonText}>
          {trackingActive ? 'Stop Tracking' : 'Start Tracking'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    const checkDisclosure = async () => {
      const accepted = await hasAcceptedLocationDisclosure();
      if (!accepted) {
        setShowLocationDisclosure(true);
      }
    };
    checkDisclosure();
  }, []);

  const performStartTracking = async () => {
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

  const onStart = async () => {
    const accepted = await hasAcceptedLocationDisclosure();
    if (!accepted) {
      setShowLocationDisclosure(true);
      return;
    }
    await performStartTracking();
  };

  const handleAcceptDisclosure = async () => {
    setShowLocationDisclosure(false);
    await setLocationDisclosureAccepted(true);
    await requestGooglePlayCompliantPermissions();
    if (userData?.result?.live_tracking_enabled) {
      await performStartTracking();
    }
  };

  const handleDenyDisclosure = () => {
    setShowLocationDisclosure(false);
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

  const employeeName = userData?.result?.name?.trim() || 'Welcome back';
  const initials = employeeName.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  const surface = isDark ? '#192522' : '#FFFFFF';
  const ink = isDark ? '#F1F5EF' : '#18352D';

  const ActionCard = ({icon, title, subtitle, color, onPress, badge}) => (
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={`${title}. ${subtitle}`}
      activeOpacity={0.75} onPress={onPress}
      style={[styles.quickAction, {backgroundColor: surface, borderColor: isDark ? '#2D3B35' : '#E6EAE1'}]}>
      <View style={styles.actionTop}>
        <View style={[styles.quickActionIcon, {backgroundColor: isDark ? '#29382F' : '#F2F5EC'}]}>
          <Ionicons name={icon} size={18} color={isDark ? '#C4DBA4' : color} />
          {badge > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text></View>}
        </View>
        <Ionicons name="arrow-up-outline" size={14} color={isDark ? '#8CA294' : '#87998C'} style={styles.diagonalArrow} />
      </View>
      <Text style={[styles.actionLabel, {color: ink}]}>{title}</Text>
      <Text style={[styles.actionSubtitle, isDark && styles.mutedDark]}>{subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}
      style={{backgroundColor: isDark ? '#101B17' : '#F5F6F0'}}
      contentContainerStyle={styles.scrollContent}>
      <View style={styles.hero}>
        <View pointerEvents="none" style={styles.heroRing} />
        <View pointerEvents="none" style={styles.heroRingInner} />
        <View style={styles.brandRow}>
          <View style={styles.brandLockup}>
            <View style={styles.brandMark}><Ionicons name="leaf" size={14} color="#193C31" /></View>
            <Text style={styles.brandText}>Pflo<Text style={styles.brandDot}>.</Text></Text>
          </View>
          <View style={styles.datePill}>
            <Ionicons name="calendar-outline" size={11} color="#D2DFC7" />
            <Text style={styles.dateText}>{new Date().toLocaleDateString('en-GB', {day: '2-digit', month: 'short'})}</Text>
          </View>
        </View>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.name} numberOfLines={2}>{employeeName}</Text>
            {/* <Text style={styles.heroCaption}>A little focus. A great day ahead.</Text> */}
          </View>
          <View style={styles.avatar}><Text style={styles.initials}>{initials}</Text></View>
        </View>
        {/* <View style={styles.heroBottom}>
          <View style={styles.employeeTag}><Ionicons name="id-card-outline" size={12} color="#B6CCBA" />
            <Text style={styles.employeeCode}>{userData?.result?.emp_code || 'Your workspace'}</Text>
          </View>
          <Text style={styles.dayText}>{new Date().toLocaleDateString('en-GB', {weekday: 'long'})}</Text>
        </View> */}
      </View>

      <View style={styles.body}>
        <View style={[styles.attendanceCard, {backgroundColor: surface, borderColor: isDark ? '#304136' : '#E3E8DC'}]}>
          <View style={styles.attendanceTopRow}>
            <View style={styles.attendanceHeading}>
              <Text style={[styles.attendanceEyebrow, isDark && styles.mutedDark]}>YOUR WORKDAY</Text>
              {/* <Text style={[styles.attendanceTitle, {color: ink}]}>{checkInTime ? 'Make today count.' : 'Let’s get started.'}</Text> */}
            </View>
            <View style={[styles.statusPill, checkInTime && styles.statusActive]}>
              <View style={[styles.statusDot, checkInTime && {backgroundColor: '#26704E'}]} />
              <Text style={styles.statusTextSmall}>{checkInTime ? 'On duty' : 'Not started'}</Text>
            </View>
          </View>
          <View style={styles.clockRow}>
            <View style={styles.clockCopy}>
              <View style={styles.timeRow}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.attendanceTime, {color: ink}]}>
                  {checkInTime ? moment(checkInTime).format('hh:mm') : '--:--'}
                </Text>
                <Text style={styles.attendancePeriod}>{checkInTime ? moment(checkInTime).format('A') : ''}</Text>
              </View>
              <Text style={[styles.timeCaption, isDark && styles.mutedDark]}>{checkInTime ? 'Checked in at' : 'Your day begins with a check-in'}</Text>
            </View>
            <View style={[styles.clockSeal, isDark && {backgroundColor: '#283A2F', borderColor: '#40523C'}]}>
              <Ionicons name={checkInTime ? 'checkmark' : 'time-outline'} size={24} color={isDark ? '#D4E8B5' : '#375A3D'} />
            </View>
          </View>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={buttonLabel} disabled={!userData?.result}
            activeOpacity={0.8} style={[styles.checkButton, !userData?.result && {opacity: 0.5}]}
            onPress={() => navigation.navigate('Selfie', {
              attendanceAction: buttonLabel === 'Check In' ? 'CHECK_IN' : 'CHECK_OUT', userinfo: userData?.result,
            })}>
            <View style={styles.checkButtonCopy}><Ionicons name={checkInTime ? 'exit-outline' : 'scan-outline'} size={18} color="#16382B" />
              <Text style={styles.checkButtonText}>{buttonLabel}</Text>
            </View>
            <View style={styles.buttonArrow}><Ionicons name="arrow-forward" size={16} color="#16382B" /></View>
          </TouchableOpacity>
          <View style={styles.captureHint}><Ionicons name="camera-outline" size={12} color="#84917D" />
            <Text style={[styles.captureHintText, isDark && styles.mutedDark]}>Selfie & location verification</Text>
          </View>
        </View>

        <View style={styles.sectionHeadingRow}>
          <View><Text style={[styles.sectionTitle, {color: ink}]}>Your essentials</Text>
            {/* <Text style={[styles.sectionSubtitle, isDark && styles.mutedDark]}>A little less admin. A little more flow.</Text> */}
            </View>
          <Ionicons name="grid-outline" size={16} color="#879582" />
        </View>
        <View style={styles.actionsGrid}>
          <ActionCard icon="sunny-outline" title="Request leave" subtitle="Make time for yourself" color="#7B653C" onPress={handleLeaveRequest} />
          <ActionCard icon="file-tray-full-outline" title="Leave records" subtitle="All your requests, together" color="#4B6654" onPress={handleLeaveData} />
          {canReviewLeaves && <ActionCard icon="notifications-outline" title="Notifications" subtitle="Review what needs you" color="#7C645D" badge={notificationCount} onPress={handleNotification} />}
          {/* {canReviewLeaves && <ActionCard icon="navigate-outline" title="Live tracking" subtitle="See your team on the map" color="#476876" onPress={handleLiveTracking} />} */}
        </View>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Sign out" activeOpacity={0.7} onPress={handlesignout}
          style={[styles.signOutRow, {borderColor: isDark ? '#2E3C33' : '#E0E5DA'}]}>
          <View style={styles.signOutCopy}><Ionicons name="log-out-outline" size={16} color={isDark ? '#A7B7AA' : '#617365'} />
            <Text style={[styles.signOutText, isDark && styles.mutedDark]}>Sign out</Text></View>
          <Ionicons name="chevron-forward" size={14} color="#879582" />
        </TouchableOpacity>
        {/* <View style={styles.footer}><View style={styles.footerLine} /><Text style={styles.footerLabel}>SPACE TO DO YOUR BEST</Text><View style={styles.footerLine} /></View> */}
      </View>
      <Loader visible={isLoding} />
      <LocationDisclosureModal
        visible={showLocationDisclosure}
        onAccept={handleAcceptDisclosure}
        onDeny={handleDenyDisclosure}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {flexGrow: 1, paddingBottom: 18},
  hero: {backgroundColor: '#183C31', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 34, overflow: 'hidden'},
  heroRing: {position: 'absolute', width: 260, height: 260, borderRadius: 130, borderWidth: 1, borderColor: '#355246', top: 25, right: -140},
  heroRingInner: {position: 'absolute', width: 200, height: 200, borderRadius: 100, borderWidth: 1, borderColor: '#355246', top: 55, right: -110},
  brandRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18},
  brandLockup: {flexDirection: 'row', alignItems: 'center', gap: 7},
  brandMark: {width: 24, height: 24, borderRadius: 8, backgroundColor: '#D5E9B5', alignItems: 'center', justifyContent: 'center'},
  brandText: {fontSize: 19, fontWeight: '800', color: '#F8FAF0', letterSpacing: -1},
  brandDot: {color: '#D5E9B5'},
  datePill: {flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: '#4A6254', borderRadius: 16, paddingHorizontal: 9, paddingVertical: 6},
  dateText: {color: '#E1E8D9', fontSize: 11, fontWeight: '600'},
  header: {flexDirection: 'row', alignItems: 'center', gap: 12},
  headerCopy: {flex: 1},
  greeting: {fontSize: 12, color: '#B4C8B9', marginBottom: 5},
  name: {fontSize: 20, lineHeight: 25, fontWeight: '700', color: '#F8FAF1', letterSpacing: -0.5},
  heroCaption: {fontSize: 11, color: '#B4C8B9', marginTop: 7, lineHeight: 15},
  avatar: {width: 42, height: 42, borderRadius: 15, backgroundColor: '#314F3E', borderWidth: 1, borderColor: '#5F7558', alignItems: 'center', justifyContent: 'center'},
  initials: {color: '#D9EABF', fontSize: 14, fontWeight: '700'},
  heroBottom: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16},
  employeeTag: {flexDirection: 'row', alignItems: 'center', gap: 5},
  employeeCode: {color: '#C4D5C4', fontSize: 11, fontWeight: '500'},
  dayText: {color: '#AFC5B4', fontSize: 11},
  body: {paddingHorizontal: 16, width: '100%', maxWidth: 640, alignSelf: 'center', marginTop: -18},
  attendanceCard: {borderRadius: 18, padding: 16, borderWidth: 1, shadowColor: '#122F21', shadowOffset: {width: 0, height: 6}, shadowOpacity: 0.06, shadowRadius: 14, elevation: 3},
  attendanceTopRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 8},
  attendanceHeading: {flex: 1},
  attendanceEyebrow: {color: '#71806D', fontSize: 9, fontWeight: '700', letterSpacing: 1.3},
  attendanceTitle: {fontSize: 15, fontWeight: '600', letterSpacing: -0.2, marginTop: 5},
  statusPill: {flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: '#F0F2E9', borderRadius: 16},
  statusActive: {backgroundColor: '#E5F1E4'},
  statusDot: {width: 5, height: 5, borderRadius: 3, backgroundColor: '#8B9277'},
  statusTextSmall: {fontSize: 9, fontWeight: '600', color: '#536349'},
  clockRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 16},
  clockCopy: {flex: 1},
  timeRow: {flexDirection: 'row', alignItems: 'baseline'},
  attendanceTime: {fontSize: 36, fontWeight: '300', letterSpacing: -1.5, fontVariant: ['tabular-nums'], flexShrink: 1},
  attendancePeriod: {fontSize: 11, color: '#738269', marginLeft: 6, fontWeight: '600'},
  timeCaption: {fontSize: 10, color: '#6F7D68', marginTop: 3, lineHeight: 14},
  clockSeal: {width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#DDE5CC', backgroundColor: '#F4F7ED', alignItems: 'center', justifyContent: 'center'},
  checkButton: {minHeight: 48, borderRadius: 14, backgroundColor: '#D6EBAF', paddingVertical: 8, paddingLeft: 15, paddingRight: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  checkButtonCopy: {flexDirection: 'row', alignItems: 'center', gap: 8},
  checkButtonText: {fontSize: 14, fontWeight: '700', color: '#193C2B'},
  buttonArrow: {width: 30, height: 30, borderRadius: 10, backgroundColor: '#E7F3D1', alignItems: 'center', justifyContent: 'center'},
  captureHint: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 11},
  captureHintText: {fontSize: 9, color: '#788470'},
  sectionHeadingRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, marginBottom: 12},
  sectionTitle: {fontSize: 16, fontWeight: '600', letterSpacing: -0.3},
  sectionSubtitle: {fontSize: 10, color: '#77836F', marginTop: 3, lineHeight: 14},
  actionsGrid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10},
  quickAction: {width: '48.3%', borderRadius: 16, padding: 12, borderWidth: 1, minHeight: 110},
  actionTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12},
  quickActionIcon: {width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center'},
  diagonalArrow: {transform: [{rotate: '45deg'}]},
  actionLabel: {fontSize: 12.5, fontWeight: '600', lineHeight: 17},
  actionSubtitle: {fontSize: 10, lineHeight: 14, color: '#768270', marginTop: 3},
  mutedDark: {color: '#A9B8A4'},
  badge: {position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: '#A8563E', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3},
  badgeText: {color: '#FFFFFF', fontSize: 9, fontWeight: '700'},
  signOutRow: {minHeight: 48, marginTop: 16, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 2},
  signOutCopy: {flexDirection: 'row', alignItems: 'center', gap: 8},
  signOutText: {fontSize: 12, color: '#617365', fontWeight: '500'},
  footer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 14},
  footerLine: {height: 1, backgroundColor: '#A6B299', width: 20, opacity: 0.4},
  footerLabel: {fontSize: 8, letterSpacing: 1.3, color: '#849078', fontWeight: '600'},
  activeTrackingContainer: {
    backgroundColor: '#0D8F55',
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
  },
  topRow: {flexDirection: 'row', justifyContent: 'space-between'},
  statusLabel: {fontSize: 11, color: '#CCFBE1', fontWeight: '700'},
  statusText: {fontSize: 22, fontWeight: '800', color: '#FFFFFF'},
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dutyText: {color: '#FFFFFF', fontSize: 12, fontWeight: '600', lineHeight: 18},
  sinceText: {fontSize: 11, color: '#D1FAE5'},
  liveButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  liveButtonText: {color: '#0D8F55', fontSize: 12, fontWeight: '800'},
  footerText: {
    textAlign: 'center',
    color: '#A8B2C1',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 20,
  },
});

export default DashboardScreen;
// Jamshed end bug id   2555