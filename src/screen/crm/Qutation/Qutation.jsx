// //jamshed start bug id 2555
// // Description: Refactored the Qutation component to enhance functionality and user experience. The updated component now includes a loading state, dynamic status badges with color coding, improved date and currency formatting, and a more intuitive filter mechanism for displaying quotations based on their status. The design has been improved to provide clearer information about each quotation, and the code structure has been optimized for better readability and maintainability. Additionally, a filter modal has been added to allow users to group quotations by different criteria such as salesperson, stage, division, or customer.
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import React, {useContext, useEffect, useState} from 'react';
// import makeApiCall from '../../../utils/apiHelper';
// import {AuthContext} from '../../../Screens/Context';
// import urls from '../../../../url';
// import {useSelector} from 'react-redux';
// import Loader from '../../../components/Loader';
// import HeaderCompo from '../../../components/HeaderCompo';
// import navigationString from '../../../route/navigationString';
// import FilterModal from '../../../constaints/FilterModal';
// import TextinputCompo from '../../../components/TextinputCompo';
// import Pagination from '../../../components/Pagination';

// const Qutation = ({route, navigation}) => {
//   const {currentUrl: server_origin} = useContext(AuthContext);
//   const employeeCode = route?.params?.employeeCode || '';
//   const company_id = route?.params?.company_id || '';
//   const resUser = route?.params?.resUser || '';
//   const title = 'Quotation';

//   const [isLoader, setIsLoader] = useState(false);
//   const [qutationData, setQutationData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [selectedFilter, setSelectedFilter] = useState('All');
//   const [openfilterModal, setopenfilterModal] = useState(false);
//   const [groupBy, setGroupBy] = useState(null);
//   const [page, setPage] = useState(1);
//   const [pagination, setPagination] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [searchText, setSearchText] = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');

//   const filters = ['All', 'Pending', 'Sent for Approval', 'Sent', 'Amendment'];
//   const filterOptions = [
//     {label: 'Salesperson', key: 'salesperson'},
//     {label: 'Stage', key: 'stage'},
//     {label: 'Division', key: 'division'},
//     {label: 'Customer', key: 'customer'},
//   ];

//   const fetchQutation = async (pageNumber = 1, search = '') => {
//     console.log('🚀 fetchQutation called');

//     try {
//       setIsLoader(true);

//       const response = await makeApiCall(
//         server_origin,
//         urls.getQutaionData,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {employeeCode, company_id, resUser, page: pageNumber,
//         search: search,},
//         },
//       );

//       console.log('API Response--------------------------:', response?.result);

//       if (response?.error) {
//         console.log('Error Response:------------', response.error);
//         return;
//       }

//       const data = response?.result?.data || [];
//       setQutationData(data);
//       setFilteredData(data);
//       setPagination(response.result.pagination || {});
//     } catch (error) {
//       console.log('Catch Error:', error);
//     } finally {
//       setIsLoader(false);
//     }
//   };

//    const handleNext = () => {
//       if (pagination?.has_next) {
//         setPage(prev => prev + 1);
//       }
//     };
    
//     const handlePrev = () => {
//       if (pagination?.has_previous) {
//         setPage(prev => prev - 1);
//       }
//     };
//     useEffect(() => {
//       const timer = setTimeout(() => {
//         setDebouncedSearch(searchText);
//         setPage(1); 
//       }, 500);
    
//       return () => clearTimeout(timer);
//     }, [searchText]);

//     const renderGrouped = () => {
//     if (!groupedData) return null;
//     return Object.entries(groupedData).map(([groupTitle, items]) => (
//       <View key={groupTitle}>
//         {/* Group header */}
//         <View style={styles.groupHeader}>
//           <View style={styles.groupDot} />
//           <Text style={styles.groupTitle}>{groupTitle}</Text>
//           <View style={styles.groupCountBadge}>
//             <Text style={styles.groupCountText}>{items.length}</Text>
//           </View>
//         </View>
//         {items.map(item => (
//           <View key={item.id?.toString()}>
//             {renderQuotationCard({item})}
//           </View>
//         ))}
//       </View>
//     ));
//   };


//   const applyFilter = filter => {
//     setSelectedFilter(filter);

