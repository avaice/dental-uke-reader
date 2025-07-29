import { masterManageStore } from "@master/masterManageInstance";
import { chozaiMasterHeaders } from "./header";
import { chozaiMasterStore } from "./instance";
import master from "./master_data_utf8.txt";

const VERSION = "20250729";

export const loadChozaiMaster = async (callback: (message: string) => void) => {
  const version = await masterManageStore.getItem("chozaiMasterVersion");
  if (version === VERSION) {
    console.log("調剤マスターはすでに読み込まれています");
    return;
  }

  console.time("調剤マスターの読み込み");
  callback("Downloading 調剤マスター...");
  const response = await fetch(master);
  const text = await response.text();
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const record: Record<string, string> = {};

    let p = 0;
    let columnIndex = 0;
    let isInBracket = false;
    let buffer = "";
    while (true) {
      if (p >= line.length) {
        break;
      } else if (line[p] === '"') {
        isInBracket = !isInBracket;
      } else if (line[p] === ",") {
        if (isInBracket) {
          p++;
        } else {
          record[chozaiMasterHeaders[columnIndex].name] = buffer;
          columnIndex++;
          buffer = "";
        }
      } else {
        buffer += line[p];
      }
      p++;
    }
    if (record.調剤行為コード) {
      const exists = await chozaiMasterStore.getItem(record.調剤行為コード);
      if (exists) {
        await chozaiMasterStore.setItem(record.調剤行為コード, [
          ...(exists as Record<string, string>[]),
          record,
        ]);
      } else {
        await chozaiMasterStore.setItem(record.調剤行為コード, [record]);
      }
    }
    if (i % 1000 === 0 || i === lines.length - 1) {
      callback(`Loading 調剤マスター ${i} / ${lines.length}`);
    }
  }
  await masterManageStore.setItem("chozaiMasterVersion", VERSION);
  console.timeEnd("調剤マスターの読み込み");
};
