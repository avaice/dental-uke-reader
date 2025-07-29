import { DropOverlay } from "@components/DropOverlay";
import { Header } from "@components/Header";
import { SidePanel } from "@components/SidePanel";
import { UKERenderer } from "@components/UKERenderer";
import { useUKE } from "@hooks/useUKE";
import type { RecordType } from "@misc/types";
import { useState } from "react";

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
      {isDragOver && <DropOverlay />}
      <div className="h-[150px]">
        <Header record={record} loadUKE={loadUKE} />
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