//     if (filter === 'All') {
//       setFilteredData(qutationData);
//     } else {
//       const filtered = qutationData.filter(item => {
//         const state = item.state?.toLowerCase() || '';
//         switch (filter) {
//           case 'Pending':
//             return state === 'draft' || state === 'pending';
//           case 'Sent for Approval':
//             return state === 'sent_for_approval';
//           case 'Sent':
//             return state === 'sent';
//           case 'Amendment':
//             return state === 'amendment';
//           default:
//             return true;
//         }
//       });
//       setFilteredData(filtered);
//     }
//   };

//   const getStatusColor = state => {
//     const stateMap = {
//       draft: '#FF9800',
//       pending: '#FF9800',
//       sent_for_approval: '#2196F3',
//       sent: '#4CAF50',
//       amendment: '#9C27B0',
//     };
//     return stateMap[state?.toLowerCase()] || '#757575';
//   };

//   const getStatusText = state => {
//     const stateMap = {
//       draft: 'Pending',
//       pending: 'Pending',
//       sent_for_approval: 'Sent for Approval',
//       sent: 'Sent',
//       amendment: 'Amendment',
//     };
//     return stateMap[state?.toLowerCase()] || state;
//   };

//   const formatDate = dateString => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//     });
//   };

//   const formatCurrency = amount => {
//     return `₹${amount?.toLocaleString('en-IN') || '0'}`;
//   };

//   useEffect(() => {
//     fetchQutation(page, debouncedSearch);
//   }, [page, debouncedSearch]);

//   const renderQuotationCard = ({item}) => (
//     <TouchableOpacity
//       style={styles.card}
//       activeOpacity={0.7}
//       onPress={() =>
//         navigation.navigate(navigationString.PREVIEWLEADS, {
//           item: item,
//           // onEditPress: onEditPress,
//           // onStatusPress: onStatusPress,
//           // onConverttoEnquery: onConverttoEnquery,
//           title: title,
//           model: 'sale.quotation',
//           // enquery: enquery,
//         })
//       }>
//       <View style={styles.cardHeader}>
//         <Text style={styles.quotationNumber}>{item.name}</Text>
//         <View
//           style={[
//             styles.statusBadge,
//             {backgroundColor: getStatusColor(item.state)},
//           ]}>
//           <Text style={styles.statusText}>{getStatusText(item.state)}</Text>
//         </View>
//       </View>

//       <View style={styles.divider} />

//       <View style={styles.cardBody}>
//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Date:</Text>
//           <Text style={styles.value}>{formatDate(item.quotation_date)}</Text>
//         </View>
//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Customer:</Text>
//           <Text style={styles.value} numberOfLines={1}>
//             {item.partner_name || ''}
//           </Text>
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Opportunity:</Text>
//           <Text style={styles.value} numberOfLines={1}>
//             {item.opportunity_name || ''}
//           </Text>
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Division:</Text>
//           <Text style={styles.value}>
//             {item.employee_division_name || ''}
//           </Text>
//         </View>

//         <View style={styles.infoRow}>
//           <Text style={styles.label}>Sales Person:</Text>
//           <Text style={styles.value} numberOfLines={1}>
//             {item.sale_person_name || ''}
//           </Text>
//         </View>

//         <View style={styles.divider} />

