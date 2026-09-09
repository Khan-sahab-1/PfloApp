// // OpportunityForm.js
// // Jamshed start
// import React, {useEffect, useState, useContext} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Alert,
//   ScrollView,
//   useColorScheme,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import {AuthContext} from './Context';
// import urls from '../../url';
// import makeApiCall from '../utils/apiHelper';
// import SingleDropdown from '../components/SingleDropdown';
// import HeaderCompo from '../components/HeaderCompo';
// import ButtonCompo from '../components/ButtonCompo';
// import Loader from '../components/Loader';
// import {showFlashMessage} from '../utils/fleshmessage';
// import {useSelector} from 'react-redux';
// import TextinputCompo from '../components/TextinputCompo';
// import {COLORS} from '../styles/Colors';
// import MultiselectorDropDown from '../components/MultiselectorDropDown';
// import Remark from '../components/Modaals/Remark';
// import ContactInformation from '../components/Modaals/ContactInformation';
// import navigationString from '../route/navigationString';
// import CalendarInput from '../components/CalendarInput';

// const OpportunityForm = ({route, navigation}) => {
//   const employeeCode = route?.params?.employeeCode || '';
//   const user = useSelector(state => state.user.userDatainfo);

//   // form state
//   const [opportunityName, setOpportunityName] = useState('');
//   const [prospectName, setProspectName] = useState('');
//   const [expectedRevenue, setExpectedRevenue] = useState('');
//   const [probability, setProbability] = useState('');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [remark, setRemark] = useState('');
//   const [priority, setPriority] = useState(0);
//   const [tabinternal, settabinternal] = useState('');

//   // dropdown/state lists
//   const [divisionOptions, setDivisionOptions] = useState([]);
//   const [selectedDivisionId, setSelectedDivisionId] = useState(null);

//   const [salesPersons, setSalesPersons] = useState([]);
//   const [salesPersonId, setSalesPersonId] = useState(null);
//   const [selectedSalesPersonLabel, setSelectedSalesPersonLabel] = useState('');

//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomerId, setSelectedCustomerId] = useState(null);

//   const [assignToData, setAssignToData] = useState([]);
//   const [assignToId, setAssignToId] = useState(null);

//   const [visibleToData, setVisibleToData] = useState([]);
//   const [visibleToId, setVisibleToId] = useState([]);

//   const [accountHolderName, setAccountHolderName] = useState('');
//   const [accountHolderId, setAccountHolderId] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [openRemarkModal, setOpenRemarkModal] = useState(false);
//   const [openContactModal, setOpenContactModal] = useState(false);
//   const [internalNotes, setInternalNotes] = useState('');
//   const [extraInfoData, setExtraInfoData] = useState({});
//   const [tabremarks, settabremarks] = useState({});
//   const [taglist, settaglist] = useState([]);
//   const [selectdetaglist, setselectedtaglist] = useState(null);
//   const toDay = new Date().toISOString().split('T')[0];
//   const [querycloseddate, setquerycloseddate] = useState(toDay || '');

//   const is_multidivision = route?.params?.is_multidivision || false;
//   const resUser = route?.params?.resUser?.res_user || '';

//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const createOpportunityUrl = server_origin + urls.createOpportunity;
//   const fetchDivisionUrl = server_origin + urls.fetchOpportunityDivision;
//   const salesPersonsUrl = server_origin + urls.fetchLeadSalePerson;

//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';
//   console.log(extraInfoData, 'woowowowomil gyajii');

//   // --- Fetch divisions & visibleTo on mount (only once) ---
//   useEffect(() => {
//     fetchDivisionData();
//     fetchVisibleToData();
//     fetchtaginfo();
//   }, []);

//   const handleExtraInfoSave = data => {
//     // console.log('🌟 Data Received from Extra Info:', data);
//     setExtraInfoData(data);
//   };
//   // --- when division changes, fetch salespersons & assignto ---
//   useEffect(() => {
//     if (selectedDivisionId) {
//       fetchSalesPersons(selectedDivisionId);
//       fetchAssignTo(selectedDivisionId);
//     }
//   }, [selectedDivisionId]);

//   // --- when salesPersons list is loaded, auto-select if resUser matches ---
//   useEffect(() => {
//     if (!salesPersons || salesPersons.length === 0) return;

//     // prepare dropdown options
//     const dropdownOptions = salesPersons.map(p => ({
//       label: p.person_name?.trim(),
//       value: String(p.person_id),
//     }));

//     if (resUser) {
//       const matched = dropdownOptions.find(
//         p => String(p.value) === String(resUser),
//       );
//       if (matched) {
//         setSelectedSalesPersonLabel(matched.label);
//         setSalesPersonId(matched.value);
//         fetchCustomersData(matched.value);
//       }
//     }
//     // otherwise leave selection empty
//   }, [salesPersons, resUser]);

//   // --- when customer changes, fetch account holder ---
//   useEffect(() => {
//     if (selectedCustomerId && selectedDivisionId) {
//       fetchAccountHolder(selectedCustomerId, selectedDivisionId);
//     }
//   }, [selectedCustomerId, selectedDivisionId]);

//   // ---------- API helpers ----------
//   const fetchDivisionData = async () => {
//     try {
//       const response = await fetch(fetchDivisionUrl, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {resUser},
//         }),
//       });
//       if (!response.ok) throw new Error('Failed to fetch divisions');
//       const result = await response.json();
//       const opt = (result.result || []).map(div => ({
//         label: div.division_name,
//         value: div.division_id,
//       }));
//       setDivisionOptions(opt);
//       // if route provided a selectedDivisionId, set it
//       if (route?.params?.selectedDivisionId) {
//         setSelectedDivisionId(route.params.selectedDivisionId);
//       }
//     } catch (err) {
//       console.error('fetchDivisionData error', err);
//       Alert.alert('Error', 'Failed to load divisions');
//     }
//   };

//   const fetchSalesPersons = async divisionId => {
//     try {
//       const response = await fetch(salesPersonsUrl, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {division: divisionId, empCode: employeeCode},
//         }),
//       });
//       if (!response.ok) throw new Error('Network response not ok');
//       const result = await response.json();
//       setSalesPersons(result.result || []);
//     } catch (err) {
//       console.error('fetchSalesPersons error', err);
//       Alert.alert('Error', 'Failed to load sales persons');
//       setSalesPersons([]);
//     }
//   };

