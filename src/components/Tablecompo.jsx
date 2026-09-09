//bug id 2822 Jamshed start
// Description: Added a new table component that displays data in a structured format with customizable columns and styling. The component uses the 'react-native-table-component' library to render the table and supports features such as horizontal scrolling for wide tables. It is designed to be reusable and can be integrated into various parts of the app where tabular data needs to be displayed effectively.
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { COLORS } from '../styles/Colors';

const Tablecomp = ({ tableData }) => {
 
  const tableHead = ['Sr. No', 'Product', 'Description', 'Enquiry Qty', 'Status', 'Customer Code', 'Description Specs'];
  const widthArr = [60, 100, 100, 100, 100, 120, 160];

  if (!tableData || tableData.length === 0) return null;

  const formattedData = tableData.map(row => [
    row.srNo,
    row.product,
    row.description,
    row.enquiryQty,
    row.status,
    row.customerCode,
    row.specs,
  ]);
  

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <View>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
            <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text} />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
              {
                formattedData.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={widthArr}
                    style={[styles.row, index % 2 && { backgroundColor: '#F7F6E7' }]}
                    textStyle={{...styles.text,color:COLORS.black}}
                  />
                ))
              }
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default Tablecomp;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center', fontWeight: '500', color: COLORS.white },
  dataWrapper: { marginTop: -1 },
  row: { height: 60, backgroundColor: '#E7E6E1' }
});
//bug id 2822 Jamshed end