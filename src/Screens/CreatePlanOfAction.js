// import React, { useState, useEffect, useContext } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     useColorScheme,
//     ActivityIndicator,
//     Modal,
//     TextInput,
//     ScrollView,
//     Alert
// } from 'react-native';
// import { Calendar } from 'react-native-calendars';
// import urls from '../../url';
// import { AuthContext } from './Context';
// import HeaderCompo from '../components/HeaderCompo';
// import SingleDropdown from '../components/SingleDropdown';
// import DropdownCompo from '../components/DropdownCompo';
// import makeApiCall from '../utils/apiHelper';

// const CreatePlanOfAction = ({ route, navigation }) => {
//     const { id } = route.params;
//     const [activityData, setActivityData] = useState([]);
//     const [attendeesData, setAttendeesData] = useState([]);
//     const [assignedToData, setAssignedToData] = useState([]);
//     const [selectedActivity, setSelectedActivity] = useState(null);
//     const [selectedAttendees, setSelectedAttendees] = useState([]);
//     const [selectedAssignedTo, setSelectedAssignedTo] = useState(null);
//     const [summary, setSummary] = useState('');
//     const [duration, setDuration] = useState('');
//     const [selectedStartDate, setSelectedStartDate] = useState('');
//     const [selectedDueDate, setSelectedDueDate] = useState('');
//     const [showStartCalendar, setShowStartCalendar] = useState(false);
//     const [showDueCalendar, setShowDueCalendar] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const contextType = useContext(AuthContext);
//     const server_origin = contextType.currentUrl;
//     const colorScheme = useColorScheme();
//     const isDarkMode = colorScheme === 'dark';

//     const endpoints = {
//         activity: server_origin + urls.getActivityData,
//         assignedTo: server_origin + urls.getAssignedToData,
//         attendees: server_origin + urls.getAttendeesData,
//         save: server_origin + urls.savePlanOfAction
//     };

//     const containerStyle = [styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }];
//     const textStyle = { color: isDarkMode ? '#fff' : '#000' };
//     const inputStyle = [
//         styles.input,
//         {
//             color: textStyle.color,
//             borderColor: isDarkMode ? '#444' : '#ccc',
//             backgroundColor: isDarkMode ? '#222' : '#fff'
//         }
//     ];

//     const validateForm = () => {
//         if (!selectedActivity) return Alert.alert('Validation Error', 'Please select an activity');
//         if (!selectedDueDate) return Alert.alert('Validation Error', 'Please select a due date');
//         if (!selectedAssignedTo) return Alert.alert('Validation Error', 'Please select assigned to');
//         if (selectedActivity.label === 'Meeting') {
//             if (!selectedStartDate) return Alert.alert('Validation Error', 'Select start date');
//             if (!duration) return Alert.alert('Validation Error', 'Enter duration');
//             if (!selectedAttendees) return Alert.alert('Validation Error', 'Select attendees');
//         }
//         return true;
//     };

//     const handleSave = async () => {
//         // if (!validateForm()) return;
//         setLoading(true);

//         try {
//             const params = {
//                 id: id,
//                 activity_id: selectedActivity.value,
//                attendees: selectedAttendees?.length
//   ? selectedAttendees.map(item => item?.value)  // <-- Extract value
//   : [],

//                 assigned_to: selectedAssignedTo ? selectedAssignedTo.value : null,
//                 start_date: selectedStartDate,
//                 due_date: selectedDueDate,
//                 duration: duration,
//                 summary: summary,
//             };

//             console.log(params, 'Params being sent');
//             console.log(urls.savePlanOfAction)
//             const responce = await makeApiCall(urls.savePlanOfAction, 'POST', {
//                 jsonrpc: '2.0',
//                 method: 'call',
//                 params: params,
//             });

//             console.log(responce, 'API response');

//             if (responce.result) {
//                 Alert.alert('Success', 'Plan of Action saved successfully!');
//                 // navigation.goBack();
//             } else {
//                 Alert.alert('Error', responce.error?.message || 'Save failed');
//             }
//         } catch (error) {
//             console.error('Save error:', error);
//             Alert.alert('Error', 'Failed to save. Try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const [activityRes, assignedToRes, attendeesRes] = await Promise.all([
//                 makeApiCall(urls.getActivityData, 'POST', { jsonrpc: '2.0', method: 'call', params: {} }),
//                 makeApiCall(urls.getAssignedToData, 'POST', { jsonrpc: '2.0', method: 'call', params: {} }),
//                 makeApiCall(urls.getAttendeesData, 'POST', { jsonrpc: '2.0', method: 'call', params: {} }),
//             ]);

