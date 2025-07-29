import { loadCommentMaster } from "./comment/loader";
import { loadIkaMaster } from "./ika/loader";
import { loadIyakuhinMaster } from "./iyakuhin/loader";
import { loadShikaMaster } from "./shika/loader";
import { loadShobyomeiMaster } from "./shobyomei/loader";
import { loadShushokugoMaster } from "./shushokugo/loader";
import { loadTokuteikizaiMaster } from "./tokuteikizai/loader";

export const loadMaster = async (callback: (message: string) => void) => {
  await loadShobyomeiMaster(callback);
  await loadIyakuhinMaster(callback);
  await loadShikaMaster(callback);
  await loadTokuteikizaiMaster(callback);
  await loadCommentMaster(callback);
  await loadIkaMaster(callback);
  await loadShushokugoMaster(callback);
};
