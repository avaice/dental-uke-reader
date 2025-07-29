import { cn } from "@misc/tools";
import { useEffect, useRef } from "react";
import { useResizable } from "../../hooks/useResizable";
import type { RecordType } from "../../misc/types";
import { Button } from "../_parts/Button";
import { Property } from "../Property";

type Props = {
  record: RecordType | null;
  onClose: () => void;
  visible: boolean;
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
          localStorage.getItem("resizableWidth") ?? "300px";
      } else {
        ref.current.style.width = "0px";
      }
    }
  }, [props.visible]);

  return (
    <>
      {props.visible && resizeHandleComponent}
      <div
        className={cn(
          "shrink-0 overflow-hidden rounded border transition-all",
          props.visible ? "fade-in" : "fade-out border-0",
        )}
        ref={ref}
      >
        <div className="flex h-[48px] justify-between border-b p-2">
          <h2 className="text-lg">Property</h2>
          <Button className="w-[30px]" onClick={props.onClose}>
            ✕
          </Button>
        </div>
        <div className="h-[calc(100%-50px)] text-sm">
          {props.record && <Property record={props.record} />}
        </div>
      </div>
    </>
  );
};
