import React, { ReactNode } from "react";

interface DetailCardProps {
  t: (key: string) => string;
  icon: ReactNode;
  heading: string;
  points: string[];
  className?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({
  t,
  icon,
  heading,
  points,
  className = "",
}) => {
  return (
    <div
      className={`font-roboto border border-[#CBD5E1] p-8 md:p-[clamp(20.62px,calc(20.62px+((32-20.62)*((100vw-1200px)/662))),32px)] rounded-lg shadow-sm ${className}`}
    >
      <div className="flex items-center mb-6 md:mb-[clamp(15.47px,calc(15.47px+((24-15.47)*((100vw-1200px)/662))),24px)]">
        <div className="text-teal-600 mr-4 md:mr-[clamp(9.67px,calc(9.67px+((16-9.67)*((100vw-1200px)/662))),16px)]">
          {icon}
        </div>
        <h3 className="text-[28px] md:text-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)] text-[#0F766E] font-semibold">
          {t(heading)}
        </h3>
      </div>
      <ul className="font-normal text-[20px] md:text-[clamp(12.88px,calc(12.88px+((20-12.88)*((100vw-1200px)/662))),20px)] leading-[28px] md:leading-[clamp(18.05px,calc(18.05px+((28-18.05)*((100vw-1200px)/662))),28px)] space-y-3 md:space-y-[clamp(9.67px,calc(9.67px+((12-9.67)*((100vw-1200px)/662))),12px)]">
        {points.map((point, index) => (
          <li key={index} className="flex flex-col items-start">
            <span className="text-[#334155]">{t(point)}</span>
            {index !== points.length - 1 && (
              <span className="border-b border-[#CBD5E1] w-[40%] mt-1"></span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DetailCard;