//   const fetchCustomersData = async salesPersonId => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchcustomerUrl,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {salesPerson: Number(salesPersonId)},
//         },
//       );
//       if (response && response.result) {
//         const list = (response.result || []).map(item => ({
//           label: item.customer_name,
//           value: item.customer_id,
//         }));
//         setCustomers(list);
//       } else {
//         setCustomers([]);
//       }
//     } catch (err) {
//       console.error('fetchCustomersData error', err);
//       setCustomers([]);
//     }
//   };

//   const fetchAccountHolder = async (customerId, divisionId) => {
//     try {
//       const payload = {
//         selected_customerId: customerId,
//         division: parseInt(divisionId, 10),
//       };
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchAccountHolder,
//         'POST',
//         {jsonrpc: '2.0', method: 'call', params: payload},
//       );
//       if (response?.result && response.result.length > 0) {
//         setAccountHolderName(response.result[0].account_holder_name);
//         setAccountHolderId(response.result[0].account_holder_id);
//       } else {
//         setAccountHolderName('');
//         setAccountHolderId(null);
//       }
//     } catch (err) {
//       console.error('fetchAccountHolder error', err);
//     }
//   };

//   const fetchVisibleToData = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchVisibletodata,
//         'POST',
//         {jsonrpc: '2.0', method: 'call', params: {}},
//       );
//       if (response?.result) {
//         const list = response.result.map(i => ({
//           label: i.visibleTo_name,
//           value: String(i.visibleTo_id),
//         }));
//         setVisibleToData(list);
//       } else {
//         setVisibleToData([]);
//       }
//     } catch (err) {
//       console.error('fetchVisibleToData error', err);
//       setVisibleToData([]);
//     }
//   };

//   const fetchAssignTo = async divisionId => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchassigntodata,
//         'POST',
//         {jsonrpc: '2.0', params: {division: divisionId}},
//       );
//       if (response?.result) {
//         const list = response.result.map(a => ({
//           label: a.assign_name,
//           value: String(a.assign_id),
//         }));
//         setAssignToData(list);
//       } else {
//         setAssignToData([]);
//       }
//     } catch (err) {
//       console.error('fetchAssignTo error', err);
//       setAssignToData([]);
//     }
//   };
//   const fetchtaginfo = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchtagsdata,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {resUser},
//         },
//       );
//       console.log(response, 'fetchtaginfo');

//       const tagInfoData = response.result.map(item => ({
//         label: item.tag_name,
//         value: item.tag_id,
//       }));
//       settaglist(tagInfoData);
//     } catch (error) {
//       console.log(error, 'Error fetching fetchtaginfo info');
//     }
//   };

//   // ---------- Form submit ----------
//   const validateMobileNumber = number => {
//     const mobilePattern = /^[0-9]{10}$/;
//     return mobilePattern.test(number);
//   };

//   const handleSubmit = async () => {
//     if (
//       !opportunityName ||
//       !prospectName ||
//       !mobileNumber ||
//       !email ||
//       !validateMobileNumber(mobileNumber)
//     ) {
//       Alert.alert(
//         'Error',
//         'Please fill required fields and enter a valid 10-digit mobile number.',
//       );
//       return;
//     }

//     try {
//       setLoading(true);
//       const payload = {
//         jsonrpc: '2.0',
//         method: 'call',
//         params: {
//           created_by: employeeCode,
//           prospect_name: prospectName,
//           mobile_number: mobileNumber,
//           employeeCode: employeeCode,
//           email,
//           name: opportunityName,
//           internal_notes: internalNotes,
//           extra_info: '',
//           division: Number(selectedDivisionId),
//           sales_person: Number(salesPersonId),
//           customer_id: Number(selectedCustomerId),
//           type: 'opportunity',
//           remark,
//           account_holder: accountHolderId,
//           visible_To_Users: visibleToId,
//           assignTo_Id: assignToId,
//           expected_revenue: expectedRevenue,
//           probability: probability,
//           priority,
//           taglist: selectdetaglist,
//           expectedclosing: querycloseddate,
//           contact_information: extraInfoData,
//           remarkdata: [tabremarks],
//         },
//       };

//       const response = await fetch(createOpportunityUrl, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify(payload),
//       });
//       console.log(response, 'Crating SuccessFullyyyyy');
//       if (!response.ok) throw new Error('Network response was not ok');
//       const result = await response.json();
//       console.log(result);
//       showFlashMessage({
//         message: 'Opportunity created successfully',
//         type: 'success',
//         duration: 3000,
//       });
//       navigation.goBack();
//     } catch (err) {
//       console.error('handleSubmit error', err);
//       showFlashMessage({
//         message: 'Failed to create opportunity',
//         type: 'danger',
//         duration: 3000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------- UI helpers ----------
//   const salesPersonOptions = salesPersons.map(p => ({
//     label: p.person_name,
//     value: String(p.person_id),
//   }));

//   return (
//     <>
//       <HeaderCompo
//         title={'Create Opportunity'}
//         lefticon={require('../assets/back.png')}
//         onPress={() => navigation.goBack()}
//       />

//       <ScrollView
//         style={[
//           styles.container,
//           isDarkMode ? styles.darkContainer : styles.lightContainer,
//         ]}>
//         <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
//           Opportunity Name
//         </Text>
//         <TextInput
//           style={[styles.input]}
//           placeholder="Enter opportunity name"
//           value={opportunityName}
//           onChangeText={setOpportunityName}
//           placeholderTextColor={COLORS.PLACEHOLDER}
//         />

//         <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
//           Prospect Name
//         </Text>
//         <TextInput
//           style={[styles.input]}
//           placeholder="Enter prospect name"
//           value={prospectName}
//           onChangeText={setProspectName}
//           placeholderTextColor={COLORS.PLACEHOLDER}
//         />

//         <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
//           Expected Revenue
//         </Text>
//         <TextInput
//           style={[styles.input]}
//           placeholder="Expected Revenue"
//           value={expectedRevenue}
//           onChangeText={setExpectedRevenue}
//           placeholderTextColor={COLORS.PLACEHOLDER}
//         />

