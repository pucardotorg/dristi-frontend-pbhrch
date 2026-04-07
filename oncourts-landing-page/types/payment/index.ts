// ─── Payment Data Models ─────────────────────────────────────────────────────

export interface UserInfo {
  id?: number;
  uuid?: string;
  userName?: string;
  name?: string;
  mobileNumber?: string;
  emailId?: string | null;
  locale?: string | null;
  type?: string;
  roles?: { name: string; code: string; tenantId: string }[];
  active?: boolean;
  tenantId?: string;
  permanentCity?: string | null;
}

export interface RequestInfoData {
  apiId?: string;
  authToken?: string;
  userInfo?: UserInfo;
  msgId?: string;
  plainAccessRequest?: Record<string, unknown>;
}

export interface HeadBreakdownItem {
  name: string;
  amount: number;
}

export interface HeadBreakdownResponse {
  TreasuryHeadMapping?: {
    headAmountMapping?: {
      breakUpList?: HeadBreakdownItem[];
      totalAmount?: number;
    };
  };
}

export interface FetchBillCriteria {
  consumerCode: string[];
  tenantId: string;
  businessService: string;
}

export interface SearchBillCriteria {
  tenantId: string;
  consumerCode: string[];
  service: string;
}

export interface BillDetail {
  id: string;
  billId: string;
  additionalDetails?: {
    payerMobileNo?: string;
    payer?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface Bill {
  consumerCode: string;
  businessService: string;
  status: string;
  billDetails: BillDetail[];
  [key: string]: unknown;
}

export interface BillResponse {
  Bill: Bill[];
}

export interface ChallanPayload {
  url: string;
  data: string;
  headers: string;
  grn: string;
}

export interface ETreasuryResponse {
  payload: ChallanPayload;
}
