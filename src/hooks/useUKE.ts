import { useCallback, useState } from "react";

export const useUKE = () => {
  const [UKE, setUKE] = useState<string[][] | null>(null);

  const loadUKE = useCallback(async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".UKE";
    fileInput.onchange = async (e) => {
      const file = (e.currentTarget as HTMLInputElement).files?.[0];
      if (file) {
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
      }
    };
    fileInput.click();
  }, []);

  return {
    loadUKE,
    UKE,
  };
};
