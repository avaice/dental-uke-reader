import { masterManageStore } from "@master/masterManageInstance";
import { MASTER_VERSIONS } from "../../masterVersions";
import { shikaKihonChuMasterHeaders } from "./header";
import { shikaKihonChuMasterStore } from "./instance";
import master from "./master_data_utf8.txt";

const VERSION = MASTER_VERSIONS.shikaKihonChuMasterVersion;

export const loadShikaKihonChuMaster2026 = async (
  callback: (message: string) => void,
) => {
  const version = await masterManageStore.getItem("shikaKihonChuMasterVersion");
  if (version === VERSION) {
    console.log(
      "歯科診療行為（基本・注加算）マスターはすでに読み込まれています",
    );
    return;
  }

  console.time("歯科診療行為（基本・注加算）マスターの読み込み");
  callback("Downloading 歯科診療行為（基本・注加算）マスター...");
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
          record[shikaKihonChuMasterHeaders[columnIndex].name] = buffer;
          columnIndex++;
          buffer = "";
        }
      } else {
        buffer += line[p];
      }
      p++;
    }
    if (record.加算コード) {
      const exists = await shikaKihonChuMasterStore.getItem(record.加算コード);
      if (exists) {
        await shikaKihonChuMasterStore.setItem(record.加算コード, [
          ...(exists as Record<string, string>[]),
          record,
        ]);
      } else {
        await shikaKihonChuMasterStore.setItem(record.グループ番号, [record]);
      }
    }
    if (i % 1000 === 0 || i === lines.length - 1) {
      callback(
        `Loading 歯科診療行為（基本・注加算）マスター ${i} / ${lines.length}`,
      );
    }
  }
  await masterManageStore.setItem("shikaKihonChuMasterVersion", VERSION);
  console.timeEnd("歯科診療行為（基本・注加算）マスターの読み込み");
};
