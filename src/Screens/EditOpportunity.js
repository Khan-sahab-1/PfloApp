// // Jamshed start 
// import React, {useState, useContext, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   useColorScheme,
//   Alert,
// } from 'react-native';
// import {AuthContext} from './Context';
// import urls from '../../url';
// import HeaderCompo from '../components/HeaderCompo';
// import TextinputCompo from '../components/TextinputCompo';
// import ButtonCompo from '../components/ButtonCompo';
// import {useSelector} from 'react-redux';
// import makeApiCall from '../utils/apiHelper';
// import SingleDropdown from '../components/SingleDropdown';
// import {COLORS} from '../styles/Colors';
// import MultiselectorDropDown from '../components/MultiselectorDropDown';
// import Remark from '../components/Modaals/Remark';
// import CalendarInput from '../components/CalendarInput';
// import navigationString from '../route/navigationString';
// import RemarkModal from '../components/RemarkModal';
// import Loader from '../components/Loader';
// import {showFlashMessage} from '../utils/fleshmessage';
// //  bug ID 2822 start Jamshed
// const EditOpportunity = ({route, navigation}) => {
//   const {opportunity} = route.params;

//   console.log(opportunity, 'from Oportunity');
//   const scheme = useColorScheme();

//   const isDarkMode = scheme === 'dark';
//   // console.log(userinfo,'Userki Info')

//   const [name, setName] = useState(opportunity.name);
//   // const [contact, setContact] = useState(opportunity.contact);
//   const [email, setEmail] = useState(opportunity.email);
//   const [phone, setPhone] = useState(opportunity.phone);
//   const [manager, setManager] = useState(opportunity.manager);
//   const [createdBy, setCreatedBy] = useState(opportunity.sale_person);
//   const [customers, setCustomers] = useState([]);
//   const [priority, setPriority] = useState(opportunity.priority || 0);
//   const [selectedCustomerId, setSelectedCustomerId] = useState(
//     opportunity.customer_id || null,
//   );
//   const [salePerson, setsalePerson] = useState(
//     opportunity.sale_person_id || '',
//   );
//   const [salesPersonOptions, setSalesPersonOptions] = useState([]);
//   const [divisionInfo, setDivisionInfo] = useState([]);
//   const [selectedDivision, setSelectedDivision] = useState(
//     opportunity.employee_division_id || '',
//   );
//   const [id, setid] = useState(opportunity.id);
//   const user = useSelector(state => state.user.userDatainfo);
//   const resUser = user?.result?.res_user || {};
//   const employeeCode = user?.result?.employeeCode || '';
//   const employee_division_id = user?.result?.employee_division_id || '';
//   const [countries, setCountries] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [states, setStates] = useState([]);
//   const [selectedState, setSelectedState] = useState('');
//   const [remark, setRemark] = useState(opportunity.opp_remark || '');
//   const [accountholder, setaccountholder] = useState('');
//   // console.log(accountholder, 'Account Holder');
//   const [accounholderId, setaccountholderId] = useState('');
//   const [slectdAssignToId, setseletedassigntoId] = useState(null);

//   const [assisnToData, setassignToData] = useState([]);
//   const [visibleToData, setVisibleToData] = useState([]);
//   const [visibleToId, SetVisibleToId] = useState([]);
//   const [openRemarkModal, setOpenRemarkModal] = useState(false);
//   const [openContactModal, setOpenContactModal] = useState(false);
//   const [internalNotes, setInternalNotes] = useState(false);
//   const [internalNotestext, setInternalNotestext] = useState(
//     opportunity?.internal_notes || '',
//   );
//   const [dateValue, setDateValue] = useState(opportunity?.expected_closing);
//   const [salesChannel, setSalesChannel] = useState([]);
//   const [setselectedchannel, setsetselectedchannel] = useState(null);
//   const [taglist, settaglist] = useState([]);
//   const [selectdetaglist, setselectedtaglist] = useState(null);
//   const [extraInfoData, setExtraInfoData] = useState({
//     prospectName: opportunity?.contact_information?.prospectName || '',
//     street: opportunity?.contact_information?.street || '',
//     city: opportunity?.contact_information?.city || '',
//     zipCode: opportunity?.contact_information?.zipCode || '',
//     // contactName,
//     jobPosition: opportunity?.contact_information?.jobPosition || '',
//     mobile: opportunity?.contact_information?.mobile || '',
//     referredBy: opportunity?.contact_information?.referredBy || '',
//     selectedCountryId:
//       opportunity?.contact_information?.selectedCountryId || null,
//     selectedStateId: opportunity?.contact_information?.selectedStateId || null,
//     campaign: opportunity?.contact_information?.campaign || '',
//     medium: opportunity?.contact_information?.medium || '',
//     source: opportunity?.contact_information?.source || '',
//     daystoassign: opportunity?.contact_information?.daystoassign || '0',
//     daystoclose: opportunity?.contact_information?.daystoclose || '0',
//   });


//   const lastRemark = opportunity?.remarks_line
//     ? Object.values(opportunity.remarks_line).slice(-1)[0]
//     : null;

//   const [selectedRemark, setSelectedRemark] = useState({
//     line_id: lastRemark?.line_id ?? 0,
//     replyTo: lastRemark?.reply_to_id || null,
//     createdBy: lastRemark?.user_id || null,
//     remark: lastRemark?.remarks || '',
//     dateValue: lastRemark?.date || null,
//   });
//   const [extectedrevenue, setExpectedRevenue] = useState(
//     opportunity?.expected_revenue !== undefined &&
//       opportunity?.expected_revenue !== null
//       ? String(opportunity.expected_revenue)
//       : '',
//   );

//   const [probability, setProbability] = useState(
//     opportunity?.at_probability !== undefined &&
//       opportunity?.at_probability !== null
//       ? String(opportunity.at_probability)
//       : '',
//   );
//   const [isLoading, setIsLoading] = useState(false);

//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const editOpportunitydUrl = server_origin + urls.editOpportunity;
//   const is_management = user.result.is_management;
//   console.log(slectdAssignToId, 'is_management');

//   const handleExtraInfoSave = data => {
//     // console.log('🌟 Data Received from Extra Info:', data);
//     setExtraInfoData(data);
//   };
//   const handleRemarkUpdate = remarkData => {
//     if (remarkData) {
//       console.log('Updating remark with:', remarkData);
//       setSelectedRemark(prev => ({
//         ...prev,
//         ...remarkData,
//       }));
//     }
//   };

//   const ActionBtn = ({ label, color, onPress, flex = 1 }) => (
//   <TouchableOpacity
//     style={[styles.actionBtn, { backgroundColor: color, flex }]}
//     onPress={onPress}
//     activeOpacity={0.85}>
//     <Text style={styles.actionBtnText}>{label}</Text>
//   </TouchableOpacity>
// );
// const PALETTE = {
//   blue:   '#007AFF',
//   green:  '#34C759',
//   red:    '#FF3B30',
//   orange: '#FF9500',
//   indigo: '#5856D6',
//   teal:   '#30B0C7',
//   gold:   '#FBBF24',
// };

//   const handleRemarkClose = (shouldSave, remarkData) => {
//     setOpenRemarkModal(false);

//     if (shouldSave && remarkData) {
//       handleRemarkUpdate(remarkData);
//     }
//   };
//   // const handleSave = async () => {
//   //   console.log("handleSave called");
//   //   try {
//   //     const payload = {
//   //       id,
//   //       name,
//   //       email,
//   //       phone,
//   //       remark: remark,
//   //       account_holder: accounholderId||null,
//   //       visible_To_Users: visibleToId||null,
//   //       assignTo_Id: parseInt(slectdAssignToId)||null,
//   //       created_by: employeeCode||'',
//   //       prospect_name: extraInfoData.prospectName||'',
//   //       mobile_number: phone||'',

//   //       name: name||'',
//   //       internal_notes: internalNotestext||'',
//   //       // extra_info: '',
//   //       division: Number(selectedDivision.value)||null,
//   //       sales_person: Number(salePerson)||null,
//   //       customer_id: Number(selectedCustomerId)||null,
//   //       type: 'opportunity',
//   //       visible_To_Users: visibleToId||null,
//   //       expected_revenue: extectedrevenue||'',
//   //       probability: probability||'',
//   //       priority,
//   //       taglist: selectdetaglist.value||null,
//   //       expectedclosing: dateValue||null,
//   //       contact_information: extraInfoData,
//   //       remarkdata: [selectedRemark],
//   //       sales_channel: setselectedchannel.value||null,
//   //       // sale_person_id: salePerson,
//   //     };
//   //     console.log('Payload for Edit Opportunity:', payload);
//   //     setIsLoading(true);
//   //     const response = await fetch(editOpportunitydUrl, {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({
//   //         jsonrpc: '2.0',
//   //         method: 'call',
//   //         params: payload,
//   //       }),
//   //     });

