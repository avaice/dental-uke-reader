import type { RecordType } from "../types";
import explainHO from "./explainHO";
import explainHS from "./explainHS";
import explainIR from "./explainIR";
import explainIY from "./explainIY";
import explainJD from "./explainJD";
import explainKO from "./explainKO";
import explainMF from "./explainMF";
import explainRE from "./explainRE";
import explainSI from "./explainSI";
import explainSN from "./explainSN";
import explainSS from "./explainSS";
import explainTO from "./explainTO";
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
    case "SS":
      return explainSS(record);
    case "SI":
      return explainSI(record);
    case "IY":
      return explainIY(record);
    case "TO":
      return explainTO(record);
    default:
      return null;
  }
};
