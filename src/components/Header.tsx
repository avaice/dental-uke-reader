import { explain } from "@explain/index";
import { loadMaster } from "@master/loadMaster";
import { recordType } from "@misc/constants";
import { findFromKV } from "@misc/tools";
import type { RecordType } from "@misc/types";
import { useState } from "react";
import { Button } from "./_parts/Button";
import { LoadingOverlay } from "./LoadingOverlay";

type Props = {
  record: RecordType | null;
  loadUKE: () => void;
};

export const Header = (props: Props) => {
  const [message, setMessage] = useState<string | null>(null);
  return (
    <header>
      <div className="flex justify-between gap-2">
        <h2 className="font-bold text-2xl">UKE Reader</h2>
        <div className="flex gap-2">
          <Button onClick={props.loadUKE}>UKEを読み込む</Button>
          <Button
            onClick={async () => {
              await loadMaster(setMessage);
              setMessage(null);
              alert("マスターを読み込みました");
            }}
          >
            マスターを読み込む
          </Button>
        </div>
      </div>
      {props.record && (
        <div className="flex flex-col gap-1 py-2">
          <div className="flex gap-2 text-sm">
            <div className="w-[200px] shrink-0 font-bold">
              Idx: {props.record.index} in{" "}
              {findFromKV(recordType, props.record.identification) ?? "unknown"}
            </div>
            <div className="w-full">Value: {props.record.data}</div>
          </div>
          <div className="h-[75px] overflow-y-scroll rounded border p-2 text-sm">
            <span>{explain(props.record) ?? "unknown"}</span>
          </div>
        </div>
      )}
      {message && <LoadingOverlay message={message} />}
    </header>
  );
};
