// // Jamshed start 
// import React, { useState, useContext, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   Alert,
//   ScrollView,
//   useColorScheme,
//   TouchableOpacity,
//   Modal,
//   FlatList,
// } from 'react-native';
// import { AuthContext } from './Context';
// import urls from '../../url';
// import HeaderCompo from '../components/HeaderCompo';
// import makeApiCall from '../utils/apiHelper';
// import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
// import { showFlashMessage } from '../utils/fleshmessage';
// import { COLORS } from '../styles/Colors';
// import Loader from '../components/Loader';
// import { useSelector } from 'react-redux';
// import TextinputCompo from '../components/TextinputCompo';
// import SingleDropdown from '../components/SingleDropdown';
// import DropdownCompo from '../components/DropdownCompo';
// import MultiselectorDropDown from '../components/MultiselectorDropDown';
// import CalendarInput from '../components/CalendarInput';
// import navigationString from '../route/navigationString';
// import Remark from '../components/Modaals/Remark';
// import AssignToModal from '../components/Modaals/AssignToModal';

// const LeadForm = ({ route, navigation }) => {
//   // Extract route params with defaults
//   const employeeCode = route?.params?.employeeCode || '';
//   // console.log(employeeCode, 'Employee Code');
//   const is_multidivision = route?.params?.is_multidivision || '';
//   const resUser = route?.params?.resUser?.res_user || '';
//   const nameuser = route?.params?.resUser?.name || '';
//   // const nameuser1 = route?.params?.resUser || '';
//   // console.log(nameuser1, 'ywtewetywyt');
//   const user = useSelector(state => state.user.userDatainfo);
//   // console.log(user, 'User======>>>>ki');
//   console.log(route?.params)
//   const isManagement = user.result.is_management
//   const is_crm_user = route?.params?.resUser?.is_crm_user || '';
//   console.log(isManagement, 'is-----')
//   // Form state
//   const [leadName, setLeadName] = useState('');
//   const [openRemarkModal, setOpenRemarkModal] = useState(false);
//   const [tabremarks, settabremarks] = useState({});
//   const [prospectName, setProspectName] = useState('');
//   const [street, setStreet] = useState('');
//   const [city, setCity] = useState('');
//   const [country, setCountry] = useState('');
//   const [selectedCountryId, setSelectedCountryId] = useState('');
//   const [selectedState, setSelectedState] = useState('Select State');
//   const [selectedStateId, setSelectedStateId] = useState('');
//   const [contactName, setContactName] = useState('');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [division, setDivision] = useState('');

//   const [salesChannel, setSalesChannel] = useState([]);

//   // const [salesPerson, setSalesPerson] = useState('');
//   const [showAddressFields, setShowAddressFields] = useState(false);
//   const [internalNotesVisible, setInternalNotesVisible] = useState(false);
//   const [extraInfoVisible, setExtraInfoVisible] = useState(false);
//   const [internalNotes, setInternalNotes] = useState('');
//   const [extraInfo, setExtraInfo] = useState('');

//   const [loader, setloader] = useState(false);
//   // Search state
//   const [searchText, setSearchText] = useState('');
//   const [searchSaleText, setSearchSaleText] = useState('');
//   const [searchStateText, setSearchStateText] = useState('');
//   const [userinfo, setuserinfo] = useState(nameuser || '');
//   // Data state
//   const [divisions, setDivisions] = useState([]);
//   const [replyTo, setreplyTo] = useState([]);
//   const [selectedreplyTo, setselectedreplyTo] = useState(null);
//   const [salesPersons, setSalesPersons] = useState([]);
//   const [SelectedSalesPerson, setSelectedSalesPerson] = useState(null);

//   const [salesPersonId, setSalesPersonId] = useState(null);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [divisionId, setdivisionId] = useState(null);
//   const [assisnToData, setassignToData] = useState([]);
//   const [assignToId, setassignttoId] = useState(null);
//   const [visibleToData, setVisibleToData] = useState([]);
//   const [visibleToId, SetVisibleToId] = useState([]);
//   const [selectedsaleschannels, setselectedsaleschannels] = useState(null);
//   const [jobposting, setjobposting] = useState('');
//   const [remark, setremark] = useState('');
//   const toDay = new Date().toISOString().split('T')[0];
//   const [priority, setPriority] = useState(0);
//   const [dateValue, setDateValue] = useState(toDay || '');
//   const [remarkuser, setremarkuser] = useState('');
//   const [extraInfoData, setExtraInfoData] = useState({});
//   const [openassignTo, setopenasssignTo] = useState(false)
//   const [selectedAccountHolder, setSelectedAccountHolder] = useState(null);
//   // console.log(salesPersonId,selectedAccountHolder, 'Idewsss');
//   // console.log(dateValue);
//   // Context and theme
//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';

//   // API endpoints
//   const createLeadUrl = server_origin + urls.createLead;
//   const divisionsUrl = server_origin + urls.fetchleadsDivision;
//   const salesPersonsUrl = server_origin + urls.fetchLeadSalePerson;
//   const countryUrl = server_origin + urls.fetchCountryUrl;
//   const stateUrl = server_origin + urls.fetchStatesUrl;
//   // Filtered data for search functionality
//   const filteredCountries = searchText
//     ? countries.filter(country =>
//       country.value.toLowerCase().includes(searchText.trim().toLowerCase()),
//     )
//     : countries;

//   const filteredStates = searchStateText
//     ? states.filter(state =>
//       state.value.toLowerCase().includes(searchStateText.toLowerCase()),
//     )
//     : states;

//   const filteredSalesPersons = searchSaleText
//     ? salesPersons.filter(person =>
//       person.person_name.toLowerCase().includes(searchSaleText.toLowerCase()),
//     )
//     : salesPersons;

//   useEffect(() => {
//     fetchVisibleTotodata();
//     fetchDivisions();
//     fetchCountries();
//     fetchsaleschannel();
//     fetchreplyToinfo();
//   }, []);

//   const validateMobileNumber = () => {
//     const mobilePattern = /^[0-9]{10}$/;
//     return mobilePattern.test(mobileNumber);
//   };

//   const validateEmail = () => {
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailPattern.test(email);
//   };

//   const validateForm = () => {
//     if (!leadName.trim()) {
//       Alert.alert('Error', 'Lead name is required');
//       return false;
//     }

//     if (!prospectName.trim()) {
//       Alert.alert('Error', 'Prospect name is required');
//       return false;
//     }

//     if (!mobileNumber.trim()) {
//       Alert.alert('Error', 'Mobile number is required');
//       return false;
//     }

//     if (!validateMobileNumber()) {
//       Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
//       return false;
//     }

//     if (!email.trim()) {
//       Alert.alert('Error', 'Email is required');
//       return false;
//     }

//     if (!validateEmail()) {
//       Alert.alert('Error', 'Please enter a valid email address');
//       return false;
//     }

//     if (is_multidivision && !division) {
//       Alert.alert('Error', 'Please select a division');
//       return false;
//     }

//     return true;
//   };
//   const handleExtraInfoSave = data => {
//     // console.log('🌟 Data Received from Extra Info:', data);
//     setExtraInfoData(data);
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       const addressString = `${street}, ${city}, ${selectedStateId}, ${selectedCountryId}`;

//       // Prepare the payload first
//       const remarkData =
//         remarkuser || selectedreplyTo
//           ? [
//             {
//               reply_to: selectedreplyTo || null,
//               remark_user: resUser || '',
//               remaks_in_remarks: remarkuser || '',
//               remarks_date: dateValue || '',
//             },
//           ]
//           : [];

