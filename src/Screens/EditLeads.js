// // Jamshed start 
// import React, { useState, useContext, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   useColorScheme,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
// } from 'react-native';
// import { AuthContext } from './Context';
// import urls from '../../url';
// import HeaderCompo from '../components/HeaderCompo';
// import TextinputCompo from '../components/TextinputCompo';
// import ButtonCompo from '../components/ButtonCompo';
// import Loader from '../components/Loader';
// import { showFlashMessage } from '../utils/fleshmessage';
// import SingleDropdown from '../components/SingleDropdown';
// import makeApiCall from '../utils/apiHelper';
// import axios from 'axios';
// import { Dropdown } from 'react-native-element-dropdown';
// import navigationString from '../route/navigationString';
// import { COLORS } from '../styles/Colors';
// import DropdownCompo from '../components/DropdownCompo';
// import { useSelector } from 'react-redux';
// import MultiselectorDropDown from '../components/MultiselectorDropDown';
// import CalendarInput from '../components/CalendarInput';
// import RemarkModal from '../components/RemarkModal';

// const EditLeads = ({ route, navigation }) => {
//   const { leadData } = route.params;


//   // const resUser = route.params.resUser.res_user;
//   const nameuser = route?.params?.resUser?.name || '';
//   // console.log(leadData, 'LeadData');
//   const user = useSelector(state => state.user.userDatainfo);
//   const resUser = user?.result?.res_user;
//   const colorScheme = useColorScheme();
//   const [name, setName] = useState(leadData.name || '');
//   const [email, setEmail] = useState(leadData.email || '');
//   const [phone, setPhone] = useState(leadData.phone || '');
//   const [contact, setContact] = useState(leadData.contact || '');
//   const [city, setcity] = useState(leadData.city || '');
//   const [street, setstreet] = useState(leadData.street || '');
//   const [extraInfo, setExtraInfo] = useState(false);
//   const [salesChannel, setSalesChannel] = useState([]);
//   const [SelectedSalesPerson, setSelectedSalesPerson] = useState(null);
//   const [selectedsaleschannels, setselectedsaleschannels] = useState(null);
//   const [dateValue, setDateValue] = useState('');
//   const [replyTo, setreplyTo] = useState([]);
//   const [selectedreplyTo, setselectedreplyTo] = useState(null);
//   const [userinfo, setuserinfo] = useState(nameuser || '');
//   const [priority, setPriority] = useState(leadData?.priority || 0);
//   const [remarks, setRemarks] = useState(false);
//   const [jobposition, setjobposition] = useState(leadData?.job_position || '');
//   const [remark, setremark] = useState(leadData?.remarks || '');
//   const [assignToId, setassignttoId] = useState(null);
//   console.log('', leadData, 'iiiiiiiiiiiii');
//   const [remarkuser, setremarkuser] = useState('');

//   const [loader, setloader] = useState(false);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [selectedCountryId, setSelectedCountryId] = useState(
//     leadData?.country_id?.toString() || null,
//   );
//   const [selectedStateId, setSelectedStateId] = useState(
//     leadData?.state_id?.toString() || null,
//   );
//   const [selectedDivision, setselectedDevision] = useState(
//     leadData?.division_id?.toString() || null,

//   );
//   const [accountHolder, setAccountHolder] = useState([]);
//   const [selectedAccountHolder, setSelectedAccountHolder] = useState(null);
//   const [salesPersons, setSalesPersons] = useState([]);
//   const [salesPersonId, setSalesPersonId] = useState(null);
//   const [internalnotes, setInternalnotes] = useState(
//     leadData?.description || '',
//   );

//   const [slectdAssignToId, setseletedassigntoId] = useState(null);

//   const [assisnToData, setassignToData] = useState([]);
//   const [visibleToData, setVisibleToData] = useState([]);
//   const [visibleToId, SetVisibleToId] = useState([]);
//   const [extraInfoData, setExtraInfoData] = useState({
//     medium_id: leadData?.medium_id,
//     source_id: leadData?.source_id,
//     query_raised_date: leadData?.date_open,
//     query_closed_date: leadData?.date_closed,
//     referred_by: leadData?.referred,
//     probability: leadData?.probability || 0,
//     campaign_id: leadData?.campaign_id,
//   });
//   console.log(assisnToData, 'ExtraInfoData');
//   const [prospectName, setProspectName] = useState(leadData?.Prospect_name || '');

//   const [remaks, setremarks] = useState(false);
//   const lastRemark = leadData?.remarks_lines
//     ? Object.values(leadData.remarks_lines).slice(-1)[0]
//     : null;

//   const [selectedRemark, setSelectedRemark] = useState({
//     line_id: lastRemark?.line_id ?? 0,
//     reply_to: lastRemark?.reply_to || '',
//     remark_user: lastRemark?.user || '',
//     remaks_in_remarks: lastRemark?.remarks || '',
//     remarks_date: lastRemark?.date || '',
//   });
//   const [division, setDevision] = useState([]);
//   const [loading, setLoading] = useState({
//     countries: false,
//     states: false,
//     division: false,
//   });
//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const editLeadUrl = server_origin + urls.editLead;
//   const stateUrl = server_origin + urls.fetchStatesUrl;
//   const countryUrl = server_origin + urls.fetchCountryUrl;
//   const salesPersonsUrl = server_origin + urls.fetchLeadSalePerson;
//   const isManagement = user.result.is_management

//   const salesPersonOptions = salesPersons.map(person => ({
//     label: person.person_name,
//     value: person.person_id,
//   }));
 
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

//   const handleExtraInfoSave = data => {
//     setExtraInfoData(data);
//   };
//   const handleRemarkClose = remarkData => {
//     setremarks(false);

//     if (remarkData) {
//       setSelectedRemark(remarkData);
//     }
//   };
//   const assisnToOption = assisnToData.map(assign => ({
//     label: assign.assign_name,
//     value: assign.assign_id,
//   }));

//   const handleSave = async () => {
//     console.log('Calling ApI Success Fully ');

    
//     if (!name || !email || !phone || !contact) {
//       Alert.alert('Error', 'Please fill in all required fields.');
//       return;
//     }

//     try {
//       setloader(true);

//       const payload = {
//         id: leadData.id,
//         name,
//         email,
//         phone,
//         contact_name: contact,
//         city,
//         street,
//         country_id: selectedCountryId ? parseInt(selectedCountryId) : null,
//         state_id: selectedStateId ? parseInt(selectedStateId) : null,
//         division: selectedDivision.toString(),
//         visible_To_Users: visibleToId,
//         assignTo_Id: parseInt(slectdAssignToId),
//         sale_person_id: parseInt(salesPersonId),
//         sales_channel: selectedsaleschannels,
//         account_holder: salesPersonId,
//         job_position: jobposition,
//         remark: remark,
//         priority: [priority],
//         partner_name:prospectName,
        
//         // remarkdata: [selectedRemark],
//         extraInfo: extraInfoData,
//         internal_notes: internalnotes,
//       };
//       console.log(payload, 'PayLoad');
//       const response = await fetch(editLeadUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: payload,
//         }),
//       });
//       console.log(response, 'RESPONCE');
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const result = await response.json();

//       // ✅ Console the server response
//       console.log('Lead updated successfully. Server Response:', result);

//       // ✅ Console the updated lead data you sent

//       if (result.result.success === true) {
//         console.log('Lead updated successfully. Server Response:', result);

//         showFlashMessage({
//           message: result.result.message || 'Lead updated successfully',
//           type: 'success',
//           duration: 3000,
//         });
//         navigation.pop(2);
//       } else {
//         Alert.alert('Error');
//       }

