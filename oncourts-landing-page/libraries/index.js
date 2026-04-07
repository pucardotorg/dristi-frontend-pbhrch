
import { useStore } from "./services/index";
import { initI18n } from "./translations/index";

import { Storage, PersistantStorage } from "./services/atoms/Utils/Storage";

import { CustomService } from "./services/elements/CustomService";
import { LocalizationService } from "./services/elements/Localization/service";

import { MdmsService } from "./services/elements/MDMS";
import Utils from "./utils";
import { UserService } from "./services/elements/User";
import { ULBService } from "./services/molecules/Ulb";

import { ComponentRegistryService } from "./services/elements/ComponentRegistry";
import StoreData from "./services/molecules/StoreData";

import Contexts from "./contexts";
import Hooks from "./hooks";

const setupLibraries = (Library, props) => {
  window.Digit = window.Digit || {};
  window.Digit[Library] = window.Digit[Library] || {};
  window.Digit[Library] = { ...window.Digit[Library], ...props };
};

const initLibraries = () => {
  setupLibraries("SessionStorage", Storage);
  setupLibraries("PersistantStorage", PersistantStorage);
  setupLibraries("Services", { useStore });
  setupLibraries("CustomService",CustomService);
  setupLibraries("LocalizationService", LocalizationService);
  setupLibraries("UserService", UserService);
  setupLibraries("ULBService", ULBService);

  setupLibraries("MDMSService", MdmsService);
  setupLibraries("ComponentRegistryService", ComponentRegistryService);
  setupLibraries("StoreData", StoreData);
  
  setupLibraries("Contexts", Contexts);
  setupLibraries("Hooks", Hooks);
  setupLibraries("Customizations", {});
  setupLibraries("Utils", Utils);

  return new Promise((resolve) => {
    initI18n(resolve);
  });
};

export { initLibraries, Hooks };
