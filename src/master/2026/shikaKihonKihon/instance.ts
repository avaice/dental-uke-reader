import localforage from "localforage";

export const shikaKihonKihonMasterStore = localforage.createInstance({
  name: "shikaKihonKihonMaster",
  storeName: "shikaKihonKihonMaster",
});
