import localforage from "localforage";
import { loadChozaiMaster as loadChozaiMaster2024 } from "./2024/chozai/loader";
import { loadCommentMaster as loadCommentMaster2024 } from "./2024/comment/loader";
import { loadIkaMaster as loadIkaMaster2024 } from "./2024/ika/loader";
import { loadIyakuhinMaster as loadIyakuhinMaster2024 } from "./2024/iyakuhin/loader";
import { loadShikaMaster as loadShikaMaster2024 } from "./2024/shika/loader";
import { loadShikaKihonChuMaster as loadShikaKihonChuMaster2024 } from "./2024/shikaKihonChu/loader";
import { loadShikaKihonKihonMaster as loadShikaKihonKihonMaster2024 } from "./2024/shikaKihonKihon/loader";
import { loadShikaKihonTsureiMaster as loadShikaKihonTsureiMaster2024 } from "./2024/shikaKihonTsurei/loader";
import { loadShikaKihonZairyoMaster as loadShikaKihonZairyoMaster2024 } from "./2024/shikaKihonZairyo/loader";
import { loadShobyomeiMaster as loadShobyomeiMaster2024 } from "./2024/shobyomei/loader";
import { loadShushokugoMaster as loadShushokugoMaster2024 } from "./2024/shushokugo/loader";
import { loadTokuteikizaiMaster as loadTokuteikizaiMaster2024 } from "./2024/tokuteikizai/loader";
import { loadChozaiMaster2026 } from "./2026/chozai/loader";
import { loadCommentMaster2026 } from "./2026/comment/loader";
import { loadIkaMaster2026 } from "./2026/ika/loader";
import { loadIyakuhinMaster2026 } from "./2026/iyakuhin/loader";
import { loadShikaMaster2026 } from "./2026/shika/loader";
import { loadShikaKihonChuMaster2026 } from "./2026/shikaKihonChu/loader";
import { loadShikaKihonKihonMaster2026 } from "./2026/shikaKihonKihon/loader";
import { loadShikaKihonTsureiMaster2026 } from "./2026/shikaKihonTsurei/loader";
import { loadShikaKihonZairyoMaster2026 } from "./2026/shikaKihonZairyo/loader";
import { loadShobyomeiMaster2026 } from "./2026/shobyomei/loader";
import { loadShushokugoMaster2026 } from "./2026/shushokugo/loader";
import { loadTokuteikizaiMaster2026 } from "./2026/tokuteikizai/loader";
import { masterManageStore } from "./masterManageInstance";
import { MASTER_VERSIONS } from "./masterVersions";

export const checkMasterVersionUpToDate = async () => {
  const checks = await Promise.all(
    Object.entries(MASTER_VERSIONS).map(async ([key, latestVersion]) => {
      const currentVersion = await masterManageStore.getItem(key);
      return currentVersion === latestVersion;
    }),
  );

  return checks.every((isLatest) => isLatest);
};

export const checkMasterLoaded = async () => {
  const loadedStates = await Promise.all(
    Object.keys(MASTER_VERSIONS).map(async (key) => {
      const currentVersion = await masterManageStore.getItem(key);
      return currentVersion !== null;
    }),
  );

  return loadedStates.every((isLoaded) => isLoaded);
};

export const getMasterStatus = async () => {
  const keys = await masterManageStore.keys();
  const status: Record<string, string | null> = {};
  for (const key of keys) {
    status[key] = await masterManageStore.getItem(key);
  }
  return status;
};

export const reloadMaster = async (callback: (message: string) => void) => {
  // IndexedDBをリセットする
  localforage.clear();
  await loadMaster(callback);
};

export const loadMaster = async (callback: (message: string) => void) => {
  if (
    window.confirm(
      "令和8年度診療報酬改定の最新マスタを標準で読み込みます。\n\n必要であれば、令和6年度マスタもあわせて読み込むことができます。\n令和6年度マスタも読み込みますか？（処理に時間がかかる場合があります）",
    )
  ) {
    await loadShobyomeiMaster2024(callback);
    await loadIyakuhinMaster2024(callback);
    await loadShikaMaster2024(callback);
    await loadTokuteikizaiMaster2024(callback);
    await loadCommentMaster2024(callback);
    await loadIkaMaster2024(callback);
    await loadShushokugoMaster2024(callback);
    await loadChozaiMaster2024(callback);
    await loadShikaKihonKihonMaster2024(callback);
    await loadShikaKihonChuMaster2024(callback);
    await loadShikaKihonTsureiMaster2024(callback);
    await loadShikaKihonZairyoMaster2024(callback);
  }

  await loadShobyomeiMaster2026(callback);
  await loadIyakuhinMaster2026(callback);
  await loadShikaMaster2026(callback);
  await loadTokuteikizaiMaster2026(callback);
  await loadCommentMaster2026(callback);
  await loadIkaMaster2026(callback);
  await loadShushokugoMaster2026(callback);
  await loadChozaiMaster2026(callback);
  await loadShikaKihonKihonMaster2026(callback);
  await loadShikaKihonChuMaster2026(callback);
  await loadShikaKihonTsureiMaster2026(callback);
  await loadShikaKihonZairyoMaster2026(callback);
};
