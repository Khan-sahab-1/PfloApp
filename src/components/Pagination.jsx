import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const Pagination = ({pagination = {}, loading, onNext, onPrev}) => {
  const {
    page = 1,
    total_pages = 1,
    has_next = false,
    has_previous = false,
  } = pagination;

  return (
    <View style={styles.container}>
      {/* Previous */}
      <TouchableOpacity
        style={[styles.btn, (!has_previous || loading) && styles.disabled]}
        onPress={onPrev}
        disabled={!has_previous || loading}>
        <Text style={styles.btnText}>Previous</Text>
      </TouchableOpacity>

      {/* Page Info */}
      <Text style={styles.pageText}>
        Page {page} / {total_pages}
      </Text>

      {/* Next */}
      <TouchableOpacity
        style={[styles.btn, (!has_next || loading) && styles.disabled]}
        onPress={onNext}
        disabled={!has_next || loading}>
        <Text style={styles.btnText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  btn: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  disabled: {backgroundColor: '#ccc'},
  btnText: {color: '#fff', fontWeight: '600'},
  pageText: {fontSize: 16, fontWeight: 'bold'},
});
