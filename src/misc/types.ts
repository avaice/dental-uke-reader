export type RecordType = {
  identification: string;
  data: string;
  index: number;
  row: string[];
};

export type KVType = { key: string; value: string }[];

export type SidePanelType = "property" | "tools" | null;
