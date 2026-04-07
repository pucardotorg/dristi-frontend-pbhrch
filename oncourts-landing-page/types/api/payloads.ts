/**
 * API request payload types for the case search API
 */

// Filter criteria interface for API requests - optional fields for flexibility
export interface FilterCriteria {
  courtId?: string;
  caseType?: string;
  hearingDateFrom?: string;
  hearingDateTo?: string;
  caseSubStage?: string;
  caseStatus?: string;
  yearOfFiling?: string;
}

// Sort order specification for API requests
export interface SortOrder {
  code: string;
  order: "asc" | "desc";
}

// Base interface for all search case criteria
export interface SearchCaseBase {
  searchType:
    | "filing_number"
    | "case_number"
    | "cnr_number"
    | "advocate"
    | "litigant"
    | "all";
}

// Filing number search criteria
export interface FilingNumberCriteria extends SearchCaseBase {
  searchType: "filing_number";
  filingNumberCriteria: {
    courtId: string;
    code: string;
    caseNumber: string;
    year: string;
  };
}

// Case number search criteria
export interface CaseNumberCriteria extends SearchCaseBase {
  searchType: "case_number";
  caseNumberCriteria: {
    courtId: string;
    caseType: string;
    caseNumber: string;
    year: string;
  };
}

// CNR number search criteria
export interface CnrNumberCriteria extends SearchCaseBase {
  searchType: "cnr_number";
  cnrNumberCriteria: {
    cnrNumber: string;
  };
}

// Advocate search by barcode criteria
export interface AdvocateBarcodeCriteria extends SearchCaseBase {
  searchType: "advocate";
  advocateCriteria: {
    advocateSearchType: "barcode";
    barCodeDetails: {
      stateCode: string;
      barCode: string;
      year: string;
    };
  };
}

// Advocate search by name criteria
export interface AdvocateNameCriteria extends SearchCaseBase {
  searchType: "advocate";
  advocateCriteria: {
    advocateSearchType: "advocate_name";
    advocateName: string;
  };
}

// Litigant search criteria
export interface LitigantCriteria extends SearchCaseBase {
  searchType: "litigant";
  litigantCriteria: {
    litigantName: string;
  };
}

// All cases search criteria
export interface AllCriteria extends SearchCaseBase {
  searchType: "all";
}

// Union type for all search criteria types
export type SearchCaseCriteria =
  | FilingNumberCriteria
  | CaseNumberCriteria
  | CnrNumberCriteria
  | AdvocateBarcodeCriteria
  | AdvocateNameCriteria
  | LitigantCriteria
  | AllCriteria;

// Main API request payload interface
export interface ApiRequestPayload {
  searchCaseCriteria: SearchCaseCriteria;
  filterCriteria?: FilterCriteria;
  offset: number;
  limit: number;
  sortOrder?: SortOrder[];
}
