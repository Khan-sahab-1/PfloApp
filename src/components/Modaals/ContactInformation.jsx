// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   ScrollView,
// //   TouchableOpacity,
// // } from 'react-native';
// // import React, {useContext, useEffect, useState} from 'react';
// // import TextinputCompo from '../TextinputCompo';
// // import {COLORS} from '../../styles/Colors';
// // import SingleDropdown from '../SingleDropdown';
// // import urls from '../../../url';
// // import {AuthContext} from '../../Screens/Context';
// // import makeApiCall from '../../utils/apiHelper';
// // import HeaderCompo from '../HeaderCompo';

// // const ContactInformation = ({onSave, navigation, route}) => {
// //   const contextType = useContext(AuthContext);
// //   const server_origin = contextType.currentUrl;
// //   const [querycloseddate, setquerycloseddate] = useState('');

// //   const countryUrl = server_origin + urls.fetchCountryUrl;
// //   const stateUrl = server_origin + urls.fetchStatesUrl;
// //   const onSaveFromParent = route.params?.onSave;
// //   // ---------------- STATES ----------------
// //   const [countries, setCountries] = useState([]);
// //   const [states, setStates] = useState([]);

// //   const [campaignList, setCampaignList] = useState([]);
// //   const [sourceList, setSourceList] = useState([]);
// //   const [mediumList, setMediumList] = useState([]);

// //   // Form fields
// //   const [prospectName, setProspectName] = useState('');
// //   const [street, setStreet] = useState('');
// //   const [city, setCity] = useState('');
// //   const [zipCode, setZipCode] = useState('');
// //   const [contactName, setContactName] = useState('');
// //   const [jobPosition, setJobPosition] = useState('');
// //   const [mobile, setMobile] = useState('');
// //   const [referredBy, setReferredBy] = useState('');
// //   const [daystoassign, setdaystoassign] = useState('');
// //   const [daystoclose, setdaystoclose] = useState('');
// //   // Dropdown states
// //   const [selectedCountryId, setSelectedCountryId] = useState(null);
// //   const [selectedStateId, setSelectedStateId] = useState(null);
// //   const [campaign, setCampaign] = useState('');
// //   const [medium, setMedium] = useState('');
// //   const [source, setSource] = useState('');

// //   const {data} = route.params;
// //   console.log(data?.contact_information, '----data in contact info----');
// //   useEffect(() => {
// //     if (data?.contact_information) {
// //       const info = data.contact_information;

// //       setStreet(info.street || '');
// //       setCity(info.city || '');
// //       setZipCode(info.zipCode || '');
// //       setSelectedCountryId(info.selectedCountryId || null);
// //       setSelectedStateId(info.selectedStateId || null);
// //       setCampaign(info.campaign || null);
// //       setMedium(info.medium || null);
// //       setSource(info.source || null);
// //       setdaystoassign(info.daystoassign?.toString() || '');
// //       setdaystoclose(info.daystoclose?.toString() || '');
// //       setReferredBy(info.referredBy || '');
// //       setJobPosition(info.jobPosition || '');
// //       setMobile(info.mobile || '');
// //     }
// //   }, [data]);

// //   // ---------------- FETCH COUNTRY ----------------
// //   const fetchCountries = async () => {
// //     try {
// //       const response = await fetch(countryUrl, {
// //         method: 'POST',
// //         headers: {'Content-Type': 'application/json'},
// //         body: JSON.stringify({jsonrpc: '2.0', method: 'call', params: {}}),
// //       });

// //       const result = await response.json();

// //       if (result?.result) {
// //         const list = result.result.map(item => ({
// //           label: item.name,
// //           value: item.id,
// //         }));
// //         setCountries(list);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching countries:', error);
// //     }
// //   };

// //   // ---------------- FETCH STATES ----------------
// //   const fetchStates = async () => {
// //     if (!selectedCountryId) return;

// //     try {
// //       const response = await fetch(stateUrl, {
// //         method: 'POST',
// //         headers: {'Content-Type': 'application/json'},
// //         body: JSON.stringify({
// //           jsonrpc: '2.0',
// //           method: 'call',
// //           params: {country_id: parseInt(selectedCountryId)},
// //         }),
// //       });

