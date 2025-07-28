/** biome-ignore-all lint/suspicious/noArrayIndexKey: <内容が不変なので、よい> */
import React from "react";
import type { RecordType } from "../../types";

export const UKERenderer = React.memo(
  ({
    UKE,
    setRecord,

    isLocking,
    setIsLocking,
  }: {
    UKE: string[][];
    setRecord: (record: RecordType) => void;
    isLocking: string | null;
    setIsLocking: (locking: string | null) => void;
  }) => {
    return (
      <div className="flex w-max flex-col">
        {UKE.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex w-full not-last:border-b"
          >
            {row.map((cell, cellIndex) => {
              const set = () => {
                setRecord({
                  identification: row[0],
                  data: cell,
                  index: cellIndex,
                  row,
                });
              };
              const onFocus = () => {
                if (isLocking) {
                  return;
                }
                set();
              };
              const onClick = () => {
                if (isLocking === `cell-${rowIndex}-${cellIndex}`) {
                  setIsLocking(null);
                } else {
                  setIsLocking(`cell-${rowIndex}-${cellIndex}`);
                  set();
                }
              };
              return (
                <button
                  type="button"
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className={`h-[25px] w-[100px] min-w-[100px] shrink-0 overflow-x-hidden border-r px-1 py-0.5 text-sm transition-all last:border-r-4 last:border-r-red-500 ${
                    isLocking === `cell-${rowIndex}-${cellIndex}`
                      ? "w-max bg-yellow-200"
                      : "odd:bg-gray-50 hover:bg-gray-200 active:bg-gray-300"
                  }`}
                  style={
                    {
                      interpolateSize: "allow-keywords",
                      // biome-ignore lint/suspicious/noExplicitAny: <interpolateSizeが未実装>
                    } as any
                  }
                  onFocus={onFocus}
                  onMouseEnter={onFocus}
                  onClick={onClick}
                >
                  <span className="whitespace-nowrap">{cell}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  },
);