//       const payload = {
//         jsonrpc: '2.0',
//         method: 'call',
//         params: {
//           created_by: employeeCode,
//           type: 'lead',
//           name: leadName,
//           employeeCode: employeeCode,
//           prospect_name: prospectName,
//           address: addressString,
//           contact_name: contactName,
//           mobile_number: mobileNumber,
//           account_holder: selectedAccountHolder,
//           email: email,
//           division: division,
//           sales_person: salesPersonId,
//           internal_notes: internalNotes,
//           visible_To_Users: visibleToId,
//           assignTo_Id: isManagement ? assignToId : null,
//           sales_channel: selectedsaleschannels,
//           job_position: jobposting,
//           remark: remark,
//           priority: [priority],
//           remarkdata: remarkData,
//           extraInfo: extraInfoData,
//         },
//       };

//       console.log('Payload being sent:', JSON.stringify(payload, null, 2));
//       setloader(true);
//       const response = await fetch(createLeadUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`Network response was not ok: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log(result, 'Result Successs');

//       if (result.error) {
//         throw new Error(result.error.message || 'Failed to create lead');
//       }

//       // console.log('Lead created successfully:', result);

//       showFlashMessage({
//         message: 'Lead created successfully',
//         type: 'success',
//         duration: 3000,
//       });
//       showFlashMessage({
//         message: 'Lead created successfully',
//         type: 'success',
//         duration: 3000,
//       });
//       Alert.alert('Success', 'Lead created successfully.');
//       navigation.goBack();
//     } catch (error) {
//       console.error('Error creating lead:', error);

//       showFlashMessage({
//         message: error?.message || 'Failed to create lead',
//         type: 'danger',
//         duration: 3000,
//       });

//       Alert.alert('Error', error?.message || 'Failed to create lead');
//     } finally {
//       setloader(false);
//     }
//   };
//   // API calls
//   const fetchCountries = async () => {
//     try {
//       const response = await fetch(countryUrl, {
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
//         throw new Error(`Network response was not ok: ${response.status}`);
//       }

//       const result = await response.json();

//       if (result.error) {
//         throw new Error(result.error.message || 'Failed to fetch countries');
//       }

//       if (result.result) {
//         const countryList = result.result.map(item => ({
//           label: item.id,
//           value: item.name,
//         }));
//         setCountries(countryList);
//       }
//     } catch (error) {
//       console.error('Error fetching countries:', error);
//       Alert.alert('Error', error.message || 'Failed to fetch countries');
//     }
//   };

//   const fetchStates = async () => {
//     if (!selectedCountryId) {
//       console.warn('Please select a country first');
//       return;
//     }

//     // console.log('Fetching states for country ID:', selectedCountryId);

//     try {
//       const response = await fetch(stateUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {
//             country_id: parseInt(selectedCountryId), // Ensure it's a number if backend expects that
//           },
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Network response was not ok: ${response.status}`);
//       }

//       const result = await response.json();
//       // console.log('States API Response:', result);

//       if (result.error) {
//         throw new Error(result.error.message || 'Failed to fetch states');
//       }

//       if (result.result && result.result.length > 0) {
//         const stateList = result.result.map(item => ({
//           label: item.id,
//           value: item.name,
//         }));
//         setStates(stateList);
//       } else {
//         console.warn('No states found for this country');
//         setStates([]);
//         Alert.alert('Info', 'No states available for the selected country');
//       }
//     } catch (error) {
//       console.error('Error fetching states:', error);
//       Alert.alert('Error', error.message || 'Failed to fetch states');
//     }
//   };

//   useEffect(() => {
//     // console.log('Selected Country ID changed:', selectedCountryId);
//     if (selectedCountryId) {
//       fetchStates();
//     }
//   }, [selectedCountryId]);

//   // Fetch divisions
//   const fetchDivisions = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchleadsDivision,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: { resUser },
//         },
//       );

//       setDivisions(response.result || []);
//     } catch (error) {
//       console.error('Error fetching divisions:', error);
//       Alert.alert(
//         'Error',
//         error.response?.data?.error?.message || 'Failed to fetch divisions',
//       );
//     }
//   };
//   const fetchreplyToinfo = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchreplyto,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: { resUser },
//         },
//       );

//       console.log(response, 'fetchreplyToinfo');
//       const dropdownData = response.result.map(item => ({
//         label: item.replyto_name,
//         value: item.replyto_id,
//       }));
//       setreplyTo(dropdownData);
//     } catch (error) {
//       console.error('Error fetching fetchreplyToinfo:', error);
//       Alert.alert(
//         'Error',
//         error.response?.data?.error?.message ||
//         'Failed to fetch fetchreplyToinfo',
//       );
//     }
//   };
//   const fetchsaleschannel = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchsaleschannels,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: { resUser },
//         },
//       );
//       // console.log(response, 'Rsponece from sales channels');

//       const dropdownData = response.result.map(item => ({
//         label: item.channel_name,
//         value: item.channel_id,
//       }));
//       // console.log(dropdownData, 'oooooo');
//       setSalesChannel(dropdownData);
//       // setDivisions(response.result || []);
//     } catch (error) {
//       console.error('Error fetching channels:', error);
//       Alert.alert(
//         'Error',
//         error.response?.data?.error?.message || 'Failed to fetch channels',
//       );
//     }
//   };

//   const fetchSalesPersons = async divisionId => {
//     try {
//       const response = await fetch(salesPersonsUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: { division: divisionId, empCode: employeeCode },
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Network response was not ok: ${response.status}`);
//       }

//       const result = await response.json();

//       // console.log('Sales Persons API Response:', result);
//       if (result.error) {
//         throw new Error(
//           result.error.message || 'Failed to fetch sales persons',
//         );
//       }

//       if (result.result && result.result.length > 0) {
//         setSalesPersons(result.result);

//         const matchedPerson = result?.result.find(
//           person => person.person_id === resUser,
//         );
//         // console.log(matchedPerson, 'Matched');
//         if (matchedPerson) {
//           setSalesPersonId(matchedPerson.person_id);
//           setSelectedSalesPerson(matchedPerson.person_name);
//         }
//       } else {
//         console.warn('No salespersons found.');
//         setSalesPersons([]);
//       }
//     } catch (error) {
//       console.error('Error fetching Sales Person:', error);
//       Alert.alert('Error', error.message || 'Failed to fetch sales persons');
//     }
//   };

//   const fetchVisibleTotodata = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchVisibletodata,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {},
//         },
//       );
//       // console.log('VisibleToData', response);
//       if (response.result && response.result.length > 0) {
//         setVisibleToData(response?.result);
//         // setassignToData(responce?.result)
//       } else {
//         setVisibleToData([]);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchassigntohandle = async divisionId => {
//     try {
//       const responce = await makeApiCall(
//         server_origin,
//         urls.fetchassigntodata,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           params: { division: divisionId },
//         },
//       );
//       // console.log('assignTo', responce)
//       if (responce.result && responce.result.length > 0) {
//         setassignToData(responce?.result);
//       } else {
//         setassignToData([]);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const salesPersonOptions = salesPersons.map(person => ({
//     label: person.person_name,
//     value: person.person_id,
//   }));
//   const  accountHolderOptions = salesPersons.map(person => ({
//     label: person.person_name,
//     value: person.person_id,
//   }));
//   const assisnToOption = assisnToData.map(assign => ({
//     label: assign.assign_name,
//     value: assign.assign_id,
//   }));

