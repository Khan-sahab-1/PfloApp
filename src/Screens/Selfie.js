import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
  Alert,
  useColorScheme,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import {getAttendanceLocation} from '../utils/attendanceLocation';
import HeaderCompo from '../components/HeaderCompo';
import { COLORS } from '../styles/Colors';
import Loader from '../components/Loader';
import { showFlashMessage } from '../utils/fleshmessage';

const { width, height } = Dimensions.get('window');

const PLACEHOLDER =
  'https://previews.123rf.com/images/aguiters/aguiters1508/aguiters150800059/43551287-photo-camera-icon.jpg';

const Selfie = ({navigation, route}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [picture, setpicture] = useState(PLACEHOLDER);
  const [images, setimages] = useState(PLACEHOLDER);
  const [toggle, settoggle] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const isCameraOpeningRef = useRef(false);
  const locationRequestRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const unsubscribe = navigation.addListener('blur', () => {
      locationRequestRef.current?.abort();
      locationRequestRef.current = null;
      if (mountedRef.current) { setIsLoading(false); }
    });
    return () => {
      mountedRef.current = false;
      locationRequestRef.current?.abort();
      locationRequestRef.current = null;
      unsubscribe();
    };
  }, [navigation]);

  // Animations
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    // Entrance animation
    const entrance = Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]);
    entrance.start();

    // Shimmer loop on placeholder
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    );
    shimmer.start();

    // Pulse loop on camera icon area
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => { entrance.stop(); shimmer.stop(); pulse.stop(); };
  }, []);

  const shimmerOpacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  // Camera and attendance location
  const requestCameraPermission = async () => {
    if (isCameraOpeningRef.current || locationRequestRef.current) {
      return;
    }

    isCameraOpeningRef.current = true;
    try {
      const granted = Platform.OS === 'android' ? await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      ) : PermissionsAndroid.RESULTS.GRANTED;
      if (!mountedRef.current || !navigation.isFocused()) { return; }
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setIsLoading(true);
        const result = await launchCamera({
          mediaType: 'photo',
          cameraType: 'front',
          quality: 0.3,
          maxWidth: 1280,
          maxHeight: 1280,
          saveToPhotos: false,
          includeBase64: false,
        });

        if (!mountedRef.current || !navigation.isFocused()) { return; }
        if (result?.didCancel) {
          return;
        }

        if (result?.errorCode) {
          Alert.alert(
            'Camera Error',
            result.errorMessage || 'Camera open nahi ho saka. Please try again.',
          );
          return;
        }

        const capturedPhoto = result?.assets?.[0];
        if (!capturedPhoto?.uri) {
          Alert.alert('Camera Error', 'Photo capture nahi hui. Please try again.');
          return;
        }

        const safePhoto = {
          ...capturedPhoto,
          type: capturedPhoto.type || 'image/jpeg',
          fileName: capturedPhoto.fileName || `attendance-${Date.now()}.jpg`,
        };

        setpicture(safePhoto);
        setimages(capturedPhoto.uri);
        settoggle(false);
        setHasPhoto(true);
      } else {
        Alert.alert(
          'Camera Permission Required',
          'Attendance selfie ke liye camera permission allow karein.',
        );
      }
    } catch (err) {
      console.warn('Attendance camera error:', err);
      if (mountedRef.current && navigation.isFocused()) {
        Alert.alert('Camera Error', 'Camera open nahi ho saka. Please try again.');
      }
    } finally {
      if (mountedRef.current) { setIsLoading(false); }
      isCameraOpeningRef.current = false;
    }
  };

  const checkPermissionGPS = async () => {
    if (locationRequestRef.current || isCameraOpeningRef.current || !picture?.uri) { return; }
    const request = new AbortController();
    locationRequestRef.current = request;
    setIsLoading(true);
    try {
      if (Platform.OS === 'android') {
        const permissions = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);
        if (request.signal.aborted) { return; }
        if (permissions[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !== PermissionsAndroid.RESULTS.GRANTED) {
          throw new Error('Please allow precise location permission to mark attendance.');
        }
      } else {
        const status = await Geolocation.requestAuthorization('whenInUse');
        if (status !== 'granted') { throw new Error('Please allow location permission to mark attendance.'); }
      }
      if (request.signal.aborted || !mountedRef.current || !navigation.isFocused()) { return; }
      const {latitude, longitude} = await getAttendanceLocation({signal: request.signal});
      if (request.signal.aborted || !mountedRef.current || !navigation.isFocused()) { return; }
      // Hide the loader before leaving; the blur listener cancels this request.
      setIsLoading(false);
      navigation.navigate('Maps', {
        latitude, longitude, picture,
        attendanceAction: route?.params?.attendanceAction || 'CHECK_IN',
        userinfo: route?.params?.userinfo,
      });
    } catch (error) {
      if (!request.signal.aborted && mountedRef.current && navigation.isFocused()) {
        Alert.alert('Location Error', typeof error?.message === 'string' ? error.message : 'Unable to get location. Please try again.');
      }
    } finally {
      if (locationRequestRef.current === request) {
        locationRequestRef.current = null;
        if (mountedRef.current) { setIsLoading(false); }
      }
    }
  };
  // ─────────────────────────────────────────────────────────────────

  const bg = isDarkMode ? '#0A0A0F' : '#F7F5F2';
  const cardBg = isDarkMode ? '#13131A' : '#FFFFFF';
  const accent = '#FF5733';
  const accentSoft = isDarkMode ? '#FF573320' : '#FF573312';
  const textPrimary = isDarkMode ? '#FFFFFF' : '#0D0D0D';
  const textSecondary = isDarkMode ? '#6B6B7A' : '#9A9A9A';
  const borderColor = isDarkMode ? '#232330' : '#EBEBEB';

  return (
    <>
      {/* <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={bg}
      /> */}
      <HeaderCompo title={'Take Your Picture'} />

      <View style={[styles.root, { backgroundColor: bg }]}>
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeIn, transform: [{ translateY: slideUp }] },
          ]}
        >
          {/* ── INSTRUCTION LABEL ── */}
          <View style={styles.labelRow}>
            <View style={[styles.dot, { backgroundColor: hasPhoto ? '#22C55E' : accent }]} />
            <Text style={[styles.labelText, { color: textSecondary }]}>
              {hasPhoto ? 'Photo captured — ready to continue' : 'Tap the frame to take a selfie'}
            </Text>
          </View>

          {/* ── PHOTO FRAME ── */}
          <TouchableOpacity
            onPress={requestCameraPermission}
            activeOpacity={0.88}
            style={[
              styles.frameOuter,
              { backgroundColor: cardBg, borderColor },
            ]}
          >
            {/* Corner accents */}
            <View style={[styles.corner, styles.cornerTL, { borderColor: accent }]} />
            <View style={[styles.corner, styles.cornerTR, { borderColor: accent }]} />
            <View style={[styles.corner, styles.cornerBL, { borderColor: accent }]} />
            <View style={[styles.corner, styles.cornerBR, { borderColor: accent }]} />

            <Image
              style={styles.photo}
              source={{ uri: images }}
              resizeMode={hasPhoto ? 'cover' : 'contain'}
            />

            {/* Overlay hint when no photo */}
            {!hasPhoto && (
              <Animated.View
                style={[
                  styles.overlay,
                  { backgroundColor: accentSoft, opacity: shimmerOpacity },
                ]}
              >
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <View style={[styles.iconCircle, { borderColor: accent }]}>
                    <Text style={[styles.cameraIcon, { color: accent }]}>📷</Text>
                  </View>
                  <Text style={[styles.overlayText, { color: accent }]}>TAP TO CAPTURE</Text>
                </Animated.View>
              </Animated.View>
            )}

            {/* Retake pill when photo exists */}
            {hasPhoto && (
              <View style={[styles.retakePill, { backgroundColor: '#00000090' }]}>
                <Text style={styles.retakeText}>↺  RETAKE</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* ── DIVIDER ── */}
          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          {/* ── CONTINUE BUTTON ── */}
          <TouchableOpacity
            disabled={toggle || isLoading}
            onPress={checkPermissionGPS}
            activeOpacity={0.85}
            style={[
              styles.continueBtn,
              toggle
                ? { backgroundColor: isDarkMode ? '#1E1E2A' : '#EBEBEB' }
                : { backgroundColor: accent },
            ]}
          >
            <Text
              style={[
                styles.continueTxt,
                { color: toggle ? textSecondary : '#FFFFFF' },
              ]}
            >
              {toggle ? 'CAPTURE PHOTO FIRST' : 'CONTINUE  →'}
            </Text>
          </TouchableOpacity>

          {/* ── STEP INDICATOR ── */}
          <View style={styles.stepRow}>
            {[0, 1, 2].map(i => (
              <View
                key={i}
                style={[
                  styles.step,
                  {
                    backgroundColor:
                      i === 0
                        ? hasPhoto
                          ? '#22C55E'
                          : accent
                        : i === 1
                        ? hasPhoto
                          ? accent
                          : borderColor
                        : borderColor,
                    width: i === 0 ? 28 : 8,
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>

        <Loader visible={isLoading} />
      </View>
    </>
  );
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 32,
  },

  // Label
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  labelText: {
    fontSize: 12,
    letterSpacing: 0.6,
    fontWeight: '500',
    textTransform: 'uppercase',
  },

  // Frame
  frameOuter: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  photo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  cameraIcon: {
    fontSize: 32,
  },
  overlayText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
    textAlign: 'center',
  },
  retakePill: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 100,
  },
  retakeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  // Corner accents
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    zIndex: 10,
    borderWidth: 2.5,
  },
  cornerTL: { top: 12, left: 12, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 6 },
  cornerTR: { top: 12, right: 12, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 6 },
  cornerBL: { bottom: 12, left: 12, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: 12, right: 12, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 6 },

  // Divider
  divider: {
    height: 1,
    marginVertical: 22,
    opacity: 0.5,
  },

  // Continue button
  continueBtn: {
    height: 58,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueTxt: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2.5,
  },

  // Step indicator
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  step: {
    height: 8,
    borderRadius: 4,
  },
});

export default Selfie;
