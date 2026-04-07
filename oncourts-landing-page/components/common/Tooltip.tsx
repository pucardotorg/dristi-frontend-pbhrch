import React from "react";

interface TooltipProps {
  text: string;
  className?: string;
}

function Tooltip({ text, className = "" }: TooltipProps): JSX.Element {
  return (
    <div
      className={`fixed transform -translate-x-1/2 mt-2 px-4 py-2 bg-[#1E1E1E] text-white text-sm rounded-md z-[99999] min-w-[250px] max-w-[350px] break-words ${className} font-roboto`}
    >
      <div className="font-roboto absolute -top-2 left-1/2 transform -translate-x-1/2 border-8 border-transparent border-b-[#1E1E1E]" />
      {text}
    </div>
  );
}

export default Tooltip;
