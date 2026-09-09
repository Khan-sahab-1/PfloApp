// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, useColorScheme } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { AuthContext } from './Context';
// import urls from '../../url';
// import SingleDropdown from '../components/SingleDropdown';
// import HeaderCompo from '../components/HeaderCompo';
// import ButtonCompo from '../components/ButtonCompo';
// import Loader from '../components/Loader';
// import { COLORS } from '../styles/Colors';
 
// const EnquiryLinesPage = ({ route }) => {
//   const { enquiryId } = route.params;
//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const createLinesData = server_origin + urls.createLines;
//   const fetchProductsUrl = server_origin + urls.fetchProducts;
//   const fetchStatusUrl = server_origin + urls.fetchStatus;
  
//   const [rows, setRows] = useState([]);
//   const [productOptions, setProductOptions] = useState([]);
//   const [statusOptions, setStatusOptions] = useState([]);
//   const [loding, setLoading] = useState(false);
//   const [newRow, setNewRow] = useState({
//     srNo: '',
//     product: '',
//     description: '',
//     enquiryQty: '',
//     status: '',
//   });
 
//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';
//   const styles = createStyles(isDarkMode);
//   const navigation = useNavigation();
 
//   const addRow = () => {
//     if (!newRow.product || !newRow.description || !newRow.enquiryQty || !newRow.status) {
//       Alert.alert('Error', 'Please fill all fields before adding a row.');
//       return;
//     }
 
//     setRows((prevRows) => [
//       ...prevRows,
//       { ...newRow, srNo: prevRows.length + 1 },
//     ]);
//     setNewRow({ srNo: '', product: '', description: '', enquiryQty: '', status: '' });
//   };
 
//   const fetchProductData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(fetchProductsUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {},
//         }),
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch product data');
//       }
//       const result = await response.json();
//       const productData = result.result.map((item) => ({
//         label: item.name,
//         value: item.id.toString(),
//       }));
//       setProductOptions(productData);
//     } catch (error) {
//       console.error('Error fetching product data:', error);
//       Alert.alert('Error', 'Failed to fetch product data.');
//     }
//   };
 
//   const fetchStatusData = async () => {
//     try {
//       const response = await fetch(fetchStatusUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {},
//         }),
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch status data');
//       }
//       const result = await response.json();
//       const status_data = result.result[0]?.status_data;
//       const formattedStatusOptions = status_data.map(option => ({
//         label: option[1],
//         value: option[0].toString()
//       }));
//       setStatusOptions(formattedStatusOptions);
//     } catch (error) {
//       console.error('Error fetching status data:', error);
//       Alert.alert('Error', 'Failed to fetch status data.');
//     }finally {
//     setLoading(false);
//   }
//   };
 
//   const sendDataToBackend = async () => {
//     if (rows.length === 0) {
//       Alert.alert('Error', 'Please add at least one row before submitting.');
//       return;
//     }
 
//     try {
//       const response = await fetch(createLinesData, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           jsonrpc: '2.0',
//           method: 'call',
//           params: {
//             enquiry_id: enquiryId,
//             lines: rows.map((row) => ({
//               sr_no: row.srNo,
//               product: parseInt(row.product),
//               description: row.description,
//               enquiry_qty: row.enquiryQty,
//               status: row.status,
//               remark: row.remark || '',
//               created_by: row.createdBy || '',
//               created_on: row.createdOn || '',
//             })),
//           },
//         }),
//       });
 
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
 
//       const result = await response.json();
//       console.log('Lines submitted successfully:', result);
//       Alert.alert('Success', 'Lines submitted successfully.');

//       setRows([]);
//       navigation.goBack();
//     } catch (error) {
//       console.error('Error submitting lines:', error);
//       Alert.alert('Error', 'Failed to submit lines.');
//     }
//   };
 
//   useEffect(() => {
//     fetchProductData();
//     fetchStatusData();
//   }, []);
 
//   const renderItem = ({ item }) => (
//     <View style={styles.row}>
//       <Text style={styles.cell}>{item.srNo}</Text>
//       <Text style={styles.cell}>{item.product}</Text>
//       <Text style={styles.cell}>{item.description}</Text>
//       <Text style={styles.cell}>{item.enquiryQty}</Text>
//       <Text style={styles.cell}>{item.status}</Text>
//     </View>
//   );
 
//   return (
 
 
//     <>
//     <HeaderCompo title={'Enquiry'} lefticon={require('../assets/back.png')}
//     onPress={()=>navigation.goBack()}/>
//     <View style={styles.container}>
//       <View style={styles.inputContainer}>
//         <SingleDropdown
//           data={productOptions}
//           value={newRow.product}
//           onChange={(item) => setNewRow(prev => ({ ...prev, product: item.value }))}
//           placeholder="Select Product"
//           // label="Product"
//           isDarkMode={isDarkMode}
//           // onFocus={fetchProductData}
//         />
 
