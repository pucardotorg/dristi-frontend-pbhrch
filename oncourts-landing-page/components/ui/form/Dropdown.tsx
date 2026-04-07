import React from "react";

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

const Dropdown: React.FC<DropdownProps> = ({
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
  placeHolder,
}) => {
  // Common class for all form select elements for consistent styling
  const baseSelectClass =
    "block w-full px-3 py-2 h-10 text-base border-[1.5px] border-[#3D3C3C] rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500";
  const errorClass = error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "";
  const disabledClass = disabled ? "bg-gray-100 cursor-not-allowed" : "";

  const selectClass = `${baseSelectClass} ${errorClass} ${disabledClass} ${className}`;

  // Check if options are provided as simple strings or objects with value/label
  const isStringOptions = options.length > 0 && typeof options[0] === "string";

  return (
    <div className="mb-0">
      {label && (
        <label
          htmlFor={id || name}
          className="block text-lg font-medium text-[#0A0A0A] mb-1"
        >
          {label}
          {required && (
            <span className="text-red-500 text-2xl leading-none self-start">
              *
            </span>
          )}
        </label>
      )}

      {/* Wrapper div for custom arrow */}
      <div className="relative">
        <select
          id={id || name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${selectClass} pr-10 appearance-none`} // add pr-10 for arrow space, and appearance-none to hide native arrow
          disabled={disabled}
        >
          {placeHolder && (
            <option value="" disabled hidden>
              {placeHolder}
            </option>
          )}
          {isStringOptions
            ? (options as string[]).map((option, index) => (
                <option
                  key={index}
                  value={option}
                  className="whitespace-normal break-words w-full"
                  style={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  {option}
                </option>
              ))
            : (options as DropdownOption[]).map((option, index) => (
                <option
                  key={index}
                  value={option.label}
                  className="whitespace-normal break-words w-full"
                  style={{
                    width: "100%",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  {option.label || option.value}
                </option>
              ))}
        </select>

        {/* Custom arrow */}
        <div className="absolute bottom-0 right-1 flex items-center text-[#3D3C3C]">
          <svg
            className="h-8 w-8 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 7l3 3 3-3z" />
          </svg>
        </div>
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

export default Dropdown;
