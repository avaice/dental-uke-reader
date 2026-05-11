import localforage from "localforage";

export const tokuteikizaiMasterStore = localforage.createInstance({
  name: "tokuteikizaiMaster",
  storeName: "tokuteikizaiMaster",
});
