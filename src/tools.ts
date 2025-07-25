import type { KVType } from "./types";

export const findFromKV = (data: KVType, key: string) => {
  const result = data.find((v) => v.key === key);
  if (!result) {
    return null;
  }
  return result.value;
};
