import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import Image from "next/image";
import { svgIcons } from "../../data/svgIcons";

// Types aligned with DisplayBoard
interface HearingItem {
  hearingNumber?: string;
  caseTitle?: string;
  advocate?: {
    complainant?: string[];
    accused?: string[];
  };
  hearingType?: string;
  status?: string;
  caseNumber?: string;
  serialNumber?: number;
}

// API response shape for /api/hearing
interface HearingResponse {
  openHearings?: HearingItem[];
}

export const getStatusStyle = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-pistachio text-darkGreen";
    case "SCHEDULED":
      return "bg-peach text-darkBrown";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getTopCardBackgroundColor = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-[#E4F2E4] border-[1.23px] border-[#E8E8E8]";
    case "SCHEDULED":
      return "bg-[#F4EFD7] border-[1.23px] border-[#E8E8E8]";
    default:
      return "bg-[#E8E8E8] border-[1.23px] border-[#CBD5E1]";
  }
};

const getTopCardStatusTextBackgroundColor = (
  index: number,
  status: string,
  inCompletedHearings: HearingItem[],
  key: string
) => {
  const info = { text: "", style: "" };

  // If current is IN_PROGRESS → always green
  if (status === "IN_PROGRESS") {
    info.style = " border-[#16A34A]";
    info.text = "IN_PROGRESS";
    return info[key];
  }

  // Default border for scheduled tags
  info.style = " border-[#C0A000]";

  // Scheduled cases: handle NEXT / UPCOMING
  if (status === "SCHEDULED") {
    if (index === 0) {
      info.text = "NEXT";
    } else {
      const prevStatus = inCompletedHearings?.[index - 1]?.status;
      if (prevStatus === "IN_PROGRESS") info.text = "NEXT";
      else if (prevStatus === "SCHEDULED") info.text = "UPCOMING";
      else info.text = status;
    }
    return info[key];
  }

  // fallback for any other status
  info.style = "border-[#CBD5E1]";
  info.text = status;
  return info[key];
};

function splitCaseTitle(title: string) {
  if (!title) return ["", ""];

  const parts = title.split(" vs ");

  return [parts[0] || "", parts[1] ? `vs ${parts[1]}` : ""];
}

const formattedDateDisplay = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

function getLocalISOString() {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000; // offset in ms
  const localISOTime = new Date(now.getTime() - tzOffset)
    .toISOString()
    .slice(0, -1); // remove trailing 'Z'
  return localISOTime;
}

function calculateLastRefreshDay(refreshedAt: string | number | Date): string {
  const refreshDate = new Date(refreshedAt);
  const today = new Date();

  // Normalize both to midnight for local comparison
  const refreshDay = new Date(
    refreshDate.getFullYear(),
    refreshDate.getMonth(),
    refreshDate.getDate()
  );
  const todayDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const diffInDays =
    (todayDay.getTime() - refreshDay.getTime()) / (1000 * 60 * 60 * 24);

  // Format time for display (local)
  let hours = refreshDate.getHours();
  const minutes = refreshDate.getMinutes().toString().padStart(2, "0");
  const seconds = refreshDate.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;

  if (diffInDays === 0) {
    return `Today at ${formattedTime}`;
  } else if (diffInDays === 1) {
    return `Yesterday at ${formattedTime}`;
  } else {
    const dd = String(refreshDate.getDate()).padStart(2, "0");
    const mm = String(refreshDate.getMonth() + 1).padStart(2, "0");
    const yyyy = refreshDate.getFullYear();
    return `on ${dd}/${mm}/${yyyy} at ${formattedTime}`;
  }
}

const computeAutoDate = () => {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  if (hour > 17 || (hour === 17 && minutes >= 0)) {
    now.setDate(now.getDate() + 1);
  }
  return now.toISOString().split("T")[0];
};

