import { useEffect, useMemo } from "react";

export const useResizable = (props: {
  default: number;
  ref: React.RefObject<HTMLElement | null>;
}) => {
  useEffect(() => {
    if (!props.ref.current) return;
    props.ref.current.style.width = `${props.default}px`;
  }, [props.ref, props.default]);

  const resizeHandleComponent = useMemo(() => {
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: <Tab操作可能なので問題なし>
      <div
        className="my-32 h-[calc(100%_-_256px)] w-2 cursor-col-resize rounded bg-gray-200 transition hover:bg-gray-300 active:bg-gray-400"
        onMouseDown={(e) => {
          const ref = props.ref?.current;
          if (!ref) return;
          e.preventDefault();
          const startX = e.clientX;
          const startPx = ref.getBoundingClientRect().width;
          const handleMouseMove = (e: MouseEvent) => {
            const movementX = startX - e.clientX;
            ref.style.width = `${startPx + movementX}px`;
          };
          const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
          };
          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        }}
      />
    );
  }, [props.ref]);

  return { resizeHandleComponent };
};
