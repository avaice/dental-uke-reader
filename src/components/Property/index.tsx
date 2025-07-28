import { relation } from "../../constants";
import type { RecordType } from "../../types";
import { KVRenderer } from "../KVRenderer";

export const Property = (props: { record: RecordType }) => {
  const key =
    `${props.record.identification}_${props.record.index}` as keyof typeof relation;
  const rel = relation[key];
  if (rel !== undefined) {
    return (
      <div className="flex max-h-full max-w-full flex-col gap-2 overflow-y-scroll">
        <KVRenderer data={rel} highlight={[props.record.data]} />
      </div>
    );
  }
  return null;
};
