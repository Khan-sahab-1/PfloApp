import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const CRM = ({ route, navigation }) => {
  const { userName, employeeCode, userId, company_id,resUser } = route.params;
  return (
    <View style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 5, paddingTop: 20 }}>
      <View
        style={{
          backgroundColor: 'blue',
          alignItems: 'center',
          paddingVertical: 10,
        }}>
        <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>CRM</Text>
      </View>

      <View style={{ paddingHorizontal: 15, marginTop: 50 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Leads', { userName, employeeCode, userId, company_id,resUser });
          }}
          activeOpacity={0.8}
          style={{
            backgroundColor: 'blue',
            height: 60,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20
          }}>
          <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Leads</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Opportunity', { userName, employeeCode, userId, company_id, resUser });
          }}
          activeOpacity={0.8}
          style={{
            backgroundColor: 'blue',
            height: 60,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20
          }}>
          <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Opportunity</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Enquiry', { userName, employeeCode, userId });
          }}
          activeOpacity={0.8}
          style={{
            backgroundColor: 'blue',
            height: 60,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20
          }}>
          <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>Enquiry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CRM;