//             setActivityData(activityRes.result.map(item => ({ label: item.name, value: item.id })));
//             setAssignedToData(assignedToRes.result.map(item => ({ label: item.assigned_name, value: item.assigned_id })));
//             setAttendeesData(attendeesRes.result.map(item => ({ label: item.name, value: item.id })));
//         } catch (err) {
//             console.log('Data fetch error:', err);
//             Alert.alert('Error', 'Failed to load dropdown data.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     useEffect(() => {
//         if (selectedActivity?.label !== 'Meeting') {
//             setSelectedAttendees(null);
//             setSelectedStartDate('');
//             setDuration('');
//         }
//     }, [selectedActivity]);

//     return (
//         <>
//             <HeaderCompo
//                 title="Create Plan of Action"
//                 lefticon={require('../assets/back.png')}
//                 onPress={() => navigation.goBack()}
//             />
//             <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }}>
//                 <View style={containerStyle}>
//                     <Text style={[styles.heading, textStyle]}>Create Plan of Action</Text>

//                     <View style={styles.fieldContainer}>
//                         <Text style={[styles.label, textStyle]}>Activity*</Text>
//                         <SingleDropdown
//                             data={activityData}
//                             value={selectedActivity}
//                             placeholder="Select Activity"
//                             isDarkMode={isDarkMode}
//                             onChange={setSelectedActivity}
//                             loading={loading}
//                         />
//                     </View>

//                     {selectedActivity?.label === 'Meeting' && (
//                         <>
//                             <View style={styles.fieldContainer}>
//                                 <Text style={[styles.label, textStyle]}>Attendees*</Text>
//                                 <DropdownCompo
//                                     data={attendeesData}
//                                     selectedValues={selectedAttendees} // ✅ don't fallback to []
//                                     onValueChange={setSelectedAttendees}
//                                     placeholder="Select Attendees"
//                                 />

//                             </View>

//                             <View style={styles.fieldContainer}>
//                                 <Text style={[styles.label, textStyle]}>Start Date*</Text>
//                                 <TouchableOpacity onPress={() => setShowStartCalendar(true)}>
//                                     <TextInput
//                                         style={inputStyle}
//                                         placeholder="Select start date"
//                                         placeholderTextColor="#888"
//                                         editable={false}
//                                         value={selectedStartDate}
//                                     />
//                                 </TouchableOpacity>
//                                 <Modal visible={showStartCalendar} transparent animationType="slide">
//                                     <View style={styles.modalContainer}>
//                                         <Calendar
//                                             onDayPress={day => {
//                                                 setSelectedStartDate(day.dateString);
//                                                 setShowStartCalendar(false);
//                                             }}
//                                             markedDates={{
//                                                 [selectedStartDate]: {
//                                                     selected: true,
//                                                     marked: true,
//                                                     selectedColor: '#1E90FF',
//                                                 },
//                                             }}
//                                         />
//                                     </View>
//                                 </Modal>
//                             </View>

//                             <View style={styles.fieldContainer}>
//                                 <Text style={[styles.label, textStyle]}>Duration (Hours)*</Text>
//                                 <TextInput
//                                     style={inputStyle}
//                                     placeholder="Enter duration"
//                                     value={duration}
//                                     onChangeText={setDuration}
//                                     keyboardType="numeric"
//                                 />
//                             </View>
//                         </>
//                     )}

//                     <View style={styles.fieldContainer}>
//                         <Text style={[styles.label, textStyle]}>Summary</Text>
//                         <TextInput
//                             style={[inputStyle, { height: 100, textAlignVertical: 'top' }]}
//                             placeholder="Enter summary"
//                             multiline
//                             value={summary}
//                             onChangeText={setSummary}
//                         />
//                     </View>

//                     <View style={styles.fieldContainer}>
//                         <Text style={[styles.label, textStyle]}>Due Date*</Text>
//                         <TouchableOpacity onPress={() => setShowDueCalendar(true)}>
//                             <TextInput
//                                 style={inputStyle}
//                                 placeholder="Select due date"
//                                 value={selectedDueDate}
//                                 editable={false}
//                             />
//                         </TouchableOpacity>
//                         <Modal visible={showDueCalendar} transparent animationType="slide">
//                             <View style={styles.modalContainer}>
//                                 <Calendar
//                                     onDayPress={day => {
//                                         setSelectedDueDate(day.dateString);
//                                         setShowDueCalendar(false);
//                                     }}
//                                     markedDates={{
//                                         [selectedDueDate]: {
//                                             selected: true,
//                                             marked: true,
//                                             selectedColor: '#1E90FF',
//                                         },
//                                     }}
//                                 />
//                             </View>
//                         </Modal>
//                     </View>

