import React from "react";
import { useSafeTranslation } from "../../../hooks/useSafeTranslation";

interface DatePickerProps {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  helperText?: string;
  min?: string;
  max?: string;
}

const DatePickerComponent: React.FC<DatePickerProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  className = "",
  error = false,
  disabled = false,
  helperText,
  min,
  max,
}) => {
  const { t } = useSafeTranslation();
  // Common class for all form input elements for consistent styling
  const baseInputClass =
    "block w-full px-3 py-2 h-10 font-roboto text-base bg-[#F8FAFC] border-[1.5px] border-[#94A3B8] rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500";
  const errorClass = error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "";
  const disabledClass = disabled ? "bg-gray-100 cursor-not-allowed" : "";

  const inputClass = `${baseInputClass} ${errorClass} ${disabledClass} ${className}`;

  return (
    <div className="mb-0">
      {label && (
        <label
          htmlFor={id || name}
          className="block text-lg font-roboto font-medium text-[#0A0A0A] mb-1"
        >
          {t(label)}
          {required && <span className="text-2xl text-red-500">*</span>}
        </label>
      )}

      <input
        id={id || name}
        name={name}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        disabled={disabled}
        min={min}
        max={max}
      />

      {helperText && (
        <p
          className={`text-xs mt-1 ${error ? "text-red-500" : "text-gray-500"}`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default DatePickerComponent;
