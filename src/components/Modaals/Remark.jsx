//bug id 2822 Jamshed start
// Description: Added a reusable modal component for adding remarks with date selection, remark input, and reply-to dropdown. The modal fetches reply-to options from the server when opened and sends the collected data back to the parent component on submission.
import React, {useContext, useEffect, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import SingleDropdown from '../SingleDropdown';
import {COLORS} from '../../styles/Colors';
import CalendarInput from '../CalendarInput';
import {useSelector} from 'react-redux';
import TextinputCompo from '../TextinputCompo';
import makeApiCall from '../../utils/apiHelper';
import {AuthContext} from '../../Screens/Context';
import urls from '../../../url';
import DropdownCompo from '../MultiselectorDropDown';

const Remark = ({isVisible, onclose, resUser}) => {
  // console.log(resUser, 'ioioiiioiioi');
  const toDay = new Date().toISOString().split('T')[0];
  const [dateValue, setDateValue] = useState(toDay || '');
  const user = useSelector(state => state.user.userDatainfo);
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  // console.log(user?.result?.res_user, 'User');
  const [replyTo, setreplyTo] = useState([]);
  const [selectedreplyTo, setselectedreplyTo] = useState([]);
  const [remark, setRemark] = useState('');
  // console.log(selectedreplyTo, 'selectedreplyTo');

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
  useEffect(() => {
    if (isVisible) {
      fetchreplyToinfo();
    }
  }, [isVisible]);

  const onSubmit = () => {
    const data = {
      dateValue,
      remark,
      replyTo: selectedreplyTo,
      createdBy: user?.result?.res_user,
    };

    console.log('SUBMIT DATA:', data);

    // send data back to parent
    onclose(data);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onclose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add Remark</Text>

          {/* <CalendarInput
            value={dateValue}
            onChange={v => {
              console.log('DATE FROM CALENDAR:', v);
              setDateValue(v);
            }}
            placeholder="Select Date"
            styles={styles}
            COLORS={COLORS}
          /> */}
          <Text style={{...styles.NormalText}}>Date</Text>
          <CalendarInput
            value={dateValue}
            onChange={v => {
              console.log('DATE FROM CALENDAR:', v);
              setDateValue(v);
            }}
            placeholder="Select Date"
            styles={styles}
            COLORS={COLORS}
          />
          <Text style={{...styles.NormalText}}>Remarks</Text>
          <TextInput
            style={styles.input}
            placeholder="Remark."
            value={remark}
            onChangeText={setRemark}
            // style={[...styles.input, {color: COLORS.black}]}
          />
          <Text style={{...styles.NormalText}}>Reply To</Text>
          <DropdownCompo
            data={replyTo}
            selectedValues={selectedreplyTo}
            placeholder={'Reply To'}
            onValueChange={values => {
              setselectedreplyTo(values || []);
            }}
          />
          {/* <SingleDropdown
            data={replyTo}
            value={selectedreplyTo}
            placeholder={'Reply To'}
            onChange={item => {
              setselectedreplyTo(item.value);
            }}
          /> */}
          <Text style={{...styles.NormalText}}>User</Text>
          <TextinputCompo
            value={user?.result?.name}
            editable={false}
            style={{color: COLORS.black}}
          />

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onclose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Remark;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',

    // paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 10,
    height: 50,
    textAlignVertical: 'top',
    // marginBottom: 15,
    borderWidth: 1,
    // marginTop: 10,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  cancelText: {
    color: 'red',
    fontSize: 16,
    marginTop: 6,
  },
  submitBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 6,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
  date: {
    fontSize: 14,
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  NormalText: {
    fontSize: 14,
    color: COLORS.black,
    marginTop: 5,
  },
});
//bug id 2822 Jamshed end
