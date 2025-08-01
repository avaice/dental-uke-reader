import { cn } from "@misc/tools";
import type { RecordType, SidePanelType } from "@misc/types";
import { useEffect, useMemo, useRef } from "react";
import { useResizable } from "../../hooks/useResizable";
import { Button } from "../_parts/Button";
import { Property } from "../Property";
import { Tools } from "../Tools";

type Props = {
  record: RecordType | null;
  onClose: () => void;
  visible: boolean;
  panelType: SidePanelType;
};

export const SidePanel = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { resizeHandleComponent } = useResizable({
    ref,
  });

  useEffect(() => {
    if (ref.current) {
      if (props.visible) {
        ref.current.style.width =
          localStorage.getItem("resizableWidth") ?? "400px";
      } else {
        ref.current.style.width = "0px";
      }
    }
  }, [props.visible]);

  const panelTitle = useMemo(() => {
    switch (props.panelType) {
      case "property":
        return "Property";
      case "tools":
        return "Search";
      default:
        return "";
    }
  }, [props.panelType]);

  const panelContent = useMemo(() => {
    switch (props.panelType) {
      case "property":
        return props.record && <Property record={props.record} />;
      case "tools":
        return <Tools />;
      default:
        return null;
    }
  }, [props.panelType, props.record]);

  return (
    <>
      {props.visible && resizeHandleComponent}
      <div
        className={cn(
          "w-0 shrink-0 overflow-hidden rounded border transition-all duration-200",
          props.visible ? "fade-in" : "fade-out border-0",
        )}
        ref={ref}
      >
        <div className="flex h-[48px] justify-between border-b p-2">
          <h2 className="text-lg">{panelTitle}</h2>
          <Button className="w-[30px]" onClick={props.onClose}>
            ✕
          </Button>
        </div>
        <div className="h-[calc(100%-50px)] min-w-[400px] text-sm">
          {panelContent}
        </div>
      </div>
    </>
  );
};
