import { madoguchiFutanKubunCode } from "@misc/constants";
import { findFromKV } from "@misc/tools";
import type { RecordType } from "@misc/types";

const descriptions: (((record: RecordType) => string) | string)[] = [
  "この行が窓口負担額レコードであることを示します",
  (record) =>
    `窓口負担額区分を示します。${
      record.data !== ""
        ? `値「${record.data}」は「${findFromKV(madoguchiFutanKubunCode, record.data)}」です`
        : ""
    }`,
  ...new Array(31).fill("予備エリアです"),
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
