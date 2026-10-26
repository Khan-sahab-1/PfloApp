// // import React, { useState, useContext, useEffect, useCallback } from "react";
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   TextInput,
// //   TouchableOpacity,
// //   Switch,
// //   Alert,
// //   ActivityIndicator,
// //   PermissionsAndroid,
// //   useColorScheme
// // } from "react-native";
// // import { useNavigation } from "@react-navigation/native";
// // import { authenticateUser } from "../odoo_service";
// // import { useAuth, AuthContext } from './Context';
// // import axios from "axios";
// // import { launchCamera } from 'react-native-image-picker';
// // import Geolocation from 'react-native-geolocation-service';
// // import urls from '../../url';
// // import ImageResizer from 'react-native-image-resizer';
// // import { useFocusEffect } from '@react-navigation/native';
// // import ButtonCompo from "../components/ButtonCompo";
// // import { useDispatch } from "react-redux";
// // import API, { BASE_URL } from "../utils/apiurls";
// // import { loginAsync } from "../redux/reducers/authreducers";
// // import { showFlashMessage } from "../utils/fleshmessage";
// // import Loader from "../components/Loader";
// // import { COLORS } from "../styles/Colors";
// // import DeviceInfo from "react-native-device-info";



// // export default function UserLogInScreen({ navigation, route }) {

// //   const contextType = useContext(AuthContext);

// //   const [username, setUsername] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [error, setError] = useState(null);
// //   const [defaultcheck, setDefaultCheck] = useState(true);
// //   const [customurl, setCustomUrl] = useState("");
// //   const [showPassword, setShowPassword] = useState(false);
// //   // Ankit Added Start
// //   const [loading, setLoading] = useState(false);
// //   const { openCam } = route.params || {};
// //   const colorschema = useColorScheme()
// //   const isDark = colorschema === 'dark';
// //   // Ankit Added End

// //   const toggleSwitch = () => { setDefaultCheck(!defaultcheck); }

// //   // Ankit Added Start
// //   useEffect(() => {
// //     const unsubscribe = navigation.addListener('blur', () => {
// //       setLoading(false);
// //     });
// //     return unsubscribe;
// //   }, [navigation]);

// //   useFocusEffect(
// //     useCallback(() => {
// //       console.log(route.params)
// //       if (openCam === true) {
// //         requestCameraPermission(); // Call the function if the key matches
// //       }

// //       // Optional cleanup
// //       return () => {
// //         console.log('Screen lost focus or key condition changed');
// //       };
// //     }, [openCam]) // Dependency array includes key
// //   );

// //   // Ankit Added End

// //   const version = DeviceInfo.getVersion(); // e.g. "1.0.0"
// //   const buildNumber = DeviceInfo.getBuildNumber();
// //   // console.log(version, 'version');
// //   // console.log(buildNumber, 'buildNumber');
// //   const handleLogin = async () => {
// //     console.log(contextType.currentUrl, 'contextType.currentUrl')

// //     if (!defaultcheck) {
// //       if (customurl) {
// //         contextType.setCurrentUrl(customurl)
// //       } else {
// //         showFlashMessage({
// //           message: "Error!",
// //           description: "Please enter Custom Url or Toggle production Switch",
// //           type: "danger",
// //           backgroundColor: "red",
// //         })
// //         // alert("Please enter Custom Url or Toggle production Switch")
// //         return
// //       }
// //     }
// //     try {
// //       setLoading(true)
// //       const login_url = defaultcheck ? contextType.currentUrl : customurl
// //       const isValidUser = await authenticateUser(username, password, login_url);

// //       console.log(isValidUser, 'ValidUser')
// //       if (isValidUser) {
// //         showFlashMessage({
// //           message: "Success!",
// //           description: `Logged in as ${username}`,
// //           type: "success",
// //           backgroundColor: COLORS.success,
// //         });
// //         setUsername('');
// //         setPassword('');
// //         setCustomUrl('');
// //         // alert(`Logged in as ${username}`);
// //         navigation.navigate("Tabroutes");
// //       } else {
// //         showFlashMessage({
// //           message: "Error!",
// //           description: "Invalid User name and Password",
// //           type: "danger",
// //           backgroundColor: "red",
// //         })
// //       }
// //     } catch (err) {
// //       console.error("Login error:", err);
// //       setError(`Login failed: ${err.message}`);
// //     } finally {
// //       setLoading(false)
// //     }
// //   };