//   const visibleToOpTion = visibleToData.map(item => ({
//     label: item.visibleTo_name,
//     value: item.visibleTo_id,
//   }));
//   // UI handlers
//   const handleInternalNotes = () => {
//     setInternalNotesVisible(!internalNotesVisible);
//   };

//   const handleExtraInfo = () => {
//     setExtraInfoVisible(!extraInfoVisible);
//   };
//   const handleAssignTo = () => {
//     setopenasssignTo(!openassignTo)
//   }

//   const handleCancel = () => {
//     navigation.goBack();
//   };

//   // Render component
//   return (
//     <>
//       <HeaderCompo
//         title={'Lead Form'}
//         lefticon={require('../assets/back.png')}
//         onPress={() => navigation.goBack()}
//       />

//       <ScrollView
//         style={{
//           flex: 1,
//           backgroundColor: isDarkMode ? COLORS.black : COLORS.white,
//         }}>
//         <View
//           style={[
//             styles.container,
//             // backgroundColor=isDarkMode?COLORS.black:COLORS.white
//             // isDarkMode ? styles.darkContainer : styles.lightContainer
//           ]}>
//           {/* Lead Name */}
//           <Text
//             style={[
//               styles.label,
//               isDarkMode ? styles.darkLabel : styles.lightLabel,
//             ]}>
//             Lead Name
//           </Text>
//           <TextInput
//             style={[styles.input]}
//             placeholder="Enter lead name"
//             placeholderTextColor={COLORS.PLACEHOLDER}
//             value={leadName}
//             onChangeText={text => setLeadName(text)}
//           />

//           {/* Prospect Name */}
//           <Text
//             style={[
//               styles.label,
//               isDarkMode ? styles.darkLabel : styles.lightLabel,
//             ]}>
//             Prospect Name
//           </Text>
//           <TextInput
//             style={[styles.input]}
//             placeholder="Enter prospect name"
//             placeholderTextColor={COLORS.PLACEHOLDER}
//             value={prospectName}
//             onChangeText={text => setProspectName(text)}
//           />

//           {/* Country Dropdown */}
//           <Text
//             style={[
//               styles.label,
//               isDarkMode ? styles.darkLabel : styles.lightLabel,
//             ]}>
//             Country
//           </Text>
//           <Dropdown
//             style={styles.dropdown}
//             placeholderStyle={{ color: COLORS.PLACEHOLDER }}
//             selectedTextStyle={{ color: COLORS.black }}
//             data={countries}
//             itemTextStyle={{ color: COLORS.black, fontWeight: '700' }}
//             inputSearchStyle={{ color: COLORS.black }}
//             search
//             maxHeight={300}
//             labelField="value"
//             valueField="label"
//             placeholder="Select Country"
//             searchPlaceholder="Search..."
//             value={selectedCountryId}
//             onChange={item => {
//               setCountry(item.value);
//               setSelectedCountryId(item.label);
//               setShowAddressFields(true);
//               fetchStates();
//             }}
//           />

//           {/* State Dropdown */}
//           {selectedCountryId && (
//             <View style={styles.formGroup}>
//               <Text
//                 style={[
//                   styles.label,
//                   isDarkMode ? styles.darkLabel : styles.lightLabel,
//                 ]}>
//                 State
//               </Text>
//               <Dropdown
//                 style={styles.dropdown}
//                 placeholderStyle={{ color: COLORS.PLACEHOLDER }}
//                 selectedTextStyle={{ color: COLORS.black }}
//                 data={states}
//                 search
//                 maxHeight={300}
//                 itemTextStyle={{ color: COLORS.black, fontWeight: '700' }}
//                 labelField="value"
//                 valueField="label"
//                 placeholder="Select State"
//                 searchPlaceholder="Search..."
//                 value={selectedStateId}
//                 onChange={item => {
//                   setSelectedState(item.value);
//                   setSelectedStateId(item.label);
//                   setShowAddressFields(true);
//                 }}
//               />
//             </View>
//           )}

//           {selectedStateId && (
//             <>
//               <Text
//                 style={[
//                   styles.label,
//                   isDarkMode ? styles.darkLabel : styles.lightLabel,
//                 ]}>
//                 Street
//               </Text>
//               <TextInput
//                 style={[styles.input]}
//                 placeholder="Enter street"
//                 value={street}
//                 onChangeText={setStreet}
//                 placeholderTextColor={COLORS.PLACEHOLDER}
//               />

//               {/* City */}
//               <Text
//                 style={[
//                   styles.label,
//                   isDarkMode ? styles.darkLabel : styles.lightLabel,
//                 ]}>
//                 City
//               </Text>
//               <TextInput
//                 style={[styles.input]}
//                 placeholder="Enter city"
//                 placeholderTextColor={COLORS.PLACEHOLDER}
//                 value={city}
//                 onChangeText={setCity}
//               />
//               <Text
//                 style={[
//                   styles.label,
//                   isDarkMode ? styles.darkLabel : styles.lightLabel,
//                 ]}>
//                 Email
//               </Text>
//               <TextInput
//                 style={[styles.input]}
//                 placeholder="Enter email"
//                 placeholderTextColor={COLORS.PLACEHOLDER}
//                 value={email}
//                 keyboardType="email-address"
//                 onChangeText={text => {
//                   setEmail(text);
//                   // Clear contact name if email is deleted
//                   // if (!text) setContactName('');
//                 }}
//               />
//               <Text
//                 style={[
//                   styles.label,
//                   isDarkMode ? styles.darkLabel : styles.lightLabel,
//                 ]}>
//                 Contact Name
//               </Text>
//               <TextInput
//                 style={[styles.input]}
//                 placeholder="Enter contact name"
//                 placeholderTextColor={COLORS.PLACEHOLDER}
//                 value={contactName}
//                 onChangeText={text => setContactName(text)}
//               />
//             </>
//           )}

//           {/* Address */}

//           {/* Contact Name */}
//           {/* Mobile Number (Always shown first) */}
//           <Text
//             style={[
//               styles.label,
//               isDarkMode ? styles.darkLabel : styles.lightLabel,
//             ]}>
//             Phone Number
//           </Text>
//           <TextInput
//             style={[styles.input]}
//             placeholder="Enter Phone number"
//             placeholderTextColor={COLORS.PLACEHOLDER}
//             value={mobileNumber}
//             keyboardType="phone-pad"
//             onChangeText={text => {
//               setMobileNumber(text);
//               // Clear dependent fields if mobile number is deleted
//             }}
//             maxLength={10}
//           />

//           {/* Email (Only shown if mobile number is valid) */}
//           {mobileNumber.length === 10 && (
//             <>
//               {/* <Text style={[styles.label, isDarkMode ? styles.darkLabel : styles.lightLabel]}>
//       Email
//     </Text> */}
//               {/* <TextinputCompo
//       style={[styles.input, ]}
//       placeholderTextColor={COLORS.black}
//       value={userinfo}
//       onChangeText={(text) => {
//         setuserinfo(text);
//         // Clear contact name if email is deleted
//       }}
//     /> */}
//             </>
//           )}

//           {/* Division Dropdown (Conditional) */}
//           {
//             <>
//               <Text
//                 style={[
//                   styles.label,
//                   isDarkMode ? styles.darkLabel : styles.lightLabel,
//                 ]}>
//                 Division
//               </Text>

