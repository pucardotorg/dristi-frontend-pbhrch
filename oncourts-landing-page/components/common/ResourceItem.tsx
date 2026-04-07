import React, { useState } from "react";
import Link from "next/link";
import { svgIcons } from "../../data/svgIcons";

interface ResourceItemProps {
  t: (key: string) => string;
  heading: string;
  items: {
    icon: string;
    text: string;
    link: string;
    section: string;
    newTab: boolean;
  }[];
}

const ResourceItem: React.FC<ResourceItemProps> = ({ t, heading, items }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="bg-white p-6 md:p-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)] rounded-xl shadow-sm border border-[#CBD5E1] h-full">
      <h2 className="text-2xl md:text-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)] font-semibold mb-4 md:mb-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)] text-[#3A3A3A]">
        {t(heading)}
      </h2>
      <div className="space-y-4 md:space-y-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)]">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <Link
              target={item.newTab ? "_blank" : "_self"}
              rel={item.newTab ? "noopener noreferrer" : undefined}
              href={item?.link}
              className="block mb-4 md:mb-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)]"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onMouseEnter={() => setHoveredItem(item?.section)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="font-roboto font-medium text-[#334155] text-lg md:text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] flex items-center space-x-4 md:space-x-[clamp(10.31px,calc(10.31px+((16-10.31)*((100vw-1200px)/662))),16px)]">
                  <div className="w-8 h-8 md:w-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] md:h-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] flex-shrink-0 flex items-center justify-center">
                    <svgIcons.GuideIcon
                      color="#0F766E"
                      hoverColor="#0F766E"
                      isHovered={hoveredItem === item?.section}
                    />
                  </div>
                  <span className="hover:text-[#0F766E] hover:font-semibold hover:underline">
                    {t(item?.text)}
                  </span>
                </div>
                <div className="w-5 h-5 md:w-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] md:h-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] ml-2 md:ml-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)] flex-shrink-0 flex items-center justify-center">
                  <svgIcons.ArrowIcon
                    color="#0F766E"
                    hoverColor="#0F766E"
                    isHovered={hoveredItem === item?.section}
                  />
                </div>
              </div>
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ResourceItem;
