import React from "react";
import Pagination from "../../Utils/Pagination";
import { CaseSearchResult } from "../../../types";

interface CaseSearchTableProps {
  t: (key: string) => string;
  searchResults: CaseSearchResult[];
  onCaseProceed: (caseResult: CaseSearchResult) => void;
  totalCount?: number;
  offset?: number;
  limit?: number;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}

const CaseSearchTable: React.FC<CaseSearchTableProps> = ({
  t,
  searchResults,
  onCaseProceed,
  totalCount = 0,
  offset = 0,
  limit = 10,
  onNextPage,
  onPrevPage,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-roboto font-semibold text-2xl leading-[31.72px] tracking-[0%] text-[#0F172A]">
          {t("CASE_DETAILS")}
        </h2>
      </div>

      <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
        {searchResults.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-[#F8FAFC]">
              <tr className="font-roboto font-semibold text-[18px] text-left text-[#0F172A]">
                <th scope="col" className="p-3 w-2/6">
                  {t("CASE_TITLE")}
                </th>
                <th scope="col" className="p-3 w-1/6">
                  {t("CASE_NUMBER")}
                </th>
                <th scope="col" className="p-3 w-1/6">
                  {t("ACTION")}
                </th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result, index) => (
                <tr
                  key={index}
                  className="font-roboto bg-white border-t border-[#E2E8F0]"
                >
                  <td className="p-4 font-roboto text-[16px] leading-[18px] text-[#334155] break-words border-r border-[#E2E8F0]">
                    {t(result?.caseTitle || "")}
                  </td>
                  <td className="p-4 font-roboto text-[16px] leading-[18px] text-[#334155] break-words border-r border-[#E2E8F0]">
                    {result.courtCaseNumber ||
                      result.cmpNumber ||
                      result?.cnrNumber}
                  </td>
                  <td className="p-2 font-medium text-[16px] leading-[18px]">
                    <button
                      onClick={() => onCaseProceed(result)}
                      className="p-2 rounded-md border border-[#0F766E] text-[#0F766E]"
                    >
                      {t("CTC_APPLY")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center p-8">
            <div className="text-xl font-roboto font-medium text-gray-500">
              {t("NO_RESULTS_FOUND")}
            </div>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalCount > 0 && (
        <Pagination
          currentStartIndex={offset + 1}
          totalItems={totalCount}
          itemsPerPage={limit}
          onPrevPage={onPrevPage || (() => {})}
          onNextPage={onNextPage || (() => {})}
          isFirstPage={offset === 0}
          isLastPage={offset + limit >= totalCount}
        />
      )}
    </div>
  );
};

export default CaseSearchTable;
