// Jamshed start 
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Button, useColorScheme, TouchableOpacity } from 'react-native';
import urls from '../../url';
import { AuthContext } from './Context';
import { COLORS } from '../styles/Colors';
import HeaderCompo from '../components/HeaderCompo';

const Opportunity = ({ navigation, route }) => {
  const employeeCode = route?.params?.employeeCode || '';
  const resUser = route?.params?.resUser || '';
  // console.log("ResUser data", resUser)
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const getOpportunitiesPageData = server_origin + urls.getOpportunitiesData;

  const [opportunitiesData, setOpportunitiesData] = useState([]);
  const [isMultidivision, setIsMultidivision] = useState(false);
  console.log("Multidivision data", isMultidivision)
  const scheme = useColorScheme();

  const fetchOpportunitiesData = async () => {
    try {
      const response = await fetch(getOpportunitiesPageData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            employeeCode,company_id:route?.params?.company_id,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const opportunities = await response.json();
      console.log("opportunity", opportunities)
      setOpportunitiesData(opportunities.result);
      setIsMultidivision(opportunities.result[0]?.is_multidivision || false);
    } catch (error) {
      console.error('Error fetching opportunities data:', error);
    }
  };

  useEffect(() => {
    if (employeeCode) {
      fetchOpportunitiesData();
    }
  }, [employeeCode]);

  const kanbanColumns = {
    'New Opportunities': opportunitiesData.slice(0, 5),
    'In Progress': opportunitiesData.slice(5, 10),
    'Closed': opportunitiesData.slice(10, 15),
  };

  const renderCard = ({ item }) => (
    <View style={[styles.card, scheme === 'dark' && styles.cardDark]}>
      <Text
        style={[styles.cardText, scheme === 'dark' && styles.cardTextDark]}
        onPress={() => navigation.navigate('EditOpportunity', { opportunity: item })}
      >
        {item.name}
      </Text>
    </View>
  );


  const renderColumn = (title, data) => (
    <View style={[styles.column, scheme === 'dark' && styles.columnDark]}>
      <Text style={[styles.columnTitle, scheme === 'dark' && styles.columnTitleDark]}>{title}</Text>
      <FlatList
        data={data}
        renderItem={renderCard}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );


  return (


    <>
    <HeaderCompo title={'Opportunities'} lefticon={require('../assets/back.png')}
    onPress={()=>navigation.goBack()} />
    <View style={[styles.container, scheme === 'dark' && styles.containerDark]}>
      {/* <View style={[styles.header, scheme === 'dark' && styles.headerDark]}>
        <Text style={[styles.headerText, scheme === 'dark' && styles.headerTextDark]}>Opportunities</Text>
      </View> */}
      {/* <View style={styles.createButtonContainer}>
        <Button title="Create Opportunity" 
        onPress={() => navigation.navigate('OppForm', { employeeCode,is_multidivision: isMultidivision,resUser })} />
      </View> */}
      <ScrollView horizontal contentContainerStyle={styles.kanbanBoard}>
        {Object.keys(kanbanColumns).map((column) =>
          renderColumn(column, kanbanColumns[column])
        )}
      </ScrollView>
        <TouchableOpacity style={{...styles.bottombutton}}
             onPress={() => navigation.navigate('OppForm', { employeeCode,is_multidivision: isMultidivision,resUser })} >
              <Text style={{fontSize:18,textAlign:'center',fontWeight:'800',color:COLORS.white}}>Create Opportunity</Text>
            </TouchableOpacity>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    paddingTop: 20,
  },
  containerDark: {
    backgroundColor: '#333',
  },
  header: {
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerDark: {
    backgroundColor: 'blue',
  },
  headerText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTextDark: {
    color: 'white',
  },
  kanbanBoard: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  column: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
  },
  columnDark: {
    backgroundColor: '#444',
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  columnTitleDark: {
    color: '#ddd',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardDark: {
    backgroundColor: '#555',
  },
  cardText: {
    fontSize: 16,
    color: '#333', 
  },
  cardTextDark: {
    color: '#fff', 
  },
  createButtonContainer: {
    padding: 10,
    alignItems: 'center',
  },
 bottombutton:{
     position:'absolute',  
     bottom:30,
     // left:0,
     right:10,
     height:60,
     width:150,
     backgroundColor:COLORS.BLUE,
     borderRadius:50,
     justifyContent:'center',
     alignItems:'center',
     shadowColor: '#000',
     shadowOffset: {
       width: 0,
       height: 2,
     },
     shadowOpacity: 0.25,
     shadowRadius: 3.84,
     elevation: 5,
 
   }
  
});
export default Opportunity;
// Jamshed start 


