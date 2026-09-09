//bug id 2822 Jamshed start
// Description: Added a new wrapper component that provides a consistent layout and styling for screens in the app. The component includes options for enabling scrolling, setting background color, and customizing the status bar. It is designed to be reusable and can be used across different screens to maintain a cohesive look and feel throughout the app.
import React from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView, StatusBar } from 'react-native';

const WrapperCompo = ({
  children,
  scroll = false,
  style,
  backgroundColor = '#ffffff',
  statusBarColor = 'dark-content',
  safeArea = true,
}) => {
  const Container = scroll ? ScrollView : View;

  const Wrapper = safeArea ? SafeAreaView : React.Fragment;

  return (
    <>
      <StatusBar barStyle={statusBarColor} />
      <Wrapper style={[styles.safeArea, { backgroundColor }]}>
        <Container contentContainerStyle={scroll && styles.scrollContainer} style={[styles.container, { backgroundColor }, style]}>
          {children}
        </Container>
      </Wrapper>
    </>
  );
};

export default WrapperCompo;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});
//bug id 2822 Jamshed end
