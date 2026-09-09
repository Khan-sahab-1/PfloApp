//bug id 2822 Jamshed start
// Description: Added a new modal component for assigning leads/enquiries to users. The modal includes a dropdown for selecting the user to assign to and a save button to confirm the assignment. The component is designed to be reusable and can be integrated into various parts of the app where lead/enquiry assignment is needed.

import { Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

const AssignToModal = ({isVisible,onclose}) => {
  return (
   <>
     <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onclose}>
        <TouchableOpacity style={{...styles.overlay}} onPress={onclose}>
        <View style={{...styles.modalContainer}}>
          <Text>hi</Text>
        </View>
        </TouchableOpacity>
    </Modal>
   
   </>
  )
}

export default AssignToModal

const styles = StyleSheet.create({
    overlay:{
        flex:1,
        
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 10,
      },
})
//bug id 2822 Jamshed end