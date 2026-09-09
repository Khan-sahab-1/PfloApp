// import React, { useState } from 'react';
// import {
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ScrollView,
// } from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
// import { COLORS } from '../styles/Colors';

// const filterOptions = [
//   { label: 'Salesperson', key: 'salesperson' },
//   { label: 'Stage', key: 'Stage' },
// ];

// const FilterModal = ({ isVisible, onclose }) => {
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const applyFilter = () => {
//     const selectedKey = Object.keys(selectedOptions).find(k => selectedOptions[k]);
//     onApplyGroup(selectedKey || null);
//     onclose();
//   };
//   const getGroupedLeads = () => {
//     const leads = getFilteredLeads(); // your filtered leads by search/stage
  
//     if (groupBy !== 'salesperson') {
//       return [{ title: '', data: leads }];
//     }
  
//     const grouped = {};
//     leads.forEach(item => {
//       const key = item.sale_person?.trim() || 'Unknown';
//       if (!grouped[key]) grouped[key] = [];
//       grouped[key].push(item);
//     });
  
//     return Object.entries(grouped).map(([title, data]) => ({
//       title,
//       data,
//     }));
//   };
    

//   const toggleOption = (key) => {
//     setSelectedOptions(prev => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   return (
//     <Modal visible={isVisible} transparent onRequestClose={onclose}>
//       <TouchableOpacity style={styles.container} activeOpacity={1} onPress={onclose}>
//         <View style={styles.box}>
//           <Text style={styles.header}>Group by</Text>
//           <ScrollView>
//             {filterOptions.map((option, index) => (
//               <View key={option.key} style={styles.row}>
//                 <CheckBox
//                   value={!!selectedOptions[option.key]}
//                   onValueChange={() => toggleOption(option.key)}
//                   tintColors={{ true: COLORS.primary, false: '#888' }}
//                 />
//                 <Text style={styles.label}>
//                   {option.label}
//                 </Text>
//               </View>
//             ))}
//           </ScrollView>
//         </View>
//       </TouchableOpacity>
//     </Modal>
//   );
// };

// export default FilterModal;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'flex-end',
//   },
//   box: {
//     backgroundColor: COLORS.white,
//     padding: 15,
//     borderTopLeftRadius: 15,
//     borderTopRightRadius: 15,
//   },
//   header: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 10,
//     textAlign: 'center',
//     color:COLORS.black
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//   },
//   label: {
//     marginLeft: 10,
//     fontSize: 16,
//     color: COLORS.black,
//     fontWeight:'500'
//   },
// });

//bug id 2822 Jamshed start
// Description: Implemented a filter modal that allows users to group leads by different criteria such as salesperson or stage. The modal includes checkboxes for each grouping option and applies the selected filter to the lead list when the user confirms their selection. The implementation ensures that only one grouping option can be selected at a time, providing a clear and intuitive user experience for filtering leads in the app.
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { COLORS } from '../styles/Colors';

const filterOptions = [
  { label: 'Salesperson', key: 'salesperson' },
  { label: 'Stage', key: 'stage' },
  { label: 'Division', key: 'division' },
];

const FilterModal = ({ isVisible, onclose, onApplyGroup,filterOptions }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  console.log(selectedOptions,'Selected Option')

  const toggleOption = (key) => {
    // Only allow one selected group at a time
    setSelectedOptions({ [key]: !selectedOptions[key] });
  };

  const applyFilter = () => {
    const selectedKey = Object.keys(selectedOptions).find(k => selectedOptions[k]);
    onApplyGroup?.(selectedKey || null);
    onclose();
  };

  const clearFilter = () => {
    setSelectedOptions({});
    onApplyGroup?.(null);
    onclose();
  };

  return (
    <Modal visible={isVisible} transparent onRequestClose={onclose}>
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={onclose}>
        <View style={styles.box}>
          <Text style={styles.header}>Group by</Text>
          <ScrollView>
            {filterOptions.map((option) => (
              <View key={option.key} style={styles.row}>
                <CheckBox
                  value={!!selectedOptions[option.key]}
                  onValueChange={() => toggleOption(option.key)}
                  tintColors={{ true: COLORS.primary, false: '#888' }}
                />
                <Text style={styles.label}>{option.label}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.clearBtn} onPress={clearFilter}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={applyFilter}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  box: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    maxHeight: '50%',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: COLORS.black,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  applyBtn: {
    backgroundColor: COLORS.black,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
  },
  clearBtn: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
  },
  applyText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  clearText: {
    color: COLORS.black,
    textAlign: 'center',
    fontWeight: '600',
  },
});
//bug id 2822 Jamshed end
