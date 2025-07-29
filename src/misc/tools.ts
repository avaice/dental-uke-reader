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
