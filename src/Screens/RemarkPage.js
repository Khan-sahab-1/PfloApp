// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   useColorScheme,
//   Alert,
// } from 'react-native';
// import { Calendar } from 'react-native-calendars';
// import { useNavigation } from '@react-navigation/native';
// import { AuthContext } from './Context';
// import urls from '../../url';
// import SingleDropdown from '../components/SingleDropdown';
// import HeaderCompo from '../components/HeaderCompo';
// import { COLORS } from '../styles/Colors';
// import moment from 'moment';
// import { useSelector } from 'react-redux';
// const RemarkPage = ({ route }) => {
//   const { product, onSave } = route.params;
//   const user=useSelector(state => state.user.userDatainfo)
//   console.log(user,'user')
//   const navigation = useNavigation();
//   const today = moment().format('YYYY-MM-DD');



//   const [remark, setRemark] = useState('');
//   const [createdById, setCreatedById] = useState(null);
//   const [createdByOptions, setCreatedByOptions] = useState([]);
//   const [createdOn, setCreatedOn] = useState(today);
//   const [showCalendar, setShowCalendar] = useState(false);

//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const fetchCreatedByUrl = server_origin + urls.CreatedByUrl;

//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';
//   const styles = createStyles(isDarkMode);

//   const fetchCreatedByData = async () => {
//     try {
//       const response = await fetch(fetchCreatedByUrl, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {},
//         }),
//       });
  
//       const result = await response.json();
//       // console.log(result, 'Created By Data');
  
//       const data = (result.result || []).map((item) => ({
//         label: item.name.trim(),  // remove extra spaces
//         value: item.id,
//       }));
  
//       setCreatedByOptions(data);
  
//       // 👇 Check if current user should be selected
//       const matched = data.find((item) => item.value === user.res_user);
//       if (matched) {
//         setCreatedById(matched.value);
//       }
//     } catch (error) {
//       console.error('Error fetching "Created By":', error);
//       Alert.alert('Error', 'Failed to fetch "Created By" data.');
//     }
//   };
  

//   useEffect(() => {
//     fetchCreatedByData();
//   }, []);

//   const handleDayPress = (day) => {
//     setCreatedOn(day.dateString);
//     setShowCalendar(false);
//   };

//   const handleSubmit = () => {
//     console.log(!remark || !createdById || !createdOn,'res')
//     if (!remark || !createdById || !createdOn) {
//       Alert.alert('Error', 'Please fill in all fields.');
//       return;
//     }

//     if (onSave) {
//       onSave({
//         remark,
//         createdBy: createdById,
//         createdOn,
//       });
//     }

//     navigation.goBack();
//   };

//   return (
//     <>
//       <HeaderCompo
//         title={'Remark'}
//         lefticon={require('../assets/back.png')}
//         onPress={() => navigation.goBack()}
//       />
//       <View style={styles.container}>
//         <Text style={styles.header}>Product: {product}</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Remark"
//          placeholderTextColor={COLORS.PLACEHOLDER}
//           value={remark}
//           onChangeText={setRemark}
//         />

//         <SingleDropdown
//           data={createdByOptions}
//           value={createdById}
//           onChange={(item) => setCreatedById(item.value)}
//           placeholder="Select Created By"
//           isDarkMode={isDarkMode}
//         />

//         <TouchableOpacity style={styles.input} onPress={() => setShowCalendar(true)}>
//           <Text style={{ color: COLORS.PLACEHOLDER }}>
//             {createdOn || 'Created On'}
//           </Text>
//         </TouchableOpacity>
      


// {showCalendar && (
//   <Calendar
//     onDayPress={(day) => {
//       setCreatedOn(day.dateString); // Always in 'YYYY-MM-DD' format
//       setShowCalendar(false);
//     }}
//     markedDates={{ [createdOn]: { selected: true, selectedColor: '#007BFF' } }}
//     theme={{
//       backgroundColor: isDarkMode ? '#121212' : '#fff',
//       calendarBackground: isDarkMode ? '#121212' : '#fff',
//       textSectionTitleColor: isDarkMode ? '#fff' : '#000',
//       selectedDayBackgroundColor: '#007BFF',
//       selectedDayTextColor: '#fff',
//       todayTextColor: '#007BFF',
//       dayTextColor: isDarkMode ? '#fff' : '#000',
//     }}
//   />
// )}


//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//           <Text style={styles.submitButtonText}>Submit</Text>
//         </TouchableOpacity>
//       </View>
//     </>
//   );
// };

