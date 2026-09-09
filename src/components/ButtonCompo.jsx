//bug id 2822 Jamshed start
// Description: Added a reusable button component with customizable styles, loading state, and disabled state. The component accepts props for title, onPress handler, background color, text color, border radius, padding, and additional styles for both the button and text. It also displays an activity indicator when in the loading state.
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

const ButtonCompo = ({
  title = "Button",
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  backgroundColor = "#007bff",
  textColor = "#fff",
  borderRadius = 8,
  padding = 12
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor, borderRadius, padding },
        disabled && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default ButtonCompo;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8
  },
  text: {
    fontSize: 14,
    fontWeight: '600'
  },
  disabled: {
    opacity: 0.6
  }
});
//bug id 2822 Jamshed end