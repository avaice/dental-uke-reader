import { loadChozaiMaster } from "./chozai/loader";
import { loadCommentMaster } from "./comment/loader";
import { loadIkaMaster } from "./ika/loader";
import { loadIyakuhinMaster } from "./iyakuhin/loader";
import { loadShikaMaster } from "./shika/loader";
import { loadShikaKihonChuMaster } from "./shikaKihonChu/loader";
import { loadShikaKihonKihonMaster } from "./shikaKihonKihon/loader";
import { loadShikaKihonTsureiMaster } from "./shikaKihonTsurei/loader";
import { loadShikaKihonZairyoMaster } from "./shikaKihonZairyo/loader";
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
  await loadChozaiMaster(callback);
  await loadShikaKihonKihonMaster(callback);
  await loadShikaKihonChuMaster(callback);
  await loadShikaKihonTsureiMaster(callback);
  await loadShikaKihonZairyoMaster(callback);
};
