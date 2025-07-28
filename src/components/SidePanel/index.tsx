import { useRef } from "react";
import { useResizable } from "../../hooks/useResizable";
import type { RecordType } from "../../types";
import { Property } from "../Property";

type Props = {
  record: RecordType | null;
  onClose: () => void;
};

export const SidePanel = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { resizeHandleComponent } = useResizable({
    default: 400,
    ref,
  });
  return (
    <>
      {resizeHandleComponent}
      <div className="shrink-0 rounded border" ref={ref}>
        <div className="flex h-[48px] justify-between border-b p-2">
          <h2 className="text-lg">Property</h2>
          <button
            type="button"
            onClick={props.onClose}
            className="w-[30px] rounded border px-2 py-0.5 transition hover:bg-gray-100 active:bg-gray-200"
          >
            ✕
          </button>
        </div>
        <div className="h-[calc(100%-50px)] p-4">
          {props.record && <Property record={props.record} />}
        </div>
      </div>
    </>
  );
};
