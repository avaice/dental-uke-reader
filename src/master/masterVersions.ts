export const MASTER_VERSIONS = {
  shobyomeiMasterVersion: "20260101",
  iyakuhinMasterVersion: "20260414",
  shikaMasterVersion: "20260501",
  tokuteikizaiMasterVersion: "20260501",
  commentMasterVersion: "20260507",
  ikaMasterVersion: "20260501",
  shushokugoMasterVersion: "20260101",
  chozaiMasterVersion: "20260507",
  shikaKihonKihonMasterVersion: "20260501",
  shikaKihonChuMasterVersion: "20260331",
  shikaKihonTsureiMasterVersion: "20260325",
  shikaKihonZairyoMasterVersion: "20260501",
} as const;

export type MasterVersionKey = keyof typeof MASTER_VERSIONS;
