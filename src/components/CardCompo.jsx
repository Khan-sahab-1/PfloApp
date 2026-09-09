// import React from 'react';
// import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {COLORS} from '../styles/Colors';
// import {useSelector} from 'react-redux';
// import {useNavigation} from '@react-navigation/native';
// import navigationString from '../route/navigationString';

// const CardCompo = ({
//   item,
//   onStatusPress,
//   onEditPress,
//   enquery,
//   onConverttoEnquery,
//   title,
// }) => {
//   const user = useSelector(state => state.user.userDatainfo);
//   const navigation = useNavigation();
//   // console.log(title, 'ResUSERUSERUSER');

//   return (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() =>
//         navigation.navigate(navigationString.PREVIEWLEADS, {
//           item: item,
//           onEditPress: onEditPress,
//           onStatusPress: onStatusPress,
//           onConverttoEnquery: onConverttoEnquery,
//           title: title,
//           enquery: enquery,
//         })
//       }>
//       {/* Card Content */}
//       <View style={styles.cardContent}>
//         {/* Info Section */}
//         <View style={styles.infoWrapper}>
//          {item.enquiry_number ? (
//   <Text style={styles.name}>Enquiry Number: {item.enquiry_number}</Text>
// ) : item.customer ? (
//   <Text style={styles.name}>Customer Name: {item.customer}</Text>
// ) : (
//   <Text style={styles.name}>Name: {item.name}</Text>
// )}

//           {item.customer_name && (
//             <Text style={styles.info}>Customer Name: {item.customer_name}</Text>
//           )}
//           {item.lead_id && (
//             <Text style={styles.info}>Lead Number: {item.lead_id}</Text>
//           )}
//           {item.phone && <Text style={styles.info}>Phone: {item.phone}</Text>}
//           {item.email && <Text style={styles.info}>Email: {item.email}</Text>}
//           {item.division && (
//             <Text style={styles.info}>Division: {item.division}</Text>
//           )}
//           {item.sale_person && (
//             <Text style={styles.info}>Sales Person: {item.sale_person}</Text>
//           )}
//           {item.assign_to && (
//             <Text style={styles.info}>Assign_to Person: {item.assign_to}</Text>
//           )}
//           {item.assign_to_name && (
//             <Text style={styles.info}>
//               Assign_to Person: {item.assign_to_name}
//             </Text>
//           )}
//           {item.stages && (
//             <Text style={styles.info}>Stages: {item.stages}</Text>
//           )}
//           {item.country_name && item.state_name && item.street && (
//             <Text style={styles.info}>
//               Address: {item.country_name}, {item.state_name}, {item.street}
//             </Text>
//           )}
//           {item.enquiry_date && (
//             <Text style={styles.info}>Enquiry Date: {item.enquiry_date}</Text>
//           )}

//           {item.status && (
//             <Text style={styles.info}>Enquiry Status: {item.status}</Text>
//           )}
//           {item.enquiry_type && (
//             <Text style={styles.info}>Enquiry type: {item.enquiry_type}</Text>
//           )}
//           {item.employee_division_name && (
//             <Text style={styles.info}>
//               Employee division: {item.employee_division_name}
//             </Text>
//           )}
//           {Array.isArray(item.visible_to) && item.visible_to.length > 0 && (
//             <Text style={styles.info}>
//               Visible To Users: {item.visible_to.map(v => v.name).join(', ')}
//             </Text>
//           )}
//         </View>

//         {/* Edit Icon */}
//         {/* {!item.visible_to?.some(v => v.emp_code === user.result.emp_code) && (
//           <View style={styles.iconWrapper}>
//             <TouchableOpacity onPress={onEditPress}>
//               <FontAwesome5 name="edit" size={25} color="#000" />
//               <Text style={styles.editText}>Edit</Text>
//             </TouchableOpacity>
//           </View>
//         )} */}
//       </View>

