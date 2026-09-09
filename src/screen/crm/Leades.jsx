//jamshed start bug id 2555
// Description: Refactored the Leads component to enhance functionality and user experience. The updated component now includes a loading state while fetching leads data, improved error handling for API calls, and a more intuitive UI for filtering and grouping leads. The design has been improved to provide clearer information about each lead, and the code structure has been optimized for better readability and maintainability. Additionally, the component now handles API interactions more robustly, ensuring that users receive appropriate feedback during data fetching and when navigating through the app.
import {
  FlatList,
  Modal,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import makeApiCall from '../../utils/apiHelper';
import urls from '../../../url';
import {useFocusEffect} from '@react-navigation/native';
import HeaderCompo from '../../components/HeaderCompo';
import Loader from '../../components/Loader';
import CardCompo from '../../components/CardCompo';
import {COLORS} from '../../styles/Colors';
import {AuthContext} from '../../Screens/Context';
import {showFlashMessage} from '../../utils/fleshmessage';
import TextinputCompo from '../../components/TextinputCompo';
import FilterModal from '../../constaints/FilterModal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Pagination from '../../components/Pagination';
const filterOptions = [
  {label: 'Salesperson', key: 'salesperson'},
  {label: 'Stage', key: 'stage'},
  {label: 'Division', key: 'division'},
];

const Leades = ({route, navigation}) => {
  const employeeCode = route?.params?.employeeCode || '';
  const company_id = route?.params?.company_id || '';
  const resUser = route?.params?.resUser || '';
  // console.log(resUser, 'RESSSSUSERRRRRR');
  const colorschema = useColorScheme();
  const isDark = colorschema === 'dark';
  const title = 'Leads';

  const [leadsData, setLeadsData] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoder, setIsLoader] = useState(false);
  const [isMultidivision, setIsMultidivision] = useState(false);
  const [fetchLeadsstages, setFetchLeadsstages] = useState([]);
  const [serching, setserching] = useState('');
  const [openfilterModal, setopenfilterModal] = useState(false);
  const [groupBy, setGroupBy] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
 

  // console.log(groupBy,'Gropby')

  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;

  const fetchLeadsData = async () => {
    try {
      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          employeeCode,
          company_id,
        },
      };

      const res = await makeApiCall(
        server_origin,
        urls.getLeadsData,
        'POST',
        payload,
      );

      // console.log('Leads Data Response:', res);

      return res;
    } catch (error) {
      console.log('Fetch leads error:', error);
    }
  };
  useEffect(() => {
    fetchLeadsData();
  }, []);

  const fetchLeads = async (pageNumber = 1, search = '') => {
    // console.log('🚀 fetchLeads called');
    try {
      setIsLoader(true);
      const payLoad = {
        employeeCode,
        company_id,
        page: pageNumber,
        search: search,
      };
     
      const response = await makeApiCall(
        server_origin,
        urls.getLeadsData,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: payLoad,
        },
      );
      console.log(response.result, 'Leades data Responce-------->>>>');
      setLeadsData(response.result?.data || []);
      setIsMultidivision(response.result[0]?.data?.is_multidivision || false);
      setPagination(response.result.pagination || {});
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setIsLoader(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // console.log('🎯 useFocusEffect triggered, employeeCode:', employeeCode);
      if (employeeCode) {
        fetchLeads(page, debouncedSearch);
        // fetchQutation();
      }
    }, [employeeCode,page, debouncedSearch]),
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

  const getGroupedLeads = () => {
    const leads = getFilteredLeads();

    if (!groupBy) {
      return [{title: '', data: leads}];
    }

    const grouped = {};

    leads.forEach(item => {
      let key = 'Unknown';

      if (groupBy === 'salesperson') {
        key =
          typeof item.sale_person === 'string'
            ? item.sale_person.trim() || 'Unknown'
            : 'Unknown';
      } else if (groupBy === 'stage') {
        key =
          typeof item.stages === 'string'
            ? item.stages
            : item.stages?.name || 'Unknown';
      } else if (groupBy === 'division') {
        key =
          typeof item.division === 'string'
            ? item.division.trim() || 'Unknown'
            : 'Unknown';
      }

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    return Object.entries(grouped).map(([title, data]) => ({
      title: `${title} (${data.length})`,
      data,
    }));
  };

  const fetchLeadestages = async () => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchleadesstageUrl,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {},
        },
      );
      // console.log(response,'hhhhhhh')
      setFetchLeadsstages(response.result || []);
    } catch (error) {
      console.error('Error fetching lead stages:', error);
    }
  };

  useEffect(() => {
    fetchLeadestages();
    // fetchLeads()
  }, []);

  const handlechangeStatus = async newStage => {
    if (!selectedLead) return;
    try {
      const payload = {
        lead_id: selectedLead.id,
        new_stage: newStage,
      };
      // console.log(payload, 'Payload for update stage');
      setIsLoader(true);
      const response = await makeApiCall(
        server_origin,
        urls.updateLeadStageUrl,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: payload,
        },
      );
      // console.log(response, 'Response for update stage');
      if (response?.result?.success === false) {
        showFlashMessage({
          message: 'Error',
          description: response.result.error || 'Failed to update lead stage',
          type: 'danger',
          duration: 3000,
          backgroundColor: COLORS.RED,
        });
        return; // ❗ important
      }

      setLeadsData(prevLeads =>
        prevLeads.map(lead =>
          lead.id === selectedLead.id ? {...lead, stages: newStage} : lead,
        ),
      );
      setModalVisible(false);
      await fetchLeads();
    } catch (error) {
      console.error('Error updating lead stage:', error);
    } finally {
      setIsLoader(false);
    }
  };

  const handelLeadstoOpportunity = async leadId => {
    console.log(
      employeeCode,
      'Employee Code for converting lead to opportunity',
    );
    if (!leadId) return;
    try {
      setIsLoader(true);
      const response = await makeApiCall(
        server_origin,
        urls.convertLeadstoOpportunityUrl,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {lead_id: leadId, convert: 'convert', emp_code: employeeCode},
        },
      );
      if (response?.result?.status === 'success') {
        showFlashMessage({
          message: 'Success',
          description: 'Lead converted to opportunity successfully',
          type: 'success',
          duration: 3000,
          backgroundColor: COLORS.green,
        });
        await fetchLeads();
      }
    } catch (error) {
      console.error('Error converting lead to opportunity:', error);
    } finally {
      setIsLoader(false);
    }
  };
  // const getFilteredLeads = () => {
  //   const cleanedLeads = leadsData.filter(item => item && item.id);

  //   const filteredByStage = filter === 'All'
  //     ? cleanedLeads
  //     : cleanedLeads.filter((item) => {
  //         const stageName =
  //           typeof item.stages === 'string'
  //             ? item.stages.toLowerCase()
  //             : typeof item.stages === 'object' && item.stages?.name
  //             ? item.stages.name.toLowerCase()
  //             : '';

  //         const selectedStage = filter.toLowerCase();
  //         return stageName === selectedStage;
  //       });

  //   const searchText = serching.toLowerCase();

  //   const finalFiltered = filteredByStage.filter(item => {
  //     const name = item?.name?.toLowerCase() || '';
  //     const salePerson = item?.sale_person?.toLowerCase() || '';
  //     return name.includes(searchText) || salePerson.includes(searchText);
  //   });

  //   return finalFiltered;
  // };

  const getFilteredLeads = () => {
    const cleanedLeads = leadsData.filter(item => item && item.id);

    const filteredByStage =
      filter === 'All'
        ? cleanedLeads
        : cleanedLeads.filter(item => {
            const stageName =
              typeof item.stages === 'string'
                ? item.stages.toLowerCase()
                : typeof item.stages === 'object' && item.stages?.name
                ? item.stages.name.toLowerCase()
                : '';
            const selectedStage = filter.toLowerCase();
            return stageName === selectedStage;
          });

    const searchText = serching.toLowerCase();

    const finalFiltered = filteredByStage
      .filter(item => {
        const name = String(item?.name || '').toLowerCase();
        const salePerson = String(item?.sale_person || '').toLowerCase();
        const leadId = String(item?.lead_id || '').toLowerCase();
        const division = String(item?.division || '').toLowerCase();
        const assignToUser = String(item?.assign_to_user || '').toLowerCase();
        const stage =
          typeof item.stages === 'string'
            ? item.stages.toLowerCase()
            : typeof item.stages === 'object' && item.stages?.name
            ? item.stages.name.toLowerCase()
            : '';
        const email = String(item?.email || '').toLowerCase();
        const phone = String(item?.phone || '').toLowerCase();

        return (
          name.includes(searchText) ||
          salePerson.includes(searchText) ||
          leadId.includes(searchText) ||
          division.includes(searchText) ||
          assignToUser.includes(searchText) ||
          stage.includes(searchText) ||
          email.includes(searchText) ||
          phone.includes(searchText)
        );
      })
      .sort((a, b) => b.id - a.id);

    return finalFiltered;
  };

  const getCount = stageName => {
    if (stageName === 'All') return leadsData.length;

    return leadsData.filter(item => {
      const stage =
        typeof item.stages === 'string' ? item.stages : item.stages?.name;

      return stage === stageName;
    }).length;
  };
  // const renderItem = ({ item }) => (

  //   <CardCompo
  //     item={item}
  //     onStatusPress={() => {
  //       setSelectedLead(item);
  //       setModalVisible(true);
  //     }}
  //     title={true}
  //     onEditPress={() => navigation.navigate('EditLeads', { leadData: item, resUser })}
  //     onConverttoEnquery={() => handelLeadstoOpportunity(item.id)}
  //   />
  // );

  const renderItem = ({item, section}) => (
    <View>
      {groupBy && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            marginHorizontal: 10,
            marginBottom: 4,
            color: COLORS.black,
          }}>
          {groupBy === 'salesperson'
            ? item.sale_person?.trim() || 'Unknown'
            : typeof item.stages === 'string'
            ? item.stages
            : item.stages?.name || 'Unknown'}
        </Text>
      )}

      <CardCompo
        item={item}
       model={'crm.enquiry'}
        onStatusPress={() => {
          setSelectedLead(item);
          setModalVisible(true);
        }}
        resUser={resUser}
        title={title}
      
        onEditPress={() =>
          navigation.navigate('EditLeads', {leadData: item, resUser})
        }
        onConverttoEnquery={() => handelLeadstoOpportunity(item.id)}
      />
    </View>
  );

  return (
    <>
      <HeaderCompo
        title={'Leads'}
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
        <View style={styles.filterBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingHorizontal: 10}}>
            <TouchableOpacity
              onPress={() => setFilter('All')}
              style={{
                backgroundColor: filter === 'All' ? COLORS.BLUE : '#E0E0E0',
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
              {/* <View
                style={{
                  backgroundColor: '#f3af8a',
                   width: 22,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  position: 'absolute',
                  top: 1,
                  right: -9,
                  borderRadius:10
                }}>
                <Text style={{color: '#fff', fontSize: 12}}>
                  {getCount('All')}
                </Text>
              </View> */}
            </TouchableOpacity>

            {fetchLeadsstages.map(stage => (
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
                {/* <View
                  style={{
                    backgroundColor: '#f3af8a',
                    width: 22,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  
                  position: 'absolute',
                  top: 1,
                  right: -11,
                
                  borderRadius:10
                  }}>
                  <Text style={{color: '#fff', fontSize: 12,}}>
                    {getCount(stage.name)}
                  </Text>
                </View> */}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View>
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
        </View>
        {isLoder ? (
          <Loader visible={isLoder} />
        ) : (
          // <FlatList
          //   data={getFilteredLeads()}
          //   keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}

          //   renderItem={renderItem}
          //   ListEmptyComponent={<Text style={styles.emptyText}>No leads found</Text>}
          // />
          <SectionList
            sections={getGroupedLeads()}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
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
            renderItem={({item, section}) => {
              const isExpanded = expandedSections[section.title];
              if (!groupBy || isExpanded) {
                return (
                  <CardCompo
                    item={item}
                    title={title}
                    model={'crm.lead'}
                    onStatusPress={() => {
                      setSelectedLead(item);
                      setModalVisible(true);
                    }}
                    onEditPress={() =>
                      navigation.navigate('EditLeads', {
                        leadData: item,
                        resUser,
                      })
                    }
                    onConverttoEnquery={() => handelLeadstoOpportunity(item.id)}
                  />
                );
              }
              return null; // collapse if not expanded
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No leads found</Text>
            }
          />
        )}
        {/* <View style={{,position:'absolute',bottom:0,width:'100%',backgroundColor:isDark?COLORS.black:COLORS.white}}>

       
          <Pagination
          pagination={pagination}
          loading={loading}
          onNext={handleNext}
          onPrev={handlePrev}
        />
        </View> */}

        <TouchableOpacity
          style={styles.bottombutton}
          onPress={() =>
            navigation.navigate('LeadForm', {
              employeeCode,
              is_multidivision: isMultidivision,
              resUser,
            })
          }>
          <Text style={styles.bottombuttonText}>Create Lead</Text>
        </TouchableOpacity>
         <View style={styles.bottom}>
                      <Pagination
                pagination={pagination}
                loading={loading}
                onNext={handleNext}
                onPrev={handlePrev}
              />
                  </View>
      

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
              <Text style={styles.modalTitle}>Change Stages</Text>
              {fetchLeadsstages.map(stage => (
                <TouchableOpacity
                  key={stage.id}
                  style={[styles.statusOption, {backgroundColor: COLORS.BLUE}]}
                  onPress={() => handlechangeStatus(stage.id)}>
                  <Text style={styles.statusText}>
                    {stage.name.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
        {/* <FilterModal
  isVisible={openfilterModal}
  onclose={() => setopenfilterModal(false)}
  onApplyGroup={(key) => {
    setGroupBy(key);       // key = 'salesperson'
    setFilter('All');      // clear stage filter
  }}
/> */}
        <FilterModal
          isVisible={openfilterModal}
          filterOptions={filterOptions}
          onclose={() => setopenfilterModal(false)}
          onApplyGroup={key => {
            setGroupBy(key); // 'salesperson' or 'stage'
          }}
        />
      </View>
    </>
  );
};

export default Leades;

const styles = StyleSheet.create({
  container: {flex: 1},
  filterBar: {
    backgroundColor: '#fff',
    elevation: 4,
    paddingVertical: 10,
  },
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
    right: 10,
    height: 60,
    width: 130,
    backgroundColor: COLORS.BLUE,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottombuttonText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '800',
    color: COLORS.white,
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

//jamshed end bug id 2555
