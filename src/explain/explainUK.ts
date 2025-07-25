import {
  shinsaShiharaiKikan,
  shisetsuKijunTodokedeCode,
  tensuhyo,
  todofukenCodes,
} from "../constants";
import { findFromKV } from "../tools";
import type { RecordType } from "../types";

const descriptions: (((record: RecordType) => string) | string)[] = [
  "この行が受付情報レコードであることを示します",
  (record) =>
    `審査支払機関を示します。値「${record.data}」は「${findFromKV(shinsaShiharaiKikan, record.data)}」です`,
  (record) =>
    `都道府県を示します。値「${record.data}」は「${findFromKV(todofukenCodes, record.data)}」です`,
  (record) =>
    `点数表を示します。値「${record.data}」は「${findFromKV(
      tensuhyo,
      record.data,
    )}」です`,
  "医療機関コードを示します",
  "予備エリアです",
  "地方厚生（支）局長に届け出た名称（全角）を示します。20文字を超える場合は、決まっている省略名称を記録します",
  "請求年月を西暦年月6桁で示します",
  (record) =>
    `地方厚生（支）局長に届け出た施設基準の施設基準届出コードを示します。請求年月の前月の状況なので注意してください。値「${record.data}」は「${record.data
      .match(/.{1,2}/g)
      ?.map((code) => findFromKV(shisetsuKijunTodokedeCode, code) ?? "不明")
      .join(", ")}」です`,
  (record) =>
    `マルチボリューム識別情報です。複数のUKEがある場合にこのUKEが何番目のUKEかを示します。値「${record.data}」はこのレセプトデータが${Number(record.data) + 1}番目であることを示します`,
] as const;

export const explainUK = (record: RecordType) => {
  if (record.index >= descriptions.length) {
    return null;
  }

  const description = descriptions[record.index];
  if (typeof description === "string") {
    return description;
  }
  return description(record);
};
