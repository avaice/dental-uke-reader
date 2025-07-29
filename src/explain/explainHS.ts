import {
  byotaiIkouCode,
  tenkiKubunCode,
  toothPartCode,
  toothStatusCode,
  toothTypeCode,
} from "@misc/constants";
import { findFromKV } from "@misc/tools";
import type { RecordType } from "@misc/types";

const descriptions: (((record: RecordType) => string) | string)[] = [
  "この行が傷病名部位レコードであることを示します",
  "入院レセプトの場合、診療開始日を示します",
  (record) =>
    `入院レセプトの場合、転帰区分を示します。${
      record.data !== ""
        ? `値「${record.data}」は「${findFromKV(tenkiKubunCode, record.data)}」です`
        : ""
    }`,
  (record) => {
    let description = `歯式コードを示します。`;
    if (record.data === "") {
      return description;
    }
    description += `値「${record.data}」は「`;
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
  (record) =>
    record.data === "0000999"
      ? "傷病名マスターの「傷病名コード」を示します。値「0000999」は未コード化傷病名コードです"
      : "傷病名マスターの「傷病名コード」を示します",
  "修飾語マスターの「修飾語コード」を示します",
  "傷病名コードに「0000999」を使用する場合に限り、傷病名称を示します",
  "併存傷病名数を示します。最初のレコードのみに指定します",
  (record) =>
    `病態移行を示します。${
      record.data !== ""
        ? `値「${record.data}」は「${findFromKV(byotaiIkouCode, record.data)}」です`
        : ""
    }`,
  "入院レセプトの場合、01であれば、主傷病であることを示します",
  (record) =>
    `傷病名に対する補足コメントを示します。${
      record.data !== ""
        ? `値「${record.data}」は「コメントコード:${record.data.slice(0, 1)}, パターン:${record.data.slice(1, 3)}, 番号:${record.data.slice(3, 9)}」です`
        : ""
    }`,
  "補足コメントのパターンが「10」の場合のみ、傷病名に対する補足コメントを示します",
  "補足コメントに歯式表示が必要な場合のみ、歯式コードを示します",
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
