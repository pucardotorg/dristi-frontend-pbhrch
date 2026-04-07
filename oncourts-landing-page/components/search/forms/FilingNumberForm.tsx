import React from "react";
import { TextField } from "../../ui/form";
import { CourtRoom } from "../../../types";
import CustomDropdown from "../../ui/form/CustomDropdown";

interface FilingNumberFormProps {
  selectedCourt: string;
  code: string;
  caseNumber: string;
  selectedYear: string;
  onCourtChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onCaseNumberChange: (value: string) => void;
  onYearChange: (value: string) => void;
  courtOptions: CourtRoom[];
}

const FilingNumberForm: React.FC<FilingNumberFormProps> = ({
  selectedCourt,
  code,
  caseNumber,
  selectedYear,
  onCourtChange,
  onCodeChange,
  onCaseNumberChange,
  onYearChange,
  courtOptions,
}) => {
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

      <TextField label="CODE" value={code} onChange={onCodeChange} required />

      <TextField
        label="FILING_NUMBER"
        value={caseNumber}
        onChange={(value) => {
          const digitsOnly = value.replace(/\D/g, "");
          onCaseNumberChange(digitsOnly);
        }}
        maxLength={6}
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

export default FilingNumberForm;
