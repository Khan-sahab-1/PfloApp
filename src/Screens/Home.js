import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, PermissionsAndroid, Platform, StyleSheet, Image, ScrollView } from 'react-native';
import urls from '../../url';
import { AuthContext } from './Context';
import RNCalendarEvents from 'react-native-calendar-events';
import HeaderCompo from '../components/HeaderCompo';
import WrapperCompo from '../components/WrapperCompo';
import { COLORS } from '../styles/Colors';
import TextCompo from '../components/TextCompo';
import Icon from 'react-native-vector-icons/Ionicons';
import requestCalendarPermission from '../utils/CalenderPermission';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
const Home = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const getHomePageData = server_origin + urls.getHomepageData;
  const getMeetingData = server_origin + urls.getCalendarData;
  const [isLoding,setIsLoding]=useState(false)

 
const requestCalendarPermission = async () => {
    if (Platform.OS === 'android') {
      const readGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CALENDAR);
      const writeGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR);

      console.log('READ_CALENDAR granted:', readGranted === PermissionsAndroid.RESULTS.GRANTED);
      console.log('WRITE_CALENDAR granted:', writeGranted === PermissionsAndroid.RESULTS.GRANTED);

      return readGranted === PermissionsAndroid.RESULTS.GRANTED && writeGranted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const authStatus = await RNCalendarEvents.requestPermissions({ read: true, write: true });
      console.log('iOS permission status:', authStatus);
      return authStatus === 'authorized';
    }
  };
  const fetchUserData = async () => {
    try {
      setIsLoding(true)
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

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const userData = await response.json();
      console.log('&&&&&&&&&&&&', userData)
      setUserData(userData);
      // fetchCalendarData(userData.result.emp_code);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally{
         setIsLoding(false)
    }
  };

  const fetchCalendarData = async () => {
    if (!userData || !userData.result || !userData.result.emp_code) {
      console.error('Employee code is missing or user data is not available');
      return;
    }
    try {
      const response = await fetch(getMeetingData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: { employeeCode: userData.result.emp_code },
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const meetData = await response.json();
      console.log('======Meeting Data=======', meetData)
      const validMeetings = meetData.result.filter(meeting => !meeting.archive);
      setMeetings(validMeetings);
      for (const meeting of validMeetings) {
        if (!meeting.event_id && !meeting.auto_sync) {
          const newEventId = await addMeetingToCalendar(meeting);
          if (newEventId) {
            await updateEventId(newEventId, meeting.activity_id);
          }
        }
      }
      const archivedMeetings = meetData.result.filter(meeting => meeting.archive);
      for (const meeting of archivedMeetings) {
        await removeMeetingFromCalendar(meeting);
      }

    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
  };

  const removeMeetingFromCalendar = async (meeting) => {
    if (meeting.event_id) {
      try {
        await RNCalendarEvents.removeEvent(meeting.event_id);
        console.log(`Meeting "${meeting.name}" removed from calendar with event ID: ${meeting.event_id}`);
      } catch (error) {
        console.error('Error removing event from calendar:', error);
      }
    } else {
      console.log('No event ID found to remove from calendar.');
    }
  };

  const updateEventId = async (newEventId, oldEventId) => {
    const response = await fetch(`${server_origin}/calendar/update_event_id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          employeeCode: userData.result.emp_code,
          oldEventId: oldEventId,
          newEventId: newEventId,
        },
      }),
    });
    const result = await response.json();
    console.log('Update Event ID Response:', result);
  };

  const addMeetingToCalendar = async (meeting) => {
    const granted = await requestCalendarPermission();
    if (!granted) {
      Alert.alert('Permission Denied', 'Cannot access calendar without permission.');
      return;
    }
    console.log('Attendee Emails:', meeting.attendee_name);

    try {
      const calendars = await RNCalendarEvents.findCalendars();
      const primaryCalendar = calendars.find(c => c.isPrimary && c.allowsModifications);

      if (!primaryCalendar) {
        Alert.alert('No modifiable calendar found');
        return;
      }
      if (meeting.event_id || meeting.auto_sync) {
        console.log(`Skipping creation for meeting "${meeting.name}" as auto_sync is true`);
        return;
      }

      let reminderMinutes = 15;
      if (typeof meeting.reminders === 'string') {
        const reminderMatch = meeting.reminders.match(/(\d+)\s*(Hour|Minute|Day)/);
        if (reminderMatch) {
          const reminderValue = parseInt(reminderMatch[1], 10);
          if (reminderMatch[2] === 'Hour') {
            reminderMinutes = reminderValue * 60;
          } else if (reminderMatch[2] === 'Day') {
            reminderMinutes = reminderValue * 24 * 60;
          } else {
            reminderMinutes = reminderValue;
          }
        }
      }

      const utcDate = new Date(meeting.date);
      const timezoneOffset = new Date().getTimezoneOffset();
      const localDate = new Date(utcDate.getTime() - timezoneOffset * 60 * 1000);
      const localEndDate = new Date(localDate.getTime() + (meeting.duration * 60 * 60 * 1000));
      const startDateISO = localDate.toISOString();
      const endDateISO = localEndDate.toISOString();

      const attendeesString = meeting.attendee_name.join(', ');

      // const attendees = Array.isArray(meeting.attendee_name) ? 
      // meeting.attendee_name.map(email => ({ email })) : [];
      // const attendees = meeting.attendee_name.map(name => ({ name }));
      // const startDate = new Date(meeting.date).toISOString();
      // const endDate = new Date(new Date(meeting.date.replace(' ', 'T') + 'Z').getTime() + (meeting.duration * 60 * 60 * 1000)).toISOString();
      const newEventId = await RNCalendarEvents.saveEvent(meeting.name, {
        calendarId: primaryCalendar.id,
        startDate: startDateISO,
        endDate: endDateISO,
        // notes: `Attendees: ${meeting.attendee_name.join(', ')}`,
        // attendees: attendees,
        // attendees: [
        //   {name:'Aman'},
        //   {name:'Ankit'},
        // ],
        // description: meeting.activity_name,
        // description: `Activity: ${meeting.activity_name}\nAttendees: ${attendeesString}`,
        location: meeting.location,
        alarms: [{ date: reminderMinutes }],
      });
      // const newEventId = false

      if (newEventId) {
        console.log(`Meeting "${meeting.name}" added to calendar with event ID: ${newEventId}`);
        return newEventId;
      }
    } catch (error) {
      console.error('Error adding event to calendar:', error);
    }
  };



  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchCalendarData();
    }
  }, [userData]);

  const handleCalendar = () => {
    if (userData && meetings.length > 0) {
      navigation.navigate('CheckCalendar', {
        userName: userData.result.name,
        employeeCode: userData.result.emp_code,
        userId: userData.result.emp_id,
        meetings: meetings
      });
    } else {
      console.error('Error to navigate');
    }
  };

  const handleLeaveRequest = () => {
    if (userData) {
      navigation.navigate('Leave', {
        userName: userData.result.name,
        employeeCode: userData.result.emp_code,
        userId: userData.result.emp_id,
        isManager: userData.result.parent,
        leaveManager: userData.result.leave_manager
      });
    } else {
      console.error('User data is not available');
    }
  };
  const handleLeaveData = () => {
    if (userData) {
      navigation.navigate('LeaveData', {
        userName: userData.result.name,
        employeeCode: userData.result.emp_code,
        userId: userData.result.emp_id
      });
    } else {
      console.error('User data is not available');
    }
  };

  const handleCrm = () => {
    if (userData) {
      navigation.navigate('Crm', {
        userName: userData.result.name,
        employeeCode: userData.result.emp_code,
        userId: userData.result.emp_id,
        company_id: userData.result.company_id,
        resUser: userData.result.res_user,
      });
    } else {
      console.error('User data is not available');
    }
  };

  const handleNotification = () => {
    if (userData && ((userData.result.parent && userData.result.parent !== 'hr.employee()') || userData.result.leave_manager)) {
      navigation.navigate('NotificationPage', {
        userName: userData.result.name,
        employeeCode: userData.result.emp_code,
        userId: userData.result.emp_id,
      });
    } else {
      console.error('User data is not available or parent field is empty');
    }
  };



  return (
    <ScrollView style={{flex:1}}>


    <View style={{ flex: 1, backgroundColor: 'white',  }}>
      <HeaderCompo title={'Employee Details'}/>
   <WrapperCompo backgroundColor={COLORS.white} scroll>
   <View style={{...styles.usercontainer}}>
      <Image source={require('../assets/User.jpeg')} style={{
        borderRadius:30,
        height:100,
        width:100
      }}/>
      <View>
     


          <View>
            <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>Name:</Text>
            <Text style={{ fontSize: 18, color: 'black' }}>{userData?.result.name}</Text>
          </View>
      </View>
    
      
    </View>



    <View style={{...styles.usercontainer}}>
       <TouchableOpacity style={{...styles.clockIn}} onPress={() => {
            navigation.navigate('Selfie');
          }}>
          <Icon name={'log-in-outline'} size={30} />
       <TextCompo size={18} weight='800'>8:00</TextCompo>
        <TextCompo size={18} weight='800'>ClockIn</TextCompo>
       </TouchableOpacity>
       <TouchableOpacity style={{...styles.clockIn}} 
       nPress={() => {
        navigation.navigate('Selfie');
      }}>
        <Icon name={'log-out-outline'} size={30} />
       <TextCompo size={18} weight='800'>8:00</TextCompo>
        <TextCompo size={18} weight='800'> ClockOut</TextCompo>
       </TouchableOpacity>
    </View>

    
    
     
    </WrapperCompo >

     

      <View style={{ paddingHorizontal: 15, marginTop: 100 }}>
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>

          <View>
            <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>User ID:</Text>
            <Text style={{ fontSize: 18, color: 'black' }}>{userData?.result.emp_code}</Text>
          </View>


          <View>
            <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>Name:</Text>
            <Text style={{ fontSize: 18, color: 'black' }}>{userData?.result.name}</Text>
          </View>
        </View> */}

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Selfie');
          }}
          activeOpacity={0.8}
          style={{
            backgroundColor: 'blue',
            height: 60,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20
          }}>
          <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Mark Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLeaveRequest}
          activeOpacity={0.8}
          style={{
            backgroundColor: 'blue',
            height: 60,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20
          }}>
          <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Leave Request</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLeaveData}
          activeOpacity={0.8}
          style={{
            backgroundColor: 'blue',
            height: 60,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20
          }}>
          <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Leave Record</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCalendar}
          activeOpacity={0.8}
          style={{
            backgroundColor: 'blue',
            height: 60,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20
          }}>
          <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Calendar</Text>
        </TouchableOpacity>

        {userData && ((userData.result.parent && userData.result.parent !== 'hr.employee()') || userData.result.leave_manager) && (
          <TouchableOpacity
            onPress={handleNotification}
            activeOpacity={0.8}
            style={{
              backgroundColor: 'blue',
              height: 60,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20
            }}>
            <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Notification ({userData?.result.count})</Text>
          </TouchableOpacity>
        )}
        {userData?.result.res_user && (
          <TouchableOpacity
            onPress={handleCrm}
            activeOpacity={0.8}
            style={{
              backgroundColor: 'blue',
              height: 60,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>CRM</Text>
          </TouchableOpacity>
        )}

      </View>
      <Loader visible={isLoding}/>
    </View>

</ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  usercontainer:{
   padding:15,
   backgroundColor:'red',
   flexDirection:'row',
   justifyContent:'space-between',
   alignItems:'center',
   borderRadius:10,
   marginTop:10,
   shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 8,
},
shadowOpacity: 0.46,
shadowRadius: 11.14,

elevation: 17,
  },
  clockIn:{
    padding:10,
    width:'48%',
    backgroundColor:COLORS.white,
    alignItems:'center',
    borderRadius:10,
    shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 6,
},
shadowOpacity: 0.39,
shadowRadius: 8.30,

elevation: 13,

  },

})
