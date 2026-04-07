// ─── CTC (Certified True Copy) Data Models ──────────────────────────────────

export interface CaseBundleNode {
  id: string;
  title: string;
  fileStoreId?: string;
  issuedFileStoreId?: string;
  status?: "ACCEPTED" | "REJECTED" | "PENDING";
  children?: CaseBundleNode[];
}

export interface Document {
  id?: string;
  documentType?: string;
  fileStore?: string;
  documentUid?: string;
  additionalDetails?: Record<string, unknown>;
  isActive?: boolean;
}

export interface WorkflowObject {
  action?: string;
  comments?: string;
  assignes?: string[];
  documents?: Document[];
  uuid?: string;
  tenantId?: string;
  businessService?: string;
  moduleName?: string;
  notificationBusinessService?: string;
  additionalDetails?: Record<string, unknown>;
}

export interface AuditDetails {
  createdBy?: string;
  lastModifiedBy?: string;
  createdTime?: number;
  lastModifiedTime?: number;
}

export interface CtcApplication {
  id?: string;
  ctcApplicationNumber?: string;
  cnrNumber?: string;
  tenantId?: string;
  caseNumber?: string;
  caseTitle?: string;
  filingNumber?: string;
  courtId?: string;
  applicantName?: string;
  mobileNumber?: string;
  isPartyToCase?: boolean;
  partyDesignation?: string;
  affidavitDocument?: Document;
  caseBundles?: CaseBundleNode[];
  selectedCaseBundle?: CaseBundleNode[];
  totalPages?: number;
  status?:
  | "DRAFT_IN_PROGRESS"
  | "PENDING_SIGN"
  | "PENDING_PAYMENT"
  | "PENDING_APPROVAL"
  | "PENDING_ISSUE"
  | "ISSUED"
  | "REJECTED";
  judgeComments?: string;
  workflow?: WorkflowObject;
  documents?: Document[];
  auditDetails?: AuditDetails;
}

export interface Pagination {
  limit?: number;
  offSet?: number;
  totalCount?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface CtcSearchCriteria {
  tenantId: string;
  ctcApplicationNumber?: string;
  courtId?: string;
  status?: string;
  filingNumber?: string;
  searchText?: string;
}

// ─── Step state interfaces ──────────────────────────────────────────────────

export interface Step1State {
  selectedCourt: string;
  cnrNumber: string;
  caseNumber: string;
  hasSearched: boolean;
  phoneNumber: string;
  isPhoneVerified: boolean;
  isPartyToCase: boolean | null;
  name: string;
  designation: string;
}

export interface Step2State {
  uploadedFileName: string;
  uploadedFile: File | null;
  selectedDocuments: string[];
}

// ─── Misc ────────────────────────────────────────────────────────────────────

export interface CaseSearchResult {
  caseTitle?: string;
  cmpNumber?: string;
  cnrNumber?: string;
  courtCaseNumber?: string;
  filingNumber?: string;
}
