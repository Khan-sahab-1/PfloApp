

// import React, {useContext, useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   useColorScheme,
//   Alert,
// } from 'react-native';
// import HeaderCompo from '../components/HeaderCompo';
// import {COLORS} from '../styles/Colors';
// import ButtonCompo from '../components/ButtonCompo';
// import makeApiCall from '../utils/apiHelper';
// import {AuthContext} from './Context';
// import urls from '../../url';
// import {useSelector} from 'react-redux';
// import SingleDropdown from '../components/SingleDropdown';
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
// import DateTimePicker from 'react-native-modal-datetime-picker';
// import TextinputCompo from '../components/TextinputCompo';
// import Loader from '../components/Loader';
// import navigationString from '../route/navigationString';

// dayjs.extend(utc);
// dayjs.extend(timezone);

// const EditEnquiryPage = ({route, navigation}) => {
//   const {enquiryData, customer_id} = route.params;
//   console.log(enquiryData, 'enquiryData');
//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const scheme = useColorScheme();
//   const isDarkMode = scheme === 'dark';
//   const user = useSelector(state => state.user.userDatainfo);
//   const resUser = user?.result?.res_user || {};
//   const employee_division_id = user?.result?.employee_division_id || '';

//   // State declarations
//   const [divisionInfo, setDivisionInfo] = useState([]);
//   const [selectedDivision, setSelectedDivision] = useState(
//     enquiryData.division_id || enquiryData.division || '',
//   );
//   const [selectedType, setSelectedType] = useState(
//     enquiryData.enquiry_type_id || enquiryData.enquiry_type || '',
//   );
//   const [accountHolderName, setAccountHolderName] = useState('');

