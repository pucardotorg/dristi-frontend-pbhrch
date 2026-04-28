import React, { useState, useEffect, useRef } from "react";

// export default ChangeLanguage;
type DropdownOption = {
  label: string;
  value: string;
} & Record<string, unknown>;

type DropdownProps = {
  options: DropdownOption[];
  selected?: DropdownOption;
  onSelect: (option: DropdownOption) => void;
  customTrigger: React.ReactNode;
  className?: string;
  placement?: "bottom-left" | "bottom-right" | "bottom-center";
};

// Custom Dropdown Component

const Dropdown: React.FC<DropdownProps> = ({
  options = [],
  selected,
  onSelect,
  customTrigger,
  className = "",
  placement = "bottom-left",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  const getDropdownClasses = () => {
    const baseClasses =
      "absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[150px]";
    const placementClasses = {
      "bottom-left": "left-0",
      "bottom-right": "right-0",
      "bottom-center": "left-1/2 transform -translate-x-1/2",
    };
    return `${baseClasses} ${placementClasses[placement]}`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {customTrigger}
      </div>

      {isOpen && (
        <div className={getDropdownClasses()}>
          <div className="py-1">
            {options.map((option, index) => {
              const isSelected = selected?.value === option.value;
              return (
                <React.Fragment key={option.value || index}>
                  <div
                    className={`px-4 py-3 text-sm font-medium transition-colors duration-150 cursor-pointer ${isSelected ? "text-[#007E7E] bg-gray-100" : "text-gray-700 hover:bg-gray-50 hover:text-[#007E7E]"}`}
                    onClick={() => handleSelect(option)}
                  >
                    {option.label}
                  </div>
                  {index < options.length - 1 && (
                    <div className="border-b border-gray-100 mx-2" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
