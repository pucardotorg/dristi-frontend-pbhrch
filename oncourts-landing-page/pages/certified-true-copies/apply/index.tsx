import React, { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSafeTranslation } from "../../../hooks/useSafeTranslation";
import { handleAuthError } from "../../../libraries/utils/authUtils";
import Stepper from "../../../components/certified-true-copies/Stepper";
import Step1CaseDetails from "../../../components/certified-true-copies/apply-steps/Step1CaseDetails";
import Step2DocumentDetails from "../../../components/certified-true-copies/apply-steps/Step2DocumentDetails";
import Step3PreviewAndSign from "../../../components/certified-true-copies/apply-steps/Step3PreviewAndSign";
import { svgIcons } from "../../../data/svgIcons";
import { useMediaQuery } from "@mui/material";
import { commonStyles } from "../../../styles/commonStyles";
import { ctcStyles, ctcText } from "../../../styles/certifiedCopyStyles";
import {
  CourtRoom,
  CaseResult,
  AuthData,
  CtcApplication,
  Step1State,
  Step2State,
  CaseBundleNode,
} from "../../../types";
import {
  searchCtcApplications,
  previewDoc,
} from "../../../services/ctcService";

// ─── Step labels ──────────────────────────────────────────────────────────────

const STEPS = [
  "CTC_CASE_DETAILS",
  "CTC_DOCUMENT_DETAILS",
  "CTC_PREVIEW_E_SIGN",
];

// ─── Component ────────────────────────────────────────────────────────────────

