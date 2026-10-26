// //jamshed start bug id 2555
// // Description: Refactored the AddEnquery component to enhance functionality and user experience. The updated component now includes a loading state, dynamic product and status dropdowns, improved form validation, and a more intuitive UI for adding enquiry lines. The design has been improved to provide clearer information about each field, and the code structure has been optimized for better readability and maintainability. Additionally, the component now handles API interactions more robustly, ensuring that users receive appropriate feedback during data submission and when fetching necessary information for the form.
// import React, {useState, useEffect, useContext} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Alert,
//   useColorScheme,
//   ScrollView,
// } from 'react-native';
// import urls from '../../../url';
// import SingleDropdown from '../../components/SingleDropdown';
// import HeaderCompo from '../../components/HeaderCompo';
// import ButtonCompo from '../../components/ButtonCompo';
// import {AuthContext} from '../../Screens/Context';
// import TextinputCompo from '../../components/TextinputCompo';
// import makeApiCall from '../../utils/apiHelper';
// import Loader from '../../components/Loader';
// import axios from 'axios';
// import {COLORS} from '../../styles/Colors';
// import Tablecomp from '../../components/Tablecompo';
// import navigationString from '../../route/navigationString';

// const AddEnquery = ({route, navigation}) => {
//   const contextType = useContext(AuthContext);
//   const server_origin = contextType.currentUrl;
//   const createLinesData = server_origin + urls.createLines;
//   const fetchProductsUrl = server_origin + urls.fetchProducts;
//   const fetchStatusUrl = server_origin + urls.fetchStatus;

//   const [rows, setRows] = useState([]);
//   const [productOptions, setProductOptions] = useState([]);

