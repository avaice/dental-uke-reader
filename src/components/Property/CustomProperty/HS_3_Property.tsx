import { Button } from "@components/_parts/Button";
import { KVRenderer } from "@components/KVRenderer";
import { toothPartCode, toothStatusCode, toothTypeCode } from "@misc/constants";
import { cn, findFromKV } from "@misc/tools";
import type { KVType, RecordType } from "@misc/types";
import { useMemo, useState } from "react";

type Props = {
  record: RecordType;
  rel: KVType;
};

const Property = (props: Props) => {
  const [selectedCode, setSelectedCode] = useState<string | null>(
    props.record.data.match(/.{1,6}/g)?.[0] ?? null,
  );
  const toothInfo = useMemo(() => {
    if (!selectedCode) return null;
    const toothType = findFromKV(toothTypeCode, selectedCode.slice(0, 4));
    const toothStatus = findFromKV(toothStatusCode, selectedCode.slice(4, 5));
    const toothPart = findFromKV(toothPartCode, selectedCode.slice(5, 6));
    return { toothType, toothStatus, toothPart };
  }, [selectedCode]);
  return (
    <div className="flex flex-col gap-2">
      {toothInfo && (
        <h3 className="text-lg">
          {toothInfo.toothType} {toothInfo.toothStatus} {toothInfo.toothPart}
        </h3>
      )}
      <div className="flex flex-wrap gap-2">
        {props.record.data.match(/.{1,6}/g)?.map((code) => {
          return (
            <Button
              key={code}
              onClick={() => setSelectedCode(code)}
              className={cn(
                code === selectedCode &&
                  "bg-gray-900 text-white hover:bg-gray-900 active:bg-gray-900",
              )}
              disabled={code === selectedCode}
            >
              {`${code}`}
            </Button>
          );
        })}
      </div>
      <div>
        <h4>1~4文字目</h4>
        <KVRenderer
          data={toothTypeCode}
          highlight={selectedCode ? [selectedCode.slice(0, 4)] : []}
        />
      </div>
      <div>
        <h4>5文字目</h4>
        <KVRenderer
          data={toothStatusCode}
          highlight={selectedCode ? [selectedCode.slice(4, 5)] : []}
        />
      </div>
      <div>
        <h4>6文字目</h4>
        <KVRenderer
          data={toothPartCode}
          highlight={selectedCode ? [selectedCode.slice(5, 6)] : []}
        />
      </div>
    </div>
  );
};

export default Property;
