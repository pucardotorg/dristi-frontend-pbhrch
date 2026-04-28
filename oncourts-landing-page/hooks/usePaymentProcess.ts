import { useState, useCallback } from "react";
import {
  callFetchBill,
  callETreasury,
  callSearchBill,
} from "../services/openApiPaymentService";
import type { BillResponse, AuthData } from "../types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PaymentHookParams {
  tenantId: string;
  consumerCode: string;
  service: string;
  caseDetails?: {
    additionalDetails?: { payerName?: string; [key: string]: unknown };
    [key: string]: unknown;
  };
  /** When "applicationSubmission" the modal is NOT auto-closed after payment */
  scenario?: string;
  authData: AuthData | null;
}

export interface PaymentHookReturn {
  /** Fetch the latest bill for the current consumer code */
  fetchBill: () => Promise<BillResponse>;
  /** Open e-Treasury portal, wait for payment, and resolve true/false */
  openPaymentPortal: (bill: BillResponse, billAmount?: number | null) => Promise<boolean>;
  /** True while we are polling for the payment result */
  paymentLoader: boolean;
  showPaymentModal: boolean;
  setShowPaymentModal: (v: boolean) => void;
  billPaymentStatus: string | undefined;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isMockEnabled(): boolean {
  try {
    return window?.globalConfigs?.getConfig("MOCKENABLED") === "true";
  } catch {
    return false;
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

const usePaymentProcess = ({
  tenantId,
  consumerCode,
  service,
  scenario,
  authData,
}: PaymentHookParams): PaymentHookReturn => {
  const [paymentLoader, setPaymentLoader] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [billPaymentStatus, setBillPaymentStatus] = useState<string>();

  // ── Fetch bill ──────────────────────────────────────────────────────────

  const fetchBill = useCallback(async () => {
    if (!authData) throw new Error("Missing auth data");
    return callFetchBill({
      consumerCode: [consumerCode],
      tenantId,
      businessService: service,
    }, authData);
  }, [consumerCode, tenantId, service, authData]);

  // ── Poll until the bill is marked PAID or retries exhausted ─────────────

  const pollBillStatus = useCallback(
    (
      popup: Window | null,
      maxRetries: number,
      intervalMs: number,
      billConsumerCode?: string,
      billBusinessService?: string,
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        let retryCount = 0;

        const intervalId = setInterval(async () => {
          try {
            if (!authData) return;
            const result = await callSearchBill({
              tenantId,
              consumerCode: [consumerCode || billConsumerCode || ""],
              service: service || billBusinessService || "",
            }, authData);

            if (result?.Bill?.[0]?.status === "PAID") {
              setPaymentLoader(false);
              setBillPaymentStatus("PAID");
              popup?.close();
              clearInterval(intervalId);
              resolve(true);
              return;
            }
          } catch (err) {
            console.error("Error checking bill status:", err);
          }

          retryCount += 1;
          if (retryCount >= maxRetries) {
            setPaymentLoader(false);
            popup?.close();
            clearInterval(intervalId);
            resolve(false);
          }
        }, intervalMs);
      });
    },
    [tenantId, consumerCode, service, authData],
  );

  // ── Mock payment flow ──────────────────────────────────────────────────

  const handleMockPayment = useCallback(
    async (
      bill: BillResponse,
      gateway: { payload: { grn: string; data: string; headers: string } },
    ): Promise<boolean> => {
      const jsonData = JSON.parse(gateway?.payload?.data);
      const jsonHeader = JSON.parse(gateway?.payload?.headers);
      const now = new Date().toISOString().replace(/\.(\d{3})Z$/, "Z");

      const apiData = {
        RETURN_PARAMS: JSON.stringify({
          status: true,
          rek: "uL7gLH2LPfpaJOQKiCIFloyGClXDr2CQZ4GYnT5ECR6beeDnLqlMPudXSKtQ8CbX",
          data: JSON.stringify({
            GRN: gateway?.payload?.grn,
            DEPARTMENT_ID: jsonData["DEPARTMENT_ID"],
            CHALLANTIMESTAMP: now,
            BANKREFNO: "BANKREF987654321",
            CIN: "CIN0987654321",
            BANKTIMESTAMP: now,
            AMOUNT: jsonData["CHALLAN_AMOUNT"],
            STATUS: "N",
            BANK_CODE: "HDFC001",
            REMARKS: "Payment processed successfully",
            REMARK_STATUS: "PROCESSED",
            PARTYNAME: jsonData["PARTY_NAME"],
            OFFICECODE: jsonData["OFFICE_CODE"],
            DEFACE_FLAG: "N",
            ERROR: "",
            SERVICE_DEPT_CODE: jsonData["SERVICE_DEPT_CODE"],
          }),
          mockEnabled: true,
          hmac: "YjcxYjdkZDRmNzQ5NGFjODc2ZDhkMTM3NzBmMWViZmY5ODA4Y2ZkYjkzYTk2MzI2NjhkYWYzYTZkNDQzNzc3ZQ==",
        }),
        RETURN_HEADER: JSON.stringify({
          AuthToken: jsonHeader["authToken"],
        }),
      };

      const popup = window.open("", "popupWindow", "width=1000,height=1000,scrollbars=yes");
      if (popup) {
        const title = popup.document.createElement("h2");
        title.textContent = "Mock Payment in Progress. It will take 15-60 seconds";
        const msg = popup.document.createElement("p");
        msg.textContent = "Please wait while we process your payment. Pop up will close automatically after payment.";
        popup?.document?.body?.appendChild(title);
        popup?.document?.body?.appendChild(msg);
        setPaymentLoader(true);
      }

      try {
        const apiUrl = `${window.location.origin}/api/epayments`;
        await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        });
      } catch (err) {
        console.error("Mock epayments POST failed:", err);
        setPaymentLoader(false);
        popup?.close();
        return false;
      }

      const status = await pollBillStatus(
        popup,
        6, // maxRetries
        10_000, // 10 s interval
        bill?.Bill?.[0]?.consumerCode,
        bill?.Bill?.[0]?.businessService,
      );

      if (scenario !== "applicationSubmission") setShowPaymentModal(false);
      return status;
    },
    [pollBillStatus, scenario],
  );

  // ── Real payment flow (e-Treasury redirect in popup) ───────────────────

  const handleRealPayment = useCallback(
    (
      url: string,
      data: string,
      header: string,
      billConsumerCode: string,
      billBusinessService: string,
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        const popup = window.open("", "_blank");

        if (popup) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = url;

          const addField = (name: string, value: string) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = value;
            form.appendChild(input);
          };

          addField("input_data", data);
          addField("input_headers", header);

          popup?.document?.body?.appendChild(form);
          form?.submit();
          setPaymentLoader(true);
          popup?.document?.body?.removeChild(form);
        }

        let retryCount = 0;
        const maxRetries = 3;

        const checkPopupClosed = setInterval(async () => {
          if (popup?.closed) {
            setPaymentLoader(false);

            if (retryCount < maxRetries) {
              retryCount += 1;
              try {
                if (!authData) return;
                const result = await callSearchBill({
                  tenantId,
                  consumerCode: [consumerCode || billConsumerCode],
                  service: service || billBusinessService,
                }, authData);

                if (result?.Bill?.[0]?.status === "PAID") {
                  setBillPaymentStatus("PAID");
                  clearInterval(checkPopupClosed);
                  resolve(true);
                  return;
                }
              } catch (err) {
                console.error("Error checking bill after popup close:", err);
              }

              if (retryCount === maxRetries) {
                clearInterval(checkPopupClosed);
                resolve(false);
              }
            } else {
              clearInterval(checkPopupClosed);
              resolve(false);
            }
          }
        }, 1000);

        if (scenario !== "applicationSubmission") setShowPaymentModal(false);
      });
    },
    [tenantId, consumerCode, service, scenario, authData],
  );

  // ── Open payment portal (main entry point) ────────────────────────────

  const openPaymentPortal = useCallback(
    async (bill: BillResponse): Promise<boolean> => {
      try {
        if (!authData) throw new Error("Missing auth data");
        const billDetail = bill?.Bill?.[0]?.billDetails?.[0];

        const gateway = await callETreasury({
          billId: billDetail?.billId,
          serviceNumber: consumerCode,
          businessService: service,
          totalDue: bill?.Bill?.[0]?.totalAmount,
          mobileNumber: billDetail?.additionalDetails?.payerMobileNo || "",
          paidBy: billDetail?.additionalDetails?.payer || "",
          tenantId,
          mockEnabled: isMockEnabled(),
        }, authData);

        if (!gateway?.payload?.url) {
          console.error("Error calling e-Treasury — no payload URL returned.");
          return false;
        }

        if (isMockEnabled()) {
          return handleMockPayment(bill, gateway);
        }

        return handleRealPayment(
          gateway?.payload?.url,
          gateway?.payload?.data,
          gateway?.payload?.headers,
          bill?.Bill?.[0]?.consumerCode,
          bill?.Bill?.[0]?.businessService,
        );
      } catch (e) {
        console.error("openPaymentPortal error:", e);
        return false;
      }
    },
    [tenantId, consumerCode, service, handleMockPayment, handleRealPayment, authData],
  );

  return {
    fetchBill,
    openPaymentPortal,
    paymentLoader,
    showPaymentModal,
    setShowPaymentModal,
    billPaymentStatus,
  };
};

export default usePaymentProcess;
