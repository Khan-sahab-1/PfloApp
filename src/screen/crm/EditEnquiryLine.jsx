// //jamshed start bug id 2555
// // Description: Refactored the UpdateEnquiryLine component to enhance functionality and user experience. The updated component now includes a loading state, dynamic product and status dropdowns, improved form validation, and a more intuitive UI for editing enquiry lines. The design has been improved to provide clearer information about each field, and the code structure has been optimized for better readability and maintainability. Additionally, the component now handles API interactions more robustly, ensuring that users receive appropriate feedback during data submission and when fetching necessary information for the form.
// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   Alert,
//   useColorScheme,
//   ScrollView
// } from 'react-native';
// import urls from '../../../url';
// import SingleDropdown from '../../components/SingleDropdown';
// import HeaderCompo from '../../components/HeaderCompo';
// import ButtonCompo from '../../components/ButtonCompo';
// import { AuthContext } from '../../Screens/Context';
// import TextinputCompo from '../../components/TextinputCompo';
// import makeApiCall from '../../utils/apiHelper';
// import Loader from '../../components/Loader';
// import axios from 'axios';
// import { COLORS } from '../../styles/Colors';
// import Tablecomp from '../../components/Tablecompo';
// import navigationString from '../../route/navigationString';
 
 
// const UpdateEnquiryLine = ({ route, navigation }) => {
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

//  console.log(route.params, 'Route params in UpdateEnquiryLine');
//   const {
//     division,
//     customer,
//     address,
//     enquiry_type,
//     enquiry_date,
//     created_by,
//     sales_person_id,
//     userinfo,
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
 
// const addRow = () => {
//     if (!newRow.product || !newRow.description || !newRow.enquiryQty || !newRow.status) {
//       Alert.alert('Error', 'Please fill all fields before adding a row.');
//       return;
//     }
 
//     setRows((prevRows) => [
//       ...prevRows,
//       { ...newRow, srNo: prevRows.length + 1 },
//     ]);
//     setNewRow({ srNo: '', product: '', description: '', enquiryQty: '', status: '' , customerCode: '',
//       specs: '',});
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
 
//       if (!response.ok) throw new Error('Failed to fetch product data');
 
//       const result = await response.json();
//       const productData = result.result.map((item) => ({
//         label: item.name,
//         value: item.id.toString(),
//       }));
//       setProductOptions(productData);

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
 
 
 
//   const handleUpdateSubmit = async () => {
//     const { enquiryData, enquiryId } = route.params;
   
//     if (!newRow.product || !newRow.enquiryQty || !newRow.status) {
//       Alert.alert('Error', 'Please fill all required fields.');
//       return;
//     }
   
//     const payload = {
//       jsonrpc: '2.0',
//       method: 'call',
//       params: {
//         id: enquiryId,
//         lines: [
//           {
//             product: parseInt(newRow.product),
//             enquiry_qty: parseFloat(newRow.enquiryQty),
//             status: newRow.status,
//             customer_code: newRow.customerCode || '',
//             descriptionSpecs: newRow.specs || '',
//             line_id: enquiryData?.line_id || '',
            
//           },
//         ],
//       },
//     };
   
//     console.log('Payload for update enquiry line:', JSON.stringify(payload, null, 2));
   
//     try {
//       setIsLoading(true);
//       const response = await makeApiCall(server_origin, urls.updateEngueryData, 'POST', payload);
//       if (response?.result) {
//         Alert.alert('Success', 'Enquiry line updated successfully.');
//         navigation.goBack();
//       } else {
//         throw new Error('Update failed');
//       }
//     } catch (error) {
//       console.error('Update error:', error);
//       Alert.alert('Error', 'Failed to update enquiry line.');
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
  
 
//   useEffect(() => {
//     fetchProductData();
//     fetchStatusData();
//   }, []);
  
//   useEffect(() => {
//     const { enquiryData } = route.params || {};
//     if (enquiryData && productOptions.length > 0 && statusOptions.length > 0) {
//       const matchedProduct = productOptions.find(
//         p => p.value === (enquiryData?.product_id?.toString?.() ?? '')
//       );
      
