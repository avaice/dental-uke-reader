import { shobyomeiMasterHeaders } from "./header";
import { shobyomeiMasterStore } from "./instance";

export * from "./header";

export const shobyomeiMaster = {
  name: "shobyomeiMaster",
  header: shobyomeiMasterHeaders,
  store: shobyomeiMasterStore,
};
