// Jamshed start bug id 2555
// Description: This file defines the Tabroutes component, which sets up the bottom tab navigation for the application. It uses React Navigation's createBottomTabNavigator to create a tabbed interface with screens for Home, Calendar, Notifications, and CRM (if the user is a CRM user). The component fetches user data from the server to determine which tabs to display and configures the appearance of the tab bar and icons based on the active route. The Tabroutes component serves as a central point for managing the main navigation structure of the app after the user has logged in.
export {default as Home} from '../screen/deshboard/Home';
export {default as Calendar} from '../screen/deshboard/Calendar';
export {default as Notification} from '../screen/deshboard/Natification';
export {default as LeaveRequestForm} from '../screen/deshboard/LeaveRequest';
export {default as Crm} from '../screen/crm/Crm';
export {default as Leades} from '../screen/crm/Leades';
export {default as Opportunity} from '../screen/crm/Opportunity';
export {default as Enquery} from '../screen/crm/Enquery';
export {default as AddEnquery} from '../screen/crm/AddEnquery';
export {default as UpdateEnquiryLine} from '../screen/crm/EditEnquiryLine';
export {default as Qutation} from '../screen/crm/Qutation/Qutation';
export {default as EditLeadremark} from '../screen/crm/Leads/EditLeadremark';
export {default as PreviewEnqueryQutaionmeet} from '../screen/crm/Leads/PreviewEnqueryQutaionmeet';
export {default as PreviewEditRemark} from '../Screens/PreviewEditRemark';
// Jamshed end bug id 2555
