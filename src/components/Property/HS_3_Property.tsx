import { toothPartCode, toothStatusCode, toothTypeCode } from "../../constants";
import { findFromKV } from "../../tools";
import type { KVType, RecordType } from "../../types";
import { KVRenderer } from "../KVRenderer";

type Props = {
  record: RecordType;
  rel: KVType;
};

const Property = (props: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <p>6文字区切りで解釈します。</p>
      <div className="flex flex-wrap gap-2">
        {props.record.data.match(/.{1,6}/g)?.map((code) => {
          const toothType = findFromKV(toothTypeCode, code.slice(0, 4));
          const toothStatus = findFromKV(toothStatusCode, code.slice(4, 5));
          const toothPart = findFromKV(toothPartCode, code.slice(5, 6));
          return (
            <button
              type="button"
              className="rounded border px-1 py-0.5"
              key={code}
            >
              {`${code}`}
            </button>
          );
        })}
      </div>
      <div>
        <h3>1~4文字目</h3>
        <KVRenderer data={toothTypeCode} highlight={[]} />
      </div>
      <div>
        <h3>5文字目</h3>
        <KVRenderer data={toothStatusCode} highlight={[]} />
      </div>
      <div>
        <h3>6文字目</h3>
        <KVRenderer data={toothPartCode} highlight={[]} />
      </div>
    </div>
  );
};

export default Property;
