// import React, { useState, useContext, useEffect } from 'react';
// import { View, Text, TouchableOpacity, TextInput, Modal, Alert, ScrollView, Switch, StyleSheet, useColorScheme,ActivityIndicator} from 'react-native';
// import ModalDropdown from 'react-native-modal-dropdown';
// import { AuthContext } from './Context';
// import urls from '../../url';
// import { Calendar } from 'react-native-calendars';
// import HeaderCompo from '../components/HeaderCompo';
// import TextinputCompo from '../components/TextinputCompo';
// import DropdownCompo from '../components/DropdownCompo';
 
// const LeaveRequest = ({ navigation, route }) => {
//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';
//   const [loginEmpCode, setloginEmpCode] = useState(route.params.employeeCode || '');
//   console.log("Login EMp Code ",loginEmpCode)
//   const [employeeName, setEmployeeName] = useState(route.params.userName || '');
//   const [employeeCode, setEmployeeCode] = useState(route.params.employeeCode || '');
//   const [isManager, setIsManager] = useState(route.params.isManager || '');
//   const [leaveManager, setLeaveManager] = useState(route.params.leaveManager || '');
//   const [description, setDescription] = useState('');
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [leaveType, setLeaveType] = useState(null);
//   const [leaveTypeFrom, setLeaveTypeFrom] = useState(null);
//   const [leaveTypeTo, setLeaveTypeTo] = useState(null);
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [restrictLeave, setRestrictLeave] = useState([]);
//   const [leaveTypeFroms, setLeaveTypeFroms] = useState([]);
//   const [leaveTypeTOs, setLeaveTypeTos] = useState([]);
//   const [other, setOther] = useState(false);
//   const [employees, setEmployees] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [timeFrom, setTimeFrom] = useState('');
//   const [timeTo, setTimeTo] = useState('');
//   const [showTimeInputs, setShowTimeInputs] = useState(false);
//   const [showInputBox, setShowInputBox] = useState(false);
//   const [selectedRestrictedLeave, setSelectedRestrictedLeave] = useState('');
//   const [selectedRestrictedLeaveID, setSelectedRestrictedLeaveID] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [leaveTypeDropdowon,setLeaveTypeDropdown]=useState([])
// const [selectedLeaveTypeTop, setSelectedLeaveTypeTop] = useState(null);
// const [selectedLeaveTypeBottom, setSelectedLeaveTypeBottom] = useState(null);
// const [isMirrored, setIsMirrored] = useState(true);

 
 
//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const getleave = server_origin + urls.getLeave;
//   const getleavetype = server_origin + urls.getLeaveType;
//   const getfromto = server_origin + urls.getLeaveFromTo;
//   const getLeaveEmp = server_origin + urls.getLeaveEmployee;
//   const getResLeave = server_origin + urls.getRestrictedLeave;
//   const handleTopChange = (value) => {
//   setSelectedLeaveTypeTop(value);
//   if (isMirrored) {
//     setSelectedLeaveTypeBottom(value);
//   }
// };
// useEffect(() => {
//   setShowTimeInputs(selectedLeaveTypeTop === 'Short Leave');
// }, [selectedLeaveTypeTop]);
// const handleBottomChange = (value) => {
//   setSelectedLeaveTypeBottom(value);
//   setIsMirrored(false); // Stop mirroring after bottom is changed manually
// };
 
//   const showAlert = (errorMessage) => {
//     Alert.alert('Error', errorMessage);
//   };
 
//   const handleSubmit = async () => {



//     console.log('All Data Mil RahH',employeeName ,employeeCode , description ,fromDate , toDate , leaveTypeFrom , selectedLeaveTypeTop,selectedLeaveTypeBottom);
//     setIsSubmitting(true);


//     const leaveTypeFromObj = leaveTypeDropdowon.find(item => item.name === selectedLeaveTypeTop);
//   const leaveTypeToObj = leaveTypeDropdowon.find(item => item.name === selectedLeaveTypeBottom);

//     if (!employeeName || !employeeCode || !description || !fromDate || !toDate || !selectedLeaveTypeTop || !selectedLeaveTypeBottom) {
//       showAlert('Please fill out all the required fields.');
//       setIsSubmitting(false);
//       return;
//     }
 
//     if (showTimeInputs && (!timeFrom || !timeTo)) {
//       showAlert('Please fill out the time fields.');
//       setIsSubmitting(false);
//       return;
//     }
//     if (!leaveTypeFromObj || !leaveTypeToObj) {
//     showAlert('Invalid leave type selection.');
//     setIsSubmitting(false);
//     return;
//   }
 
//     try {
//       const response = await fetch(getleave, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           // params: {employeeCode ,description, fromDate, toDate, leaveType:0, employeeName, selectedLeaveTypeTop, selectedLeaveTypeBottom, timeFrom, timeTo, selectedRestrictedLeaveID,loginEmpCode },