//       // navigation.goBack();
//     } catch (error) {
//       console.error('Error updating lead:', error);
//       showFlashMessage({
//         message: 'Failed to update lead',
//         type: 'danger',
//         duration: 3000,
//       });
//     } finally {
//       setloader(false);
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
//   useEffect(() => {
//     fetchCountries();
//     fetchDivisions();
//     fetchVisibleTotodata();
//     fetchsaleschannel();
//     fetchreplyToinfo();
//     // fetchSalesPersons();
//   }, []);

//   useEffect(() => {
//     if (selectedCountryId) {
//       fetchStates();
//     }
//   }, [selectedCountryId]);

//   const fetchCountries = async () => {
//     try {
//       setLoading(prev => ({ ...prev, countries: true }));

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

//       if (!response.ok)
//         throw new Error(`Network response was not ok: ${response.status}`);

//       const result = await response.json();
//       if (result.error)
//         throw new Error(result.error.message || 'Failed to fetch countries');

//       if (result.result) {
//         const countryList = result.result.map(item => ({
//           label: item.id.toString(),
//           value: item.name,
//         }));
//         setCountries(countryList);

//         if (
//           leadData?.country_id &&
//           !countryList.some(c => c.label === leadData.country_id.toString())
//         ) {
//           setCountries(prev => [
//             ...prev,
//             {
//               label: leadData.country_id.toString(),
//               value: leadData.country_name || 'Unknown Country',
//             },
//           ]);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching countries:', error);
//       Alert.alert('Error', error.message || 'Failed to fetch countries');
//     } finally {
//       setLoading(prev => ({ ...prev, countries: false }));
//     }
//   };

//   const fetchStates = async () => {
//     if (!selectedCountryId) return;

//     try {
//       setLoading(prev => ({ ...prev, states: true }));

//       const response = await fetch(stateUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {
//             country_id: parseInt(selectedCountryId),
//           },
//         }),
//       });

//       if (!response.ok)
//         throw new Error(`Network response was not ok: ${response.status}`);

//       const result = await response.json();
//       if (result.error)
//         throw new Error(result.error.message || 'Failed to fetch states');

//       if (result.result) {
//         const stateList = result.result.map(item => ({
//           label: item.id.toString(),
//           value: item.name,
//         }));
//         setStates(stateList);

//         // If leadData has state_id but it's not in the fetched list, add it
//         if (
//           leadData?.state_id &&
//           !stateList.some(s => s.label === leadData.state_id.toString())
//         ) {
//           setStates(prev => [
//             ...prev,
//             {
//               label: leadData.state_id.toString(),
//               value: leadData.state_name || 'Unknown State',
//             },
//           ]);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching states:', error);
//       Alert.alert('Error', error.message || 'Failed to fetch states');
//     } finally {
//       setLoading(prev => ({ ...prev, states: false }));
//     }
//   };
//   const fetchDivisions = async () => {
//     setLoading(prev => ({ ...prev, division: true }));
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
//       console.log(response, 'Responce------');
//       const devisionlist = response.result.map(item => ({
//         label: item.division_id.toString(),
//         value: item.division_name,
//       }));
//       setDevision(devisionlist || []);
//     } catch (error) {
//       console.error('Error fetching divisions:', error);
//       Alert.alert(
//         'Error',
//         error.response?.data?.error?.message || 'Failed to fetch divisions',
//       );
//     } finally {
//       setLoading(prev => ({ ...prev, division: false }));
//     }
//   };
//   const fetchassigntohandle = async divisionId => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchassigntodata,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           params: { division: Number(divisionId) },
//         },
//       );

//       const mappedData = response.result.map(assign => ({
//         label: assign.assign_name,
//         value: assign.assign_id.toString(),
//       }));

//       setassignToData(mappedData);

//       // Ensure selected value exists in fetched list
//       const exists = mappedData.find(
//         item => item.value === leadData?.assign_Id?.toString(),
//       );
//       if (exists) {
//         setseletedassigntoId(leadData.assign_Id.toString());
//       } else {
//         setseletedassigntoId(null);
//       }
//     } catch (error) {
//       console.error('Error fetching assign to data:', error);
//     }
//   };
//   const fetchsalespaersionInfo = async divisionId => {
//     try {
//       const responce = await makeApiCall(
//         server_origin,
//         urls.fetchLeadSalePerson,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           params: { division: Number(divisionId) },
//         },
//       );

//       const mappedData = responce.result.map(person => ({
//         label: person.person_name,
//         value: person.person_id.toString(), // make sure this is string
//       }));

//       setSalesPersons(mappedData);
//       setAccountHolder(mappedData);

//       // Optional: Preselect
//       const exists = mappedData.find(
//         item => item.value === leadData?.sales_person_id?.toString(),
//       );
//       if (exists) {
//         setSalesPersonId(leadData.sales_person_id.toString());
//       } else {
//         // setSalesPersonId(null);
//       }
//     } catch (error) {
//       console.log('Error fetching salespersons:', error);
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
//       console.log('VisibleToData', response);
//       if (response.result && response.result.length > 0) {
//         const visibleToOpTion = response.result.map(item => ({
//           label: item.visibleTo_name,
//           value: item.visibleTo_id,
//         }));
//         setVisibleToData(visibleToOpTion);
//         // setassignToData(responce?.result)
//       } else {
//         setVisibleToData([]);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (assisnToData.length > 0 && leadData?.assign_Id) {
//       const match = assisnToData.find(
//         item => item.value === leadData.assign_Id.toString(),
//       );
//       if (match) {
//         setseletedassigntoId(match.value);
//       }
//     }
//   }, [assisnToData]);

//   useEffect(() => {
//     if (salesPersons.length > 0 && leadData.sale_person_id) {
//       const match = salesPersons.find(
//         item => item.value === leadData.sale_person_id.toString(),
//       );
//       if (match) {
//         setSalesPersonId(match.value);
//       }
//     }
//     if (leadData.account_holder) {
//       const matchedAccount = salesPersons.find(
//         person => person.label === leadData.account_holder
//       );
//       if (matchedAccount) {
//         setSelectedAccountHolder(matchedAccount.value);
//         console.log('✅ Account holder pre-filled:', leadData.account_holder);
//       }
//     }
    
    
    
//   }, [salesPersons]);
//   useEffect(() => {
//     if (leadData?.visible_to && leadData.visible_to.length > 0) {
//       const ids = leadData.visible_to.map(item => item.id);
//       SetVisibleToId(ids);
//     }
//     if (leadData?.sale_channel) {
//       // console.log('Lead sale_channel:', JSON.stringify(leadData.sale_channel));

//       // console.log(
//       //   'Dropdown SalesChannel List:',
//       //   JSON.stringify(salesChannel, null, 2),
//       // );

//       const match = salesChannel.find(item => {
//         // console.log('Comparing:', item.label, '==', leadData.sale_channel);
//         return item.label.trim() === leadData.sale_channel.trim();
//       });

//       console.log('Matched Item:', match);
//       // setSalesChannel(match);
//       setselectedsaleschannels(match?.value);
//     }
//   }, [leadData, salesChannel]);

//   const handleCancel = () => {
//     console.log('Cancel clicked');
//     navigation.goBack();
//   };
//   useEffect(() => {
//     if (selectedDivision) {
//       console.log(
//         'Fetching assign and salesperson for division:',
//         selectedDivision,
//       );
//       fetchassigntohandle(selectedDivision);
//       fetchsalespaersionInfo(selectedDivision);
//     }
//   }, [selectedDivision]);

