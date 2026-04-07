import React from "react";
import { useSafeTranslation } from "../../../hooks/useSafeTranslation";

interface TextFieldProps {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
  labelMargin?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  helperText,
  className = "",
  error = false,
  disabled = false,
  minLength = 1,
  maxLength = 100,
  labelMargin = "mb-0",
}) => {
  const { t } = useSafeTranslation();

  // Common class for all form input elements for consistent styling
  const baseInputClass =
    "block w-full px-3 py-2 h-10 font-roboto text-base border-[1.5px] border-[#3D3C3C] rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500";
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
          className={`${labelMargin} block text-lg font-roboto font-normal text-[#0A0A0A]`}
        >
          {t(label)}
          {required && <span className="text-2xl text-red-500">*</span>}
        </label>
      )}

      <input
        id={id || name}
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        placeholder={t(placeholder)}
        disabled={disabled}
        minLength={minLength}
        maxLength={maxLength}
      />

      {helperText && (
        <p
          className={`font-roboto text-xs mt-1 ${error ? "text-red-500" : "text-gray-500"}`}
        >
          {t(helperText)}
        </p>
      )}
    </div>
  );
};

export default TextField;
