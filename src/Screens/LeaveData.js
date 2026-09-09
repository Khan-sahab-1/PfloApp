// // Jamshed start 
// import React, { useState, useEffect, useContext, useCallback } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
// import urls from '../../url';
// import { AuthContext } from './Context';
// // import LeaveForm from './LeaveForm';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import HeaderCompo from '../components/HeaderCompo';
// import ButtonCompo from '../components/ButtonCompo';

// const LeaveData = ({ route }) => {
//   const [leaveData, setLeaveData] = useState([]);
//   const [expandedLeave, setExpandedLeave] = useState(null);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [activeTab, setActiveTab] = useState('confirm');
//   const [selectedItemId, setSelectedItemId] = useState(null);
//   const contextType = useContext(AuthContext);
//   const navigation = useNavigation();
//   const server_origin = contextType.currentUrl;
//   const getrejectleave = server_origin + urls.getCancel;
//   const getLeaveData = server_origin + urls.getNotificationLeave;
//   const employeeLeaveName = route.params.userName;
//   const employeeLeaveCode = route.params.employeeCode;
//   const colorScheme = useColorScheme();

//   useFocusEffect(
//   useCallback(() => {
//     fetchLeaveData();
//   }, [])
// );


//   const fetchLeaveData = async () => {
//     try {
//       const response = await fetch(getLeaveData, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: { employeeLeaveName, employeeLeaveCode },
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       console.log("LEAVE RECORD", data)
//       setLeaveData(data.result);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleRejectLeave = async (itemId) => {
//     try {
//       const response = await fetch(getrejectleave, {
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
//       fetchLeaveData();
//     } catch (error) {
//       console.error('Error rejecting Leave :-', error);
//     }
//   };

//   const toggleExpand = (index) => {
//     setExpandedLeave(index === expandedLeave ? null : index);
//   };

//   // const handleRecordClick = (record) => {
//   //   setSelectedRecord(record);
//   //   setIsFormVisible(true);
//   // };
//   const handleEdit = (record) => {
//     navigation.navigate('EditLeaveData', { leaveRecord: record });
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   // const renderLeaveItem = ({ item, index }) => (
    
//   //   <TouchableOpacity style={styles.card(colorScheme)} onPress={() => handleEdit(item)}>
//   //     {/* <TouchableOpacity style={styles.card(colorScheme)} onPress={() => handleRecordClick(item)}> */}
//   //     <Text style={styles.cardText(colorScheme)}>{item.employee_name} &nbsp; ({item.designation})</Text>
//   //     <Text style={styles.detailsText(colorScheme)}>Description: {item.name}</Text>
//   //     <Text style={styles.detailsText(colorScheme)}>No. Of Days: {item.number_of_days}</Text>
//   //     {/* <Text style={styles.detailsText(colorScheme)}>NO Of Days: {item.number_of_days} &nbsp; Leave Type: {item.leave_type}</Text> */}
//   //     <Text style={styles.detailsText(colorScheme)}>Start Date: {formatDate(item.date_from)} &nbsp; - {item.leave_time_from}</Text>
//   //     <Text style={styles.detailsText(colorScheme)}>End Date: {formatDate(item.date_to)} &nbsp; - {item.leave_time_to}</Text>
//   //     {activeTab === 'confirm' && (
//   //       <View style={styles.buttonContainer}>
//   //         {/* <TouchableOpacity
//   //           style={styles.rejectButton(colorScheme)}
//   //           onPress={() => {
//   //             handleRejectLeave(item.id);
//   //             setSelectedItemId(item.id);
//   //           }}
//   //         >
//   //           <Text style={styles.buttonText}>Cancel</Text>
//   //         </TouchableOpacity> */}
//   //         {activeTab === 'confirm' && 
//   //         (<ButtonCompo
//   //         title='Cancel'
//   //         onPress={() => {
//   //             handleRejectLeave(item.id);
//   //             setSelectedItemId(item.id);
//   //           }}
//   //            style={styles.rejectButton(colorScheme)}/>
//   //         )}
//   //       </View>
//   //     )}

