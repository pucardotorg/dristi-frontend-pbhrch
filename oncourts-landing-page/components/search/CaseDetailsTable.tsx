import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { CaseResult, FilterState } from "../../types";
import Pagination from "../Utils/Pagination";
import { formatDate } from "../../utils/formatDate";

interface CaseDetailsTableProps {
  t: (key: string) => string;
  selectedTab: string;
  searchResults: CaseResult[];
  onViewCaseDetails: (caseResult: CaseResult) => void;
  totalCount?: number;
  offset?: number;
  limit?: number;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  filterState: FilterState;
  onSearch: (filters: FilterState) => void;
}

const CaseDetailsTable: React.FC<CaseDetailsTableProps> = ({
  t,
  selectedTab,
  searchResults,
  onViewCaseDetails,
  totalCount = 0,
  offset = 0,
  limit = 10,
  onNextPage,
  onPrevPage,
  filterState,
  onSearch,
}) => {
  // State for the case title search input
  const [caseTitleInput, setCaseTitleInput] = useState(
    filterState?.caseTitle || ""
  );

  // Handle input change
  const handleCaseTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaseTitleInput(e.target.value);
  };

  // Handle search button click
  const handleSearch = () => {
    onSearch({
      ...filterState,
      caseTitle: caseTitleInput,
    });
  };

  // Handle reset button click
  const handleReset = () => {
    setCaseTitleInput("");
    onSearch({
      ...filterState,
      caseTitle: "",
    });
  };
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-roboto font-semibold text-2xl leading-[31.72px] tracking-[0%] text-[#0F172A]">
          {t("CASE_DETAILS")}
        </h2>
        {["advocate", "litigant", "all"].includes(selectedTab) && (
          <div className="relative text-base flex gap-2">
            <input
              type="text"
              placeholder={t("SEARCH_BY_CASE_TITLE")}
              value={caseTitleInput}
              onChange={handleCaseTitleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="pl-10 pr-4 py-2 font-roboto font-medium text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#334155]" />
            <button
              onClick={handleSearch}
              className="px-3 py-1.5 text-lg font-roboto font-medium text-[#0F766E] hover:text-green-800 bg-white rounded-lg border border-[#0F766E]"
            >
              {t("SEARCH")}
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-lg font-roboto font-medium text-[#64748B] hover:text-green-800 bg-white rounded-lg border border-[#64748B]"
            >
              {t("RESET")}
            </button>
          </div>
        )}
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
                  {t("NEXT_HEARING_DATE")}
                </th>
                <th scope="col" className="p-3 w-1/6">
                  {t("PURPOSE")}
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
                    {result.stNumber || result.cmpNumber}
                  </td>
                  <td className="p-4 font-roboto text-[16px] leading-[18px] text-[#334155] break-words border-r border-[#E2E8F0]">
                    {formatDate(result.nextHearingDate)}
                  </td>
                  <td className="p-4 font-roboto text-[16px] leading-[18px] text-[#334155] break-words border-r border-[#E2E8F0]">
                    {t(result?.purpose || "")}
                  </td>
                  <td className="p-2 font-medium text-[16px] leading-[18px] text-[#334155]">
                    <button
                      onClick={() => onViewCaseDetails(result)}
                      className="p-2 rounded-md border-2 text-teal-600 hover:text-teal-900"
                    >
                      {t("VIEW_DETAILS")}
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
      {totalCount > 0 &&
        ["all", "advocate", "litigant"].includes(selectedTab) && (
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

export default CaseDetailsTable;
