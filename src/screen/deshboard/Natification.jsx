// Jamshed start bug id 2555
import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // ✅ for non-Expo
import HeaderCompo from '../../components/HeaderCompo';
; // or 'react-native-vector-icons/Ionicons'

const notifications = [
  {
    id: '1',
    title: 'Leave Approved',
    message: 'Your leave request for 12 May has been approved.',
    time: '2 hours ago',
  },
  {
    id: '2',
    title: 'New Calendar Event',
    message: 'Company meeting added to calendar on 15 May.',
    time: '1 day ago',
  },
  {
    id: '3',
    title: 'Attendance Reminder',
    message: 'Don’t forget to mark today’s attendance.',
    time: '3 days ago',
  },
];

const NotificationScreen = () => {
  const renderItem = ({ item }) => (
    <>
     
    <View style={styles.card}>
      <Ionicons name="notifications-outline" size={24} color="#007bff" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
    </>
  );

  return (
    <>
    <HeaderCompo title={'CRM'}/>
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
    </>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
  },
  message: {
    color: '#555',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});
// Jamshed end bug id 2555