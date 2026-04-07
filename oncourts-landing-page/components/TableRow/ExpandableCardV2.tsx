import React from "react";
import { svgIcons } from "../../data/svgIcons";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { getStatusStyle } from "../../pages/display-board";

interface CaseData {
  caseNumber?: string;
  caseTitle?: string;
  purpose?: string;
  status?: string;
  advocates?: JSX.Element;
}

interface ExpandableCardV2Props {
  caseData: CaseData;
  onViewDetails: () => void;
}

const ExpandableCardV2: React.FC<ExpandableCardV2Props> = ({ caseData }) => {
  const { t } = useSafeTranslation();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const statusColor = getStatusStyle(caseData.status || "");

  return (
    <div
      className={`border-b  border-[#E2E8F0] px-0 mt-0 border-l border-r font-roboto`}
    >
      <div
        className={`grid grid-cols-[45%_45%_10%] items-center px-[5px] cursor-pointer h-[41px] relative ${isExpanded ? "bg-[#F0FDFA]" : ""}`}
        onClick={toggleExpand}
      >
        <div className="absolute left-[45%] top-0 bottom-0 w-[1px] bg-[#E2E8F0]"></div>
        <span className="h-[21px] font-roboto font-normal text-[14.07px] leading-[20px] text-[#334155] pr-[5px]">
          {caseData.caseNumber}
        </span>
        <span
          className={`flex flex-row justify-center items-center py-[8.22px] px-[10px] ml-[10px] w-max gap-[4.11px] h-[20.55px] rounded-[4.19px] ${statusColor}`}
        >
          <h2
            className={`px-3 py-1 rounded-full font-medium font-roboto text-[13.36px] leading-[21px]`}
          >
            {t(caseData.status || "")}
          </h2>
        </span>
        <button className="py-2 px-[5px] border-l border-[#E2E8F0] h-[41px] justify-self-end">
          {isExpanded ? (
            <svgIcons.UpArrowIcon fill="#334155" width="16" />
          ) : (
            <svgIcons.DownArrowIcon fill="#334155" width="16" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div
          className={`border-t border-[#E2E8F0] py-4 px-[5px] space-y-4 w-full}`}
        >
          <div className="flex flex-col w-full gap-4">
            <div className="grid grid-cols-[45%_45%_10%] items-center min-h-[32px]">
              <div className="font-roboto font-semibold text-[14.07px] leading-[20px] text-[#0F172A]">
                {t("CASE_TITLE")}:
              </div>
              <div className="text-[14.07px] leading-[20px] text-[#334155]">
                {caseData.caseTitle || ""}
              </div>
              <div></div>
            </div>
            <div className="grid grid-cols-[45%_45%_10%] items-center min-h-[32px]">
              <div className="font-roboto font-semibold text-[14.07px] leading-[20px] text-[#0F172A]">
                {t("PURPOSE")}:
              </div>
              <div className="text-[14.07px] leading-[20px] text-[#334155]">
                {t(caseData.purpose || "")}
              </div>
              <div></div>
            </div>
            <div className="grid grid-cols-[45%_45%_10%] items-center min-h-[32px]">
              <div className="font-roboto font-semibold text-[14.07px] leading-[20px] text-[#0F172A]">
                {t("ADVOCATE")}:
              </div>
              <div>
                {caseData?.advocates || ""}
              </div>
              <div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableCardV2;
