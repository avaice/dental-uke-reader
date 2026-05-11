import localforage from "localforage";

export const shikaMasterStore = localforage.createInstance({
  name: "shikaMaster",
  storeName: "shikaMaster",
});
