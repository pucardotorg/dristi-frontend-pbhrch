import React from "react";
import { TextField } from "../../ui/form";
import { CourtRoom } from "../../../types";
import CustomDropdown from "../../ui/form/CustomDropdown";

interface CaseNumberFormProps {
  selectedCourt: string;
  selectedCaseType: string;
  caseNumber: string;
  selectedYear: string;
  onCourtChange: (value: string) => void;
  onCaseTypeChange: (value: string) => void;
  onCaseNumberChange: (value: string) => void;
  onYearChange: (value: string) => void;
  courtOptions: CourtRoom[];
}

const CaseNumberForm: React.FC<CaseNumberFormProps> = ({
  selectedCourt,
  selectedCaseType,
  caseNumber,
  selectedYear,
  onCourtChange,
  onCaseTypeChange,
  onCaseNumberChange,
  onYearChange,
  courtOptions,
}) => {
  const caseTypeOptions = ["ST", "CMP"];

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

  return (
    <>
      <CustomDropdown
        label="COURT"
        placeHolder="SELECT_COURT"
        value={selectedCourt || courtOptions?.[0]?.code || ""}
        onChange={onCourtChange}
        options={
          courtOptions?.map((court: CourtRoom) => ({
            label: court?.name || "",
            value: court?.code || "",
          })) || []
        }
        required
        className="bg-white"
      />

      <CustomDropdown
        label="CASE_TYPE"
        placeHolder="SELECT_CASE_TYPE"
        value={selectedCaseType}
        onChange={onCaseTypeChange}
        options={caseTypeOptions}
        required
        className="bg-white"
      />

      <TextField
        label="CASE_NUMBER"
        value={caseNumber}
        onChange={(value) => {
          const digitsOnly = value.replace(/\D/g, "");
          onCaseNumberChange(digitsOnly);
        }}
        required
      />

      <CustomDropdown
        label="YEAR"
        placeHolder="SELECT_YEAR"
        value={selectedYear}
        onChange={onYearChange}
        options={yearOptions}
        required
        className="bg-white"
      />
    </>
  );
};

export default CaseNumberForm;
