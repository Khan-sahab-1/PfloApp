import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { AuthContext } from './Context';
import urls from '../../url';
import makeApiCall from '../utils/apiHelper';
import HeaderCompo from '../components/HeaderCompo';
import Loader from '../components/Loader';
import { showFlashMessage } from '../utils/fleshmessage';
import { useSelector } from 'react-redux';
import { COLORS } from '../styles/Colors';
import MultiselectorDropDown from '../components/MultiselectorDropDown';
import Remark from '../components/Modaals/Remark';
import navigationString from '../route/navigationString';
import CalendarInput from '../components/CalendarInput';
import { Dropdown } from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';

// ─── Theme & Design Tokens ────────────────────────────────────────────────────
const PALETTE = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#EFF6FF',
  primaryBorder: '#BFDBFE',
  accent: '#0EA5E9',
  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
  purple: '#8B5CF6',
  purpleLight: '#F5F3FF',

  light: {
    bg: '#F8FAFC',
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',
    headerText: '#0F172A',
    bodyText: '#334155',
    subText: '#64748B',
    mutedText: '#94A3B8',
    inputBg: '#FFFFFF',
    inputBorder: '#E2E8F0',
    inputFocusBorder: '#2563EB',
    inputText: '#0F172A',
    placeholder: '#94A3B8',
    iconColor: '#64748B',
    divider: '#F1F5F9',
    badgeBg: '#F1F5F9',
  },

  dark: {
    bg: '#0B0F19',
    card: '#161F30',
    cardBorder: '#232F46',
    headerText: '#F8FAFC',
    bodyText: '#E2E8F0',
    subText: '#94A3B8',
    mutedText: '#64748B',
    inputBg: '#1B263B',
    inputBorder: '#2E3E5B',
    inputFocusBorder: '#3B82F6',
    inputText: '#F8FAFC',
    placeholder: '#64748B',
    iconColor: '#94A3B8',
    divider: '#202C42',
    badgeBg: '#202C42',
  },
};

// ─── UI Helper Components ─────────────────────────────────────────────────────

