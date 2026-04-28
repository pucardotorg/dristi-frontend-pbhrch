import React from "react";
import SectionHeading from "../../components/common/SectionHeading";
import { policySections } from "../../data/PoliciesData";
import { useMediaQuery } from "@mui/material";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

const Policies = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { t } = useSafeTranslation();
  return (
    <main className="pt-20 md:pt-[clamp(51.6px,calc(51.6px+((80-51.6)*((100vw-1200px)/662))),80px)] pb-40 md:pb-[clamp(103.1px,calc(103.1px+((160-103.1)*((100vw-1200px)/662))),160px)] bg-white text-[#334155] text-lg md:text-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)]">
      <div className="w-full mx-auto space-y-12 md:space-y-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)]">
        {policySections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className="md:px-[clamp(41.3px,calc(41.3px+((64-41.3)*((100vw-1200px)/662))),64px)] px-6 space-y-6 md:space-y-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)] scroll-mt-24"
          >
            <SectionHeading
              title={t(section.title)}
              className="!text-left"
              fontSize={isMobile ? "text-3xl" : "text-[40px]"}
              showBorder={false}
            />
            <ol className="font-roboto list-decimal pl-6 md:pl-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)] space-y-4 md:space-y-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] last:pb-0 pb-10 md:pb-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)] last:border-b-0 border-b border-[#CBD5E1] leading-[32px] md:leading-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)]">
              {section.data.map((item, index) => (
                <li key={index}>
                  <p>{t(item.text)}</p>
                </li>
              ))}
            </ol>
            {index !== policySections.length - 1 && <span></span>}
          </section>
        ))}
      </div>
    </main>
  );
};

export default Policies;
