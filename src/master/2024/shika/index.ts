import { shikaMasterHeaders } from "./header";
import { shikaMasterStore } from "./instance";

export * from "./header";

export const shikaMaster = {
  name: "shikaMaster",
  header: shikaMasterHeaders,
  store: shikaMasterStore,
};
