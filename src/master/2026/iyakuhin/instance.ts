import localforage from "localforage";

export const iyakuhinMasterStore = localforage.createInstance({
  name: "iyakuhinMaster",
  storeName: "iyakuhinMaster",
});
