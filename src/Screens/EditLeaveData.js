// Jamshed start 

import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {AuthContext} from './Context';
import HeaderCompo from '../components/HeaderCompo';
import SingleDropdown from '../components/SingleDropdown';
import {COLORS} from '../styles/Colors';
import urls from '../../url';
import TextinputCompo from '../components/TextinputCompo';
import makeApiCall from '../utils/apiHelper';

const EditLeaveData = ({route, navigation}) => {
  const {leaveRecord} = route.params;
  console.log('Leave Record------>>>', leaveRecord?.leave_time_from);
  const [time_from, setTime_from] = useState(leaveRecord?.leave_time_from);
  console.log(time_from, 'wow');
  console.log('first', leaveRecord?.employee_code);
  const [leaveDetails, setLeaveDetails] = useState(leaveRecord);
  const [timeFrom, setTimeFrom] = useState('');
  console.log(timeFrom, 'TimeFrom');
  const [timeTo, setTimeTo] = useState('');
  console.log(timeTo, 'TimeTo');
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState('from');
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const isEditable = leaveDetails.state === 'confirm';
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [fromLeaveType, setFromLeaveType] = useState(null);
  const [toLeaveType, setToLeaveType] = useState(null);
  const [leavestypefrom, setleavetypefrom] = useState(null);
  const [leavetypeto, setleavetypeto] = useState(null);
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const saveEditData = server_origin + urls.saveEditData;
  const comparisionDate = leaveDetails.date_from === leaveDetails.date_to;
  const [employeeTiming, setEmployeeTiming] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const firstHourfrom = employeeTiming?.shift_timing?.[0]?.hour_from ?? '';
  const firstHourFromDecimal =
    employeeTiming?.shift_timing?.[0]?.hour_from ?? '';
  const firstHourToDecimal = employeeTiming?.shift_timing?.[0]?.hour_to ?? '';
  const formatDecimalTime = decimalTime => {
    if (decimalTime === '') return '';
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}`;
  };

  const formattedFirstHourFrom = formatDecimalTime(firstHourFromDecimal);
  const formattedFirstHourTo = formatDecimalTime(firstHourToDecimal);
  const [onHits,setOnhits]=useState(false)

  const halfTiming = (firstHourFromDecimal + firstHourToDecimal) / 2;
  const formattedHalfTiming = formatDecimalTime(halfTiming);
  const [leaveTypedown, setleavetypeDown] = useState(
    leaveRecord?.leave_time_from || null,
  );

  console.log('----->>', leaveTypedown);
  const shortLeaveTimingHandler = employeeTiming.short_leave_time || '';

  const hourToLimit = employeeTiming?.shift_timing?.[0]?.hour_to ?? 19;
  const leaveDuration = shortLeaveTimingHandler;
  const now = new Date();
  const currentHourDecimal = now.getHours() + now.getMinutes() / 60;

  const maxStart = hourToLimit - leaveDuration;
  const fromDecimal = Math.min(currentHourDecimal, maxStart);

  const toDecimal = Math.min(fromDecimal + leaveDuration, hourToLimit);

  const formattedFrom = formatDecimalTime(fromDecimal);
  const formattedTo = formatDecimalTime(toDecimal);
  const formattedDownFrom = formatDecimalTime(fromDecimal);
  const formattedDownTo = formatDecimalTime(toDecimal);
  // console.log(formattedHalfTiming, 'formatedd');

  const handleInputChange = (field, value) => {
    setLeaveDetails(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLeaveFromTO = async () => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.getLeaveFromTo,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {employeeCode: leaveRecord.employee_code},
        },
      );
      console.log('LeaveTo', response);
      setEmployeeTiming(response?.result);
      if (response && response.result) {
        const mapped = response.result?.leave_data.map(item => ({
          label: item.name,
          value: item.id,
        }));
        setLeaveTypes(mapped);

        if (leaveRecord?.leave_time_from) {
          const matchedType = mapped.find(
            item => item.label === leaveRecord.leave_time_from,
          );
          if (matchedType) {
            setFromLeaveType(matchedType.value);
            // setToLeaveType(matchedType.value);
            setleavetypefrom(matchedType.label);
            // setleavetypeto(matchedType.label);
          }
          const matchedTypeTo = mapped.find(
            item => item.label === leaveRecord.leave_time_to,
          );
          if (matchedTypeTo) {
            setToLeaveType(matchedTypeTo.value);
            setleavetypeto(matchedTypeTo.label);
          }
        }
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to load leave types');
    }
  };

  useEffect(() => {
    handleLeaveFromTO();
  
    // FROM Time setup (already working)
    if (leaveRecord?.leave_time_from === 'Short Leave') {
      setTimeFrom(formatTime(leaveRecord?.date_from_time_from) || '');
      setTimeTo(formatTime(leaveRecord?.date_to_time_to) || '');
    } else if (leaveRecord?.leave_time_from === 'Second Half') {
      setTimeFrom(formatTime(leaveRecord?.date_from_time_from || ''));
      setTimeTo(formatTime(leaveRecord?.date_from_time_to || ''));
    } else if (leaveRecord?.leave_time_from === 'First Half') {
      setTimeFrom(formatTime(leaveRecord?.date_from_time_from) || '');
      setTimeTo(formatTime(leaveRecord?.date_from_time_to) || '');
    }
  
    // ✅ TO Time setup for non-same day leaves
    if (!comparisionDate) {
      const shiftStartDecimal = employeeTiming.shift_timing?.[0]?.hour_from ?? 9;
      const shiftEndDecimal = employeeTiming.shift_timing?.[0]?.hour_to ?? 18;
      const midDecimal = (shiftStartDecimal + shiftEndDecimal) / 2;
      const shortLeaveDuration = employeeTiming.short_leave_time ?? 1;
  
      if (leaveTypedown === 'First Half') {
        setTimeFrom(formatTime(shiftStartDecimal));
        setTimeTo(formatTime(midDecimal));
      } else if (leaveTypedown === 'Second Half') {
        setTimeFrom(formatTime(midDecimal));
        setTimeTo(formatTime(shiftEndDecimal));
      } else if (leaveTypedown === 'Short Leave') {
        const now = new Date();
        const nowDecimal = now.getHours() + now.getMinutes() / 60;
        const maxStart = shiftEndDecimal - shortLeaveDuration;
        const from = Math.min(nowDecimal, maxStart);
        const to = Math.min(from + shortLeaveDuration, shiftEndDecimal);
        setTimeFrom(formatTime(from));
        setTimeTo(formatTime(to));
      }
    }
  }, []);
  
  const timeToDecimal = timeStr => {
    if (!timeStr) return null;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
  };
  const handleSubmit = async () => {
    if (!leaveDetails.date_from || !leaveDetails.date_to) {
      return Alert.alert('Validation', 'Please select both From and To dates');
    }

    if (
      leavetypeto === 'Short Leave' &&
      leaveDetails.date_from !== leaveDetails.date_to &&
      !comparisionDate
    ) {
      return Alert.alert(
        'Validation Error',
        'Short Leave can only be applied for a single day.',
      );
    }
    if (
      leavestypefrom === 'Second Half' &&
      leavetypeto === 'Second Half' &&
      leaveDetails.date_from !== leaveDetails.date_to &&
      !comparisionDate
    ) {
      return Alert.alert(
        'Validation Error',
        'Second Half leave cannot be applied on different dates.',
      );
    }
    
    if (
      !leaveRecord?.employee_name ||
      !leaveRecord?.employee_code ||
      !leaveDetails?.name ||
      !formattedFrom ||
      !formattedTo ||
      !fromLeaveType ||
      !toLeaveType
    ) {
      return Alert.alert('Error', 'Please fill all required fields');
    }

    // Calculate main timeFrom/timeTo
    let timeFromValue = null;
    let timeToValue = null;

    if (leavestypefrom === 'Short Leave') {
      timeFromValue = timeToDecimal(formattedFrom);
      timeToValue = timeToDecimal(formattedTo);
    } else if (leavestypefrom === 'First Half') {
      timeFromValue = timeToDecimal(formattedFirstHourFrom);
      timeToValue = timeToDecimal(formattedHalfTiming);
    } else if (leavestypefrom === 'Second Half') {
      timeFromValue = timeToDecimal(formattedHalfTiming);
      timeToValue = timeToDecimal(formattedFirstHourTo);
    }

    let timeFromValueDown = null;
    let timeToValueDown = null;

    if (leaveTypedown === 'Short Leave') {
      timeFromValueDown = timeToDecimal(formattedDownFrom);
      timeToValueDown = timeToDecimal(formattedDownTo);
    } else if (leaveTypedown === 'First Half') {
      timeFromValueDown = timeToDecimal(formattedFirstHourFrom);
      timeToValueDown = timeToDecimal(formattedHalfTiming);
    } else if (leaveTypedown === 'Second Half') {
      timeFromValueDown = timeToDecimal(formattedHalfTiming);
      timeToValueDown = timeToDecimal(formattedFirstHourTo);
    }

    const payload = {
      id: leaveRecord.id,
      name: leaveDetails.name,
      date_from: leaveDetails.date_from,
      date_to: leaveDetails.date_to,
      leave_time_from: leavestypefrom,
      leave_time_to: leavetypeto,
      timeFrom: timeFromValue,
      timeTo: timeToValue,
      time_from_down: comparisionDate ? timeFromValue : timeFromValueDown,
      time_to_down: comparisionDate ? timeToValue : timeToValueDown,
      selectedRestrictedLeaveID: '',
    };

    console.log('Payload Information', payload);
    try {
      const response = await fetch(saveEditData, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {leaveDetails: payload},
        }),
      });

      const result = await response.json();
      if (response.ok && result?.result?.success) {
        Alert.alert('Success', 'Leave details updated successfully!');
        navigation.goBack();
      } else {
        Alert.alert(
          'Error',
          result?.result?.error || 'Failed to update leave details.',
        );
      }
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleLeaveTypeTimeUpdate = label => {
    console.log('Calling');
    const shiftStartDecimal = employeeTiming.shift_timing[0]?.hour_from ?? 9;
    console.log(shiftStartDecimal, 'Start');
    const shiftEndDecimal = employeeTiming.shift_timing[0]?.hour_to ?? 18;
    const shortLeaveDuration = employeeTiming?.short_leave_time ?? 1;
    const midDecimal = (shiftStartDecimal + shiftEndDecimal) / 2;

    if (label === 'Short Leave') {
      const now = new Date();
      const nowDecimal = now.getHours() + now.getMinutes() / 60;
      const maxStart = shiftEndDecimal - shortLeaveDuration;
      const from = Math.min(nowDecimal, maxStart);
      const to = Math.min(from + shortLeaveDuration, shiftEndDecimal);
      console.log('Raw from===:', from, 'Formatted:', formatTime(from));
      console.log('Raw to:', to, 'Formatted:', formatTime(to));

      setTimeFrom(formatTime(from));
      setTimeTo(formatTime(to));
    } else if (label === 'First Half') {
      setTimeFrom(formatTime(shiftStartDecimal));
      setTimeTo(formatTime(midDecimal));
    } else if (label === 'Second Half') {
      setTimeFrom(formatTime(midDecimal));
      setTimeTo(formatTime(shiftEndDecimal));
    } else {
      setTimeFrom('');
      setTimeTo('');
    }
  };

  const formatTime = decimal => {
    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal - hours) * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}`;
  };

  return (
    <>
      <HeaderCompo
        title="Edit Leave Details"
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={styles.container(colorScheme)}>
          <Text
            style={{
              ...styles.text,
              color: isDarkMode ? COLORS.white : COLORS.black,
            }}>
            Employee Name
          </Text>
          <TextInput
            style={styles.input(colorScheme)}
            value={leaveDetails.employee_name}
            editable={false}
          />

          <Text
            style={{
              ...styles.text,
              color: isDarkMode ? COLORS.white : COLORS.black,
            }}>
            Employee ID
          </Text>
          <TextInput
            style={styles.input(colorScheme)}
            value={leaveDetails.employee_code}
            editable={false}
          />

          <Text
            style={{
              ...styles.text,
              color: isDarkMode ? COLORS.white : COLORS.black,
            }}>
            Description
          </Text>
          <TextInput
            style={[
              styles.input(colorScheme),
              {height: 80, textAlignVertical: 'top'},
            ]}
            value={leaveDetails.name}
            onChangeText={text => handleInputChange('name', text)}
            editable={isEditable}
            placeholder="Leave Description"
            placeholderTextColor="gray"
          />

          {/* From Date and Type */}

          <Text style={styles.label}>Date From*</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => {
              setCalendarTarget('from');
              setCalendarVisible(true);
            }}>
            <Text style={{color: COLORS.black}}>
              {leaveDetails.date_from || 'Select Date'}
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: isDarkMode ? COLORS.white : COLORS.black,
              fontSize: 14,
              fontWeight: '600',
            }}>
            Select Leave Type From
          </Text>
          <SingleDropdown
            data={leaveTypes}
            value={fromLeaveType}
            placeholder="Leave Type From"
            onChange={item => {
              setFromLeaveType(item.value);
              setToLeaveType(item.value);
              setleavetypefrom(item.label);
              setleavetypeto(item.label);
              handleLeaveTypeTimeUpdate(item.label);
              // handleLeaveTypeTimeUpdate(item.name)
            }}
            editable={isEditable}
          />

          {leavestypefrom === 'Short Leave' && (
            <>
              <Text style={styles.label}>Time From:</Text>
              {/* <TextinputCompo
              style={styles.input2}
              placeholder="HH:MM"
              value={timeFrom}
              onChangeText={setTimeFrom}
              placeholderTextColor={COLORS.black}
            />
            <Text style={styles.label}>Time To:</Text> */}
              {/* <TextinputCompo
              style={styles.input2}
              placeholder="HH:MM"
              value={timeTo}
              onChangeText={setTimeTo}
              placeholderTextColor={COLORS.black}
            /> */}
              <TextinputCompo
                style={styles.input2}
                placeholder="HH:MM"
                value={timeFrom}
                onChangeText={setTimeFrom}
              />
              <Text style={styles.label}>Time To:</Text>
              <TextinputCompo
                style={styles.input2}
                placeholder="HH:MM"
                value={timeTo}
                onChangeText={setTimeTo}
              />
            </>
          )}
          {leavestypefrom === 'First Half' && (
            <>
              <Text style={styles.label}>Time From:</Text>
              <TextinputCompo
                style={styles.input2}
                placeholder="HH:MM"
                value={timeFrom}
                onChangeText={setTimeFrom}
                placeholderTextColor={COLORS.black}
              />
              <Text style={styles.label}>Time To:</Text>
              <TextinputCompo
                style={styles.input2}
                placeholder="HH:MM"
                value={timeTo}
                onChangeText={setTimeTo}
                placeholderTextColor={COLORS.black}
              />
            </>
          )}
          {leavestypefrom === 'Second Half' && (
            <>
              <Text style={styles.label}>Time From:</Text>
              <TextinputCompo
                style={styles.input2}
                placeholder="HH:MM"
                value={timeFrom}
                onChangeText={setTimeFrom}
                placeholderTextColor={COLORS.black}
              />
              <Text style={styles.label}>Time To:</Text>
              <TextinputCompo
                style={styles.input2}
                placeholder="HH:MM"
                value={timeTo}
                onChangeText={setTimeTo}
                placeholderTextColor={COLORS.black}
              />
            </>
          )}

          {/* To Date and Type */}

          <Text style={styles.label}>Date To*</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => {
              setCalendarTarget('to');
              setCalendarVisible(true);
            }}>
            <Text style={{color: COLORS.black}}>
              {leaveDetails.date_to || 'Select Date'}
            </Text>
          </TouchableOpacity>

          {!comparisionDate && (
            <>
              <Text
                style={{
                  color: isDarkMode ? COLORS.white : COLORS.black,
                  fontSize: 14,
                  fontWeight: '600',
                }}>
                Select Leave Type To
              </Text>
              <SingleDropdown
                data={leaveTypes}
                value={toLeaveType}
                placeholder="Leave Type To"
                onChange={item => {
                  setToLeaveType(item.value);
                  setleavetypeto(item.label);
                  // setleavetypeDown(item.label)
                  setleavetypeDown(item.label);
                  setleavetypeDown(item.label);
                  setOnhits(true)

                  // handleLeaveTypeTimeUpdate(item.label);
                }}
                editable={isEditable}
              />
            </>
          )}

          {/* Short Leave Times */}

          {onHits&&leaveTypedown === 'First Half' && (
            <>
              <Text style={styles.label}>Time From:</Text>
              <TextinputCompo
                style={styles.input2}
                placeholder="HH:MM"
                value={formattedFirstHourFrom}
                onChangeText={setTimeFrom}
                placeholderTextColor={COLORS.black}
              />
              <Text style={styles.label}>Time To:</Text>
              <TextinputCompo
                style={styles.input2}
                placeholder="HH:MM"
                value={formattedHalfTiming}
                onChangeText={setTimeTo}
                placeholderTextColor={COLORS.black}
              />
            </>
          )}
          {onHits&&leaveTypedown === 'Second Half' && (
            <>
              <Text style={styles.label}>Time From:</Text>
              <TextinputCompo
                style={styles.input2}
                placeholder="HH:MM"
                value={formattedHalfTiming}
                onChangeText={setTimeFrom}
                placeholderTextColor={COLORS.black}
              />
              <Text style={styles.label}>Time To:</Text>
              <TextinputCompo
                style={styles.input2}
                placeholder="HH:MM"
                value={formattedFirstHourTo}
                onChangeText={setTimeTo}
                placeholderTextColor={COLORS.black}
              />
            </>
          )}

          {/* Submit Button */}
          {isEditable && (
            <TouchableOpacity
              style={styles.saveButton(colorScheme)}
              onPress={handleSubmit}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          )}

          {/* Calendar Modal */}
          <Modal visible={isCalendarVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.calendarWrapper}>
                <Calendar
                  onDayPress={day => {
                    const selected = day.dateString;
                    if (calendarTarget === 'from') {
                      setLeaveDetails(prev => ({...prev, date_from: selected}));
                    } else {
                      setLeaveDetails(prev => ({...prev, date_to: selected}));
                    }
                    setCalendarVisible(false);
                  }}
                  markedDates={{
                    [leaveDetails.date_from]: {
                      selected: true,
                      selectedColor: 'blue',
                    },
                    [leaveDetails.date_to]: {
                      selected: true,
                      selectedColor: 'green',
                    },
                  }}
                  theme={{
                    calendarBackground: isDarkMode
                      ? COLORS.black
                      : COLORS.white,
                    dayTextColor: isDarkMode ? 'white' : 'black',
                    monthTextColor: isDarkMode ? 'white' : 'black',
                    arrowColor: isDarkMode ? 'white' : 'black',
                    textSectionTitleColor: isDarkMode ? 'white' : 'black',
                  }}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setCalendarVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: colorScheme => ({
    flex: 1,
    padding: 20,
    backgroundColor: colorScheme === 'dark' ? '#121212' : COLORS.BACKGROUND,
  }),
  input: colorScheme => ({
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? 'white' : 'gray',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: COLORS.black,
    backgroundColor: COLORS.white,
  }),
  input2: {
    height: 50,
    borderColor: COLORS.white,
    marginBottom: 10,
    paddingHorizontal: 15,
    color: COLORS.black,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '30%',
    marginBottom: 5,
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  dateInput: {
    // width: '28%',
    height: 48,
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    // alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  saveButton: colorScheme => ({
    backgroundColor: colorScheme === 'dark' ? 'blue' : 'darkblue',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  }),
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  calendarWrapper: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: 350,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default EditLeaveData;
// Jamshed start 
