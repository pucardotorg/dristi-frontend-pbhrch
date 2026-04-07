import React from "react";
import { TextField } from "../../ui/form";

interface LitigantFormProps {
  isMobile: boolean;
  litigantName: string;
  onChange: (value: string) => void;
}

const LitigantForm: React.FC<LitigantFormProps> = ({
  isMobile,
  litigantName,
  onChange,
}) => {
  return (
    <div className={isMobile ? "" : "col-span-4"}>
      <div className={isMobile ? "" : "grid grid-cols-3 gap-4"}>
        <div className="col-span-1">
          <TextField
            label="LITIGANT_NAME"
            value={litigantName}
            onChange={onChange}
            helperText="LITIGANT_FORM_HELPER_TEXT"
            error={litigantName.length > 0 && litigantName.length < 3}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default LitigantForm;
