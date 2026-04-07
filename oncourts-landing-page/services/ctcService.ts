// ─── CTC Service — API calls for Certified True Copy flow ────────────────────

import type {
  CaseBundleNode,
  CtcApplication,
  ValidateUserInfo,
  Pagination,
  CtcSearchCriteria,
  AuthData,
} from "../types";

// ─── Response types ──────────────────────────────────────────────────────────

interface CtcApplicationResponse {
  ResponseInfo?: Record<string, unknown>;
  ctcApplication?: CtcApplication;
}

interface CtcSearchResponse {
  ResponseInfo?: Record<string, unknown>;
  ctcApplications?: CtcApplication[];
  totalCount?: number;
}

interface ValidateUserResponse {
  ResponseInfo?: Record<string, unknown>;
  validateUserInfo?: ValidateUserInfo;
}

interface DocPreviewResponse {
  responseInfo?: Record<string, unknown>;
  caseBundleNodes?: CaseBundleNode[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildRequestInfo(authData: AuthData) {
  return {
    apiId: "Dristi",
    authToken: authData?.authToken,
    msgId: `${Date.now()}|en_IN`,
    plainAccessRequest: {},
    userInfo: authData?.userInfo,
  };
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res?.ok) {
    if (res?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/certified-true-copies";
      return Promise.reject(`Auth Error: 401 Unauthorized for ${url}`);
    }
    const text = await res?.text().catch(() => "");
    return Promise.reject(`API ${url} failed (${res?.status}): ${text}`);
  }
  return res?.json();
}

// ─── CTC Application APIs (via Next.js API routes) ──────────────────────────

/** POST /api/ctc/create */
export async function createCtcApplication(
  application: CtcApplication,
  authData: AuthData,
): Promise<CtcApplicationResponse> {
  return post<CtcApplicationResponse>("/api/ctc/create", {
    RequestInfo: buildRequestInfo(authData),
    ctcApplication: application,
  });
}

/** POST /api/ctc/update */
export async function updateCtcApplication(
  application: CtcApplication,
  authData: AuthData,
): Promise<CtcApplicationResponse> {
  return post<CtcApplicationResponse>("/api/ctc/update", {
    RequestInfo: buildRequestInfo(authData),
    ctcApplication: application,
  });
}

/** POST /api/ctc/search */
export async function searchCtcApplications(
  criteria: CtcSearchCriteria,
  authData: AuthData,
  pagination?: Pagination,
): Promise<CtcSearchResponse> {
  return post<CtcSearchResponse>("/api/ctc/search", {
    RequestInfo: buildRequestInfo(authData),
    criteria,
    pagination,
  });
}

/** POST /api/ctc/validate */
export async function validateUser(
  params: {
    filingNumber: string;
    mobileNumber: string;
    tenantId: string;
    courtId: string;
  },
  authData: AuthData,
): Promise<ValidateUserResponse> {
  return post<ValidateUserResponse>("/api/ctc/validate", {
    RequestInfo: buildRequestInfo(authData),
    ...params,
  });
}

// ─── Document Preview API (via Next.js API route) ────────────────────────────

/** POST /api/ctc/preview-doc */
export async function previewDoc(
  params: {
    tenantId: string;
    filingNumber: string;
    ctcApplicationNumber?: string;
    courtId: string;
  },
  authData: AuthData,
): Promise<DocPreviewResponse> {
  return post<DocPreviewResponse>("/api/ctc/preview-doc", {
    RequestInfo: buildRequestInfo(authData),
    ...params,
  });
}