//   //     const data = await response.json();
//   //     console.log(data, 'Data for Edit Opppppp');
//   //     if (data?.result?.success === true) {
//   //       showFlashMessage({
//   //         message: 'Success',
//   //         description: 'Opportunity Updated successfully',
//   //         type: 'success',
//   //         duration: 3000,
//   //       });
//   //     }
//   //     navigation.pop(2);

//   //     if (data.result?.error) {
//   //       Alert.alert(
//   //         'Error',
//   //         data.result?.error || 'Failed to update opportunity.',
//   //       );
//   //       navigation.goBack();
//   //     } else {
//   //       Alert.alert(data?.result?.message);
//   //     }
//   //   } catch (error) {
//   //     console.error('API Error:', error);
//   //     Alert.alert('Error', 'Something went wrong. Please try again.');
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };


//   const handleSave = async () => {
//   console.log("🚀 handleSave called");

//   try {
//     console.log("📌 Raw States:");
//     console.log("selectedDivision:", selectedDivision);
//     console.log("selectdetaglist:", selectdetaglist);
//     console.log("setselectedchannel:", setselectedchannel);
//     console.log("extraInfoData:", extraInfoData);

//     console.log("📌 Before Payload Creation");

//     const payload = {
//       id,

//       name: name || '',
//       email,
//       phone,

//       remark: remark,

//       account_holder: accounholderId || null,
//       visible_To_Users: visibleToId || null,
//       assignTo_Id: slectdAssignToId ? parseInt(slectdAssignToId) : null,

//       created_by: employeeCode || '',
//       prospect_name: extraInfoData?.prospectName || '',
//       mobile_number: phone || '',

//       internal_notes: internalNotestext || '',

//       // ✅ SAFE ACCESS (NO CRASH)
//       division: selectedDivision?.value
//         ? Number(selectedDivision.value)
//         : null,

//       sales_person: salePerson ? Number(salePerson) : null,
//       customer_id: selectedCustomerId
//         ? Number(selectedCustomerId)
//         : null,

//       type: 'opportunity',

//       expected_revenue: extectedrevenue || '',
//       probability: probability || '',
//       priority,

//       taglist: selectdetaglist?.value || null,
//       expectedclosing: dateValue || null,

//       contact_information: extraInfoData || {},
//       remarkdata: selectedRemark ? [selectedRemark] : [],

//       sales_channel: setselectedchannel?.value || null,
//     };

//     console.log("✅ Payload Created Successfully");
//     console.log("📦 Payload:", JSON.stringify(payload, null, 2));

//     setIsLoading(true);

//     console.log("🌐 API Calling:", editOpportunitydUrl);

//     const response = await fetch(editOpportunitydUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         jsonrpc: '2.0',
//         method: 'call',
//         params: payload,
//       }),
//     });

//     console.log("📡 Response Status:", response.status);

//     const data = await response.json();

//     console.log("📥 API Response:", JSON.stringify(data, null, 2));

//     if (data?.result?.success === true) {
//       console.log("✅ Success Response Received");

//       showFlashMessage({
//         message: 'Success',
//         description: 'Opportunity Updated successfully',
//         type: 'success',
//         duration: 3000,
//       });

//       navigation.pop(2);
//     } else if (data?.result?.error) {
//       console.log("❌ API Error:", data.result.error);

//       Alert.alert(
//         'Error',
//         data.result.error || 'Failed to update opportunity.'
//       );

//       navigation.goBack();
//     } else {
//       console.log("⚠️ Unexpected Response:", data?.result);

//       Alert.alert(data?.result?.message || 'Unknown response');
//     }

//   } catch (error) {
//     console.error("🔥 Catch Error:", error);

//     Alert.alert('Error', error?.message || 'Something went wrong.');
//   } finally {
//     console.log("🔄 Loading Ended");
//     setIsLoading(false);
//   }
// };
//   const handleCancel = () => {
//     console.log('Edit Canceled');
//     navigation.goBack();
//   };

//   const fetchassigntohandle = async divisionId => {
//     console.log(divisionId, 'divisionId,divisionId,divisionId');
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchassigntodata,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           params: {division: Number(divisionId.value)},
//         },
//       );
//       console.log(response, 'setassignToData');
//       const mappedData = response.result.map(assign => ({
//         label: assign.assign_name,
//         value: assign.assign_id.toString(),
//       }));

//       setassignToData(mappedData);

//       // Ensure selected value exists in fetched list
//     } catch (error) {
//       console.error('Error fetching assign to data:', error);
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
//       // console.log(response, 'fetchtaginfo');

//       const tagInfoData = response.result.map(item => ({
//         label: item.tag_name,
//         value: item.tag_id,
//       }));
//       settaglist(tagInfoData);
//     } catch (error) {
//       console.log(error, 'Error fetching fetchtaginfo info');
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

//   // useEffect(() => {
//   //   if (assisnToData.length > 0 && opportunity?.assign_Id) {
//   //     const match = assisnToData.find(item => item.value === opportunity.assign_Id.toString());
//   //     if (match) {
//   //       setseletedassigntoId(match.value);
//   //     }
//   //   }
//   // }, [assisnToData]);

//   const fetchCustomersdata = async salesPersonId => {
//     // console.log(salesPersonId, 'salesPersonId in fetchCustomersdata');

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
//       // console.log(response, 'Customer Responsenew data=====');
//       if (response && response.result) {
//         const customerList = response.result.map(item => ({
//           label: item.customer_name,
//           value: item.customer_id,
//         }));
//         setCustomers(customerList);
//       } else {
//         console.warn('No Customer found.');
//         Alert.alert('Warning', 'No Customer available.');
//         setCustomers([]);
//       }
//     } catch (error) {
//       console.log(error, 'Error fetching Customer');
//     }
//   };
//   useEffect(() => {
//     if (salePerson) {
//       fetchCustomersdata(salePerson);
//     } else {
//       setCustomers();
//     }
//   }, [salePerson]);
//   const fetchcountry = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchCountryUrl,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {},
//         },
//       );
//       // console.log(response, 'Country Response===');
//       if (response && response.result) {
//         const countryList = response.result.map(item => ({
//           label: item.name,
//           value: item.id, // Assuming this is the ID to pass to state API
//         }));
//         setCountries(countryList);
//       }
//     } catch (error) {
//       console.log(error, 'Error fetching country data');
//     }
//   };
//   // useEffect(()=>{
//   //  setsetselectedchannel({
//   //   label: opportunity.sales_channel_name,
//   //   value: opportunity.sales_channel_id,
//   //  })
//   // },[])

//   const fetchstate = async countryId => {
//     // console.log(countryId, 'Selected Country ID');
//     // console.log(typeof countryId, 'Selected Country ID in fetchstate');
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchStatesUrl,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {country_id: countryId},
//         },
//       );
//       // console.log(response, 'State Response');
//       if (response && response.result) {
//         const stateList = response.result.map(item => ({
//           label: item.name,
//           value: item.id,
//         }));
//         setStates(stateList);
//       }
//     } catch (error) {
//       console.log(error, 'Error fetching state data');
//     }
//   };

//   const handleNewEnquiry = () => {
//     if (opportunity) {
//       console.log('New Enquiry Clicked', opportunity);
//       navigation.navigate('CreateEnquiryPage', opportunity);
//     } else {
//       console.warn('Opportunity data is missing');
//       Alert.alert('Error', 'Opportunity data is missing. Please try again.');
//     }
//   };

//   const handleMarkWon = () => {
//     console.log('Mark Won Clicked');
//   };

//   const handleMarkLost = () => {
//     console.log('Mark Lost Clicked');
//   };

//   const handlePlanOfAction = () => {
//     console.log('Plan of Action Clicked');
//     navigation.navigate('PlanOfAction', {id});
//   };

//   const fetchsalespersion = async divisionId => {
//     console.log(divisionId, 'DivisionId');
//     try {
//       const params = {
//         division: employee_division_id || divisionId,
//         empCode: user?.result?.emp_code,
//       };
//       console.log(params,'Params')
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchLeadSalePerson,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: params,
//         },
//       );
//       console.log(response, 'Sales Person Response');
//       const salesPersonData = response.result.map(item => ({
//         label: item.person_name,
//         value: item.person_id,
//       }));
//       setSalesPersonOptions(salesPersonData);
//     } catch (error) {
//       console.error('Error fetching sales person data:', error);
//     }
//   };

