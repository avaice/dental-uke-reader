import { tokuteikizaiMasterHeaders } from "./header";
import { tokuteikizaiMasterStore } from "./instance";

export * from "./header";

export const tokuteikizaiMaster = {
  name: "tokuteikizaiMaster",
  header: tokuteikizaiMasterHeaders,
  store: tokuteikizaiMasterStore,
};