/** Section Card with Header Icon Badge and Title */
const SectionCard = ({
  icon,
  iconBg = PALETTE.primary,
  title,
  subtitle,
  children,
  theme,
  style,
}) => (
  <View
    style={[
      styles.card,
      {
        backgroundColor: theme.card,
        borderColor: theme.cardBorder,
      },
      style,
    ]}>
    <View style={styles.cardHeader}>
      <View style={[styles.cardHeaderIconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color="#FFFFFF" />
      </View>
      <View style={styles.cardHeaderTextWrap}>
        <Text style={[styles.cardTitle, { color: theme.headerText }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.cardSubtitle, { color: theme.subText }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
    <View style={[styles.cardDivider, { backgroundColor: theme.divider }]} />
    <View style={styles.cardContent}>{children}</View>
  </View>
);

/** Field Label with Required Star */
const FieldLabel = ({ text, required = false, theme, style }) => (
  <View style={[styles.labelRow, style]}>
    <Text style={[styles.labelText, { color: theme.bodyText }]}>{text}</Text>
    {required && <Text style={styles.requiredStar}> *</Text>}
  </View>
);

/** Standard Text Input with Left Icon Support */
const CustomTextInput = ({
  icon,
  prefix,
  suffix,
  theme,
  style,
  inputStyle,
  multiline,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.inputWrapper,
        {
          backgroundColor: theme.inputBg,
          borderColor: isFocused ? theme.inputFocusBorder : theme.inputBorder,
        },
        multiline && styles.inputWrapperMultiline,
        style,
      ]}>
      {icon && (
        <Ionicons
          name={icon}
          size={18}
          color={isFocused ? PALETTE.primary : theme.iconColor}
          style={styles.inputLeftIcon}
        />
      )}
      {prefix && (
        <Text style={[styles.inputPrefix, { color: theme.subText }]}>
          {prefix}
        </Text>
      )}
      <TextInput
        style={[
          styles.textInput,
          { color: theme.inputText },
          multiline && styles.textInputMultiline,
          inputStyle,
        ]}
        placeholderTextColor={theme.placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={multiline}
        {...props}
      />
      {suffix && (
        <Text style={[styles.inputSuffix, { color: theme.subText }]}>
          {suffix}
        </Text>
      )}
    </View>
  );
};

/** Unified Dropdown Component */
const AppDropdown = ({
  data = [],
  value,
  onChange,
  placeholder,
  icon,
  theme,
  isDark,
  search = true,
  labelField = 'label',
  valueField = 'value',
  style,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Dropdown
      style={[
        styles.dropdownStyle,
        {
          backgroundColor: theme.inputBg,
          borderColor: isFocused ? theme.inputFocusBorder : theme.inputBorder,
        },
        disabled && styles.disabledInput,
        style,
      ]}
      placeholderStyle={[
        styles.dropdownPlaceholder,
        { color: theme.placeholder },
      ]}
      selectedTextStyle={[
        styles.dropdownSelectedText,
        { color: theme.inputText },
      ]}
      inputSearchStyle={[
        styles.dropdownSearchInput,
        {
          color: theme.inputText,
          backgroundColor: isDark ? '#1F293D' : '#F1F5F9',
          borderColor: theme.inputBorder,
        },
      ]}
      containerStyle={[
        styles.dropdownListContainer,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
        },
      ]}
      itemTextStyle={{
        color: isDark ? '#F8FAFC' : '#1E293B',
        fontSize: 14,
        fontWeight: '500',
      }}
      itemContainerStyle={{
        backgroundColor: theme.card,
      }}
      activeColor={isDark ? '#26344F' : '#EFF6FF'}
      data={data}
      search={search}
      maxHeight={280}
      labelField={labelField}
      valueField={valueField}
      placeholder={placeholder}
      searchPlaceholder={`Search ${placeholder.toLowerCase()}...`}
      value={value}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onChange={onChange}
      disable={disabled}
      renderLeftIcon={() =>
        icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={isFocused ? PALETTE.primary : theme.iconColor}
            style={styles.dropdownLeftIcon}
          />
        ) : null
      }
      renderRightIcon={() => (
        <Ionicons
          name="chevron-down"
          size={18}
          color={theme.iconColor}
          style={{ marginRight: 4 }}
        />
      )}
    />
  );
};

/** Interactive Priority Selector */
const PrioritySelector = ({ value, onChange, theme }) => {
  const options = [
    { level: 0, label: 'None', color: '#94A3B8', bg: '#F1F5F9' },
    { level: 1, label: 'Low', color: '#10B981', bg: '#ECFDF5' },
    { level: 2, label: 'Med', color: '#F59E0B', bg: '#FFFBEB' },
    { level: 3, label: 'High', color: '#EF4444', bg: '#FEF2F2' },
  ];

  return (
    <View style={styles.priorityRow}>
      {options.map(opt => {
        const isSelected = value === opt.level;
        return (
          <TouchableOpacity
            key={opt.level}
            activeOpacity={0.75}
            onPress={() => onChange(opt.level)}
            style={[
              styles.priorityPill,
              {
                backgroundColor: isSelected ? opt.color : theme.badgeBg,
                borderColor: isSelected ? opt.color : theme.inputBorder,
              },
            ]}>
            {opt.level > 0 && (
              <Ionicons
                name="star"
                size={14}
                color={isSelected ? '#FFFFFF' : opt.color}
                style={{ marginRight: 4 }}
              />
            )}
            <Text
              style={[
                styles.priorityPillText,
                { color: isSelected ? '#FFFFFF' : theme.bodyText },
              ]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const OpportunityForm = ({ route, navigation }) => {
  const employeeCode = route?.params?.employeeCode || '';
  const user = useSelector(state => state.user.userDatainfo);

  // Form state
  const [opportunityName, setOpportunityName] = useState('');
  const [prospectName, setProspectName] = useState('');
  const [expectedRevenue, setExpectedRevenue] = useState('');
  const [probability, setProbability] = useState('10');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [remark, setRemark] = useState('');
  const [priority, setPriority] = useState(0);
  const [tabinternal, settabinternal] = useState('');
  const [showInternalNotes, setShowInternalNotes] = useState(false);

  // Dropdown / list state
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [selectedDivisionId, setSelectedDivisionId] = useState(null);

  const [salesPersons, setSalesPersons] = useState([]);
  const [salesPersonId, setSalesPersonId] = useState(null);
  const [selectedSalesPersonLabel, setSelectedSalesPersonLabel] = useState('');

  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const [assignToData, setAssignToData] = useState([]);
  const [assignToId, setAssignToId] = useState(null);

  const [visibleToData, setVisibleToData] = useState([]);
  const [visibleToId, setVisibleToId] = useState([]);

  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountHolderId, setAccountHolderId] = useState(null);
  const [selectedAccountHolder, setSelectedAccountHolder] = useState(null);

  const [loading, setLoading] = useState(false);
  const [openRemarkModal, setOpenRemarkModal] = useState(false);
  const [extraInfoData, setExtraInfoData] = useState({});
  const [tabremarks, settabremarks] = useState({});
  const [taglist, settaglist] = useState([]);
  const [selectdetaglist, setselectedtaglist] = useState(null);
  const [querycloseddate, setquerycloseddate] = useState('');
  const [salesChannels, setSalesChannels] = useState([]);
  const [selectedSalesChannel, setSelectedSalesChannel] = useState(null);

  const is_multidivision = route?.params?.is_multidivision || false;
  const resUser =
    route?.params?.resUser?.res_user ||
    route?.params?.resUser ||
    user?.result?.res_user ||
    '';

  const contextType = useContext(AuthContext);
  const server_origin = contextType?.currentUrl || '';
  const createOpportunityUrl = server_origin + urls.createOpportunity;
  const fetchDivisionUrl = server_origin + urls.fetchOpportunityDivision;
  const salesPersonsUrl = server_origin + urls.fetchLeadSalePerson;
  const fetchsaleschannels = server_origin + urls.fetchsaleschannels;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? PALETTE.dark : PALETTE.light;

  // ─── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchDivisionData();
    fetchVisibleToData();
    fetchTagInfo();
    fetchSalesChannels();
  }, []);

  useEffect(() => {
    if (selectedDivisionId) {
      fetchSalesPersons(selectedDivisionId);
      fetchAssignTo(selectedDivisionId);
    }
  }, [selectedDivisionId]);

  useEffect(() => {
    if (!salesPersons?.length) return;
    const options = salesPersons.map(p => ({
      label: p.person_name?.trim(),
      value: String(p.person_id),
    }));
    if (resUser) {
      const matched = options.find(p => String(p.value) === String(resUser));
      if (matched) {
        setSelectedSalesPersonLabel(matched.label);
        setSalesPersonId(matched.value);
        fetchCustomersData(matched.value);
      }
    }
  }, [salesPersons, resUser]);

  useEffect(() => {
    if (selectedCustomerId && selectedDivisionId) {
      fetchAccountHolder(selectedCustomerId, selectedDivisionId);
    }
  }, [selectedCustomerId, selectedDivisionId]);

  // ─── API Helpers ────────────────────────────────────────────────────────────

  const fetchDivisionData = async () => {
    try {
      const response = await fetch(fetchDivisionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: { resUser },
        }),
      });
      if (!response.ok) throw new Error('Failed to fetch divisions');
      const result = await response.json();
      const opt = (result.result || []).map(div => ({
        label: div.division_name,
        value: div.division_id,
      }));
      setDivisionOptions(opt);
      if (route?.params?.selectedDivisionId) {
        setSelectedDivisionId(route.params.selectedDivisionId);
      }
    } catch (err) {
      console.error('fetchDivisionData error:', err);
      Alert.alert('Error', 'Failed to load divisions.');
    }
  };

  const fetchSalesChannels = useCallback(async () => {
    try {
      const res = await fetch(fetchsaleschannels, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: { resUser },
        }),
      });
      const result = await res.json();
      const formatted = (result?.result || []).map(i => ({
        label: i.channel_name,
        value: i.channel_id,
      }));
      setSalesChannels(formatted);
    } catch (e) {
      console.error('[OppForm] fetchSalesChannels error:', e);
    }
  }, [fetchsaleschannels, resUser]);

  const fetchSalesPersons = async divisionId => {
    try {
      const response = await fetch(salesPersonsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: { division: divisionId, empCode: employeeCode },
        }),
      });
      if (!response.ok) throw new Error('Network response not ok');
      const result = await response.json();
      setSalesPersons(result.result || []);
    } catch (err) {
      console.error('fetchSalesPersons error:', err);
      setSalesPersons([]);
    }
  };

  const fetchCustomersData = async spId => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchcustomerUrl,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: { salesPerson: Number(spId) },
        },
      );
      const list = (response?.result || []).map(item => ({
        label: item.customer_name,
        value: item.customer_id,
      }));
      setCustomers(list);
    } catch (err) {
      console.error('fetchCustomersData error:', err);
      setCustomers([]);
    }
  };

  const fetchAccountHolder = async (customerId, divisionId) => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchAccountHolder,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            selected_customerId: customerId,
            division: parseInt(divisionId, 10),
          },
        },
      );
      if (response?.result?.length > 0) {
        const holderName = response.result[0].account_holder_name;
        const holderId = response.result[0].account_holder_id;
        setAccountHolderName(holderName);
        setAccountHolderId(holderId);
        setSelectedAccountHolder(holderId);
      } else {
        setAccountHolderName('');
        setAccountHolderId(null);
      }
    } catch (err) {
      console.error('fetchAccountHolder error:', err);
    }
  };

  const fetchVisibleToData = async () => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchVisibletodata,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {},
        },
      );
      const list = (response?.result || []).map(i => ({
        label: i.visibleTo_name,
        value: String(i.visibleTo_id),
      }));
      setVisibleToData(list);
    } catch (err) {
      console.error('fetchVisibleToData error:', err);
      setVisibleToData([]);
    }
  };

  const fetchAssignTo = async divisionId => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchassigntodata,
        'POST',
        {
          jsonrpc: '2.0',
          params: { division: divisionId },
        },
      );
      const list = (response?.result || []).map(a => ({
        label: a.assign_name,
        value: String(a.assign_id),
      }));
      setAssignToData(list);
    } catch (err) {
      console.error('fetchAssignTo error:', err);
      setAssignToData([]);
    }
  };

  const fetchTagInfo = async () => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchtagsdata,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: { resUser },
        },
      );
      const tagInfoData = (response?.result || []).map(item => ({
        label: item.tag_name,
        value: item.tag_id,
      }));
      settaglist(tagInfoData);
    } catch (err) {
      console.error('fetchTagInfo error:', err);
    }
  };

  // ─── Memoized Options ───────────────────────────────────────────────────────

  const salesPersonOptions = useMemo(() => {
    return (salesPersons || []).map(p => ({
      label: p.person_name?.trim(),
      value: String(p.person_id),
    }));
  }, [salesPersons]);

  const salesPersonOption = useMemo(() => {
    const options = (salesPersons || []).map(p => ({
      label: p.person_name?.trim(),
      value: String(p.person_id),
    }));

    if (resUser) {
      const exists = options.some(o => String(o.value) === String(resUser));
      if (!exists) {
        options.unshift({
          label: 'You (Current User)',
          value: String(resUser),
        });
      }
    }
    return options;
  }, [salesPersons, resUser]);

  // ─── Validation & Submit ───────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!opportunityName.trim()) {
      showFlashMessage({
        message: 'Opportunity Name is required.',
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    if (is_multidivision && !selectedDivisionId) {
      showFlashMessage({
        message: 'Please select a Division.',
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    const safeNumber = (val, fallback = 0) => {
      const num = Number(val);
      return isNaN(num) ? fallback : num;
    };

    const safeStringify = obj => {
      const seen = new WeakSet();
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return undefined;
          }
          seen.add(value);
        }
        return value;
      });
    };

    try {
      setLoading(true);

      const sanitizedRemarks =
        tabremarks &&
        typeof tabremarks === 'object' &&
        !tabremarks.nativeEvent &&
        (tabremarks.remark || tabremarks.dateValue)
          ? [
              {
                dateValue: String(tabremarks.dateValue || ''),
                remark: String(tabremarks.remark || ''),
                replyTo: Array.isArray(tabremarks.replyTo)
                  ? tabremarks.replyTo.map(String)
                  : [],
                createdBy:
                  typeof tabremarks.createdBy === 'object'
                    ? tabremarks.createdBy?.id || ''
                    : tabremarks.createdBy || '',
              },
            ]
          : [];

      const sanitizedContactInfo =
        extraInfoData &&
        typeof extraInfoData === 'object' &&
        !extraInfoData.nativeEvent
          ? {
              prospectName: String(extraInfoData.prospectName || ''),
              street: String(extraInfoData.street || ''),
              city: String(extraInfoData.city || ''),
              zipCode: String(extraInfoData.zipCode || ''),
              contactName: String(extraInfoData.contactName || ''),
              jobPosition: String(extraInfoData.jobPosition || ''),
              mobile: String(extraInfoData.mobile || ''),
              referredBy: String(extraInfoData.referredBy || ''),
              selectedCountryId: extraInfoData.selectedCountryId
                ? safeNumber(extraInfoData.selectedCountryId)
                : null,
              selectedStateId: extraInfoData.selectedStateId
                ? safeNumber(extraInfoData.selectedStateId)
                : null,
              campaign: extraInfoData.campaign
                ? safeNumber(extraInfoData.campaign)
                : null,
              medium: extraInfoData.medium
                ? safeNumber(extraInfoData.medium)
                : null,
              source: extraInfoData.source
                ? safeNumber(extraInfoData.source)
                : null,
              daystoassign: String(extraInfoData.daystoassign || '0'),
              daystoclose: String(extraInfoData.daystoclose || '0'),
            }
          : {};

      const payload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          created_by: String(employeeCode || ''),
          prospect_name: String(prospectName || ''),
          
          mobile_number: String(mobileNumber || ''),
          employeeCode: String(employeeCode || ''),
          email: String(email || ''),
          name: String(opportunityName || ''),
          internal_notes: String(tabinternal || ''),
          extra_info: '',

          division: safeNumber(selectedDivisionId),
          sales_person: safeNumber(salesPersonId),
          customer_id: safeNumber(selectedCustomerId),

          type: 'opportunity',
          remark: String(remark || ''),

          account_holder: safeNumber(selectedAccountHolder),
          sales_channel: selectedSalesChannel ? safeNumber(selectedSalesChannel) : null,

          visible_To_Users: Array.isArray(visibleToId)
            ? visibleToId.map(String)
            : [],
          assignTo_Id: safeNumber(assignToId),

          expected_revenue: String(expectedRevenue || ''),
          probability: String(probability || ''),
          priority: safeNumber(priority),

          taglist: selectdetaglist ? safeNumber(selectdetaglist) : '',
          expectedclosing: String(querycloseddate || ''),

          contact_information: sanitizedContactInfo,
          remarkdata: sanitizedRemarks,
        },
      };

      console.log('🚀 SUBMITTING OPP PAYLOAD:', payload);

      const response = await fetch(createOpportunityUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: safeStringify(payload),
      });

      const result = await response.json();

      if (result?.error) {
        const errorMessage =
          result?.error?.data?.message ||
          result?.error?.message ||
          'Server error occurred';
        showFlashMessage({
          message: errorMessage,
          type: 'danger',
          duration: 4000,
        });
        return;
      }

      if (result?.result) {
        showFlashMessage({
          message:
            result?.result?.message || 'Opportunity created successfully!',
          type: 'success',
          duration: 3000,
        });
        navigation.goBack();
      } else {
        showFlashMessage({
          message: result?.result?.message || 'Something went wrong',
          type: 'danger',
          duration: 3000,
        });
      }
    } catch (err) {
      console.error('❌ handleSubmit error:', err);
      showFlashMessage({
        message: err?.message || 'Network error. Please try again.',
        type: 'danger',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExtraInfoSave = useCallback(data => {
    if (data && typeof data === 'object' && !data.nativeEvent) {
      setExtraInfoData(data);
    }
  }, []);

  const hasExtraInfo =
    extraInfoData &&
    typeof extraInfoData === 'object' &&
    !extraInfoData.nativeEvent &&
    Object.keys(extraInfoData).length > 0;
  const hasRemarkLog =
    tabremarks &&
    typeof tabremarks === 'object' &&
    !tabremarks.nativeEvent &&
    (tabremarks.remark || tabremarks.dateValue);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.bg }]}>
      {/* <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      /> */}

      <HeaderCompo
        title="Create Opportunity"
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* ── Sub-Hero Top Card ── */}
          {/* <View
            style={[
              styles.heroBanner,
              {
                backgroundColor: isDark ? '#162238' : '#EFF6FF',
                borderColor: isDark ? '#23385D' : '#DBEAFE',
              },
            ]}>
            <View style={styles.heroIconWrap}>
              <Ionicons name="sparkles" size={20} color={PALETTE.primary} />
            </View>
            <View style={styles.heroTextWrap}>
              <Text
                style={[
                  styles.heroTitle,
                  { color: isDark ? '#93C5FD' : '#1D4ED8' },
                ]}>
                New Sales Opportunity
              </Text>
              <Text
                style={[
                  styles.heroSubtitle,
                  { color: isDark ? '#94A3B8' : '#475569' },
                ]}>
                Fill in the details below to register and track this deal.
              </Text>
            </View>
          </View> */}

          {/* ── Section 1: Opportunity Information ── */}
          <SectionCard
            icon="briefcase-outline"
            iconBg={PALETTE.primary}
            title="Opportunity Details"
            // subtitle="Core identity and prospect info"
            theme={theme}>
            <FieldLabel text="Opportunity Name" required theme={theme} />
            <CustomTextInput
              icon="business-outline"
              placeholder="e.g. Annual IT Infrastructure Upgrade"
              value={opportunityName}
              onChangeText={setOpportunityName}
              theme={theme}
            />

            <FieldLabel text="Prospect Name " theme={theme} />
            <CustomTextInput
              icon="person-outline"
              placeholder="e.g. Acme Corp / Dr. Sharma"
              value={prospectName}
              onChangeText={setProspectName}
              theme={theme}
            />
              <View style={styles.twoColRow}>
              <View style={styles.colLeft}>
                <FieldLabel text="Expected Revenue" theme={theme} />
                <CustomTextInput
                  prefix="₹"
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={expectedRevenue}
                  onChangeText={setExpectedRevenue}
                  theme={theme}
                />
              </View>
              <View style={styles.colRight}>
                <FieldLabel text="Probability" theme={theme} />
                <CustomTextInput
                  suffix="%"
                  placeholder="10"
                  keyboardType="numeric"
                  value={probability}
                  onChangeText={setProbability}
                  theme={theme}
                />
              </View>
            </View>
             <FieldLabel text="Division" required theme={theme} />
            <AppDropdown
              data={divisionOptions}
              value={selectedDivisionId}
              onChange={item => setSelectedDivisionId(item.value)}
              placeholder="Select Division"
              icon="git-branch-outline"
              theme={theme}
              isDark={isDark}
            />

            <FieldLabel text="Sales Person" theme={theme} />
            <AppDropdown
              data={salesPersonOptions}
              value={salesPersonId}
              onChange={item => {
                setSelectedSalesPersonLabel(item.label);
                setSalesPersonId(item.value);
                fetchCustomersData(item.value);
              }}
              placeholder="Select Sales Person"
              icon="person-outline"
              theme={theme}
              isDark={isDark}
            />

            <FieldLabel text="Customer" theme={theme} />
            <AppDropdown
              data={customers}
              value={selectedCustomerId}
              onChange={item => {
                setSelectedCustomerId(item.value);
                fetchAccountHolder(item.value, selectedDivisionId);
              }}
              placeholder="Select Customer"
              icon="people-outline"
              theme={theme}
              isDark={isDark}
            />

            <FieldLabel text="Account Holder" theme={theme} />
            <AppDropdown
              data={salesPersonOption}
              labelField="label"
              valueField="value"
              placeholder="Select Account Holder"
              value={selectedAccountHolder}
              onChange={item => {
                setSelectedAccountHolder(item.value);
              }}
              icon="shield-checkmark-outline"
              theme={theme}
              isDark={isDark}
            />
          

            <FieldLabel text="Sales Channel" theme={theme} />
            <AppDropdown
              data={salesChannels}
              labelField="label"
              valueField="value"
              placeholder="Select Sales Channel"
              value={selectedSalesChannel}
              onChange={item => setSelectedSalesChannel(item.value)}
              icon="globe-outline"
              theme={theme}
              isDark={isDark}
            />

            <FieldLabel text="Tags" theme={theme} />
            <AppDropdown
              data={taglist}
              value={selectdetaglist}
              onChange={item => setselectedtaglist(item.value)}
              placeholder="Select Tag"
              icon="pricetag-outline"
              theme={theme}
              isDark={isDark}
            />

            {user?.result?.is_management && selectedDivisionId ? (
              <>
                <FieldLabel text="Assign To" theme={theme} />
                <AppDropdown
                  data={assignToData}
                  value={assignToId}
                  onChange={item => setAssignToId(item.value)}
                  placeholder="Assign To User"
                  icon="person-add-outline"
                  theme={theme}
                  isDark={isDark}
                />
              </>
            ) : null}

            <FieldLabel text="Visible To" theme={theme} />
            <MultiselectorDropDown
              data={visibleToData}
              selectedValues={visibleToId}
              onValueChange={items => setVisibleToId(items)}
              placeholder="Select Visible To Users"
              style={[
                styles.multiSelectDropdown,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                },
              ]}
            />
          </SectionCard>

          {/* ── Section 2: Revenue & Probability ── */}
          
          
          

          {/* ── Section 3: Assignment & Team ── */}
        

          {/* ── Section 4: Contact & Timeline ── */}
          <SectionCard
            icon="call-outline"
            iconBg={PALETTE.accent}
            title="Contact & Timeline"
            subtitle="Phone, email and  Expected Closing Date"
            theme={theme}>
            <FieldLabel text="Mobile Number" theme={theme} />
            <CustomTextInput
              icon="call-outline"
              placeholder="10-digit Mobile Number"
              keyboardType="numeric"
              maxLength={10}
              value={mobileNumber}
              onChangeText={setMobileNumber}
              theme={theme}
            />

            <FieldLabel text="Email Address" theme={theme} />
            <CustomTextInput
              icon="mail-outline"
              placeholder="name@company.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              theme={theme}
            />

            <FieldLabel text="Expected Closing Date" theme={theme} />
            <CalendarInput
              value={querycloseddate}
              onChange={v => setquerycloseddate(v)}
              placeholder="Select Expected Closing Date"
              style={[
                styles.calendarInputStyle,
                {
                  borderColor: theme.inputBorder,
                  backgroundColor: theme.inputBg,
                  color: theme.inputText,
                },
              ]}
            />
          </SectionCard>

          {/* ── Section 5: Priority Level ── */}
          <SectionCard
            icon="star-outline"
            iconBg={PALETTE.warning}
            title="Priority"
            // subtitle="Set the importance and urgency of this deal"
            theme={theme}>
            <PrioritySelector
              value={priority}
              onChange={setPriority}
              theme={theme}
            />
          </SectionCard>

          {/* ── Section 6: Remarks & Internal Notes ── */}
          <SectionCard
            icon="chatbox-ellipses-outline"
            iconBg={PALETTE.purple}
            title="Remarks & Notes"
            // subtitle="Add comments and confidential internal notes"
            theme={theme}>
            <FieldLabel text="General Remark" theme={theme} />
            <CustomTextInput
              placeholder="Add general remarks or background context..."
              value={remark}
              onChangeText={setRemark}
              multiline
              numberOfLines={3}
              theme={theme}
              style={{ minHeight: 85 }}
            />

            {/* Toggle internal notes button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowInternalNotes(prev => !prev)}
              style={[
                styles.internalNotesToggle,
                {
                  backgroundColor: isDark ? '#1F2B42' : '#F1F5F9',
                  borderColor: theme.cardBorder,
                },
              ]}>
              <View style={styles.internalNotesLeft}>
                <Ionicons
                  name={showInternalNotes ? 'lock-open-outline' : 'lock-closed-outline'}
                  size={17}
                  color={PALETTE.primary}
                />
                <Text
                  style={[
                    styles.internalNotesTitle,
                    { color: theme.headerText },
                  ]}>
                  Internal Notes
                </Text>
              </View>
              <Ionicons
                name={showInternalNotes ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={theme.iconColor}
              />
            </TouchableOpacity>

            {showInternalNotes && (
              <View style={styles.internalNotesContent}>
                <CustomTextInput
                  placeholder="Enter confidential notes visible only internally..."
                  value={tabinternal}
                  onChangeText={settabinternal}
                  multiline
                  numberOfLines={4}
                  theme={theme}
                  style={{ minHeight: 90 }}
                />
              </View>
            )}
          </SectionCard>

          {/* ── Section 7: Quick Actions (Tiles) ── */}
          <View style={styles.quickActionsContainer}>
            {/* Tile 1: Contact Info */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate(navigationString.CONTACTINFORMATION, {
                  onSave: handleExtraInfoSave,
                })
              }
              style={[
                styles.actionTile,
                {
                  backgroundColor: theme.card,
                  borderColor: hasExtraInfo ? PALETTE.success : theme.cardBorder,
                },
              ]}>
              <View
                style={[
                  styles.actionTileIconWrap,
                  {
                    backgroundColor: hasExtraInfo
                      ? PALETTE.successLight
                      : PALETTE.primaryLight,
                  },
                ]}>
                <Ionicons
                  name="id-card-outline"
                  size={20}
                  color={hasExtraInfo ? PALETTE.success : PALETTE.primary}
                />
              </View>
              <View style={styles.actionTileTextWrap}>
                <Text
                  style={[styles.actionTileTitle, { color: theme.headerText }]}>
                  Contact Info
                </Text>
                <Text
                  style={[
                    styles.actionTileStatus,
                    { color: hasExtraInfo ? PALETTE.success : theme.subText },
                  ]}>
                  {hasExtraInfo ? '✓ Details Added' : '+ Add Details'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Tile 2: Log Remark */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setOpenRemarkModal(true)}
              style={[
                styles.actionTile,
                {
                  backgroundColor: theme.card,
                  borderColor: hasRemarkLog ? PALETTE.success : theme.cardBorder,
                },
              ]}>
              <View
                style={[
                  styles.actionTileIconWrap,
                  {
                    backgroundColor: hasRemarkLog
                      ? PALETTE.successLight
                      : PALETTE.purpleLight,
                  },
                ]}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={20}
                  color={hasRemarkLog ? PALETTE.success : PALETTE.purple}
                />
              </View>
              <View style={styles.actionTileTextWrap}>
                <Text
                  style={[styles.actionTileTitle, { color: theme.headerText }]}>
                  Remark Log
                </Text>
                <Text
                  style={[
                    styles.actionTileStatus,
                    { color: hasRemarkLog ? PALETTE.success : theme.subText },
                  ]}>
                  {hasRemarkLog ? '✓ Remark Logged' : '+ Add Log'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* ── Footer Actions ── */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                  borderColor: theme.cardBorder,
                },
              ]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.75}>
              <Text
                style={[styles.cancelButtonText, { color: theme.subText }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.85}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.submitButtonText}>Create Opportunity</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Modals ── */}
      <Remark
        isVisible={openRemarkModal}
        onclose={data => {
          setOpenRemarkModal(false);
          if (
            data &&
            typeof data === 'object' &&
            !data.nativeEvent &&
            (data.remark || data.dateValue)
          ) {
            settabremarks(data);
          }
        }}
        resUser={resUser}
      />

      <Loader visible={loading} text="Creating opportunity..." />
    </View>
  );
};