//           params: {
//           employeeCode,
//           description,
//           fromDate,
//           toDate,
//           leaveType, // keep if needed by backend
//           employeeName,
//           selectedLeaveTypeTop,
//           selectedLeaveTypeBottom,
//           leaveTypeFrom_id: leaveTypeFromObj.id, // <-- send the ID
//           leaveTypeTo_id: leaveTypeToObj.id,     // <-- send the ID
//           timeFrom,
//           timeTo,
//           selectedRestrictedLeaveID,
//           loginEmpCode,
//         },
//         }),
//       });
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const responseData = await response.json();
//       console.log('Data sent successfully', responseData);
//       if (responseData.result.error) {
//         showAlert(responseData.result.error);
//       } else {
//         Alert.alert('Leave Request Submitted', 'Your leave request has been submitted successfully.', [
//           {
//             text: 'OK',
//             onPress: () => navigation.navigate('Home'),
//           },
//         ]);
//       }
//     } catch (error) {
//       console.error('Error sending data:', error);
//       Alert.alert('Error', 'Failed to submit leave request. Please try again later.');
//     }
//   };
 
//   const handleLeaveType = async () => {
//     try {
//       const response = await fetch(getleavetype, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: { employeeName, employeeCode },
//         }),
//       });
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const typeData = await response.json();
//       console.log("----Type Data_----", typeData);
//       const leaveTypesArray = typeData.result.map((item) => ({ name: item.name, id: item.id, type: item.leave_type }));
//       setLeaveTypes(leaveTypesArray);
//     } catch (error) {
//       console.error('Error sending data:', error);
//     }
//   };
 
//   const handleResLeave = async () => {
//     try {
//       const response = await fetch(getResLeave, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: { employeeCode },
//         }),
//       });
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const resData = await response.json();
//       const restrictedleave = resData.result.map((item) => ({ name: item.name, id: item.id, from_Date: item.from_date, to_Date: item.to_date }));
//       setRestrictLeave(restrictedleave);
//     } catch (error) {
//       console.error('Error sending data:', error);
//     }
//   };
 
//   const handleLeaveFromTO = async () => {
//     try {
//       const response = await fetch(getfromto, {
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
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const fromToData = await response.json();
//       console.log('presenidt ', fromToData);
//       setLeaveTypeDropdown(fromToData.result)

//       const leaveTypesfromArray = fromToData.result.map((item) => item.name);
//       console.log('Is id present', leaveTypesfromArray);
//       setLeaveTypeFroms(leaveTypesfromArray);
//       const leaveTypesToArray = fromToData.result.map((item) => item.name);
//       setLeaveTypeTos(leaveTypesToArray);
//     } catch (error) {
//       console.error('Error sending data:', error);
//     }
//   };
//   useEffect(()=>{
//     handleLeaveFromTO()
//   },[])

//   const dropdownData = leaveTypeDropdowon.map(item => ({
//   label: item.name,
//   value: item.name,
// }));
//   // console.log(leaveTypeDropdowon,'Apna Data Mila')
//   const handleEmp = async () => {
//     try {
//       const response = await fetch(getLeaveEmp, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: { employeeCode },
//         }),
//       });
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const leaveEmployee = await response.json();
//       console.log('==leave employee==', leaveEmployee);
//       setEmployees(leaveEmployee.result);
//     } catch (error) {
//       console.error('Error sending data:', error);
//     }
//   };
 
//   const formatDateForUI = (date) => {
//     const [year, month, day] = date.split('-');
//     return `${day}-${month}-${year}`;
//   };
 
//   const openCalendar = (dateField) => {
//     setShowCalendar(true);
//     setSelectedDate(dateField);
//   };
 
//   const handleFromDateChange = (date) => {
//     setFromDate(date);
//     setToDate(date);
//   };
 
//   const handleLeaveTypeFromChange = (value) => {
//     console.log('KKJJCCCCCCCCCCCCCCC', value)
//     setLeaveTypeFrom(value);
//     setLeaveTypeTo(value);
//     if (value === 'Short Leave') {
//       setShowTimeInputs(true);
//     } else {
//       setShowTimeInputs(false);
//     }
//     console.log('check leave type', leaveTypeTOs, leaveTypeFroms);
//   };
 
//   const handelSelection = (index, value) => {
//     console.log(index, value)
//     const data = leaveTypes.filter(item => item.name == value)
//     console.log(":-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-", data)
//     setLeaveType(data)
//     if (data[0]?.type === 'rh_holiday') {
//       setShowInputBox(true);
//     } else {
//       setShowInputBox(false);
//     }
//   };
 
