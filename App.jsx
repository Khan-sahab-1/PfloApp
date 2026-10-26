// import {StatusBar, StyleSheet} from 'react-native';
// import React, {useState} from 'react';
// import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';
// import {Provider} from 'react-redux';
// import {AuthContext} from './src/Screens/Context';
// import FlashMessage from 'react-native-flash-message';
// import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

// import {store} from './src/redux/store';
// import Routes from './src/route/Routes';
// import ConnectionGuard from './src/offline/ConnectionGuard';
// import AutoSyncProvider from './src/offline/AutoSyncProvider';
// import {BASE_URL} from './src/utils/apiurls';
// import { COLORS } from './src/styles/Colors';


// const App = () => {
//   const navigationRef = useNavigationContainerRef();
//   // const [currentUrl, setCurrentUrl] = useState("http://192.168.2.39:6565");
//   //Jamshed Ali Added Start - Bug ID 2555
//   // Description: Added state management for the current server URL with a default value, allowing dynamic updates to the server endpoint used throughout the application.
//   const [currentUrl, setCurrentUrl] = useState(BASE_URL);
//   //Jamshed Ali Added End - Bug ID 2555
//   // const [currentUrl, setCurrentUrl] = useState("https://arkefilters.pflo.co.in");
//   // const [currentUrl, setCurrentUrl] = useState("https://preqa1.arkess.com");
//   // const [currentUrl, setCurrentUrl] = useState("https://arkefilters.pflo.co.in");
//   // PushNotification.createChannel(
//   //   {
//   //     channelId: 'meeting_reminders', // ✅ MUST MATCH the one used in your code
//   //     channelName: 'Meeting Reminders',
//   //     channelDescription: 'Reminders for scheduled meetings',
//   //     playSound: true,
//   //     soundName: 'default',
//   //     importance: 4,
//   //     vibrate: true,
//   //   },
//   //   created => console.log(`✅ Notification channel created: ${created}`)
//   // );
//   // useEffect(() => {
//   //   if (Platform.OS === 'android' && Platform.Version >= 33) {
//   //     PermissionsAndroid.request(
//   //       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
//   //     ).then(result => {
//   //       if (result === PermissionsAndroid.RESULTS.GRANTED) {
//   //         console.log('🔐 Notification permission granted');
//   //       } else {
//   //         console.warn('❌ Notification permission denied');
//   //       }
//   //     });
//   //   }
//   // }, []);
//   return (
//     <>
//       <Provider store={store}>
//         <AuthContext.Provider value={{currentUrl, setCurrentUrl}}>
//           <SafeAreaProvider>
            
            
//             <SafeAreaView style={styles.container}
//               edges={['top', 'left', 'right']}>
                
//               {/* <StatusBar backgroundColor={COLORS.BLUE} /> */}
//               <NavigationContainer ref={navigationRef}>
//                 <ConnectionGuard navigationRef={navigationRef} />
//                 <AutoSyncProvider />
//                 <Routes />
//               </NavigationContainer>
//               <FlashMessage position="center" duration={2000} />
//             </SafeAreaView>
//           </SafeAreaProvider>
//         </AuthContext.Provider>
//       </Provider>
//     </>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {flex: 1},
// });

// // import React from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// // } from 'react-native';
// // import { startTracking, stopTracking } from './src/components/BackgroundLocationService';

// // const App = () => {
// //   const onStart = async () => {
// //     try {
// //       await startTracking();
// //       console.log('Tracking Started');
// //     } catch (e) {
// //       console.log(e);
// //     }
// //   };

// //   const onStop = async () => {
// //     try {
// //       await stopTracking();
// //       console.log('Tracking Stopped');
// //     } catch (e) {
// //       console.log(e);
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>
// //         PFLO Live Location
// //       </Text>

// //       <TouchableOpacity
// //         style={styles.startButton}
// //         onPress={onStart}>
// //         <Text style={styles.buttonText}>
// //           Start Tracking
// //         </Text>
// //       </TouchableOpacity>

// //       <TouchableOpacity
// //         style={styles.stopButton}
// //         onPress={onStop}>
// //         <Text style={styles.buttonText}>
// //           Stop Tracking
// //         </Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // export default App;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#fff',
// //   },

// //   title: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     marginBottom: 40,
// //   },

// //   startButton: {
// //     width: 220,
// //     height: 55,
// //     backgroundColor: '#28a745',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 10,
// //     marginBottom: 20,
// //   },

// //   stopButton: {
// //     width: 220,
// //     height: 55,
// //     backgroundColor: '#dc3545',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 10,
// //   },

// //   buttonText: {
// //     color: '#fff',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// // });



import React, {useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

import {Provider} from 'react-redux';
import FlashMessage from 'react-native-flash-message';

import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {store} from './src/redux/store';
import {AuthContext} from './src/Screens/Context';
import Routes from './src/route/Routes';
import ConnectionGuard from './src/offline/ConnectionGuard';
import AutoSyncProvider from './src/offline/AutoSyncProvider';
import {BASE_URL} from './src/utils/apiurls';
import {COLORS} from './src/styles/Colors';

const AppContent = ({navigationRef}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
        hidden={false}
      />

      {/* Blue background behind Android status bar */}
      <View
        style={[
          styles.statusBarBackground,
          {height: insets.top},
        ]}
      />

      {/* Main application content */}
      <SafeAreaView
        style={styles.container}
        edges={['left', 'right', 'bottom']}>

        <NavigationContainer ref={navigationRef}>
          <ConnectionGuard navigationRef={navigationRef} />
          <AutoSyncProvider />
          <Routes />
        </NavigationContainer>

        <FlashMessage position="center" duration={2000} />
      </SafeAreaView>
    </View>
  );
};

const App = () => {
  const navigationRef = useNavigationContainerRef();
  const [currentUrl, setCurrentUrl] = useState(BASE_URL);

  return (
    <Provider store={store}>
      <AuthContext.Provider value={{currentUrl, setCurrentUrl}}>
        <SafeAreaProvider>
          <AppContent navigationRef={navigationRef} />
        </SafeAreaProvider>
      </AuthContext.Provider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.BLUE,
  },
  statusBarBackground: {
    width: '100%',
    backgroundColor: COLORS.BLUE,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