// ─── Stylesheet ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  // Hero Banner
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  heroIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },

  // Section Card
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardHeaderTextWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  cardDivider: {
    height: 1,
    marginVertical: 14,
  },
  cardContent: {
    gap: 2,
  },

  // Field Labels
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  requiredStar: {
    color: PALETTE.danger,
    fontSize: 14,
    fontWeight: '700',
  },

  // Text Inputs
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 48,
    marginBottom: 4,
  },
  inputWrapperMultiline: {
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  inputLeftIcon: {
    marginRight: 8,
  },
  inputPrefix: {
    fontSize: 15,
    fontWeight: '700',
    marginRight: 6,
  },
  inputSuffix: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  textInputMultiline: {
    textAlignVertical: 'top',
  },

  // 2-Column Row
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colLeft: {
    flex: 1,
  },
  colRight: {
    flex: 1,
  },

  // Dropdown
  dropdownStyle: {
    height: 48,
    borderWidth: 1.2,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  dropdownPlaceholder: {
    fontSize: 14,
  },
  dropdownSelectedText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownSearchInput: {
    height: 42,
    fontSize: 14,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    margin: 8,
  },
  dropdownListContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 4,
  },
  dropdownLeftIcon: {
    marginRight: 8,
  },
  disabledInput: {
    opacity: 0.6,
  },

  // Multi-select dropdown override
  multiSelectDropdown: {
    borderRadius: 12,
    borderWidth: 1.2,
    minHeight: 48,
    marginBottom: 4,
  },

  // Calendar Input Override
  calendarInputStyle: {
    borderRadius: 12,
    borderWidth: 1.2,
    minHeight: 48,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 4,
  },

  // Auto suggestion badge
  autoSuggestionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    marginTop: 6,
    marginBottom: 4,
  },
  autoSuggestionText: {
    fontSize: 12,
    flex: 1,
  },

  // Priority Selector
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  priorityPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.2,
  },
  priorityPillText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Internal Notes Toggle
  internalNotesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 12,
  },
  internalNotesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  internalNotesTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  internalNotesContent: {
    marginTop: 8,
  },

  // Quick Action Tiles
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  actionTileIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  actionTileTextWrap: {
    flex: 1,
  },
  actionTileTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  actionTileStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  // Footer Actions
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    height: 52,
    borderRadius: 12,
    backgroundColor: PALETTE.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: PALETTE.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});

export default OpportunityForm;
