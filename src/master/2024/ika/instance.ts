import localforage from "localforage";

export const ikaMasterStore = localforage.createInstance({
  name: "ikaMaster",
  storeName: "ikaMaster",
});