//               <Dropdown
//                 style={styles.dropdown}
//                 placeholderStyle={{ color: COLORS.PLACEHOLDER }}
//                 selectedTextStyle={{ color: COLORS.black }}
//                 data={divisions.map(div => ({
//                   label: div.division_id,
//                   value: div.division_name,
//                 }))}
//                 search
//                 maxHeight={300}
//                 itemTextStyle={{ color: COLORS.black, fontWeight: '700' }}
//                 labelField="value"
//                 valueField="label"
//                 placeholder="Select Division"
//                 searchPlaceholder="Search..."
//                 value={division}
//                 onChange={item => {
//                   setDivision(item.label);
//                   setdivisionId(item.label);
//                   fetchSalesPersons(item.label);
//                   fetchassigntohandle(item.label);
//                 }}
//               />
//               {user.result.is_management && divisionId && (
//                 <>
//                   <Text
//                     style={[
//                       styles.label,
//                       isDarkMode ? styles.darkLabel : styles.lightLabel,
//                     ]}>
//                     Assign To
//                   </Text>
//                   <SingleDropdown
//                     data={assisnToOption}
//                     value={assignToId}
//                     labelField="label"
//                     valueField="value"
//                     placeholder="Assign To"
//                     onChange={item => {
//                       setassignttoId(item.value);
//                     }}
//                   />
//                 </>
//               )}
//               {divisionId && (
//                 <>
//                   <Text
//                     style={[
//                       styles.label,
//                       isDarkMode ? styles.darkLabel : styles.lightLabel,
//                     ]}>
//                     Sales Person
//                   </Text>
//                   <SingleDropdown
//                     data={salesPersonOptions}
//                     value={isManagement ? assignToId : salesPersonId}
//                     // data={salesPersonOptions}
//                     // value={salesPersonId}
//                     searchPlaceholder="Search Sales Person"
//                     labelField="label"
//                     valueField="value"
//                     style={styles.dropdown}
//                     onChange={item => {
//                       setSalesPersonId(item.value);
//                       setSelectedSalesPerson(item.label);
//                     }}
//                     placeholder="Select Sales Person"
//                     isDarkMode={isDarkMode}
//                   />
//                 </>
//               )}
//             </>
//           }

//           <Text
//             style={[
//               styles.label,
//               isDarkMode ? styles.darkLabel : styles.lightLabel,
//             ]}>
//             Account Holder
//           </Text>
//           <SingleDropdown
//             data={accountHolderOptions}
//             value={selectedAccountHolder}
//             // data={salesPersonOptions}
//             // value={salesPersonId}
//             searchPlaceholder="Account Holder"
//             labelField="label"
//             valueField="value"
//             style={styles.dropdown}
//             onChange={item => {
//               setSelectedAccountHolder(item.value);
//             }}
//             placeholder="Account Holder"
//             isDarkMode={isDarkMode}
//           />
//           <Text
//             style={[
//               styles.label,
//               isDarkMode ? styles.darkLabel : styles.lightLabel,
//             ]}>
//             Sales Channel
//           </Text>
//           <SingleDropdown
//             data={salesChannel}
//             value={selectedsaleschannels}
//             // data={salesPersonOptions}
//             // value={salesPersonId}
//             searchPlaceholder="Account Holder"
//             labelField="label"
//             valueField="value"
//             style={styles.dropdown}
//             onChange={item => {
//               // setSalesPersonId(item.value);
//               // setSelectedSalesPerson(item.label);
//               setselectedsaleschannels(item.value);
//             }}
//             placeholder="Sales Channel"
//             isDarkMode={isDarkMode}
//           />
//           <Text
//             style={[
//               styles.label,
//               isDarkMode ? styles.darkLabel : styles.lightLabel,
//             ]}>
//             Visible To
//           </Text>
//           {/* Visible To Dropdown */}
//             <DropdownCompo
//             data={visibleToOpTion}
//             selectedValues={visibleToId}
//             onValueChange={items => {
//               SetVisibleToId(items);
//             }}
//             placeholder="Visible To Data"
//           />
//           <Text
//             style={[
//               styles.label,
//               isDarkMode ? styles.darkLabel : styles.lightLabel,
//             ]}>
//             Job Position
//           </Text>
//           <TextInput
//             style={[styles.input]}
//             placeholder="Job Position"
//             placeholderTextColor={COLORS.PLACEHOLDER}
//             value={jobposting}
//             // keyboardType="phone-pad"
//             onChangeText={text => {
//               setjobposting(text);
//               // Clear dependent fields if mobile number is deleted
//             }}
//           />
//           <Text
//             style={[
//               styles.label,
//               isDarkMode ? styles.darkLabel : styles.lightLabel,
//             ]}>
//             Remarks
//           </Text>
//           <TextInput
//             style={[styles.input]}
//             placeholder="Remarks"
//             placeholderTextColor={COLORS.PLACEHOLDER}
//             value={remark}
//             // keyboardType="phone-pad"
//             onChangeText={text => {
//               setremark(text);
//               // Clear dependent fields if mobile number is deleted
//             }}
//           // maxLength={10}
//           />
//           <Text
//             style={[
//               styles.label,
//               isDarkMode ? styles.darkLabel : styles.lightLabel,
//             ]}>
//             Priority
//           </Text>

//           <View style={{ flexDirection: 'row', marginTop: 6 }}>
//             {[1, 2, 3].map(item => (
//               <TouchableOpacity key={item} onPress={() => setPriority(item)}>
//                 <Text
//                   style={{
//                     fontSize: 30,
//                     color: item <= priority ? '#FFD700' : '#999',
//                     marginRight: 5,
//                   }}>
//                   ★
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <Text
//             style={[
//               styles.label,
//               isDarkMode ? styles.darkLabel : styles.lightLabel,
//             ]}>
//             Created By
//           </Text>
//           {/* Created By (User Info) */}
//           <TextInput
//             style={[styles.input]}
//             placeholder="Created By"
//             placeholderTextColor={COLORS.PLACEHOLDER}
//             value={userinfo}
//             keyboardType="email-address"
//             onChangeText={text => {
//               setuserinfo(text);
//               // Clear contact name if email is deleted
//               // if (!text) setContactName('');
//             }}
//             editable={false}
//           />

//           {/* Additional Info Buttons */}
//           <View style={styles.buttonRow}>
//             <TouchableOpacity
//               style={styles.button}
//               onPress={handleInternalNotes}>
//               <Text style={styles.buttonText}>Internal Notes</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} onPress={handleExtraInfo}>
//               <Text style={styles.buttonText}>Remarks</Text>
//             </TouchableOpacity>
//             {/* <TouchableOpacity style={styles.button} onPress={handleAssignTo}>
//               <Text style={styles.buttonText}>Assigned To</Text>
//             </TouchableOpacity> */}
//           </View>


//           {/* Conditional Notes Field */}
//           {internalNotesVisible && (
//             <TextInput
//               style={[styles.input, styles.largeInput]}
//               placeholder="Enter internal notes"
//               placeholderTextColor={COLORS.PLACEHOLDER}
//               value={internalNotes}
//               onChangeText={text => setInternalNotes(text)}
//               multiline={true}
//             />
//           )}