// //   // Ankit Added start
// //   const handleAttendancePress = async (lat, longt, pic) => {
// //     try {
// //       const domain_url = defaultcheck ? contextType.currentUrl : customurl
// //       let urlsApi = domain_url + urls.odooAutoMarkAttendance;
// //       console.log('urlsApi', urlsApi)
// //       let data = new FormData();
// //       data.append('file', {
// //         uri: pic.uri,
// //         name: pic.fileName,
// //         type: pic.type,
// //       });
// //       const params = {
// //         latitude: lat,
// //         longitude: longt,
// //       };
// //       data.append('details', JSON.stringify(params));
// //       console.log('testing', pic, lat, longt)
// //       console.log('testing3', data)
// //       let response = {};
// //       response = await axios
// //         .post(urlsApi, data, {
// //           headers: {
// //             Accept: 'application/json',
// //             'Content-Type': 'multipart/form-data',
// //           },
// //         })
// //         .then(resp => {
// //           let responseData = resp.data;
// //           if (responseData && responseData.attendance_marked) {

// //             navigation.navigate('AttendanceDetail', {
// //               responseData: responseData,
// //             });
// //           } else {
// //             showAlert(responseData.message || 'Attendance marked Failed!');
// //           }
// //         })
// //         .catch(err => {
// //           console.log('error', err);
// //           showAlert(err.message || 'Error: Something not Working');
// //           setLoading(false);
// //         });

// //     } catch (err) {
// //       console.log('error', err, err.message);
// //       setLoading(false);
// //     }
// //   };

// //   const getCurrentLocation = async (picture = false) => {
// //     Geolocation.getCurrentPosition(
// //       position => {
// //         if (position) {
// //           console.log('----------', position);
// //           handleAttendancePress(
// //             lat = position.coords.latitude,
// //             longt = position.coords.longitude,
// //             picture = picture,
// //           );
// //         }
// //       },
// //       error => {
// //         const { code, message } = error;
// //         console.warn(code, message);
// //       },
// //       { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
// //     );
// //   };

// //   const requestCameraPermission = async () => {
// //     try {
// //       const granted = await PermissionsAndroid.request(
// //         PermissionsAndroid.PERMISSIONS.CAMERA,
// //         {
// //           title: 'Cool Photo App Camera Permission',
// //           message:
// //             'Cool Photo App needs access to your camera ' +
// //             'so you can take awesome pictures.',
// //           buttonNeutral: 'Ask Me Later',
// //           buttonNegative: 'Cancel',
// //           buttonPositive: 'OK',
// //         },
// //       );
// //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
// //         const result = await launchCamera({
// //           mediaType: 'photo',
// //           cameraType: 'font',
// //           // includeBase64: true,
// //           quality: 0.2,
// //         });
// //         const newImage = compressImgae(result?.assets[0]);

// //       } else {
// //         console.log('Camera permission denied');
// //       }
// //     } catch (err) {
// //       console.warn(err);
// //     }
// //   };

// //   const compressImgae = pic => {
// //     setLoading(true);
// //     ImageResizer.createResizedImage(pic.uri, pic.width, pic.height, 'JPEG', 5) // Width, Height, Format, Quality
// //       .then(resizedImage => {
// //         // const original_size= formatSize(pic.fileSize)
// //         // const new_size = formatSize(resizedImage.size)
// //         // console.log(`newsize ${new_size}, original size ${original_size}`);
// //         const newImage = { ...resizedImage, type: pic.type, fileName: pic.fileName };
// //         checkPermissionGPS(newImage)
// //         // handleAttendancePress(37.4219983,-122.084,newImage)
// //         // showAlert(`newsize ${new_size}, original size ${original_size}`)
// //       })
// //       .catch(err => {
// //         console.log('Image Resizer Error: ', err);
// //         checkPermissionGPS(pic)
// //         // handleAttendancePress(37.4219983,-122.084,pic)
// //       });
// //   };

