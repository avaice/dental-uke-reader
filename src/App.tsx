import { useState } from "react";
import { Button } from "./components/_parts/Button";
import { SidePanel } from "./components/SidePanel";
import { UKERenderer } from "./components/UKERenderer";
import { recordType } from "./constants";
import { explain } from "./explain";
import { useUKE } from "./hooks/useUKE";
import { findFromKV } from "./tools";
import type { RecordType } from "./types";

function App() {
  const {
    loadUKE,
    UKE,
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useUKE();
  const [record, setRecord] = useState<RecordType | null>(null);
  const [isLocking, setIsLocking] = useState<string | null>(null);

  return (
    <div
      className={`min-h-screen p-4 transition-colors ${
        isDragOver ? "border-2 border-blue-400 border-dashed bg-blue-50" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="application"
      aria-label="UKE file drop zone"
    >
      {isDragOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-80">
          <div className="rounded-lg border border-gray-400 border-dashed bg-white p-8">
            <div className="text-center">
              <div className="mb-4 text-4xl">📁</div>
              <div className="mb-2 font-bold text-xl">
                UKEファイルをドロップしてください
              </div>
              <div className="text-gray-600">
                .UKE形式のファイルのみ対応しています
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="h-[150px]">
        <div className="flex justify-between gap-2">
          <h2 className="font-bold text-2xl">UKE Reader</h2>
          <div className="flex gap-2">
            <Button onClick={loadUKE}>UKEを読み込む</Button>
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
          {UKE && (
            <UKERenderer
              UKE={UKE}
              setRecord={setRecord}
              isLocking={isLocking}
              setIsLocking={setIsLocking}
            />
          )}
        </div>
        {isLocking && (
          <SidePanel record={record} onClose={() => setIsLocking(null)} />
        )}
      </div>
    </div>
  );
}

export default App;
