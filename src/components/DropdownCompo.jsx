import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import { COLORS } from '../styles/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const DropdownCompo = React.memo(({
  data,
  selectedValues,
  onValueChange,
  placeholder,
  style,
  loading,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSelectItem = (itemValue) => {
    let newSelectedValues;
    if (selectedValues.includes(itemValue)) {
      // Remove if already selected
      newSelectedValues = selectedValues.filter(v => v !== itemValue);
    } else {
      // Add new selection
      newSelectedValues = [...selectedValues, itemValue];
    }
    onValueChange(newSelectedValues);
    
    // Auto close after selection
    setTimeout(() => {
      setModalVisible(false);
      setSearchText('');
    }, 100);
  };

  const getSelectedLabels = () => {
    const selectedItems = data.filter(item => selectedValues.includes(item.value));
    return selectedItems.map(item => item.label);
  };

  const handleRemoveItem = (itemValue) => {
    const newSelectedValues = selectedValues.filter(v => v !== itemValue);
    onValueChange(newSelectedValues);
  };

  const filteredData = data.filter(item => 
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const isSelected = selectedValues.includes(item.value);
    return (
      <TouchableOpacity
        style={[styles.item, isSelected && styles.selectedItem]}
        onPress={() => handleSelectItem(item.value)}
      >
        <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
          {item.label}
        </Text>
        {isSelected && (
          <Icon name="checkmark" size={20} color="white" />
        )}
      </TouchableOpacity>
    );
  };

  // Get selected items for display
  const selectedLabels = getSelectedLabels();
  const hasSelectedItems = selectedLabels.length > 0;

  return (
    <View>
      {loading ? (
        <View style={[styles.dropdown, style, styles.loadingContainer]}>
          <ActivityIndicator size="small" color="gray" />
        </View>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => !disabled && setModalVisible(true)}
            disabled={disabled}
            style={[styles.dropdown, style, disabled && styles.disabledDropdown]}
          >
            <View style={styles.dropdownContent}>
              {hasSelectedItems ? (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.selectedItemsContainer}
                >
                  {selectedLabels.map((label, index) => (
                    <View key={index} style={styles.selectedItemChip}>
                      <Text style={styles.selectedItemChipText} numberOfLines={1}>
                        {label}
                      </Text>
                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          const selectedItem = data.find(item => item.label === label);
                          if (selectedItem) {
                            handleRemoveItem(selectedItem.value);
                          }
                        }}
                        style={styles.removeButton}
                      >
                        <Icon name="close" size={14} color={COLORS.black} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.placeholderText}>
                  {placeholder}
                </Text>
              )}
              <Icon name="chevron-down" size={20} color={COLORS.PLACEHOLDER} style={styles.dropdownIcon} />
            </View>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {
              setModalVisible(false);
              setSearchText('');
            }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                {/* Header with selected count */}
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>{placeholder}</Text>
                    {hasSelectedItems && (
                      <Text style={styles.selectedCount}>
                        {selectedLabels.length} selected
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setSearchText('');
                    }}
                  >
                    <Icon name="close" size={24} color={COLORS.black} />
                  </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                  <Icon name="search" size={20} color={COLORS.PLACEHOLDER} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    placeholderTextColor={COLORS.PLACEHOLDER}
                    value={searchText}
                    onChangeText={setSearchText}
                    autoFocus={true}
                  />
                  {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText('')}>
                      <Icon name="close-circle" size={20} color={COLORS.PLACEHOLDER} />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Items List */}
                <FlatList
                  data={filteredData}
                  keyExtractor={(item) => item.value.toString()}
                  renderItem={renderItem}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
});

export default DropdownCompo;

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    backgroundColor: COLORS.white,
    minHeight: 48,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 48,
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.PLACEHOLDER,
    fontSize: 14,
    flex: 1,
  },
  disabledDropdown: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  selectedItemsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  selectedItemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BLUE,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
  },
  selectedItemChipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
    maxWidth: 100,
  },
  removeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  selectedCount: {
    fontSize: 12,
    color: COLORS.BLUE,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 16,
    color: COLORS.black,
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedItem: {
    backgroundColor: COLORS.BLUE,
  },
  itemText: {
    color: COLORS.black,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  selectedItemText: {
    color: 'white',
  },
});