//   const [loadingProducts, setLoadingProducts] = useState(false);
//   const [statusOptions, setStatusOptions] = useState([]);
//   const [customercode, setcustomercode] = useState('');
//   const [description, setDescription] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [allProducts, setAllProducts] = useState([]);
//   const [visibleProducts, setVisibleProducts] = useState([]);
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   const {
//     division,
//     customer,
//     address,
//     enquiry_type,
//     enquiry_date,
//     created_by,
//     sales_person_id,
//     userinfo,
//     user,
//     back_account,
//     Query,
//     termandcondition,
//     pricelist,
//     cost_center_id,
//     client_ref_no,
//     account_holder_id,
//     Comments,
//     opportunity_id,
//     contact_person,
//     contact_phone,
//     contact_email,
//   } = route.params;

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

//   const addRow = () => {
//     if (
//       !newRow.product ||
//       !newRow.description ||
//       !newRow.enquiryQty ||
//       !newRow.status
//     ) {
//       Alert.alert('Error', 'Please fill all fields before adding a row.');
//       return;
//     }

//     setRows(prevRows => [...prevRows, {...newRow, srNo: prevRows.length + 1}]);
//     setNewRow({
//       srNo: '',
//       product: '',
//       description: '',
//       enquiryQty: '',
//       status: '',
//       customerCode: '',
//       specs: '',
//     });
//   };

//   const fetchProductData = async () => {
//     try {
//       setLoadingProducts(true);
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

//       const result = await response.json();
//       console.log(result, 'Product----');
//       const fullList = result.result.map(item => ({
//         label: item.name,
//         value: item.id,
//       }));
//       setAllProducts(fullList);
//       setVisibleProducts(fullList);
//     } catch (error) {
//       console.error('Error fetching product data:', error);
//       Alert.alert('Error', 'Failed to fetch product data.');
//     } finally {
//       setLoadingProducts(false);
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
//         value: option[0].toString(),
//       }));
//       setStatusOptions(formattedStatusOptions);
//     } catch (error) {
//       console.error('Error fetching status data:', error);
//       Alert.alert('Error', 'Failed to fetch status data.');
//     }
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
//             enquiry_id: '',
//             lines: rows.map(row => ({
//               sr_no: row.srNo,
//               product: row.product,
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
//       console.log('Product add successfully:', result);
//       Alert.alert('Success', 'Lines submitted successfully.');
//       setRows([]);
//     } catch (error) {
//       console.error('Error submitting lines:', error);
//       Alert.alert('Error', 'Failed to submit lines.');
//     }
//   };

//   const handlesubmit = async () => {
//     const params = {
//       division,
//       customer,
//       address,
//       enquiry_type,
//       enquiry_date,
//       created_by,
//       sales_person_id,
//       back_account,
//       contact_person,
//       contact_phone,
//       contact_email,
//       Query: [Query],
//       termandcondition: [termandcondition],
//       pricelist,
//       cost_center_id,
//       client_ref_no,
//       account_holder_id,
//       Comments,
//       opportunity_id,
//       lines: rows.map(row => ({
//         product: parseInt(row.product),
//         description: row.description,
//         enquiryQty: row.enquiryQty,
//         status: row.status,
//         customercode: row.customerCode || '',
//         descriptionSpecs: row.specs || '',
//       })),
//     };
//     console.log(params, 'params in handlesubmit');
//     try {
//       setIsLoading(true);
//       const response = await makeApiCall(
//         server_origin,
//         urls.createEnquiry,
//         'POST',
//         {
//           jsonrpc: '2.0',
//           method: 'call',
//           params: params,
//         },
//       );
//       console.log(response, 'response from handlesubmit');
//       if (response?.result?.success === true) {
//         Alert.alert('Success', response?.result?.message);
//       } else {
//         Alert('Erroer');
//       }
//       navigation.navigate('CRM');
//     } catch (error) {
//       console.log(error, 'error in handlesubmit');
//       Alert.alert('Error', 'Failed to submit enquiry.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProductData();
//     fetchStatusData();
//     // fetchproductslist();
//   }, []);

//   return (
//     <>
//       <HeaderCompo
//         title={'Enquiry'}
//         lefticon={require('../../assets/back.png')}
//         onPress={() => navigation.goBack()}
//       />
//       <ScrollView
//         style={{
//           flex: 1,
//           backgroundColor: isDarkMode ? COLORS.black : COLORS.BACKGROUND,
//         }}>
//         <View style={styles.container}>
//           <View style={styles.inputContainer}>
//             <Text
//               style={{
//                 fontWeight: '500',
//                 color: isDarkMode ? COLORS.white : COLORS.black,
//                 fontSize: 14,
//               }}>
//               Select Products
//             </Text>
//             <SingleDropdown
//               data={allProducts}
//               value={newRow.product}
//               onChange={item => {
//                 if (item.value !== '') {
//                   setNewRow(prev => ({...prev, product: item.value}));
//                 }
//               }}
//               placeholder="Select Product"
//               isDarkMode={isDarkMode}
//             />
//             <Text
//               style={{
//                 fontWeight: '500',
//                 color: isDarkMode ? COLORS.white : COLORS.black,
//                 fontSize: 14,
//               }}>
//               Description
//             </Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Description"
//               placeholderTextColor={COLORS.PLACEHOLDER}
//               value={newRow.description}
//               onChangeText={text =>
//                 setNewRow(prev => ({...prev, description: text}))
//               }
//             />
//             <Text
//               style={{
//                 fontWeight: '500',
//                 color: isDarkMode ? COLORS.white : COLORS.black,
//                 fontSize: 14,
//               }}>
//               Enquiry Qty
//             </Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enquiry Qty"
//               placeholderTextColor={COLORS.PLACEHOLDER}
//               keyboardType="numeric"
//               value={newRow.enquiryQty}
//               onChangeText={text =>
//                 setNewRow(prev => ({...prev, enquiryQty: text}))
//               }
//             />
//             <Text
//               style={{
//                 fontWeight: '500',
//                 color: isDarkMode ? COLORS.white : COLORS.black,
//                 fontSize: 14,
//               }}>
//               Select Status
//             </Text>
//             <SingleDropdown
//               data={statusOptions}
//               value={newRow.status}
//               onChange={item =>
//                 setNewRow(prev => ({...prev, status: item.value}))
//               }
//               placeholder="Select Status"
//               // label="Status"
//               isDarkMode={isDarkMode}
//               onFocus={fetchStatusData}
//             />
//             <Text
//               style={{
//                 fontWeight: '500',
//                 color: isDarkMode ? COLORS.white : COLORS.black,
//                 fontSize: 14,
//               }}>
//               Customer Code
//             </Text>
//             <TextinputCompo
//               placeholder={'Customer Code'}
//               value={newRow.customerCode}
//               onChangeText={text =>
//                 setNewRow(prev => ({...prev, customerCode: text}))
//               }
//               style={styles.input}
//               placeholderTextColor={COLORS.PLACEHOLDER}
//             />
//             <Text
//               style={{
//                 fontWeight: '500',
//                 color: isDarkMode ? COLORS.white : COLORS.black,
//                 fontSize: 14,
//               }}>
//               {' '}
//               Description Specs
//             </Text>
//             <TextinputCompo
//               placeholder={'Description Specs'}
//               value={newRow.specs}
//               onChangeText={text => setNewRow(prev => ({...prev, specs: text}))}
//               style={[styles.input, {height: 120, textAlignVertical: 'top'}]}
//               multiline={true}
//               placeholderTextColor={COLORS.PLACEHOLDER}
//             />

//             {/* <TouchableOpacity
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
//         </TouchableOpacity> */}

//             <ButtonCompo
//               title="Add Product"
//               style={styles.addButton}
//               onPress={addRow}
//             />
//             <Tablecomp tableData={rows} />
//           </View>

//           <ButtonCompo
//             title="Submit Data"
//             style={styles.submitButton}
//             onPress={handlesubmit}
//           />
//         </View>
//         <Loader visible={loadingProducts} text={'Loading Products'} />
//       </ScrollView>
//     </>
//   );
// };

// const createStyles = isDarkMode =>
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

// export default AddEnquery;

// const styles = StyleSheet.create({});
// //bug id 2555 Jamshed end

// ─────────────────────────────────────────────────────────────
//  AddEnquery.jsx  –  Modern UI + Smart Buttons
//  Bug ID: 2555
// ─────────────────────────────────────────────────────────────

import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  useColorScheme,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import urls from '../../../url';
import SingleDropdown from '../../components/SingleDropdown';
import HeaderCompo from '../../components/HeaderCompo';
import {AuthContext} from '../../Screens/Context';
import TextinputCompo from '../../components/TextinputCompo';
import makeApiCall from '../../utils/apiHelper';
import Loader from '../../components/Loader';
import {COLORS} from '../../styles/Colors';
import navigationString from '../../route/navigationString';

// ─── Constants ─────────────────────────────────────────────────
const THEME = {
  primary: '#1a56db',
  primaryLight: '#e6f1fb',
  primaryBorder: '#b5d4f4',
  primaryText: '#0c447c',
  success: '#0f6e56',
  successLight: '#e1f5ee',
  successBorder: '#9fe1cb',
  successText: '#085041',
  danger: '#e24b4a',
  dangerLight: '#fcebeb',
  dangerBorder: '#f7c1c1',
  amber: '#ba7517',
  amberLight: '#faeeda',
  amberBorder: '#fac775',
  amberText: '#633806',
};

const EMPTY_ROW = {
  product: '',
  description: '',
  enquiryQty: '',
  status: '',
  customerCode: '',
  specs: '',
  costingPrice: '',
};

// ─── Sub-components ────────────────────────────────────────────

const SectionHeader = ({title, color = THEME.primary, isDark}) => (
  <View style={S.secRow}>
    <View style={[S.secDot, {backgroundColor: color}]} />
    <Text style={[S.secLabel, isDark && {color: '#888'}]}>{title}</Text>
    <View style={[S.secLine, isDark && {backgroundColor: '#333'}]} />
  </View>
);

const Label = ({text, required, isDark}) => (
  <Text style={[S.label, isDark && {color: '#ccc'}]}>
    {text}
    {required && <Text style={{color: THEME.danger}}> *</Text>}
  </Text>
);

const SummaryCard = ({label, value, isDark}) => (
  <View style={[S.sumCard, isDark && {backgroundColor: '#1e1e1e'}]}>
    <Text style={[S.sumLabel, isDark && {color: '#888'}]}>{label}</Text>
    <Text style={[S.sumValue, isDark && {color: '#fff'}]}>{value}</Text>
  </View>
);

/** Status badge with color by value */
const StatusBadge = ({label}) => {
  const lower = (label ?? '').toLowerCase();
  let bg = THEME.amberLight,
    color = THEME.amberText;
  if (lower.includes('open')) {
    bg = THEME.successLight;
    color = THEME.successText;
  }
  if (lower.includes('close')) {
    bg = '#fcebeb';
    color = '#791f1f';
  }
  if (lower.includes('confirm')) {
    bg = THEME.primaryLight;
    color = THEME.primaryText;
  }
  return (
    <View style={[S.badge, {backgroundColor: bg, borderColor: bg}]}>
      <Text style={[S.badgeText, {color}]}>{label}</Text>
    </View>
  );
};

/** Smart action button */
const SmartButton = ({
  title,
  icon,
  variant = 'outline',
  onPress,
  style,
  disabled,
}) => {
  const variants = {
    primary: {
      bg: THEME.primary,
      border: THEME.primary,
      text: '#fff',
      iconBg: 'rgba(255,255,255,0.2)',
    },
    outline: {
      bg: 'transparent',
      border: '#ddd',
      text: '#333',
      iconBg: '#f0f0f0',
    },
    success: {
      bg: THEME.successLight,
      border: THEME.successBorder,
      text: THEME.successText,
      iconBg: THEME.successBorder,
    },
    danger: {
      bg: THEME.dangerLight,
      border: THEME.dangerBorder,
      text: THEME.danger,
      iconBg: THEME.dangerBorder,
    },
  };
  const v = variants[variant] ?? variants.outline;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[
        S.smartBtn,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}>
      {icon && (
        <View style={[S.smartBtnIcon, {backgroundColor: v.iconBg}]}>
          <Text style={{fontSize: 13, color: v.text}}>{icon}</Text>
        </View>
      )}
      <Text style={[S.smartBtnTitle, {color: v.text}]}>{title}</Text>
    </TouchableOpacity>
  );
};