// //   const formatSize = sizeInBytes => {
// //     if (sizeInBytes < 1024) {
// //       return `${sizeInBytes} bytes`;
// //     } else if (sizeInBytes < 1024 * 1024) {
// //       return `${(sizeInBytes / 1024).toFixed(2)} KB`;
// //     } else {
// //       return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
// //     }
// //   };

// //   const checkPermissionGPS = async (pic = false) => {
// //     try {
// //       const granted = await PermissionsAndroid.request(
// //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
// //         {
// //           title: 'Cool Photo App Gps Permission',
// //           message:
// //             'Cool Photo App needs access to your Gps ' +
// //             'so you can take awesome pictures.',
// //           buttonNeutral: 'Ask Me Later',
// //           buttonNegative: 'Cancel',
// //           buttonPositive: 'OK',
// //         },
// //       );
// //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
// //         getCurrentLocation((pic = pic));
// //       } else {
// //         console.log('Camera permission denied');
// //       }
// //     } catch (err) {
// //       Alert.alert(err);
// //     }
// //   };

// //   const showAlert = message => {
// //     Alert.alert(
// //       'Attendance Marked',
// //       message,
// //       [{ text: 'OK', style: 'default' }],
// //       { cancelable: false },
// //     );
// //   };



// //   return (
// //     <View style={{ ...styles.container, backgroundColor: isDark ? '#000' : '#fff', }}>

// //       <Text style={styles.headerText}>Chadha Industries</Text>
// //       <View style={styles.loginBox}>
// //         <Text style={styles.titleText}>Employee Login</Text>
// //         <View style={styles.inputView}>
// //           <TextInput
// //             style={{
// //               ...styles.TextInput, backgroundColor: isDark ? COLORS.ISDARK : COLORS.white,
// //               color: isDark ? COLORS.white : "#555"
// //             }}
// //             placeholder="Employee ID / Punch Code"
// //             placeholderTextColor={isDark ? COLORS.white : "#555"}
// //             onChangeText={(username) => setUsername(username)}
// //             value={username}  
// //           />
// //         </View>
// //         <View style={styles.inputView}>
// //           <TextInput
// //             style={{
// //               ...styles.TextInput, backgroundColor: isDark ? COLORS.ISDARK : COLORS.white,
// //               color: isDark ? COLORS.white : "#555"
// //             }}
// //             placeholder="Password/Pin"
// //             placeholderTextColor={isDark ? COLORS.white : "#555"}
// //             secureTextEntry={!showPassword}
// //             onChangeText={(password) => setPassword(password)}
// //             value={password}
// //           />
// //           <TouchableOpacity
// //             style={styles.showPasswordBtn}
// //             onPress={() => setShowPassword(!showPassword)}
// //           >
// //             <Text style={styles.showPasswordText}>
// //               {showPassword ? "Hide" : "Show"}
// //             </Text>
// //           </TouchableOpacity>
// //         </View>
// //         {
// //           !defaultcheck &&
// //           <View style={styles.inputView}>
// //             <TextInput
// //               style={{
// //                 ...styles.TextInput, backgroundColor: isDark ? COLORS.ISDARK : COLORS.white,
// //                 color: isDark ? COLORS.white : "#555"
// //               }}
// //               placeholder="Enter Url"
// //               placeholderTextColor={isDark ? COLORS.white : "#555"}
// //               onChangeText={(customurl) => setCustomUrl(customurl)}
// //               value={customurl}
// //             />
// //           </View>
// //         }

// //         <View style={styles.switchContainer}>
// //           <Text style={styles.switchLabel}>Use Custom URL</Text>
// //           <Switch
// //             trackColor={{ false: '#767577', true: 'blue' }}
// //             thumbColor={defaultcheck ? 'blue' : 'grey'}
// //             ios_backgroundColor="#3e3e3e"
// //             onValueChange={toggleSwitch}
// //             value={defaultcheck}
// //           />
// //         </View>

