import { ikaMasterHeaders } from "./header";
import { ikaMasterStore } from "./instance";

export * from "./header";

export const ikaMaster = {
  name: "ikaMaster",
  header: ikaMasterHeaders,
  store: ikaMasterStore,
};
