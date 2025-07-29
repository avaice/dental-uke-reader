import { useCallback, useEffect, useMemo } from "react";

interface ResizeHandlers {
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
}

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

  const createResizeHandlers = useCallback((): ResizeHandlers => {
    const startResize = (clientX: number) => {
      const ref = props.ref?.current;
      if (!ref) return { ref: null, startX: 0, startPx: 0 };

      ref.style.transition = "none";
      const startPx = ref.getBoundingClientRect().width;
      return { ref, startX: clientX, startPx };
    };

    const handleResize = (
      clientX: number,
      startX: number,
      startPx: number,
      ref: HTMLElement,
    ) => {
      const movementX = startX - clientX;
      ref.style.width = `${startPx + movementX}px`;
    };

    const finishResize = (ref: HTMLElement) => {
      ref.style.transition = "all 0.2s ease-in-out";
      localStorage.setItem("resizableWidth", ref.style.width);
    };

    const onMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      const { ref, startX, startPx } = startResize(e.clientX);
      if (!ref) return;

      const handleMouseMove = (e: MouseEvent) => {
        handleResize(e.clientX, startX, startPx, ref);
      };

      const handleMouseUp = () => {
        finishResize(ref);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const onTouchStart = (e: React.TouchEvent) => {
      e.preventDefault();
      const { ref, startX, startPx } = startResize(e.touches[0].clientX);
      if (!ref) return;

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        handleResize(e.touches[0].clientX, startX, startPx, ref);
      };

      const handleTouchEnd = () => {
        finishResize(ref);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    };

    return { onMouseDown, onTouchStart };
  }, [props.ref]);

  const resizeHandleComponent = useMemo(() => {
    const handlers = createResizeHandlers();

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: <Tab操作可能なので問題なし>
      <div
        className="my-32 h-[calc(100%_-_256px)] w-2 shrink-0 cursor-col-resize rounded bg-gray-200 transition hover:bg-gray-300 active:bg-gray-400"
        onMouseDown={handlers.onMouseDown}
        onTouchStart={handlers.onTouchStart}
      />
    );
  }, [createResizeHandlers]);

  return { resizeHandleComponent };
};
