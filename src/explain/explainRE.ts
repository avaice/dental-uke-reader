import {
  byotoKubunCode,
  kanjaJotaiCode,
  receptTokkijikouCode,
  receptTypeCode,
  sex,
  tenkiKubunCode,
} from "@misc/constants";
import { findFromKV } from "@misc/tools";
import type { RecordType } from "@misc/types";

const descriptions: (((record: RecordType) => string) | string)[] = [
  "この行がレセプト共通レコードであることを示します",
  "レセプト番号を示します。1から始まり、複数のボリュームをまたいで連番になっています",
  (record) =>
    `レセプト種別を示します。値「${record.data}」は「${findFromKV(
      receptTypeCode,
      record.data,
    )}」です`,
  "請求年月を西暦年月6桁で示します",
  "氏名を示します",
  (record) =>
    `男女区分を示します。値「${record.data}」は「${findFromKV(
      sex,
      record.data,
    )}」です`,
  "生年月日を西暦年月日8桁で示します",
  "被爆者健康手帳の給付を受けており、国民健康保険の被保険者証の交付を受けていない場合のみ使用します",
  "入院レセプトの場合のみ、入院基本料の起算日としての入院年月日を西暦年月日８桁で示します",
  "入院外レセプトの場合のみ、保険診療を開始した年月日を西暦年月日８桁で示します",
  (record) =>
    `転帰区分を示します。値「${record.data}」は「${findFromKV(
      tenkiKubunCode,
      record.data,
    )}」です`,
  (record) =>
    `入院レセプトの場合、病棟区分を示します。月の途中に患者が病棟を移った場合は、移った順に記録します。${
      record.data.length > 0
        ? `値「${record.data}」は「${record.data
            .match(/.{1,2}/g)
            ?.map((code) => findFromKV(byotoKubunCode, code) ?? "不明")
            .join(", ")}」です`
        : ""
    }`,
  (record) => {
    let description =
      "一部負担金・食事療養費・生活療養費標準負担額区分を示します。";
    const birth = new Date(record.row[6]);
    const isHospitalized = record.row[8] !== "";
    const date = new Date(isHospitalized ? record.row[8] : record.row[9]);
    const diff = date.getTime() - birth.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

    if (record.data === "") {
      return description;
    }

    description += `値が「${record.data}」`;

    if (age >= 70) {
      switch (record.data) {
        case "1":
          if (isHospitalized) {
            description +=
              "70歳以上の入院レセプトなので、「入院時負担金額並びに食事療養又は生活療養に係る標準負担額（入院日数 90 日以下の者）」の区分が「低所得者の世帯（適用区分：Ⅱ）」であることを示します";
          } else {
            description +=
              "70歳以上の入院外レセプトなので、「外来時一部負担金額」の区分が「低所得者の世帯（適用区分：Ⅱ）」であることを示します";
          }
          break;
        case "2":
          if (isHospitalized) {
            description +=
              "70歳以上の入院レセプトなので、「入院時負担金額並びに食事療養又は生活療養に係る標準負担額（入院日数 90 日を超える者）」の区分が「低所得者の世帯（適用区分：Ⅱ）」であることを示します";
          } else {
            description +=
              "入院外レセプトでこの値が入ることはないため、不正なデータです";
          }
          break;
        case "3":
          if (isHospitalized) {
            description +=
              "70歳以上の入院レセプトなので、「入院時負担金額並びに食事療養又は生活療養に係る標準負担額」の区分が「低所得者の世帯（適用区分：Ⅰ）」であることを示します";
          } else {
            description +=
              "70歳以上の入院外レセプトなので、「外来時一部負担金額」の区分が「低所得者の世帯（適用区分：Ⅰ）」であることを示します";
          }
          break;
        case "4":
          description +=
            "70歳以上のレセプトなので、「生活療養に係る標準負担額」が「低所得者の世帯（適用区分：Ⅰ）（老齢福祉年金受給）」であることを示します";
          break;
        default:
          description += "不正な値です";
          break;
      }
    } else {
      switch (record.data) {
        case "1":
          if (isHospitalized) {
            description +=
              "70歳未満の入院レセプトなので、「入院時負担金額並びに食事療養又は生活療養に係る標準負担額（入院日数 90 日以下の者）」の区分が「低所得者の世帯（適用区分：オ）」であることを示します";
          } else {
            description +=
              "70歳未満の入院外レセプトでこの値が入ることはないため、不正なデータです";
          }
          break;
        case "2":
          if (isHospitalized) {
            description +=
              "70歳未満の入院レセプトなので、「入院時負担金額並びに食事療養又は生活療養に係る標準負担額（入院日数 90 日以上の者）」の区分が「低所得者の世帯（適用区分：オ）」であることを示します";
          } else {
            description +=
              "入院外レセプトでこの値が入ることはないため、不正なデータです";
          }
          break;
        default:
          description += "不正な値です";
          break;
      }
    }
    return description;
  },
  (record) =>
    `レセプト特記事項を示します。${
      record.data !== ""
        ? `値「${record.data}」は「${record.data
            .match(/.{1,2}/g)
            ?.map((code) => findFromKV(receptTokkijikouCode, code) ?? "不明")
            .join(", ")}」です`
        : ""
    }`,
  "予備エリアです",
  "カルテ番号等、保険医療機関が任意で記録可能な値を示します",
  (record) =>
    `健康保険法第７６条第３項に基づく事項により、割引点数単価による請求となる場合、記録します。${record.data !== "" ? `この値では、1点単価を${record.data}円として窓口徴収したことを示します` : ""}`,
  "予備エリアです",
  (record) =>
    `値が「01」の場合、未来院請求を行う入院外レセプトであることを示します。${record.data === "01" ? "値が「01」なので、未来院請求を行ったことを示します" : ""}`,
  "返戻されたレセプトの再請求を行う場合の検索番号を示します",
  "予備エリアです",
  "保険医療機関が任意で記録可能な値を示します",
  "予備エリアです",
  "予備エリアです",
  "予備エリアです",
  "カタカナの氏名を示します",
  (record) =>
    `患者の状態を示します。${
      record.data.trim() !== ""
        ? `値「${record.data}」は「${findFromKV(
            kanjaJotaiCode,
            record.data,
          )}」です`
        : ""
    }`,
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
