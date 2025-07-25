import type { RecordType } from "../types";
import explainIR from "./explainIR";
import explainRE from "./explainRE";
import explainUK from "./explainUK";

export const explain = (record: RecordType) => {
  switch (record.identification) {
    case "UK":
      return explainUK(record);
    case "IR":
      return explainIR(record);
    case "RE":
      return explainRE(record);
    default:
      return null;
  }
};
