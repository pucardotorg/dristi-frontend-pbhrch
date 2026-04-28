import React, { useState, useEffect, useRef } from "react";
import BaseModal from "./BaseModal";
import { ctcStyles, ctcText } from "../../styles/certifiedCopyStyles";
import type { ValidateUserInfo, AuthData } from "../../types";
import { validateUser } from "../../services/ctcService";

const OTPModal = ({
  t,
  isOpen,
  onClose,
  onVerify,
  phoneNumber,
  tenantId,
  filingNumber,
  courtId,
  onValidateSuccess,
  onAuthDataReceived,
  isViewApplication,
  otpType = "LOGIN",
}: {
  t: (key: string) => string;
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  phoneNumber: string;
  tenantId: string;
  filingNumber: string;
  courtId: string;
  onValidateSuccess?: (data: ValidateUserInfo) => void;
  onAuthDataReceived?: (data: AuthData) => void;
  isViewApplication: boolean;
  otpType?: "LOGIN" | "REGISTER";
}) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Reset OTP every time the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setOtp("");
      setErrorMsg("");
    }
  }, [isOpen]);

  // Auto-clear error after 4 seconds
  useEffect(() => {
    if (!errorMsg) return;
    const timer = setTimeout(() => setErrorMsg(""), 4000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  const handleVerifyOtp = async () => {
    if (otp?.length !== 6) return;

    setIsVerifying(true);
    try {
      let authData: {
        access_token: string;
        UserRequest: Record<string, unknown>;
      };

      if (otpType === "REGISTER") {
        const createRes = await fetch("/api/otp/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: phoneNumber,
            otpReference: otp,
            tenantId: tenantId,
          }),
        });

        if (!createRes?.ok) {
          setErrorMsg(t("INVALID_OTP"));
          return;
        }

        authData = await createRes?.json();
      } else {
        // Step 1: Verify OTP → get access_token + UserRequest
        const response = await fetch("/api/otp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: phoneNumber,
            password: otp,
            tenantId: tenantId,
            userType: "citizen",
            scope: "read",
            grant_type: "password",
          }),
        });

        if (!response?.ok) {
          setErrorMsg(t("INVALID_OTP"));
          return;
        }

        authData = await response?.json();
      }

      if (!authData?.access_token) {
        setErrorMsg(
          t(ctcText.otpModal.verificationFailed) ||
            "OTP verification failed. Please try again.",
        );
        return;
      }

      // Store auth data in parent state
      const newAuthData = {
        authToken: authData?.access_token,
        userInfo: authData?.UserRequest,
      };
      onAuthDataReceived?.(newAuthData);
      // Step 2: Call validate API with auth data
      if (!isViewApplication) {
        const validateData = await validateUser(
          {
            mobileNumber: phoneNumber,
            filingNumber: filingNumber,
            tenantId: tenantId,
            courtId: courtId,
          },
          newAuthData,
        );

        if (validateData?.validateUserInfo) {
          onValidateSuccess?.(validateData?.validateUserInfo);
          onVerify();
          setTimeout(() => setOtp(""), 200);
        } else {
          setErrorMsg(
            t(ctcText.otpModal.validationFailed) ||
              "User validation failed. Please try again.",
          );
        }
      } else {
        onVerify();
        setTimeout(() => setOtp(""), 200);
      }
    } catch (err) {
      console.error("OTP verify/validate failed:", err);
      setErrorMsg(
        t(ctcText.otpModal.verificationFailed) ||
          "OTP verification failed. Please try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const footer = (
    <>
      <button
        onClick={() => {
          if (!isVerifying) onClose();
        }}
        disabled={isVerifying}
        className={`${ctcStyles.otpBtnBack} ${
          isVerifying ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {t(ctcText.otpModal.goBack)}
      </button>
      <button
        onClick={handleVerifyOtp}
        disabled={otp.length !== 6 || isVerifying}
        className={`${ctcStyles.otpBtnSubmit} ${
          otp.length === 6 && !isVerifying
            ? ctcStyles.otpBtnSubmitActive
            : ctcStyles.otpBtnSubmitDisabled
        }`}
      >
        {isVerifying
          ? t(ctcText.otpModal.verifying)
          : t(ctcText.otpModal.verify)}
      </button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => {
        if (!isVerifying) onClose();
      }}
      title={t(ctcText.otpModal.title)}
      footer={footer}
      maxWidth="max-w-[35%]"
    >
      <div className={ctcStyles.otpBody}>
        <label className={ctcStyles.otpLabel}>
          {t(ctcText.otpModal.inputLabel)}
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 6);
            setOtp(val);
            if (errorMsg) setErrorMsg("");
          }}
          placeholder={t(ctcText.otpModal.inputPlaceholder)}
          ref={inputRef}
          className={ctcStyles.otpInput}
          onKeyDown={(e) => {
            if (e.key === "Enter" && otp?.length === 6 && !isVerifying) {
              handleVerifyOtp();
            }
          }}
        />
        {errorMsg && (
          <p className="text-red-600 text-sm mt-2 font-medium">{errorMsg}</p>
        )}
      </div>
    </BaseModal>
  );
};

export default OTPModal;
