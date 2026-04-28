/**
 * Custom util to get the default region
 *
 * @author jagankumar-egov
 *
 * @example
 *   Digit.Hooks.Utils.getLocaleRegion()
 *
 * @returns {string} 
 */
const getLocaleRegion = () => {
  return window?.globalConfigs?.getConfig?.("LOCALE_REGION") || "IN";
};
/**
 * Custom util to get the default locale
 *
 * @author jagankumar-egov
 *
 * @example
 *   Digit.Hooks.Utils.getLocaleDefault()
 *
 * @returns {string} 
 */
const getLocaleDefault = () => {
  return window?.globalConfigs?.getConfig?.("LOCALE_DEFAULT") || "en";
};

/**
 * Custom util to get the default language
 *
 * @author jagankumar-egov
 *
 * @example
 *   Digit.Hooks.Utils.getDefaultLanguage()
 *
 * @returns {string} 
 */
const getDefaultLanguage = () => {
  return `${getLocaleDefault()}_${getLocaleRegion()}`;
};

export default {
  getDefaultLanguage,
  getLocaleDefault,
  getLocaleRegion
};
