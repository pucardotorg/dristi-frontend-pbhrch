import React, { useState } from "react";
import Head from "next/head";
import SectionHeading from "../../components/common/SectionHeading";
import ResourceItem from "../../components/common/ResourceItem";
import { contactInfoData, getFaqs } from "../../data/ContactInfoData";
import FAQItem from "../../components/common/FAQItem";
import { useMediaQuery } from "@mui/system";
import { svgIcons } from "../../data/svgIcons";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

const HelpResources = () => {
  const { t } = useSafeTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = getFaqs(t);
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const isMobile = useMediaQuery("(max-width: 640px)");

  // Using contact information data from external file

  return (
    <>
      <Head>
        <title>{t("HELP_RESOURCES")}</title>
        <meta
          name="description"
          content="Access everything you need to navigate 24x7 ON Courts seamlessly. Submit feedback or support requests and explore step-by-step tutorials and guides."
        />
      </Head>

      <div className="py-8 md:py-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] bg-white">
        <div className="w-full md:w-[98%] mx-auto">
          <div className="px-6 md:px-[clamp(51.9px,calc(51.9px+((80-51.9)*((100vw-1200px)/662))),80px)]">
            <SectionHeading
              title={t("HELP_RESOURCES")}
              fontSize={isMobile ? "text-[3rem]" : "text-[4rem]"}
              className="mb-6"
              showBorder={false}
            />

            <div className="font-normal text-xl md:text-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)] flex flex-col md:flex-row mb-12 md:mb-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] gap-6 md:gap-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)]">
              <div className="font-roboto md:w-[70%] text-[#334155] content-center text-center md:text-left">
                {t("ACCESS_EVERYTHING_YOU_NEED")}
              </div>
              <div className="flex flex-row gap-4 md:w-[30%] bg-[#F8FAFC] p-4 md:py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] md:px-[clamp(19.32px,calc(19.32px+((24-19.32)*((100vw-1200px)/662))),24px)] rounded-[23.31px] shadow-sm items-center justify-center drop-shadow-[0px_2.003px_6.009px_rgba(0,0,0,0.1)]">
                <span className="font-roboto text-[60px] sm:text-[80px] md:text-[clamp(65.28px,calc(65.28px+((102.3-65.28)*((100vw-1200px)/662))),102.3px)] md:leading-[clamp(90.01px,calc(90.01px+((141.11-90.01)*((100vw-1200px)/662))),141.11px)] font-bold text-[#0F766E] shrink-0">
                  7
                </span>
                <div className="font-libre text-lg sm:text-xl md:text-[clamp(22.52px,calc(22.52px+((34.96-22.52)*((100vw-1200px)/662))),34.96px)] md:leading-[clamp(29.65px,calc(29.65px+((46-29.65)*((100vw-1200px)/662))),46px)] text-[#334155] break-words hyphens-none">
                  {t("DAYS_TO_SUPPORT_RESOLUTION")}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] mb-16 md:mb-[clamp(41.3px,calc(41.3px+((64-41.3)*((100vw-1200px)/662))),64px)]">
              {/* Support & Feedback Section */}
              <ResourceItem
                t={t}
                heading={"SUPPORT_FEEDBACK"}
                items={[
                  {
                    icon: "/images/file.png",
                    text: "SUPPORT_FORM",
                    link: "https://forms.gle/uCSgGiqGiMQYjjgeA",
                    section: "Support Form",
                    newTab: true,
                  },
                  {
                    icon: "/images/file.png",
                    text: "FEEDBACK_SURVEY_FORM",
                    link: "https://docs.google.com/forms/d/e/1FAIpQLSdsNBhg-9YYs-HKFja_UwUc7ZV38BItLgb7If4kWwTURMqXOg/viewform",
                    section: "Feedback survey form",
                    newTab: true,
                  },
                ]}
              />

              {/* Resources Section */}
              <ResourceItem
                t={t}
                heading="RESOURCES"
                items={[
                  {
                    icon: "/images/file.png",
                    text: "USER_MANUAL_ADVOCATE_AND_LITIGANT",
                    link: "https://oncourts.kerala.gov.in/minio-filestore/v1/files/id?tenantId=kl&fileStoreId=c21569cd-70f1-4a00-b244-afb0cdaf9da5",
                    section: "User Guide for Advocates and Litigants",
                    newTab: true,
                  },
                  {
                    icon: "/images/file.png",
                    text: "VIDEO_TUTORIALS",
                    link: "/video-tutorials",
                    section: "Video tutorials",
                    newTab: false,
                  },
                ]}
              />
            </div>
          </div>
          {!isMobile && (
            <div className="border-b border-[#CBD5E1] w-full mx-auto mt-1"></div>
          )}

          {/* FAQ Section */}
          <div
            id="faq"
            className="my-16 md:my-[clamp(41.3px,calc(41.3px+((64-41.3)*((100vw-1200px)/662))),64px)] pb-8 md:pb-0 bg-[#F0FDFA] md:bg-white"
          >
            <SectionHeading
              title={t("FREQUENTLY_ASKED_QUESTIONS")}
              fontSize="text-4xl"
              className="mb-8 pt-6 md:pt-0 px-6 md:px-0"
            />
            <div className="font-roboto px-6 md:px-[clamp(51.9px,calc(51.9px+((80-51.9)*((100vw-1200px)/662))),80px)]">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFaq === index}
                  onClick={() => toggleFaq(index)}
                />
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div id="contactUs">
            <SectionHeading
              title={t("NEED_FURTHER_ASSISTANCE")}
              fontSize="text-4xl"
              className="mb-8"
            />

            <div className="font-roboto px-6 md:px-[clamp(51.9px,calc(51.9px+((80-51.9)*((100vw-1200px)/662))),80px)] pb-20 md:pb-[clamp(51.9px,calc(51.9px+((80-51.9)*((100vw-1200px)/662))),80px)] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] max-w-5xl mx-auto">
              {contactInfoData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-3 md:p-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] mt-1">
                    {svgIcons[item?.icon] &&
                      React.createElement(svgIcons[item.icon])}
                  </div>
                  <div className="font-medium text-xl flex flex-wrap align-center gap-1">
                    <div className="font-medium  mb-1">{t(item.title)}</div>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0F766E] font-semibold"
                      >
                        {t(item.content)}
                      </a>
                    ) : (
                      item.content && (
                        <div className="text-[#0F766E] font-semibold">
                          {item.title ? item.content : t(item.content)}
                        </div>
                      )
                    )}
                    {item.subContent && (
                      <div className="text-[#0F766E] font-semibold">
                        {t(item.subContent)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpResources;