//   const fetchDevisioninfo = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchleadsDivision,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {resUser},
//         },
//       );
//       console.log(response, 'Division Info Response');
//       const divisionInfoData = response.result.map(item => ({
//         label: item.division_name,
//         value: item.division_id,
//       }));
//       setDivisionInfo(divisionInfoData);
//     } catch (error) {
//       console.log(error, 'Error fetching division info');
//     }
//   };
//   useEffect(() => {
//     if (opportunity?.employee_division_id && divisionInfo?.length > 0) {
//       const match = divisionInfo.find(
//         item => item.value === opportunity.employee_division_id,
//       );

//       console.log('🎯 Matched Division:', match);

//       if (match) {
//         setSelectedDivision(match); // <-- store match here
//       }
//     }
//   }, [opportunity, divisionInfo]);

//   const fetchAccountHolder = async (customerId, divisionId) => {
//     console.log('Fetching Account Holder...', divisionId);
//     const startTime = Date.now();

//     const payload = {
//       selected_customerId: customerId,
//       division: divisionId ? parseInt(divisionId.value) : selectedDivision,
//     };

//     console.log(payload, 'Payload for Account Holder--------');

//     console.log(
//       server_origin,
//       urls.fetchAccountHolder,
//       'API URL for Account Holder',
//     );

//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchAccountHolder,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: payload,
//         },
//       );

//       const duration = Date.now() - startTime;
//       console.log(`Response time: ${duration}ms`);
//       console.log(response, 'Customer Response for Account Holder');
//       if (response.result && response.result.length > 0) {
//         setaccountholder(response.result[0].account_holder_name);
//         setaccountholderId(response.result[0].account_holder_id);
//       }
//     } catch (error) {
//       console.log(error, 'Error fetching Customer');
//       Alert.alert('Error', 'Failed to fetch Customer.');
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
//           params: {resUser},
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
//     fetchDevisioninfo();
//     fetchcountry();
//     fetchVisibleTotodata();
//     fetchsaleschannel();
//     fetchtaginfo();
//     fetchsalespersion(opportunity?.employee_division_id);

//     // 🔥 Set initial selected Sales Channel
//     if (opportunity.sales_channel_id) {
//       setsetselectedchannel({
//         label: opportunity.sales_channel_name,
//         value: opportunity.sales_channel_id,
//       });
//     }

//     // 🔥 Set initial selected Tag
//     if (opportunity.tag_id) {
//       setselectedtaglist({
//         label: opportunity.tag_name,
//         value: opportunity.tag_id,
//       });
//     }
//   }, []);

//   useEffect(() => {
//     if (selectedCustomerId && (selectedDivision || employee_division_id)) {
//       console.log('Fetching Account Holder...');
//       fetchAccountHolder(
//         selectedCustomerId,
//         selectedDivision || employee_division_id,
//       );
//     }
//   }, [selectedCustomerId, selectedDivision, employee_division_id]);
//   useEffect(() => {
//     if (assisnToData.length > 0 && opportunity?.assign_to_id) {
//       const match = assisnToData.find(
//         item => item.value === opportunity.assign_to_id.toString(),
//       );
//       if (match) {
//         setseletedassigntoId(match.value);
//       }
//     }
//   }, [assisnToData]);

//   useEffect(() => {
//     if (opportunity?.visible_to && opportunity.visible_to.length > 0) {
//       const ids = opportunity.visible_to.map(item => item.id);
//       SetVisibleToId(ids);
//     }
//   }, [opportunity]);
//   useEffect(() => {
//     if (selectedDivision) {
//       console.log(
//         'Fetching assign and salesperson for division:',
//         selectedDivision,
//       );
//       fetchassigntohandle(selectedDivision);
//     }
//   }, [selectedDivision]);

//   return (
//     <>
//       <HeaderCompo
//         title={'Edit Opportunity'}
//         lefticon={require('../assets/back.png')}
//         onPress={handleCancel}
//       />
//       <ScrollView
//         style={{
//           flex: 1,
//           backgroundColor: isDarkMode ? COLORS.black : COLORS.white,
//         }}>
//         <View
//           style={[styles.container, scheme === 'dark' && styles.containerDark]}>
//           {/* <Text style={[styles.header, scheme === 'dark' && styles.headerDark]}>Edit Opportunity</Text> */}

//           <View style={{...styles.upprlayer}}>

         
//           <Text
//             style={[
//               styles.label,
//               {color: isDarkMode ? COLORS.white : COLORS.black},
//             ]}>
//             Opportinity Name
//           </Text>
//           <TextinputCompo
//             style={[styles.input]}
//             value={name}
//             onChangeText={setName}
//             placeholder="Name"
//             placeholderTextColor={COLORS.PLACEHOLDER}
//           />
//           <Text
//             style={[
//               styles.label,
//               {color: isDarkMode ? COLORS.white : COLORS.black},
//             ]}>
//             Expected Revenue
//           </Text>
//           <TextinputCompo
//             style={[styles.input]}
//             value={extectedrevenue}
//             // editable={false}
//             placeholder="Expected Revenue"
//             placeholderTextColor={COLORS.PLACEHOLDER}
//             onChangeText={text => setExpectedRevenue(text)}
//             type="numeric"
//           />
//           <Text
//             style={[
//               styles.label,
//               {color: isDarkMode ? COLORS.white : COLORS.black},
//             ]}>
//             At probability (%)
//           </Text>
//           <TextinputCompo
//             style={[styles.input]}
//             value={probability}
//             // editable={false}
//             placeholder="At probability"
//             placeholderTextColor={COLORS.PLACEHOLDER}
//             onChangeText={text => setProbability(text)}
//             type="numeric"
//           />
//           <Text
//             style={[
//               styles.label,
//               {color: isDarkMode ? COLORS.white : COLORS.black},
//             ]}>
//             Prospect Name
//           </Text>
//           <TextinputCompo
//             style={[styles.input]}
//             value={extraInfoData.prospectName}
//             onChangeText={text =>
//               setExtraInfoData(prev => ({...prev, prospectName: text}))
//             }
//             placeholder="Prospect Name"
//             placeholderTextColor={COLORS.PLACEHOLDER}
//           />
//            </View>
//            <View style={{...styles.upprlayer}}>
//           <Text
//             style={[
//               styles.label,
//               {color: isDarkMode ? COLORS.white : COLORS.black},
//             ]}>
//             Division
//           </Text>
//           <SingleDropdown
//             data={divisionInfo}
//             value={selectedDivision}
//             onChange={item => {
//               setSelectedDivision(item);
//               fetchsalespersion(item.value);
//               // fetchcutomer(item.value);
//             }}
//             placeholder="Select Division"
//             // isDarkMode={isDarkMode}
//           />
//            <Text
//               style={[
//                 styles.label,
//                 {color: isDarkMode ? COLORS.white : COLORS.black},
//               ]}>
//               Sales Person
//             </Text>
//             <SingleDropdown
//               data={salesPersonOptions}
//               value={salePerson}
//               onChange={item => {
//                 setsalePerson(item.value);

//                 // fetchCustomersdata(item.value);
//               }}
//               placeholder="Select sales person"
//               // isDarkMode={isDarkMode}
//             />

//           <Text
//             style={[
//               styles.label,
//               {color: isDarkMode ? COLORS.white : COLORS.black},
//             ]}>
//             Select Customer
//           </Text>
//           <SingleDropdown
//             // label="Select Customer"
//             data={customers}
//             value={selectedCustomerId}
//             placeholder="Select Customer"
//             // onSelect={item => setSelectedCustomerId(item)}
//             onChange={item => {
//               setSelectedCustomerId(item.value);
//               item.value || selectedCustomerId,
//                 selectedDivision || employee_division_id;
//               fetchAccountHolder(
//                 item.value,
//                 selectedDivision || employee_division_id,
//               );
//               // fetchsalespersion(item.value);
//               // fetchcutomer(item.value);
//             }}
//           />

//           <Text
//             style={[
//               styles.label,
//               {color: isDarkMode ? COLORS.white : COLORS.black},
//             ]}>
//             Account Holder
//           </Text>
//           <TextinputCompo
//             placeholder={'Account Holder'}
//             value={accountholder || salePerson}
//             style={[styles.input, {height: 50}]}
//             editable={false}
//             placeholderTextColor={COLORS.PLACEHOLDER}
//           />
//           </View>
//           {/* <SingleDropdown
//           data={customers}
//           value={selec}
//           onChange={value => {
//             setSelectedCustomerId(value.value);
//             // setSelectedCustomer(value);
//             // fetchAccountHolder(value.value, selectedDivisionId);
//           }}
//           placeholder="Select Customer"
//         /> */}
//           <View style={styles.inputContainer}>
//           <View style={{...styles.upprlayer}}>
//             {/* <Text
//               style={[
//                 styles.label,
//                 {color: isDarkMode ? COLORS.white : COLORS.black},
//               ]}>
//               Prospect Name
//             </Text> */}
//             {/* <TextinputCompo
//               style={[styles.input]}
//               value={name}
//               onChangeText={setName}
//               placeholder="Name"
//               placeholderTextColor={COLORS.PLACEHOLDER}
//             /> */}