// //         <TouchableOpacity
// //           style={styles.loginBtn}
// //           onPress={handleLogin}
// //         >
// //           <Text style={styles.loginText}>LOGIN</Text>
// //         </TouchableOpacity>
// //         {/* <ButtonCompo title="LOGIN"/> */}
// //         {/* Ankit Added start */}
// //         {/*<TouchableOpacity
// //           style={styles.loginBtn}
// //           onPress={requestCameraPermission}
// //         >
// //           <Text style={styles.loginText}>Auto Mark</Text>
// //         </TouchableOpacity>}
// //         {loading && <ActivityIndicator size="large" color="blue" />}
// //         {/* Ankit Added End */}
// //         <TouchableOpacity onPress={() => navigation.navigate('ForgetPin')}>
// //           <Text style={styles.forgotPasswordText}>Change Password?</Text>
// //         </TouchableOpacity>
// //       </View>
// //       {error && <Text style={styles.errorText}>{error}</Text>}
// //       <Loader visible={loading} />
// //       <Text style={{fontSize:16,fontWeight:'800',marginTop:30}}>V_{version}</Text>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#F0F0F0",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   headerText: {
// //     fontSize: 30,
// //     fontWeight: "bold",
// //     marginBottom: 20,
// //     color: "blue",
// //     fontStyle: "italic",
// //   },
// //   loginBox: {
// //     backgroundColor: "white",
// //     borderRadius: 10,
// //     width: "80%",
// //     padding: 20,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     elevation: 70,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 4,
// //   },
// //   titleText: {
// //     fontSize: 18,
// //     marginBottom: 20,
// //     textAlign: "center",
// //     color: "#333",
// //     fontWeight: "bold",
// //   },
// //   inputView: {
// //     backgroundColor: "white",
// //     borderRadius: 6,
// //     width: "100%",
// //     height: 45,
// //     marginBottom: 20,
// //     paddingHorizontal: 20,
// //     justifyContent: "center",
// //   },
// //   TextInput: {
// //     height: 45,
// //     flex: 1,
// //     color: "#333",
// //     fontWeight: "bold",
// //     borderColor: "black",
// //     borderWidth: 0.2,
// //     borderRadius: 6
// //   },

// //   showPasswordBtn: {
// //     position: "absolute",
// //     right: 10,
// //     top: 12,
// //     paddingHorizontal: 20,
// //     backgroundColor: "transparent",
// //   },
// //   showPasswordText: {
// //     color: "blue",
// //     fontWeight: "bold",
// //   },
// //   loginBtn: {
// //     width: "90%",
// //     borderRadius: 12,
// //     height: 50,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginTop: 10,
// //     backgroundColor: "blue",
// //   },
// //   loginText: {
// //     color: "white",
// //     fontWeight: "bold",
// //   },
// //   errorText: {
// //     color: "red",
// //     marginTop: 10,
// //   },
// //   switchContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //   },
// //   switchLabel: {
// //     flex: 1,
// //     color: '#333',
// //     fontWeight: 'bold',
// //     marginRight: 10,
// //   },
// //   forgotPasswordText: {
// //     color: "blue",
// //     marginBottom: 20,
// //     textDecorationLine: "underline",
// //     paddingTop: 10,
// //   },
// // });

// // Jamshed start 
// import React, { useState, useContext, useEffect, useCallback } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Switch,
//   Alert,
//   ActivityIndicator,
//   PermissionsAndroid,
//   useColorScheme,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { authenticateUser } from "../odoo_service";
// import { useAuth, AuthContext } from './Context';
// import axios from "axios";
// import { launchCamera } from 'react-native-image-picker';
// import Geolocation from 'react-native-geolocation-service';
// import urls from '../../url';
// import ImageResizer from 'react-native-image-resizer';
// import { useFocusEffect } from '@react-navigation/native';
// import ButtonCompo from "../components/ButtonCompo";
// import { useDispatch } from "react-redux";
// import API, { BASE_URL } from "../utils/apiurls";
// import { loginAsync } from "../redux/reducers/authreducers";
// import { showFlashMessage } from "../utils/fleshmessage";
// import Loader from "../components/Loader";
// import { COLORS } from "../styles/Colors";
// import DeviceInfo from "react-native-device-info";
// import { stopTracking } from "../components/BackgroundLocationService";