//   //     {expandedLeave === index && (
//   //       <View style={styles.detailsContainer}>
//   //         <Text style={styles.detailsText(colorScheme)}>Start Date: {formatDate(item.date_from)}</Text>
//   //         <Text style={styles.detailsText(colorScheme)}>End Date: {formatDate(item.date_to)}</Text>
//   //         <Text style={styles.detailsText(colorScheme)}>Description: {item.name}</Text>
//   //         <Text style={styles.detailsText(colorScheme)}>NO Of Days: {item.number_of_days}</Text>
//   //       </View>
//   //     )}
//   //   </TouchableOpacity>
//   // );
//   const renderLeaveItem = ({ item, index }) => {
//     const isInactive = item.state === 'refuse' || item.state === 'validate1';
  
//     return (
//       <TouchableOpacity
//         style={[
//           styles.card(colorScheme),
         
//         ]}
//         onPress={() => {
//           if (!isInactive) {
//             handleEdit(item);
//           }
//         }}
//         disabled={isInactive} // disables touch
//       >
//         <Text style={styles.cardText(colorScheme)}>
//           {item.employee_name} &nbsp; ({item.designation})
//         </Text>
//         <Text style={styles.detailsText(colorScheme)}>Description: {item.name}</Text>
//         <Text style={styles.detailsText(colorScheme)}>No. Of Days: {item.number_of_days}</Text>
//         <Text style={styles.detailsText(colorScheme)}>
//           Start Date: {formatDate(item.date_from)} &nbsp; - {item.leave_time_from}
//         </Text>
//         <Text style={styles.detailsText(colorScheme)}>
//           End Date: {formatDate(item.date_to)} &nbsp; - {item.leave_time_to}
//         </Text>
  
//         {activeTab === 'confirm' && (
//           <View style={styles.buttonContainer}>
//             <ButtonCompo
//               title="Cancel"
//               onPress={() => {
//                 handleRejectLeave(item.id);
//                 setSelectedItemId(item.id);
//               }}
//               style={styles.rejectButton(colorScheme)}
//             />
//           </View>
//         )}
  
//         {expandedLeave === index && (
//           <View style={styles.detailsContainer}>
//             <Text style={styles.detailsText(colorScheme)}>Start Date: {formatDate(item.date_from)}</Text>
//             <Text style={styles.detailsText(colorScheme)}>End Date: {formatDate(item.date_to)}</Text>
//             <Text style={styles.detailsText(colorScheme)}>Description: {item.name}</Text>
//             <Text style={styles.detailsText(colorScheme)}>No. Of Days: {item.number_of_days}</Text>
//           </View>
//         )}
//       </TouchableOpacity>
//     );
//   };
  

//   return (
//     <>
//     <HeaderCompo title={'Leave Data'} lefticon={require('../assets/back.png')}
//     onPress={()=>navigation.goBack()}/>
//     <View style={styles.container(colorScheme)}>
//       {/* <View style={styles.headerContainer}>
//         <Text style={styles.headerText}>Leave Data</Text>
//       </View> */}

//       <View style={styles.header}>
//         <TouchableOpacity
//           style={[styles.tabButton(colorScheme), activeTab === 'confirm' && styles.activeTabButton]}
//           onPress={() => setActiveTab('confirm')}>
//           <Text style={styles.tabButtonText}>Pending</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tabButton(colorScheme), Array.isArray(activeTab) && activeTab.includes('validate') && styles.activeTabButton]}
//           onPress={() => setActiveTab(['validate', 'validate1'])}>
//           <Text style={styles.tabButtonText}>Approved</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tabButton(colorScheme), activeTab === 'refuse' && styles.activeTabButton]}
//           onPress={() => setActiveTab('refuse')}>
//           <Text style={styles.tabButtonText}>Cancelled</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.kanbanContainer}>
//         <FlatList
//           data={
//             Array.isArray(activeTab)
//               ? leaveData.filter(item => activeTab.includes(item.state))
//               : leaveData.filter(item => item.state === activeTab)
//           }
//           renderItem={renderLeaveItem}
//           keyExtractor={(item, index) => index.toString()}
//         />
//       </View>

