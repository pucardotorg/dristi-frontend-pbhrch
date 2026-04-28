import React from "react";
import SectionHeading from "../common/SectionHeading";
import CustomCard from "../common/CustomCard";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

export default function GuidingPrinciples() {
  const { t } = useSafeTranslation();
  // Principles data
  const principles = [
    {
      title: "PEOPLE_CENTRIC",
      description: "PEOPLE_CENTRIC_DESCRIPTION",
    },
    {
      title: "OPEN",
      description: "OPEN_DESCRIPTION",
    },
    {
      title: "NETWORKED_ECOSYSTEM",
      description: "NETWORKED_ECOSYSTEM_DESCRIPTION",
    },
  ];

  return (
    <div
      className="py-16 md:py-[clamp(41.3px,calc(41.3px+((64-41.3)*((100vw-1200px)/662))),64px)] bg-[#F0FDFA]"
      id="guiding-principles-section"
    >
      <div className="container mx-auto max-w-[95%] px-4">
        <SectionHeading title={t("GUIDING_PRINCIPLES")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)] mt-5 md:mt-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)]">
          {principles.map((principle, index) => (
            <CustomCard
              key={index}
              title={t(principle.title)}
              description={t(principle.description)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
