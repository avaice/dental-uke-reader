import type { RecordType } from "../types";
import { explainUK } from "./explainUK";

export const explain = (record: RecordType) => {
  switch (record.identification) {
    case "UK":
      return explainUK(record);
    default:
      return null;
  }
};