// const createStyles = (isDarkMode) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 10,
//       backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
//     },
//     header: {
//       fontSize: 18,
//       fontWeight: 'bold',
//       marginBottom: 10,
//       color: isDarkMode ? '#fff' : '#000',
//     },
//     input: {
//       borderWidth: 1,
//       borderColor: COLORS.white,
//       backgroundColor:COLORS.white,
//       color: COLORS.black,
//       padding: 10,
//       borderRadius: 5,
//       marginBottom: 10,
//     },
//     submitButton: {
//       backgroundColor: '#007BFF',
//       padding: 15,
//       borderRadius: 5,
//       alignItems: 'center',
//     },
//     submitButtonText: {
//       color: '#fff',
//       fontWeight: 'bold',
//     },
//   });

// export default RemarkPage;



import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './Context';
import urls from '../../url';
import SingleDropdown from '../components/SingleDropdown';
import HeaderCompo from '../components/HeaderCompo';
import { COLORS } from '../styles/Colors';
import moment from 'moment';
import { useSelector } from 'react-redux';

const RemarkPage = ({ route }) => {
  const { product, onSave } = route.params;
  const user = useSelector(state => state.user.userDatainfo);
  const navigation = useNavigation();
  const today = moment().format('YYYY-MM-DD');

  const [remark, setRemark] = useState('');
  const [createdById, setCreatedById] = useState(null);
  const [createdByOptions, setCreatedByOptions] = useState([]);
  const [createdOn, setCreatedOn] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);
  console.log(createdById, 'createdById');

  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const fetchCreatedByUrl = server_origin + urls.CreatedByUrl;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = createStyles(isDarkMode);

  const fetchCreatedByData = async () => {
    try {
      const response = await fetch(fetchCreatedByUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {},
        }),
      });

      const result = await response.json();

      const data = (result.result || []).map((item) => ({
        label: item.name.trim(),  // Clean extra spaces
        value: item.id,
      }));

      setCreatedByOptions(data);

      // 👇 Set default selected user
      const matched = data.find(item => item.value === user?.result.res_user);
      if (matched) {
        setCreatedById(matched.value);
      }
    } catch (error) {
      console.error('Error fetching "Created By":', error);
      Alert.alert('Error', 'Failed to fetch "Created By" data.');
    }
  };

  useEffect(() => {
    fetchCreatedByData();
  }, []);

  const handleDayPress = (day) => {
    setCreatedOn(day.dateString);
    setShowCalendar(false);
  };

  const handleSubmit = () => {
    if (!remark || !createdById || !createdOn) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (onSave) {
      onSave({
        remark,
        createdBy: createdById,
        createdOn,
      });
    }

    navigation.goBack();
  };

  return (
    <>
      <HeaderCompo
        title={'Remark'}
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <Text style={styles.header}>Product: {product}</Text>

        <TextInput
          style={styles.input}
          placeholder="Remark"
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={remark}
          onChangeText={setRemark}
        />

        {/* Show dropdown only when options are ready */}
        {createdByOptions.length > 0 && (
          <SingleDropdown
            data={createdByOptions}
            value={createdById}
            defaultValue={createdById} // Optional if SingleDropdown supports it
            onChange={(item) => setCreatedById(item.value)}
            placeholder="Select Created By"
            isDarkMode={isDarkMode}
          />
        )}

        <TouchableOpacity style={styles.input} onPress={() => setShowCalendar(true)}>
          <Text style={{ color: COLORS.PLACEHOLDER }}>
            {createdOn || 'Created On'}
          </Text>
        </TouchableOpacity>

        {showCalendar && (
          <Calendar
            onDayPress={handleDayPress}
            markedDates={{
              [createdOn]: {
                selected: true,
                selectedColor: '#007BFF',
              },
            }}
            theme={{
              backgroundColor: isDarkMode ? '#121212' : '#fff',
              calendarBackground: isDarkMode ? '#121212' : '#fff',
              textSectionTitleColor: isDarkMode ? '#fff' : '#000',
              selectedDayBackgroundColor: '#007BFF',
              selectedDayTextColor: '#fff',
              todayTextColor: '#007BFF',
              dayTextColor: isDarkMode ? '#fff' : '#000',
            }}
          />
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const createStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    header: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: isDarkMode ? '#fff' : '#000',
    },
    input: {
      borderWidth: 1,
      borderColor: COLORS.white,
      backgroundColor: COLORS.white,
      color: COLORS.black,
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    submitButton: {
      backgroundColor: '#007BFF',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });

export default RemarkPage;
