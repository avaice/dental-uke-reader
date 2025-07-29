import { loadIyakuhinMaster } from "./iyakuhin/loader";
import { loadShikaMaster } from "./shika/loader";
import { loadShobyomeiMaster } from "./shobyomei/loader";

export const loadMaster = async () => {
  await loadShobyomeiMaster();
  await loadIyakuhinMaster();
  await loadShikaMaster();
};
