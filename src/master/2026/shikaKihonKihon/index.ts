import { shikaKihonKihonMasterHeaders } from "./header";
import { shikaKihonKihonMasterStore } from "./instance";

export * from "./header";

export const shikaKihonKihonMaster = {
  name: "shikaKihonKihonMaster",
  header: shikaKihonKihonMasterHeaders,
  store: shikaKihonKihonMasterStore,
};