// //       const result = await response.json();

// //       if (result?.result) {
// //         const list = result.result.map(item => ({
// //           label: item.name,
// //           value: item.id,
// //         }));
// //         setStates(list);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching states:', error);
// //     }
// //   };

// //   // ---------------- FETCH CAMPAIGN ----------------
// //   const fetchCampaign = async () => {
// //     try {
// //       const response = await makeApiCall(
// //         server_origin,
// //         urls.fetchcompaindata,
// //         'POST',
// //         {jsonrpc: '2.0', method: 'call'},
// //       );

// //       if (response?.result) {
// //         const formatted = response.result.map(item => ({
// //           label: item.campaign_name,
// //           value: item.campaign_id,
// //         }));
// //         setCampaignList(formatted);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching campaign', error);
// //     }
// //   };

// //   // ---------------- FETCH SOURCE ----------------
// //   const fetchSource = async () => {
// //     try {
// //       const response = await makeApiCall(
// //         server_origin,
// //         urls.fetchsource,
// //         'POST',
// //         {jsonrpc: '2.0', method: 'call'},
// //       );

// //       if (response?.result) {
// //         const formatted = response.result.map(item => ({
// //           label: item.source_name,
// //           value: item.source_id,
// //         }));
// //         setSourceList(formatted);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching source', error);
// //     }
// //   };

// //   // ---------------- FETCH MEDIUM ----------------
// //   const fetchMedium = async () => {
// //     try {
// //       const response = await makeApiCall(
// //         server_origin,
// //         urls.fetchmedium,
// //         'POST',
// //         {jsonrpc: '2.0', method: 'call'},
// //       );

// //       if (response?.result) {
// //         const formatted = response.result.map(item => ({
// //           label: item.medium_name,
// //           value: item.medium_id,
// //         }));
// //         setMediumList(formatted);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching medium', error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCountries();
// //     fetchCampaign();
// //     fetchSource();
// //     fetchMedium();
// //   }, []);

// //   useEffect(() => {
// //     if (selectedCountryId) fetchStates();
// //   }, [selectedCountryId]);

// //   // ---------------- SAVE ----------------
// //   const handleSave = () => {
// //     const finalData = {
// //       prospectName,
// //       street,
// //       city,
// //       zipCode,
// //       contactName,
// //       jobPosition,
// //       mobile,
// //       referredBy,
// //       selectedCountryId,
// //       selectedStateId,
// //       campaign,
// //       medium,
// //       source,
// //       daystoassign,
// //       daystoclose,
// //     };

// //     // 🔥 Call parent screen function
// //     if (onSaveFromParent) {
// //       onSaveFromParent(finalData);
// //     }

// //     // 🔙 Close screen
// //     navigation.goBack();
// //   };

// //   return (
// //     <>
// //       <HeaderCompo
// //         title={'Contact Information'}
// //         lefticon={require('../../assets/back.png')}
// //         onPress={() => navigation.goBack()}
// //       />
// //       <View style={styles.container}>
// //         <ScrollView showsVerticalScrollIndicator={false}>
// //           <Text style={styles.title}>Contact Information</Text>

// //           <Text style={styles.normalText}>Prospect Name</Text>
// //           <TextinputCompo
// //             value={prospectName}
// //             onChangeText={setProspectName}
// //             placeholder="Prospect Name"
// //           />

// //           <Text style={styles.normalText}>Street</Text>
// //           <TextinputCompo
// //             value={street}
// //             onChangeText={setStreet}
// //             placeholder="Street"
// //           />

// //           <Text style={styles.normalText}>Country</Text>
// //           <SingleDropdown
// //             data={countries}
// //             placeholder="Select Country"
// //             onChange={item => setSelectedCountryId(item.value)}
// //           />

// //           <Text style={styles.normalText}>State</Text>
// //           <SingleDropdown
// //             data={states}
// //             placeholder="Select State"
// //             onChange={item => setSelectedStateId(item.value)}
// //           />

// //           <Text style={styles.normalText}>City</Text>
// //           <TextinputCompo
// //             value={city}
// //             onChangeText={setCity}
// //             placeholder="City"
// //           />

