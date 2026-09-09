// // Jamshed start 
// import React, {useState, useContext, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Alert,
//   ScrollView,
//   useColorScheme,
//   StyleSheet,
//   Modal,
//   TouchableOpacity,
//   TextInputComponent,
// } from 'react-native';
// import ModalDropdown from 'react-native-modal-dropdown';
// import {Calendar} from 'react-native-calendars';
// import {AuthContext} from './Context';
// import urls from '../../url';
// import HeaderCompo from '../components/HeaderCompo';
// import makeApiCall from '../utils/apiHelper';
// import SingleDropdown from '../components/SingleDropdown';
// import {COLORS} from '../styles/Colors';
// import TextinputCompo from '../components/TextinputCompo';
// import {useSelector} from 'react-redux';
// import ButtonCompo from '../components/ButtonCompo';
// import navigationString from '../route/navigationString';
// import QueryModal from '../components/Modaals/QueryModal';
// import Termandconditions from '../components/Modaals/Termandconditions';

// const CreateEnquiryPage = ({route, navigation}) => {
//   const opportunity = route.params;
//   const {
//     employee_division_name,
//     employee_division_id,
//     sale_person,
//     created_by,
//     id,
//     name,
//     phone,
//     sale_person_id,
//     customer_id,
//     customer_name,
//   } = route.params;

//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const createEnquiryUrl = server_origin + urls.createEnquiry;
//   const fetchDivisionUrl = server_origin + urls.fetchDivision;
//   const fetchCustomerUrl = server_origin + urls.fetchCustomer;
//   const fetchEnquiryTypeUrl = server_origin + urls.fetchEnquiryType;
//   const user = useSelector(state => state.user.userDatainfo);
//   // console.log(user?.result?.emp_code, 'User Data Info in Create Enquiry Page');
//   const resUser = user?.result?.res_user || {};

//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';

//   const [division, setDivision] = useState('');
//   const [customer, setCustomer] = useState(customer_id || '');
//   const [address, setAddress] = useState('');
//   const [enquiryType, setEnquiryType] = useState('');
//   const [enquiryDate, setEnquiryDate] = useState('');
//   const [divisionOptions, setDivisionOptions] = useState([]);
//   const [customerOptions, setCustomerOptions] = useState([]);
//   const [isCalendarVisible, setCalendarVisible] = useState(false);
//   const [enquiryTypeOptions, setEnquiryTypeOptions] = useState([]);
//   const [divisionInfo, setDivisionInfo] = useState([]);
//   const [selectedDivision, setSelectedDivision] = useState('');
//   const [selectedType, setSelectedType] = useState('');
//   const [userinfo, setuserinfo] = useState(customer_name || '');
//   const [salesPersonOptions, setSalesPersonOptions] = useState([]);
//   const [selectedSalesPerson, setSelectedSalesPerson] = useState('');
//   const [enquiry_date_field, setEnquiryDateField] = useState('');
//   const [accountholder, setaccountholder] = useState('');
//   const [accounholderId, setaccountholderId] = useState(null);
//   const [pricelist, setpricelist] = useState([]);
//   const [selectedpricelist, setselectedpricelist] = useState(null);
//   const [taglist, settaglist] = useState([]);
//   const [selectdetaglist, setselectedtaglist] = useState(null);
//   const [isVisibleQuery, setisVisibleQuery] = useState(false);
//   const [isOtherInfo, setisOtherInfo] = useState(false);
//   const [banklist, setbanklist] = useState([]);
//   const [selectedbankaccount, setselectedbankaccount] = useState(null);
//   const [querydata, setquerydata] = useState({});
//   const [termandcondition, settermandcondition] = useState(false);
//   const [termandconditiondata, settermandconditiondata] = useState({});
//   const [clientrefno, setclientrefno] = useState('');
//   const [costcenterlist, setcostcenterlist] = useState([]);
//   const [selectedCostCenter, setSelectedCostCenter] = useState(null);
//   const [Comments, setComments] = useState('');
//   const [opportunitydata, setopportunitydata] = useState([]);
//   const [selecetedopportunity, setselectedopportunity] = useState(null);

//   const [contactPersonList, setContactPersonList] = useState([]);
//   const [selectedContactPerson, setSelectedContactPerson] = useState(null);
//   const [contactPhone, setContactPhone] = useState('');
//   const [contactEmail, setContactEmail] = useState('');
//   console.log(querydata, 'querydata');

//   // console.log(costcenterlist);
//   // const [remarksparameter, setremarksparameter] = useState([]);
//   // const []
//   // console.log(employee_division_id, 'SALES');
//   // console.log(selectedDivision, 'SELCT');

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
//       // console.log(response,'Responce Me Bahut Kuck mila hai');
//       const divisionInfoData = response.result.map(item => ({
//         label: item.division_name,
//         value: item.division_id,
//       }));
//       setDivisionInfo(divisionInfoData);
//     } catch (error) {
//       console.log(error, 'Error fetching division info');
//     }
//   };
//   const fetchpricelist = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchpricelist,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {resUser},
//         },
//       );
      // console.log(response, 'pricelisttttt');
//       // console.log(response, 'Responce Me Bahut Kuck mila hai Price list m');
//       const divisionInfoData = response.result.map(item => ({
//         label: item.pricelist_name,
//         value: item.pricelist_id,
//       }));
//       setpricelist(divisionInfoData);
//     } catch (error) {
//       console.log(error, 'Error fetching PriceList info');
//     }
//   };
//   const fetchAccountlist = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetechbankdetails,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {resUser},
//         },
//       );
//       console.log(response, 'Responce Me Bahut Kuck mila hai Price list m');
//       const divisionInfoData = response.result.map(item => ({
//         label: item.bank_account_name,
//         value: item.bank_account_id,
//       }));
//       setbanklist(divisionInfoData);
//     } catch (error) {
//       console.log(error, 'Error fetching Account info');
//     }
//   };

//   const normalizeContactPersons = contact_person_details => {
//     if (!Array.isArray(contact_person_details)) return [];

//     return contact_person_details.flatMap(item => {
//       if (typeof item !== 'object' || item === null) return [];

//       return Object.values(item).map(person => ({
//         contact_id: person.id,
//         contact_name: person.name,
//         email: person.email !== false ? person.email : '',
//         mobile: person.mobile !== false ? person.mobile : '',
//         phone: person.phone || '',
//       }));
//     });
//   };

//   const fetchTermConditioperameter = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchtermsconditionsperameter,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {resUser},
//         },
//       );
//       console.log(response, 'Responce Me Bahut Kuck mila hai Price list m');
//       const divisionInfoData = response.result.map(item => ({
//         label: item.remark_parameter_name,
//         value: item.emark_parameter_id,
//       }));
//       setremarksparameter(divisionInfoData);
//     } catch (error) {
//       console.log(error, 'Error fetching Account info');
//     }
//   };
//   const fetchbugetryinfo = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchbugetry,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {resUser},
//         },
//       );
//       console.log(response, 'fetchbugetryinfo');
//       // const divisionInfoData = response.result.map(item => ({
//       //   label: item.division_name,
//       //   value: item.division_id,
//       // }));
//       // setDivisionInfo(divisionInfoData);
//     } catch (error) {
//       console.log(error, 'Error fetching fetchbugetryinfo info');
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
//   const fetchcontactpersion = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetccontactperson,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {resUser},
//         },
//       );
//       console.log(response, 'fetchtaginfo');
//       // const divisionInfoData = response.result.map(item => ({
//       //   label: item.division_name,
//       //   value: item.division_id,
//       // }));
//       // setDivisionInfo(divisionInfoData);
//     } catch (error) {
//       console.log(error, 'Error fetching fetchtaginfo info');
//     }
//   };

