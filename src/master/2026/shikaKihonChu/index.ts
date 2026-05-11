import { shikaKihonChuMasterHeaders } from "./header";
import { shikaKihonChuMasterStore } from "./instance";

export * from "./header";

export const shikaKihonTsureiMaster = {
  name: "shikaKihonChuMaster",
  header: shikaKihonChuMasterHeaders,
  store: shikaKihonChuMasterStore,
};
