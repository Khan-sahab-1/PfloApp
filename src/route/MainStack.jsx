// MainStack.jsx
// jamshed start bug id 2555
// Description: Created the main stack navigator for the application using React Navigation's createNativeStackNavigator. This stack includes various screens such as login, home, selfie, maps, leave requests, CRM, and more. The MainStack component serves as the central navigation structure for the app, allowing users to navigate between different screens seamlessly while maintaining a consistent user experience throughout the application.

import {StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import navigationString from './navigationString';
import UserLogInScreen from '../Screens/Login';
import Home from '../Screens/Home';
import Selfie from '../Screens/Selfie';
import Maps from '../Screens/Maps';
import LeaveRequest from '../Screens/Leave';
import LeaveData from '../Screens/LeaveData';
import EditLeaveData from '../Screens/EditLeaveData';
import NotificationPage from '../Screens/Notification';
import LeaveForm from '../Screens/LeaveForm';
import ForgotPasswordScreen from '../Screens/ForgetPin';
import CheckCalendar from '../Screens/CheckCalendar';
import AttendanceDetail from '../Screens/AttendanceDetail';
// import CRM from '../Screens/Crm';
import Leads from '../Screens/Leads';
import EnquiryLinesPage from '../Screens/EnquiryLinesPage';
// import Opportunity from '../Screens/Opportunity'
import LeadForm from '../Screens/LeadForm';
import OpportunityForm from '../Screens/OppForm';
import CreateEnquiryPage from '../Screens/CreateEnquiry';
import EditLeads from '../Screens/EditLeads';
import ConvertToOpportunity from '../Screens/ConvertToOpportunity';
import EditOpportunity from '../Screens/EditOpportunity';
import EditEnquiryPage from '../Screens/EditEnquiryPage';
import PlanOfAction from '../Screens/PlanOfAction';
import RemarkPage from '../Screens/RemarkPage';
import CreatePlanOfAction from '../Screens/CreatePlanOfAction';
import EditEnquiryLines from '../Screens/EditEnquiryLines';

import Tabroutes from './Tabroutes';
import {
  AddEnquery,
  Crm,
  EditLeadremark,
  Enquery,
  Leades,
  LeaveRequestForm,
  Opportunity,
  PreviewEditRemark,
  PreviewEnqueryQutaionmeet,
  Qutation,
  UpdateEnquiryLine,
} from '../screen/Index';
import {fetchUserData} from '../redux/reducers/Userinforeducers';
import {useDispatch} from 'react-redux';
import {AuthContext} from '../Screens/Context';
import PreviewLeads from '../screen/crm/Leads/PreviewLeads';
import ContactInformation from '../components/Modaals/ContactInformation';
import QueryComponents from '../components/QueryComponents';
import Termandcondition from '../Screens/Termandcondition';
import Extrainfo from '../components/Extrainfo';
import Remarksscreen from '../Screens/Remarksscreen';
import Attachmentscreen from '../screen/crm/Leads/Attachmentscreen';
import MapsPreview from '../components/MapsPreview';
const MainStack = Stack => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Login">
        <Stack.Screen name="Login" component={UserLogInScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Tabroutes" component={Tabroutes} />

        <Stack.Screen name="Selfie" component={Selfie} />
        <Stack.Screen name="Maps" component={Maps} />
        <Stack.Screen name="Leave" component={LeaveRequest} />
        <Stack.Screen name="LeaveData" component={LeaveData} />
        <Stack.Screen name="EditLeaveData" component={EditLeaveData} />
        <Stack.Screen name="NotificationPage" component={NotificationPage} />
        <Stack.Screen name="LeaveForm" component={LeaveForm} />
        <Stack.Screen name="ForgetPin" component={ForgotPasswordScreen} />
        <Stack.Screen name="CheckCalendar" component={CheckCalendar} />
        <Stack.Screen name="AttendanceDetail" component={AttendanceDetail} />
        <Stack.Screen name="Crm" component={Crm} />
        {/* <Stack.Screen name="Leads" component={Leads} /> */}
        <Stack.Screen name="Enquiry" component={EnquiryLinesPage} />
        {/* <Stack.Screen name="Opportunity" component={Opportunity} /> */}
        <Stack.Screen name="LeadForm" component={LeadForm} />
        <Stack.Screen name="OppForm" component={OpportunityForm} />
        <Stack.Screen name="CreateEnquiryPage" component={CreateEnquiryPage} />
        <Stack.Screen name="EditLeads" component={EditLeads} />
        <Stack.Screen
          name="ConvertToOpportunity"
          component={ConvertToOpportunity}
        />
        <Stack.Screen name="EditOpportunity" component={EditOpportunity} />
        <Stack.Screen name="EditEnquiryPage" component={EditEnquiryPage} />
        <Stack.Screen name="PlanOfAction" component={PlanOfAction} />
        <Stack.Screen name="EnquiryLinesPage" component={EnquiryLinesPage} />
        <Stack.Screen name="RemarkPage" component={RemarkPage} />
        <Stack.Screen
          name="CreatePlanOfAction"
          component={CreatePlanOfAction}
        />
        <Stack.Screen name="EditEnquiryLines" component={EditEnquiryLines} />
        <Stack.Screen name={navigationString.LEADES} component={Leades} />
        <Stack.Screen
          name={navigationString.PREVIEWLEADS}
          component={PreviewLeads}
        />
        <Stack.Screen
          name={navigationString.OPPOURTUNITY}
          component={Opportunity}
        />
        <Stack.Screen name={navigationString.ENQUERY} component={Enquery} />
        <Stack.Screen
          name={navigationString.LEAVEREQUEST}
          component={LeaveRequestForm}
        />
        <Stack.Screen
          name={navigationString.ADDENQUERY}
          component={AddEnquery}
        />
        <Stack.Screen
          name={navigationString.EDITENQUERYLILE}
          component={UpdateEnquiryLine}
        />
        <Stack.Screen
          name={navigationString.CONTACTINFORMATION}
          component={ContactInformation}
        />
        <Stack.Screen
          name={navigationString.QUERY}
          component={QueryComponents}
        />
        <Stack.Screen
          name={navigationString.TERMANDCONDITION}
          component={Termandcondition}
        />
        <Stack.Screen name={navigationString.EXTRAINFO} component={Extrainfo} />
        <Stack.Screen
          name={navigationString.REMARKSCREENS}
          component={Remarksscreen}
        />
        <Stack.Screen
          name={navigationString.EDITLEADREMARK}
          component={EditLeadremark}
        />
        <Stack.Screen
          name={navigationString.PREVIEWENQUERYQUTAIONMEET}
          component={PreviewEnqueryQutaionmeet}
        />
        <Stack.Screen
          name={navigationString.PREVIEWEDITREMARK}
          component={PreviewEditRemark}
        />
        <Stack.Screen name={navigationString.QUTATION} component={Qutation} />
        <Stack.Screen
          name={navigationString.ATTACHMENTSCREEN}
          component={Attachmentscreen}
        />
         <Stack.Screen
          name={navigationString.MAPSPREVIEW}
          component={MapsPreview}
        />


        {/* <Stack.Screen name={navigationString.LEADESFORM} component={LeadForm} /> */}
      </Stack.Navigator>
    </>
  );
};

export default MainStack;
//bug id 2555 Jamshed end