// export default function UserLogInScreen({ navigation, route }) {
//   const contextType = useContext(AuthContext);
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [defaultcheck, setDefaultCheck] = useState(true);
//   const [customurl, setCustomUrl] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   // Ankit Added Start
//   const [loading, setLoading] = useState(false);
//   const { openCam } = route.params || {};
//   const colorschema = useColorScheme()
//   const isDark = colorschema === 'dark';
//   // Ankit Added End

//   const toggleSwitch = () => {
//     setDefaultCheck(!defaultcheck);
//   }

//   // Ankit Added Start
//   useEffect(() => {
//     const unsubscribe = navigation.addListener('blur', () => {
//       setLoading(false);
//     });
//     return unsubscribe;
//   }, [navigation]);

//   useFocusEffect(
//     useCallback(() => {
//       stopTracking().catch(error => {
//         console.warn('[PFLO Tracking] Failed to stop on login screen', {
//           message: error?.message,
//         });
//       });
//       console.log(route.params)
//       if (openCam === true) {
//         requestCameraPermission();
//       }
//       return () => {
//         console.log('Screen lost focus or key condition changed');
//       };
//     }, [openCam])
//   );
//   // Ankit Added End

//   const version = DeviceInfo.getVersion();
//   const buildNumber = DeviceInfo.getBuildNumber();

//   const handleLogin = async () => {
//     console.log(contextType.currentUrl, 'contextType.currentUrl')
//     if (!defaultcheck) {
//       if (customurl) {
//         contextType.setCurrentUrl(customurl)
//       } else {
//         showFlashMessage({
//           message: "Error!",
//           description: "Please enter Custom Url or Toggle production Switch",
//           type: "danger",
//           backgroundColor: "red",
//         })
//         return
//       }
//     }
//     try {
//       setLoading(true)
//       const login_url = defaultcheck ? contextType.currentUrl : customurl
//       const isValidUser = await authenticateUser(username, password, login_url);
//       console.log(isValidUser, 'ValidUser')
//       if (isValidUser) {
//         showFlashMessage({
//           message: "Success!",
//           description: `Logged in as ${username}`,
//           type: "success",
//           backgroundColor: COLORS.success,
//         });
//         setUsername('');
//         setPassword('');
//         setCustomUrl('');
//         navigation.navigate("Tabroutes");
//       } else {
//         showFlashMessage({
//           message: "Error!",
//           description: "Invalid User name and Password",
//           type: "danger",
//           backgroundColor: "red",
//         })
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError(`Login failed: ${err.message}`);
//     } finally {
//       setLoading(false)
//     }
//   };

//   // Ankit Added start
//   const handleAttendancePress = async (lat, longt, pic) => {
//     try {
//       const domain_url = defaultcheck ? contextType.currentUrl : customurl
//       let urlsApi = domain_url + urls.odooAutoMarkAttendance;
//       console.log('urlsApi', urlsApi)
//       let data = new FormData();
//       data.append('file', {
//         uri: pic.uri,
//         name: pic.fileName,
//         type: pic.type,
//       });
//       const params = {
//         latitude: lat,
//         longitude: longt,
//       };
//       data.append('details', JSON.stringify(params));
//       console.log('testing', pic, lat, longt)
//       console.log('testing3', data)
//       let response = {};
//       response = await axios
//         .post(urlsApi, data, {
//           headers: {
//             Accept: 'application/json',
//             'Content-Type': 'multipart/form-data',
//           },
//         })
//         .then(resp => {
//           let responseData = resp.data;
//           if (responseData && responseData.attendance_marked) {
//             navigation.navigate('AttendanceDetail', {
//               responseData: responseData,
//             });
//           } else {
//             showAlert(responseData.message || 'Attendance marked Failed!');
//           }
//         })
//         .catch(err => {
//           console.log('error', err);
//           showAlert(err.message || 'Error: Something not Working');
//           setLoading(false);
//         });
//     } catch (err) {
//       console.log('error', err, err.message);
//       setLoading(false);
//     }
//   };

