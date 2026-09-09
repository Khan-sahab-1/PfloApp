// Jamshed start 
import {
    View,
    Text,
    Button,
    Alert,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
  } from 'react-native';
  import React, {useState, useEffect, useContext} from 'react';
  import {useNavigation} from '@react-navigation/native';
  import urls from '../../url';
  import {AuthContext} from './Context';
import HeaderCompo from '../components/HeaderCompo';
  
  
  const AttendanceDetail = ({route}) => {
    const [responseData, setResponseData] = useState(route.params.responseData);  
    const navigation = useNavigation();
  
  
    const formatToIndianDateTime = dateString => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      return new Date(dateString).toLocaleTimeString('en-IN', options);
    };
  
    const convertUTCtoIST= (utcDateTimeStr) => {
      // Parse the input date string to a Date object
      const utcDate = new Date(utcDateTimeStr.replace(' ', 'T') + 'Z');
      const istDate = new Date(utcDate.getTime());
      const ISTDATE = `${istDate.toDateString()} : ${istDate.toTimeString()}`
      return  ISTDATE;
  }
  
    return (
      <View style={styles.container}>
        <HeaderCompo
         title="Home"
         lefticon={require('../assets/User.jpeg')}
         righticon={require('../assets/User.jpeg')}/>
        {responseData && (
          <>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Employee name:</Text>
                <Text style={styles.value}>{responseData.employee_name}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Punch Date & Time :</Text>
                <Text style={styles.value}>
                  {convertUTCtoIST(responseData.punch_time)}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Employee Punch Code:</Text>
                <Text style={styles.value}>{responseData.punch_code}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Employee Code :</Text>
                <Text style={styles.value}>
                  {responseData.emp_code}
                </Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Employee Address:</Text>
                <Text style={styles.value}>{responseData.emp_address}</Text>
              </View>
            </View>
            <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Latitude:</Text>
            <Text style={styles.value}>{responseData.latitude}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Longitude:</Text>
            <Text style={styles.value}>{responseData.longitude}</Text>
          </View>
        </View>
          </>
        )}
        <View style={{display:'flex', flexDirection:'row', justifyContent:'space-around'}}>
        <TouchableOpacity
          style={[styles.button, false && styles.buttonDisabled]}
          onPress={()=>{;
            const openCam = true;
            navigation.navigate('Login',{openCam});
          }}
          disabled={false}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, false && styles.buttonDisabled]}
          onPress={()=>{
            navigation.navigate('Login');
          }}
          disabled={false}>
          <Text style={styles.buttonText}>Exit</Text>
        </TouchableOpacity>
        </View>
        {/* {loading && <ActivityIndicator size="large" color="blue" />} */}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      // alignItems: 'center',
      padding: 16,
    },
    row: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    column: {
      flex: 1,
      marginRight: 8,
    },
    label: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 4,
      color: 'blue',
    },
    value: {
      fontSize: 14,
      color: 'blue',
    },
    button: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
    },
    buttonDisabled: {
      backgroundColor: 'gray',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
  });
  
  export default AttendanceDetail;
  // Jamshed start 
  
