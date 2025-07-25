import { futanKubunCode, shinryoShikibetsuCode } from "../constants";
import { findFromKV } from "../tools";
import type { RecordType } from "../types";

const descriptions: (((record: RecordType) => string) | string)[] = [
  "この行が医科診療行為レコードであることを示します",
  (record) =>
    `診療識別を示します。${
      record.data !== ""
        ? `値「${record.data}」は「${findFromKV(shinryoShikibetsuCode, record.data)}」です`
        : ""
    }`,
  (record) =>
    `診療負担区分を示します。${
      record.data !== ""
        ? `値「${record.data}」は「${findFromKV(futanKubunCode, record.data)}」です`
        : ""
    }`,
  "医科の診療行為コードを示します",
  "診療行為の数量データを示します",
  "診療行為の点数を示します。点数・回数算定単位が複数レコードで構成されている場合、点数・回数算定単位内の最終レコードのみ値が記録されます",
  "回数を示します",
  ...Array.from({ length: 31 }, (_, i) => `${i + 1}日の診療回数を示します`),
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
