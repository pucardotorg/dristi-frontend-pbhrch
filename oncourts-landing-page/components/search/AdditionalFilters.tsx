import React, { useState, useEffect } from "react";
import {
  CaseStage,
  CaseStatus,
  CaseType,
  CourtRoom,
  FilterState,
} from "../../types";
import CustomDropdown from "../ui/form/CustomDropdown";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import CustomDatePicker from "../ui/form/CustomDatePicker";

interface AdditionalFiltersProps {
  selectedTab: string;
  filterState: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  courtOptions: CourtRoom[];
  caseStageOptions: CaseStage[];
  caseTypeOptions: CaseType[];
  caseStatusOptions: CaseStatus[];
}

const AdditionalFilters: React.FC<AdditionalFiltersProps> = ({
  selectedTab,
  filterState,
  onApplyFilters,
  onResetFilters,
  courtOptions,
  caseStageOptions,
  caseTypeOptions,
  caseStatusOptions,
}) => {
  const { t } = useSafeTranslation();
  // Local state to track filter changes before applying them
  const [localFilters, setLocalFilters] = useState<FilterState>({
    ...filterState,
    courtId: courtOptions[0]?.code || "",
  });
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

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm overflow-visible border border-[#E2E8F0]">
      <div className="p-4 bg-[#F8FAFC]">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-roboto font-semibold text-[#0F172A]">
            {t("FILTER")}
          </h2>

          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="px-2 text-lg font-roboto font-medium text-[#2563EB] hover:text-blue-800 bg-white rounded-lg border border-[#E2E8F0]"
            >
              {t("APPLY_FILTER")}
            </button>
            <button
              onClick={onResetFilters}
              className="text-lg font-roboto font-medium text-[#64748B] hover:text-gray-800"
            >
              {t("RESET_ALL")}
            </button>
          </div>
        </div>

        <hr className="my-2 border-t border-[#CBD5E1]" />

        {(selectedTab === "advocate" ||
          selectedTab === "litigant" ||
          selectedTab === "all") && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
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
              className="bg-[#F8FAFC] border-[#94A3B8]"
            />

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
              className="bg-[#F8FAFC] border-[#94A3B8]"
            />

            <div className="col-span-2">
              <label className="block text-lg font-roboto font-normal text-[#0A0A0A] mb-1">
                {t("NEXT_HEARING_DATE")}
              </label>
              <div className="flex items-center gap-1">
                <div className="flex-1">
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
                    borderColor="border-[#94A3B8]"
                    backgroundColor="bg-[#F8FAFC]"
                  />
                </div>

                <span className="text-[#0A0A0A] text-lg font-roboto font-normal">
                  To
                </span>

                <div className="flex-1">
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
                    borderColor="border-[#94A3B8]"
                    backgroundColor="bg-[#F8FAFC]"
                  />
                </div>
              </div>
            </div>

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
              className="bg-[#F8FAFC] border-[#94A3B8]"
            />

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
              className="bg-[#F8FAFC] border-[#94A3B8]"
            />

            <CustomDropdown
              label="YEAR_OF_FILING"
              placeHolder="SELECT_YEAR"
              value={localFilters.yearOfFiling}
              onChange={(value) =>
                handleLocalFilterChange("yearOfFiling", value)
              }
              options={yearOptions}
              className="bg-[#F8FAFC] border-[#94A3B8]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalFilters;
