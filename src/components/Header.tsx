import { explain } from "@explain/index";
import { masterLoadStateAtom } from "@misc/atoms";
import { recordType } from "@misc/constants";
import { findFromKV } from "@misc/tools";
import type { RecordType } from "@misc/types";
import { useAtomValue } from "jotai";
import { Button } from "./_parts/Button";

type Props = {
  record: RecordType | null;
  loadUKE: () => void;
  onOpenToolsPanel: () => void;
};

export const Header = (props: Props) => {
  const { isMasterVersionUpToDate, isMasterLoaded } =
    useAtomValue(masterLoadStateAtom);
  return (
    <header>
      {isMasterLoaded && isMasterVersionUpToDate === false && (
        <div className="mb-[5px] flex h-[25px] items-center rounded bg-[#617bff] px-1 text-sm text-white">
          <span>
            令和8年度診療報酬改定に対応したマスタ更新があります。Searchボタンからマスタを更新できます。
          </span>
        </div>
      )}
      {isMasterLoaded === false && (
        <div className="mb-[5px] flex h-[25px] items-center rounded bg-[#617bff] px-1 text-sm text-white">
          <span>
            UKE Readerへようこそ。Searchボタンからマスタを読み込んでください。
          </span>
        </div>
      )}
      <div className="flex justify-between gap-2">
        <h2 className="font-bold text-2xl">UKE Reader</h2>
        <div className="flex gap-2">
          <Button onClick={props.loadUKE}>UKEを開く</Button>
          <Button onClick={props.onOpenToolsPanel}>Search</Button>
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
    </header>
  );
};
