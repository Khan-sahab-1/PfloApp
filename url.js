// import React, { useState, useEffect,useContext } from 'react';
// import {AuthContext,useAuth } from './src/Screens/Context';

// // const server_origin = "https://preqa1.arkess.com";

// // const server_origin = "https://arkefilters.pflo.co.in";

// // const server_origin = "http://192.168.29.38:2050";

// // const domain = server_origin;

// const domain = "";

// const urls = {

//   domain: domain,

//   // extension: '/preqa1',

//  login: domain + '/attendance/login',
//   getHomepageData: domain + '/attendance/home',
//   getAttendance: domain + '/attendance/mark',
//   getAttendance2: domain + '/attendance/mark2',
//   getLeave: domain + '/leave/request',
//   getLeaveType: domain + '/leave/leave_type',
//   getLeaveFromTo: domain + '/leave/from/to',
//   getNotificationLeave: domain + '/notification/Leave',
//   getNotificationData: domain + '/notification',
//   saveEditData: domain + '/editLeave/data',
//   getApproved: domain + '/approved/data',
//   getReject: domain + '/reject/data',
//   getCancel: domain + '/cancel/data',
//   getPin: domain + '/pin/change',
//   getonchangedata: domain + '/onchange/data',
//   getLeaveEmployee: domain + '/leave/employee',
//   getCalendarData: domain + '/calendar/data',
//   getcalndermeetingData:domain+'/Appeventcalendar/data',
//   getReminderData:domain+'/getCalendar/reminderData',
//   createmeeting:domain+'/create/meeting',
//   deletemeeting:domain+'/delete/meeting',
//   deletemeetingPlane:domain+'/delete/meetingplane',
//   getRestrictedLeave: domain + '/restricted/data',
//   createEnqueryRemark:'/create/enqLineRemark',
//   odooAutoMarkAttendance: domain + '/auto_mark_attendance',
//   getLeadsData: domain + '/leads/data',
//   createLead: domain + '/create/leads',
//   editLead: domain + '/edit/leads',
//   fetchleadsDivision: domain + '/leads/division',
//   fetchLeadSalePerson: domain + '/sale/person',
//   fetchCountryUrl: domain + '/countries/data',
//   fetchStatesUrl: domain + '/states/data',
//   fetchleadesstageUrl: domain + '/lead/stages',
// convertLeadstoOpportunityUrl:domain + '/convert/opportunity',
//   getOpportunitiesData: domain + '/opportunity/data',
//   fetchOpportunityDivision: domain + '/opportunity/division',
//   fetchcustomerUrl: domain + '/customer/data',
//   createOpportunity: domain + '/create/opportunity',
//   editOpportunity: domain + '/edit/opportunity',
//   getOppLinesData: domain + '/opportunity/lines',
//   updateLeadStageUrl:  domain + '/create/stages',
//   fetchopportunitystageUrl: domain + '/opp/stages',
//   updateopportunityStageUrl:'/opp/stage',
//   updateEngueryData:domain+'/edit/enquiryLine',

//   fetchEnquiry: domain + '/enquiry/data',
//   fetchEnquiryType: domain + '/enquiry/type',
//   createEnquiry: domain + '/create/enquiry',
//   fetchEnquiryData: domain + '/enquiry/lines',
//   editenquery: domain + '/edit/enquiry',

//   fetchDivision: domain + '/division/data',
//   fetchCustomer: domain + '/customer/enquiry',

//   getActivityData: domain + '/activity/opportunity',
//   getAssignedToData: domain + '/assigned/opportunity',
//   getAttendeesData: domain + '/attendees/opportunity',

//   savePlanOfAction: domain + '/create/planeOfAction',
//   createLines: domain + '/create/enqLines',

//   fetchProducts: domain + '/fetch/products',
//   fetchStatus: domain + '/fetch/Status',
//   CreatedByUrl: domain + '/remark/enqLines',
//   updateLeadStatus:domain + '/update/lead/status',
//   fetchAccountHolder: domain + '/account/holder/data',
//   fetchVisibletodata:domain+'/visibletodata/data',
//   fetchassigntodata:domain+'/assigntodata/data',

// }

// export default urls;

const domain = ''; // Or replace with "https://your.domain.com"