//   const isDarkMode = colorScheme === 'dark';
//   const styles = createStyles(isDarkMode);

//   return (
//     <>
//       <HeaderCompo
//         title={'Edit Leads'}
//         lefticon={require('../assets/back.png')}
//         onPress={() => navigation.goBack()}
//       />
//       <ScrollView
//         style={{
//           flex: 1,
//           backgroundColor: isDarkMode ? COLORS.black : COLORS.BACKGROUND,
//         }}>
//         <View style={styles.container}>
//           <View style={styles.buttonRow}></View>
//           <Text
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Lead
//           </Text>
//           <TextinputCompo
//             style={{ ...styles.input, backgroundColor: COLORS.white }}
//             value={name}
//             // editable={false}
//             onChangeText={setName}
//             placeholder="Enter lead name"
//             placeholderTextColor={COLORS.black}
//           />
//           <Text
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Prospect Name
//           </Text>
//           <TextinputCompo
//             style={{ ...styles.input, backgroundColor: COLORS.white }}
//             // value={name}
//             value={prospectName}
//             onChangeText={setProspectName}
//             placeholder="Enter prospect name"
//             placeholderTextColor={COLORS.black}
//           />
//           <Text
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Country
//           </Text>
//           <Dropdown
//             style={[styles.dropdown]}
//             placeholderStyle={[styles.placeholderStyle]}
//             selectedTextStyle={[styles.selectedTextStyle]}
//             inputSearchStyle={[styles.inputSearchStyle]}
//             itemTextStyle={{ color: COLORS.black }}
//             iconStyle={styles.iconStyle}
//             data={countries}
//             search
//             maxHeight={300}
//             labelField="value"
//             valueField="label"
//             placeholder={
//               loading.countries ? 'Loading countries...' : 'Select Country'
//             }
//             searchPlaceholder="Search..."
//             value={selectedCountryId}
//             onChange={item => {
//               setSelectedCountryId(item.label);
//               setSelectedStateId(null);
//             }}
//             disable={loading.countries}
//           />
//           <Text
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             State
//           </Text>
//           {/* State Dropdown */}
//           <Dropdown
//             style={[styles.dropdown]}
//             placeholderStyle={[styles.placeholderStyle]}
//             selectedTextStyle={[styles.selectedTextStyle]}
//             inputSearchStyle={[styles.inputSearchStyle]}
//             iconStyle={styles.iconStyle}
//             itemTextStyle={{ color: COLORS.black }}
//             data={states}
//             search
//             maxHeight={300}
//             labelField="value"
//             valueField="label"
//             placeholder={
//               loading.states
//                 ? 'Loading states...'
//                 : selectedCountryId
//                   ? 'Select State'
//                   : 'Select country first'
//             }
//             searchPlaceholder="Search..."
//             value={selectedStateId}
//             onChange={item => {
//               setSelectedStateId(item.label);
//             }}
//             disable={!selectedCountryId || loading.states}
//           />
//           <Text
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             City
//           </Text>
//           <TextinputCompo
//             style={styles.input}
//             value={city}
//             onChangeText={setcity}
//             placeholder="Enter city name"
//             placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
//           />
//           <Text
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Street
//           </Text>
//           <TextinputCompo
//             style={styles.input}
//             value={street}
//             onChangeText={setstreet}
//             placeholder="Enter Street name"
//             placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
//           />
//           <Text
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Account Holder
//           </Text>
//           <SingleDropdown
//             data={accountHolder}
//             value={selectedAccountHolder}
//             onChange={item => {
//               setSelectedAccountHolder(item.value);
//             }}
//             labelField="label"
//             valueField="value"
//             placeholder="account Holder"
//           />

//           <Text
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Sales channel
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
//           // value={salesPersonId}
//           // onChange={item => {
//           //   setSalesPersonId(item.value);
//           // }}
//           />
//           {user.result.is_management && (
//             <>
//               <Text
//                 style={{
//                   ...styles.normaltext,
//                   color: isDarkMode ? COLORS.white : COLORS.black,
//                 }}>
//                 Assign To
//               </Text>
//               <SingleDropdown
//                 data={assisnToData}
//                 value={slectdAssignToId}
//                 onChange={item => {
//                   setseletedassigntoId(item.value);
//                   setSalesPersonId(item.value);
//                 }}
//                 labelField="label"
//                 valueField="value"
//                 placeholder="assisn To Data"
//               />
//             </>
//           )}
//           <Text
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Contact
//           </Text>
//           <TextinputCompo
//             style={styles.input}
//             value={contact}
//             onChangeText={setContact}
//             placeholder="Enter contact name"
//             placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
//           />
//           <Text
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Email
//           </Text>
//           <TextinputCompo
//             style={styles.input}
//             value={email}
//             onChangeText={setEmail}
//             placeholder="Enter email"
//             placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
//             keyboardType="email-address"
//           />
//           <Text
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Phone
//           </Text>
//           {/* <Text style={styles.label}>Phone:</Text> */}
//           <TextinputCompo
//             style={styles.input}
//             value={phone}
//             onChangeText={setPhone}
//             placeholder="Enter phone number"
//             placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
//             keyboardType="phone-pad"
//             maxLength={10}
//           />
//           {/* <Text style={styles.label}>Contact:</Text> */}


//           <Text
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Job Position
//           </Text>
//           <TextinputCompo
//             style={styles.input}
//             value={jobposition}
//             onChangeText={setjobposition}
//             placeholder="Job Position"
//             placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
//           />
//           <Text
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Remark
//           </Text>
//           <TextinputCompo
//             style={styles.input}
//             value={remark}
//             onChangeText={setremark}
//             placeholder="Remark"
//             placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
//           />
//           {/* <TextinputCompo
//                 style={styles.input}
//                 value={street}
//                 onChangeText={setstreet}
//                 placeholder="Enter contact name"
//                 placeh
//                 olderTextColor={isDarkMode ? '#aaa' : '#555'}
//             /> */}
//           <Text
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Division
//           </Text>
//           <Dropdown
//             style={[styles.dropdown]}
//             placeholderStyle={[styles.placeholderStyle]}
//             selectedTextStyle={[styles.selectedTextStyle]}
//             inputSearchStyle={[styles.inputSearchStyle]}
//             data={division}
//             search
//             maxHeight={300}
//             labelField="value"
//             valueField="label"
//             // placeholder= selectedCountryId  : "Select Division"
//             placeholder={
//               loading.division ? 'Loading Division...' : 'Select Division'
//             }
//             searchPlaceholder="Search..."
//             value={selectedDivision}
//             itemTextStyle={{ color: COLORS.black }}
//             onChange={item => {
//               // setDevision(item.label);
//               setselectedDevision(item.label);
//               fetchassigntohandle(item.label);
//             }}
//           />
//           <Text
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Salesperson
//           </Text>
//           <SingleDropdown
//             data={salesPersons}
//             value={salesPersonId}
//             onChange={item => {
//               setSalesPersonId(item.value);
//             }}
//             labelField="label"
//             valueField="value"
//             placeholder="sales Persion"
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
//             style={{
//               ...styles.normaltext,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Visible To
//           </Text>
//       <DropdownCompo
//             data={visibleToData}
//             selectedValues={visibleToId}
//             onValueChange={items => {
//               SetVisibleToId(items);
//             }}
//             placeholder="Visible To Data"
//           />

