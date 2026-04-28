import { LocalizationService } from "../../elements/Localization/service";
import { MdmsService } from "../../elements/MDMS";
import { Storage } from "../../atoms/Utils/Storage";
import { ApiCacheService } from "../../atoms/ApiCacheService";

export const StoreService = {
  getInitData: () => {
    return Storage.get("initData");
  },
  digitInitData: async (stateCode, enabledModules) => {
    const { MdmsRes } = await MdmsService.init(stateCode);
    const stateInfo = MdmsRes["common-masters"]?.StateInfo?.[0]||{};
    const uiHomePage = MdmsRes["common-masters"]?.uiHomePage?.[0]||{};
    const localities = {};
    const revenue_localities = {};
    const initData = {
      languages: stateInfo.hasLocalisation ? stateInfo.languages : [{ label: "ENGLISH", value: Digit.Utils.getDefaultLanguage() }],
      stateInfo: {
        code: stateInfo.code,
        name: stateInfo.name,
        logoUrl: stateInfo.logoUrl,
        statelogo: stateInfo.statelogo,
        logoUrlWhite: stateInfo.logoUrlWhite,
        bannerUrl: stateInfo.bannerUrl,
      },
      localizationModules: stateInfo.localizationModules,
      modules: MdmsRes?.tenant?.citymodule?.filter((module) => module?.active)?.filter((module) => enabledModules?.includes(module?.code))?.sort((x,y)=>x?.order-y?.order),
      uiHomePage: uiHomePage
    };

  
    initData.selectedLanguage = Digit.SessionStorage.get("locale") || initData.languages[0].value;

    ApiCacheService.saveSetting(MdmsRes["DIGIT-UI"]?.ApiCachingSettings);

    // const moduleTenants = initData.modules
    //   .map((module) => module.tenants)
    //   .flat()
    //   .reduce((unique, ele) => (unique.find((item) => item.code === ele.code) ? unique : [...unique, ele]), []);
    initData.tenants = MdmsRes?.tenant?.tenants
         .map((tenant) => ({ i18nKey: `TENANT_TENANTS_${tenant.code.replace(".", "_").toUpperCase()}`, ...tenant }));
      // .filter((item) => !!moduleTenants.find((mt) => mt.code === item.code))
      // .map((tenant) => ({ i18nKey: `TENANT_TENANTS_${tenant.code.replace(".", "_").toUpperCase()}`, ...tenant }));

    await LocalizationService.getLocale({
      modules: [
        `rainmaker-${stateCode.toLowerCase()}`
      ],
      locale: initData.selectedLanguage,
      tenantId: stateCode,
    });
    Storage.set("initData", initData);
    initData.revenue_localities = revenue_localities;
    initData.localities = localities;
    // setTimeout(() => {
    //   renderTenantLogos(stateInfo, initData.tenants);
    // }, 0);
    return initData;
  },
  defaultData: async (stateCode, moduleCode, language) => {
    let moduleCodes = [];
    if(typeof moduleCode !== "string") moduleCode.forEach(code => { moduleCodes.push(`rainmaker-${code.toLowerCase()}`) });
    const LocalePromise = LocalizationService.getLocale({
      modules: typeof moduleCode == "string" ? [`rainmaker-${moduleCode.toLowerCase()}`] : moduleCodes,
      locale: language,
      tenantId: stateCode,
    });
    await LocalePromise;
    return {};
  },
};
