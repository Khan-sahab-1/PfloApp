//// Bug ID 2822 start Jamshed
// Description: Refactored the PreviewEnqueryQutaionmeet component to handle inconsistent data formats and enhance the display of enquiry and quotation details. The component now normalizes incoming data to ensure it can handle both nested object formats and flat object formats seamlessly. Additionally, the UI has been improved to provide a clearer and more organized presentation of the enquiry/quotation information, including better handling of missing or optional fields. This refactor ensures that the component is more robust and can display data correctly regardless of its initial structure.
import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import HeaderCompo from '../../../components/HeaderCompo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TextinputCompo from '../../../components/TextinputCompo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconIonic from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../../styles/Colors';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import navigationString from '../../../route/navigationString';
// import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import makeApiCall from '../../../utils/apiHelper';
import urls from '../../../../url';
import {AuthContext} from '../../../Screens/Context';
import ButtonCompo from '../../../components/ButtonCompo';

const PreviewLeads = ({navigation, route}) => {
  const [active, setactive] = useState('');
  const user = useSelector(state => state.user.userDatainfo);
  const [attachments, setAttachments] = useState([]);
  console.log(user,'User');
  console.log(route?.params?.model, 'Items==========');
  // console.log(route?.params?.title);
  // const { id } = route.params;
  // console.log( route.params?.item?.id,'oooooooooooo')
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;

  const title = route?.params?.title;
  const onEditPress = route?.params?.onEditPress;
  const onStatusPress = route?.params?.onStatusPress;
  const onConverttoEnquery = route?.params?.onConverttoEnquery;
  const enquiryOnlyTabs = [
    'enquirylines',
    'Query',
    'otherinformation',
    'termandcondition',
  ];
  const oppTabOnly = [
    'contactinformation',
    'internal',
    'assigned',
    'planeofaction',
    'remarks',
  ];

  const tabs = [
    {key: 'internal', label: 'Internal Notes'},
    {key: 'orderlines', label: 'Order Lines'},
    {key: 'contactinformation', label: 'Contact Information'},
    {key: 'extra', label: 'Extra Info'},
    {key: 'assigned', label: 'Assigned To'},
    {key: 'remarks', label: 'Remarks'},
    {key: 'remarks1', label: 'Remarks'},
    {key: 'planeofaction', label: 'Plan of Action'},
    {key: 'enquirylines', label: 'Enquiry Lines'},
    {key: 'Query', label: 'Query'},
    {key: 'termandcondition', label: 'Term & Condition'},
    {key: 'otherinformation', label: 'Other Information'},
    {key: 'othercharges', label: 'Other Charges'},
  ].filter(tab => {
    // ---------- Enquiry Page Logic ----------
    if (route?.params?.title === 'Enquiry') {
      return enquiryOnlyTabs.includes(tab.key); // show only these 3
    }
    if (route?.params?.title === 'Leads') {
      const leadTabs = [
        'internal',
        'extra',
        'assigned',
        'remarks',
        'planeofaction',
      ];
      return leadTabs.includes(tab.key);
    }

    // ---------- Opportunity Logic ----------
    if (route?.params?.title === 'Opportunity') {
      return oppTabOnly.includes(tab.key);
    }
    if (route?.params?.title === 'Quotation') {
      const quotationTabs = [
        'orderlines',
        'remarks1',
        'termandcondition',
        'otherinformation',
        'othercharges',
      ];
      return quotationTabs.includes(tab.key);
    }

    // ---------- Non-Opportunity Logic ----------
    if (
      route?.params?.title !== 'Opportunity' &&
      tab.key === 'planeofaction' &&
      tab.key === 'enquirylines' &&
      tab.key === 'termandcondition' &&
      tab.key === 'Query' &&
      tab.key === 'planeofaction'
    ) {
      return false; // hide Plane of Action
    }

    return true;
  });

  useEffect(() => {
    if (tabs.length > 0) {
      setactive(tabs[0].key);
    }
  }, [title]);

  const {item} = route?.params;
  // console.log(item, 'wiwiwuiwuwu');
  // console.log(user, 'Userrr');

  const leadData = item;

  const attachmentLength = leadData?.attachments?.length ?? 0;

  // console.log('LEAD ITEM RAW:', leadData);
  // console.log('PRIORITY RAW:', leadData?.priority);
  // console.log('TYPE:', typeof leadData?.priority);

  const priorityNumber = Number(leadData?.priority) || 0;

  // console.log('PRIORITY NUMBER (FINAL):', priorityNumber);

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${leadData.email}`);
  };

  const handlePhonePress = () => {
    Linking.openURL(`tel:${leadData.phone}`);
  };

  // const pickAnyFileBase64 = async () => {
  //   try {
  //     const res = await DocumentPicker.pickSingle({
  //       type: [DocumentPicker.types.allFiles],
  //       copyTo: 'cachesDirectory',
  //     });

  //     const fileUri = res.fileCopyUri || res.uri;
  //     const base64 = await RNFS.readFile(fileUri, 'base64');

  //     const payload = {
  //       id: 394,
  //       model: 'crm.lead',
  //       name: res.name,
  //       type: res.type,
  //       size: res.size,
  //       base64: base64,
  //     };
  //     console.log(payload, 'Paylaod');
  //     const response = await makeApiCall(
  //       server_origin,
  //       urls.UploadAttachment,
  //       'POST',
  //       {
  //         jsonrpc: '2.0',
  //         params: payload,
  //       },
  //     );
  //     // 🚀 AUTO UPLOAD

  //     console.log('UPLOAD SUCCESS:', response);
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       console.log('User cancelled');
  //     } else {
  //       console.error('Upload error:', err);
  //     }
  //   }
  // };

  const InfoRow = ({label, value, onPress, icon}) => {
    if (!value) return null;
    if (value === null || value === undefined) return null;

    const trimmedValue = value.trim();

    const content = (
      <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.valueContainer}>
          {icon && (
            <Icon name={icon} size={18} color="#007AFF" style={styles.icon} />
          )}
          <Text style={[styles.value, onPress && styles.linkText]}>
            {trimmedValue}
          </Text>
        </View>
      </View>
    );

    if (onPress) {
      return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
    }
    return content;
  };

  const getInitials = name => {
    return name ? name.substring(0, 2).toUpperCase() : 'LD';
  };

  // Convert assigned_lines object to array
  // const getAssignedLinesArray = () => {
  //   if (!leadData.assigned_lines||!leadData.assigned_to_lines).map(([key, value]) => ({
  //     id: key,
  //     ...value,
  //   }));
  // };
  // const getAssignedLinesArray = () => {
  //   if (!leadData?.assigned_lines || !leadData?.assigned_to_lines) {
  //     return []; // return empty array if any one is missing
  //   }

  //   return Object.entries(
  //     leadData.assigned_lines || leadData?.assigned_to_lines,
  //   ).map(([key, value]) => ({
  //     id: key,
  //     ...value,
  //   }));
  // };
  const getAssignedLinesArray = () => {
    const lines = leadData?.assigned_lines || leadData?.assigned_to_lines;
    // console.log('lines', lines);

    if (!lines) return []; // agar dono hi NA ho

    return Object.entries(lines).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  };
  const getOrderLinesArray = () => {
    const lines = leadData?.order_line || leadData?.order_line;
    // console.log('lines', lines);

    if (!lines) return []; // agar dono hi NA ho

    return Object.entries(lines).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  };
  const getOtherChargesArray = () => {
    const lines = leadData?.other_charges || leadData?.other_charges;
    // console.log('lines', lines);

    if (!lines) return []; // agar dono hi NA ho

    return Object.entries(lines).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  };

  // Convert remarks_lines object to array
  const getRemarksLinesArray = () => {
    const remarkslines =
      leadData?.remarks_lines ||
      leadData?.remarks_line ||
      leadData?.remarksLineList;
    if (!remarkslines) return [];
    return Object.entries(remarkslines).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  };
  const gerPlaneofactionLinesArray = () => {
    const planeofactionlines = leadData?.plan_of_action;
    if (!planeofactionlines) return [];
    return Object.entries(planeofactionlines).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  };

  const gerTermandconditionLinesArray = () => {
    const enquerylines = leadData?.terms_lines || leadData?.term_condition;
    if (!enquerylines) return [];
    return Object.entries(enquerylines).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  };

  const gerEnqueryLinesArray = () => {
    const enquerylines = leadData?.query_lines;
    if (!enquerylines) return [];
    return Object.entries(enquerylines).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  };
  const getQueryLinesArray = () => {
    const querylines = leadData?.enquiry_lines;
    if (!querylines) return [];
    return Object.entries(querylines).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  };

  const getOrderLinesArrayData = () => {
    if (!leadData?.order_line || !Array.isArray(leadData.order_line)) {
      return [];
    }

    // Flatten the array of objects into a single array of items
    const flatArray = leadData.order_line.flatMap(item => {
      return Object.entries(item).map(([id, value]) => ({
        id,
        ...value,
      }));
    });

    return flatArray;
  };

  const sendForReview = async item => {
    console.log(item,'Item data') 
    try {
      if (!item?.opportunity) {
        Alert.alert('Alert', 'Please select Opportunity First');
        return;
      }
      const opportunityId = item.id;
      console.log(opportunityId, 'rrrrrrr');
      const res = await makeApiCall(
        server_origin,
        urls.sent_for_review,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {id: opportunityId},
        },
      );

      console.log(res);

      if (res?.result?.success) {
        Alert.alert('Success', res.result.message, [
          {text: 'OK', onPress: () => navigation.pop(1)},
        ]);
      } else {
        Alert.alert('Error', res?.result?.message || 'Failed');
      }
    } catch (e) {
      console.error('sendForReview:', e);
    }
  };
  
       const fetchAttachments = async () => {
          try {
            const res=await makeApiCall(server_origin, urls.getenquiryattachmentdata, 'POST', {
              jsonrpc: '2.0',
              method: 'call',
              params: {
                res_id: route.params?.item?.id,
                res_model: route?.params?.model,
              },
            });
            // console.log(res?.result?.data, 'Attachment Response');
              if (res?.result?.data) {
                setAttachments(res.result.data);
              }
          } catch (error) {
            console.log(error, 'Error fetching attachments');
          } finally{
      
          }
        }
      //   useEffect(()=>{
      // fetchAttachments(id)
      //   },[id])


useEffect(() => {
    if (route.params?.item?.id) {
      fetchAttachments();
    }
  }, [route.params?.item?.id]);





  return (
    <View style={styles.container}>
      <HeaderCompo
        // title={`Preview ${title}`}
        lefticon={require('../../../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Action Buttons */}
        {!item.visible_to?.some(v => v.emp_code === user.result.emp_code) ||
        item.created_by === user.result.emp_code ||
        item.sale_person_id === user.result.res_user ? (
          <View style={styles.actionBar}>
            {!(route?.params?.title === 'Quotation') &&
              !(route?.params?.item?.stages === 'Mark Lost') && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onEditPress}>
                  <Icon name="pencil" size={20} color="#007AFF" />
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
            {!(
              route?.params?.title === 'Enquiry' ||
              route?.params?.title === 'Leads' ||
              route?.params?.title === 'Quotation'
            ) && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  // {opacity: item?.enquiry_count > 0 ? 1 : 0.5},
                ]}
                disabled={item?.enquiry_count <= 0}
                onPress={() => {
                  if (item?.enquiry_count > 0) {
                    navigation.navigate(
                      navigationString.PREVIEWENQUERYQUTAIONMEET,
                      {data: item?.enquiry_button_data},
                    );
                  }
                }}>
                <View style={styles.iconWithBadge}>
                  <FontAwesome5
                    name="question-circle"
                    size={16}
                    color={'#007AFF'} // grey if inactive
                  />
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: '#007AFF',
                      },
                    ]}>
                    <Text style={styles.badgeText}>
                      {item?.enquiry_count || 0}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.actionButtonText,
                    {color: item?.enquiry_count > 0 ? '#007AFF' : COLORS.black},
                  ]}>
                  Enquiry
                </Text>
              </TouchableOpacity>
            )}
            {route?.params?.title === 'Enquiry' && item?.status === 'draft' && (
              <ButtonCompo
                title="sent for review"
                onPress={() => {
                  sendForReview(item);
                }}
              />
            )}
            {!(
              route?.params?.title === 'Enquiry' ||
              route?.params?.title === 'Leads' ||
              route?.params?.title === 'Quotation'
            ) && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  // {opacity: item?.enquiry_count > 0 ? 1 : 0.5},
                ]}
                disabled={item?.quotation_count <= 0}
                onPress={() => {
                  if (item?.quotation_count > 0) {
                    navigation.navigate(
                      navigationString.PREVIEWENQUERYQUTAIONMEET,
                      {data: item?.quotation_button_data, qutation: 'Qutation'},
                    );
                  }
                }}>
                <View style={styles.iconWithBadge}>
                  <FontAwesome5
                    name="file-invoice-dollar"
                    size={16}
                    color="#34C759"
                  />
                  <View style={[styles.badge, {backgroundColor: '#34C759'}]}>
                    <Text style={styles.badgeText}>
                      {item?.quotation_count || 0}
                    </Text>
                  </View>
                </View>
                <Text style={styles.actionButtonText}>Quotation</Text>
              </TouchableOpacity>
            )}

            {!(
              route?.params?.title === 'Enquiry' ||
              route?.params?.title === 'Leads' ||
              route?.params?.title === 'Quotation'
            ) && (
              <TouchableOpacity
                style={styles.actionButton}
                // onPress={onConverttoMeetings}
                disabled={item?.meeting_count <= 0}
                onPress={() => {
                  if (item?.meeting_count > 0) {
                    navigation.navigate(
                      navigationString.PREVIEWENQUERYQUTAIONMEET,
                      {data: item?.meeting_button_data, qutation: 'Meetings'},
                    );
                  }
                }}>
                <View style={styles.iconWithBadge}>
                  <FontAwesome5 name="calendar-alt" size={16} color="#FF9500" />
                  <View style={[styles.badge, {backgroundColor: '#FF9500'}]}>
                    <Text style={styles.badgeText}>
                      {item?.meeting_count || 0}
                    </Text>
                  </View>
                </View>
                <Text style={styles.actionButtonText}>Meetings</Text>
              </TouchableOpacity>
            )}
            {!(route?.params?.item?.stages === 'Mark Lost') && (
              <TouchableOpacity
                style={styles.actionButton}
                // onPress={pickAnyFileBase64}
                onPress={() => {
                  // if (item?.attachments?.length > 0) {
                  navigation.navigate(navigationString.ATTACHMENTSCREEN, {
                    data: attachments,
                    Enquery: title,
                    id: item?.id,
                  });
                  // }
                }}>
                {/* <IconIonic name="attach-outline" size={20} color="#007AFF" /> */}
                <View style={styles.iconWithBadge}>
                  <IconIonic name="attach-outline" size={20} color="#007AFF" />
                  <View style={[styles.badge, {backgroundColor: '#34C759'}]}>
                    <Text style={styles.badgeText}>
                      {attachments.length || 0}
                    </Text>
                  </View>
                </View>
                <Text style={styles.actionButtonText}>Attachment</Text>
              </TouchableOpacity>
            )}
            {
              // <TouchableOpacity
              //   style={[styles.actionButton, styles.statusButton]}
              //   onPress={onStatusPress}>
              //   <MaterialIcons name="change-circle" size={20} color="#007AFF" />
              //   <Text style={styles.actionButtonText}>Change Stage</Text>
              // </TouchableOpacity>
            }
            {/* <TouchableOpacity style={styles.actionButton}>
              <Icon name="paperclip" size={20} color="#666" />
              <Text style={styles.actionButtonText}>Attachment(s)</Text>
            </TouchableOpacity> */}
          </View>
        ) : null}

        {/* Main Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.avatarContainer}>
              {/* <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(leadData.name)}
                </Text>
              </View> */}
            </View>

            <View style={styles.headerInfo}>
              {leadData.lead_id && (
                <Text style={[styles.prospectName, {marginTop: 4}]}>
                  Lead ID: {leadData.lead_id}
                </Text>
              )}
              <Text style={styles.prospectName}>
                {leadData.name
                  ? `Lead Name: ${leadData.name}`
                  : `Enquiry Id: ${leadData.enquiry_number}`}
              </Text>

              <View style={{flexDirection: 'row', gap: 10}}>
                <Text style={[styles.prospectName]}>Address:</Text>
                <View>
                  {leadData.street && (
                    <Text style={styles.addressText}>{leadData.street}</Text>
                  )}
                  {leadData.street && (
                    <Text style={styles.addressText}>{leadData.street2}</Text>
                  )}
                  {leadData.city && (
                    <Text style={styles.addressText}>{leadData.city}</Text>
                  )}
                  {leadData.state_name && (
                    <Text style={styles.addressText}>
                      {leadData.state_name}, {leadData.country_name}
                    </Text>
                  )}
                  {leadData.zip && (
                    <Text style={styles.addressText}>Zip:{leadData.zip}</Text>
                  )}
                </View>
              </View>
              {/* <Text style={styles.prospectName}>{leadData.customer}</Text> */}
              {/* {leadData.street && (
                <Text style={styles.addressText}>{leadData.street}</Text>
              )}
               {leadData.street && (
                <Text style={styles.addressText}>{leadData.street2}</Text>
              )}
              {leadData.city && (
                <Text style={styles.addressText}>{leadData.city}</Text>
              )}
              {leadData.state_name && (
                <Text style={styles.addressText}>
                  {leadData.state_name}, {leadData.country_name}
                </Text>
              )}
               {leadData.zip && (
                <Text style={styles.addressText}>
                 Zip:{leadData.zip}
                </Text>
              )} */}

              {/* {leadData.enquiry_number && (
                <Text style={[styles.addressText, {marginTop: 4}]}>
                  Enquiry ID: {leadData.enquiry_number}
                </Text>
              )} */}

              <Text style={[styles.addressText, {marginTop: 4}]}>
                {leadData.address}
              </Text>
            </View>
          </View>
        </View>

        {route?.params?.title === 'Leads' && (
          <View style={styles.card}>
            <InfoRow
              label="Account Holder:"
              value={leadData.account_holder}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Sales channel:"
              value={leadData.sale_channel}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Assign To:"
              value={leadData.assign_to_user}
              // onPress={handleEmailPress}
              // icon="email"
            />
            {leadData.visible_to && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Visible To</Text>
                <View style={styles.tagsContainer}>
                  {Array.isArray(leadData?.visible_to) &&
                  leadData.visible_to.length > 0
                    ? leadData.visible_to.map(person => (
                        <View key={person.id} style={styles.tag}>
                          <Text style={styles.tagText}>{person.name}</Text>
                        </View>
                      ))
                    : null}
                </View>
              </View>
            )}

            <InfoRow
              label="Contact Name:"
              value={leadData.contact}
              // onPress={handleEmailPress}
              // icon="email"
            />

            <InfoRow
              label="Email"
              value={leadData.email}
              onPress={handleEmailPress}
              icon="email"
            />
            <InfoRow
              label="Phone"
              value={leadData.phone}
              onPress={handlePhonePress}
              icon="phone"
            />
            <InfoRow label="Job Position" value={leadData.job_position} />
            <InfoRow label="Remarks" value={leadData.remarks} />
            {priorityNumber > 0 ? (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Priority</Text>
                <Text style={styles.value}>{'⭐'.repeat(priorityNumber)}</Text>
              </View>
            ) : null}
            <InfoRow label="Division" value={leadData.division} />
            <InfoRow label="Sales Persion" value={leadData.sale_person} />
            <InfoRow label="Created By" value={leadData.created_by_name} />
          </View>
        )}

        {route?.params?.title === 'Enquiry' && (
          <View style={styles.card}>
            <InfoRow
              label="Division:"
              value={leadData.division}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Customer:"
              value={leadData.customer}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Adreess:"
              value={leadData.address}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Client Ref No:"
              value={leadData.client_ref_no}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Enquiry Type:"
              value={leadData.enquiry_type}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Sale Person:"
              value={leadData.sale_person}
              // onPress={handleEmailPress}
              // icon="email"
            />

            <InfoRow
              label="Cost Center:"
              value={leadData.cost_center_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Enquiry Date:"
              value={leadData.enquiry_date}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Pricelist:"
              value={leadData.pricelist_name}
              // onPress={handleEmailPress}
              // icon="email"
            />

            <InfoRow
              label="Comments:"
              value={leadData.comments}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Opportunity:"
              value={leadData.opportunity_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
          </View>
        )}
        {route?.params?.title === 'Quotation' && (
          <View style={styles.card}>
            <InfoRow
              label="Enquiry:"
              value={leadData.enquiry}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Customer:"
              value={leadData.partner_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Customer Email:"
              value={leadData.customer_email}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Customer Phone:"
              value={leadData.customer_phone_no}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Client Ref No:"
              value={leadData.client_order_ref}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Invoice Address:"
              value={leadData.partner_invoice_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Delivery Address:"
              value={leadData.partner_shipping_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Quotation Type:"
              value={leadData.quotation_type}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Division:"
              value={leadData.employee_division_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Validity:"
              value={String(leadData.validity)}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Quotation Date:"
              value={leadData.quotation_date}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Pricelist:"
              value={leadData.pricelist_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Sale Person:"
              value={leadData.sale_person_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Account Holder:"
              value={leadData.account_holder_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Sale Person Email:"
              value={leadData.sale_person_email}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Sale Person Phone:"
              value={leadData.sale_person_phone_no}
              // onPress={handleEmailPress}
              // icon="email"
            />

            <InfoRow
              label="Comments:"
              value={leadData.comments}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Opportunity:"
              value={leadData.opportunity_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
          </View>
        )}
        {route?.params?.title === 'Opportunity' && (
          <View style={styles.card}>
            <InfoRow
              label="Expected Revenue:"
              value={String(leadData.expected_revenue)}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="At Probability:"
              value={String(leadData.at_probability)}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Prospect Name:"
              // value={String(leadData.partner_name)}
              // value={String(leadData.partner_name) || ''}
              value={leadData.partner_name ?? ''}

              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Account Holder:"
              value={leadData.account_holder_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Division:"
              value={leadData.employee_division_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Customer:"
              value={leadData.customer_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Email:"
              value={leadData.email}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Phone:"
              value={leadData.phone}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Sales Channel:"
              value={leadData.sales_channel_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Assign To:"
              value={leadData.assign_to_name}
              // onPress={handleEmailPress}
              // icon="email"
            />

            {leadData.visible_to && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Visible To</Text>
                <View style={styles.tagsContainer}>
                  {Array.isArray(leadData?.visible_to) &&
                  leadData.visible_to.length > 0
                    ? leadData.visible_to.map(person => (
                        <View key={person.id} style={styles.tag}>
                          <Text style={styles.tagText}>{person.name}</Text>
                        </View>
                      ))
                    : null}
                </View>
              </View>
            )}

            <InfoRow
              label="Expected Closing:"
              value={leadData.expected_closing}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Remarks:"
              value={leadData.opp_remark}
              // onPress={handleEmailPress}
              // icon="email"
            />
            {priorityNumber > 0 ? (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Priority</Text>
                <Text style={styles.value}>{'⭐'.repeat(priorityNumber)}</Text>
              </View>
            ) : null}
            <InfoRow
              label="Tags:"
              value={leadData.tag_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Sales Person:"
              value={leadData.sale_person}
              // onPress={handleEmailPress}
              // icon="email"
            />
            <InfoRow
              label="Created By:"
              value={leadData.create_by_name}
              // onPress={handleEmailPress}
              // icon="email"
            />
          </View>
        )}

        {/* Tabs Section */}
        <View style={styles.card}>
          <View style={styles.tabsContainer}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, active === tab.key && styles.activeTab]}
                onPress={() => setactive(tab.key)}>
                <Text
                  style={[
                    styles.tabText,
                    active === tab.key && styles.activeTabText,
                  ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab content render based on active tab */}
          <View style={styles.tabContent}>
            {active === 'internal' && (
              <View>
                <TextinputCompo
                  placeholder={'Internal Notes'}
                  value={
                    leadData.internal_notes || leadData?.description || '-'
                  }
                  multiline
                  editable={false}
                  style={{color: 'black'}}
                />
              </View>
            )}

            {active === 'extra' && (
              <View>
                <View style={styles.tableContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View>
                      <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, {width: 100}]}>
                          Compain
                        </Text>
                        <Text style={[styles.tableHeaderText, {width: 150}]}>
                          Medium
                        </Text>
                        <Text style={[styles.tableHeaderText, {width: 150}]}>
                          Source
                        </Text>
                        <Text
                          style={[
                            styles.tableHeaderText,
                            {width: 120, borderRightWidth: 0},
                          ]}>
                          Referred By
                        </Text>
                        <Text
                          style={[
                            styles.tableHeaderText,
                            {width: 120, borderRightWidth: 0},
                          ]}>
                          Assigned
                        </Text>
                        <Text
                          style={[
                            styles.tableHeaderText,
                            {width: 120, borderRightWidth: 0},
                          ]}>
                          Closed Date
                        </Text>
                        <Text
                          style={[
                            styles.tableHeaderText,
                            {width: 120, borderRightWidth: 0},
                          ]}>
                          Probability
                        </Text>
                      </View>

                      {getAssignedLinesArray() ? (
                        <View>
                          <View style={styles.tableRow}>
                            <Text style={[styles.tableCellText, {width: 100}]}>
                              {leadData.campaign_name ||
                                leadData.campaign_name ||
                                'N/A'}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 150}]}>
                              {leadData.medium_name || 'N/A'}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 150}]}>
                              {leadData.source_name || 'N/A'}
                            </Text>
                            <Text
                              style={[
                                styles.tableCellText,
                                {width: 120, borderRightWidth: 0},
                              ]}>
                              {leadData.referred || '-'}
                            </Text>
                            <Text
                              style={[
                                styles.tableCellText,
                                {width: 120, borderRightWidth: 0},
                              ]}>
                              {leadData.date_open || '-'}
                            </Text>
                            <Text
                              style={[
                                styles.tableCellText,
                                {width: 120, borderRightWidth: 0},
                              ]}>
                              {leadData.date_closed || '-'}
                            </Text>
                            <Text
                              style={[
                                styles.tableCellText,
                                {width: 120, borderRightWidth: 0},
                              ]}>
                              {leadData.probability || '-'}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.emptyState}>
                          <Icon name="account-outline" size={48} color="#CCC" />
                          <Text style={styles.emptyStateText}>
                            No assignments yet
                          </Text>
                        </View>
                      )}
                    </View>
                  </ScrollView>
                </View>
              </View>
            )}

            {active === 'orderlines' && (
              <View style={styles.tableContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderText, {width: 60}]}>
                        #
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 150}]}>
                        Product
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 100}]}>
                        Enquired Quantity
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 120}]}>
                        Unit Measure
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 120}]}>
                        Customer Specs
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 120}]}>
                        Customer Code
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 120}]}>
                        Desc
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 120}]}>
                        Unit Price
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 120}]}>
                        Last Sale Price
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 120}]}>
                        Tax
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 120}]}>
                        Competitor
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 120}]}>
                        Discount(%)
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 120}]}>
                        Subtotal
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 100}]}>
                        Status
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 200}]}>
                        Description
                      </Text>
                    </View>

                    {getOrderLinesArrayData().length > 0 ? (
                      <>
                        <View>
                          {getOrderLinesArrayData().map((line, index) => (
                            <View key={line.id} style={styles.tableRow}>
                              <Text style={[styles.tableCellText, {width: 60}]}>
                                {index + 1}
                              </Text>
                              <Text
                                style={[styles.tableCellText, {width: 150}]}>
                                {line?.product_code
                                  ? `[${line.product_code}] ${
                                      line?.product_name || '-'
                                    }`
                                  : line?.product_name || '-'}
                              </Text>
                              <Text
                                style={[styles.tableCellText, {width: 100}]}>
                                {String(line.product_uom_qty) || 0}{' '}
                              </Text>
                              <Text
                                style={[styles.tableCellText, {width: 120}]}>
                                {line.unit_name || ''}
                              </Text>
                              <Text
                                style={[styles.tableCellText, {width: 120}]}>
                                {line.customer_specific_description_quotation ||
                                  '-'}
                              </Text>
                              <Text
                                style={[styles.tableCellText, {width: 120}]}>
                                {line.customer_code || '-'}
                              </Text>
                              <Text
                                style={[styles.tableCellText, {width: 120}]}>
                                {String(line.discount) || '-'}
                              </Text>
                              <Text
                                style={[styles.tableCellText, {width: 120}]}>
                                ₹{Number(line.price_unit || 0).toFixed(2)}
                              </Text>
                              <Text
                                style={[styles.tableCellText, {width: 120}]}>
                                ₹{Number(line.last_price_unit || 0).toFixed(2)}
                              </Text>
                              <Text
                                style={[styles.tableCellText, {width: 120}]}>
                                {line?.tax_id?.[0]?.name ?? '-'}
                              </Text>
                              <Text
                                style={[styles.tableCellText, {width: 120}]}>
                                {String(line?.discount) ?? '0'}
                              </Text>
                              <Text
                                style={[styles.tableCellText, {width: 120}]}>
                                {line?.discount ? `${line.discount}%` : '0%'}
                              </Text>
                              <Text
                                style={[styles.tableCellText, {width: 120}]}>
                                {/* ₹{String(line.price_subtotal) || '0.00'} */}
                                ₹{Number(line.price_subtotal || 0).toFixed(2)}
                              </Text>
                              <View
                                style={[styles.tableCellText, {width: 100}]}>
                                <Text
                                  style={[
                                    styles.statusBadge,
                                    item.quot_status === 'confirm'
                                      ? styles.confirmedBadge
                                      : styles.pendingBadge,
                                  ]}>
                                  {item.quot_status || 'pending'}
                                </Text>
                              </View>
                              <Text
                                style={[
                                  styles.tableCellText,
                                  {width: 200, borderRightWidth: 0},
                                ]}>
                                {line.description || 'No description'}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </>
                    ) : (
                      <View style={styles.emptyState}>
                        <Icon name="account-outline" size={48} color="#CCC" />
                        <Text style={styles.emptyStateText}>
                          No assignments yet
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
                {leadData?.amount_total !== null &&
                  leadData?.amount_total !== undefined && (
                    <View style={styles.totalContainer}>
                      <Text style={styles.totalLabel}>Total Amount:</Text>
                      <Text style={styles.totalAmount}>
                        ₹{Number(leadData.amount_total).toFixed(2)}
                      </Text>
                    </View>
                  )}
              </View>
            )}
            {active === 'assigned' && (
              <View style={styles.tableContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderText, {width: 100}]}>
                        Date
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 150}]}>
                        Assigned From
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 150}]}>
                        Assigned To
                      </Text>
                      <Text
                        style={[
                          styles.tableHeaderText,
                          {width: 120, borderRightWidth: 0},
                        ]}>
                        Remarks
                      </Text>
                    </View>

                    {getAssignedLinesArray().length > 0 ? (
                      <View>
                        {getAssignedLinesArray().map((line, index) => (
                          <View key={line.id} style={styles.tableRow}>
                            <Text style={[styles.tableCellText, {width: 100}]}>
                              {line.date || 'N/A'}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 150}]}>
                              {line.assigned_from || 'N/A'}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 150}]}>
                              {line.assigned_to || 'N/A'}
                            </Text>
                            <Text
                              style={[
                                styles.tableCellText,
                                {width: 120, borderRightWidth: 0},
                              ]}>
                              {line.assigned_remarks || '-'}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.emptyState}>
                        <Icon name="account-outline" size={48} color="#CCC" />
                        <Text style={styles.emptyStateText}>
                          No assignments yet
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            )}

            {active === 'Query' && (
              <View style={styles.tableContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderText, {width: 50}]}>
                        #
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 100}]}>
                        Query
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 200}]}>
                        Response
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        Resolved
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        Query Raised Date
                      </Text>
                      <Text
                        style={[
                          styles.tableHeaderText,
                          {width: 140, borderRightWidth: 0},
                        ]}>
                        Query Resolved Date
                      </Text>
                    </View>

                    {gerEnqueryLinesArray().length > 0 ? (
                      <View>
                        {gerEnqueryLinesArray().map((line, index) => (
                          <View key={line.id} style={styles.tableRow}>
                            <Text style={[styles.tableCellText, {width: 50}]}>
                              {index + 1}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 100}]}>
                              {line.query || 'N/A'}
                            </Text>
                            <Text
                              style={[styles.tableCellText, {width: 200}]}
                              numberOfLines={2}>
                              {line.response || 'N/A'}
                            </Text>
                            <View style={[styles.tableCellText, {width: 140}]}>
                              <Text
                                style={[
                                  {
                                    paddingVertical: 5,
                                    backgroundColor: COLORS.GREEN,
                                    borderRadius: 10,
                                    textAlign: 'center',
                                    color: COLORS.white,
                                    // alignSelf: 'center',
                                  },
                                ]}>
                                {line?.resolved === true
                                  ? 'Active'
                                  : 'Inactive'}
                              </Text>
                            </View>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {line.query_raised_date || 'N/A'}
                            </Text>
                            <Text
                              style={[
                                styles.tableCellText,
                                {width: 140, borderRightWidth: 0},
                              ]}>
                              {line.query_resolved_date || '-'}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.emptyState}>
                        <Icon name="note-text-outline" size={48} color="#CCC" />
                        <Text style={styles.emptyStateText}>
                          No remarks yet
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            )}
            {active === 'remarks' && (
              <View style={styles.tableContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderText, {width: 50}]}>
                        #
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 100}]}>
                        {route?.params?.title === 'Quotation'
                          ? 'Query'
                          : 'Date'}
                        {/* Date */}
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 200}]}>
                        Remarks
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        User
                      </Text>
                      <Text
                        style={[
                          styles.tableHeaderText,
                          {width: 140, borderRightWidth: 0},
                        ]}>
                        Reply To
                      </Text>
                    </View>

                    {getRemarksLinesArray().length > 0 ? (
                      <View>
                        {getRemarksLinesArray().map((line, index) => (
                          <View key={line.id} style={styles.tableRow}>
                            <Text style={[styles.tableCellText, {width: 50}]}>
                              {index + 1}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 100}]}>
                              {line.date || 'N/A'}
                            </Text>
                            <Text
                              style={[styles.tableCellText, {width: 200}]}
                              numberOfLines={2}>
                              {line.remarks || 'N/A'}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {line.user || 'N/A'}
                            </Text>
                            
                            <Text
                              style={[
                                styles.tableCellText,
                                {width: 140, borderRightWidth: 0},
                              ]}>
                              {Array.isArray(line.reply_to) &&
                              line.reply_to.length > 0
                                ? line.reply_to
                                    .map(item => item?.name || '')
                                    .join(', ')
                                : '-'}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.emptyState}>
                        <Icon name="note-text-outline" size={48} color="#CCC" />
                        <Text style={styles.emptyStateText}>
                          No remarks yet
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            )}
            {active === 'remarks1' && (
              <View style={styles.tableContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderText, {width: 50}]}>
                        #
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 100}]}>
                        Query
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 200}]}>
                        Responce
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        Resolved
                      </Text>
                    </View>

                    {getRemarksLinesArray().length > 0 ? (
                      <View>
                        {getRemarksLinesArray().map((line, index) => (
                          <View key={line.id} style={styles.tableRow}>
                            <Text style={[styles.tableCellText, {width: 50}]}>
                              {index + 1}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 100}]}>
                              {line.question || 'N/A'}
                            </Text>

                            <Text style={[styles.tableCellText, {width: 200}]}>
                              {line.answer || '-'}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {line.solution == true ? 'Active' : 'Deactive'}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.emptyState}>
                        <Icon name="note-text-outline" size={48} color="#CCC" />
                        <Text style={styles.emptyStateText}>
                          No remarks yet
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            )}
            {active === 'othercharges' && (
              <View style={styles.tableContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderText, {width: 50}]}>
                        #
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 100}]}>
                        Parameter
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 200}]}>
                        Type
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        Amount Type
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        value
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        Total Amount
                      </Text>
                    </View>

                    {getOtherChargesArray().length > 0 ? (
                      <View>
                        {getOtherChargesArray().map((line, index) => (
                          <View key={line.id} style={styles.tableRow}>
                            <Text style={[styles.tableCellText, {width: 50}]}>
                              {index + 1}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 100}]}>
                              {line.parameter_name || ''}
                            </Text>
                            <Text
                              style={[styles.tableCellText, {width: 200}]}
                              numberOfLines={2}>
                              {line.other_type || ''}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {line.amount_type || ' '}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {String(line.amount) || ''}
                            </Text>
                            <Text
                              style={[
                                styles.tableCellText,
                                {width: 140, borderRightWidth: 0},
                              ]}>
                              {String(line.total_other_amount) || '-'}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.emptyState}>
                        <Icon name="note-text-outline" size={48} color="#CCC" />
                        <Text style={styles.emptyStateText}>
                          No remarks yet
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            )}
            {active === 'planeofaction' && (
              <View style={styles.tableContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderText, {width: 100}]}>
                        Due Date
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 100}]}>
                        Activity
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 200}]}>
                        summary
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        attandees
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        conclusion
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        Reminder Date
                      </Text>
                    </View>

                    {gerPlaneofactionLinesArray().length > 0 ? (
                      <View>
                        {gerPlaneofactionLinesArray().map((line, index) => (
                          <View key={line.id} style={styles.tableRow}>
                            <Text style={[styles.tableCellText, {width: 100}]}>
                              {line.due_date || ''}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 100}]}>
                              {line.activity_name || ''}
                            </Text>
                            <Text
                              style={[styles.tableCellText, {width: 200}]}
                              numberOfLines={2}>
                              {line.summary || ''}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {Array.isArray(line.attendees) &&
                              line.attendees.length > 0
                                ? line.attendees
                                    .map(a => Object.values(a)[1])
                                    .join(', ')
                                : '-'}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {line.conclusion || '-'}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {/* {line.reminder_date || '-'} */}
                              {line.reminder_date || ''}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.emptyState}>
                        <Icon name="note-text-outline" size={48} color="#CCC" />
                        <Text style={styles.emptyStateText}>
                          No remarks yet
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            )}
            {active === 'enquirylines' && (
              <View style={styles.tableContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderText, {width: 50}]}>
                        #
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 100}]}>
                        Budgetary Enquiry
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 200}]}>
                        Products
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        Description
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        Enquired Qty
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        Unit Of Measure
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        Customer Code
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        Description specs
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        Last SO Details
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        Costing Qty
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        Ignore Variation
                      </Text>
                      <Text style={[styles.tableHeaderText, {width: 140}]}>
                        Costing Price
                      </Text>
                      <Text
                        style={[
                          styles.tableHeaderText,
                          {width: 140, borderRightWidth: 0},
                        ]}>
                        Enquiry Status
                      </Text>
                    </View>

                    {getQueryLinesArray().length > 0 ? (
                      <View>
                        {getQueryLinesArray().map((line, index) => (
                          <View key={line.id} style={styles.tableRow}>
                            <Text style={[styles.tableCellText, {width: 50}]}>
                              {index + 1}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 100}]}>
                              {line.query || '-'}
                            </Text>
                            <Text
                              style={[styles.tableCellText, {width: 200}]}
                              numberOfLines={2}>
                              {line?.product_code
                                ? `[${line.product_code}] ${
                                    line?.product_name || '-'
                                  }`
                                : line?.product_name || '-'}
                            </Text>

                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {line.description || '-'}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {line.product_uom_qty || '-'}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {line.product_uom_name || ''}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {String(line.customer_code) || ''}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {line.customer_specific_description_enquiry ||
                                'N/A'}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {line.last_so_date || '-'}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {line.costing_qty || ' '}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {line.ignore_variation || ' '}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 140}]}>
                              {line.costing_price || ' '}
                            </Text>
                            <Text
                              style={[
                                styles.tableCellText,
                                {width: 140, borderRightWidth: 0},
                              ]}>
                              {line.enq_status || '-'}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.emptyState}>
                        <Icon name="note-text-outline" size={48} color="#CCC" />
                        <Text style={styles.emptyStateText}>
                          No remarks yet
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            )}
            {active === 'termandcondition' && (
              <View style={styles.tableContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.tableHeaderText, {width: 50}]}>
                        #
                      </Text>

                      <Text style={[styles.tableHeaderText, {width: 170}]}>
                        {route?.params?.title === 'Quotation'
                          ? 'Term and Condition'
                          : ' Parameter Name'}
                      </Text>
                      <Text
                        style={[
                          styles.tableHeaderText,
                          {width: 140, borderRightWidth: 0},
                        ]}>
                        Description
                      </Text>
                    </View>

                    {gerTermandconditionLinesArray().length > 0 ? (
                      <View>
                        {gerTermandconditionLinesArray().map((line, index) => (
                          <View key={line.id} style={styles.tableRow}>
                            <Text style={[styles.tableCellText, {width: 50}]}>
                              {index + 1}
                            </Text>
                            <Text style={[styles.tableCellText, {width: 170}]}>
                              {line.parameter_name ||
                                line?.term_and_condition_name ||
                                ''}
                            </Text>
                            <Text
                              style={[styles.tableCellText, {width: 140}]}
                              numberOfLines={2}>
                              {line.description ||
                                line?.term_condition_remarks ||
                                'N/A'}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.emptyState}>
                        <Icon name="note-text-outline" size={48} color="#CCC" />
                        <Text style={styles.emptyStateText}>
                          No remarks yet
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            )}
            {active === 'otherinformation' && (
              <View>
                {/* <Text style={{...styles.totalLabel}}>
                  Contact Person: {leadData?.contact_person_name}
                </Text> */}
                <InfoRow
                  label="Contact Person:"
                  value={leadData?.contact_person_name}
                  // onPress={handleEmailPress}
                  // icon="email"
                />
                <InfoRow
                  label="Contact Person Phone:"
                  value={leadData?.contact_person_phone}
                  // onPress={handleEmailPress}
                  // icon="email"
                />
                <InfoRow
                  label="Contact Person Phone:"
                  value={leadData?.contact_person_email}
                  // onPress={handleEmailPress}
                  // icon="email"
                />
                <InfoRow
                  label="Bank Account:"
                  value={leadData?.bank_account_name}
                  // onPress={handleEmailPress}
                  // icon="email"
                />
              </View>
            )}
            {active === 'contactinformation' && (
              <View>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <InfoRow
                  label="Prospect Name"
                  value={
                    leadData?.partner_name ||
                    // leadData.account_holder
                    //   ? leadData.account_holder
                    //   : leadData.account_holder_name
                    ''
                  }
                />
                <InfoRow
                  label=" Address"
                  value={[
                    leadData?.contact_information?.selectedStateName,
                    leadData?.contact_information?.street,
                    leadData?.contact_information?.city,
                    leadData?.contact_information?.selectedCountryName,
                  ]
                    .filter(item => item && item !== 'false')
                    .join(', ')}
                />
                <InfoRow
                  label="Contact Name"
                  value={
                    leadData?.contact_information?.contactName ||
                    //   ? leadData.account_holder
                    //   : leadData.account_holder_name
                    ''
                  }
                />
                <Text></Text>
                <InfoRow
                  label="Job Position"
                  value={
                    leadData?.contact_information?.jobPosition ||
                    // leadData.account_holder
                    //   ? leadData.account_holder
                    //   : leadData.account_holder_name
                    ''
                  }
                />
                <InfoRow
                  label="Mobile"
                  value={
                    leadData?.contact_information?.mobile ||
                    // leadData.account_holder
                    //   ? leadData.account_holder
                    //   : leadData.account_holder_name
                    ''
                  }
                />
                <Text style={styles.infoRow}>Marketing</Text>
                <InfoRow
                  label="Campaign"
                  value={
                    leadData?.contact_information?.campaignName ||
                    // leadData.account_holder
                    //   ? leadData.account_holder
                    //   : leadData.account_holder_name
                    ''
                  }
                />
                <InfoRow
                  label="Medium"
                  value={
                    leadData?.contact_information?.mediumName ||
                    // leadData.account_holder
                    //   ? leadData.account_holder
                    //   : leadData.account_holder_name
                    ''
                  }
                />

                <InfoRow
                  label="Source"
                  value={
                    leadData?.contact_information?.sourceName ||
                    // leadData.account_holder
                    //   ? leadData.account_holder
                    //   : leadData.account_holder_name
                    ''
                  }
                />
                  <Text style={styles.infoRow}>Misc</Text>
                {/* <InfoRow
                  label="Days to assign"
                  value={
                    String(leadData?.contact_information?.daystoassign) ||
                    // leadData.account_holder
                    //   ? leadData.account_holder
                    //   : leadData.account_holder_name
                    ''
                  }
                /> */}
                {/* <InfoRow
                  label="Days to close"
                  value={
                    String(leadData?.contact_information?.daystoclose) ||
                    // leadData.account_holder
                    //   ? leadData.account_holder
                    //   : leadData.account_holder_name
                    ''
                  }
                /> */}

                <InfoRow
                  label="Referred By"
                  value={
                    leadData?.contact_information?.referredBy ||
                    // leadData.account_holder
                    //   ? leadData.account_holder
                    //   : leadData.account_holder_name
                    ''
                  }
                />
                {/* <InfoRow
            label="Account Holder"
            value={leadData.account_holder_name}
          /> */}
              </View>
            )}
          </View>
        </View>

        <View style={{height: 20}} />
      </ScrollView>
    </View>
  );
};

export default PreviewLeads;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollView: {
    flex: 1,
  },
  actionBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerInfo: {
    flex: 1,
  },
  prospectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    // justifyContent: 'spac',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.5,
  },
  value: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
  },
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  icon: {
    marginRight: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1.5,
    justifyContent: 'flex-end',
  },
  tag: {
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B3D9FF',
  },
  tagText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  tabContent: {
    minHeight: 150,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tableCellText: {
    fontSize: 12,
    color: '#333',
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  iconWithBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -15,
    right: -10,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2E7D32', // Green color for amounts
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'capitalize',
  },

  confirmedBadge: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },

  pendingBadge: {
    backgroundColor: '#FFF3E0',
    color: '#EF6C00',
  },

  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 10,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 20,
    fontStyle: 'italic',
  },
});
//// Bug ID 2822 End Jamshed
