import type { RecordType } from "../types";

const descriptions: (((record: RecordType) => string) | string)[] = [
  "この行が公費レコードであることを示します。公費を併用する場合は、優先度順で記録します",
  "公費負担者番号を示します",
  "公費受給者番号を示します",
  "任意給付区分を示しますが、このレコードは使用されていません",
  "診療実日数を示します",
  "合計点数を示します",
  "一部負担金額が発生する公費かつ記録が必要である場合、一部負担金を示します",
  "公費給付対象一部負担金を示します",
  "入院レセプトの場合、食事療養・生活療養の回数を示します",
  "入院レセプトの場合、食事療養・生活療養合計金額を示します",
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
