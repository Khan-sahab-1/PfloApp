// Jamshed start bug id 2555
// Description: This file defines the Termandcondition component, which allows users to view, add, edit, and delete terms and conditions associated with a specific enquiry. The component retrieves initial terms data from the navigation parameters and displays it in a scrollable list. Users can click on an edit icon to modify existing terms or a button to add new terms, which opens a modal for input. The component handles API calls to save changes to the server and updates the local state accordingly. It also includes error handling and loading states to enhance the user experience.
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect} from 'react';
import HeaderCompo from '../components/HeaderCompo';
import {COLORS} from '../styles/Colors';
import Termandconditions from '../components/Modaals/Termandconditions';
import makeApiCall from '../utils/apiHelper';
import {AuthContext} from './Context';
import urls from '../../url';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {showFlashMessage} from '../utils/fleshmessage';

const Termandcondition = ({route, navigation}) => {
  const {enquiryId} = route.params;
  const remarkId = route?.params?.enquiryId?.id || '';
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editItemId, setEditItemId] = React.useState(null);
  const [termsData, setTermsData] = React.useState({
    query: '',
    parameter: '',
  });
  const [allTerms, setAllTerms] = React.useState([]);

  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;

  // Initialize terms from enquiryId
  const initialTerms = enquiryId?.terms_lines
    ? Object.values(enquiryId.terms_lines)
    : [];

  // Load initial terms
  useEffect(() => {
    setAllTerms(initialTerms);
  }, [enquiryId]);

  const handleEditClick = item => {
    console.log(item, 'Itemmmmmm-----');
    // Set edit mode and populate data
    setIsEditMode(true);
    setEditItemId(item.tcLineId);
    setTermsData({
      query: item.description || '',
      parameter: item.remark_parameter_id || item.parameter_id || '',
    });
    setIsOpenModal(true);
  };

  const handleAddClick = () => {
    // Reset to create mode
    setIsEditMode(false);
    setEditItemId(null);
    setTermsData({
      query: '',
      parameter: '',
    });
    setIsOpenModal(true);
  };

  const handleSave = async data => {
    console.log('data', data);
    try {
      setIsLoading(true);

      if (data?.query === '' || data?.parameter === '') {
        Alert.alert('Error', 'All fields are required');
        return;
      }

      const params = {
        id: remarkId,
        query: data?.query,
        parameter: data?.parameter,
        ...(isEditMode && editItemId && {tcLineId: editItemId}), // Use tcLineId for edit
      };

      console.log(
        'Saving params:',
        params,
        'Mode:',
        isEditMode ? 'EDIT' : 'CREATE',
      );

      const apiUrl = isEditMode ? urls.editenquerytc : urls.createtenquerytc;

      const res = await makeApiCall(server_origin, apiUrl, 'POST', {
        jsonrpc: '2.0',
        method: 'call',
        params: params,
      });

      console.log('API Response:', res);

      if (res.error) {
        Alert.alert('Error', res.error.message || 'Something went wrong');
        return;
      }

      // Update local state based on response
      if (res.result?.success === true) {
        showFlashMessage({
          message: 'Success',
          description: isEditMode
            ? 'Term updated successfully'
            : 'Term added successfully',
          type: 'success',
          duration: 3000,
        });
        navigation.pop(2);

        if (isEditMode) {
          // Update existing item
          setAllTerms(prev =>
            prev.map(item =>
              item.tcLineId === editItemId ||
              item.id === editItemId ||
              item.remark_parameter_id === editItemId
                ? {
                    ...item,
                    description: data.query,
                    parameter_id: data.parameter,
                  }
                : item,
            ),
          );
        } else {
          // Add new item (temporary until you refresh from server)
          const newTerm = {
            tcLineId: res.result.tcLineId || Date.now(), // Use API response if available
            description: data.query,
            parameter_id: data.parameter,
            parameter_name: `Parameter ${data.parameter}`,
          };
          setAllTerms(prev => [...prev, newTerm]);
        }
      }

      setIsOpenModal(false);
      // Reset modal state
      setIsEditMode(false);
      setEditItemId(null);
      setTermsData({query: '', parameter: ''});
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'Failed to save term');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async item => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this term?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              // Call delete API if available
              // const res = await makeApiCall(...);
              // Remove from local state
              setAllTerms(prev =>
                prev.filter(
                  term =>
                    term.id !== item.id &&
                    term.term_id !== item.term_id &&
                    term.remark_parameter_id !== item.remark_parameter_id,
                ),
              );
            } catch (error) {
              console.log(error);
              Alert.alert('Error', 'Failed to delete term');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <>
      <HeaderCompo
        title="Terms & Conditions"
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.BLUE} />
        </View>
      )}

      <ScrollView style={styles.container}>
        {/* <Text style={styles.header}>Terms & Conditions</Text> */}

        {allTerms.length > 0 ? (
          allTerms.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.row}>
                <View style={{flex: 1}}>
                  <Text style={styles.title}>
                    Parameter:{' '}
                    {item?.parameter_name ||
                      `Parameter ${
                        item?.parameter_id || item?.remark_parameter_id
                      }`}
                  </Text>
                  <Text style={styles.description}>
                    Description: {item?.description}
                  </Text>
                </View>
                <View style={styles.actionButtons}>
                  <Icon
                    name="edit"
                    size={20}
                    color="#555"
                    style={{marginRight: 15}}
                    onPress={() => handleEditClick(item)}
                  />
                  {/* <Icon
                    name="delete"
                    size={20}
                    color="#FF3B30"
                    onPress={() => handleDelete(item)}
                  /> */}
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No Terms Found</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.bottombutton}
        onPress={handleAddClick}
        disabled={isLoading}>
        <Text style={styles.bottombuttonText}>Add item</Text>
      </TouchableOpacity>

      {isOpenModal && (
        <Termandconditions
          isvisible={isOpenModal}
          onclose={() => {
            setIsOpenModal(false);
            setIsEditMode(false);
            setEditItemId(null);
            setTermsData({query: '', parameter: ''});
          }}
          onSave={handleSave}
          initialData={termsData}
          isEditMode={isEditMode}
        />
      )}
    </>
  );
};

export default Termandcondition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    color: '#222',
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
    justifyContent: 'space-between',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  noData: {
    marginTop: 40,
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
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
// Jamshed end bug id 2555