//             {/* <Text style={[styles.label, scheme === 'dark' && styles.labelDark]}>Contact</Text>
//                 <TextInput
//                     style={[styles.input, scheme === 'dark' && styles.inputDark]}
//                     value={contact}
//                     onChangeText={setContact}
//                 /> */}

//             <Text
//               style={[
//                 styles.label,
//                 {color: isDarkMode ? COLORS.white : COLORS.black},
//               ]}>
//               Email
//             </Text>
//             <TextinputCompo
//               style={[styles.input]}
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               placeholder={'Email'}
//               placeholderTextColor={COLORS.PLACEHOLDER}
//             />

//             <Text
//               style={[
//                 styles.label,
//                 {color: isDarkMode ? COLORS.white : COLORS.black},
//               ]}>
//               Phone
//             </Text>
//             <TextinputCompo
//               style={[styles.input]}
//               value={phone}
//               onChangeText={setPhone}
//               keyboardType="phone-pad"
//               placeholder="Phone"
//               placeholderTextColor={COLORS.PLACEHOLDER}
//               maxLength={10}
//             />
//             </View>
//              <View style={{...styles.upprlayer}}>
//             <Text
//               style={[
//                 styles.label,
//                 {color: isDarkMode ? COLORS.white : COLORS.black},
//               ]}>
//               Sales channel
//             </Text>
//             <SingleDropdown
//               data={salesChannel}
//               placeholder="Select Sales Channel"
//               value={setselectedchannel}
//               onChange={item => {
//                 setsetselectedchannel(item);
//                 // fetchsalespersion(item.value);
//                 // fetchcutomer(item.value);
//               }}
//             />
//             {/* <Text
//               style={[
//                 styles.label,
//                 {color: isDarkMode ? COLORS.white : COLORS.black},
//               ]}>
//               Assigned To
//             </Text>
//             <SingleDropdown
//               data={[
//                 {label: '12', value: '12'},
//                 {label: '34', value: '34'},
//               ]}
//             /> */}

//             {is_management && (
//               <>
//                 <Text
//                   style={[
//                     styles.label,
//                     {color: isDarkMode ? COLORS.white : COLORS.black},
//                   ]}>
//                   Assign To
//                 </Text>
//                 <SingleDropdown
//                   data={assisnToData}
//                   value={slectdAssignToId}
//                   onChange={item => {
//                     setseletedassigntoId(item.value);
//                     setsalePerson(Number(item.value));
//                   }}
//                   labelField="label"
//                   valueField="value"
//                   placeholder="Assign To"
//                 />
//               </>
//             )}
           
//             <Text
//               style={[
//                 styles.label,
//                 {color: isDarkMode ? COLORS.white : COLORS.black},
//               ]}>
//               Visible To
//             </Text>
//             <MultiselectorDropDown
//               data={visibleToData}
//               selectedValues={visibleToId}
//               onValueChange={items => {
//                 SetVisibleToId(items);
//               }}
//               placeholder="Visible To Data"
//             />
//             <Text
//               style={[
//                 styles.label,
//                 {color: isDarkMode ? COLORS.white : COLORS.black},
//               ]}>
//               Expected Closing Date
//             </Text>
//             <CalendarInput
//               value={dateValue}
//               onChange={v => {
//                 console.log('DATE FROM CALENDAR:', v);
//                 setDateValue(v);
//               }}
//               placeholder="Select Date"
//               styles={styles}
//               COLORS={COLORS}
//             />
//             {/* <Text style={[styles.label, scheme === 'dark' && styles.labelDark]}>Manager</Text>
//                     <TextInput
//                         style={[styles.input, scheme === 'dark' && styles.inputDark]}
//                         value={manager}
//                         onChangeText={setManager}
//                     /> */}

//             {/* <Text style={[styles.label, scheme === 'dark' && styles.labelDark]}>Sale Person</Text> */}
//             {/* {userinfo.result.is_crm_user===true? <TextInput
//                     style={[styles.input, scheme === 'dark' && styles.inputDark]}
//                     value={salePerson}
//                     onChangeText={setsalePerson}
//                     editable={false}
//                 />:
//                <TextinputCompo
//                     style={[styles.input, scheme === 'dark' && styles.inputDark]}
//                     value={userinfo.result.name}
//                     onChangeText={setsalePerson}
//                     editable={false}
//                 /> } */}

//             {/* <Text style={[styles.label, scheme === 'dark' && styles.labelDark]}>Created By</Text>
//                     <TextInput
//                         style={[styles.input, scheme === 'dark' && styles.inputDark]}
//                         value={createdBy}
//                         onChangeText={setCreatedBy}
//                         editable={false}
//                     /> */}

//             {/* <SingleDropdown
//                         data={countries}
//                         value={selectedCountry}
//                         onChange={item => {
//                             setSelectedCountry(item.value);
//                             fetchstate(item.value); // fetch states based on country
//                             setSelectedState(''); // clear previously selected state
//                         }}
//                         placeholder="Select Country"
//                     /> */}

//             {/* <SingleDropdown
//                         data={states}
//                         value={selectedState}
//                         onChange={item => setSelectedState(item.value)}
//                         placeholder="Select State"
//                     />
//                      <TextinputCompo
//                      placeholder={'City'}/> */}
//             <Text
//               style={[
//                 styles.label,
//                 {color: isDarkMode ? COLORS.white : COLORS.black},
//               ]}>
//               Remark
//             </Text>

//             <TextinputCompo
//               placeholder={'Remark'}
//               value={remark}
//               style={[styles.input, {height: 100, textAlignVertical: 'top'}]}
//               multiline={true}
//               numberOfLines={4}
//               placeholderTextColor={COLORS.PLACEHOLDER}
//               onChangeText={text => setRemark(text)}
//             />
//             <Text
//               style={[
//                 styles.label,
//                 isDarkMode ? styles.darkLabel : styles.lightLabel,
//               ]}>
//               Priority
//             </Text>
//             <View style={{flexDirection: 'row', marginTop: 6}}>
//               {[1, 2, 3].map(i => (
//                 <TouchableOpacity key={i} onPress={() => setPriority(i)}>
//                   <Text
//                     style={{
//                       fontSize: 30,
//                       color: i <= priority ? '#FFD700' : '#999',
//                       marginRight: 8,
//                     }}>
//                     ★
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <Text
//               style={[
//                 styles.label,
//                 isDarkMode ? styles.darkLabel : styles.lightLabel,
//               ]}>
//               Tags
//             </Text>
//             <SingleDropdown
//               data={taglist}
//               value={selectdetaglist}
//               onChange={item => {
//                 setselectedtaglist(item);
//                 // fetchsalespersion(item.value);
//                 // fetchcutomer(item.value);
//               }}
//               placeholder="Select Tags"
//             />
//             <Text
//               style={[
//                 styles.label,
//                 isDarkMode ? styles.darkLabel : styles.lightLabel,
//               ]}>
//               Created By
//             </Text>
//             <TextinputCompo
//               placeholder={'Created By'}
//               value={createdBy}
//               style={[styles.input, {height: 50}]}
//               editable={false}
//               placeholderTextColor={COLORS.PLACEHOLDER}
//             />
//             </View>

//             {/* <TouchableOpacity style={[styles.planButton, styles.sharedButton]} onPress={handlePlanOfAction}>
//                     <Text style={styles.buttonText}>Plan of Action</Text>
//                 </TouchableOpacity> */}

//             <View style={styles.saveCancelContainer}>
//               {/* <TouchableOpacity style={[styles.saveButton, styles.sharedButton]} onPress={handleSave}>
//                         <Text style={styles.buttonText}>Save</Text>
//                     </TouchableOpacity>  */}

//               {/* <ButtonCompo
//                 title={'Save'}
//                 onPress={handleSave}
//                 style={[styles.saveButton, styles.sharedButton]}
//               /> */}

//               {/* <ButtonCompo
//                 title={'Cancel'}
//                 onPress={handleCancel}
//                 style={[styles.cancelButton, styles.sharedButton]}
//               /> */}
//               {/* <TouchableOpacity style={[styles.cancelButton, styles.sharedButton]} onPress={handleCancel}>
//                         <Text style={styles.buttonText}>Cancel</Text>
//                     </TouchableOpacity> */}
//             </View>
//             <View style={styles.saveCancelContainer}>
//               {/* <TouchableOpacity style={[styles.saveButton, styles.sharedButton]} onPress={handleSave}>
//                         <Text style={styles.buttonText}>Save</Text>
//                     </TouchableOpacity>  */}

