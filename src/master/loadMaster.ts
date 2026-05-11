import { loadChozaiMaster2026 } from "./2026/chozai/loader";
import { loadCommentMaster2026 } from "./2026/comment/loader";
import { loadIkaMaster2026 } from "./2026/ika/loader";
import { loadIyakuhinMaster2026 } from "./2026/iyakuhin/loader";
import { masterManageStore } from "./masterManageInstance";
import { MASTER_VERSIONS } from "./masterVersions";
import { loadShikaMaster2026 } from "./2026/shika/loader";
import { loadShikaKihonChuMaster2026 } from "./2026/shikaKihonChu/loader";
import { loadShikaKihonKihonMaster2026 } from "./2026/shikaKihonKihon/loader";
import { loadShikaKihonTsureiMaster2026 } from "./2026/shikaKihonTsurei/loader";
import { loadShikaKihonZairyoMaster2026 } from "./2026/shikaKihonZairyo/loader";
import { loadShobyomeiMaster2026 } from "./2026/shobyomei/loader";
import { loadShushokugoMaster2026 } from "./2026/shushokugo/loader";
import { loadTokuteikizaiMaster2026 } from "./2026/tokuteikizai/loader";

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
  masterManageStore.clear();
  await loadMaster(callback);
};

export const loadMaster = async (callback: (message: string) => void) => {
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