//                     <View style={styles.fieldContainer}>
//                         <Text style={[styles.label, textStyle]}>Assigned To*</Text>
//                         <SingleDropdown
//                             data={assignedToData}
//                             value={selectedAssignedTo}
//                             onChange={setSelectedAssignedTo}
//                             placeholder="Select Assigned To"
//                             isDarkMode={isDarkMode}
//                             loading={loading}
//                         />

//                     </View>

//                     <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
//                         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save</Text>}
//                     </TouchableOpacity>
//                 </View>
//             </ScrollView>
//         </>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 20 },
//     heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//     fieldContainer: { marginBottom: 20 },
//     label: { fontSize: 16, marginBottom: 8, fontWeight: '500' },
//     input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
//     saveButton: {
//         backgroundColor: '#1E90FF',
//         padding: 15,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginTop: 20,
//     },
//     saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         backgroundColor: 'rgba(0,0,0,0.5)',
//     },
// });

// export default CreatePlanOfAction;
// Jamshed start 

import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import urls from '../../url';
import {AuthContext} from './Context';
import HeaderCompo from '../components/HeaderCompo';
import SingleDropdown from '../components/SingleDropdown';
import DropdownCompo from '../components/DropdownCompo'; // Make sure DropdownCompo returns full objects in onValueChange
import makeApiCall from '../utils/apiHelper';
import {COLORS} from '../styles/Colors';
import ButtonCompo from '../components/ButtonCompo';
import TextinputCompo from '../components/TextinputCompo';
import {useSelector} from 'react-redux';
import Loader from '../components/Loader';
import MultiselectorDropDown from '../components/MultiselectorDropDown';

