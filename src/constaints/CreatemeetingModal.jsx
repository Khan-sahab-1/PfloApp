import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {COLORS} from '../styles/Colors';
import TextinputCompo from '../components/TextinputCompo';
import SingleDropdown from '../components/SingleDropdown';
import ButtonCompo from '../components/ButtonCompo';
import DropdownCompo from '../components/DropdownCompo';
import dayjs from 'dayjs';
import makeApiCall from '../utils/apiHelper';
import urls from '../../url';
import {AuthContext} from '../Screens/Context';
import {useSelector} from 'react-redux';
import {formatDateTime} from '../utils/permissions';
import {TextInputMask} from 'react-native-masked-text';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {addMeetingToCalendar} from '../utils/calendarUtils';

// ─── Constants ────────────────────────────────────────────────────────────────

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const API_TIMEOUT_MS = 15_000;

const INITIAL_FORM = {
  meetingSubject: '',
  date: new Date(),
  meetingDate: '',
  duration: '',
  location: '',
  description: '',
  selectedReminder: '',
  selectedAttendees: [], // management external
  selectedAttendees1: [], // internal
  selectedAttendees2: [], // non-management external
  customer: '',
  selectedTags: [], // tags
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toDropdown = (arr = [], labelKey, valueKey) =>
  arr.map(item => ({
    label: item[labelKey] || 'Unknown',
    value: item[valueKey],
  }));

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Request timed out after ${ms / 1000}s`)),
        ms,
      ),
    ),
  ]);

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionLabel = ({children, isDark}) => (
  <Text style={[sectionStyles.label, isDark && sectionStyles.labelDark]}>
    {children}
  </Text>
);

const sectionStyles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#6B7280',
    marginBottom: 6,
    marginTop: 14,
  },
  labelDark: {color: '#9CA3AF'},
});

// ─── Field Row ────────────────────────────────────────────────────────────────

const FieldRow = ({icon, children}) => (
  <View style={fieldStyles.row}>
    {icon ? <Text style={fieldStyles.icon}>{icon}</Text> : null}
    <View style={fieldStyles.content}>{children}</View>
  </View>
);

const fieldStyles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4},
  icon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 10,
    width: 20,
    textAlign: 'center',
  },
  content: {flex: 1},
});

// ─── Main Component ───────────────────────────────────────────────────────────

const CreatemeetingModal = ({isVisible, onclose, onSelectDate}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const contextType = useContext(AuthContext);
  const user = useSelector(state => state.user.userDatainfo);
  const server_origin = contextType.currentUrl;
  const isManagemment = user?.result?.is_management;
  const salespersion = user?.result?.res_user || '';

  // ── Form State ──
  const [form, setForm] = useState({
    ...INITIAL_FORM,
    meetingDate: onSelectDate || '',
  });
  const setField = useCallback(
    (key, value) => setForm(prev => ({...prev, [key]: value})),
    [],
  );

  // ── UI State ──
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  // ── Remote Data ──
  const [reminders, setReminders] = useState([]);
  const [meetingCustomers, setMeetingCustomers] = useState([]);
  const [internalAttendees, setInternalAttendees] = useState([]);
  const [externalAttendees, setExternalAttendees] = useState([]);
  const [allAttendees, setAllAttendees] = useState([]); // management-only
  const [tagData, setTagData] = useState([]); // tags data

  // ── Derived Dropdown Data ──
  const internalDropdown = internalAttendees
    .filter(i => i.emp_id)
    .map(i => ({label: i.emp_name || 'Unknown', value: i.emp_id}));

  const externalDropdown = externalAttendees
    .filter(i => i.res_id)
    .map(i => ({label: i.res_name || 'Unknown', value: i.res_id}));

  const allAttendeesDropdown = toDropdown(allAttendees, 'name', 'id');

  // ── Sync onSelectDate prop ──
  useEffect(() => {
    setField('meetingDate', onSelectDate || '');
  }, [onSelectDate]);

  // ── Bootstrap data ──
  useEffect(() => {
    fetchReminders();
    fetchMeetingCustomers();
    fetchAllAttendees();
    fetchTagData();
  }, []);

  // ── Refresh attendees when customer changes ──
  useEffect(() => {
    if (form.customer) {
      fetchCustomerAttendees('internal');
      fetchCustomerAttendees('external');
    } else {
      setInternalAttendees([]);
      setExternalAttendees([]);
    }
  }, [form.customer]);

  // ─── API Calls ──────────────────────────────────────────────────────────────

  const fetchReminders = async () => {
    try {
      const res = await makeApiCall(
        server_origin,
        urls.getReminderData,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {},
        },
      );
      const list = res?.result?.[5]?.stored_reminders ?? [];
      setReminders(list.map(r => ({label: r.name, value: r.id})));
    } catch (e) {
      console.error('fetchReminders:', e);
    }
  };

  const fetchMeetingCustomers = async () => {
    try {
      // console.log(salespersion,'SalesPersion----->>>')
      const res = await makeApiCall(
        server_origin,
        urls.meetingsCustoers,
        'POST',
        {
          jsonrpc: '2.0',
          params: {salesPerson: salespersion, isManagemment},
        },
      );
      console.log(res,'Jo Chahite')
      setMeetingCustomers(
        (res?.result ?? []).map(c => ({
          value: c.customer_id,
          label: c.customer_name?.trim() || '',
        })),
      );
    } catch (e) {
      console.error('fetchMeetingCustomers:', e);
    }
  };

  const fetchAllAttendees = async () => {
    setLoading(true);
    try {
      const res = await makeApiCall(
        server_origin,
        urls.getAttendeesData,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {},
        },
      );
      setAllAttendees(res?.result ?? []);
    } catch (e) {
      console.error('fetchAllAttendees:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerAttendees = async type => {
    try {
      const res = await makeApiCall(
        server_origin,
        urls.posthandlecustomer,
        'POST',
        {
          jsonrpc: '2.0',
          params: {customerId: form.customer, selectedType: type},
        },
      );
      const attendees = res?.result?.attendees ?? [];
      if (type === 'internal') {
        setInternalAttendees(attendees);
        setField('selectedAttendees1', []);
      } else {
        setExternalAttendees(attendees);
        setField('selectedAttendees2', []);
      }
    } catch (e) {
      console.error(`fetchCustomerAttendees (${type}):`, e);
    }
  };
  const fetchTagData = async () => {
    try {
      const res = await makeApiCall(server_origin, urls.gettagdata, 'POST', {
        jsonrpc: '2.0',
        method: 'call',
        params: {},
      });

      console.log('FULL RESPONSE:', res);

      // ✅ correct extraction
      const tagList = res?.result?.data || [];
      const formattedTags = (tagList || [])
        .filter(item => item && item.id && item.name) // remove invalid
        .map(item => ({
          label: item?.name ?? '',
          value: item?.id ?? '',
        }));

      console.log('FORMATTED TAGS:', formattedTags);

      setTagData(formattedTags);
    } catch (e) {
      console.error('fetchTagData:', e);
    }
  };

  // ─── Form Logic ─────────────────────────────────────────────────────────────

  const resetForm = () => {
    setForm({...INITIAL_FORM, meetingDate: ''});
    setInternalAttendees([]);
    setExternalAttendees([]);
  };

  const validateForm = () => {
    const {
      meetingSubject,
      meetingDate,
      duration,
      location,
      description,
      selectedReminder,
      customer,
      selectedAttendees,
      selectedAttendees1,
      selectedAttendees2,
    } = form;

    const checks = [
      [!meetingSubject.trim(), 'Please enter a meeting subject.'],
      [!meetingDate, 'Please select a meeting start date & time.'],
      [
        !duration || !/^\d{2}:\d{2}$/.test(duration),
        'Please enter a valid duration (HH:MM).',
      ],
      [!location.trim(), 'Please enter a meeting location.'],
      [!description.trim(), 'Please enter a description.'],
      [!selectedReminder, 'Please select a reminder.'],
      [isManagemment && !customer, 'Please select a customer.'],
      [
        isManagemment && !selectedAttendees.length,
        'Please select at least one external attendee.',
      ],
      [
        !isManagemment && !selectedAttendees2.length,
        'Please select at least one external attendee.',
      ],
      [
        !selectedAttendees1.length,
        'Please select at least one internal attendee.',
      ],
    ];

    for (const [condition, message] of checks) {
      if (condition) {
        Alert.alert('Validation Error', message);
        return false;
      }
    }
    return true;
  };

  // const handleSubmit = async () => {
  //   if (submitting) return;
  //   if (!validateForm()) return;

  //   setSubmitting(true);
  //   try {
  //     const [hours, minutes] = form.duration.split(':').map(Number);
  //     const durationMinutes = hours * 60 + minutes;
  //     const startDate = new Date(form.date);
  //     const endDate = new Date(startDate.getTime() + durationMinutes * 60_000);

  //     const payload = {
  //       assigned_to: user?.result?.emp_code,
  //       subject: form.meetingSubject,
  //       startDate: formatDateTime(startDate),
  //       customer_id: form.customer,
  //       res_users: isManagemment ? form.selectedAttendees : form.selectedAttendees2,
  //       emp_users: form.selectedAttendees1,
  //       endDate: formatDateTime(endDate),
  //       duration: durationMinutes / 60,
  //       location: form.location,
  //       summary: form.description,
  //       recurrent: false,
  //       all_day: false,
  //       reminder: form.selectedReminder,
  //     };

  //     const apiRes = await withTimeout(
  //       makeApiCall(server_origin, urls.createmeeting, 'POST', {
  //         jsonrpc: '2.0', method: 'call', params: payload,
  //       }),
  //       API_TIMEOUT_MS,
  //     );

  //     if (apiRes?.result?.status !== 'success') {
  //       throw new Error(apiRes?.error?.message || 'Failed to create meeting.');
  //     }

  //     Alert.alert(
  //       '✅ Meeting Scheduled',
  //       'Your meeting has been created successfully.',
  //       [{
  //         text: 'Done',
  //         style: 'default',
  //         onPress: async () => {
  //           // Add to device calendar (IST offset adjustment)
  //           const adjustedStart = new Date(startDate.getTime() + IST_OFFSET_MS);
  //           try {
  //             await addMeetingToCalendar({
  //               title: form.meetingSubject,
  //               startDate: formatDateTime(adjustedStart),
  //               endDate: formatDateTime(endDate),
  //               location: form.location,
  //               description: form.description,
  //               reminder: form.selectedReminder,
  //             });
  //           } catch (calErr) {
  //             console.warn('Calendar add failed:', calErr);
  //           }
  //           resetForm();
  //           onclose();
  //         },
  //       }],
  //       {cancelable: false},
  //     );
  //   } catch (error) {
  //     console.error('handleSubmit error:', error);
  //     Alert.alert('Error', error.message || 'An unexpected error occurred.', [
  //       {text: 'OK'},
  //     ]);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  // ─── Render ─────────────────────────────────────────────────────────────────

  //   const handleSubmit = async () => {
  //   if (submitting) return;
  //   if (!validateForm()) return;

  //   setSubmitting(true);
  //   try {
  //     const [hours, minutes] = form.duration.split(':').map(Number);
  //     const durationMinutes = hours * 60 + minutes;
  //     const startDate = new Date(form.date);
  //     const endDate = new Date(startDate.getTime() + durationMinutes * 60_000);

  //     const payload = {
  //       assigned_to: user?.result?.emp_code,
  //       subject: form.meetingSubject,
  //       startDate: formatDateTime(startDate),
  //       customer_id: form.customer,
  //       res_users: isManagemment ? form.selectedAttendees : form.selectedAttendees2,
  //       emp_users: form.selectedAttendees1,
  //       endDate: formatDateTime(endDate),
  //       duration: durationMinutes / 60,
  //       location: form.location,
  //       summary: form.description,
  //       recurrent: false,
  //       all_day: false,
  //       reminder: form.selectedReminder,
  //     };

  //     const apiRes = await withTimeout(
  //       makeApiCall(server_origin, urls.createmeeting, 'POST', {
  //         jsonrpc: '2.0', method: 'call', params: payload,
  //       }),
  //       API_TIMEOUT_MS,
  //     );

  //     if (apiRes?.result?.status !== 'success') {
  //       throw new Error(apiRes?.error?.message || 'Failed to create meeting.');
  //     }

  //     Alert.alert(
  //       '✅ Meeting Scheduled',
  //       'Your meeting has been created successfully.',
  //       [{
  //         text: 'Done',
  //         style: 'default',
  //         onPress: async () => {
  //           // ✅ FIX: Convert to ISO format with timezone
  //           const adjustedStart = new Date(startDate.getTime() + IST_OFFSET_MS);

  //           // Convert to ISO format with proper UTC handling
  //           const formatForCalendar = (date) => {
  //             // Create date with timezone offset
  //             const year = date.getFullYear();
  //             const month = String(date.getMonth() + 1).padStart(2, '0');
  //             const day = String(date.getDate()).padStart(2, '0');
  //             const hours = String(date.getHours()).padStart(2, '0');
  //             const minutes = String(date.getMinutes()).padStart(2, '0');
  //             const seconds = String(date.getSeconds()).padStart(2, '0');

  //             // Return ISO-like format without milliseconds
  //             return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  //           };

  //           const endDateISO = formatForCalendar(endDate);
  //           const startDateISO = formatForCalendar(adjustedStart);

  //           try {
  //             await addMeetingToCalendar({
  //               title: form.meetingSubject,
  //               startDate: startDateISO,
  //               endDate: endDateISO,
  //               location: form.location,
  //               description: form.description,
  //               reminder: form.selectedReminder,
  //             });
  //           } catch (calErr) {
  //             console.warn('Calendar add failed:', calErr);
  //           }
  //           resetForm();
  //           onclose();
  //         },
  //       }],
  //       {cancelable: false},
  //     );
  //   } catch (error) {
  //     console.error('handleSubmit error:', error);
  //     Alert.alert('Error', error.message || 'An unexpected error occurred.', [
  //       {text: 'OK'},
  //     ]);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const [hours, minutes] = form.duration.split(':').map(Number);
      const durationMinutes = hours * 60 + minutes;
      const startDate = new Date(form.date);
      const endDate = new Date(startDate.getTime() + durationMinutes * 60_000);

      const payload = {
        assigned_to: user?.result?.emp_code,
        subject: form.meetingSubject,
        startDate: formatDateTime(startDate),
        customer_id: form.customer,
        res_users: isManagemment
          ? form.selectedAttendees
          : form.selectedAttendees2,
        emp_users: form.selectedAttendees1,
        endDate: formatDateTime(endDate),
        duration: durationMinutes / 60,
        location: form.location,
        summary: form.description,
        recurrent: false,
        all_day: false,
        reminder: form.selectedReminder,
        tags: form.selectedTags, // ✅ Include tags in payload
      };

      const apiRes = await withTimeout(
        makeApiCall(server_origin, urls.createmeeting, 'POST', {
          jsonrpc: '2.0',
          method: 'call',
          params: payload,
        }),
        API_TIMEOUT_MS,
      );

      if (apiRes?.result?.status !== 'success') {
        throw new Error(apiRes?.error?.message || 'Failed to create meeting.');
      }

      const reminderLabel =
        reminders.find(
          item => String(item.value) === String(form.selectedReminder),
        )?.label ||
        '15 Minutes';
      const calendarResult = await addMeetingToCalendar({
        title: form.meetingSubject,
        startDate,
        endDate,
        location: form.location,
        description: form.description,
        reminder: reminderLabel,
      });

      Alert.alert(
        '✅ Meeting Scheduled',
        calendarResult.success
          ? `Meeting "${calendarResult.calendarTitle}" has been added to your calendar. You will receive a reminder ${calendarResult.minutesBefore} minute(s) before the meeting.`
          : `Meeting has been created, but it could not be added to your device calendar. ${calendarResult.message}`,
        [
          {
            text: 'Done',
            style: 'default',
            onPress: () => {
              resetForm();
              onclose();
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error('handleSubmit error:', error);
      Alert.alert('Error', error.message || 'An unexpected error occurred.', [
        {text: 'OK'},
      ]);
    } finally {
      setSubmitting(false);
    }
  };
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onclose}>
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={onclose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.sheet, {backgroundColor: theme.bg}]}>
          {/* ── Drag Handle ── */}
          <View style={styles.handle} />

          {/* ── Header ── */}
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.heading, {color: theme.text}]}>
                New Meeting
              </Text>
              <Text style={styles.subheading}>
                Schedule a meeting with your team
              </Text>
            </View>
            <TouchableOpacity
              onPress={onclose}
              style={[styles.closeBtn, {backgroundColor: theme.pill}]}>
              <Text style={[styles.closeIcon, {color: theme.text}]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            {/* ── Subject ── */}
            <SectionLabel isDark={isDark}>Meeting Subject *</SectionLabel>
            <FieldRow icon="📋">
              <TextinputCompo
                placeholder="e.g. Q4 Strategy Review"
                style={[
                  styles.input,
                  {
                    borderColor: theme.border,
                    color: theme.text,
                    backgroundColor: theme.inputBg,
                  },
                ]}
                value={form.meetingSubject}
                onChangeText={v => setField('meetingSubject', v)}
                placeholderTextColor={theme.placeholder}
              />
            </FieldRow>

            {/* ── Customer ── */}
            <SectionLabel isDark={isDark}>Customer *</SectionLabel>
            <FieldRow icon="🏢">
              <SingleDropdown
                data={meetingCustomers}
                value={form.customer}
                onChange={item => setField('customer', item.value)}
                placeholder="Select Customer"
                isDarkMode={isDark}
                style={[styles.dropdown, {borderColor: theme.border}]}
              />
            </FieldRow>

            {/* ── Internal Attendees ── */}
            <SectionLabel isDark={isDark}>Internal Attendees *</SectionLabel>
            <FieldRow icon="👥">
              <DropdownCompo
                data={internalDropdown}
                selectedValues={form.selectedAttendees1}
                onValueChange={v => setField('selectedAttendees1', v)}
                placeholder={
                  form.customer
                    ? 'Select Internal Attendees'
                    : 'Select a customer first'
                }
                disabled={loading || !form.customer}
              />
            </FieldRow>

            {/* ── External Attendees ── */}
            <SectionLabel isDark={isDark}>External Attendees </SectionLabel>
            <FieldRow icon="🌐">
              <DropdownCompo
                data={isManagemment ? allAttendeesDropdown : externalDropdown}
                selectedValues={
                  isManagemment
                    ? form.selectedAttendees
                    : form.selectedAttendees2
                }
                onValueChange={v =>
                  isManagemment
                    ? setField('selectedAttendees', v)
                    : setField('selectedAttendees2', v)
                }
                placeholder={
                  form.customer
                    ? 'Select External Attendees'
                    : 'Select a customer first'
                }
                disabled={loading || !form.customer}
              />
            </FieldRow>

            {/* ── Date & Time ── */}
            <SectionLabel isDark={isDark}>Start Date & Time *</SectionLabel>
            <FieldRow icon="📅">
              <TouchableOpacity
                onPress={() => setDatePickerVisible(true)}
                style={[
                  styles.dateBox,
                  {borderColor: theme.border, backgroundColor: theme.inputBg},
                ]}
                activeOpacity={0.7}>
                <Text
                  style={{
                    color: form.date ? theme.text : theme.placeholder,
                    fontSize: 15,
                  }}>
                  {form.date
                    ? dayjs(form.date).format('ddd, DD MMM YYYY  ·  HH:mm')
                    : 'Tap to select date & time'}
                </Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </FieldRow>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              date={form.date}
              minimumDate={new Date()}
              onConfirm={selectedDate => {
                setField('date', selectedDate);
                setField('meetingDate', selectedDate.toISOString());
                setDatePickerVisible(false);
              }}
              onCancel={() => setDatePickerVisible(false)}
              isDarkModeEnabled={isDark}
            />

            {/* ── Duration ── */}
            <SectionLabel isDark={isDark}>Duration (HH:MM) *</SectionLabel>
            <FieldRow icon="⏱">
              <TextInputMask
                type="custom"
                options={{mask: '99:99'}}
                placeholder="01:30"
                value={form.duration}
                onChangeText={v => setField('duration', v)}
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    borderColor: theme.border,
                    color: theme.text,
                    backgroundColor: theme.inputBg,
                  },
                ]}
                editable={!loading}
                placeholderTextColor={theme.placeholder}
              />
            </FieldRow>

            {/* ── Location ── */}
            <SectionLabel isDark={isDark}>Location *</SectionLabel>
            <FieldRow icon="📍">
              <TextinputCompo
                placeholder="e.g. Conference Room B"
                style={[
                  styles.input,
                  {
                    borderColor: theme.border,
                    color: theme.text,
                    backgroundColor: theme.inputBg,
                  },
                ]}
                value={form.location}
                onChangeText={v => setField('location', v)}
                placeholderTextColor={theme.placeholder}
              />
            </FieldRow>
            <SectionLabel isDark={isDark}>Tags *</SectionLabel>
            <FieldRow icon="🏷">
              <DropdownCompo
                data={tagData}
                selectedValues={form.selectedTags || []} // ✅ FIX
                onValueChange={v => setField('selectedTags', v)}
                placeholder="Select Tags"
                isDarkMode={isDark}
              />
            </FieldRow>

            {/* ── Description ── */}
            <SectionLabel isDark={isDark}>Description *</SectionLabel>
            <FieldRow icon="📝">
              <TextinputCompo
                placeholder="Meeting agenda and notes..."
                style={[
                  styles.input,
                  styles.textarea,
                  {
                    borderColor: theme.border,
                    color: theme.text,
                    backgroundColor: theme.inputBg,
                  },
                ]}
                value={form.description}
                onChangeText={v => setField('description', v)}
                placeholderTextColor={theme.placeholder}
                multiline
                textAlignVertical="top"
              />
            </FieldRow>

            {/* ── Reminder ── */}
            <SectionLabel isDark={isDark}>Reminder *</SectionLabel>
            <FieldRow icon="🔔">
              <SingleDropdown
                data={reminders}
                value={form.selectedReminder}
                onChange={item => setField('selectedReminder', item.value)}
                placeholder="Select Reminder"
                isDarkMode={isDark}
                style={[styles.dropdown, {borderColor: theme.border}]}
              />
            </FieldRow>

            {/* ── Submit ── */}
            <View style={styles.submitRow}>
              <TouchableOpacity
                onPress={onclose}
                style={[styles.cancelBtn, {borderColor: theme.border}]}>
                <Text style={[styles.cancelText, {color: theme.text}]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting}
                style={[
                  styles.submitBtn,
                  submitting && styles.submitBtnDisabled,
                ]}
                activeOpacity={0.85}>
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitText}>Schedule Meeting</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ─── Theme Tokens ─────────────────────────────────────────────────────────────

const lightTheme = {
  bg: '#FFFFFF',
  text: '#111827',
  subtext: '#6B7280',
  border: '#E5E7EB',
  inputBg: '#F9FAFB',
  pill: '#F3F4F6',
  placeholder: '#9CA3AF',
};

const darkTheme = {
  bg: '#1F2937',
  text: '#F9FAFB',
  subtext: '#9CA3AF',
  border: '#374151',
  inputBg: '#111827',
  pill: '#374151',
  placeholder: '#6B7280',
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const ACCENT = COLORS.BUTTON || '#4F46E5'; // Indigo-600

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '93%',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    marginBottom: 4,
  },
  textarea: {
    height: 90,
    paddingTop: 11,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 4,
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 4,
  },
  chevron: {
    fontSize: 20,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  submitRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ACCENT,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtnDisabled: {
    opacity: 0.65,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default CreatemeetingModal;
