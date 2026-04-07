import React, { useState, useEffect, useRef, useCallback } from "react";
import { downloadAsPDF } from "../../utils/downloadPdf";
import Pagination from "../Utils/Pagination";
import {
  CaseResult,
  InboxSearchResponse,
  OrderDetails,
  PartyInfo,
  PaymentTask,
} from "../../types";
import { FiInfo } from "react-icons/fi";
import { commonStyles } from "../../styles/commonStyles";
import { formatDate } from "../../utils/formatDate";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

interface DetailedViewModalProps {
  isMobile: boolean;
  tenantId: string;
  onClose: () => void;
  caseResult: CaseResult;
}

const DetailedViewModal: React.FC<DetailedViewModalProps> = ({
  isMobile,
  tenantId,
  onClose,
  caseResult,
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Ref to track initial API calls and prevent duplicate calls
  const initialLoadRef = useRef<boolean>(false);
  const { t } = useSafeTranslation();

  // State for order history data from API
  const [orderHistory, setOrderHistory] = useState<OrderDetails[]>([]);
  const [paymentTasks, setPaymentTasks] = useState<PaymentTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Start with loading true
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIconId, setHoveredIconId] = useState<number | null>(null);

  // Track loading state for different data sources
  const [loadingStates, setLoadingStates] = useState({
    magistrate: !!caseResult.courtId, // Only if courtId exists
    orders: true,
    paymentTasks: true,
  });

  const [showAll, setShowAll] = useState({
    complainants: false,
    complainantAdvocates: false,
    accuseds: false,
    accusedAdvocates: false,
  });

  // State for orders pagination
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [currentOrderPage, setCurrentOrderPage] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 10;
  const initialOrdersToShow = 5;

  // State for payment tasks pagination
  const [currentTaskPage, setCurrentTaskPage] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const tasksPerPage = 10;
  const [magistrateName, setMagistrateName] = useState("");
  const [complainants, setComplainants] = useState<PartyInfo[]>([]);
  const [complainantAdvocates, setComplainantAdvocates] = useState<PartyInfo[]>(
    []
  );
  const [accuseds, setAccuseds] = useState<PartyInfo[]>([]);
  const [accusedAdvocates, setAccusedAdvocates] = useState<PartyInfo[]>([]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    // Disable scrolling on the body
    document.body.style.overflow = "hidden";

    // Restore the original overflow when component unmounts
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  // PDF configuration options
  const pdfConfig = {
    scale: 1.5, // Reduced scale for better fitting
    format: "a4",
    quality: 0.95,
    filename: `Case_Details_${caseResult.cnrNumber || caseResult.stNumber || caseResult.cmpNumber || "Report"}.pdf`,
    loading: {
      text: "Generating PDF...",
      subtext: "This may take a moment",
    },
  };

  // Fetch magistrate/judge name from API
  const getMagistrateName = useCallback(async () => {
    if (!caseResult.courtId) {
      // If no courtId, mark this as loaded and skip the API call
      setLoadingStates((prev) => ({ ...prev, magistrate: false }));
      return;
    }

    setLoadingStates((prev) => ({ ...prev, magistrate: true }));

    try {
      const response = await fetch(
        `/api/case/magistrate?courtId=${caseResult.courtId}&tenantId=${tenantId}`
      );

      if (!response.ok) {
        console.error("Failed to fetch magistrate data:", response.statusText);
      }

      const data = await response.json();
      setMagistrateName(data.name || "");
    } catch (error) {
      console.error("Error fetching magistrate name:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, magistrate: false }));
    }
  }, [caseResult, tenantId]);

  const getCitizenDetails = useCallback(() => {
    if (!caseResult) {
      console.warn("caseResult is undefined in getCitizenDetails");
      return;
    }
    const complainantAdvocateDetails = Array.isArray(caseResult.advocates)
      ? caseResult.advocates.filter(
          (advocate) => advocate.entityType === "complainant"
        )
      : [];

    const accusedAdvocateDetails = Array.isArray(caseResult.advocates)
      ? caseResult.advocates.filter(
          (advocate) => advocate.entityType === "accused"
        )
      : [];

    const complainantDetails = Array.isArray(caseResult.litigants)
      ? caseResult.litigants.filter(
          (litigant) => litigant.entityType === "complainant"
        )
      : [];

    const accusedDetails = Array.isArray(caseResult.litigants)
      ? caseResult.litigants.filter(
          (litigant) => litigant.entityType === "accused"
        )
      : [];

    setComplainantAdvocates(complainantAdvocateDetails || []);
    setAccusedAdvocates(accusedAdvocateDetails || []);
    setComplainants(complainantDetails || []);
    setAccuseds(accusedDetails || []);
  }, [caseResult]);

  // Fetch order history data from API
  const fetchOrderHistory = useCallback(
    async (page = 0, initialLoad = false) => {
      if (!caseResult.filingNumber || !caseResult.courtId) {
        // If required data is missing, mark as loaded and return
        setLoadingStates((prev) => ({ ...prev, orders: false }));
        return;
      }

      try {
        if (initialLoad) {
          setLoadingStates((prev) => ({ ...prev, orders: true }));
        }
        setInternalLoading(true);
        setError(null);

        const offset = page * ordersPerPage;
        const limit = initialLoad ? initialOrdersToShow : ordersPerPage;

        const payload = {
          filingNumber: caseResult.filingNumber,
          courtId: caseResult.courtId,
          forOrders: true,
          forPaymentTask: false,
          tenantId,
          latestOrder: initialLoad ? true : false,
          limit: Number(limit),
          offset: Number(offset),
        };

        const response = await fetch("/api/case/orders-tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order history");
        }

        const responseData: InboxSearchResponse = await response.json();

        // When getting initial data or first page, save total count for pagination
        if (initialLoad || page === 0) {
          setTotalOrders(responseData.totalCount || 0);
        }
        setOrderHistory(responseData.orderDetailsList || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching order history:", err);
      } finally {
        if (initialLoad) {
          setLoadingStates((prev) => ({ ...prev, orders: false }));
        }
        setInternalLoading(false);
      }
    },
    [caseResult, ordersPerPage, tenantId]
  );

  // Fetch payment tasks from API
  const fetchPaymentTasks = useCallback(
    async (page = 0, initialLoad = false) => {
      if (!caseResult.filingNumber || !caseResult.courtId) {
        // If required data is missing, mark as loaded and return
        setLoadingStates((prev) => ({ ...prev, paymentTasks: false }));
        return;
      }

      try {
        if (initialLoad) {
          setLoadingStates((prev) => ({ ...prev, paymentTasks: true }));
        }
        setInternalLoading(true);
        setError(null);

        const offset = page * tasksPerPage;
        const limit = tasksPerPage;

        const payload = {
          filingNumber: caseResult.filingNumber,
          courtId: caseResult.courtId,
          forOrders: false,
          forPaymentTask: true,
          tenantId,
          limit: Number(limit),
          offset: Number(offset),
        };

        const response = await fetch("/api/case/orders-tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch payment tasks");
        }

        const responseData: InboxSearchResponse = await response.json();

        setTotalTasks(responseData.totalCount);
        setPaymentTasks(responseData.paymentTasks || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching payment tasks:", err);
      } finally {
        if (initialLoad) {
          setLoadingStates((prev) => ({ ...prev, paymentTasks: false }));
        }
        setInternalLoading(false);
      }
    },
    [caseResult, tasksPerPage, tenantId]
  );

  // Check if all data is loaded
  useEffect(() => {
    const { magistrate, orders, paymentTasks } = loadingStates;
    // Set overall loading state based on all individual loading states
    setLoading(magistrate || orders || paymentTasks);
  }, [loadingStates]);

  // Load all data when component mounts, using ref to prevent duplicate calls
  useEffect(() => {
    // Only run initialization once
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      fetchOrderHistory(0, true);
      fetchPaymentTasks(0, true);
      getMagistrateName();
      getCitizenDetails();
    }
  }, [
    fetchOrderHistory,
    getMagistrateName,
    getCitizenDetails,
    fetchPaymentTasks,
  ]);

  const renderList = (
    list: PartyInfo[],
    show: boolean,
    key:
      | "complainants"
      | "complainantAdvocates"
      | "accuseds"
      | "accusedAdvocates"
  ) => {
    const visibleItems = show ? list : list.slice(0, 2);
    if (visibleItems.length === 0) {
      return <p className="text-[16px] font-normal">NA</p>;
    }
    if (visibleItems.length === 0) {
      return <p className="text-[16px] font-normal">NA</p>;
    }
    return (
      <>
        {visibleItems.map((item, idx) => (
          <p className="text-[16px] font-normal" key={idx}>
            {item.name}
          </p>
        ))}
        {list.length > 2 && (
          <button
            className="text-[#006FD5] text-sm underline mt-1"
            onClick={() =>
              setShowAll((prev) => ({ ...prev, [key]: !prev[key] }))
            }
          >
            {show ? "View Less" : "View All"}
          </button>
        )}
      </>
    );
  };

  const openFileInNewTab = async (orderId: string): Promise<void> => {
    if (!orderId) {
      console.error("Order ID is required");
      return;
    }

    try {
      // Direct API call to get the file
      const response = await fetch(
        `/api/case/downloadFile?tenantId=${tenantId}&orderId=${orderId}`
      );

      if (!response.ok) {
        throw new Error(`File download failed with status: ${response.status}`);
      }

      const blob = await response.blob();

      // Check if device is iOS
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);

      if (isIOS) {
        // For iOS, create a temporary anchor element and trigger a download
        // Get filename from content-disposition header or create a default one
        const fileName = `order-${orderId}.pdf`;

        // Create a temporary anchor element
        const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);

        // Create a download URL and set attributes
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;

        // Programmatically click the link to trigger download
        a.click();

        // Clean up
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
      } else {
        // For other devices, use the standard window.open method
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 5000);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <React.Fragment>
      {loading ? (
        // Loading spinner
        <div className={commonStyles.loading.container}>
          <div className={commonStyles.loading.spinner}></div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            ref={modalContentRef}
            className={`bg-white rounded-lg relative overflow-hidden flex flex-col max-h-[90vh] ${isMobile ? "w-[90%]" : "w-[70%]"}`}
          >
            <div className="sticky top-0 z-50 bg-white border-b-2 border-[#E2E8F0] px-6 py-4 flex justify-between items-center">
              <div className="font-roboto text-xl font-bold text-[#0F172A]">
                {t("DETAILED_VIEW")} |{" "}
                <span className="text-[#0F766E]">{caseResult.caseTitle}</span>
              </div>

              <div className="font-[Inter] flex items-center gap-2">
                {!isMobile && (
                  <button
                    className="flex items-center gap-1 px-3 py-1 bg-teal-600 text-[#334155] border-2 border-[#E2E8F0] rounded-md font-roboto text-sm hover:bg-teal-700 transition"
                    onClick={() => downloadAsPDF(pdfConfig, modalContentRef)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {t("DOWNLOAD_PDF")}
                  </button>
                )}
                <button
                  className="text-3xl font-medium text-gray-700 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition"
                  onClick={onClose}
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-3 md:px-6 pt-4 pb-8 space-y-6">
              {isMobile && (
                <button
                  className="flex items-center gap-1 px-3 py-1 bg-teal-600 text-[#334155] border-2 border-[#E2E8F0] rounded-md font-robototext-sm hover:bg-teal-700 transition"
                  onClick={() => downloadAsPDF(pdfConfig, modalContentRef)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {t("DOWNLOAD_PDF")}
                </button>
              )}
              {/* Case Details - Mobile First Card Layout */}
              <div className="font-roboto grid grid-cols-1 md:grid-cols-5 gap-1 bg-[#F7F5F3] p-4 rounded-md text-sm">
                <div className="flex flex-col md:border-r pr-4 pl-2">
                  <span className="text-sm font-base text-[#77787B]">
                    {t("CASE_NUMBER")}
                  </span>
                  <span className="text-[16px] font-bold text-[#0B0C0C]">
                    {caseResult.stNumber || caseResult.cmpNumber}
                  </span>
                </div>
                <div className="flex flex-col md:border-r pr-4 pl-2">
                  <span className="text-sm font-base text-[#77787B]">
                    {t("CNR_NUMBER")}
                  </span>
                  <span className="text-[16px] font-bold text-[#0B0C0C] break-words whitespace-normal">
                    {caseResult.cnrNumber}
                  </span>
                </div>
                <div className="flex flex-col md:border-r pr-4 pl-2">
                  <span className="text-sm font-base text-[#77787B]">
                    {t("FILING_NUMBER")}
                  </span>
                  <span className="text-[16px] font-bold text-[#0B0C0C] break-words whitespace-normal">
                    {caseResult.filingNumber}
                  </span>
                </div>
                <div className="flex flex-col md:border-r pr-4 pl-2">
                  <span className="text-sm font-base text-[#77787B]">
                    {t("FILING_DATE")}
                  </span>
                  <span className="text-[16px] font-bold text-[#0B0C0C] break-words whitespace-normal">
                    {formatDate(caseResult.filingDate)}
                  </span>
                </div>
                <div className="flex flex-col pr-4 pl-2">
                  <span className="text-sm font-base text-[#77787B]">
                    {t("REGISTRATION_DATE")}
                  </span>
                  <span className="text-[16px] font-bold text-[#0B0C0C] break-words whitespace-normal">
                    {formatDate(caseResult.registrationDate)}
                  </span>
                </div>
              </div>
              <div className="font-roboto flex md:flex-row flex-col gap-3 bg-[#F7F5F3] p-4 rounded-md text-sm">
                <div className="md:w-1/5 flex flex-col md:border-r md:pl-0 pl-2">
                  <span className="text-sm font-base text-[#77787B]">
                    {t("MAGISTRATE")}
                  </span>
                  <span className="text-[16px] font-bold text-[#0B0C0C] break-words whitespace-normal">
                    {magistrateName}
                  </span>
                </div>
                <div className="md:w-4/5 flex flex-col md:pl-0 pl-2">
                  <span className="text-sm font-base text-[#77787B]">
                    {t("COURT_NAME")}
                  </span>
                  <span className="text-[16px] font-bold text-[#0B0C0C]">
                    {caseResult.courtName}
                  </span>
                </div>
              </div>

              <div className="bg-[#F7F5F3] p-6 rounded-md text-sm">
                <h2 className="font-roboto text-[#334155] text-xl font-semibold border-b pb-2 mb-3">
                  {t("LITIGANT_DETAILS")}
                </h2>
                <div className="font-roboto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="pr-2 border-r">
                    <p className="text-[16px] font-bold text-[#0A0A0A]">
                      {t("COMPLAINANTS")}
                    </p>
                    {renderList(
                      complainants,
                      showAll.complainants,
                      "complainants"
                    )}
                  </div>
                  <div className="pr-2 border-r">
                    <p className="text-[16px] font-bold text-[#0A0A0A]">
                      {t("COMPLAINANT_ADVOCATES")}
                    </p>
                    {renderList(
                      complainantAdvocates,
                      showAll.complainantAdvocates,
                      "complainantAdvocates"
                    )}
                  </div>
                  <div className="pr-2 border-r">
                    <p className="text-[16px] font-bold text-[#0A0A0A]">
                      {t("ACCUSED")}
                    </p>
                    {renderList(accuseds, showAll.accuseds, "accuseds")}
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-[#0A0A0A]">
                      {t("ACCUSED_ADVOCATES")}
                    </p>
                    {renderList(
                      accusedAdvocates,
                      showAll.accusedAdvocates,
                      "accusedAdvocates"
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[#F7F5F3] p-6 rounded-md text-sm">
                <h2 className="font-roboto text-[#334155] text-xl font-semibold border-b pb-2 mb-3">
                  {t("KEY_DETAILS")}
                </h2>
                <div className="font-roboto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2 pr-0 md:pr-4 border-b pb-2 md:pb-0 md:border-b-0 md:border-r">
                    <div className="flex justify-between gap-4">
                      <span className="flex-1 text-[16px] font-bold text-[#0A0A0A]">
                        {t("NEXT_HEARING_DATE")}
                      </span>
                      <span className="flex-1 text-[16px]">
                        {formatDate(caseResult.nextHearingDate)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="flex-1 text-[16px] font-bold text-[#0A0A0A]">
                        {t("PURPOSE")}
                      </span>
                      <span className="flex-1 text-[16px]">
                        {t(caseResult.purpose || "")}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="flex-1 text-[16px] font-bold text-[#0A0A0A]">
                        {t("LAST_HEARING_ON")}
                      </span>
                      <span className="flex-1 text-[16px]">
                        {formatDate(caseResult.lastHearingDate)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 pl-0 md:pl-4">
                    <div className="flex justify-between gap-4">
                      <span className="flex-1 text-[16px] font-bold text-[#0A0A0A]">
                        {t("CASE_STAGE")}
                      </span>
                      <span className="flex-1 text-[16px]">
                        {t(caseResult.caseSubStage || "")}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="flex-1 text-[16px] font-bold text-[#0A0A0A]">
                        {t("PROCESS_PAYMENT_PENDING")}
                      </span>
                      <button
                        onClick={() => {
                          const taskSection = document.getElementById(
                            "pendingTasksSection"
                          );
                          taskSection?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="flex-1 text-[16px] text-left text-[#DC2626] underline hover:text-red-700"
                      >
                        {paymentTasks.length > 0 ? "Yes" : "No"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-6 bg-white">
                {/* Order History Section */}
                <h2 className="font-roboto text-xl font-bold mb-3">
                  {t("ORDER_HISTORY")}
                </h2>
                {internalLoading ? (
                  <div className="font-roboto text-center py-4">
                    {t("LOADING_ORDER_HISTORY")}
                  </div>
                ) : error ? (
                  <div className="font-roboto text-center py-4 text-red-500">
                    {t(error)}
                  </div>
                ) : (
                  <>
                    {orderHistory.length > 0 ? (
                      <>
                        {/* Desktop Order History Table View */}
                        <table className="hidden md:table w-full text-[16px] text-left">
                          <thead>
                            <tr className="font-roboto font-bold text-[#0B0C0C] border-b border-[#BBBBBD]">
                              <th className="px-2 py-1">{t("S_NO")}</th>
                              <th className="px-2 py-1">{t("DATE")}</th>
                              <th className="px-2 py-1">
                                {t("BUSINESS_OF_THE_DAY")}
                              </th>
                              <th className="px-2 py-1 text-center">
                                {t("VIEW_ORDER")}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Show orders - either initial 2 or full paginated view */}
                            {orderHistory.map((item, idx) => (
                              <tr
                                key={idx}
                                className="font-roboto font-normal text-[#0A0A0A] border-b border-[#E8E8E8]"
                              >
                                <td className="px-2 py-2">
                                  {showAllOrders
                                    ? currentOrderPage * ordersPerPage + idx + 1
                                    : idx + 1}
                                </td>
                                <td className="px-2 py-2">
                                  {formatDate(item.date)}
                                </td>
                                <td className="px-2 py-2">
                                  {item.businessOfTheDay}
                                </td>
                                <td className="px-2 py-2 text-center">
                                  <button
                                    className="px-2 py-1 border text-sm text-[#334155] font-medium rounded-md bg-[#F8FAFC] border-[#CBD5E1] hover:bg-gray-100"
                                    onClick={() =>
                                      openFileInNewTab(item.orderId)
                                    }
                                  >
                                    {t("VIEW")}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Mobile Order History Card View */}
                        <div className="md:hidden space-y-4">
                          {orderHistory.map((item, idx) => (
                            <div
                              key={idx}
                              className="border rounded-md p-3 bg-white shadow-sm"
                            >
                              <table className="w-full font-roboto text-base mb-2 table-fixed">
                                <tbody>
                                  <tr>
                                    <td className="py-1 font-libre font-bold text-[#0B0C0C] w-1/3">
                                      {t("S_NO")}
                                    </td>
                                    <td className="py-1 w-2/3">
                                      {showAllOrders
                                        ? currentOrderPage * ordersPerPage +
                                          idx +
                                          1
                                        : idx + 1}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-1 font-libre font-bold text-[#0B0C0C] w-1/3">
                                      {t("DATE")}
                                    </td>
                                    <td className="py-1 w-2/3">
                                      {formatDate(item.date)}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-1 font-libre font-bold text-[#0B0C0C] w-1/3">
                                      {t("BUSINESS_OF_THE_DAY")}
                                    </td>
                                    <td className="py-1 w-2/3">
                                      {item.businessOfTheDay}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="py-1 font-libre font-bold text-[#0B0C0C] w-1/3">
                                      {t("VIEW_ORDER")}
                                    </td>
                                    <td className="py-1 w-2/3">
                                      <button
                                        onClick={() =>
                                          openFileInNewTab(item.orderId)
                                        }
                                        className="px-2 py-1 font-[Inter] border text-[#334155] font-medium rounded-md bg-[#F8FAFC] border-[#CBD5E1] hover:bg-gray-100"
                                      >
                                        {t("VIEW")}
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>

                        {showAllOrders && totalOrders > ordersPerPage && (
                          <Pagination
                            currentStartIndex={
                              currentOrderPage * ordersPerPage + 1
                            }
                            totalItems={totalOrders}
                            itemsPerPage={ordersPerPage}
                            onPrevPage={() => {
                              const newPage = Math.max(0, currentOrderPage - 1);
                              setCurrentOrderPage(newPage);
                              fetchOrderHistory(newPage);
                            }}
                            onNextPage={() => {
                              const newPage = Math.min(
                                Math.ceil(totalOrders / ordersPerPage) - 1,
                                currentOrderPage + 1
                              );
                              setCurrentOrderPage(newPage);
                              fetchOrderHistory(newPage);
                            }}
                            isFirstPage={currentOrderPage === 0}
                            isLastPage={
                              currentOrderPage >=
                              Math.ceil(totalOrders / ordersPerPage) - 1
                            }
                          />
                        )}
                      </>
                    ) : (
                      <div className="font-roboto text-center py-4">
                        {t("NO_ORDER_HISTORY_AVAILABLE")}
                      </div>
                    )}
                  </>
                )}

                {/* Only show 'See more Orders' button if there are more than initial orders to show */}
                {!showAllOrders && orderHistory.length > 4 && (
                  <div className="font-roboto mt-2 mb-8">
                    <button
                      onClick={() => {
                        setShowAllOrders(true);
                        setCurrentOrderPage(0);
                        fetchOrderHistory(0, false);
                      }}
                      className="text-[#1D4ED8] text-sm underline"
                    >
                      {t("SEE_MORE_ORDERS")}
                    </button>
                  </div>
                )}

                {/* Show 'Show less' button when in expanded view */}
                {/* {showAllOrders && orderHistory.length > 0 && (
                  <div className="mt-2 mb-6">
                    <button
                      onClick={() => {
                        setShowAllOrders(false);
                        setCurrentOrderPage(0);
                      }}
                      className="text-[#1D4ED8] text-sm underline"
                    >
                      Show less
                    </button>
                  </div>
                )} */}

                {/* Process Payment Pending Tasks Section */}
                <div id="pendingTasksSection">
                  <h2 className="font-roboto text-xl font-bold mt-6 mb-3">
                    {t("PROCESS_PAYMENT_PENDING_TASKS")}
                  </h2>
                  {internalLoading ? (
                    <div className="font-roboto text-center py-4">
                      {t("LOADING_PAYMENT_TASKS")}
                    </div>
                  ) : error ? (
                    <div className="font-roboto text-center py-4 text-red-500">
                      {t(error)}
                    </div>
                  ) : (
                    <>
                      {paymentTasks.length > 0 ? (
                        <>
                          {/* Desktop Payment Tasks Table View */}
                          <table className="hidden md:table w-full text-[16px] text-left">
                            <thead>
                              <tr className="font-libre font-bold text-[#0B0C0C] border-b border-[#BBBBBD]">
                                <th className="px-2 py-1">{t("S_NO")}</th>
                                <th className="px-2 py-1">{t("TASK")}</th>
                                <th className="px-2 py-1">{t("DUE_DATE")}</th>
                                <th className="px-2 py-1">
                                  {t("DAYS_REMAINING")}
                                </th>
                                <th className="px-2 py-1"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {paymentTasks.map((task, idx) => (
                                <tr
                                  key={idx}
                                  className="font-roboto border-b border-[#E8E8E8]"
                                >
                                  <td className="px-2 py-2">
                                    {currentTaskPage * tasksPerPage + idx + 1}
                                  </td>
                                  <td className="px-2 py-2 font-medium">
                                    {t(task?.task)}
                                  </td>
                                  <td className="px-2 py-2">
                                    {formatDate(task?.dueDate)}
                                  </td>
                                  <td className="px-2 py-2 text-red-600 font-medium">
                                    {`${task?.daysRemaining} Days`}
                                  </td>
                                  <td className="px-2 py-2 text-right">
                                    <div className="relative">
                                      <button
                                        className="w-6 h-6 flex items-center justify-center"
                                        onMouseEnter={() =>
                                          setHoveredIconId(idx)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredIconId(null)
                                        }
                                      >
                                        <FiInfo
                                          className="text-[#334155]"
                                          size={14}
                                        />
                                      </button>
                                      {hoveredIconId === idx && (
                                        <div className="absolute bottom-full right-0 mb-2 p-2 bg-[#3A3A3A] text-white text-center text-sm rounded-md w-48 z-10">
                                          {t(
                                            "LOGIN_TO_THE_PORTAL_TO_MAKE_THE_ONLINE_PAYMENT"
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Mobile Payment Tasks Card View */}
                          <div className="md:hidden space-y-4">
                            {paymentTasks.map((task, idx) => (
                              <div
                                key={idx}
                                className="border rounded-md p-3 bg-white shadow-sm"
                              >
                                <table className="w-full font-roboto text-base mb-2 table-fixed">
                                  <tbody>
                                    <tr>
                                      <td className="py-1 font-libre font-bold text-[#0B0C0C] w-1/3">
                                        {t("S_NO")}
                                      </td>
                                      <td className="py-1 w-2/3">
                                        {currentTaskPage * tasksPerPage +
                                          idx +
                                          1}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-1 font-libre font-bold text-[#0B0C0C] w-1/3">
                                        {t("TASK")}
                                      </td>
                                      <td className="py-1 w-2/3">
                                        {t(task?.task)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-1 font-libre font-bold text-[#0B0C0C] w-1/3">
                                        {t("DUE_DATE")}
                                      </td>
                                      <td className="py-1 w-2/3">
                                        {formatDate(task?.dueDate)}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="py-1 font-libre font-bold text-[#0B0C0C] w-1/3">
                                        {t("DAYS_REMAINING")}
                                      </td>
                                      <td className="py-1 text-red-600 font-medium w-2/3">{`${task?.daysRemaining} Days`}</td>
                                    </tr>
                                    <tr>
                                      <td className="py-1 font-libre font-bold text-[#0B0C0C] w-1/3">
                                        {t("INFO")}
                                      </td>
                                      <td className="py-1 w-2/3">
                                        <div className="relative inline-block">
                                          <button
                                            className="w-6 h-6 flex items-center justify-center"
                                            onTouchStart={() =>
                                              setHoveredIconId(idx)
                                            }
                                            onTouchEnd={() =>
                                              setHoveredIconId(null)
                                            }
                                            onMouseEnter={() =>
                                              setHoveredIconId(idx)
                                            }
                                            onMouseLeave={() =>
                                              setHoveredIconId(null)
                                            }
                                          >
                                            <FiInfo
                                              className="text-[#334155]"
                                              size={14}
                                            />
                                          </button>
                                          {hoveredIconId === idx && (
                                            <div className="absolute bottom-full left-0 mb-2 p-2 bg-[#3A3A3A] text-white text-center text-sm rounded-md w-48 z-10">
                                              {t(
                                                "LOGIN_TO_THE_PORTAL_TO_MAKE_THE_ONLINE_PAYMENT"
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            ))}
                          </div>

                          {totalTasks > tasksPerPage && (
                            <Pagination
                              currentStartIndex={
                                currentTaskPage * tasksPerPage + 1
                              }
                              totalItems={totalTasks}
                              itemsPerPage={tasksPerPage}
                              onPrevPage={() => {
                                const newPage = Math.max(
                                  0,
                                  currentTaskPage - 1
                                );
                                setCurrentTaskPage(newPage);
                                fetchPaymentTasks(newPage);
                              }}
                              onNextPage={() => {
                                const newPage = Math.min(
                                  Math.ceil(totalTasks / tasksPerPage) - 1,
                                  currentTaskPage + 1
                                );
                                setCurrentTaskPage(newPage);
                                fetchPaymentTasks(newPage);
                              }}
                              isFirstPage={currentTaskPage === 0}
                              isLastPage={
                                currentTaskPage >=
                                Math.ceil(totalTasks / tasksPerPage) - 1
                              }
                            />
                          )}
                        </>
                      ) : (
                        <div className="text-center py-4">
                          {t("NO_PAYMENT_TASKS_PENDING")}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default DetailedViewModal;
