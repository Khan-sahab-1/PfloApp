// // Jamshed start 
// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, Button, ScrollView, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
// import urls from '../../url';
// import { AuthContext } from './Context';
// import HeaderCompo from '../components/HeaderCompo';

// const NotificationPage = ({ route,navigation }) => {
//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const getNotification = server_origin + urls.getNotificationData;
//   const getapprove = server_origin + urls.getApproved;
//   const getreject = server_origin + urls.getReject;
//   const [notificationData, setNotificationData] = useState([]);
//   const [notificationStatus, setNotificationStatus] = useState(null);
//   const [selectedItemId, setSelectedItemId] = useState(null);
//   const [draftCount, setDraftCount] = useState(0);
//   const employeeLeaveCode = route.params.employeeCode;
//   console.log('Employee leave code   ',employeeLeaveCode)

//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';

//   const fetchNotificationData = async () => {
//     try {
//       const response = await fetch(getNotification, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: { employeeLeaveCode },
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       console.log("Notification data----", data)
//       setNotificationData(data.result);
//       const draftRecords = data.result.filter(item => item.state === 'confirm');
//       setDraftCount(draftRecords.length);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleApproveStatus = () => {
//     setNotificationStatus('Approved');
//     fetchNotificationData();
//   };

//   const handlePending = () => {
//     setNotificationStatus('Pending');
//     fetchNotificationData();
//   };

//   const handleRefuse = () => {
//     setNotificationStatus('Cancelled');
//     fetchNotificationData();
//   };

//   useEffect(() => {
//     fetchNotificationData();
//   }, []);

//   const handleApprove = async itemId => {
//     try {
//       const response = await fetch(getapprove, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: { itemId,employeeLeaveCode },
//         }),
//       });
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       fetchNotificationData();
//     } catch (error) {
//       console.error('Error approving notification:', error);
//     }
//   };

//   const handleReject = async itemId => {
//     try {
//       const response = await fetch(getreject, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: { itemId, employeeLeaveCode },
//         }),
//       });
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       fetchNotificationData();
//     } catch (error) {
//       console.error('Error rejecting notification:', error);
//     }
//   };

