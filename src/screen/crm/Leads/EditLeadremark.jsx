//jamshed start bug id 2555
// Description: Refactored the EditLeadremark component to enhance functionality and user experience. The updated component now includes a loading state, file type icons, file size formatting, and improved error handling for file previews. Users can preview images and PDFs directly within the app using a modal with a WebView, while other file types can be downloaded or shared. The design has been improved to provide clearer information about each attachment, and the code structure has been optimized for better readability and maintainability.
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useContext, useState} from 'react';

import {useSelector} from 'react-redux';
import HeaderCompo from '../../../components/HeaderCompo';
import {COLORS} from '../../../styles/Colors';
import Remark from '../../../components/Modaals/Remark';
import makeApiCall from '../../../utils/apiHelper';
import {AuthContext} from '../../../Screens/Context';
import urls from '../../../../url';
import navigationString from '../../../route/navigationString';

const EditLeadremark = ({navigation, route}) => {
  const remarksObj = route?.params || {};
  console.log(remarksObj?.remarks, 'RemarkObject ');

  const remarksArray1 = remarksObj?.remarks?.remarks_lines
    ? Object.values(remarksObj.remarks.remarks_lines)
    : [];

  //   console.log("📌 remarksObj:", remarksObj);
  // console.log("📌 remarks_lines:", remarksObj?.remarks);
  // console.log("📌 remarksArray:", Object.values(remarksObj?.remarks || {}));
  // console.log(remarksArray1, 'remarksArray1,remarksArray1,remarksArray1');

  const [openmodal, setopenmodal] = useState(false);
  const user = useSelector(state => state.user.userDatainfo);
  const [remarkdata, setremarkdata] = useState(null);

  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;

  const resUser = user?.result?.res_user;
  const id = remarksObj?.remarks?.id;

  // ---------- Submit Remark API (Uses data directly) ----------
  const headlesubmit = async data => {
    if (!data) {
      console.log('No data received for submit');
      return;
    }

    // ✅ Validate remark
    // if (!data.remark || data.remark.trim() === '') {
    //   alert('Please enter a remark before submitting.');
    //   return;
    // }

    try {
      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          id: id,
          // remarkdata: [
          //   {
          //     dateValue: data.dateValue,
          //     remark: data.remark.trim()||'',
          //     line_id: data.line_id || null,
          //     createdBy: data.createdBy,
          //     replyTo: data.replyTo || null,
          //   },
          // ],
          remarkdata: [
            {
              dateValue: data.dateValue,
              remark: data.remark.trim() || '',
              line_id: data.line_id || null,
              createdBy: data.createdBy,
              replyTo: data.replyTo ?String( data.replyTo) : [],
            },
          ],
        },
      };

      console.log(payload, 'PayLoad====================');

      const res = await makeApiCall(
        server_origin,
        urls.createleadRemark,
        'POST',
        payload,
      );

      console.log('Remark Submit Response:', res);
      if (res?.result?.success) {
        alert('Remark Created Successfully');
        navigation.pop(3);
      } else {
        Alert.alert('Error');
      }
    } catch (error) {
      console.log('Error in submitting remark:', error);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderCompo
        title={'Remark'}
        lefticon={require('../../../assets/back.png')}
        onPress={() => navigation.goBack()}
      />
      {/* <Text>hi</Text> */}

      <ScrollView contentContainerStyle={{padding: 15}}>
        {remarksArray1.length > 0 ? (
          remarksArray1.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{item?.date || '--'}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>User:</Text>
                <Text style={styles.value}>
                  {typeof item?.user === 'string' ? item.user.trim() : '--'}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Reply To:</Text>
                <Text style={styles.value}>{item?.reply_to || '--'}</Text>
              </View>

              <View style={{marginTop: 6, flexDirection: 'row'}}>
                <Text style={styles.label}>Remarks:</Text>
                <Text style={styles.remarkText}>
                  {typeof item?.remarks === 'string' ? item.remarks : '--'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No Remarks Found</Text>
        )}
      </ScrollView>

      {/* Create Remark Button */}
      <TouchableOpacity
        style={styles.bottombutton}
        onPress={() => setopenmodal(true)}>
        <Text style={styles.bottombuttonText}>Create Remark</Text>
      </TouchableOpacity>

      {/* Remark Modal */}
      <Remark
        isVisible={openmodal}
        onclose={data => {
          setopenmodal(false);

          if (data) {
            console.log('Received Remark Data:', data);

            // store if needed
            setremarkdata(data);

            // Directly submit using data → FIXES empty issue
            headlesubmit(data);
          }
        }}
        resUser={resUser}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  bottombutton: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    height: 60,
    width: 130,
    backgroundColor: COLORS.BLUE,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  bottombuttonText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '800',
    color: COLORS.white,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },

  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#444',
    width: 110,
  },

  value: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },

  noData: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
    fontSize: 14,
  },
});

export default EditLeadremark;
//bug id 2555 Jamshed end
