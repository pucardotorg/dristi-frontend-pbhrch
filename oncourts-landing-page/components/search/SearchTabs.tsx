import React, { useState } from "react";

interface SearchTabsProps {
  t: (key: string) => string;
  isMobile: boolean;
  selectedTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

const SearchTabs: React.FC<SearchTabsProps> = ({
  t,
  isMobile,
  selectedTab,
  onTabChange,
  tabs,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Find the current selected tab's label for the dropdown button
  const selectedTabLabel =
    tabs.find((tab) => tab.id === selectedTab)?.label || tabs[0].label;

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    setIsDropdownOpen(false);
  };

  if (isMobile) {
    return (
      <div className="w-full px-4 py-2 my-6">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full py-2 px-3 text-lg font-medium text-gray-800 bg-white border-2 border-[#CBD5E1] rounded-lg focus:outline-none"
          >
            <span>{t(selectedTabLabel)}</span>
            <div className="ml-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`block w-full text-left px-4 py-3 text-base hover:bg-gray-100 ${selectedTab === tab.id ? "bg-gray-100 font-medium" : ""}`}
                >
                  {t(tab.label)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-fit px-1 py-1.5 my-8 mx-auto gap-1 rounded-lg border-2 border-[#CBD5E1]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-3 py-1 text-xl font-roboto font-medium transition-colors rounded-md ${
            selectedTab === tab.id
              ? "bg-[#3A3A3A] text-white"
              : "text-[#64748B] hover:bg-gray-200"
          }`}
          style={{
            minWidth: "100px",
          }}
        >
          {t(tab.label)}
        </button>
      ))}
    </div>
  );
};

export default SearchTabs;
