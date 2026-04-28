import React from "react";
import Image from "next/image";
import DetailCard from "../common/DetailCard";
import SectionHeading from "../common/SectionHeading";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

export default function Benefits() {
  const { t } = useSafeTranslation();
  const benefitsData = [
    {
      heading: "LITIGANTS",
      icon: (
        <div className="relative w-12 h-12 md:w-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] md:h-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] flex items-center justify-center">
          <Image
            src="/images/person.svg"
            alt="Litigants Icon"
            width={40}
            height={40}
            style={{ color: "#0F766E" }}
          />
        </div>
      ),
      points: [
        "LITIGANTS_DESCRIPTION_1",
        "LITIGANTS_DESCRIPTION_2",
        "LITIGANTS_DESCRIPTION_3",
      ],
    },
    {
      heading: "LAWYERS",
      icon: (
        <div className="relative w-12 h-12 md:w-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] md:h-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] flex items-center justify-center">
          <Image
            src="/images/advocate.svg"
            alt="Lawyers Icon"
            width={35}
            height={35}
            style={{ color: "#0F766E" }}
          />
        </div>
      ),
      points: [
        "LAWYERS_DESCRIPTION_1",
        "LAWYERS_DESCRIPTION_2",
        "LAWYERS_DESCRIPTION_3",
      ],
    },
    {
      heading: "JUDGE",
      icon: (
        <div className="relative w-12 h-12 md:w-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] md:h-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] flex items-center justify-center">
          <Image
            src="/images/judge.svg"
            alt="Judges Icon"
            width={40}
            height={40}
            style={{ color: "#0F766E" }}
          />
        </div>
      ),
      points: [
        "JUDGE_DESCRIPTION_1",
        "JUDGE_DESCRIPTION_2",
        "JUDGE_DESCRIPTION_3",
      ],
    },
    {
      heading: "COURT_STAFF",
      icon: (
        <div className="relative w-12 h-12 md:w-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] md:h-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] flex items-center justify-center">
          <Image
            src="/images/justice.svg"
            alt="Registry Icon"
            width={35}
            height={35}
            style={{ color: "#0F766E" }}
          />
        </div>
      ),
      points: [
        "COURT_STAFF_DESCRIPTION_1",
        "COURT_STAFF_DESCRIPTION_2",
        "COURT_STAFF_DESCRIPTION_3",
      ],
    },
  ];

  return (
    <div
      className="py-16 md:py-[clamp(41.3px,calc(41.3px+((64-41.3)*((100vw-1200px)/662))),64px)] bg-white"
      id="benefits-section"
    >
      <div className="container mx-auto px-4">
        <SectionHeading title="Benefits" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)] mt-12 md:mt-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)]">
          {benefitsData.map((benefit, index) => (
            <DetailCard
              t={t}
              key={index}
              heading={benefit.heading}
              icon={benefit.icon}
              points={benefit.points}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
