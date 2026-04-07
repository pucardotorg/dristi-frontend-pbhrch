import React from "react";
import Link from "next/link";
import { svgIcons } from "../data/svgIcons";

export interface NavItemProps {
  href: string;
  label: string;
  isActive?: boolean;
  hasDropdown?: boolean;
  onClick?: () => void;
  t: (key: string) => string;
  isDropdownOpen?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  label,
  isActive = false,
  hasDropdown = false,
  onClick,
  t,
  isDropdownOpen = false,
}) => {
  if (hasDropdown) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onClick?.();
        }}
        className={`text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] leading-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)] tracking-[0.01em] flex items-center gap-[clamp(2.58px,calc(2.58px+((4-2.58)*((100vw-1200px)/662))),4px)] px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] py-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)] font-medium font-roboto`}
      >
        <span
          className={
            isActive ? "text-[#0F766E]" : "text-[#3A3A3A] hover:text-[#0F766E]"
          }
        >
          {t(label)}
        </span>
        <span>
          {isDropdownOpen ? (
            <svgIcons.UpArrowIcon fill="#0F766E" />
          ) : (
            <svgIcons.DownArrowIcon />
          )}
        </span>
      </button>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] leading-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)] tracking-[0.01em] flex items-center gap-[clamp(2.58px,calc(2.58px+((4-2.58)*((100vw-1200px)/662))),4px)] px-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] py-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)] font-medium font-roboto
        ${isActive ? "text-[#0F766E]" : "text-[#3A3A3A] hover:text-[#0F766E]"}`}
    >
      {t(label)}
    </Link>
  );
};

export default NavItem;
