/**
 * Case model interfaces representing court case data
 */

export interface PartyInfo {
  id?: string;
  name?: string;
  entityType?: string;
}
export interface CaseResult {
  caseTitle?: string;
  cmpNumber?: string;
  stNumber?: string;
  purpose?: string;
  nextHearingDate?: string;
  lastHearingDate?: string;
  filingDate?: string;
  registrationDate?: string;
  filingNumber?: string;
  courtId?: string;
  courtName?: string;
  cnrNumber?: string;
  caseStage?: string;
  caseSubStage?: string;
  advocates?: PartyInfo[];
  litigants?: PartyInfo[];
}

export interface CourtRoom {
  code?: string;
  name?: string;
  establishment?: string;
}

export interface CaseStage {
  code?: string;
  subStage?: string;
}

export interface CaseType {
  code?: string;
  name?: string;
}

export interface CaseStatus {
  code?: string;
  name?: string;
}
