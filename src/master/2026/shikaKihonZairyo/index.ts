import { shikaKihonZairyoMasterHeaders } from "./header";
import { shikaKihonZairyoMasterStore } from "./instance";

export * from "./header";

export const shikaKihonZairyoMaster = {
  name: "shikaKihonZairyoMaster",
  header: shikaKihonZairyoMasterHeaders,
  store: shikaKihonZairyoMasterStore,
};
