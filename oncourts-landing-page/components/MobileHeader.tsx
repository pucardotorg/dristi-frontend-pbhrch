import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSafeTranslation } from "../hooks/useSafeTranslation";
import { MENU_ITEMS } from "./HeaderV2";
import { svgIcons } from "../data/svgIcons";

const MobileHeader = () => {
  const { t } = useSafeTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedSubItems, setExpandedSubItems] = useState<string[]>([]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setExpandedSection(null);
    setExpandedSubItems([]);
  };

  const toggleSection = (section: string) => {
    if (expandedSection !== section) {
      setExpandedSubItems([]);
    }
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleSubItem = (label: string) => {
    setExpandedSubItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleNavigation = () => {
    setIsMenuOpen(false);
    setExpandedSection(null);
    setExpandedSubItems([]);
  };
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="w-full h-[73px] border-b border-gray-300 px-[30px] py-2 flex justify-between items-center bg-white">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt={t("ONCOURTS_LOGO")}
            width={123}
            height={73}
            className="h-12 w-auto"
          />
        </Link>
        <button
          onClick={toggleMenu}
          className="flex flex-col justify-center items-center gap-[6px] w-8 h-8"
        >
          <span
            className={`w-6 h-[2px] bg-[#3A3A3A] transition-transform ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`w-6 h-[2px] bg-[#3A3A3A] ${isMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`w-6 h-[2px] bg-[#3A3A3A] transition-transform ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </header>

      {isMenuOpen && (
        <div className="fixed top-[73px] left-0 w-full h-[calc(100vh-73px)] z-50 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <nav className="py-4 bg-white">
              <Link
                href="/"
                className="mx-[10px] block px-6 py-3 text-[20px] text-[#3A3A3A] font-roboto"
                onClick={handleNavigation}
              >
                {t("HOME")}
              </Link>

              <div className="flex flex-col center justify-center">
                <button
                  onClick={() => toggleSection("ABOUT_US")}
                  className={`mx-[10px] px-6 py-3 text-left text-[20px] text-[#3A3A3A] font-roboto flex justify-between items-center hover:border-opacity-100 ${expandedSection === "ABOUT_US" ? "border-b border-[#00A7A7] border-opacity-0" : ""}`}
                >
                  <span
                    className={`${expandedSection === "ABOUT_US" ? "text-[#0F766E]" : ""}`}
                  >
                    {t("ABOUT_US")}
                  </span>
                  <span className={`text-[#00A7A7]`}>
                    {expandedSection === "ABOUT_US" ? (
                      <svgIcons.UpArrowIcon fill="#0F766E" />
                    ) : (
                      <svgIcons.DownArrowIcon />
                    )}
                  </span>
                </button>
                {expandedSection === "ABOUT_US" && (
                  <div className="">
                    {MENU_ITEMS.ABOUT_US.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-10 py-3 text-[18px] text-[#3A3A3A] font-roboto"
                        onClick={handleNavigation}
                      >
                        {t(item.label)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col center justify-center">
                <button
                  onClick={() => toggleSection("SERVICES")}
                  className={`mx-[10px] px-6 py-3 text-left text-[20px] text-[#3A3A3A] font-roboto flex justify-between items-center hover:border-opacity-100 ${expandedSection === "SERVICES" ? "border-b border-[#00A7A7]" : ""}`}
                >
                  <span
                    className={`${expandedSection === "SERVICES" ? "text-[#0F766E]" : ""}`}
                  >
                    {t("SERVICES")}
                  </span>
                  <span className={`text-[#00A7A7]`}>
                    {expandedSection === "SERVICES" ? (
                      <svgIcons.UpArrowIcon fill="#0F766E" />
                    ) : (
                      <svgIcons.DownArrowIcon />
                    )}
                  </span>
                </button>
                {expandedSection === "SERVICES" && (
                  <div className="">
                    {MENU_ITEMS.SERVICES.map((item) =>
                      item.subItems ? (
                        <div
                          key={item.label}
                          className="flex flex-col center justify-center"
                        >
                          <button
                            onClick={() => toggleSubItem(item.label)}
                            className={`px-[30px] mx-[10px] py-3 text-[18px] text-[#3A3A3A] font-roboto flex justify-between items-center ${expandedSubItems.includes(item.label) ? "border-b border-[#00A7A7]" : ""}`}
                          >
                            <span
                              className={`${expandedSubItems.includes(item.label) ? "text-[#0F766E]" : ""}`}
                            >
                              {t(item.label)}
                            </span>
                            <span className="text-[#00A7A7]">
                              {expandedSubItems.includes(item.label) ? (
                                <svgIcons.UpArrowIcon fill="#0F766E" />
                              ) : (
                                <svgIcons.DownArrowIcon />
                              )}
                            </span>
                          </button>
                          {expandedSubItems.includes(item.label) && (
                            <div className="mx-[10px] pl-[0px]">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className="block px-10 py-3 text-[18px] text-[#3A3A3A] font-roboto"
                                  target={subItem.target}
                                  rel={
                                    subItem.target === "_blank"
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  onClick={handleNavigation}
                                >
                                  {t(subItem.label)}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-10 py-3 text-[18px] text-[#3A3A3A] font-roboto"
                          onClick={handleNavigation}
                        >
                          {t(item.label)}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>

              <Link
                href="/notices"
                className="mx-[10px] block px-6 py-3 text-[20px] text-[#3A3A3A] font-roboto"
                onClick={handleNavigation}
              >
                {t("NOTICES")}
              </Link>

              <Link
                href="/dashboard"
                className="mx-[10px] block px-6 py-3 text-[20px] text-[#3A3A3A] font-roboto"
                onClick={handleNavigation}
              >
                {t("DASHBOARD")}
              </Link>
              <div className="flex flex-col center justify-center">
                <button
                  onClick={() => toggleSection("SUPPORT")}
                  className={`mx-[10px] px-6 py-3 text-left text-[20px] text-[#3A3A3A] font-roboto flex justify-between items-center hover:border-opacity-100 ${expandedSection === "SUPPORT" ? "border-b border-[#00A7A7] border-opacity-0" : ""}`}
                >
                  <span
                    className={`${expandedSection === "SUPPORT" ? "text-[#0F766E]" : ""}`}
                  >
                    {t("SUPPORT")}
                  </span>
                  <span className={`text-[#00A7A7]`}>
                    {expandedSection === "SUPPORT" ? (
                      <svgIcons.UpArrowIcon fill="#0F766E" />
                    ) : (
                      <svgIcons.DownArrowIcon />
                    )}
                  </span>
                </button>
                {expandedSection === "SUPPORT" && (
                  <div className="">
                    {MENU_ITEMS.SUPPORT.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-10 py-3 text-[18px] text-[#3A3A3A] font-roboto"
                        onClick={handleNavigation}
                      >
                        {t(item.label)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
            <div className="h-[30px] bg-[#E5E5E5]"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileHeader;
