// ─── eSign Data Models ───────────────────────────────────────────────────────

import type { RequestInfoData } from "../payment";

export interface ESignParameter {
  uidToken?: string;
  consent?: string;
  authType?: string;
  fileStoreId: string;
  tenantId: string;
  pageModule: string;
  signPlaceHolder?: string;
}

export interface ESignRequestData {
  ESignParameter: ESignParameter;
  RequestInfo?: RequestInfoData;
}

export interface ESignResponseData {
  ESignForm?: {
    eSignRequest: string;
    aspTxnID: string;
  };
  [key: string]: unknown;
}
