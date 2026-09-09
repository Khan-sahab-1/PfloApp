// Jamshed Ali Added Start - Bug ID 2822
// Description: Added a reusable header component that supports dynamic theming based on the device's color scheme (light/dark mode). The component accepts props for title, left and right icons, and their respective onPress handlers. It also includes styling adjustments to ensure proper visibility and aesthetics in both themes.
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { COLORS } from '../styles/Colors';

const HeaderCompo = ({ title, lefticon, righticon, onPress ,onPressRight}) => {
  const colorScheme = useColorScheme(); // 'light' or 'dark'
  const isDark = colorScheme === 'dark';

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: isDark ? COLORS.BLUE : COLORS.BLUE },
      ]}
    >
      {/* Left Icon */}
      {lefticon ? (
        <TouchableOpacity onPress={onPress}>
          <Image
            source={lefticon}
            style={[styles.icon, { tintColor: isDark ?  COLORS.white:COLORS.white }]}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: isDark ? COLORS.white: COLORS.white },
        ]}
      >
        {title}
      </Text>

      {/* Right Icon */}
      {righticon ? (
        <TouchableOpacity onPress={onPressRight}>
          <Image
            source={righticon}
            style={[styles.icon, { tintColor: isDark ? COLORS.white : COLORS.white }]}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

export default HeaderCompo;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 30, // Same width/height as icon to maintain layout alignment
    height: 30,
  },
});
// Jamshed Ali Added End - Bug ID 2822
