import { chozaiMasterStore } from "./chozai/instance";
import { commentMasterStore } from "./comment/instance";
import { ikaMasterStore } from "./ika/instance";
import { iyakuhinMasterStore } from "./iyakuhin/instance";
import { shikaMasterStore } from "./shika/instance";
import { shikaKihonChuMasterStore } from "./shikaKihonChu/instance";
import { shikaKihonKihonMasterStore } from "./shikaKihonKihon/instance";
import { shikaKihonTsureiMasterStore } from "./shikaKihonTsurei/instance";
import { shikaKihonZairyoMasterStore } from "./shikaKihonZairyo/instance";
import { shobyomeiMasterStore } from "./shobyomei/instance";
import { shushokugoMasterStore } from "./shushokugo/instance";
import { tokuteikizaiMasterStore } from "./tokuteikizai/instance";

export const searchMaster = async (keyword: string) => {
  const shobyomeiMasterResult = await shobyomeiMasterStore.getItem(keyword);
  const iyakuhinMasterResult = await iyakuhinMasterStore.getItem(keyword);
  const shikaMasterResult = await shikaMasterStore.getItem(keyword);
  const tokuteikizaiMasterResult =
    await tokuteikizaiMasterStore.getItem(keyword);
  const commentMasterResult = await commentMasterStore.getItem(keyword);
  const ikaMasterResult = await ikaMasterStore.getItem(keyword);
  const shushokugoMasterResult = await shushokugoMasterStore.getItem(keyword);
  const chozaiMasterResult = await chozaiMasterStore.getItem(keyword);
  const shikaKihonKihonMasterResult =
    await shikaKihonKihonMasterStore.getItem(keyword);
  const shikaKihonChuMasterResult =
    await shikaKihonChuMasterStore.getItem(keyword);
  const shikaKihonTsureiMasterResult =
    await shikaKihonTsureiMasterStore.getItem(keyword);
  const shikaKihonZairyoMasterResult =
    await shikaKihonZairyoMasterStore.getItem(keyword);

  return {
    shobyomeiMasterResult,
    iyakuhinMasterResult,
    shikaMasterResult,
    tokuteikizaiMasterResult,
    commentMasterResult,
    ikaMasterResult,
    shushokugoMasterResult,
    chozaiMasterResult,
    shikaKihonKihonMasterResult,
    shikaKihonChuMasterResult,
    shikaKihonTsureiMasterResult,
    shikaKihonZairyoMasterResult,
  };
};
