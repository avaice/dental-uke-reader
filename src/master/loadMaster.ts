import { loadCommentMaster } from "./comment/loader";
import { loadIyakuhinMaster } from "./iyakuhin/loader";
import { loadShikaMaster } from "./shika/loader";
import { loadShobyomeiMaster } from "./shobyomei/loader";
import { loadTokuteikizaiMaster } from "./tokuteikizai/loader";

export const loadMaster = async () => {
  await loadShobyomeiMaster();
  await loadIyakuhinMaster();
  await loadShikaMaster();
  await loadTokuteikizaiMaster();
  await loadCommentMaster();
};
