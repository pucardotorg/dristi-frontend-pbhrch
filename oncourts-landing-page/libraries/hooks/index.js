import { useInitStore } from "./store";
import useSessionStorage from "./useSessionStorage";
import useStore from "./useStore";
import { useTenants } from "./useTenants";

const Hooks = {
  useSessionStorage,
  useInitStore,
  useStore,
  useTenants,
};

export default Hooks;