//           <View style={styles.buttonRow}>
//             <ButtonCompo
//               title={'Cancel'}
//               onPress={handleCancel}
//               style={[{ width: '45%', backgroundColor: COLORS.RED }]}
//             />
//             {/* <TouchableOpacity
//                     style={[styles.actionButton, styles.cancelButton]}
//                     onPress={handleCancel}>
//                     <Text style={styles.buttonText}>Cancel</Text>
//                 </TouchableOpacity> */}
//             <ButtonCompo
//               title={'Save'}
//               style={[{ width: '45%' ,backgroundColor: COLORS.GREEN }]}
//               onPress={handleSave}
//             />
//             {/* <TouchableOpacity
//                     style={[styles.actionButton, styles.saveButton]}
//                     onPress={handleSave}>
//                     <Text style={styles.buttonText}>Save</Text>
//                 </TouchableOpacity> */}
//           </View>
//           <View style={styles.buttonRow}>
//             <ButtonCompo
//               title={'Internal Notes'}
//               onPress={() => setExtraInfo(!extraInfo)}
//               style={[{ width: '45%' }]}
//             />
//             {/* <TouchableOpacity
//                     style={[styles.actionButton, styles.cancelButton]}
//                     onPress={handleCancel}>
//                     <Text style={styles.buttonText}>Cancel</Text>
//                 </TouchableOpacity> */}
//             <ButtonCompo
//               title={'Remarks'}
//               style={[{ width: '45%' }]}
//               // onPress={() =>
//               //   navigation.navigate(navigationString.EDITLEADREMARK, {
//               //     remarks: leadData ?? [], // Safe handling
//               //   })
//               onPress={() =>
//                 navigation.navigate(navigationString.PREVIEWEDITREMARK, {
//                   // remarks: leadData ?? [], // Safe handling
//                   remarks: leadData ?? [],
//                 })
//               }
//             // onPress={() => setremarks(true)}
//             />

//             {/* <TouchableOpacity
//                     style={[styles.actionButton, styles.saveButton]}
//                     onPress={handleSave}>
//                     <Text style={styles.buttonText}>Save</Text>
//                 </TouchableOpacity> */}
//           </View>
//           <View style={styles.buttonRow}>
//             <ButtonCompo
//               title={'Extra info'}
//               style={[{ width: '45%' }]}
//               // style={[styles.actionButton, styles.saveButton]}
//               onPress={() =>
//                 navigation.navigate(navigationString.EXTRAINFO, {
//                   onSave: handleExtraInfoSave,
//                   leadData: leadData,
//                 })
//               }
//             />
//             <ButtonCompo
//               title={'Plan of Action'}
//               style={[{ width: '45%' }]}
//               // style={[styles.actionButton, styles.saveButton]}
//               onPress={() =>
//                 navigation.navigate('PlanOfAction', {
//                   id: leadData?.id,
//                 })
//               }
//             />
//           </View>
//           {extraInfo && (
//             <TextinputCompo
//               style={styles.input}
//               value={internalnotes}
//               onChangeText={text => setInternalnotes(text)}
//               placeholder="Enter Internal Notes "
//               placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
//             />
//           )}
//           {
//             // <>
//             //   <Text
//             //     style={[
//             //       styles.label,
//             //       isDarkMode ? styles.darkLabel : styles.lightLabel,
//             //     ]}>
//             //     Date
//             //   </Text>
//             //   <CalendarInput
//             //     value={dateValue}
//             //     onChange={setDateValue}
//             //     placeholder="Select Date"
//             //     styles={styles}
//             //     COLORS={COLORS}
//             //   />
//             //   <Text
//             //     style={[
//             //       styles.label,
//             //       isDarkMode ? styles.darkLabel : styles.lightLabel,
//             //     ]}>
//             //     Remarks
//             //   </Text>
//             //   <TextInput
//             //     style={[styles.input]}
//             //     placeholder="Remarks"
//             //     placeholderTextColor={COLORS.PLACEHOLDER}
//             //     value={remarkuser}
//             //     onChangeText={text => setremarkuser(text)}
//             //     multiline={true}
//             //   />
//             //   <Text
//             //     style={[
//             //       styles.label,
//             //       isDarkMode ? styles.darkLabel : styles.lightLabel,
//             //     ]}>
//             //     Reply To
//             //   </Text>
//             //   <SingleDropdown
//             //     data={replyTo}
//             //     value={selectedreplyTo}
//             //     placeholder="Reply To"
//             //     onChange={item => {
//             //       setselectedreplyTo(item.value);
//             //     }}
//             //   />
//             //   <Text
//             //     style={[
//             //       styles.label,
//             //       isDarkMode ? styles.darkLabel : styles.lightLabel,
//             //     ]}>
//             //     User
//             //   </Text>
//             //   <TextInput
//             //     style={[styles.input]}
//             //     placeholder="Created By"
//             //     placeholderTextColor={COLORS.PLACEHOLDER}
//             //     value={userinfo}
//             //     keyboardType="email-address"
//             //     onChangeText={text => {
//             //       setuserinfo(text);
//             //       // Clear contact name if email is deleted
//             //       // if (!text) setContactName('');
//             //     }}
//             //     editable={false}
//             //   />
//             // </>
//           }
//           <RemarkModal
//             isVisible={remaks}
//             onClose={handleRemarkClose}
//             data={leadData}
//             opp={'Opp'}
//           />
//         </View>
//         {/* <Loader loading={loader} />
//          */}
//         <Loader visible={loader} />
//       </ScrollView>
//     </>
//   );
// };

// const createStyles = isDarkMode =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 20,
//       backgroundColor: isDarkMode ? '#121212' : COLORS.BACKGROUND,
//     },
//     headerContainer: {
//       backgroundColor: 'blue',
//       alignItems: 'center',
//       paddingVertical: 10,
//     },
//     headerText: {
//       fontSize: 24,
//       color: 'white',
//       fontWeight: 'bold',
//     },
//     buttonRow: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       // marginVertical: 10,
//     },
//     actionButton: {
//       flex: 1,
//       marginHorizontal: 5,
//       paddingVertical: 10,
//       borderRadius: 5,
//       alignItems: 'center',
//     },
//     convertButton: {
//       backgroundColor: 'blue',
//     },
//     markLostButton: {
//       backgroundColor: 'blue',
//     },
//     cancelButton: {
//       backgroundColor: 'blue',
//     },
//     saveButton: {
//       backgroundColor: 'blue',
//     },
//     buttonText: {
//       color: 'white',
//       fontSize: 14,
//       fontWeight: 'bold',
//     },
//     label: {
//       fontSize: 16,
//       marginBottom: 5,
//       color: isDarkMode ? '#e0e0e0' : '#000',
//     },
//     input: {
//       height: 50,
//       borderColor: isDarkMode ? '#333' : '#ccc',
//       borderWidth: 1,
//       borderRadius: 5,
//       marginBottom: 15,
//       paddingHorizontal: 10,
//       color: '#000',
//       backgroundColor: '#fff',
//     },
//     dropdown: {
//       height: 50,
//       borderColor: 'gray',
//       borderWidth: 0.5,
//       borderRadius: 8,
//       paddingHorizontal: 8,
//       marginBottom: 16,
//       backgroundColor: COLORS.white,
//     },
//     darkDropdown: {
//       backgroundColor: '#1f1f1f',
//       borderColor: '#555',
//     },
//     placeholderStyle: {
//       fontSize: 16,
//       color: COLORS.black,
//     },
//     selectedTextStyle: {
//       fontSize: 16,
//       color: 'black',
//     },
//     normaltext: {
//       fontSize: 14,
//       fontWeight: '400',
//     },
//     darkText: {
//       color: COLORS.white,
//     },
//     inputSearchStyle: {
//       height: 40,
//       fontSize: 16,
//       color: 'black',
//       backgroundColor: 'white',
//     },
//     darkInput: {
//       color: 'white',
//       backgroundColor: '#444',
//     },
//     iconStyle: {
//       width: 20,
//       height: 20,
//     },
//     disabledDropdown: {
//       opacity: 0.5,
//     },
//   });