//   const formatDate = dateString => {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   return (
//     <>
//     <HeaderCompo title={'Notification'} lefticon={require('../assets/back.png')} onPress={()=>navigation.goBack()} />
//     <View style={[styles.container, isDarkMode && styles.containerDark]}>
//       {/* <View style={[styles.headerBar, isDarkMode && styles.headerBarDark]}>
//         <Text style={styles.headerText}>Notification</Text>
//       </View> */}
//       <Text style={[styles.statusText, isDarkMode && styles.statusTextDark]}>
//         Notification Status: {notificationStatus}
//       </Text>
//       <View style={styles.buttonContainer}>
//         <Button title="Approve" onPress={handleApproveStatus} />
//         <Button title={`Pending (${draftCount})`} onPress={handlePending} />
//         <Button title="Cancelled" onPress={handleRefuse} />
//       </View>
//       <ScrollView style={{ marginTop: 20 }}>
//         {notificationData.map((item, index) => (
//           <>
//             {notificationStatus === 'Approved' && (item.state === 'validate' || item.state === 'validate1') && (
//               <View key={index} style={[styles.card, isDarkMode && styles.cardDark]}>
//                 <Text style={[styles.cardText, isDarkMode && styles.cardTextDark]}>
//                   {item.employee_name}
//                 </Text>
//                 <Text style={[styles.cardText, isDarkMode && styles.cardTextDark]}>{item.designation}</Text>
//                 <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   Description: {item.name}
//                 </Text>
//                 <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   No. Of Days: {item.number_of_days}
//                 </Text>
//                 {/* <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   NO Of Days: {item.number_of_days} &nbsp; Leave Type: {item.leave_type}
//                 </Text> */}
//                 <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   Start Date: {formatDate(item.date_from)} &nbsp; - {item.leave_time_from}
//                 </Text>
//                 <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   End Date: {formatDate(item.date_to)} &nbsp; - {item.leave_time_to}
//                 </Text>
//               </View>
//             )}
//             {notificationStatus === 'Cancelled' && item.state === 'refuse' && (
//               <View key={index} style={[styles.card, isDarkMode && styles.cardDark]}>
//                 <Text style={[styles.cardText, isDarkMode && styles.cardTextDark]}>
//                   {item.employee_name} &nbsp; ({item.designation})
//                 </Text>
//                 <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   Description: {item.name}
//                 </Text>
//                 <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   NO Of Days: {item.number_of_days}
//                 </Text>
//                 {/* <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   NO Of Days: {item.number_of_days} &nbsp; Leave Type: {item.leave_type}
//                 </Text> */}
//                 <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   Start Date: {formatDate(item.date_from)} &nbsp; - {item.leave_time_from}
//                 </Text>
//                 <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   End Date: {formatDate(item.date_to)} &nbsp; - {item.leave_time_to}
//                 </Text>
//               </View>
//             )}
//             {notificationStatus === 'Pending' && item.state === 'confirm' && (
//               <View key={index} style={[styles.card, (item.notice_period || item.probation) && styles.redMark, isDarkMode && styles.cardDark]}>
//                 <Text style={[styles.cardText, isDarkMode && styles.cardTextDark]}>
//                   {item.employee_name} &nbsp; ({item.designation})
//                 </Text>
//                 <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   Description: {item.name}
//                 </Text>
//                 <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   NO Of Days: {item.number_of_days}
//                 </Text>
//                 {/* <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   NO Of Days: {item.number_of_days} &nbsp; Leave Type: {item.leave_type}
//                 </Text> */}
//                 <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   Start Date: {formatDate(item.date_from)} &nbsp; - {item.leave_time_from}
//                 </Text>
//                 <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   Time from: {item.date_to_time_from}
//                 </Text>
//                 <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   End Date: {formatDate(item.date_to)} &nbsp; - {item.leave_time_to}
//                 </Text>
//                 <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
//                   Time to: {item.date_to_time_to}
//                 </Text>
//                 <View style={styles.buttonContainer}>
//                   <TouchableOpacity
//                     style={styles.approveButton}
//                     onPress={() => {
//                       handleApprove(item.id);
//                       setSelectedItemId(item.id);
//                     }}
//                   >
//                     <Text style={styles.buttonText}>Approve</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.rejectButton}
//                     onPress={() => {
//                       handleReject(item.id);
//                       setSelectedItemId(item.id);
//                     }}
//                   >
//                     <Text style={styles.buttonText}>Reject</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             )}
//           </>
//         ))}
//       </ScrollView>
//     </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     paddingHorizontal: 5,
//     paddingTop: 20,
//   },
//   containerDark: {
//     backgroundColor: 'black',
//   },
//   headerBar: {
//     backgroundColor: 'blue',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   headerBarDark: {
//     backgroundColor: 'darkblue',
//   },
//   headerText: {
//     fontSize: 24,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   statusText: {
//     fontSize: 20,
//     marginBottom: 20,
//     marginTop: 20,
//     fontWeight: 'bold',
//   },
//   statusTextDark: {
//     color: 'white',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//   },
//   card: {
//     backgroundColor: '#eaeaea',
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   cardDark: {
//     backgroundColor: '#333',
//   },
//   redMark: {
//     borderColor: 'red',
//     borderWidth: 2,
//   },
//   detailsText: {
//     fontSize: 14,
//     marginBottom: 5,
//     fontWeight: 'bold',
//   },
//   detailsTextDark: {
//     color: 'white',
//   },
//   cardText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   cardTextDark: {
//     color: 'white',
//   },
//   approveButton: {
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//   },
//   rejectButton: {
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default NotificationPage;
// // Jamshed start 




// // import React, { useState, useEffect, useContext } from 'react';
// // import { View, Text, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
// // import urls from '../../url';
// // import { AuthContext } from './Context';

// // const NotificationPage = ({ route }) => {
// //   const contextType = useContext(AuthContext);
// //   const server_origin = contextType.currentUrl;
// //   const getNotification = server_origin + urls.getNotificationData;
// //   const getapprove = server_origin + urls.getApproved;
// //   const getreject = server_origin + urls.getReject;
// //   const [notificationData, setNotificationData] = useState([]);
// //   const [notificationStatus, setNotificationStatus] = useState(null);
// //   const [selectedItemId, setSelectedItemId] = useState(null);
// //   const [draftCount, setDraftCount] = useState(0);
// //   const employeeLeaveCode = route.params.employeeCode;

// //   const fetchNotificationData = async () => {
// //     try {
// //       const response = await fetch(getNotification, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           jsonrpc: '2.0',
// //           method: 'call',
// //           params: { employeeLeaveCode },
// //         }),
// //       });

// //       if (!response.ok) {
// //         throw new Error('Network response was not ok');
// //       }

// //       const data = await response.json();
// //       setNotificationData(data.result);
// //       const draftRecords = data.result.filter(item => item.state === 'confirm');
// //       setDraftCount(draftRecords.length);
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //     }
// //   };

// //   const handleApproveStatus = () => {
// //     setNotificationStatus('Approved');
// //     fetchNotificationData();
// //   };

// //   const handlePending = () => {
// //     setNotificationStatus('Pending');
// //     fetchNotificationData();
// //   };

// //   const handleRefuse = () => {
// //     setNotificationStatus('Cancelled');
// //     fetchNotificationData();
// //   };

// //   useEffect(() => {
// //     fetchNotificationData();
// //   }, []);

// //   const handleApprove = async itemId => {
// //     try {
// //       const response = await fetch(getapprove, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           jsonrpc: '2.0',
// //           method: 'call',
// //           params: { itemId },
// //         }),
// //       });
// //       if (!response.ok) {
// //         throw new Error('Network response was not ok');
// //       }
// //       fetchNotificationData();
// //     } catch (error) {
// //       console.error('Error approving notification:', error);
// //     }
// //   };

// //   const handleReject = async itemId => {
// //     try {
// //       const response = await fetch(getreject, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           jsonrpc: '2.0',
// //           method: 'call',
// //           params: { itemId },
// //         }),
// //       });
// //       if (!response.ok) {
// //         throw new Error('Network response was not ok');
// //       }
// //       fetchNotificationData();
// //     } catch (error) {
// //       console.error('Error rejecting notification:', error);
// //     }
// //   };

// //   const formatDate = dateString => {
// //     const date = new Date(dateString);
// //     const day = date.getDate();
// //     const month = date.getMonth() + 1;
// //     const year = date.getFullYear();
// //     return `${day}/${month}/${year}`;
// //   };

// //   return (
// //     <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 5, paddingTop: 20 }}>
// //       <View style={{ backgroundColor: 'blue', alignItems: 'center', paddingVertical: 10 }}>
// //         <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>Notification</Text>
// //       </View>
// //       <Text style={styles.statusText}>Notification Status: {notificationStatus}</Text>
// //       <View style={styles.buttonContainer}>
// //         <Button title="Approve" onPress={handleApproveStatus} />
// //         <Button title={`Pending (${draftCount})`} onPress={handlePending} />
// //         <Button title="Cancelled" onPress={handleRefuse} />
// //       </View>
// //       <ScrollView style={{ marginTop: 20 }}>
// //         {notificationData.map((item, index) => (
// //           <>
// //             {notificationStatus === 'Approved' && item.state === 'validate' && (
// //               <View key={index} style={styles.card}>
// //                 <Text style={styles.cardText}>{item.employee_name} &nbsp; ({item.designation})</Text>
// //                 <Text style={styles.detailsText}>Description: {item.name}</Text>
// //                 <Text style={styles.detailsText}>NO Of Days: {item.number_of_days} &nbsp; Leave Type: {item.leave_type}</Text>
// //                 <Text style={styles.detailsText}>Start Date: {formatDate(item.date_from)} &nbsp; - {item.leave_time_from}</Text>
// //                 <Text style={styles.detailsText}>End Date: {formatDate(item.date_to)} &nbsp; - {item.leave_time_to}</Text>
// //               </View>
// //             )}
// //             {notificationStatus === 'Cancelled' && item.state === 'refuse' && (
// //               <View key={index} style={styles.card}>
// //                 <Text style={styles.cardText}>{item.employee_name} &nbsp; ({item.designation})</Text>
// //                 <Text style={styles.detailsText}>Description: {item.name}</Text>
// //                 <Text style={styles.detailsText}>NO Of Days: {item.number_of_days} &nbsp; Leave Type: {item.leave_type}</Text>
// //                 <Text style={styles.detailsText}>Start Date: {formatDate(item.date_from)} &nbsp; - {item.leave_time_from}</Text>
// //                 <Text style={styles.detailsText}>End Date: {formatDate(item.date_to)} &nbsp; - {item.leave_time_to}</Text>
// //               </View>
// //             )}
// //             {notificationStatus === 'Pending' && item.state === 'confirm' && (
// //               <View key={index} style={[styles.card, (item.notice_period || item.probation) && styles.redMark]}>
// //                 <Text style={styles.cardText}>{item.employee_name} &nbsp; ({item.designation})</Text>
// //                 <Text style={styles.detailsText}>Description: {item.name}</Text>
// //                 <Text style={styles.detailsText}>NO Of Days: {item.number_of_days} &nbsp; Leave Type: {item.leave_type}</Text>
// //                 <Text style={styles.detailsText}>Start Date: {formatDate(item.date_from)} &nbsp; - {item.leave_time_from}</Text>
// //                 <Text style={styles.detailsText}>End Date: {formatDate(item.date_to)} &nbsp; - {item.leave_time_to}</Text>
// //                 <View style={styles.buttonContainer}>
// //                   <TouchableOpacity
// //                     style={styles.approveButton}
// //                     onPress={() => {
// //                       handleApprove(item.id);
// //                       setSelectedItemId(item.id);
// //                     }}
// //                   >
// //                     <Text style={styles.buttonText}>Approve</Text>
// //                   </TouchableOpacity>
// //                   <TouchableOpacity
// //                     style={styles.rejectButton}
// //                     onPress={() => {
// //                       handleReject(item.id);
// //                       setSelectedItemId(item.id);
// //                     }}
// //                   >
// //                     <Text style={styles.buttonText}>Reject</Text>
// //                   </TouchableOpacity>
// //                 </View>
// //               </View>
// //             )}
// //           </>
// //         ))}
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   card: {
// //     backgroundColor: '#eaeaea',
// //     padding: 10,
// //     marginBottom: 10,
// //     borderRadius: 8,
// //     position: 'relative',
// //   },
// //   redMark: {
// //     borderColor: 'red',
// //     borderWidth: 2,
// //   },
// //   detailsText: {
// //     fontSize: 14,
// //     marginBottom: 5,
// //     fontWeight: 'bold',
// //   },
// //   buttonContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     marginTop: 8,
// //   },
// //   approveButton: {
// //     backgroundColor: 'blue',
// //     padding: 10,
// //     borderRadius: 5,
// //   },
// //   rejectButton: {
// //     backgroundColor: 'blue',
// //     padding: 10,
// //     borderRadius: 5,
// //   },
// //   buttonText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //   },
// //   statusText: {
// //     fontSize: 20,
// //     marginBottom: 20,
// //     marginTop: 20,
// //     fontWeight: 'bold',
// //   },
// //   cardText: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// // });

// // export default NotificationPage;


// NotificationPage.jsx — Fixed & Professional
import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Animated,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import urls from '../../url';
import { AuthContext } from './Context';
import HeaderCompo from '../components/HeaderCompo';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS = {
  ALL:       'all',
  PENDING:   'pending',
  APPROVED:  'approved',
  CANCELLED: 'cancelled',
};

const STATE_MAP = {
  [STATUS.APPROVED]:  ['validate', 'validate1'],
  [STATUS.PENDING]:   ['confirm'],
  [STATUS.CANCELLED]: ['refuse'],
};

const TAB_CONFIG = [
  { key: STATUS.ALL,       label: 'All',       icon: '🔔', countKey: false },
  { key: STATUS.PENDING,   label: 'Pending',   icon: '⏳', countKey: true  },
  { key: STATUS.APPROVED,  label: 'Approved',  icon: '✅', countKey: false },
  { key: STATUS.CANCELLED, label: 'Cancelled', icon: '❌', countKey: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return String(dateString);
  const dd   = String(d.getDate()).padStart(2, '0');
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
};

/** Guarantee a renderable string — never return null/undefined/object */
const safeStr = (val) => {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
};

const getStatusBadge = (state) => {
  switch (state) {
    case 'validate':
    case 'validate1': return { label: 'Approved',  color: '#16A34A', bg: '#DCFCE7' };
    case 'confirm':   return { label: 'Pending',   color: '#D97706', bg: '#FEF3C7' };
    case 'refuse':    return { label: 'Cancelled', color: '#DC2626', bg: '#FEE2E2' };
    case 'draft':     return { label: 'Draft',     color: '#6B7280', bg: '#F3F4F6' };
    default:          return { label: safeStr(state), color: '#6B7280', bg: '#F3F4F6' };
  }
};

// ─── StateBadge ───────────────────────────────────────────────────────────────

const StateBadge = ({ state }) => {
  const { label, color, bg } = getStatusBadge(state);
  return (
    <View style={[badgeStyles.wrap, { backgroundColor: bg }]}>
      <Text style={[badgeStyles.text, { color }]}>{label}</Text>
    </View>
  );
};

const badgeStyles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
});

// ─── InfoRow ──────────────────────────────────────────────────────────────────

const InfoRow = ({ icon, label, value, isDarkMode }) => (
  <View style={infoStyles.row}>
    <Text style={infoStyles.icon}>{icon}</Text>
    <Text style={[infoStyles.label, isDarkMode && infoStyles.labelDark]}>
      {label + ':'}
    </Text>
    <Text style={[infoStyles.value, isDarkMode && infoStyles.valueDark]}>
      {safeStr(value)}
    </Text>
  </View>
);

const infoStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  icon: { fontSize: 13, marginRight: 6, width: 20, textAlign: 'center', marginTop: 1 },
  label: { fontSize: 13, color: '#6B7280', fontWeight: '600', marginRight: 4 },
  labelDark: { color: '#9AACCC' },
  value: { fontSize: 13, color: '#1F2937', fontWeight: '500', flex: 1 },
  valueDark: { color: '#E2E8F0' },
});

