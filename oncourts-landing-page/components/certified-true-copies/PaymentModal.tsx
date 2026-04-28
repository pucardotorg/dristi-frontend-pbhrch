import React, { useEffect, useState } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { svgIcons } from "../../data/svgIcons";
import BaseModal from "./BaseModal";
import { ctcStyles, ctcText } from "../../styles/certifiedCopyStyles";
import type { AuthData, HeadBreakdownItem } from "../../types";
import { callGetHeadBreakdown } from "../../services/openApiPaymentService";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  onMakePayment: () => Promise<void> | void;
  paymentLoader?: boolean;
  authData: AuthData | null;
  tenantId: string;
  consumerCode: string;
  showErrorToast?: (msg: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSkip,
  onMakePayment,
  paymentLoader = false,
  authData,
  tenantId,
  consumerCode,
  showErrorToast,
}) => {
  const { t } = useSafeTranslation();
  const [isFetchingBreakdown, setIsFetchingBreakdown] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [breakdownItems, setBreakdownItems] = useState<HeadBreakdownItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && authData && tenantId && consumerCode) {
      let isMounted = true;
      setIsFetchingBreakdown(true);
      callGetHeadBreakdown(consumerCode, tenantId, authData)
        .then((res) => {
          if (!isMounted) return;
          const map = res?.TreasuryHeadMapping?.headAmountMapping;
          setBreakdownItems(map?.breakUpList || []);
          setTotalAmount(map?.totalAmount || 0);
        })
        .catch((err) => {
          console.error("Failed to fetch payment breakdown:", err);
          showErrorToast?.(t(ctcText.payment.fetchBreakdownFailed));
        })
        .finally(() => {
          if (isMounted) setIsFetchingBreakdown(false);
        });

      return () => {
        isMounted = false;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, authData, tenantId, consumerCode]);

  const isLoading = paymentLoader || isFetchingBreakdown || isPaymentProcessing;

  const handlePayClick = async () => {
    if (isPaymentProcessing) return;
    setIsPaymentProcessing(true);
    try {
      await onMakePayment();
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const footer = (
    <>
      <button
        onClick={onSkip}
        disabled={isLoading}
        className={`${ctcStyles.payBtnSkip} ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {t(ctcText.payment.skip)}
      </button>
      <button
        onClick={handlePayClick}
        disabled={isLoading}
        className={`${ctcStyles.payBtnPay} ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {isPaymentProcessing || paymentLoader
          ? t(ctcText.payment.processing)
          : t(ctcText.payment.makePayment)}
      </button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => {
        if (!isLoading) {
          onClose();
        }
      }}
      title={t(ctcText.payment.title)}
      footer={footer}
    >
      <div className={ctcStyles.payBody}>
        {/* Info banner */}
        <div className={ctcStyles.payInfoBanner}>
          <div className={ctcStyles.payInfoIconWrap}>
            {svgIcons.InfoIcon({ width: "25" })}
          </div>
          <div className={ctcStyles.payInfoText}>
            {t(ctcText.payment.infoBanner)}
          </div>
        </div>

        {/* Fee breakdown */}
        <div className={ctcStyles.payFeeList}>
          {isFetchingBreakdown ? (
            <div className="flex justify-center items-center py-4">
              <svg
                className="animate-spin h-6 w-6 text-teal-600"
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
            </div>
          ) : (
            <>
              {breakdownItems.map((item, idx) => (
                <div key={idx} className={ctcStyles.payFeeRow}>
                  <span>{t(item.name)}</span>
                  <span className={ctcStyles.payFeeValue}>₹{item.amount}</span>
                </div>
              ))}

              {breakdownItems.length > 0 && (
                <>
                  <div className={ctcStyles.payDivider} />
                  <div className={ctcStyles.payTotalRow}>
                    <span>{t(ctcText.payment.totalFees)}</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </>
              )}

              {breakdownItems.length === 0 && (
                <div className="text-center text-sm text-gray-500 py-2">
                  {t(ctcText.payment.noBreakdown)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default PaymentModal;
