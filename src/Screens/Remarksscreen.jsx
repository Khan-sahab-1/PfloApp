// Jamshed start bug id 2555
// Description: This file defines the Remarksscreen component, which displays a list of remarks for a specific item (such as a lead or opportunity) and allows users to create new remarks. The component retrieves remark data passed through navigation parameters and renders it in a scrollable view. Each remark displays the date, user, reply-to information, and the remark content. A button at the bottom of the screen opens a modal for creating new remarks, which can be submitted to the server. The component also handles navigation back to the previous screen and ensures that the UI is responsive and user-friendly.
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../styles/Colors';
import HeaderCompo from '../components/HeaderCompo';
import RemarkModal from '../components/RemarkModal';
import Remark from '../components/Modaals/Remark';
import {useSelector} from 'react-redux';
import navigationString from '../route/navigationString';

const Remarksscreen = ({navigation, route}) => {
  const remarksObj = route?.params?.remarks || {};
  const [openmodal, setopenmodal] = useState(false);
  const user = useSelector(state => state.user.userDatainfo);
  const [remarkdata, setremarkdata] = useState({});
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  // console.log(remarkdata, 'remarkdata');
  const resUser = user?.result?.res_user;
  // Convert object to array
  const remarks = Object.values(remarksObj);

  const handleCloseRemark = data => {
    setShowRemarkModal(false);

    if (!data) {
      console.log('Modal closed without submitting');
      return;
    }

    // Navigate with submitted data
    navigation.navigate(navigationString.EDIT_LEAD_SCREEN, {
      remarkData: data,
    });
  };

  return (
    <View style={styles.container}>
      <HeaderCompo
        title={'Remark'}
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={{padding: 15}}>
        {remarks.length > 0 ? (
          remarks.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.date}>Date:{item?.date || '--'}</Text>
              <Text style={styles.text}>
                User: {item?.user?.trim() || '--'}
              </Text>
              <Text style={styles.text}>
                Reply to: {item?.reply_to || '--'}
              </Text>
              <Text style={styles.remark}>Remarks:{item?.remarks || '--'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No Remarks Found</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.bottombutton}
        onPress={() => setopenmodal(true)}>
        <Text style={styles.bottombuttonText}>Create Remark</Text>
      </TouchableOpacity>
      <Remark
        isVisible={openmodal}
        onclose={data => {
          setopenmodal(false);

          if (data) {
            console.log('Received Remark Data:', data);
            setremarkdata(data);

            // 🔥 You can also store it in state if needed
            // setRemarkData(data);
          }
        }}
        resUser={resUser}
      />
    </View>
  );
};

export default Remarksscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  date: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.BLACK,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: COLORS.BLACK,
    marginBottom: 3,
  },
  remark: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.BLUE,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: COLORS.GRAY,
    fontSize: 16,
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
});
// Jamshed end bug id 2555
