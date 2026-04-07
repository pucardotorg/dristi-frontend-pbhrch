import { useTranslation } from "react-i18next";

export const useSafeTranslation = () => {
  const { t: rawT, ...rest } = useTranslation();
  const t = (key: string, options?: any): string => rawT(key, options) ?? "";
  return { t, ...rest };
};