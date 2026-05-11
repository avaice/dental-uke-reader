import localforage from "localforage";

export const shushokugoMasterStore = localforage.createInstance({
  name: "shushokugoMaster",
  storeName: "shushokugoMaster",
});
