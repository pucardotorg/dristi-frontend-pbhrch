import { CaseResult } from "../case/models";

// API response interface for case search endpoints
export interface ApiResponse {
  items?: CaseResult[];
  totalCount?: number;
}

// API error interface
export interface ApiError {
  message: string;
  code: string;
}

// Search results interface with error handling
export interface SearchResult {
  results: CaseResult[];
  totalCount: number;
  error: ApiError | null;
}
