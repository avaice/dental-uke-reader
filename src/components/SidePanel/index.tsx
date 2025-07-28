import { useRef } from "react";
import { useResizable } from "../../hooks/useResizable";

export const SidePanel = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { resizeHandleComponent } = useResizable({
    default: 400,
    ref,
  });
  return (
    <>
      {resizeHandleComponent}
      <div className="shrink-0 rounded border " ref={ref}></div>
    </>
  );
};
