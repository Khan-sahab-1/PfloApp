// import { View, Text, Button, Alert, StyleSheet, ActivityIndicator, TouchableOpacity, useColorScheme } from 'react-native';
// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import urls from '../../url';
// import { AuthContext } from './Context';
// import axios from 'axios';
// import ImageResizer from 'react-native-image-resizer';
// import { COLORS } from '../styles/Colors';
// import navigationString from '../route/navigationString';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import HeaderCompo from '../components/HeaderCompo';
// // Jamshed start 
// const Maps = ({ route }) => {
//   const [response, setResponse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [times, setCurrentTime] = useState(null);
//   const [latitude, setLatitude] = useState(route.params.latitude);
//   const [longitude, setLongitude] = useState(route.params.longitude);
//   const [picture, setPicture] = useState(route.params.picture);
//   const [responseData, setResponseData] = useState(null);
//   const [clickCount, setClickCount] = useState(0);
 
//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const getAttendanceData = server_origin + urls.getAttendance;
//   const getAttendanceData2 = server_origin + urls.getAttendance2;
//   console.log("------Maps-----", server_origin, getAttendanceData);
//   const colorScheme = useColorScheme();
//       const isDarkMode = colorScheme === 'dark';
 
//   const navigation = useNavigation();
//   console.log("Latitude:", latitude);
//   console.log("Longitude:", longitude);
 
//  const showAlert = (message) => {
//   Alert.alert(
//     "Attendance Marked",
//     message,
//     [
//       {
//         text: "OK",
//         onPress: () => navigation.navigate('Tabroutes'), 
//         style: "default",
//       },
//     ],
//     { cancelable: false }
//   );
// };

 
//   const compressImgae = () => {
//     setLoading(true);
//     ImageResizer.createResizedImage(picture.uri, picture.width, picture.height, 'JPEG', 5)
//       .then(resizedImage => {
//         const newImage = { ...resizedImage, type: picture.type, fileName: picture.fileName };
//         handleAttendancePress(newImage)
//       })
//       .catch(err => {
//         console.log('Image Resizer Error: ', err);
//         handleAttendancePress(picture)
 
//       });
//   };
 
//   const handleAttendancePress = async (pic) => {
//     setLoading(true);
  
//     try {
//       if (clickCount === 1) {
//         // navigation.navigate('Tabroutes');
//         // return;
//       }
  
//       const now = new Date();
//       const isoTimeString = now.toISOString();
//       const formattedTime = formatToCustomDateTime(now);
  
//       const data = new FormData();
//       data.append('file', {
//         uri: pic.uri,
//         name: pic.fileName,
//         type: pic.type,
//       });
  
//       const details = {
//         latitude,
//         longitude,
//         times: isoTimeString,
//       };
//       data.append('details', JSON.stringify(details));
  
//       const response = await axios.post(getAttendanceData2, data, {
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'multipart/form-data',
//         },
//       });
  
//       const responseData = response.data;
//       console.log("*************", responseData);
//       console.log(responseData.punch_time);
  
//       // ✅ Store punch time in AsyncStorage
//       if (responseData?.punch_time) {
//         await AsyncStorage.setItem('punch_time', String(responseData.punch_time));
//       }
  
//       setResponse(responseData);
  
//       if (responseData.attendance_marked) {
//         showAlert(responseData.message);
//         setClickCount(clickCount + 1);
//       } else {
//         showAlert('Attendance marked Failed!');
//       }
//     } catch (error) {
//       console.error('Error marking attendance:', error);
//       showAlert('Error marking attendance.');
//     } finally {
//       setLoading(false);
//     }
//   };
  
 
//   useEffect(() => {
//     return () => setClickCount(0);
//   }, []);
 
//   const formatToIndianDateTime = (dateString) => {
//     const options = {
//       timeZone: 'Asia/Kolkata',
//       hour12: false,
//       year: 'numeric',
//       month: 'numeric',
//       day: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       second: 'numeric',
//     };
//     return new Date(dateString).toLocaleTimeString('en-IN', options);
//   };
//   const formatToCustomDateTime = (date) => {
//     const pad = (n) => n.toString().padStart(2, '0');
 
//     const year = date.getFullYear();
//     const month = pad(date.getMonth() + 1);
//     const day = pad(date.getDate());
//     const hours = pad(date.getHours());
//     const minutes = pad(date.getMinutes());
//     const seconds = pad(date.getSeconds());
 
