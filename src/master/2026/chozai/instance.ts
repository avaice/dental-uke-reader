import localforage from "localforage";

export const chozaiMasterStore = localforage.createInstance({
  name: "chozaiMaster",
  storeName: "chozaiMaster",
});