//   const handleEmpChange = (index, value) => {
//     const selectedEmployee = employees.find((employee) => employee.employee_name === value);
//     if (selectedEmployee) {
//       setEmployeeName(selectedEmployee.employee_name);
//       setEmployeeCode(selectedEmployee.employee_code);
//     }
//   };
 
//   const filteredEmployees = employees.filter((employee) =>
//     employee.employee_name.toLowerCase().startsWith(searchText.toLowerCase())
//   );
 
//   const styles = createStyles(isDarkMode);
 
//   useEffect(() => {
//     handleEmp();
//   }, []);
 
//   return (
//     <>
//     <HeaderCompo title={'Leave Request'}/>
//     <ScrollView style={styles.container}>
//       <View style={styles.content}>
//         {/* <View style={styles.header}>
//           <Text style={styles.headerText}>Leave Request</Text>
//         </View> */}
//         {(isManager !== 'hr.employee()' || leaveManager) && (
//           <View style={styles.switchContainer}>
//             <Switch value={other} onValueChange={setOther} />
//           </View>
//         )}
//         <View style={styles.form}>
//           {other ? (
//             <>
//               <TextinputCompo
//                 style={styles.input2}
//                 placeholder="Search Employee"
//                 value={searchText}
//                 onChangeText={setSearchText}
//                 placeholderTextColor={isDarkMode ? 'lightgray' : 'gray'}
//               />
//               <ModalDropdown
//                 options={filteredEmployees.map((employee) => employee.employee_name)}
//                 defaultValue="Select Employee Name"
//                 onSelect={handleEmpChange}
//                 style={styles.dropdown}
//                 // dropdownStyle={{with:'100%'}}
//                 textStyle={styles.dropdownText}
//               />
//             </>
//           ) : (
//             <TextinputCompo
//               style={styles.input2}
//               placeholder="Employee Name"
//               value={employeeName}
//               editable={false}
//               onChangeText={setEmployeeName}
//               placeholderTextColor={isDarkMode ? 'lightgray' : 'gray'}
//             />
//           )}
//           <TextinputCompo
//             style={styles.input2}
//             placeholder="Employee Code"
//             value={employeeCode}
//             editable={false}
//             onChangeText={setEmployeeCode}
//             placeholderTextColor={isDarkMode ? 'lightgray' : 'gray'}
//           />
//           <TextinputCompo
//             style={[styles.input2, { height: 80, textAlignVertical: 'top' }]}
//             placeholder="Description"
//             multiline
//             value={description}
           
