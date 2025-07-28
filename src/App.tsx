import { useState } from "react";
import { SidePanel } from "./components/SidePanel";
import { UKERenderer } from "./components/UKERenderer";
import { recordType } from "./constants";
import { explain } from "./explain";
import { useUKE } from "./hooks/useUKE";
import { findFromKV } from "./tools";
import type { RecordType } from "./types";

function App() {
  const { loadUKE, UKE } = useUKE();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [record, setRecord] = useState<RecordType | null>(null);

  return (
    <div className="p-4">
      <div className="h-[150px]">
        <div className="flex justify-between gap-2">
          <h2 className="font-bold text-2xl">UKE Reader</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadUKE}
              className="rounded border px-2 py-0.5 transition hover:bg-gray-100 active:bg-gray-200"
            >
              UKEを読み込む
            </button>
            <button
              type="button"
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="w-[170px] rounded border px-2 py-0.5 transition hover:bg-gray-100 active:bg-gray-200"
            >
              サイドバーを
              {isSidePanelOpen ? "閉じる" : "開く"}
            </button>
          </div>
        </div>
        {record && (
          <div className="flex flex-col gap-1 py-2">
            <div className="flex gap-2 text-sm">
              <div className="w-[200px] shrink-0 font-bold">
                Idx: {record.index} in{" "}
                {findFromKV(recordType, record.identification) ?? "unknown"}
              </div>
              <div className="w-full">Value: {record.data}</div>
            </div>
            <div className="h-[75px] overflow-y-scroll rounded border p-2 text-sm">
              <span>{explain(record) ?? "unknown"}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex h-[calc(100svh_-_150px_-_32px)] w-full gap-2">
        <div className="h-full w-full overflow-x-scroll rounded border transition-all">
          {UKE && <UKERenderer UKE={UKE} setRecord={setRecord} />}
        </div>
        {isSidePanelOpen && <SidePanel />}
      </div>
    </div>
  );
}

export default App;
