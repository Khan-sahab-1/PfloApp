//bug id 2822 Jamshed start
// Description: Added a new modal component for managing remarks related to leads/enquiries. The modal allows users to view existing remarks, add new remarks with details such as created by and created on, and reply to specific remarks. The component interacts with the backend API to fetch and submit remark data, ensuring that all operations are performed smoothly and efficiently. The UI is designed to be user-friendly and visually appealing, making it easy for users to manage their remarks effectively.
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {COLORS} from '../styles/Colors';
import moment from 'moment';
import TextinputCompo from './TextinputCompo';
import {AuthContext} from '../Screens/Context';
import urls from '../../url';
import {useSelector} from 'react-redux';
import SingleDropdown from './SingleDropdown';

import {Calendar} from 'react-native-calendars';
import ButtonCompo from './ButtonCompo';
import makeApiCall from '../utils/apiHelper';
import DropdownCompo from './DropdownCompo';


const RemarkModal = ({isVisible, onClose, data, opp}) => {
  // console.log(data, 'Data');
  // const remarks = Array.isArray(data?.remarks)
  //   ? data.remarks
  //   : data?.remarks_lines
  //   ? Object.values(data.remarks_lines)
  //   : ...(data?.remarks_line ? Object.values(data.remarks_line) : []);
  // // const remarks = [
  // //   // ...(Array.isArray(data?.remarks) ? data.remarks : []), // old remarks array
  // //   ...(data?.remarks_line ? Object.values(data.remarks_line) : []), // new remarks object
  // // ];
  const remarks = (Array.isArray(data?.remarks) ? data.remarks : [])
    .concat(data?.remarks_lines ? Object.values(data.remarks_lines) : [])
    .concat(data?.remarks_line ? Object.values(data.remarks_line) : []);

  // console.log(remarks, 'paremsRemrk');
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const fetchCreatedByUrl = server_origin + urls.CreatedByUrl;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [createdById, setCreatedById] = useState(null);
  const [createdByOptions, setCreatedByOptions] = useState([]);
  const [remark, setRemark] = useState('');
  const user = useSelector(state => state.user.userDatainfo);
  const today = moment().format('YYYY-MM-DD');
  const [createdOn, setCreatedOn] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showaddbutton, setShowAddButton] = useState(false);
  const resUser = user?.result?.res_user || {};
  const [replyTo, setreplyTo] = useState([]);
  const [selectedreplyTo, setselectedreplyTo] = useState(null);
  // console.log(replyTo);

  const toggleAddForm = () => {
    setShowAddButton(!showaddbutton);
  };

  const fetchCreatedByData = async () => {
    try {
      const response = await fetch(fetchCreatedByUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {},
        }),
      });

      const result = await response.json();
      const data = (result.result || []).map(item => ({
        label: item.name.trim(),
        value: item.id,
      }));
      setCreatedByOptions(data);

      const matched = data.find(item => item.value === user?.result.res_user);
      if (matched) {
        setCreatedById(matched.value);
      }
    } catch (error) {
      console.error('Error fetching "Created By":', error);
      Alert.alert('Error', 'Failed to fetch "Created By" data.');
    }
  };
  const fetchreplyToinfo = async () => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchreplyto,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {resUser},
        },
      );

      // console.log(response, 'fetchreplyToinfo');
      const dropdownData = response.result.map(item => ({
        label: item.replyto_name,
        value: item.replyto_id,
      }));
      setreplyTo(dropdownData);
    } catch (error) {
      console.error('Error fetching fetchreplyToinfo:', error);
      Alert.alert(
        'Error',
        error.response?.data?.error?.message ||
          'Failed to fetch fetchreplyToinfo',
      );
    }
  };
  const handleOnPress = async () => {
    console.log('caliing ------>>>')
    const payLoad = {
      jsonrpc: '2.0',
      params: {
        enquiry_line_id: data?.line_id || '',
        created_by: createdById,
        created_on: createdOn,
        remark: remark,
      },
    };
    console.log(payLoad, 'payload');
    try {
      const response = await makeApiCall(
        server_origin,
        urls.createEnqueryRemark,
        'POST',
        payLoad,
      );
      console.log('Response Remark', response);
      if (response.result.success === true) {
        setShowAddButton(!showaddbutton);
        // onClose();
      }
    } catch (error) {
      console.log('Error submitting remark', error);
    }
  };

  useEffect(() => {
    fetchCreatedByData();
    fetchreplyToinfo();
  }, []);

  const handleDayPress = day => {
    setCreatedOn(day.dateString);
    setShowCalendar(false);
  };

  const onSubmit = () => {
    const data = {
      dateValue: createdOn,
      remark:'',
      replyTo: selectedreplyTo||'',
      createdBy: createdById,
    };

    // console.log('SUBMIT DATA:', data);

    // send data back to parent
    onClose(data);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.whiteBox}>
          <View style={styles.header}>
            <Text style={styles.title}>Remarks</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Add Remark Form */}
          {showaddbutton ? (
            <>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: isDarkMode ? COLORS.white : COLORS.black,
                }}>
                Remark
              </Text>
              <TextinputCompo
                style={{...styles.input, height: 100}}
                placeholder="Remark"
                placeholderTextColor={COLORS.PLACEHOLDER}
                value={remark}
                onChangeText={setRemark}
                multiline={true}
              />

              {createdByOptions.length > 0 && (
                <>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: isDarkMode ? COLORS.white : COLORS.black,
                    }}>
                    {opp === 'Opp' ? 'User' : 'Created By'}
                  </Text>
                  <SingleDropdown
                    data={createdByOptions}
                    value={createdById}
                    onChange={item => setCreatedById(item.value)}
                    placeholder="Select Created By"
                    isDarkMode={isDarkMode}
                  />
                </>
              )}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: isDarkMode ? COLORS.white : COLORS.black,
                }}>
                Created On
              </Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowCalendar(true)}>
                <Text style={{color: COLORS.black}}>
                  {createdOn || 'Created On'}
                </Text>
              </TouchableOpacity>
              {opp === 'Opp' && (
                <>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: isDarkMode ? COLORS.white : COLORS.black,
                    }}>
                    Reply To
                  </Text>
                  
                  <SingleDropdown
                    data={replyTo}
                    placeholder="Select Reply To"
                    value={selectedreplyTo}
                    onChange={item => setselectedreplyTo(item.value)}
                    // value={null}
                    // onChange={item => {}}
                  />
                </>
              )}

              {showCalendar && (
                <Calendar
                  onDayPress={handleDayPress}
                  markedDates={{
                    [createdOn]: {
                      selected: true,
                      selectedColor: '#007BFF',
                    },
                  }}
                  theme={{
                    backgroundColor: isDarkMode ? '#121212' : '#fff',
                    calendarBackground: isDarkMode ? '#121212' : '#fff',
                    textSectionTitleColor: isDarkMode ? '#fff' : '#000',
                    selectedDayBackgroundColor: '#007BFF',
                    selectedDayTextColor: '#fff',
                    todayTextColor: '#007BFF',
                    dayTextColor: isDarkMode ? '#fff' : '#000',
                  }}
                />
              )}
              {opp === 'Opp' ? (
                // <ButtonCompo title="Submit" onPress={onSubmit} />
                <ButtonCompo title="Submit" onPress={handleOnPress} />
              ) : (
                <ButtonCompo title="Submit" onPress={handleOnPress} />
              )}
            </>
          ) : (
            // Remark List
            <>
              {remarks.length === 0 ? (
                <Text style={styles.noRemarks}>No remarks found</Text>
              ) : (
                <ScrollView
                  style={{maxHeight: 300}}
                  showsVerticalScrollIndicator={false}>
                  {(remarks ?? []).map((item, index) => (
                    <View key={index} style={styles.remarkCard}>
                      <Text style={styles.remarkText}>
                        <Text style={styles.label}>Remark:</Text>{' '}
                        {item?.remark_name ?? item?.remarks ?? ''}
                      </Text>

                      <Text style={styles.remarkText}>
                        <Text style={styles.label}>Created By:</Text>{' '}
                        {item?.remark_created_by_name ?? item?.user ?? ''}
                      </Text>

                      <Text style={styles.remarkText}>
                        <Text style={styles.label}>Created On:</Text>{' '}
                        {item?.remark_created_on ?? item?.date ?? ''}
                      </Text>
                      {item?.reply_to && (
                        <Text style={styles.remarkText}>
                          <Text style={styles.label}>Reply To:</Text>{' '}
                          {item?.reply_to ?? ''}
                        </Text>
                      )}
                    </View>
                  ))}
                </ScrollView>
              )}
            </>
          )}

          {/* Toggle Button */}
          <TouchableOpacity style={styles.addButton} onPress={toggleAddForm}>
            <Text style={styles.addButtonText}>
              {showaddbutton ? 'Back' : '+ Add Remark'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RemarkModal;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  whiteBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  closeBtn: {
    fontSize: 20,
    color: COLORS.red || '#f00',
    fontWeight: 'bold',
  },
  remarkCard: {
    backgroundColor: COLORS.BACKGROUND || '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary || '#007bff',
  },
  remarkText: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  noRemarks: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.gray || '#666',
    paddingVertical: 20,
  },
  addButton: {
    backgroundColor: COLORS.primary || '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.black,
    backgroundColor: COLORS.white,
    color: COLORS.black,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
//bug id 2822 Jamshed end
