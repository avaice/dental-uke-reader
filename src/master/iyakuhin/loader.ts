import { masterManageStore } from "@master/masterManageInstance";
import { iyakuhinMasterHeaders } from "./header";
import { iyakuhinMasterStore } from "./instance";
import master from "./master_data_utf8.txt";

const VERSION = "20250729";

export const loadIyakuhinMaster = async () => {
  const version = await masterManageStore.getItem("iyakuhinMasterVersion");
  if (version === VERSION) {
    console.log("医薬品マスターはすでに読み込まれています");
    return;
  }

  console.time("医薬品マスターの読み込み");
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
          record[iyakuhinMasterHeaders[columnIndex].name] = buffer;
          columnIndex++;
          buffer = "";
        }
      } else {
        buffer += line[p];
      }
      p++;
    }
    if (record.医薬品コード) {
      const exists = await iyakuhinMasterStore.getItem(record.医薬品コード);
      if (exists) {
        await iyakuhinMasterStore.setItem(record.医薬品コード, [
          ...(exists as Record<string, string>[]),
          record,
        ]);
      } else {
        await iyakuhinMasterStore.setItem(record.医薬品コード, [record]);
      }
    }
    if (i % 1000 === 0 || i === lines.length - 1) {
      console.log(`Resolved ${i} / ${lines.length}`);
    }
  }
  await masterManageStore.setItem("iyakuhinMasterVersion", VERSION);
  console.timeEnd("医薬品マスターの読み込み");
};