// //           <Text style={styles.normalText}>Zip Code</Text>
// //           <TextinputCompo
// //             value={zipCode}
// //             onChangeText={setZipCode}
// //             placeholder="Zip Code"
// //           />

// //           <Text style={styles.normalText}>Contact Name</Text>
// //           <TextinputCompo
// //             value={contactName}
// //             onChangeText={setContactName}
// //             placeholder="Contact Name"
// //           />

// //           <Text style={styles.normalText}>Job Position</Text>
// //           <TextinputCompo
// //             value={jobPosition}
// //             onChangeText={setJobPosition}
// //             placeholder="Job Position"
// //           />

// //           <Text style={styles.normalText}>Mobile</Text>
// //           <TextinputCompo
// //             value={mobile}
// //             onChangeText={setMobile}
// //             placeholder="Mobile"
// //           />

// //           {/* CAMPAIGN DETAILS */}
// //           <Text style={styles.title}>Campaign Details</Text>

// //           <Text style={styles.normalText}>Campaign</Text>
// //           <SingleDropdown
// //             data={campaignList}
// //             placeholder="Select Campaign"
// //             onChange={item => setCampaign(item.value)}
// //           />

// //           <Text style={styles.normalText}>Medium</Text>
// //           <SingleDropdown
// //             data={mediumList}
// //             placeholder="Select Medium"
// //             onChange={item => setMedium(item.value)}
// //           />

// //           <Text style={styles.normalText}>Source</Text>
// //           <SingleDropdown
// //             data={sourceList}
// //             placeholder="Select Source"
// //             onChange={item => setSource(item.value)}
// //           />

// //           <Text style={styles.title}>Days to Assign</Text>
// //           <TextinputCompo
// //             value={daystoassign}
// //             onChangeText={setdaystoassign}
// //             placeholder="Days to Assign"
// //             keyboardType="number-pad"
// //           />
// //           <Text style={styles.title}>Days to Close</Text>
// //           <TextinputCompo
// //             value={daystoclose}
// //             onChangeText={setdaystoclose}
// //             placeholder="Days to Close"
// //             keyboardType="number-pad"
// //           />
// //           <Text style={styles.title}>Referred By</Text>
// //           <TextinputCompo
// //             value={referredBy}
// //             onChangeText={setReferredBy}
// //             placeholder="Referred By"
// //           />

// //           <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
// //             <Text style={styles.saveText}>Save</Text>
// //           </TouchableOpacity>
// //         </ScrollView>
// //       </View>
// //     </>
// //   );
// // };

// // export default ContactInformation;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     padding: 20,
// //   },
// //   title: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     marginVertical: 15,
// //   },
// //   normalText: {
// //     fontSize: 16,
// //     color: COLORS.black,
// //     marginTop: 10,
// //   },
// //   saveBtn: {
// //     marginVertical: 30,
// //     backgroundColor: COLORS.BLUE,
// //     padding: 15,
// //     borderRadius: 10,
// //     alignItems: 'center',
// //   },
// //   saveText: {
// //     color: '#fff',
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //   },
// // });

// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';
// import React, {useContext, useEffect, useState} from 'react';
// import TextinputCompo from '../TextinputCompo';
// import {COLORS} from '../../styles/Colors';
// import SingleDropdown from '../SingleDropdown';
// import urls from '../../../url';
// import {AuthContext} from '../../Screens/Context';
// import makeApiCall from '../../utils/apiHelper';
// import HeaderCompo from '../HeaderCompo';

// const ContactInformation = ({onSave, navigation, route}) => {
//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const [querycloseddate, setquerycloseddate] = useState('');

//   const countryUrl = server_origin + urls.fetchCountryUrl;
//   const stateUrl = server_origin + urls.fetchStatesUrl;
//   const onSaveFromParent = route.params?.onSave;
//   // ---------------- STATES ----------------
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);

//   const [campaignList, setCampaignList] = useState([]);
//   const [sourceList, setSourceList] = useState([]);
//   const [mediumList, setMediumList] = useState([]);

