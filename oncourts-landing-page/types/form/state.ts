/**
 * Form state interface for search forms
 */

// Form state interface for case search forms
export interface FormState {
  caseNumber: string;
  selectedYear: string;
  selectedCourt: string;
  selectedCaseType: string;
  code: string;
  cnrNumber: string;
  advocateSearchMethod: string;
  stateCode: string;
  barCode: string;
  advocateName: string;
  litigantName: string;
}
