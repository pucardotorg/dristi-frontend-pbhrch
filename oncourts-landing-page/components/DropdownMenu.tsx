import React from "react";
import Link from "next/link";
import { svgIcons } from "../data/svgIcons";

interface DropdownItem {
  label: string;
  href?: string;
  target?: string;
  subItems?: DropdownItem[];
  isLast?: boolean;
}

interface DropdownMenuProps {
  items: DropdownItem[];
  isOpen: boolean;
  t: (key: string) => string;
  isLast?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  isOpen,
  t,
  isLast,
}) => {
  if (!isOpen) return null;

  const renderDropdownItem = (item: DropdownItem) => {
    if (item.subItems) {
      return (
        <div className="group relative" key={item.label}>
          <div className="flex items-center justify-between mx-[clamp(9.67px,calc(9.67px+((15-9.67)*((100vw-1200px)/662))),15px)] py-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)] hover:text-[#007E7E] group cursor-pointer border-b border-[#CBD5E1]">
            <span className="font-roboto font-medium tracking-[0.01em] text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] leading-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)]">
              {t(item.label)}
            </span>
            <span className="text-[#3A3A3A] group-hover:text-[#007E7E]">
              <svgIcons.RightArrowIcon className="w-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] h-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)]" />
            </span>
          </div>

          <div className="absolute left-full top-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)] min-w-[200px] bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 -mt-2 border-l border-[#E2E8F0]">
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.label}
                href={subItem.href || "#"}
                target={subItem.target}
                className="block mx-[clamp(9.67px,calc(9.67px+((15-9.67)*((100vw-1200px)/662))),15px)] py-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)] text-sm text-gray-700  hover:text-[#007E7E] border-b border-[#CBD5E1] last:border-b-0"
              >
                <div className="flex items-center center ">
                  <span className="text-[#3A3A3A] font-roboto font-medium tracking-[0.01em] hover:bg-gray-50 hover:text-[#007E7E] text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] leading-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)]">
                    {t(subItem.label)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href || "#"}
        className="block text-sm text-gray-700 hover:text-[#007E7E] border-b border-[#E5E5E5] last:border-b-0 py-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)] mx-[clamp(9.67px,calc(9.67px+((15-9.67)*((100vw-1200px)/662))),15px)]"
      >
        <span className="text-[#3A3A3A] font-roboto font-medium tracking-[0.01em] hover:bg-gray-50 hover:text-[#007E7E] text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] leading-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)]">
          {t(item.label)}
        </span>
      </Link>
    );
  };

  return (
    <div
      className={`absolute z-50 top-[clamp(38.02px,calc(38.02px+((59-38.02)*((100vw-1200px)/662))),59px)] min-w-[200px] bg-white shadow-lg ${isLast ? "right-0" : "left-0"}`}
    >
      <span className="text-[#3A3A3A] font-roboto font-medium tracking-[0.01em] text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] leading-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)]">
        {items.map(renderDropdownItem)}
      </span>
    </div>
  );
};

export default DropdownMenu;
