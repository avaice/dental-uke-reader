import { masterManageStore } from "@master/masterManageInstance";
import { ikaMasterHeaders } from "./header";
import { ikaMasterStore } from "./instance";
import master from "./master_data_utf8.txt";

const VERSION = "20250729";

export const loadIkaMaster = async () => {
  const version = await masterManageStore.getItem("ikaMasterVersion");
  if (version === VERSION) {
    console.log("医科診療行為マスターはすでに読み込まれています");
    return;
  }

  console.time("医科診療行為マスターの読み込み");
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
          record[ikaMasterHeaders[columnIndex].name] = buffer;
          columnIndex++;
          buffer = "";
        }
      } else {
        buffer += line[p];
      }
      p++;
    }
    if (record.診療行為コード) {
      const exists = await ikaMasterStore.getItem(record.診療行為コード);
      if (exists) {
        await ikaMasterStore.setItem(record.診療行為コード, [
          ...(exists as Record<string, string>[]),
          record,
        ]);
      } else {
        await ikaMasterStore.setItem(record.診療行為コード, [record]);
      }
    }
    if (i % 1000 === 0 || i === lines.length - 1) {
      console.log(`Resolved ${i} / ${lines.length}`);
    }
  }
  await masterManageStore.setItem("ikaMasterVersion", VERSION);
  console.timeEnd("医科診療行為マスターの読み込み");
};