//       {/* Action Buttons */}
//       {!item.visible_to?.some(v => v.emp_code === user.result.emp_code) && item?.stages !=='Mark Lost' &&(
//         <View style={styles.actionsContainer}>
//           { title==='Leads' &&(
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={onConverttoEnquery}>
//               <FontAwesome5 name="bacon" size={16} color="#fff" />
//               <Text style={styles.actionText}>Convert To Opportunity</Text>
//             </TouchableOpacity>
//           )}
//           {title !== 'Enquiry' && item?.stages !=='Mark Lost' && (
//             <TouchableOpacity
//               style={[styles.actionButton, styles.statusButton]}
//               onPress={onStatusPress}>
//               <MaterialIcons name="change-circle" size={20} color="#fff" />
//               <Text style={styles.actionText}>Change Stage</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#fff',
//     padding: 15,
//     margin: 8,
//     borderRadius: 12,
//     elevation: 2,
//   },
//   cardContent: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     justifyContent: 'space-between',
//     flexWrap: 'wrap',
//   },
//   infoWrapper: {
//     flex: 1,
//     paddingRight: 10,
//   },
//   iconWrapper: {
//     alignSelf: 'flex-start',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: 10,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 5,
//     color: COLORS.black,
//   },
//   info: {
//     fontSize: 14,
//     color: COLORS.black,
//     fontWeight: '500',
//   },
//   editText: {
//     fontSize: 14,
//     color: COLORS.black,
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   actionsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     gap: 10,
//     marginTop: 10,
//     flexWrap: 'wrap',
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.primary || '#007bff',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginRight: 10,
//     marginTop: 5,
//   },
//   statusButton: {
//     backgroundColor: COLORS.black,
//   },
//   actionText: {
//     color: '#fff',
//     fontSize: 14,
//     marginLeft: 6,
//   },
// });

// export default CardCompo;
// //bug id 2822 Jamshed end

// bug id 2822 Jamshed end — UI Redesigned
// Description: Redesigned the card component to display lead/enquiry information in a more structured and visually appealing way, including stage badges, improved layout, and action buttons for editing and status changes. The component also includes entry animations and adapts to light/dark themes.

import React, {useRef, useEffect} from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import navigationString from '../route/navigationString';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const LIGHT = {
  bg: '#FFFFFF',
  surface: '#F7F6F2',
  ink: '#0D0D14',
  ink2: '#3A3A52',
  muted: '#9090A8',
  border: 'rgba(0,0,0,0.07)',
  accent: '#4F46E5',
  accentSoft: '#EEF2FF',
  green: '#16A34A',
  greenSoft: '#DCFCE7',
  dark: '#0D0D14',
  darkSoft: '#F3F4F6',
};
const DARK = {
  bg: '#1A1A26',
  surface: '#22223A',
  ink: '#F0F0FF',
  ink2: '#C0C0D8',
  muted: '#6060A0',
  border: 'rgba(255,255,255,0.08)',
  accent: '#6366F1',
  accentSoft: '#1E1B4B',
  green: '#22C55E',
  greenSoft: '#052E16',
  dark: '#F0F0FF',
  darkSoft: '#2A2A3E',
};

// ─── Stage color map ──────────────────────────────────────────────────────────
const STAGE_META = {
  New: {color: '#4F46E5', bg: '#EEF2FF', icon: 'sparkles'},
  Contacted: {color: '#0891B2', bg: '#E0F2FE', icon: 'chatbubble-ellipses'},
  Qualified: {color: '#D97706', bg: '#FEF3C7', icon: 'checkmark-circle'},
  Proposal: {color: '#7C3AED', bg: '#F5F3FF', icon: 'document-text'},
  Won: {color: '#16A34A', bg: '#DCFCE7', icon: 'trophy'},
  Lost: {color: '#DC2626', bg: '#FEE2E2', icon: 'close-circle'},
  'Mark Lost': {color: '#DC2626', bg: '#FEE2E2', icon: 'close-circle'},
};
const getStageMeta = stage =>
  STAGE_META[stage] || {color: '#9090A8', bg: '#F3F4F6', icon: 'ellipse'};

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = ({icon, label, value, C}) => {
  if (!value) return null;
  return (
    <View style={infoStyles.row}>
      <Ionicons name={icon} size={13} color={C.muted} style={infoStyles.icon} />
      <Text style={[infoStyles.label, {color: C.muted}]}>{label}: </Text>
      <Text style={[infoStyles.value, {color: C.ink2}]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
};
const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    flexShrink: 1,
  },
  icon: {marginRight: 5, flexShrink: 0},
  label: {fontSize: 12, fontWeight: '600', flexShrink: 0},
  value: {fontSize: 12, fontWeight: '400', flex: 1},
});

