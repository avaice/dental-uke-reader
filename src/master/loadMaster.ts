import { loadIyakuhinMaster } from "./iyakuhin/loader";
import { loadShobyomeiMaster } from "./shobyomei/loader";

export const loadMaster = async () => {
  await loadShobyomeiMaster();
  await loadIyakuhinMaster();
};
