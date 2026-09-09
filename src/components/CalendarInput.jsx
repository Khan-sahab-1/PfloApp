//bug id 2822 Jamshed start
// Description: Added a reusable calendar input component that integrates with a date picker modal. The component allows users to select a date, which is then formatted and sent back to the parent component through a callback function. The input field is styled and displays the selected date in a user-friendly format.
import React, {useState} from 'react';
import {TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {create} from 'react-test-renderer';
import {COLORS} from '../styles/Colors';

const CalendarInput = ({value, onChange, style}) => {
  const toDay = new Date().toISOString().split('T')[0];
  const [extraInfo, setExtraInfo] = useState(value );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = date => {
    const formatted = date.toISOString().split('T')[0]; // YYYY-MM-DD
    setExtraInfo(formatted);
    onChange && onChange(formatted); // 🔥 SEND DATE TO PARENT
    hideDatePicker();
  };

  return (
    <>
      <TouchableOpacity onPress={showDatePicker}>
        <TextInput
          style={[styles.input, style]}
          placeholder="Date"
          placeholderTextColor={COLORS.PLACEHOLDER}
          value={extraInfo}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
};

export default CalendarInput;

const styles = StyleSheet.create({
  input: {
    color: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.black,
    padding: 10,
    borderRadius: 6,
    paddingBottom: 10,
  },
});
//bug id 2822 Jamshed end
