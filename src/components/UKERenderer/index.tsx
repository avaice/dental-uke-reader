/** biome-ignore-all lint/suspicious/noArrayIndexKey: <内容が不変なので、よい> */
import React from "react";
import type { RecordType } from "../../types";

export const UKERenderer = React.memo(
  ({
    UKE,
    setRecord,
  }: {
    UKE: string[][];
    setRecord: (record: RecordType) => void;
  }) => {
    return (
      <div className="flex w-max flex-col">
        {UKE.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex w-full not-last:border-b"
          >
            {row.map((cell, cellIndex) => {
              const focus = () => {
                setRecord({
                  identification: row[0],
                  data: cell,
                  index: cellIndex,
                  row,
                });
              };
              return (
                <button
                  type="button"
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className="h-[25px] w-[100px] shrink-0 overflow-x-scroll border-r px-1 py-0.5 text-sm transition last:border-r-4 last:border-r-red-500 odd:bg-gray-50 hover:bg-gray-200"
                  onMouseEnter={focus}
                  onFocus={focus}
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
