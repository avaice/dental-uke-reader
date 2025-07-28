import { useCallback, useState } from "react";

export const useUKE = () => {
  const [UKE, setUKE] = useState<string[][] | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const processUKEFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const arr = text
        .trim()
        .split("\n")
        .map((line) => line.split(","));
      setUKE(arr);
    };
    reader.readAsText(file, "shift-jis");
  }, []);

  const loadUKE = useCallback(async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".UKE";
    fileInput.onchange = async (e) => {
      const file = (e.currentTarget as HTMLInputElement).files?.[0];
      if (file) {
        processUKEFile(file);
      }
    };
    fileInput.click();
  }, [processUKEFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const ukeFile = files.find((file) =>
        file.name.toLowerCase().endsWith(".uke"),
      );

      if (ukeFile) {
        processUKEFile(ukeFile);
      }
    },
    [processUKEFile],
  );

  return {
    loadUKE,
    UKE,
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};
