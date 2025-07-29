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

export const MasterViewer = (props: Props) => {
  const UKE = useAtomValue(UKEAtom);
  const [message, setMessage] = useState<string | null>(null);
  const { store, header } = props.master;
  const [result, setResult] = useState<Record<string, string>[][]>([[]]);
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
  const masterValidation = useMemo(() => {
    if (status === "success" && UKE) {
      const date = getDate(UKE, props.record);
      if (date) {
        const masterChangeDate = result[0].find(
          (item) => item.key === "変更年月日",
        );
        const masterDeprecationDate = result[0].find(
          (item) => item.key === "廃止年月日",
        );
        if (masterChangeDate && masterDeprecationDate) {
          const masterChangeDateValue = Number(masterChangeDate.value);
          const masterDeprecationDateValue = Number(
            masterDeprecationDate.value,
          );
          if (
            date >= masterChangeDateValue &&
            date <= masterDeprecationDateValue
          ) {
            return {
              status: "valid",
              message: `診療開始日時点のマスターを表示しています`,
            };
          } else {
            return {
              status: "outdated",
              message: `診療開始日がアプリに組み込まれたマスターの有効期間外なので、注意してください。有効期間: ${masterChangeDate.value} ~ ${masterDeprecationDate.value} (診療開始日: ${date})`,
            };
          }
        }
      } else {
        return {
          status: "error",
          message:
            "診療開始日が取得できなかったため、最新のマスターデータを表示します",
        };
      }
    }
    return null;
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
      store.getItem(props.record.data).then((value) => {
        if (value === null) {
          setStatus("noData");
          return;
        }
        setResult(
          (value as Record<string, string>[]).map((v) =>
            Object.entries(v).map(([k, v]) => ({ key: k, value: v })),
          ),
        );
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
    return (
      <MessageWithEmoji
        message="マスターを読み込んでいます"
        emoji="💻️"
        className="text-center"
      />
    );
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
          {result.map((items, i) =>
            items.map((item, j) => (
              <li
                key={`${item.key}-${i}-${j}`}
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
                    {header.find((h) => h.name === item.key)?.value}
                  </div>
                </details>
              </li>
            )),
          )}
        </ul>
      </div>
    );
  }

  return null;
};