//   const fetchenqueryOpportunity = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.futchenqueryOpportunity,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {resUser},
//         },
//       );
//       // console.log(response, 'Responce  opportunity in enque');
//       const divisionInfoData = response.result.map(item => ({
//         label: item.opportunity_name,
//         value: item.opportunity_id,
//       }));
//       setopportunitydata(divisionInfoData);
//     } catch (error) {
//       console.log(error, 'Error fetching Opportunity info');
//     }
//   };
//   const fetchleadsCostCenter = async divisionId => {
//     console.log(
//       divisionId,

//       'Division ID in fetchCostCenter',
//     );
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fectcostcnter,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {
//             division_id: divisionId,
//           },
//         },
//       );
//       console.log(response, 'Cost Center  response');
//       const salesPersonData = response.result.map(item => ({
//         label: item.cost_center_name,
//         value: item.cost_center_id,
//       }));
//       setcostcenterlist(salesPersonData);

//       // setSalesPersonOptions(salesPersonData);
//       const matched = salesPersonData.find(p => p.value === resUser);
//       if (matched) {
//         setSelectedSalesPerson(matched.value);
//       }
//     } catch (error) {
//       console.error('Error fetching sales person data:', error);
//     }
//   };
//   const fetchsalespersion = async divisionId => {
//     console.log(
//       divisionId,
//       employee_division_id,
//       'Division ID in fetchsalespersion',
//     );
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchLeadSalePerson,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {
//             division: employee_division_id ? employee_division_id : divisionId,
//             empCode: user?.result?.emp_code,
//           },
//         },
//       );
//       // console.log(response, 'sales person response');
//       const salesPersonData = response.result.map(item => ({
//         label: item.person_name,
//         value: item.person_id,
//       }));

//       setSalesPersonOptions(salesPersonData);
//       const matched = salesPersonData.find(p => p.value === resUser);
//       if (matched) {
//         setSelectedSalesPerson(matched.value);
//       }
//     } catch (error) {
//       console.error('Error fetching sales person data:', error);
//     }
//   };
//   const fetchEngueryType = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchEnquiryType,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {},
//         },
//       );
//       // console.log(response.result[0].enquiry_type_data,'Responce Me Bahut Kuck mila hai naya naya');
//       const enquiryTypeData = response.result[0].enquiry_type_data.map(
//         item => ({
//           label: item[1],
//           value: item[0],
//         }),
//       );
//       // console.log(enquiryTypeData,'Enquiry Type Data');
//       setEnquiryTypeOptions(enquiryTypeData);
//     } catch (error) {
//       console.error('Error fetching enquiry type data:', error);
//     }
//   };

//   // const fetchCustomersdata = async () => {
//   //   try {
//   //     const response = await makeApiCall(
//   //       server_origin,
//   //       urls.fetchcustomerUrl,
//   //       'POST',
//   //       {
//   //         jsonrpc: '2.0',
//   //         method: 'call',
//   //         params: {salesPerson: selectedSalesPerson},
//   //       },
//   //     );
//   //     console.log(response, 'Customer Responsenew data---->>>>>>>>>');
//   //     if (response && response.result) {
//   //       const customerList = response.result.map(item => ({
//   //         label: item.customer_name,
//   //         value: item.customer_id,
//   //         address: item.customer_address,
//   //       }));
//   //       setCustomerOptions(customerList);
//   //     } else {
//   //       console.warn('No Customer found.');
//   //       Alert.alert('Warning', 'No Customer available.');
//   //       setCustomerOptions([]);
//   //     }
//   //   } catch (error) {
//   //     console.log(error, 'Error fetching Customer');
//   //   }
//   // };
//   const fetchCustomersdata = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchcustomerUrl,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {salesPerson: selectedSalesPerson},
//         },
//       );

//       console.log(response, 'Customer Responsenew data---->>>>>>>>>');

//       if (response?.result) {
//         const customerList = response.result.map(item => ({
//           label: item.customer_name,
//           value: item.customer_id,
//           address: item.customer_address,
//           contact_person_details: Array.isArray(item.contact_person_details)
//             ? item.contact_person_details
//             : [],
//         }));

//         setCustomerOptions(customerList);
//       } else {
//         setCustomerOptions([]);
//       }
//     } catch (error) {
//       console.log(error, 'Error fetching Customer');
//     }
//   };

//   const fetchAccountHolder = async (customerId, divisionId) => {
//     console.log('Fetching Account Holder...');
//     const startTime = Date.now();

//     const payload = {
//       selected_customerId: customerId,
//       division: divisionId ? parseInt(divisionId) : selectedDivision,
//     };

//     console.log(payload, 'Payload for Account Holder');

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

//   useEffect(() => {
//     if (customer_id && employee_division_id) {
//       fetchAccountHolder(customer_id, employee_division_id);
//     }
//   }, [customer_id, employee_division_id]);
//   useEffect(() => {
//     if (customerOptions.length > 0 && customer_id) {
//       const selectedCustomer = customerOptions.find(
//         c => c.value === customer_id,
//       );
//       if (selectedCustomer) {
//         setCustomer(customer_id);
//         const cleanedAddress =
//           selectedCustomer.address?.split('\n').slice(1).join('\n').trim() ||
//           '';

//         setAddress(cleanedAddress);

//         fetchAccountHolder(customer_id, employee_division_id);
//       }
//     }
//   }, [customerOptions, customer_id]);

//   useEffect(() => {
//     if (resUser) {
//       fetchpricelist();
//       fetchAccountlist();
//       fetchTermConditioperameter();
//       fetchbugetryinfo();
//       fetchtaginfo();
//       fetchcontactpersion();

//       fetchenqueryOpportunity();
//     }
//   }, [resUser]);
//   useEffect(() => {
//     if (employee_division_id) {
//       fetchleadsCostCenter(employee_division_id);
//     }
//   }, []);

//   const handleSubmit = async () => {
//     console.log(user?.result?.emp_code, 'Created By in Create Enquiry');
//     const finalDivision = selectedDivision || employee_division_id;
//     const finalDate = enquiryDate || enquiry_date_field;

//     if (
//       !finalDivision ||
//       !customer ||
//       !address ||
//       !selectedType ||
//       !finalDate
//     ) {
//       Alert.alert('Error', 'Please fill in all required fields.');
//       return;
//     }

//     const payload = {
//       jsonrpc: '2.0',
//       method: 'call',
//       params: {
//         division: Number(finalDivision),
//         customer,
//         address,
//         enquiry_type: selectedType,
//         enquiry_date: finalDate,
//         created_by: user?.result?.emp_code || emp_code,
//       },
//     };

//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.createEnquiry,
//         'POST',
//         payload,
//         {'Content-Type': 'application/json'},
//       );

//       console.log(response, 'Response from Enquiry Creation');
//       if (response?.result?.success === true) {
//         Alert.alert('Success', response?.result?.message);
//       } else {
//         Alert('Erroer');
//       }
//     } catch (error) {
//       console.error('Error creating enquiry:', error.message);
//       Alert.alert('Error', 'Failed to create enquiry.');
//     }
//   };

//   useEffect(() => {
//     const today = new Date().toISOString().split('T')[0];
//     setEnquiryDateField(today);

//     // fetchEnquiryTypeData();
//     fetchDevisioninfo();
//     fetchEngueryType();
//     // fetchcutomer()
//     // fetchsalespersion();
//     // fetchsalespersion()
//   }, []);
//   useEffect(() => {
//     if (employee_division_id) {
//       fetchsalespersion(employee_division_id);
//       fetchCustomersdata(employee_division_id);
//     } else if (selectedSalesPerson) {
//       fetchCustomersdata(selectedDivision);
//     } else if ((sale_person_id, employee_division_id)) {
//       fetchCustomersdata(employee_division_id);
//     }
//   }, [employee_division_id, selectedSalesPerson]);

//   const handleCancel = () => {
//     navigation.goBack();
//   };

//   const handleDateSelect = date => {
//     setEnquiryDate(date.dateString);
//     setCalendarVisible(false);
//   };
//   const addresses = customerOptions.map(item => {
//     const lines = item.address?.split('\n') || [];
//     lines.shift(); // remove customer name
//     return lines.join('\n').trim(); // join and clean
//   });
//   const selectedCustomer = customerOptions.find(c => c.value === customer);
//   const cleanedAddress = selectedCustomer
//     ? selectedCustomer.address.split('\n').slice(1).join('\n').trim()
//     : '';

//   const formattedContacts = contactPersonList.flatMap(item =>
//     Object.values(item).map(contact => ({
//       label: contact.name,
//       value: contact.id,
//       phone: contact.mobile || contact.phone || '',
//       email: contact.email || '',
//     })),
//   );

//   return (
//     <>
//       <HeaderCompo
//         title={'Create Enquiry'}
//         lefticon={require('../assets/back.png')}
//         onPress={() => navigation.goBack()}
//       />
//       <ScrollView
//         style={{
//           flex: 1,
//           backgroundColor: isDarkMode ? COLORS.black : COLORS.BACKGROUND,
//         }}>
//         <View
//           style={[
//             styles.container,
//             {backgroundColor: isDarkMode ? COLORS.black : COLORS.BACKGROUND},
//           ]}>
//           {/* <View style={styles.header}>
//         <Text style={styles.headerText}>Create Enquiry</Text>
//       </View> */}

//           {/* <View style={{ marginTop: 20 }} /> */}

//           <Text
//             style={{
//               ...styles.label,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Division
//           </Text>
//           {route.params.employee_division_name ? (
//             <TextinputCompo
//               value={route.params.employee_division_name}
//               style={{...styles.inputBox}}
//             />
//           ) : (
//             <SingleDropdown
//               data={divisionInfo}
//               value={selectedDivision}
//               onChange={item => {
//                 setSelectedDivision(item.value);
//                 fetchsalespersion(item.value);
//                 fetchleadsCostCenter(item.value);
//                 fetchCustomersdata(item.value);
//               }}
//               placeholder="Select Division"
//               isDarkMode={false}
//             />
//           )}
//           <Text
//             style={{
//               ...styles.label,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Sales Person
//           </Text>
//           <SingleDropdown
//             data={salesPersonOptions}
//             value={selectedSalesPerson}
//             onChange={item => {
//               setSelectedSalesPerson(item.value);
//             }}
//             placeholder="Select Sales Person"
//             isDarkMode={false}
//           />

//           <Text
//             style={{
//               ...styles.label,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Enquiry Type
//           </Text>
//           <SingleDropdown
//             data={enquiryTypeOptions}
//             value={selectedType}
//             onChange={item => setSelectedType(item.value)}
//             placeholder="Select Enquiry Type"
//             isDarkMode={false}
//           />

//           <Text
//             style={{
//               ...styles.label,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Customer
//           </Text>
//           <SingleDropdown
//             data={customerOptions}
//             value={customer}
//             onChange={item => {
//               setCustomer(item.value);

//               const cleaned =
//                 item.address?.split('\n').slice(1).join('\n').trim() || '';
//               setAddress(cleaned);

//               // ✅ HANDLE CONTACT PERSON DATA
//               const contacts = item.contact_person_details ?? [];
//               setContactPersonList(contacts);
//               setSelectedContactPerson(null);
//               setContactPhone('');
//               setContactEmail('');

//               fetchAccountHolder(
//                 item.value,
//                 selectedDivision || employee_division_id,
//               );
//             }}
//             placeholder="Select Customer"
//             isDarkMode={false}
//           />

//           <Text
//             style={{
//               ...styles.label,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Client Ref No:
//           </Text>
//           <TextinputCompo
//             placeholder="Clent Ref No"
//             style={[styles.inputBox]}
//             value={clientrefno}
//             onChangeText={item => setclientrefno(item)}
//           />
//           {
//             <>
//               <Text
//                 style={{
//                   ...styles.label,
//                   color: isDarkMode ? COLORS.white : COLORS.black,
//                 }}>
//                 Cost Center
//               </Text>
//               <SingleDropdown
//                 data={costcenterlist}
//                 placeholder="Select an option"
//                 value={selectedCostCenter}
//                 onChange={item => setSelectedCostCenter(item.value)}
//               />
//             </>
//           }

//           <Text
//             style={{
//               ...styles.label,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Account Holder
//           </Text>
//           <TextinputCompo
//             placeholder={'account holder'}
//             value={accountholder}
//             style={[styles.inputBox]}
//             onChangeText={setaccountholder}
//             editable={false}
//           />

//           {/* <ModalDropdown
//         options={divisionOptions}
//         onSelect={(index, value) => setDivision(value)}
//         onDropdownWillShow={fetchDivisionData}
//         style={[styles.inputBox, isDarkMode && styles.inputBoxDark]}
//         textStyle={{ color: isDarkMode ? '#fff' : '#000' }}
//         dropdownTextStyle={{ fontSize: 16, color: '#000' }}
//         dropdownStyle={{ width: '85%', height: 'auto' }}
//         defaultValue="Select Division"
//       /> */}
//           {/* <Text style={styles.label}>Customer</Text> */}
//           {/* <ModalDropdown
//         options={customerOptions.map(customer => customer.name)}
//         onSelect={(index, value) => {
//           const selectedCustomer = customerOptions[index];
//           setCustomer(selectedCustomer.name);
//           setAddress(selectedCustomer.address);
//         }}
//         onDropdownWillShow={fetchCustomerData}
//         style={[styles.inputBox, isDarkMode && styles.inputBoxDark]}
//         textStyle={{ color: isDarkMode ? '#fff' : '#000' }}
//         dropdownTextStyle={{ fontSize: 16, color: '#000' }}
//         dropdownStyle={{ width: '85%', height: 'auto' }}
//         defaultValue="Select Customer"
//       /> */}
//           <Text
//             style={{
//               ...styles.label,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Address
//           </Text>
//           <TextInput
//             value={address}
//             onChangeText={setAddress}
//             style={[styles.inputBox]}
//             editable={false}
//             placeholder="Enter address"
//             placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
//           />
//           {/* <Text style={styles.label}>Enquiry Type</Text> */}
//           {/* <ModalDropdown
//         options={enquiryTypeOptions.map(option => option[1])}
//         onSelect={(index) => setEnquiryType(enquiryTypeOptions[index][0])}
//         onDropdownWillShow={fetchEnquiryTypeData}
//         style={[styles.inputBox, isDarkMode && styles.inputBoxDark]}
//         textStyle={{ color: isDarkMode ? '#fff' : '#000' }}
//         dropdownTextStyle={{ fontSize: 16, color: '#000' }}
//         dropdownStyle={{ width: '85%', height: 'auto' }}
//         defaultValue="Select Enquiry Type"
//       /> */}
//           <Text
//             style={{
//               ...styles.label,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Enquiry Date
//           </Text>
//           <TouchableOpacity onPress={() => setCalendarVisible(true)}>
//             {route.params.employee_division_name ? (
//               <TextinputCompo
//                 value={enquiry_date_field}
//                 editable={false}
//                 placeholder="YYYY-MM-DD"
//                 style={styles.inputBox}
//                 placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
//               />
//             ) : (
//               <TextInput
//                 value={enquiryDate}
//                 editable={false}
//                 placeholder="YYYY-MM-DD"
//                 style={[styles.inputBox]}
//                 placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
//               />
//             )}
//           </TouchableOpacity>

//           <Text
//             style={{
//               ...styles.label,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Pricelist
//           </Text>
//           <SingleDropdown
//             data={pricelist}
//             placeholder="Select an option"
//             value={selectedpricelist}
//             onChange={item => setselectedpricelist(item.value)}
//           />
//           <Text
//             style={{
//               ...styles.label,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Opportunity
//           </Text>
//           <SingleDropdown
//             data={opportunitydata}
//             placeholder="Select an option"
//             value={selecetedopportunity}
//             onChange={item => setselectedopportunity(item.value)}
//           />
//           <Text
//             style={{
//               ...styles.label,
//               color: isDarkMode ? COLORS.white : COLORS.black,
//             }}>
//             Comments
//           </Text>
//           <TextinputCompo
//             placeholder="Comments"
//             style={[styles.inputBox, {height: 80}]}
//             multiline={true}
//             numberOfLines={4}
//             value={Comments}
//             onChangeText={item => setComments(item)}

//             // onChange={item => setSelectedValue(item.value)}
//           />

//           {isOtherInfo && (
//             <>
//               <Text
//                 style={{
//                   ...styles.label,
//                   color: isDarkMode ? COLORS.white : COLORS.black,
//                 }}>
//                 Other Information
//               </Text>
//               <SingleDropdown
//                 data={banklist}
//                 placeholder="Select an option"
//                 onChange={item => setselectedbankaccount(item.value)}
//                 value={selectedbankaccount}
//               />

              
//               {formattedContacts.length > 0 && (
//                 <>
//                   <Text
//                 style={{
//                   ...styles.label,
//                   color: isDarkMode ? COLORS.white : COLORS.black,
//                 }}>
//                 Contact Person
//               </Text>
//                 <SingleDropdown
//                   data={formattedContacts}
//                   placeholder="Select Contact Person"
//                   value={selectedContactPerson}
//                   onChange={item => {
//                     console.log('Selected item 👉', item);

//                     const selected = formattedContacts[item._index];

//                     setSelectedContactPerson(selected.value);
//                     setContactPhone(selected.phone);
//                     setContactEmail(selected.email);
//                   }}
//                 />
//                 </>
//               ) }
// <Text
//                 style={{
//                   ...styles.label,
//                   color: isDarkMode ? COLORS.white : COLORS.black,
//                 }}>
//                 Contact Person Phone
//               </Text>
//               <TextinputCompo
//                 placeholder={'Contact Person Phone'}
//                 style={[styles.inputBox]}
//                 value={contactPhone}
//                 editable={false}
//               />
//               <Text
//                 style={{
//                   ...styles.label,
//                   color: isDarkMode ? COLORS.white : COLORS.black,
//                 }}>
//                 Contact Person Email
//               </Text>
//               <TextinputCompo
//                 placeholder={'Contact Person Email'}
//                 style={[styles.inputBox]}
//                 editable={false}
//                 value={contactEmail}
//               />
//             </>
//           )}
//           <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//             <ButtonCompo
//               title="Add Enquiry"
//               style={{width: '45%'}}
//               onPress={() => {
//                 const finalDivision = selectedDivision || employee_division_id;
//                 const finalDate = enquiryDate || enquiry_date_field;
//                 console.log(
//                   finalDivision,
//                   customer,
//                   address,
//                   selectedType,
//                   finalDate,
//                   'Final Values before navigation',
//                 );
//                 if (
//                   !finalDivision ||
//                   !customer ||
//                   !address ||
//                   !selectedType ||
//                   !finalDate
//                 ) {
//                   Alert.alert('Error', 'Please fill in all required fields.');
//                   return;
//                 }

//                 navigation.navigate(navigationString.ADDENQUERY, {
//                   division: Number(finalDivision),
//                   customer,
//                   address,
//                   enquiry_type: selectedType,
//                   enquiry_date: finalDate,
//                   created_by: user?.result?.emp_code || emp_code.id,
//                   sales_person_id: selectedSalesPerson,
//                   userinfo,
//                   back_account: selectedbankaccount,
//                   Query: querydata,
//                   termandcondition: termandconditiondata,
//                   pricelist: selectedpricelist,
//                   cost_center_id: selectedCostCenter,
//                   client_ref_no: clientrefno,
//                   account_holder_id: accounholderId,
//                   Comments: Comments,
//                   opportunity_id: selecetedopportunity,
//                   contact_person: selectedContactPerson,
//                   contact_phone: contactPhone,
//                   contact_email: contactEmail,
//                 });
//               }}
//             />
//             <ButtonCompo
//               title="Other Information"
//               style={{width: '45%'}}
//               onPress={() => setisOtherInfo(true)}
//             />
//           </View>
//           <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//             <ButtonCompo
//               title="Query"
//               // onPress={() => navigation.navigate(navigationString.QUERY)}
//               onPress={() => setisVisibleQuery(true)}
//               style={{width: '45%'}}
//             />

//             <ButtonCompo
//               title="Term and condition"
//               onPress={() =>
//                 // navigation.navigate(navigationString.TERMANDCONDITION)
//                 settermandcondition(true)
//               }
//               style={{width: '45%'}}
//             />
//           </View>
//           <Modal
//             visible={isCalendarVisible}
//             transparent={true}
//             animationType="slide">
//             <View style={styles.modalContainer}>
//               <View style={styles.calendarContainer}>
//                 <Calendar
//                   onDayPress={handleDateSelect}
//                   markedDates={{
//                     [enquiryDate]: {selected: true, selectedColor: 'blue'},
//                   }}
//                 />
//                 <TouchableOpacity
//                   onPress={() => setCalendarVisible(false)}
//                   style={styles.closeButton}>
//                   <Text style={styles.closeButtonText}>Close</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Modal>
//           <QueryModal
//             isvisible={isVisibleQuery}
//             onclose={() => setisVisibleQuery(false)}
//             onSave={data => {
//               console.log('RECEIVED FROM MODAL:', data);
//               setquerydata(data);
//             }}
//           />
//           <Termandconditions
//             isvisible={termandcondition}
//             onclose={() => settermandcondition(false)}
//             onSave={data => {
//               console.log('RECEIVED FROM termmmmmmmmm:', data);
//               settermandconditiondata(data);
//             }}
//             // remarksparameter={remarksparameter}
//           />

//           {/* <View style={{ marginTop: 20 }}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('EnquiryLinesPage')}
//           style={[styles.enquiryLinesButton]}>
//           <Text style={styles.buttonText}>Enquiry Lines</Text>
//         </TouchableOpacity>
//       </View> */}

//           {/* <View style={styles.buttonContainer}>
//             <TouchableOpacity onPress={handleCancel} style={[styles.button, styles.cancelButton]}>
//               <Text style={styles.buttonText}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={handleSubmit} style={[styles.button, styles.saveButton]}>
//               <Text style={styles.buttonText}>Save</Text>
//             </TouchableOpacity>
//           </View> */}
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
//   header: {
//     backgroundColor: 'blue',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   headerText: {
//     fontSize: 24,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   label: {
//     // marginVertical: 5,
//     color: 'black',
//     fontWeight: 'bold',
//   },
//   inputBox: {
//     borderWidth: 1,
//     borderColor: '#888',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     marginBottom: 15,
//     backgroundColor: '#fff',
//     color: COLORS.black,
//   },
//   inputBoxDark: {
//     backgroundColor: '#555',
//     color: 'white',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   button: {
//     flex: 1,
//     padding: 10,
//     alignItems: 'center',
//     borderRadius: 5,
//   },
//   cancelButton: {
//     backgroundColor: 'blue',
//     marginRight: 10,
//   },
//   saveButton: {
//     backgroundColor: 'blue',
//     marginLeft: 10,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   calendarContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     width: '90%',
//   },
//   closeButton: {
//     marginTop: 10,
//     alignSelf: 'center',
//     padding: 10,
//     backgroundColor: 'blue',
//     borderRadius: 5,
//   },
//   closeButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   enquiryLinesButton: {
//     backgroundColor: 'blue',
//     paddingVertical: 10,
//     alignItems: 'center',
//     borderRadius: 5,
//     marginTop: 10,
//   },
// });

// export default CreateEnquiryPage;
// // Jamshed end 


// ─────────────────────────────────────────────────────────────
//  CreateEnquiryPage.jsx  –  Modern UI + Smart Buttons
// ─────────────────────────────────────────────────────────────

import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, Alert, ScrollView,
  useColorScheme, StyleSheet, Modal, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AuthContext } from './Context';
import urls from '../../url';
import HeaderCompo from '../components/HeaderCompo';
import makeApiCall from '../utils/apiHelper';
import SingleDropdown from '../components/SingleDropdown';
import { COLORS } from '../styles/Colors';
import TextinputCompo from '../components/TextinputCompo';
import { useSelector } from 'react-redux';
import navigationString from '../route/navigationString';
import QueryModal from '../components/Modaals/QueryModal';
import Termandconditions from '../components/Modaals/Termandconditions';

// ─── Constants ─────────────────────────────────────────────────
const TODAY = new Date().toISOString().split('T')[0];

const THEME = {
  primary:       '#1a56db',
  primaryLight:  '#e6f1fb',
  primaryBorder: '#b5d4f4',
  primaryText:   '#0c447c',
  success:       '#0f6e56',
  successLight:  '#e1f5ee',
  successBorder: '#9fe1cb',
  successText:   '#085041',
  danger:        '#e24b4a',
  dangerLight:   '#fcebeb',
  dangerBorder:  '#f7c1c1',
  amber:         '#ba7517',
  amberLight:    '#faeeda',
  amberBorder:   '#fac775',
};

// ─── Helpers ───────────────────────────────────────────────────
const toOptions = (list = [], labelKey, valueKey) =>
  Array.isArray(list)
    ? list.map(i => ({ label: i[labelKey], value: i[valueKey] }))
    : [];

const normalizeContacts = (details = []) => {
  if (!Array.isArray(details)) return [];
  return details.flatMap(item => {
    if (!item || typeof item !== 'object') return [];
    return Object.values(item).map(p => ({
      label: p.name ?? '',
      value: p.id,
      phone: p.mobile || p.phone || '',
      email: p.email !== false ? (p.email ?? '') : '',
    }));
  });
};

// ─── Sub-components ────────────────────────────────────────────

const ProgressBar = ({ percent, isDark }) => (
  <View style={{ marginBottom: 16 }}>
    <View style={[S.progressTrack, isDark && { backgroundColor: '#2a2a2a' }]}>
      <View style={[S.progressFill, { width: `${percent}%` }]} />
    </View>
    <Text style={[S.progressLabel, isDark && { color: '#666' }]}>
      Form {percent}% complete
    </Text>
  </View>
);

const FormCard = ({ children, isDark }) => (
  <View style={[S.card, isDark && S.cardDark]}>{children}</View>
);

const SectionHeader = ({ title, color = THEME.primary, isDark }) => (
  <View style={S.sectionRow}>
    <View style={[S.sectionDot, { backgroundColor: color }]} />
    <Text style={[S.sectionTitle, isDark && { color: '#888' }]}>{title}</Text>
    <View style={[S.sectionLine, isDark && { backgroundColor: '#333' }]} />
  </View>
);

const Label = ({ text, required, isDark }) => (
  <Text style={[S.label, isDark && { color: '#ccc' }]}>
    {text}
    {required && <Text style={{ color: THEME.danger }}> *</Text>}
  </Text>
);

const PrefilledField = ({ value, placeholder, isDark, badge }) => (
  <View style={[S.prefilledBox, isDark && S.prefilledBoxDark]}>
    <Text
      style={[
        S.prefilledText,
        !value && S.placeholderText,
        isDark && { color: value ? '#7ab8f5' : '#555' },
      ]}
      numberOfLines={2}>
      {value || placeholder}
    </Text>
    {badge && (
      <View style={S.prefillBadge}>
        <Text style={S.prefillBadgeText}>{badge}</Text>
      </View>
    )}
  </View>
);

/** Smart button with icon slot, subtitle, done-state color flip */
const SmartButton = ({ title, subtitle, icon, variant = 'outline', done, onPress, style }) => {
  const variants = {
    primary: { bg: THEME.primary,      border: THEME.primary,       text: '#fff',          iconBg: 'rgba(255,255,255,0.2)' },
    outline: { bg: 'transparent',      border: '#ddd',              text: '#333',          iconBg: '#f0f0f0' },
    success: { bg: THEME.successLight, border: THEME.successBorder, text: THEME.successText, iconBg: THEME.successBorder },
    danger:  { bg: THEME.dangerLight,  border: THEME.dangerBorder,  text: THEME.danger,    iconBg: THEME.dangerBorder },
    amber:   { bg: THEME.amberLight,   border: THEME.amberBorder,   text: THEME.amber,     iconBg: THEME.amberBorder },
  };
  const v = done
    ? { bg: THEME.successLight, border: THEME.successBorder, text: THEME.successText, iconBg: THEME.successBorder }
    : (variants[variant] ?? variants.outline);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[S.smartBtn, { backgroundColor: v.bg, borderColor: v.border }, style]}>
      {icon ? (
        <View style={[S.smartBtnIcon, { backgroundColor: v.iconBg }]}>
          <Text style={{ fontSize: 13, color: v.text }}>{done ? '✓' : icon}</Text>
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={[S.smartBtnTitle, { color: v.text }]}>
          {done ? `${title} saved` : title}
        </Text>
        {subtitle && !done ? (
          <Text style={[S.smartBtnSub, { color: v.text }]}>{subtitle}</Text>
        ) : null}
      </View>
      {done ? <Text style={{ color: v.text, fontSize: 12, marginLeft: 4 }}>✓</Text> : null}
    </TouchableOpacity>
  );
};

// ─── Main Component ────────────────────────────────────────────
const CreateEnquiryPage = ({ route, navigation }) => {
  const {
    employee_division_name,
    employee_division_id,
    customer_id,
    customer_name,
  } = route.params ?? {};

  const { currentUrl: server_origin } = useContext(AuthContext);
  const user    = useSelector(s => s.user.userDatainfo);
  const resUser = user?.result?.res_user ?? {};
  const empCode = user?.result?.emp_code;
  const isDark  = useColorScheme() === 'dark';

  // ── List state ─────────────────────────────────────────────
  const [divisionInfo,       setDivisionInfo]       = useState([]);
  const [salesPersonOptions, setSalesPersonOptions] = useState([]);
  const [enquiryTypeOptions, setEnquiryTypeOptions] = useState([]);
  const [customerOptions,    setCustomerOptions]    = useState([]);
  const [pricelist,          setPricelist]          = useState([]);
  const [banklist,           setBanklist]           = useState([]);
  const [opportunitydata,    setOpportunitydata]    = useState([]);
  const [costcenterlist,     setCostcenterlist]     = useState([]);

  // ── Form state ─────────────────────────────────────────────
  const [selectedDivision,       setSelectedDivision]       = useState('');
  const [selectedSalesPerson,    setSelectedSalesPerson]    = useState('');
  const [selectedType,           setSelectedType]           = useState('');
  const [customer,               setCustomer]               = useState(customer_id ?? '');
  const [address,                setAddress]                = useState('');
  const [accountholder,          setAccountholder]          = useState('');
  const [accountholderId,        setAccountholderId]        = useState(null);
  const [enquiryDate,            setEnquiryDate]            = useState('');
  const [enquiry_date_field]                                = useState(TODAY);
  const [selectedpricelist,      setSelectedpricelist]      = useState(null);
  const [selectedbankaccount,    setSelectedbankaccount]    = useState(null);
  const [selectedCostCenter,     setSelectedCostCenter]     = useState(null);
  const [selecetedopportunity,   setSelectedopportunity]    = useState(null);
  const [clientrefno,            setClientrefno]            = useState('');
  const [Comments,               setComments]               = useState('');

  // ── Contact state ──────────────────────────────────────────
  const [contactPersonList,     setContactPersonList]     = useState([]);
  const [selectedContactPerson, setSelectedContactPerson] = useState(null);
  const [contactPhone,          setContactPhone]          = useState('');
  const [contactEmail,          setContactEmail]          = useState('');

  // ── UI toggles ─────────────────────────────────────────────
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [isVisibleQuery,    setIsVisibleQuery]   = useState(false);
  const [isOtherInfo,       setIsOtherInfo]      = useState(false);
  const [termandcondition,  setTermandcondition] = useState(false);
  const [querydata,         setQuerydata]        = useState({});
  const [termdata,          setTermdata]         = useState({});

  // ── Progress ───────────────────────────────────────────────
  const progressFields = [
    selectedDivision || employee_division_id,
    selectedType,
    customer,
    address,
    enquiryDate || enquiry_date_field,
  ];
  const progressPercent = Math.round(
    (progressFields.filter(Boolean).length / progressFields.length) * 100,
  );

  // ─── API helper ──────────────────────────────────────────────
  const apiPost = useCallback(
    (endpoint, params) =>
      makeApiCall(server_origin, endpoint, 'POST', { jsonrpc: '2.0', method: 'call', params }),
    [server_origin],
  );

  // ─── Fetch functions ─────────────────────────────────────────
  const fetchDivisionInfo  = useCallback(async () => {
    try { const r = await apiPost(urls.fetchleadsDivision, { resUser }); setDivisionInfo(toOptions(r.result, 'division_name', 'division_id')); } catch {}
  }, [apiPost, resUser]);

  const fetchEnquiryTypes  = useCallback(async () => {
    try { const r = await apiPost(urls.fetchEnquiryType, {}); setEnquiryTypeOptions((r?.result?.[0]?.enquiry_type_data ?? []).map(([v, l]) => ({ label: l, value: v }))); } catch {}
  }, [apiPost]);

  const fetchPricelist     = useCallback(async () => {
    try { const r = await apiPost(urls.fetchpricelist, { resUser }); setPricelist(toOptions(r.result, 'pricelist_name', 'pricelist_id')); } catch {}
  }, [apiPost, resUser]);

  const fetchBanklist      = useCallback(async () => {
    try { const r = await apiPost(urls.fetechbankdetails, { resUser }); setBanklist(toOptions(r.result, 'bank_account_name', 'bank_account_id')); } catch {}
  }, [apiPost, resUser]);

  const fetchOpportunities = useCallback(async () => {
    try { const r = await apiPost(urls.futchenqueryOpportunity, { resUser }); setOpportunitydata(toOptions(r.result, 'opportunity_name', 'opportunity_id')); } catch {}
  }, [apiPost, resUser]);

  const fetchCostCenter    = useCallback(async divId => {
    if (!divId) return;
    try { const r = await apiPost(urls.fectcostcnter, { division_id: divId }); setCostcenterlist(toOptions(r.result, 'cost_center_name', 'cost_center_id')); } catch {}
  }, [apiPost]);

  const fetchSalesPerson   = useCallback(async divId => {
    const id = employee_division_id ?? divId;
    if (!id) return;
    try {
      const r = await apiPost(urls.fetchLeadSalePerson, { division: id, empCode });
      const opts = toOptions(r.result, 'person_name', 'person_id');
      setSalesPersonOptions(opts);
      const match = opts.find(p => p.value === resUser);
      if (match) setSelectedSalesPerson(match.value);
    } catch {}
  }, [apiPost, employee_division_id, empCode, resUser]);

  const fetchCustomers     = useCallback(async () => {
    try {
      const r = await apiPost(urls.fetchcustomerUrl, { salesPerson: selectedSalesPerson });
      if (!r?.result) { setCustomerOptions([]); return; }
      setCustomerOptions(r.result.map(i => ({
        label: i.customer_name,
        value: i.customer_id,
        address: i.customer_address ?? '',
        contact_person_details: Array.isArray(i.contact_person_details) ? i.contact_person_details : [],
      })));
    } catch {}
  }, [apiPost, selectedSalesPerson]);

  const fetchAccountHolder = useCallback(async (customerId, divisionId) => {
    const divId = divisionId ? parseInt(divisionId, 10) : selectedDivision;
    if (!customerId || !divId) return;
    try {
      const r = await apiPost(urls.fetchAccountHolder, { selected_customerId: customerId, division: divId });
      if (r?.result?.length > 0) {
        setAccountholder(r.result[0].account_holder_name);
        setAccountholderId(r.result[0].account_holder_id);
      }
    } catch {}
  }, [apiPost, selectedDivision]);

  // ─── Effects ─────────────────────────────────────────────────
  useEffect(() => {
    fetchDivisionInfo(); fetchEnquiryTypes();
    if (resUser) { fetchPricelist(); fetchBanklist(); fetchOpportunities(); }
  }, []);

  useEffect(() => {
    if (employee_division_id) { fetchSalesPerson(employee_division_id); fetchCostCenter(employee_division_id); }
  }, [employee_division_id]);

  useEffect(() => {
    if (employee_division_id || selectedSalesPerson) fetchCustomers();
  }, [employee_division_id, selectedSalesPerson]);

  // Prefill customer once list is loaded
  useEffect(() => {
    if (!customer_id || !customerOptions.length) return;
    const found = customerOptions.find(c => c.value === customer_id);
    if (!found) return;
    setCustomer(customer_id);
    setAddress(found.address?.split('\n').slice(1).join('\n').trim() ?? '');
    setContactPersonList(found.contact_person_details ?? []);
    fetchAccountHolder(customer_id, employee_division_id);
  }, [customerOptions]);

  useEffect(() => {
    if (customer_id && employee_division_id) fetchAccountHolder(customer_id, employee_division_id);
  }, [customer_id, employee_division_id]);

  // ─── Derived ─────────────────────────────────────────────────
  const formattedContacts = normalizeContacts(contactPersonList);
  const finalDivision     = selectedDivision || employee_division_id;
  const finalDate         = enquiryDate || enquiry_date_field;
  const queryDone         = Object.keys(querydata).length > 0;
  const termDone          = Object.keys(termdata).length > 0;

  // ─── Handlers ────────────────────────────────────────────────
  const handleCustomerChange = item => {
    setCustomer(item.value);
    setAddress(item.address?.split('\n').slice(1).join('\n').trim() ?? '');
    setContactPersonList(item.contact_person_details ?? []);
    setSelectedContactPerson(null); setContactPhone(''); setContactEmail('');
    fetchAccountHolder(item.value, finalDivision);
  };

  const handleContactChange = item => {
    const found = formattedContacts.find(c => c.value === item.value);
    if (!found) return;
    setSelectedContactPerson(found.value);
    setContactPhone(found.phone);
    setContactEmail(found.email);
  };

  const validate = () => {
    if (!finalDivision) return 'Please select a Division.';
    if (!customer)      return 'Please select a Customer.';
    // if (!address)       return 'Customer address is missing.';
    if (!selectedType)  return 'Please select an Enquiry Type.';
    // if (!finalDate)     return 'Please select an Enquiry Date.';
    // if(!selectedType)       return 'Please add Query details.';
    return null;
  };

  const handleAddEnquiry = () => {
    const err = validate();
    if (err) { Alert.alert('Missing Fields', err); return; }
    navigation.navigate(navigationString.ADDENQUERY, {
      division:          Number(finalDivision),
      customer,
      address,
      enquiry_type:      selectedType,
      enquiry_date:      finalDate,
      created_by:        empCode,
      sales_person_id:   selectedSalesPerson,
      userinfo:          customer_name ?? '',
      back_account:      selectedbankaccount,
      Query:             querydata,
      termandcondition:  termdata,
      pricelist:         selectedpricelist,
      cost_center_id:    selectedCostCenter,
      client_ref_no:     clientrefno,
      account_holder_id: accountholderId,
      Comments,
      opportunity_id:    selecetedopportunity,
      contact_person:    selectedContactPerson,
      contact_phone:     contactPhone,
      contact_email:     contactEmail,
    });
  };

  // ─── Render ──────────────────────────────────────────────────
  const bg = isDark ? '#111' : '#f4f4f4';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <HeaderCompo
        title="Create Enquiry"
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: bg }}
        contentContainerStyle={S.scroll}
        keyboardShouldPersistTaps="handled">

        {/* <ProgressBar percent={progressPercent} isDark={isDark} /> */}

        {/* ── BASIC INFO ─────────────────────── */}
        {/* <SectionHeader title="Basic Information" isDark={isDark} /> */}
        <FormCard isDark={isDark}>
          <Label text="Division" required isDark={isDark} />
          {employee_division_name
            ? <PrefilledField value={employee_division_name} badge="Pre-filled" isDark={isDark} />
            : <SingleDropdown data={divisionInfo} value={selectedDivision} placeholder="Select Division" isDarkMode={isDark}
                onChange={item => { setSelectedDivision(item.value); fetchSalesPerson(item.value); fetchCostCenter(item.value); fetchCustomers(); }} />}

          <Label text="Enquiry Type" required isDark={isDark} />
          <SingleDropdown data={enquiryTypeOptions} value={selectedType} placeholder="Select Enquiry Type" isDarkMode={isDark}
            onChange={item => setSelectedType(item.value)} />

          <Label text="Sales Person" isDark={isDark} />
          <SingleDropdown data={salesPersonOptions} value={selectedSalesPerson} placeholder="Select Sales Person" isDarkMode={isDark}
            onChange={item => setSelectedSalesPerson(item.value)} />
        </FormCard>

        {/* ── CUSTOMER ──────────────────────── */}
        {/* <SectionHeader title="Customer Details" color={THEME.success} isDark={isDark} /> */}
        <FormCard isDark={isDark}>
          <Label text="Customer"  isDark={isDark} required />
          <SingleDropdown data={customerOptions} value={customer} placeholder="Select Customer" isDarkMode={isDark}
            onChange={handleCustomerChange} />

          <Label text="Address"  isDark={isDark} />
          <TextInput
            value={address}
            onChangeText={setAddress}
            editable={false}
            multiline
            placeholder="Auto-filled from customer selection"
            placeholderTextColor={isDark ? '#555' : '#bbb'}
            style={[S.textarea, isDark && S.inputDark]}
          />

          <View style={S.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Label text="Account Holder" isDark={isDark} />
              <PrefilledField value={accountholder} placeholder="Auto-filled" badge="Auto" isDark={isDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Label text="Client Ref No." isDark={isDark} />
              <TextinputCompo
                placeholder="Enter ref no."
                style={[S.input, isDark && S.inputDark]}
                value={clientrefno}
                onChangeText={setClientrefno}
              />
            </View>
          </View>
        </FormCard>

        {/* ── ADDITIONAL ────────────────────── */}
        {/* <SectionHeader title="Additional Details" color={THEME.amber} isDark={isDark} /> */}
        <FormCard isDark={isDark}>
          <View style={S.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Label text="Enquiry Date"  isDark={isDark} />
              <TouchableOpacity
                onPress={() => setCalendarVisible(true)}
                style={[S.dateBtn, isDark && S.inputDark]}>
                <Text style={[S.dateBtnText, isDark && { color: '#ddd' }]}>{finalDate}</Text>
                <Text style={{ fontSize: 15 }}>📅</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Label text="Cost Center" isDark={isDark} />
              <SingleDropdown data={costcenterlist} value={selectedCostCenter} placeholder="Select" isDarkMode={isDark}
                onChange={item => setSelectedCostCenter(item.value)} />
            </View>
          </View>

          <Label text="Pricelist" isDark={isDark} />
          <SingleDropdown data={pricelist} value={selectedpricelist} placeholder="Select Pricelist" isDarkMode={isDark}
            onChange={item => setSelectedpricelist(item.value)} />

          <Label text="Opportunity" isDark={isDark} />
          <SingleDropdown data={opportunitydata} value={selecetedopportunity} placeholder="Link an Opportunity" isDarkMode={isDark}
            onChange={item => setSelectedopportunity(item.value)} />

          <Label text="Comments" isDark={isDark} />
          <TextinputCompo
            placeholder="Add notes or remarks…"
            style={[S.input, isDark && S.inputDark, { height: 80 }]}
            multiline
            numberOfLines={4}
            value={Comments}
            onChangeText={setComments}
          />
        </FormCard>

        {/* ── OTHER INFO (expandable) ────────── */}
        <TouchableOpacity
          onPress={() => setIsOtherInfo(v => !v)}
          style={[S.expandBtn, isDark && S.expandBtnDark]}>
          <Text style={[S.expandBtnText, isDark && { color: '#ccc' }]}>
            {isOtherInfo ? '▲  Hide other information' : '▼  Other information'}
          </Text>
        </TouchableOpacity>

        {isOtherInfo && (
          <>
            {/* <SectionHeader title="Other Information" isDark={isDark} /> */}
            <FormCard isDark={isDark}>
              <Label text="Bank Account" isDark={isDark} />
              <SingleDropdown data={banklist} value={selectedbankaccount} placeholder="Select Bank Account" isDarkMode={isDark}
                onChange={item => setSelectedbankaccount(item.value)} />

              {formattedContacts.length > 0 && (
                <>
                  <Label text="Contact Person" isDark={isDark} />
                  <SingleDropdown data={formattedContacts} value={selectedContactPerson} placeholder="Select Contact Person"
                    isDarkMode={isDark} onChange={handleContactChange} />
                </>
              )}

              <Label text="Contact Phone" isDark={isDark} />
              <PrefilledField value={contactPhone} placeholder="Auto-filled from contact" isDark={isDark} />

              <Label text="Contact Email" isDark={isDark} />
              <PrefilledField value={contactEmail} placeholder="Auto-filled from contact" isDark={isDark} />
            </FormCard>
          </>
        )}

        {/* ── SMART ACTION BUTTONS ───────────── */}
        <View style={S.actionSection}>

          {/* Primary CTA */}
          <View style={S.btnRow}>
            <SmartButton
              title="Add Enquiry & Proceed"
              icon="→"
              variant="primary"
              onPress={handleAddEnquiry}
                  style={S.btnHalf}
            />
            <SmartButton
            title="Cancel"
            icon="✕"
            variant="danger"
            onPress={() => navigation.goBack()}
            style={S.btnHalf}
          />
          </View>


          {/* Query + Terms row */}
          <View style={S.btnRow}>
            <SmartButton
              title="Query"
              subtitle="Attach query details"
              icon="?"
              variant="outline"
              done={queryDone}
              onPress={() => setIsVisibleQuery(true)}
              style={S.btnHalf}
            />
            <SmartButton
              title="Terms"
              subtitle="Add terms & conditions"
              icon="✎"
              variant="amber"
              done={termDone}
              onPress={() => setTermandcondition(true)}
              style={S.btnHalf}
            />
          </View>

          {/* Discard */}
          
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Calendar Modal ───────────────────── */}
      <Modal visible={isCalendarVisible} transparent animationType="fade">
        <View style={S.overlay}>
          <View style={[S.calCard, isDark && S.calCardDark]}>
            <Text style={[S.calTitle, isDark && { color: '#fff' }]}>Select Enquiry Date</Text>
            <Calendar
              onDayPress={day => { setEnquiryDate(day.dateString); setCalendarVisible(false); }}
              markedDates={{ [finalDate]: { selected: true, selectedColor: THEME.primary } }}
              minDate={TODAY}
            />
            <TouchableOpacity onPress={() => setCalendarVisible(false)} style={S.calClose}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <QueryModal
        isvisible={isVisibleQuery}
        onclose={() => setIsVisibleQuery(false)}
        onSave={data => { setQuerydata(data); setIsVisibleQuery(false); }}
      />
      <Termandconditions
        isvisible={termandcondition}
        onclose={() => setTermandcondition(false)}
        onSave={data => { setTermdata(data); setTermandcondition(false); }}
      />
    </KeyboardAvoidingView>
  );
};