//         <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
//           Probability (%)
//         </Text>
//         <TextInput
//           style={[styles.input]}
//           placeholder="Probability %"
//           value={probability}
//           onChangeText={setProbability}
//           placeholderTextColor={COLORS.PLACEHOLDER}
//           keyboardType="numeric"
//         />

//         <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
//           Mobile Number
//         </Text>
//         <TextInput
//           style={[styles.input]}
//           placeholder="Enter 10-digit Phone number"
//           keyboardType="numeric"
//           value={mobileNumber}
//           onChangeText={setMobileNumber}
//           placeholderTextColor={COLORS.PLACEHOLDER}
//           maxLength={10}
//         />

//         <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
//           Email
//         </Text>
//         <TextInput
//           style={[styles.input]}
//           placeholder="Enter email"
//           keyboardType="email-address"
//           value={email}
//           onChangeText={setEmail}
//           placeholderTextColor={COLORS.PLACEHOLDER}
//         />
//         <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
//           Expected Closing
//         </Text>
//         <CalendarInput
//           value={querycloseddate}
//           onChange={v => {
//             console.log('Closed Date:', v);
//             setquerycloseddate(v);
//           }}
//           placeholder="Select Closed Date"
//           styles={styles}
//           COLORS={COLORS}
//         />

//         {is_multidivision && (
//           <>
//             <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
//               Division
//             </Text>
//             <SingleDropdown
//               data={divisionOptions}
//               value={selectedDivisionId}
//               onChange={item => {
//                 setSelectedDivisionId(item.value);
//               }}
//               placeholder="Select division"
//               isDarkMode={isDarkMode}
//             />
//           </>
//         )}

//         <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
//           Sales Person
//         </Text>
//         <SingleDropdown
//           data={salesPersonOptions}
//           value={salesPersonId}
//           onChange={item => {
//             setSelectedSalesPersonLabel(item.label);
//             setSalesPersonId(item.value);
//             fetchCustomersData(item.value);
//           }}
//           placeholder="Select Sales Person"
//           isDarkMode={isDarkMode}
//         />

//         <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
//           Customer
//         </Text>
//         <SingleDropdown
//           data={customers}
//           value={selectedCustomerId}
//           onChange={item => {
//             setSelectedCustomerId(item.value);
//             fetchAccountHolder(item.value, selectedDivisionId);
//           }}
//           placeholder="Select Customer"
//         />

//         {user?.result?.is_management && selectedDivisionId && (
//           <>
//             <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
//               Assign To
//             </Text>
//             <SingleDropdown
//               data={assignToData}
//               value={assignToId}
//               onChange={item => setAssignToId(item.value)}
//               placeholder="Assign To"
//             />
//           </>
//         )}

//         <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
//           Visible To
//         </Text>
//         <MultiselectorDropDown
//           data={visibleToData}
//           selectedValues={visibleToId}
//           onValueChange={items => setVisibleToId(items)}
//           placeholder="Visible To"
//         />

//         <Text style={[styles.label, isDarkMode && styles.darkLabel]}>Tags</Text>
//         <SingleDropdown
//           data={taglist}
//           onChange={item => {
//             setselectedtaglist(item.value);
//           }}
//         />
//         <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
//           Remark
//         </Text>
//         <TextinputCompo
//           value={remark}
//           onChangeText={text => setRemark(text)}
//           placeholder="Remark"
//           style={[styles.input, {height: 100}]}
//           placeholderTextColor={COLORS.PLACEHOLDER}
//         />

//         <Text
//           style={[
//             styles.label,
//             isDarkMode ? styles.darkLabel : styles.lightLabel,
//           ]}>
//           Priority
//         </Text>
//         <View style={{flexDirection: 'row', marginTop: 6}}>
//           {[1, 2, 3].map(i => (
//             <TouchableOpacity key={i} onPress={() => setPriority(i)}>
//               <Text
//                 style={{
//                   fontSize: 30,
//                   color: i <= priority ? '#FFD700' : '#999',
//                   marginRight: 8,
//                 }}>
//                 ★
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
//           Account Holder
//         </Text>
//         <TextinputCompo
//           placeholder={'Account Holder'}
//           style={[styles.input]}
//           placeholderTextColor={COLORS.PLACEHOLDER}
//           value={accountHolderName}
//           editable={false}
//         />

//         <View style={styles.actionButtons}>
//           <ButtonCompo
//             title="Save"
//             style={styles.actionButton}
//             onPress={handleSubmit}
//           />
//           <ButtonCompo
//             title="Cancel"
//             style={styles.actionButton}
//             onPress={() => navigation.goBack()}
//           />
//           <Loader visible={loading} text="Creating opportunity..." />
//         </View>

//         <View style={{...styles.actionButtons, marginBottom: 20}}>
//           <ButtonCompo
//             title="Contact info"
//             style={{...styles.actionButton}}
//             // onPress={() =>
//             //   navigation.navigate(navigationString.CONTACTINFORMATION)

//             // }
//             onPress={() =>
//               navigation.navigate(navigationString.CONTACTINFORMATION, {
//                 onSave: handleExtraInfoSave,
//               })
//             }
//           />
//           <ButtonCompo
//             title="Remark"
//             style={{...styles.actionButton}}
//             onPress={() => setOpenRemarkModal(true)}
//           />
//           <ButtonCompo
//             title="Internal Notes"
//             style={{...styles.actionButton}}
//             onPress={() => setInternalNotes(true)}
//           />
//         </View>
//         {/*
//         <Remark
//           isVisible={openRemarkModal}
//           onclose={() => setOpenRemarkModal(false)}
//           resUser={resUser}
//         /> */}
//         <Remark
//           isVisible={openRemarkModal}
//           onclose={data => {
//             setOpenRemarkModal(false);

//             if (data) {
//               console.log('Received Remark Data:', data);
//               settabremarks(data);

//               // 🔥 You can also store it in state if needed
//               // setRemarkData(data);
//             }
//           }}
//           resUser={resUser}
//         />