//         <TextInput
//           style={styles.input}
//           placeholder="Description"
//           placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
//           value={newRow.description}
//           onChangeText={(text) => setNewRow((prev) => ({ ...prev, description: text }))}
//         />
 
//         <TextInput
//           style={styles.input}
//           placeholder="Enquiry Qty"
//           placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
//           keyboardType="numeric"
//           value={newRow.enquiryQty}
//           onChangeText={(text) => setNewRow((prev) => ({ ...prev, enquiryQty: text }))}
//         />
 
//         <SingleDropdown
//           data={statusOptions}
//           value={newRow.status}
//           onChange={(item) => setNewRow(prev => ({ ...prev, status: item.value }))}
//           placeholder="Select Status"
//           // label="Status"
//           isDarkMode={isDarkMode}
//           onFocus={fetchStatusData}
//         />
 
//         <TouchableOpacity
//           style={styles.remarkButton}
//           onPress={() =>
//             navigation.navigate('RemarkPage', {
//               product: newRow.product,
//               onSave: (remarkData) => {
//                 setNewRow((prevRow) => ({
//                   ...prevRow,
//                   remark: remarkData.remark,
//                   createdBy: remarkData.createdBy,
//                   createdOn: remarkData.createdOn,
//                 }));
//               },
//             })
//           }
//         >
//           <Text style={styles.remarkButtonText}>Remark</Text>
//         </TouchableOpacity>
 
//         {/* <TouchableOpacity style={styles.addButton} onPress={addRow}>
//           <Text style={styles.addButtonText}>Add Row</Text>
//         </TouchableOpacity> */}
//         <ButtonCompo title='Add Row' style={styles.addButton}onPress={addRow}/>
//       </View>
 
//       <View style={styles.header}>
//         <Text style={styles.headerCell}>Sr. No</Text>
//         <Text style={styles.headerCell}>Product</Text>
//         <Text style={styles.headerCell}>Description</Text>
//         <Text style={styles.headerCell}>Enquiry Qty</Text>
//         <Text style={styles.headerCell}>Status</Text>
//       </View>
 
//       <FlatList
//         data={rows}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => index.toString()}
//       />
//      <Loader visible={loding} />
//       {/* <TouchableOpacity style={styles.submitButton} onPress={sendDataToBackend}>
//         <Text style={styles.submitButtonText}>Submit Data</Text>
//       </TouchableOpacity> */}
//       <ButtonCompo title='Submit Data' style={styles.submitButton} onPress={sendDataToBackend}/>
//     </View>
//     </>
//   );
// };
 
// const createStyles = (isDarkMode) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 10,
//       backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
//     },
//     inputContainer: {
//       marginBottom: 10,
//     },
//     input: {
//       borderWidth: 1,
//       borderColor: isDarkMode ? '#444' : '#ccc',
//       backgroundColor: isDarkMode ? '#fff' : '#fff',
//       color: COLORS.black,
//       padding: 8,
//       marginBottom: 5,
//       borderRadius: 5,
//     },
//     remarkButton: {
//       backgroundColor: 'blue',
//       padding: 10,
//       borderRadius: 5,
//       alignItems: 'center',
//       marginBottom: 10,
//       width: '25%',
//     },
//     remarkButtonText: {
//       color: '#fff',
//       fontWeight: 'bold',
 
//     },
//     addButton: {
//       backgroundColor: 'blue',
//       padding: 10,
//       borderRadius: 5,
//       alignItems: 'center',
//     },
//     addButtonText: {
//       color: '#fff',
//       fontWeight: 'bold',
//     },
//     header: {
//       flexDirection: 'row',
//       backgroundColor: isDarkMode ? '#333' : '#ddd',
//       paddingVertical: 8,
//       borderBottomWidth: 1,
//       borderBottomColor: isDarkMode ? '#555' : '#bbb',
//     },
//     headerCell: {
//       flex: 1,
//       fontWeight: 'bold',
//       textAlign: 'center',
//       fontSize: 16,
//       color: isDarkMode ? '#fff' : '#000',
//     },
//     row: {
//       flexDirection: 'row',
//       borderBottomWidth: 1,
//       borderBottomColor: isDarkMode ? '#444' : '#ccc',
//       paddingVertical: 8,
//     },
//     cell: {
//       flex: 1,
//       textAlign: 'center',
//       fontSize: 14,
//       color: isDarkMode ? '#fff' : '#333',
//     },
//     submitButton: {
//       backgroundColor: '#007BFF',
//       padding: 15,
//       borderRadius: 5,
//       marginTop: 10,
//       alignItems: 'center',
//     },
//     submitButtonText: {
//       color: '#fff',
//       fontWeight: 'bold',
//     },
//   });
 
