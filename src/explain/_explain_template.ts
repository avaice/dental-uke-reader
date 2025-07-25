import type { RecordType } from "../types";

const descriptions: ((record: RecordType) => string | string)[] = [] as const;

export const explainUK = (record: RecordType) => {
  if (record.index >= descriptions.length) {
    return null;
  }

  const description = descriptions[record.index];
  if (typeof description === "string") {
    return description;
  }
  return description(record);
};
