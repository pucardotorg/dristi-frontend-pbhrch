/**
 * Service layer for the Open-API payment endpoints.
 *
 * All calls go through the Next.js rewrite proxy:
 *   /api/openapi/:path*  →  <backend>/openapi/:path*
 */

import type {
  AuthData,
  FetchBillCriteria,
  SearchBillCriteria,
  BillResponse,
  ETreasuryResponse,
  RequestInfoData,
  UserInfo,
  HeadBreakdownResponse,
} from "../types";

// ─── Request helper ──────────────────────────────────────────────────────────

async function request<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "*/*" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      window.location.href = "/certified-true-copies";
      return Promise.reject(`Auth Error: 401 Unauthorized for ${url}`);
    }
    const text = await res.text();
    return Promise.reject(`${url} failed [${res.status}]: ${text}`);
  }

  return res.json();
}

/** Helper to generate RequestInfo from AuthData */
function createRequestInfo(authData: AuthData): { RequestInfo: RequestInfoData } {
  return {
    RequestInfo: {
      apiId: "Dristi",
      authToken: authData.authToken,
      userInfo: authData.userInfo as unknown as UserInfo,
      msgId: `${Date.now()}|en_IN`,
      plainAccessRequest: {},
    },
  };
}

/** Serialize query params handling arrays correctly */
function buildQueryString(params: Record<string, unknown>): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      qs.append(key, value.join(","));
    } else if (value !== undefined && value !== null) {
      qs.append(key, String(value));
    }
  });
  return qs.toString();
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** POST /api/payment/fetchBill */
export function callFetchBill(criteria: FetchBillCriteria, authData: AuthData) {
  const qs = buildQueryString(criteria as unknown as Record<string, unknown>);
  return request<BillResponse>(`/api/payment/fetchBill?${qs}`, {
    ...createRequestInfo(authData),
  });
}

/** POST /api/payment/processChallan */
export function callETreasury(challanData: Record<string, unknown>, authData: AuthData) {
  return request<ETreasuryResponse>("/api/payment/processChallan", {
    ChallanData: challanData,
    ...createRequestInfo(authData),
  });
}

/** POST /api/payment/searchBill */
export function callSearchBill(criteria: SearchBillCriteria, authData: AuthData) {
  const qs = buildQueryString(criteria as unknown as Record<string, unknown>);
  return request<BillResponse>(`/api/payment/searchBill?${qs}`, {
    ...createRequestInfo(authData),
  });
}

/** POST /api/payment/getHeadBreakdown */
export function callGetHeadBreakdown(
  consumerCode: string,
  tenantId: string,
  authData: AuthData
) {
  const qs = buildQueryString({ consumerCode, tenantId });
  return request<HeadBreakdownResponse>(`/api/payment/getHeadBreakdown?${qs}`, {
    ...createRequestInfo(authData),
  });
}
