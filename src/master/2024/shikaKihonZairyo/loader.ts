import { masterManageStore } from "@master/masterManageInstance";
import { shikaKihonZairyoMasterHeaders } from "./header";
import { shikaKihonZairyoMasterStore } from "./instance";
import master from "./master_data_utf8.txt";

const VERSION = "20250729";

export const loadShikaKihonZairyoMaster = async (
  callback: (message: string) => void,
) => {
  const version = await masterManageStore.getItem(
    "shikaKihonZairyoMasterVersion",
  );
  if (version === VERSION) {
    console.log(
      "歯科診療行為（基本・材料加算）マスターはすでに読み込まれています",
    );
    return;
  }

  console.time("歯科診療行為（基本・材料加算）マスターの読み込み");
  callback("Downloading 歯科診療行為（基本・材料加算）マスター (2024)...");
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
          record[shikaKihonZairyoMasterHeaders[columnIndex].name] = buffer;
          columnIndex++;
          buffer = "";
        }
      } else {
        buffer += line[p];
      }
      p++;
    }
    if (record.加算コード) {
      const exists = await shikaKihonZairyoMasterStore.getItem(
        record.加算コード,
      );
      if (exists) {
        await shikaKihonZairyoMasterStore.setItem(record.加算コード, [
          ...(exists as Record<string, string>[]),
          record,
        ]);
      } else {
        await shikaKihonZairyoMasterStore.setItem(record.加算コード, [record]);
      }
    }
    if (i % 1000 === 0 || i === lines.length - 1) {
      callback(
        `Loading 歯科診療行為（基本・材料加算）マスター (2024) ${i} / ${lines.length}`,
      );
    }
  }
  await masterManageStore.setItem("shikaKihonZairyoMasterVersion", VERSION);
  console.timeEnd("歯科診療行為（基本・材料加算）マスターの読み込み");
};
