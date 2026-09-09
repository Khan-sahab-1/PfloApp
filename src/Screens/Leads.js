import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Button, useColorScheme, TouchableOpacity, } from 'react-native';
import urls from '../../url';
import { AuthContext } from './Context';
import { Header } from '@react-navigation/stack';
import HeaderCompo from '../components/HeaderCompo';
import { COLORS } from '../styles/Colors';
import { useFocusEffect } from '@react-navigation/native';

const Leads = ({ navigation, route }) => {
  const employeeCode = route?.params?.employeeCode || '';
  const colorScheme=useColorScheme()
       const isDark = colorScheme === 'dark';
  const resUser = route?.params?.resUser || '';
  console.log("ResUser data", resUser)

  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const getLeadsPageData = server_origin + urls.getLeadsData;

  const [leadsData, setLeadsData] = useState([]);
  const [isMultidivision, setIsMultidivision] = useState(false);

  const fetchLeadsData = async () => {
    try {
      const response = await fetch(getLeadsPageData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            employeeCode,company_id:route?.params?.company_id,
          },
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const leads = await response.json();
      console.log('Leads test', leads);
      setLeadsData(leads.result);
      setIsMultidivision(leads.result[0]?.is_multidivision || false);
    } catch (error) {
      console.error('Error fetching leads data:', error);
    }
  };

useFocusEffect(
  React.useCallback(() => {
    if (employeeCode) {
      fetchLeadsData();
    }
  }, [employeeCode])
);


  const kanbanColumns = {
    'New Leads': leadsData.slice(0, 5),
    'In Progress': leadsData.slice(5, 10),
    'Completed': leadsData.slice(10, 15),
     'Rejected': leadsData.slice(10, 15),
  };

  const renderCard = ({ item }) => (
    <View style={[styles.card, colorScheme === 'dark' ? styles.cardDark : styles.cardLight]}>
      <Text
        style={[
          styles.cardText,
          colorScheme === 'dark' ? styles.textDark : styles.textLight,
        ]}
        onPress={() => navigation.navigate('EditLeads', { leadData: item })}
      >
        {item.name}
      </Text>
    </View>
  );

  const renderColumn = (title, data) => (
    <View style={[styles.column, colorScheme === 'dark' ? styles.columnDark : styles.columnLight]}>
      <Text style={[styles.columnTitle, colorScheme === 'dark' ? styles.textDark : styles.textLight]}>
        {title}
      </Text>
      <FlatList
        data={data}
        renderItem={renderCard}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  return (
    <>
    <HeaderCompo title={'Leads'}lefticon={require('../assets/back.png')} onPress={()=>navigation.goBack()}/>
    <View style={[styles.container, {backgroundColor: isDark ? COLORS.black : COLORS.white}]}>
      {/* <View style={styles.header}>
        <Text style={[styles.headerText, colorScheme === 'dark' ? styles.textDark : styles.textLight]}>
          Leads
        </Text>
      </View> */}
      {/* <View style={styles.createButtonContainer}>
        <Button title="Create Lead" />
      </View> */}
      <ScrollView horizontal contentContainerStyle={styles.kanbanBoard}>
        {Object.keys(kanbanColumns).map((column) =>
          renderColumn(column, kanbanColumns[column])
        )}
      </ScrollView>
      <TouchableOpacity style={{...styles.bottombutton}}
      onPress={() => navigation.navigate('LeadForm', { employeeCode,is_multidivision: isMultidivision,resUser })} >
        <Text style={{fontSize:18,textAlign:'center',fontWeight:'800',color:COLORS.white}}>Create Lead</Text>
      </TouchableOpacity>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 20,
   
  },
  containerLight: {
    backgroundColor:COLORS.white,
  },
  containerDark: {
    backgroundColor:COLORS.black,
  },
  header: {
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButtonContainer: {
    padding: 10,
    alignItems: 'center',
  },
  kanbanBoard: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 20,
   
  },
  column: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 5,
    padding: 10,
  },
  columnLight: {
    backgroundColor: '#f0f0f0',
  },
  columnDark: {
    backgroundColor: '#1c1c1c',
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardLight: {
    backgroundColor: 'white',
  },
  cardDark: {
    backgroundColor: 'blue',
  },
  cardText: {
    fontSize: 16,
  },
  textLight: {
    color: '#333',
  },
  textDark: {
    color: '#ffffff',
  },
  bottombutton:{
    position:'absolute',  
    bottom:30,
    // left:0,
    right:10,
    height:80,
    width:80,
    backgroundColor:COLORS.BLUE,
    borderRadius:50,
    justifyContent:'center',
    alignItems:'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  }
});

export default Leads;

// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, FlatList, StyleSheet, ScrollView, Button, useColorScheme } from 'react-native';
// import urls from '../../url';
// import { AuthContext } from './Context';

// const Leads = ({ navigation, route }) => {
//   const employeeCode = route?.params?.employeeCode || '';
//   const colorScheme = useColorScheme(); 
//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const getLeadsPageData = server_origin + urls.getLeadsData;

//   const [leadsData, setLeadsData] = useState([]);

//   const fetchLeadsData = async () => {
//     try {
//       const response = await fetch(getLeadsPageData, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {
//             employeeCode,
//           },
//         }),
//       });
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const leads = await response.json();
//       console.log('Leads test', leads);
//       setLeadsData(leads.result);
//     } catch (error) {
//       console.error('Error fetching leads data:', error);
//     }
//   };

//   useEffect(() => {
//     if (employeeCode) {
//       fetchLeadsData();
//     }
//   }, [employeeCode]);

//   const kanbanColumns = {
//     'New Leads': leadsData.slice(0, 5),
//     'In Progress': leadsData.slice(5, 10),
//     'Completed': leadsData.slice(10, 15),
//   };

//   const renderCard = ({ item }) => (
//     <View style={[styles.card, colorScheme === 'dark' ? styles.cardDark : styles.cardLight]}>
//       <Text style={[styles.cardText, colorScheme === 'dark' ? styles.textDark : styles.textLight]}>
//         {item.name}
//       </Text>
//     </View>
//   );

//   const renderColumn = (title, data) => (
//     <View style={[styles.column, colorScheme === 'dark' ? styles.columnDark : styles.columnLight]}>
//       <Text style={[styles.columnTitle, colorScheme === 'dark' ? styles.textDark : styles.textLight]}>
//         {title}
//       </Text>
//       <FlatList
//         data={data}
//         renderItem={renderCard}
//         keyExtractor={(item, index) => index.toString()}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );

//   return (
//     <View style={[styles.container, colorScheme === 'dark' ? styles.containerDark : styles.containerLight]}>
//       <View style={styles.header}>
//         <Text style={[styles.headerText, colorScheme === 'dark' ? styles.textDark : styles.textLight]}>
//           Leads
//         </Text>
//       </View>
//       <View style={styles.createButtonContainer}>
//         <Button title="Create Lead" onPress={() => navigation.navigate('LeadForm')} />
//       </View>
//       <ScrollView horizontal contentContainerStyle={styles.kanbanBoard}>
//         {Object.keys(kanbanColumns).map((column) =>
//           renderColumn(column, kanbanColumns[column])
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 5,
//     paddingTop: 20,
//   },
//   containerLight: {
//     backgroundColor: 'white',
//   },
//   containerDark: {
//     backgroundColor: '#121212',
//   },
//   header: {
//     backgroundColor: 'blue',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   createButtonContainer: {
//     padding: 10,
//     alignItems: 'center',
//   },
//   kanbanBoard: {
//     flexDirection: 'row',
//     paddingHorizontal: 10,
//     paddingVertical: 20,
//   },
//   column: {
//     flex: 1,
//     marginHorizontal: 10,
//     borderRadius: 5,
//     padding: 10,
//   },
//   columnLight: {
//     backgroundColor: '#f0f0f0',
//   },
//   columnDark: {
//     backgroundColor: '#1c1c1c',
//   },
//   columnTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   card: {
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//   },
//   cardLight: {
//     backgroundColor: 'white',
//   },
//   cardDark: {
//     backgroundColor: '#333',
//   },
//   cardText: {
//     fontSize: 16,
//   },
//   textLight: {
//     color: '#333',
//   },
//   textDark: {
//     color: '#ffffff',
//   },
// });

// export default Leads;