//             onChangeText={setDescription}
//             placeholderTextColor={isDarkMode ? 'lightgray' : 'gray'}
//           />
//           {/* <View style={styles.leaveTypeContainer}>
//             <Text style={styles.label}>Leave Type:</Text>
//             <ModalDropdown
//               options={leaveTypes.map((item) => item.name)}
//               defaultValue="Select Leave Type"
//               onSelect={(index, value) => handelSelection(index, value)}
//               style={styles.dropdown}
//               textStyle={styles.dropdownText}
//               onDropdownWillShow={handleLeaveType}
//             />
//             {showInputBox && (
//               <ModalDropdown
//                 options={restrictLeave.map((item) => item.name)}
//                 onSelect={(index, value) => {
//                   setSelectedRestrictedLeave(value);
//                   setSelectedRestrictedLeaveID(restrictLeave.filter((item) => item.name == value));
//                   const selected_value = restrictLeave.filter((item) => item.name == value);
//                   if (selected_value) {
//                     setFromDate(selected_value[0].from_Date);
//                     setToDate(selected_value[0].to_Date);
//                     handleLeaveTypeFromChange('Full Day');
//                   }
//                 }}
//                 defaultValue={selectedRestrictedLeave || 'Select Restricted Leave'}
//                 style={styles.dropdown}
//                 textStyle={styles.dropdownText}
//                 onDropdownWillShow={handleResLeave}
//               />
//             )}
//           </View> */}
//           <View style={styles.dateContainer}>
//             <View style={styles.datePicker}>
//               <Text style={styles.label}>From Date:</Text>
//               <TouchableOpacity onPress={() => openCalendar('fromDate')} style={styles.dateInput}>
//                 <TextinputCompo
//                   style={styles.input}
//                   placeholder="DD-MM-YYYY"
//                   value={fromDate ? formatDateForUI(fromDate) : ''}
//                   editable={false}
//                   placeholderTextColor={isDarkMode ? 'lightgray' : 'gray'}
//                 />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.datePicker}>
//               <Text style={styles.label}>Leave Type From:</Text>
//               <View style={styles.dateInput}>
//                 {/* <ModalDropdown
//                   options={leaveTypeFroms}
//                   defaultValue={leaveTypeFrom || 'Select Leave Type From'}
//                   onSelect={(index, value) => handleLeaveTypeFromChange(value)}
//                   style={styles.dropdown}
//                   textStyle={styles.dropdownText}
//                   dropdownTextStyle={{ color: isDarkMode ? 'white' : 'red' }}
//                   dropdownStyle={{ width: '50%', alignSelf: 'center' }}
//                   onDropdownWillShow={handleLeaveFromTO}
//                 /> */}
//                 <DropdownCompo
//   data={dropdownData}
//   selectedValue={selectedLeaveTypeTop}
//   onValueChange={handleTopChange}
//   placeholder="Select Leave Type From"
// />
//               </View>
//             </View>
//             {showTimeInputs && (
//               <>
//                 <View style={styles.timePicker}>
//                   <Text style={styles.label}>Time From:</Text>
//                   <View style={styles.timeInput}>
//                     <TextinputCompo
//                       style={styles.input}
//                       placeholder="HH:MM"
//                       value={timeFrom}
//                       onChangeText={setTimeFrom}
//                       placeholderTextColor={isDarkMode ? 'lightgray' : 'gray'}
//                     />
//                   </View>
//                 </View>
//                 <View style={styles.timePicker}>
//                   <Text style={styles.label}>Time To:</Text>
//                   <View style={styles.timeInput}>
//                     <TextinputCompo
//                       style={styles.input}
//                       placeholder="HH:MM"
//                       value={timeTo}
//                       onChangeText={setTimeTo}
//                       placeholderTextColor={isDarkMode ? 'lightgray' : 'gray'}
//                     />
//                   </View>
//                 </View>
//               </>
//             )}
//             <View style={styles.datePicker}>
//               <Text style={styles.label}>To Date:</Text>
//               <TouchableOpacity onPress={() => openCalendar('toDate')} style={styles.dateInput}>
//                 <TextinputCompo
//                   style={styles.input}
//                   placeholder="DD-MM-YYYY"
//                   value={toDate ? formatDateForUI(toDate) : ''}
//                   editable={false}
//                   placeholderTextColor={isDarkMode ? 'lightgray' : 'gray'}
//                 />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.datePicker}>
//               <Text style={styles.label}>Leave Type To:</Text>
//               <View style={styles.dateInput}>
//                 {/* <ModalDropdown
//                   options={leaveTypeTOs}
//                   defaultValue={leaveTypeTo || 'Select Leave Type To'}
//                   onSelect={(index, value) => setLeaveTypeTo(value)}
//                   style={styles.dropdown}
//                   textStyle={styles.dropdownText}
//                   dropdownStyle={{ width: '50%', alignSelf: 'center',backgroundColor:'red' }}
//                   onDropdownWillShow={handleLeaveFromTO}
//                 /> */}
              
// {/* {showTimeInputs && (
//   <>
//     <View style={styles.timePicker}>
//       <Text style={styles.label}>Time From:</Text>
//       <View style={styles.timeInput}>
//         <TextinputCompo
//           style={styles.input}
//           placeholder="HH:MM"
//           value={timeFrom}
//           onChangeText={setTimeFrom}
//           placeholderTextColor={isDarkMode ? 'lightgray' : 'gray'}
//         />
//       </View>
//     </View>
//     <View style={styles.timePicker}>
//       <Text style={styles.label}>Time To:</Text>
//       <View style={styles.timeInput}>
//         <TextinputCompo
//           style={styles.input}
//           placeholder="HH:MM"
//           value={timeTo}
//           onChangeText={setTimeTo}
//           placeholderTextColor={isDarkMode ? 'lightgray' : 'gray'}
//         />
//       </View>
//     </View>
//   </>
// )} */}
// <DropdownCompo
//   data={dropdownData}
//   selectedValue={selectedLeaveTypeBottom}
//   onValueChange={handleBottomChange}
//   placeholder="Select Leave Type To"
// />

