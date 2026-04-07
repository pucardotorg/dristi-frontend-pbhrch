import React, { useState, useRef, useEffect } from "react";
import { useSafeTranslation } from "../../../hooks/useSafeTranslation";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  id?: string;
  name?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[] | string[];
  required?: boolean;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  helperText?: string;
  placeHolder?: string;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  className = "",
  error = false,
  disabled = false,
  helperText,
  placeHolder = "Select an option",
}) => {
  const { t } = useSafeTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isStringOptions = options.length > 0 && typeof options[0] === "string";
  const normalizedOptions: DropdownOption[] = isStringOptions
    ? (options as string[]).map((opt) => ({ value: opt, label: opt }))
    : (options as DropdownOption[]);

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleOptionSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-0" ref={dropdownRef}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-lg font-normal text-[#0A0A0A] mb-1 font-roboto"
        >
          {t(label)}
          {required && (
            <span className="text-red-500 text-2xl leading-none ml-1">*</span>
          )}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          id={id || name}
          name={name}
          onClick={toggleDropdown}
          disabled={disabled}
          className={`w-full h-10 px-3 pr-10 py-2 font-roboto text-base text-left border-[1.5px] rounded-md appearance-none flex items-center justify-between ${error ? "border-red-500 focus:ring-red-500" : "border-[#3D3C3C] focus:ring-teal-500 focus:border-teal-500"} ${disabled && "bg-gray-100 cursor-not-allowed text-gray-400"} ${className ? className : "bg-white"}`}
        >
          <span
            className={`block truncate ${!selectedOption ? "text-gray-400" : ""}`}
          >
            {selectedOption ? t(selectedOption?.label) : t(placeHolder)}
          </span>
          <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2">
            <svg
              className="h-8 w-8 text-gray-500 mt-2.5"
              viewBox="0 0 20 20"
              fill="#3D3C3C"
            >
              <path d="M7 7l3 3 3-3" />
            </svg>
          </span>
        </button>

        {isOpen && !disabled && (
          <ul className="absolute z-[9999] mt-1 w-full max-h-[200px] overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5">
            {normalizedOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-teal-100 ${
                  value === option.value
                    ? "bg-teal-50 font-medium font-roboto"
                    : ""
                }`}
              >
                <span className="block whitespace-normal break-words font-roboto">
                  {t(option.label)}
                </span>
              </li>
            ))}
          </ul>
        )}
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

export default CustomDropdown;
