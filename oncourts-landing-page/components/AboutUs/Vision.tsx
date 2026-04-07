import React from "react";
import SectionHeading from "../common/SectionHeading";
import { svgIcons } from "../../data/svgIcons";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

export default function Vision() {
  const videoId = "EDDAkm4FvBc";
  const { t } = useSafeTranslation();

  return (
    <div
      className="py-10 md:py-[clamp(41.3px,calc(41.3px+((64-41.3)*((100vw-1200px)/662))),64px)] bg-white"
      id="vision-section"
    >
      <div className="container mx-auto max-w-[95%] px-5">
        <div className="mb-8">
          <SectionHeading title={t("VISION")} />
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)] items-stretch">
          <div className="text-center md:text-left md:w-1/2 text-[20px] md:text-[clamp(16.75px,calc(16.75px+((22-16.75)*((100vw-1200px)/662))),22px)] font-roboto font-normal text-[#334155]">
            <p className="mb-5">{t("VISION_DESCRIPTION_1")}</p>
            <p className="mb-5">{t("VISION_DESCRIPTION_2")}</p>
            <a
              href="https://drive.google.com/file/d/1lUJA_CbDuRUd3Rk7Sn6Ws2NiI6L4d5aM/view"
              className="inline-flex items-center bg-[#0F766E] text-white text-lg md:text-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)] md:leading-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] md:tracking-[-0.56px] font-medium py-3 md:py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-6 md:px-[clamp(19.32px,calc(19.32px+((24-19.32)*((100vw-1200px)/662))),24px)] rounded-md hover:bg-[#0F766E]/80 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-5 h-5 md:w-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] md:h-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] mr-4 flex-shrink-0 flex items-center justify-center">
                <svgIcons.ArrowIcon color="#FFFFFF" />
              </div>
              <span>{t("ON_COURTS_JOURNEY")}</span>
            </a>
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            <div className="relative rounded-md overflow-hidden shadow-lg aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                title="ON Courts Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              {/* <div className="absolute bottom-3 right-3">
                <FullscreenButton
                  url={`https://www.youtube.com/watch?v=${videoId}`}
                  videoId={videoId}
                  iconColor="#FFFFFF"
                  borderColor="#4B5563"
                  backgroundColor="rgba(0,0,0,0.5)"
                  size={40}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
