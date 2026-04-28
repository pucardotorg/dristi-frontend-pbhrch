import React, { useState } from "react";
import { useSafeTranslation } from "../../../hooks/useSafeTranslation";
import CaseSummaryRow from "../CaseSummaryRow";
import CaseSearchTable from "./CaseSearchTable";
import { svgIcons } from "../../../data/svgIcons";
import TextField from "../../ui/form/TextField";
import CustomDropdown from "../../ui/form/CustomDropdown";
import VerifyMobileNumber from "../VerifyMobileNumber";
import FormActions from "../FormActions";
import {
  CourtRoom,
  CaseResult,
  Step1State,
  AuthData,
  CtcApplication,
  CaseSearchResult,
} from "../../../types";
import { ctcStyles, ctcText } from "../../../styles/certifiedCopyStyles";
import {
  createCtcApplication,
  updateCtcApplication,
} from "../../../services/ctcService";

interface Step1CaseDetailsProps {
  courtOptions: CourtRoom[];
  step1: Step1State;
  updateStep1: (patch: Partial<Step1State>) => void;
  clearStep1: () => void;
  ctcApplication?: CtcApplication | null;
  onApplicationCreate?: (app: CtcApplication) => void;
  onApplicationUpdate?: (app: CtcApplication) => void;
  tenantId: string;
  showErrorToast?: (message: string) => void;
  caseResult?: CaseResult | null;
  onAuthDataReceived?: (data: AuthData) => void;
  authData?: AuthData | null;
  onSearchCase: (cnrInput: string) => Promise<void>;
  isSearching: boolean;
  onSaving?: (isSaving: boolean) => void;
  isSearchingList: boolean;
  setIsSearchingList: (isSearchingList: boolean) => void;
}

