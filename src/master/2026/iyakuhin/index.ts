import { iyakuhinMasterHeaders } from "./header";
import { iyakuhinMasterStore } from "./instance";

export * from "./header";

export const iyakuhinMaster = {
  name: "iyakuhinMaster",
  header: iyakuhinMasterHeaders,
  store: iyakuhinMasterStore,
};