// export default EnquiryLinesPage;
// Jamshed start 


import React, { useState, useEffect, useContext, } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, useColorScheme,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './Context';
import urls from '../../url';
import SingleDropdown from '../components/SingleDropdown';
import HeaderCompo from '../components/HeaderCompo';
import ButtonCompo from '../components/ButtonCompo';
import Loader from '../components/Loader';
import TextinputCompo from '../components/TextinputCompo';
import { COLORS } from '../styles/Colors';
import Tablecomp from '../components/Tablecompo';
 
 
const EnquiryLinesPage = ({ route }) => {
  const { enquiryId } = route.params;
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;
  const createLinesData = server_origin + urls.createLines;
  const fetchProductsUrl = server_origin + urls.fetchProducts;
  const fetchStatusUrl = server_origin + urls.fetchStatus;
   console.log(route.params, 'route params in enquiry lines page');
  
  const [rows, setRows] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loding, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [newRow, setNewRow] = useState({
    srNo: '',
    product: '',
    description: '',
    enquiryQty: '',
    status: '',
    customerCode: '',
    specs: '',
 
  });
 
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = createStyles(isDarkMode);
  const navigation = useNavigation();
 
  const addRow = () => {
    if (!newRow.product || !newRow.description || !newRow.enquiryQty || !newRow.status) {
      Alert.alert('Error', 'Please fill all fields before adding a row.');
      return;
    }
 
    setRows((prevRows) => [
      ...prevRows,
      { ...newRow, srNo: prevRows.length + 1 },
    ]);
    setNewRow({ srNo: '', product: '', description: '', enquiryQty: '', status: '' , customerCode: '',
      specs: '',});
  };
 
  const fetchProductData = async () => {
    try {
      setProductLoading(true);
      const response = await fetch(fetchProductsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {},
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }
      const result = await response.json();
      const productData = result.result.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      }));
      setProductOptions(productData);
    } catch (error) {
      console.error('Error fetching product data:', error);
      Alert.alert('Error', 'Failed to fetch product data.');
    } finally{
      setProductLoading(false);
    }
  };
 
  const fetchStatusData = async () => {
    try {
      const response = await fetch(fetchStatusUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {},
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch status data');
      }
      const result = await response.json();
      const status_data = result.result[0]?.status_data;
      const formattedStatusOptions = status_data.map(option => ({
        label: option[1],
        value: option[0].toString()
      }));
      setStatusOptions(formattedStatusOptions);
    } catch (error) {
      console.error('Error fetching status data:', error);
      Alert.alert('Error', 'Failed to fetch status data.');
    }finally {
    setLoading(false);
  }
  };
 
  const sendDataToBackend = async () => {
    if (rows.length === 0) {
      Alert.alert('Error', 'Please add at least one product before submitting.');
      return;
    }
 
    try {
      const response = await fetch(createLinesData, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            enquiry_id: enquiryId,
            lines: rows.map((row) => ({
              sr_no: row.srNo,
              product: parseInt(row.product),
              description: row.description,
              enquiry_qty: row.enquiryQty,
              status: row.status,
              remark: row.remark || '',
              created_by: row.createdBy || '',
              created_on: row.createdOn || '',
              customer_code: row.customerCode || '',
              specs: row.specs || '',
 
            })),
          },
        }),
      });
 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
 
      const result = await response.json();
      console.log('Lines submitted successfully:', result);
      Alert.alert('Success', 'product add successfully.');
 
      setRows([]);
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting lines:', error);
      Alert.alert('Error', 'Failed to submit lines.');
    }
  };
 
  useEffect(() => {
    fetchProductData();
    fetchStatusData();
  }, []);
 
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.srNo}</Text>
      <Text style={styles.cell}>{item.product}</Text>
      <Text style={styles.cell}>{item.description}</Text>
      <Text style={styles.cell}>{item.enquiryQty}</Text>
      <Text style={styles.cell}>{item.status}</Text>
    </View>
  );
 
  return (
 
 
    <>
    <HeaderCompo title={'Enquiry'} lefticon={require('../assets/back.png')}
    onPress={()=>navigation.goBack()}/>
   
<ScrollView style={{flex:1,backgroundColor:isDarkMode?COLORS.black:COLORS.BACKGROUND}}>


   
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <SingleDropdown
          data={productOptions}
          value={newRow.product}
          onChange={(item) => setNewRow(prev => ({ ...prev, product: item.value }))}
          placeholder="Select Product"
          // label="Product"
          isDarkMode={isDarkMode}
          // onFocus={fetchProductData}
        />
 
        <TextInput
          style={styles.input}
          placeholder="Description"
           placeholderTextColor={COLORS.PLACEHOLDER}
          value={newRow.description}
          onChangeText={(text) => setNewRow((prev) => ({ ...prev, description: text }))}
        />
 
        <TextInput
          style={styles.input}
          placeholder="Enquiry Qty"
          placeholderTextColor={COLORS.PLACEHOLDER}
          keyboardType="numeric"
          value={newRow.enquiryQty}
          onChangeText={(text) => setNewRow((prev) => ({ ...prev, enquiryQty: text }))}
        />
 
        <SingleDropdown
          data={statusOptions}
          value={newRow.status}
          onChange={(item) => setNewRow(prev => ({ ...prev, status: item.value }))}
          placeholder="Select Status"
          // label="Status"
          isDarkMode={isDarkMode}
          onFocus={fetchStatusData}
        />
         <TextinputCompo
            placeholder={'Customer Code'}
            value={newRow.customerCode}
            onChangeText={(text) =>
              setNewRow((prev) => ({ ...prev, customerCode: text }))
            }
            style={styles.input}
            placeholderTextColor={COLORS.PLACEHOLDER}
          />
          <TextinputCompo
            placeholder={'Description Specs'}
            value={newRow.specs}
            onChangeText={(text) =>
              setNewRow((prev) => ({ ...prev, specs: text }))
            }
            style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
            multiline={true}
           placeholderTextColor={COLORS.PLACEHOLDER}
           
          />
 
        {/* <TouchableOpacity
          style={styles.remarkButton}
          onPress={() =>
            navigation.navigate('RemarkPage', {
              product: newRow.product,
              onSave: (remarkData) => {
                setNewRow((prevRow) => ({
                  ...prevRow,
                  remark: remarkData.remark,
                  createdBy: remarkData.createdBy,
                  createdOn: remarkData.createdOn,
                }));
              },
            })
          }
        >
          <Text style={styles.remarkButtonText}>Remark</Text>
        </TouchableOpacity> */}
 
        {/* <TouchableOpacity style={styles.addButton} onPress={addRow}>
          <Text style={styles.addButtonText}>Add Row</Text>
        </TouchableOpacity> */}
        <ButtonCompo title='Add Product' style={styles.addButton}onPress={addRow}/>
      </View>
      
 
      {/* <View style={styles.header}>
        <Text style={styles.headerCell}>Sr. No</Text>
        <Text style={styles.headerCell}>Product</Text>
        <Text style={styles.headerCell}>Description</Text>
        <Text style={styles.headerCell}>Enquiry Qty</Text>
        <Text style={styles.headerCell}>Status</Text>
        <Text style={styles.headerCell}>customer code</Text>
        <Text style={styles.headerCell}>Description Specs</Text>
      </View> */}
 
     <Tablecomp tableData={rows} />
     {/* <Loader visible={loding} /> */}
     <Loader visible={productLoading || loding} />

      {/* <TouchableOpacity style={styles.submitButton} onPress={sendDataToBackend}>
        <Text style={styles.submitButtonText}>Submit Data</Text>
      </TouchableOpacity> */}
      <ButtonCompo title='Submit Data' style={styles.submitButton} onPress={sendDataToBackend}/>
    </View>
    </ScrollView>
    </>
  );
};
 
const createStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    inputContainer: {
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ccc',
      backgroundColor: isDarkMode ? '#fff' : '#fff',
      color: COLORS.black,
      padding: 8,
      marginBottom: 5,
      borderRadius: 5,
    },
    remarkButton: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 10,
      width: '25%',
    },
    remarkButtonText: {
      color: '#fff',
      fontWeight: 'bold',
 
    },
    addButton: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    addButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    header: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? '#333' : '#ddd',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#555' : '#bbb',
    },
    headerCell: {
      flex: 1,
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 16,
      color: isDarkMode ? '#fff' : '#000',
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#444' : '#ccc',
      paddingVertical: 8,
    },
    cell: {
      flex: 1,
      textAlign: 'center',
      fontSize: 14,
      color: isDarkMode ? '#fff' : '#333',
    },
    submitButton: {
      backgroundColor: '#007BFF',
      padding: 15,
      borderRadius: 5,
      marginTop: 10,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
 
export default EnquiryLinesPage;
// Jamshed start 