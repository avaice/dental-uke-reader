import {
  futanKubunCode,
  iyakuhinKubunCode,
  nyuingaiShinryoShikibetsuCode,
} from "@misc/constants";
import { findFromKV } from "@misc/tools";
import type { RecordType } from "@misc/types";

const descriptions: (((record: RecordType) => string) | string)[] = [
  "この行が医薬品レコードであることを示します",
  (record) =>
    `診療識別を示します。次に続く値では一律で入院外レセプトの場合の結果を表示するので、そうでない場合は手引を参照してください。${
      record.data !== ""
        ? `値「${record.data}」は「${findFromKV(nyuingaiShinryoShikibetsuCode, record.data)}」です`
        : ""
    }`,
  (record) =>
    `診療負担区分を示します。${
      record.data !== ""
        ? `値「${record.data}」は「${findFromKV(futanKubunCode, record.data)}」です`
        : ""
    }`,
  "医薬品コードを示します",
  "使用量を示します",
  "点数を示します。合剤の場合は最後のレコードのみ値が記録されます",
  "回数を示します",
  (record) =>
    `医薬品区分を示します。値「${record.data}」は「${findFromKV(
      iyakuhinKubunCode,
      record.data,
    )}」です`,
  ...Array.from({ length: 31 }, (_, i) => `${i + 1}日の使用回数を示します`),
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