//           {/* Conditional Extra Info Field */}
//           {extraInfoVisible && (
//             <>
//               <Text
//                 style={[
//                   styles.label,
//                   isDarkMode ? styles.darkLabel : styles.lightLabel,
//                 ]}>
//                 Date
//               </Text>
//               <CalendarInput
//                 value={dateValue}
//                 onChange={v => {
//                   console.log('DATE FROM CALENDAR:', v);
//                   setDateValue(v);
//                 }}
//                 placeholder="Select Date"
//                 styles={styles}
//                 COLORS={COLORS}
//               />
//               <Text
//                 style={[
//                   styles.label,
//                   isDarkMode ? styles.darkLabel : styles.lightLabel,
//                 ]}>
//                 Remarks
//               </Text>
//               <TextInput
//                 style={[styles.input]}
//                 placeholder="Remarks"
//                 placeholderTextColor={COLORS.PLACEHOLDER}
//                 value={remarkuser}
//                 onChangeText={text => setremarkuser(text)}
//                 multiline={true}
//               />
//               <Text
//                 style={[
//                   styles.label,
//                   isDarkMode ? styles.darkLabel : styles.lightLabel,
//                 ]}>
//                 Reply To
//               </Text>
//               <SingleDropdown
//                 data={replyTo}
//                 value={selectedreplyTo}
//                 placeholder="Reply To"
//                 onChange={item => {
//                   setselectedreplyTo(item.value);
//                 }}
//               />
//               <Text
//                 style={[
//                   styles.label,
//                   isDarkMode ? styles.darkLabel : styles.lightLabel,
//                 ]}>
//                 User
//               </Text>
//               <TextInput
//                 style={[styles.input]}
//                 placeholder="Created By"
//                 placeholderTextColor={COLORS.PLACEHOLDER}
//                 value={userinfo}
//                 keyboardType="email-address"
//                 onChangeText={text => {
//                   setuserinfo(text);
//                   // Clear contact name if email is deleted
//                   // if (!text) setContactName('');
//                 }}
//                 editable={false}
//               />
//             </>
//           )}

//           {/* Action Buttons */}
//           <View style={styles.actionButtons}>
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={handleSubmit}>
//               <Text style={styles.buttonText}>Save</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.actionButton, styles.cancelButton]}
//               onPress={handleCancel}>
//               <Text style={styles.buttonText}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.button,]}
//               onPress={() =>
//                 navigation.navigate(navigationString.EXTRAINFO, {
//                   onSave: handleExtraInfoSave,
//                 })
//               }>
//               <Text style={styles.buttonText}>Extra info</Text>
//             </TouchableOpacity>
//             <Loader visible={loader} text="Creating opportunity..." />
//             <Remark
//               isVisible={openRemarkModal}
//               onclose={data => {
//                 setOpenRemarkModal(false);

//                 if (data) {
//                   console.log('Received Remark Data:', data);
//                   settabremarks(data);