// ─── Styles ─────────────────────────────────────────────────────
const S = StyleSheet.create({
  scroll:           { padding: 14, paddingBottom: 32 },

  progressTrack:    { height: 4, backgroundColor: '#e8e8e8', borderRadius: 2, marginBottom: 4 },
  progressFill:     { height: '100%', backgroundColor: THEME.primary, borderRadius: 2 },
  progressLabel:    { fontSize: 11, color: '#999', textAlign: 'right' },

  sectionRow:       { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 8, gap: 8 },
  sectionDot:       { width: 7, height: 7, borderRadius: 4 },
  sectionTitle:     { fontSize: 11, fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: 0.7 },
  sectionLine:      { flex: 1, height: 0.5, backgroundColor: '#e0e0e0' },

  card:             { backgroundColor: '#fff', borderRadius: 12, borderWidth: 0.5, borderColor: '#e0e0e0', padding: 14, marginBottom: 4 },
  cardDark:         { backgroundColor: '#1e1e1e', borderColor: '#333' },

  label:            { fontSize: 12, fontWeight: '600', color: '#555', marginTop: 10, marginBottom: 4 },

  prefilledBox:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: THEME.primaryLight, borderWidth: 0.5, borderColor: THEME.primaryBorder, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 2 },
  prefilledBoxDark: { backgroundColor: 'rgba(12,68,124,0.15)', borderColor: 'rgba(12,68,124,0.35)' },
  prefilledText:    { fontSize: 13, color: THEME.primaryText, fontWeight: '500', flex: 1 },
  placeholderText:  { color: '#bbb', fontWeight: '400' },
  prefillBadge:     { backgroundColor: THEME.primaryBorder, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8 },
  prefillBadgeText: { fontSize: 10, color: THEME.primaryText, fontWeight: '600' },

  input:            { borderWidth: 0.5, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', color: '#111', fontSize: 13 },
  inputDark:        { backgroundColor: '#2a2a2a', borderColor: '#444', color: '#eee' },
  textarea:         { borderWidth: 0.5, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, minHeight: 64, textAlignVertical: 'top', backgroundColor: '#fff', color: '#111', fontSize: 13 },

  dateBtn:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 0.5, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff' },
  dateBtnText:      { fontSize: 13, color: '#111', fontWeight: '500' },

  row:              { flexDirection: 'row', marginTop: 4 },

  expandBtn:        { alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 4, paddingVertical: 11, borderRadius: 8, backgroundColor: '#efefef', borderWidth: 0.5, borderColor: '#ddd' },
  expandBtnDark:    { backgroundColor: '#2a2a2a', borderColor: '#444' },
  expandBtnText:    { fontSize: 12, fontWeight: '600', color: '#666' },

  actionSection:    { marginTop: 20, gap: 8 },
  btnFull:          { width: '100%' },
  btnRow:           { flexDirection: 'row', gap: 8 },
  btnHalf:          { flex: 1 },

  smartBtn:         { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12 },
  smartBtnIcon:     { width: 30, height: 30, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  smartBtnTitle:    { fontSize: 13, fontWeight: '600' },
  smartBtnSub:      { fontSize: 11, marginTop: 1, opacity: 0.7 },

  overlay:          { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center' },
  calCard:          { backgroundColor: '#fff', borderRadius: 16, padding: 18, width: '92%', elevation: 10 },
  calCardDark:      { backgroundColor: '#1e1e1e' },
  calTitle:         { fontSize: 15, fontWeight: '700', textAlign: 'center', marginBottom: 12, color: '#111' },
  calClose:         { marginTop: 14, alignSelf: 'center', backgroundColor: THEME.primary, paddingHorizontal: 36, paddingVertical: 11, borderRadius: 8 },
});

export default CreateEnquiryPage;