const Step1CaseDetails: React.FC<Step1CaseDetailsProps> = ({
  courtOptions,
  step1,
  updateStep1,
  clearStep1,
  ctcApplication,
  onApplicationCreate,
  onApplicationUpdate,
  tenantId,
  showErrorToast,
  caseResult,
  onAuthDataReceived,
  authData,
  onSearchCase,
  onSaving,
  isSearchingList,
  setIsSearchingList,
}) => {
  const { t } = useSafeTranslation();
  const [isSaving, setIsSaving] = useState(false);

  const {
    selectedCourt,
    caseNumber,
    hasSearched,
    phoneNumber,
    isPhoneVerified,
    isPartyToCase,
    name,
    designation,
  } = step1;

  // ─── Case search table state ──────────────────────────────────────────────
  const [searchResults, setSearchResults] = useState<CaseSearchResult[]>([]);
  const [searchTotalCount, setSearchTotalCount] = useState(0);
  const [searchOffset, setSearchOffset] = useState(0);
  const searchLimit = 10;

  // ─── Field class helpers ────────────────────────────────────────────────
  const courtFieldClass = `${ctcStyles.fieldInputHeight} ${hasSearched ? ctcStyles.fieldDisabled : ctcStyles.fieldEnabled}`;
  const caseFieldClass = `${ctcStyles.fieldInputHeight} ${hasSearched ? ctcStyles.fieldDisabled : ctcStyles.fieldEnabled}`;

  // ─── Derived validity ───────────────────────────────────────────────────
  const canSearch = Boolean(selectedCourt && caseNumber);
  const canProceed =
    isPhoneVerified &&
    isPartyToCase !== null &&
    (name?.trim().length || 0) >= 2 &&
    Boolean(designation);

  // ─── Save draft (create or update) then move to Step 2 ─────────────────
  const handleProceed = async () => {
    const payload: CtcApplication = {
      ...ctcApplication,
      tenantId,
      caseNumber: caseResult?.stNumber || caseResult?.cmpNumber || "",
      cnrNumber: caseResult?.cnrNumber || "",
      caseTitle: caseResult?.caseTitle || "",
      filingNumber: caseResult?.filingNumber || "",
      courtId: caseResult?.courtId || "",
      applicantName: name?.trim() || "",
      mobileNumber: phoneNumber || "",
      isPartyToCase: isPartyToCase ?? false,
      partyDesignation: designation,
      workflow: { action: "SAVE_DRAFT" },
    };

    try {
      if (!authData) {
        showErrorToast?.("Missing authentication details.");
        return;
      }

      setIsSaving(true);
      onSaving?.(true);

      if (ctcApplication?.ctcApplicationNumber) {
        // Returning user — update existing draft
        payload.ctcApplicationNumber = ctcApplication?.ctcApplicationNumber;
        payload.id = ctcApplication?.id;
        const res = await updateCtcApplication(payload, authData);
        if (res?.ctcApplication) onApplicationUpdate?.(res.ctcApplication);
      } else {
        // First-time — create new draft
        const res = await createCtcApplication(payload, authData);
        if (res?.ctcApplication) onApplicationCreate?.(res.ctcApplication);
      }
    } catch (err) {
      console.error("SAVE_DRAFT failed:", err);
      showErrorToast?.("Failed to save draft. Please try again.");
      return; // Don't navigate on error
    } finally {
      setIsSaving(false);
      onSaving?.(false);
    }
  };

  // ─── Handle case number input change (no debounce) ─────────────────────
  const handleCaseNumberChange = (value: string) => {
    const sanitized = value.toUpperCase().replace(/[^A-Z0-9/]/g, "");
    updateStep1({ caseNumber: sanitized });
  };

  // ─── Search case list (calls /api/case/search) ─────────────────────────
  const handleSearchCaseList = async (offset = 0) => {
    if (!caseNumber || caseNumber.trim().length < 2) {
      showErrorToast?.("Please enter at least 2 characters to search.");
      return;
    }

    setIsSearchingList(true);
    try {
      const params = new URLSearchParams({
        searchText: caseNumber.trim(),
        limit: String(searchLimit),
        offset: String(offset),
        tenantId: tenantId,
        courtId: selectedCourt,
      });

      const response = await fetch(`/api/case/search?${params.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error(
          `API /api/case/search failed with status ${response.status}`,
        );
        showErrorToast?.("Failed to search cases. Please try again.");
        setSearchResults([]);
        return;
      }

      const data = await response.json();
      const results: CaseSearchResult[] = data?.cases || [];
      const totalCount = data?.pagination?.totalCount || results?.length;

      setSearchResults(results);
      setSearchTotalCount(totalCount);
      setSearchOffset(offset);
    } catch (err) {
      console.error("Case search fetch error:", err);
      showErrorToast?.("Failed to search cases. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearchingList(false);
    }
  };

  // ─── Handle "Proceed" on a table row → call openapi-index ──────────────
  const handleCaseProceed = async (result: CaseSearchResult) => {
    const cnr = result?.cnrNumber;
    if (!cnr) {
      showErrorToast?.("No CNR number found for this case.");
      return;
    }

    // Update cnrNumber in state and call the parent's openapi-index handler
    updateStep1({ cnrNumber: cnr });
    setSearchResults([]); // Hide the table
    await onSearchCase(cnr);
  };

  // ─── Clear handler — also clear search results ─────────────────────────
  const handleClear = () => {
    clearStep1();
    if (!hasSearched) {
      updateStep1({ caseNumber: "" });
    }
    setSearchResults([]);
    setSearchTotalCount(0);
    setSearchOffset(0);
  };

  return (
    <div className={ctcStyles.card}>
      <div className="flex flex-col gap-6">
        {/* Court + Case Number row */}
        <div className={ctcStyles.fieldRow}>
          <div className={`${ctcStyles.fieldHalf} relative`}>
            <CustomDropdown
              label={ctcText.step1.selectCourt}
              value={selectedCourt || ""}
              onChange={(v) => updateStep1({ selectedCourt: v })}
              options={
                courtOptions?.map((c) => ({
                  label: c?.name || "",
                  value: c?.code || "",
                })) || []
              }
              disabled={hasSearched}
              className={courtFieldClass}
            />
          </div>

          {/* ── Case Number input (plain, no autocomplete) ── */}
          <div className={`${ctcStyles.fieldHalf} relative`}>
            {/* Label */}
            <label className="mb-1 block text-lg font-roboto font-normal text-[#0A0A0A]">
              {t(ctcText.step1.caseNumber)}
            </label>

            {/* Input */}
            <input
              type="text"
              value={caseNumber}
              onChange={(e) => handleCaseNumberChange(e.target.value)}
              disabled={hasSearched}
              placeholder={t(ctcText.step1.caseNumberPlaceholder)}
              className={`block w-full px-3 py-2 font-roboto text-base border-[1.5px] border-[#3D3C3C] rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${caseFieldClass} ${hasSearched ? "bg-gray-100 cursor-not-allowed" : ""}`}
              autoComplete="off"
              maxLength={16}
            />
          </div>
        </div>

        {/* ── Pre-search actions ── */}
        {!hasSearched ? (
          <>
            <div className={ctcStyles.divider} />
            <div className="flex justify-end gap-4 mb-2 font-[Inter] font-medium">
              <button
                onClick={handleClear}
                className="px-8 py-2 text-lg rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white font-roboto font-medium"
              >
                {t(ctcText.step1.clear)}
              </button>
              <button
                onClick={() => handleSearchCaseList(0)}
                disabled={!canSearch || isSearchingList || hasSearched}
                className={`px-8 py-2 text-lg rounded-md border border-transparent shadow-sm text-white focus:outline-none font-roboto font-medium ${
                  canSearch && !isSearchingList
                    ? "bg-[#0F766E] hover:bg-teal-700"
                    : "bg-[#8E8E8E] cursor-not-allowed"
                }`}
              >
                {isSearchingList
                  ? t("Searching...")
                  : t(ctcText.step1.searchCase)}
              </button>
            </div>

            {/* ── Case search results table ── */}
            {searchResults.length > 0 && !isSearchingList && (
              <CaseSearchTable
                t={t}
                searchResults={searchResults}
                onCaseProceed={handleCaseProceed}
                totalCount={searchTotalCount}
                offset={searchOffset}
                limit={searchLimit}
                onNextPage={() =>
                  handleSearchCaseList(searchOffset + searchLimit)
                }
                onPrevPage={() =>
                  handleSearchCaseList(Math.max(0, searchOffset - searchLimit))
                }
              />
            )}
          </>
        ) : (
          <>
            {/* Case summary */}
            <CaseSummaryRow t={t} caseResult={caseResult} />

            <div className={ctcStyles.infoBox}>
              {svgIcons.BlackInfoIcon()}
              <p className={ctcStyles.infoText}>
                {`${t(ctcText.step1.infoPhone)}. ${t(ctcText.step1.infoParty)}.`}
              </p>
            </div>

            {/* Phone always takes at most half the width */}
            <div className="flex flex-col w-full lg:w-1/2 pr-3">
              <VerifyMobileNumber
                phoneNumber={phoneNumber}
                onPhoneNumberChange={(v) => updateStep1({ phoneNumber: v })}
                isPhoneVerified={isPhoneVerified}
                onVerified={() => updateStep1({ isPhoneVerified: true })}
                tenantId={tenantId}
                filingNumber={caseResult?.filingNumber || caseNumber || ""}
                courtId={selectedCourt || ""}
                showErrorToast={showErrorToast}
                onValidateSuccess={(data) => {
                  updateStep1({
                    isPartyToCase: data?.isPartyToCase,
                    name: data?.userName || "",
                    designation: data?.designation || "",
                  });
                }}
                onAuthDataReceived={onAuthDataReceived}
              />
            </div>

            {/* Name / Party fields */}
            {isPartyToCase !== null && (
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
                <div
                  className={`flex flex-col ${
                    isPartyToCase ? "flex-1" : "w-full md:w-[calc(50%-12px)]"
                  }`}
                >
                  <TextField
                    label={ctcText.step1.name}
                    value={name}
                    onChange={(v) => {
                      let sanitized = v.replace(/[^a-zA-Z ]/g, "");
                      if (sanitized.startsWith(" ")) {
                        sanitized = sanitized.trimStart();
                      }
                      updateStep1({ name: sanitized });
                    }}
                    className={ctcStyles.fieldInputHeight}
                    disabled={isPartyToCase}
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <TextField
                    label={ctcText.step1.party}
                    value={t(designation)}
                    onChange={(v) => updateStep1({ designation: v })}
                    className={ctcStyles.fieldInputHeight}
                    disabled={true}
                    minLength={2}
                  />
                </div>
              </div>
            )}

            <FormActions
              secondaryLabel={ctcText.step1.clear}
              onSecondary={handleClear}
              primaryLabel={
                isSaving ? "Saving..." : ctcText.step1.verifyProceed
              }
              onPrimary={handleProceed}
              primaryDisabled={!canProceed || isSaving}
              primaryVariant="proceed"
              isSecondaryDisabled={
                !!ctcApplication?.ctcApplicationNumber || isSaving
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Step1CaseDetails;