// export default EditLeads;

// // Jamshed start 


// EditLeads.jsx — World-Class Professional Refactor
// Author: Jamshed | Production-grade UI, Logic & Prefill Handling

import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';

import { AuthContext } from './Context';
import urls from '../../url';
import HeaderCompo from '../components/HeaderCompo';
import TextinputCompo from '../components/TextinputCompo';
import Loader from '../components/Loader';
import { showFlashMessage } from '../utils/fleshmessage';
import SingleDropdown from '../components/SingleDropdown';
import makeApiCall from '../utils/apiHelper';
import DropdownCompo from '../components/DropdownCompo';
import navigationString from '../route/navigationString';
import { COLORS } from '../styles/Colors';
import RemarkModal from '../components/RemarkModal';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const PALETTE = {
  blue:   '#007AFF',
  green:  '#34C759',
  red:    '#FF3B30',
  orange: '#FF9500',
  indigo: '#5856D6',
  teal:   '#30B0C7',
  gray:   '#6B7280',
};

const THEME = {
  light: {
    bg:          '#F0F4FB',
    card:        '#FFFFFF',
    cardBorder:  '#E8EDF5',
    text:        '#0F172A',
    label:       '#334155',
    subText:     '#64748B',
    inputBg:     '#F8FAFC',
    inputBorder: '#CBD5E1',
    inputText:   '#0F172A',
    placeholder: '#94A3B8',
    sectionBg:   '#EEF2FF',
    sectionText: '#4338CA',
    chipBg:      '#E0E7FF',
    chipText:    '#3730A3',
  },
  dark: {
    bg:          '#0A0D14',
    card:        '#141828',
    cardBorder:  '#1E2438',
    text:        '#F1F5FF',
    label:       '#CBD5E1',
    subText:     '#64748B',
    inputBg:     '#1A1F30',
    inputBorder: '#2D3548',
    inputText:   '#F1F5FF',
    placeholder: '#475569',
    sectionBg:   '#161B2E',
    sectionText: '#818CF8',
    chipBg:      '#1E2448',
    chipText:    '#A5B4FC',
  },
};

// ─── Validation ───────────────────────────────────────────────────────────────

const validateForm = ({ name, email, phone, contact,is_multidivision, division }) => {
  if (!name?.trim())    return 'Lead name is required.';
  // if (!email?.trim())   return 'Email is required.';
  // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
  // if (!phone?.trim())   return 'Phone number is required.';
  // if (!/^[0-9]{10}$/.test(phone)) return 'Enter a valid 10-digit phone number.';
  // if (!contact?.trim()) return 'Contact name is required.';
  if (is_multidivision && !division) return 'Please select a division.';
  return null;
};

// ─── Animation Wrapper ────────────────────────────────────────────────────────

const FadeSlideIn = ({ children, delay = 0 }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1, duration: 380, delay, useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
    }}>
      {children}
    </Animated.View>
  );
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

const SectionHeader = ({ title, icon, colors }) => (
  <View style={[ss.sectionHeader, { backgroundColor: colors.sectionBg }]}>
    <Text style={ss.sectionIcon}>{icon}</Text>
    <Text style={[ss.sectionTitle, { color: colors.sectionText }]}>{title}</Text>
  </View>
);

const FormLabel = ({ text, colors, required }) => (
  <Text style={[ss.label, { color: colors.label }]}>
    {text}{required && <Text style={{ color: PALETTE.red }}> *</Text>}
  </Text>
);

const StyledInput = ({ colors, style, ...props }) => (
  <TextinputCompo
    style={[ss.input, {
      backgroundColor: colors.inputBg,
      borderColor: colors.inputBorder,
      color: colors.inputText,
    }, style]}
    placeholderTextColor={colors.placeholder}
    {...props}
  />
);

const StyledDropdown = ({ colors, isLoading, ...props }) => (
  <View>
    <Dropdown
      style={[ss.dropdown, {
        backgroundColor: colors.inputBg,
        borderColor: colors.inputBorder,
        opacity: isLoading ? 0.55 : 1,
      }]}
      placeholderStyle={{ color: colors.placeholder, fontSize: 15 }}
      selectedTextStyle={{ color: colors.inputText, fontSize: 15 }}
      itemTextStyle={{ color: '#1A1D2E', fontWeight: '600', fontSize: 14 }}
      inputSearchStyle={{ color: '#1A1D2E', fontSize: 14, borderRadius: 8 }}
      containerStyle={{ borderRadius: 12, overflow: 'hidden' }}
      activeColor="#EEF2FF"
      search
      maxHeight={300}
      searchPlaceholder="Search…"
      disable={isLoading}
      {...props}
    />
    {isLoading && (
      <ActivityIndicator size="small" color={PALETTE.blue} style={ss.inlineLoader} />
    )}
  </View>
);

const PriorityStars = ({ value, onChange, colors }) => (
  <View style={ss.starsRow}>
    {[1, 2, 3].map((s) => (
      <TouchableOpacity key={s} onPress={() => onChange(value === s ? 0 : s)} activeOpacity={0.75}>
        <Text style={[ss.star, { color: s <= value ? '#FBBF24' : colors.inputBorder }]}>★</Text>
      </TouchableOpacity>
    ))}
    {value > 0 && (
      <>
        <TouchableOpacity
          onPress={() => onChange(0)}
          style={[ss.chip, { backgroundColor: colors.chipBg }]}>
          <Text style={[ss.chipText, { color: colors.chipText }]}>Clear</Text>
        </TouchableOpacity>
        <View style={[ss.chip, {
          backgroundColor: value === 3 ? '#FEF3C7' : value === 2 ? '#FEE2E2' : '#F0FDF4',
        }]}>
          <Text style={[ss.chipText, {
            color: value === 3 ? '#92400E' : value === 2 ? '#991B1B' : '#166534',
          }]}>
            {value === 1 ? 'Low' : value === 2 ? 'Medium' : 'High'}
          </Text>
        </View>
      </>
    )}
  </View>
);

const ToggleCard = ({ label, icon, active, onPress, colors }) => (
  <TouchableOpacity
    style={[ss.toggleCard, {
      backgroundColor: active ? PALETTE.blue : colors.card,
      borderColor: active ? PALETTE.blue : colors.cardBorder,
    }]}
    onPress={onPress}
    activeOpacity={0.8}>
    <Text style={ss.toggleIcon}>{icon}</Text>
    <Text style={[ss.toggleLabel, { color: active ? '#fff' : colors.subText }]}>{label}</Text>
    <Text style={[ss.toggleChevron, { color: active ? '#fff' : colors.inputBorder }]}>
      {active ? '▾' : '▸'}
    </Text>
  </TouchableOpacity>
);