/** Individual product row card in the list */
const RowCard = ({item, index, onDelete, isDark}) => (
  <View style={[S.rowCard, isDark && S.rowCardDark]}>
    <View style={S.rowCardHeader}>
      <View style={[S.rowIndex, isDark && {backgroundColor: '#2a2a2a'}]}>
        <Text style={[S.rowIndexText, isDark && {color: '#ccc'}]}>
          #{index + 1}
        </Text>
      </View>
      <Text
        style={[S.rowProductName, isDark && {color: '#fff'}]}
        numberOfLines={1}>
        {item.productLabel ?? `Product #${item.product}`}
      </Text>
      <TouchableOpacity onPress={() => onDelete(index)} style={S.delBtn}>
        <Text style={S.delBtnText}>✕</Text>
      </TouchableOpacity>
    </View>

    <View style={S.rowMeta}>
      <View style={S.metaItem}>
        <Text style={[S.metaLabel, isDark && {color: '#666'}]}>Qty</Text>
        <Text style={[S.metaValue, isDark && {color: '#ddd'}]}>
          {item.enquiryQty}
        </Text>
      </View>

      <View style={S.metaItem}>
        <Text style={[S.metaLabel, isDark && {color: '#666'}]}>Status</Text>
        <StatusBadge label={item.statusLabel ?? item.status} />
      </View>
      {item.customerCode ? (
        <View style={S.metaItem}>
          <Text style={[S.metaLabel, isDark && {color: '#666'}]}>Code</Text>
          <Text style={[S.metaValue, isDark && {color: '#ddd'}]}>
            {item.customerCode}
          </Text>
        </View>
      ) : null}
      <View style={S.metaItem}>
        <Text style={[S.metaLabel, isDark && {color: '#666'}]}>
          Costing Price
        </Text>
        <Text style={[S.metaValue, isDark && {color: '#ddd'}]}>
          {item.costingPrice}
        </Text>
      </View>
      {item.description ? (
        <View style={S.metaItem}>
          <Text style={[S.metaLabel, isDark && {color: '#666'}]}>
            Description
          </Text>
          <Text style={[S.metaValue, isDark && {color: '#ddd'}]}>
            {item.description}
          </Text>
        </View>
      ) : null}
    </View>
  </View>
);

