import React from "react";
import Head from "next/head";
import { useMediaQuery } from "@mui/material";
import SectionHeading from "../../components/common/SectionHeading";
import RtiInfoCard from "../../components/common/RtiInfoCard";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

const RTIAuthorities = () => {
  // Check if the screen is mobile size
  const isMobile = useMediaQuery("(max-width:640px)");
  const { t } = useSafeTranslation();
  // RTI designated authorities data
  const rtiAuthoritiesData = [
    {
      id: 1,
      designation: "Public Information Officer",
      name: "Sri. Biju A.",
      title: "Junior Superintendent",
      phone: "04742919099",
      email: "oncourtkollam@keralacourts.in",
    },
    {
      id: 2,
      designation: "Assistant Public Information Officer",
      name: "Smt. Shobha K",
      title: "Senior Clerk",
      phone: "04742919099",
      email: "oncourtkollam@keralacourts.in",
    },
    {
      id: 3,
      designation: "Appellate Authority",
      name: "Sri. Nizar T. A Sheristadaar",
      title: "Chief Judicial Magistrate Court, Kollam",
      phone: "04742793491",
      email: "cjmklm@kerala.gov.in",
    },
  ];

  return (
    <>
      <Head>
        <title>{t("RTI_AUTHORITIES")}</title>
        <meta
          name="description"
          content="Designated Authorities under RTI Act, 2005 at ON Courts"
        />
      </Head>

      <div className="bg-white min-h-screen">
        <div className="w-[90%] py-8 md:py-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)] mx-auto">
          <SectionHeading
            title={t("RTI_AUTHORITIES_HEADING")}
            fontSize="text-4xl"
            className="!mb-4 !text-left"
            showBorder={false}
          />

          {isMobile ? (
            // Mobile view with cards
            <div className="mb-8">
              {rtiAuthoritiesData.map((authority) => {
                const phoneIcon = (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                );

                const emailIcon = (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                );

                return (
                  <RtiInfoCard
                    t={t}
                    key={authority.id}
                    items={[
                      {
                        label: "DESIGNATED_AUTHORITY",
                        value: authority.designation,
                      },
                      {
                        label: "NAME",
                        value: `${authority.name}, ${authority.title}`,
                      },
                      {
                        label: "PHONE",
                        value: authority.phone,
                        icon: phoneIcon,
                      },
                      {
                        label: "MAIL_ID",
                        value: authority.email,
                        icon: emailIcon,
                      },
                    ]}
                  />
                );
              })}
            </div>
          ) : (
            // Desktop view with table
            <div className="overflow-x-auto shadow-md rounded-lg mb-8">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="font-libre bg-[#F8FAFC] text-[#0F172A] text-left text-xl md:text-[clamp(16.75px,calc(16.75px+((22-16.75)*((100vw-1200px)/662))),22px)] border border-[#E2E8F0]">
                    <th className="py-3 md:py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] font-semibold">
                      {t("SL_NO")}
                    </th>
                    <th className="py-3 md:py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] font-semibold">
                      {t("DESIGNATED_AUTHORITY")}
                    </th>
                    <th className="py-3 md:py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] font-semibold">
                      {t("NAME")}
                    </th>
                    <th className="py-3 md:py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] font-semibold">
                      <div className="!flex !flex-row !items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 md:h-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)] md:w-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>{t("PHONE")}</span>
                      </div>
                    </th>
                    <th className="py-3 md:py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] font-semibold">
                      <div className="!flex !flex-row !items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 md:h-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)] md:w-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{t("MAIL_ID")}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rtiAuthoritiesData.map((authority) => (
                    <tr
                      key={authority.id}
                      className="font-medium font-roboto text-[18px] md:text-[20px] text-[#334155] hover:bg-gray-50 border border-[#E2E8F0]"
                    >
                      <td className="py-3 md:py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)]">
                        {authority.id}
                      </td>
                      <td className="py-3 md:py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)]">
                        {authority.designation}
                      </td>
                      <td className="py-3 md:py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)]">
                        <div>
                          {authority.name}, {authority.title}
                        </div>
                      </td>
                      <td className="py-3 md:py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)]">
                        {authority.phone}
                      </td>
                      <td className="py-3 md:py-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)] px-4 md:px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)]">
                        {authority.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RTIAuthorities;