//   const getCurrentLocation = async (picture = false) => {
//     Geolocation.getCurrentPosition(
//       position => {
//         if (position) {
//           console.log('----------', position);
//           handleAttendancePress(
//             position.coords.latitude,
//             position.coords.longitude,
//             picture,
//           );
//         }
//       },
//       error => {
//         const { code, message } = error;
//         console.warn(code, message);
//       },
//       { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
//     );
//   };

//   const requestCameraPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//         {
//           title: 'Cool Photo App Camera Permission',
//           message:
//             'Cool Photo App needs access to your camera ' +
//             'so you can take awesome pictures.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         const result = await launchCamera({
//           mediaType: 'photo',
//           cameraType: 'front',
//           quality: 0.2,
//           saveToPhotos: false,
//         });
//         if (result?.didCancel) {
//           return;
//         }
//         if (result?.errorCode) {
//           Alert.alert('Camera Error', result.errorMessage || 'Camera open nahi ho saka.');
//           return;
//         }
//         const capturedPhoto = result?.assets?.[0];
//         if (!capturedPhoto?.uri) {
//           Alert.alert('Camera Error', 'Photo capture nahi hui. Please try again.');
//           return;
//         }
//         compressImgae(capturedPhoto);
//       } else {
//         console.log('Camera permission denied');
//         Alert.alert('Camera permission denied');
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   };

//   const compressImgae = pic => {
//     setLoading(true);
//     ImageResizer.createResizedImage(pic.uri, pic.width, pic.height, 'JPEG', 5)
//       .then(resizedImage => {
//         const newImage = { ...resizedImage, type: pic.type, fileName: pic.fileName };
//         checkPermissionGPS(newImage)
//       })
//       .catch(err => {
//         console.log('Image Resizer Error: ', err);
//         checkPermissionGPS(pic)
//       });
//   };

//   const formatSize = sizeInBytes => {
//     if (sizeInBytes < 1024) {
//       return `${sizeInBytes} bytes`;
//     } else if (sizeInBytes < 1024 * 1024) {
//       return `${(sizeInBytes / 1024).toFixed(2)} KB`;
//     } else {
//       return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
//     }
//   };

//   const checkPermissionGPS = async (pic = false) => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Cool Photo App Gps Permission',
//           message:
//             'Cool Photo App needs access to your Gps ' +
//             'so you can take awesome pictures.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         getCurrentLocation((pic = pic));
//       } else {
//         console.log('Camera permission denied');
//         Alert.alert('GPS permission denied');
//       }
//     } catch (err) {
//       Alert.alert(err);
//     }
//   };

//   const showAlert = message => {
//     Alert.alert(
//       'Attendance Marked',
//       message,
//       [{ text: 'OK', style: 'default' }],
//       { cancelable: false },
//     );
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.root}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <StatusBar barStyle="light-content" backgroundColor="#0A1628" />
//       <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

//         {/* Background decorative circles */}
//         <View style={styles.bgCircle1} />
//         <View style={styles.bgCircle2} />

//         {/* Header Section */}
//         <View style={styles.headerSection}>
//           <View style={styles.logoContainer}>
//             <View style={styles.logoIcon}>
//               <Text style={styles.logoLetter}>CI</Text>
//             </View>
//           </View>
//           <Text style={styles.companyName}>CHADHA INDUSTRIES</Text>
//           <Text style={styles.tagline}>Employee Portal</Text>
//         </View>

//         {/* Card */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Welcome Back</Text>
//           <Text style={styles.cardSubtitle}>Sign in to your account</Text>

