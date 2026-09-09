import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Switch,
    Alert,
    useColorScheme,
    ScrollView,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { AuthContext } from './Context';
import urls from '../../url';

const ConvertToOpportunity = ({ route }) => {
    const { leadData } = route.params;
    console.log("convert to opportunity", leadData)
    const [mergeWithExisting, setMergeWithExisting] = useState(false);
    const [opportunityName, setOpportunityName] = useState('');
    const [existingOpportunityId, setExistingOpportunityId] = useState('');
    const [salesperson, setSalesperson] = useState('');
    const [salesChannel, setSalesChannel] = useState('');
    const [assignTo, setAssignTo] = useState('');
    const [linkToCustomer, setLinkToCustomer] = useState(false);
    const [doNotLinkToCustomer, setDoNotLinkToCustomer] = useState(false);
    const [division, setDivision] = useState('');
    const [customer, setCustomer] = useState('');
    const [customerOptions, setCustomerOptions] = useState([]);

    const contextType = useContext(AuthContext);
    const server_origin = contextType.currentUrl;
    const fetchCustomerUrl = server_origin + urls.fetchCustomer;

    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    useEffect(() => {
        if (leadData) {
            setSalesperson(leadData.sale_person || '');
            setSalesChannel(leadData.sale_channel || '');
            setAssignTo(leadData.assign_to || '');
            setDivision(leadData.division || '');
        }
        fetchCustomerData();
    }, [leadData]);

    const fetchCustomerData = async () => {
        try {
            const response = await fetch(fetchCustomerUrl, {
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

            if (!response.ok) throw new Error('Failed to fetch customer data');

            const result = await response.json();
            console.log('^^^^^^^^^^customer data^^^^^^^^^^^^', result);

            // ✅ Map only customer names
            const customers = result.result.map(customer => customer.name);
            setCustomerOptions(customers);
        } catch (error) {
            console.error('Error fetching customer data:', error);
            Alert.alert('Error', 'Failed to fetch customer data.');
        }
    };


    const handleConversion = () => {
        if (!mergeWithExisting && !opportunityName.trim()) {
            Alert.alert('Validation Error', 'Opportunity name is required.');
            return;
        }

        if (mergeWithExisting && !existingOpportunityId.trim()) {
            Alert.alert('Validation Error', 'Existing Opportunity ID is required.');
            return;
        }

        const conversionData = {
            action: mergeWithExisting ? 'Merge with Existing Opportunity' : 'Convert to Opportunity',
            opportunityName: mergeWithExisting ? null : opportunityName,
            existingOpportunityId: mergeWithExisting ? existingOpportunityId : null,
            salesperson,
            salesChannel,
            assignTo,
            linkToCustomer,
            doNotLinkToCustomer,
            division,
            customer,
        };

        console.log('Conversion Data:', conversionData);

        Alert.alert(
            'Conversion Successful',
            mergeWithExisting
                ? `Merged with Opportunity ID: ${existingOpportunityId}`
                : `New Opportunity Created: ${opportunityName}`
        );
    };

    const styles = getStyles(isDarkMode);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Convert to Opportunity</Text>
                </View>
                <Text style={styles.heading}>Conversion Action</Text>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Convert to Opportunity</Text>
                    <Switch
                        value={!mergeWithExisting}
                        onValueChange={(value) => setMergeWithExisting(!value)}
                    />
                </View>
                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Merge with Existing Opportunity</Text>
                    <Switch
                        value={mergeWithExisting}
                        onValueChange={(value) => setMergeWithExisting(value)}
                    />
                </View>

                {/* Conditional Input Fields */}
                {!mergeWithExisting ? (
                    <View style={styles.inputContainer}>
                        {/* <Text style={styles.label}>Opportunity Name:</Text>
                        <TextInput
                            style={styles.input}
                            value={opportunityName}
                            onChangeText={setOpportunityName}
                            placeholder="Enter opportunity name"
                            placeholderTextColor={isDarkMode ? '#888' : '#ccc'}
                        /> */}
                    </View>
                ) : (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Existing Opportunity ID:</Text>
                        <TextInput
                            style={styles.input}
                            value={existingOpportunityId}
                            onChangeText={setExistingOpportunityId}
                            placeholder="Enter opportunity ID"
                            placeholderTextColor={isDarkMode ? '#888' : '#ccc'}
                        />
                    </View>
                )}
                <Text style={styles.heading}>Assign this opportunity to</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Salesperson:</Text>
                    <TextInput
                        style={styles.input}
                        value={salesperson}
                        onChangeText={setSalesperson}
                        placeholder="Enter salesperson"
                        placeholderTextColor={isDarkMode ? '#888' : '#ccc'}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Sales Channel:</Text>
                    <TextInput
                        style={styles.input}
                        value={salesChannel}
                        onChangeText={setSalesChannel}
                        placeholder="Enter sales channel"
                        placeholderTextColor={isDarkMode ? '#888' : '#ccc'}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Assign To:</Text>
                    <TextInput
                        style={styles.input}
                        value={assignTo}
                        onChangeText={setAssignTo}
                        placeholder="Enter assignee"
                        placeholderTextColor={isDarkMode ? '#888' : '#ccc'}
                    />
                </View>

                <Text style={styles.heading}>Customers</Text>

                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Link to an Existing Customer</Text>
                    <Switch
                        value={linkToCustomer}
                        onValueChange={setLinkToCustomer}
                    />
                </View>

                <View style={styles.option}>
                    <Text style={styles.optionLabel}>Do Not Link to a Customer</Text>
                    <Switch
                        value={doNotLinkToCustomer}
                        onValueChange={setDoNotLinkToCustomer}
                    />
                </View>
                {!doNotLinkToCustomer && (
                    <>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Division:</Text>
                            <TextInput
                                style={styles.input}
                                value={division}
                                onChangeText={setDivision}
                                placeholder="Enter division"
                                placeholderTextColor={isDarkMode ? '#888' : '#ccc'}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Customer:</Text>
                            <ModalDropdown
                                options={customerOptions.length > 0 ? customerOptions : ["No customers available"]}
                                defaultValue="Select Customer"
                                onSelect={(index, value) => setCustomer(value)}
                                style={styles.input}
                                textStyle={{ color: isDarkMode ? '#fff' : '#000' }}
                                dropdownStyle={{
                                    width: '80%',
                                    height: 200,
                                    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',  // 🔥 Dark mode background
                                    borderColor: isDarkMode ? '#444' : '#ccc',
                                    borderWidth: 1,
                                }}
                                renderRow={(option, index) => (
                                    <Text
                                        style={{
                                            padding: 10,
                                            color: isDarkMode ? '#fff' : '#000',  // 🔥 Text color in dropdown
                                            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                                        }}
                                        key={index}
                                    >
                                        {option}
                                    </Text>
                                )}
                            />
                        </View>
                    </>
                )}

                <TouchableOpacity style={styles.convertButton} onPress={handleConversion}>
                    <Text style={styles.convertButtonText}>Convert</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const getStyles = (isDarkMode) =>
    StyleSheet.create({
        scrollContainer: {
            flexGrow: 1,
        },
        container: {
            flex: 1,
            padding: 20,
            backgroundColor: isDarkMode ? '#121212' : '#fff',
        },
        titleContainer: {
            backgroundColor: 'blue',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            marginBottom: 20,
            alignItems: 'center',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#fff',
        },

        heading: {
            fontSize: 20,
            fontWeight: '600',
            marginBottom: 10,
            color: isDarkMode ? '#fff' : '#000',
        },
        option: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 10,
        },
        optionLabel: {
            fontSize: 16,
            color: isDarkMode ? '#fff' : '#000',
            marginRight: 10,
        },
        inputContainer: {
            marginBottom: 20,
        },
        label: {
            fontSize: 16,
            marginBottom: 5,
            color: isDarkMode ? '#fff' : '#000',
        },
        input: {
            height: 40,
            borderColor: isDarkMode ? '#444' : '#ccc',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            color: isDarkMode ? '#fff' : '#000',
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
        },
        convertButton: {
            backgroundColor: 'blue',
            paddingVertical: 10,
            borderRadius: 5,
            alignItems: 'center',
        },
        convertButtonText: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

export default ConvertToOpportunity;
