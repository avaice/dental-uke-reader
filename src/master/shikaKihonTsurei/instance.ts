import localforage from "localforage";

export const shikaKihonTsureiMasterStore = localforage.createInstance({
  name: "shikaKihonTsureiMaster",
  storeName: "shikaKihonTsureiMaster",
});
