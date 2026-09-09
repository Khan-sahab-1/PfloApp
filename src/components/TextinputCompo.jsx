//bug id 2822 Jamshed start
// Description: Added a new reusable text input component that provides a consistent and customizable input field across the app. The component supports various props for handling text input, such as placeholder, value, onChangeText, secureTextEntry, keyboardType, and more. It is designed to be flexible and can be easily integrated into different screens where user input is required.

import { StyleSheet, Text, View,TextInput } from 'react-native'
import React from 'react'
import { COLORS } from '../styles/Colors'


const TextinputCompo = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  multiline,
  numberOfLines,
  maxLength,
  style,
  onFocus,
  onBlur,
  editable = true,
  autoCapitalize = 'none',
  autoCorrect = false,
  placeholderTextColor=COLORS.black
}) => {
  return (
    <View>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        style={[{ padding: 10, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }, style]}
        onFocus={onFocus}
        onBlur={onBlur}
        editable={editable}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        placeholderTextColor={placeholderTextColor}
      />
    </View>
  )
}

export default TextinputCompo

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 5,
    
  },
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  success: {
    color: 'green',
    fontSize: 12,
    marginTop: 5,
  },
  disabled: {
    backgroundColor: '#f0f0f0',
  },
  focused: {
    borderColor: 'blue',
  },
})
//bug id 2822 Jamshed end