//   // Form fields
//   const [prospectName, setProspectName] = useState('');
//   const [street, setStreet] = useState('');
//   const [city, setCity] = useState('');
//   const [zipCode, setZipCode] = useState('');
//   const [contactName, setContactName] = useState('');
//   const [jobPosition, setJobPosition] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [referredBy, setReferredBy] = useState('');
//   const [daystoassign, setdaystoassign] = useState('');
//   const [daystoclose, setdaystoclose] = useState('');
//   // Dropdown states
//   const [selectedCountryId, setSelectedCountryId] = useState(null);
//   const [selectedStateId, setSelectedStateId] = useState(null);
//   const [campaign, setCampaign] = useState('');
//   const [medium, setMedium] = useState('');
//   const [source, setSource] = useState('');

//   // Add these states to track the selected dropdown values for display
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedCampaign, setSelectedCampaign] = useState(null);
//   const [selectedMedium, setSelectedMedium] = useState(null);
//   const [selectedSource, setSelectedSource] = useState(null);

//   const {data} = route.params;
//   console.log(data?.contact_information, '----data in contact info----');

//   // ---------------- FETCH COUNTRY ----------------
//   const fetchCountries = async () => {
//     try {
//       const response = await fetch(countryUrl, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({jsonrpc: '2.0', method: 'call', params: {}}),
//       });

//       const result = await response.json();

//       if (result?.result) {
//         const list = result.result.map(item => ({
//           label: item.name,
//           value: item.id,
//         }));
//         setCountries(list);

//         // After fetching countries, find the selected one
//         if (data?.contact_information?.selectedCountryId) {
//           const foundCountry = list.find(
//             item => item.value === data.contact_information.selectedCountryId,
//           );
//           if (foundCountry) {
//             setSelectedCountry(foundCountry);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching countries:', error);
//     }
//   };

//   // ---------------- FETCH STATES ----------------
//   const fetchStates = async () => {
//     if (!selectedCountryId) return;

//     try {
//       const response = await fetch(stateUrl, {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {country_id: parseInt(selectedCountryId)},
//         }),
//       });

//       const result = await response.json();

//       if (result?.result) {
//         const list = result.result.map(item => ({
//           label: item.name,
//           value: item.id,
//         }));
//         setStates(list);

//         // After fetching states, find the selected one
//         if (data?.contact_information?.selectedStateId) {
//           const foundState = list.find(
//             item => item.value === data.contact_information.selectedStateId,
//           );
//           if (foundState) {
//             setSelectedState(foundState);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching states:', error);
//     }
//   };

//   // ---------------- FETCH CAMPAIGN ----------------
//   const fetchCampaign = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchcompaindata,
//         'POST',
//         {jsonrpc: '2.0', method: 'call'},
//       );

//       if (response?.result) {
//         const formatted = response.result.map(item => ({
//           label: item.campaign_name,
//           value: item.campaign_id,
//         }));
//         setCampaignList(formatted);

//         // After fetching campaigns, find the selected one
//         if (data?.contact_information?.campaign) {
//           const foundCampaign = formatted.find(
//             item => item.value === data.contact_information.campaign,
//           );
//           if (foundCampaign) {
//             setSelectedCampaign(foundCampaign);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching campaign', error);
//     }
//   };

//   // ---------------- FETCH SOURCE ----------------
//   const fetchSource = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchsource,
//         'POST',
//         {jsonrpc: '2.0', method: 'call'},
//       );

//       if (response?.result) {
//         const formatted = response.result.map(item => ({
//           label: item.source_name,
//           value: item.source_id,
//         }));
//         setSourceList(formatted);

//         // After fetching sources, find the selected one
//         if (data?.contact_information?.source) {
//           const foundSource = formatted.find(
//             item => item.value === data.contact_information.source,
//           );
//           if (foundSource) {
//             setSelectedSource(foundSource);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching source', error);
//     }
//   };

//   // ---------------- FETCH MEDIUM ----------------
//   const fetchMedium = async () => {
//     try {
//       const response = await makeApiCall(
//         server_origin,
//         urls.fetchmedium,
//         'POST',
//         {jsonrpc: '2.0', method: 'call'},
//       );

