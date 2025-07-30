import { DropOverlay } from "@components/DropOverlay";
import { Header } from "@components/Header";
import { SidePanel } from "@components/SidePanel";
import { UKERenderer } from "@components/UKERenderer";
import { useUKE } from "@hooks/useUKE";
import { useMediaQuery } from "@misc/tools";
import type { RecordType, SidePanelType } from "@misc/types";
import { useCallback, useEffect, useState } from "react";

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
  const [sidePanelType, setSidePanelType] = useState<SidePanelType>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLocking(null);
        setSidePanelType(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleOpenToolsPanel = useCallback(() => {
    if (sidePanelType === "tools") {
      // 現在Toolsパネルが開いている場合は閉じる
      setSidePanelType(null);
      setIsLocking(null);
    } else {
      // 閉じているかPropertyパネルが開いている場合はToolsパネルを開く
      setSidePanelType("tools");
      setIsLocking("tools");
    }
  }, [sidePanelType]);

  const handleClosePanel = useCallback(() => {
    setIsLocking(null);
    setSidePanelType(null);
  }, []);

  const handleRecordSelect = useCallback((record: RecordType | null) => {
    setRecord(record);
    setSidePanelType("property");
  }, []);

  return (
    <div
      className={`min-svh p-4 transition-colors ${
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
        <Header
          record={record}
          loadUKE={loadUKE}
          onOpenToolsPanel={handleOpenToolsPanel}
        />
      </div>
      <div className="flex h-[calc(100svh_-_150px_-_32px)] w-full gap-2">
        <div className="h-full w-full overflow-x-scroll rounded border transition-all">
          {UKE && (
            <UKERenderer
              UKE={UKE}
              setRecord={handleRecordSelect}
              isLocking={isLocking}
              setIsLocking={setIsLocking}
            />
          )}
        </div>
        {!isMobile && (
          <SidePanel
            record={record}
            onClose={handleClosePanel}
            visible={!!isLocking || sidePanelType === "tools"}
            panelType={sidePanelType}
          />
        )}
      </div>
    </div>
  );
}

export default App;
