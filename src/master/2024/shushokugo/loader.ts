import { masterManageStore } from "@master/masterManageInstance";
import { shushokugoMasterHeaders } from "./header";
import { shushokugoMasterStore } from "./instance";
import master from "./master_data_utf8.txt";

const VERSION = "20250729";

export const loadShushokugoMaster = async (
  callback: (message: string) => void,
) => {
  const version = await masterManageStore.getItem("shushokugoMasterVersion");
  if (version === VERSION) {
    console.log("修飾語マスターはすでに読み込まれています");
    return;
  }

  console.time("修飾語マスターの読み込み");
  callback("Downloading 修飾語マスター (2024)...");
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
          record[shushokugoMasterHeaders[columnIndex].name] = buffer;
          columnIndex++;
          buffer = "";
        }
      } else {
        buffer += line[p];
      }
      p++;
    }
    if (record.修飾語コード) {
      const exists = await shushokugoMasterStore.getItem(record.修飾語コード);
      if (exists) {
        await shushokugoMasterStore.setItem(record.修飾語コード, [
          ...(exists as Record<string, string>[]),
          record,
        ]);
      } else {
        await shushokugoMasterStore.setItem(record.修飾語コード, [record]);
      }
    }
    if (i % 1000 === 0 || i === lines.length - 1) {
      callback(`Loading 修飾語マスター (2024) ${i} / ${lines.length}`);
    }
  }
  await masterManageStore.setItem("shushokugoMasterVersion", VERSION);
  console.timeEnd("修飾語マスターの読み込み");
};
