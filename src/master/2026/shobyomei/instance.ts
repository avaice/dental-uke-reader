import localforage from "localforage";

export const shobyomeiMasterStore = localforage.createInstance({
  name: "shobyomeiMaster",
  storeName: "shobyomeiMaster",
});