//               </View>
//             </View>
//           </View>
//           <Modal visible={showCalendar} transparent={true}>
//             <View style={styles.calendarContainer}>
//               <Calendar
//                 onDayPress={(day) => {
//                   if (selectedDate === 'fromDate') {
//                     handleFromDateChange(day.dateString);
//                   } else if (selectedDate === 'toDate') {
//                     setToDate(day.dateString);
//                   }
//                   setShowCalendar(false);
//                 }}
//                 current={selectedDate === 'fromDate' ? fromDate : toDate}
//                 hideExtraDays={true}
//               />
//             </View>
//           </Modal>
//         </View>
//         <View style={createStyles(isDarkMode).buttonContainer}>
//           <TouchableOpacity
//             style={styles.submitButton}
//             onPress={handleSubmit}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.submitButtonText}>Submit</Text>
//             )}
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={createStyles(isDarkMode).button}>
//             <Text style={createStyles(isDarkMode).buttonText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//         {/* <View style={styles.buttonContainer}>
//           <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8} style={styles.button}>
//             <Text style={styles.buttonText}>Submit</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.button}>
//             <Text style={styles.buttonText}>Cancel</Text>
//           </TouchableOpacity>
//         </View> */}
//       </View>
//     </ScrollView>
//     </>
//   );
// };
 
 
// const createStyles = (isDarkMode) => StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: isDarkMode ? 'black' : 'white',
//   },
//   content: {
//     flex: 1,
//     backgroundColor: isDarkMode ? 'black' : 'white',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   header: {
//     backgroundColor: 'blue',
//     alignItems: 'center',
//     paddingVertical: 10,
//     marginBottom: 20,
//   },
//   headerText: {
//     fontSize: 24,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   switchContainer: {
//     paddingVertical: 10,
//     marginBottom: 20,
//   },
//   form: {
//     flex: 1,
//     paddingHorizontal: 10,
//   },
//   input: {
//     height: 40,
//     width: '99%',
//     borderColor: isDarkMode ? 'lightgray' : 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     // paddingHorizontal: 15,
//     paddingLeft: 20,
//     color: isDarkMode ? 'white' : 'black',
//     justifyContent: 'center'
//   },
//   input2: {
//     height: 40,
//     borderColor: isDarkMode ? 'lightgray' : 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 15,
//     color: isDarkMode ? 'white' : 'black',
//   },
//   dropdown: {
//     height: 40,
//     width: '100%',
//     borderColor: isDarkMode ? 'lightgray' : 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     justifyContent: 'center',
//     paddingLeft: 10,
//     borderRadius:5,
//     // backgroundColor:'red'
//     // paddingHorizontal: 15,
//   },
//   dropdownText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     // color:'red'
//     color: isDarkMode ? 'white' : 'black',
//     // justifyContent: 'center',
//     // width: '50%',
//   },
//   leaveTypeContainer: {
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     width: '29%',
//     color: isDarkMode ? 'white' : 'black',
//   },
//   dateContainer: {
//     padding: 10,
//     display: 'flex',
//     justifyContent: 'space-between',
//   },
//   datePicker: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   dateInput: {
//     flex: 2,
//     paddingLeft: 50,
//     // paddingHorizontal: 20,
//     // justifyContent: 'center',
//     width: '59%',
//   },
//   timeInput: {
//     flex: 2,
//     paddingLeft: 80,
//     // paddingHorizontal: 20,
//     width: '20%'
//   },
//   timePicker: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//     width: '75%',
//   },
//   calendarContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//     paddingHorizontal: 20,
//   },
//   button: {
//     backgroundColor: 'blue',
//     height: 60,
//     width: 120,
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   buttonText: {
//     fontSize: 20,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   submitButton: {
//     backgroundColor: 'blue',
//     height: 60,
//     width: 120,
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
// });
 
// export default LeaveRequest;



// Jamshed start 
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Alert, ScrollView, Switch, StyleSheet, useColorScheme,ActivityIndicator} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { AuthContext } from './Context';
import urls from '../../url';
import { Calendar } from 'react-native-calendars';
import HeaderCompo from '../components/HeaderCompo';
import TextinputCompo from '../components/TextinputCompo';
import ButtonCompo from '../components/ButtonCompo';
import { COLORS } from '../styles/Colors';
 
