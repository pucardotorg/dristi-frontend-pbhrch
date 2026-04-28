import React from "react";
import { useSafeTranslation } from "../../../hooks/useSafeTranslation";

interface RadioOption {
  id: string;
  label: string;
}

interface RadioButtonProps {
  id?: string;
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  inline?: boolean;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  helperText?: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  inline = true,
  className = "",
  error = false,
  disabled = false,
  helperText,
}) => {
  const { t } = useSafeTranslation();
  return (
    <div className={`font-roboto mb-0 ${className}`}>
      {label && (
        <label className="block text-lg font-medium text-[#334155]">
          {t(label)}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`font-roboto flex ${inline ? "space-x-6" : "flex-col space-y-2"}`}
      >
        {options.map((option, index) => (
          <label key={index} className="text-lg inline-flex items-center">
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className={`form-radio h-4 w-4 text-teal-600 accent-[#334155] ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              disabled={disabled}
            />
            <span
              className={`ml-2 text-lg font-medium ${disabled ? "text-gray-500" : "text-[#334155]"}`}
            >
              {t(option.label)}
            </span>
          </label>
        ))}
      </div>

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

export default RadioButton;
