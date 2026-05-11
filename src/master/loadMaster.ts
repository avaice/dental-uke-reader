import { loadChozaiMaster } from "./chozai/loader";
import { loadCommentMaster } from "./comment/loader";
import { loadIkaMaster } from "./ika/loader";
import { loadIyakuhinMaster } from "./iyakuhin/loader";
import { masterManageStore } from "./masterManageInstance";
import { MASTER_VERSIONS } from "./masterVersions";
import { loadShikaMaster } from "./shika/loader";
import { loadShikaKihonChuMaster } from "./shikaKihonChu/loader";
import { loadShikaKihonKihonMaster } from "./shikaKihonKihon/loader";
import { loadShikaKihonTsureiMaster } from "./shikaKihonTsurei/loader";
import { loadShikaKihonZairyoMaster } from "./shikaKihonZairyo/loader";
import { loadShobyomeiMaster } from "./shobyomei/loader";
import { loadShushokugoMaster } from "./shushokugo/loader";
import { loadTokuteikizaiMaster } from "./tokuteikizai/loader";

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
