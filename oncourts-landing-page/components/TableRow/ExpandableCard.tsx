import React, { useState } from "react";
import { svgIcons } from "../../data/svgIcons";
import { formatDate } from "../../utils/formatDate";

interface ExpandableCardProps {
  t: (key: string) => string;
  index: number;
  caseData: {
    caseNumber: string;
    nextHearingDate: string;
    caseTitle: string;
    purpose: string;
  };
  onViewDetails: () => void;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({
  t,
  index,
  caseData,
  onViewDetails,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="font-roboto bg-white shadow-sm w-full overflow-hidden">
      {/* Header section - always visible */}
      {/* Labels row */}
      {index === 0 && (
        <div className="grid grid-cols-2 bg-[#F8FAFC] font-libre">
          <div className="p-3 border-r border-b border-[#E2E8F0]">
            <div className="text-[14px] text-[#0F172A] font-semibold">
              {t("CASE_NUMBER")}
            </div>
          </div>
          <div className="p-3 border-b border-[#E2E8F0]">
            <div className="text-[14px] text-[#0F172A] font-semibold">
              {t("NEXT_HEARING_DATE")}
            </div>
          </div>
        </div>
      )}

      {/* Values row */}
      <div
        className={`grid grid-cols-2 relative font-roboto ${isExpanded ? "bg-[#F0FDFA]" : "bg-white"}`}
      >
        <div className="p-3 border-x border-b border-[#E2E8F0]">
          <div className="text-[14px] text-[#334155] font-medium">
            {caseData.caseNumber}
          </div>
        </div>
        <div className="p-3 border-r border-b border-[#E2E8F0]">
          <div className="text-[14px] text-[#334155] font-medium">
            {formatDate(caseData.nextHearingDate)}
          </div>
        </div>

        {/* Arrow button positioned on the right */}
        <button
          onClick={toggleExpand}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? <svgIcons.UpArrowIcon /> : <svgIcons.DownArrowIcon />}
        </button>
      </div>

      {/* Expandable content */}
      {isExpanded && (
        <div className="p-4 border-x-2 border-t border-b-2 border-[#E2E8F0] bg-white">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 items-center">
              <div className="text-[14px] text-[#0F172A] font-semibold">
                {t("CASE_TITLE")}:
              </div>
              <div className="ps-3 text-[14px] text-[#334155]">
                {caseData.caseTitle}
              </div>
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-[14px] text-[#0F172A] font-semibold">
                {t("PURPOSE")}:
              </div>
              <div className="ps-3 text-[14px] text-[#334155]">
                {t(caseData.purpose)}
              </div>
            </div>
            <div className="grid grid-cols-2 items-center">
              <div className="text-[14px] text-[#0F172A] font-semibold">
                {t("ACTION")}:
              </div>
              <button
                onClick={onViewDetails}
                className="ms-2 font-[Inter] font-semibold py-2 bg-white border-2 border-[#E2E8F0] rounded text-[#334155] text-[14px] w-full text-center"
              >
                {t("VIEW_DETAILS")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableCard;
