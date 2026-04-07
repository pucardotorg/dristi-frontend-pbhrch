import React from "react";
import SectionHeading from "../common/SectionHeading";
import Image from "next/image";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

export default function Technology() {
  const { t } = useSafeTranslation();
  return (
    <div className="py-16 bg-white relative" id="technology-section">
      <div
        className="absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage:
            "url('/images/technology.svg'), url('/images/technology.svg')",
          backgroundPosition: "left center, right center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "40% 100%, 40% 100%",
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading title={t("TECHNOLOGY")} />

        <div className="font-roboto max-w-5xl mx-auto text-center">
          <p className="text-[20px] font-normal text-[#334155] mb-8">
            {t("TECHNOLOGY_DESCRIPTION")}
          </p>

          <a
            href="https://pucar.gitbook.io/dristi/dristi-platform/release-notes"
            className="inline-flex items-center bg-[#0F766E] text-white text-[28px] font-medium py-3 px-6 rounded-md hover:bg-[#0F766E]/80 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("GIT_BOOK")}
            <Image
              src="/images/rightArrow.png"
              alt="Arrow right"
              width={20}
              height={20}
              className="ml-2"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
