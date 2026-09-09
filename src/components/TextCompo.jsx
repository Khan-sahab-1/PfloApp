//bug id 2822 Jamshed start
// Description: Added a new reusable text component that allows for customizable styling options such as color, size, weight, and alignment. The component is designed to be used across the app for displaying text with consistent styling and can be easily customized through props.


import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS } from '../styles/Colors';

const TextCompo = ({
  children,
  style,
  color =COLORS.black,
  size = 16,
  weight = 'normal',
  align = 'left',
  numberOfLines,
  ellipsizeMode = 'tail',
  ...rest
}) => {
  return (
    <Text
      style={[
        styles.text,
        { color, fontSize: size, fontWeight: weight, textAlign: align },
        style
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      {...rest}
    >
      {children}
    </Text>
  );
};

export default TextCompo;

const styles = StyleSheet.create({
  text: {
    // default styling
  },
});
//bug id 2822 Jamshed end
