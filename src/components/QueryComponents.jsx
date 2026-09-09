// bug id 2822 Jamshed start
// Description: Added a new component for managing queries related to leads/enquiries. The component includes a list of existing queries with details such as query text, response, raised date, and resolved date. Users can create new queries or edit existing ones through a modal interface. The component interacts with the backend API to fetch, create, and update query data, ensuring that all operations are performed smoothly and efficiently. The UI is designed to be user-friendly and visually appealing, making it easy for users to manage their queries effectively.
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useContext} from 'react';
import {COLORS} from '../styles/Colors';
import QueryModal from './Modaals/QueryModal';
import HeaderCompo from './HeaderCompo';
import makeApiCall from '../utils/apiHelper';
import {AuthContext} from '../Screens/Context';
import urls from '../../url';
import Feather from 'react-native-vector-icons/Feather';
import navigationString from '../route/navigationString';

const QueryComponents = ({route, navigation}) => {
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingQuery, setEditingQuery] = React.useState(null);
  // console.log(route?.params?.enquiryId?.query_lines, 'Route');

  const remarkId = route?.params?.enquiryId?.id || '';

  const query_lines = route?.params?.enquiryId?.query_lines || {};
  const queryList = Object.values(query_lines);
  const contextType = useContext(AuthContext);
  const [queryData, setQueryData] = React.useState({
    query: '',
    response: '',
    solution: '',
    queryRaisedDate: '',
    queryClosedDate: '',
  });

  const server_origin = contextType.currentUrl;

  const createEnquery = async data => {
    try {
      // Validate required fields
      if (!data.query || !data.query.trim()) {
        Alert.alert('Error', 'Query field is required');
        return;
      }

      const res = await makeApiCall(
        server_origin,
        urls.createEnquiryQuery,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            query: data.query,
            response: data.response,
            solution: data.solution||null,
            queryRaisedDate: data.queryRaisedDate,
            queryClosedDate: data.queryClosedDate,
            remarkId,
          },
        },
      );
      // console.log(res, 'Create Query Response');
      if (res?.result?.success == true) {
        alert('Remark Created Successfully');
        navigation.pop(3);
      } else {
        Alert.alert('Error');
      }
      if (res.error) {
        console.log(res.error);
        Alert.alert('Error', res.error.message || 'Failed to create query');
        return;
      }
      setIsOpenModal(false);
      setIsEditMode(false);
      setEditingQuery(null);

      // Show success message
      Alert.alert('Success', 'Query created successfully');

      // Optionally refresh the data or navigate back
      // You can add a refresh function here if needed
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const updateQuery = async data => {
    try {
      // Validate required fields
      if (!data.query || !data.query.trim()) {
        Alert.alert('Error', 'Query field is required');
        return;
      }

      // Get the correct query line ID for editing
      const queryLineId = editingQuery?.id || editingQuery?.remarkLineId;
      if (!queryLineId) {
        Alert.alert('Error', 'Cannot find query ID for update');
        return;
      }
      const payload = {
        remarkLineId: queryLineId,
        query: data.query,
        response: data.response,
        solution: data.solution || false,
        queryRaisedDate: data.queryRaisedDate,
        queryClosedDate: data.queryClosedDate,
        remarkId,
      };
      // console.log(payload, 'PAYLOAD');
      const res = await makeApiCall(
        server_origin,
        urls.createEnquiryQuery,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: payload,
        },
      );
      // console.log(res, 'Update Query Response');
      if (res?.result?.success == true) {
        // alert('Remark Created Successfully');
        navigation.pop(3);
      } else {
        Alert.alert(res?.result?.message, 'Error');
      }

      if (res?.result?.error) {
        // console.log(res.error);
        Alert.alert('Error', res.error.message || 'Failed to update query');
        return;
      }
      setIsOpenModal(false);
      setIsEditMode(false);
      setEditingQuery(null);

      // Show success message
      // Alert.alert('Success', 'Query updated successfully');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleEdit = item => {
    console.log('Editing item:', item);
    setEditingQuery(item);
    setIsEditMode(true);

    // Don't update queryData state here, pass directly to modal
    setIsOpenModal(true);
  };

  const handleSave = data => {
    console.log('Save data received:', data);

    // Validate data here as well
    if (!data.query || !data.query.trim()) {
      Alert.alert('Validation Error', 'Query is required');
      return; // Don't proceed if query is empty
    }

    if (isEditMode) {
      updateQuery(data);
    } else {
      createEnquery(data);
    }
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setIsEditMode(false);
    setEditingQuery(null);
  };

  return (
    <>
      <HeaderCompo
        title="Queries"
        onPress={() => navigation.goBack()}
        lefticon={require('../assets/back.png')}
      />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{paddingBottom: 100}}>
          {/* <Text style={styles.heading}>Query List</Text> */}

          {queryList.length > 0 ? (
            queryList.map((item, index) => (
              <View key={index} style={styles.card}>
                {/* Top Row: Title + Edit Icon */}
                <View style={styles.topRow}>
                  <Text style={styles.title}>Query Details</Text>

                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Feather name="edit-3" size={20} color="#007bff" />
                  </TouchableOpacity>
                </View>

                {/* Card Content */}
                <View style={styles.row}>
                  <Text style={styles.title}>Query</Text>
                  <Text style={styles.value}>{item.query || '—'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.title}>Response</Text>
                  <Text style={styles.value}>{item.response || '—'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.title}>Raised Date</Text>
                  <Text style={styles.value}>
                    {item.query_raised_date || '—'}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.title}>Resolved Date</Text>
                  <Text style={styles.value}>
                    {item.query_resolved_date || '—'}
                  </Text>
                </View>
                <Text style={styles.status(item.resolved)}>
                  {item.resolved ? 'Resolved' : 'Pending'}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noData}>No Queries Found</Text>
          )}
        </ScrollView>

        {/* Bottom Create Query Button */}
        <TouchableOpacity
          style={styles.bottombutton}
          onPress={() => {
            setIsEditMode(false);
            setEditingQuery(null);
            setIsOpenModal(true);
          }}>
          <Text style={styles.bottombuttonText}>Create Query</Text>
        </TouchableOpacity>

        {/* Modal */}
        {isOpenModal && (
          <QueryModal
            isvisible={isOpenModal}
            onclose={handleCloseModal}
            onSave={handleSave}
            isEditMode={isEditMode}
            initialData={
              editingQuery
                ? {
                    query: editingQuery.query || '',
                    response: editingQuery.response || '',
                    solution: editingQuery.resolved || false,
                    queryRaisedDate:
                      editingQuery.query_raised_date ||
                      new Date().toISOString().split('T')[0],
                    queryClosedDate:
                      editingQuery.query_resolved_date ||
                      new Date().toISOString().split('T')[0],
                  }
                : null
            }
            queryId={editingQuery?.remarkLineId}
          />
        )}
      </View>
    </>
  );
};

export default QueryComponents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 10,
  },

  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.black,
    marginVertical: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },

  value: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 4,
  },

  status: resolved => ({
    marginTop: 10,
    fontSize: 16,
    fontWeight: '700',
    color: resolved ? 'green' : 'red',
  }),

  noData: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.DARK_GRAY,
  },

  bottombutton: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    height: 60,
    width: 150,
    backgroundColor: COLORS.BLUE,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  bottombuttonText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
  },
});
//bug id 2822 Jamshed end