const ActionBtn = ({ label, color, onPress, flex = 1 }) => (
  <TouchableOpacity style={[ss.actionBtn, { backgroundColor: color, flex }]} onPress={onPress} activeOpacity={0.85}>
    <Text style={ss.actionBtnText}>{label}</Text>
  </TouchableOpacity>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const EditLeads = ({ route, navigation }) => {
  const { leadData } = route.params;
  console.log(leadData);

  const user         = useSelector((s) => s.user.userDatainfo);
  const resUser      = user?.result?.res_user;
  const isManagement = user?.result?.is_management;
  const { currentUrl: server_origin } = useContext(AuthContext);

  const colorScheme = useColorScheme();
  const colors      = THEME[colorScheme === 'dark' ? 'dark' : 'light'];

  // ── Form State (prefilled) ────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name:          leadData?.name          || '',
    prospectName:  leadData?.Prospect_name || '',
    email:         leadData?.email         || '',
    phone:         leadData?.phone         || '',
    contact:       leadData?.contact       || '',
    city:          leadData?.city          || '',
    street:        leadData?.street        || '',
    street2:       leadData?.street2       || '',
    zip:           leadData?.zip           || '',
    jobPosition:   leadData?.job_position  || '',
    remark:        leadData?.remarks       || '',
    internalNotes: leadData?.description   || '',
    priority:      leadData?.priority      || 0,
  });
  const setField = useCallback((k, v) => setForm((p) => ({ ...p, [k]: v })), []);

  // ── Prefilled dropdown selections ─────────────────────────────────────────────
  const [selectedCountryId,     setSelectedCountryId]     = useState(leadData?.country_id?.toString()  || null);
  const [selectedStateId,       setSelectedStateId]       = useState(leadData?.state_id?.toString()    || null);
  const [selectedDivisionId,    setSelectedDivisionId]    = useState(leadData?.division_id?.toString() || null);
  const [salesPersonId,         setSalesPersonId]         = useState(null);
  const [selectedAccountHolder, setSelectedAccountHolder] = useState(0);
  const [assignToId,            setAssignToId]            = useState(null);
  const [selectedSalesChannel,  setSelectedSalesChannel]  = useState(null);
  const [visibleToId,           setVisibleToId]           = useState([]);

  // ── Dropdown Data ─────────────────────────────────────────────────────────────
  const [countries,      setCountries]      = useState([]);
  const [states,         setStates]         = useState([]);
  const [divisions,      setDivisions]      = useState([]);
  const [salesPersons,   setSalesPersons]   = useState([]);
  const [accountHolders, setAccountHolders] = useState([]);
  const [assignToData,   setAssignToData]   = useState([]);
  const [visibleToData,  setVisibleToData]  = useState([]);
  const [salesChannels,  setSalesChannels]  = useState([]);

  // ── Per-field Loading ─────────────────────────────────────────────────────────
  const [loadingMap, setLoadingMap] = useState({
    countries: false, states: false, divisions: false,
    salesPersons: false, assignTo: false,
  });
  const setLoading = useCallback((k, v) => setLoadingMap((p) => ({ ...p, [k]: v })), []);

  // ── UI State ──────────────────────────────────────────────────────────────────
  const [loader,            setLoader]            = useState(false);
  const [showInternalNotes, setShowInternalNotes] = useState(false);
  const [showRemarkModal,   setShowRemarkModal]   = useState(false);
  const [extraInfoData,     setExtraInfoData]     = useState({
    medium_id:         leadData?.medium_id,
    source_id:         leadData?.source_id,
    query_raised_date: leadData?.date_open,
    query_closed_date: leadData?.date_closed,
    referred_by:       leadData?.referred,
    probability:       leadData?.probability || 0,
    campaign_id:       leadData?.campaign_id,
  });

  // ── Generic API Helper ────────────────────────────────────────────────────────
  const apiPost = useCallback(async (urlKey, params) =>
    await makeApiCall(server_origin, urlKey, 'POST', {
      jsonrpc: '2.0', method: 'call', params,
    }), [server_origin]);

  // ── Fetchers ──────────────────────────────────────────────────────────────────

  const fetchCountries = useCallback(async () => {
    setLoading('countries', true);
    try {
      const res  = await apiPost(urls.fetchCountryUrl, {});
      const list = (res?.result || []).map((i) => ({ label: i.id.toString(), value: i.name }));
      // ✅ Guarantee prefilled country is in list
      if (leadData?.country_id && !list.some((c) => c.label === leadData.country_id.toString())) {
        list.push({ label: leadData.country_id.toString(), value: leadData.country_name || 'Unknown Country' });
      }
      setCountries(list);
    } catch (e) { console.error('[EditLeads] fetchCountries:', e); }
    finally     { setLoading('countries', false); }
  }, [apiPost, leadData]);

  // const fetchStates = useCallback(async (countryId) => {
  //   if (!countryId) return;
  //   setLoading('states', true);
  //   try {
  //     const res  = await apiPost(urls.fetchStatesUrl, { country_id: parseInt(countryId) });
  //     const list = (res?.result || []).map((i) => ({ label: i.id.toString(), value: i.name }));
  //     // ✅ Guarantee prefilled state is in list
  //     if (leadData?.state_id && !list.some((s) => s.label === leadData.state_id.toString())) {
  //       list.push({ label: leadData.state_id.toString(), value: leadData.state_name || 'Unknown State' });
  //     }
  //     setStates(list);
  //   } catch (e) { console.error('[EditLeads] fetchStates:', e); }
  //   finally     { setLoading('states', false); }
  // }, [apiPost, leadData]);


  const fetchStates = useCallback(async (countryId) => {
  if (!countryId) return;

  setLoading('states', true);
  try {
    const res = await apiPost(urls.fetchStatesUrl, {
      country_id: parseInt(countryId),
    });

    // console.log("States API Response:", res); // 🔍 debug

    const result = res?.result;

    // ✅ ensure array
    if (!Array.isArray(result)) {
      console.warn("States is not array:", result);
      setStates([]);
      return;
    }

    const list = result.map((i) => ({
      label: i.id.toString(),
      value: i.name,
    }));

    // ✅ Prefill safe
    if (
      leadData?.state_id &&
      !list.some((s) => s.label === leadData.state_id.toString())
    ) {
      list.push({
        label: leadData.state_id.toString(),
        value: leadData.state_name || 'Unknown State',
      });
    }

    setStates(list);

  } catch (e) {
    console.error('[EditLeads] fetchStates:', e);
    setStates([]); // ✅ fallback
  } finally {
    setLoading('states', false);
  }
}, [apiPost, leadData]);
  const fetchDivisions = useCallback(async () => {
    setLoading('divisions', true);
    try {
      const res  = await apiPost(urls.fetchleadsDivision, { resUser });
      setDivisions((res?.result || []).map((i) => ({
        label: i.division_id.toString(), value: i.division_name,
      })));
    } catch (e) { console.error('[EditLeads] fetchDivisions:', e); }
    finally     { setLoading('divisions', false); }
  }, [apiPost, resUser]);

  const fetchSalesPersons = useCallback(async (divId) => {
    if (!divId) return;
    setLoading('salesPersons', true);
    try {
      const res  = await apiPost(urls.fetchLeadSalePerson, { division: Number(divId) });
      const list = (res?.result || []).map((p) => ({
        label: p.person_name, value: p.person_id.toString(),
      }));
      setSalesPersons(list);
      setAccountHolders(list);

      // ✅ Prefill Sales Person by ID
      const sp = list.find((p) => p.value === leadData?.sale_person_id?.toString());
      setSalesPersonId(sp?.value ?? null);

      // ✅ Prefill Account Holder by name (server stores name, not ID)
      const ah = list.find((p) => p.label === leadData?.account_holder);
      setSelectedAccountHolder(ah?.value ?? 0);
    } catch (e) { console.error('[EditLeads] fetchSalesPersons:', e); }
    finally     { setLoading('salesPersons', false); }
  }, [apiPost, leadData]);

  const fetchAssignTo = useCallback(async (divId) => {
    if (!divId) return;
    setLoading('assignTo', true);
    try {
      const res  = await apiPost(urls.fetchassigntodata, { division: Number(divId) });
      const list = (res?.result || []).map((a) => ({
        label: a.assign_name, value: a.assign_id.toString(),
      }));
      setAssignToData(list);
      // ✅ Prefill Assign To by ID
      const match = list.find((a) => a.value === leadData?.assign_Id?.toString());
      setAssignToId(match?.value ?? null);
    } catch (e) { console.error('[EditLeads] fetchAssignTo:', e); }
    finally     { setLoading('assignTo', false); }
  }, [apiPost, leadData]);

  const fetchSalesChannels = useCallback(async () => {
    try {
      const res  = await apiPost(urls.fetchsaleschannels, { resUser });
      const list = (res?.result || []).map((i) => ({
        label: i.channel_name, value: i.channel_id,
      }));
      setSalesChannels(list);
      // ✅ Prefill Sales Channel by name match
      if (leadData?.sale_channel) {
        const match = list.find((i) => i.label?.trim() === leadData.sale_channel?.trim());
        setSelectedSalesChannel(match?.value ?? null);
      }
    } catch (e) { console.error('[EditLeads] fetchSalesChannels:', e); }
  }, [apiPost, resUser, leadData]);

  const fetchVisibleTo = useCallback(async () => {
    try {
      const res  = await apiPost(urls.fetchVisibletodata, {});
      const list = (res?.result || []).map((i) => ({
        label: i.visibleTo_name, value: i.visibleTo_id,
      }));
      setVisibleToData(list);
      // ✅ Prefill Visible To IDs
      if (leadData?.visible_to?.length) {
        setVisibleToId(leadData.visible_to.map((i) => i.id));
      }
    } catch (e) { console.error('[EditLeads] fetchVisibleTo:', e); }
  }, [apiPost, leadData]);

  // ── Lifecycle ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchCountries();
    fetchDivisions();
    fetchSalesChannels();
    fetchVisibleTo();
  }, []);

  useEffect(() => { if (selectedCountryId)  fetchStates(selectedCountryId);                          }, [selectedCountryId]);
  useEffect(() => { if (selectedDivisionId) { fetchSalesPersons(selectedDivisionId); fetchAssignTo(selectedDivisionId); } }, [selectedDivisionId]);

  // ── Save ──────────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    const err = validateForm(form);
    if (err) { Alert.alert('Validation Error', err); return; }

    const payload = {
      id:               leadData.id,
      name:             form.name,
      email:            form.email,
      phone:            form.phone,
      contact_name:     form.contact,
      city:             form.city,
      street:           form.street,
      street2:          form.street2,
      zip:             form.zip,
      partner_name:     form.prospectName,
      country_id:       selectedCountryId      ? parseInt(selectedCountryId)      : null,
      state_id:         selectedStateId        ? parseInt(selectedStateId)        : null,
      division:         selectedDivisionId?.toString(),
      visible_To_Users: visibleToId,
      assignTo_Id:      assignToId             ? parseInt(assignToId)             : null,
      sale_person_id:   salesPersonId          ? parseInt(salesPersonId)          : null,
      // account_holder:   selectedAccountHolder  ? parseInt(selectedAccountHolder)  : null,
      account_holder:
  selectedAccountHolder !== null && selectedAccountHolder !== undefined
    ? Number(selectedAccountHolder)
    : null,
      sales_channel:    selectedSalesChannel,
      job_position:     form.jobPosition,
      remark:           form.remark,
      priority:         [form.priority],
      extraInfo:        extraInfoData,
      internal_notes:   form.internalNotes,
    };

    setLoader(true);
    try {
      console.log(payload,'payload,payload,payload')
      const res = await fetch(server_origin + urls.editLead, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'call', params: payload }),
      });
     
      if (!res.ok) throw new Error(`Network error: ${res.status}`);

      const result = await res.json();
      console.log(result,'RESPONCE---')
      if (result?.result?.success === true) {
        showFlashMessage({ message: result.result.message || 'Lead updated successfully', type: 'success', duration: 3000 });
        navigation.pop(2);
      } else {
        Alert.alert('Update Failed', result?.result?.message || 'Unable to update lead.');
      }
    } catch (e) {
      console.error('[EditLeads] handleSave:', e);
      showFlashMessage({ message: 'Failed to update lead', type: 'danger', duration: 3000 });
      Alert.alert('Error', e?.message || 'Failed to update lead');
    } finally {
      setLoader(false);
    }
  }, [form, selectedCountryId, selectedStateId, selectedDivisionId, salesPersonId,
      selectedAccountHolder, assignToId, selectedSalesChannel, visibleToId,
      extraInfoData, leadData, server_origin, navigation]);

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <HeaderCompo
        title="Edit Lead"
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[ss.scroll, { backgroundColor: colors.bg }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── Basic Information ──────────────────────────────── */}
        <FadeSlideIn delay={0}>
          {/* <SectionHeader title="Basic Information" icon="👤" colors={colors} /> */}
          <View style={[ss.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <FormLabel text="Lead Name"     colors={colors} required />
            <StyledInput colors={colors} value={form.name}         onChangeText={(v) => setField('name', v)}         placeholder="Enter lead name" />

            <FormLabel text="Prospect Name" colors={colors} />
            <StyledInput colors={colors} value={form.prospectName} onChangeText={(v) => setField('prospectName', v)} placeholder="Enter prospect name" />

         
          </View>
        </FadeSlideIn>

        {/* ── Address ───────────────────────────────────────── */}
        <FadeSlideIn delay={60}>
          {/* <SectionHeader title="Address" icon="📍" colors={colors} /> */}
          <View style={[ss.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <FormLabel text="Country" colors={colors} />
            <StyledDropdown
              colors={colors}
              isLoading={loadingMap.countries}
              data={countries}
              labelField="value" valueField="label"
              placeholder={loadingMap.countries ? 'Loading countries…' : 'Select Country'}
              value={selectedCountryId}
              onChange={(item) => { setSelectedCountryId(item.label); setSelectedStateId(null); setStates([]); }}
            />

            <FormLabel text="State" colors={colors} />
            <StyledDropdown
              colors={colors}
              isLoading={loadingMap.states}
              data={states}
              labelField="value" valueField="label"
              placeholder={loadingMap.states ? 'Loading states…' : !selectedCountryId ? 'Select a country first' : 'Select State'}
              value={selectedStateId}
              onChange={(item) => setSelectedStateId(item.label)}
              disable={!selectedCountryId || loadingMap.states}
            />

            <View style={ss.row}>
              <View style={ss.half}>
                <FormLabel text="City" colors={colors} />
                <StyledInput colors={colors} value={form.city}   onChangeText={(v) => setField('city', v)}   placeholder="City" />
              </View>
              <View style={[ss.half, { marginLeft: 10 }]}>
                <FormLabel text="Street" colors={colors} />
                <StyledInput colors={colors} value={form.street} onChangeText={(v) => setField('street', v)} placeholder="Street" />
              </View>
            </View>
            <View style={ss.row}>
              <View style={ss.half}>
                <FormLabel text="Street2" colors={colors} />
                <StyledInput colors={colors} value={form.street2} onChangeText={(v) => setField('street2', v)} placeholder="Street2" />
              </View>
              <View style={[ss.half, { marginLeft: 10 }]}>
                <FormLabel text="Zip" colors={colors} />
                <StyledInput colors={colors} value={form.zip} onChangeText={(v) => setField('zip', v)} placeholder="Zip" />
              </View>
            </View>
          </View>
        </FadeSlideIn>

        {/* ── Sales & Division ──────────────────────────────── */}
        <FadeSlideIn delay={120}>
          {/* <SectionHeader title="Sales & Division" icon="💼" colors={colors} /> */}
          <View style={[ss.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <FormLabel text="Division" colors={colors}  required/>
            <StyledDropdown
              colors={colors}
              isLoading={loadingMap.divisions}
              data={divisions}
              labelField="value" valueField="label"
              placeholder={loadingMap.divisions ? 'Loading divisions…' : 'Select Division'}
              value={selectedDivisionId}
              onChange={(item) => setSelectedDivisionId(item.label)}
            />

            {isManagement && (
              <>
                <FormLabel text="Assign To" colors={colors} />
                <SingleDropdown
                  data={assignToData}
                  value={assignToId}
                  labelField="label" valueField="value"
                  placeholder={loadingMap.assignTo ? 'Loading…' : 'Select Assign To'}
                  onChange={(item) => { setAssignToId(item.value); setSalesPersonId(item.value); }}
                />
              </>
            )}

            <FormLabel text="Sales Person" colors={colors} />
            <SingleDropdown
              data={salesPersons}
              value={salesPersonId}
              labelField="label" valueField="value"
              placeholder={loadingMap.salesPersons ? 'Loading…' : 'Select Sales Person'}
              onChange={(item) => setSalesPersonId(item.value)}
            />

            <FormLabel text="Account Holder" colors={colors} />
            <SingleDropdown
              data={accountHolders}
              value={selectedAccountHolder}
              labelField="label" valueField="value"
              placeholder={loadingMap.salesPersons ? 'Loading…' : 'Select Account Holder'}
              onChange={(item) => setSelectedAccountHolder(item.value)}
            />

            <FormLabel text="Sales Channel" colors={colors} />
            <SingleDropdown
              data={salesChannels}
              value={selectedSalesChannel}
              labelField="label" valueField="value"
              placeholder="Select Sales Channel"
              onChange={(item) => setSelectedSalesChannel(item.value)}
            />
          </View>
        </FadeSlideIn>

        {/* ── Details ───────────────────────────────────────── */}
        <FadeSlideIn delay={180}>
          {/* <SectionHeader title="Details" icon="📋" colors={colors} /> */}
          <View style={[ss.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
               <FormLabel text="Email"         colors={colors}  />
            <StyledInput colors={colors} value={form.email}        onChangeText={(v) => setField('email', v)}        placeholder="Enter email address" keyboardType="email-address" autoCapitalize="none" />

            <FormLabel text="Phone"         colors={colors}  />
            <StyledInput colors={colors} value={form.phone}        onChangeText={(v) => setField('phone', v)}        placeholder="10-digit phone number" keyboardType="phone-pad" maxLength={10} />

            <FormLabel text="Contact Name"  colors={colors}  />
            <StyledInput colors={colors} value={form.contact}      onChangeText={(v) => setField('contact', v)}      placeholder="Enter contact name" />
            <FormLabel text="Job Position" colors={colors} />
            <StyledInput colors={colors} value={form.jobPosition} onChangeText={(v) => setField('jobPosition', v)} placeholder="Enter job position" />

            <FormLabel text="Remark" colors={colors} />
            <StyledInput
              colors={colors}
              value={form.remark}
              onChangeText={(v) => setField('remark', v)}
              placeholder="Enter remark…"
              multiline
              style={{ minHeight: 72, textAlignVertical: 'top', paddingTop: 10 }}
            />

            <FormLabel text="Priority" colors={colors} />
            <PriorityStars value={form.priority} onChange={(v) => setField('priority', v)} colors={colors} />

            <FormLabel text="Visible To" colors={colors} />
            <DropdownCompo
              data={visibleToData}
              selectedValues={visibleToId}
              onValueChange={setVisibleToId}
              placeholder="Select Visible To"
            />
          </View>
        </FadeSlideIn>

        {/* ── Internal Notes Toggle ─────────────────────────── */}
        <FadeSlideIn delay={220}>
          <View style={ss.toggleRow}>
            <ToggleCard label="Internal Notes" icon="🗒" active={showInternalNotes} onPress={() => setShowInternalNotes((p) => !p)} colors={colors} />
          </View>
          {showInternalNotes && (
            <View style={[ss.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <FormLabel text="Internal Notes" colors={colors} />
              <StyledInput
                colors={colors}
                value={form.internalNotes}
                onChangeText={(v) => setField('internalNotes', v)}
                placeholder="Enter internal notes…"
                multiline
                style={{ minHeight: 110, textAlignVertical: 'top', paddingTop: 10 }}
              />
            </View>
          )}
        </FadeSlideIn>

        {/* ── Actions ───────────────────────────────────────── */}
        <FadeSlideIn delay={260}>
          <View style={ss.primaryRow}>
            <ActionBtn label="✓  Save Lead" color={PALETTE.green} onPress={handleSave} />
            <ActionBtn label="✕  Cancel"    color={PALETTE.red}   onPress={() => navigation.goBack()} />
          </View>
          <View style={ss.secondaryRow}>
            <ActionBtn label="📝 Remarks"  color={PALETTE.indigo} onPress={() => navigation.navigate(navigationString.PREVIEWEDITREMARK, { remarks: leadData ?? [] })} />
            <ActionBtn label="  Extra info"    color={PALETTE.teal}   onPress={() => navigation.navigate(navigationString.EXTRAINFO, { onSave: setExtraInfoData, leadData })} />
            <ActionBtn label="📋 Plan Of Action"     color={PALETTE.orange} onPress={() => navigation.navigate('PlanOfAction', { id: leadData?.id })} />
          </View>
        </FadeSlideIn>

        {/* ── Modals ────────────────────────────────────────── */}
        <Loader visible={loader} text="Updating lead…" />
        <RemarkModal
          isVisible={showRemarkModal}
          onClose={(data) => { setShowRemarkModal(false); }}
          data={leadData}
          opp="Opp"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const ss = StyleSheet.create({
  scroll: { paddingBottom: 52 },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    marginTop: 20, marginBottom: 2, gap: 8,
  },
  sectionIcon:  { fontSize: 15 },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.1, textTransform: 'uppercase' },

  card: {
    marginHorizontal: 12, borderRadius: 16, padding: 16,
    borderWidth: 1, marginBottom: 4,
    elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6,
  },

  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 8, letterSpacing: 0.1 },

  input: {
    borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, marginBottom: 4,
  },

  dropdown: {
    height: 48, borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 12, marginBottom: 4,
  },
  inlineLoader: { position: 'absolute', right: 40, top: 13 },

  row:  { flexDirection: 'row' },
  half: { flex: 1 },

  starsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 4, flexWrap: 'wrap' },
  star:     { fontSize: 30 },
  chip:     { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  chipText: { fontSize: 12, fontWeight: '700' },

  toggleRow: { flexDirection: 'row', gap: 10, marginHorizontal: 12, marginTop: 18, marginBottom: 4 },
  toggleCard: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    paddingVertical: 13, paddingHorizontal: 14,
    borderRadius: 12, borderWidth: 1, gap: 8,
  },
  toggleIcon:    { fontSize: 16 },
  toggleLabel:   { flex: 1, fontSize: 13, fontWeight: '700' },
  toggleChevron: { fontSize: 13, fontWeight: '700' },

  primaryRow:   { flexDirection: 'row', marginHorizontal: 12, marginTop: 20, gap: 10 },
  secondaryRow: { flexDirection: 'row', marginHorizontal: 12, marginTop: 10, gap: 8 },

  actionBtn: {
    paddingVertical: 14, borderRadius: 12, alignItems: 'center',
    elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6,
  },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 13, letterSpacing: 0.3 },
});

export default EditLeads;
// Jamshed end — World-Class Professional Refactor