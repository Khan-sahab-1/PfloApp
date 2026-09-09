//bug id 2822 Jamshed start
// Description: Added a reusable loader component that displays a Lottie animation and customizable loading text. The component is designed to be used across the app for indicating loading states, and it accepts props for visibility, text, and animation source.

import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const Loader = ({ visible = false, text = 'Loading...', animation = require('../assets/lottie/Lottie.json') }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.loaderBox}>
          <LottieView
            source={animation}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  animation: {
    width: 100,
    height: 100,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

//bug id 2822 Jamshed end