const urls = {
  domain: domain,

  // Auth
  login: domain + '/attendance/login/v2',

  // Attendance
  getHomepageData: domain + '/attendance/home/v2',
  getAttendance: domain + '/attendance/mark/v2',
  getAttendance2: domain + '/attendance/mark2/v2',
  odooAutoMarkAttendance: domain + '/auto_mark_attendance',

  // Leave
  getLeave: domain + '/leave/request/v2',
  getLeaveType: domain + '/leave/leave_type/v2',
  getLeaveFromTo: domain + '/leave/from/to/v2',
  getLeaveEmployee: domain + '/leave/employee',
  getRestrictedLeave: domain + '/restricted/data',
  short_leave_time_from:domain+'/short_leave/from/to',

  // Notifications
  getNotificationLeave: domain + '/notification/Leave/v2',
  getNotificationData: domain + '/notification',

  // Leave Edits
  saveEditData: domain + '/editLeave/data/v2',
  getApproved: domain + '/approved/data',
  getReject: domain + '/reject/data',
  getCancel: domain + '/cancel/data',
  getPin: domain + '/pin/change',
  getonchangedata: domain + '/onchange/data',

  // Calendar / Meeting
  getCalendarData: domain + '/calendar/data/v2',
  getcalndermeetingData: domain + '/Appeventcalendar/data',
  getReminderData: domain + '/getCalendar/reminderData',
  createmeeting: domain + '/create/meeting',
  deletemeeting: domain + '/delete/meeting',
  deletemeetingPlane: domain + '/delete/meetingplane',
  meetingsCustoers: domain + '/meeting/customer',
   gettagdata: domain + '/get/calendar/tagdata',

  // Leads
  getLeadsData: domain + '/leads/data',
  createLead: domain + '/create/leads',
  editLead: domain + '/edit/leads',
  fetchleadsDivision: domain + '/leads/division',
  fetchLeadSalePerson: domain + '/sale/person',
  fetchVisibletodata: domain + '/visibletodata/data',
  fetchassigntodata: domain + '/assigntodata/data',
  fetchsaleschannels: domain + '/leads/sales_channel',
  fetchreplyto: domain + '/opportunity/replyto',
  // Qutation
  getQutaionData: domain + '/quotation/data',

  // Country/State
  fetchCountryUrl: domain + '/countries/data',
  fetchStatesUrl: domain + '/states/data',

  // Lead Stages
  fetchleadesstageUrl: domain + '/lead/stages',
  updateLeadStageUrl: domain + '/create/stages',
  updateLeadStatus: domain + '/update/lead/status',
  createleadRemark: domain + '/create/leadremark',

  // Opportunity
  convertLeadstoOpportunityUrl: domain + '/convert/opportunity',
  getOpportunitiesData: domain + '/opportunity/data',
  fetchOpportunityDivision: domain + '/opportunity/division',
  fetchcustomerUrl: domain + '/customer/data',
  createOpportunity: domain + '/create/opportunity',
  editOpportunity: domain + '/edit/opportunity',
  getOppLinesData: domain + '/opportunity/lines',
  fetchopportunitystageUrl: domain + '/opp/stages',
  updateopportunityStageUrl: domain + '/opp/stage',
  fetchtagsdata: domain + '/opportunity/tags',
  fetchcompaindata: domain + '/opportunity/campaign',
  fetchmedium: domain + '/opportunity/medium',
  fetchsource: domain + '/opportunity/source',
   createoppRemark: domain + '/create/opportunityremark',

  // Enquiry
  fetchEnquiry: domain + '/enquiry/data',
  fetchEnquiryType: domain + '/enquiry/type',
  createEnquiry: domain + '/create/enquiry',
  fetchEnquiryData: domain + '/enquiry/lines',
  editenquery: domain + '/edit/enquiry',
  updateEngueryData: domain + '/edit/enquiryLine',
  createLines: domain + '/create/enqLines',
  fectcostcnter: domain + '/enquiry/costcenter',
  fetchpricelist: domain + '/enquiry/pricelist',
  futchenqueryOpportunity: domain + '/enquiry/opportunity',
  fetechbankdetails: domain + '/enquiry/bankAccount',
  fetchtermsconditionsperameter: domain + '/enquiry/remarks/parameters',
  fetchbugetry: domain + '/enquiry/budgetary',
  fetccontactperson: domain + '/enquiry/contactperson',
  createEnquiryQuery: domain + '/create/enquiryquery',
  sent_for_review: domain + '/enquiry/send_for_review',
  
  editenquerytc: domain + '/edit/enquirytc',
  createtenquerytc: domain + '/create/enquirytc',

  // Dropdown & Master
  fetchDivision: domain + '/division/data',
  fetchCustomer: domain + '/customer/enquiry',
  fetchProducts: domain + '/fetch/products',
  fetchStatus: domain + '/fetch/Status',
  fetchAccountHolder: domain + '/account/holder/data',

  // Remarks
  CreatedByUrl: domain + '/remark/enqLines',
  createEnqueryRemark: domain + '/create/enqLineRemark',

  // Activity/CRM
  getActivityData: domain + '/activity/opportunity',
  getAssignedToData: domain + '/assigned/opportunity',
  getAttendeesData: domain + '/attendees/opportunity',

  // Plan of Action
  savePlanOfAction: domain + '/create/planeOfAction',
  posthandlecustomer: domain + '/customer/attendees',
  updateMeetingUrl: domain + '/edit/meeting',
  UploadAttachment:domain + '/add/attachment',
  // getattachmentdata:domain + '/opportunity/attachments',
  getenquiryattachmentdata:domain + '/enquiry/attachments',
  // Live traking 
  GETALLEMPLOYEES:domain + '/employee_live_tracking/api/mobile/employees',
  LIVELOCATIONROUTE:domain + '/employee_live_tracking/api/mobile/route',
};

export default urls;