// ─── Main Component ────────────────────────────────────────────
const AddEnquery = ({route, navigation}) => {
  const {currentUrl: server_origin} = useContext(AuthContext);
  const isDark = useColorScheme() === 'dark';

  const {
    division,
    customer,
    address,
    enquiry_type,
    enquiry_date,
    created_by,
    sales_person_id,
    userinfo,
    back_account,
    Query,
    termandcondition,
    pricelist,
    cost_center_id,
    client_ref_no,
    account_holder_id,
    Comments,
    opportunity_id,
    contact_person,
    contact_phone,
    contact_email,
  } = route.params;

  // ── State ───────────────────────────────────────────────────
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState(EMPTY_ROW);
  const [allProducts, setAllProducts] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Derived ─────────────────────────────────────────────────
  const totalQty = useMemo(
    () => rows.reduce((sum, r) => sum + (parseInt(r.enquiryQty, 10) || 0), 0),
    [rows],
  );

  const canAddRow =
    newRow.product && newRow.description && newRow.enquiryQty && newRow.status;

  // ── Fetch ────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch(server_origin + urls.fetchProducts, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({jsonrpc: '2.0', method: 'call', params: {}}),
      });
      const data = await res.json();
      setAllProducts(
        (data?.result ?? []).map(i => ({label: i.name, value: i.id})),
      );
    } catch (e) {
      console.error('fetchProducts:', e);
      Alert.alert('Error', 'Failed to load products.');
    } finally {
      setLoadingProducts(false);
    }
  }, [server_origin]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(server_origin + urls.fetchStatus, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({jsonrpc: '2.0', method: 'call', params: {}}),
      });
      const data = await res.json();
      const raw = data?.result?.[0]?.status_data ?? [];
      setStatusOptions(raw.map(([v, l]) => ({label: l, value: v.toString()})));
    } catch (e) {
      console.error('fetchStatus:', e);
    }
  }, [server_origin]);

  useEffect(() => {
    fetchProducts();
    fetchStatus();
  }, []);

  // ── Handlers ─────────────────────────────────────────────────
  const updateRow = (key, val) => setNewRow(prev => ({...prev, [key]: val}));

  const handleAddRow = () => {
    if (!canAddRow) {
      Alert.alert(
        'Missing fields',
        'Please fill Product, Description, Qty and Status.',
      );
      return;
    }
    const productLabel =
      allProducts.find(p => p.value === newRow.product)?.label ?? '';
    const statusLabel =
      statusOptions.find(s => s.value === newRow.status)?.label ?? '';
    setRows(prev => [
      ...prev,
      {...newRow, srNo: prev.length + 1, productLabel, statusLabel},
    ]);
    setNewRow(EMPTY_ROW);
  };

  const handleDeleteRow = index => {
    setRows(prev =>
      prev.filter((_, i) => i !== index).map((r, i) => ({...r, srNo: i + 1})),
    );
  };

  const handleSubmit = async () => {
    if (rows.length === 0) {
      Alert.alert(
        'No items',
        'Please add at least one product line before submitting.',
      );
      return;
    }
    const params = {
      division,
      customer,
      address,
      enquiry_type,
      enquiry_date,
      created_by,
      sales_person_id,
      back_account,
      contact_person,
      contact_phone,
      contact_email,
      Query: [Query],
      termandcondition: [termandcondition],
      pricelist,
      cost_center_id,
      client_ref_no,
      account_holder_id,
      Comments,
      opportunity_id,
      lines: rows.map(row => ({
        product: parseInt(row.product, 10),
        description: row.description,
        enquiryQty: row.enquiryQty,
        status: row.status,
        customercode: row.customerCode || '',
        descriptionSpecs: row.specs || '',
        costing_price: row.costingPrice || '',
      })),
    };
    console.log(params, 'Params');
    try {
      setIsSubmitting(true);
      const res = await makeApiCall(server_origin, urls.createEnquiry, 'POST', {
        jsonrpc: '2.0',
        method: 'call',
        params,
      });
      console.log(res?.result,'res?.result')
      if (res?.result?.success === true) {
        Alert.alert(
          'Success',
          res?.result?.message ?? 'Enquiry submitted successfully.',
        );
        navigation.navigate('Tabroutes', {
         screen: 'CRM',
          params: {
            refresh: true,
          },
        });
      } else {
        Alert.alert(
          'Error',
          res?.result?.message ?? 'Submission failed. Please try again.',
        );
      }
    } catch (e) {
      console.error('handleSubmit:', e);
      Alert.alert('Error', 'Failed to submit enquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────
  const bg = isDark ? '#111' : '#f4f4f4';

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <HeaderCompo
        title="Add Enquiry Lines"
        lefticon={require('../../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{flex: 1, backgroundColor: bg}}
        contentContainerStyle={S.scroll}
        keyboardShouldPersistTaps="handled">
        {/* ── PRODUCT LINE FORM ─────────────────── */}
        {/* <SectionHeader title="Product Line" isDark={isDark} /> */}

        <View style={[S.card, isDark && S.cardDark]}>
          <Label text="Product" required isDark={isDark} />
          <SingleDropdown
            data={allProducts}
            value={newRow.product}
            placeholder="Select product"
            isDarkMode={isDark}
            onChange={item => updateRow('product', item.value)}
          />

          <Label text="Description" required isDark={isDark} />
          <TextInput
            style={[S.input, isDark && S.inputDark]}
            placeholder="Enter description"
            placeholderTextColor={isDark ? '#555' : '#bbb'}
            value={newRow.description}
            onChangeText={v => updateRow('description', v)}
          />

          <View style={S.twoCol}>
            <View style={{flex: 1, marginRight: 8}}>
              <Label text="Enquiry qty" required isDark={isDark} />
              <TextInput
                style={[S.input, isDark && S.inputDark]}
                placeholder="0"
                placeholderTextColor={isDark ? '#555' : '#bbb'}
                keyboardType="numeric"
                value={newRow.enquiryQty}
                onChangeText={v => updateRow('enquiryQty', v)}
              />
            </View>
            <View style={{flex: 1}}>
              <Label text="Status" required isDark={isDark} />
              <SingleDropdown
                data={statusOptions}
                value={newRow.status}
                placeholder="Select"
                isDarkMode={isDark}
                onChange={item => updateRow('status', item.value)}
              />
            </View>
          </View>

          <Label text="Customer code" isDark={isDark} />
          <TextinputCompo
            placeholder="Enter customer code"
            style={[S.input, isDark && S.inputDark]}
            value={newRow.customerCode}
            onChangeText={v => updateRow('customerCode', v)}
          />
          <Label text="Costing Price" isDark={isDark} />
          <TextinputCompo
            placeholder="Costing Price"
            style={[S.input, isDark && S.inputDark]}
            value={newRow.costingPrice}
            onChangeText={v => updateRow('costingPrice', v)}
          />
          <Label text="Description specs" isDark={isDark} />
          <TextinputCompo
            placeholder="Enter specs…"
            style={[S.input, isDark && S.inputDark, {height: 90}]}
            multiline
            numberOfLines={4}
            value={newRow.specs}
            onChangeText={v => updateRow('specs', v)}
          />
        </View>

        {/* Add product button */}
        <SmartButton
          title="Add product to list"
          icon="+"
          variant="primary"
          onPress={handleAddRow}
          disabled={!canAddRow}
          style={S.btnFull}
        />

        {/* ── ADDED ITEMS ──────────────────────── */}
        <SectionHeader
          title="Added Items"
          color={THEME.success}
          isDark={isDark}
        />

        {/* Summary metrics */}
        <View style={S.summaryRow}>
          <SummaryCard
            label="Total items"
            value={rows.length}
            isDark={isDark}
          />
          <SummaryCard label="Total qty" value={totalQty} isDark={isDark} />
        </View>

        {rows.length === 0 ? (
          <View style={[S.emptyBox, isDark && S.cardDark]}>
            <Text style={[S.emptyIcon]}>📦</Text>
            <Text style={[S.emptyText, isDark && {color: '#666'}]}>
              No items added yet.{'\n'}Add a product above to get started.
            </Text>
          </View>
        ) : (
          rows.map((item, idx) => (
            <RowCard
              key={idx}
              item={item}
              index={idx}
              onDelete={handleDeleteRow}
              isDark={isDark}
            />
          ))
        )}

        {/* ── ACTION BUTTONS ───────────────────── */}
        <View style={S.actions}>
          <SmartButton
            title={isSubmitting ? 'Submitting…' : 'Submit enquiry'}
            icon="✓"
            variant="success"
            onPress={handleSubmit}
            disabled={isSubmitting || rows.length === 0}
            style={S.btnFull}
          />
          <View style={S.btnRow}>
            <SmartButton
              title="Clear all items"
              icon="↺"
              variant="outline"
              onPress={() => {
                if (rows.length === 0) return;
                Alert.alert('Clear all?', 'This will remove all added items.', [
                  {text: 'Cancel', style: 'cancel'},
                  {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => setRows([]),
                  },
                ]);
              }}
              style={S.btnHalf}
            />
            <SmartButton
              title="Discard & back"
              icon="✕"
              variant="danger"
              onPress={() => navigation.goBack()}
              style={S.btnHalf}
            />
          </View>
        </View>

        <View style={{height: 40}} />
      </ScrollView>

      <Loader visible={loadingProducts} text="Loading products…" />
    </KeyboardAvoidingView>
  );
};

// ─── Styles ─────────────────────────────────────────────────────
const S = StyleSheet.create({
  scroll: {padding: 14, paddingBottom: 32},

  secRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    marginBottom: 8,
  },
  secDot: {width: 7, height: 7, borderRadius: 4},
  secLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  secLine: {flex: 1, height: 0.5, backgroundColor: '#e0e0e0'},

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    padding: 14,
    marginBottom: 8,
  },
  cardDark: {backgroundColor: '#1e1e1e', borderColor: '#333'},

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginTop: 10,
    marginBottom: 4,
  },

  input: {
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    color: '#111',
    fontSize: 13,
    textAlignVertical: 'top',
  },
  inputDark: {backgroundColor: '#2a2a2a', borderColor: '#444', color: '#eee'},

  twoCol: {flexDirection: 'row', marginTop: 4},

  // Summary
  summaryRow: {flexDirection: 'row', gap: 8, marginBottom: 10},
  sumCard: {flex: 1, backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12},
  sumLabel: {fontSize: 11, color: '#888', marginBottom: 3},
  sumValue: {fontSize: 22, fontWeight: '500', color: '#111'},

  // Empty state
  emptyBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    padding: 28,
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyIcon: {fontSize: 28, marginBottom: 10},
  emptyText: {fontSize: 13, color: '#aaa', textAlign: 'center', lineHeight: 20},

  // Row cards
  rowCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    padding: 12,
    marginBottom: 8,
  },
  rowCardDark: {backgroundColor: '#1e1e1e', borderColor: '#333'},
  rowCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  rowIndex: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIndexText: {fontSize: 11, fontWeight: '700', color: '#888'},
  rowProductName: {flex: 1, fontSize: 13, fontWeight: '600', color: '#111'},
  rowMeta: {flexDirection: 'row', gap: 16, marginBottom: 6},
  metaItem: {alignItems: 'flex-start'},
  metaLabel: {fontSize: 10, color: '#999', marginBottom: 2},
  metaValue: {fontSize: 13, fontWeight: '500', color: '#222'},
  rowDesc: {fontSize: 12, color: '#888', lineHeight: 17},
  delBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fcebeb',
    borderWidth: 0.5,
    borderColor: '#f7c1c1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  delBtnText: {fontSize: 10, color: '#a32d2d', fontWeight: '700'},

  // Badge
  badge: {paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4},
  badgeText: {fontSize: 11, fontWeight: '600'},

  // Smart buttons
  actions: {marginTop: 16, gap: 8},
  btnFull: {width: '100%'},
  btnRow: {flexDirection: 'row', gap: 8},
  btnHalf: {flex: 1},
  smartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  smartBtnIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smartBtnTitle: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
});

export default AddEnquery;
