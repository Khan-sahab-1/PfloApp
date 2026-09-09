// Jamshed start bug id 2555
// Description: This file defines the PreviewEditRemark component, which allows users to view and create remarks for a specific item (such as a lead or opportunity). The component displays existing remarks in a scrollable view and provides a button to open a modal for creating new remarks. It handles the submission of new remarks by making an API call to the server, passing the necessary data such as the remark content, date, user information, and any reply-to references. The UI is designed to be user-friendly, with clear sections for existing remarks and an easy-to-access button for adding new ones.
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {useSelector} from 'react-redux';
import HeaderCompo from '../components/HeaderCompo';
import {COLORS} from '../styles/Colors';
import Remark from '../components/Modaals/Remark';
import makeApiCall from '../utils/apiHelper';
import {AuthContext} from './Context';
import urls from '../../url';
import navigationString from '../route/navigationString';
const {width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/MaterialIcons';
import Previeweditmodal from './Previeweditmodal';

const PreviewEditRemark = ({navigation, route}) => {
  const remarksObj = route?.params || {};
  const [openmodal, setopenmodal] = useState(false);
  const user = useSelector(state => state.user.userDatainfo);
  const [remarkdata, setremarkdata] = useState(null);
  const [openeditmodal, setopeneditmodal] = useState(false);
  const [selectedEdit, setselectedEdit] = useState(null);
  // console.log(remarksObj?.remarks?.remarks_lines, 'remarksObj,remarksObj');

  // const assignedLines =
  //   remarksObj?.remarks?.remarks_line &&
  //   typeof remarksObj.remarks.remarks_line === 'object'
  //     ? remarksObj.remarks.remarks_line
  //     : {};
  const assignedLines = Object.entries(
    remarksObj?.remarks?.remarks_line ||
      remarksObj?.remarks?.remarks_lines ||
      {},
  ).map(([id, value]) => ({
    id,
    ...value,
  }));
  // console.log(assignedLines, 'Lines ');

  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;

  const resUser = user?.result?.res_user;
  const id = remarksObj?.remarks?.id;

const handleedit = (item) => {
  console.log('EDIT CLICKED', item);
  setselectedEdit(item);
  setopeneditmodal(true);
};

  const headlesubmit = async data => {
    if (!data) {
      console.log('No data received for submit');
      return;
    }
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
          remarkdata: [
            {
              dateValue: data.dateValue,
              remark: data.remark.trim() || '',
              line_id: data.line_id || null,
              createdBy: data.createdBy,
              replyTo: data.replyTo || null,
            },
          ],
        },
      };
      console.log(payload, 'PayLoad====================');
      const res = await makeApiCall(
        server_origin,
        urls.createoppRemark,
        'POST',
        payload,
      );

      console.log('Remark Submit Response:', res);
      if (res?.result?.success) {
        alert('Remark Created Successfully');
        navigation.pop(3);
      }
    } catch (error) {
      console.log('Error in submitting remark:', error);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderCompo
        title={'Remark'}
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      {/* <ScrollView contentContainerStyle={{padding: 15}}>
        {Object.entries(assignedLines).length === 0 ? (
          <Text>No Assigned Lines Found</Text>
        ) : (
          Object.entries(assignedLines).map(([key, item]) => (
            <View
              key={key}
              style={{
                marginBottom: 15,
                padding: 10,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
              }}>
              <Text>Date: {item?.date || '-'}</Text>
              <Text>Remarks: {item?.remarks || '-'}</Text>
              <Text>User: {item?.user?.trim?.() || '-'}</Text>
              <Text>Reply To: {item?.reply_to?.trim?.() || '-'}</Text>
            </View>
          ))
        )}
      </ScrollView> */}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {Object.entries(assignedLines).length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="comment" size={60} color={COLORS.gray} />
            <Text style={styles.emptyText}>No Assigned Lines Found</Text>
            <Text style={styles.emptySubText}>
              Tap the button below to create a remark
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              Remarks ({Object.entries(assignedLines).length})
            </Text>
            {Object.entries(assignedLines).map(([key, item]) => (
              <View key={key} style={styles.remarkCard}>
                {/* Header with date and badge */}
                <View style={styles.cardHeader}>
                  <View style={styles.dateBadge}>
                    <Icon name="event" size={14} color={COLORS.white} />
                    <Text style={styles.dateText}>{item?.date || '-'}</Text>
                  </View>
                  {/* <TouchableOpacity onPress={()=>handleedit(item)} >

                  <Icon name="more-vert" size={20} color={COLORS.gray} />
                  </TouchableOpacity> */}
                </View>

                {/* Remarks Content */}
                <View style={styles.remarkContent}>
                  <Icon name="comment" size={20} color={COLORS.BLUE} />
                  <Text style={styles.remarkText}>{item?.remarks || '-'}</Text>
                </View>

                {/* User Info */}
                <View style={styles.userInfo}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userInitial}>
                      {item?.user?.trim?.()?.charAt(0)?.toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>
                      {item?.user?.trim?.() || 'Unknown User'}
                    </Text>
                    <Text style={styles.userRole}>Remark added by</Text>
                  </View>
                </View>

                {/* Reply Section */}
                {(Array.isArray(item?.reply_to)
                  ? item.reply_to.length > 0
                  : item?.reply_to?.trim?.()) && (
                  <View style={styles.replySection}>
                    <View style={styles.replyLine} />
                    <View style={styles.replyContent}>
                      <Icon name="reply" size={16} color={COLORS.gray} />
                      <Text style={styles.replyLabel}>Reply To:</Text>

                      <Text style={styles.replyText}>
                        {Array.isArray(item?.reply_to)
                          ? item.reply_to.map(r => r.name).join(', ')
                          : item?.reply_to?.trim?.() || ''}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Footer with timestamp */}
                <View style={styles.cardFooter}>
                  <Icon name="access-time" size={12} color={COLORS.gray} />
                  <Text style={styles.footerText}>
                    {new Date().toLocaleDateString()} at{' '}
                    {new Date().toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            ))}
          </>
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
      <Previeweditmodal
        isVisible={openeditmodal}
        onclose={() => setopeneditmodal(false)}
        resUser={resUser}
        remarkdata={selectedEdit}
      />
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },

//   bottombutton: {
//     position: 'absolute',
//     bottom: 30,
//     right: 10,
//     height: 60,
//     width: 130,
//     backgroundColor: COLORS.BLUE,
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 5,
//   },

//   bottombuttonText: {
//     fontSize: 18,
//     textAlign: 'center',
//     fontWeight: '800',
//     color: COLORS.white,
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  remarkCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E9ECF0',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BLUE,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },

  dateText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },

  remarkContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F8FAFE',
    borderRadius: 12,
  },

  remarkText: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
    fontWeight: '500',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },

  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  userInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.BLUE,
  },

  userDetails: {
    flex: 1,
  },

  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },

  userRole: {
    fontSize: 11,
    color: '#64748B',
  },

  replySection: {
    marginBottom: 12,
  },

  replyLine: {
    height: 1,
    backgroundColor: '#E9ECF0',
    marginBottom: 12,
  },

  replyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 10,
  },

  replyLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  replyText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    fontStyle: 'italic',
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },

  footerText: {
    fontSize: 10,
    color: '#94A3B8',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },

  bottombutton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    height: 56,
    paddingHorizontal: 20,
    backgroundColor: COLORS.BLUE,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: COLORS.BLUE,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  bottombuttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default PreviewEditRemark;
// Jamshed end bug id 2555
