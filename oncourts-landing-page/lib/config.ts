/**
 * Central configuration file for API endpoints and URLs
 * Uses environment variables for different deployment environments
 */

// Base API URL from environment variable with fallback
export const API_BASE_URL = process.env.NEXT_PUBLIC_ONCOURTS_API_ENDPOINT;

// API endpoints
export const API_ENDPOINTS = {
  // Scheduler endpoints
  SCHEDULER: {
    RECENT_CAUSE_LIST: `${API_BASE_URL}/scheduler/causelist/v1/_recentCauseList`,
    DOWNLOAD: `${API_BASE_URL}/scheduler/causelist/v1/_download`,
  },

  // Landing page endpoints
  NOTICES: {
    SEARCH_NOTICES: `${API_BASE_URL}/openapi/landing-page/v1/search-notices`,
    DOWNLOAD_FILE: `${API_BASE_URL}/openapi/v1/landing_page/file`,
  },

  // Inbox endpoints
  INBOX: {
    SEARCH: `${API_BASE_URL}/inbox/v2/open/_search`,
  },

  // OpenAPI endpoints
  OPENAPI: {
    CASE: (tenantId: string) => `${API_BASE_URL}/openapi/v1/${tenantId}/case`,
    CASE_BY_CNR: (caseNumber: string) =>
      `${API_BASE_URL}/openapi/v1/kl/case/cnr/${caseNumber}`,
    CASE_BY_TYPE: (year: string, type: string, offset: string, limit: string) =>
      `${API_BASE_URL}/openapi/v1/kl/case/${year}/${type}?offset=${offset}&limit=${limit}`,
    CASE_BY_NUMBER: (year: string, type: string, caseNumber: string) =>
      `${API_BASE_URL}/openapi/v1/kl/case/${year}/${type}/${caseNumber}`,
    HEARING: `${API_BASE_URL}/openapi/v1/hearings`,
    ORDER_TASKS: `${API_BASE_URL}/openapi/v1/orders_tasks`,
    MAGISTRATE: (courtId: string, tenantId: string) =>
      `${API_BASE_URL}/openapi/v1/magistrate_name/${courtId}/${tenantId}`,
    DOWNLOAD_FILE: (tenantId: string, orderId: string) =>
      `${API_BASE_URL}/openapi/v1/file/${tenantId}/${orderId}`,
    CASE_SEARCH: (tenantId: string) =>
      `${API_BASE_URL}/openapi/v1/${tenantId}/case/search`,
  },

  // OTP / Auth endpoints
  OTP: {
    SEND: `${API_BASE_URL}/user-otp/v1/_send`,
    VERIFY: `${API_BASE_URL}/user/oauth/token`,
    CREATE: `${API_BASE_URL}/user/citizen/_create`,
  },

  // CTC (Certified True Copy) service endpoints
  CTC: {
    CREATE: `${API_BASE_URL}/ctc/applications/_create`,
    UPDATE: `${API_BASE_URL}/ctc/applications/_update`,
    SEARCH: `${API_BASE_URL}/ctc/applications/_search`,
    VALIDATE: `${API_BASE_URL}/ctc/applications/_validate`,
  },

  FILESTORE: {
    FETCH: `${API_BASE_URL}/filestore/v1/files/id`,
    UPLOAD: `${API_BASE_URL}/filestore/v1/files`,
  },

  // Case Management endpoints
  CASE_MANAGEMENT: {
    PREVIEW_DOC: `${API_BASE_URL}/casemanagement/casemanager/preview/doc`,
  },

  E_SIGN: {
    ESIGN: `${API_BASE_URL}/e-sign-svc/v1/_esign`,
  },

  // Payment endpoints
  PAYMENT: {
    FETCH_BILL: `${API_BASE_URL}/billing-service/bill/v2/_fetchbill`,
    PROCESS_CHALLAN: `${API_BASE_URL}/etreasury/payment/v1/_processChallan`,
    SEARCH_BILL: `${API_BASE_URL}/billing-service/bill/v2/_search`,
    GET_HEAD_BREAKDOWN: `${API_BASE_URL}/etreasury/payment/v1/_getHeadBreakDown`,
    EPAYMENTS: `${API_BASE_URL}/epayments`,
  },

  // PDF Generation endpoints
  PDF: {
    CTC_APPLICATIONS: `${API_BASE_URL}/egov-pdf/ctc-applications`,
  },

  // MDMS endpoints
  MDMS: {
    SEARCH: (tenantId: string) => `${API_BASE_URL}/egov-mdms-service/v1/_search?tenantId=${tenantId}`,
  },
};

// Application URLs
export const APP_URLS = {
  CITIZEN_APP: `${API_BASE_URL}/ui/citizen/login`,
  EMPLOYEE_APP: `${API_BASE_URL}/ui/employee/login`,
  CITIZEN_DRISTI: `${API_BASE_URL}/ui/citizen/dristi/home/login`,
  EMPLOYEE_USER: `${API_BASE_URL}/ui/employee/user/login`,
};

// External URLs (these typically don't need to be configurable)
export const EXTERNAL_URLS = {
  FEEDBACK_FORM: "https://forms.gle/uCSgGiqGiMQYjjgeA",
  YOUTUBE_PLAYLIST:
    "https://www.youtube.com/playlist?list=PL2HnAXES1w-ShQIq8DAhvqeYe-uLCAr6F",
  USER_MANUAL:
    "https://drive.google.com/file/d/1j4mIw0K2F8m_urJE-zbu-oeluiOL-8Pg/view?usp=sharing",
  ECOURTS_HOME:
    "https://ecourts.gov.in/ecourts_home/index.php?p=dist_court/kerala",
  KOLLAM_COURTS: "https://kollam.dcourts.gov.in/",
  HIGH_COURT: "https://highcourt.kerala.gov.in/",
  SUPREME_COURT: "https://www.sci.gov.in/",
};
