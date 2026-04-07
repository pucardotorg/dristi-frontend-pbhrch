import React from "react";
import SectionHeading from "../common/SectionHeading";
import Image from "next/image";
import FullscreenButton from "../common/FullscreenButton";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

export default function Jurisdiction({ isMobile }: { isMobile: boolean }) {
  const { t } = useSafeTranslation();
  return (
    <div
      className="py-10 md:py-[clamp(41.3px,calc(41.3px+((64-41.3)*((100vw-1200px)/662))),64px)] bg-[#F0FDFA]"
      id="jurisdiction-section"
    >
      <div className="container mx-auto px-5">
        <div className="mb-8">
          <SectionHeading title={t("JURISDICTION")} />
        </div>

        <div className="max-w-4xl mx-auto mb-8 font-roboto text-[20px] md:text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] leading-[28px] md:leading-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)] text-[#334155]">
          <p className="text-center px-1 md:px-4">
            {t("JURISDICTION_DESCRIPTION")}
          </p>
        </div>

        <div className="mt-8 md:mt-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)]">
          <div className="relative mx-auto w-full max-w-4xl rounded-lg overflow-hidden shadow-sm">
            {/* Map image with markers */}
            <div className="relative">
              <Image
                src="/images/policeStationsLocations.png"
                alt="Kollam District Map with Police Stations"
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
              />

              {/* Fullscreen button */}
              <div className="absolute right-1 md:right-[clamp(7.73px,calc(7.73px+((12-7.73)*((100vw-1200px)/662))),12px)] bottom-3 md:bottom-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)]">
                <FullscreenButton
                  url="/images/policeStationsLocations.png"
                  iconColor="#0F766E"
                  borderColor="#E2E8F0"
                  backgroundColor="white"
                  size={isMobile ? 50 : 70}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
