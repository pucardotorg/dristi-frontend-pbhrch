import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import AddSignatureModal from "../AddSignatureModal";
import PaymentModal from "../PaymentModal";
import SuccessModal from "../SuccessModal";
import CaseSummaryRow from "../CaseSummaryRow";
import type { CaseResult } from "../../../types/case/models";
import FormActions from "../FormActions";
import { ctcStyles, ctcText } from "../../../styles/certifiedCopyStyles";
import { useSafeTranslation } from "../../../hooks/useSafeTranslation";
import usePaymentProcess from "../../../hooks/usePaymentProcess";
import { updateCtcApplication } from "../../../services/ctcService";
import { handleAuthError } from "../../../libraries/utils/authUtils";
import type { CtcApplication, AuthData } from "../../../types";
import DocViewWrapper from "../DocViewWrapper";

interface Step3PreviewAndSignProps {
  onBack: () => void;
  ctcApplication?: CtcApplication | null;
  onApplicationUpdate?: (app: CtcApplication) => void;
  tenantId: string;
  showErrorToast?: (message: string) => void;
  caseResult?: CaseResult | null;
  authData?: AuthData | null;
  onSaving?: (saving: boolean) => void;
}

const Step3PreviewAndSign: React.FC<Step3PreviewAndSignProps> = ({
  onBack,
  ctcApplication,
  onApplicationUpdate,
  tenantId,
  showErrorToast,
  caseResult,
  authData,
  onSaving,
}) => {
  const router = useRouter();
  const { t } = useSafeTranslation();

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isApplicationSigned, setIsApplicationSigned] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pdfFileStoreId, setPdfFileStoreId] = useState<string>("");

  const ctcApplicationFileStoreId = useMemo(() => {
    return (
      ctcApplication?.documents?.find(
        (d) => d.documentType === "SIGNED_CTC_APPLICATION",
      )?.fileStore ||
      ctcApplication?.documents?.find(
        (d) => d.documentType === "CTC_APPLICATION",
      )?.fileStore ||
      ""
    );
  }, [ctcApplication]);

  const [signedFileStoreId, setSignedFileStoreId] = useState<string | null>(
    null,
  );
  const [signedMethod, setSignedMethod] = useState<
    "ESIGN" | "UPLOAD_SIGNED_COPY" | null
  >(null);

  useEffect(() => {
    const isSignSuccess = sessionStorage.getItem("isSignSuccess");
    const storedESignObj = sessionStorage.getItem("signStatus");
    const parsedESignObj = storedESignObj ? JSON.parse(storedESignObj) : [];

    if (isSignSuccess) {
      const matchedSignStatus = parsedESignObj?.find(
        (obj: { name: string; isSigned: boolean }) =>
          obj.name === "Signature of Applicant" && obj.isSigned === true,
      );
      if (isSignSuccess === "success" && matchedSignStatus) {
        const fileStoreId =
          sessionStorage.getItem("esignFileStoreId") ||
          sessionStorage.getItem("fileStoreId");
        if (fileStoreId) {
          setSignedFileStoreId(fileStoreId);
          setSignedMethod("ESIGN");
          setIsApplicationSigned(true);
          setShowSignatureModal(true);
        }
      }
    }

    const cleanupTimer = setTimeout(() => {
      sessionStorage.removeItem("isSignSuccess");
      sessionStorage.removeItem("signStatus");
      sessionStorage.removeItem("fileStoreId");
      sessionStorage.removeItem("esignFileStoreId");
    }, 2000);

    return () => clearTimeout(cleanupTimer);
  }, []);

  const hasFetchedPdf = React.useRef(false);

  useEffect(() => {
    if (!ctcApplication || !authData) return;

    // Skip PDF blob fetch if status is PENDING_SIGN or PENDING_PAYMENT
    // (document already exists in filestore)
    const status = ctcApplication?.status;
    if (status === "PENDING_SIGN" || status === "PENDING_PAYMENT") return;

    // Prevent double-fetch
    if (hasFetchedPdf.current) return;
    hasFetchedPdf.current = true;

    setIsPdfLoading(true);
    onSaving?.(true);

    const fetchPdf = async () => {
      try {
        const payload = {
          RequestInfo: {
            apiId: "Dristi",
            authToken: authData.authToken,
            msgId: `${Date.now()}|en_IN`,
            plainAccessRequest: {},
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userInfo: authData.userInfo as any,
          },
          criteria: {
            tenantId: tenantId,
            courtId: ctcApplication.courtId,
            filingNumber: ctcApplication.filingNumber,
            ctcApplicationNumber: ctcApplication.ctcApplicationNumber,
          },
          pagination: {
            limit: 10,
            offset: 0,
          },
        };

        const res = await fetch(
          `/api/pdf/ctc-applications?tenantId=${tenantId}&qrCode=false&courtId=${ctcApplication.courtId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );
        if (!res.ok) {
          if (handleAuthError(res)) return;
        }
        const blob = await res.blob();
        setPdfBlob(blob);
      } catch (err) {
        console.error("Failed to generate CTC PDF:", err);
        showErrorToast?.(t(ctcText.step3.loadPreviewFailed));
        hasFetchedPdf.current = false; // allow retry on error
      } finally {
        setIsPdfLoading(false);
        onSaving?.(false);
      }
    };

    fetchPdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ctcApplication?.ctcApplicationNumber,
    ctcApplication?.status,
    authData,
    tenantId,
  ]);

  // ─── Payment hook ─────────────────────────────────────────────────────
  const {
    fetchBill,
    openPaymentPortal,
    paymentLoader,
    showPaymentModal,
    setShowPaymentModal,
  } = usePaymentProcess({
    tenantId,
    consumerCode: `${ctcApplication?.ctcApplicationNumber}_CTC_APPLICATION_FEE`,
    service: "ctc-default",
    authData: authData || null,
  });

  useEffect(() => {
    if (ctcApplication?.status === "PENDING_SIGN") {
      const fsId = ctcApplication.documents?.find(
        (d) => d.documentType === "CTC_APPLICATION" && d.isActive !== false,
      )?.fileStore;
      if (fsId) setPdfFileStoreId(fsId);
      setShowSignatureModal(true);
    } else if (ctcApplication?.status === "PENDING_PAYMENT") {
      setShowPaymentModal(true);
    }
  }, [ctcApplication, setShowPaymentModal]);

  const handleMakePayment = async () => {
    try {
      const bill = await fetchBill();

      // No pending bill — skip payment
      if (!bill?.Bill?.length) {
        setShowPaymentModal(false);
        setShowSuccessModal(true);
        return;
      }

      const paymentStatus = await openPaymentPortal(bill);

      if (paymentStatus) {
        setShowPaymentModal(false);
        setShowSuccessModal(true);
      } else {
        console.error("Payment was not completed.");
        showErrorToast?.(t(ctcText.step3.paymentIncomplete));
      }
    } catch (err) {
      console.error("Payment flow error:", err);
      showErrorToast?.(t(ctcText.step3.paymentFlowFailed));
    }
  };

  /** Go back — simply navigate to previous step without any API call */
  const handleGoBack = () => {
    onBack();
  };

  const handleOpenSignature = async () => {
    if (!pdfBlob) {
      showErrorToast?.(t(ctcText.step3.waitDocumentGeneration));
      return;
    }

    setIsUploading(true);
    onSaving?.(true);
    try {
      // 1. Upload blob to filestore
      let newFileStoreId = pdfFileStoreId;
      if (!newFileStoreId) {
        const file = new File([pdfBlob], "ctc_application.pdf", {
          type: pdfBlob.type,
        });
        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("tenantId", tenantId);
        formData.append("module", "DRISTI");

        const res = await fetch(`/api/filestore/upload`, {
          method: "POST",
          headers: authData?.authToken
            ? { "auth-token": authData.authToken }
            : {},
          body: formData,
        });

        if (!res.ok) {
          if (handleAuthError(res)) return;
          showErrorToast?.(t(ctcText.step3.uploadFailed));
          return;
        }

        const data = await res.json();
        newFileStoreId = data?.files?.[0]?.fileStoreId;

        if (!newFileStoreId) {
          showErrorToast?.(t(ctcText.step3.missingFileStoreId));
          return;
        }

        setPdfFileStoreId(newFileStoreId);
      }

      // 2. Save fileStoreId in documents and call updateCtc with SUBMIT
      if (ctcApplication && authData) {
        const prevDocs = ctcApplication.documents || [];
        const newDoc = {
          fileStore: newFileStoreId,
          documentType: "CTC_APPLICATION",
          tenantId,
        };

        const updatedApp: CtcApplication = {
          ...ctcApplication,
          documents: [...prevDocs, newDoc],
          tenantId,
          workflow: { action: "SUBMIT" },
        };

        const submitRes = await updateCtcApplication(updatedApp, authData);
        if (submitRes?.ctcApplication) {
          onApplicationUpdate?.(submitRes.ctcApplication);
        }
      }

      // 3. Open AddSignatureModal
      setIsApplicationSigned(false);
      setShowSignatureModal(true);
    } catch (err) {
      console.error("Filestore upload / submit error:", err);
      showErrorToast?.(t(ctcText.step3.uploadSignDocsFailed));
    } finally {
      setIsUploading(false);
      onSaving?.(false);
    }
  };

  return (
    <>
      <div className={ctcStyles.card}>
        <div className="flex flex-col gap-6">
          <CaseSummaryRow t={t} caseResult={caseResult} />

          {/* PDF Preview Area */}
          <div className="w-full h-[calc(100vh-250px)] flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            {isPdfLoading ? (
              <div className="flex flex-col items-center gap-3">
                <svg
                  className="animate-spin h-8 w-8 text-teal-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <p className="text-gray-500 font-medium">
                  {t(ctcText.step3.generatingDocument)}
                </p>
              </div>
            ) : ctcApplicationFileStoreId ? (
              <div className="flex-1 w-full h-full pb-4">
                <DocViewWrapper
                  fileStoreId={ctcApplicationFileStoreId}
                  tenantId={tenantId}
                  authToken={authData?.authToken}
                />
              </div>
            ) : pdfBlob ? (
              <div className="flex-1 w-full h-full pb-4">
                <DocViewWrapper blob={pdfBlob} />
              </div>
            ) : (
              <p className="text-gray-500">
                {t(ctcText.step3.documentPreviewUnavailable)}
              </p>
            )}
          </div>

          <FormActions
            secondaryLabel={ctcText.step3.goBack}
            onSecondary={handleGoBack}
            primaryLabel={
              isUploading ? t(ctcText.step3.uploading) : ctcText.step3.eSign
            }
            onPrimary={handleOpenSignature}
            primaryDisabled={
              isPdfLoading ||
              isUploading ||
              (!pdfBlob && !ctcApplicationFileStoreId)
            }
            isSecondaryDisabled={isUploading}
            primaryVariant="proceed"
          />
        </div>
      </div>

      <AddSignatureModal
        isOpen={showSignatureModal}
        onClose={async () => {
          // Call EDIT to revert status, then close modal (stay on Step 3)
          if (
            ctcApplication?.ctcApplicationNumber &&
            ctcApplication &&
            authData
          ) {
            try {
              onSaving?.(true);
              // Mark all existing documents as inactive
              const inactiveDocs = (ctcApplication.documents || []).map(
                (d) => ({ ...d, isActive: false }),
              );
              const res = await updateCtcApplication(
                {
                  ...ctcApplication,
                  documents: inactiveDocs,
                  tenantId,
                  ctcApplicationNumber: ctcApplication?.ctcApplicationNumber,
                  workflow: { action: "EDIT" },
                },
                authData,
              );
              if (res?.ctcApplication) {
                onApplicationUpdate?.(res?.ctcApplication);
                // Reset states to force re-fetch and re-upload on next signature attempt
                setPdfFileStoreId("");
                setPdfBlob(null);
                setShowSignatureModal(false);
                setSignedFileStoreId(null);
                setSignedMethod(null);
                setIsApplicationSigned(false);
                hasFetchedPdf.current = false;
              }
            } catch (err) {
              console.error("EDIT action failed:", err);
              showErrorToast?.(t(ctcText.step3.goBackFailed));
            } finally {
              onSaving?.(false);
            }
          }
        }}
        isSigned={isApplicationSigned}
        onSignSuccess={(fileId, method) => {
          setSignedFileStoreId(fileId);
          setSignedMethod(method);
          setIsApplicationSigned(true);
        }}
        onProceed={async () => {
          if (ctcApplication && authData && signedFileStoreId && signedMethod) {
            try {
              const prevDocs = ctcApplication.documents || [];
              const mockESignEnabled =
                window?.globalConfigs?.getConfig?.("mockESignEnabled") ===
                "true";

              let updatedApp: CtcApplication;

              if (mockESignEnabled && signedMethod === "ESIGN") {
                // Mock e-sign: Change docType in place to avoid file deletion by backend
                const updatedDocs = prevDocs.map((d) => {
                  if (
                    d.documentType === "CTC_APPLICATION" &&
                    d.fileStore === signedFileStoreId
                  ) {
                    return {
                      ...d,
                      documentType: "SIGNED_CTC_APPLICATION",
                    };
                  }
                  return d;
                });
                updatedApp = {
                  ...ctcApplication,
                  documents: updatedDocs,
                  tenantId,
                  workflow: { action: signedMethod },
                };
              } else {
                // Real e-sign or Upload: Mark original CTC_APPLICATION as inactive and add new SIGNED_CTC_APPLICATION
                const updatedPrevDocs = prevDocs.map((d) => ({
                  ...d,
                  isActive:
                    d.documentType === "CTC_APPLICATION" ? false : d.isActive,
                }));
                const newDoc = {
                  fileStore: signedFileStoreId,
                  documentType: "SIGNED_CTC_APPLICATION",
                  tenantId,
                };
                updatedApp = {
                  ...ctcApplication,
                  documents: [...updatedPrevDocs, newDoc],
                  tenantId,
                  workflow: { action: signedMethod },
                };
              }

              await updateCtcApplication(updatedApp, authData);
              if (onApplicationUpdate) {
                onApplicationUpdate(updatedApp);
              }
            } catch (err) {
              console.error(
                "Failed to update application with signature:",
                err,
              );
              showErrorToast?.(t(ctcText.step3.saveSignatureFailed));
              return; // block proceeding on error
            }
          }

          setShowSignatureModal(false);
          setShowPaymentModal(true);
        }}
        authData={authData || null}
        fileStoreId={pdfFileStoreId}
        tenantId={tenantId}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          if (router.query.fromView === "true") {
            router.replace("/certified-true-copies/view-status-application");
          } else {
            router.replace("/certified-true-copies");
          }
        }}
        onSkip={() => {
          if (router.query.fromView === "true") {
            router.replace("/certified-true-copies/view-status-application");
          } else {
            router.replace("/certified-true-copies");
          }
        }}
        onMakePayment={handleMakePayment}
        paymentLoader={paymentLoader}
        authData={authData || null}
        tenantId={tenantId}
        consumerCode={
          ctcApplication?.ctcApplicationNumber
            ? `${ctcApplication.ctcApplicationNumber}_CTC_APPLICATION_FEE`
            : ""
        }
        showErrorToast={showErrorToast}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        applicationNumber={ctcApplication?.ctcApplicationNumber || ""}
        submissionDate={ctcApplication?.auditDetails?.createdTime || 0}
        signedFileStoreId={
          ctcApplication?.documents?.find(
            (d) => d.documentType === "SIGNED_CTC_APPLICATION",
          )?.fileStore ||
          ctcApplication?.documents?.find(
            (d) => d.documentType === "CTC_APPLICATION",
          )?.fileStore ||
          ""
        }
        tenantId={tenantId}
        authToken={authData?.authToken}
        onClose={() => {
          router.replace("/certified-true-copies");
        }}
      />
    </>
  );
};

export default Step3PreviewAndSign;
