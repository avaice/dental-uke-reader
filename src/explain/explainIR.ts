import {
  shinsaShiharaiKikan,
  shisetsuKijunTodokedeCode,
  tensuhyo,
  todofukenCodes,
} from "@misc/constants";
import { findFromKV } from "@misc/tools";
import type { RecordType } from "@misc/types";

const descriptions: (((record: RecordType) => string) | string)[] = [
  "この行が医療機関情報レコードであることを示します",
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
  "請求年月を西暦年月6桁で示します",
  "保険医療機関の電話番号を示します(03)1234-5678または03-1234-5678のフォーマットで記録されます",
  (record) =>
    `地方厚生（支）局長に届け出た施設基準の施設基準届出コードを示します。UKとは違い、請求年月にかかわらずレセプトの診療年月時点の状況なので注意してください。値「${record.data}」は「${record.data
      .match(/.{1,2}/g)
      ?.map((code) => findFromKV(shisetsuKijunTodokedeCode, code) ?? "不明")
      .join(", ")}」です`,
] as const;

const explain = (record: RecordType) => {
  if (record.index >= descriptions.length) {
    return null;
  }

  const description = descriptions[record.index];
  if (typeof description === "string") {
    return description;
  }
  return description(record);
};

export default explain;