//         {/* <ContactInformation
//           isVisible={openContactModal}
//           onclose={() => setOpenContactModal(false)}
//         /> */}
//         {internalNotes && (
//           <TextinputCompo
//             value={tabinternal}
//             onChangeText={text => settabinternal(text)}
//             placeholder="Internal Notes"
//             style={[styles.input, {height: 100, marginBottom: 20}]}
//             placeholderTextColor={COLORS.PLACEHOLDER}
//           />
//         )}
//       </ScrollView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, padding: 16},
//   darkContainer: {backgroundColor: '#333'},
//   lightContainer: {backgroundColor: '#fff'},
//   label: {fontSize: 14, fontWeight: 'bold', marginTop: 10},
//   darkLabel: {color: '#fff'},
//   lightLabel: {color: '#000'},
//   input: {
//     borderWidth: 1,
//     borderColor: COLORS.black,
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 5,
//     backgroundColor: COLORS.white,
//     color: COLORS.black,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     // marginTop: 12,
//   },
//   actionButton: {
//     flex: 1,
//     marginHorizontal: 5,
//     paddingVertical: 14,
//     backgroundColor: '#007BFF',
//     borderRadius: 5,
//     alignItems: 'center',
//   },
// });

// export default OpportunityForm;
// // Jamshed start

// OpportunityForm.js
import React, {useEffect, useState, useContext, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import {AuthContext} from './Context';
import urls from '../../url';
import makeApiCall from '../utils/apiHelper';
import SingleDropdown from '../components/SingleDropdown';
import HeaderCompo from '../components/HeaderCompo';
import ButtonCompo from '../components/ButtonCompo';
import Loader from '../components/Loader';
import {showFlashMessage} from '../utils/fleshmessage';
import {useSelector} from 'react-redux';
import TextinputCompo from '../components/TextinputCompo';
import {COLORS} from '../styles/Colors';
import MultiselectorDropDown from '../components/MultiselectorDropDown';
import Remark from '../components/Modaals/Remark';
import ContactInformation from '../components/Modaals/ContactInformation';
import navigationString from '../route/navigationString';
import CalendarInput from '../components/CalendarInput';

// ─── Design tokens ────────────────────────────────────────────────────────────
const DESIGN = {
  primary: '#2563EB', // Vibrant blue
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',
  accent: '#0EA5E9',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  gold: '#FBBF24',

  // Light mode
  bgLight: '#F8FAFC',
  surfaceLight: '#FFFFFF',
  borderLight: '#E2E8F0',
  textPrimaryLight: '#0F172A',
  textSecondaryLight: '#64748B',
  inputBgLight: '#FFFFFF',

  // Dark mode
  bgDark: '#0F172A',
  surfaceDark: '#1E293B',
  borderDark: '#334155',
  textPrimaryDark: '#F1F5F9',
  textSecondaryDark: '#94A3B8',
  inputBgDark: '#1E293B',

  radius: {sm: 8, md: 12, lg: 16, xl: 20},
  spacing: {xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32},
  fontSize: {xs: 11, sm: 12, md: 14, lg: 16, xl: 18, xxl: 22},
};

// ─── Small reusable components ────────────────────────────────────────────────

/** Section header with accent bar */
const SectionHeader = ({title, isDark}) => (
  <View style={sectionHeaderStyles.wrapper}>
    <View style={sectionHeaderStyles.bar} />
    <Text
      style={[
        sectionHeaderStyles.title,
        isDark && {color: DESIGN.textPrimaryDark},
      ]}>
      {title}
    </Text>
  </View>
);
const sectionHeaderStyles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: DESIGN.spacing.xl,
    marginBottom: DESIGN.spacing.md,
  },
  bar: {
    width: 4,
    height: 18,
    backgroundColor: DESIGN.primary,
    borderRadius: 2,
    marginRight: DESIGN.spacing.sm,
  },
  title: {
    fontSize: DESIGN.fontSize.lg,
    fontWeight: '700',
    color: DESIGN.textPrimaryLight,
    letterSpacing: 0.3,
  },
});

/** Styled field label */
const FieldLabel = ({text, isDark, required = false}) => (
  <Text
    style={[labelStyles.label, isDark && {color: DESIGN.textSecondaryDark}]}>
    {text}
    {required && <Text style={labelStyles.required}> *</Text>}
  </Text>
);
const labelStyles = StyleSheet.create({
  label: {
    fontSize: DESIGN.fontSize.sm,
    fontWeight: '600',
    color: DESIGN.textSecondaryLight,
    marginBottom: DESIGN.spacing.xs,
    marginTop: DESIGN.spacing.md,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  required: {color: DESIGN.danger},
});

/** Styled text input */
const StyledInput = ({isDark, style, ...props}) => (
  <TextInput
    style={[inputStyles.input, isDark && inputStyles.inputDark, style]}
    placeholderTextColor={isDark ? DESIGN.textSecondaryDark : '#A0AEC0'}
    {...props}
  />
);
const inputStyles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderColor: DESIGN.borderLight,
    borderRadius: DESIGN.radius.md,
    padding: DESIGN.spacing.md,
    fontSize: DESIGN.fontSize.md,
    backgroundColor: DESIGN.inputBgLight,
    color: DESIGN.textPrimaryLight,
    minHeight: 48,
  },
  inputDark: {
    borderColor: DESIGN.borderDark,
    backgroundColor: DESIGN.inputBgDark,
    color: DESIGN.textPrimaryDark,
  },
});

/** Card wrapper */
const Card = ({children, isDark, style}) => (
  <View style={[cardStyles.card, isDark && cardStyles.cardDark, style]}>
    {children}
  </View>
);
const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: DESIGN.surfaceLight,
    borderRadius: DESIGN.radius.lg,
    padding: DESIGN.spacing.lg,
    marginBottom: DESIGN.spacing.md,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: {backgroundColor: DESIGN.surfaceDark, shadowOpacity: 0.3},
});

