import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { svgIcons } from "../data/svgIcons.js";
import LanguageSelector from "./Utils/ChangeLanguage";

interface NavLinkProps {
  href: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center h-[90px] px-6 transition 
        hover:bg-white/30 
        ${isActive ? "bg-white/30" : "font-medium"} 
        text-white text-lg`}
    >
      {label}
    </Link>
  );
};

const DropdownNavLink: React.FC<{
  label: string;
  isOpen: boolean;
  toggleDropdown: () => void;
  options: { label: string; href: string }[];
}> = ({ label, isOpen, toggleDropdown, options }) => {
  const router = useRouter();
  const isAnyOptionActive = options.some(
    (option) => router.pathname === option.href
  );
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`flex items-center h-[90px] px-6 transition 
          hover:bg-white/30 
          ${isAnyOptionActive ? "bg-white/30" : "font-medium"} 
          text-white text-lg focus:outline-none`}
      >
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`ml-2 h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 bg-white shadow-lg rounded w-max min-w-[10rem]">
          {options.map((option, index) => (
            <React.Fragment key={option.href}>
              <Link href={option.href} passHref>
                <div className="block px-4 py-3 text-[#0a0a0a] hover:text-[#007E7E] cursor-pointer text-xl">
                  {option.label}
                </div>
              </Link>
              {index < options.length - 1 && (
                <div className="border-b border-gray-200 w-4/5 mx-auto"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const router = useRouter();
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);

  const toggleAboutDropdown = () => {
    setAboutDropdownOpen(!aboutDropdownOpen);
    setSupportDropdownOpen(false);
  };

  const toggleSupportDropdown = () => {
    setSupportDropdownOpen(!supportDropdownOpen);
    setAboutDropdownOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = () => {
      setAboutDropdownOpen(false);
      setSupportDropdownOpen(false);
    };
    const handleRouteChange = () => {
      setAboutDropdownOpen(false);
      setSupportDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      router.events.on("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div>
      <div className="flex justify-between items-center px-20 py-[14px] gap-[10px] w-full h-[80px] bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center flex-shrink-0 h-8 md:w-32 lg:w-40"
        >
          <div className="w-[123px] h-[72.63px] bg-contain bg-no-repeat bg-left">
            <Link href="/" passHref>
              <Image
                src="/images/logo.png"
                alt="OnCourts Logo"
                width={123}
                height={73}
              />
            </Link>
          </div>
        </motion.div>
      </div>

      <nav className="bg-[#007E7E]">
        <div className="justify-center hidden mx-12 shadow-sm sm:hidden md:block">
          <div
            className="relative flex items-center justify-between h-[90px]"
            onClick={handleDropdownClick}
          >
            <div className="flex items-center justify-center flex-1 gap-6 sm:items-stretch sm:justify-start">
              <NavLink href="/" label="Home" />
              <DropdownNavLink
                label="About Us"
                isOpen={aboutDropdownOpen}
                toggleDropdown={toggleAboutDropdown}
                options={[
                  { label: "About Us", href: "/about" },
                  { label: "List of Judges", href: "/about/judges" },
                ]}
              />
              <NavLink href="/notice-board" label="Notice Board" />
              <NavLink href="/whats-new" label="What's New" />
              <DropdownNavLink
                label="Support"
                isOpen={supportDropdownOpen}
                toggleDropdown={toggleSupportDropdown}
                options={[
                  { label: "ON Court Resources", href: "/#resources" },
                  { label: "FAQs & Contact Details", href: "/support/faqs" },
                ]}
              />
              <NavLink href="/display-board" label="Cause List Display" />
            </div>
            <LanguageSelector className="ml-auto mr-2" />

            <div className="flex flex-row justify-center items-center p-[10px] gap-[10px] w-[200px] h-[50px] bg-white rounded-[8px]">
              <Link href="/search" passHref>
                <button className="flex items-center font-semibold text-[#007E7E]">
                  <svgIcons.SearchIcon />
                  <span className="ml-2 hidden md:inline">
                    Search for a Case
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
