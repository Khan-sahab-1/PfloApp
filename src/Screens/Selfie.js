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
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useRef, useEffect, Suspense } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from 'react-native-geolocation-service';
import {getAttendanceLocation} from '../utils/attendanceLocation';
import HeaderCompo from '../components/HeaderCompo';
import { COLORS } from '../styles/Colors';
import Loader from '../components/Loader';
import { showFlashMessage } from '../utils/fleshmessage';

let CameraKitCamera = null;
let CameraKitType = { Front: 'front', Back: 'back' };
try {
  const ck = require('react-native-camera-kit');
  CameraKitCamera = ck.Camera;
  CameraKitType = ck.CameraType || CameraKitType;
} catch (_) {}

const { width, height } = Dimensions.get('window');

const Selfie = ({navigation, route}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [picture, setpicture] = useState(null);
  const [images, setimages] = useState(null);
  const [toggle, settoggle] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [showInAppCamera, setShowInAppCamera] = useState(false);
  const [cameraFacing, setCameraFacing] = useState(CameraKitType.Front || 'front');
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraKitRef = useRef(null);
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

  const handleInAppCapture = async () => {
    if (!cameraKitRef.current || isCapturing) { return; }
    setIsCapturing(true);
    try {
      const captured = await cameraKitRef.current.capture();
      if (captured?.uri) {
        const safePhoto = {
          uri: captured.uri,
          type: 'image/jpeg',
          fileName: captured.name || `attendance-${Date.now()}.jpg`,
          width: Math.min(Number(captured.width) || 480, 480),
          height: Math.min(Number(captured.height) || 640, 640),
        };
        setpicture(safePhoto);
        setimages(captured.uri);
        settoggle(false);
        setHasPhoto(true);
        setShowInAppCamera(false);
      } else {
        Alert.alert('Camera Error', 'Photo capture nahi hui. Please try again.');
      }
    } catch (err) {
      console.warn('In-app capture error:', err);
      Alert.alert('Camera Error', 'Photo capture me problem aayi. Dobara try karein.');
    } finally {
      setIsCapturing(false);
    }
  };

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
          title: 'Camera Permission',
          message: 'PFLO requires camera access to capture your attendance selfie.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      ) : PermissionsAndroid.RESULTS.GRANTED;
      if (!mountedRef.current || !navigation.isFocused()) { return; }
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        if (CameraKitCamera) {
          setShowInAppCamera(true);
          return;
        }

        setIsLoading(true);
        await AsyncStorage.setItem('pflo:camera_active', 'true');
        const result = await launchCamera({
          mediaType: 'photo',
          cameraType: 'front',
          quality: 0.35,
          maxWidth: 480,
          maxHeight: 640,
          saveToPhotos: false,
          includeBase64: false,
        });
        await AsyncStorage.removeItem('pflo:camera_active');

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
          type: 'image/jpeg',
          fileName: `attendance-${Date.now()}.jpg`,
          width: Math.min(Number(capturedPhoto.width) || 480, 480),
          height: Math.min(Number(capturedPhoto.height) || 640, 640),
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
      AsyncStorage.removeItem('pflo:camera_active').catch(() => {});
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

            {hasPhoto && images ? (
              <Image
                style={styles.photo}
                source={{ uri: images }}
                resizeMode="cover"
              />
            ) : null}

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

        {showInAppCamera && CameraKitCamera && (
          <Modal
            visible={showInAppCamera}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={() => setShowInAppCamera(false)}
          >
            <View style={cameraStyles.fullScreen}>
              <StatusBar barStyle="light-content" backgroundColor="#000000" />
              <Suspense
                fallback={
                  <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#FF5733" />
                  </View>
                }
              >
                <CameraKitCamera
                  ref={cameraKitRef}
                  cameraType={cameraFacing}
                  style={StyleSheet.absoluteFill}
                />
              </Suspense>
              <SafeAreaView style={cameraStyles.topBar}>
                <TouchableOpacity
                  onPress={() => setShowInAppCamera(false)}
                  style={cameraStyles.topIconBtn}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                >
                  <Text style={cameraStyles.topIconText}>✕</Text>
                </TouchableOpacity>
                <Text style={cameraStyles.topTitle}>Attendance Selfie</Text>
                <TouchableOpacity
                  onPress={() =>
                    setCameraFacing(prev =>
                      prev === CameraKitType.Front ? CameraKitType.Back : CameraKitType.Front,
                    )
                  }
                  style={cameraStyles.topIconBtn}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                >
                  <Text style={cameraStyles.topIconText}>🔄</Text>
                </TouchableOpacity>
              </SafeAreaView>

              <View pointerEvents="none" style={cameraStyles.guideContainer}>
                <View style={cameraStyles.faceOval} />
                <Text style={cameraStyles.guideText}>Align your face in the oval</Text>
              </View>

              <SafeAreaView style={cameraStyles.bottomBar}>
                <TouchableOpacity
                  onPress={handleInAppCapture}
                  disabled={isCapturing}
                  activeOpacity={0.75}
                  style={cameraStyles.shutterOuter}
                >
                  <View style={cameraStyles.shutterInner}>
                    {isCapturing && <ActivityIndicator size="small" color="#FF5733" />}
                  </View>
                </TouchableOpacity>
              </SafeAreaView>
            </View>
          </Modal>
        )}
      </View>
    </>
  );
};

const cameraStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 24 : 10,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  topIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  topTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  guideContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  faceOval: {
    width: width * 0.72,
    height: height * 0.44,
    borderRadius: width * 0.36,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  guideText: {
    marginTop: 20,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 36,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  shutterOuter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

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
