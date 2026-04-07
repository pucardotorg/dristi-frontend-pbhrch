import Image from "next/image";
import { FooterConfig } from "../data/FooterConfig"; // Ensure path is correct
import Link from "next/link";
import { useSafeTranslation } from "../hooks/useSafeTranslation";
import { useMediaQuery } from "@mui/material";
import { useMemo } from "react";

const Footer: React.FC = () => {
  const { t } = useSafeTranslation();
  const isMobile = useMediaQuery("(max-width:640px)");
  const isMac = useMediaQuery("(max-width:1500px)");
  const isLaptop = useMediaQuery("(max-width:1700px)");

  // Get formatted date based on time condition
  const formattedDate = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();

    // If time is after 5 PM (17:00), use current date, otherwise use previous day
    const dateToUse =
      hours >= 17 ? now : new Date(now.setDate(now.getDate() - 1));

    // Format as dd/mm/yyyy
    const day = String(dateToUse.getDate()).padStart(2, "0");
    const month = String(dateToUse.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = dateToUse.getFullYear();

    return `${day}/${month}/${year}`;
  }, []);

  return (
    <footer className="px-8 md:px-[clamp(41.3px,calc(41.3px+((64-41.3)*((100vw-1200px)/662))),64px)] py-10 md:py-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)] font-roboto bg-footerBg text-white w-full mt-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center md:items-start mx-auto md:gap-[clamp(19.33px,calc(19.33px+((30-19.33)*((100vw-1200px)/662))),30px)] gap-[30px]">
        <div>
          {/* Left Section: Logo */}
          <div
            className={`flex flex-col md:items-start ${isMobile ? "w-[70%] border-b border-[#CBD5E1] py-4" : ""}`}
          >
            <Image
              src={FooterConfig.logo.imageUrl}
              alt={FooterConfig.logo.alt}
              width={
                isMobile
                  ? FooterConfig.logo.smallWidth
                  : isMac
                    ? FooterConfig.logo.macWidth
                    : isLaptop
                      ? FooterConfig.logo.laptopWidth
                      : FooterConfig.logo.width
              }
              height={
                isMobile
                  ? FooterConfig.logo.smallHeight
                  : isMac
                    ? FooterConfig.logo.macHeight
                    : isLaptop
                      ? FooterConfig.logo.laptopHeight
                      : FooterConfig.logo.height
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:flex md:flex-row gap-10 md:gap-[clamp(25.79px,calc(25.79px+((40-25.79)*((100vw-1200px)/662))),40px)]">
          {/* Quick Links Section */}
          <div className="flex flex-col">
            <h3 className="text-[15px] md:text-[clamp(10.96px,calc(10.96px+((17-10.96)*((100vw-1200px)/662))),17px)] font-normal mb-2">
              {t("QUICK_LINKS")}
            </h3>
            <div className="grid grid-cols-1 gap-y-4 leading-[24px] md:leading-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)] tracking-[-0.2px]">
              {FooterConfig.quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="text-[17px] md:text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] font-medium md:font-medium hover:underline"
                  target={link.url.startsWith("http") ? "_blank" : "_self"}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : ""}
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>
          </div>

          {/* Help & Resources Section */}
          <div className="flex flex-col">
            <h3 className="text-[15px] md:text-[clamp(10.96px,calc(10.96px+((17-10.96)*((100vw-1200px)/662))),17px)] font-normal mb-2">
              {t("HELP_RESOURCES")}
            </h3>
            <div className="grid grid-cols-1 gap-y-4 leading-[24px] md:leading-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)] tracking-[-0.2px]">
              {FooterConfig.helpResources.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="text-[17px] md:text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] font-medium md:font-medium hover:underline"
                  target={link.url.startsWith("http") ? "_blank" : "_self"}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : ""}
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>
          </div>

          {/* Information & Privacy Section */}
          <div className="flex flex-col">
            <h3 className="text-[15px] md:text-[clamp(10.96px,calc(10.96px+((17-10.96)*((100vw-1200px)/662))),17px)] font-normal mb-2">
              {t("INFORMATION_PRIVACY")}
            </h3>
            <div className="grid grid-cols-1 gap-y-4 leading-[24px] md:leading-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)] tracking-[-0.2px]">
              {FooterConfig.informationPrivacy.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="text-[17px] md:text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] font-medium md:font-medium hover:underline"
                  target={link.url.startsWith("http") ? "_blank" : "_self"}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : ""}
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>
          </div>

          {/* External Links Section */}
          <div className="flex flex-col">
            <h3 className="text-[15px] md:text-[clamp(10.96px,calc(10.96px+((17-10.96)*((100vw-1200px)/662))),17px)] font-normal mb-2">
              {t("EXTERNAL_LINKS")}
            </h3>
            <div className="grid grid-cols-1 gap-y-4 leading-[24px] md:leading-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)] tracking-[-0.2px]">
              {FooterConfig.externalLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="text-[17px] md:text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] font-medium md:font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 md:mt-[clamp(30.95px,calc(30.95px+((48-30.95)*((100vw-1200px)/662))),48px)]">
        <hr className="border-t border-white" />
      </div>

      {/* Copyright Section */}
      <div className="mt-6">
        <div className="text-center text-[15px] md:text-[clamp(10.96px,calc(10.96px+((17-10.96)*((100vw-1200px)/662))),17px)]">
          {t(FooterConfig.copyright)} {formattedDate}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
