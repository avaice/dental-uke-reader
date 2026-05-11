import localforage from "localforage";

export const commentMasterStore = localforage.createInstance({
  name: "commentMaster",
  storeName: "commentMaster",
});
