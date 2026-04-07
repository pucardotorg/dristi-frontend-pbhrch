import React, { useState, useEffect } from "react";
import Head from "next/head";
import PersonCard from "../../components/common/PersonCard";
import SectionHeading from "../../components/common/SectionHeading";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

// Data structure to hold all the people information
const peopleData = {
  chiefJustices: [
    {
      name: "Justice Nitin Jamdar",
      title: "CHIEF_JUSTICE",
      image: "/images/people/jOne.png",
    },
  ],
  oncourt: {
    magistrates: [
      {
        name: "Sri. Micheal George",
        title: "JUDICIAL_FIRST_CLASS_MAGISTRATE",
        image: "/images/people/jThree.png",
        description: "JUDICIAL_FIRST_CLASS_MAGISTRATE_DESCRIPTION",
      },
    ],
  },
  formerMagistrates: [
    {
      name: "Smt. Soorya S Sukumaran",
      title: "JUDICIAL_FIRST_CLASS_MAGISTRATE_I",
      image: "/images/jFour.png",
    },
  ],
};

const People = () => {
  const { t } = useSafeTranslation();
  // State to track the maximum height of all text sections
  const [maxTextHeight, setMaxTextHeight] = useState<number>(0);

  // Function to update the maximum height
  const updateMaxHeight = (height: number) => {
    setMaxTextHeight((prev) => Math.max(prev, height));
  };

  // Reset the max height when the component unmounts
  useEffect(() => {
    return () => setMaxTextHeight(0);
  }, []);
  return (
    <>
      <Head>
        <title>{t("ABOUT_US_PEOPLE")}</title>
        <meta
          name="description"
          content="Meet the dedicated team of judicial officers and staff at ON Courts"
        />
      </Head>

      <div className="py-8 md:py-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] bg-[#F0FDFA]">
        <div className="w-[80%] md:w-[90%] lg:w-[90%] mx-auto px-2 sm:px-4">
          <SectionHeading
            title={t("PEOPLE")}
            fontSize="text-5xl"
            // className="mb-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)]"
            showBorder={false}
          />

          {/* High Court of Kerala Section */}
          <div className="mb-16 md:mb-[clamp(41.3px,calc(41.3px+((64-41.3)*((100vw-1200px)/662))),64px)]">
            <SectionHeading
              title={t("HIGH_COURT_OF_KERALA")}
              fontSize="text-4xl"
              className="mb-8 md:mb-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)]"
            />
            <div className="flex justify-center">
              <div
                className={`grid ${
                  peopleData.chiefJustices.length === 1
                    ? "grid-cols-1"
                    : peopleData.chiefJustices.length === 2
                      ? "grid-cols-1 sm:grid-cols-2"
                      : peopleData.chiefJustices.length === 3
                        ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                } 
                         gap-4 sm:gap-6 md:gap-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] justify-items-center mx-auto w-full`}
              >
                {peopleData.chiefJustices.map((justice, index) => (
                  <PersonCard
                    t={t}
                    key={index}
                    imagePath={justice.image}
                    name={justice.name}
                    title={justice.title}
                    cardHeight={maxTextHeight}
                    setMaxHeight={updateMaxHeight}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 24x7 ON Court, Kollam Section */}
          <div className="mb-16 md:mb-[clamp(41.3px,calc(41.3px+((64-41.3)*((100vw-1200px)/662))),64px)]">
            <SectionHeading
              title={t("24X7_ON_COURT_KOLLAM")}
              fontSize="text-4xl"
              className="mb-8 md:mb-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)]"
            />

            {/* Magistrates */}
            <div className="mb-12 md:mb-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)]">
              <div className="flex justify-center">
                <div
                  className={`grid ${
                    peopleData.oncourt.magistrates.length === 1
                      ? "grid-cols-1"
                      : peopleData.oncourt.magistrates.length === 2
                        ? "grid-cols-1 sm:grid-cols-2"
                        : peopleData.oncourt.magistrates.length === 3
                          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  } 
                         gap-4 sm:gap-6 md:gap-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] justify-items-center mx-auto w-full`}
                >
                  {peopleData.oncourt.magistrates.map((magistrate, index) => (
                    <PersonCard
                      t={t}
                      key={index}
                      imagePath={magistrate.image}
                      name={magistrate.name}
                      title={magistrate.title}
                      description={magistrate.description}
                      cardHeight={maxTextHeight}
                      setMaxHeight={updateMaxHeight}
                      animateOnHover={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Former Magistrates Section */}
          <div>
            <SectionHeading
              title={t("FORMER_MAGISTRATES")}
              fontSize="text-4xl"
              className="mb-8 md:mb-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)]"
            />
            <div className="flex justify-center">
              <div
                className={`grid ${
                  peopleData.formerMagistrates.length === 1
                    ? "grid-cols-1"
                    : peopleData.formerMagistrates.length === 2
                      ? "grid-cols-1 sm:grid-cols-2"
                      : peopleData.formerMagistrates.length === 3
                        ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                } 
                         gap-4 sm:gap-6 md:gap-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] justify-items-center mx-auto w-full`}
              >
                {peopleData.formerMagistrates.map((person, index) => (
                  <PersonCard
                    t={t}
                    key={index}
                    imagePath={person.image}
                    name={person.name}
                    title={person.title}
                    cardHeight={maxTextHeight}
                    setMaxHeight={updateMaxHeight}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default People;
