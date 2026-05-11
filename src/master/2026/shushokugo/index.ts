import { shushokugoMasterHeaders } from "./header";
import { shushokugoMasterStore } from "./instance";

export * from "./header";

export const shushokugoMaster = {
  name: "shushokugoMaster",
  header: shushokugoMasterHeaders,
  store: shushokugoMasterStore,
};