//   const [customerOptions, setCustomerOptions] = useState([]);
//   const [enquiryTypeOptions, setEnquiryTypeOptions] = useState([]);
//   const [customer, setCustomer] = useState(
//     enquiryData.customer_id || customer_id || '',
//   );
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [enquiryDate, setEnquiryDate] = useState(
//     enquiryData.enquiry_date || dayjs().format('YYYY-MM-DD'),
//   );
//   const [clientrefno, setClientRefNo] = useState(
//     enquiryData.client_ref_no || '',
//   );
//   const [costcenterlist, setCostCenterList] = useState([]);
//   const [selectedCostCenter, setSelectedCostCenter] = useState(
//     enquiryData.cost_center_id || enquiryData.cost_center || null,
//   );
//   const [comments, setComments] = useState(enquiryData.comments || '');
//   const [opportunitydata, setOpportunityData] = useState([]);
//   const [selectedOpportunity, setSelectedOpportunity] = useState(
//     enquiryData.opportunity_id || enquiryData.opportunity || null,
//   );
//   const [pricelist, setPricelist] = useState([]);
//   const [selectedPricelist, setSelectedPricelist] = useState(
//     enquiryData.pricelist_id || enquiryData.pricelist || null,
//   );
//   const [taglist, setTaglist] = useState([]);
//   const [address, setAddress] = useState(enquiryData.address || '');
//   const [salesPersonOptions, setSalesPersonOptions] = useState([]);
//   const [selectedSalesPerson, setSelectedSalesPerson] = useState(
//     enquiryData.sale_person_id || enquiryData.sales_person || '',
//   );
//   const [accountHolder, setAccountHolder] = useState(
//     enquiryData.sale_person || '',
//   );
//   const [accountHolderId, setAccountHolderId] = useState(
//     enquiryData.account_holder_id || null,
//   );
//   const [selectedTaglist, setSelectedTaglist] = useState(
//     enquiryData.tag_id || enquiryData.tag || null,
//   );
//   const [banklist, setBanklist] = useState([]);
//   const [selectedBankAccount, setSelectedBankAccount] = useState(
//     enquiryData.bank_account_id || enquiryData.bank_account || null,
//   );
//   const [isLoading, setIsLoading] = useState(true);

//   // Store customer data with addresses for quick lookup
//   const [customerAddressMap, setCustomerAddressMap] = useState({});
//   const [initialDataLoaded, setInitialDataLoaded] = useState(false);
//   const [pressOtherInfo, setPressOtherInfo] = useState(false);

//   const [contactPersonList, setContactPersonList] = useState([]);
//   const [selectedContactPerson, setSelectedContactPerson] = useState(null);

//   const [contactPhone, setContactPhone] = useState(
//     enquiryData?.contact_person_phone || '',
//   );
//   const [contactEmail, setContactEmail] = useState(
//     enquiryData?.contact_person_email || '',
//   );

//   const [customerContactMap, setCustomerContactMap] = useState({});

//   // Fetch all required data on component mount
//   useEffect(() => {
//     const initializeData = async () => {
//       setIsLoading(true);
//       try {
//         // Fetch all data in parallel
//         const [
//           divisionData,
//           enquiryTypeData,
//           salesPersonData,
//           priceListData,
//           accountListData,
//           tagData,
//           opportunityData,
//         ] = await Promise.all([
//           fetchDivisionInfo(),
//           fetchEnquiryType(),
//           fetchSalesPerson(selectedDivision),
//           fetchPriceList(),
//           fetchAccountList(),
//           fetchTagInfo(),
//           fetchEnquiryOpportunity(),
//         ]);

//         // Set data
//         if (divisionData) setDivisionInfo(divisionData);
//         if (enquiryTypeData) setEnquiryTypeOptions(enquiryTypeData);
//         if (salesPersonData) setSalesPersonOptions(salesPersonData);
//         if (priceListData) setPricelist(priceListData);
//         if (accountListData) setBanklist(accountListData);
//         if (tagData) setTaglist(tagData);
//         if (opportunityData) setOpportunityData(opportunityData);

//         // Fetch cost center based on division
//         if (selectedDivision) {
//           const costCenterData = await fetchCostCenter(selectedDivision);
//           if (costCenterData) setCostCenterList(costCenterData);
//         }

//         // Fetch customer data using the new API
//         await fetchCustomersdata();

//         // Set initial address from enquiry data
//         if (enquiryData.address) {
//           setAddress(enquiryData.address);
//         }

//         // Set other fields from enquiryData
//         setInitialDataLoaded(true);
//       } catch (error) {
//         console.error('Error initializing data:', error);
//         Alert.alert('Error', 'Failed to load data. Please try again.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeData();
//   }, []);

//   // Update address when customer changes
//   useEffect(() => {
//     if (customer && customerOptions.length > 0 && initialDataLoaded) {
//       updateAddressForCustomer(customer);
//     }
//   }, [customer, customerOptions, initialDataLoaded]);

//   // Update address based on selected customer
//   const updateAddressForCustomer = customerId => {
//     if (customerId && customerOptions.length > 0) {
//       const selectedCustomer = customerOptions.find(
//         c => c.value === customerId,
//       );

//       if (selectedCustomer && selectedCustomer.address) {
//         // Clean the address (remove first line if it's the customer name)
//         const addressLines = selectedCustomer.address.split('\n');
//         let cleanedAddress = selectedCustomer.address;

//         if (addressLines.length > 1) {
//           // Check if first line is similar to customer name
//           const firstLine = addressLines[0].toLowerCase();
//           const customerName = selectedCustomer.label.toLowerCase();

//           if (firstLine.includes(customerName) || addressLines.length > 2) {
//             // Skip first line if it contains customer name or if address has multiple lines
//             cleanedAddress = addressLines.slice(1).join('\n').trim();
//           }
//         }

//         setAddress(cleanedAddress);

//         // Set contact person list for this customer
//         if (selectedCustomer.contact_person_details) {
//           setContactPersonList(selectedCustomer.contact_person_details);
//           // Create a map for contact person details
//           const contactMap = {};
//           selectedCustomer.contact_person_details.forEach(contact => {
//             contactMap[contact.id] = {
//               phone: contact.mobile || contact.phone || '',
//               email: contact.email || '',
//             };
//           });
//           setCustomerContactMap(contactMap);
//         }
//       }
//     }
//   };

//   // Fetch division information
//   const fetchDivisionInfo = async () => {
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
//       if (response.result) {
//         return response.result.map(item => ({
//           label: item.division_name,
//           value: item.division_id,
//         }));
//       }
//       return [];
//     } catch (error) {
//       console.error('Error fetching division info:', error);
//       return [];
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

//   // Fetch sales person
//   const fetchSalesPerson = async divisionId => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchLeadSalePerson,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {
//             division: divisionId || employee_division_id,
//             empCode: user?.result?.emp_code,
//           },
//         },
//       );
//       if (response.result) {
//         return response.result.map(item => ({
//           label: item.person_name,
//           value: item.person_id,
//         }));
//       }
//       return [];
//     } catch (error) {
//       console.error('Error fetching sales person data:', error);
//       return [];
//     }
//   };

//   // Fetch enquiry type
//   const fetchEnquiryType = async () => {
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
//       if (response.result && response.result[0]?.enquiry_type_data) {
//         return response.result[0].enquiry_type_data.map(item => ({
//           label: item[1],
//           value: item[0],
//         }));
//       }
//       return [];
//     } catch (error) {
//       console.error('Error fetching enquiry type data:', error);
//       return [];
//     }
//   };

//   // Fetch customer data with addresses and contact persons
//   const fetchCustomersdata = async (divisionId = null) => {
//     console.log(divisionId, selectedSalesPerson, '000000');
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

//       // console.log(response, 'Customer Responsenew data---->>>>>>>>>');

//       if (response?.result) {
//         const customerList = response.result.map(item => ({
//           label: item.customer_name,
//           value: item.customer_id,
//           address: item.customer_address || '',
//           contact_person_details: Array.isArray(item.contact_person_details)
//             ? item.contact_person_details
//             : [],
//         }));

//         setCustomerOptions(customerList);

//         // Create address map for quick lookup
//         const addressMap = {};
//         const contactMap = {};

//         customerList.forEach(customer => {
//           if (customer.address) {
//             addressMap[customer.value] = customer.address;
//           }
//           if (customer.contact_person_details) {
//             customer.contact_person_details.forEach(contact => {
//               contactMap[contact.id] = {
//                 phone: contact.mobile || contact.phone || '',
//                 email: contact.email || '',
//               };
//             });
//           }
//         });

//         setCustomerAddressMap(addressMap);
//         setCustomerContactMap(contactMap);

//         // If we have a customer from enquiry data, update its address
//         if (enquiryData.customer_id || customer) {
//           const customerId = enquiryData.customer_id || customer;
//           updateAddressForCustomer(customerId);
//         }

//         return customerList;
//       } else {
//         setCustomerOptions([]);
//         setCustomerAddressMap({});
//         setCustomerContactMap({});
//         return [];
//       }
//     } catch (error) {
//       console.log(error, 'Error fetching Customer');
//       Alert.alert('Error', 'Failed to fetch customer data');
//       return [];
//     }
//   };

//   // Format contact person list for dropdown
//   const formattedContacts = contactPersonList.flatMap(item =>
//     Object.values(item).map(contact => ({
//       label: contact.name,
//       value: contact.id,
//       phone: contact.mobile || contact.phone || '',
//       email: contact.email || '',
//     })),
//   );

//   // console.log(formattedContacts, 'formattedContacts');

//   // Update customer data when sales person changes
//   useEffect(() => {
//     if (selectedSalesPerson) {
//       fetchCustomersdata();
//     }
//   }, [selectedSalesPerson]);

//   // Update customer data when division changes
//   useEffect(() => {
//     if (selectedDivision && initialDataLoaded) {
//       fetchCustomersdata(selectedDivision);
//     }
//   }, [selectedDivision, initialDataLoaded]);

//   // Fetch price list
//   const fetchPriceList = async () => {
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
//       if (response.result) {
//         return response.result.map(item => ({
//           label: item.pricelist_name,
//           value: item.pricelist_id,
//         }));
//       }
//       return [];
//     } catch (error) {
//       console.error('Error fetching price list:', error);
//       return [];
//     }
//   };

//   // Fetch account list
//   const fetchAccountList = async () => {
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
//       if (response.result) {
//         return response.result.map(item => ({
//           label: item.bank_account_name,
//           value: item.bank_account_id,
//         }));
//       }
//       return [];
//     } catch (error) {
//       console.error('Error fetching account info:', error);
//       return [];
//     }
//   };

//   // Fetch tag info
//   const fetchTagInfo = async () => {
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
//       if (response.result) {
//         return response.result.map(item => ({
//           label: item.tag_name,
//           value: item.tag_id,
//         }));
//       }
//       return [];
//     } catch (error) {
//       console.error('Error fetching tag info:', error);
//       return [];
//     }
//   };

//   // Fetch enquiry opportunity
//   const fetchEnquiryOpportunity = async () => {
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
//       if (response.result) {
//         return response.result.map(item => ({
//           label: item.opportunity_name,
//           value: item.opportunity_id,
//         }));
//       }
//       return [];
//     } catch (error) {
//       console.error('Error fetching opportunity info:', error);
//       return [];
//     }
//   };

//   // Fetch cost center
//   const fetchCostCenter = async divisionId => {
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
//       if (response.result) {
//         return response.result.map(item => ({
//           label: item.cost_center_name,
//           value: item.cost_center_id,
//         }));
//       }
//       return [];
//     } catch (error) {
//       console.error('Error fetching cost center data:', error);
//       return [];
//     }
//   };

//   // Handle customer change
//   const handleCustomerChange = item => {
//     setCustomer(item.value);

//     // Update address based on selected customer
//     if (item.address) {
//       const addressLines = item.address.split('\n');
//       let cleanedAddress = item.address;

//       if (addressLines.length > 1) {
//         cleanedAddress = addressLines.slice(1).join('\n').trim();
//       }

//       setAddress(cleanedAddress);
//     }

//     // Update contact person list
//     if (item.contact_person_details) {
//       setContactPersonList(item.contact_person_details);

//       // Create contact map
//       const contactMap = {};
//       item.contact_person_details.forEach(contact => {
//         contactMap[contact.id] = {
//           phone: contact.mobile || contact.phone || '',
//           email: contact.email || '',
//         };
//       });
//       setCustomerContactMap(contactMap);
//       console.log(item.contact_person_details, 'contactMap---->>>');

//       // Reset contact person selection
//       setSelectedContactPerson(null);
//       setContactPhone('');
//       setContactEmail('');
//     } else {
//       setContactPersonList([]);
//       setCustomerContactMap({});
//       setSelectedContactPerson(null);
//       setContactPhone('');
//       setContactEmail('');
//     }
//   };

//   // Handle contact person change
//   const handleContactPersonChange = item => {
//     setSelectedContactPerson(item.value);

//     // Update contact phone and email from the map
//     if (customerContactMap[item.value]) {
//       setContactPhone(customerContactMap[item.value].phone);
//       setContactEmail(customerContactMap[item.value].email);
//     } else {
//       // Fallback to item properties if map doesn't have it
//       setContactPhone(item.phone || '');
//       setContactEmail(item.email || '');
//     }
//   };

//   useEffect(() => {
//     if (enquiryData?.contact_person_id && formattedContacts.length > 0) {
//       const selected = formattedContacts.find(
//         c => c.value === enquiryData.contact_person_id,
//       );

//       if (selected) {
//         setSelectedContactPerson(selected.value);
//         setContactPhone(
//           enquiryData.contact_person_phone || selected.phone || '',
//         );
//         setContactEmail(
//           enquiryData.contact_person_email || selected.email || '',
//         );
//       }
//     }
//   }, [formattedContacts]);

//   // Handle date picker confirm
//   const handleDateConfirm = date => {
//     setShowDatePicker(false);
//     if (date && !isNaN(date.getTime?.())) {
//       const formattedDate = dayjs(date).format('YYYY-MM-DD');
//       setEnquiryDate(formattedDate);
//     }
//   };

//   // Handle division change
//   const handleDivisionChange = async item => {
//     console.log(item, 'it->>>>');
//     setSelectedDivision(item.value);

//     // Fetch related data for the new division
//     const [salesPersonData, costCenterData] = await Promise.all([
//       fetchSalesPerson(item.value),
//       fetchCostCenter(item.value),
//     ]);

//     if (salesPersonData) setSalesPersonOptions(salesPersonData);
//     if (costCenterData) setCostCenterList(costCenterData);

//     // Fetch customers for the new division
//     await fetchCustomersdata(item.value);
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     try {
//       const payload = {
//         id: enquiryData.id,
//         division: selectedDivision,
//         enquiry_type: selectedType,
//         enquiry_date: enquiryDate,
//         customer: customer,
//         client_ref_no: clientrefno,
//         sales_person_id: selectedSalesPerson,
//         cost_center: selectedCostCenter,
//         pricelist: selectedPricelist,
//         opportunity_id: selectedOpportunity,
//         comments: comments,
//         address: address,
//         account_holder: accountHolder,
//         tag: selectedTaglist,
//         bank_account_id: selectedBankAccount,
//         emp_code: user?.result?.emp_code,
//         contact_person: selectedContactPerson
//           ? formattedContacts.find(c => c.value === selectedContactPerson)
//               ?.value || ''
//           : '',
//         contact_phone: contactPhone,
//         contact_email: contactEmail,
//       };

//       console.log('Update payload:', payload);

//       const response = await makeApiCall(
//         server_origin,
//         urls.editenquery,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: payload,
//         },
//       );
//       // console.log(response, 'responce-----');
//       if (response?.result?.success) {
//         Alert.alert('Success', 'Enquiry updated successfully!');
//         navigation.pop(2);
//       } else {
//         Alert.alert(
//           'Error',
//           response?.result?.error || 'Failed to update enquiry',
//         );
//       }
//     } catch (error) {
//       console.error('Error updating enquiry:', error);
//       Alert.alert('Error', 'Failed to update enquiry. Please try again.');
//     }
//   };

//   // Handle cancel
//   const handleCancel = () => {
//     navigation.goBack();
//   };

//   // Navigate to enquiry lines
//   const handleEnquiryLines = () => {
//     navigation.navigate('EditEnquiryLines', {enquiryId: enquiryData.id});
//   };

//   // Show loading indicator while data is being fetched
//   if (isLoading) {
//     return (
//       <>
//         <HeaderCompo
//           title={'Edit Enquiry'}
//           lefticon={require('../assets/back.png')}
//           onPress={() => navigation.goBack()}
//         />
//         <View
//           style={[
//             styles.loadingContainer,
//             isDarkMode && styles.loadingContainerDark,
//           ]}>
//           <Loader visible={true} />
//           <Text
//             style={[styles.loadingText, isDarkMode && styles.loadingTextDark]}>
//             Loading enquiry data...
//           </Text>
//         </View>
//       </>
//     );
//   }

//   return (
//     <>
//       <HeaderCompo
//         title={'Edit Enquiry'}
//         lefticon={require('../assets/back.png')}
//         onPress={() => navigation.goBack()}
//       />
//       <ScrollView
//         style={[styles.container, isDarkMode && styles.containerDark]}>
//         <View style={styles.fieldContainer}>
//           {/* Enquiry Number */}
//           <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//             Enquiry Number
//           </Text>
//           <TextInput
//             style={[styles.input, isDarkMode && styles.inputDark]}
//             value={enquiryData.enquiry_number || ''}
//             editable={false}
//           />

//           {/* Division */}
//           <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//             Division
//           </Text>
//           <SingleDropdown
//             data={divisionInfo}
//             value={selectedDivision}
//             onChange={item => handleDivisionChange(item)}
//             placeholder="Select Division"
//             isDarkMode={isDarkMode}
//           />

//           {/* Enquiry Type */}
//           <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//             Enquiry Type
//           </Text>
//           <SingleDropdown
//             data={enquiryTypeOptions}
//             value={selectedType}
//             onChange={item => setSelectedType(item.value)}
//             placeholder="Select Enquiry Type"
//             isDarkMode={isDarkMode}
//           />

//           {/* Status */}
//           <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//             Status
//           </Text>
//           <TextInput
//             style={[styles.input, isDarkMode && styles.inputDark]}
//             value={enquiryData.status || ''}
//             editable={false}
//           />

//           {/* Enquiry Date */}
//           <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//             Enquiry Date
//           </Text>
//           <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//             <View style={[styles.input, isDarkMode && styles.inputDark]}>
//               <Text style={{color: isDarkMode ? COLORS.white : COLORS.black}}>
//                 {enquiryDate || 'Select Date'}
//               </Text>
//             </View>
//           </TouchableOpacity>

//           {/* Customer - Now properly pre-filled */}

//           {/* Sale Person */}
//           <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//             Sale Person
//           </Text>
//           <SingleDropdown
//             data={salesPersonOptions}
//             value={selectedSalesPerson}
//             onChange={item => setSelectedSalesPerson(item.value)}
//             placeholder="Select Sales Person"
//             isDarkMode={isDarkMode}
//           />
//           <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//             Customer
//           </Text>
//           <SingleDropdown
//             data={customerOptions}
//             value={customer}
//             onChange={handleCustomerChange}
//             placeholder="Select Customer"
//             isDarkMode={isDarkMode}
//           />

//           {/* Account Holder */}
//           <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//             Account Holder
//           </Text>
//           <TextinputCompo
//             placeholder="Account Holder"
//             value={accountHolder}
//             onChangeText={setAccountHolder}
//             isDarkMode={isDarkMode}
//           />
//           {/* Address - Automatically populated when customer is selected */}
//           <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//             Address
//           </Text>
//           <TextinputCompo
//             placeholder="Address will auto-populate when customer is selected"
//             value={address}
//             onChangeText={setAddress}
//             isDarkMode={isDarkMode}
//             editable={true}
//           />

//           {/* Client Ref No */}
//           <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//             Client Ref No.
//           </Text>
//           <TextinputCompo
//             placeholder="Client Reference Number"
//             value={clientrefno}
//             onChangeText={setClientRefNo}
//             isDarkMode={isDarkMode}
//           />

//           {/* Cost Center */}
//           <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//             Cost Center
//           </Text>
//           <SingleDropdown
//             data={costcenterlist}
//             value={selectedCostCenter}
//             onChange={item => setSelectedCostCenter(item.value)}
//             placeholder="Select Cost Center"
//             isDarkMode={isDarkMode}
//           />

//           {/* Pricelist */}
//           <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//             Pricelist
//           </Text>
//           <SingleDropdown
//             data={pricelist}
//             value={selectedPricelist}
//             onChange={item => setSelectedPricelist(item.value)}
//             placeholder="Select Pricelist"
//             isDarkMode={isDarkMode}
//           />

//           {/* Opportunity */}
//           <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//             Opportunity
//           </Text>
//           <SingleDropdown
//             data={opportunitydata}
//             value={selectedOpportunity}
//             onChange={item => setSelectedOpportunity(item.value)}
//             placeholder="Select Opportunity"
//             isDarkMode={isDarkMode}
//           />

//           {/* Comments */}
//           <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//             Comments
//           </Text>
//           <TextinputCompo
//             placeholder="Comments"
//             value={comments}
//             onChangeText={setComments}
//             multiline={true}
//             numberOfLines={4}
//             style={[styles.textArea, isDarkMode && styles.textAreaDark]}
//             isDarkMode={isDarkMode}
//           />

//           {/* Tags */}
//           {/* <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//             Tags
//           </Text> */}
//           {/* <SingleDropdown
//             data={taglist}
//             value={selectedTaglist}
//             onChange={item => setSelectedTaglist(item.value)}
//             placeholder="Select Tags"
//             isDarkMode={isDarkMode}
//           /> */}

//           {/* Bank Account & Contact Info (only shown when Other Info is pressed) */}
//           {pressOtherInfo && (
//             <>
//               <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//                 Bank Account
//               </Text>
//               <SingleDropdown
//                 data={banklist}
//                 value={selectedBankAccount}
//                 onChange={item => setSelectedBankAccount(item.value)}
//                 placeholder="Select Bank Account"
//                 isDarkMode={isDarkMode}
//               />

//               <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//                 Contact Person
//               </Text>
//               <SingleDropdown
//                 data={formattedContacts}
//                 placeholder="Select Contact Person"
//                 value={selectedContactPerson}
//                 onChange={handleContactPersonChange}
//               />

//               <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//                 Contact Person Phone
//               </Text>
//               <TextinputCompo
//                 placeholder="Contact Person Phone"
//                 onChangeText={text => setContactPhone(text)}
//                 value={contactPhone}
//               />

//               <Text style={[styles.label, isDarkMode && styles.labelDark]}>
//                 Contact Person Email
//               </Text>
//               <TextinputCompo
//                 placeholder="Contact Person Email"
//                 onChangeText={text => setContactEmail(text)}
//                 value={contactEmail}
//               />
//             </>
//           )}
//         </View>

//         {/* Enquiry Lines Button */}
//         <TouchableOpacity
//           style={[styles.enquiryLinesButton, isDarkMode && styles.buttonDark]}
//           onPress={handleEnquiryLines}>
//           <Text style={styles.enquiryLinesButtonText}>Enquiry Lines</Text>
//         </TouchableOpacity>

//         {/* Action Buttons */}
//         <View style={styles.buttonContainer}>
//           <ButtonCompo
//             title="Other Info"
//             onPress={() => setPressOtherInfo(!pressOtherInfo)}
//             style={{width: '30%'}}
//           />
//           <ButtonCompo
//             title="Query"
//             onPress={() =>
//               navigation.navigate(navigationString.QUERY, {
//                 enquiryId: enquiryData,
//               })
//             }
//             style={{width: '30%'}}
//           />
//           <ButtonCompo
//             title="Term & Conditions"
//             onPress={() =>
//               navigation.navigate(navigationString.TERMANDCONDITION, {
//                 enquiryId: enquiryData,
//               })
//             }
//             style={{width: '30%'}}
//           />
//         </View>
//         <View style={{...styles.buttonContainer, marginBottom: 20}}>
//           <ButtonCompo
//             title="Save"
//             onPress={handleSubmit}
//             style={{width: '45%', marginBottom: 10}}
//           />
//           <ButtonCompo
//             title="Cancel"
//             onPress={handleCancel}
//             style={{width: '50%'}}
//           />
//         </View>
//       </ScrollView>

//       {/* Date Picker */}
//       <DateTimePicker
//         isVisible={showDatePicker}
//         mode="date"
//         onConfirm={handleDateConfirm}
//         onCancel={() => setShowDatePicker(false)}
//         date={dayjs(enquiryDate).toDate()}
//       />
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     padding: 20,
//   },
//   containerDark: {
//     backgroundColor: COLORS.darkBackground,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//   },
//   loadingContainerDark: {
//     backgroundColor: COLORS.darkBackground,
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: COLORS.black,
//   },
//   loadingTextDark: {
//     color: COLORS.white,
//   },
//   fieldContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 5,
//     color: COLORS.black,
//   },
//   labelDark: {
//     color: COLORS.white,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     borderRadius: 8,
//     padding: 12,
//     backgroundColor: COLORS.white,
//     color: COLORS.black,
//     marginBottom: 15,
//     fontSize: 14,
//   },
//   inputDark: {
//     borderColor: COLORS.darkBorder,
//     backgroundColor: COLORS.darkInput,
//     color: COLORS.white,
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   textAreaDark: {
//     backgroundColor: COLORS.darkInput,
//     color: COLORS.white,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   enquiryLinesButton: {
//     backgroundColor: COLORS.BLUE,
//     paddingVertical: 15,
//     marginBottom: 20,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   enquiryLinesButtonText: {
//     color: COLORS.white,
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   buttonDark: {
//     backgroundColor: COLORS.darkPrimary,
//   },
// });

// export default EditEnquiryPage;
// // Jamshed start 



import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import HeaderCompo from '../components/HeaderCompo';
import { COLORS } from '../styles/Colors';
import ButtonCompo from '../components/ButtonCompo';
import makeApiCall from '../utils/apiHelper';
import { AuthContext } from './Context';
import urls from '../../url';
import { useSelector } from 'react-redux';
import SingleDropdown from '../components/SingleDropdown';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import DateTimePicker from 'react-native-modal-datetime-picker';
import TextinputCompo from '../components/TextinputCompo';
import Loader from '../components/Loader';
import navigationString from '../route/navigationString';

dayjs.extend(utc);
dayjs.extend(timezone);

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Strip a leading line that matches or contains the customer name */
const cleanAddress = (rawAddress, customerName = '') => {
  if (!rawAddress) return '';
  const lines = rawAddress.split('\n');
  if (lines.length <= 1) return rawAddress;
  const first = lines[0].toLowerCase().trim();
  const name  = customerName.toLowerCase().trim();
  if (first.includes(name) || name.includes(first) || lines.length > 2) {
    return lines.slice(1).join('\n').trim();
  }
  return rawAddress;
};

/** Normalise a value that may come as  [id, "label"]  or plain id */
const resolveId = (val) => {
  if (Array.isArray(val)) return val[0] ?? null;
  return val ?? null;
};

// ─── Section wrapper ────────────────────────────────────────────────────────

const SectionCard = ({ title, icon, children, isDarkMode }) => (
  <View style={[sectionStyles.card, isDarkMode && sectionStyles.cardDark]}>
    <View style={sectionStyles.header}>
      {icon ? <Text style={sectionStyles.icon}>{icon}</Text> : null}
      <Text style={[sectionStyles.title, isDarkMode && sectionStyles.titleDark]}>
        {title}
      </Text>
    </View>
    <View style={sectionStyles.body}>{children}</View>
  </View>
);

// ─── Field wrapper ───────────────────────────────────────────────────────────

const Field = ({ label, required, isDarkMode, children }) => (
  <View style={fieldStyles.wrap}>
    <View style={fieldStyles.labelRow}>
      <Text style={[fieldStyles.label, isDarkMode && fieldStyles.labelDark]}>
        {label}
      </Text>
      {required && <Text style={fieldStyles.required}> *</Text>}
    </View>
    {children}
  </View>
);

// ─── Read-only Input ─────────────────────────────────────────────────────────

const ReadOnlyInput = ({ value, isDarkMode }) => (
  <View style={[roStyles.box, isDarkMode && roStyles.boxDark]}>
    <Text style={[roStyles.text, isDarkMode && roStyles.textDark]}>
      {value || '—'}
    </Text>
  </View>
);

// ─── Section styles ──────────────────────────────────────────────────────────

const sectionStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: '#1E2433',
    shadowOpacity: 0.2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 18,
    // paddingVertical: 12,
    // backgroundColor: '#F4F6FB',
    // borderBottomWidth: 1,
    // borderBottomColor: '#EEF0F6',
  },
  icon: { fontSize: 16, marginRight: 8 },
  title: { fontSize: 13, fontWeight: '700', color: '#3B4563', letterSpacing: 0.5, textTransform: 'uppercase' },
  titleDark: { color: '#A8B4D0' },
  body: { padding: 16 },
});

const fieldStyles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  labelRow: { flexDirection: 'row', marginBottom: 6 },
  label: { fontSize: 13, fontWeight: '600', color: '#4A5568' },
  labelDark: { color: '#9AACCC' },
  required: { fontSize: 13, color: '#E53E3E', fontWeight: '700' },
});

