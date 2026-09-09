//bug id 2822 Jamshed start
// Description: Added a new single dropdown component that allows users to select a single option from a list. The component is built using the 'react-native-element-dropdown' library and includes custom styling, search functionality, and support for labels. It is designed to be reusable and can be integrated into various parts of the app where single selection is needed.
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { COLORS } from '../styles/Colors';


const SingleDropdown = React.memo(({
  data,
  value,
  onChange,
  placeholder,
  style,
  label,
  search = true
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Dropdown
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        onChange={onChange}
        search={search}
        searchPlaceholder={`Search ${placeholder}...`}
        placeholder={placeholder}
        style={[styles.dropdown, style]}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        inputSearchStyle={styles.searchInput}
        itemTextStyle={styles.itemText}
        containerStyle={styles.dropdownContainer}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.black,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: COLORS.black,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#999',
  },
  selectedText: {
    color: COLORS.black,
  },
  searchInput: {
    height: 40,
    color: COLORS.black,
    backgroundColor: '#fff',
  },
  itemText: {
    color: COLORS.black,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
});

export default SingleDropdown;
// Jamshed Ali Added End - Bug ID 2555
