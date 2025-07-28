import type { RecordType } from "../types";

const descriptions: (((record: RecordType) => string) | string)[] = [
  "この行が診療報酬請求書レコードであることを示します",
  "医療機関単位のレセプト件数の合計を示します",
  "総合計点数を示します",
  (record) => {
    const description = "マルチボリューム識別情報を示します。";
    if (record.data === "99") {
      return `${description}値が99なので、この媒体は最後尾のボリュームです`;
    } else {
      return `${description}値が${record.data}なので、この後に続くボリュームがあることを示します`;
    }
  },
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
