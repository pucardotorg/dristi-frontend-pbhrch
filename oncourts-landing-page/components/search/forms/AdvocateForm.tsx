import React from "react";
import { TextField, RadioButton } from "../../ui/form";
import CustomDropdown from "../../ui/form/CustomDropdown";

interface AdvocateFormProps {
  isMobile: boolean;
  advocateSearchMethod: string;
  barCode: string;
  stateCode: string;
  selectedYear: string;
  advocateName: string;
  onMethodChange: (value: string) => void;
  onBarCodeChange: (value: string) => void;
  onStateCodeChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onNameChange: (value: string) => void;
}

const AdvocateForm: React.FC<AdvocateFormProps> = ({
  isMobile,
  advocateSearchMethod,
  barCode,
  stateCode,
  selectedYear,
  advocateName,
  onMethodChange,
  onBarCodeChange,
  onStateCodeChange,
  onYearChange,
  onNameChange,
}) => {
  const radioOptions = [
    { id: "bar_code", label: "BAR_CODE" },
    { id: "advocate_name", label: "ADVOCATE_NAME" },
  ];

  // Removed dropdown options for state code and barcode - using TextField instead

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
    <React.Fragment>
      <RadioButton
        name="advocateSearchMethod"
        label="SELECT_METHOD"
        value={advocateSearchMethod}
        onChange={onMethodChange}
        options={radioOptions}
        className={`flex ${isMobile ? "flex-col gap-3" : "items-center gap-4"}`}
        inline={isMobile ? false : true}
      />

      {advocateSearchMethod === "bar_code" ? (
        <div className={`${isMobile ? "" : "grid grid-cols-3 gap-4"} mt-4`}>
          <TextField
            label="STATE_CODE"
            value={stateCode}
            onChange={onStateCodeChange}
            required
          />
          <TextField
            label="BARCODE"
            value={barCode}
            onChange={onBarCodeChange}
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
        </div>
      ) : (
        <div className={isMobile ? "" : "grid grid-cols-3 gap-4 mt-4"}>
          <div className={isMobile ? "" : "col-span-1"}>
            <TextField
              label="NAME"
              value={advocateName}
              onChange={onNameChange}
              required
              helperText="ADVOCATE_FORM_NAME_FIELD_HELPER_TEXT"
              error={advocateName.length > 0 && advocateName.length < 3}
            />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default AdvocateForm;
