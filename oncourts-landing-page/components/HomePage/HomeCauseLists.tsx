import React, { useEffect, useState, useCallback } from "react";
import { format, subDays, addDays } from "date-fns";
import CauseListDisplay from "./CauseListDisplay";
import { svgIcons } from "../../data/svgIcons";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { useMediaQuery } from "@mui/material";
import Tooltip from "../common/Tooltip";
import router from "next/router";

interface CauseListState {
  date: string;
  pdfUrl: string | null;
}

function HomeCauseLists(): JSX.Element {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [showTooltip, setShowTooltip] = useState(false);
  const [leftCauseList, setLeftCauseList] = useState<CauseListState | null>(
    null,
  );
  const [rightCauseList, setRightCauseList] = useState<CauseListState | null>(
    null,
  );
  const tenantId = localStorage.getItem("tenant-id") || "kl";
  const { t } = useSafeTranslation();

  const fetchPdf = useCallback(
    async (date: string): Promise<string | null> => {
      try {
        const response = await fetch("api/_download", {
          method: "POST",
          headers: {
            Accept: "application/json,text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tenantId,
            Criteria: {
              courtId: "KLKM52",
              searchDate: date,
            },
          }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          console.error("Error fetching PDF:", error);
          return null;
        }

        if (response.status === 200) {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        }
        return null;
      } catch (error) {
        console.error("Error fetching PDF:", error);
        return null;
      }
    },
    [tenantId],
  );

  const downloadPdf = useCallback(
    async (date: string) => {
      try {
        const response = await fetch("api/_download", {
          method: "POST",
          headers: {
            Accept: "application/json,text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tenantId,
            Criteria: {
              courtId: "KLKM52",
              searchDate: date,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to download PDF");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${format(new Date(date), "dd-MM-yyyy")}_causelist.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading PDF:", error);
        alert("Failed to download cause list");
      }
    },
    [tenantId],
  );

  const updateCauseLists = useCallback(async () => {
    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    const isPastFivePM = now.getHours() >= 17;

    let leftDate: string;
    let rightDate: string;

    if (isPastFivePM) {
      leftDate = today;
      rightDate = format(addDays(now, 1), "yyyy-MM-dd");
    } else {
      leftDate = format(subDays(now, 1), "yyyy-MM-dd");
      rightDate = today;
    }

    const [leftPdfUrl, rightPdfUrl] = await Promise.all([
      fetchPdf(leftDate),
      fetchPdf(rightDate),
    ]);

    setLeftCauseList({ date: leftDate, pdfUrl: leftPdfUrl });
    setRightCauseList({ date: rightDate, pdfUrl: rightPdfUrl });
  }, [fetchPdf]);

  const calculateTimeUntilRefresh = useCallback(() => {
    const now = new Date();
    const targetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      17, // Hours (17:00)
      0, // Minutes
      45, // Seconds
    );

    // If current time is past today's target time, set target to tomorrow
    if (now > targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    return targetTime.getTime() - now.getTime();
  }, []);

  useEffect(() => {
    // Initial fetch
    updateCauseLists();

    // Set up refresh timer
    const timeUntilRefresh = calculateTimeUntilRefresh();
    console.log(
      `Setting refresh timer for ${timeUntilRefresh}ms (${new Date(Date.now() + timeUntilRefresh).toLocaleString()})`,
    );

    const refreshTimer = setTimeout(() => {
      updateCauseLists();
      // After the refresh, set up the next day's timer
      const nextDayTimer = setTimeout(() => {
        window.location.reload(); // Force a full reload to reset all timers
      }, calculateTimeUntilRefresh());
      return () => clearTimeout(nextDayTimer);
    }, timeUntilRefresh);

    return () => clearTimeout(refreshTimer);
  }, [updateCauseLists, calculateTimeUntilRefresh]);

  // Cleanup effect for object URLs
  useEffect(() => {
    return () => {
      if (leftCauseList?.pdfUrl) URL.revokeObjectURL(leftCauseList.pdfUrl);
      if (rightCauseList?.pdfUrl) URL.revokeObjectURL(rightCauseList.pdfUrl);
    };
  }, [leftCauseList?.pdfUrl, rightCauseList?.pdfUrl]);

  return (
    <div className="py-[clamp(24.77px,calc(24.77px+((48-24.77)*((100vw-1200px)/662))),48px)] bg-[#F0FDFA]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)]">
        <div className="flex mb-[clamp(15.47px,calc(15.47px+((48-15.47)*((100vw-1200px)/662))),48px)] items-center justify-center">
          <h2
            className={`px-[clamp(18.75px,calc(18.75px+((30-18.75)*((100vw-1200px)/662))),30px)] pb-2 text-center font-libre font-normal  text-[#3A3A3A] border-b border-[#CBD5E1] ${isMobile ? "text-[32px] leading-[40px] w-[90%]" : "text-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)] leading-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)]"}`}
            style={
              {
                WebkitTextStrokeWidth: "0.5px",
              } as React.CSSProperties
            }
          >
            {t("CAUSE_LIST_TITLE")}
          </h2>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-[clamp(38.67px,calc(38.67px+((60-38.67)*((100vw-1200px)/662))),60px)]">
          {leftCauseList && (
            <CauseListDisplay
              date={leftCauseList.date}
              pdfUrl={leftCauseList.pdfUrl}
              onDownload={() => downloadPdf(leftCauseList.date)}
              t={t}
            />
          )}
          {rightCauseList && (
            <CauseListDisplay
              date={rightCauseList.date}
              pdfUrl={rightCauseList.pdfUrl}
              onDownload={() => downloadPdf(rightCauseList.date)}
              t={t}
            />
          )}
        </div>
        <div className="flex items-center justify-center mt-8 gap-[clamp(1.29px,calc(1.29px+((8-1.29)*((100vw-1200px)/662))),8px)]">
          {isMobile ? (
            <svgIcons.InfoIcon width="64" />
          ) : (
            <div className="w-[clamp(21.93px,calc(21.93px+((34-21.93)*((100vw-1200px)/662))),34px)] h-auto">
              <svgIcons.InfoIcon width="100%" />
            </div>
          )}
          <p
            className={`font-roboto font-normal tracking-[-0.2px] text-[#334155] ${isMobile ? "text-[15px] leading-[22px]" : "text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] leading-[clamp(16.76px,calc(16.76px+((26-16.76)*((100vw-1200px)/662))),26px)]"}`}
          >
            {t("CAUSE_LIST_INFO")}
            <strong>{t("CAUSE_LIST_INFO_TIME")}</strong>
          </p>
        </div>
        <div className="flex justify-center mt-8">
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <button
              className={`flex flex-row items-center justify-center px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] ${isMobile ? "gap-[12px]" : "gap-[clamp(7.73px,calc(7.73px+((12-7.73)*((100vw-1200px)/662))),12px)]"} bg-white border border-[#0F766E] rounded-[12px] ${isMobile ? "h-[40px]" : "h-[clamp(44.48px,calc(44.48px+((69-44.48)*((100vw-1200px)/662))),69px)]"}`}
              onClick={() => router.push("/display-board")}
            >
              {isMobile ? (
                <svgIcons.OpenInNewTabIcon width="16" />
              ) : (
                <div className="w-[clamp(19.32px,calc(19.32px+((30-19.32)*((100vw-1200px)/662))),30px)] h-auto">
                  <svgIcons.OpenInNewTabIcon width="100%" />
                </div>
              )}
              <span
                className={`font-roboto font-medium tracking-[-0.56px] text-center text-[#0F766E] ${isMobile ? "h-[24px] leading-[24px] text-[16px]" : "h-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] leading-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] text-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)]"}`}
              >
                {t("VIEW_CAUSE_LIST_DISPLAY")}
              </span>
            </button>
            {showTooltip && !isMobile && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[99999]">
                <Tooltip text={t("VIEW_CAUSE_LIST_DISPLAY_TOOLTIP")} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeCauseLists;
