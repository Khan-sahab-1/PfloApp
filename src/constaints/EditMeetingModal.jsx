import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {COLORS} from '../styles/Colors';
import TextinputCompo from '../components/TextinputCompo';
import SingleDropdown from '../components/SingleDropdown';
import DropdownCompo from '../components/DropdownCompo';
import dayjs from 'dayjs';
import {AuthContext} from '../Screens/Context';
import {useSelector} from 'react-redux';
import urls from '../../url';
import makeApiCall from '../utils/apiHelper';
import {formatDateTime} from '../utils/permissions';
import {TextInputMask} from 'react-native-masked-text';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {addMeetingToCalendar} from '../utils/calendarUtils';

// ─── Constants ────────────────────────────────────────────────────────────────

const API_TIMEOUT_MS = 15_000;
const ACCENT = '#4F46E5';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert fractional hours (e.g. 1.5) → "01:30" */
const hoursToHHMM = (hourValue) => {
  if (!hourValue && hourValue !== 0) return '01:00';
  const totalMinutes = Math.round(Number(hourValue) * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out after ${ms / 1000}s`)), ms),
    ),
  ]);

// ─── Sub-components ───────────────────────────────────────────────────────────

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

const FieldRow = ({icon, children}) => (
  <View style={fieldStyles.row}>
    {icon ? <Text style={fieldStyles.icon}>{icon}</Text> : null}
    <View style={fieldStyles.content}>{children}</View>
  </View>
);

const fieldStyles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4},
  icon: {fontSize: 16, marginRight: 8, marginTop: 10, width: 20, textAlign: 'center'},
  content: {flex: 1},
});

// ─── Theme Tokens ─────────────────────────────────────────────────────────────

const lightTheme = {
  bg: '#FFFFFF',
  text: '#111827',
  border: '#E5E7EB',
  inputBg: '#F9FAFB',
  pill: '#F3F4F6',
  placeholder: '#9CA3AF',
};

const darkTheme = {
  bg: '#1F2937',
  text: '#F9FAFB',
  border: '#374151',
  inputBg: '#111827',
  pill: '#374151',
  placeholder: '#6B7280',
};

// ─── Main Component ───────────────────────────────────────────────────────────

const EditMeetingModal = ({isVisible, onclose, editItem}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  console.log(editItem,'Items->>>>>>')

  const contextType = useContext(AuthContext);
  const user = useSelector(state => state.user.userDatainfo);
  const server_origin = contextType.currentUrl;
  const isManagemment = user?.result?.is_management;
  const salespersion = user?.result?.res_user || '';

  // ── Form State ──
  const [meetingSubject, setMeetingSubject] = useState('');
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState('01:00');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [selectedReminder, setSelectedReminder] = useState('');
  const [customer, setCustomer] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState([]);   // mgmt external
  const [selectedAttendees1, setSelectedAttendees1] = useState([]); // internal
  const [selectedAttendees2, setSelectedAttendees2] = useState([]); // non-mgmt external
   const [tagData, setTagData] = useState([]); // tags data
   const [selectedtags,setSelectedTags]=useState([]) // selected tags

  // ── UI State ──
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  // ── Remote Data ──
  const [reminders, setReminders] = useState([]);
  const [meetingCustomers, setMeetingCustomers] = useState([]);
  const [allAttendees, setAllAttendees] = useState([]);       // mgmt external pool
  const [internalAttendees, setInternalAttendees] = useState([]);
  const [externalAttendees, setExternalAttendees] = useState([]);

  // ── Derived Dropdown Data ──
  const internalDropdown = internalAttendees
    .filter(i => i.emp_id)
    .map(i => ({label: i.emp_name || 'Unknown', value: i.emp_id}));

  const externalDropdown = externalAttendees
    .filter(i => i.res_id)
    .map(i => ({label: i.res_name || 'Unknown', value: i.res_id}));

  const allAttendeesDropdown = allAttendees.map(i => ({
    label: i.name || 'Unknown',
    value: i.id,
  }));

  // ── Pre-fill form when editItem changes ──
  useEffect(() => {
    if (!editItem) return;

    setMeetingSubject(editItem.name || '');
    const parsedDate = editItem.date ? new Date(editItem.date) : new Date();
    setDate(parsedDate);
    setDuration(hoursToHHMM(editItem.duration));
    setLocation(editItem.location || '');
    setDescription(editItem.description || '');
  const tags = editItem.tags || [];

const formattedTagIds = (tags || [])
  .map(tag => tag?.[1]) 
  .filter(Boolean);

setSelectedTags(formattedTagIds);

console.log('TAG IDS:', formattedTagIds);

    // Internal attendees — stored as [[name, id], ...]
    const internalIds = (editItem.emp_attendees || []).map(([, id]) => id);
    setSelectedAttendees1(internalIds);

    // External attendees — stored as [[name, id], ...]
    const externalIds = (editItem.res_attendees || []).map(([, id]) => id);
    setSelectedAttendees2(externalIds);
    if (isManagemment) setSelectedAttendees(externalIds);

    // Customer
    if (editItem.customer_id) setCustomer(editItem.customer_id);
  }, [editItem]);

  // ── Match reminder after reminders list is loaded ──
  useEffect(() => {
    if (!editItem || !reminders.length) return;
    const match = reminders.find(
      r =>
        r.label === editItem.reminders ||
        (typeof editItem.reminders === 'string' &&
          editItem.reminders.includes(r.label)),
    );
    setSelectedReminder(match ? match.value : '');
  }, [editItem, reminders]);

  // ── Bootstrap ──
  useEffect(() => {
    fetchReminders();
    fetchMeetingCustomers();
    fetchAllAttendees();
    fetchTagData();
  }, []);

  // ── Refresh customer-specific attendees ──
  useEffect(() => {
    if (customer) {
      fetchCustomerAttendees('internal');
      fetchCustomerAttendees('external');
    }
  }, [customer]);

  // ─── API Calls ──────────────────────────────────────────────────────────────

  const fetchReminders = async () => {
    try {
      const res = await makeApiCall(server_origin, urls.getReminderData, 'POST', {
        jsonrpc: '2.0', method: 'call', params: {},
      });
      const list = res?.result?.[5]?.stored_reminders ?? [];
      setReminders(list.map(r => ({label: r.name, value: r.id})));
    } catch (e) {
      console.error('fetchReminders:', e);
    }
  };


  //   console.log('caliingggg---->>>')
  //   console.log(salespersion,'salespersion')
    
  //   try {
  //     console.log(salespersion,'SalesPersion')
  //     const res = await makeApiCall(server_origin, urls.meetingsCustoers, 'POST', {
  //       jsonrpc: '2.0',
  //       params: {},
  //     });
  //     setMeetingCustomers(
  //       (res?.result ?? []).map(c => ({
  //         value: c.customer_id,
  //         label: c.customer_name?.trim() || '',
  //       })),
  //     );
  //   } catch (e) {
  //     console.error('fetchMeetingCustomers:', e);
  //   }
  // };

 const fetchMeetingCustomers = async () => {
    try {
      // console.log(salespersion,'SalesPersion----->>>')
      const res = await makeApiCall(server_origin, urls.meetingsCustoers, 'POST', {
        jsonrpc: '2.0',
        params: {salesPerson: salespersion, isManagemment},
      });
      // console.log(res,'Jo Chahite')
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
      const res = await makeApiCall(server_origin, urls.getAttendeesData, 'POST', {
        jsonrpc: '2.0', method: 'call', params: {},
      });
      setAllAttendees(res?.result ?? []);
    } catch (e) {
      console.error('fetchAllAttendees:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerAttendees = async type => {
    try {
      const res = await makeApiCall(server_origin, urls.posthandlecustomer, 'POST', {
        jsonrpc: '2.0',
        params: {customerId: customer, selectedType: type},
      });
      const attendees = res?.result?.attendees ?? [];
      if (type === 'internal') {
        setInternalAttendees(attendees);
      } else {
        setExternalAttendees(attendees);
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

  // ─── Validation ─────────────────────────────────────────────────────────────

  const validateForm = () => {
    const checks = [
      [!meetingSubject.trim(),                      'Please enter a meeting subject.'],
      [!date,                                       'Please select a meeting start date & time.'],
      [!duration || !/^\d{2}:\d{2}$/.test(duration),'Please enter a valid duration (HH:MM).'],
      [!location.trim(),                            'Please enter a meeting location.'],
      [!description.trim(),                         'Please enter a description.'],
      [!selectedReminder,                           'Please select a reminder.'],
      [isManagemment && !selectedAttendees.length,  'Please select at least one external attendee.'],
      [!isManagemment && !selectedAttendees2.length,'Please select at least one external attendee.'],
      [!selectedAttendees1.length,                  'Please select at least one internal attendee.'],
    ];
    for (const [condition, message] of checks) {
      if (condition) {
        Alert.alert('Validation Error', message);
        return false;
      }
    }
    return true;
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const [hours, minutes] = duration.split(':').map(Number);
      const durationMinutes = hours * 60 + minutes;
      const startDate = new Date(date);
      const endDate = new Date(startDate.getTime() + durationMinutes * 60_000);

      const payload = {
        event_id: editItem?.cal_id,
        assigned_to: user?.result?.emp_code,
        subject: meetingSubject,
        startDate: formatDateTime(startDate),
        customer_id: customer,
        res_users: isManagemment ? selectedAttendees : selectedAttendees2,
        emp_users: selectedAttendees1,
        endDate: formatDateTime(endDate),
        duration: durationMinutes / 60,
        location,
        summary: description,
        recurrent: false,
        all_day: false,
        reminder: selectedReminder,
        tags: selectedtags, 
      };

      const apiRes = await withTimeout(
        makeApiCall(server_origin, urls.updateMeetingUrl, 'POST', {
          jsonrpc: '2.0', method: 'call', params: payload,
        }),
        API_TIMEOUT_MS,
      );

      if (apiRes?.result?.status !== 'success') {
        throw new Error(apiRes?.error?.message || 'Failed to update meeting.');
      }

      const reminderLabel =
        reminders.find(
          item => String(item.value) === String(selectedReminder),
        )?.label ||
        '15 Minutes';
      const calendarResult = await addMeetingToCalendar({
        title: meetingSubject,
        startDate,
        endDate,
        location,
        description,
        reminder: reminderLabel,
      });

      Alert.alert(
        '✅ Meeting Updated',
        calendarResult.success
          ? `Meeting "${calendarResult.calendarTitle}" calendar mein save ho gayi hai. Reminder ${calendarResult.minutesBefore} minute(s) pehle aayega.`
          : `Meeting update ho gayi, lekin device calendar sync nahi hua. ${calendarResult.message}`,
        [{
          text: 'Done',
          onPress: () => {
            onclose();
          },
        }],
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

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onclose}>
      <View style={styles.backdrop}>
        {/* Tap outside to close */}
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
              <Text style={[styles.heading, {color: theme.text}]}>Edit Meeting</Text>
              <Text style={styles.subheading}>Update your meeting details below</Text>
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
                style={[styles.input, {borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBg}]}
                value={meetingSubject}
                onChangeText={setMeetingSubject}
                placeholderTextColor={theme.placeholder}
              />
            </FieldRow>

            {/* ── Customer ── */}
            <SectionLabel isDark={isDark}>Customer *</SectionLabel>
            <FieldRow icon="🏢">
              <SingleDropdown
                data={meetingCustomers}
                value={customer}
                onChange={item => setCustomer(item.value)}
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
                selectedValues={selectedAttendees1}
                onValueChange={setSelectedAttendees1}
                placeholder={
                  customer
                    ? 'Select Internal Attendees'
                    : internalDropdown.length
                    ? 'Select Internal Attendees'
                    : 'Select a customer first'
                }
                disabled={loading}
              />
            </FieldRow>

            {/* ── External Attendees ── */}
            <SectionLabel isDark={isDark}>External Attendees </SectionLabel>
            <FieldRow icon="🌐">
              <DropdownCompo
                data={isManagemment ? allAttendeesDropdown : externalDropdown}
                selectedValues={isManagemment ? selectedAttendees : selectedAttendees2}
                onValueChange={
                  isManagemment ? setSelectedAttendees : setSelectedAttendees2
                }
                placeholder={
                  customer
                    ? 'Select External Attendees'
                    : externalDropdown.length
                    ? 'Select External Attendees'
                    : 'Select a customer first'
                }
                disabled={loading}
              />
            </FieldRow>

            {/* ── Date & Time ── */}
            <SectionLabel isDark={isDark}>Start Date & Time *</SectionLabel>
            <FieldRow icon="📅">
              <TouchableOpacity
                onPress={() => setDatePickerVisible(true)}
                style={[styles.dateBox, {borderColor: theme.border, backgroundColor: theme.inputBg}]}
                activeOpacity={0.7}>
                <Text style={{color: date ? theme.text : theme.placeholder, fontSize: 15}}>
                  {date
                    ? dayjs(date).format('ddd, DD MMM YYYY  ·  HH:mm')
                    : 'Tap to select date & time'}
                </Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </FieldRow>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              date={date}
              minimumDate={new Date()}
              onConfirm={selectedDate => {
                setDate(selectedDate);
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
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
                style={[styles.input, {borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBg}]}
                editable={!loading}
                placeholderTextColor={theme.placeholder}
              />
            </FieldRow>

            {/* ── Location ── */}
            <SectionLabel isDark={isDark}>Location *</SectionLabel>
            <FieldRow icon="📍">
              <TextinputCompo
                placeholder="e.g. Conference Room B"
                style={[styles.input, {borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBg}]}
                value={location}
                onChangeText={setLocation}
                placeholderTextColor={theme.placeholder}
              />
            </FieldRow>
            <SectionLabel isDark={isDark}>Tags *</SectionLabel>
            <FieldRow icon="🏷">
              <DropdownCompo
                data={tagData}
                selectedValues={selectedtags}
                onValueChange={setSelectedTags}
                placeholder="Select Tags"
      
                isDarkMode={isDark}
              />
            </FieldRow>

            {/* ── Description ── */}
            <SectionLabel isDark={isDark}>Description *</SectionLabel>
            <FieldRow icon="📝">
              <TextinputCompo
                placeholder="Meeting agenda and notes..."
                style={[styles.input, styles.textarea, {borderColor: theme.border, color: theme.text, backgroundColor: theme.inputBg}]}
                value={description}
                onChangeText={setDescription}
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
                value={selectedReminder}
                onChange={item => setSelectedReminder(item.value)}
                placeholder="Select Reminder"
                isDarkMode={isDark}
                style={[styles.dropdown, {borderColor: theme.border}]}
              />
            </FieldRow>

            {/* ── Action Buttons ── */}
            <View style={styles.submitRow}>
              <TouchableOpacity
                onPress={onclose}
                style={[styles.cancelBtn, {borderColor: theme.border}]}>
                <Text style={[styles.cancelText, {color: theme.text}]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting}
                style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                activeOpacity={0.85}>
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitText}>Update Meeting</Text>
                )}
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

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

export default EditMeetingModal;
// bug id 2822 Jamshed end