// ─── Action Button ────────────────────────────────────────────────────────────
const ActionBtn = ({iconName, iconLib, label, bg, color, onPress}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 200,
    }).start();
  const onPressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
    }).start();

  const Icon =
    iconLib === 'MaterialIcons'
      ? MaterialIcons
      : iconLib === 'FontAwesome5'
      ? FontAwesome5
      : Ionicons;

  return (
    <Animated.View style={{transform: [{scale}], flex: 1}}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={[btnStyles.btn, {backgroundColor: bg}]}>
        <Icon name={iconName} size={14} color={color} />
        <Text style={[btnStyles.label, {color}]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
const btnStyles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 36,
    borderRadius: 10,
  },
  label: {fontSize: 12, fontWeight: '700'},
});


// ─── MAIN CARD ────────────────────────────────────────────────────────────────
const CardCompo = ({
  item,
  onStatusPress,
  onEditPress,
  enquery,
  onConverttoEnquery,
  title,
  model,
}) => {
  const user = useSelector(state => state.user.userDatainfo);
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const C = isDark ? DARK : LIGHT;
 
  

  // entry animation
  const translateY = useRef(new Animated.Value(16)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // press scale
  const cardScale = useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.spring(cardScale, {
      toValue: 0.985,
      useNativeDriver: true,
      tension: 200,
    }).start();
  const onPressOut = () =>
    Animated.spring(cardScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
    }).start();

  // Derived
  const stageName =
    typeof item.stages === 'string' ? item.stages : item.stages?.name || '';
  const stageMeta = getStageMeta(stageName);

  const isMarkedLost = stageName === 'Mark Lost';
  const isVisible = item.visible_to?.some(
    v => v.emp_code === user?.result?.emp_code,
  );

  const primaryLabel = item.enquiry_number
    ? `#${item.enquiry_number}`
    : item.customer
    ? item.customer
    : item.name || '—';

  const primarySub = item.enquiry_number
    ? 'Enquiry'
    : item.customer
    ? 'Customer'
    : 'Lead';

  const visibleToText =
    Array.isArray(item.visible_to) && item.visible_to.length > 0
      ? item.visible_to.map(v => v.name).join(', ')
      : null;

  return (
    <Animated.View
      style={[{transform: [{translateY}, {scale: cardScale}], opacity}]}>
      <TouchableWithoutFeedback
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() =>
          navigation.navigate(navigationString.PREVIEWLEADS, {
            item,
            onEditPress,
            onStatusPress,
            onConverttoEnquery,
            title,
            enquery,
            model,
          })
        }>
        <View
          style={[
            styles.card,
            {
              backgroundColor: C.bg,
              borderLeftColor: stageMeta.color,
              shadowColor: C.ink,
            },
          ]}>
          {/* ── Top Row: Title + Stage Badge ─────────────────────────── */}
          <View style={styles.topRow}>
            {/* Avatar */}
            {/* <View style={[styles.avatar, {backgroundColor: stageMeta.color}]}>
              <Text style={styles.avatarText}>
                {primaryLabel.trim().slice(0, 2).toUpperCase()}
              </Text>
            </View> */}

            {/* Title block */}
            <View style={styles.titleBlock}>
               {item.lead_id ? (
                <Text style={[styles.primaryLabel, {color: C.muted}]}>
                  {primarySub} · {item.lead_id}
                </Text>
              ) : (
                null
              )}
              <Text
                style={[styles.primaryLabel, {color: C.ink}]}
                numberOfLines={1}>
                {primaryLabel}
              </Text>
             
            </View>

            {/* Stage badge */}
            {stageName ? (
              <View
                style={[styles.stageBadge, {backgroundColor: stageMeta.bg}]}>
                <Ionicons
                  name={`${stageMeta.icon}-outline`}
                  size={11}
                  color={stageMeta.color}
                />
                <Text style={[styles.stageBadgeText, {color: stageMeta.color}]}>
                  {stageName}
                </Text>
              </View>
            ) : null}
          </View>

          {/* ── Divider ──────────────────────────────────────────────── */}
          <View style={[styles.divider, {backgroundColor: C.border}]} />

          {/* ── Info Grid ────────────────────────────────────────────── */}
          <View style={styles.infoGrid}>
            <InfoRow
              icon="call-outline"
              label="Phone"
              value={item.phone}
              C={C}
            />
            <InfoRow
              icon="mail-outline"
              label="Email"
              value={item.email}
              C={C}
            />
            <InfoRow
              icon="person-outline"
              label="Customer"
              value={item.customer_name}
              C={C}
            />
            <InfoRow
              icon="person-circle-outline"
              label="Salesperson"
              value={item.sale_person}
              C={C}
            />
            <InfoRow
              icon="people-outline"
              label="Assigned To"
              value={item.assign_to || item.assign_to_name}
              C={C}
            />
            <InfoRow
              icon="business-outline"
              label="Division"
              value={item.division}
              C={C}
            />
            <InfoRow
              icon="person-outline"
              label="Customer"
              value={item.customer}
              C={C}
            />
            <InfoRow
              icon="person-outline"
              label="Account Holder"
              value={item.account_holder_saleperson_name}
              C={C}
            />
            <InfoRow
              icon="layers-outline"
              label="Emp Division"
              value={item.employee_division_name}
              C={C}
            />
            <InfoRow
              icon="calendar-outline"
              label="Enq. Date"
              value={item.enquiry_date}
              C={C}
            />
            <InfoRow
              icon="flag-outline"
              label="Enq. Status"
              value={item.status}
              C={C}
            />
            <InfoRow
              icon="help-circle-outline"
              label="Enq. Type"
              value={item.enquiry_type}
              C={C}
            />
            <InfoRow
              icon="help-circle-outline"
              label="Total"
              value={item.amount_total}
              C={C}
            />
            {item.country_name && item.state_name && item.street && (
              <InfoRow
                icon="location-outline"
                label="Address"
                value={`${item.street}, ${item.street2}, ${item.state_name}, ${item.country_name},${item.zip}`}
                C={C}
              />
            )}
            {visibleToText && (
              <InfoRow
                icon="eye-outline"
                label="Visible To"
                value={visibleToText}
                C={C}
              />
            )}
          </View>

          {(!item?.visible_to?.some(
            v => v.emp_code === user?.result?.emp_code,
          ) ||
            item?.created_by === user?.result?.emp_code ||
            item?.sale_person_id === user?.result?.res_user) &&
            !isMarkedLost && (
              <>
                <View style={[styles.divider, {backgroundColor: C.border}]} />
                <View style={styles.actions}>
                  {title === 'Leads' && (
                    <ActionBtn
                      iconName="git-merge-outline"
                      iconLib="Ionicons"
                      label="Convert"
                      bg={C.greenSoft}
                      color={C.green}
                      onPress={onConverttoEnquery}
                    />
                  )}
                  {title !== 'Enquiry' && (
                    <ActionBtn
                      iconName="swap-vertical-outline"
                      iconLib="Ionicons"
                      label="Change Stage"
                      bg={C.accentSoft}
                      color={C.accent}
                      onPress={onStatusPress}
                    />
                  )}
                  <ActionBtn
                    iconName="create-outline"
                    iconLib="Ionicons"
                    label="Edit"
                    bg={C.darkSoft}
                    color={C.ink2}
                    onPress={onEditPress}
                  />
                </View>
              </>
            )}
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export default CardCompo;

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginVertical: 6,
    borderRadius: 18,
    borderLeftWidth: 4,
    padding: 14,
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {elevation: 3},
    }),
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  titleBlock: {flex: 1, minWidth: 0},
  primaryLabel: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subLabel: {fontSize: 11, marginTop: 2},

  stageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 50,
    flexShrink: 0,
  },
  stageBadgeText: {fontSize: 10, fontWeight: '700'},

  // Divider
  divider: {height: 1, marginVertical: 10},

  // Info
  infoGrid: {gap: 0},

  // Actions
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
});
//bug id 2822 Jamshed end — UI Redesigned
