import { futanshaShubetsuCode, jushinKubunCode } from "../constants";
import { findFromKV } from "../tools";
import type { RecordType } from "../types";

const descriptions: (((record: RecordType) => string) | string)[] = [
  "この行が受診日等レコードであることを示します",
  (record) =>
    `負担者種別を示します。${
      record.data !== ""
        ? `値「${record.data}」は「${findFromKV(futanshaShubetsuCode, record.data)}」です`
        : ""
    }`,
  ...new Array(31).fill(
    (record: RecordType) =>
      `${Number(record.index) - 1}日の受診等区分コードを示します。${
        record.data !== ""
          ? `値「${record.data}」は「${findFromKV(jushinKubunCode, record.data)}」です`
          : ""
      }`,
  ),
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