//       if (response?.result) {
//         const formatted = response.result.map(item => ({
//           label: item.medium_name,
//           value: item.medium_id,
//         }));
//         setMediumList(formatted);

//         // After fetching mediums, find the selected one
//         if (data?.contact_information?.medium) {
//           const foundMedium = formatted.find(
//             item => item.value === data.contact_information.medium,
//           );
//           if (foundMedium) {
//             setSelectedMedium(foundMedium);
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching medium', error);
//     }
//   };

//   useEffect(() => {
//     // Initialize text fields from data
//     if (data?.contact_information) {
//       const info = data.contact_information;
//       setStreet(info.street || '');
//       setCity(info.city || '');
//       setZipCode(info.zipCode || '');
//       setdaystoassign(info.daystoassign?.toString() || '');
//       setdaystoclose(info.daystoclose?.toString() || '');
//       setReferredBy(info.referredBy || '');
//       setJobPosition(info.jobPosition || '');
//       setMobile(info.mobile || '');
//     }
//   }, [data]);

//   useEffect(() => {
//     // Fetch all dropdown data
//     fetchCountries();
//     fetchCampaign();
//     fetchSource();
//     fetchMedium();
//   }, []);

//   useEffect(() => {
//     if (data?.contact_information?.medium) {
//       const foundMedium = mediumList.find(
//         item => item.value === data.contact_information.medium,
//       );
//       console.log(foundMedium, 'Fount');
//     }
//   }, []);

//   // Update other dropdown IDs when their selected values change

//   // ---------------- SAVE ----------------
//   const handleSave = () => {
//     const finalData = {
//       prospectName,
//       street,
//       city,
//       zipCode,
//       contactName,
//       jobPosition,
//       mobile,
//       referredBy,
//       selectedCountryId: selectedCountry?.value || null,
//       selectedStateId: selectedState?.value || null,
//       campaign: selectedCampaign?.value || null,
//       medium: selectedMedium?.value || null,
//       source: selectedSource?.value || null,
//       daystoassign,
//       daystoclose,
//     };

//     // 🔥 Call parent screen function
//     if (onSaveFromParent) {
//       onSaveFromParent(finalData);
//     }

//     // 🔙 Close screen
//     navigation.goBack();
//   };

//   return (
//     <>
//       <HeaderCompo
//         title={'Contact Information'}
//         lefticon={require('../../assets/back.png')}
//         onPress={() => navigation.goBack()}
//       />
//       <View style={styles.container}>
//         <ScrollView showsVerticalScrollIndicator={false}>
//           <Text style={styles.title}>Contact Information</Text>

//           <Text style={styles.normalText}>Prospect Name</Text>
//           <TextinputCompo
//             value={prospectName}
//             onChangeText={setProspectName}
//             placeholder="Prospect Name"
//           />

//           <Text style={styles.normalText}>Street</Text>
//           <TextinputCompo
//             value={street}
//             onChangeText={setStreet}
//             placeholder="Street"
//           />

//           <Text style={styles.normalText}>Country</Text>
//           <SingleDropdown
//             data={countries}
//             placeholder="Select Country"
//             selectedValue={selectedCountry}
//             onChange={item => setSelectedCountry(item)}
//           />

//           <Text style={styles.normalText}>State</Text>
//           <SingleDropdown
//             data={states}
//             placeholder="Select State"
//             selectedValue={selectedState}
//             onChange={item => setSelectedState(item)}
//           />

//           <Text style={styles.normalText}>City</Text>
//           <TextinputCompo
//             value={city}
//             onChangeText={setCity}
//             placeholder="City"
//           />

//           <Text style={styles.normalText}>Zip Code</Text>
//           <TextinputCompo
//             value={zipCode}
//             onChangeText={setZipCode}
//             placeholder="Zip Code"
//           />

//           <Text style={styles.normalText}>Contact Name</Text>
//           <TextinputCompo
//             value={contactName}
//             onChangeText={setContactName}
//             placeholder="Contact Name"
//           />

//           <Text style={styles.normalText}>Job Position</Text>
//           <TextinputCompo
//             value={jobPosition}
//             onChangeText={setJobPosition}
//             placeholder="Job Position"
//           />

