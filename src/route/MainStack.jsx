import {guardScreen} from '../offline/guardScreen';
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
import OfflineDashboard from '../offline/OfflineDashboard';
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
const MainStack = (Stack, initialRouteName = 'Login') => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={initialRouteName}>
        <Stack.Screen name="Login" component={guardScreen(UserLogInScreen)} />
        <Stack.Screen name="OfflineDashboard" component={guardScreen(OfflineDashboard)} />
        <Stack.Screen name="Home" component={guardScreen(Home)} />
        <Stack.Screen name="Tabroutes" component={guardScreen(Tabroutes)} />

        <Stack.Screen name="Selfie" component={guardScreen(Selfie)} />
        <Stack.Screen name="Maps" component={guardScreen(Maps)} />
        <Stack.Screen name="Leave" component={guardScreen(LeaveRequest)} />
        <Stack.Screen name="LeaveData" component={guardScreen(LeaveData)} />
        <Stack.Screen name="EditLeaveData" component={guardScreen(EditLeaveData)} />
        <Stack.Screen name="NotificationPage" component={guardScreen(NotificationPage)} />
        <Stack.Screen name="LeaveForm" component={guardScreen(LeaveForm)} />
        <Stack.Screen name="ForgetPin" component={guardScreen(ForgotPasswordScreen)} />
        <Stack.Screen name="CheckCalendar" component={guardScreen(CheckCalendar)} />
        <Stack.Screen name="AttendanceDetail" component={guardScreen(AttendanceDetail)} />
        <Stack.Screen name="Crm" component={guardScreen(Crm)} />
        {/* <Stack.Screen name="Leads" component={guardScreen(Leads)} /> */}
        <Stack.Screen name="Enquiry" component={guardScreen(EnquiryLinesPage)} />
        {/* <Stack.Screen name="Opportunity" component={guardScreen(Opportunity)} /> */}
        <Stack.Screen name="LeadForm" component={guardScreen(LeadForm)} />
        <Stack.Screen name="OppForm" component={guardScreen(OpportunityForm)} />
        <Stack.Screen name="CreateEnquiryPage" component={guardScreen(CreateEnquiryPage)} />
        <Stack.Screen name="EditLeads" component={guardScreen(EditLeads)} />
        <Stack.Screen
          name="ConvertToOpportunity"
          component={guardScreen(ConvertToOpportunity)}
        />
        <Stack.Screen name="EditOpportunity" component={guardScreen(EditOpportunity)} />
        <Stack.Screen name="EditEnquiryPage" component={guardScreen(EditEnquiryPage)} />
        <Stack.Screen name="PlanOfAction" component={guardScreen(PlanOfAction)} />
        <Stack.Screen name="EnquiryLinesPage" component={guardScreen(EnquiryLinesPage)} />
        <Stack.Screen name="RemarkPage" component={guardScreen(RemarkPage)} />
        <Stack.Screen
          name="CreatePlanOfAction"
          component={guardScreen(CreatePlanOfAction)}
        />
        <Stack.Screen name="EditEnquiryLines" component={guardScreen(EditEnquiryLines)} />
        <Stack.Screen name={navigationString.LEADES} component={guardScreen(Leades)} />
        <Stack.Screen
          name={navigationString.PREVIEWLEADS}
          component={guardScreen(PreviewLeads)}
        />
        <Stack.Screen
          name={navigationString.OPPOURTUNITY}
          component={guardScreen(Opportunity)}
        />
        <Stack.Screen name={navigationString.ENQUERY} component={guardScreen(Enquery)} />
        <Stack.Screen
          name={navigationString.LEAVEREQUEST}
          component={guardScreen(LeaveRequestForm)}
        />
        <Stack.Screen
          name={navigationString.ADDENQUERY}
          component={guardScreen(AddEnquery)}
        />
        <Stack.Screen
          name={navigationString.EDITENQUERYLILE}
          component={guardScreen(UpdateEnquiryLine)}
        />
        <Stack.Screen
          name={navigationString.CONTACTINFORMATION}
          component={guardScreen(ContactInformation)}
        />
        <Stack.Screen
          name={navigationString.QUERY}
          component={guardScreen(QueryComponents)}
        />
        <Stack.Screen
          name={navigationString.TERMANDCONDITION}
          component={guardScreen(Termandcondition)}
        />
        <Stack.Screen name={navigationString.EXTRAINFO} component={guardScreen(Extrainfo)} />
        <Stack.Screen
          name={navigationString.REMARKSCREENS}
          component={guardScreen(Remarksscreen)}
        />
        <Stack.Screen
          name={navigationString.EDITLEADREMARK}
          component={guardScreen(EditLeadremark)}
        />
        <Stack.Screen
          name={navigationString.PREVIEWENQUERYQUTAIONMEET}
          component={guardScreen(PreviewEnqueryQutaionmeet)}
        />
        <Stack.Screen
          name={navigationString.PREVIEWEDITREMARK}
          component={guardScreen(PreviewEditRemark)}
        />
        <Stack.Screen name={navigationString.QUTATION} component={guardScreen(Qutation)} />
        <Stack.Screen
          name={navigationString.ATTACHMENTSCREEN}
          component={guardScreen(Attachmentscreen)}
        />
         <Stack.Screen
          name={navigationString.MAPSPREVIEW}
          component={guardScreen(MapsPreview)}
        />


        {/* <Stack.Screen name={navigationString.LEADESFORM} component={guardScreen(LeadForm)} /> */}
      </Stack.Navigator>
    </>
  );
};

export default MainStack;
//bug id 2555 Jamshed end
