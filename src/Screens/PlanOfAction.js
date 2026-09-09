// Jamshed start 
import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useColorScheme,
} from 'react-native';
import urls from '../../url';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {AuthContext} from './Context';
import HeaderCompo from '../components/HeaderCompo';
import makeApiCall from '../utils/apiHelper';
import {COLORS} from '../styles/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlanOfAction = ({route}) => {
  const {id} = route.params;
  const {leadData} = route.params;
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const getLinesData = server_origin + urls.getOppLinesData;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const navigation = useNavigation();
  console.log(leadData, id, 'the Id is very importan');

  const containerStyle = [
    styles.container,
    {backgroundColor: isDarkMode ? '#000' : '#fff'},
  ];
  const headingStyle = [
    styles.heading,
    {backgroundColor: '#1E90FF', color: '#fff'},
  ];
  const textStyle = {color: isDarkMode ? '#fff' : '#000'};

  const fetchPlanData = async () => {
    try {
      console.log('Fetching data from:', getLinesData);
      const response = await fetch(getLinesData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {id},
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Fetched data:', result);
      setData(result.result.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchplaneofaction = async () => {
    try {
      const responce = await makeApiCall(
        server_origin,
        urls.getOppLinesData,
        'POST',
        {
          jsonrpc: '2.0',
          method: 'call',
          params: {id},
        },
      );
      console.log(responce?.result?.data, 'Responce----');
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //     fetchPlanData();
  //     fetchplaneofaction()
  // }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchPlanData();
      fetchplaneofaction();
    }, [id]),
  );
  if (loading) {
    return (
      <View style={containerStyle}>
        <Text style={headingStyle}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <HeaderCompo
        title={'Plan of Action'}
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />
      <View style={containerStyle}>
        {/* <Text style={headingStyle}>Plan of Action</Text> */}
        {/* <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('CreatePlanOfAction', { id })}
            >
                <Text style={styles.createButtonText}>Create Plan of Action</Text>
            </TouchableOpacity> */}

        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View
              style={[
                styles.card,
                {backgroundColor: isDarkMode ? '#333' : COLORS.white},
              ]}>
              <Text style={[styles.cardTitle, textStyle]}>
                Summary :- {item.summary}
              </Text>
              <Text style={[styles.cardDescription, textStyle]}>
                Due Date :- {item.due_date}
              </Text>
              <Text style={[styles.cardDescription, textStyle]}>
                Activity :- {item.activity_name}
              </Text>
              {/* {item.attendees && item.attendees.length > 0 ? (
                <Text style={[styles.cardDescription, textStyle]}>
                  Attendees: {item.attendees.join(', ')}
                </Text>
              ) : null} */}
              {Array.isArray(item.attendees) && item.attendees.length > 0 ? (
                <Text style={[styles.cardDescription, textStyle]}>
                  Attendees: {item.attendees.map(a => a[1]).join(', ')}
                </Text>
              ) : null}

              <Text style={[styles.cardDescription, textStyle]}>
                {`Conclusion: ${item.conclusion}`}
              </Text>
              <Text style={[styles.cardDescription, textStyle]}>
                {`Reminder Date: ${
                  item.reminder_date ? item.reminder_date : ''
                }`}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CreatePlanOfAction', {
                    item,
                    id,
                    edit: 'edit',
                  })
                }>
                <Icon
                  name="edit"
                  size={22}
                  color={isDarkMode ? '#fff' : COLORS.black}
                />
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity
          style={{...styles.bottombutton}}
          onPress={() => navigation.navigate('CreatePlanOfAction', {id})}>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              fontWeight: '800',
              color: COLORS.white,
            }}>
            Create Plan of Action
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
  },

  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
  },
  bottombutton: {
    position: 'absolute',
    bottom: 30,
    // left:0,
    right: 10,
    height: 80,
    width: 150,
    backgroundColor: COLORS.BLUE,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default PlanOfAction;
// Jamshed end 

// import React from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     StyleSheet,
//     TouchableOpacity,
//     useColorScheme,
// } from 'react-native';

// const PlanOfAction = () => {
//     const colorScheme = useColorScheme();

//     // Determine styles based on theme
//     const isDarkMode = colorScheme === 'dark';
//     const containerStyle = [
//         styles.container,
//         { backgroundColor: isDarkMode ? '#000' : '#fff' },
//     ];
//     const headingStyle = [
//         styles.heading,
//         { backgroundColor: '#1E90FF', color: '#fff' },
//     ];
//     const textStyle = { color: isDarkMode ? '#fff' : '#000' };
//     const inputStyle = [
//         styles.input,
//         { backgroundColor: isDarkMode ? '#333' : '#f9f9f9', color: isDarkMode ? '#fff' : '#000' },
//     ];

//     return (
//         <View style={containerStyle}>
//             <Text style={headingStyle}>Create Plan of Action</Text>
//             <View style={styles.fieldContainer}>
//                 <Text style={[styles.label, textStyle]}>Activity</Text>
//                 <TextInput style={inputStyle} placeholder="Enter activity" placeholderTextColor={isDarkMode ? '#888' : '#ccc'} />
//             </View>
//             <View style={styles.fieldContainer}>
//                 <Text style={[styles.label, textStyle]}>Summary</Text>
//                 <TextInput
//                     style={[...inputStyle, styles.multilineInput]}
//                     placeholder="Enter summary"
//                     multiline
//                     numberOfLines={4}
//                     placeholderTextColor={isDarkMode ? '#888' : '#ccc'}
//                 />
//             </View>
//             <View style={styles.fieldContainer}>
//                 <Text style={[styles.label, textStyle]}>Due Date</Text>
//                 <TextInput style={inputStyle} placeholder="Enter due date" placeholderTextColor={isDarkMode ? '#888' : '#ccc'} />
//             </View>
//             <View style={styles.fieldContainer}>
//                 <Text style={[styles.label, textStyle]}>Assigned To</Text>
//                 <TextInput style={inputStyle} placeholder="Enter assigned person" placeholderTextColor={isDarkMode ? '#888' : '#ccc'} />
//             </View>

//             {/* Buttons */}
//             <View style={styles.buttonContainer}>
//                 <TouchableOpacity style={styles.button}>
//                     <Text style={styles.buttonText}>Save & Close</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.button}>
//                     <Text style={styles.buttonText}>Discard</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//     },
//     heading: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         marginBottom: 20,
//         textAlign: 'center',
//         padding: 10,
//         borderRadius: 5,
//     },
//     fieldContainer: {
//         marginBottom: 15,
//     },
//     label: {
//         fontSize: 16,
//         marginBottom: 5,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,
//         padding: 10,
//         fontSize: 16,
//     },
//     multilineInput: {
//         height: 80,
//         textAlignVertical: 'top',
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 20,
//     },
//     button: {
//         flex: 1,
//         backgroundColor: '#1E90FF',
//         padding: 15,
//         marginHorizontal: 5,
//         borderRadius: 5,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default PlanOfAction;
