import localforage from "localforage";

export const masterManageStore = localforage.createInstance({
  name: "masterManage",
  storeName: "masterManage",
});
