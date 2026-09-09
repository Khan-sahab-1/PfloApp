//bug id 2822 Jamshed start
// Description: Added a reusable modal component for creating and editing queries with form validation, date pickers, and a checkbox for resolved status. The modal supports both create and edit modes, initializes form data based on props, and provides user feedback on validation errors.
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import CalendarInput from '../CalendarInput';
import {COLORS} from '../../styles/Colors';
import TextinputCompo from '../TextinputCompo';
import CheckBox from '@react-native-community/checkbox';

const QueryModal = ({
  isvisible,
  onclose,
  onSave,
  isEditMode = false,
  initialData = null,
  queryId = null,
}) => {
  const [formData, setFormData] = useState({
    query: '',
    response: '',
    queryRaisedDate: '',
    queryClosedDate: '',
    solution: false,
  });
  const [errors, setErrors] = useState({});
  const [isactive, setIsactive] = useState(false);

  const toDay = new Date().toISOString().split('T')[0];

  // Initialize form with initialData when modal opens
  useEffect(() => {
    if (isvisible) {
      if (initialData) {
        setFormData({
          query: initialData.query || '',
          response: initialData.response || '',
          queryRaisedDate: initialData.queryRaisedDate || toDay,
          queryClosedDate: initialData.queryClosedDate || toDay,
          solution: initialData.solution || false,
        });
      } else {
        setFormData({
          query: '',
          response: '',
          queryRaisedDate: toDay,
          queryClosedDate: toDay,
          solution: false,
        });
      }
      setErrors({}); // Clear errors when modal opens
    }
  }, [isvisible, initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.query || !formData.query.trim()) {
      newErrors.query = 'Query is required';
    }

    // You can add more validations here

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    console.log('DATA INSIDE MODAL:', formData);

    if (onSave) {
      onSave(formData);
      onclose();
    }
  };

  const handleClose = () => {
    setFormData({
      query: '',
      response: '',
      queryRaisedDate: toDay,
      queryClosedDate: toDay,
    });
    setErrors({});
    onclose();
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <Modal
      visible={isvisible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}>
      {/* BACKDROP */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* MODAL BOX */}
      <View style={styles.modalContent}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditMode ? 'Edit Query' : 'Create Query'}
            </Text>
            {isEditMode && queryId && (
              <Text style={styles.queryId}>ID: {queryId}</Text>
            )}
          </View>

          <Text style={styles.normalText}>Query *</Text>
          <TextinputCompo
            placeholder="Enter your query"
            value={formData.query}
            onChangeText={text => updateFormData('query', text)}
            placeholderTextColor={COLORS.gray}
            style={[styles.input, errors.query && styles.inputError]}
            multiline={true}
            numberOfLines={3}
          />
          {errors.query && <Text style={styles.errorText}>{errors.query}</Text>}

          <Text style={styles.normalText}>Response</Text>
          <TextinputCompo
            placeholder="Enter response"
            value={formData.response}
            onChangeText={text => updateFormData('response', text)}
            placeholderTextColor={COLORS.gray}
            style={styles.input}
            multiline={true}
            numberOfLines={3}
          />
          <Text style={styles.normalText}>Resolved</Text>
          <CheckBox
            disabled={false}
            value={formData.solution}
            onValueChange={newValue => updateFormData('solution', newValue)}
          />

          <Text style={styles.normalText}>Query Raised Date</Text>
          <CalendarInput
            value={formData.queryRaisedDate}
            onChange={v => updateFormData('queryRaisedDate', v)}
            placeholder="Select Raised Date"
            styles={styles}
            COLORS={COLORS}
          />

          <Text style={styles.normalText}>Query Resolved Date</Text>
          <CalendarInput
            value={formData.queryClosedDate}
            onChange={v => updateFormData('queryClosedDate', v)}
            placeholder="Select Closed Date"
            styles={styles}
            COLORS={COLORS}
          />

          <View style={styles.buttonContainer}>
            <Pressable style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.btnText}>
                {isEditMode ? 'Update' : 'Save'}
              </Text>
            </Pressable>

            <Pressable style={styles.closeBtn} onPress={handleClose}>
              <Text style={styles.btnText}>Close</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default QueryModal;

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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '100%',
  },
  scrollContent: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  queryId: {
    fontSize: 12,
    color: COLORS.gray,
  },
  input: {
    minHeight: 45,
    borderWidth: 1,
    borderColor: COLORS.lightgray,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 8,
    color: COLORS.black,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 15,
  },
  saveBtn: {
    backgroundColor: COLORS.BLUE,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  closeBtn: {
    backgroundColor: COLORS.RED,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  normalText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: COLORS.black,
  },
});
//bug id 2822 Jamshed end