//               {/* <ButtonCompo
//                 title={'Contact Information'}
//                 onPress={() =>
//                   navigation.navigate(navigationString.CONTACTINFORMATION, {
//                     onSave: handleExtraInfoSave,
//                     data: opportunity,
//                   })
//                 }
//                 style={[styles.saveButton, styles.sharedButton]}
//               /> */}
//               {/* <ButtonCompo
//                 title={'Assign to'}
//                 // onPress={handleSave}
//                 style={[styles.saveButton, styles.sharedButton]}
//               /> */}

//               {/* <ButtonCompo
//                 title="Remark"
//                 style={[styles.saveButton, styles.sharedButton]}
//                 // onPress={() => setOpenRemarkModal(true)}
//                 onPress={() =>
//                   navigation.navigate(navigationString.PREVIEWEDITREMARK, {
//                     remarks: opportunity ?? [], // Safe handling
//                   })
//                 }
//               /> */}
//               {/* <TouchableOpacity style={[styles.cancelButton, styles.sharedButton]} onPress={handleCancel}>
//                         <Text style={styles.buttonText}>Cancel</Text>
//                     </TouchableOpacity> */}
//             </View>
//             <View style={styles.saveCancelContainer}>
//               {/* <TouchableOpacity style={[styles.saveButton, styles.sharedButton]} onPress={handleSave}>
//                         <Text style={styles.buttonText}>Save</Text>
//                     </TouchableOpacity>  */}

//               {/* <ButtonCompo
//                 title={'Internal Notes'}
//                 onPress={() => setInternalNotes(true)}
//                 style={[styles.saveButton, styles.sharedButton]}
//               />
//               <ButtonCompo
//                 title={'Plan of Action'}
//                 onPress={handlePlanOfAction}
//                 style={[styles.saveButton, styles.sharedButton]}
//               />
//               <ButtonCompo
//                 title="New Enquiry"
//                 onPress={handleNewEnquiry}
//                 style={[styles.saveButton, styles.sharedButton]}
//               /> */}
//               {/* <TouchableOpacity style={[styles.cancelButton, styles.sharedButton]} onPress={handleCancel}>
//                         <Text style={styles.buttonText}>Cancel</Text>
//                     </TouchableOpacity> */}
//             </View>
//             <View style={styles.primaryRow}>
//             <ActionBtn label="✓  Save"   color={PALETTE.green}  onPress={handleSave}/>
//             <ActionBtn label="✕  Cancel" color={PALETTE.red}   onPress={handleCancel} />
//           </View>
//           <View style={styles.secondaryRow}>
//             <ActionBtn
//               label="📋 Contact Info"
//               color={PALETTE.indigo}
//                onPress={() =>
//                   navigation.navigate(navigationString.CONTACTINFORMATION, {
//                     onSave: handleExtraInfoSave,
//                     data: opportunity,
//                   })
//                 }
//             />
//             <ActionBtn
//               label="💬 Remark"
//               color={PALETTE.teal}
//               onPress={() =>
//                   navigation.navigate(navigationString.PREVIEWEDITREMARK, {
//                     remarks: opportunity ?? [], // Safe handling
//                   })
//                 }
//             />
           
            
//           </View>
//           <View style={styles.secondaryRow}>
//             <ActionBtn
//   label="📝 Internal Note"
//   color={PALETTE.teal}
//    onPress={() => setInternalNotes(true)}
// />

// <ActionBtn
//   label="📋 Plan of Action"
//   color={PALETTE.teal}
//    onPress={handlePlanOfAction}
// />

// <ActionBtn
//   label="➕ New Enquiry"
//   color={PALETTE.teal}
//        onPress={handleNewEnquiry}
// />
//             </View>
//           </View>
//           {internalNotes && (
//             <TextinputCompo
//               value={internalNotestext}
//               onChangeText={text => setInternalNotestext(text)}
//               placeholder="Internal Notes"
//               style={[styles.input, {height: 100, marginBottom: 20}]}
//               placeholderTextColor={COLORS.PLACEHOLDER}
//             />
//           )}
//           <RemarkModal
//             isVisible={openRemarkModal}
//             onClose={handleRemarkClose}
//             data={opportunity}
//             // opp={'Opp'}
//           />
//           <Loader visible={isLoading} />
//         </View>
//       </ScrollView>
//     </>
//   );
// };
// // bug ID 2822 End

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     padding: 20,
//   },
//   containerDark: {
//     backgroundColor: '#333',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: 'white',
//     textAlign: 'center',
//     backgroundColor: 'blue',
//     paddingVertical: 10,
//     borderRadius: 5,
//   },
//   headerDark: {
//     color: 'white',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: 'blue',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   saveCancelContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     // marginTop: 10,
//   },
//   saveButton: {
//     backgroundColor: COLORS.GREEN,
//   },
//   cancelButton: {
//     backgroundColor: COLORS.RED,
//   },
//   sharedButton: {
//     flex: 1,
//     alignItems: 'center',
//     paddingVertical: 10,
//     marginHorizontal: 5,
//     borderRadius: 5,
//   },
//   planButton: {
//     backgroundColor: 'blue',
//     marginVertical: 10,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   inputContainer: {
//     marginBottom: 15,
//   },
//   // label: {
//   //   fontSize: 16,
//   //   marginBottom: 5,
//   //   color: '#333',
//   // },
//   labelDark: {
//     color: '#FFF',
//   },
//   input: {
//     borderWidth: 1.5,
//     // borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//     color: 'black',
//     backgroundColor: COLORS.white,
//   },
//   inputDark: {
//     borderColor: '#666',
//     color: 'white',
//   },
//   upprlayer:{
//   backgroundColor:COLORS.LIGHTGRAY,
//   padding:10,
//   borderRadius:5,
//    marginBottom:10,
//    borderWidth:1,
//    borderColor:COLORS.GRAY

//   },
//    primaryRow:   { flexDirection: 'row', marginHorizontal: 12, marginTop: 20, gap: 10 },
//   secondaryRow: { flexDirection: 'row', marginHorizontal: 12, marginTop: 10, gap: 8 },
//   actionBtn: {
//     paddingVertical: 14, borderRadius: 12, alignItems: 'center',
//     elevation: 3, shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6,
//   },
//   actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 13, letterSpacing: 0.3 },
// });

// export default EditOpportunity;
// // Jamshed start 



