import { masterManageStore } from "@master/masterManageInstance";
import { shikaMasterHeaders } from "./header";
import { shikaMasterStore } from "./instance";
import master from "./master_data_utf8.txt";

const VERSION = "20250729";

export const loadShikaMaster = async (callback: (message: string) => void) => {
  const version = await masterManageStore.getItem("shikaMasterVersion");
  if (version === VERSION) {
    console.log("歯科診療行為マスターはすでに読み込まれています");
    return;
  }

  console.time("歯科診療行為マスターの読み込み");
  callback("Downloading 歯科診療行為マスター...");
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
          record[shikaMasterHeaders[columnIndex].name] = buffer;
          columnIndex++;
          buffer = "";
        }
      } else {
        buffer += line[p];
      }
      p++;
    }
    if (record.歯科診療行為コード) {
      const exists = await shikaMasterStore.getItem(record.歯科診療行為コード);
      if (exists) {
        await shikaMasterStore.setItem(record.歯科診療行為コード, [
          ...(exists as Record<string, string>[]),
          record,
        ]);
      } else {
        await shikaMasterStore.setItem(record.歯科診療行為コード, [record]);
      }
    }
    if (i % 1000 === 0 || i === lines.length - 1) {
      callback(`Loading 歯科診療行為マスター ${i} / ${lines.length}`);
    }
  }
  await masterManageStore.setItem("shikaMasterVersion", VERSION);
  console.timeEnd("歯科診療行為マスターの読み込み");
};
