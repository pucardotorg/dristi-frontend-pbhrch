import { ApiResponse, CaseResult, SearchResult } from "../types";

export function transformSearchResponse(
  response: ApiResponse | null
): SearchResult {
  if (!response) {
    return { results: [], totalCount: 0, error: null };
  }

  const totalCount = response?.totalCount || 0;
  let results: CaseResult[] = [];

  results = response?.items || [];

  return { results, totalCount, error: null };
}
