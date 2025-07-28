import {
  futanKubunCode,
  shinryoShikibetsuCode,
  toothPartCode,
  toothStatusCode,
  toothTypeCode,
} from "../constants";
import { findFromKV } from "../tools";
import type { RecordType } from "../types";

const descriptions: (((record: RecordType) => string) | string)[] = [
  "この行がコメントレコードであることを示します",
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
  "コメントコードを示します",
  `文字データを示します。使用できるコメントパターンはコメントマスターで定められています`,
  (record) => {
    let description = `歯式コードを示します。値「${record.data}」は「`;
    description += record.data
      .match(/.{1,6}/g)
      ?.map((code) => {
        const toothType = findFromKV(toothTypeCode, code.slice(0, 4));
        const toothStatus = findFromKV(toothStatusCode, code.slice(4, 5));
        const toothPart = findFromKV(toothPartCode, code.slice(5, 6));
        return `[${code}]${toothType} ${toothStatus} ${toothPart}`;
      })
      .join(", ");
    description += "」です";
    return description;
  },
  "予備エリアです",
  "予備エリアです",
  "予備エリアです",
  "予備エリアです",
  "予備エリアです",
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
