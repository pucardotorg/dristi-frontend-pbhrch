import React, { useEffect, useState } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { svgIcons } from "../../data/svgIcons";
import { transformImpactGlance } from "../../TransformData/transformResponseData";
import { useMediaQuery } from "@mui/material";
import router from "next/router";

interface HighlightItemProps {
  value: string;
  label: string;
  isMobile?: boolean;
}

export interface DashboardMetricsNew {
  id: string;
  numberOfCasesFiled: number;
  numberOfCasesDisposed: number;
  daysToCaseRegistration: number;
  averageNumberOfDaysBetweenHearingsForCase: number;
}

const HighlightItem: React.FC<HighlightItemProps> = ({
  value,
  label,
  isMobile = false,
}) => (
  <div
    className={`flex flex-col items-center justify-center px-4 text-center  ${
      isMobile
        ? "gap-[5px]"
        : "gap-[clamp(11.23px,calc(11.23px+((17.44-11.23)*((100vw-1200px)/662))),17.44px)] py-[clamp(23.99px,calc(23.99px+((36-23.99)*((100vw-1200px)/662))),36px)] border-r border-[#E2E8F0] last:border-r-0"
    }`}
  >
    <span
      className={`text-center tracking-[-2.409px] font-bold text-[#0F766E] font-noto ${
        isMobile
          ? "text-[48px] leading-[78.298px] "
          : "text-[clamp(46.55px,calc(46.55px+((72.275-46.55)*((100vw-1200px)/662))),72.275px)] leading-[clamp(50.43px,calc(50.43px+((78.298-50.43)*((100vw-1200px)/662))),78.298px)]"
      }`}
    >
      {value || "\u00A0"}
    </span>
    <span
      className={`text-center text-[#0F172A] font-roboto font-[500] tracking-[-0.2px] ${
        isMobile
          ? "text-[20px] leading-[24px]"
          : "text-[clamp(16.75px,calc(16.75px+((26-16.75)*((100vw-1200px)/662))),26px)] leading-[clamp(19.33px,calc(19.33px+((30-19.33)*((100vw-1200px)/662))),30px)]"
      }`}
    >
      {label}
    </span>
  </div>
);

const Highlights: React.FC = () => {
  const { t } = useSafeTranslation();
  const [stats, setStats] = useState<DashboardMetricsNew>();
  const [lastUpdated, setLastUpdated] = useState<Date>(getLastUpdateTime());
  const isMobile = useMediaQuery("(max-width: 640px)");
  const tenantId = localStorage.getItem("tenant-id");

  // Function to determine last update time (either today at 5PM or yesterday at 5PM)
  function getLastUpdateTime(): Date {
    const now = new Date();
    const today = new Date(now);
    today.setHours(17, 0, 0, 0); // Set to 5:00:00.000 PM today

    // If current time is before 5PM, use yesterday's date at 5PM
    if (now.getHours() < 17) {
      today.setDate(today.getDate() - 1);
    }

    return today;
  }

  const fetchImpactGlance = async () => {
    try {
      const res = await fetch(`/api/impactGlance?tenantId=${tenantId}`);
      const data = await res.json();

      const transformed = transformImpactGlance(data);
      setStats(transformed?.stats || []);
      setLastUpdated(getLastUpdateTime());
    } catch (error) {
      console.error("Failed to fetch Whats New data", error);
    }
  };

  const calculateTimeUntilRefresh = () => {
    const now = new Date();
    const targetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      17,
      0,
      45,
    );

    // If current time is past today's target time, set target to tomorrow
    if (now > targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    return targetTime.getTime() - now.getTime();
  };

  useEffect(() => {
    // Initial fetch
    fetchImpactGlance();

    // Set up refresh timer
    const timeUntilRefresh = calculateTimeUntilRefresh();
    console.log(
      `[Highlights] Setting refresh timer for ${timeUntilRefresh}ms (${new Date(Date.now() + timeUntilRefresh).toLocaleString()})`,
    );

    const refreshTimer = setTimeout(() => {
      fetchImpactGlance();
      // After the refresh, set up the next day's timer
      const nextDayTimer = setTimeout(() => {
        window.location.reload(); // Force a full reload to reset all timers
      }, calculateTimeUntilRefresh());
      return () => clearTimeout(nextDayTimer);
    }, timeUntilRefresh);

    return () => clearTimeout(refreshTimer);
  }, []);

  const highlights = [
    {
      value: stats?.numberOfCasesFiled?.toString() || "",
      label: t("CASES_FILED"),
    },
    {
      value: stats?.numberOfCasesDisposed?.toString() || "",
      label: t("CASES_DISPOSED"),
    },
    {
      value: stats?.averageNumberOfDaysBetweenHearingsForCase?.toString() || "",
      label: t("DAYS_TO_NEXT_HEARING"),
    },
  ];

  return (
    <section
      className={`w-full bg-white ${isMobile ? "py-4" : "py-[clamp(41.3px,calc(41.3px+((64-41.3)*((100vw-1200px)/662))),64px)]"}`}
    >
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="relative flex flex-col items-center ${isMobile ? 'mb-8' : 'mb-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)]'}">
          <h2
            className={`px-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] pb-2 font-libre font-normal tracking-normal text-center align-middle text-[#3A3A3A] border-b border-[#CBD5E1] ${isMobile ? "text-[32px] leading-[40px] w-[90%]" : "text-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)] leading-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)]"}`}
          >
            {t("HIGHLIGHTS")}
          </h2>
          <div
            className={`absolute ${isMobile ? "bottom-[-24px] text-center w-full" : "top-0 right-0"}`}
          >
            <span
              style={{
                color: "#2563EB",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {`${t("LAST_UPDATED_ON")} ${lastUpdated.toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric" })}, 5:00 PM`}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)]">
          {highlights.map((item, index) => (
            <HighlightItem
              key={index}
              value={item.value}
              label={item.label}
              isMobile={isMobile}
            />
          ))}
        </div>
        <div
          className={`flex justify-center ${isMobile ? "mt-6" : "mt-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)]"}`}
        >
          <button
            className={`flex flex-row items-center justify-center px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] ${isMobile ? "gap-[12px]" : "gap-[clamp(7.73px,calc(7.73px+((12-7.73)*((100vw-1200px)/662))),12px)]"} bg-white border border-[#0F766E] rounded-[12px] ${isMobile ? "h-[40px]" : "h-[clamp(44.48px,calc(44.48px+((69-44.48)*((100vw-1200px)/662))),69px)]"}`}
            onClick={() => router.push("/dashboard")}
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
              {t("VIEW_DETAILED_DASHBOARD")}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Highlights;
