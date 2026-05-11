import localforage from "localforage";

export const shikaKihonZairyoMasterStore = localforage.createInstance({
  name: "shikaKihonZairyoMaster",
  storeName: "shikaKihonZairyoMaster",
});
