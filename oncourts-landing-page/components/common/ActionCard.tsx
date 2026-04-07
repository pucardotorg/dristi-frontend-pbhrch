import React, { ReactNode } from "react";

interface ActionCardProps {
  t: (key: string) => string;
  icon: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "solid" | "outline";
  onClick?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  t,
  icon,
  title,
  description,
  buttonText,
  buttonVariant = "solid",
  onClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-20 bg-white border border-[#CBD5E1] rounded-lg shadow-sm transition-shadow duration-200 w-full sm:w-[calc(50%-12px)] flex-1">
      <div className="mb-6 flex justify-center items-center h-16 w-16 text-gray-600">
        {icon}
      </div>
      <h3 className="text-[24px] font-bold text-[#5F5F5F] mb-2 text-center">
        {t(title)}
      </h3>
      <p className="text-[16px] text-[#6E6E6E] mb-6 text-center">
        {t(description)}
      </p>
      <button
        onClick={onClick}
        className={`px-6 py-2 font-bold text-[16px] transition-colors duration-200 ${
          buttonVariant === "solid"
            ? "bg-[#007E7E] text-white hover:bg-[#0D635C]"
            : "bg-white text-[#007E7E] border border-[#007E7E] hover:bg-[#0D635C] hover:text-white"
        }`}
      >
        {t(buttonText)}
      </button>
    </div>
  );
};

export default ActionCard;
