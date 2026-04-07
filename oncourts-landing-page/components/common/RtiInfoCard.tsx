import React from "react";

interface InfoCardProps {
  t: (key: string) => string;
  items: {
    label: string;
    value: string;
    icon?: React.ReactNode;
    isLink?: boolean;
    href?: string;
  }[];
  className?: string;
}

const RtiInfoCard: React.FC<InfoCardProps> = ({ t, items, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-lg border border-[#E2E8F0] shadow-sm mb-8 ${className}`}
    >
      <div>
        {items.map((item, index) => (
          <div
            key={index}
            className={`${index !== items.length - 1 ? "border-b border-[#E2E8F0]" : ""}`}
          >
            <div className="p-4 flex items-center font-libre text-[#0F172A] font-semibold text-xl border-b border-[#E2E8F0] bg-[#F8FAFC]">
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {t(item.label)}
            </div>
            {item.isLink && item.href ? (
              <a
                href={item.href}
                className="text-[#0F766E] hover:underline text-lg font-medium"
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                {item.value}
              </a>
            ) : (
              <div className="p-4 font-roboto text-[#334155] font-medium text-lg">
                {item.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RtiInfoCard;
