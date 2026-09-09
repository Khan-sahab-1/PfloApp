// import React, { useState } from 'react';
// import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import { launchCamera } from 'react-native-image-picker';
// import { getCurrentLocation, requestPermissions } from '../utils/permissions';
// import { COLORS } from '../styles/Colors';

// const SelfieModal = ({ visible, onClose,navigation }) => {
//   const [imageUri, setImageUri] = useState(null);
//   const [location, setLocation] = useState(null);

//   const handleCapture = async () => {
//     const hasPermission = await requestPermissions();
//     if (!hasPermission) return;

//     const result = await launchCamera({ mediaType: 'photo', saveToPhotos: false });
//     if (result.assets && result.assets[0]) {
//       setImageUri(result.assets[0].uri);
//     }

//     try {
//       const coords = await getCurrentLocation();
//       setLocation(coords);
//     } catch (err) {
//       console.log('Location error:', err);
//     }
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <TouchableOpacity style={styles.modalBackground} onPress={onClose}>
//         <View style={styles.modalContainer}>
//           <Text style={styles.title}>Check-in Selfie</Text>

//           {imageUri ? (
//             <Image source={{ uri: imageUri }} style={styles.preview} />
//           ) : (
//             <TouchableOpacity style={styles.captureBtn} onPress={handleCapture}>
//               <Text style={styles.captureText}>Take Selfie</Text>
//             </TouchableOpacity>
//           )}

//           {location && (
//             <Text style={styles.locationText}>
//               Lat: {location.latitude.toFixed(4)} | Long: {location.longitude.toFixed(4)}
//             </Text>
//           )}

//           <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
//             <Text style={styles.closeText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalBackground: {
//     flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
//   },
//   modalContainer: {
//     width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center'
//   },
//   title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
//   captureBtn: { padding: 10, backgroundColor: COLORS.BLUE, borderRadius: 8 },
//   captureText: { color: '#fff', fontWeight: 'bold' },
//   preview: { width: 200, height: 200, borderRadius: 10, marginVertical: 10 },
//   locationText: { marginTop: 10, color: COLORS.black },
//   closeBtn: { marginTop: 15 },
//   closeText: { color: COLORS.RED, fontWeight: 'bold' },
// });

// export default SelfieModal;


//bug id 2822 Jamshed start
// Description: Added a new modal component for taking a selfie and capturing the user's current location. The modal includes a button to launch the camera, displays the captured image, and shows the latitude and longitude of the user's location. The component is designed to be reusable and can be integrated into various parts of the app where selfie capture and location tracking are needed.
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { COLORS } from '../styles/Colors';

const SelfieModal = ({ visible, onClose, navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const result = await launchCamera({
          mediaType: 'photo',
          cameraType: 'front',
          quality: 0.3,
        });

        if (result.assets && result.assets[0]) {
          setImageUri(result.assets[0].uri);
          setImageData(result.assets[0]);
        }
      } else {
        Alert.alert('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const checkLocationPermissionAndContinue = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'GPS Permission',
        message: 'App needs access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      setLoading(true);
      console.log(Geolocation.getCurrentPosition,'Testing')
      Geolocation.getCurrentPosition(
        position => {
          setLoading(false);
          navigation.navigate('Maps', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            picture: imageData,
          });
          onClose();
        },
        error => {
          setLoading(false);
          Alert.alert('Location Error', error.message);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    } else {
      Alert.alert('Location permission denied');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Take a Selfie</Text>

          <TouchableOpacity
            onPress={requestCameraPermission}
            style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  imageUri ||
                  'https://previews.123rf.com/images/aguiters/aguiters1508/aguiters150800059/43551287-photo-camera-icon.jpg',
              }}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!imageUri || loading}
            onPress={checkLocationPermissionAndContinue}
            style={[
              styles.button,
              { backgroundColor: !imageUri || loading ? 'gray' : COLORS.BLUE },
            ]}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default SelfieModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F3F3F3',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  button: {
    height: 50,
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  closeBtn: { paddingVertical: 8 },
  closeText: { color: COLORS.BLUE, fontWeight: 'bold' },
});
//bug id 2822 Jamshed end