//       {isFormVisible && selectedRecord && (
//         <LeaveForm
//           record={selectedRecord}
//           onCloseForm={() => setIsFormVisible(false)}
//         />
//       )}
//     </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: (colorScheme) => ({
//     flex: 1,
//     backgroundColor: colorScheme === 'dark' ? '#121212' : 'white',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   }),
//   headerContainer: {
//     backgroundColor: 'blue',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   headerText: {
//     fontSize: 24,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   tabButton: (colorScheme) => ({
//     flex: 1,
//     paddingVertical: 12,
//     backgroundColor: colorScheme === 'dark' ? '#333' : 'blue',
//     borderRadius: 8,
//     marginHorizontal: 5,
//     marginTop: 20,
//   }),
//   activeTabButton: {
//     backgroundColor: 'darkblue',
//   },
//   tabButtonText: {
//     color: 'white',
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   kanbanContainer: {
//     flex: 1,
//   },
//   card: (colorScheme) => ({
//     backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#eaeaea',
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 8,
//   }),
//   cardText: (colorScheme) => ({
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: colorScheme === 'dark' ? 'white' : 'black',
//   }),
//   detailsContainer: {
//     marginTop: 10,
//     paddingLeft: 10,
//     borderLeftWidth: 2,
//     borderColor: 'lightgray',
//   },
//   detailsText: (colorScheme) => ({
//     fontSize: 14,
//     marginBottom: 5,
//     fontWeight: 'bold',
//     color: colorScheme === 'dark' ? 'white' : 'black',
//   }),
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 8,
//   },
//   rejectButton: (colorScheme) => ({
//     backgroundColor: colorScheme === 'dark' ? '#333' : 'blue',
//     padding: 10,
//     borderRadius: 5,
//   }),
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default LeaveData;

// // Jamshed start 



// // import React, { useState, useEffect, useContext } from 'react';
// // import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
// // import urls from '../../url';
// // import { AuthContext } from './Context';
// // import LeaveForm from './LeaveForm';

// // const LeaveData = ({ route }) => {
// //   const [leaveData, setLeaveData] = useState([]);
// //   const [expandedLeave, setExpandedLeave] = useState(null);
// //   const [selectedRecord, setSelectedRecord] = useState(null);
// //   const [isFormVisible, setIsFormVisible] = useState(false);
// //   const [activeTab, setActiveTab] = useState('confirm');
// //   const [selectedItemId, setSelectedItemId] = useState(null);
// //   const contextType = useContext(AuthContext);
// //   const server_origin = contextType.currentUrl;
// //   const getrejectleave = server_origin + urls.getReject;
// //   const getLeaveData = server_origin + urls.getNotificationLeave;
// //   const employeeLeaveName = route.params.userName;
// //   const employeeLeaveCode = route.params.employeeCode;

// //   useEffect(() => {
// //     fetchLeaveData();

// //   }, []);

// //   const fetchLeaveData = async () => {

// //     try {

// //       const response = await fetch(getLeaveData, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           jsonrpc: '2.0',
// //           method: 'call',
// //           params: { employeeLeaveName, employeeLeaveCode },
// //         }),
// //       });
// //       if (!response.ok) {
// //         throw new Error('Network response was not ok');
// //       }
// //       const data = await response.json();
// //       // console.log(':-----------',data)
// //       setLeaveData(data.result);
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //     }
// //   };

// //   const handleRejectLeave = async (itemId) => {
// //     try {
// //       const response = await fetch(getrejectleave, {
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
// //       fetchLeaveData();
// //     } catch (error) {
// //       console.error('Error rejecting Leave :-', error);
// //     }
// //   };

// //   const toggleExpand = (index) => {
// //     setExpandedLeave(index === expandedLeave ? null : index);
// //   };

// //   const handleRecordClick = (record) => {
// //     setSelectedRecord(record);
// //     setIsFormVisible(true);
// //   };
// //   const formatDate = (dateString) => {
// //     const date = new Date(dateString);
// //     const day = date.getDate();
// //     const month = date.getMonth() + 1;
// //     const year = date.getFullYear();
// //     return `${day}/${month}/${year}`;
// //   };


// //   const renderLeaveItem = ({ item, index }) => (

// //     <TouchableOpacity style={styles.card} onPress={() => handleRecordClick(item)}>

// //       <Text style={styles.cardText}>{item.employee_name} &nbsp; ({item.designation})</Text>
// //       <Text style={styles.detailsText}>Description: {item.name}</Text>
// //       <Text style={styles.detailsText}>NO Of Days: {item.number_of_days} &nbsp; Leave Type: {item.leave_type}</Text>
// //       <Text style={styles.detailsText}>Start Date: {formatDate(item.date_from)} &nbsp; - {item.leave_time_from}</Text>
// //       <Text style={styles.detailsText}>End Date: {formatDate(item.date_to)} &nbsp; - {item.leave_time_to}</Text>
// //       {activeTab === 'confirm' && (
// //         <View style={styles.buttonContainer}>
// //           <TouchableOpacity
// //             style={styles.rejectButton}
// //             onPress={() => {
// //               handleRejectLeave(item.id);
// //               setSelectedItemId(item.id);
// //             }}
// //           >
// //             <Text style={styles.buttonText}>Cancel</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}

// //       {expandedLeave === index && (

// //         <View style={styles.detailsContainer}>

// //           <Text style={styles.detailsText}>Start Date: {formatDate(item.date_from)}</Text>
// //           <Text style={styles.detailsText}>End Date: {formatDate(item.date_to)}</Text>
// //           <Text style={styles.detailsText}>Description: {item.name}</Text>
// //           <Text style={styles.detailsText}>NO Of Days: {item.number_of_days}</Text>

// //         </View>

// //       )}

// //     </TouchableOpacity>

// //   );

// //   return (

// //     <View style={styles.container}>
// //       <View
// //         style={{
// //           backgroundColor: 'blue',
// //           alignItems: 'center',
// //           paddingVertical: 10,
// //         }}>
// //         <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>Leave Data</Text>
// //       </View>

// //       <View style={styles.header}>

// //         <TouchableOpacity

// //           style={[styles.tabButton, activeTab === 'confirm' && styles.activeTabButton]}
// //           onPress={() => setActiveTab('confirm')}>
// //           <Text style={styles.tabButtonText}>Pending</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity

// //           style={[styles.tabButton, activeTab === 'validate' && styles.activeTabButton]}
// //           onPress={() => setActiveTab('validate')}>
// //           <Text style={styles.tabButtonText}>Approved</Text>

// //         </TouchableOpacity>

// //         <TouchableOpacity

// //           style={[styles.tabButton, activeTab === 'refuse' && styles.activeTabButton]}
// //           onPress={() => setActiveTab('refuse')}>
// //           <Text style={styles.tabButtonText}>Cancelled</Text>

// //         </TouchableOpacity>

// //       </View>

// //       <View style={styles.kanbanContainer}>

// //         <FlatList
// //           data={leaveData.filter(item => item.state === activeTab)}
// //           renderItem={renderLeaveItem}
// //           keyExtractor={(item, index) => index.toString()}
// //         />

// //       </View>

// //       {isFormVisible && selectedRecord && (

// //         <LeaveForm
// //           record={selectedRecord}
// //           onCloseForm={() => setIsFormVisible(false)}
// //         />

// //       )}

// //     </View>

// //   );
// // };

// // const styles = StyleSheet.create({

// //   container: {
// //     flex: 1,
// //     backgroundColor: 'white',
// //     paddingHorizontal: 20,
// //     paddingTop: 20,
// //   },

// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 20,
// //   },

// //   tabButton: {
// //     flex: 1,
// //     paddingVertical: 12,
// //     backgroundColor: 'blue',
// //     borderRadius: 8,
// //     marginHorizontal: 5,
// //     marginTop: 20,
// //   },

// //   activeTabButton: {
// //     backgroundColor: 'darkblue',
// //   },

// //   tabButtonText: {
// //     color: 'white',
// //     textAlign: 'center',
// //     fontWeight: 'bold',
// //   },

// //   kanbanContainer: {
// //     flex: 1,
// //   },

// //   card: {
// //     backgroundColor: '#eaeaea',
// //     padding: 10,
// //     marginBottom: 10,
// //     borderRadius: 8,
// //   },

// //   cardText: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },

// //   detailsContainer: {
// //     marginTop: 10,
// //     paddingLeft: 10,
// //     borderLeftWidth: 2,
// //     borderColor: 'lightgray',
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
// //   rejectButton: {
// //     backgroundColor: 'blue',
// //     padding: 10,
// //     borderRadius: 5,
// //   },
// //   buttonText: {
// //     color: 'white',
// //     fontWeight: 'bold',
// //   },
// // });

// // export default LeaveData;




// LeaveData.jsx — Professional Rewrite
import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Animated,
  useRef,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import urls from '../../url';
import { AuthContext } from './Context';
import HeaderCompo from '../components/HeaderCompo';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'confirm',              label: 'Pending',   icon: '⏳', states: ['confirm'] },
  { key: 'validate',             label: 'Approved',  icon: '✅', states: ['validate', 'validate1'] },
  { key: 'refuse',               label: 'Cancelled', icon: '❌', states: ['refuse'] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const getStateStyle = (state) => {
  switch (state) {
    case 'validate':
    case 'validate1': return { label: 'Approved',  color: '#16A34A', bg: '#DCFCE7' };
    case 'confirm':   return { label: 'Pending',   color: '#D97706', bg: '#FEF3C7' };
    case 'refuse':    return { label: 'Cancelled', color: '#DC2626', bg: '#FEE2E2' };
    default:          return { label: state,       color: '#6B7280', bg: '#F3F4F6' };
  }
};

// ─── Badge ────────────────────────────────────────────────────────────────────

const StateBadge = ({ state }) => {
  const { label, color, bg } = getStateStyle(state);
  return (
    <View style={[badgeS.wrap, { backgroundColor: bg }]}>
      <Text style={[badgeS.text, { color }]}>{label}</Text>
    </View>
  );
};
const badgeS = StyleSheet.create({
  wrap: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
});

// ─── Info Row ─────────────────────────────────────────────────────────────────

const InfoRow = ({ icon, label, value, isDarkMode }) => (
  <View style={infoS.row}>
    <Text style={infoS.icon}>{icon}</Text>
    <Text style={[infoS.label, isDarkMode && infoS.labelDark]}>{label}:</Text>
    <Text style={[infoS.value, isDarkMode && infoS.valueDark]}>{value ?? '—'}</Text>
  </View>
);
const infoS = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  icon:      { fontSize: 13, marginRight: 6, width: 20, textAlign: 'center', marginTop: 1 },
  label:     { fontSize: 13, color: '#6B7280', fontWeight: '600', marginRight: 4 },
  labelDark: { color: '#9AACCC' },
  value:     { fontSize: 13, color: '#1F2937', fontWeight: '500', flex: 1 },
  valueDark: { color: '#E2E8F0' },
});

