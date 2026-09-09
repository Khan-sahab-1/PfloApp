import { Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DropdownCompo from '../components/MultiselectorDropDown'

const Previeweditmodal = ({isVisible}) => {
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  return (
   <>
   <Modal
   animationType="slide"
   transparent={true}
   visible={isVisible}>
    <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',alignItems:'center'}}>
      <View style={{width:'80%',backgroundColor:'white',borderRadius:10,padding:20}}>
        <Text style={{fontSize:18,fontWeight:'bold',marginBottom:10}}>Edit Remark</Text>
        {/* Form fields for editing remark would go here */}  
        <DropdownCompo
          data={[
            {label: 'present', value: 'Present'},
            {label: 'absent', value: 'Absent'},
            {label: 'on leave', value: 'On Leave'},
          ]}
          placeholder="Select Attendance Status"
          selectedValues={selectedStatus}
          onValueChange={setSelectedStatus}
        />
        </View>
      </View>

   </Modal>
   </>
  )
}

export default Previeweditmodal

const styles = StyleSheet.create({})