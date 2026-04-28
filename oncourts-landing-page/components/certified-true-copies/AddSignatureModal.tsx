import React, { useEffect, useRef, useState } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import useESignApi from "../../hooks/useESignApi";
import { svgIcons } from "../../data/svgIcons";
import BaseModal from "./BaseModal";
import { ctcStyles, ctcText } from "../../styles/certifiedCopyStyles";
import { handleAuthError } from "../../libraries/utils/authUtils";
import type { AuthData } from "../../types";

interface AddSignatureModalProps {
  isOpen: boolean;
  onClose: () => Promise<void> | void;
  isSigned: boolean;
  onSignSuccess: (
    fileStoreId: string,
    method: "ESIGN" | "UPLOAD_SIGNED_COPY",
  ) => void;
  onProceed: () => Promise<void> | void;
  /** fileStoreId of the document to be e-signed via Aadhar */
  fileStoreId: string;
  /** Page module identifier sent to the eSign API (e.g. "CTC") */
  pageModule?: string;
  authData: AuthData | null;
  tenantId: string;
}

const AddSignatureModal: React.FC<AddSignatureModalProps> = ({
  isOpen,
  onClose,
  isSigned,
  onSignSuccess,
  onProceed,
  fileStoreId,
  pageModule = "lp",
  authData,
  tenantId,
}) => {
  const { t } = useSafeTranslation();
  const { handleEsign } = useESignApi();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isESignLoading, setIsESignLoading] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isProceedLoading, setIsProceedLoading] = useState(false);
  const [isBackLoading, setIsBackLoading] = useState(false);
  const [eSignError, setESignError] = useState("");
  const mockESignEnabled =
    window?.globalConfigs?.getConfig?.("mockESignEnabled") === "true";

  const loading =
    isESignLoading || isUploadLoading || isProceedLoading || isBackLoading;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setESignError("");
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleAadharESign = async () => {
    if (mockESignEnabled) {
      if (fileStoreId) onSignSuccess(fileStoreId, "ESIGN");
      return;
    }
    setIsESignLoading(true);
    setESignError("");
    try {
      const redirected = await handleEsign(
        "Signature of Applicant",
        pageModule,
        fileStoreId,
        authData as AuthData,
        "Signature of Applicant",
      );
      // redirected = true → page will redirect to CDAC portal; we do nothing
      // redirected = false → API failed or no form data returned
      if (!redirected) {
        setESignError(t(ctcText.addSig.esignRequestFailed));
      }
      // Do NOT call onSignSuccess() here. After the user completes signing on the
      // CDAC portal, they're redirected back and useEffect in parent marks them
      // as signed.
    } catch {
      setESignError(t(ctcText.addSig.somethingWentWrong));
    } finally {
      setIsESignLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];

      if (!allowedTypes.includes(file.type)) {
        setESignError(t("CTC_INVALID_FILE_FORMAT"));
        e.target.value = "";
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setESignError(t("CTC_FILE_SIZE_EXCEEDED"));
        e.target.value = "";
        return;
      }

      setESignError("");
      setIsUploadLoading(true);
      try {
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
          setESignError(t(ctcText.addSig.fileUploadFailed));
          return;
        }

        const data = await res.json();
        const newFileStoreId = data?.files?.[0]?.fileStoreId;

        if (newFileStoreId) {
          onSignSuccess(newFileStoreId, "UPLOAD_SIGNED_COPY");
        } else {
          setESignError(t(ctcText.addSig.missingFileStoreId));
        }
      } catch (err) {
        console.error("Filestore upload error:", err);
        setESignError(t(ctcText.addSig.uploadSignedCopyFailed));
      } finally {
        setIsUploadLoading(false);
      }
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!fileStoreId) return;
    try {
      const res = await fetch(
        `/api/getFileByFileStoreId?tenantId=${tenantId}&fileStoreId=${fileStoreId}`,
        {
          headers: authData?.authToken
            ? { "auth-token": authData.authToken }
            : {},
        },
      );
      if (!res.ok) {
        if (handleAuthError(res)) return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ctc_application.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download file for signing:", err);
    }
  };

  const footer = (
    <>
      <button
        onClick={async () => {
          if (isBackLoading) return;
          setIsBackLoading(true);
          try {
            await onClose();
          } finally {
            setIsBackLoading(false);
          }
        }}
        disabled={loading}
        className={ctcStyles.sigFooterBtnBack}
      >
        {isBackLoading ? t(ctcText.addSig.loading) : t(ctcText.addSig.backBtn)}
      </button>
      <button
        onClick={async () => {
          if (isProceedLoading) return;
          setIsProceedLoading(true);
          try {
            await onProceed();
          } finally {
            setIsProceedLoading(false);
          }
        }}
        disabled={!isSigned || loading}
        className={`${ctcStyles.sigFooterBtnProceed} ${
          isSigned && !loading
            ? ctcStyles.sigFooterBtnProceedActive
            : ctcStyles.sigFooterBtnProceedDisabled
        }`}
      >
        {isProceedLoading
          ? t(ctcText.addSig.processing)
          : t(ctcText.addSig.proceedBtn)}
      </button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => {
        if (!loading) {
          onClose();
        }
      }}
      title={t(ctcText.addSig.title)}
      footer={footer}
      maxWidth="max-w-[30%]"
    >
      <div className={ctcStyles.sigModalBody}>
        {/* Label + Signed badge on the same row */}
        <div className="flex items-center gap-4 mb-2">
          <label className={ctcStyles.sigModalLabel}>
            {t(ctcText.addSig.yourSignature)}
          </label>
          {isSigned && (
            <div className={ctcStyles.sigBadgeSigned}>
              {t(ctcText.addSig.signedBadge)}
            </div>
          )}
        </div>

        {!isSigned && (
          <div className="flex flex-col gap-3">
            <div className={ctcStyles.sigActionRow}>
              {/* E-Sign with Aadhar button — shows spinner while loading */}
              <button
                onClick={handleAadharESign}
                disabled={loading}
                className={`${ctcStyles.sigEsignBtn} ${
                  isESignLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isESignLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-teal-700"
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
                    {t(ctcText.addSig.processing)}
                  </span>
                ) : (
                  t(ctcText.addSig.eSignBtn)
                )}
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className={`${ctcStyles.sigUploadLink} ${
                  isUploadLoading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {svgIcons.UploadIcon()}
                {isUploadLoading
                  ? t(ctcText.addSig.uploading)
                  : t(ctcText.addSig.uploadLink)}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg"
              />
            </div>

            {/* Error message */}
            {eSignError && (
              <p className="text-red-600 text-xs font-medium mt-1">
                {eSignError}
              </p>
            )}

            <p className={ctcStyles.sigDownloadHint}>
              {t(ctcText.addSig.downloadHint)}{" "}
              <a
                href="#"
                onClick={handleDownload}
                className={ctcStyles.sigDownloadLink}
              >
                {t(ctcText.addSig.downloadLinkText)}
              </a>
            </p>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default AddSignatureModal;