// ─── Leave Card ───────────────────────────────────────────────────────────────

const LeaveCard = ({ item, isDarkMode, activeTabKey, onCancel, cancelLoading }) => {
  const isEditable  = item.state === 'confirm';
  const navigation  = useNavigation();
  const fadeAnim    = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }).start();
  }, []);

  const handlePress = () => {
    if (isEditable) navigation.navigate('EditLeaveData', { leaveRecord: item });
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[cardS.card, isDarkMode && cardS.cardDark, !isEditable && cardS.cardMuted]}
        onPress={handlePress}
        disabled={!isEditable}
        activeOpacity={isEditable ? 0.75 : 1}
      >
        {/* Card Header */}
        <View style={cardS.header}>
          <View style={[cardS.avatar, { backgroundColor: isEditable ? '#2563EB' : '#9CA3AF' }]}>
            <Text style={cardS.avatarText}>
              {(item.employee_name || '?')[0].toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[cardS.name, isDarkMode && cardS.nameDark]} numberOfLines={1}>
              {item.employee_name}
            </Text>
            {item.designation ? (
              <Text style={[cardS.designation, isDarkMode && cardS.designationDark]}>
                {item.designation}
              </Text>
            ) : null}
          </View>
          <StateBadge state={item.state} />
        </View>

        <View style={[cardS.divider, isDarkMode && cardS.dividerDark]} />

        {/* Details */}
        <InfoRow icon="📝" label="Description" value={item.name}            isDarkMode={isDarkMode} />
        <InfoRow icon="📅" label="Days"         value={item.number_of_days} isDarkMode={isDarkMode} />
        <InfoRow
          icon="🟢" label="Start"
          value={`${formatDate(item.date_from)}${item.leave_time_from ? '  ·  ' + item.leave_time_from : ''}`}
          isDarkMode={isDarkMode}
        />
        <InfoRow
          icon="🔴" label="End"
          value={`${formatDate(item.date_to)}${item.leave_time_to ? '  ·  ' + item.leave_time_to : ''}`}
          isDarkMode={isDarkMode}
        />

        {/* Edit hint for pending */}
        {isEditable && (
          <Text style={[cardS.editHint, isDarkMode && cardS.editHintDark]}>
            ✏️  Tap to edit
          </Text>
        )}

        {/* Cancel button for pending */}
        {activeTabKey === 'confirm' && isEditable && (
          <View style={cardS.actions}>
            <TouchableOpacity
              style={[cardS.cancelBtn, cancelLoading === item.id && cardS.btnDisabled]}
              onPress={() => {
                Alert.alert(
                  'Cancel Leave',
                  'Are you sure you want to cancel this leave request?',
                  [
                    { text: 'No',  style: 'cancel' },
                    { text: 'Yes', style: 'destructive', onPress: () => onCancel(item.id) },
                  ],
                );
              }}
              disabled={cancelLoading === item.id}
              activeOpacity={0.8}
            >
              {cancelLoading === item.id
                ? <ActivityIndicator size="small" color="#DC2626" />
                : <Text style={cardS.cancelBtnText}>✕  Cancel Leave</Text>
              }
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const cardS = StyleSheet.create({
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
  cardMuted: { opacity: 0.85 },

  header:      { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar:      { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText:  { color: '#fff', fontSize: 18, fontWeight: '700' },
  name:        { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  nameDark:    { color: '#F1F5F9' },
  designation: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  designationDark: { color: '#9AACCC' },

  divider:     { height: 1, backgroundColor: '#F1F5F9', marginBottom: 12 },
  dividerDark: { backgroundColor: '#2D3748' },

  editHint:     { fontSize: 12, color: '#2563EB', fontWeight: '500', marginTop: 8 },
  editHintDark: { color: '#60A5FA' },

  actions: { marginTop: 14 },
  cancelBtn: {
    paddingVertical: 11, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#EF4444',
    alignItems: 'center', justifyContent: 'center',
  },
  cancelBtnText: { color: '#DC2626', fontWeight: '700', fontSize: 14 },
  btnDisabled:   { opacity: 0.5 },
});

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ label, isDarkMode }) => (
  <View style={emptyS.wrap}>
    <Text style={emptyS.emoji}>📋</Text>
    <Text style={[emptyS.title, isDarkMode && emptyS.titleDark]}>No {label} Leaves</Text>
    <Text style={[emptyS.sub, isDarkMode && emptyS.subDark]}>
      You have no {label.toLowerCase()} leave requests.
    </Text>
  </View>
);
const emptyS = StyleSheet.create({
  wrap:      { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emoji:     { fontSize: 48, marginBottom: 12 },
  title:     { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 6 },
  titleDark: { color: '#E2E8F0' },
  sub:       { fontSize: 14, color: '#9CA3AF', textAlign: 'center', paddingHorizontal: 32 },
  subDark:   { color: '#6B7280' },
});

// ─── Main Component ───────────────────────────────────────────────────────────

const LeaveData = ({ route }) => {
  const contextType       = useContext(AuthContext);
  const server_origin     = contextType.currentUrl;
  const navigation        = useNavigation();
  const colorScheme       = useColorScheme();
  const isDarkMode        = colorScheme === 'dark';

  const employeeLeaveName = route.params.userName;
  const employeeLeaveCode = route.params.employeeCode;

  const [leaveData,     setLeaveData]     = useState([]);
  const [activeTabKey,  setActiveTabKey]  = useState('confirm');
  const [isLoading,     setIsLoading]     = useState(true);
  const [isRefreshing,  setIsRefreshing]  = useState(false);
  const [cancelLoading, setCancelLoading] = useState(null);

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchLeaveData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await fetch(server_origin + urls.getNotificationLeave, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', method: 'call',
          params: { employeeLeaveName, employeeLeaveCode },
        }),
      });
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setLeaveData(data.result || []);
    } catch (err) {
      console.error('fetchLeaveData:', err);
      if (!silent) Alert.alert('Error', 'Failed to load leave data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [server_origin, employeeLeaveName, employeeLeaveCode]);

  useFocusEffect(useCallback(() => { fetchLeaveData(); }, [fetchLeaveData]));

  // ── Cancel leave ─────────────────────────────────────────────────────────

  const handleCancelLeave = useCallback(async (itemId) => {
    setCancelLoading(itemId);
    try {
      const response = await fetch(server_origin + urls.getCancel, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', method: 'call',
          params: { itemId, employeeLeaveCode },
        }),
      });
      if (!response.ok) throw new Error('Network error');
      await fetchLeaveData(true);
    } catch (err) {
      console.error('handleCancelLeave:', err);
      Alert.alert('Error', 'Failed to cancel leave. Please try again.');
    } finally {
      setCancelLoading(null);
    }
  }, [server_origin, employeeLeaveCode, fetchLeaveData]);

  // ── Derived data ──────────────────────────────────────────────────────────

  const activeTab    = TABS.find(t => t.key === activeTabKey);
  const filteredData = leaveData.filter(item => activeTab?.states.includes(item.state));

  const countFor = (tabKey) => {
    const tab = TABS.find(t => t.key === tabKey);
    return leaveData.filter(i => tab?.states.includes(i.state)).length;
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.screen, isDarkMode && styles.screenDark]}>
      <HeaderCompo
        title="My Leaves"
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <View style={[styles.tabBar, isDarkMode && styles.tabBarDark]}>
        {TABS.map(tab => {
          const isActive = activeTabKey === tab.key;
          const count    = countFor(tab.key);
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive, isDarkMode && !isActive && styles.tabDark]}
              onPress={() => setActiveTabKey(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive, isDarkMode && !isActive && styles.tabLabelDark]}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View style={[styles.tabBadge, isActive ? styles.tabBadgeActive : styles.tabBadgeInactive]}>
                  <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>


      <View style={[styles.strip, isDarkMode && styles.stripDark]}>
        <Text style={[styles.stripText, isDarkMode && styles.stripTextDark]}>
          {filteredData.length} {filteredData.length === 1 ? 'record' : 'records'}  ·  {activeTab?.label}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={[styles.loadingText, isDarkMode && styles.loadingTextDark]}>
            Loading leave data…
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[
            styles.listContent,
            filteredData.length === 0 && { flex: 1 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => { setIsRefreshing(true); fetchLeaveData(true); }}
              tintColor="#2563EB"
            />
          }
          ListEmptyComponent={
            <EmptyState label={activeTab?.label ?? ''} isDarkMode={isDarkMode} />
          }
          renderItem={({ item }) => (
            <LeaveCard
              item={item}
              isDarkMode={isDarkMode}
              activeTabKey={activeTabKey}
              onCancel={handleCancelLeave}
              cancelLoading={cancelLoading}
            />
          )}
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
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F6',
    gap: 8,
  },
  tabBarDark: { backgroundColor: '#1A2035', borderBottomColor: '#2D3748' },

  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 9, borderRadius: 10,
    backgroundColor: '#F0F2F8', gap: 4,
  },
  tabDark:   { backgroundColor: '#161B28' },
  tabActive: { backgroundColor: '#2563EB' },

  tabIcon:  { fontSize: 13 },
  tabLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  tabLabelDark:   { color: '#9AACCC' },
  tabLabelActive: { color: '#fff' },

  tabBadge: {
    minWidth: 18, height: 18, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeActive:   { backgroundColor: 'rgba(255,255,255,0.3)' },
  tabBadgeInactive: { backgroundColor: '#E5E7EB' },
  tabBadgeText:     { fontSize: 10, fontWeight: '700', color: '#374151' },
  tabBadgeTextActive: { color: '#fff' },


  strip: {
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#EEF0F6',
  },
  stripDark:     { backgroundColor: '#161B28', borderBottomColor: '#2D3748' },
  stripText:     { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  stripTextDark: { color: '#6B7280' },


  listContent: { padding: 16 },

  loadingWrap:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText:     { marginTop: 12, fontSize: 14, color: '#6B7280', fontWeight: '500' },
  loadingTextDark: { color: '#9AACCC' },
});

export default LeaveData;