// ─── LeaveCard ────────────────────────────────────────────────────────────────

const LeaveCard = ({ item, isDarkMode, onApprove, onReject, actionLoading }) => {
  const isPending   = item.state === 'confirm';
  const isHighRisk  = isPending && !!(item.notice_period || item.probation);
  const isActioning = actionLoading === item.id;
  const fadeAnim    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  const formatTime = (time) => {
  if (!time) return '';

  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');

  return `${hh}:${mm}`;
};
  // Pre-build all string values BEFORE JSX — no inline expressions in render
  const initial    = item.employee_name ? item.employee_name.charAt(0).toUpperCase() : '?';
  const empName    = safeStr(item.employee_name);
  const desig      = safeStr(item.designation);
  const riskLabel  = item.notice_period ? 'Notice Period' : 'Probation';
  const alertMsg   = '\u26A0\uFE0F  ' + riskLabel + ' — Review carefully';
  const startVal   = formatDate(item.date_from) + (item.leave_time_from ? '  ·  ' + String(item.leave_time_from) : '');
  const endVal     = formatDate(item.date_to)   + (item.leave_time_to   ? '  ·  ' + String(item.leave_time_to)   : '');

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View
        style={[
          cardStyles.card,
          isDarkMode && cardStyles.cardDark,
          isHighRisk && cardStyles.highRisk,
        ]}
      >
        {/* Header */}
        <View style={cardStyles.header}>
          <View style={cardStyles.avatarWrap}>
            <Text style={cardStyles.avatarText}>{initial}</Text>
          </View>
          <View style={cardStyles.headerInfo}>
            <Text style={[cardStyles.name, isDarkMode && cardStyles.nameDark]} numberOfLines={1}>
              {empName}
            </Text>
            {!!item.designation && (
              <Text style={[cardStyles.designation, isDarkMode && cardStyles.designationDark]}>
                {desig}
              </Text>
            )}
          </View>
          <StateBadge state={item.state} />
        </View>

        {/* High-risk banner */}
        {isHighRisk && (
          <View style={cardStyles.alertBanner}>
            <Text style={cardStyles.alertText}>{alertMsg}</Text>
          </View>
        )}

        <View style={[cardStyles.divider, isDarkMode && cardStyles.dividerDark]} />

        {/* Details */}
        <InfoRow icon="📝" label="Description" value={item.name}           isDarkMode={isDarkMode} />
        <InfoRow icon="📅" label="Days"         value={item.number_of_days} isDarkMode={isDarkMode} />
        <InfoRow icon="🟢" label="Start"        value={startVal}           isDarkMode={isDarkMode} />
        {isPending && !!item.date_to_time_from && (
          <InfoRow icon="⏰" label="Time From"  value={formatTime(item.date_to_time_from)} isDarkMode={isDarkMode} />
        )}
        <InfoRow icon="🔴" label="End" value={endVal} isDarkMode={isDarkMode} />
        {isPending && !!item.date_to_time_to && (
          <InfoRow icon="⏰" label="Time To" value={formatTime(item.date_to_time_to)} isDarkMode={isDarkMode} />
        )}

        {/* Actions */}
        {isPending && (
          <View style={cardStyles.actions}>
            <TouchableOpacity
              style={[cardStyles.rejectBtn, !!actionLoading && cardStyles.btnDisabled]}
              onPress={() => onReject(item.id)}
              disabled={!!actionLoading}
              activeOpacity={0.8}
            >
              {isActioning
                ? <ActivityIndicator size="small" color="#DC2626" />
                : <Text style={cardStyles.rejectBtnText}>{'✕  Reject'}</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={[cardStyles.approveBtn, !!actionLoading && cardStyles.btnDisabled]}
              onPress={() => onApprove(item.id)}
              disabled={!!actionLoading}
              activeOpacity={0.8}
            >
              {isActioning
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={cardStyles.approveBtnText}>{'✓  Approve'}</Text>
              }
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardDark:  { backgroundColor: '#1E2433' },
  highRisk:  { borderLeftWidth: 4, borderLeftColor: '#EF4444' },
  divider:     { height: 1, backgroundColor: '#F1F5F9', marginBottom: 12 },
  dividerDark: { backgroundColor: '#2D3748' },

  header:     { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  headerInfo: { flex: 1 },
  avatarWrap: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#2563EB',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  avatarText:      { color: '#fff', fontSize: 18, fontWeight: '700' },
  name:            { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  nameDark:        { color: '#F1F5F9' },
  designation:     { fontSize: 12, color: '#6B7280', marginTop: 2 },
  designationDark: { color: '#9AACCC' },

  alertBanner: {
    backgroundColor: '#FEF3C7', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6, marginBottom: 10,
  },
  alertText: { fontSize: 12, color: '#92400E', fontWeight: '600' },

  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  rejectBtn: {
    flex: 1, paddingVertical: 11, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#EF4444',
    alignItems: 'center', justifyContent: 'center', minHeight: 44,
  },
  rejectBtnText: { color: '#DC2626', fontWeight: '700', fontSize: 14 },
  approveBtn: {
    flex: 2, paddingVertical: 11, borderRadius: 10,
    backgroundColor: '#16A34A',
    alignItems: 'center', justifyContent: 'center', minHeight: 44,
    shadowColor: '#16A34A', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
  },
  approveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  btnDisabled:    { opacity: 0.5 },
});

// ─── TabItem ──────────────────────────────────────────────────────────────────

const TabItem = ({ tab, isActive, isDarkMode, pendingCount, onPress }) => {
  const showBadge  = tab.countKey && pendingCount > 0;
  const badgeLabel = String(pendingCount);
  return (
    <TouchableOpacity
      style={[
        tabStyles.tab,
        isActive && tabStyles.tabActive,
        isDarkMode && !isActive && tabStyles.tabDark,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={tabStyles.icon}>{tab.icon}</Text>
      <Text
        style={[
          tabStyles.label,
          isActive  && tabStyles.labelActive,
          isDarkMode && !isActive && tabStyles.labelDark,
        ]}
      >
        {tab.label}
      </Text>
      {showBadge && (
        <View style={tabStyles.badge}>
          <Text style={tabStyles.badgeText}>{badgeLabel}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const tabStyles = StyleSheet.create({
  tab: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, marginRight: 8,
    backgroundColor: '#F0F2F8',
  },
  tabDark:     { backgroundColor: '#1A2035' },
  tabActive:   { backgroundColor: '#2563EB' },
  icon:        { fontSize: 13, marginRight: 5 },
  label:       { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  labelDark:   { color: '#9AACCC' },
  labelActive: { color: '#fff' },
  badge: {
    marginLeft: 5, backgroundColor: '#EF4444',
    borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1,
    minWidth: 18, alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
});

// ─── EmptyState ───────────────────────────────────────────────────────────────

const EmptyState = ({ activeTab, isDarkMode }) => {
  const msg = activeTab === STATUS.ALL
    ? 'You have no notifications yet.'
    : 'No ' + activeTab + ' leave requests found.';
  return (
    <View style={emptyStyles.wrap}>
      <Text style={emptyStyles.emoji}>{'📭'}</Text>
      <Text style={[emptyStyles.title, isDarkMode && emptyStyles.titleDark]}>
        {'No notifications'}
      </Text>
      <Text style={[emptyStyles.sub, isDarkMode && emptyStyles.subDark]}>{msg}</Text>
    </View>
  );
};

const emptyStyles = StyleSheet.create({
  wrap:      { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emoji:     { fontSize: 48, marginBottom: 12 },
  title:     { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 6 },
  titleDark: { color: '#E2E8F0' },
  sub:       { fontSize: 14, color: '#9CA3AF', textAlign: 'center', paddingHorizontal: 30 },
  subDark:   { color: '#6B7280' },
});

// ─── Main Component ───────────────────────────────────────────────────────────

const NotificationPage = ({ route, navigation }) => {
  const contextType       = useContext(AuthContext);
  const server_origin     = contextType.currentUrl;
  const employeeLeaveCode = route.params.employeeCode;

  const colorScheme = useColorScheme();
  const isDarkMode  = colorScheme === 'dark';

  const [notificationData, setNotificationData] = useState([]);
  const [activeTab,        setActiveTab]         = useState(STATUS.ALL);
  const [isLoading,        setIsLoading]         = useState(true);
  const [isRefreshing,     setIsRefreshing]      = useState(false);
  const [actionLoading,    setActionLoading]     = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchNotificationData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await fetch(server_origin + urls.getNotificationData, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', method: 'call',
          params: { employeeLeaveCode },
        }),
      });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      setNotificationData(Array.isArray(data.result) ? data.result : []);
    } catch (err) {
      console.error('fetchNotificationData:', err);
      if (!silent) Alert.alert('Error', 'Failed to load notifications.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [server_origin, employeeLeaveCode]);

  useEffect(() => { fetchNotificationData(); }, [fetchNotificationData]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const postAction = useCallback(async (url, itemId) => {
    setActionLoading(itemId);
    try {
      const res = await fetch(server_origin + url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', method: 'call',
          params: { itemId, employeeLeaveCode },
        }),
      });
      if (!res.ok) throw new Error('Network error');
      await fetchNotificationData(true);
    } catch (err) {
      console.error('postAction:', err);
      Alert.alert('Error', 'Action failed. Please try again.');
    } finally {
      setActionLoading(null);
    }
  }, [server_origin, employeeLeaveCode, fetchNotificationData]);

  const handleApprove = useCallback((id) => postAction(urls.getApproved, id), [postAction]);
  const handleReject  = useCallback((id) => postAction(urls.getReject,   id), [postAction]);

  // ── Derived ────────────────────────────────────────────────────────────────

  const pendingCount = notificationData.filter(i => i.state === 'confirm').length;

  const filteredData = activeTab === STATUS.ALL
    ? notificationData
    : notificationData.filter(i => STATE_MAP[activeTab]?.includes(i.state));

  // Build summary string without inline JSX expressions
  const recordWord  = filteredData.length === 1 ? 'record' : 'records';
  const summaryStr  = String(filteredData.length) + ' ' + recordWord +
    (activeTab !== STATUS.ALL ? ' · ' + activeTab : '');
  const pendingStr  = '\u23F3 ' + String(pendingCount) + ' pending approval';

  // ── FlatList helpers ───────────────────────────────────────────────────────

  const renderItem = useCallback(({ item }) => (
    <LeaveCard
      item={item}
      isDarkMode={isDarkMode}
      onApprove={handleApprove}
      onReject={handleReject}
      actionLoading={actionLoading}
    />
  ), [isDarkMode, handleApprove, handleReject, actionLoading]);

  const keyExtractor = useCallback((item, index) =>
    item.id != null ? String(item.id) : String(index),
  []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchNotificationData(true);
  }, [fetchNotificationData]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.screen, isDarkMode && styles.screenDark]}>
      <HeaderCompo
        title="Notifications"
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      {/* Tab Bar */}
      <View style={[styles.tabBar, isDarkMode && styles.tabBarDark]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {TAB_CONFIG.map((tab) => (
            <TabItem
              key={tab.key}
              tab={tab}
              isActive={activeTab === tab.key}
              isDarkMode={isDarkMode}
              pendingCount={pendingCount}
              onPress={() => setActiveTab(tab.key)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Summary Strip */}
      <View style={[styles.summaryStrip, isDarkMode && styles.summaryStripDark]}>
        <Text style={[styles.summaryText, isDarkMode && styles.summaryTextDark]}>
          {summaryStr}
        </Text>
        {pendingCount > 0 && (
          <View style={styles.pendingPill}>
            <Text style={styles.pendingPillText}>{pendingStr}</Text>
          </View>
        )}
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={[styles.loadingText, isDarkMode && styles.loadingTextDark]}>
            {'Loading notifications\u2026'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.list}
          contentContainerStyle={[
            styles.listContent,
            filteredData.length === 0 && styles.listEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#2563EB"
            />
          }
          ListEmptyComponent={
            <EmptyState activeTab={activeTab} isDarkMode={isDarkMode} />
          }
          ListFooterComponent={<View style={{ height: 24 }} />}
        />
      )}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: '#F0F2F8' },
  screenDark: { backgroundColor: '#12161F' },

  tabBar: {
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#EEF0F6',
  },
  tabBarDark: { backgroundColor: '#1A2035', borderBottomColor: '#2D3748' },
  tabScroll:  { paddingRight: 8, alignItems: 'center' },

  summaryStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#EEF0F6',
  },
  summaryStripDark: { backgroundColor: '#161B28', borderBottomColor: '#2D3748' },
  summaryText:      { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  summaryTextDark:  { color: '#6B7280' },
  pendingPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  pendingPillText: { fontSize: 12, color: '#92400E', fontWeight: '600' },

  list:        { flex: 1 },
  listContent: { padding: 16 },
  listEmpty:   { flex: 1 },

  loadingWrap:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText:     { marginTop: 12, fontSize: 14, color: '#6B7280', fontWeight: '500' },
  loadingTextDark: { color: '#9AACCC' },
});

export default NotificationPage;