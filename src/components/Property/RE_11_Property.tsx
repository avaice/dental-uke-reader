import { KVRenderer } from "@components/KVRenderer";
import type { KVType, RecordType } from "@misc/types";

type Props = {
  record: RecordType;
  rel: KVType;
};

const Property = (props: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <p>2文字区切りで解釈します。</p>
      <KVRenderer
        data={props.rel}
        highlight={
          props.record.data.match(/.{1,2}/g)?.map((code) => code) ?? []
        }
      />
    </div>
  );
};

export default Property;