const ApplyForCertifiedCopy = () => {
  const { t } = useSafeTranslation();
  const isMobile = useMediaQuery("(max-width:640px)");
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);

  // Court options (fetched once)
  const [courtOptions, setCourtOptions] = useState<CourtRoom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const initialLoadRef = useRef(false);
  const tenantId = localStorage.getItem("tenant-id");
  const [isSearchingList, setIsSearchingList] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // ── CTC application state (shared across steps) ──────────────────────────
  const [ctcApplication, setCtcApplication] = useState<CtcApplication | null>(
    null,
  );

  // ── Case search result (shared across steps) ──────────────────────────
  const [caseResult, setCaseResult] = useState<CaseResult | null>(null);

  // ── Auth data (authToken + userInfo from OTP verify) ─────────────────
  const [authData, setAuthData] = useState<AuthData | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = sessionStorage.getItem("ctcAuthData");
      return stored ? (JSON.parse(stored) as AuthData) : null;
    } catch {
      return null;
    }
  });

  // ── Error toast notification ──────────────────────────────────────────────
  const [isSearchingCase, setIsSearchingCase] = useState(false);
  const [errorToast, setErrorToast] = useState<{
    show: boolean;
    message: string;
  }>({
    show: false,
    message: "",
  });

  const showErrorToast = useCallback((message: string) => {
    setErrorToast({ show: true, message });
  }, []);

  // Auto-dismiss error toast after 4 seconds
  useEffect(() => {
    if (!errorToast?.show) return;
    const timer = setTimeout(() => {
      setErrorToast({ show: false, message: "" });
    }, 4000);
    return () => clearTimeout(timer);
  }, [errorToast?.show]);

  // ── Step 1 state (lifted so it survives navigation to Step 2 and back) ──
  const defaultStep1 = (courts: CourtRoom[]): Step1State => ({
    selectedCourt: courts?.[0]?.code || "",
    cnrNumber: "",
    caseNumber: "",
    hasSearched: false,
    phoneNumber: "",
    isPhoneVerified: false,
    isPartyToCase: null,
    name: "",
    designation: "",
  });

  const [step1, setStep1] = useState<Step1State>(() => defaultStep1([]));

  const updateStep1 = (patch: Partial<Step1State>) =>
    setStep1((prev) => ({ ...prev, ...patch }));

  const clearStep1 = () => {
    updateStep1({
      phoneNumber: "",
      isPhoneVerified: false,
      isPartyToCase: null,
      name: "",
      designation: "",
    });
  };

  // ── Step 2 state (lifted so it survives navigation to Step 3 and back) ──
  const [step2, setStep2] = useState<Step2State>({
    uploadedFileName: "",
    uploadedFile: null,
    selectedDocuments: [],
  });

  const updateStep2 = (patch: Partial<Step2State>) =>
    setStep2((prev) => ({ ...prev, ...patch }));

  // ── Document bundle nodes (fetched once when entering Step 2) ────────────
  const [bundleNodes, setBundleNodes] = useState<CaseBundleNode[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  useEffect(() => {
    if (currentStep !== 2) return;

    const fetchDocTree = async () => {
      const filingNumber = ctcApplication?.filingNumber;
      const courtId = ctcApplication?.courtId;
      if (!filingNumber || !courtId) {
        if (ctcApplication?.selectedCaseBundle?.length) {
          setBundleNodes(ctcApplication.selectedCaseBundle as CaseBundleNode[]);
        }
        return;
      }
      if (!authData) {
        showErrorToast("Missing authentication details.");
        return;
      }
      try {
        setIsLoadingDocs(true);
        const res = await previewDoc(
          {
            tenantId: tenantId as string,
            filingNumber,
            courtId,
            ctcApplicationNumber: ctcApplication?.ctcApplicationNumber,
          },
          authData,
        );
        if (res?.caseBundleNodes?.length) {
          setBundleNodes(res.caseBundleNodes as CaseBundleNode[]);
        } else if (ctcApplication?.selectedCaseBundle?.length) {
          setBundleNodes(ctcApplication.selectedCaseBundle as CaseBundleNode[]);
        }
      } catch (err) {
        console.error("Failed to fetch document tree:", err);
        showErrorToast("Failed to load documents. Please try again.");
        if (ctcApplication?.selectedCaseBundle?.length) {
          setBundleNodes(ctcApplication.selectedCaseBundle as CaseBundleNode[]);
        }
      } finally {
        setIsLoadingDocs(false);
      }
    };

    fetchDocTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, ctcApplication?.filingNumber, ctcApplication?.courtId]);

  // ─── API ──────────────────────────────────────────────────────────────────

  const getCourtOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/egov-mdms-service/v1/_search?tenantId=${tenantId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            MdmsCriteria: {
              tenantId,
              moduleDetails: [
                {
                  moduleName: "common-masters",
                  masterDetails: [{ name: "Court_Rooms" }],
                },
              ],
            },
            RequestInfo: {
              apiId: "Rainmaker",
              msgId: `${Date.now()}|en_IN`,
            },
          }),
        },
      );
      const data = await response.json();
      if (data?.MdmsRes?.["common-masters"]?.Court_Rooms) {
        const courtRooms: CourtRoom[] =
          data.MdmsRes["common-masters"].Court_Rooms;
        setCourtOptions(courtRooms);
        setStep1((prev) =>
          prev.selectedCourt
            ? prev
            : { ...prev, selectedCourt: courtRooms[0]?.code || "" },
        );
      }
    } catch (error) {
      console.error("Error fetching court options:", error);
      showErrorToast("Failed to fetch court options. Please refresh.");
      setCourtOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, showErrorToast]);

  // ── Restore from URL applicationNumber ─────────────────────────────────

  const handleSearchCase = useCallback(
    async (cnrNumber: string) => {
      if (!cnrNumber) return;

      setIsSearchingCase(true);
      try {
        const response = await fetch(
          `/api/case/openapi-index?tenantId=${tenantId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              searchCaseCriteria: {
                searchType: "cnr_number",
                cnrNumberCriteria: {
                  cnrNumber: cnrNumber?.trim(),
                },
              },
              offset: 0,
              limit: 50,
            }),
          },
        );

        if (!response?.ok) {
          showErrorToast?.("Failed to search case. Please try again.");
          return;
        }

        const data = await response?.json();
        const caseItem = data?.items?.[0];

        if (caseItem) {
          setCaseResult(caseItem as CaseResult);
          setStep1((prev) => ({
            ...prev,
            hasSearched: true,
            caseNumber:
              caseItem?.stNumber ||
              caseItem?.cmpNumber ||
              prev.caseNumber ||
              "",
          }));
        } else {
          showErrorToast?.("No case found for the given criteria.");
        }
      } catch (err) {
        console.error("Case search failed:", err);
        showErrorToast?.("Failed to search case. Please try again.");
      } finally {
        setIsSearchingCase(false);
      }
    },
    [showErrorToast],
  );

  const getLeafIds = (nodes) => {
    return nodes?.flatMap((node) => {
      if (node?.children?.length) {
        return getLeafIds(node?.children);
      }
      return [node?.id];
    });
  };

  const restoreFromUrl = useCallback(
    async (appNum: string, filingNumber: string, courtId: string) => {
      if (!authData) return; // Wait until authData is available (OTP completed)
      try {
        setIsRestoring(true);
        const res = await searchCtcApplications(
          {
            tenantId: tenantId as string,
            ctcApplicationNumber: appNum,
            courtId: courtId,
            filingNumber: filingNumber,
          },
          authData!,
          {},
        );

        const app = res?.ctcApplications?.[0];
        if (!app) {
          setIsRestoring(false);
          return;
        }

        setCtcApplication(app);

        // Prefill Step 1 state from the fetched application
        setStep1((prev) => ({
          ...prev,
          selectedCourt: app?.courtId || prev?.selectedCourt,
          caseNumber: app?.caseNumber || "",
          cnrNumber: app?.cnrNumber || "",
          hasSearched: true,
          phoneNumber: app?.mobileNumber || prev?.phoneNumber,
          isPhoneVerified: true,
          isPartyToCase: app?.isPartyToCase ?? false,
          name: app?.applicantName || "",
          designation: app?.partyDesignation || "",
        }));

        // Prefill Step 2 state if bundle nodes exist
        if (app?.selectedCaseBundle?.length) {
          const selectedIds = getLeafIds(app.selectedCaseBundle);

          setStep2((prev) => ({
            ...prev,
            selectedDocuments: selectedIds || prev?.selectedDocuments,
          }));
        }

        // Restore affidavit file from filestore if present
        const affidavitFsId = app?.affidavitDocument?.fileStore;
        if (affidavitFsId) {
          try {
            const affRes = await fetch(
              `/api/getFileByFileStoreId?tenantId=${tenantId}&fileStoreId=${affidavitFsId}`,
              {
                headers: authData?.authToken
                  ? { "auth-token": authData.authToken }
                  : {},
              },
            );
            if (!affRes.ok) {
              if (handleAuthError(affRes)) return;
            }
            if (affRes.ok) {
              const blob = await affRes.blob();
              const fileName =
                (app?.affidavitDocument?.additionalDetails
                  ?.fileName as string) || `affidavit.pdf`;
              const file = new File([blob], fileName, { type: blob.type });
              setStep2((prev) => ({
                ...prev,
                uploadedFile: file,
                uploadedFileName: fileName,
              }));
            }
          } catch (err) {
            console.error("Failed to restore affidavit file:", err);
          }
        }

        // Route to the right step based on status
        const status = app?.status;
        if (status && ["PENDING_SIGN", "PENDING_PAYMENT"].includes(status)) {
          setCurrentStep(3);
        } else if (status === "DRAFT_IN_PROGRESS") {
          setCurrentStep(1);
        }

        const cnrNumber = app?.cnrNumber;
        if (cnrNumber) {
          await handleSearchCase(cnrNumber);
        }
      } catch (err) {
        console.error("Failed to restore CTC application:", err);
        showErrorToast("Failed to restore application details.");
      } finally {
        setIsRestoring(false);
      }
    },
    [authData, tenantId, handleSearchCase, showErrorToast],
  );

  useEffect(() => {
    if (!router?.isReady) return;
    if (!initialLoadRef?.current) {
      initialLoadRef.current = true;
      getCourtOptions();
    }

    // Attempt to restore if applicationNumber exists in URL
    const urlApplicationNumber = router?.query?.applicationNumber as string;
    const urlCourtId = router?.query?.courtId as string;
    const urlFilingNumber = router?.query?.filingNumber as string;

    // If not in state, authData is already loaded from local state initialization or history

    const missingParams =
      !urlCourtId || !urlApplicationNumber || !urlFilingNumber;

    if (missingParams) return;

    if (!authData) return;

    if (ctcApplication?.ctcApplicationNumber === urlApplicationNumber) return;

    restoreFromUrl(urlApplicationNumber, urlFilingNumber, urlCourtId);
  }, [
    router?.isReady,
    router?.query,
    getCourtOptions,
    restoreFromUrl,
    authData,
    ctcApplication?.ctcApplicationNumber,
    router,
  ]);

  // ── Auth guard: redirect if authData is missing on Step 2/3 ────────────────
  useEffect(() => {
    if (
      router?.query?.applicationNumber &&
      !sessionStorage.getItem("ctcAuthData")
    ) {
      router?.replace("/certified-true-copies");
    }
  }, [currentStep, router]);

  // Clear auth data and session storage when leaving the apply flow
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // If we are navigating to a different base route, clear the session
      const applyPath = "/certified-true-copies/apply";
      if (!url.startsWith(applyPath)) {
        sessionStorage.removeItem("ctcAuthData");
      }
    };

    router?.events?.on("routeChangeStart", handleRouteChange);

    return () => {
      router?.events?.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  const handleApplicationUpdate = useCallback(
    (app: CtcApplication) => {
      sessionStorage.setItem("ctcAuthData", JSON.stringify(authData));
      setCtcApplication(app);
      setCurrentStep((prev) => prev + 1);
    },
    [authData],
  );

  const handleApplicationCreate = useCallback(
    (app: CtcApplication) => {
      handleApplicationUpdate(app);
      router?.replace(
        {
          pathname: router?.pathname,
          query: {
            ...router?.query,
            applicationNumber: app?.ctcApplicationNumber,
            courtId: app?.courtId,
            filingNumber: app?.filingNumber,
          },
        },
        undefined,
        { shallow: true },
      );
    },
    [handleApplicationUpdate, router],
  );

  const handleBack = () => {
    const status = ctcApplication?.status;
    if (status === "PENDING_SIGN" || status === "PENDING_PAYMENT") {
      router?.replace("/certified-true-copies");
      return;
    }
    if (currentStep > 1) {
      setCurrentStep((curr) => curr - 1);
    } else {
      router?.back();
    }
  };

  return (
    <div className={ctcStyles.page}>
      <Head>
        <title>{t(ctcText?.apply?.pageTitle)}</title>
      </Head>

      {(isLoading ||
        isSearchingCase ||
        isLoadingDocs ||
        isSearchingList ||
        isRestoring ||
        (Boolean(router?.query?.applicationNumber) && !ctcApplication)) && (
        <div className={commonStyles?.loading?.container}>
          <div className={commonStyles?.loading?.spinner}></div>
        </div>
      )}

      <div className="w-full mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex justify-center items-center relative">
          {Boolean(router?.query?.applicationNumber) && (
            <button onClick={handleBack} className={ctcStyles.backButton}>
              {svgIcons.BackArrowIcon()}
            </button>
          )}

          <h1
            className={
              isMobile
                ? ctcStyles.pageHeadingMobile
                : ctcStyles.pageHeadingDesktop
            }
            style={ctcStyles.pageHeadingStyle}
          >
            {t(ctcText?.apply?.pageTitle)}
          </h1>
        </div>

        {/* Stepper */}
        <div className="w-full flex justify-center mb-4">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <div className="w-full">
          {currentStep === 1 && (
            <Step1CaseDetails
              courtOptions={courtOptions}
              step1={step1}
              updateStep1={updateStep1}
              clearStep1={clearStep1}
              ctcApplication={ctcApplication}
              onApplicationCreate={handleApplicationCreate}
              onApplicationUpdate={handleApplicationUpdate}
              tenantId={tenantId as string}
              showErrorToast={showErrorToast}
              caseResult={caseResult}
              onAuthDataReceived={setAuthData}
              authData={authData}
              onSearchCase={handleSearchCase}
              isSearching={isSearchingCase}
              onSaving={setIsLoading}
              isSearchingList={isSearchingList}
              setIsSearchingList={setIsSearchingList}
            />
          )}
          {currentStep === 2 && (
            <Step2DocumentDetails
              isParty={step1?.isPartyToCase ?? false}
              step2={step2}
              updateStep2={updateStep2}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
              ctcApplication={ctcApplication}
              onApplicationUpdate={setCtcApplication}
              tenantId={tenantId as string}
              showErrorToast={showErrorToast}
              caseResult={caseResult}
              authData={authData}
              bundleNodes={bundleNodes}
              onSaving={setIsLoading}
            />
          )}
          {currentStep === 3 && (
            <Step3PreviewAndSign
              onBack={() => setCurrentStep(2)}
              ctcApplication={ctcApplication}
              onApplicationUpdate={setCtcApplication}
              tenantId={tenantId as string}
              showErrorToast={showErrorToast}
              caseResult={caseResult}
              authData={authData}
              onSaving={setIsLoading}
            />
          )}
        </div>
      </div>

      {/* ── Error toast notification ──────────────────────────────────── */}
      {errorToast?.show && (
        <div
          className={`${commonStyles?.notification?.container} ${commonStyles?.notification?.bottomCenter} ${commonStyles?.notification?.error}`}
          style={{ animation: "fadeInUp 0.3s ease-out" }}
        >
          <svg
            className={commonStyles?.notification?.icon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className={commonStyles?.notification?.message}>
            {errorToast?.message}
          </span>
        </div>
      )}
    </div>
  );
};

export default ApplyForCertifiedCopy;
