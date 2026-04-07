import React from "react";
import { TextField } from "../../ui/form";
import { newCaseSearchConfig } from "../../../data/newCaseSearchConfig";

interface CNRNumberFormProps {
  cnrNumber: string;
  onChange: (value: string) => void;
}

const CNRNumberForm: React.FC<CNRNumberFormProps> = ({
  cnrNumber,
  onChange,
}) => {
  return (
    <div>
      <TextField
        label={newCaseSearchConfig.cnrNumber.label}
        value={cnrNumber}
        onChange={onChange}
        placeholder={newCaseSearchConfig.cnrNumber.placeholder}
        required={true}
        minLength={4}
      />
    </div>
  );
};

export default CNRNumberForm;
