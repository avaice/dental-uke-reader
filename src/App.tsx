import { useState } from "react";
import { UKERenderer } from "./components/UKERenderer";
import { explain } from "./explain";
import { useUKE } from "./hooks/useUKE";
import type { RecordType } from "./types";

function App() {
  const { loadUKE, UKE } = useUKE();
  const [record, setRecord] = useState<RecordType | null>(null);

  return (
    <div className="p-4">
      <div className="h-[100px]">
        <button
          type="button"
          onClick={loadUKE}
          className="border px-2 py-1 transition hover:bg-gray-300"
        >
          UKEファイルを読み込む
        </button>
        {record && (
          <div>
            <div className="flex gap-2 text-2xl">
              <div className="w-[100px] shrink-0 font-bold">
                {record.identification}({record.index})
              </div>
              <div className="w-full">Value: {record.data}</div>
            </div>
            <div className="w-[500px]">{explain(record) ?? "unknown"}</div>
          </div>
        )}
      </div>
      <div className="h-[calc(100svh_-_100px_-_32px)] w-full overflow-x-scroll rounded border border-gray-300 shadow-xl transition">
        {UKE && <UKERenderer UKE={UKE} setRecord={setRecord} />}
      </div>
    </div>
  );
}

export default App;
