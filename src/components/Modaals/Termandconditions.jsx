//bug id 2822 Jamshed start
// Description: Added a reusable modal component for adding and editing terms and conditions with parameter selection and description input. The modal fetches parameter options from the server, initializes form data based on props, and provides user feedback on validation errors during save operations.
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import TextinputCompo from '../TextinputCompo';
import {COLORS} from '../../styles/Colors';
import SingleDropdown from '../SingleDropdown';
import {useSelector} from 'react-redux';
import makeApiCall from '../../utils/apiHelper';
import {AuthContext} from '../../Screens/Context';
import urls from '../../../url';

const Termandconditions = ({isvisible, onclose, onSave, initialData, isEditMode}) => {
  const user = useSelector(state => state.user.userDatainfo);
  const [remarksparameter, setremarksparameter] = useState([]);
  const [selectedParameter, setselectedParameter] = useState(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;

  // Initialize form with initialData when modal opens
  useEffect(() => {
    if (isvisible && initialData) {
      setselectedParameter(initialData.parameter);
      setQuery(initialData.query);
    } else {
      setselectedParameter(null);
      setQuery('');
    }
  }, [isvisible, initialData]);

  const fetchTermConditioperameter = async () => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchtermsconditionsperameter,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {resUser: user?.result?.res_user || {}},
        },
      );
      
      if (response.result && Array.isArray(response.result)) {
        const divisionInfoData = response.result.map(item => ({
          label: item.remark_parameter_name,
          value: item.remark_parameter_id,
        }));
        setremarksparameter(divisionInfoData);
      }
    } catch (error) {
      console.log(error, 'Error fetching Account info');
    }
  };

  useEffect(() => {
    fetchTermConditioperameter();
  }, []);

  const handleSave = async () => {
    if (!selectedParameter || !query.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const data = {
      query: query.trim(),
      parameter: selectedParameter,
    };

    setIsLoading(true);
    try {
      if (onSave) {
        await onSave(data);
        onclose();
      }
    } catch (error) {
      console.log('Error in handleSave:', error);
      Alert.alert('Error', 'Failed to save term');
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedParameterLabel = () => {
    const selected = remarksparameter.find(item => item.value === selectedParameter);
    return selected ? selected.label : '';
  };

  return (
    <Modal
      visible={isvisible}
      animationType="slide"
      transparent
      onRequestClose={onclose}>
      {/* BACKDROP */}
      <TouchableWithoutFeedback onPress={onclose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* MODAL BOX */}
      <View style={styles.modalContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.modalTitle}>
            {isEditMode ? 'Edit Term' : 'Add New Term'}
          </Text>
          
          <Text style={styles.title}>Parameter</Text>
          <SingleDropdown
            data={remarksparameter}
            placeholder="Select Parameter"
            value={selectedParameter}
            onChange={item => setselectedParameter(item.value)}
          />
          
          {selectedParameter && (
            <Text style={styles.selectedText}>
              Selected: {getSelectedParameterLabel()}
            </Text>
          )}

          <Text style={styles.title}>Description</Text>
          <TextinputCompo
            placeholder="Enter description"
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={COLORS.gray}
            style={styles.input}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={styles.buttonContainer}>
            <Pressable 
              style={[styles.saveBtn, isLoading && styles.disabledBtn]} 
              onPress={handleSave}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.btnText}>
                  {isEditMode ? 'Update' : 'Save'}
                </Text>
              )}
            </Pressable>

            <Pressable 
              style={[styles.closeBtn, isLoading && styles.disabledBtn]} 
              onPress={onclose}
              disabled={isLoading}>
              <Text style={styles.btnText}>Close</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default Termandconditions;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.BLUE,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  selectedText: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: COLORS.lightgray,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    color: COLORS.black,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  saveBtn: {
    backgroundColor: COLORS.BLUE,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  closeBtn: {
    backgroundColor: COLORS.RED,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
//bug id 2822 Jamshed end