//                   // 🔥 You can also store it in state if needed
//                   // setRemarkData(data);
//                 }
//               }}
//               resUser={resUser}
//             />
//             <AssignToModal
//               isVisible={openassignTo}
//               onclose={() => setopenasssignTo(false)}
//             />
//           </View>
//         </View>
//       </ScrollView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   darkContainer: {
//     backgroundColor: '#121212',
//   },
//   lightContainer: {
//     backgroundColor: 'white',
//   },
//   formGroup: {
//     // marginBottom: 16,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     // marginBottom: 8,
//   },
//   darkLabel: {
//     color: '#fff',
//   },
//   lightLabel: {
//     color: '#000',
//   },
//   input: {
//     borderWidth: 1,
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//     backgroundColor: COLORS.white,
//     color: COLORS.black,
//   },
//   darkInput: {
//     borderColor: '#444',
//     backgroundColor: '#1c1c1e',
//     color: '#fff',
//   },
//   lightInput: {
//     borderColor: '#ddd',
//     backgroundColor: '#fff',
//     color: '#000',
//   },
//   largeInput: {
//     height: 120,
//     textAlignVertical: 'top',
//   },
//   dropdown: {
//     height: 50,
//     borderColor: COLORS.black,
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 16,
//     backgroundColor: COLORS.white,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   button: {
//     flex: 1,
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 8,
//     marginHorizontal: 3.3,
//     alignItems: 'center',
//     textAlign: 'center'
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//     marginBottom: 30,
//   },
//   actionButton: {
//     flex: 1,
//     backgroundColor: '#28a745',
//     padding: 16,
//     borderRadius: 8,
//     marginHorizontal: 5,
//     alignItems: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#dc3545',
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   modalContent: {
//     width: '90%',
//     borderRadius: 10,
//     padding: 20,
//     maxHeight: '80%',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 15,
//   },
//   listItem: {
//     padding: 15,
//     borderBottomWidth: 1,
//   },
//   closeButton: {
//     backgroundColor: '#007bff',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 15,
//   },
//   closeButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });

// export default LeadForm;
// // Jamshed end 


// LeadForm.jsx — Professional Refactor
// Author: Jamshed | Production-grade UI & Logic

import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { AuthContext } from './Context';
import urls from '../../url';
import HeaderCompo from '../components/HeaderCompo';
import makeApiCall from '../utils/apiHelper';
import { Dropdown } from 'react-native-element-dropdown';
import { showFlashMessage } from '../utils/fleshmessage';
import { COLORS } from '../styles/Colors';
import Loader from '../components/Loader';
import SingleDropdown from '../components/SingleDropdown';
import DropdownCompo from '../components/DropdownCompo';
import CalendarInput from '../components/CalendarInput';
import navigationString from '../route/navigationString';
import Remark from '../components/Modaals/Remark';
import AssignToModal from '../components/Modaals/AssignToModal';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = '#007AFF';
const SUCCESS = '#34C759';
const DANGER = '#FF3B30';
const TODAY = new Date().toISOString().split('T')[0];

const THEME = {
  light: {
    background: '#F4F6FB',
    card: '#FFFFFF',
    text: '#1A1D2E',
    subText: '#6B7280',
    label: '#374151',
    border: '#E2E8F0',
    input: '#FFFFFF',
    inputText: '#1A1D2E',
    placeholder: '#9CA3AF',
    section: '#EFF3FF',
    sectionText: '#3B5BDB',
  },
  dark: {
    background: '#0F1117',
    card: '#1C1F2E',
    text: '#F1F3FF',
    subText: '#8B92A5',
    label: '#CBD5E1',
    border: '#2A2D3E',
    input: '#252837',
    inputText: '#F1F3FF',
    placeholder: '#4B5563',
    section: '#1E2235',
    sectionText: '#7B9EFF',
  },
};

// ─── Validation Helpers ───────────────────────────────────────────────────────

const VALIDATORS = {
  mobile: (v) => /^[0-9]{10}$/.test(v),
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
};

const validateForm = ({ leadName, prospectName, mobileNumber, email, is_multidivision, division }) => {
  if (!leadName.trim()) return 'Lead name is required.';
  // if (!prospectName.trim()) return 'Prospect name is required.';
  // if (!mobileNumber.trim()) return 'Mobile number is required.';
  // if (!VALIDATORS.mobile(mobileNumber)) return 'Please enter a valid 10-digit mobile number.';
  // if (!email.trim()) return 'Email is required.';
  // if (!VALIDATORS.email(email)) return 'Please enter a valid email address.';
  if (is_multidivision && !division) return 'Please select a division.';
  return null;
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

const SectionHeader = ({ title, colors }) => (
  <View style={[styles.sectionHeader, { backgroundColor: colors.section }]}>
    <Text style={[styles.sectionTitle, { color: colors.sectionText }]}>{title}</Text>
  </View>
);

const FormLabel = ({ text, colors, required }) => (
  <Text style={[styles.label, { color: colors.label }]}>
    {text}
    {required && <Text style={{ color: DANGER }}> *</Text>}
  </Text>
);

const StyledInput = ({ colors, style, ...props }) => (
  <TextInput
    style={[
      styles.input,
      {
        backgroundColor: colors.input,
        borderColor: colors.border,
        color: colors.inputText,
      },
      style,
    ]}
    placeholderTextColor={colors.placeholder}
    {...props}
  />
);

const StyledDropdown = ({ colors, style, ...props }) => (
  <Dropdown
    style={[
      styles.dropdown,
      {
        backgroundColor: colors.input,
        borderColor: colors.border,
      },
      style,
    ]}
    placeholderStyle={{ color: colors.placeholder }}
    selectedTextStyle={{ color: colors.inputText }}
    itemTextStyle={{ color: COLORS.black, fontWeight: '600' }}
    inputSearchStyle={{ color: COLORS.black }}
    containerStyle={{ borderRadius: 10 }}
    search
    maxHeight={300}
    searchPlaceholder="Search..."
    {...props}
  />
);

const PriorityStars = ({ value, onChange }) => (
  <View style={styles.starsRow}>
    {[1, 2, 3].map((star) => (
      <TouchableOpacity key={star} onPress={() => onChange(star)} activeOpacity={0.7}>
        <Text style={[styles.star, { color: star <= value ? '#FBBF24' : '#D1D5DB' }]}>★</Text>
      </TouchableOpacity>
    ))}
    {value > 0 && (
      <TouchableOpacity onPress={() => onChange(0)} style={styles.clearPriority}>
        <Text style={styles.clearPriorityText}>Clear</Text>
      </TouchableOpacity>
    )}
  </View>
);

const ToggleButton = ({ label, active, onPress, colors }) => (
  <TouchableOpacity
    style={[
      styles.toggleButton,
      {
        backgroundColor: active ? ACCENT : colors.section,
        borderColor: active ? ACCENT : colors.border,
      },
    ]}
    onPress={onPress}
    activeOpacity={0.8}>
    <Text style={[styles.toggleButtonText, { color: active ? '#fff' : colors.sectionText }]}>
      {active ? '▾ ' : '▸ '}{label}
    </Text>
  </TouchableOpacity>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const LeadForm = ({ route, navigation }) => {
  // ── Route Params ────────────────────────────────────────────────────────────
  const {
    employeeCode = '',
    is_multidivision = '',
    resUser: resUserObj = {},
  } = route?.params || {};

  const resUser = resUserObj?.res_user || '';
  const currentUserOption = {
  label: resUserObj?.name,
  value: resUserObj?.res_user,
};
console.log("resUser:", currentUserOption);

  const nameuser = resUserObj?.name || '';
  const is_crm_user = resUserObj?.is_crm_user || '';

  // ── Redux & Context ─────────────────────────────────────────────────────────
  const user = useSelector((state) => state.user.userDatainfo);
  const isManagement = user?.result?.is_management;
  const { currentUrl: server_origin } = useContext(AuthContext);

  // ── Theme ────────────────────────────────────────────────────────────────────
  const colorScheme = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];

  // ── Form State ───────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    leadName: '',
    prospectName: '',
    street: '',
    street2: '',
    city: '',
    country: '',
    zipCode: '',
    selectedCountryId: '',
    selectedState: '',
    selectedStateId: '',
    contactName: '',
    mobileNumber: '',
    email: '',
    division: '',
    divisionId: null,
    internalNotes: '',
    jobPosting: '',
    remark: '',
    remarkUser: '',
    priority: 0,
    dateValue: TODAY,
    userInfo: nameuser || '',
  });

  // ── IDs & Selections ─────────────────────────────────────────────────────────
  const [salesPersonId, setSalesPersonId] = useState(null);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState(null);
  const [selectedAccountHolder, setSelectedAccountHolder] = useState(null);
  const [selectedSalesChannel, setSelectedSalesChannel] = useState(null);
  const [selectedReplyTo, setSelectedReplyTo] = useState(null);
  const [assignToId, setAssignToId] = useState(null);
  const [visibleToId, setVisibleToId] = useState([]);

  // ── Dropdown Data ────────────────────────────────────────────────────────────
  const [divisions, setDivisions] = useState([]);
  const [replyTo, setReplyTo] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);
  const [salesChannels, setSalesChannels] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [assignToData, setAssignToData] = useState([]);
  const [visibleToData, setVisibleToData] = useState([]);

  // ── UI State ─────────────────────────────────────────────────────────────────
  const [loader, setLoader] = useState(false);
  const [showInternalNotes, setShowInternalNotes] = useState(false);
  const [showRemarks, setShowRemarks] = useState(false);
  const [openRemarkModal, setOpenRemarkModal] = useState(false);
  const [openAssignTo, setOpenAssignTo] = useState(false);
  const [extraInfoData, setExtraInfoData] = useState({});


  // ── Field Updater ────────────────────────────────────────────────────────────
  const setField = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── Derived / Memoized Options ────────────────────────────────────────────────
  // const salesPersonOptions = useMemo(
  //   () => salesPersons.map((p) => ({ label: p.person_name, value: p.person_id })),
  //   [salesPersons],
  // );
  const salesPersonOptions = useMemo(() => {
  const options = salesPersons.map((p) => ({
    label: p.person_name,
    value: p.person_id,
  }));

  const exists = options.some(
    (o) => String(o.value) === String(resUserObj?.res_user)
  );

  if (!exists) {
    options.unshift(currentUserOption); // ✅ add if missing
  }

  return options;
}, [salesPersons]);
  const assignToOptions = useMemo(
    () => assignToData.map((a) => ({ label: a.assign_name, value: a.assign_id })),
    [assignToData],
  );
  const visibleToOptions = useMemo(
    () => visibleToData.map((v) => ({ label: v.visibleTo_name, value: v.visibleTo_id })),
    [visibleToData],
  );
  const divisionOptions = useMemo(
    () => divisions.map((d) => ({ label: d.division_id, value: d.division_name })),
    [divisions],
  );

  // ── API: Generic POST ─────────────────────────────────────────────────────────
  const apiPost = useCallback(
    async (url, params) => {
      const res = await makeApiCall(server_origin, url, 'POST', {
        jsonrpc: '2.0',
        method: 'call',
        params,
      });
      return res;
    },
    [server_origin],
  );

  // ── API: Fetch Helpers ────────────────────────────────────────────────────────
  const fetchDivisions = useCallback(async () => {
    try {
      const res = await apiPost(urls.fetchleadsDivision, { resUser });
      setDivisions(res?.result || []);
    } catch (e) {
      console.error('[LeadForm] fetchDivisions:', e);
    }
  }, [apiPost, resUser]);

  const fetchReplyTo = useCallback(async () => {
    try {
      const res = await apiPost(urls.fetchreplyto, { resUser });
      setReplyTo(
        (res?.result || []).map((i) => ({ label: i.replyto_name, value: i.replyto_id })),
      );
    } catch (e) {
      console.error('[LeadForm] fetchReplyTo:', e);
    }
  }, [apiPost, resUser]);

  const fetchSalesChannels = useCallback(async () => {
    try {
      const res = await apiPost(urls.fetchsaleschannels, { resUser });
      setSalesChannels(
        (res?.result || []).map((i) => ({ label: i.channel_name, value: i.channel_id })),
      );
    } catch (e) {
      console.error('[LeadForm] fetchSalesChannels:', e);
    }
  }, [apiPost, resUser]);

  const fetchCountries = useCallback(async () => {
    try {
      const res = await apiPost(urls.fetchCountryUrl, {});
      setCountries(
        (res?.result || []).map((i) => ({ label: i.id, value: i.name })),
      );
    } catch (e) {
      console.error('[LeadForm] fetchCountries:', e);
    }
  }, [apiPost]);

  const fetchStates = useCallback(
    async (countryId) => {
      if (!countryId) return;
      try {
        const res = await apiPost(urls.fetchStatesUrl, { country_id: parseInt(countryId) });
        const result = res?.result || [];
        if (result.length === 0) {
          Alert.alert('Info', 'No states available for the selected country.');
          setStates([]);
          return;
        }
        setStates(result.map((i) => ({ label: i.id, value: i.name })));
      } catch (e) {
        console.error('[LeadForm] fetchStates:', e);
      }
    },
    [apiPost],
  );

  const fetchSalesPersons = useCallback(
    async (divId) => {
      try {
        const res = await apiPost(urls.fetchLeadSalePerson, {
          division: divId,
          empCode: employeeCode,
        });
        const persons = res?.result || [];
        setSalesPersons(persons);
        const matched = persons.find((p) => p.person_id === resUser);
        console.log(matched,'Matched')
        if (matched) {
          setSalesPersonId(matched.person_id);
          setSelectedSalesPerson(matched.person_name);
        }
      } catch (e) {
        console.error('[LeadForm] fetchSalesPersons:', e);
      }
    },
    [apiPost, employeeCode, resUser],
  );

  const fetchAssignTo = useCallback(
    async (divId) => {
      try {
        const res = await apiPost(urls.fetchassigntodata, { division: divId });
        setAssignToData(res?.result || []);
      } catch (e) {
        console.error('[LeadForm] fetchAssignTo:', e);
      }
    },
    [apiPost],
  );

  const fetchVisibleTo = useCallback(async () => {
    try {
      const res = await apiPost(urls.fetchVisibletodata, {});
      setVisibleToData(res?.result || []);
    } catch (e) {
      console.error('[LeadForm] fetchVisibleTo:', e);
    }
  }, [apiPost]);

  // ── Init ──────────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchDivisions();
    fetchCountries();
    fetchSalesChannels();
    fetchReplyTo();
    fetchVisibleTo();
  }, []);

  useEffect(() => {
    if (form.selectedCountryId) fetchStates(form.selectedCountryId);
  }, [form.selectedCountryId]);

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    const error = validateForm({
      leadName: form.leadName,
      prospectName: form.prospectName,
      mobileNumber: form.mobileNumber,
      email: form.email,
      is_multidivision,
      division: form.division,
    });

    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    const remarkData =
      form.remarkUser || selectedReplyTo
        ? [
            {
              reply_to: selectedReplyTo || null,
              remark_user: resUser || '',
              remaks_in_remarks: form.remarkUser || '',
              remarks_date: form.dateValue || '',
            },
          ]
        : [];

    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        created_by: employeeCode,
        type: 'lead',
        name: form.leadName,
        employeeCode,
        prospect_name: form.prospectName,
        address: [form.street, form.city, form.selectedStateId, form.selectedCountryId]
          .filter(Boolean)
          .join(', '),
        country_id: form.selectedCountryId,
        state_id: form.selectedStateId,
        city: form.city,
        street: form.street,
        street2: form.street2,
        zip_code: form.zipCode,
        contact_name: form.contactName,
        mobile_number: form.mobileNumber,
        account_holder: selectedAccountHolder,
        email: form.email,
        division: form.division,
        sales_person: salesPersonId,
        internal_notes: form.internalNotes,
        visible_To_Users: visibleToId,
        assignTo_Id: isManagement ? assignToId : null,
        sales_channel: Number(selectedSalesChannel),
        job_position: form.jobPosting,
        remark: form.remark,
        priority: [form.priority],
        remarkdata: remarkData,
        extraInfo: extraInfoData,
       
      },
    };

    setLoader(true);
    try {
      const res = await fetch(server_origin + urls.createLead, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      // console.log(res,'Res_Jamshed')

      if (!res.ok) throw new Error(`Network error: ${res.status}`);
      const result = await res.json();
      console.log(result,'result')
      if (result.error) throw new Error(result.error.message || 'Failed to create lead');

      showFlashMessage({ message: 'Lead created successfully', type: 'success', duration: 3000 });
      Alert.alert('Success', 'Lead created successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      console.error('[LeadForm] handleSubmit:', e);
      showFlashMessage({ message: e?.message || 'Failed to create lead', type: 'danger', duration: 3000 });
      Alert.alert('Error', e?.message || 'Failed to create lead');
    } finally {
      setLoader(false);
    }
  }, [form, salesPersonId, selectedAccountHolder, selectedSalesChannel, selectedReplyTo, assignToId, visibleToId, extraInfoData, isManagement, employeeCode, resUser, is_multidivision, server_origin, navigation]);

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <HeaderCompo
        title="Lead Form"
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── Basic Info ─────────────────────────────────────────────────── */}
        {/* <SectionHeader title="Basic Information" colors={colors} /> */}

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FormLabel text="Lead" colors={colors} required />
          <StyledInput
            colors={colors}
            placeholder="Describe the lead "
            value={form.leadName}
            onChangeText={(v) => setField('leadName', v)}
          />

          <FormLabel text="Prospect Name" colors={colors}  />
          <StyledInput
            colors={colors}
            placeholder="Enter prospect name"
            value={form.prospectName}
            onChangeText={(v) => setField('prospectName', v)}
          />

        </View>

        {/* ── Address ────────────────────────────────────────────────────── */}
        {/* <SectionHeader title="Address" colors={colors} /> */}

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FormLabel text="Country" colors={colors} />
          <StyledDropdown
            colors={colors}
            data={countries}
            labelField="value"
            valueField="label"
            placeholder="Select Country"
            value={form.selectedCountryId}
            onChange={(item) => {
              setField('country', item.value);
              setField('selectedCountryId', item.label);
              setField('selectedStateId', '');
              setField('selectedState', '');
              setStates([]);
            }}
          />

          {form.selectedCountryId ? (
            <>
              <FormLabel text="State" colors={colors} />
              <StyledDropdown
                colors={colors}
                data={states}
                labelField="value"
                valueField="label"
                placeholder="Select State"
                value={form.selectedStateId}
                onChange={(item) => {
                  setField('selectedState', item.value);
                  setField('selectedStateId', item.label);
                }}
              />
            </>
          ) : null}


          {form.selectedStateId ? (
            <>
             <FormLabel text="City" colors={colors} />
              <StyledInput
                colors={colors}
                placeholder="Enter city"
                value={form.city}
                onChangeText={(v) => setField('city', v)}
              />
              <FormLabel text="Street" colors={colors} />
              <StyledInput
                colors={colors}
                placeholder="Enter street"
                value={form.street}
                onChangeText={(v) => setField('street', v)}
              />
               <FormLabel text="Street2" colors={colors} />
              <StyledInput
                colors={colors}
                placeholder="Enter street2"
                value={form.street2}
                onChangeText={(v) => setField('street2', v)}
              />
                <FormLabel text="Zip Code" colors={colors} />
              <StyledInput
                colors={colors}
                placeholder="Enter zip code"
                value={form.zipCode}
                onChangeText={(v) => setField('zipCode', v)}
                maxLength={6}
              />

             
            </>
          ) : null}
        </View>

        {/* ── Sales & Division ───────────────────────────────────────────── */}
        {/* <SectionHeader title="Sales & Division" colors={colors} /> */}

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FormLabel text="Division" colors={colors} 
          // required={!!is_multidivision}
          required

           />
          <StyledDropdown
            colors={colors}
            data={divisionOptions}
            labelField="value"
            valueField="label"
            placeholder="Select Division"
            value={form.division}
            onChange={(item) => {
              setField('division', item.label);
              setField('divisionId', item.label);
              fetchSalesPersons(item.label);
              fetchAssignTo(item.label);
            }}
          />

          {isManagement && form.divisionId ? (
            <>
              <FormLabel text="Assign To" colors={colors} />
              <SingleDropdown
                data={assignToOptions}
                value={assignToId}
                labelField="label"
                valueField="value"
                placeholder="Select Assign To"
                onChange={(item) => setAssignToId(item.value)}
              />
            </>
          ) : null}

          {form.divisionId ? (
            <>
              <FormLabel text="Sales Person" colors={colors} />
              <SingleDropdown
                data={salesPersonOptions}
                value={isManagement ? assignToId : salesPersonId}
                labelField="label"
                valueField="value"
                placeholder="Select Sales Person"
                onChange={(item) => {
                  setSalesPersonId(item.value);
                  setSelectedSalesPerson(item.label);
                
                }}
                isDarkMode={colorScheme === 'dark'}
              />
        
            </>
          ) : null}

          <FormLabel text="Account Holder" colors={colors} />
          <SingleDropdown
            data={salesPersonOptions}
            value={selectedAccountHolder}
            labelField="label"
            valueField="value"
            placeholder="Select Account Holder"
            onChange={(item) => setSelectedAccountHolder(item.value)}
            isDarkMode={colorScheme === 'dark'}
          />

          <FormLabel text="Sales Channel" colors={colors} />
          <SingleDropdown
            data={salesChannels}
            value={selectedSalesChannel}
            labelField="label"
            valueField="value"
            placeholder="Select Sales Channel"
            onChange={(item) => setSelectedSalesChannel(item.value)}
            isDarkMode={colorScheme === 'dark'}
          />
           <FormLabel text="Visible To" colors={colors} />
          <DropdownCompo
            data={visibleToOptions}
            selectedValues={visibleToId}
            onValueChange={setVisibleToId}
            placeholder="Select Visible To"
          />
        </View>

        {/* ── Visibility & Priority ───────────────────────────────────────── */}
        {/* <SectionHeader title="Visibility & Priority" colors={colors} /> */}

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
           <FormLabel text="Contact Name" colors={colors} />
          <StyledInput
            colors={colors}
            placeholder="Enter contact name"
            value={form.contactName}
            onChangeText={(v) => setField('contactName', v)}
          />

          <FormLabel text="Phone Number" colors={colors}  />
          <StyledInput
            colors={colors}
            placeholder="Enter 10-digit mobile number"
            value={form.mobileNumber}
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={(v) => setField('mobileNumber', v)}
          />

          <FormLabel text="Email" colors={colors}  />
          <StyledInput
            colors={colors}
            placeholder="Enter email address"
            value={form.email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(v) => setField('email', v)}
          />

         

          <FormLabel text="Job Position" colors={colors} />
          <StyledInput
            colors={colors}
            placeholder="Enter job position"
            value={form.jobPosting}
            onChangeText={(v) => setField('jobPosting', v)}
          />

          <FormLabel text="Remarks" colors={colors} />
          <StyledInput
            colors={colors}
            placeholder="Enter remarks"
            value={form.remark}
            onChangeText={(v) => setField('remark', v)}
            multiline
            style={{ minHeight: 60, textAlignVertical: 'top' }}
          />

          <FormLabel text="Priority" colors={colors} />
          <PriorityStars value={form.priority} onChange={(v) => setField('priority', v)} />

          <FormLabel text="Created By" colors={colors} />
          <StyledInput
            colors={colors}
            placeholder="Created By"
            value={form.userInfo}
            editable={false}
            style={{ opacity: 0.7 }}
          />
        </View>

        {/* ── Optional Sections ───────────────────────────────────────────── */}
        <View style={styles.toggleRow}>
          <ToggleButton
            label="Internal Notes"
            active={showInternalNotes}
            onPress={() => setShowInternalNotes((p) => !p)}
            colors={colors}
          />
          <ToggleButton
            label="Remarks Info"
            active={showRemarks}
            onPress={() => setShowRemarks((p) => !p)}
            colors={colors}
          />
        </View>

        {showInternalNotes && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <FormLabel text="Internal Notes" colors={colors} />
            <StyledInput
              colors={colors}
              placeholder="Enter internal notes"
              value={form.internalNotes}
              onChangeText={(v) => setField('internalNotes', v)}
              multiline
              style={{ minHeight: 100, textAlignVertical: 'top' }}
            />
          </View>
        )}

        {showRemarks && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <FormLabel text="Date" colors={colors} />
            <CalendarInput
              value={form.dateValue}
              onChange={(v) => setField('dateValue', v)}
              placeholder="Select Date"
            />

            <FormLabel text="Remarks" colors={colors} />
            <StyledInput
              colors={colors}
              placeholder="Enter remarks"
              value={form.remarkUser}
              onChangeText={(v) => setField('remarkUser', v)}
              multiline
              style={{ minHeight: 70, textAlignVertical: 'top' }}
            />

            <FormLabel text="Reply To" colors={colors} />
            <SingleDropdown
              data={replyTo}
              value={selectedReplyTo}
              labelField="label"
              valueField="value"
              placeholder="Select Reply To"
              onChange={(item) => setSelectedReplyTo(item.value)}
            />

            <FormLabel text="User" colors={colors} />
            <StyledInput
              colors={colors}
              placeholder="User"
              value={form.userInfo}
              editable={false}
              style={{ opacity: 0.7 }}
            />
          </View>
        )}

        {/* ── Action Buttons ─────────────────────────────────────────────── */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: SUCCESS }]}
            onPress={handleSubmit}
            activeOpacity={0.85}>
            <Text style={styles.actionBtnText}>✓  Save Lead</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#6B7280' }]}
            onPress={() =>
              navigation.navigate(navigationString.EXTRAINFO, {
                onSave: setExtraInfoData,
              })
            }
            activeOpacity={0.85}>
            <Text style={styles.actionBtnText}>Extra Info</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: DANGER }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}>
            <Text style={styles.actionBtnText}>✕  Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* ── Modals ─────────────────────────────────────────────────────── */}
        <Loader visible={loader} text="Creating lead..." />
        <Remark
          isVisible={openRemarkModal}
          onclose={(data) => {
            setOpenRemarkModal(false);
            if (data) console.log('[LeadForm] Remark data:', data);
          }}
          resUser={resUser}
        />
        <AssignToModal
          isVisible={openAssignTo}
          onclose={() => setOpenAssignTo(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },

  // Section Header
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // Card
  card: {
    marginHorizontal: 12,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  // Label
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 4,
    letterSpacing: 0.1,
  },

  // Input
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    marginBottom: 14,
  },

  // Dropdown
  dropdown: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },

  // Priority Stars
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 4,
  },
  star: {
    fontSize: 32,
    marginRight: 2,
  },
  clearPriority: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  clearPriorityText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },

  // Toggle Buttons
  toggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Action Row
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 20,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2,
  },
});

export default LeadForm;
// Jamshed end — Professional Refactor