//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//   };
 
 
//   return (
//     <>
//     <HeaderCompo title="Mark Attendance" lefticon={require('../assets/back.png')}
//     onPress={()=>navigation.goBack()} />
// <View style={{...styles.container, backgroundColor: isDarkMode ? COLORS.black : COLORS.BACKGROUND}}>
// <View style={styles.row}>
// <View style={styles.column}>
// <Text style={styles.label}>Latitude:</Text>
// <Text style={styles.value}>{latitude}</Text>
// </View>
// <View style={styles.column}>
// <Text style={styles.label}>Longitude:</Text>
// <Text style={styles.value}>{longitude}</Text>
// </View>
// </View>
//       {response && (
// <View style={styles.row}>
// <View style={styles.column}>
// <Text style={styles.label}>Employee Location:</Text>
// <Text style={styles.value}>{response?.emp_address}</Text>
// </View>
// <View style={styles.column}>
// <Text style={styles.label}>Punch Date & Time :</Text>
// <Text style={styles.value}>
//               {formatToIndianDateTime(response?.punch_time)}
// </Text>
// </View>
// </View>
//       )}
// <TouchableOpacity
//         style={[styles.button, loading && styles.buttonDisabled]}
//         // onPress={handleAttendancePress}
//         onPress={compressImgae}
//         disabled={loading}
// >
// <Text style={styles.buttonText}>Mark Attendance</Text>
// </TouchableOpacity>
//       {loading && <ActivityIndicator size="large" color="blue" />}
// </View>
//     </>
//   );
// };
 
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'flex-start',
//     backgroundColor: COLORS.BACKGROUND,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 12,
//     padding: 12,
//     backgroundColor: '#f0f4ff',
//     borderRadius: 10,
//     elevation: 2,
//   },
//   column: {
//     flex: 1,
//     marginHorizontal: 5,
//   },
//   label: {
//     fontWeight: '600',
//     fontSize: 14,
//     marginBottom: 4,
//     color: COLORS.primary || '#003366',
//   },
//   value: {
//     fontSize: 14,
//     color: COLORS.text || '#000',
//   },
//   button: {
//     backgroundColor: COLORS.primary || '#003366',
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   buttonDisabled: {
//     backgroundColor: '#cccccc',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

 
// export default Maps;
// // Jamshed start 


import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Animated,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import urls from '../../url';
import { AuthContext } from './Context';
import axios from 'axios';
import ImageResizer from 'react-native-image-resizer';
import { COLORS } from '../styles/Colors';
import {
  removeEmployeePunchTime,
  setEmployeePunchTime,
} from '../utils/attendanceStorage';
import HeaderCompo from '../components/HeaderCompo';
import { useSelector } from 'react-redux';
import {
  startTracking,
  stopTracking,
} from '../components/BackgroundLocationService';

const { width } = Dimensions.get('window');

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const pad = (n) => n.toString().padStart(2, '0');

const formatToIndianDateTime = (dateString) => {
  const options = {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  return new Date(dateString).toLocaleTimeString('en-IN', options);
};

const formatToCustomDateTime = (date) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// ─── LIVE CLOCK (added feature) ───────────────────────────────────────────────
const LiveClock = ({ color }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const h = pad(time.getHours());
  const m = pad(time.getMinutes());
  const s = pad(time.getSeconds());
  const dateStr = time.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={[styles.clockTime, { color }]}>
        {h}<Text style={styles.clockColon}>:</Text>{m}
        <Text style={styles.clockSec}>:{s}</Text>
      </Text>
      <Text style={[styles.clockDate, { color }]}>{dateStr}</Text>
    </View>
  );
};

// ─── STATUS BADGE (added feature) ─────────────────────────────────────────────
const StatusBadge = ({ status, isDarkMode }) => {
  const map = {
    idle: { label: 'READY TO MARK', color: '#F59E0B', bg: '#FEF3C720' },
    loading: { label: 'PROCESSING…', color: '#3B82F6', bg: '#EFF6FF20' },
    success: { label: 'MARKED ✓', color: '#22C55E', bg: '#F0FDF420' },
    error: { label: 'FAILED', color: '#EF4444', bg: '#FEF2F220' },
  };
  const s = map[status] || map.idle;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg, borderColor: s.color + '50' }]}>
      <View style={[styles.badgeDot, { backgroundColor: s.color }]} />
      <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
    </View>
  );
};

