import { useEffect, useState } from "react";
import type { KVType } from "./types";

export const findFromKV = (data: KVType, key: string) => {
  const result = data.find((v) => v.key === key);
  if (!result) {
    return null;
  }
  return result.value;
};

export const cn = (
  ...classNames: (string | null | undefined | boolean)[]
): string => {
  return classNames.filter(Boolean).join(" ");
};

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setMatches(window.matchMedia(query).matches);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [query]);

  return matches;
};