const roStyles = StyleSheet.create({
  box: {
    borderWidth: 1, borderColor: '#E8ECF4', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: '#F7F9FC',
  },
  boxDark: { borderColor: '#2D3748', backgroundColor: '#252D40' },
  text: { fontSize: 14, color: '#718096' },
  textDark: { color: '#718096' },
});

// ─── Main Component ──────────────────────────────────────────────────────────

const EditEnquiryPage = ({ route, navigation }) => {
  const { enquiryData, customer_id } = route.params;

  const contextType    = useContext(AuthContext);
  const server_origin  = contextType.currentUrl;
  const scheme         = useColorScheme();
  const isDarkMode     = scheme === 'dark';
  const user           = useSelector(state => state.user.userDatainfo);
  const resUser        = user?.result?.res_user || {};
  const employee_division_id = user?.result?.employee_division_id || '';

  // ── Dropdown data ────────────────────────────────────────────────────────
  const [divisionInfo,       setDivisionInfo]       = useState([]);
  const [enquiryTypeOptions, setEnquiryTypeOptions] = useState([]);
  const [customerOptions,    setCustomerOptions]    = useState([]);
  const [salesPersonOptions, setSalesPersonOptions] = useState([]);
  const [costcenterlist,     setCostCenterList]     = useState([]);
  const [pricelist,          setPricelist]          = useState([]);
  const [opportunitydata,    setOpportunityData]    = useState([]);
  const [taglist,            setTaglist]            = useState([]);
  const [banklist,           setBanklist]           = useState([]);
  const [contactPersonList,  setContactPersonList]  = useState([]);
  const [customerContactMap, setCustomerContactMap] = useState({});

  // ── Form values ──────────────────────────────────────────────────────────
  const [selectedDivision,     setSelectedDivision]     = useState(null);
  const [selectedType,         setSelectedType]         = useState(null);
  const [enquiryDate,          setEnquiryDate]          = useState(dayjs().format('YYYY-MM-DD'));
  const [customer,             setCustomer]             = useState(null);
  const [selectedSalesPerson,  setSelectedSalesPerson]  = useState(null);
  const [selectedCostCenter,   setSelectedCostCenter]   = useState(null);
  const [selectedPricelist,    setSelectedPricelist]    = useState(null);
  const [selectedOpportunity,  setSelectedOpportunity]  = useState(null);
  const [selectedTaglist,      setSelectedTaglist]      = useState(null);
  const [selectedBankAccount,  setSelectedBankAccount]  = useState(null);
  const [selectedContactPerson,setSelectedContactPerson]= useState(null);
  const [accountHolder,        setAccountHolder]        = useState('');
  const [accountHolderId,      setAccountHolderId]      = useState(null);
  const [address,              setAddress]              = useState('');
  const [clientrefno,          setClientRefNo]          = useState('');
  const [comments,             setComments]             = useState('');
  const [contactPhone,         setContactPhone]         = useState('');
  const [contactEmail,         setContactEmail]         = useState('');

  // ── UI state ─────────────────────────────────────────────────────────────
  const [isLoading,        setIsLoading]        = useState(true);
  const [isSaving,         setIsSaving]         = useState(false);
  const [showDatePicker,   setShowDatePicker]   = useState(false);
  const [pressOtherInfo,   setPressOtherInfo]   = useState(false);
  const [initialDataLoaded,setInitialDataLoaded]= useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ── Pre-fill helper (run once after all dropdowns are ready) ─────────────
  const preFillFromEnquiry = useCallback(() => {
    const d = enquiryData;

    setSelectedDivision(    resolveId(d.division_id    ?? d.division));
    setSelectedType(        resolveId(d.enquiry_type_id ?? d.enquiry_type));
    setCustomer(            resolveId(d.customer_id     ?? customer_id));
    setSelectedSalesPerson( resolveId(d.sale_person_id  ?? d.sales_person));
    setSelectedCostCenter(  resolveId(d.cost_center_id  ?? d.cost_center));
    setSelectedPricelist(   resolveId(d.pricelist_id    ?? d.pricelist));
    setSelectedOpportunity( resolveId(d.opportunity_id  ?? d.opportunity));
    setSelectedTaglist(     resolveId(d.tag_id          ?? d.tag));
    setSelectedBankAccount( resolveId(d.bank_account_id ?? d.bank_account));

    if (d.enquiry_date)           setEnquiryDate(d.enquiry_date);
    if (d.client_ref_no)          setClientRefNo(d.client_ref_no);
    if (d.comments)               setComments(d.comments);
    if (d.address)                setAddress(d.address);
    if (d.sale_person)            setAccountHolder(d.sale_person);
    if (d.account_holder_id)      setAccountHolderId(d.account_holder_id);
    if (d.contact_person_phone)   setContactPhone(d.contact_person_phone);
    if (d.contact_person_email)   setContactEmail(d.contact_person_email);
    if (d.contact_person_id)      setSelectedContactPerson(resolveId(d.contact_person_id));
  }, [enquiryData, customer_id]);

  // ── API calls ─────────────────────────────────────────────────────────────

  const apiPost = useCallback(async (url, params) => {
    const res = await makeApiCall(server_origin, url, 'POST', {
      jsonrpc: '2.0', method: 'call', params,
    });
    return res?.result ?? null;
  }, [server_origin]);

  const fetchDivisionInfo = useCallback(async () => {
    const r = await apiPost(urls.fetchleadsDivision, { resUser });
    return (r || []).map(i => ({ label: i.division_name, value: i.division_id }));
  }, [apiPost, resUser]);

  const fetchEnquiryType = useCallback(async () => {
    const r = await apiPost(urls.fetchEnquiryType, {});
    return (r?.[0]?.enquiry_type_data || []).map(i => ({ label: i[1], value: i[0] }));
  }, [apiPost]);

  const fetchSalesPerson = useCallback(async (divisionId) => {
    const r = await apiPost(urls.fetchLeadSalePerson, {
      division: divisionId || employee_division_id,
      empCode: user?.result?.emp_code,
    });
    return (r || []).map(i => ({ label: i.person_name, value: i.person_id }));
  }, [apiPost, employee_division_id, user]);

  const fetchCostCenter = useCallback(async (divisionId) => {
    const r = await apiPost(urls.fectcostcnter, { division_id: divisionId });
    return (r || []).map(i => ({ label: i.cost_center_name, value: i.cost_center_id }));
  }, [apiPost]);

  const fetchPriceList = useCallback(async () => {
    const r = await apiPost(urls.fetchpricelist, { resUser });
    return (r || []).map(i => ({ label: i.pricelist_name, value: i.pricelist_id }));
  }, [apiPost, resUser]);

  const fetchAccountList = useCallback(async () => {
    const r = await apiPost(urls.fetechbankdetails, { resUser });
    return (r || []).map(i => ({ label: i.bank_account_name, value: i.bank_account_id }));
  }, [apiPost, resUser]);

  const fetchTagInfo = useCallback(async () => {
    const r = await apiPost(urls.fetchtagsdata, { resUser });
    return (r || []).map(i => ({ label: i.tag_name, value: i.tag_id }));
  }, [apiPost, resUser]);

  const fetchEnquiryOpportunity = useCallback(async () => {
    const r = await apiPost(urls.futchenqueryOpportunity, { resUser });
    return (r || []).map(i => ({ label: i.opportunity_name, value: i.opportunity_id }));
  }, [apiPost, resUser]);

  const fetchCustomersdata = useCallback(async (salespersonId = null) => {
    const r = await apiPost(urls.fetchcustomerUrl, {
      salesPerson: salespersonId ?? selectedSalesPerson,
    });
    if (!r) { setCustomerOptions([]); return []; }

    const list = r.map(i => ({
      label:                  i.customer_name,
      value:                  i.customer_id,
      address:                i.customer_address || '',
      contact_person_details: Array.isArray(i.contact_person_details)
                                ? i.contact_person_details : [],
    }));
    setCustomerOptions(list);
    return list;
  }, [apiPost, selectedSalesPerson]);

  // ── Apply customer contacts & address when customer list + selection ready ──
  const applyCustomerData = useCallback((customerId, list) => {
    const found = (list || customerOptions).find(c => c.value === customerId);
    if (!found) return;

    // Address
    if (found.address) {
      setAddress(cleanAddress(found.address, found.label));
    }

    // Contact persons
    const contacts = found.contact_person_details || [];
    setContactPersonList(contacts);

    const cmap = {};
    contacts.forEach(cp => {
      cmap[cp.id] = { phone: cp.mobile || cp.phone || '', email: cp.email || '' };
    });
    setCustomerContactMap(cmap);
  }, [customerOptions]);

  // ── Initialise ────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const initDivision = resolveId(enquiryData.division_id ?? enquiryData.division);

        const [divData, typeData, spData, plData, bankData, tagData, oppData, custData] =
          await Promise.all([
            fetchDivisionInfo(),
            fetchEnquiryType(),
            fetchSalesPerson(initDivision),
            fetchPriceList(),
            fetchAccountList(),
            fetchTagInfo(),
            fetchEnquiryOpportunity(),
            fetchCustomersdata(resolveId(enquiryData.sale_person_id ?? enquiryData.sales_person)),
          ]);

        setDivisionInfo(divData);
        setEnquiryTypeOptions(typeData);
        setSalesPersonOptions(spData);
        setPricelist(plData);
        setBanklist(bankData);
        setTaglist(tagData);
        setOpportunityData(oppData);

        if (initDivision) {
          const ccData = await fetchCostCenter(initDivision);
          setCostCenterList(ccData);
        }

        // Pre-fill form values
        preFillFromEnquiry();

        // Apply customer-specific data (address / contacts)
        const initCustomerId = resolveId(enquiryData.customer_id ?? customer_id);
        if (initCustomerId) {
          applyCustomerData(initCustomerId, custData);
        }

        setInitialDataLoaded(true);

        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1, duration: 400, useNativeDriver: true,
        }).start();
      } catch (err) {
        console.error('Init error:', err);
        Alert.alert('Error', 'Failed to load enquiry data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Refresh customers when sales person changes (after initial load) ──────
  useEffect(() => {
    if (!initialDataLoaded || !selectedSalesPerson) return;
    fetchCustomersdata(selectedSalesPerson);
  }, [selectedSalesPerson, initialDataLoaded]);

  // ── Refresh SP + CC when division changes (after initial load) ────────────
  const handleDivisionChange = async (item) => {
    setSelectedDivision(item.value);
    const [spData, ccData] = await Promise.all([
      fetchSalesPerson(item.value),
      fetchCostCenter(item.value),
    ]);
    setSalesPersonOptions(spData);
    setCostCenterList(ccData);
  };

  // ── Customer change ───────────────────────────────────────────────────────
  const handleCustomerChange = (item) => {
    setCustomer(item.value);
    applyCustomerData(item.value, null);
    // Reset contact selection
    setSelectedContactPerson(null);
    setContactPhone('');
    setContactEmail('');
  };

  // ── Contact person change ─────────────────────────────────────────────────
  const handleContactPersonChange = (item) => {
    setSelectedContactPerson(item.value);
    const info = customerContactMap[item.value];
    setContactPhone(info?.phone || item.phone || '');
    setContactEmail(info?.email || item.email || '');
  };

  // ── Date picker ───────────────────────────────────────────────────────────
  const handleDateConfirm = (date) => {
    setShowDatePicker(false);
    if (date && !isNaN(date.getTime?.())) {
      setEnquiryDate(dayjs(date).format('YYYY-MM-DD'));
    }
  };

  // ── Format contacts for dropdown ─────────────────────────────────────────
  const formattedContacts = contactPersonList.flatMap(item =>
    Object.values(item).map(c => ({
      label: c.name,
      value: c.id,
      phone: c.mobile || c.phone || '',
      email: c.email || '',
    })),
  );

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!customer) {
      Alert.alert('Validation', 'Please select a customer.');
      return;
    }
    if (!selectedDivision) {
      Alert.alert('Validation', 'Please select a division.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        id:              enquiryData.id,
        division:        selectedDivision,
        enquiry_type:    selectedType,
        enquiry_date:    enquiryDate,
        customer,
        client_ref_no:   clientrefno,
        sales_person_id: selectedSalesPerson,
        cost_center:     selectedCostCenter||null,
        pricelist:       selectedPricelist,
        opportunity_id:  selectedOpportunity,
        comments,
        address,
        account_holder:  accountHolder,
        tag:             selectedTaglist,
        bank_account_id: selectedBankAccount,
        emp_code:        user?.result?.emp_code,
        contact_person:  selectedContactPerson || '',
        contact_phone:   contactPhone,
        contact_email:   contactEmail,
      };
    console.log(payload,'Payayayay')
      const response = await makeApiCall(server_origin, urls.editenquery, 'POST', {
        jsonrpc: '2.0', method: 'call', params: payload,
      });
      // console.log(response,'response')
      if (response?.result?.success) {
        Alert.alert('✅ Success', 'Enquiry updated successfully!', [
          { text: 'OK', onPress: () => navigation.pop(2) },
        ]);
      } else {
        Alert.alert('Error', response?.result?.error || 'Failed to update enquiry.');
      }
    } catch (err) {
      console.error('Submit error:', err);
      Alert.alert('Error', 'Failed to update enquiry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Render: Loading ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={[styles.screen, isDarkMode && styles.screenDark]}>
        <HeaderCompo
          title="Edit Enquiry"
          lefticon={require('../assets/back.png')}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.loadingWrap}>
          <Loader visible />
          <Text style={[styles.loadingText, isDarkMode && styles.loadingTextDark]}>
            Loading enquiry data…
          </Text>
        </View>
      </View>
    );
  }

  // ─── Render: Main ─────────────────────────────────────────────────────────
  return (
    <View style={[styles.screen, isDarkMode && styles.screenDark]}>
      <HeaderCompo
        title="Edit Enquiry"
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Basic Info ─────────────────────────────────────────────── */}
          <SectionCard  isDarkMode={isDarkMode}>
            <Field label="Enquiry Number" isDarkMode={isDarkMode}>
              <ReadOnlyInput value={enquiryData.enquiry_number} isDarkMode={isDarkMode} />
            </Field>

            <Field label="Status" isDarkMode={isDarkMode}>
              <ReadOnlyInput value={enquiryData.status} isDarkMode={isDarkMode} />
            </Field>

            <Field label="Division" required isDarkMode={isDarkMode}>
              <SingleDropdown
                data={divisionInfo}
                value={selectedDivision}
                onChange={handleDivisionChange}
                placeholder="Select Division"
                isDarkMode={isDarkMode}
              />
            </Field>

            <Field label="Enquiry Type" isDarkMode={isDarkMode} required>
              <SingleDropdown
                data={enquiryTypeOptions}
                value={selectedType}
                onChange={item => setSelectedType(item.value)}
                placeholder="Select Enquiry Type"
                isDarkMode={isDarkMode}
              />
            </Field>

            <Field label="Enquiry Date" isDarkMode={isDarkMode}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.75}
              >
                <View style={[styles.dateBox, isDarkMode && styles.dateBoxDark]}>
                  <Text style={styles.dateIcon}>📅</Text>
                  <Text style={[styles.dateText, isDarkMode && styles.dateTextDark]}>
                    {enquiryDate || 'Select Date'}
                  </Text>
                </View>
              </TouchableOpacity>
            </Field>
          </SectionCard>

          {/* ── Sales Info ─────────────────────────────────────────────── */}
          <SectionCard  isDarkMode={isDarkMode}>
            <Field label="Sales Person" isDarkMode={isDarkMode}>
              <SingleDropdown
                data={salesPersonOptions}
                value={selectedSalesPerson}
                onChange={item => setSelectedSalesPerson(item.value)}
                placeholder="Select Sales Person"
                isDarkMode={isDarkMode}
              />
            </Field>

            <Field label="Customer" required isDarkMode={isDarkMode}>
              <SingleDropdown
                data={customerOptions}
                value={customer}
                onChange={handleCustomerChange}
                placeholder="Select Customer"
                isDarkMode={isDarkMode}
              />
            </Field>

            <Field label="Account Holder" isDarkMode={isDarkMode}>
              <TextinputCompo
                placeholder="Account Holder"
                value={accountHolder}
                onChangeText={setAccountHolder}
                isDarkMode={isDarkMode}
              />
            </Field>
          </SectionCard>

          {/* ── Address & Reference ────────────────────────────────────── */}
          <SectionCard  isDarkMode={isDarkMode}>
            <Field label="Address" isDarkMode={isDarkMode}>
              <TextinputCompo
                placeholder="Address (auto-populated on customer selection)"
                value={address}
                onChangeText={setAddress}
                isDarkMode={isDarkMode}
                multiline
                numberOfLines={3}
              />
            </Field>

            <Field label="Client Ref No." isDarkMode={isDarkMode}>
              <TextinputCompo
                placeholder="Client Reference Number"
                value={clientrefno}
                onChangeText={setClientRefNo}
                isDarkMode={isDarkMode}
              />
            </Field>
          </SectionCard>

          {/* ── Financial Info ─────────────────────────────────────────── */}
          <SectionCard  isDarkMode={isDarkMode}>
            <Field label="Cost Center" isDarkMode={isDarkMode}>
              <SingleDropdown
                data={costcenterlist}
                value={selectedCostCenter}
                onChange={item => setSelectedCostCenter(item.value)}
                placeholder="Select Cost Center"
                isDarkMode={isDarkMode}
              />
            </Field>

            <Field label="Pricelist" isDarkMode={isDarkMode}>
              <SingleDropdown
                data={pricelist}
                value={selectedPricelist}
                onChange={item => setSelectedPricelist(item.value)}
                placeholder="Select Pricelist"
                isDarkMode={isDarkMode}
              />
            </Field>

            <Field label="Opportunity" isDarkMode={isDarkMode}>
              <SingleDropdown
                data={opportunitydata}
                value={selectedOpportunity}
                onChange={item => setSelectedOpportunity(item.value)}
                placeholder="Select Opportunity"
                isDarkMode={isDarkMode}
              />
            </Field>
          </SectionCard>

          {/* ── Comments ───────────────────────────────────────────────── */}
          <SectionCard  isDarkMode={isDarkMode}>
            <Field label="Comments" isDarkMode={isDarkMode}>
            <TextinputCompo
              placeholder="Add any additional comments…"
              value={comments}
              onChangeText={setComments}
              isDarkMode={isDarkMode}
              multiline
              numberOfLines={4}
            />
            </Field>
          </SectionCard>

          {/* ── Other Info (collapsible) ───────────────────────────────── */}
          <TouchableOpacity
            style={[styles.toggleRow, isDarkMode && styles.toggleRowDark]}
            onPress={() => setPressOtherInfo(v => !v)}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, isDarkMode && styles.toggleTextDark]}>
              {pressOtherInfo ? '▲' : '▼'}  Other Information
            </Text>
          </TouchableOpacity>

          {pressOtherInfo && (
            <SectionCard title="Other Information" icon="ℹ️" isDarkMode={isDarkMode}>
              <Field label="Bank Account" isDarkMode={isDarkMode}>
                <SingleDropdown
                  data={banklist}
                  value={selectedBankAccount}
                  onChange={item => setSelectedBankAccount(item.value)}
                  placeholder="Select Bank Account"
                  isDarkMode={isDarkMode}
                />
              </Field>

              <Field label="Contact Person" isDarkMode={isDarkMode}>
                <SingleDropdown
                  data={formattedContacts}
                  value={selectedContactPerson}
                  onChange={handleContactPersonChange}
                  placeholder="Select Contact Person"
                  isDarkMode={isDarkMode}
                />
              </Field>

              <Field label="Contact Phone" isDarkMode={isDarkMode}>
                <TextinputCompo
                  placeholder="Contact Person Phone"
                  value={contactPhone}
                  onChangeText={setContactPhone}
                  keyboardType="phone-pad"
                  isDarkMode={isDarkMode}
                />
              </Field>

              <Field label="Contact Email" isDarkMode={isDarkMode}>
                <TextinputCompo
                  placeholder="Contact Person Email"
                  value={contactEmail}
                  onChangeText={setContactEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  isDarkMode={isDarkMode}
                />
              </Field>
            </SectionCard>
          )}

          {/* ── Enquiry Lines ──────────────────────────────────────────── */}
          <TouchableOpacity
            style={[styles.linesBtn, isDarkMode && styles.linesBtnDark]}
            onPress={() => navigation.navigate('EditEnquiryLines', { enquiryId: enquiryData.id })}
            activeOpacity={0.85}
          >
            <Text style={styles.linesBtnText}>📄  View Enquiry Lines</Text>
          </TouchableOpacity>

          {/* ── Action Row ─────────────────────────────────────────────── */}
          <View style={styles.actionRow}>
            <ButtonCompo
              title="Query"
              onPress={() => navigation.navigate(navigationString.QUERY, { enquiryId: enquiryData })}
              style={styles.actionBtn}
            />
            <ButtonCompo
              title="Terms & Conditions"
              onPress={() => navigation.navigate(navigationString.TERMANDCONDITION, { enquiryId: enquiryData })}
              style={styles.actionBtn}
            />
          </View>

          {/* ── Save / Cancel ──────────────────────────────────────────── */}
          <View style={styles.saveRow}>
            <TouchableOpacity
              style={[styles.cancelBtn, isDarkMode && styles.cancelBtnDark]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={[styles.cancelBtnText, isDarkMode && styles.cancelBtnTextDark]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
              onPress={handleSubmit}
              disabled={isSaving}
              activeOpacity={0.85}
            >
              {isSaving
                ? <Loader visible size="small" color="#fff" />
                : <Text style={styles.saveBtnText}>Save Changes</Text>
              }
            </TouchableOpacity>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </Animated.View>

      {/* Date Picker */}
      <DateTimePicker
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        date={dayjs(enquiryDate).isValid() ? dayjs(enquiryDate).toDate() : new Date()}
      />
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F2F8',
  },
  screenDark: {
    backgroundColor: '#12161F',
  },

  // Loading
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: '#4A5568',
    fontWeight: '500',
  },
  loadingTextDark: {
    color: '#9AACCC',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  // Date box
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDE3F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  dateBoxDark: {
    borderColor: '#2D3748',
    backgroundColor: '#1E2433',
  },
  dateIcon: { fontSize: 16, marginRight: 10 },
  dateText: { fontSize: 14, color: '#2D3748', fontWeight: '500' },
  dateTextDark: { color: '#E2E8F0' },

  // Toggle "Other Info"
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#EEF1FB',
    borderRadius: 12,
    marginBottom: 12,
  },
  toggleRowDark: {
    backgroundColor: '#1A2035',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B4563',
    letterSpacing: 0.3,
  },
  toggleTextDark: { color: '#A8B4D0' },

  // Enquiry lines button
  linesBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  linesBtnDark: {
    backgroundColor: '#1D4ED8',
  },
  linesBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },

  // Action row (Query / T&C)
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  actionBtn: {
    flex: 1,
  },

  // Save / Cancel
  saveRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E0',
    backgroundColor: '#fff',
  },
  cancelBtnDark: {
    borderColor: '#2D3748',
    backgroundColor: '#1E2433',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A5568',
  },
  cancelBtnTextDark: { color: '#9AACCC' },

  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 50,
  },
  saveBtnDisabled: {
    backgroundColor: '#86EFAC',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default EditEnquiryPage;