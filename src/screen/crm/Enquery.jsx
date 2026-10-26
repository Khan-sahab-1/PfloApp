//jamshed start bug id 2555
// Description: Refactored the Enquery component to enhance functionality and user experience. The updated component now includes a loading state, dynamic status badges with color coding, improved date and currency formatting, and a more intuitive filter mechanism for displaying enquiries based on their status. The design has been improved to provide clearer information about each enquiry, and the code structure has been optimized for better readability and maintainability. Additionally, a filter modal has been added to allow users to group enquiries by different criteria such as salesperson, stage, division, or customer.
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  SectionList,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import makeApiCall from '../../utils/apiHelper';
import urls from '../../../url';
import {AuthContext} from '../../Screens/Context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HeaderCompo from '../../components/HeaderCompo';
import Loader from '../../components/Loader';
import navigationString from '../../route/navigationString';
import {useFocusEffect} from '@react-navigation/native';
import {COLORS} from '../../styles/Colors';
import CardCompo from '../../components/CardCompo';
import TextinputCompo from '../../components/TextinputCompo';
import FilterModal from '../../constaints/FilterModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Pagination from '../../components/Pagination';

const filterOptions = [
  {label: 'Salesperson', key: 'salesperson'},
  {label: 'Stage', key: 'stage'},
  {label: 'Division', key: 'division'},
  {label: 'Customer', key: 'customer'},
];
const Enquery = ({route, navigation}) => {
  const employeeCode = route?.params?.employeeCode || '';
  const company_id = route?.params?.company_id || '';
  const resUser = route?.params?.resUser || '';
  const [enqueryData, setenquery] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedEnquery, setSelectedenquery] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoder, setIsLoader] = useState(false);
  const [isMultidivision, setIsMultidivision] = useState(false);
  const [showCurrentYearOnly, setShowCurrentYearOnly] = useState(true);
  const [serching, setserching] = useState('');
  const [groupBy, setGroupBy] = useState(null);
  const [openfilterModal, setopenfilterModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const colorschema = useColorScheme();
  const isDark = colorschema === 'dark';
  const title = 'Enquiry';
  // const fetchLeads = async () => {
  //   try {
  //     setIsLoader(true);
  //     const response = await makeApiCall(
  //       server_origin,
  //       urls.fetchEnquiry,
  //       'POST',
  //       {
  //         jsonrpc: '2.0',
  //         method: 'call',
  //         params: {
  //           employeeCode,
  //           //   company_id,
  //         },
  //       },
  //     );
  //      console.log(response,'enquery response')
  //     // Add local "status" field
  //     const leads = Array.isArray(response.result) ? response.result : [];

  //     const sortedLeads = [...leads].sort((a, b) => b.id - a.id); // ✅ clone before sort

  //     // setEnquery(sortedLeads);

  //     // setEnquery(sortedLead
  //     //      const sortedLeads = leadsWithStatus.sort((a, b) => b.id - a.id);
  //     setenquery(sortedLeads);

  //     // setenquery(leadsWithStatus);
  //     setIsMultidivision(response.result[0]?.is_multidivision || false);
  //   } catch (error) {
  //     console.log(error, 'error');
  //   } finally {
  //     setIsLoader(false);
  //   }
  // };
  const fetchLeads = async (
    filterCurrentYear = showCurrentYearOnly,
    pageNumber = 1,
    search = '',
  ) => {
    try {
      setIsLoader(true);
      const response = await makeApiCall(
        server_origin,
        urls.fetchEnquiry,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            employeeCode,
            page: pageNumber,
            search: search,
          },
        },
      );
      console.log(response, 'enquery response');
      let leads = Array.isArray(response.result?.data)
        ? response.result.data
        : [];
      setPagination(response.result.pagination || {});

      if (filterCurrentYear) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth(); // 0-indexed
        const fyStart =
          month >= 3 ? new Date(year, 3, 1) : new Date(year - 1, 3, 1); // April 1st
        const fyEnd = new Date(fyStart.getFullYear() + 1, 2, 31); // March 31st of next year

        leads = leads.filter(item => {
          const date = new Date(item.enquiry_date);
          return date >= fyStart && date <= fyEnd;
        });
      }

      // const sortedLeads = leads.sort((a, b) => b.id - a.id);
      //       if (filterCurrentYear) {
      //   const now = new Date();
      //   const year = now.getFullYear();

      //   const startDate = new Date(year, 0, 1);
      //   const endDate = new Date(year, 11, 31);

      //   leads = leads.filter(item => {
      //     const date = item.enquiry_date ? new Date(item.enquiry_date) : null;
      //     return date && date >= startDate && date <= endDate;
      //   });
      // }

      const sortedLeads = [...leads].sort((a, b) => b.id - a.id);
      setenquery(sortedLeads);
      setIsMultidivision(response.result[0]?.is_multidivision || false);
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setIsLoader(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (employeeCode) {
        fetchLeads(showCurrentYearOnly, page, debouncedSearch);
      }
    }, [employeeCode, showCurrentYearOnly, page, debouncedSearch]),
  );

  const handleNext = () => {
    if (pagination?.has_next) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (pagination?.has_previous) {
      setPage(prev => prev - 1);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1); // ✅ reset page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // const getFilteredLeads = () => {
  //   if (filter === 'all') return enqueryData;
  //   return enqueryData.filter(item => item.status === filter);
  // };
  const getFilteredLeads = () => {
    const validData = enqueryData.filter(item => item && item.id);

    // Apply status filter (e.g., 'draft', 'approved', etc.)
    const filteredByStatus =
      filter.toLowerCase() === 'all'
        ? validData
        : validData.filter(item => {
            const status = String(item.status || '').toLowerCase();
            return status === filter.toLowerCase();
          });

    // Convert search input to lowercase for comparison
    const searchLower = serching.toLowerCase();

    // Filter by multiple searchable fields
    const finalFiltered = filteredByStatus.filter(item => {
      const customer = String(item.customer || '').toLowerCase();
      const salePerson = String(item.sale_person || '').toLowerCase();
      const enquiryNumber = String(item.enquiry_number || '').toLowerCase();
      const division = String(item.division || '').toLowerCase();
      const enquiryType = String(item.enquiry_type || '').toLowerCase();

      return (
        customer.includes(searchLower) ||
        salePerson.includes(searchLower) ||
        enquiryNumber.includes(searchLower) ||
        division.includes(searchLower) ||
        enquiryType.includes(searchLower)
      );
    });

    return finalFiltered;
  };

  const statusColors = {
    new: '#3498db',
    hold: '#f39c12',
    completed: '#2ecc71',
    rejected: '#e74c3c',
    Convert_to_Opportunity: '#321',
  };

  const changeStatus = newStatus => {
    setenquery(prev =>
      prev.map(lead =>
        lead.id === selectedEnquery.id ? {...lead, status: newStatus} : lead,
      ),
    );
    setModalVisible(false);
  };
  const uniqueStages = [
    'all',
    ...Array.from(
      new Set(enqueryData.map(lead => lead.status).filter(Boolean)),
    ),
  ];
  // console.log(uniqueStages,'pppp')
  const FilterButton = ({label, value, onPress}) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === value && styles.activeButton]}
      onPress={onPress ? onPress : () => setFilter(value)}>
      <Text style={[styles.filterText, filter === value && styles.activeText]}>
        <Text
          style={[styles.filterText, filter === value && styles.activeText]}>
          {label
            .replace(/_/g, ' ') // replace underscores with spaces
            .toLowerCase() // make it all lowercase
            .replace(/^\w/, c => c.toUpperCase())}
        </Text>
      </Text>
    </TouchableOpacity>
  );

  // const renderItem = ({item}) => (
  //   <CardCompo
  //     item={item}
  //     onStatusPress={() => {
  //       setSelectedenquery(item);
  //       // setModalVisible(true);
  //     }}
  //     onEditPress={() =>
  //       navigation.navigate('EditEnquiryPage', {enquiryData: item, resUser})
  //     }
  //     enquery={true}
  //   />
  // );

  const renderItem = ({item, section}) => {
    const sectionTitle = section?.title;
    const isExpanded = sectionTitle ? expandedSections?.[sectionTitle] : true;

    if (!isExpanded) return null;

    return (
      <CardCompo
        item={item}
        title={title}
        model={'crm.enquiry'}
        onStatusPress={() => {
          // setSelectedOportunity(item);
          setModalVisible(true);
        }}
        onEditPress={() =>
          navigation.navigate('EditEnquiryPage', {enquiryData: item})
        }
      />
    );
  };

  const getGroupedOpportunities = () => {
    const data = getFilteredLeads();

    if (!groupBy) {
      return [{title: '', data}];
    }

    const grouped = data.reduce((acc, item) => {
      let rawKey;

      switch (groupBy) {
        case 'salesperson':
          rawKey = item.sale_person;
          break;
        case 'stage': // Mapping 'stage' to 'status' from data
          rawKey = item.status;
          break;
        case 'division':
          rawKey = item.division;
          break;
        case 'customer':
          rawKey = item.customer;
          break;
        default:
          rawKey = 'Unknown';
      }

      const key =
        typeof rawKey === 'string' && rawKey.trim() ? rawKey.trim() : 'Unknown';

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(item);
      return acc;
    }, {});

    return Object.keys(grouped).map(key => ({
      title: `${key} (${grouped[key].length})`,
      data: grouped[key],
    }));
  };

  return (
    <>
      <HeaderCompo
        title={'Enquiry'}
        lefticon={require('../../assets/back.png')}
        onPress={() => navigation.goBack()}
        righticon={require('../../assets/filter.png')}
        onPressRight={() => setopenfilterModal(true)}
      />
      <View
        style={{
          ...styles.container,
          backgroundColor: isDark ? COLORS.black : COLORS.white,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
          <Text style={{marginRight: 10}}>Current Year</Text>
          <Switch
            value={showCurrentYearOnly}
            onValueChange={val => {
              setShowCurrentYearOnly(val); // Set switch value
              setPage(1);
            }}
          />
        </View>

        {/* Filter Tabs */}

        {/* <View style={{backgroundColor:'red',flexDirection:'row',gap:20}}>
        <TouchableOpacity style={{backgroundColor:'pink',padding:10,margin:5}}>

       <Text>hi</Text>
        </TouchableOpacity>
        <TouchableOpacity>

       <Text>hi</Text>
        </TouchableOpacity>
        <TouchableOpacity>

       <Text>hi</Text>
        </TouchableOpacity>
      </View> */}

        <View style={styles.filterBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            // contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {uniqueStages.map(stage => (
              <FilterButton key={stage} label={stage} value={stage} />
            ))}
          </ScrollView>
        </View>
        {/* <TextinputCompo
          style={{
            width: '90%',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 5,
          }}
          value={serching}
          placeholder={'Search.....'}
          onChangeText={item => setserching(item)}
        /> */}

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
        {/* <Pagination
          pagination={pagination}
          loading={loading}
          onNext={handleNext}
          onPrev={handlePrev}
        /> */}
        {/* Lead List */}
        {/* {isLoder ? (
          <Loader visible={isLoder} />
        ) : (
          <FlatList
            data={getFilteredLeads()} // getFilteredLeads() still works with filter tabs
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Enquiry found</Text>
            }
          />
        )} */}

        {isLoder ? (
          <Loader visible={isLoder} />
        ) : groupBy ? (
          <SectionList
            sections={getGroupedOpportunities()}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            renderItem={renderItem}
            renderSectionHeader={({section: {title}}) => {
              if (!groupBy) return null;

              const isExpanded = expandedSections[title];

              return (
                <TouchableOpacity
                  onPress={() => {
                    setExpandedSections(prev => ({
                      ...prev,
                      [title]: !prev[title],
                    }));
                  }}>
                  <View style={styles.headerContainer}>
                    <Text style={styles.groupHeader}>{title}</Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#000"
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Enquiry found</Text>
            }
          />
        ) : (
          <FlatList
            data={getFilteredLeads()}
            keyExtractor={item => item.id?.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Enquiry found</Text>
            }
          />
        )}

        <TouchableOpacity
          style={{...styles.bottombutton}}
          onPress={() =>
            navigation.navigate('CreateEnquiryPage', {
              employeeCode,
              is_multidivision: isMultidivision,
              resUser,
            })
          }>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              fontWeight: '800',
              color: COLORS.white,
            }}>
            Create Enquiry
          </Text>
        </TouchableOpacity>
        <View style={styles.bottom}>
          <Pagination
            pagination={pagination}
            loading={loading}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </View>

        {/* Status Change Modal */}
        {/* <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Status</Text>
            {['new',  'completed', 'rejected',].map(status => (
              <TouchableOpacity
                key={status}
                style={[styles.statusOption, { backgroundColor: statusColors[status] }]}
                onPress={() => changeStatus(status)}
              >
                <Text style={styles.statusText}>{status.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal> */}
      </View>
      <FilterModal
        isVisible={openfilterModal}
        filterOptions={filterOptions}
        onclose={() => setopenfilterModal(false)}
        onApplyGroup={key => {
          setGroupBy(key); // 'salesperson' or 'stage'
        }}
      />
      <Loader loading={isLoder} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9F9F9'},
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 4,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  activeButton: {backgroundColor: '#007BFF'},
  filterText: {fontSize: 14, color: '#333'},
  activeText: {color: '#fff', fontWeight: '600'},

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    borderRadius: 12,
    elevation: 2,
    alignItems: 'center',
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {flex: 1},
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  info: {fontSize: 14, color: '#555'},
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#888',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  statusOption: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  bottombutton: {
    position: 'absolute',
    bottom: 70,
    // left:0,
    right: 10,
    height: 60,
    width: 150,
    backgroundColor: COLORS.BLUE,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.black,
    // left:15
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    // backgroundColor: '#eee',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    // paddingVertical: 8,
  },
});

export default Enquery;
//bug id 2555 Jamshed end
