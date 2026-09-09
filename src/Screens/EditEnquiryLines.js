// Jamshed start 
import React, {useState, useEffect, useContext} from 'react';
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
import {COLORS} from '../styles/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import navigationString from '../route/navigationString';
import Loader from '../components/Loader';
import RemarkModal from '../components/RemarkModal';

const EditEnquiryLines = ({route}) => {
  const {enquiryId} = route.params;
  const [isremarkModalVisible,setremarkModalVisible]=useState(false)
  const [selectedItemData, setSelectedItemData] = useState(null);

  // console.log(enquiryId,'idddddddddddddddddddd')
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const getLinesData = server_origin + urls.fetchEnquiryData;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const navigation = useNavigation();

  const containerStyle = [
    styles.container,
    {backgroundColor: isDarkMode ? '#000' : '#fff'},
  ];
  const headingStyle = [
    styles.heading,
    {backgroundColor: '#1E90FF', color: '#fff'},
  ];
  const textStyle = {color: isDarkMode ? '#fff' : '#000'};

  const fetchEnquiryData = async () => {
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
          params: {id: enquiryId},
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Fetched data:', result);
      setData(result.result || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (enquiryId) {
        fetchEnquiryData();
      }
    }, [enquiryId]),
  );

  

  return (
    <>
      <HeaderCompo
        title={'Enquiry Lines'}
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />
      <View style={containerStyle}>
        {/* <TouchableOpacity
                style={styles.createButton}
                
            >
                <Text style={styles.createButtonText}>Create Enquiry Line</Text>
            </TouchableOpacity> */}

        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View
              style={[
                styles.card,
                {backgroundColor: isDarkMode ? '#333' : '#f9f9f9'},
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={[styles.cardTitle, textStyle]}>
                  Product :- {item.product}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(navigationString.EDITENQUERYLILE, {
                      enquiryData: item,enquiryId: enquiryId,
                    })
                  }>
                  <Icon name="edit" size={24} color="#1E90FF" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.cardDescription, textStyle]}>
                Description :- {item.des}
              </Text>
              <Text style={[styles.cardDescription, textStyle]}>
                Enquired Qty :- {item.enq_qty}
              </Text>
              <Text style={[styles.cardDescription, textStyle]}>
                Unit Of Measure :- {item.unit_mes}
              </Text>
              {/* <Text style={[styles.cardDescription, textStyle]}>
                            Last So Deatils :- {item.last_so_date}
                        </Text> */}
              <Text style={[styles.cardDescription, textStyle]}>
                Enquiry Status :- {item.enq_status}
              </Text>
              <Text style={[styles.cardDescription, textStyle]}>
                Description Specs :- {item.desc_spec}
              </Text>
              <TouchableOpacity style={{padding:10,backgroundColor:COLORS.BLUE,width:100,alignItems:'center',borderRadius:10,marginTop:10}}
              onPress={() => {
                setSelectedItemData(item); 
                setremarkModalVisible(true);
              }}
              >
              <Text style={{fontSize:16,fontWeight:'500',color:COLORS.white}}>Remark</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity
          style={{...styles.bottombutton}}
          onPress={() => navigation.navigate('EnquiryLinesPage', {enquiryId})}>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              fontWeight: '800',
              color: COLORS.white,
            }}>
            Create Enquiry Line
          </Text>
        </TouchableOpacity>
        <Loader visible={loading} />
        <RemarkModal isVisible={isremarkModalVisible}
     onClose={() => {
      setremarkModalVisible(false);
      fetchEnquiryData(); 
    }}
        data={selectedItemData}/>
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
  createButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
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
    height: 60,
    width: 180,
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

export default EditEnquiryLines;
// Jamshed end 
