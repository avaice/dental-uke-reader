import { masterManageStore } from "@master/masterManageInstance";
import { MASTER_VERSIONS } from "../masterVersions";
import { shobyomeiMasterHeaders } from "./header";
import { shobyomeiMasterStore } from "./instance";
import master from "./master_data_utf8.txt";

const VERSION = MASTER_VERSIONS.shobyomeiMasterVersion;

export const loadShobyomeiMaster = async (
  callback: (message: string) => void,
) => {
  const version = await masterManageStore.getItem("shobyomeiMasterVersion");
  if (version === VERSION) {
    console.log("傷病名マスターはすでに読み込まれています");
    return;
  }

  console.time("傷病名マスターの読み込み");
  callback("Downloading 傷病名マスター...");
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
          record[shobyomeiMasterHeaders[columnIndex].name] = buffer;
          columnIndex++;
          buffer = "";
        }
      } else {
        buffer += line[p];
      }
      p++;
    }
    if (record.傷病名コード) {
      const exists = await shobyomeiMasterStore.getItem(record.傷病名コード);
      if (exists) {
        await shobyomeiMasterStore.setItem(record.傷病名コード, [
          ...(exists as Record<string, string>[]),
          record,
        ]);
      } else {
        await shobyomeiMasterStore.setItem(record.傷病名コード, [record]);
      }
    }
    if (i % 1000 === 0 || i === lines.length - 1) {
      callback(`Loading 傷病名マスター ${i} / ${lines.length}`);
    }
  }
  await masterManageStore.setItem("shobyomeiMasterVersion", VERSION);
  console.timeEnd("傷病名マスターの読み込み");
};
