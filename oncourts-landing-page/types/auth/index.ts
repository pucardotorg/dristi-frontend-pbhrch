export interface ValidateUserInfo {
  userName?: string;
  designation?: string;
  mobileNumber?: string;
  filingNumber?: string;
  courtId?: string;
  isPartyToCase?: boolean;
}

export interface AuthData {
  authToken: string;
  userInfo: Record<string, unknown>;
}
