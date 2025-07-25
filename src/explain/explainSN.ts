import { futanshaShubetsuCode, kakuninKubunCode } from "../constants";
import { findFromKV } from "../tools";
import type { RecordType } from "../types";

const descriptions: (((record: RecordType) => string) | string)[] = [
  "この行が資格確認レコードであることを示します",
  (record) =>
    `負担者種別を示します。${
      record.data !== ""
        ? `値「${record.data}」は「${findFromKV(futanshaShubetsuCode, record.data)}」です`
        : ""
    }`,
  (record) =>
    `資格確認区分を示します。${
      record.data !== ""
        ? `値「${record.data}」は「${findFromKV(kakuninKubunCode, record.data)}」です`
        : ""
    }`,
  "保険者番号等を示します",
  "被保険者証（手帳）等の記号を示します",
  "被保険者証（手帳）等の番号を示します",
  "枝番を示します（負担車種別が1の場合のみ）",
  "受給者番号を示します",
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
