import {
  futanKubunCode,
  shinryoShikibetsuCode,
  tokuteiKizaiKasanCode,
} from "@misc/constants";
import { findFromKV } from "@misc/tools";
import type { RecordType } from "@misc/types";

const descriptions: (((record: RecordType) => string) | string)[] = [
  "この行が特定器材レコードであることを示します",
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
  "特定機材コードを示します",
  "使用量を示します",
  "単位コードを示します",
  "単価を示します",
  (record) =>
    `酸素補正率、高気圧酸素治療に用いる酸素の治療圧力及びフィルムの乳幼児加算を算定する場合、特定器材加算等コード１を示します。値「${record.data}は${findFromKV(tokuteiKizaiKasanCode, record.data)}」です`,
  "特定器材加算等コード１の数量を示します",
  (record) =>
    `酸素補正率、高気圧酸素治療に用いる酸素の治療圧力及びフィルムの乳幼児加算を算定する場合、特定器材加算等コード２を示します。値「${record.data}は${findFromKV(tokuteiKizaiKasanCode, record.data)}」です`,
  "特定器材加算等コード２の数量を示します",
  "商品名及び規格又はサイズを示します",
  "点数を示します",
  "回数を示します",
  ...Array.from({ length: 31 }, (_, i) => `${i + 1}日の回数を示します`),
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
