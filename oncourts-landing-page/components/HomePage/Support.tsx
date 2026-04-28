import React, { useState } from "react";
import Link from "next/link";
import { svgIcons } from "../../data/svgIcons";
import { SupportData } from "../../data/SupportData";

const Support: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="p-8 px-6 md:px-16 py-12 min-h-[500px]" id="resources">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-teal">
          {SupportData?.header}
        </h2>
        <p className="text-darkGrey text-base md:text-lg lg:text-xl xl:text-xl leading-[140%] tracking-[0%] text-center font-raleway font-normal mt-6 mx-auto max-w-[75%] sm:max-w-[70%] md:max-w-[65%] lg:max-w-[60%] xl:max-w-[60%]">
          {SupportData?.SubHeader}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full">
        <div className="w-full md:w-1/2 bg-white rounded-xl border border-gray-300 shadow-md p-10 px-15">
          <h3 className="font-bold text-black mb-6 text-3xl">
            {SupportData?.Resources?.header}
          </h3>
          {SupportData?.Resources?.data?.map((data, index) => (
            <div key={index} className="mb-4">
              <Link href={data?.link} className="block mb-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onMouseEnter={() => setHoveredItem(data?.section)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                      <svgIcons.GuideIcon
                        isHovered={hoveredItem === data?.section}
                      />
                    </div>
                    <span className="text-gray-700 text-base md:text-lg hover:text-teal hover:font-semibold hover:underline font-raleway font-normal max-w-[360px]">
                      {data?.text}
                    </span>
                  </div>
                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    <svgIcons.ArrowIcon
                      isHovered={hoveredItem === data?.section}
                    />
                  </div>
                </div>
              </Link>
              {index !== SupportData?.Resources?.data?.length - 1 && (
                <hr className="my-2" />
              )}
            </div>
          ))}
        </div>

        <div className="w-full md:w-1/2 bg-white rounded-xl border border-gray-300 shadow-md p-10 px-15">
          <h3 className="font-bold text-black mb-6 text-3xl">
            {SupportData?.QuickLinks?.header}
          </h3>
          {SupportData?.QuickLinks?.data?.map((data, index) => (
            <div key={index} className="mb-4">
              <Link href={data?.link} className="block mb-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onMouseEnter={() => setHoveredItem(data?.section)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                      <svgIcons.GuideIcon
                        isHovered={hoveredItem === data?.section}
                      />
                    </div>
                    <span className="text-gray-700 text-base md:text-lg hover:text-teal hover:font-semibold hover:underline font-raleway font-normal">
                      {data?.text}
                    </span>
                  </div>
                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    <svgIcons.ArrowIcon
                      isHovered={hoveredItem === data?.section}
                    />
                  </div>
                </div>
              </Link>
              {index !== SupportData?.QuickLinks?.data?.length - 1 && (
                <hr className="my-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div id="contactUs" className="mt-12 text-center">
        <h3 className="text-4xl font-semibold text-black mb-6">
          {SupportData?.HelpDesk?.header}
        </h3>
        <div className="relative max-w-5xl mx-auto pt-4">
          <div className="absolute left-1/2 top-0 bottom-0 w-[0.5px] bg-teal"></div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2">
            {SupportData?.HelpDesk?.data?.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 pb-4 ${index < SupportData?.HelpDesk?.data?.length - 2
                    ? "border-b border-teal"
                    : ""
                  }`}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  {svgIcons[item?.icon] &&
                    React.createElement(svgIcons[item.icon])}
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-teal font-medium text-2xl flex flex-wrap items-start">
                    {item?.href ? (
                      <a href={item?.href}>
                        <strong>{item?.label}</strong> 
                        {item?.data ? `: ${item?.data}` : ""}
                      </a>
                    ) : (
                      <>
                        <strong>{item?.label}</strong> 
                        {item?.data ? `: ${item?.data}` : ""}
                      </>
                    )}
                  </div>
                  {item?.subData && (
                    <div className="text-teal">{item?.subData}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