const LeaveRequest = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [loginEmpCode, setloginEmpCode] = useState(route.params.employeeCode || '');
  console.log("Login EMp Code ",loginEmpCode)
  const [employeeName, setEmployeeName] = useState(route.params.userName || '');
  const [employeeCode, setEmployeeCode] = useState(route.params.employeeCode || '');
  const [isManager, setIsManager] = useState(route.params.isManager || '');
  const [leaveManager, setLeaveManager] = useState(route.params.leaveManager || '');
  const [description, setDescription] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [leaveType, setLeaveType] = useState(null);
  const [leaveTypeFrom, setLeaveTypeFrom] = useState(null);
  const [leaveTypeTo, setLeaveTypeTo] = useState(null);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [restrictLeave, setRestrictLeave] = useState([]);
  const [leaveTypeFroms, setLeaveTypeFroms] = useState([]);
  const [leaveTypeTOs, setLeaveTypeTos] = useState([]);
  const [other, setOther] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [showTimeInputs, setShowTimeInputs] = useState(false);
  const [showInputBox, setShowInputBox] = useState(false);
  const [selectedRestrictedLeave, setSelectedRestrictedLeave] = useState('');
  const [selectedRestrictedLeaveID, setSelectedRestrictedLeaveID] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
 
 
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const getleave = server_origin + urls.getLeave;
  const getleavetype = server_origin + urls.getLeaveType;
  const getfromto = server_origin + urls.getLeaveFromTo;
  const getLeaveEmp = server_origin + urls.getLeaveEmployee;
  const getResLeave = server_origin + urls.getRestrictedLeave;
 
  const showAlert = (errorMessage) => {
    Alert.alert('Error', errorMessage);
  };
 
 const handleSubmit = async () => {
  setIsSubmitting(true);
  if (!employeeName || !employeeCode || !description || !fromDate || !toDate || !leaveTypeFrom || !leaveTypeTo) {
    showAlert('Please fill out all the required fields.');
    setIsSubmitting(false);
    return;
  }

  if (showTimeInputs && (!timeFrom || !timeTo)) {
    showAlert('Please fill out the time fields.');
    setIsSubmitting(false);
    return;
  }

  const params = {
    employeeCode,
    description,
    fromDate,
    toDate,
    leaveType,
    employeeName,
    leaveTypeFrom,
    leaveTypeTo,
    timeFrom,
    timeTo,
    selectedRestrictedLeaveID,
    loginEmpCode,
  };

  console.log('Request Params:', params); // 👈 log here

  try {
    const response = await fetch(getleave, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: params,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    console.log('Data sent successfully', responseData);

    if (responseData.result.error) {
      showAlert(responseData.result.error);
    } else {
      Alert.alert('Leave Request Submitted', 'Your leave request has been submitted successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Tabroutes'),
        },
      ]);
    }
  } catch (error) {
    console.error('Error sending data:', error);
    Alert.alert('Error', 'Failed to submit leave request. Please try again later.');
  }
};

 
  const handleLeaveType = async () => {
    try {
      const response = await fetch(getleavetype, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: { employeeName, employeeCode },
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const typeData = await response.json();
      console.log("----Type Data_----", typeData);
      const leaveTypesArray = typeData.result.map((item) => ({ name: item.name, id: item.id, type: item.leave_type }));
      setLeaveTypes(leaveTypesArray);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };
 
  const handleResLeave = async () => {
    try {
      const response = await fetch(getResLeave, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: { employeeCode },
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const resData = await response.json();
      const restrictedleave = resData.result.map((item) => ({ name: item.name, id: item.id, from_Date: item.from_date, to_Date: item.to_date }));
      setRestrictLeave(restrictedleave);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };
 
  const handleLeaveFromTO = async () => {
    try {
      const response = await fetch(getfromto, {
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
      const fromToData = await response.json();
      console.log('presenidt ', fromToData);
      const leaveTypesfromArray = fromToData.result.map((item) => item.name);
      console.log('Is id present', leaveTypesfromArray);
      setLeaveTypeFroms(leaveTypesfromArray);
      const leaveTypesToArray = fromToData.result.map((item) => item.name);
      setLeaveTypeTos(leaveTypesToArray);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };
 
  const handleEmp = async () => {
    try {
      const response = await fetch(getLeaveEmp, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: { employeeCode },
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const leaveEmployee = await response.json();
      console.log('==leave employee==', leaveEmployee);
      setEmployees(leaveEmployee.result);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };
 
  const formatDateForUI = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };
 
  const openCalendar = (dateField) => {
    setShowCalendar(true);
    setSelectedDate(dateField);
  };
 
  const handleFromDateChange = (date) => {
    setFromDate(date);
    setToDate(date);
  };
 
  const handleLeaveTypeFromChange = (value) => {
    console.log('KKJJCCCCCCCCCCCCCCC', value)
    setLeaveTypeFrom(value);
    setLeaveTypeTo(value);
    if (value === 'Short Leave') {
      setShowTimeInputs(true);
    } else {
      setShowTimeInputs(false);
    }
    console.log('check leave type', leaveTypeTOs, leaveTypeFroms);
  };
 
  const handelSelection = (index, value) => {
    console.log(index, value)
    const data = leaveTypes.filter(item => item.name == value)
    console.log(":-:-:-:-:-:-:-:-:-:-:-:-:-:-:-:-", data)
    setLeaveType(data)
    if (data[0]?.type === 'rh_holiday') {
      setShowInputBox(true);
    } else {
      setShowInputBox(false);
    }
  };
//  useEffect(()=>{
//  handleLeaveFromTO()
//  },[])
  const handleEmpChange = (index, value) => {
    const selectedEmployee = employees.find((employee) => employee.employee_name === value);
    if (selectedEmployee) {
      setEmployeeName(selectedEmployee.employee_name);
      setEmployeeCode(selectedEmployee.employee_code);
    }
  };
 
  const filteredEmployees = employees.filter((employee) =>
    employee.employee_name.toLowerCase().startsWith(searchText.toLowerCase())
  );
 
  const styles = createStyles(isDarkMode);
 
  useEffect(() => {
    handleEmp();
  }, []);
 
  return (
    <>
    <HeaderCompo title={'Leave Request'} lefticon={require('../assets/back.png')}
    onPress={()=>navigation.goBack()}/>
    <ScrollView style={styles.container}>
      <View style={styles.content}>
       
        {(isManager !== 'hr.employee()' || leaveManager) && (
          <View style={styles.switchContainer}>
            <Switch value={other} onValueChange={setOther} />
          </View>
        )}
        <View style={styles.form}>
          {other ? (
            <>
            <Text style={{...styles.dropdownText,color:isDarkMode?COLORS.white:COLORS.black}}>Name</Text>
              <TextinputCompo
                style={styles.input2}
                placeholder="Search Employee"
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor={isDarkMode ? COLORS.white : COLORS.black}
             
              />
              <ModalDropdown
                options={filteredEmployees.map((employee) => employee.employee_name)}
                defaultValue="Select Employee Name"
                onSelect={handleEmpChange}
                style={styles.dropdown}
                textStyle={styles.dropdownText}
                dropdownStyle={{ width: '50%' }}
                dropdownTextStyle={{ color: isDarkMode ? 'white' : 'black' ,fontSize:18}}
              />
            </>
          ) : (
            <>
                        <Text style={{...styles.dropdownText,color:isDarkMode?COLORS.white:COLORS.black}}>Name</Text>
                        <TextinputCompo
                          style={styles.input2}
                          placeholder="Employee Name"
                          value={employeeName}
                          editable={false}
                          onChangeText={setEmployeeName}
                          placeholderTextColor={isDarkMode ? 'white' : 'black'}
                        />
            </>
          )}
          <TextinputCompo
            style={styles.input2}
            placeholder="Employee Code"
            value={employeeCode}
            editable={false}
            onChangeText={setEmployeeCode}
            placeholderTextColor={isDarkMode ? 'white' : 'black'}
          />
           <Text style={styles.label}>From Date:</Text>
          <TextinputCompo
            style={[styles.input2, { height: 80, textAlignVertical: 'top' }]}
            placeholder="Description"
            multiline
            value={description}
            onChangeText={setDescription}
            placeholderTextColor={isDarkMode ? 'white' : 'black'}
          />
          {/* <View style={styles.leaveTypeContainer}>
            <Text style={styles.label}>Leave Type:</Text>
            <ModalDropdown
              options={leaveTypes.map((item) => item.name)}
              defaultValue="Select Leave Type"
              onSelect={(index, value) => handelSelection(index, value)}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              onDropdownWillShow={handleLeaveType}
            />
            {showInputBox && (
              <ModalDropdown
                options={restrictLeave.map((item) => item.name)}
                onSelect={(index, value) => {
                  setSelectedRestrictedLeave(value);
                  setSelectedRestrictedLeaveID(restrictLeave.filter((item) => item.name == value));
                  const selected_value = restrictLeave.filter((item) => item.name == value);
                  if (selected_value) {
                    setFromDate(selected_value[0].from_Date);
                    setToDate(selected_value[0].to_Date);
                    handleLeaveTypeFromChange('Full Day');
                  }
                }}
                defaultValue={selectedRestrictedLeave || 'Select Restricted Leave'}
                style={styles.dropdown}
                textStyle={styles.dropdownText}
                onDropdownWillShow={handleResLeave}
              />
            )}
          </View> */}
          <View style={styles.dateContainer}>
            <View style={styles.datePicker}>
              <Text style={styles.label}>From Date:</Text>
              <TouchableOpacity onPress={() => openCalendar('fromDate')} style={styles.dateInput}>
                <TextinputCompo
                  style={styles.input}
                  placeholder="DD-MM-YYYY"
                  value={fromDate ? formatDateForUI(fromDate) : ''}
                  editable={false}
                  placeholderTextColor={isDarkMode ? 'white' : 'black'}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.datePicker}>
              <Text style={styles.label}>Leave Type From:</Text>
              <View style={styles.dateInput}>
                <ModalDropdown
                  options={leaveTypeFroms}
                  defaultValue={leaveTypeFrom || 'Select Leave Type From'}
                  onSelect={(index, value) => handleLeaveTypeFromChange(value)}
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  dropdownStyle={{ width: '50%', alignSelf: 'center' }}
                  dropdownTextStyle={{ color: isDarkMode ? 'black' : 'black' ,fontSize:16}}
                  onDropdownWillShow={handleLeaveFromTO}
                />
              </View>
            </View>
            {showTimeInputs && (
              <>
                <View style={styles.timePicker}>
                  <Text style={styles.label}>Time From:</Text>
                  <View style={styles.timeInput}>
                    <TextinputCompo
                      style={styles.input}
                      placeholder="HH:MM"
                      value={timeFrom}
                      onChangeText={setTimeFrom}
                      placeholderTextColor={isDarkMode ? 'white' : 'black'}
                    />
                  </View>
                </View>
                <View style={styles.timePicker}>
                  <Text style={styles.label}>Time To:</Text>
                  <View style={styles.timeInput}>
                    <TextinputCompo
                      style={styles.input}
                      placeholder="HH:MM"
                      value={timeTo}
                      onChangeText={setTimeTo}
                      placeholderTextColor={isDarkMode ? 'white' : 'black'}
                    />
                  </View>
                </View>
              </>
            )}
            <View style={styles.datePicker}>
              <Text style={styles.label}>To Date:</Text>
              <TouchableOpacity onPress={() => openCalendar('toDate')} style={styles.dateInput}>
                <TextinputCompo
                  style={styles.input}
                  placeholder="DD-MM-YYYY"
                  value={toDate ? formatDateForUI(toDate) : ''}
                  editable={false}
                  placeholderTextColor={isDarkMode ? 'white' : 'black'}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.datePicker}>
              <Text style={styles.label}>Leave Type To:</Text>
              <View style={styles.dateInput}>
                <ModalDropdown
                  options={leaveTypeTOs}
                  defaultValue={leaveTypeTo || 'Select Leave Type To'}
                  onSelect={(index, value) => setLeaveTypeTo(value)}
                  style={styles.dropdown}
                  textStyle={styles.dropdownText}
                  dropdownStyle={{ width: '50%', alignSelf: 'center' }}
               dropdownTextStyle={{ color: 'black', fontSize: 16 }}
                  onDropdownWillShow={handleLeaveFromTO}
                />
              </View>
            </View>
          </View>
          <Modal visible={showCalendar} transparent={true}>
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={(day) => {
                  if (selectedDate === 'fromDate') {
                    handleFromDateChange(day.dateString);
                  } else if (selectedDate === 'toDate') {
                    setToDate(day.dateString);
                  }
                  setShowCalendar(false);
                }}
                current={selectedDate === 'fromDate' ? fromDate : toDate}
                hideExtraDays={true}
                style={{ backgroundColor: isDarkMode ? 'black' : 'white' ,borderRadius: 10,padding: 10}} 
              />
            </View>
          </Modal>
        </View>
        <View style={createStyles(isDarkMode).buttonContainer}>
         <ButtonCompo
  title="Submit"
  onPress={handleSubmit}
  disabled={isSubmitting}
  loading={isSubmitting}
  backgroundColor="#28a745" // optional
  textColor="#fff"          // optional
  style={styles.submitButton} // optional custom style
  textStyle={styles.submitButtonText} // optional text style
/>

          <ButtonCompo title='Cancel' textStyle={createStyles(isDarkMode).buttonText} style={createStyles(isDarkMode).button} 
         onPress={() => navigation.goBack()}/>
          {/* <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={createStyles(isDarkMode).button}>
            <Text style={createStyles(isDarkMode).buttonText}>Cancel</Text>
          </TouchableOpacity> */}
        </View>
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={styles.button}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </ScrollView>
    </>
  );
};
 
 
const createStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? 'black' : 'white',
  },
  content: {
    flex: 1,
    backgroundColor: isDarkMode ? 'black' : 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  switchContainer: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  form: {
    flex: 1,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    width: '99%',
    borderColor: isDarkMode ? 'lightgray' : 'gray',
    borderWidth: 1,
    marginBottom: 10,
    // paddingHorizontal: 15,
    paddingLeft: 20,
    color: isDarkMode ? 'white' : 'black',
    justifyContent: 'center'
  },
  input2: {
    height: 40,
    borderColor: isDarkMode ? 'lightgray' : 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 15,
    color: isDarkMode ? 'white' : 'black',
  },
  dropdown: {
    height: 40,
    width: '99%',
    borderColor: isDarkMode ? 'lightgray' : 'gray',
    borderWidth: 1,
    marginBottom: 10,
    justifyContent: 'center',
    paddingLeft: 10,
    borderRadius:5

    // paddingHorizontal: 15,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaveTypeContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '29%',
    color: isDarkMode ? 'white' : 'black',
  },
  dateContainer: {
    padding: 10,
    display: 'flex',
    justifyContent: 'space-between',
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateInput: {
    flex: 2,
    paddingLeft: 50,
    // paddingHorizontal: 20,
    // justifyContent: 'center',
    width: '59%',
  },
  timeInput: {
    flex: 2,
    paddingLeft: 80,
    // paddingHorizontal: 20,
    width: '20%'
  },
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '75%',
  },
  calendarContainer: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'blue',
    height: 60,
    width: 120,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: 'blue',
    height: 60,
    width: 120,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
 
export default LeaveRequest;
// Jamshed end 