import React, { useState, useEffect, useRef } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { svgIcons } from "../../data/svgIcons";
import OTPModal from "./OTPModal";
import type { ValidateUserInfo, AuthData } from "../../types";
import { ctcStyles, ctcText } from "../../styles/certifiedCopyStyles";

interface VerifyMobileNumberProps {
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  isPhoneVerified: boolean;
  onVerified: () => void;
  tenantId: string;
  filingNumber: string;
  courtId: string;
  showErrorToast?: (message: string) => void;
  onValidateSuccess?: (data: ValidateUserInfo) => void;
  onAuthDataReceived?: (data: AuthData) => void;
  isViewApplication?: boolean;
  autoFocus?: boolean;
  required?: boolean;
}

const VerifyMobileNumber: React.FC<VerifyMobileNumberProps> = ({
  phoneNumber,
  onPhoneNumberChange,
  isPhoneVerified,
  onVerified,
  tenantId,
  filingNumber,
  courtId,
  showErrorToast,
  onValidateSuccess,
  onAuthDataReceived,
  isViewApplication = false,
  autoFocus = false,
  required = true,
}) => {
  const { t } = useSafeTranslation();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpType, setOtpType] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && !isPhoneVerified) {
      inputRef.current?.focus();
    }
  }, [autoFocus, isPhoneVerified]);

  const handleSendOtp = async (customType?: "LOGIN" | "REGISTER") => {
    if (phoneNumber?.length !== 10) return;

    const requestType = customType || "LOGIN";
    if (!customType) setOtpType("LOGIN");

    setIsSendingOtp(true);
    try {
      const response = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: {
            mobileNumber: phoneNumber,
            tenantId: tenantId,
            userType: "citizen",
            type: requestType,
          },
        }),
      });

      if (!response?.ok) {
        const errorData = await response?.json().catch(() => null);
        let errorFields = errorData?.error?.fields;
        if (!errorFields && typeof errorData?.message === "string") {
          try {
            const parsedMessage = JSON.parse(errorData.message);
            errorFields = parsedMessage?.error?.fields;
          } catch {
            // ignore JSON parse error
          }
        }

        if (
          requestType === "LOGIN" &&
          errorFields?.some(
            (f: { code: string }) => f.code === "OTP.UNKNOWN_CREDENTIAL",
          )
        ) {
          setOtpType("REGISTER");
          await handleSendOtp("REGISTER");
          return;
        }
        showErrorToast?.(t(ctcText.verifyPhone.userNotRegistered));
        return;
      }

      const data = await response?.json();
      if (data?.isSuccessful) {
        setShowOtpModal(true);
      } else {
        showErrorToast?.(t(ctcText.verifyPhone.failedToSendOtp));
      }
    } catch (err) {
      console.error("Send OTP failed:", err);
      showErrorToast?.(t(ctcText.verifyPhone.failedToSendOtp));
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpVerified = () => {
    onVerified();
    setShowOtpModal(false);
  };

  return (
    <>
      <OTPModal
        t={t}
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleOtpVerified}
        phoneNumber={phoneNumber}
        tenantId={tenantId}
        filingNumber={filingNumber}
        courtId={courtId}
        onValidateSuccess={onValidateSuccess}
        onAuthDataReceived={onAuthDataReceived}
        isViewApplication={isViewApplication}
        otpType={otpType}
      />
      <div className={ctcStyles.verifyWrap}>
        <label className={ctcStyles.verifyLabel}>
          {t(ctcText.verifyPhone.label)}
          {required && (
            <span className="text-red-500 text-2xl leading-none ml-1">*</span>
          )}
        </label>
        <div className={ctcStyles.verifyInputWrap}>
          <span className={ctcStyles.verifyPrefix}>+91</span>
          <span className={ctcStyles.verifyDivider} />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => {
              const { value } = e.target;
              let updatedValue = value;
              if (value.length === 1) {
                updatedValue = value?.replace(/[^6-9]/g, "");
              } else {
                updatedValue = value?.replace(/[^0-9]/g, "");
              }
              onPhoneNumberChange(updatedValue);
            }}
            maxLength={10}
            placeholder={t(ctcText.verifyPhone.inputPlaceholder)}
            disabled={isPhoneVerified}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                phoneNumber?.length === 10 &&
                !isSendingOtp
              ) {
                handleSendOtp();
              }
            }}
            className={`${ctcStyles.verifyInput} ${
              isPhoneVerified
                ? ctcStyles.verifyInputDisabled
                : ctcStyles.verifyInputActive
            }`}
            ref={inputRef}
          />
          <div className={ctcStyles.verifyBtnWrap}>
            {isPhoneVerified ? (
              <div className={ctcStyles.verifyBadge}>
                {svgIcons.CheckSmallIcon?.() ?? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {t(ctcText.verifyPhone.verified)}
              </div>
            ) : (
              <button
                onClick={() => handleSendOtp()}
                disabled={phoneNumber.length !== 10 || isSendingOtp}
                className={`${ctcStyles.verifyBtn} ${
                  phoneNumber.length === 10 && !isSendingOtp
                    ? ctcStyles.verifyBtnActive
                    : ctcStyles.verifyBtnDisabled
                }`}
              >
                {isSendingOtp
                  ? t(ctcText.verifyPhone.sendingOtp)
                  : t(ctcText.verifyPhone.verify)}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyMobileNumber;