/** Action chip button */
const ChipButton = ({title, icon, onPress, variant = 'outline', isDark}) => {
  const isOutline = variant === 'outline';
  return (
    <TouchableOpacity
      style={[
        chipStyles.chip,
        isOutline
          ? [chipStyles.chipOutline, isDark && chipStyles.chipOutlineDark]
          : chipStyles.chipSolid,
      ]}
      onPress={onPress}
      activeOpacity={0.75}>
      {icon && <Text style={chipStyles.icon}>{icon}</Text>}
      <Text style={[chipStyles.text, !isOutline && {color: '#fff'}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DESIGN.spacing.md,
    paddingVertical: DESIGN.spacing.sm,
    borderRadius: DESIGN.radius.xl,
    marginRight: DESIGN.spacing.sm,
    marginBottom: DESIGN.spacing.sm,
  },
  chipOutline: {
    borderWidth: 1.5,
    borderColor: DESIGN.primary,
    backgroundColor: DESIGN.primaryLight,
  },
  chipOutlineDark: {borderColor: DESIGN.accent, backgroundColor: '#1E3A5F'},
  chipSolid: {backgroundColor: DESIGN.primary},
  icon: {fontSize: 14, marginRight: 5},
  text: {
    fontSize: DESIGN.fontSize.sm,
    fontWeight: '600',
    color: DESIGN.primary,
  },
});

// ─── Main Component ───────────────────────────────────────────────────────────

const OpportunityForm = ({route, navigation}) => {
  const employeeCode = route?.params?.employeeCode || '';
  const user = useSelector(state => state.user.userDatainfo);

  // Form state
  const [opportunityName, setOpportunityName] = useState('');
  const [prospectName, setProspectName] = useState('');
  const [expectedRevenue, setExpectedRevenue] = useState('');
  const [probability, setProbability] = useState('10');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [remark, setRemark] = useState('');
  const [priority, setPriority] = useState(0);
  const [tabinternal, settabinternal] = useState('');
  const [showInternalNotes, setShowInternalNotes] = useState(false);

  // Dropdown / list state
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [selectedDivisionId, setSelectedDivisionId] = useState(null);

  const [salesPersons, setSalesPersons] = useState([]);
  const [salesPersonId, setSalesPersonId] = useState(null);
  const [selectedSalesPersonLabel, setSelectedSalesPersonLabel] = useState('');

  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const [assignToData, setAssignToData] = useState([]);
  const [assignToId, setAssignToId] = useState(null);

  const [visibleToData, setVisibleToData] = useState([]);
  const [visibleToId, setVisibleToId] = useState([]);

  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountHolderId, setAccountHolderId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [openRemarkModal, setOpenRemarkModal] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [extraInfoData, setExtraInfoData] = useState({});
  const [tabremarks, settabremarks] = useState({});
  const [taglist, settaglist] = useState([]);
  const [selectdetaglist, setselectedtaglist] = useState(null);
  const toDay = new Date().toISOString().split('T')[0];
  const [querycloseddate, setquerycloseddate] = useState('');
  const [salesChannels, setSalesChannels] = useState([]);
  const [selectedSalesChannel, setSelectedSalesChannel] = useState(null);
    const [selectedAccountHolder, setSelectedAccountHolder] = useState(null);

  const is_multidivision = route?.params?.is_multidivision || false;
  const resUser = route?.params?.resUser?.res_user || '';

  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const createOpportunityUrl = server_origin + urls.createOpportunity;
  const fetchDivisionUrl = server_origin + urls.fetchOpportunityDivision;
  const salesPersonsUrl = server_origin + urls.fetchLeadSalePerson;
  const fetchsaleschannels = server_origin + urls.fetchsaleschannels;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // ─── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchDivisionData();
    fetchVisibleToData();
    fetchTagInfo();
  }, []);

  useEffect(() => {
    if (selectedDivisionId) {
      fetchSalesPersons(selectedDivisionId);
      fetchAssignTo(selectedDivisionId);
    }
  }, [selectedDivisionId]);

  useEffect(() => {
    if (!salesPersons?.length) return;
    const options = salesPersons.map(p => ({
      label: p.person_name?.trim(),
      value: String(p.person_id),
    }));
    if (resUser) {
      const matched = options.find(p => String(p.value) === String(resUser));
      if (matched) {
        setSelectedSalesPersonLabel(matched.label);
        setSalesPersonId(matched.value);
        fetchCustomersData(matched.value);
      }
    }
  }, [salesPersons, resUser]);

  useEffect(() => {
    if (selectedCustomerId && selectedDivisionId) {
      fetchAccountHolder(selectedCustomerId, selectedDivisionId);
    }
  }, [selectedCustomerId, selectedDivisionId]);

  // ─── API helpers ─────────────────────────────────────────────────────────────

  const fetchDivisionData = async () => {
    try {
      const response = await fetch(fetchDivisionUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {resUser},
        }),
      });
      if (!response.ok) throw new Error('Failed to fetch divisions');
      const result = await response.json();
      const opt = (result.result || []).map(div => ({
        label: div.division_name,
        value: div.division_id,
      }));
      setDivisionOptions(opt);
      if (route?.params?.selectedDivisionId) {
        setSelectedDivisionId(route.params.selectedDivisionId);
      }
    } catch (err) {
      console.error('fetchDivisionData error:', err);
      Alert.alert('Error', 'Failed to load divisions.');
    }
  };

  const fetchSalesChannels = useCallback(async () => {
    try {
      const res = await fetch(fetchsaleschannels, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {resUser},
        }),
      });

      const result = await res.json();

      console.log(result, 'REREREREE');

      const formatted = (result?.result || []).map(i => ({
        label: i.channel_name,
        value: i.channel_id,
      }));

      setSalesChannels(formatted);
    } catch (e) {
      console.error('[LeadForm] fetchSalesChannels:', e);
    }
  }, [resUser]);

  useEffect(() => {
    fetchSalesChannels();
  }, []);

  const fetchSalesPersons = async divisionId => {
    try {
      const response = await fetch(salesPersonsUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {division: divisionId, empCode: employeeCode},
        }),
      });
      if (!response.ok) throw new Error('Network response not ok');
      const result = await response.json();
      setSalesPersons(result.result || []);
    } catch (err) {
      console.error('fetchSalesPersons error:', err);
      Alert.alert('Error', 'Failed to load sales persons.');
      setSalesPersons([]);
    }
  };


  const fetchCustomersData = async spId => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchcustomerUrl,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {salesPerson: Number(spId)},
        },
      );
      const list = (response?.result || []).map(item => ({
        label: item.customer_name,
        value: item.customer_id,
      }));
      setCustomers(list);
    } catch (err) {
      console.error('fetchCustomersData error:', err);
      setCustomers([]);
    }
  };

  const fetchAccountHolder = async (customerId, divisionId) => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchAccountHolder,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            selected_customerId: customerId,
            division: parseInt(divisionId, 10),
          },
        },
      );
      if (response?.result?.length > 0) {
        setAccountHolderName(response.result[0].account_holder_name);
        setAccountHolderId(response.result[0].account_holder_id);
      } else {
        setAccountHolderName('');
        setAccountHolderId(null);
      }
    } catch (err) {
      console.error('fetchAccountHolder error:', err);
    }
  };

  const fetchVisibleToData = async () => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchVisibletodata,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {},
        },
      );
      const list = (response?.result || []).map(i => ({
        label: i.visibleTo_name,
        value: String(i.visibleTo_id),
      }));
      setVisibleToData(list);
    } catch (err) {
      console.error('fetchVisibleToData error:', err);
      setVisibleToData([]);
    }
  };

  const fetchAssignTo = async divisionId => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchassigntodata,
        'POST',
        {
          jsonrpc: '2.0',
          params: {division: divisionId},
        },
      );
      const list = (response?.result || []).map(a => ({
        label: a.assign_name,
        value: String(a.assign_id),
      }));
      setAssignToData(list);
    } catch (err) {
      console.error('fetchAssignTo error:', err);
      setAssignToData([]);
    }
  };

  const fetchTagInfo = async () => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchtagsdata,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {resUser},
        },
      );
      const tagInfoData = (response?.result || []).map(item => ({
        label: item.tag_name,
        value: item.tag_id,
      }));
      settaglist(tagInfoData);
    } catch (err) {
      console.error('fetchTagInfo error:', err);
    }
  };


