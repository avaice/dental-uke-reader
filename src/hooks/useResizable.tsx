import { useEffect, useMemo } from "react";

export const useResizable = (props: {
  default?: number;
  ref: React.RefObject<HTMLElement | null>;
}) => {
  const defaultWidth = useMemo(() => {
    const width = localStorage.getItem("resizableWidth");
    if (!width) return props.default;
    return parseInt(width);
  }, [props.default]);

  useEffect(() => {
    if (!props.ref.current) return;
    props.ref.current.style.width = `${defaultWidth}px`;
  }, [props.ref, defaultWidth]);

  const resizeHandleComponent = useMemo(() => {
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: <Tab操作可能なので問題なし>
      <div
        className="my-32 h-[calc(100%_-_256px)] w-2 shrink-0 cursor-col-resize rounded bg-gray-200 transition hover:bg-gray-300 active:bg-gray-400"
        onMouseDown={(e) => {
          const ref = props.ref?.current;
          if (!ref) return;
          e.preventDefault();
          ref.style.transition = "none";
          const startX = e.clientX;
          const startPx = ref.getBoundingClientRect().width;
          const handleMouseMove = (e: MouseEvent) => {
            const movementX = startX - e.clientX;
            ref.style.width = `${startPx + movementX}px`;
          };
          const handleMouseUp = () => {
            ref.style.transition = "all 0.3s ease-in-out";
            localStorage.setItem("resizableWidth", ref.style.width);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
          };
          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        }}
        onTouchStart={(e) => {
          const ref = props.ref?.current;
          if (!ref) return;
          e.preventDefault();
          ref.style.transition = "none";
          const startX = e.touches[0].clientX;
          const startPx = ref.getBoundingClientRect().width;
          const handleTouchMove = (e: TouchEvent) => {
            const movementX = startX - e.touches[0].clientX;
            ref.style.width = `${startPx + movementX}px`;
          };
          const handleTouchEnd = () => {
            ref.style.transition = "all 0.3s ease-in-out";
            localStorage.setItem("resizableWidth", ref.style.width);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
          };
          document.addEventListener("touchmove", handleTouchMove);
          document.addEventListener("touchend", handleTouchEnd);
        }}
      />
    );
  }, [props.ref]);

  return { resizeHandleComponent };
};
