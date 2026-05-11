import localforage from "localforage";

export const shikaKihonChuMasterStore = localforage.createInstance({
  name: "shikaKihonChuMaster",
  storeName: "shikaKihonChuMaster",
});