//         <View style={styles.amountRow}>
//           <Text style={styles.amountLabel}>Total Amount:</Text>
//           <Text style={styles.amountValue}>
//             {formatCurrency(item.amount_total)}
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const renderFilterButton = filter => (
//     <TouchableOpacity
//       key={filter}
//       style={[
//         styles.filterButton,
//         selectedFilter === filter && styles.filterButtonActive,
//       ]}
//       onPress={() => applyFilter(filter)}>
//       <Text
//         style={[
//           styles.filterButtonText,
//           selectedFilter === filter && styles.filterButtonTextActive,
//         ]}>
//         {filter}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <HeaderCompo
//         title="Quotation"
//         lefticon={require('../../../assets/back.png')}
//         onPress={() => navigation.goBack()}
//          righticon={require('../../../assets/filter.png')}
//         onPressRight={() => setopenfilterModal(true)}
//       />

//       <View style={styles.filterContainer}>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.filterScrollContent}>
//           {filters.map(renderFilterButton)}
//         </ScrollView>
//       </View>

//       <View style={styles.countContainer}>
//         <Text style={styles.countText}>
//           Showing {filteredData.length} of {qutationData.length} quotations
//         </Text>
//       </View>
//        <TextinputCompo
//              style={{
//               width: '90%',
//               alignSelf: 'center',
//               borderRadius: 10,
//               marginTop: 5,
//             }}
//   value={searchText}
//   onChangeText={setSearchText}
//   placeholder="Search..."
// />


//       <FlatList
//         data={filteredData}
//         renderItem={renderQuotationCard}
//         keyExtractor={item => item.id?.toString()}
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false}
//         ListEmptyComponent={
//           !isLoader && (
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>No quotations found</Text>
//             </View>
//           )
//         }
//       />
//       <View style={{...styles.bottom}}>
// <Pagination
//           pagination={pagination}
//           loading={loading}
//           onNext={handleNext}
//           onPrev={handlePrev}
//         />
//       </View>
      

//       <Loader visible={isLoader} />
//       <FilterModal
//         isVisible={openfilterModal}
//         filterOptions={filterOptions}
//         onclose={() => setopenfilterModal(false)}
//         onApplyGroup={key => {
//           setGroupBy(key); // 'salesperson' or 'stage'
//         }}
//       />
//     </View>
//   );
// };

// export default Qutation;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   filterContainer: {
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E0E0E0',
//   },
//   filterScrollContent: {
//     paddingHorizontal: 16,
//     gap: 8,
//   },
//   filterButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#F5F5F5',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     marginRight: 8,
//   },
//   filterButtonActive: {
//     backgroundColor: '#2196F3',
//     borderColor: '#2196F3',
//   },
//   filterButtonText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#757575',
//   },
//   filterButtonTextActive: {
//     color: '#FFFFFF',
//   },
//   countContainer: {
//     backgroundColor: '#FFFFFF',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   countText: {
//     fontSize: 13,
//     color: '#757575',
//   },
//   listContainer: {
//     padding: 16,
//     paddingBottom: 24,
//   },
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//   },
//   quotationNumber: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#212121',
//     flex: 1,
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     marginLeft: 8,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#E0E0E0',
//     marginHorizontal: 16,
//   },
//   cardBody: {
//     padding: 16,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 14,
//     color: '#757575',
//     fontWeight: '500',
//     flex: 0.4,
//   },
//   value: {
//     fontSize: 14,
//     color: '#212121',
//     fontWeight: '400',
//     flex: 0.6,
//     textAlign: 'right',
//   },
//   amountRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 8,
//     paddingTop: 12,
//   },
//   amountLabel: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#212121',
//   },
//   amountValue: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#4CAF50',
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#757575',
//   },
//   bottom:{
//     position:'absolute',
//     bottom:0,
//     width:'100%',
//     backgroundColor:'#FFFFFF',
//     // paddingVertical: 8,
//     //  borderTopWidth: 1,
//     // borderTopColor: '#E0E0E0',
//     //  alignItems:'center',
//   }
// });
// //bug id 2555 Jamshed end


//jamshed start bug id 2555
// Description: Refactored the Qutation component to match Leads component structure.
// Now includes SectionList with groupBy, expandable sections, useFocusEffect, debounced search, and pagination — identical pattern to Leads.
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import makeApiCall from '../../../utils/apiHelper';
import {AuthContext} from '../../../Screens/Context';
import urls from '../../../../url';
import Loader from '../../../components/Loader';
import HeaderCompo from '../../../components/HeaderCompo';
import navigationString from '../../../route/navigationString';
import FilterModal from '../../../constaints/FilterModal';
import TextinputCompo from '../../../components/TextinputCompo';
import Pagination from '../../../components/Pagination';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import {COLORS} from '../../../styles/Colors';

const filterOptions = [
  {label: 'Salesperson', key: 'salesperson'},
  {label: 'Stage', key: 'stage'},
  {label: 'Division', key: 'division'},
  {label: 'Customer', key: 'customer'},
];

