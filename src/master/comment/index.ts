import { commentMasterHeaders } from "./header";
import { commentMasterStore } from "./instance";

export * from "./header";

export const commentMaster = {
  name: "commentMaster",
  header: commentMasterHeaders,
  store: commentMasterStore,
};
