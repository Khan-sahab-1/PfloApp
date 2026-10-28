// Jamshed Ali Added Start - Bug ID 2555
// Description: Changed all API base URLs from local/test servers to the live production server
// apiEndpoints.js

//  export const  BASE_URL= "http://192.168.1.3:8085";
//  export const  BASE_URL= "http://192.168.10.84:8085";
// export const BASE_URL = 'http://172.24.43.221:8085';
// export const BASE_URL = 'http://192.168.31.93:8085';
export const BASE_URL = 'http://192.168.1.8:8070';
// export  const  BASE_URL= "https://arkefilters.pflo.co.in";
// export const BASE_URL = 'http://10.23.1.236:8085';

// export const BASE_URL = 'https://preqa1.arkess.com';
// export const BASE_URL = 'https://preqa2.arkess.com';
// export const BASE_URL = 'https://arkefilters.pflo.co.in';

const domain = BASE_URL;

const API = {
  login: domain + '/attendance/login',
  getHomepageData: domain + '/attendance/home',
  getAttendance: domain + '/attendance/mark',
  getAttendance2: domain + '/attendance/mark2',
  getLeave: domain + '/leave/request',
  getLeaveType: domain + '/leave/leave_type',
  getLeaveFromTo: domain + '/leave/from/to',
  getNotificationLeave: domain + '/notification/Leave',
  getNotificationData: domain + '/notification',
  saveEditData: domain + '/editLeave/data',
  getApproved: domain + '/approved/data',
  getReject: domain + '/reject/data',
  getCancel: domain + '/cancel/data',
  getPin: domain + '/pin/change',
  getonchangedata: domain + '/onchange/data',
  getLeaveEmployee: domain + '/leave/employee',
  getCalendarData: domain + '/calendar/data',
  getRestrictedLeave: domain + '/restricted/data',
  gettagdata: domain + '/get/calendar/tagdata',


  odooAutoMarkAttendance: domain + '/auto_mark_attendance',


  getLeadsData: domain + '/leads/data/v1',
  createLead: domain + '/create/leads',
  editLead: domain + '/edit/leads',
  fetchleadsDivision: domain + '/leads/division',
  fetchLeadSalePerson: domain + '/sale/person',
  fetchCountryUrl: domain + '/countries/data',
  fetchStatesUrl: domain + '/states/data',

  getOpportunitiesData: domain + '/opportunity/data',
  fetchOpportunityDivision: domain + '/opportunity/division',
  fetchcustomerUrl: domain + '/customer/data',
  createOpportunity: domain + '/create/opportunity',
  editOpportunity: domain + '/edit/opportunity',
  getOppLinesData: domain + '/opportunity/lines',

  fetchEnquiry: domain + '/enquiry/data',
  fetchEnquiryType: domain + '/enquiry/type',
  createEnquiry: domain + '/create/enquiry',
  fetchEnquiryData: domain + '/enquiry/lines',

  fetchDivision: domain + '/division/data',
  fetchCustomer: domain + '/customer/enquiry',

  getActivityData: domain + '/activity/opportunity',
  getAssignedToData: domain + '/assigned/opportunity',
  getAttendeesData: domain + '/attendees/opportunity',

  savePlanOfAction: domain + '/create/planeOfAction',
  createLines: domain + '/create/enqLines',

  fetchProducts: domain + '/fetch/products',
  fetchStatus: domain + '/fetch/Status',
  CreatedByUrl: domain + '/remark/enqLines',
};

export default API;
// Jamshed Ali Added End - Bug ID 2555
