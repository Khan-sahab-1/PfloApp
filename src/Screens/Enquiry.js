// Jamshed start 
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { AuthContext } from './Context';
import urls from '../../url';

const EnquiryListScreen = ({ navigation, route }) => {
  const employeeCode = route?.params?.employeeCode || '';
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const fetchEnquiryUrl = server_origin + urls.fetchEnquiry;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(fetchEnquiryUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'call',
            params: {
              employeeCode,
            },
          }),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();
        setEnquiries(result.result);
        setFilteredEnquiries(result.result);
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      }
    };

    fetchEnquiries();
  }, []);

  const filterEnquiries = (status) => {
    setSelectedStatus(status);
    if (status === 'all') {
      setFilteredEnquiries(enquiries);
    } else {
      const filtered = enquiries.filter(item => item.status === status);
      setFilteredEnquiries(filtered);
    }
  };

  const renderEnquiryCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('EditEnquiryPage', { enquiryData: item })}
    >
      <View style={[styles.card, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}> 
        <Text style={styles.cardText}>Enq No: {item.enquiry_number}  Status: {item.status}</Text>
        <Text style={styles.cardText}>Date: {item.enquiry_date}</Text>
        <Text style={styles.cardText}>Customer: {item.customer}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Enquiry List</Text>
      </View>

      <View style={styles.filterContainer}>
        {['draft', 'sent_for_review', 'sent', 'approved'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, selectedStatus === status && styles.activeButton]}
            onPress={() => filterEnquiries(status)}
          >
            <Text style={[styles.filterText, selectedStatus === status && styles.activeText]}>
            {status === 'draft' ? 'Draft' : 
               status === 'sent_for_review' ? 'Sent for Review' : 
               status === 'sent' ? 'Confirmed' : 
               status === 'approved' ? 'Approved' : 'All'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateEnquiryPage')}
      >
        <Text style={styles.createButtonText}>Create Enquiry</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredEnquiries}
        renderItem={renderEnquiryCard}
        keyExtractor={(item) => item.enquiry_number.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default EnquiryListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    backgroundColor: 'blue',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: 'blue',
  },
  filterText: {
    color: 'white',
  },
  activeText: {
    color: 'white',
  },
  createButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

// Jamshed start 