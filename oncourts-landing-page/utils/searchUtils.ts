import {
  ApiResponse,
  ApiRequestPayload,
  CaseNumberCriteria,
  FilingNumberCriteria,
  AdvocateBarcodeCriteria,
  AdvocateNameCriteria,
  LitigantCriteria,
  AllCriteria,
  SortOrder,
  FormState,
  FilterState,
} from "../types";
import { newCaseSearchConfig } from "../data/newCaseSearchConfig";
import { transformSearchResponse } from "../TransformData/transformSearchData";
/**
 * Fetch case data from API with error handling
 */
export const fetchCase = async (
  payload?: ApiRequestPayload,
  tenantId?: string,
): Promise<ApiResponse | null> => {
  try {
    // Show messages in development but not in production
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
      console.log("Fetching data from case API");
      if (payload) console.log("Payload:", JSON.stringify(payload, null, 2));
    }

    // Use the API proxy endpoint to avoid CORS issues
    const url = `/api/case/openapi-index?tenantId=${tenantId}`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API response error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching case data:", (error as Error).message);
    return null;
  }
};

/**
 * Build API payload based on search parameters and selected tab
 */
export const buildApiPayload = (
  selectedTab: string,
  formState: Partial<FormState> & {
    offset?: number;
    limit?: number;
    sortOrder?: SortOrder[];
  },
  filterState?: FilterState
): ApiRequestPayload | undefined => {
  const {
    cnrNumber,
    selectedYear,
    selectedCaseType,
    caseNumber,
    selectedCourt,
    code,
    stateCode,
    barCode,
    advocateSearchMethod,
    advocateName,
    litigantName,
    offset = 0,
    limit = 10,
    sortOrder = [],
  } = formState;

  // Process filter criteria from filterState
  const filterCriteria = filterState
    ? {
        // Only include non-empty filter values
        courtId: filterState.courtId || undefined,
        caseType: filterState.caseType || undefined,
        yearOfFiling: filterState.yearOfFiling || undefined,
        hearingDateFrom: filterState.hearingDateFrom || undefined,
        hearingDateTo: filterState.hearingDateTo || undefined,
        caseSubStage: filterState.caseSubStage || undefined,
        caseStatus: filterState.caseStatus || undefined,
        caseTitle: filterState.caseTitle || undefined,
      }
    : {};

  // Remove undefined properties from filterCriteria
  Object.keys(filterCriteria).forEach((key) => {
    if (filterCriteria[key as keyof typeof filterCriteria] === undefined) {
      delete filterCriteria[key as keyof typeof filterCriteria];
    }
  });

  // Base payload for all requests
  const basePayload = {
    offset,
    limit,
    ...(sortOrder.length > 0 && { sortOrder }),
  };

  // Add filter criteria only if it has properties
  const filterProps =
    Object.keys(filterCriteria).length > 0 ? { filterCriteria } : {};

  // Build payloads for each tab
  const payloadBuilders = {
    "cnr_number": () => {
      // Skip if CNR number is empty
      if (!cnrNumber) return undefined;

      return {
        searchCaseCriteria: {
          searchType: "cnr_number" as const,
          cnrNumberCriteria: {
            cnrNumber,
          },
        },
        ...filterProps,
        ...basePayload,
      };
    },

    "case_number": () => {
      // Process caseNumber to get the actual number part if it contains a slash
      const processedCaseNumber = caseNumber?.split("/")?.[1] || caseNumber;

      // Skip if there are no valid search fields
      if (
        !selectedCourt &&
        !selectedCaseType &&
        !processedCaseNumber &&
        !selectedYear
      ) {
        return undefined;
      }

      // For API compatibility, we need to have some values for required fields
      // while still skipping empty fields in the actual request
      return {
        searchCaseCriteria: {
          searchType: "case_number" as const,
          caseNumberCriteria: {
            courtId: selectedCourt || "",
            caseType: selectedCaseType,
            caseNumber: processedCaseNumber,
            year: selectedYear,
          },
        } as CaseNumberCriteria,
        ...filterProps,
        ...basePayload,
      };
    },

    "filing_number": () => {
      // Skip if there are no valid search fields
      if (!selectedCourt && !code && !caseNumber && !selectedYear) {
        return undefined;
      }

      // For API compatibility, we need to have some values for required fields
      // while still skipping empty fields in the actual request
      return {
        searchCaseCriteria: {
          searchType: "filing_number" as const,
          filingNumberCriteria: {
            courtId: selectedCourt || "",
            code: code,
            caseNumber: caseNumber,
            year: selectedYear,
          },
        } as FilingNumberCriteria,
        ...filterProps,
        ...basePayload,
      };
    },

    "advocate": () => {
      if (advocateSearchMethod === "bar_code") {
        // Skip if barCode is empty (required)
        if (!barCode) return undefined;

        // For API compatibility, we need to have some values for required fields
        // while still skipping empty fields in the actual request
        return {
          searchCaseCriteria: {
            searchType: "advocate" as const,
            advocateCriteria: {
              advocateSearchType: "barcode" as const,
              barCodeDetails: {
                stateCode: stateCode,
                barCode: barCode, // This is required and verified above
                year: selectedYear,
              },
            },
          } as AdvocateBarcodeCriteria,
          ...filterProps,
          ...basePayload,
        };
      } else if (advocateSearchMethod === "advocate_name") {
        // Skip if advocateName is empty (required)
        if (!advocateName) return undefined;

        return {
          searchCaseCriteria: {
            searchType: "advocate" as const,
            advocateCriteria: {
              advocateSearchType: "advocate_name" as const,
              advocateName,
            },
          } as AdvocateNameCriteria,
          ...filterProps,
          ...basePayload,
        };
      }
      return undefined;
    },

    "litigant": () => {
      // Skip if litigant name is empty
      if (!litigantName) return undefined;

      return {
        searchCaseCriteria: {
          searchType: "litigant" as const,
          litigantCriteria: {
            litigantName,
          },
        } as LitigantCriteria,
        ...filterProps,
        ...basePayload,
      };
    },

    "all": () => ({
      searchCaseCriteria: {
        searchType: "all" as const,
      } as AllCriteria,
      ...filterProps,
      ...basePayload,
    }),
  };

  // Get the appropriate payload builder function for the selected tab
  const builderFn =
    payloadBuilders[selectedTab as keyof typeof payloadBuilders];
  return builderFn ? builderFn() : undefined;
};

