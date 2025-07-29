import { masterManageStore } from "@master/masterManageInstance";
import { commentMasterHeaders } from "./header";
import { commentMasterStore } from "./instance";
import master from "./master_data_utf8.txt";

const VERSION = "20250729";

export const loadCommentMaster = async (
  callback: (message: string) => void,
) => {
  const version = await masterManageStore.getItem("commentMasterVersion");
  if (version === VERSION) {
    console.log("コメントマスターはすでに読み込まれています");
    return;
  }

  console.time("コメントマスターの読み込み");
  callback("Downloading コメントマスター...");
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
          record[commentMasterHeaders[columnIndex].name] = buffer;
          columnIndex++;
          buffer = "";
        }
      } else {
        buffer += line[p];
      }
      p++;
    }
    if (record.コメントコード) {
      const exists = await commentMasterStore.getItem(record.コメントコード);
      if (exists) {
        await commentMasterStore.setItem(record.コメントコード, [
          ...(exists as Record<string, string>[]),
          record,
        ]);
      } else {
        await commentMasterStore.setItem(record.コメントコード, [record]);
      }
    }
    if (i % 1000 === 0 || i === lines.length - 1) {
      callback(`Loading コメントマスター ${i} / ${lines.length}`);
    }
  }
  await masterManageStore.setItem("commentMasterVersion", VERSION);
  console.timeEnd("コメントマスターの読み込み");
};