export default function LiveCauselist() {
  const { t } = useSafeTranslation();
  // Configurable single interval (in ms) used for both fetching and pagination rotation
  const defaultUpdateInterval = 5000; // 5 seconds

  // Selected date: auto (no date selector)
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    computeAutoDate()
  );

  // Two datasets: status-sorted for top cards, index-sorted for paginated table
  const [sortedHearingsData, setSortedHearingsData] = useState<HearingItem[]>(
    []
  );
  const [indexedHearingsData, setIndexedHearingsData] = useState<HearingItem[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshedAt, setRefreshedAt] = useState<string>(getLocalISOString());
  const [updateInterval, setUpdateInterval] = useState(defaultUpdateInterval);

  // Pagination for bottom section (10 per page after the top 4)
  const [currentPage, setCurrentPage] = useState(0); // 0-based for the bottom pages

  const tenantId = useMemo(() => localStorage.getItem("tenant-id"), []);

  const getRefreshInterval = useCallback(async () => {
    try {
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
              tenantId: tenantId,
              moduleDetails: [
                {
                  moduleName: "LandingPage",
                  masterDetails: [{ name: "LiveCauseListRefetchTimeInterval" }],
                },
              ],
            },
            RequestInfo: {
              apiId: "Rainmaker",
              msgId: `${Date.now()}|en_IN`,
            },
          }),
        }
      );
      const data = await response.json();
      const refreshInterval =
        data?.MdmsRes?.["LandingPage"]?.LiveCauseListRefetchTimeInterval?.[0]
          ?.timeInSecs;
      if (Boolean(refreshInterval)) {
        setUpdateInterval(refreshInterval * 1000);
      }
    } catch (error) {
      console.error("Error fetching court options:", error);
    }
  }, [tenantId]);

  useEffect(() => {
    getRefreshInterval();
  }, []);

  // Core fetcher with toggle for serial-number sorting
  const fetchHearings = useCallback(
    async (dateStr: string, isHearingSerialNumberSorting: boolean) => {
      const fromDate = new Date(dateStr).setHours(0, 0, 0, 0);
      const toDate = new Date(dateStr).setHours(23, 59, 59, 999);

      const payload = {
        tenantId,
        fromDate,
        toDate,
        searchText: "",
        isHearingSerialNumberSorting,
      };

      try {
        const response = await fetch("/api/hearing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          // Swallow error and return empty to avoid breaking the UI
          const text = await response.text().catch(() => "");
          console.warn("/api/hearing non-OK:", response.status, text);
          return [] as HearingItem[];
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await response.text().catch(() => "");
          console.warn(
            "/api/hearing unexpected content-type:",
            contentType,
            text
          );
          return [] as HearingItem[];
        }

        const data: HearingResponse = await response.json().catch((e) => {
          console.warn("/api/hearing JSON parse failed:", e);
          return { openHearings: [] } as HearingResponse;
        });
        const hearings: HearingItem[] = data?.openHearings || [];
        return hearings;
      } catch (err) {
        // Network or other failures — return empty to keep UI stable
        console.warn("/api/hearing request failed:", err);
        return [] as HearingItem[];
      }
    },
    [tenantId]
  );

  // Fetch both datasets together
  const fetchBothForDate = useCallback(
    async (dateStr: string) => {
      try {
        setLoading(true);
        // Run both calls in parallel and tolerate one failing
        const results = await Promise.allSettled([
          fetchHearings(dateStr, false),
          fetchHearings(dateStr, true),
        ]);

        const sorted =
          results[0].status === "fulfilled"
            ? results[0].value
            : ([] as HearingItem[]);
        const indexed =
          results[1].status === "fulfilled"
            ? results[1].value
            : ([] as HearingItem[]);

        // Update state only if we have something, else keep previous to avoid flicker
        if (sorted.length > 0) setSortedHearingsData(sorted);
        if (indexed.length > 0) setIndexedHearingsData(indexed);

        // Manage error state: only set when both are empty
        if (sorted.length === 0 && indexed.length === 0) {
          setError("SOMETHING_WENT_WRONG_TRY_LATER_OR_REFRESH");
        } else {
          setError("");
        }

        return { sorted, indexed };
      } catch (err) {
        console.warn("Error in fetchBothForDate:", err);
        // Keep old data, set error state
        setError("SOMETHING_WENT_WRONG_TRY_LATER_OR_REFRESH");
        return { sorted: [] as HearingItem[], indexed: [] as HearingItem[] };
      } finally {
        setRefreshedAt(getLocalISOString());
        setLoading(false);
      }
    },
    [fetchHearings]
  );

  useEffect(() => {
    fetchBothForDate(selectedDate);
  }, [fetchBothForDate, selectedDate]);

  // Auto refresh: mimic DisplayBoard rules but without date picker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let timeoutToStart: NodeJS.Timeout | null = null;
    let timeoutToNextDay: NodeJS.Timeout | null = null;

    const startAutoRefresh = () => {
      interval = setInterval(async () => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const endMinutes = 17 * 60; // 5 PM
        const isPastFivePM = currentMinutes >= endMinutes;

        try {
          const { sorted } = await fetchBothForDate(selectedDate);
          const stillHasPending = sorted?.some((h) => h.status !== "COMPLETED");

          // stop auto-refresh if past 5 PM or all completed
          if (isPastFivePM || !stillHasPending) {
            if (interval) {
              clearInterval(interval);
              interval = null;
            }

            // if it's past 5:02:00 PM, schedule data fetch for next-day
            if (isPastFivePM) scheduleNextDayFetch();
          }
        } catch (e) {
          console.error("Auto refresh API error:", e);
        }
      }, updateInterval);
    };

    const triggerNextDayFetch = async () => {
      const now = new Date();
      now.setDate(now.getDate() + 1);
      const updatedSelectedDate = now.toISOString().split("T")[0];
      setSelectedDate(updatedSelectedDate);
      await fetchBothForDate(updatedSelectedDate);
    };

    const scheduleNextDayFetch = () => {
      const now = new Date();

      // Target = today 5:02:00 PM
      const target = new Date(now);
      target.setHours(17, 2, 0, 0);

      const diffMs = target.getTime() - now.getTime();

      // If it's already past 5:02:00 PM, do nothing (or could fetch by hard refresh if desired)
      if (diffMs <= 0) return;

      timeoutToNextDay = setTimeout(() => {
        triggerNextDayFetch();
      }, diffMs);
    };

    const init = () => {
      const now = new Date();
      const currentDateStr = now.toISOString().split("T")[0];
      const isToday = selectedDate === currentDateStr;
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const startMinutes = 11 * 60; // 11 AM
      const endMinutes = 17 * 60; // 5 PM

      const shouldStart = () =>
        sortedHearingsData?.some((h) => h.status !== "COMPLETED");

      // Only auto-refresh for today
      if (!isToday) return;

      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        if (shouldStart() || Boolean(error)) startAutoRefresh();
      } else if (
        currentMinutes < startMinutes &&
        (sortedHearingsData?.length > 0 || Boolean(error))
      ) {
        const diffMs = (startMinutes - currentMinutes) * 60 * 1000;
        timeoutToStart = setTimeout(() => startAutoRefresh(), diffMs);
      }
      scheduleNextDayFetch();
    };

    init();

    return () => {
      if (interval) clearInterval(interval);
      if (timeoutToStart) clearTimeout(timeoutToStart);
      if (timeoutToNextDay) clearTimeout(timeoutToNextDay);
    };
  }, [selectedDate, fetchBothForDate, sortedHearingsData, error]);

  // Page rotation for bottom list (uses the same updateInterval)
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentPage((prev) => {
        const total = Math.max(
          1,
          Math.ceil(Math.max(0, sortedHearingsData.length) / 10)
        );
        return total <= 1 ? 0 : (prev + 1) % total;
      });
    }, updateInterval);

    return () => clearInterval(id);
  }, [sortedHearingsData.length]);

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(Math.max(0, sortedHearingsData.length) / 10)
    );
    setCurrentPage((p) => (p >= totalPages ? totalPages - 1 : p));
  }, [sortedHearingsData.length]);

  // only show top 4 in progress and scheduled and passed over hearings.
  const inCompletedHearings = sortedHearingsData
    .slice(0, 4)
    .filter((h) =>
      ["IN_PROGRESS", "SCHEDULED", "PASSED_OVER"].includes(h?.status || "")
    );
  const totalBottomPages = Math.max(
    1,
    Math.ceil(Math.max(0, sortedHearingsData.length) / 10)
  );
  const pageStart = currentPage * 10;
  const currentTableData = indexedHearingsData.slice(pageStart, pageStart + 10);

  const TopCard: React.FC<{ item: HearingItem; index: number }> = ({
    item,
    index,
  }) => {
    const [line1, line2] = splitCaseTitle(item.caseTitle || "");
    return (
      <div
        className={`flex font-roboto rounded-[4px] border border-[#E8E8E8] px-[clamp(8.59px,calc(8.59px+((16-8.59)*((100vw-1000px)/862))),16px)] py-[clamp(8.59px,calc(8.59px+((16-8.59)*((100vw-1000px)/862))),16px)] gap-[clamp(4.30px,calc(4.30px+((8-4.30)*((100vw-1000px)/862))),8px)] max-w-full overflow-hidden ${getTopCardBackgroundColor(item.status || "")}`}
      >
        <div className="text-[clamp(11.82px,calc(11.82px+((22-11.82)*((100vw-1000px)/862))),22px)] leading-[clamp(11.82px,calc(11.82px+((22-11.82)*((100vw-1000px)/862))),22px)] font-medium text-[#0A0A0A]">
          <span>{item?.serialNumber || ""}.</span>
        </div>
        <div className="flex flex-col justify-between items-start gap-auto w-[95%]">
          {/* Case name section */}
          <div className="flex flex-col w-[100%] gap-[clamp(3.22px,calc(3.22px+((6-3.22)*((100vw-1000px)/862))),6px)]">
            <span className="font-medium mr-1 text-[clamp(7.52px,calc(7.52px+((14-7.52)*((100vw-1000px)/862))),14px)] leading-[clamp(8.59px,calc(8.59px+((16-8.59)*((100vw-1000px)/862))),16px)] text-[#77787B]">
              {t("CASE_NAME")}
            </span>
            <div className="">
              <span className="leading-[clamp(13.96px,calc(13.96px+((26-13.96)*((100vw-1000px)/862))),26px)] font-bold text-[clamp(11.82px,calc(11.82px+((22-11.82)*((100vw-1000px)/862))),22px)] text-[#0A0A0A] block w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {line1}
              </span>
              <span className="leading-[clamp(13.96px,calc(13.96px+((26-13.96)*((100vw-1000px)/862))),26px)] font-bold text-[clamp(11.82px,calc(11.82px+((22-11.82)*((100vw-1000px)/862))),22px)] text-[#0A0A0A] block w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {line2}
              </span>
            </div>
          </div>

          {/* Case number section */}
          <div className="flex flex-col w-[100%] gap-[clamp(3.22px,calc(3.22px+((6-3.22)*((100vw-1000px)/862))),6px)]">
            <span className="font-medium mr-1 text-[clamp(7.52px,calc(7.52px+((14-7.52)*((100vw-1000px)/862))),14px)] leading-[clamp(8.59px,calc(8.59px+((16-8.59)*((100vw-1000px)/862))),16px)] text-[#77787B]">
              {t("CASE_NUMBER")}
            </span>
            <div className="leading-[clamp(13.96px,calc(13.96px+((26-13.96)*((100vw-1000px)/862))),26px)] flex items-center justify-between flex-wrap">
              <span className="font-bold text-[clamp(11.82px,calc(11.82px+((22-11.82)*((100vw-1000px)/862))),22px)] text-[#0A0A0A]">
                {item.caseNumber || "-"}
              </span>
              <span
                className={`px-[clamp(8.59px,calc(8.59px+((16-8.59)*((100vw-1000px)/862))),16px)] rounded-full text-[clamp(10.20px,calc(10.20px+((19-10.20)*((100vw-1000px)/862))),19px)] font-medium bg-[#F7F5F3] border-[0.61px] ${getTopCardStatusTextBackgroundColor(index, item.status || "", inCompletedHearings, "style")}`}
              >
                {t(
                  getTopCardStatusTextBackgroundColor(
                    index,
                    item.status || "",
                    inCompletedHearings,
                    "text"
                  )
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Row: React.FC<{
    item: HearingItem;
    serial: number;
  }> = ({ item, serial }) => {
    const isScheduled = item?.status === "SCHEDULED";
    const isInProgress = item?.status === "IN_PROGRESS";
    const statusStyle = `${isInProgress ? "text-[#15803D]" : isScheduled ? "text-[#9E400A]" : "text-black"}`;

    return (
      <div
        className={`grid grid-cols-[clamp(32.22px,calc(32.22px+((60-32.22)*((100vw-1000px)/862))),60px)_1.2fr_4fr_0.8fr] font-roboto font-medium items-left text-[clamp(11.82px,calc(11.82px+((22-11.82)*((100vw-1000px)/862))),22px)] h-full`}
      >
        <div
          className={`pl-[clamp(7.90px,calc(7.90px+((14.7-7.90)*((100vw-1000px)/862))),14.7px)] h-full flex items-center bg-[#F7F5F3]`}
        >
          {serial}.
        </div>
        <div
          className={`pl-[clamp(7.90px,calc(7.90px+((14.7-7.90)*((100vw-1000px)/862))),14.7px)] h-full flex items-center border-l-[2px] border-[#CBD5E1] border-opacity-60 bg-[#F7F5F3]`}
        >
          {item.caseNumber || "-"}
        </div>
        <div
          className={`pl-[clamp(7.90px,calc(7.90px+((14.7-7.90)*((100vw-1000px)/862))),14.7px)] h-full flex items-center border-l-[2px] border-[#CBD5E1] border-opacity-60 max-w-full overflow-hidden bg-[#F7F5F3]`}
        >
          <span className="truncate block max-w-[99%]">
            {item.caseTitle || "-"}
          </span>
        </div>
        <div
          className={`h-full flex items-center justify-left border-l-[2px] border-[#CBD5E1] border-opacity-60 bg-[#F7F5F3]`}
        >
          <span
            className={`pl-[clamp(7.90px,calc(7.90px+((14.7-7.90)*((100vw-1000px)/862))),14.7px)] py-[clamp(2.15px,calc(2.15px+((4-2.15)*((100vw-1000px)/862))),4px)] rounded-full ${statusStyle}`}
          >
            {`${item?.status === "SCHEDULED" ? t("UPCOMING") : t(item.status || "")}`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col max-w-full mx-auto px-[clamp(8.59px,calc(8.59px+((16-8.59)*((100vw-1000px)/862))),16px)] py-[clamp(8.59px,calc(8.59px+((16-8.59)*((100vw-1000px)/862))),16px)] bg-white">
      <header className="w-full h-[clamp(39.24px,calc(39.24px+((73-39.24)*((100vw-1000px)/862))),73px)] flex justify-between items-center  top-0 left-0 right-0 bg-white z-50">
        <div className="flex items-center gap-[clamp(8.59px,calc(8.59px+((16-8.59)*((100vw-1000px)/862))),16px)]">
          <Image
            src="/images/emblem.png"
            alt={t("EMBLEM")}
            width={123}
            height={73}
            className="h-[clamp(29.41px,calc(29.41px+((54.73-29.41)*((100vw-1000px)/862))),54.73px)] w-[clamp(17.72px,calc(17.72px+((33-17.72)*((100vw-1000px)/862))),33px)]"
          />
          <Image
            src="/images/logo.png"
            alt={t("ONCOURTS_LOGO")}
            width={123}
            height={73}
            className="h-[clamp(29.41px,calc(29.41px+((54.73-29.41)*((100vw-1000px)/862))),54.73px)] w-[clamp(48.87px,calc(48.87px+((91-48.87)*((100vw-1000px)/862))),91px)]"
          />
        </div>
        {/* Date + case schedule */}
        {
          <div className="flex items-center justify-between mb-0">
            <div className="flex items-center gap-[clamp(4.30px,calc(4.30px+((8-4.30)*((100vw-1000px)/862))),8px)]">
              <span className="">
                <svgIcons.RefreshIcon2 />
              </span>
              <span className="font-roboto italic font-medium text-[clamp(12.89px,calc(12.89px+((24-12.89)*((100vw-1000px)/862))),24px)]">{`${t("Last refreshed")} ${calculateLastRefreshDay(refreshedAt)}`}</span>
            </div>
          </div>
        }
      </header>

      {/* Date + case schedule */}
      <div className="flex items-center justify-center mb-[clamp(6.45px,calc(6.45px+((12-6.45)*((100vw-1000px)/862))),12px)] border-b-[2.45px] border-[#F7F5F3] ">
        <div className="flex items-center gap-[clamp(8.59px,calc(8.59px+((16-8.59)*((100vw-1000px)/862))),16px)] text-[#007E7E] leading-[clamp(21.08px,calc(21.08px+((39.22-21.08)*((100vw-1000px)/862))),39.22px)] pb-[clamp(4.30px,calc(4.30px+((8-4.30)*((100vw-1000px)/862))),8px)]">
          <h2 className="text-left text-[clamp(21.08px,calc(21.08px+((39.22-21.08)*((100vw-1000px)/862))),39.22px)]  font-roboto font-medium">
            {t("24X7_ON_COURTS_CAUSELIST")}
          </h2>
          <span className="text-[clamp(13.96px,calc(13.96px+((26-13.96)*((100vw-1000px)/862))),26px)] font-roboto font-bold">
            |
          </span>
          <span className="text-[clamp(21.08px,calc(21.08px+((39.22-21.08)*((100vw-1000px)/862))),39.22px)] font-roboto font-medium">
            {formattedDateDisplay(selectedDate)}
          </span>
        </div>
      </div>
      {sortedHearingsData.length === 0 && loading && (
        <div className="flex justify-center items-center text-[#DC2626] font-roboto font-medium text-[clamp(9.67px,calc(9.67px+((18-9.67)*((100vw-1000px)/862))),18px)]">
          {t("COMMON_LOADING")}
        </div>
      )}
      {sortedHearingsData.length === 0 && !loading && (
        <div className="flex flex-1 h-full min-h-0 justify-center items-center">
          <div className="flex flex-col justify-center items-center font-roboto font-medium text-[clamp(23.63px,calc(23.63px+((44-23.63)*((100vw-1000px)/862))),44px)] h-full w-full">
            {t("NO_HEARINGS_SCHEDULED_FOR_THE_DAY")}
          </div>
        </div>
      )}
      {sortedHearingsData.length > 0 && (
        <div className="grid grid-cols-[30%_1fr] gap-[clamp(12.89px,calc(12.89px+((24-12.89)*((100vw-1000px)/862))),24px)] flex-1 min-h-0">
          {/*cards */}
          {sortedHearingsData?.length > 0 && inCompletedHearings.length > 0 && (
            <div
              className={`grid gap-[clamp(8.59px,calc(8.59px+((16-8.59)*((100vw-1000px)/862))),16px)] grid-rows-4 pr-[clamp(8.59px,calc(8.59px+((16-8.59)*((100vw-1000px)/862))),16px)] mb-[clamp(8.59px,calc(8.59px+((16-8.59)*((100vw-1000px)/862))),16px)] border-r-[1px] border-[#E8E8E8]`}
            >
              {inCompletedHearings.map((item, idx) => (
                <TopCard
                  key={`${item.caseNumber}-${idx}`}
                  item={item}
                  index={idx}
                />
              ))}
            </div>
          )}
          {sortedHearingsData?.length > 0 &&
            inCompletedHearings.length === 0 && (
              <div className="flex justify-center text-center items-center text-black font-roboto font-medium text-[clamp(19.34px,calc(19.34px+((36-19.34)*((100vw-1000px)/862))),36px)] px-[clamp(8.59px,calc(8.59px+((16-8.59)*((100vw-1000px)/862))),16px)] mb-[clamp(8.59px,calc(8.59px+((16-8.59)*((100vw-1000px)/862))),16px)] border-r-[1px] border-[#E8E8E8]">
                {t("ALL_HEARINGS_FOR_THE_DAY_HAVE_BEEN_COMPLETED")}
              </div>
            )}

          {/* table*/}
          {currentTableData?.length > 0 && (
            // Table container fills remaining height, header + rows (flex-1) + footer
            <div className="rounded flex flex-col flex-1 h-full min-h-0">
              {/* headers for both columns */}
              <div
                className="grid grid-cols-1 gap-x-[clamp(10.53px,calc(10.53px+((19.61-10.53)*((100vw-1000px)/862))),19.61px)] text-[#0A0A0A] font-roboto font-medium text-[clamp(12.89px,calc(12.89px+((24-12.89)*((100vw-1000px)/862))),24px)]"
                style={{ position: "sticky", top: 0 }}
              >
                <div className="grid grid-cols-[clamp(32.22px,calc(32.22px+((60-32.22)*((100vw-1000px)/862))),60px)_1.2fr_4fr_0.8fr] items-center mb-[clamp(2.69px,calc(2.69px+((5-2.69)*((100vw-1000px)/862))),5px)]">
                  <span className=" py-[clamp(4.30px,calc(4.30px+((8-4.30)*((100vw-1000px)/862))),8px)] pl-[clamp(2.69px,calc(2.69px+((5-2.69)*((100vw-1000px)/862))),5px)]">
                    {t("S_NO")}
                  </span>
                  <span className=" py-[clamp(4.30px,calc(4.30px+((8-4.30)*((100vw-1000px)/862))),8px)] pl-[clamp(7.89px,calc(7.89px+((14.7-7.89)*((100vw-1000px)/862))),14.7px)] border-l-[0.61px] border-[#CBD5E1] border-opacity-40 truncate">
                    {t("CASE_NUMBER")}
                  </span>
                  <span className=" py-[clamp(4.30px,calc(4.30px+((8-4.30)*((100vw-1000px)/862))),8px)] pl-[clamp(7.89px,calc(7.89px+((14.7-7.89)*((100vw-1000px)/862))),14.7px)] border-l-[0.61px] border-[#CBD5E1] border-opacity-40">
                    {t("CASE_NAME")}
                  </span>
                  <span className=" py-[clamp(4.30px,calc(4.30px+((8-4.30)*((100vw-1000px)/862))),8px)] pl-[clamp(7.89px,calc(7.89px+((14.7-7.89)*((100vw-1000px)/862))),14.7px)] border-l-[0.61px] border-[#CBD5E1] border-opacity-40">
                    {t("HEARING_STATUS")}
                  </span>
                </div>
              </div>

              {/* Rows area consumes all available height and is split into 10 equal rows */}
              <div className="flex-1 min-h-0">
                <div className="grid grid-rows-10 h-full gap-y-[clamp(2.69px,calc(2.69px+((5-2.69)*((100vw-1000px)/862))),5px)]">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const item = currentTableData[i];
                    const serial = item?.serialNumber ?? pageStart + i + 1;
                    if (item) {
                      return (
                        <div key={`row-${i}`} className="h-full">
                          <Row item={item} serial={serial} />
                        </div>
                      );
                    }
                    // Placeholder: keep equal height even when fewer rows
                    return <div key={i} className="h-full" />;
                  })}
                </div>
              </div>

              {/* Footer page indicator */}
              <div className="flex items-center gap-[clamp(8.59px,calc(8.59px+((16-8.59)*((100vw-1000px)/862))),16px)] pt-[clamp(6.45px,calc(6.45px+((12-6.45)*((100vw-1000px)/862))),12px)] font-roboto text-[clamp(9.67px,calc(9.67px+((18-9.67)*((100vw-1000px)/862))),18px)]">
                <span className="h-px bg-[#E8E8E8] flex-1" aria-hidden="true" />
                <span className="whitespace-nowrap font-medium">
                  {t("PAGE")} {totalBottomPages === 0 ? 0 : currentPage + 1} :{" "}
                  {indexedHearingsData.length === 0 ? 0 : pageStart + 1}-
                  {Math.min(
                    pageStart + currentTableData.length,
                    indexedHearingsData.length
                  )}{" "}
                  {t("OF")} {indexedHearingsData.length}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