// ─── INFO CARD ────────────────────────────────────────────────────────────────
const InfoCard = ({ icon, label, value, accent, cardBg, textColor, subColor }) => {
  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80 }),
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={[styles.infoCard, { backgroundColor: cardBg, opacity, transform: [{ scale }] }]}>
      <View style={[styles.infoIconWrap, { backgroundColor: accent + '18' }]}>
        <Text style={styles.infoIcon}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.infoLabel, { color: subColor }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: textColor }]} numberOfLines={2}>{value}</Text>
      </View>
    </Animated.View>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const Maps = ({ route }) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [times, setCurrentTime] = useState(null);
  const [latitude] = useState(route.params.latitude);
  const [longitude] = useState(route.params.longitude);
  const [picture, setPicture] = useState(route.params.picture);
  const [responseData, setResponseData] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [uiStatus, setUiStatus] = useState('idle'); // idle | loading | success | error
  const attendanceAction = route.params?.attendanceAction || 'CHECK_IN';
  const storedUserData = useSelector(state => state.user.userDatainfo);
  const userinfo = route.params?.userinfo || storedUserData?.result;

  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const getAttendanceData = server_origin + urls.getAttendance;
  const getAttendanceData2 = server_origin + urls.getAttendance2;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const navigation = useNavigation();

  // Theme tokens
  const bg = isDarkMode ? '#08080F' : '#F4F6FA';
  const cardBg = isDarkMode ? '#111118' : '#FFFFFF';
  const accent = '#4F6EF7';
  const accentGreen = '#22C55E';
  const textPrimary = isDarkMode ? '#F0F0FF' : '#0D0D1A';
  const textSub = isDarkMode ? '#5A5A72' : '#9090A8';
  const border = isDarkMode ? '#1E1E2E' : '#E8EAF0';

  // Animations
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const btnPulse = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, useNativeDriver: true, tension: 70 }),
    ]).start();
  }, []);

  // Pulse button when idle
  useEffect(() => {
    if (uiStatus === 'idle') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(btnPulse, { toValue: 1.025, duration: 900, useNativeDriver: true }),
          Animated.timing(btnPulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    } else {
      btnPulse.setValue(1);
    }
  }, [uiStatus]);

  // Progress bar while loading
  useEffect(() => {
    if (loading) {
      progressWidth.setValue(0);
      Animated.timing(progressWidth, { toValue: width * 0.85, duration: 8000, useNativeDriver: false }).start();
    } else {
      Animated.timing(progressWidth, { toValue: width * 0.85, duration: 200, useNativeDriver: false }).start();
    }
  }, [loading]);

  // Success pop animation
  useEffect(() => {
    if (uiStatus === 'success') {
      Animated.spring(successScale, { toValue: 1, useNativeDriver: true, tension: 60 }).start();
    } else {
      successScale.setValue(0);
    }
  }, [uiStatus]);

  // ─── LOGIC (UNCHANGED) ──────────────────────────────────────────
  const showAlert = (message, goHome = false) => {
    Alert.alert(
      goHome
        ? attendanceAction === 'CHECK_IN'
          ? 'Checked In'
          : 'Checked Out'
        : 'Attendance Error',
      message,
      [
        {
          text: 'OK',
          style: 'default',
          onPress: goHome
            ? () => navigation.navigate('Tabroutes', {screen: 'Home'})
            : undefined,
        },
      ],
      { cancelable: false },
    );
  };

  const compressImgae = () => {
    setLoading(true);
    setUiStatus('loading');
    if (!picture?.uri) {
      setLoading(false);
      setUiStatus('error');
      showAlert('Captured image is missing. Please take the selfie again.');
      return;
    }

    const imageWidth = Number(picture.width) || 1080;
    const imageHeight = Number(picture.height) || 1440;

    ImageResizer.createResizedImage(picture.uri, imageWidth, imageHeight, 'JPEG', 70)
      .then(resizedImage => {
        const newImage = {
          ...resizedImage,
          type: picture.type || 'image/jpeg',
          fileName: picture.fileName || `attendance-${Date.now()}.jpg`,
        };
        handleAttendancePress(newImage);
      })
      .catch(err => {
        console.log('Image Resizer Error: ', err);
        handleAttendancePress(picture);
      });
  };

  const handleAttendancePress = async (pic) => {
    setLoading(true);
    try {
      if (!pic?.uri) {
        throw new Error('Attendance image is missing. Please take the selfie again.');
      }

      if (clickCount === 1) { }

      const now = new Date();
      const isoTimeString = now.toISOString();
      const formattedTime = formatToCustomDateTime(now);

      const data = new FormData();
      data.append('file', {
        uri: pic.uri,
        name: pic.fileName || `attendance-${Date.now()}.jpg`,
        type: pic.type || 'image/jpeg',
      });
      const details = { latitude, longitude, times: isoTimeString };
      data.append('details', JSON.stringify(details));

      const response = await axios.post(getAttendanceData2, data, {
        headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' },
      });

      const responseData = response.data;
      console.log('*************J____', responseData);
      console.log(responseData.punch_time);

      setResponse(responseData);

      if (responseData.attendance_marked) {
        if (attendanceAction === 'CHECK_IN') {
          const punchTime = responseData?.punch_time || now.toISOString();
          await setEmployeePunchTime(userinfo?.emp_code, punchTime);
          console.log(userinfo?.live_tracking_enabled,'userinfo?.live_tracking_enabled--------->>>>>>>>')

          if (userinfo?.live_tracking_enabled) {
            try {
              const started = await startTracking({
                userinfo,
                serverOrigin: server_origin,
              });
              console.log('[PFLO Tracking] Started after attendance', {
                started,
                employeeCode: userinfo.emp_code,
              });
            } catch (trackingError) {
              // Attendance is already marked, so a tracking failure must not
              // turn a successful check-in into an attendance error.
              console.error('[PFLO Tracking] Start after attendance failed', {
                message: trackingError?.message,
              });
            }
          }
        } else {
          await removeEmployeePunchTime(userinfo?.emp_code);
          try {
            await stopTracking();
            console.log('[PFLO Tracking] Stopped after check-out');
          } catch (trackingError) {
            console.error('[PFLO Tracking] Stop after check-out failed', {
              message: trackingError?.message,
            });
          }
        }
        setUiStatus('success');
        setClickCount(clickCount + 1);
        showAlert(responseData.message || 'Attendance marked successfully.', true);
      } else {
        setUiStatus('error');
        showAlert(responseData?.message || 'Attendance marking failed.');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setUiStatus('error');
      showAlert(
        error?.response?.data?.message ||
          error?.message ||
          'Error marking attendance.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => setClickCount(0);
  }, []);
  // ────────────────────────────────────────────────────────────────

  const coordsLabel = `${parseFloat(latitude).toFixed(6)}° N`;
  const longLabel = `${parseFloat(longitude).toFixed(6)}° E`;

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={bg} />
      <HeaderCompo
        title="Mark Attendance"
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <View style={[styles.root, { backgroundColor: bg }]}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── HERO CLOCK CARD ── */}
          <Animated.View
            style={[
              styles.heroCard,
              {
                backgroundColor: accent,
                opacity: headerFade,
                transform: [{ translateY: headerSlide }],
              },
            ]}
          >
            {/* Decorative circles */}
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />

            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroGreeting}>Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋</Text>
                <Text style={styles.heroSubtitle}>Mark your attendance below</Text>
              </View>
              <StatusBadge status={uiStatus} isDarkMode={isDarkMode} />
            </View>

            <LiveClock color="#FFFFFF" />

            {/* Progress bar */}
            {loading && (
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
              </View>
            )}
          </Animated.View>

          {/* ── LOCATION SECTION ── */}
          <Text style={[styles.sectionTitle, { color: textSub }]}>📍 Location Coordinates</Text>
          <View style={styles.row}>
            <InfoCard
              icon="🔺"
              label="Latitude"
              value={coordsLabel}
              accent={accent}
              cardBg={cardBg}
              textColor={textPrimary}
              subColor={textSub}
            />
            <View style={{ width: 12 }} />
            <InfoCard
              icon="🔷"
              label="Longitude"
              value={longLabel}
              accent={accent}
              cardBg={cardBg}
              textColor={textPrimary}
              subColor={textSub}
            />
          </View>

          {/* ── RESPONSE SECTION ── */}
          {response && (
            <>
              <Text style={[styles.sectionTitle, { color: textSub }]}>✅ Attendance Details</Text>
              <View style={styles.row}>
                <InfoCard
                  icon="🏢"
                  label="Employee Location"
                  value={response?.emp_address || '—'}
                  accent={accentGreen}
                  cardBg={cardBg}
                  textColor={textPrimary}
                  subColor={textSub}
                />
                <View style={{ width: 12 }} />
                <InfoCard
                  icon="🕐"
                  label="Punch Date & Time"
                  value={formatToIndianDateTime(response?.punch_time)}
                  accent={accentGreen}
                  cardBg={cardBg}
                  textColor={textPrimary}
                  subColor={textSub}
                />
              </View>

              {/* Success animation (added feature) */}
              <Animated.View style={[styles.successBanner, { transform: [{ scale: successScale }], backgroundColor: accentGreen + '18', borderColor: accentGreen + '40' }]}>
                <Text style={styles.successIcon}>🎉</Text>
                <Text style={[styles.successText, { color: accentGreen }]}>Attendance successfully recorded!</Text>
              </Animated.View>
            </>
          )}

          {/* ── PICTURE PREVIEW (added feature) ── */}
          {picture?.uri && (
            <>
              <Text style={[styles.sectionTitle, { color: textSub }]}>🤳 Captured Photo</Text>
              <View style={[styles.photoCard, { backgroundColor: cardBg, borderColor: border }]}>
                <Image source={{ uri: picture.uri }} style={styles.photo} resizeMode="cover" />
                <View style={[styles.photoBadge, { backgroundColor: accent + 'CC' }]}>
                  <Text style={styles.photoBadgeText}>SELFIE</Text>
                </View>
              </View>
            </>
          )}

          {/* ── MARK ATTENDANCE BUTTON ── */}
          <Animated.View style={{ transform: [{ scale: btnPulse }] }}>
            <TouchableOpacity
              style={[
                styles.markBtn,
                loading && styles.markBtnDisabled,
                uiStatus === 'success' && { backgroundColor: accentGreen },
              ]}
              onPress={compressImgae}
              disabled={loading || uiStatus === 'success'}
              activeOpacity={0.85}
            >
              {loading ? (
                <View style={styles.btnInner}>
                  <Text style={styles.btnDot}>●</Text>
                  <Text style={styles.btnDot}>●</Text>
                  <Text style={styles.btnDot}>●</Text>
                </View>
              ) : uiStatus === 'success' ? (
                <TouchableOpacity  onPress={() => navigation.navigate('Tabroutes', {
  screen: 'Home',
  params: {
    time: response?.punch_time
  }
})}>
                <Text style={[styles.markBtnText,{color:'white',fontSize:11}]}>ATTENDANCE SUCCESSFULLY MARKED - GO BACK</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.markBtnText}>
                  {attendanceAction === 'CHECK_IN'
                    ? '⏱  MARK CHECK IN'
                    : '⏱  MARK CHECK OUT'}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* ── DISCLAIMER (added feature) ── */}
          <Text style={[styles.disclaimer, { color: textSub }]}>
            Your location and photo are securely transmitted. This record is final.
          </Text>
        </ScrollView>
      </View>
    </>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },

  // Hero
  heroCard: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#4F6EF7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  heroCircle1: {
    position: 'absolute', top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroCircle2: {
    position: 'absolute', bottom: -30, left: -20,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 16,
  },
  heroGreeting: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  heroSubtitle: { color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 2 },

  // Clock
  clockTime: { fontSize: 48, fontWeight: '800', letterSpacing: -1, lineHeight: 56 },
  clockColon: { opacity: 0.7 },
  clockSec: { fontSize: 28, fontWeight: '400', opacity: 0.6 },
  clockDate: { fontSize: 13, opacity: 0.75, marginTop: 4, letterSpacing: 0.5 },

  // Badge
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 100, borderWidth: 1,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },

  // Progress
  progressTrack: {
    height: 3, backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2, marginTop: 14, overflow: 'hidden',
  },
  progressFill: { height: 3, backgroundColor: '#FFFFFF', borderRadius: 2 },

  // Section title
  sectionTitle: {
    fontSize: 11, fontWeight: '700', letterSpacing: 1.5,
    textTransform: 'uppercase', marginBottom: 10, marginTop: 4,
  },

  // Row
  row: { flexDirection: 'row', marginBottom: 16 },

  // Info card
  infoCard: {
    flex: 1, borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  infoIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  infoIcon: { fontSize: 18 },
  infoLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 3 },
  infoValue: { fontSize: 13, fontWeight: '700' },

  // Photo card
  photoCard: {
    borderRadius: 20, overflow: 'hidden',
    marginBottom: 20, borderWidth: 1,
    elevation: 4, shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10,
  },
  photo: { width: '100%', height: 200 },
  photoBadge: {
    position: 'absolute', top: 12, right: 12,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 100,
  },
  photoBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },

  // Success banner
  successBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, borderRadius: 14, borderWidth: 1,
    marginBottom: 16,
  },
  successIcon: { fontSize: 20 },
  successText: { fontSize: 14, fontWeight: '700' },

  // Button
  markBtn: {
    backgroundColor: '#4F6EF7',
    height: 60, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    elevation: 8,
    shadowColor: '#4F6EF7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    marginBottom: 16,
  },
  markBtnDisabled: { backgroundColor: '#3A3A4A', shadowOpacity: 0, elevation: 0 },
  markBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', letterSpacing: 2 },
  btnInner: { flexDirection: 'row', gap: 6 },
  btnDot: { color: '#FFFFFF', fontSize: 18, opacity: 0.7 },

  // Disclaimer
  disclaimer: {
    fontSize: 11, textAlign: 'center', lineHeight: 17, letterSpacing: 0.3,
  },
});

export default Maps;
