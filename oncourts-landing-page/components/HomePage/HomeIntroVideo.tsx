import React, { useState } from "react";
import Image from "next/image";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { useRouter } from "next/router";
import { svgIcons } from "../../data/svgIcons";
import { APP_URLS } from "../../lib/config";
import Tooltip from "../common/Tooltip";
import { useMediaQuery } from "@mui/material";

const HomeIntroVideo = () => {
  const { t } = useSafeTranslation();
  const router = useRouter();
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCitizenTooltip, setShowCitizenTooltip] = useState(false);
  const [showEmployeeTooltip, setShowEmployeeTooltip] = useState(false);
  const [showSearchTooltip, setShowSearchTooltip] = useState(false);
  const [showCertifiedCopiesTooltip, setShowCertifiedCopiesTooltip] = useState(false);
  const videoId = "-JoWnkE-uTs";
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".login-dropdown")) {
        setLoginDropdownOpen(false);
      }
    };

    if (loginDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [loginDropdownOpen]);

  return (
    <div
      className="py-10 md:py-[clamp(51.6px,calc(51.6px+((64-51.6)*((100vw-1200px)/662))),64px)] bg-white"
      id="vision-section"
    >
      <div className="container mx-auto px-5 max-w-[95%]">
        <div className="flex flex-col md:flex-row gap-auto md:gap-[clamp(73.2px,calc(73.2px+((128-73.2)*((100vw-1200px)/662))),128px)] items-stretch">
          <div className="text-center md:text-left md:w-1/2 text-[20px] md:text-[clamp(20px,calc(20px+((22-20)*((100vw-1200px)/662))),22px)] font-normal text-[#334155]">
            <div>
              <h1
                className={`font-libre font-normal  text-[#3A3A3A] ${isMobile ? "text-center text-[32px] leading-[42px] border-b border-[#CBD5E1] pb-2" : "text-[clamp(41.3px,calc(41.3px+((64-41.3)*((100vw-1200px)/662))),64px)] leading-[clamp(50.3px,calc(50.3px+((78-50.3)*((100vw-1200px)/662))),78px)] pb-[clamp(15.46px,calc(15.46px+((24-15.46)*((100vw-1200px)/662))),24px)]"}`}
                style={
                  {
                    WebkitTextStrokeWidth: "0.5px",
                    WebkitTextStrokeColor: "#000",
                  } as React.CSSProperties
                }
              >
                {t("TAKING_COURT_TO_PEOPLE")}
              </h1>
              <p
                className={`font-roboto font-normal text-[#334155]  tracking-normal ${isMobile ? "text-center text-[17px] leading-[22px] pt-[24px] pb-[30px]" : "text-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)] leading-[clamp(23.18px,calc(23.18px+((36-23.18)*((100vw-1200px)/662))),36px)] pt-[clamp(15.46px,calc(15.46px+((24-15.46)*((100vw-1200px)/662))),24px)] pb-[clamp(19.33px,calc(19.33px+((30-19.33)*((100vw-1200px)/662))),30px)]"}`}
              >
                {t("COURT_DESCRIPTION")}
              </p>
              <div
                className={`flex flex-row ${isMobile ? "justify-center gap-4" : "gap-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)]"}`}
              >
                <div className="relative login-dropdown">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLoginDropdownOpen(!loginDropdownOpen);
                    }}
                    className={`cursor-pointer cursor-default box-border flex flex-row items-center justify-center ${isMobile ? "gap-4" : "gap-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)]"}  bg-[#0F766E] border border-[#0F766E] rounded-[12px] ${isMobile ? "h-[40px] w-[135px] px-[12px] py-2" : "h-[clamp(44.48px,calc(44.48px+((69-44.48)*((100vw-1200px)/662))),69px)] w-[clamp(155.45px,calc(155.45px+((241-155.45)*((100vw-1200px)/662))),241px)] px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] py-[clamp(20.09px,calc(20.09px+((32-20.09)*((100vw-1200px)/662))),32px)]"}`}
                  >
                    <span
                      className={
                        isMobile
                          ? "text-center font-roboto font-medium text-[14px] leading-[20px] text-white"
                          : "h-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] font-roboto font-medium text-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)] leading-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] tracking-[-0.56px] text-white"
                      }
                    >
                      {t("LOGIN")}
                    </span>
                    <span>
                      <svgIcons.DownArrowIcon fill="#fff" />
                    </span>
                  </button>

                  {loginDropdownOpen && (
                    <div
                      className="w-max absolute left-0 top-full mt-1 bg-white border-[2px] border-[#E2E8F0] rounded-[12px] shadow-lg z-[9999] min-w-[135px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="relative overflow-visible"
                        onMouseEnter={() => setShowCitizenTooltip(true)}
                        onMouseLeave={() => setShowCitizenTooltip(false)}
                      >
                        <button
                          className="px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] text-left text-[#3A3A3A] hover:bg-gray-50 transition-colors flex justify-center items-center gap-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)] text-sm hover:text-[#0F766E] w-full"
                          onClick={() => {
                            window.open(APP_URLS.CITIZEN_DRISTI, "_blank");
                            setLoginDropdownOpen(false);
                          }}
                        >
                          <span
                            className={
                              isMobile
                                ? "py-3 border-b border-[#CBD5E1] text-center font-roboto font-medium text-[14px] leading-[20px] text-[#3A3A3A]"
                                : "py-3 border-b border-[#CBD5E1] font-roboto font-medium text-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)] leading-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)] tracking-[-0.24px] text-[#3A3A3A] hover:text-[#0F766E]"
                            }
                          >
                            {" "}
                            {t("ADVOCATE_LITIGANT_LOGIN")}
                          </span>
                        </button>
                        {showCitizenTooltip && !isMobile && (
                          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[99999]">
                            <Tooltip text={t("CITIZEN_LOGIN_TOOLTIP")} />
                          </div>
                        )}
                      </div>
                      <div
                        className="relative overflow-visible"
                        onMouseEnter={() => setShowEmployeeTooltip(true)}
                        onMouseLeave={() => setShowEmployeeTooltip(false)}
                      >
                        <button
                          className="px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] text-left text-[#3A3A3A] hover:bg-gray-50 transition-colors flex justify-center items-center gap-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)] text-sm hover:text-[#0F766E] w-full"
                          onClick={() => {
                            window.open(APP_URLS.EMPLOYEE_USER, "_blank");
                            setLoginDropdownOpen(false);
                          }}
                        >
                          <span
                            className={
                              isMobile
                                ? "py-3 text-center font-roboto font-medium text-[14px] leading-[20px] text-[#3A3A3A]"
                                : "py-3 font-roboto font-medium text-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)] leading-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)] tracking-[-0.24px] text-[#3A3A3A] hover:text-[#0F766E]"
                            }
                          >
                            {t("JUDGE_STAFF_LOGIN")}
                          </span>
                        </button>
                        {showEmployeeTooltip && !isMobile && (
                          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[99999]">
                            <Tooltip text={t("JUDGE_STAFF_LOGIN_TOOLTIP")} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className="relative"
                  onMouseEnter={() => setShowSearchTooltip(true)}
                  onMouseLeave={() => setShowSearchTooltip(false)}
                >
                  <button
                    className={`box-border text-[white] flex flex-row items-center justify-center ${isMobile ? "gap-4" : "gap-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)]"}  bg-[white] border border-[#0F766E] rounded-[12px] ${isMobile ? "h-[40px] w-[135px] px-[12px] py-2" : "h-[clamp(44.48px,calc(44.48px+((69-44.48)*((100vw-1200px)/662))),69px)] w-[clamp(155.45px,calc(155.45px+((241-155.45)*((100vw-1200px)/662))),241px)] px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] py-[clamp(20.09px,calc(20.09px+((32-20.09)*((100vw-1200px)/662))),32px)]"}`}
                    onClick={() => router.push("/search")}
                  >
                    <span
                      className={
                        isMobile
                          ? "text-center font-roboto font-medium text-[14px] leading-[20px] text-[#0F766E]"
                          : "h-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] font-roboto font-medium text-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)] leading-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] tracking-[-0.56px] text-[#0F766E]"
                      }
                    >
                      {" "}
                      {t("CASE_SEARCH")}
                    </span>
                  </button>
                  {showSearchTooltip && !isMobile && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[99999]">
                      <Tooltip text={t("CASE_SEARCH_TOOLTIP")} />
                    </div>
                  )}
                </div>
                <div
                  className="relative"
                  onMouseEnter={() => setShowCertifiedCopiesTooltip(true)}
                  onMouseLeave={() => setShowCertifiedCopiesTooltip(false)}
                >
                  <button
                    className={`box-border text-[white] flex flex-row items-center justify-center ${isMobile ? "gap-4" : "gap-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)]"}  bg-[white] border border-[#0F766E] rounded-[12px] ${isMobile ? "h-[40px] px-[12px] py-2 whitespace-nowrap" : "h-[clamp(44.48px,calc(44.48px+((69-44.48)*((100vw-1200px)/662))),69px)] px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] py-[clamp(20.09px,calc(20.09px+((32-20.09)*((100vw-1200px)/662))),32px)] whitespace-nowrap"}`}
                    onClick={() => router.push("/certified-true-copies")}
                  >
                    <span
                      className={
                        isMobile
                          ? "text-center font-roboto font-medium text-[14px] leading-[20px] text-[#0F766E]"
                          : "h-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] font-roboto font-medium text-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)] leading-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] tracking-[-0.56px] text-[#0F766E]"
                      }
                    >
                      {" "}
                      {t("CERTIFIED_TRUE_COPIES")}
                    </span>
                  </button>
                  {showCertifiedCopiesTooltip && !isMobile && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-[99999]">
                      <Tooltip text={t("CERTIFIED_TRUE_COPIES_TOOLTIP")} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            <div>
              <div className="relative rounded-lg overflow-hidden shadow-lg aspect-video">
                {!isPlaying ? (
                  <div
                    className="relative w-full h-full cursor-pointer group"
                    onClick={() => setIsPlaying(true)}
                  >
                    <Image
                      src="/images/homeIntroThumbnail.png"
                      alt="Police Station Map"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 md:w-[clamp(51.57px,calc(51.57px+((80-51.57)*((100vw-1200px)/662))),80px)] md:h-[clamp(51.57px,calc(51.57px+((80-51.57)*((100vw-1200px)/662))),80px)] rounded-full bg-white bg-opacity-80 group-hover:bg-opacity-100 flex items-center justify-center transition-all duration-300">
                        <svg
                          className="w-8 h-8 md:w-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)] md:h-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)] text-emerald-700"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
                    title="ON Courts Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeIntroVideo;