const Qutation = ({route, navigation}) => {
  const {currentUrl: server_origin} = useContext(AuthContext);
  const employeeCode = route?.params?.employeeCode || '';
  const company_id = route?.params?.company_id || '';
  const resUser = route?.params?.resUser || '';
  const title = 'Quotation';

  const [isLoader, setIsLoader] = useState(false);
  const [qutationData, setQutationData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [openfilterModal, setopenfilterModal] = useState(false);
  const [groupBy, setGroupBy] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  // console.log(pagination?.total_records,'pagination')

  const filters = ['All', 'Pending', 'Sent for Approval', 'Sent', 'Amendment'];

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const fetchQutation = async (pageNumber = 1, search = '') => {
    try {
      setIsLoader(true);
      const response = await makeApiCall(
        server_origin,
        urls.getQutaionData,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {employeeCode, company_id, resUser, page: pageNumber, search},
        },
      );
      // console.log(response?.result?.total_records,'Responce')

      if (response?.error) {
        console.log('Error Response:', response.error);
        return;
      }

      setQutationData(response?.result?.data || []);
      setPagination(response?.result?.pagination || {});
    } catch (error) {
      console.log('Catch Error:', error);
    } finally {
      setIsLoader(false);
    }
  };

  // useFocusEffect — same pattern as Leads
  useFocusEffect(
    React.useCallback(() => {
      if (employeeCode) {
        fetchQutation(page, debouncedSearch);
      }
    }, [employeeCode, page, debouncedSearch]),
  );

  // Debounce search — same pattern as Leads
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  // ─── Pagination ───────────────────────────────────────────────────────────
  const handleNext = () => {
    if (pagination?.has_next) setPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (pagination?.has_previous) setPage(prev => prev - 1);
  };

  // ─── Filter + Search ──────────────────────────────────────────────────────
  const getFilteredQuotations = () => {
    const cleanedData = qutationData.filter(item => item && item.id);

    // Stage filter
    const filteredByStage =
      selectedFilter === 'All'
        ? cleanedData
        : cleanedData.filter(item => {
            const state = item.state?.toLowerCase() || '';
            switch (selectedFilter) {
              case 'Pending':
                return state === 'draft' || state === 'pending';
              case 'Sent for Approval':
                return state === 'sent_for_approval';
              case 'Sent':
                return state === 'sent';
              case 'Amendment':
                return state === 'amendment';
              default:
                return true;
            }
          });

    // Search filter
    const search = searchText.toLowerCase();
    return filteredByStage.filter(item => {
      const name = String(item?.name || '').toLowerCase();
      const partnerName = String(item?.partner_name || '').toLowerCase();
      const salePerson = String(item?.sale_person_name || '').toLowerCase();
      const division = String(item?.employee_division_name || '').toLowerCase();
      const opportunity = String(item?.opportunity_name || '').toLowerCase();
      const state = String(item?.state || '').toLowerCase();

      return (
        name.includes(search) ||
        partnerName.includes(search) ||
        salePerson.includes(search) ||
        division.includes(search) ||
        opportunity.includes(search) ||
        state.includes(search)
      );
    });
  };

  // ─── GroupBy — same logic as Leads ───────────────────────────────────────
  const getGroupedQuotations = () => {
    const quotations = getFilteredQuotations();

    if (!groupBy) {
      return [{title: '', data: quotations}];
    }

    const grouped = {};

    quotations.forEach(item => {
      let key = 'Unknown';

      if (groupBy === 'salesperson') {
        key = String(item.sale_person_name || '').trim() || 'Unknown';
      } else if (groupBy === 'stage') {
        key = getStatusText(item.state) || 'Unknown';
      } else if (groupBy === 'division') {
        key = String(item.employee_division_name || '').trim() || 'Unknown';
      } else if (groupBy === 'customer') {
        key = String(item.partner_name || '').trim() || 'Unknown';
      }

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    return Object.entries(grouped).map(([title, data]) => ({
      title: `${title} (${data.length})`,
      data,
    }));
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const getStatusColor = state => {
    const stateMap = {
      draft: '#FF9800',
      pending: '#FF9800',
      sent_for_approval: '#2196F3',
      sent: '#4CAF50',
      amendment: '#9C27B0',
    };
    return stateMap[state?.toLowerCase()] || '#757575';
  };

  const getStatusText = state => {
    const stateMap = {
      draft: 'Pending',
      pending: 'Pending',
      sent_for_approval: 'Sent for Approval',
      sent: 'Sent',
      amendment: 'Amendment',
    };
    return stateMap[state?.toLowerCase()] || state;
  };

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = amount => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  const renderQuotationCard = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate(navigationString.PREVIEWLEADS, {
          item,
          title,
          model: 'sale.quotation',
        })
      }>
      <View style={styles.cardHeader}>
        <Text style={styles.quotationNumber}>{item.name}</Text>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: getStatusColor(item.state)},
          ]}>
          <Text style={styles.statusText}>{getStatusText(item.state)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{formatDate(item.quotation_date)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Customer:</Text>
          <Text style={styles.value} numberOfLines={1}>
            {item.partner_name || ''}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Opportunity:</Text>
          <Text style={styles.value} numberOfLines={1}>
            {item.opportunity_name || ''}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Division:</Text>
          <Text style={styles.value}>{item.employee_division_name || ''}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Sales Person:</Text>
          <Text style={styles.value} numberOfLines={1}>
            {item.sale_person_name || ''}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Total Amount:</Text>
          <Text style={styles.amountValue}>
            {formatCurrency(item.amount_total)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = filter => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter)}>
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive,
        ]}>
        {filter}
      </Text>
    </TouchableOpacity>
  );

  const filteredCount = getFilteredQuotations().length;

  return (
    <View style={styles.container}>
      <HeaderCompo
        title="Quotation"
        lefticon={require('../../../assets/back.png')}
        onPress={() => navigation.goBack()}
        righticon={require('../../../assets/filter.png')}
        onPressRight={() => setopenfilterModal(true)}
      />

      {/* Stage Filter Bar */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}>
          {filters.map(renderFilterButton)}
        </ScrollView>
      </View>

      {/* Count + Search */}
      <View style={{...styles.countContainer,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        {/* <Text style={styles.countText}>
          Showing {filteredCount} of {qutationData.length} 
        </Text> */}
        {/* <Text>Total Records:{pagination?.total_records}</Text> */}
      </View>

      <TextinputCompo
        style={{
          width: '90%',
          alignSelf: 'center',
          borderRadius: 10,
          marginTop: 5,
        }}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search..."
      />

  

      {/* SectionList — same as Leads */}
      {isLoader ? (
        <Loader visible={isLoader} />
      ) : (
        <SectionList
          sections={getGroupedQuotations()}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderSectionHeader={({section: {title: sectionTitle}}) => {
            if (!groupBy) return null;

            const isExpanded = expandedSections[sectionTitle];

            return (
              <TouchableOpacity
                onPress={() => {
                  setExpandedSections(prev => ({
                    ...prev,
                    [sectionTitle]: !prev[sectionTitle],
                  }));
                }}>
                <View style={styles.headerContainer}>
                  <Text style={styles.groupHeader}>{sectionTitle}</Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#000"
                  />
                </View>
              </TouchableOpacity>
            );
          }}
          renderItem={({item, section}) => {
            const isExpanded = expandedSections[section.title];
            if (!groupBy || isExpanded) {
              return renderQuotationCard({item});
            }
            return null;
          }}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No quotations found</Text>
            </View>
          }
        />
      )}

      <FilterModal
        isVisible={openfilterModal}
        filterOptions={filterOptions}
        onclose={() => setopenfilterModal(false)}
        onApplyGroup={key => {
          setGroupBy(key);
        }}
      />
        <View style={styles.bottom}>
              <Pagination
        pagination={pagination}
        loading={loading}
        onNext={handleNext}
        onPrev={handlePrev}
      />
          </View>
    </View>
  );
};

export default Qutation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  countContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  countText: {
    fontSize: 13,
    color: '#757575',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  quotationNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  cardBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
    flex: 0.4,
  },
  value: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '400',
    flex: 0.6,
    textAlign: 'right',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  groupHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
    bottom:{
    position:'absolute',
    bottom:0,
    width:'100%',
    backgroundColor:'#FFFFFF',
    // paddingVertical: 8,
    }
});
//bug id 2555 Jamshed end