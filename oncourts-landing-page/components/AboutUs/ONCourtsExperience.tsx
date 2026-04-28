import CustomCard from "../common/CustomCard";
import SectionHeading from "../common/SectionHeading";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

export default function ONCourtsExperience() {
  const { t } = useSafeTranslation();
  const experiences = [
    {
      title: "ACCESSIBLE_AND_PREDICTABLE",
      description: "ACCESSIBLE_AND_PREDICTABLE_DESCRIPTION",
    },
    {
      title: "ASSISTED_AND_EMPOWERING",
      description: "ASSISTED_AND_EMPOWERING_DESCRIPTION",
    },
    {
      title: "SEAMLESS_AND_FRICTIONLESS",
      description: "SEAMLESS_AND_FRICTIONLESS_DESCRIPTION",
    },
  ];
  return (
    <div
      className="py-16 md:py-[clamp(41.3px,calc(41.3px+((64-41.3)*((100vw-1200px)/662))),64px)] bg-[#F0FDFA]"
      id="experience-section"
    >
      <div className="container mx-auto max-w-[95%] px-4">
        <SectionHeading title={t("ON_COURTS_EXPERIENCE")} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)] mt-5 md:mt-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)]">
          {experiences.map((experience, index) => (
            <CustomCard
              key={index}
              title={t(experience.title)}
              description={t(experience.description)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
