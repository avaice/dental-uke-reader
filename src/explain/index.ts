import type { RecordType } from "../types";
import explainIR from "./explainIR";
import explainUK from "./explainUK";

export const explain = (record: RecordType) => {
  switch (record.identification) {
    case "UK":
      return explainUK(record);
    case "IR":
      return explainIR(record);
    default:
      return null;
  }
};
