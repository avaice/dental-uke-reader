import { shikaKihonTsureiMasterHeaders } from "./header";
import { shikaKihonTsureiMasterStore } from "./instance";

export * from "./header";

export const shikaKihonTsureiMaster = {
  name: "shikaKihonTsureiMaster",
  header: shikaKihonTsureiMasterHeaders,
  store: shikaKihonTsureiMasterStore,
};