/**
 * Search for cases with the given parameters using the new API structure
 * Now also accepts filterState to include advanced filtering options
 */
export const searchCases = async (
  tenantId: string,
  selectedTab: string,
  formState: Partial<FormState> & {
    offset?: number;
    limit?: number;
    sortOrder?: SortOrder[];
  },
  filterState?: FilterState
) => {
  try {
    // Get the constructed payload based on tab, formState, and filterState
    const payload = buildApiPayload(selectedTab, formState, filterState);

    // Validate that we have a valid payload
    if (!payload) {
      return {
        results: [],
        totalCount: 0,
        error: {
          message: "Invalid search parameters.",
          code: "VALIDATION_ERROR",
        },
      };
    }

    // Call the API with the constructed payload
    const response = await fetchCase(payload, tenantId);

    if (!response) {
      return {
        results: [],
        totalCount: 0,
        error: {
          message: "Failed to fetch data. Please try again.",
          code: "API_ERROR",
        },
      };
    }

    const transformedData = transformSearchResponse(response);

    return {
      ...transformedData,
      error: null,
    };
  } catch (error) {
    console.error("Error in searchCases:", error);
    return {
      results: [],
      totalCount: 0,
      error: {
        message: (error as Error).message || "An unexpected error occurred",
        code: "UNEXPECTED_ERROR",
      },
    };
  }
};

/**
 * Get tab configuration from case search config
 */
export const getTabConfig = (selectedTab: string) => {
  const tabConfigs = {
    "cnr_number": newCaseSearchConfig.cnrNumber,
    "case_number": newCaseSearchConfig.caseNumber,
    "filing_number": newCaseSearchConfig.filingNumber,
    "advocate": newCaseSearchConfig.advocate,
    "litigant": newCaseSearchConfig.litigant,
    "all": newCaseSearchConfig.all,
  };

  return tabConfigs[selectedTab as keyof typeof tabConfigs] || {};
};

/**
 * Validate form based on selected tab
 */
export const isFormValid = (
  selectedTab: string,
  formState: Partial<FormState>
): boolean => {
  const {
    cnrNumber,
    caseNumber,
    selectedYear,
    selectedCourt,
    selectedCaseType,
    code,
    stateCode,
    advocateSearchMethod,
    advocateName,
    barCode,
    litigantName,
  } = formState;

  const cnrNumberPattern = new RegExp(newCaseSearchConfig.cnrNumber.pattern);

  switch (selectedTab) {
    case "cnr_number":
      return cnrNumberPattern.test(cnrNumber || "");
    case "case_number":
      return (
        !!caseNumber && !!selectedCourt && !!selectedCaseType && !!selectedYear
      );
    case "filing_number":
      return !!selectedCourt && !!code && !!selectedYear;
    case "advocate":
      return advocateSearchMethod === "bar_code"
        ? !!barCode && !!stateCode && !!selectedYear
        : !!advocateName && advocateName.length > 2;
    case "litigant":
      return !!litigantName && litigantName.length > 2;
    case "all":
      return true;
    default:
      return false;
  }
};