//           {/* Username */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>EMPLOYEE ID / PUNCH CODE</Text>
//             <View style={styles.inputWrapper}>
//               <Text style={styles.inputIcon}>👤</Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="Employee ID / Punch Code"
//                 placeholderTextColor="#8A9BB0"
//                 autoCapitalize="none"
//                 onChangeText={(username) => setUsername(username)}
//                 value={username}
//               />
//             </View>
//           </View>

//           {/* Password */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>PASSWORD</Text>
//             <View style={styles.inputWrapper}>
//               <Text style={styles.inputIcon}>🔒</Text>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="Enter your password"
//                 placeholderTextColor="#8A9BB0"
//                 secureTextEntry={!showPassword}
//                 onChangeText={(password) => setPassword(password)}
//                 value={password}
//               />
//               <TouchableOpacity
//                 onPress={() => setShowPassword(!showPassword)}
//                 style={styles.eyeBtn}
//               >
//                 <Text style={styles.eyeText}>{showPassword ? "🙈" : "👁️"}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Production URL Toggle */}
//           <View style={styles.toggleRow}>
//             <View style={styles.toggleInfo}>
//               <Text style={styles.toggleTitle}>Use Custom Server</Text>
//               <Text style={styles.toggleDesc}>{defaultcheck ? "Using default URL" : "Using custom URL"}</Text>
//             </View>
//             <Switch
//               trackColor={{ false: '#E8EDF2', true: '#C7E0FF' }}
//               thumbColor={defaultcheck ? '#1A6FDB' : '#94A3B8'}
//               ios_backgroundColor="#E8EDF2"
//               onValueChange={toggleSwitch}
//               value={defaultcheck}
//             />
//           </View>

//           {/* Custom URL */}
//           {!defaultcheck && (
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>CUSTOM SERVER URL</Text>
//               <View style={styles.inputWrapper}>
//                 <Text style={styles.inputIcon}>🌐</Text>
//                 <TextInput
//                   style={styles.textInput}
//                   placeholder="https://your-server.com"
//                   placeholderTextColor="#8A9BB0"
//                   autoCapitalize="none"
//                   keyboardType="url"
//                   onChangeText={(customurl) => setCustomUrl(customurl)}
//                   value={customurl}
//                 />
//               </View>
//             </View>
//           )}

//           {/* Error message */}
//           {error && (
//             <View style={styles.errorBadge}>
//               <Text style={styles.errorText}>⚠️  {error}</Text>
//             </View>
//           )}

//           {/* Login Button */}
//           <TouchableOpacity
//             style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
//             onPress={handleLogin}
//             disabled={loading}
//             activeOpacity={0.85}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" size="small" />
//             ) : (
//               <Text style={styles.loginBtnText}>SIGN IN →</Text>
//             )}
//           </TouchableOpacity>

//           {/* Forgot Password */}
//           <TouchableOpacity
//             onPress={() => navigation.navigate('ForgetPin')}
//             style={styles.forgotBtn}
//           >
//             <Text style={styles.forgotText}>Change Password?</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Version footer */}
//         <Text style={styles.versionText}>V_{version}</Text>

//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: '#0A1628',
//   },
//   scrollContent: {
//     flexGrow: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 40,
//     paddingHorizontal: 24,
//   },

//   // Background Decorations
//   bgCircle1: {
//     position: 'absolute',
//     width: 320,
//     height: 320,
//     borderRadius: 160,
//     backgroundColor: 'rgba(26, 111, 219, 0.12)',
//     top: -60,
//     right: -80,
//   },
//   bgCircle2: {
//     position: 'absolute',
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     backgroundColor: 'rgba(26, 111, 219, 0.08)',
//     bottom: 40,
//     left: -60,
//   },

//   // Header
//   headerSection: {
//     alignItems: 'center',
//     marginBottom: 25,
//   },
//   logoContainer: {
//     marginBottom: 14,
//   },
//   logoIcon: {
//     width: 64,
//     height: 64,
//     borderRadius: 18,
//     backgroundColor: '#1A6FDB',
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#1A6FDB',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.5,
//     shadowRadius: 16,
//     elevation: 12,
//   },
//   logoLetter: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '800',
//     letterSpacing: 1,
//   },
//   companyName: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '800',
//     letterSpacing: 3,
//     marginBottom: 4,
//   },
//   tagline: {
//     color: '#5B7FA6',
//     fontSize: 10,
//     fontWeight: '500',
//     letterSpacing: 1.5,
//     textTransform: 'uppercase',
//   },

