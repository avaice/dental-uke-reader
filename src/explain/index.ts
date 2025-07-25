import type { RecordType } from "../types";
import explainHO from "./explainHO";
import explainHS from "./explainHS";
import explainIR from "./explainIR";
import explainJD from "./explainJD";
import explainKO from "./explainKO";
import explainMF from "./explainMF";
import explainRE from "./explainRE";
import explainSN from "./explainSN";
import explainUK from "./explainUK";

export const explain = (record: RecordType) => {
  switch (record.identification) {
    case "UK":
      return explainUK(record);
    case "IR":
      return explainIR(record);
    case "RE":
      return explainRE(record);
    case "HO":
      return explainHO(record);
    case "KO":
      return explainKO(record);
    case "SN":
      return explainSN(record);
    case "JD":
      return explainJD(record);
    case "MF":
      return explainMF(record);
    case "HS":
      return explainHS(record);
    default:
      return null;
  }
};
