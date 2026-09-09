//jamshed start bug id 2555
// Description: Refactored the Opportunity component to enhance functionality and user experience. The updated component now includes a loading state while fetching opportunity data, improved error handling for API calls, and a more intuitive UI for filtering and grouping opportunities. The design has been improved to provide clearer information about each opportunity, and the code structure has been optimized for better readability and maintainability. Additionally, the component now handles API interactions more robustly, ensuring that users receive appropriate feedback during data fetching and when navigating through the app.
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  SectionList,
  View,
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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
const Opportunity = ({route, navigation}) => {
  const employeeCode = route?.params?.employeeCode || '';
  const company_id = route?.params?.company_id || '';
  const resUser = route?.params?.resUser || '';
  const [opportunitydata, setOportunitydata] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedoportunity, setSelectedOportunity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoder, setIsLoader] = useState(false);
  const [isMultidivision, setIsMultidivision] = useState(false);
  const [fetchoortunity, setFetchopportunitystages] = useState([]);
  const [serching, setserching] = useState('');
  const [groupBy, setGroupBy] = useState(null);
  const [openfilterModal, setopenfilterModal] = useState(false);
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const [expandedSections, setExpandedSections] = useState({});
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');


  const colorschema = useColorScheme();
  const isDark = colorschema === 'dark';
  const title = 'Opportunity';
  const fetchoppotunity = async (pageNumber = 1,search = '') => {
    try {
      setIsLoader(true);
      const response = await makeApiCall(
        server_origin,
        urls.getOpportunitiesData,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            employeeCode,
            company_id,
             page: pageNumber,
             search: search,
          },
        },
      );

      // Add local "status" field
      console.log('First 10 items:', response);

      setOportunitydata(
        (response.result?.data || []).sort((a, b) => b.id - a.id),
      );
      setIsMultidivision(response.result[0]?.data?.is_multidivision || false);
      setPagination(response.result.pagination || {});
    } catch (error) {
      console.log(error, 'error->>>>>>>>>>>>>>>>>>>>');
    } finally {
      setIsLoader(false);
    }
  };



  const fetchopportunitystages = async () => {
    // console.log(urls.fetchopportunitystageUrl, 'Fetching lead stages');
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchopportunitystageUrl,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            // employeeCode,
            // company_id,
          
          },
        },
      );
      // Handle response if needed
      // console.log(response, 'Opportunity stages fetched successfully');
      setFetchopportunitystages(response.result || []);
      // setPagination(response?.result.pagination || {});
    } catch (error) {
      console.error('Error fetching lead stages:', error);
    }
  };
  useEffect(() => {
    fetchopportunitystages();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (employeeCode) {
        // fetchoppotunity(page);
        fetchoppotunity(page, debouncedSearch);
      }
    }, [employeeCode,page,debouncedSearch]),
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
  //   // Filter out any items missing required properties
  //   const validData = opportunitydata.filter(item => item && item.id && item.stage);

  //   if (filter === 'All') return validData;

  //   const filterUpper = filter.toUpperCase();

  //   return validData.filter(item => {
  //     const stageName = item.stage?.toUpperCase() || '';
  //     return stageName === filterUpper;
  //   });
  // };
  const getFilteredLeads = () => {
    const validData = opportunitydata.filter(
      item => item && item.id && item.stage,
    );

    // Stage filtering
    const filteredByStage =
      filter === 'All'
        ? validData
        : validData.filter(item => {
            const stageName = String(item.stage || '').toLowerCase();
            return stageName === filter.toLowerCase();
          });

    const searchLower = serching.toLowerCase();

    const finalFiltered = filteredByStage.filter(item => {
      const name = String(item.name || '').toLowerCase();
      const salePerson = String(item.sale_person || '').toLowerCase();
      const customerName = String(item.customer_name || '').toLowerCase();
      const assignToName = String(item.assign_to_name || '').toLowerCase();
      const division = String(item.employee_division_name || '').toLowerCase();
      const email = String(item.email || '').toLowerCase();
      const phone = String(item.phone || '').toLowerCase();
      const remark = String(item.opp_remark || '').toLowerCase();
      const leadId = String(item.lead_id || '').toLowerCase(); // optional

      return (
        name.includes(searchLower) ||
        salePerson.includes(searchLower) ||
        customerName.includes(searchLower) ||
        assignToName.includes(searchLower) ||
        division.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchLower) ||
        remark.includes(searchLower) ||
        leadId.includes(searchLower)
      );
    });

    return finalFiltered;
  };

  const handlechangeStatus = async newStage => {
    // console.log(newStage);
    if (!selectedoportunity) return;

    try {
      setIsLoader(true);
      const params = {
        opp_id: selectedoportunity.id,
        new_stage: newStage,
      };
      // console.log(params, 'params for update stage');
      const response = await makeApiCall(
        server_origin,
        urls.updateopportunityStageUrl,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: params,
        },
      );

      // Update local state
      // console.log(response,'Responce')
      setOportunitydata(item =>
        item.map(opp =>
          opp.id === selectedoportunity.id ? {...opp, stages: newStage} : opp,
        ),
      );
      setModalVisible(false);
      await fetchoppotunity();
    } catch (error) {
      console.error('Error updating lead stage:', error);
    } finally {
      setIsLoader(false);
    }
  };

  const uniqueStages = [
    'All',
    ...Array.from(
      new Set(
        opportunitydata.map(lead => lead.stage?.toLowerCase()).filter(Boolean),
      ),
    ),
  ];

  const getCount = stageName => {
    if (stageName === 'All') return opportunitydata.length;

    return opportunitydata.filter(item => {
      const stage =
        typeof item.stages === 'string' ? item.stages : item.stages?.name;

      return stage === stageName;
    }).length;
  };

  const statusColors = {
    new: '#3498db',
    hold: '#f39c12',
    completed: '#2ecc71',
    rejected: '#e74c3c',
  };

  const changeStatus = newStatus => {
    setOportunitydata(prev =>
      prev.map(lead =>
        lead.id === selectedoportunity.id ? {...lead, status: newStatus} : lead,
      ),
    );
    setModalVisible(false);
  };

  const FilterButton = ({label, value, onPress}) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === value && styles.activeButton]}
      onPress={onPress ? onPress : () => setFilter(value)}>
      {/* <Icon name="filter" size={20} color={COLORS.white} /> */}
      <Text style={[styles.filterText, filter === value && styles.activeText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // const getGroupedOpportunities = () => {
  //   const data = getFilteredLeads();

  //   if (!groupBy) {
  //     return [{title: '', data}];
  //   }

  //   const grouped = data.reduce((acc, item) => {
  //     let rawKey;

  //     if (groupBy === 'salesperson') {
  //       rawKey = item.sale_person;
  //     } else if (groupBy === 'stage') {
  //       rawKey = item.stage;
  //     } else if (groupBy === 'division') {
  //       rawKey = item.employee_division_name;
  //     }

  //     // Normalize and fallback to 'Unknown'
  //     const key =
  //       typeof rawKey === 'string' && rawKey.trim() ? rawKey.trim() : 'Unknown';

  //     if (!acc[key]) acc[key] = [];
  //     acc[key].push(item);
  //     return acc;
  //   }, {});

  //   return Object.keys(grouped).map(key => ({
  //     title: `${key} (${grouped[key].length})`,
  //     data: grouped[key],
  //   }));
  // };

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
        case 'stage':
          rawKey = item.stage;
          break;
        case 'division':
          rawKey = item.employee_division_name;
          break;
        case 'customer':
          rawKey = item.customer_name;
          break;
        default:
          rawKey = 'Unknown';
      }

      const key =
        typeof rawKey === 'string' && rawKey.trim() ? rawKey.trim() : 'Unknown';

      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    return Object.keys(grouped).map(key => ({
      title: `${key} (${grouped[key].length})`,
      data: grouped[key],
    }));
  };

  const renderItem = ({item, section}) => {
    const sectionTitle = section?.title;
    const isExpanded = sectionTitle ? expandedSections?.[sectionTitle] : true;

    if (!isExpanded) return null;

    return (
      <CardCompo
        item={item}
        model={'crm.lead'}
        title={title}
        onStatusPress={() => {
          setSelectedOportunity(item);
          setModalVisible(true);
        }}
        onEditPress={() =>
          navigation.navigate('EditOpportunity', {opportunity: item})
        }
      />
    );
  };

  const renderSectionHeader = ({section}) => {
    const title = section?.title;
    if (!groupBy || !title) return null;

    const isExpanded = expandedSections?.[title];

    return (
      <TouchableOpacity
        style={styles.headerContainer}
        onPress={() =>
          setExpandedSections(prev => ({
            ...prev,
            [title]: !prev[title],
          }))
        }>
        <Text style={styles.groupHeader}>{title}</Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#000"
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <HeaderCompo
        title={'Opportunity'}
        lefticon={require('../../assets/back.png')}
        righticon={require('../../assets/filter.png')}
        onPressRight={() => setopenfilterModal(true)}
        onPress={() => navigation.goBack()}
      />
      <View
        style={{
          ...styles.container,
          backgroundColor: isDark ? COLORS.black : COLORS.white,
        }}>
        {/* Filter Tabs */}
        <View style={styles.filterBar}>
          {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          // contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {uniqueStages.map((stage) => (
            <FilterButton key={stage} label={stage} value={stage} />
          ))}
        </ScrollView> */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 10}}>
            <TouchableOpacity
              onPress={() => setFilter('All')}
              style={{
                backgroundColor: filter === 'All' ? COLORS.BLUE : COLORS.GRAY,
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 20,
                marginRight: 10,
              }}>
              <Text
                style={{
                  color: filter === 'All' ? COLORS.white : COLORS.black,
                  fontWeight: 'bold',
                }}>
                ALL
              </Text>
            </TouchableOpacity>

            {fetchoortunity.map(stage => (
              <TouchableOpacity
                key={stage.id}
                onPress={() => setFilter(stage.name)}
                style={{
                  backgroundColor:
                    filter === stage.name ? COLORS.BLUE : '#E0E0E0',
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 20,
                  marginRight: 10,
                }}>
                <Text
                  style={{
                    color: filter === stage.name ? COLORS.white : COLORS.black,
                    fontWeight: 'bold',
                  }}>
                  {stage.name.toUpperCase()}
                </Text>
              </TouchableOpacity>
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
          <SectionList
            sections={getGroupedOpportunities()}
            keyExtractor={(item, index) =>
              item?.id?.toString() || index.toString()
            }
            renderItem={renderItem}
            renderSectionHeader={groupBy ? renderSectionHeader : undefined}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Opportunity found</Text>
            }
          />
        )} */}

        {isLoder ? (
          <Loader visible={isLoder} />
        ) : groupBy ? (
          // Show Grouped SectionList if groupBy is active
          <SectionList
            sections={getGroupedOpportunities()}
            keyExtractor={(item, index) =>
              item?.id?.toString() || index.toString()
            }
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Opportunity found</Text>
            }
          />
        ) : (
          // Show FlatList (all data) if no grouping
          <FlatList
            data={getFilteredLeads()}
            keyExtractor={(item, index) =>
              item?.id?.toString() || index.toString()
            }
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No Opportunity found</Text>
            }
          />
        )}

        <TouchableOpacity
          style={{...styles.bottombutton}}
          onPress={() =>
            navigation.navigate('OppForm', {
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
            Create Opportunity
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
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setModalVisible(false)}
            activeOpacity={1}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Change Status</Text>
              {fetchoortunity.map(stage => (
                <TouchableOpacity
                  key={stage.id}
                  style={[
                    styles.statusOption,
                    {backgroundColor: statusColors[stage.name] || '#333'},
                  ]}
                  onPress={() => handlechangeStatus(stage.id)} // <- call your function
                >
                  <Text style={styles.statusText}>
                    {stage.name.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      <FilterModal
        isVisible={openfilterModal}
        filterOptions={filterOptions}
        onclose={() => setopenfilterModal(false)}
        onApplyGroup={key => {
          setGroupBy(key);
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
    // marginVertical:10
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    margin: 10,
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
    height: 70,
    width: 140,
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
    left: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    // backgroundColor: '#eee',
  },
   bottom:{
    position:'absolute',
    bottom:0,
    width:'100%',
    backgroundColor:'#FFFFFF',
    // paddingVertical: 8,
    }
});

export default Opportunity;
//jamshed end bug id 2555
