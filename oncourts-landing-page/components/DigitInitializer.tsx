import React from "react";
import { commonStyles } from "../styles/commonStyles";

interface Props {
  stateCode: string;
  enabledModules: string[];
  children: React.ReactNode;
}

const DigitInitializer: React.FC<Props> = ({
  stateCode,
  enabledModules,
  children,
}) => {
  const { isLoading: isLoadingStore } = window.Digit.Hooks.useInitStore(
    stateCode,
    enabledModules,
  );
  const moduleCode = [
    "landing",
    "common",
    "case",
    "orders",
    "submissions",
    "hearings",
    "home",
  ];
  const language = window.Digit.StoreData.getCurrentLanguage();
  const { isLoading: isLoadingLocalisation } = window.Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  if (isLoadingStore || isLoadingLocalisation) {
    return (
      <div className={commonStyles.loading.container}>
        <div className={commonStyles.loading.spinner}></div>
        <div className="mt-4 text-[#0F766E] text-sm font-medium">
          Loading, please wait...
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DigitInitializer;