//   // Card
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 24,
//     width: '100%',
//     maxWidth: 400,
//     paddingHorizontal: 25,
//     paddingVertical: 28,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 20 },
//     shadowOpacity: 0.25,
//     shadowRadius: 40,
//     elevation: 20,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: '800',
//     color: '#0A1628',
//     marginBottom: 4,
//     letterSpacing: -0.5,
//   },
//   cardSubtitle: {
//     fontSize: 11,
//     color: '#8A9BB0',
//     marginBottom: 25,
//     fontWeight: '400',
//   },

//   // Input Fields
//   inputGroup: {
//     marginBottom: 15,
//   },
//   inputLabel: {
//     fontSize: 9,
//     fontWeight: '700',
//     color: '#5B7FA6',
//     letterSpacing: 1.2,
//     marginBottom: 8,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F4F7FB',
//     borderRadius: 12,
//     borderWidth: 1.5,
//     borderColor: '#E8EDF2',
//     paddingHorizontal: 14,
//     height: 40,
//   },
//   inputIcon: {
//     fontSize: 14,
//     marginRight: 10,
//   },
//   textInput: {
//     flex: 1,
//     fontSize: 14,
//     color: '#0A1628',
//     fontWeight: '500',
//     height: 45,
//   },
//   eyeBtn: {
//     paddingHorizontal: 4,
//   },
//   eyeText: {
//     fontSize: 18,
//   },

//   // Toggle Row
//   toggleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F4F7FB',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     marginBottom: 18,
//     borderWidth: 1.5,
//     borderColor: '#E8EDF2',
//   },
//   toggleInfo: {
//     flex: 1,
//   },
//   toggleTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#0A1628',
//     marginBottom: 2,
//   },
//   toggleDesc: {
//     fontSize: 10,
//     color: '#8A9BB0',
//     fontWeight: '400',
//   },

//   // Error Badge
//   errorBadge: {
//     backgroundColor: '#FFF0F0',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#FFD0D0',
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     marginBottom: 16,
//   },
//   errorText: {
//     color: '#D94040',
//     fontSize: 10,
//     fontWeight: '500',
//   },

//   // Login Button
//   loginBtn: {
//     backgroundColor: '#1A6FDB',
//     borderRadius: 14,
//     height: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 4,
//     marginBottom: 16,
//     shadowColor: '#1A6FDB',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.35,
//     shadowRadius: 14,
//     elevation: 8,
//   },
//   loginBtnDisabled: {
//     opacity: 0.7,
//   },
//   loginBtnText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: '800',
//     letterSpacing: 2,
//   },

//   // Forgot
//   forgotBtn: {
//     alignItems: 'center',
//     paddingVertical: 4,
//   },
//   forgotText: {
//     color: '#1A6FDB',
//     fontSize: 12,
//     fontWeight: '600',
//     textDecorationLine: 'underline',
//   },

//   // Version
//   versionText: {
//     color: '#2E4A6B',
//     fontSize: 11,
//     marginTop: 20,
//     letterSpacing: 1,
//     fontWeight: '500',
//   },
// });

// // Jamshed start 

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
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const result = await launchCamera({
          mediaType: 'photo',
          cameraType: 'front',
          quality: 0.2,
          saveToPhotos: false,
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
      console.warn(err);
    }
  };

  const compressImgae = pic => {
    setLoading(true);
    ImageResizer.createResizedImage(pic.uri, pic.width, pic.height, 'JPEG', 5)
      .then(resizedImage => {
        const newImage = { ...resizedImage, type: pic.type, fileName: pic.fileName };
        checkPermissionGPS(newImage)
      })
      .catch(err => {
        console.log('Image Resizer Error: ', err);
        checkPermissionGPS(pic)
      });
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