import { loadMaster } from "@master/loadMaster";
import { masterManageStore } from "@master/masterManageInstance";
import { UKEAtom } from "@misc/atoms";
import { cn } from "@misc/tools";
import type { RecordType } from "@misc/types";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./_parts/Button";
import { LoadingOverlay } from "./LoadingOverlay";
import { MessageWithEmoji } from "./MessageWithEmoji";

type Props = {
  master: {
    name: string;
    header: readonly { name: string; value: string }[];
    store: LocalForage;
  };
  record: RecordType;
};

type MasterRecord = Record<string, string>;
type DisplayItem = { key: string; value: string };
type MasterValidation = {
  status: "valid" | "outdated" | "error";
  message: string;
};

const getDate = (UKE: string[][], record: RecordType) => {
  // 入院レセプト
  if (record.identification === "HS" && record.row[1] !== "") {
    return Number(record.row[1]);
  }

  const p = UKE.findIndex((r) => r === record.row);
  if (p === -1) {
    return null;
  }
  for (let i = p; i >= 0; i--) {
    if (UKE[i][0] === "RE") {
      return Number(UKE[i][9]);
    }
  }
  return null;
};

const isMasterRecords = (value: unknown): value is MasterRecord[] => {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every((record) => {
    if (
      record === null ||
      typeof record !== "object" ||
      Array.isArray(record)
    ) {
      return false;
    }
    return Object.values(record).every((field) => typeof field === "string");
  });
};

const parseDateValue = (date: string | undefined) => {
  if (!date) {
    return null;
  }
  const parsed = Number(date);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

const getLatestMasterRecord = (records: MasterRecord[]) => {
  if (records.length === 0) {
    return null;
  }
  return [...records].sort((a, b) => {
    const aDate = parseDateValue(a["変更年月日"]) ?? Number.NEGATIVE_INFINITY;
    const bDate = parseDateValue(b["変更年月日"]) ?? Number.NEGATIVE_INFINITY;
    return bDate - aDate;
  })[0];
};

const toDisplayItems = (record: MasterRecord | null): DisplayItem[] => {
  if (!record) {
    return [];
  }
  return Object.entries(record).map(([key, value]) => ({ key, value }));
};

export const MasterViewer = (props: Props) => {
  const UKE = useAtomValue(UKEAtom);
  const [message, setMessage] = useState<string | null>(null);
  const { store, header } = props.master;
  const [result, setResult] = useState<MasterRecord[]>([]);
  const [status, setStatus] = useState<
    | "checkingMaster"
    | "masterFound"
    | "loadingMaster"
    | "masterNotFound"
    | "noData"
    | "success"
    | "error"
  >("checkingMaster");

  // 診療日時点でマスターが有効か
  const { displayItems, masterValidation } = useMemo<{
    displayItems: DisplayItem[];
    masterValidation: MasterValidation | null;
  }>(() => {
    const latestMasterRecord = getLatestMasterRecord(result);

    if (status !== "success") {
      return { displayItems: [], masterValidation: null };
    }

    if (!UKE) {
      return {
        displayItems: toDisplayItems(latestMasterRecord),
        masterValidation: null,
      };
    }

    const date = getDate(UKE, props.record);
    if (!date) {
      return {
        displayItems: toDisplayItems(latestMasterRecord),
        masterValidation: {
          status: "error",
          message:
            "診療開始日が取得できなかったため、最新のマスターデータを表示します",
        },
      };
    }

    const validMasterRecords = result.filter((masterRecord) => {
      const changeDate = parseDateValue(masterRecord["変更年月日"]);
      const deprecationDate = parseDateValue(masterRecord["廃止年月日"]);
      if (changeDate === null || deprecationDate === null) {
        return false;
      }
      return date >= changeDate && date <= deprecationDate;
    });

    const inTermMasterRecord = getLatestMasterRecord(validMasterRecords);
    if (inTermMasterRecord) {
      return {
        displayItems: toDisplayItems(inTermMasterRecord),
        masterValidation: {
          status: "valid",
          message: "診療開始日時点のマスターを表示しています",
        },
      };
    }

    return {
      displayItems: toDisplayItems(latestMasterRecord),
      masterValidation: {
        status: "outdated",
        message:
          "診療開始日に一致するマスターが見つからないため、最新のマスターを表示しています。",
      },
    };
  }, [props.record.identification, props.record, result, status, UKE]);

  useEffect(() => {
    if (status === "checkingMaster") {
      masterManageStore.getItem(`${props.master.name}Version`).then((value) => {
        if (value === null) {
          setStatus("masterNotFound");
        } else {
          setStatus("masterFound");
        }
      });
    }
  }, [props.master.name, status]);

  useEffect(() => {
    if (status === "masterFound") {
      setStatus("loadingMaster");
      store.getItem<unknown>(props.record.data).then((value) => {
        if (value === null) {
          setStatus("noData");
          return;
        }
        if (!isMasterRecords(value)) {
          setStatus("error");
          return;
        }
        setResult(value);
        setStatus("success");
      });
    }
  }, [store, props.record.data, status]);

  if (status === "masterNotFound") {
    return (
      <div className="flex flex-col gap-4">
        <MessageWithEmoji
          message="マスターを読み込んでください"
          emoji="🫥"
          className="text-center"
        />
        <Button
          onClick={async () => {
            await loadMaster(setMessage);
            setMessage(null);
            setStatus("checkingMaster");
          }}
        >
          マスターを読み込む
        </Button>
        {message && <LoadingOverlay message={message} />}
      </div>
    );
  }

  if (status === "loadingMaster") {
    return null;
  }

  if (status === "noData") {
    return (
      <MessageWithEmoji
        message="マスターにデータがありません"
        emoji="🍂"
        className="text-center"
      />
    );
  }

  if (status === "error") {
    return (
      <MessageWithEmoji
        message="マスターデータの形式が不正なため表示できません"
        emoji="😵"
        className="text-center"
      />
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-lg">{props.record.data}</h3>
        {masterValidation && (
          <div
            className={cn(
              "rounded p-2 text-xs",
              masterValidation.status === "valid" && "bg-green-100",
              masterValidation.status === "outdated" && "bg-yellow-100",
              masterValidation.status === "error" && "bg-red-100",
            )}
          >
            {masterValidation.message}
          </div>
        )}
        <ul className="flex w-full flex-col gap-1">
          {displayItems.map((item, index) => (
            <li
              key={`${item.key}-${index}`}
              className="flex w-full flex-col gap-2 bg-gray-100 p-2"
            >
              <details className="group ml-2">
                <summary className="flex cursor-pointer items-center">
                  <span className="mr-2 rotate-0 select-none group-open:rotate-90">
                    ▶
                  </span>
                  <span className="w-[200px] shrink-0">{item.key}</span>
                  <span className="w-full">{item.value}</span>
                </summary>
                <div className="mt-1.5 rounded bg-yellow-100 p-2 text-xs">
                  <p className="whitespace-pre-wrap">
                    {header.find((h) => h.name === item.key)?.value}
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};
