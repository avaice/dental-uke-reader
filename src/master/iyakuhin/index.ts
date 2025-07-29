import { iyakuhinMasterHeaders } from "./header";
import { iyakuhinMasterStore } from "./instance";

export * from "./header";

export const iyakuhinMaster = {
  header: iyakuhinMasterHeaders,
  store: iyakuhinMasterStore,
};
