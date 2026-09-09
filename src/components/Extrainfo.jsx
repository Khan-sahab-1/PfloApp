//bug id 2822 Jamshed start
// Description: Added a new screen for extra information related to leads/enquiries, allowing users to input campaign details, assigned and closed dates, referred by information, and probability. The screen fetches necessary dropdown data from the server and sends the collected information back to the parent component on save.
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import TextinputCompo from './TextinputCompo';
import {COLORS} from '../styles/Colors';
import SingleDropdown from './SingleDropdown';
import urls from '../../url';
import {AuthContext} from '../Screens/Context';
import makeApiCall from '../utils/apiHelper';
import HeaderCompo from './HeaderCompo';
import CalendarInput from './CalendarInput';

const Extrainfo = ({navigation, route}) => {
  const {currentUrl: server_origin} = useContext(AuthContext);
  const toDay = new Date().toISOString().split('T')[0];
  // Receive callback from parent
  const onSave = route?.params?.onSave;
  const {leadData} = route?.params;
  // console.log(leadData, 'Lead Data');
  // console.log(leadData?.date_closed);

  // Dropdown lists
  const [campaignList, setCampaignList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [mediumList, setMediumList] = useState([]);

  // Selected values - initialize with leadData
  const [campaign, setCampaign] = useState(leadData?.campaign_id || '');
  const [medium, setMedium] = useState(leadData?.medium_id || '');
  const [source, setSource] = useState(leadData?.source_id || '');

  // Dates - format from leadData
  const [queryraiseddate, setqueryraiseddate] = useState(
    leadData?.date_open ? leadData.date_open.split(' ')[0] : '',
  );
  const [querycloseddate, setquerycloseddate] = useState(
    leadData?.date_closed ? leadData.date_closed.split(' ')[0] : '',
  );

  // Text fields
  const [referredBy, setReferredBy] = useState(leadData?.referred || '');
  const [probability, setprobability] = useState(
    leadData?.probability?.toString() || '',
  );

  // Format date from API to YYYY-MM-DD for CalendarInput
  function formatDateForDisplay(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  // Format date for API submission
  function formatDateForAPI(dateString) {
    if (!dateString) return '';
    return `${dateString} 00:00:00`;
  }

  // ---------------- FETCH DATA ----------------
  const fetchCampaign = async () => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchcompaindata,
        'POST',
        {jsonrpc: '2.0', method: 'call'},
      );
      if (response?.result) {
        const formattedList = response.result.map(i => ({
          label: i.campaign_name,
          value: i.campaign_id,
        }));
        setCampaignList(formattedList);
      }
    } catch (error) {
      console.error('Error fetching campaign', error);
    }
  };

  const fetchSource = async () => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchsource,
        'POST',
        {jsonrpc: '2.0', method: 'call'},
      );
      if (response?.result) {
        const formattedList = response.result.map(i => ({
          label: i.source_name,
          value: i.source_id,
        }));
        setSourceList(formattedList);
      }
    } catch (error) {
      console.error('Error fetching source', error);
    }
  };

  const fetchMedium = async () => {
    try {
      const response = await makeApiCall(
        server_origin,
        urls.fetchmedium,
        'POST',
        {jsonrpc: '2.0', method: 'call'},
      );
      if (response?.result) {
        const formattedList = response.result.map(i => ({
          label: i.medium_name,
          value: i.medium_id,
        }));
        setMediumList(formattedList);
      }
    } catch (error) {
      console.error('Error fetching medium', error);
    }
  };

  useEffect(() => {
    fetchCampaign();
    fetchSource();
    fetchMedium();
  }, []);

  // Set default selected values after lists are loaded
  useEffect(() => {
    if (leadData && campaignList.length > 0) {
      // Find and set the selected campaign label
      const selectedCampaign = campaignList.find(
        item => item.value === leadData.campaign_id,
      );
      if (selectedCampaign) {
        setCampaign(selectedCampaign.value);
      }
    }
  }, [campaignList, leadData]);

  useEffect(() => {
    if (leadData && mediumList.length > 0) {
      const selectedMedium = mediumList.find(
        item => item.value === leadData.medium_id,
      );
      if (selectedMedium) {
        setMedium(selectedMedium.value);
      }
    }
  }, [mediumList, leadData]);

  useEffect(() => {
    if (leadData && sourceList.length > 0) {
      const selectedSource = sourceList.find(
        item => item.value === leadData.source_id,
      );
      if (selectedSource) {
        setSource(selectedSource.value);
      }
    }
  }, [sourceList, leadData]);

  // ---------------- SAVE ----------------
  const handleSave = () => {
    const finalData = {
      campaign_id: campaign,
      medium_id: medium,
      source_id: source,
      query_raised_date: queryraiseddate,
      query_closed_date: querycloseddate,
      referred_by: referredBy,
      probability: probability ? parseInt(probability, 10) : 0,
      // Include original lead ID for updating
      lead_id: leadData?.lead_id || leadData?.id,
    };

    // console.log('📌 Final Extra Info Payload:', finalData);

    if (onSave) {
      onSave(finalData); // send data to parent
    }

    navigation.goBack();
  };

  return (
    <>
      <HeaderCompo
        title={'Extra Information'}
        lefticon={require('../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Campaign Details</Text>

          <Text style={styles.normalText}>Campaign</Text>
          <SingleDropdown
            data={campaignList}
            placeholder="Select Campaign"
            value={campaign}
            onChange={item => setCampaign(item.value)}
          />

          <Text style={styles.normalText}>Medium</Text>
          <SingleDropdown
            data={mediumList}
            placeholder="Select Medium"
            value={medium}
            onChange={item => setMedium(item.value)}
          />

          <Text style={styles.normalText}>Source</Text>
          <SingleDropdown
            data={sourceList}
            placeholder="Select Source"
            value={source}
            onChange={item => setSource(item.value)}
          />

          <Text style={styles.normalText}>Assigned Date</Text>
          <CalendarInput
            value={queryraiseddate}
            onChange={setqueryraiseddate}
            placeholder="Select Raised Date"
            styles={styles}
            COLORS={COLORS}
          />

          <Text style={styles.normalText}>Closed Date</Text>
          <CalendarInput
            value={querycloseddate}
            onChange={setquerycloseddate}
            placeholder="Select Closed Date"
            styles={styles}
            COLORS={COLORS}
          />

          <Text style={styles.normalText}>Referred By</Text>
          <TextinputCompo
            value={referredBy}
            onChangeText={setReferredBy}
            placeholder="Referred By"
          />

          <Text style={styles.normalText}>Probability</Text>
          <TextinputCompo
            value={probability}
            onChangeText={setprobability}
            placeholder="Probability"
            keyboardType="numeric"
            maxLength={3}
          />

          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveText}>Save </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  normalText: {
    fontSize: 16,
    color: COLORS.black,
    marginTop: 10,
  },
  saveBtn: {
    marginVertical: 30,
    backgroundColor: COLORS.BLUE,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Extrainfo;
//bug id 2822 Jamshed end