import { genmenKubunCode, shokumuReasonCode } from "../constants";
import { findFromKV } from "../tools";
import type { RecordType } from "../types";

const descriptions: (((record: RecordType) => string) | string)[] = [
  "この行が保険者レコードであることを示します",
  "保険者番号を示します",
  "被保険者証（手帳）等の記号を示します",
  "被保険者証（手帳）等の番号を示します",
  "診療実日数を示します",
  "合計点数を示します",
  "食事療養・生活療養回数を示します",
  "食事療養養・生活療養合計金額を示します",
  (record) =>
    `船員保険の被保険者及び共済組合の船員組合員で職務上の取り扱いとなる場合にのみ、職務上の事由を記載します。${
      record.data !== ""
        ? `値「${record.data}」は「${findFromKV(shokumuReasonCode, record.data)}」です`
        : ""
    }`,
  "証明書番号を示しますが、このレコードは使用されていません",
  "医療保険一部負担金額を示します",
  (record) =>
    `減免区分コードを示します。${
      record.data !== ""
        ? `値「${record.data}」は「${findFromKV(genmenKubunCode, record.data)}」です`
        : ""
    }`,
  "減額割合を百分率で示します",
  "減額金額を示します",
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
