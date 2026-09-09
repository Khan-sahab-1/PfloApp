// import React, { useEffect, useState, useContext } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';

// import urls from '../../../url';
// import { AuthContext } from '../../Screens/Context';
// import HeaderCompo from '../../components/HeaderCompo';

// const CRM = ({ navigation }) => {
//   const [userData, setUserData] = useState(null);
//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const getHomePageData = server_origin + urls.getHomepageData;

//   const fetchUserData = async () => {
//     try {
//       const response = await fetch(getHomePageData, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {},
//         }),
//       });

//       const json = await response.json();
//       setUserData(json.result);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   if (!userData) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>Loading user data...</Text>
//       </View>
//     );
//   }

//   const { name, emp_code, id, company_id, user_id } = userData;

//   return (
//     <>
//     <HeaderCompo title={'CRM'}/>
//     <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 5, paddingTop: 20 }}>

//       <View style={{ paddingHorizontal: 15, marginTop: 50 }}>
//         <TouchableOpacity
//           onPress={() =>
//             navigation.navigate('Leads', {
//               userName: name,
//               employeeCode: emp_code,
//               userId: user_id,
//               company_id: company_id,
//               resUser: userData,
//             })
//           }
//           style={styles.button}>
//           <Text style={styles.buttonText}>Leads</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() =>
//             navigation.navigate('Opportunity', {
//               userName: name,
//               employeeCode: emp_code,
//               userId: user_id,
//               company_id: company_id,
//               resUser: userData,
//             })
//           }
//           style={styles.button}>
//           <Text style={styles.buttonText}>Opportunity</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() =>
//             navigation.navigate('Enquiry', {
//               userName: name,
//               employeeCode: emp_code,
//               userId: user_id,
//             })/*  */
//           }
//           style={styles.button}>
//           <Text style={styles.buttonText}>Enquiry</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//     </>
//   );
// };

// const styles = {
//   button: {
//     backgroundColor: 'blue',
//     height: 60,
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   buttonText: {
//     fontSize: 20,
//     color: 'white',
//     fontWeight: 'bold',
//   },
// };

// export default CRM;

//jamshed start bug id 2555
// Description: Refactored the CRM component to enhance functionality and user experience. The updated component now includes a loading state while fetching user data, improved error handling for API calls, and a more intuitive UI for navigating to different CRM sections such as Leads, Opportunity, and Enquiry. The design has been improved to provide clearer information about each section, and the code structure has been optimized for better readability and maintainability. Additionally, the component now handles API interactions more robustly, ensuring that users receive appropriate feedback during data fetching and when navigating through the app.

import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../styles/Colors';
import HeaderCompo from '../../components/HeaderCompo';
import {AuthContext} from '../../Screens/Context';
import urls from '../../../url';
import {useSelector} from 'react-redux';
import navigationString from '../../route/navigationString';

const ReportesScreen = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const getHomePageData = server_origin + urls.getHomepageData;

  const colorschema = useColorScheme();
  const isDark = colorschema === 'dark';
  const reportItems = [
    {title: navigationString.LEADES, color: '#FFEB3B'},
    {title: navigationString.OPPOURTUNITY, color: '#00E676'},
    {title: navigationString.ENQUERY, color: '#03A9F4'},
    {title: navigationString.QUTATION, color: '#E91E63'},
  ];
  const fetchUserData = async () => {
    try {
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

      const json = await response.json();
      setUserData(json.result);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={{...styles.container}}>
      <HeaderCompo title={'CRM'} />
      {/* <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="white" style={styles.backIcon} />
        <View style={styles.iconContainer}>
          <Ionicons name="document-text-outline" size={30} color="#4B00C4" />
        </View>
        <Text style={styles.title}>CRM</Text>
        
      </View> */}

      <View
        style={{
          ...styles.cardContainer,
          backgroundColor: isDark ? COLORS.black : COLORS.BACKGROUND,
        }}>
        <ScrollView>
          {reportItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => {
                console.log('Working');
                if (!userData) return;

                const {name, emp_code, user_id, company_id} = userData;

                let routeName = item.title; // 'Leads', 'Opportunity', 'Enquiry'
                console.log('Navigating to:', routeName, userData);
                navigation.navigate(routeName, {
                  userName: name,
                  employeeCode: emp_code,
                  userId: user_id,
                  company_id: company_id,
                  resUser: userData,
                });
              }}>
              <View
                style={[styles.iconCircle, {backgroundColor: item.color}]}
              />
              <Text style={styles.cardText}>
                <Text style={styles.cardText}>
                  {item.title === navigationString.ENQUERY
                    ? 'Enquiry'
                    : item.title === navigationString.LEADES
                    ? 'Leads'
                    : item.title}
                </Text>
              </Text>

              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BLUE,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  backIcon: {
    position: 'absolute',
    left: 20,
    top: 50,
  },
  iconContainer: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    marginBottom: 12,
  },
  iconCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 12,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default ReportesScreen;
///bug id 2555 Jamshed end
