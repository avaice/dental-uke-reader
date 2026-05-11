import { chozaiMasterHeaders } from "./header";
import { chozaiMasterStore } from "./instance";

export * from "./header";

export const chozaiMaster = {
  name: "chozaiMaster",
  header: chozaiMasterHeaders,
  store: chozaiMasterStore,
};
