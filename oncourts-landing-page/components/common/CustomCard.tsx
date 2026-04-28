import React from "react";

interface CustomCardProps {
  title: string;
  description: string;
}

const CustomCard: React.FC<CustomCardProps> = ({ title, description }) => {
  return (
    <div className="font-roboto bg-white p-8 md:p-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] rounded-lg shadow-md flex flex-col">
      <span className="text-[32px] md:text-[clamp(18.05px,calc(18.05px+((32-18.05)*((100vw-1200px)/662))),32px)] leading-[36px] md:leading-[clamp(23.18px,calc(23.18px+((36-23.18)*((100vw-1200px)/662))),36px)] tracking-[-0.6px] font-medium font-roboto text-[#3A3A3A]">
        {title}
      </span>
      <div className="border-b border-[#CBD5E1] my-2 md:my-[clamp(5.16px,calc(5.16px+((8-5.16)*((100vw-1200px)/662))),8px)] w-[80%]"></div>
      <p className="text-[20px] md:text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] leading-[28px] md:leading-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)] tracking-[-0.2px] font-normal text-[#334155]">
        {description}
      </p>
    </div>
  );
};

export default CustomCard;
