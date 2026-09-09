// Jamshed start 
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

const LeaveForm = ({ record, onCloseForm }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <Text style={[styles.cardText, isDarkMode && styles.cardTextDark]}>
        {record.employee_name} ({record.designation})
      </Text>
      <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
        Description: {record.name}
      </Text>
      <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
        NO Of Days: {record.number_of_days}
      </Text>
      {/* <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
        NO Of Days: {record.number_of_days} Leave Type: {record.leave_type}
      </Text> */}
      <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
        Start Date: {formatDate(record.date_from)} - {record.leave_time_from}
      </Text>
      <Text style={[styles.detailsText, isDarkMode && styles.detailsTextDark]}>
        End Date: {formatDate(record.date_to)} - {record.leave_time_to}
      </Text>
      <TouchableOpacity style={styles.button} onPress={onCloseForm}>
        <Text style={styles.buttonText}>Close Form</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    margin: 20,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  containerDark: {
    backgroundColor: 'black',
    borderColor: 'darkgray',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardTextDark: {
    color: 'white',
  },
  detailsText: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  detailsTextDark: {
    color: 'lightgray',
  },
});

export default LeaveForm;

// Jamshed start 



