import React, { useEffect, useState } from "react";
import {
  CaseStage,
  CaseStatus,
  CaseType,
  CourtRoom,
  FilterState,
} from "../../types";
import CustomDropdown from "../ui/form/CustomDropdown";
import CustomDatePicker from "../ui/form/CustomDatePicker";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";

interface MobileFiltersProps {
  filterState: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  setShowMobileFilter: (value: boolean) => void;
  courtOptions: CourtRoom[];
  caseStageOptions: CaseStage[];
  caseTypeOptions: CaseType[];
  caseStatusOptions: CaseStatus[];
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  filterState,
  onApplyFilters,
  onResetFilters,
  setShowMobileFilter,
  courtOptions,
  caseStageOptions,
  caseTypeOptions,
  caseStatusOptions,
}) => {
  const { t } = useSafeTranslation();
  // Local state to track filter changes before applying them
  const [localFilters, setLocalFilters] = useState<FilterState>(filterState);

  // State to control the opening of date pickers
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);

  // Update local filters when parent filterState changes
  useEffect(() => {
    setLocalFilters(filterState);
  }, [filterState]);

  // Generate years from 2024 to current year
  const generateYearOptions = (): string[] => {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();
    const years: string[] = [];

    for (let year = startYear; year <= currentYear; year++) {
      years.push(year.toString());
    }

    return years;
  };

  const yearOptions = generateYearOptions();

  // Handle local filter changes
  const handleLocalFilterChange = (field: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Apply all filters at once when search button is clicked
  const applyFilters = () => {
    onApplyFilters(localFilters);
  };

  // Function to handle calendar icon click for the "From" date picker
  const handleFromDateIconClick = () => {
    setFromDateOpen(!fromDateOpen);
    setToDateOpen(false); // Close the other date picker if open
  };

  // Function to handle calendar icon click for the "To" date picker
  const handleToDateIconClick = () => {
    setToDateOpen(!toDateOpen);
    setFromDateOpen(false); // Close the other date picker if open
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    // Save the current overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on the background
    document.body.style.overflow = "hidden";

    // Cleanup function to restore original overflow when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center px-6">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-['Baskerville'] font-semibold text-[#0F172A]">
            {t("FILTER")}
          </h2>
          <button
            onClick={() => setShowMobileFilter(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-grow">
          {/* Court Name */}
          <div className="mb-4">
            <CustomDropdown
              label={"COURT_NAME"}
              placeHolder={"SELECT_COURT"}
              value={localFilters.courtId || courtOptions[0]?.code || ""}
              onChange={(value) => handleLocalFilterChange("courtId", value)}
              options={
                courtOptions?.map((court: CourtRoom) => ({
                  label: court?.name || "",
                  value: court?.code || "",
                })) || []
              }
              className="w-full"
            />
          </div>

          {/* Case Type */}
          <div className="mb-4">
            <CustomDropdown
              label={t("CASE_TYPE")}
              placeHolder={t("SELECT_CASE_TYPE")}
              value={localFilters.caseType}
              onChange={(value) => handleLocalFilterChange("caseType", value)}
              options={
                caseTypeOptions?.map((type: CaseType) => ({
                  label: type?.name || "",
                  value: type?.code || "",
                })) || []
              }
              className="w-full"
            />
          </div>

          {/* Next Hearing Date */}
          <div className="mb-4">
            <label className="block text-lg font-roboto font-medium text-[#0A0A0A] mb-1">
              {t("NEXT_HEARING_DATE")}
            </label>
            <div className="mb-3">
              <label className="block text-sm font-roboto font-medium text-[#0A0A0A] mb-1">
                {t("FROM")}
              </label>
              <CustomDatePicker
                selected={
                  localFilters.hearingDateFrom
                    ? new Date(localFilters.hearingDateFrom)
                    : null
                }
                onChange={(date: Date | null) =>
                  handleLocalFilterChange(
                    "hearingDateFrom",
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
                isOpen={fromDateOpen}
                onIconClick={handleFromDateIconClick}
                onClickOutside={() => setFromDateOpen(false)}
                padding="px-1"
                borderRadius="rounded-md"
                borderColor="border-[#3D3C3C]"
              />
            </div>
            <div>
              <label className="block text-sm font-roboto font-medium text-[#0A0A0A] mb-1">
                {t("TO")}
              </label>
              <CustomDatePicker
                selected={
                  localFilters.hearingDateTo
                    ? new Date(localFilters.hearingDateTo)
                    : null
                }
                onChange={(date: Date | null) =>
                  handleLocalFilterChange(
                    "hearingDateTo",
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
                isOpen={toDateOpen}
                onIconClick={handleToDateIconClick}
                onClickOutside={() => setToDateOpen(false)}
                padding="px-1"
                borderRadius="rounded-lg"
                borderColor="border-[#3D3C3C]"
              />
            </div>
          </div>

          {/* Case Stage */}
          <div className="mb-4">
            <CustomDropdown
              label="CASE_STAGE"
              placeHolder="SELECT_CASE_STAGE"
              value={localFilters.caseSubStage}
              onChange={(value) =>
                handleLocalFilterChange("caseSubStage", value)
              }
              options={
                caseStageOptions?.map((stage: CaseStage) => ({
                  label: stage?.subStage || "",
                  value: stage?.code || "",
                })) || []
              }
              className="w-full"
            />
          </div>

          {/* Case Status */}
          <div className="mb-4">
            <CustomDropdown
              label="CASE_STATUS"
              placeHolder="SELECT_CASE_STATUS"
              value={localFilters.caseStatus}
              onChange={(value) => handleLocalFilterChange("caseStatus", value)}
              options={
                caseStatusOptions?.map((status: CaseStatus) => ({
                  label: status?.name || "",
                  value: status?.code || "",
                })) || []
              }
              className="w-full"
            />
          </div>

          {/* Year of Filing */}
          <div className="mb-4">
            <CustomDropdown
              label="YEAR_OF_FILING"
              placeHolder="SELECT_YEAR"
              value={localFilters.yearOfFiling}
              onChange={(value) =>
                handleLocalFilterChange("yearOfFiling", value)
              }
              options={yearOptions}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onResetFilters();
                setShowMobileFilter(false);
              }}
              className="px-4 py-2 text-[#334155] bg-white border border-[#E2E8F0] rounded-lg font-medium"
            >
              {t("CLEAR")}
            </button>
            <button
              onClick={() => {
                applyFilters();
                setShowMobileFilter(false);
              }}
              className="px-4 py-2 text-[#0F766E] bg-[white] border border-[#0F766E] rounded-lg font-medium"
            >
              {t("APPLY_FILTER")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;