//       const matchedStatus = statusOptions.find(
//         s => s.value === (enquiryData?.enq_status?.toString?.() ?? '')
//       );
      
  
//       setNewRow({
//         srNo: '',
//         product: matchedProduct?.value || '',
//         description: enquiryData.des || '',
//         enquiryQty: enquiryData.enq_qty?.toString() || '',
//         status: matchedStatus?.value || '',
//         customerCode: enquiryData.customer_code || '',
//         specs: enquiryData.desc_spec || '',
//       });
//     }
//   }, [productOptions, statusOptions]);
  

 
//   return (
//     <>
//       <HeaderCompo
//         title={'Edit Enquiry Line'}
//         lefticon={require('../../assets/back.png')}
//         onPress={() => navigation.goBack()}
//       />
//       <ScrollView style={{ flex: 1, backgroundColor: isDarkMode ? COLORS.black : COLORS.BACKGROUND }}>
 
//         <View style={styles.container}>
//           <View style={styles.inputContainer}>
//             <SingleDropdown
//               data={
//                 loadingProducts
//                   ? [{ label: 'Loading...', value: '' }]
//                   : productOptions
//               }
//               value={newRow.product}
//               onChange={item => {
//                 if (item.value !== '') {
//                   setNewRow(prev => ({ ...prev, product: item.value }));
//                 }
//               }}
//               placeholder="Select Product"
//               isDarkMode={isDarkMode}
//             />
 
//             {/* <TextInput
//               style={styles.input}
//               placeholder="Description"
//                placeholderTextColor={COLORS.PLACEHOLDER}
//               value={newRow.description}
//               onChangeText={text =>
//                 setNewRow(prev => ({ ...prev, description: text }))
 
//               }
//             /> */}
 
//             <TextInput
//               style={styles.input}
//               placeholder="Enquiry Qty"
//             placeholderTextColor={COLORS.PLACEHOLDER}
 
//               keyboardType="numeric"
//               value={newRow.enquiryQty}
//               onChangeText={text =>
//                 setNewRow(prev => ({ ...prev, enquiryQty: text }))
//               }
//             />
 
//             <SingleDropdown
//               data={statusOptions}
//               value={newRow.status}
//               onChange={item =>
//                 setNewRow(prev => ({ ...prev, status: item.value }))
//               }
//               placeholder="Select Status"
//               // label="Status"
//               isDarkMode={isDarkMode}
//               onFocus={fetchStatusData}
//             />
//             <TextinputCompo
//               placeholder={'Customer Code'}
//               value={newRow.customerCode}
//               onChangeText={(text) =>
//                 setNewRow((prev) => ({ ...prev, customerCode: text }))
//               }
//               style={styles.input}
//              placeholderTextColor={COLORS.PLACEHOLDER}
//             />
//             <TextinputCompo
//               placeholder={'Description Specs'}
//               value={newRow.specs}
//               onChangeText={(text) =>
//                 setNewRow((prev) => ({ ...prev, specs: text }))
//               }
//               style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
//               multiline={true}
//              placeholderTextColor={COLORS.PLACEHOLDER}
 
//             />
 
         
//           </View>
 
      
//           <ButtonCompo
//             title="Submit Data"
//             style={styles.submitButton}
//             onPress={handleUpdateSubmit}
//           />
//           <Loader visible={loadingProducts} />
//         </View>
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
 
// export default UpdateEnquiryLine
// //bug id 2555 Jamshed end



// jamshed start bug id 2555
import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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

// ─── Constants (same as AddEnquery) ────────────────────────────
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

// ─── Reusable Sub-components (same as AddEnquery) ──────────────

const Label = ({text, required, isDark}) => (
  <Text style={[S.label, isDark && {color: '#ccc'}]}>
    {text}
    {required && <Text style={{color: THEME.danger}}> *</Text>}
  </Text>
);

const SectionHeader = ({title, color = THEME.primary, isDark}) => (
  <View style={S.secRow}>
    <View style={[S.secDot, {backgroundColor: color}]} />
    <Text style={[S.secLabel, isDark && {color: '#888'}]}>{title}</Text>
    <View style={[S.secLine, isDark && {backgroundColor: '#333'}]} />
  </View>
);

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

// ─── Pre-fill Badge to show existing value ─────────────────────
const PrefilledBadge = ({label, isDark}) =>
  label ? (
    <View
      style={[
        S.prefilledBadge,
        isDark && {backgroundColor: '#2a2a2a', borderColor: '#444'},
      ]}>
      <Text style={[S.prefilledDot, {color: THEME.primary}]}>●</Text>
      <Text style={[S.prefilledText, isDark && {color: '#aaa'}]}>
        Current: {label}
      </Text>
    </View>
  ) : null;