//           <Text style={styles.normalText}>Mobile</Text>
//           <TextinputCompo
//             value={mobile}
//             onChangeText={setMobile}
//             placeholder="Mobile"
//           />

//           {/* CAMPAIGN DETAILS */}
//           <Text style={styles.title}>Campaign Details</Text>

//           <Text style={styles.normalText}>Campaign</Text>
//           <SingleDropdown
//             data={campaignList}
//             placeholder="Select Campaign"
//             selectedValue={selectedCampaign}
//             onChange={item => setSelectedCampaign(item)}
//           />

//           <Text style={styles.normalText}>Medium</Text>
//           <SingleDropdown
//             data={mediumList}
//             placeholder="Select Medium"
//             selectedValue={selectedMedium}
//             onChange={item => setSelectedMedium(item)}
//           />

//           <Text style={styles.normalText}>Source</Text>
//           <SingleDropdown
//             data={sourceList}
//             placeholder="Select Source"
//             selectedValue={selectedSource}
//             onChange={item => setSelectedSource(item)}
//           />

//           <Text style={styles.title}>Days to Assign</Text>
//           <TextinputCompo
//             value={daystoassign}
//             onChangeText={setdaystoassign}
//             placeholder="Days to Assign"
//             keyboardType="number-pad"
//           />
//           <Text style={styles.title}>Days to Close</Text>
//           <TextinputCompo
//             value={daystoclose}
//             onChangeText={setdaystoclose}
//             placeholder="Days to Close"
//             keyboardType="number-pad"
//           />
//           <Text style={styles.title}>Referred By</Text>
//           <TextinputCompo
//             value={referredBy}
//             onChangeText={setReferredBy}
//             placeholder="Referred By"
//           />

//           <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
//             <Text style={styles.saveText}>Save</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </View>
//     </>
//   );
// };

// export default ContactInformation;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginVertical: 15,
//   },
//   normalText: {
//     fontSize: 16,
//     color: COLORS.black,
//     marginTop: 10,
//   },
//   saveBtn: {
//     marginVertical: 30,
//     backgroundColor: COLORS.BLUE,
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   saveText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });
//bug id 2822 Jamshed start
//Description: In contact information screen, when we select country and state, then we save the record. After that when we open the same record for edit, in contact information screen, country and state dropdown values are not showing. It is showing blank. But when we click on dropdown then only it is showing the selected value. It should show the selected value without click on dropdown.
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import TextinputCompo from '../TextinputCompo';
import {COLORS} from '../../styles/Colors';
import SingleDropdown from '../SingleDropdown';
import urls from '../../../url';
import {AuthContext} from '../../Screens/Context';
import makeApiCall from '../../utils/apiHelper';
import HeaderCompo from '../HeaderCompo';