// EditOpportunity.js
import React, {useState, useContext, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {AuthContext} from './Context';
import urls from '../../url';
import HeaderCompo from '../components/HeaderCompo';
import TextinputCompo from '../components/TextinputCompo';
import {useSelector} from 'react-redux';
import makeApiCall from '../utils/apiHelper';
import SingleDropdown from '../components/SingleDropdown';
import {COLORS} from '../styles/Colors';
import MultiselectorDropDown from '../components/MultiselectorDropDown';
import CalendarInput from '../components/CalendarInput';
import navigationString from '../route/navigationString';
import RemarkModal from '../components/RemarkModal';
import Loader from '../components/Loader';
import {showFlashMessage} from '../utils/fleshmessage';

// ─── Design Tokens (shared with OpportunityForm) ──────────────────────────────
const D = {
  primary:            '#2563EB',
  primaryDark:        '#1D4ED8',
  primaryLight:       '#DBEAFE',
  accent:             '#0EA5E9',
  success:            '#10B981',
  danger:             '#EF4444',
  warning:            '#F59E0B',
  gold:               '#FBBF24',
  indigo:             '#6366F1',
  teal:               '#0D9488',

  bgLight:            '#F8FAFC',
  surfaceLight:       '#FFFFFF',
  borderLight:        '#E2E8F0',
  textPrimaryLight:   '#0F172A',
  textSecondaryLight: '#64748B',

  bgDark:             '#0F172A',
  surfaceDark:        '#1E293B',
  borderDark:         '#334155',
  textPrimaryDark:    '#F1F5F9',
  textSecondaryDark:  '#94A3B8',

  r:  {sm: 8,  md: 12, lg: 16, xl: 20},
  sp: {xs: 4,  sm: 8,  md: 12, lg: 16, xl: 24, xxl: 32},
  fs: {xs: 11, sm: 12, md: 14, lg: 16, xl: 18},
};

// ─── Reusable Mini Components ─────────────────────────────────────────────────

const SectionHeader = ({title, isDark}) => (
  <View style={sh.wrap}>
    <View style={sh.bar} />
    <Text style={[sh.title, isDark && {color: D.textPrimaryDark}]}>{title}</Text>
  </View>
);
const sh = StyleSheet.create({
  wrap:  {flexDirection: 'row', alignItems: 'center', marginTop: D.sp.xl, marginBottom: D.sp.md},
  bar:   {width: 4, height: 18, backgroundColor: D.primary, borderRadius: 2, marginRight: D.sp.sm},
  title: {fontSize: D.fs.lg, fontWeight: '700', color: D.textPrimaryLight, letterSpacing: 0.3},
});

const FieldLabel = ({text, isDark, required = false}) => (
  <Text style={[fl.label, isDark && {color: D.textSecondaryDark}]}>
    {text}
    {required && <Text style={fl.req}> *</Text>}
  </Text>
);
const fl = StyleSheet.create({
  label: {fontSize: D.fs.sm, fontWeight: '600', color: D.textSecondaryLight, marginBottom: D.sp.xs, marginTop: D.sp.md, letterSpacing: 0.4, textTransform: 'uppercase'},
  req:   {color: D.danger},
});

const StyledInput = ({isDark, style, ...props}) => (
  <TextinputCompo
    style={[inp.base, isDark && inp.dark, style]}
    placeholderTextColor={isDark ? D.textSecondaryDark : '#A0AEC0'}
    {...props}
  />
);
const inp = StyleSheet.create({
  base: {borderWidth: 1.5, borderColor: D.borderLight, borderRadius: D.r.md, padding: D.sp.md, fontSize: D.fs.md, backgroundColor: D.surfaceLight, color: D.textPrimaryLight, minHeight: 48},
  dark: {borderColor: D.borderDark, backgroundColor: D.surfaceDark, color: D.textPrimaryDark},
});

const Card = ({children, isDark, style}) => (
  <View style={[cd.card, isDark && cd.dark, style]}>{children}</View>
);
const cd = StyleSheet.create({
  card: {backgroundColor: D.surfaceLight, borderRadius: D.r.lg, padding: D.sp.lg, marginBottom: D.sp.md, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2},
  dark: {backgroundColor: D.surfaceDark, shadowOpacity: 0.3},
});

const ChipButton = ({title, color, onPress, isDark}) => (
  <TouchableOpacity
    style={[chip.btn, {backgroundColor: color}]}
    onPress={onPress}
    activeOpacity={0.78}>
    <Text style={chip.txt}>{title}</Text>
  </TouchableOpacity>
);
const chip = StyleSheet.create({
  btn: {flex: 1, paddingVertical: 13, borderRadius: D.r.md, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.15, shadowRadius: 6},
  txt: {color: '#fff', fontWeight: '700', fontSize: D.fs.sm, letterSpacing: 0.3},
});

const ReadOnlyField = ({value, isDark}) => (
  <View style={[rof.wrap, isDark && rof.wrapDark]}>
    <Text style={[rof.txt, isDark && {color: D.textPrimaryDark}]} numberOfLines={1}>
      {value || '—'}
    </Text>
    <View style={rof.badge}>
      <Text style={rof.badgeTxt}>Auto</Text>
    </View>
  </View>
);
const rof = StyleSheet.create({
  wrap:      {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderColor: D.borderLight, borderRadius: D.r.md, padding: D.sp.md, backgroundColor: '#F1F5F9', minHeight: 48},
  wrapDark:  {borderColor: D.borderDark, backgroundColor: '#0F172A'},
  txt:       {fontSize: D.fs.md, color: D.textPrimaryLight, flex: 1},
  badge:     {backgroundColor: D.primaryLight, paddingHorizontal: D.sp.sm, paddingVertical: 2, borderRadius: D.r.sm},
  badgeTxt:  {fontSize: D.fs.xs, color: D.primary, fontWeight: '700', letterSpacing: 0.5},
});

// ─── Main Component ───────────────────────────────────────────────────────────

const EditOpportunity = ({route, navigation}) => {
  const {opportunity} = route.params;
  console.log(opportunity,'wowowowwo')

  const scheme     = useColorScheme();
  const isDark     = scheme === 'dark';
  const user       = useSelector(state => state.user.userDatainfo);
  const resUser    = user?.result?.res_user      || {};
  const empCode    = user?.result?.employeeCode  || '';
  const empDivId   = user?.result?.employee_division_id || '';
  const isMgmt     = user?.result?.is_management || false;

  const contextType      = useContext(AuthContext);
  const server_origin    = contextType.currentUrl;
  const editUrl          = server_origin + urls.editOpportunity;

  // ── Pre-filled form state ──────────────────────────────────────────────────
  const [id]                  = useState(opportunity.id);
  const [name,          setName]          = useState(opportunity.name          || '');
  const [email,         setEmail]         = useState(opportunity.email         || '');
  const [phone,         setPhone]         = useState(opportunity.phone         || '');
  const [remark,        setRemark]        = useState(opportunity.opp_remark    || '');
  const [priority,      setPriority]      = useState(opportunity.priority      || 0);
  const [expectedRev,   setExpectedRev]   = useState(
    opportunity.expected_revenue != null ? String(opportunity.expected_revenue) : '',
  );
  const [probability,   setProbability]   = useState(
    opportunity.at_probability   != null ? String(opportunity.at_probability)   : '',
  );
  const [dateValue,     setDateValue]     = useState(opportunity.expected_closing || '');
  const [internalNotesText, setInternalNotesText] = useState(opportunity.internal_notes || '');
  const [showInternalNotes, setShowInternalNotes] = useState(false);

  // ── Dropdown state — prefilled ─────────────────────────────────────────────
  const [divisionInfo,       setDivisionInfo]       = useState([]);
  const [selectedDivision,   setSelectedDivision]   = useState(null); // {label, value}

  const [salesPersonOptions, setSalesPersonOptions] = useState([]);
  const [salePerson,         setSalePerson]         = useState(opportunity.sale_person_id || null);

  const [customers,          setCustomers]          = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(opportunity.customer_id    || null);

  const [accountHolder,      setAccountHolder]      = useState(opportunity.account_holder_name || '');
  const [accountHolderId,    setAccountHolderId]    = useState(null);

  const [assignToData,       setAssignToData]       = useState([]);
  const [selectedAssignToId, setSelectedAssignToId] = useState(null);

  const [visibleToData,      setVisibleToData]      = useState([]);
  const [visibleToId,        setVisibleToId]        = useState([]);

  const [salesChannel,       setSalesChannel]       = useState([]);
  const [selectedChannel,    setSelectedChannel]    = useState(
    opportunity.sales_channel_id
      ? {label: opportunity.sales_channel_name, value: opportunity.sales_channel_id}
      : null,
  );

  const [taglist,            setTaglist]            = useState([]);
  const [selectedTag,        setSelectedTag]        = useState(
    opportunity.tag_id
      ? {label: opportunity.tag_name, value: opportunity.tag_id}
      : null,
  );

  const [extraInfoData, setExtraInfoData] = useState({
    prospectName:      opportunity.contact_information?.prospectName      || '',
    street:            opportunity.contact_information?.street            || '',
    city:              opportunity.contact_information?.city              || '',
    zipCode:           opportunity.contact_information?.zipCode           || '',
    jobPosition:       opportunity.contact_information?.jobPosition       || '',
    mobile:            opportunity.contact_information?.mobile            || '',
    referredBy:        opportunity.contact_information?.referredBy        || '',
    selectedCountryId: opportunity.contact_information?.selectedCountryId || null,
    selectedStateId:   opportunity.contact_information?.selectedStateId   || null,
    campaign:          opportunity.contact_information?.campaign          || '',
    medium:            opportunity.contact_information?.medium            || '',
    source:            opportunity.contact_information?.source            || '',
    daystoassign:      opportunity.contact_information?.daystoassign      || '0',
    daystoclose:       opportunity.contact_information?.daystoclose       || '0',
  });

  // Remark — prefilled from last remark line
  const lastRemark = opportunity.remarks_line
    ? Object.values(opportunity.remarks_line).slice(-1)[0]
    : null;
  const [selectedRemark, setSelectedRemark] = useState({
    line_id:   lastRemark?.line_id     ?? 0,
    replyTo:   lastRemark?.reply_to_id || null,
    createdBy: lastRemark?.user_id     || null,
    remark:    lastRemark?.remarks     || '',
    dateValue: lastRemark?.date        || null,
  });

  const [openRemarkModal, setOpenRemarkModal] = useState(false);
  const [isLoading,       setIsLoading]       = useState(false);

  // ── API Helpers ────────────────────────────────────────────────────────────

  const fetchDivisionInfo = useCallback(async () => {
    try {
      const res = await makeApiCall(server_origin, urls.fetchleadsDivision, 'POST', {
        jsonrpc: '2.0', method: 'call', params: {resUser},
      });
      const mapped = (res.result || []).map(i => ({label: i.division_name, value: i.division_id}));
      setDivisionInfo(mapped);
      // Prefill division
      if (opportunity.employee_division_id) {
        const match = mapped.find(d => d.value === opportunity.employee_division_id);
        if (match) setSelectedDivision(match);
      }
    } catch (e) {
      console.error('fetchDivisionInfo:', e);
    }
  }, []);

  const fetchSalesPersons = useCallback(async divisionId => {
    try {
      const res = await makeApiCall(server_origin, urls.fetchLeadSalePerson, 'POST', {
        jsonrpc: '2.0', method: 'call',
        params: {division: empDivId || divisionId, empCode: user?.result?.emp_code},
      });
      const mapped = (res.result || []).map(i => ({label: i.person_name, value: i.person_id}));
      setSalesPersonOptions(mapped);
    } catch (e) {
      console.error('fetchSalesPersons:', e);
    }
  }, []);

  const fetchCustomers = useCallback(async spId => {
    try {
      const res = await makeApiCall(server_origin, urls.fetchcustomerUrl, 'POST', {
        jsonrpc: '2.0', method: 'call', params: {salesPerson: Number(spId)},
      });
      const mapped = (res.result || []).map(i => ({label: i.customer_name, value: i.customer_id}));
      setCustomers(mapped);
    } catch (e) {
      console.error('fetchCustomers:', e);
      setCustomers([]);
    }
  }, []);

  const fetchAccountHolder = useCallback(async (customerId, division) => {
    try {
      const divId = division?.value ? parseInt(division.value) : parseInt(empDivId);
      const res = await makeApiCall(server_origin, urls.fetchAccountHolder, 'POST', {
        jsonrpc: '2.0', method: 'call',
        params: {selected_customerId: customerId, division: divId},
      });
      if (res.result?.length > 0) {
        setAccountHolder(res.result[0].account_holder_name);
        setAccountHolderId(res.result[0].account_holder_id);
      }
    } catch (e) {
      console.error('fetchAccountHolder:', e);
    }
  }, []);

  const fetchAssignTo = useCallback(async division => {
    try {
      const divId = division?.value ? Number(division.value) : null;
      if (!divId) return;
      const res = await makeApiCall(server_origin, urls.fetchassigntodata, 'POST', {
        jsonrpc: '2.0', params: {division: divId},
      });
      const mapped = (res.result || []).map(a => ({label: a.assign_name, value: a.assign_id.toString()}));
      setAssignToData(mapped);
    } catch (e) {
      console.error('fetchAssignTo:', e);
    }
  }, []);

  const fetchVisibleTo = useCallback(async () => {
    try {
      const res = await makeApiCall(server_origin, urls.fetchVisibletodata, 'POST', {
        jsonrpc: '2.0', method: 'call', params: {},
      });
      const mapped = (res.result || []).map(i => ({label: i.visibleTo_name, value: i.visibleTo_id}));
      setVisibleToData(mapped);
    } catch (e) {
      console.error('fetchVisibleTo:', e);
    }
  }, []);

  const fetchSalesChannels = useCallback(async () => {
    try {
      const res = await makeApiCall(server_origin, urls.fetchsaleschannels, 'POST', {
        jsonrpc: '2.0', method: 'call', params: {resUser},
      });
      const mapped = (res.result || []).map(i => ({label: i.channel_name, value: i.channel_id}));
      setSalesChannel(mapped);
    } catch (e) {
      console.error('fetchSalesChannels:', e);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const res = await makeApiCall(server_origin, urls.fetchtagsdata, 'POST', {
        jsonrpc: '2.0', method: 'call', params: {resUser},
      });
      const mapped = (res.result || []).map(i => ({label: i.tag_name, value: i.tag_id}));
      setTaglist(mapped);
    } catch (e) {
      console.error('fetchTags:', e);
    }
  }, []);

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchDivisionInfo();
    fetchVisibleTo();
    fetchSalesChannels();
    fetchTags();
    fetchSalesPersons(opportunity.employee_division_id);
  }, []);

  // When salesperson is set, load their customers
  useEffect(() => {
    if (salePerson) fetchCustomers(salePerson);
  }, [salePerson]);

  // When division changes, refresh assign-to & sales persons
  useEffect(() => {
    if (selectedDivision) {
      fetchAssignTo(selectedDivision);
      fetchSalesPersons(selectedDivision.value);
    }
  }, [selectedDivision]);

  // When customer or division changes, fetch account holder
  useEffect(() => {
    if (selectedCustomerId && (selectedDivision || empDivId)) {
      fetchAccountHolder(selectedCustomerId, selectedDivision);
    }
  }, [selectedCustomerId, selectedDivision]);

  // Prefill assign-to after list loads
  useEffect(() => {
    if (assignToData.length > 0 && opportunity.assign_to_id) {
      const match = assignToData.find(i => i.value === opportunity.assign_to_id.toString());
      if (match) setSelectedAssignToId(match.value);
    }
  }, [assignToData]);

  // Prefill visible-to
  useEffect(() => {
    if (opportunity.visible_to?.length > 0) {
      setVisibleToId(opportunity.visible_to.map(i => i.id));
    }
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleExtraInfoSave = useCallback(data => setExtraInfoData(data), []);

  const handleRemarkUpdate = useCallback(data => {
    if (data) setSelectedRemark(prev => ({...prev, ...data}));
  }, []);

  const handleRemarkClose = useCallback((shouldSave, data) => {
    setOpenRemarkModal(false);
    if (shouldSave && data) handleRemarkUpdate(data);
  }, []);

  // ── Validation & Save ──────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Opportunity Name is required.');
      return;
    }
    if (!selectedDivision) {
      Alert.alert('Validation Error', 'Please select a Division.');
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        id,
        name:               name.trim(),
        email:              email              || '',
        phone:              phone              || '',
        remark:             remark             || '',
        account_holder:     accountHolderId    || null,
        visible_To_Users:   visibleToId        || [],
        assignTo_Id:        selectedAssignToId ? parseInt(selectedAssignToId) : null,
        created_by:         empCode            || '',
        prospect_name:      extraInfoData.prospectName || '',
        mobile_number:      phone              || '',
        internal_notes:     internalNotesText  || '',
        division:           selectedDivision?.value ? Number(selectedDivision.value) : null,
        sales_person:       salePerson         ? Number(salePerson)    : null,
        customer_id:        selectedCustomerId ? Number(selectedCustomerId) : null,
        type:               'opportunity',
        expected_revenue:   expectedRev        || '',
        probability:        probability        || '',
        priority,
        taglist:            selectedTag?.value || null,
        expectedclosing:    dateValue          || null,
        contact_information: extraInfoData     || {},
        remarkdata:         selectedRemark     ? [selectedRemark] : [],
        sales_channel:      selectedChannel?.value || null,
      };

      const response = await fetch(editUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({jsonrpc: '2.0', method: 'call', params: payload}),
      });

      const data = await response.json();

      if (data?.result?.success === true) {
        showFlashMessage({
          message: 'Opportunity updated successfully!',
          type: 'success',
          duration: 3000,
        });
        navigation.pop(2);
      } else if (data?.result?.error) {
        Alert.alert('Error', data.result.error || 'Failed to update opportunity.');
      } else {
        Alert.alert('Notice', data?.result?.message || 'Unknown response from server.');
      }
    } catch (err) {
      console.error('handleSave error:', err);
      Alert.alert('Error', err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── UI ─────────────────────────────────────────────────────────────────────

  const bg = isDark ? D.bgDark : D.bgLight;

  return (
    <View style={{flex: 1, backgroundColor: bg}}>
      {/* <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} /> */}

      <HeaderCompo
        title="Edit Opportunity"
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* ── Basic Information ── */}
        {/* <SectionHeader title="Basic Information" isDark={isDark} /> */}
        <Card isDark={isDark}>
          <FieldLabel text="Opportunity Name" isDark={isDark} required />
          <StyledInput
            isDark={isDark}
            value={name}
            onChangeText={setName}
            placeholder="Enter opportunity name"
          />

          <FieldLabel text="Prospect Name" isDark={isDark} />
          <StyledInput
            isDark={isDark}
            value={extraInfoData.prospectName}
            onChangeText={text => setExtraInfoData(prev => ({...prev, prospectName: text}))}
            placeholder="Enter prospect name"
          />
          <View style={styles.row}>
            <View style={styles.half}>
              <FieldLabel text="Expected Revenue" isDark={isDark} />
              <StyledInput
                isDark={isDark}
                value={expectedRev}
                onChangeText={setExpectedRev}
                placeholder="₹ 0.00"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.half, {marginLeft: D.sp.md}]}>
              <FieldLabel text="Probability (%)" isDark={isDark} />
              <StyledInput
                isDark={isDark}
                value={probability}
                onChangeText={setProbability}
                placeholder="0 – 100"
                keyboardType="numeric"
              />
            </View>
          </View>

         
        </Card>

          {/* ── Assignment & Visibility ── */}
        {/* <SectionHeader title="Assignment & Visibility" isDark={isDark} /> */}
        <Card isDark={isDark}>
          <FieldLabel text="Division" isDark={isDark} required />
          <SingleDropdown
            data={divisionInfo}
            value={selectedDivision}
            onChange={item => {
              setSelectedDivision(item);
              fetchSalesPersons(item.value);
              fetchAssignTo(item);
            }}
            placeholder="Select division"
            isDarkMode={isDark}
          />

          <FieldLabel text="Sales Person" isDark={isDark} />
          <SingleDropdown
            data={salesPersonOptions}
            value={salePerson}
            onChange={item => {
              setSalePerson(item.value);
              fetchCustomers(item.value);
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
              fetchAccountHolder(item.value, selectedDivision);
            }}
            placeholder="Select customer"
            isDarkMode={isDark}
          />

          <FieldLabel text="Account Holder" isDark={isDark} />
          {/* <ReadOnlyField value={accountHolder} isDark={isDark} /> */}
    
          <StyledInput
            isDark={isDark}
            value={accountHolder}
            onChangeText={setPhone}
            placeholder="Account Holde"

              editable={false}

            // keyboardType="phone-pad"
            // maxLength={10}

          />

          {isMgmt && (
            <>
              <FieldLabel text="Assign To" isDark={isDark} />
              <SingleDropdown
                data={assignToData}
                value={selectedAssignToId}
                onChange={item => setSelectedAssignToId(item.value)}
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

          <FieldLabel text="Sales Channel" isDark={isDark} />
          <SingleDropdown
            data={salesChannel}
            value={selectedChannel}
            onChange={item => setSelectedChannel(item)}
            placeholder="Select sales channel"
            isDarkMode={isDark}
          />

          <FieldLabel text="Tags" isDark={isDark} />
          <SingleDropdown
            data={taglist}
            value={selectedTag}
            onChange={item => setSelectedTag(item)}
            placeholder="Select tag"
            isDarkMode={isDark}
          />
        </Card>

       

        {/* ── Contact Details ── */}
        {/* <SectionHeader title="Contact Details" isDark={isDark} /> */}
        <Card isDark={isDark}>
          <FieldLabel text="Email Address" isDark={isDark} />
          <StyledInput
            isDark={isDark}
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FieldLabel text="Phone Number" isDark={isDark} />
          <StyledInput
            isDark={isDark}
            value={phone}
            onChangeText={setPhone}
            placeholder="10-digit phone number"
            keyboardType="phone-pad"
            maxLength={10}
          />
          
        </Card>
         {/* ── Financial Details ── */}
        {/* <SectionHeader title="Financial Details" isDark={isDark} /> */}
        <Card isDark={isDark}>
          

          <FieldLabel text="Priority" isDark={isDark} />
          <View style={styles.starRow}>
            {[1, 2, 3].map(i => (
              <TouchableOpacity
                key={i}
                onPress={() => setPriority(priority === i ? 0 : i)}
                activeOpacity={0.7}
                style={styles.starBtn}>
                <Text style={[styles.star, i <= priority && styles.starActive]}>★</Text>
              </TouchableOpacity>
            ))}
            <Text style={[styles.priorityLabel, isDark && {color: D.textSecondaryDark}]}>
              {['Not set', 'Low', 'Medium', 'High'][priority]}
            </Text>
          </View>
        </Card>

      

        {/* ── Notes & Remarks ── */}
        {/* <SectionHeader title="Notes & Remarks" isDark={isDark} /> */}
        <Card isDark={isDark}>
           <FieldLabel text="Expected Closing Date" isDark={isDark} />
          <CalendarInput
            value={dateValue}
            onChange={v => setDateValue(v)}
            placeholder="Select closing date"
            styles={{input: [inp.base, isDark && inp.dark]}}
            COLORS={COLORS}
          />
          <FieldLabel text="Remark" isDark={isDark} />
          <StyledInput
            isDark={isDark}
            value={remark}
            onChangeText={setRemark}
            placeholder="Add a remark…"
            multiline
            style={{height: 90, textAlignVertical: 'top'}}
          />

          <FieldLabel text="Created By" isDark={isDark} />
          <ReadOnlyField value={opportunity.sale_person} isDark={isDark} />
        </Card>

        {/* ── Quick Actions ── */}
        {/* <SectionHeader title="Additional Actions" isDark={isDark} /> */}
        <View style={styles.chipGrid}>
          <ChipButton
            title="📋  Contact Info"
            color={D.indigo}
            isDark={isDark}
            onPress={() =>
              navigation.navigate(navigationString.CONTACTINFORMATION, {
                onSave: handleExtraInfoSave,
                data: opportunity,
              })
            }
          />
          <ChipButton
            title="💬  Remark"
            color={D.teal}
            isDark={isDark}
            onPress={() =>
              navigation.navigate(navigationString.PREVIEWEDITREMARK, {
                remarks: opportunity ?? [],
              })
            }
          />
        </View>
        <View style={[styles.chipGrid, {marginTop: D.sp.sm}]}>
          <ChipButton
            title="📝  Internal Notes"
            color={D.warning}
            isDark={isDark}
            onPress={() => setShowInternalNotes(p => !p)}
          />
          <ChipButton
            title="📋  Plan of Action"
            color={D.primary}
            isDark={isDark}
            onPress={() => navigation.navigate('PlanOfAction', {id})}
          />
          <ChipButton
            title="➕  New Enquiry"
            color={D.success}
            isDark={isDark}
            onPress={() => {
              if (opportunity) navigation.navigate('CreateEnquiryPage', opportunity);
              else Alert.alert('Error', 'Opportunity data is missing.');
            }}
          />
        </View>

        {/* Internal Notes Inline */}
        {showInternalNotes && (
          <Card isDark={isDark} style={{marginTop: D.sp.md}}>
            <FieldLabel text="Internal Notes" isDark={isDark} />
            <StyledInput
              isDark={isDark}
              value={internalNotesText}
              onChangeText={setInternalNotesText}
              placeholder="Add internal notes…"
              multiline
              style={{height: 100, textAlignVertical: 'top'}}
            />
          </Card>
        )}

        {/* ── Footer Buttons ── */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btnCancel, isDark && styles.btnCancelDark]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}>
            <Text style={[styles.btnCancelTxt, isDark && {color: D.textPrimaryDark}]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSave}
            onPress={handleSave}
            activeOpacity={0.8}>
            <Text style={styles.btnSaveTxt}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: D.sp.xxl}} />
      </ScrollView>

      {/* ── Modals ── */}
      <RemarkModal
        isVisible={openRemarkModal}
        onClose={handleRemarkClose}
        data={opportunity}
      />
      <Loader visible={isLoading} text="Saving changes…" />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: D.sp.lg,
    paddingBottom: D.sp.lg,
  },
  row: {
    flexDirection: 'row',
  },
  half: {
    flex: 1,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: D.sp.xs,
  },
  starBtn: {
    padding: D.sp.xs,
  },
  star: {
    fontSize: 28,
    color: '#CBD5E0',
  },
  starActive: {
    color: D.gold,
  },
  priorityLabel: {
    marginLeft: D.sp.sm,
    fontSize: D.fs.sm,
    fontWeight: '600',
    color: D.textSecondaryLight,
  },
  chipGrid: {
    flexDirection: 'row',
    gap: D.sp.sm,
  },
  footer: {
    flexDirection: 'row',
    gap: D.sp.md,
    marginTop: D.sp.xl,
  },
  btnCancel: {
    flex: 1,
    height: 52,
    borderRadius: D.r.md,
    borderWidth: 1.5,
    borderColor: D.borderLight,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelDark: {
    borderColor: D.borderDark,
    backgroundColor: D.surfaceDark,
  },
  btnCancelTxt: {
    fontSize: D.fs.md,
    fontWeight: '700',
    color: D.textPrimaryLight,
    letterSpacing: 0.3,
  },
  btnSave: {
    flex: 2,
    height: 52,
    borderRadius: D.r.md,
    backgroundColor: D.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: D.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  btnSaveTxt: {
    fontSize: D.fs.md,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default EditOpportunity;