// ─── Main Component ────────────────────────────────────────────
const UpdateEnquiryLine = ({route, navigation}) => {
  const {currentUrl: server_origin} = useContext(AuthContext);
  const isDark = useColorScheme() === 'dark';
  const bg = isDark ? '#111' : '#f4f4f4';

  const {enquiryData, enquiryId} = route.params || {};

  console.log(route.params, 'Route params in UpdateEnquiryLine');

  // ── State ───────────────────────────────────────────────────
  const [productOptions, setProductOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prefilledReady, setPrefilledReady] = useState(false);

  const [formRow, setFormRow] = useState({
    product: '',
    productLabel: '',
    description: '',
    enquiryQty: '',
    status: '',
    statusLabel: '',
    customerCode: '',
    specs: '',
    costingPrice: '',
  });

  const updateField = (key, val) =>
    setFormRow(prev => ({...prev, [key]: val}));

  // ── Validation ───────────────────────────────────────────────
  const canSubmit =
    formRow.product && formRow.enquiryQty && formRow.status && !isSubmitting;

  // ── Fetch products ───────────────────────────────────────────
  const fetchProductData = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch(server_origin + urls.fetchProducts, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({jsonrpc: '2.0', method: 'call', params: {}}),
      });
      const data = await res.json();
      setProductOptions(
        (data?.result ?? []).map(i => ({
          label: i.name,
          value: i.id.toString(),
        })),
      );
    } catch (e) {
      console.error('fetchProducts:', e);
      Alert.alert('Error', 'Failed to load products.');
    } finally {
      setLoadingProducts(false);
    }
  }, [server_origin]);

  // ── Fetch status ─────────────────────────────────────────────
  const fetchStatusData = useCallback(async () => {
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
    fetchProductData();
    fetchStatusData();
  }, []);

  // ── Pre-fill form once both dropdowns are ready ──────────────
  useEffect(() => {
    if (
      !enquiryData ||
      productOptions.length === 0 ||
      statusOptions.length === 0 ||
      prefilledReady
    )
      return;

    const matchedProduct = productOptions.find(
      p => p.value === (enquiryData?.product_id?.toString?.() ?? ''),
    );
    const matchedStatus = statusOptions.find(
      s => s.value === (enquiryData?.enq_status?.toString?.() ?? ''),
    );

    setFormRow({
      product: matchedProduct?.value || '',
      productLabel: matchedProduct?.label || '',
      description: enquiryData.des || '',
      enquiryQty: enquiryData.enq_qty?.toString() || '',
      status: matchedStatus?.value || '',
      statusLabel: matchedStatus?.label || '',
      customerCode: enquiryData.customer_code || '',
      specs: enquiryData.desc_spec || '',
      costingPrice: enquiryData.costing_price?.toString() || '',
    });

    setPrefilledReady(true);
  }, [productOptions, statusOptions]);

  // ── Submit ───────────────────────────────────────────────────
  const handleUpdateSubmit = async () => {
    if (!canSubmit) {
      Alert.alert('Missing fields', 'Please fill Product, Qty and Status.');
      return;
    }

    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        id: enquiryId,
        lines: [
          {
            product: parseInt(formRow.product, 10),
            enquiry_qty: parseFloat(formRow.enquiryQty),
            status: formRow.status,
            customer_code: formRow.customerCode || '',
            descriptionSpecs: formRow.specs || '',
            costing_price: formRow.costingPrice || '',
            line_id: enquiryData?.line_id || '',
          },
        ],
      },
    };

    console.log(
      'Payload for update enquiry line:',
      JSON.stringify(payload, null, 2),
    );

    try {
      setIsSubmitting(true);
      const response = await makeApiCall(
        server_origin,
        urls.updateEngueryData,
        'POST',
        payload,
      );
      if (response?.result) {
        Alert.alert('Success', 'Enquiry line updated successfully.');
        navigation.goBack();
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update enquiry line.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <HeaderCompo
        title="Edit Enquiry Line"
        lefticon={require('../../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{flex: 1, backgroundColor: bg}}
        contentContainerStyle={S.scroll}
        keyboardShouldPersistTaps="handled">

        {/* ── Edit info banner ─────────────────── */}
        {/* <View
          style={[
            S.infoBanner,
            isDark && {backgroundColor: '#1a2a1a', borderColor: '#2a4a2a'},
          ]}>
          <Text style={[S.infoBannerText, isDark && {color: '#9fe1cb'}]}>
            ✎ Editing existing enquiry line
            {enquiryData?.line_id ? `  •  Line ID: ${enquiryData.line_id}` : ''}
          </Text>
        </View> */}

        {/* ── FORM CARD ─────────────────────────── */}
        {/* <SectionHeader title="Product Line Details" isDark={isDark} /> */}

        <View style={[S.card, isDark && S.cardDark]}>

          {/* Product */}
          <Label text="Product" required isDark={isDark} />
          {/* <PrefilledBadge label={formRow.productLabel} isDark={isDark} /> */}
          <SingleDropdown
            data={
              loadingProducts
                ? [{label: 'Loading…', value: ''}]
                : productOptions
            }
            value={formRow.product}
            placeholder="Select product"
            isDarkMode={isDark}
            onChange={item => {
              const label =
                productOptions.find(p => p.value === item.value)?.label || '';
              updateField('product', item.value);
              updateField('productLabel', label);
            }}
          />

          {/* Description */}
          <Label text="Description" isDark={isDark} />
          <TextInput
            style={[S.input, isDark && S.inputDark]}
            placeholder="Enter description"
            placeholderTextColor={isDark ? '#555' : '#bbb'}
            value={formRow.description}
            onChangeText={v => updateField('description', v)}
          />

          {/* Qty + Status row */}
          <View style={S.twoCol}>
            <View style={{flex: 1, marginRight: 8}}>
              <Label text="Enquiry qty" required isDark={isDark} />
              <TextInput
                style={[S.input, isDark && S.inputDark]}
                placeholder="0"
                placeholderTextColor={isDark ? '#555' : '#bbb'}
                keyboardType="numeric"
                value={formRow.enquiryQty}
                onChangeText={v => updateField('enquiryQty', v)}
              />
            </View>
            <View style={{flex: 1}}>
              <Label text="Status" required isDark={isDark} />
              {/* <PrefilledBadge label={formRow.statusLabel} isDark={isDark} /> */}
              <SingleDropdown
                data={statusOptions}
                value={formRow.status}
                placeholder="Select"
                isDarkMode={isDark}
                onChange={item => {
                  const label =
                    statusOptions.find(s => s.value === item.value)?.label ||
                    '';
                  updateField('status', item.value);
                  updateField('statusLabel', label);
                }}
              />
            </View>
          </View>

          {/* Customer code */}
          <Label text="Customer code" isDark={isDark} />
          <TextinputCompo
            placeholder="Enter customer code"
            value={formRow.customerCode}
            onChangeText={v => updateField('customerCode', v)}
            style={[S.input, isDark && S.inputDark]}
          />

          {/* Costing price */}
          <Label text="Costing Price" isDark={isDark} />
          <TextinputCompo
            placeholder="Costing Price"
            value={formRow.costingPrice}
            onChangeText={v => updateField('costingPrice', v)}
            style={[S.input, isDark && S.inputDark]}
          />

          {/* Description specs */}
          <Label text="Description specs" isDark={isDark} />
          <TextinputCompo
            placeholder="Enter specs…"
            multiline
            numberOfLines={4}
            value={formRow.specs}
            onChangeText={v => updateField('specs', v)}
            style={[S.input, isDark && S.inputDark, {height: 90}]}
          />
        </View>

        {/* ── ACTION BUTTONS ───────────────────── */}
        <View style={S.actions}>
          <SmartButton
            title={isSubmitting ? 'Updating…' : 'Update enquiry line'}
            icon="✓"
            variant="success"
            onPress={handleUpdateSubmit}
            disabled={!canSubmit}
            style={S.btnFull}
          />
          <SmartButton
            title="Discard & back"
            icon="✕"
            variant="danger"
            onPress={() => navigation.goBack()}
            style={S.btnFull}
          />
        </View>

        <View style={{height: 40}} />
      </ScrollView>

      <Loader visible={loadingProducts} text="Loading products…" />
    </KeyboardAvoidingView>
  );
};

// ─── Styles (mirrors AddEnquery) ────────────────────────────────
const S = StyleSheet.create({
  scroll: {padding: 14, paddingBottom: 32},

  // Info banner
  infoBanner: {
    backgroundColor: THEME.successLight,
    borderWidth: 1,
    borderColor: THEME.successBorder,
    borderRadius: 10,
    padding: 10,
    marginBottom: 4,
  },
  infoBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.successText,
  },

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

  // Pre-filled badge
  prefilledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.primaryLight,
    borderWidth: 1,
    borderColor: THEME.primaryBorder,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 6,
    gap: 6,
    alignSelf: 'flex-start',
  },
  prefilledDot: {fontSize: 8},
  prefilledText: {
    fontSize: 11,
    color: THEME.primaryText,
    fontWeight: '500',
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

  actions: {marginTop: 16, gap: 8},
  btnFull: {width: '100%'},

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

export default UpdateEnquiryLine;
// jamshed end bug id 2555