const salesPersonOption = useMemo(() => {
  const options = (salesPersons || []).map((p) => ({
    label: p.person_name?.trim(),
    value: String(p.person_id),
  }));

  // 🔥 current user ko auto add karo (agar list me nahi hai)
  if (resUser) {
    const exists = options.some(
      (o) => String(o.value) === String(resUser)
    );

    if (!exists) {
      options.unshift({
        label: 'You',
        value: String(resUser),
      });
    }
  }

  return options;
}, [salesPersons, resUser]);

  // ─── Validation & Submit ──────────────────────────────────────────────────────

  // const handleSubmit = async () => {
  //   if (!opportunityName.trim()) {
  //     Alert.alert('Validation Error', 'Opportunity Name is required.');
  //     return;
  //   }
  //   if (is_multidivision && !selectedDivisionId) {
  //     Alert.alert('Validation Error', 'Please select a Division.');
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const payload = {
  //       jsonrpc: '2.0',
  //       method: 'call',
  //       params: {
  //         created_by: employeeCode,
  //         prospect_name: prospectName,
  //         mobile_number: mobileNumber,
  //         employeeCode,
  //         email,
  //         name: opportunityName,
  //         internal_notes: tabinternal,
  //         extra_info: '',
  //         division: Number(selectedDivisionId),
  //         sales_person: Number(salesPersonId),
  //         customer_id: Number(selectedCustomerId),
  //         type: 'opportunity',
  //         remark,
  //         account_holder: accountHolderId,
  //         visible_To_Users: visibleToId,
  //         assignTo_Id: assignToId,
  //         expected_revenue: expectedRevenue,
  //         probability,
  //         priority,
  //         taglist: selectdetaglist,
  //         expectedclosing: querycloseddate,
  //         contact_information: extraInfoData,
  //         remarkdata: [tabremarks],
  //       },
  //     };

  //     const response = await fetch(createOpportunityUrl, {
  //       method: 'POST',
  //       headers: {'Content-Type': 'application/json'},
  //       body: JSON.stringify(payload),
  //     });
  //     const result = await response.json();
  //     console.log(result?.message,'Result')
  //     if (!response.ok) throw new Error('Network response was not ok');

  //     showFlashMessage({
  //       message: 'Opportunity created successfully!',
  //       type: 'success',
  //       duration: 3000,
  //     });
  //     // navigation.goBack();
  //   } catch (err) {
  //     console.error('handleSubmit error:', err);
  //     showFlashMessage({
  //       message: 'Failed to create opportunity. Please try again.',
  //       type: 'danger',
  //       duration: 3000,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    // 🔴 Validation
    if (!opportunityName.trim()) {
      Alert.alert('Validation Error', 'Opportunity Name is required.');
      return;
    }

    if (is_multidivision && !selectedDivisionId) {
      Alert.alert('Validation Error', 'Please select a Division.');
      return;
    }

    // ✅ Helper (VERY IMPORTANT)
    const safeNumber = (val, fallback = 0) => {
      const num = Number(val);
      return isNaN(num) ? fallback : num;
    };

    try {
      setLoading(true);

      // 🔥 CLEAN PAYLOAD (NO NaN, NO null issues)
      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          created_by: employeeCode || '',
          prospect_name: prospectName || '',
          mobile_number: mobileNumber || '',
          employeeCode: employeeCode || '',
          email: email || '',
          name: opportunityName || '',
          internal_notes: tabinternal || '',
          extra_info: '',

          division: safeNumber(selectedDivisionId),
          sales_person: safeNumber(salesPersonId),
          customer_id: safeNumber(selectedCustomerId),

          type: 'opportunity',
          remark: remark || '',

          // ✅ FIXED (will send 0 if empty)
          account_holder: safeNumber(selectedAccountHolder),
           sales_channel: selectedSalesChannel,

          visible_To_Users: visibleToId || [],

          assignTo_Id: safeNumber(assignToId),

          expected_revenue: expectedRevenue,
          probability: probability,
          priority: priority,

          taglist: selectdetaglist || '',
          expectedclosing: querycloseddate || '',

          contact_information: extraInfoData || {},
          remarkdata: tabremarks ? [tabremarks] : [],
        },
      };

      console.log('🚀 FINAL PAYLOAD:', payload);

      const response = await fetch(createOpportunityUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      console.log('📥 FULL RESPONSE:', result);

      // ❌ ODOO ERROR HANDLING (IMPORTANT)
      if (result?.error) {
        const errorMessage =
          result?.error?.data?.message ||
          result?.error?.message ||
          'Server error occurred';

        console.log('❌ Odoo Error:', errorMessage);

        showFlashMessage({
          message: errorMessage,
          type: 'danger',
          duration: 4000,
        });

        return;
      }

      // ✅ SUCCESS HANDLING
      if (result?.result) {
        showFlashMessage({
          message:
            result?.result?.message || 'Opportunity created successfully!',
          type: 'success',
          duration: 3000,
        });

        navigation.goBack();
      } else {
        showFlashMessage({
          message: result?.result?.message || 'Something went wrong',
          type: 'danger',
          duration: 3000,
        });
      }
    } catch (err) {
      console.error('❌ handleSubmit error:', err);

      showFlashMessage({
        message: err?.message || 'Network error. Please try again.',
        type: 'danger',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExtraInfoSave = useCallback(data => {
    setExtraInfoData(data);
  }, []);

  // ─── Derived values ───────────────────────────────────────────────────────────

  const salesPersonOptions = salesPersons.map(p => ({
    label: p.person_name,
    value: String(p.person_id),
  }));

  const bg = isDark ? DESIGN.bgDark : DESIGN.bgLight;

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <View style={{flex: 1, backgroundColor: bg}}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={bg}
      />

      <HeaderCompo
        title="Create Opportunity"
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{flex: 1, backgroundColor: bg}}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* ── Basic Info ── */}
        {/* <SectionHeader title="Basic Information" isDark={isDark} /> */}
        <Card isDark={isDark}>
          <FieldLabel text="Opportunity Name" isDark={isDark} required />
          <StyledInput
            isDark={isDark}
            placeholder="Enter opportunity name"
            value={opportunityName}
            onChangeText={setOpportunityName}
          />

          <FieldLabel text="Prospect Name" isDark={isDark} />
          <StyledInput
            isDark={isDark}
            placeholder="Enter prospect name"
            value={prospectName}
            onChangeText={setProspectName}
          />
          <View style={styles.row}>
            <View style={styles.halfField}>
              <FieldLabel text="Expected Revenue" isDark={isDark} />
              <StyledInput
                isDark={isDark}
                placeholder="₹ 0.00"
                value={expectedRevenue}
                onChangeText={setExpectedRevenue}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.halfField, {marginLeft: DESIGN.spacing.md}]}>
              <FieldLabel text="Probability (%)" isDark={isDark} />
              <StyledInput
                isDark={isDark}
                placeholder="0 – 100"
                value={probability}
                onChangeText={setProbability}
                keyboardType="numeric"
              />
            </View>
          </View>

         
        </Card>

          {/* ── Assignment ── */}
        {/* <SectionHeader title="Assignment & Visibility" isDark={isDark} /> */}
        <Card isDark={isDark}>
          {/* {is_multidivision && ( */}
            <>
              <FieldLabel text="Division" isDark={isDark} required />
              <SingleDropdown
                data={divisionOptions}
                value={selectedDivisionId}
                onChange={item => setSelectedDivisionId(item.value)}
                placeholder="Select division"
                isDarkMode={isDark}
              />
            </>
          {/* )} */}

          <FieldLabel text="Sales Person" isDark={isDark} />
          <SingleDropdown
            data={salesPersonOptions}
            value={salesPersonId}
            onChange={item => {
              setSelectedSalesPersonLabel(item.label);
              setSalesPersonId(item.value);
              fetchCustomersData(item.value);
            }}
            placeholder="Select sales person"
            isDarkMode={isDark}
          />

          <FieldLabel text="Customer" isDark={isDark} />
          <SingleDropdown
            data={customers}
            value={selectedCustomerId}
            onChange={item => {
              setSelectedCustomerId(item.value);
              fetchAccountHolder(item.value, selectedDivisionId);
            }}
            placeholder="Select customer"
            isDarkMode={isDark}
          />
           <FieldLabel text="Account Holder" isDark={isDark} />
          <SingleDropdown
            data={salesPersonOption}
            labelField="label"
            valueField="value"
            placeholder="Account Holder"
            value={selectedAccountHolder}
            onChange={item => {
              setSelectedAccountHolder(item.value);
            }}
            isDarkMode={isDark}
          />
          {user?.result?.is_management && selectedDivisionId && (
            <>
              <FieldLabel text="Assign To" isDark={isDark} />
              <SingleDropdown
                data={assignToData}
                value={assignToId}
                onChange={item => setAssignToId(item.value)}
                placeholder="Assign to"
                isDarkMode={isDark}
              />
            </>
          )}

          <FieldLabel text="Visible To" isDark={isDark} />
          <MultiselectorDropDown
            data={visibleToData}
            selectedValues={visibleToId}
            onValueChange={items => setVisibleToId(items)}
            placeholder="Select visibility"
          />

          <FieldLabel text="Tags" isDark={isDark} />
          <SingleDropdown
            data={taglist}
            value={selectdetaglist}
            onChange={item => setselectedtaglist(item.value)}
            placeholder="Select tag"
            isDarkMode={isDark}
          />
          

          <FieldLabel text="Sales Channel" isDark={isDark} />
          <SingleDropdown
            data={salesChannels}
            labelField="label"
            valueField="value"
            placeholder="Select Sales Channel"
            value={selectedSalesChannel}
            onChange={item => {
              setSelectedSalesChannel(item.value);
            }}
            isDarkMode={isDark}
          />

        </Card>

         {/* ── Contact Info ── */}
        {/* <SectionHeader title="Contact Details" isDark={isDark} /> */}
        <Card isDark={isDark}>
          <FieldLabel text="Phone " isDark={isDark} />
          <StyledInput
            isDark={isDark}
            placeholder="10-digit mobile number"
            keyboardType="numeric"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            maxLength={10}
          />

          <FieldLabel text="Email Address" isDark={isDark} />
          <StyledInput
            isDark={isDark}
            placeholder="email@example.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </Card>

        {/* ── Financial Info ── */}
        {/* <SectionHeader title="Financial Details" isDark={isDark} /> */}
        <Card isDark={isDark}>
          <FieldLabel text="Priority" isDark={isDark} />
          <View style={styles.priorityRow}>
            {[1, 2, 3].map(i => (
              <TouchableOpacity
                key={i}
                onPress={() => setPriority(priority === i ? 0 : i)}
                style={styles.starBtn}
                activeOpacity={0.7}>
                <Text style={[styles.star, i <= priority && styles.starActive]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
            <Text
              style={[
                styles.priorityLabel,
                isDark && {color: DESIGN.textSecondaryDark},
              ]}>
              {priority === 0
                ? 'Not set'
                : priority === 1
                ? 'Low'
                : priority === 2
                ? 'Medium'
                : 'High'}
            </Text>
          </View>
        </Card>

       

      

        {/* ── Notes ── */}
        {/* <SectionHeader title="Notes & Remarks" isDark={isDark} /> */}
        <Card isDark={isDark}>
           <FieldLabel text="Expected Closing Date" isDark={isDark} />
          <CalendarInput
            value={querycloseddate}
            onChange={v => setquerycloseddate(v)}
            placeholder="Select closing date"
            styles={styles}
            COLORS={COLORS}
          />
          <FieldLabel text="Remark" isDark={isDark} />
          <TextinputCompo
            value={remark}
            onChangeText={text => setRemark(text)}
            placeholder="Add a remark…"
            style={[
              inputStyles.input,
              isDark && inputStyles.inputDark,
              {height: 90, textAlignVertical: 'top'},
            ]}
            placeholderTextColor={isDark ? DESIGN.textSecondaryDark : '#A0AEC0'}
            multiline
          />
          
        </Card>

        {/* ── Account Holder (read-only) ── */}
        {accountHolderName ? (
          <>
            {/* <SectionHeader title="Account Information" isDark={isDark} /> */}
            <Card isDark={isDark}>
              <FieldLabel text="Account Holder" isDark={isDark} />
              <View
                style={[
                  styles.readOnlyField,
                  isDark && styles.readOnlyFieldDark,
                ]}>
                <Text
                  style={[
                    styles.readOnlyText,
                    isDark && {color: DESIGN.textPrimaryDark},
                  ]}>
                  {accountHolderName}
                </Text>
                <View style={styles.readOnlyBadge}>
                  <Text style={styles.readOnlyBadgeText}>Auto</Text>
                </View>
              </View>
            </Card>
          </>
        ) : null}

        {/* ── Quick Actions ── */}
        {/* <SectionHeader title="Additional Data" isDark={isDark} /> */}
        <View style={styles.chipRow}>
          <ChipButton
            title="Contact Info"
            icon="📋"
            isDark={isDark}
            onPress={() =>
              navigation.navigate(navigationString.CONTACTINFORMATION, {
                onSave: handleExtraInfoSave,
              })
            }
          />
          <ChipButton
            title="Remark"
            icon="💬"
            isDark={isDark}
            onPress={() => setOpenRemarkModal(true)}
          />
          <ChipButton
            title="Internal Notes"
            icon="📝"
            isDark={isDark}
            onPress={() => setShowInternalNotes(prev => !prev)}
          />
        </View>

        {showInternalNotes && (
          <Card isDark={isDark}>
            <FieldLabel text="Internal Notes" isDark={isDark} />
            <TextinputCompo
              value={tabinternal}
              onChangeText={text => settabinternal(text)}
              placeholder="Add internal notes…"
              style={[
                inputStyles.input,
                isDark && inputStyles.inputDark,
                {height: 100, textAlignVertical: 'top'},
              ]}
              placeholderTextColor={
                isDark ? DESIGN.textSecondaryDark : '#A0AEC0'
              }
              multiline
            />
          </Card>
        )}

        {/* ── Footer Actions ── */}
        <View style={styles.footerActions}>
          <TouchableOpacity
            style={[styles.btnCancel, isDark && styles.btnCancelDark]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}>
            <Text
              style={[
                styles.btnCancelText,
                isDark && {color: DESIGN.textPrimaryDark},
              ]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSave}
            onPress={handleSubmit}
            activeOpacity={0.8}>
            <Text style={styles.btnSaveText}>Save Opportunity</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: DESIGN.spacing.xxl}} />
      </ScrollView>

      {/* ── Modals ── */}
      <Remark
        isVisible={openRemarkModal}
        onclose={data => {
          setOpenRemarkModal(false);
          if (data) settabremarks(data);
        }}
        resUser={resUser}
      />

      <Loader visible={loading} text="Creating opportunity…" />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: DESIGN.spacing.lg,
    paddingBottom: DESIGN.spacing.lg,
  },
  row: {
    flexDirection: 'row',
  },
  halfField: {
    flex: 1,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: DESIGN.spacing.xs,
  },
  starBtn: {
    padding: DESIGN.spacing.xs,
  },
  star: {
    fontSize: 28,
    color: '#CBD5E0',
  },
  starActive: {
    color: DESIGN.gold,
  },
  priorityLabel: {
    marginLeft: DESIGN.spacing.sm,
    fontSize: DESIGN.fontSize.sm,
    fontWeight: '600',
    color: DESIGN.textSecondaryLight,
  },
  readOnlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: DESIGN.borderLight,
    borderRadius: DESIGN.radius.md,
    padding: DESIGN.spacing.md,
    backgroundColor: '#F1F5F9',
    minHeight: 48,
  },
  readOnlyFieldDark: {
    borderColor: DESIGN.borderDark,
    backgroundColor: '#0F172A',
  },
  readOnlyText: {
    fontSize: DESIGN.fontSize.md,
    color: DESIGN.textPrimaryLight,
    flex: 1,
  },
  readOnlyBadge: {
    backgroundColor: DESIGN.primaryLight,
    paddingHorizontal: DESIGN.spacing.sm,
    paddingVertical: 2,
    borderRadius: DESIGN.radius.sm,
  },
  readOnlyBadgeText: {
    fontSize: DESIGN.fontSize.xs,
    color: DESIGN.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: DESIGN.spacing.md,
  },
  footerActions: {
    flexDirection: 'row',
    gap: DESIGN.spacing.md,
    marginTop: DESIGN.spacing.xl,
  },
  btnCancel: {
    flex: 1,
    height: 52,
    borderRadius: DESIGN.radius.md,
    borderWidth: 1.5,
    borderColor: DESIGN.borderLight,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelDark: {
    borderColor: DESIGN.borderDark,
    backgroundColor: DESIGN.surfaceDark,
  },
  btnCancelText: {
    fontSize: DESIGN.fontSize.md,
    fontWeight: '700',
    color: DESIGN.textPrimaryLight,
    letterSpacing: 0.3,
  },
  btnSave: {
    flex: 2,
    height: 52,
    borderRadius: DESIGN.radius.md,
    backgroundColor: DESIGN.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DESIGN.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  btnSaveText: {
    fontSize: DESIGN.fontSize.md,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default OpportunityForm;
