// //jamshed start bug id 2555
// // Description: Created a bottom tab navigator using React Navigation's createBottomTabNavigator. This navigator includes tabs for Home, Calendar, Notification, and CRM screens, each with its own icon that changes based on the focused state. The Tabroutes component manages the navigation between these tabs and integrates with the Redux store to fetch user data and conditionally render the CRM tab based on user permissions. The design ensures a consistent and intuitive navigation experience for users while maintaining a clean and organized code structure.
// import React, { useContext, useEffect } from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Calendar, Home, Notification,Crm  } from '../screen/Index'; // Adjust based on your exports
// import { COLORS } from '../styles/Colors';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserData } from '../redux/reducers/Userinforeducers';
// import { AuthContext } from '../Screens/Context';
// // Replace with your color constants path

// const Tab = createBottomTabNavigator();

// function Tabroutes({route}) {
//  const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   console.log(server_origin, 'Server Origin');
//   console.log(route.params,'wowoowowowowowowowowow')

// const dispatch=useDispatch()

//   useEffect(() => {
//       dispatch(fetchUserData(server_origin));
//     }, []);
//     const userinfo=useSelector((state)=>state.user.userDatainfo)
//     // console.log(userinfo,'UserInfo')
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarStyle: {
//           backgroundColor: COLORS.BLUE,
//         },
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           switch (route.name) {
//             case 'Home':
//               iconName = focused ? 'home' : 'home-outline';
//               break;
//             case 'Calendar':
//               iconName = focused ? 'calendar' : 'calendar-outline';
//               break;
//             case 'Notification':
//               iconName = focused ? 'notifications' : 'notifications-outline';
//               break;
//             case 'Crm':
//               iconName = focused ? 'people' : 'people-outline';
//               break;
//             default:
//               iconName = 'ellipse-outline';
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: 'white',
//         tabBarInactiveTintColor: '#d0d0d0',
//       })}
//     >
//       <Tab.Screen name="Home" component={Home}    initialParams={route?.params ?? {}}/>
//       <Tab.Screen name="Calendar" component={Calendar} options={{
//     unmountOnBlur: true,
//   }}/>
//       {/* <Tab.Screen name="Notification" component={Notification} /> */}
//       {userinfo?.result?.is_crm_user && <Tab.Screen name="CRM" component={Crm} />}

//     </Tab.Navigator>
//   );
// }

// export default Tabroutes;
// //bug id 2555 Jamshed end



//jamshed start bug id 2555
// Description: Created a bottom tab navigator using React Navigation's createBottomTabNavigator. This navigator includes tabs for Home, Calendar, Notification, and CRM screens, each with its own icon that changes based on the focused state. The Tabroutes component manages the navigation between these tabs and integrates with the Redux store to fetch user data and conditionally render the CRM tab based on user permissions. The design ensures a consistent and intuitive navigation experience for users while maintaining a clean and organized code structure.
import React, { useContext, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Platform } from 'react-native';
import { Calendar, Home, Notification, Crm } from '../screen/Index'; // Adjust based on your exports
import { COLORS } from '../styles/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../redux/reducers/Userinforeducers';
import { AuthContext } from '../Screens/Context';
// Replace with your color constants path

const Tab = createBottomTabNavigator();

function Tabroutes({route}) {
 const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  console.log(server_origin, 'Server Origin');
  console.log(route.params,'wowoowowowowowowowowow')

const dispatch=useDispatch()

  useEffect(() => {
      dispatch(fetchUserData(server_origin));
    }, []);
    const userinfo=useSelector((state)=>state.user.userDatainfo)
    // console.log(userinfo,'UserInfo')
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.BLUE,
          height: Platform.OS === 'ios' ? 82 : 62,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          borderTopWidth: 0,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -3},
          shadowOpacity: 0.12,
          shadowRadius: 10,
        },
        tabBarItemStyle: {
          height: 46,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Calendar':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Notification':
              iconName = focused ? 'notifications' : 'notifications-outline';
              break;
            case 'CRM':
              // iconName = focused ? 'people' : 'people-outline';
              // iconName = focused ? 'trending-up' : 'trending-up-outline';
              iconName = focused ? 'briefcase' : 'briefcase-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return (
            <View
              style={{
                width: focused ? 46 : 38,
                height: 38,
                borderRadius: 19,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? 'rgba(255,255,255,0.18)' : 'transparent',
              }}>
              <Ionicons name={iconName} size={22} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#9FB6E8',
      })}
    >
      <Tab.Screen name="Home" component={Home}    initialParams={route?.params ?? {}}/>
      <Tab.Screen name="Calendar" component={Calendar} options={{
    unmountOnBlur: true,
  }}/>
      {/* <Tab.Screen name="Notification" component={Notification} /> */}
      {userinfo?.result?.is_crm_user && <Tab.Screen name="CRM" component={Crm} />}

    </Tab.Navigator>
  );
}

export default Tabroutes;
//bug id 2555 Jamshed end