const CreatePlanOfAction = ({route, navigation}) => {
  const {id} = route.params;
  const {leadData}=route.params;
  const {item} = route.params;
  const {edit} = route.params;
  console.log(id,item, 'iuwiewueiweuiwueiuweuiwueiwueiweiwiue');
  const user = useSelector(state => state.user.userDatainfo);
  //   console.log(user?.result?.res_user,'user')
  const resUser = user?.result?.res_user;
  const [activityData, setActivityData] = useState([]);
  const [attendeesData, setAttendeesData] = useState([]);
  const [assignedToData, setAssignedToData] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [selectedAssignedTo, setSelectedAssignedTo] = useState(null);
  const [summary, setSummary] = useState(item?.summary || '');
  // const [duration, setDuration] = useState(String(item?.duration) ||null);
  const [duration, setDuration] = useState(
  item?.duration ? String(item.duration) : ''
);
  const [selectedStartDate, setSelectedStartDate] = useState(
    item?.start_datetime ,
  );
  const [selectedDueDate, setSelectedDueDate] = useState(item?.due_date || '');
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showDueCalendar, setShowDueCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [is_reminder_date,setis_reminder_date]=useState(item?.reminder_date)
  const [showReminderCalendar, setShowReminderCalendar] = useState(false);

    // console.log(selectedStartDate , '--0090909');

  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [conclusion, setconsloution] = useState(item?.conclusion || '');

  const containerStyle = [
    styles.container,
    {backgroundColor: isDarkMode ? '#000' : '#fff'},
  ];
  const textStyle = {color: isDarkMode ? '#fff' : '#000'};
  const inputStyle = [
    styles.input,
    {
      color: COLORS.black,
      borderColor: isDarkMode ? '#444' : '#ccc',
      backgroundColor: isDarkMode ? '#fff' : '#fff',
    },
  ];

  const validateForm = () => {
    if (!selectedActivity)
      return Alert.alert('Validation Error', 'Please select an activity');
    if (!selectedDueDate)
      return Alert.alert('Validation Error', 'Please select a due date');
    if (!selectedAssignedTo)
      return Alert.alert('Validation Error', 'Please select assigned to');
    if (selectedActivity.label === 'Meeting') {
      if (!selectedStartDate)
        return Alert.alert('Validation Error', 'Select start date');
      if (!duration) return Alert.alert('Validation Error', 'Enter duration');
      if (!selectedAttendees?.length)
        return Alert.alert('Validation Error', 'Select attendees');
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      console.log('Selected Attendees:', selectedAttendees);

      const params = {
        id: id,
        poa_id: item?.id || false,
        activity_id: selectedActivity?.value,
        attendees: Array.isArray(selectedAttendees) ? selectedAttendees : [],
        assigned_to: selectedAssignedTo?.value || null,
        start_date: selectedStartDate,
        due_date: selectedDueDate,
        duration: duration||null,
        summary: summary,
        conclusion: conclusion,
        reminder_date: is_reminder_date || false,
      };

      console.log(params, 'Params being sent---------->>>>>>>>>>>>');
      const response = await makeApiCall(
        server_origin,
        urls.savePlanOfAction,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: params,
        },
      );

      // console.log(response, 'API response');

      if (response.result) {
        Alert.alert('Success', 'Plan of Action saved successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.error?.message || 'Save failed');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, []);

  // const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //         const [activityRes, assignedToRes, attendeesRes] = await Promise.all([
  //             makeApiCall(server_origin, urls.getActivityData, 'POST', { jsonrpc: '2.0', method: 'call', params: {} }),
  //             makeApiCall(server_origin, urls.getAssignedToData, 'POST', { jsonrpc: '2.0', method: 'call', params: {} }),
  //             makeApiCall(server_origin, urls.getAttendeesData, 'POST', { jsonrpc: '2.0', method: 'call', params: {} }),
  //         ]);

  //         setActivityData(activityRes.result.map(item => ({ label: item.name, value: item.id })));
  //         setAssignedToData(assignedToRes.result.map(item => ({ label: item.assigned_name, value: item.assigned_id })));
  //         const matched=assignedToRes.result.find((persion)=>persion.assigned_id===resUser)
  //         console.log(matched,'Matched')

  //         setAttendeesData(
  //             attendeesRes.result
  //                 .filter(item => !!item.name)
  //                 .map(item => ({
  //                     label: item.name,
  //                     value: item.id,
  //                 }))
  //         );

  //     } catch (err) {
  //         console.log('Data fetch error:', err);
  //         Alert.alert('Error', 'Failed to load dropdown data.');
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [activityRes, assignedToRes, attendeesRes] = await Promise.all([
        makeApiCall(server_origin, urls.getActivityData, 'POST', {
          jsonrpc: '2.0',
          method: 'call',
          params: {},
        }),
        makeApiCall(server_origin, urls.getAssignedToData, 'POST', {
          jsonrpc: '2.0',
          method: 'call',
          params: {},
        }),
        makeApiCall(server_origin, urls.getAttendeesData, 'POST', {
          jsonrpc: '2.0',
          method: 'call',
          params: {},
        }),
      ]);

      const activityList = activityRes.result.map(item => ({
        label: item.name,
        value: item.id,
      }));
      const assignedToList = assignedToRes.result.map(item => ({
        label: item.assigned_name,
        value: item.assigned_id,
      }));

      const defaultAssignedUser = assignedToList.find(
        person => person.value === resUser,
      );

      setActivityData(activityList);
      setAssignedToData(assignedToList);
      if (defaultAssignedUser) {
        setSelectedAssignedTo(defaultAssignedUser); // ✅ auto-select match
      }

      setAttendeesData(
        attendeesRes.result
          .filter(item => !!item.name)
          .map(item => ({label: item.name, value: item.id})),
      );
    } catch (err) {
      console.log('Data fetch error:', err);
      Alert.alert('Error', 'Failed to load dropdown data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 👇 route item se activity match
    if (item?.activity) {
      const matchedActivity = activityData.find(
        act => act.value === item.activity,
      );
      console.log(matchedActivity, 'Match Activity');
      if (matchedActivity) {
        setSelectedActivity(matchedActivity); // ✅ IMPORTANT
      }
    }
  }, [activityData]);
  useEffect(() => {
    if (item?.attendees?.length && attendeesData?.length) {
      // 👇 extract only IDs from route
      const attendeeIdsFromRoute = item.attendees.map(att => att[0]);

      // 👇 match with dropdown data
      const matchedIds = attendeesData
        .filter(att => attendeeIdsFromRoute.includes(att.value))
        .map(att => att.value);

      setSelectedAttendees(matchedIds); // ✅ [217, 222]
    }
  }, [attendeesData]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedActivity?.label !== 'Meeting') {
      setSelectedAttendees([]);
      // setSelectedStartDate('');
      // setDuration('');
    }
  }, [selectedActivity]);

  return (
    <>
      <HeaderCompo
        title={edit ? 'Edit Plan of Action' : 'Create Plan of Action'}
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        style={{flex: 1, backgroundColor: isDarkMode ? '#000' : '#fff'}}
        contentContainerStyle={{paddingBottom: 30}}>
        <View style={containerStyle}>
          {/* <Text style={[styles.heading, textStyle]}>
            {edit ? 'Edit Plan of Action' : 'Create Plan of Action'}
          </Text> */}

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, textStyle]}>Activity*</Text>
            <SingleDropdown
              data={activityData}
              value={selectedActivity}
              placeholder="Select Activity"
              isDarkMode={isDarkMode}
              onChange={setSelectedActivity}
              // loading={loading}
            />
          </View>

          {selectedActivity?.label === 'Meeting' && (
            <>
              <View style={styles.fieldContainer}>
                <Text style={[styles.label, textStyle]}>Attendees*</Text>
                <MultiselectorDropDown
                  data={attendeesData}
                  selectedValues={selectedAttendees}
                  onValueChange={setSelectedAttendees}
                  placeholder="Select Attendees"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={[styles.label, textStyle]}>Start Date*</Text>
                <TouchableOpacity onPress={() => setShowStartCalendar(true)}>
                  <TextInput
                    style={inputStyle}
                    placeholder="Select start date"
                    placeholderTextColor={COLORS.PLACEHOLDER}
                    editable={false}
                    value={selectedStartDate}
                  />
                </TouchableOpacity>
                <Modal
                  visible={showStartCalendar}
                  transparent
                  animationType="slide">
                  <View style={styles.modalContainer}>
                    <Calendar
                      onDayPress={day => {
                        setSelectedStartDate(day.dateString);
                        setShowStartCalendar(false);
                      }}
                      markedDates={{
                        [selectedStartDate]: {
                          selected: true,
                          marked: true,
                          selectedColor: '#1E90FF',
                        },
                      }}
                    />
                  </View>
                </Modal>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={[styles.label, textStyle]}>Duration (Hours)*</Text>
                <TextInput
                  style={inputStyle}
                  placeholder="Enter duration"
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.PLACEHOLDER}
                />
              </View>
            </>
          )}

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, textStyle]}>Summary</Text>
            <TextInput
              style={[inputStyle, {height: 100, textAlignVertical: 'top'}]}
              placeholder="Enter summary"
              multiline
              value={summary}
              onChangeText={setSummary}
              placeholderTextColor={COLORS.PLACEHOLDER}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, textStyle]}>Due Date*</Text>
            <TouchableOpacity onPress={() => setShowDueCalendar(true)}>
              <TextInput
                style={inputStyle}
                placeholder="Select due date"
                value={selectedDueDate}
                editable={false}
                placeholderTextColor={COLORS.PLACEHOLDER}
              />
            </TouchableOpacity>
            <Modal visible={showDueCalendar} transparent animationType="slide">
              <View style={styles.modalContainer}>
                <Calendar
                  onDayPress={day => {
                    setSelectedDueDate(day.dateString);
                    setShowDueCalendar(false);
                  }}
                  markedDates={{
                    [selectedDueDate]: {
                      selected: true,
                      marked: true,
                      selectedColor: '#1E90FF',
                    },
                  }}
                />
              </View>
            </Modal>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, textStyle]}>Assigned To*</Text>
            <SingleDropdown
              data={assignedToData}
              value={selectedAssignedTo}
              onChange={setSelectedAssignedTo}
              placeholder="Select Assigned To"
              isDarkMode={isDarkMode}
              // loading={loading}
            />
          </View>
          <Text style={[styles.label, textStyle]}>Conclusion</Text>
          <TextinputCompo
            placeholder={'Conclusion'}
            style={[inputStyle, {height: 100, textAlignVertical: 'top'}]}
            placeholderTextColor={COLORS.PLACEHOLDER}
            onChangeText={text => setconsloution(text)}
            value={conclusion}
          />
          <View style={styles.fieldContainer}>
  <Text style={[styles.label, textStyle]}>Reminder Date</Text>
  <TouchableOpacity onPress={() => setShowReminderCalendar(true)}>
    <TextInput
      style={inputStyle}
      placeholder="Select reminder date"
      value={is_reminder_date}
      editable={false}
      placeholderTextColor={COLORS.PLACEHOLDER}
    />
  </TouchableOpacity>

  <Modal
    visible={showReminderCalendar}
    transparent
    animationType="slide">
    <View style={styles.modalContainer}>
      <Calendar
        onDayPress={day => {
          setis_reminder_date(day.dateString);
          setShowReminderCalendar(false);
        }}
        markedDates={{
          [is_reminder_date]: {
            selected: true,
            marked: true,
            selectedColor: '#1E90FF',
          },
        }}
      />
    </View>
  </Modal>
</View>

          {/* <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                       <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity> */}
          <ButtonCompo
            backgroundColor={COLORS.BLUE}
            onPress={handleSave}
            title="Save"
          />
        </View>
        <Loader visible={loading} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldContainer: {marginBottom: 20},
  label: {fontSize: 16, marginBottom: 8, fontWeight: '500'},
  input: {borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16},
  saveButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default CreatePlanOfAction;
// Jamshed start 