const ContactInformation = ({onSave, navigation, route}) => {
  const {currentUrl} = useContext(AuthContext);
  const onSaveFromParent = route.params?.onSave;
  const {data} = route.params;

  // ---------------- STATES ----------------
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [campaignList, setCampaignList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [mediumList, setMediumList] = useState([]);

  // Text Inputs
  const [prospectName, setProspectName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [contactName, setContactName] = useState('');
  const [jobPosition, setJobPosition] = useState('');
  const [mobile, setMobile] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [daystoassign, setdaystoassign] = useState('');
  const [daystoclose, setdaystoclose] = useState('');

  // Dropdown selections (store full object)
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedMedium, setSelectedMedium] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);

  //-----------------------------------------
  // 📌 PREFILL TEXT FIELDS
  //-----------------------------------------
  useEffect(() => {
    if (!data?.contact_information) return;
    const info = data.contact_information;

    setProspectName(info.prospectName || '');
    setStreet(info.street || '');
    setCity(info.city || '');
    setZipCode(info.zipCode || '');
    setContactName(info.contactName || '');
    setJobPosition(info.jobPosition || '');
    setMobile(info.mobile || '');
    setReferredBy(info.referredBy || '');
    setdaystoassign(info.daystoassign?.toString() || '');
    setdaystoclose(info.daystoclose?.toString() || '');
  }, [data]);

  //-----------------------------------------
  // 📌 FETCH: COUNTRY
  //-----------------------------------------
  const fetchCountries = async () => {
    try {
      const response = await fetch(currentUrl + urls.fetchCountryUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({jsonrpc: '2.0', method: 'call', params: {}}),
      });

      const result = await response.json();
      if (result?.result) {
        const list = result.result.map(item => ({
          label: item.name,
          value: item.id,
        }));

        setCountries(list);

        // Prefill country
        const cid = data?.contact_information?.selectedCountryId;
        if (cid) {
          const found = list.find(i => i.value === cid);
          if (found) {
            setSelectedCountry(found);
          }
        }
      }
    } catch (e) {
      console.log('Country error:', e);
    }
  };

  //-----------------------------------------
  // 📌 FETCH: STATES (Auto-triggered when country selected)
  //-----------------------------------------
  const fetchStates = async countryID => {
    try {
      const response = await fetch(currentUrl + urls.fetchStatesUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {country_id: countryID},
        }),
      });

      const result = await response.json();
      if (result?.result) {
        const list = result.result.map(item => ({
          label: item.name,
          value: item.id,
        }));

        setStates(list);

        // Prefill state
        const sid = data?.contact_information?.selectedStateId;
        if (sid) {
          const found = list.find(i => i.value === sid);
          if (found) setSelectedState(found);
        }
      }
    } catch (e) {
      console.log('State error:', e);
    }
  };

  //-----------------------------------------
  // 📌 FETCH: CAMPAIGN
  //-----------------------------------------
  const fetchCampaign = async () => {
    try {
      const response = await makeApiCall(
        currentUrl,
        urls.fetchcompaindata,
        'POST',
        {jsonrpc: '2.0', method: 'call'},
      );

      if (response?.result) {
        const list = response.result.map(item => ({
          label: item.campaign_name,
          value: item.campaign_id,
        }));

        setCampaignList(list);

        const cid = data?.contact_information?.campaign;
        if (cid) {
          const found = list.find(i => i.value === cid);
          if (found) setSelectedCampaign(found);
        }
      }
    } catch (e) {
      console.log('Campaign error:', e);
    }
  };

  //-----------------------------------------
  // 📌 FETCH: MEDIUM
  //-----------------------------------------
  const fetchMedium = async () => {
    try {
      const response = await makeApiCall(currentUrl, urls.fetchmedium, 'POST', {
        jsonrpc: '2.0',
        method: 'call',
      });

      if (response?.result) {
        const list = response.result.map(item => ({
          label: item.medium_name,
          value: item.medium_id,
        }));

        setMediumList(list);

        const mid = data?.contact_information?.medium;
        if (mid) {
          const found = list.find(i => i.value === mid);
          if (found) setSelectedMedium(found);
        }
      }
    } catch (e) {
      console.log('Medium error:', e);
    }
  };

  //-----------------------------------------
  // 📌 FETCH: SOURCE
  //-----------------------------------------
  const fetchSource = async () => {
    try {
      const response = await makeApiCall(currentUrl, urls.fetchsource, 'POST', {
        jsonrpc: '2.0',
        method: 'call',
      });

      if (response?.result) {
        const list = response.result.map(item => ({
          label: item.source_name,
          value: item.source_id,
        }));

        setSourceList(list);

        const sid = data?.contact_information?.source;
        if (sid) {
          const found = list.find(i => i.value === sid);
          if (found) setSelectedSource(found);
        }
      }
    } catch (e) {
      console.log('Source error:', e);
    }
  };

  //-----------------------------------------
  // 📌 RUN ALL FETCH APIs
  //-----------------------------------------
  useEffect(() => {
    fetchCountries();
    fetchCampaign();
    fetchMedium();
    fetchSource();
  }, []);

  //-----------------------------------------
  // 📌 WHEN COUNTRY PREFILLED → fetch states
  //-----------------------------------------
  useEffect(() => {
    if (selectedCountry?.value) {
      fetchStates(selectedCountry.value);
    }
  }, [selectedCountry]);

  //-----------------------------------------
  // 📌 SAVE DATA
  //-----------------------------------------
  const handleSave = () => {
    const finalData = {
      prospectName,
      street,
      city,
      zipCode,
      contactName,
      jobPosition,
      mobile,
      referredBy,
      selectedCountryId: selectedCountry?.value || null,
      selectedStateId: selectedState?.value || null,
      campaign: selectedCampaign?.value || null,
      medium: selectedMedium?.value || null,
      source: selectedSource?.value || null,
      daystoassign,
      daystoclose,
    };

    if (onSaveFromParent) onSaveFromParent(finalData);
    navigation.goBack();
  };

  return (
    <>
      <HeaderCompo
        title="Contact Information"
        lefticon={require('../../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Contact Information</Text>

          {/* Prospect */}
          <Text style={styles.normalText}>Prospect Name</Text>
          <TextinputCompo
            value={prospectName}
            onChangeText={setProspectName}
            placeholder={'Prospect Name'}
          />

          <Text style={styles.normalText}>Street</Text>
          <TextinputCompo
            value={street}
            onChangeText={setStreet}
            placeholder={'Street'}
          />

          {/* COUNTRY */}
          <Text style={styles.normalText}>Country</Text>
          <SingleDropdown
            data={countries}
            value={selectedCountry}
            placeholder="Select Country"
            onChange={item => {
              setSelectedCountry(item);
              setSelectedState(null);
              setStates([]);
            }}
          />

          {/* STATE */}
          <Text style={styles.normalText}>State</Text>
          <SingleDropdown
            data={states}
            value={selectedState}
            placeholder="Select State"
            onChange={setSelectedState}
          />

          <Text style={styles.normalText}>City</Text>
          <TextinputCompo
            value={city}
            onChangeText={setCity}
            placeholder={'City'}
          />

          <Text style={styles.normalText}>Zip Code</Text>
          <TextinputCompo
            value={zipCode}
            onChangeText={setZipCode}
            placeholder={'Zip Code'}
            keyboardType={'number-pad'}
            maxLength={6}
          />

          <Text style={styles.normalText}>Contact Name</Text>
          <TextinputCompo
            value={contactName}
            onChangeText={setContactName}
            placeholder={'Contact Name'}
          />

          <Text style={styles.normalText}>Job Position</Text>
          <TextinputCompo
            value={jobPosition}
            onChangeText={setJobPosition}
            placeholder={'Job Position'}
          />

          <Text style={styles.normalText}>Mobile</Text>
          <TextinputCompo
            value={mobile}
            onChangeText={setMobile}
            placeholder={'Mobile'}
            maxLength={10}
          />

          {/* CAMPAIGN DETAILS */}
          <Text style={styles.title}>Marketing </Text>

          <Text style={styles.normalText}>Campaign</Text>
          <SingleDropdown
            data={campaignList}
            value={selectedCampaign}
            placeholder="Select Campaign"
            onChange={setSelectedCampaign}
          />

          <Text style={styles.normalText}>Medium</Text>
          <SingleDropdown
            data={mediumList}
            value={selectedMedium}
            placeholder="Select Medium"
            onChange={setSelectedMedium}
          />

          <Text style={styles.normalText}>Source</Text>
          <SingleDropdown
            data={sourceList}
            value={selectedSource}
            placeholder="Select Source"
            onChange={setSelectedSource}
          />

          {/* <Text style={styles.normalText}>Days to Assign</Text>
          <TextinputCompo
            value={daystoassign}
            onChangeText={setdaystoassign}
            keyboardType="number-pad"
            placeholder={'Days to Assign'}
          /> */}

          {/* <Text style={styles.normalText}>Days to Close</Text>
          <TextinputCompo
            value={daystoclose}
            onChangeText={setdaystoclose}
            keyboardType="number-pad"
            placeholder={'Days to Close'}
          /> */}
           <Text style={styles.normalText}>Misc</Text>
          <Text style={styles.normalText}>Referred By</Text>
          <TextinputCompo
            value={referredBy}
            onChangeText={setReferredBy}
            placeholder={'Refferred By'}
          />

          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};

export default ContactInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  normalText: {
    fontSize: 16,
    color: COLORS.black,
    marginTop: 10,
  },
  saveBtn: {
    marginVertical: 30,
    backgroundColor: COLORS.BLUE,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
//bug id 2822 Jamshed end
