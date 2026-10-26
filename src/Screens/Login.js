
// Jamshed start 
import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  useColorScheme,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { authenticateUser } from "../odoo_service";
import { useAuth, AuthContext } from './Context';
import axios from "axios";
import { launchCamera } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import urls from '../../url';
import ImageResizer from 'react-native-image-resizer';
import { useFocusEffect } from '@react-navigation/native';
import ButtonCompo from "../components/ButtonCompo";
import { useDispatch } from "react-redux";
import API, { BASE_URL } from "../utils/apiurls";
import { loginAsync } from "../redux/reducers/authreducers";
import { showFlashMessage } from "../utils/fleshmessage";
import Loader from "../components/Loader";
import { COLORS } from "../styles/Colors";
import DeviceInfo from "react-native-device-info";
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isDisconnected, restoreOffline, saveLogin, logoutAttendance} from '../offline/session';
import {getSession} from '../offline/session';
import { stopTracking } from "../components/BackgroundLocationService";

export default function UserLogInScreen({ navigation, route }) {
  const contextType = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [defaultcheck, setDefaultCheck] = useState(true);
  const [customurl, setCustomUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Ankit Added Start
  const [loading, setLoading] = useState(false);
  const { openCam } = route.params || {};
  const colorschema = useColorScheme()
  const isDark = colorschema === 'dark';
  // Ankit Added End

  const toggleSwitch = () => {
    setDefaultCheck(!defaultcheck);
  }

  useEffect(() => {
    (async () => {
      try {
        const credsRaw = await AsyncStorage.getItem('attendance:saved_credentials');
        if (credsRaw) {
          const creds = JSON.parse(credsRaw);
          if (creds?.username) {
            setUsername(prev => prev || creds.username);
          }
          if (creds?.server && creds.server !== contextType.currentUrl) {
            setCustomUrl(prev => prev || creds.server);
          }
        }
      } catch (_) {}
    })();
  }, [contextType.currentUrl]);

  // Ankit Added Start
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setLoading(false);
    });
    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      stopTracking().catch(error => {
        console.warn('[PFLO Tracking] Failed to stop on login screen', {
          message: error?.message,
        });
      });
      console.log(route.params)
      if (openCam === true) {
        requestCameraPermission();
      }
      return () => {
        console.log('Screen lost focus or key condition changed');
      };
    }, [openCam])
  );
  // Ankit Added End

  const version = DeviceInfo.getVersion();
  const buildNumber = DeviceInfo.getBuildNumber();

  const handleLogin = async () => {
    console.log(contextType.currentUrl, 'contextType.currentUrl')
    if (!defaultcheck) {
      if (customurl) {
        contextType.setCurrentUrl(customurl)
      } else {
        showFlashMessage({
          message: "Error!",
          description: "Please enter Custom Url or Toggle production Switch",
          type: "danger",
          backgroundColor: "red",
        })
        return
      }
    }
    try {
      setLoading(true)
      const login_url = defaultcheck ? contextType.currentUrl : customurl
      setError(null);
      if (isDisconnected(await NetInfo.fetch())) {
        const account = await restoreOffline(login_url, username);
        if (!account) {
          throw new Error('Internet is required. No employee with offline permission is saved for this server.');
        }
        setPassword('');
        navigation.reset({index: 0, routes: [{name: 'OfflineDashboard'}]});
        return;
      }
      const isValidUser = await authenticateUser(username, password, login_url, true);

      if (isValidUser) {
        await saveLogin(isValidUser, login_url);
        await AsyncStorage.setItem('attendance:saved_credentials', JSON.stringify({
          username,
          server: login_url,
          userData: isValidUser,
        }));
        showFlashMessage({
          message: "Success!",
          description: `Logged in as ${username}`,
          type: "success",
          backgroundColor: COLORS.success,
        });
        setUsername('');
        setPassword('');
        setCustomUrl('');
        const account = getSession();
        if (account?.mode !== 'online') { return; }
        navigation.reset({index: 0, routes: [{name: 'Tabroutes'}]});
      } else {
        await logoutAttendance();
        showFlashMessage({
          message: "Error!",
          description: "Invalid User name and Password",
          type: "danger",
          backgroundColor: "red",
        })
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(`Login failed: ${err.message}`);
    } finally {
      setLoading(false)
    }
  };

  // Ankit Added start
  const handleAttendancePress = async (lat, longt, pic) => {
    try {
      const domain_url = defaultcheck ? contextType.currentUrl : customurl
      let urlsApi = domain_url + urls.odooAutoMarkAttendance;
      console.log('urlsApi', urlsApi)
      let data = new FormData();
      data.append('file', {
        uri: pic.uri,
        name: pic.fileName,
        type: pic.type,
      });
      const params = {
        latitude: lat,
        longitude: longt,
      };
      data.append('details', JSON.stringify(params));
      console.log('testing', pic, lat, longt)
      console.log('testing3', data)
      let response = {};
      response = await axios
        .post(urlsApi, data, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(resp => {
          let responseData = resp.data;
          if (responseData && responseData.attendance_marked) {
            navigation.navigate('AttendanceDetail', {
              responseData: responseData,
            });
          } else {
            showAlert(responseData.message || 'Attendance marked Failed!');
          }
        })
        .catch(err => {
          console.log('error', err);
          showAlert(err.message || 'Error: Something not Working');
          setLoading(false);
        });
    } catch (err) {
      console.log('error', err, err.message);
      setLoading(false);
    }
  };

  const getCurrentLocation = async (picture = false) => {
    Geolocation.getCurrentPosition(
      position => {
        if (position) {
          console.log('----------', position);
          handleAttendancePress(
            position.coords.latitude,
            position.coords.longitude,
            picture,
          );
        }
      },
      error => {
        const { code, message } = error;
        console.warn(code, message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'PFLO requires camera access to capture your selfie.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const result = await launchCamera({
          mediaType: 'photo',
          cameraType: 'front',
          quality: 0.35,
          maxWidth: 480,
          maxHeight: 640,
          saveToPhotos: false,
          includeBase64: false,
        });
        if (result?.didCancel) {
          return;
        }
        if (result?.errorCode) {
          Alert.alert('Camera Error', result.errorMessage || 'Camera open nahi ho saka.');
          return;
        }
        const capturedPhoto = result?.assets?.[0];
        if (!capturedPhoto?.uri) {
          Alert.alert('Camera Error', 'Photo capture nahi hui. Please try again.');
          return;
        }
        compressImgae(capturedPhoto);
      } else {
        console.log('Camera permission denied');
        Alert.alert('Camera permission denied');
      }
    } catch (err) {
      console.warn('Camera request error:', err);
    }
  };

  const compressImgae = async pic => {
    setLoading(true);
    try {
      const resizedImage = await ImageResizer.createResizedImage(
        pic.uri,
        480,
        640,
        'JPEG',
        35,
        0,
        null,
        false,
        { mode: 'contain', onlyScaleDown: true },
      );
      const newImage = { ...resizedImage, type: 'image/jpeg', fileName: `photo-${Date.now()}.jpg` };
      checkPermissionGPS(newImage);
    } catch (err) {
      console.warn('Image Resizer Error (safe fallback to original picture):', err);
      checkPermissionGPS(pic);
    }
  };

  const formatSize = sizeInBytes => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} bytes`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  const checkPermissionGPS = async (pic = false) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool Photo App Gps Permission',
          message:
            'Cool Photo App needs access to your Gps ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation((pic = pic));
      } else {
        console.log('Camera permission denied');
        Alert.alert('GPS permission denied');
      }
    } catch (err) {
      Alert.alert(err);
    }
  };

  const showAlert = message => {
    Alert.alert(
      'Attendance Marked',
      message,
      [{ text: 'OK', style: 'default' }],
      { cancelable: false },
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BLUE} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

        {/* Background decorative circles */}
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />

        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Ionicons name="business" size={26} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.companyName}>CHADHA INDUSTRIES</Text>
          <View style={styles.taglineRow}>
            <View style={styles.taglineDash} />
            <Text style={styles.tagline}>Employee Portal</Text>
            <View style={styles.taglineDash} />
          </View>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <View style={styles.cardHeadRow}>
            <View>
              <Text style={styles.cardTitle}>Welcome back</Text>
              {/* <Text style={styles.cardSubtitle}>Sign in online, or continue offline as the last authorized employee.</Text> */}
            </View>
          </View>

          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMPLOYEE ID / PUNCH CODE</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={17} color="#5B7FA6" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Employee ID / Punch Code"
                placeholderTextColor="#A2AFC2"
                autoCapitalize="none"
                onChangeText={(username) => setUsername(username)}
                value={username}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={17} color="#5B7FA6" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                placeholderTextColor="#A2AFC2"
                secureTextEntry={!showPassword}
                onChangeText={(password) => setPassword(password)}
                value={password}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
              >
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#5B7FA6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Production URL Toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleIconWrap}>
              <Ionicons name="server-outline" size={16} color={COLORS.BUTTON} />
            </View>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Use custom server</Text>
              <Text style={styles.toggleDesc}>{defaultcheck ? "Using default URL" : "Using custom URL"}</Text>
            </View>
            <Switch
              trackColor={{ false: '#E8EDF2', true: '#C7E0FF' }}
              thumbColor={defaultcheck ? COLORS.BUTTON : '#94A3B8'}
              ios_backgroundColor="#E8EDF2"
              onValueChange={toggleSwitch}
              value={defaultcheck}
            />
          </View>

          {/* Custom URL */}
          {!defaultcheck && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CUSTOM SERVER URL</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="globe-outline" size={17} color="#5B7FA6" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="https://your-server.com"
                  placeholderTextColor="#A2AFC2"
                  autoCapitalize="none"
                  keyboardType="url"
                  onChangeText={(customurl) => setCustomUrl(customurl)}
                  value={customurl}
                />
              </View>
            </View>
          )}

          {/* Error message */}
          {error && (
            <View style={styles.errorBadge}>
              <Ionicons name="alert-circle-outline" size={15} color="#D94040" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View style={styles.loginBtnInner}>
                <Text style={styles.loginBtnText}>SIGN IN</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgetPin')}
            style={styles.forgotBtn}
          >
            <Text style={styles.forgotText}>Change password?</Text>
          </TouchableOpacity>
        </View>

        {/* Version footer */}
        <View style={styles.versionRow}>
          <Ionicons name="shield-checkmark-outline" size={12} color="#2E4A6B" />
          <Text style={styles.versionText}>V_{version}</Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.BLUE,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 22,
  },

  // Background Decorations
  bgCircle1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(26, 111, 219, 0.12)',
    top: -50,
    right: -70,
  },
  bgCircle2: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(26, 111, 219, 0.08)',
    bottom: 30,
    left: -50,
  },

  // Header
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    marginBottom: 12,
  },
  logoIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: COLORS.BUTTON,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.BUTTON,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  companyName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2.5,
    marginBottom: 6,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taglineDash: {
    width: 14,
    height: 1,
    backgroundColor: '#3D5A80',
  },
  tagline: {
    color: '#5B7FA6',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 22,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
    elevation: 18,
  },
  cardHeadRow: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0A1628',
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  cardSubtitle: {
    fontSize: 11.5,
    color: '#8A9BB0',
    lineHeight: 16,
    fontWeight: '400',
  },

  // Input Fields
  inputGroup: {
    marginBottom: 13,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#5B7FA6',
    letterSpacing: 1.1,
    marginBottom: 7,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F7FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    paddingHorizontal: 13,
    height: 40,
  },
  inputIcon: {
    marginRight: 9,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0A1628',
    fontWeight: '500',
    height: 40,
    padding: 0,
  },
  eyeBtn: {
    paddingHorizontal: 4,
  },

  // Toggle Row
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F7FB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    gap: 10,
  },
  toggleIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#E6F1FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A1628',
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: 10,
    color: '#8A9BB0',
    fontWeight: '400',
  },

  // Error Badge
  errorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD0D0',
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginBottom: 14,
  },
  errorText: {
    flex: 1,
    color: '#D94040',
    fontSize: 10.5,
    fontWeight: '500',
  },

  // Login Button
  loginBtn: {
    backgroundColor: COLORS.BUTTON,
    borderRadius: 14,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 14,
    shadowColor: COLORS.BUTTON,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  // Forgot
  forgotBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  forgotText: {
    color: COLORS.BUTTON,
    fontSize: 12,
    fontWeight: '600',
  },

  // Version
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 18,
  },
  versionText: {
    color: '#2E4A6B',
    fontSize: 10.5,
    letterSpacing: 0.6,
    fontWeight: '500',
  },
});

// Jamshed start