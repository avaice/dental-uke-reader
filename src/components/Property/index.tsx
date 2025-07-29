import { KVRenderer } from "@components/KVRenderer";
import { MasterViewer } from "@components/MasterViewer";
import { iyakuhinMaster } from "@master/iyakuhin";
import { shobyomeiMaster } from "@master/shobyomei";
import { relation } from "@misc/constants";
import type { RecordType } from "@misc/types";
import { useMemo } from "react";
import CO_5_Property from "./CO_5_Property";
import HS_3_Property from "./HS_3_Property";
import IR_8_Property from "./IR_8_Property";
import RE_11_Property from "./RE_11_Property";
import RE_13_Property from "./RE_13_Property";
import UK_8_Property from "./UK_8_Property";

export const Property = (props: { record: RecordType }) => {
  const key = `${props.record.identification}_${props.record.index}` as const;
  const rel = relation[key as keyof typeof relation];

  const contents = useMemo(() => {
    switch (key) {
      /**
       * マスター
       */
      case "HS_4":
        return (
          <MasterViewer
            master={shobyomeiMaster}
            record={props.record}
            key={props.record.data}
          />
        );
      case "IY_3":
        return (
          <MasterViewer
            master={iyakuhinMaster}
            record={props.record}
            key={props.record.data}
          />
        );

      /**
       * 固定値
       */
      case "UK_8":
        return <UK_8_Property record={props.record} rel={rel} />;
      case "RE_11":
        return <RE_11_Property record={props.record} rel={rel} />;
      case "RE_13":
        return <RE_13_Property record={props.record} rel={rel} />;
      case "IR_8":
        return <IR_8_Property record={props.record} rel={rel} />;
      case "HS_3":
        return <HS_3_Property record={props.record} rel={rel} />;
      case "CO_5":
        return <CO_5_Property record={props.record} rel={rel} />;
      default:
        if (rel !== undefined) {
          return (
            <div className="flex max-h-full max-w-full flex-col gap-2 overflow-y-scroll">
              <KVRenderer data={rel} highlight={[props.record.data]} />
            </div>
          );
        }
        return null;
    }
  }, [key, props.record, rel]);

  return (
    <div className="h-full overflow-y-scroll p-4" key={key}>
      {contents}
    </div>
  );
};
