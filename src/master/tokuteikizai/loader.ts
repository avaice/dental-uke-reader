import { masterManageStore } from "@master/masterManageInstance";
import { tokuteikizaiMasterHeaders } from "./header";
import { tokuteikizaiMasterStore } from "./instance";
import master from "./master_data_utf8.txt";

const VERSION = "20250729";

export const loadTokuteikizaiMaster = async (
  callback: (message: string) => void,
) => {
  const version = await masterManageStore.getItem("tokuteikizaiMasterVersion");
  if (version === VERSION) {
    console.log("特定器材マスターはすでに読み込まれています");
    return;
  }

  console.time("特定器材マスターの読み込み");
  callback("Downloading 特定機材マスター...");
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
          record[tokuteikizaiMasterHeaders[columnIndex].name] = buffer;
          columnIndex++;
          buffer = "";
        }
      } else {
        buffer += line[p];
      }
      p++;
    }
    if (record.特定器材コード) {
      const exists = await tokuteikizaiMasterStore.getItem(
        record.特定器材コード,
      );
      if (exists) {
        await tokuteikizaiMasterStore.setItem(record.特定器材コード, [
          ...(exists as Record<string, string>[]),
          record,
        ]);
      } else {
        await tokuteikizaiMasterStore.setItem(record.特定器材コード, [record]);
      }
    }
    if (i % 1000 === 0 || i === lines.length - 1) {
      callback(`Loading 特定器材マスター ${i} / ${lines.length}`);
    }
  }
  await masterManageStore.setItem("tokuteikizaiMasterVersion", VERSION);
  console.timeEnd("特定器材マスターの読み込み");
};
