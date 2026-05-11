import { chozaiMasterHeaders } from "@master/2026/chozai";
import { commentMasterHeaders } from "@master/2026/comment";
import { ikaMasterHeaders } from "@master/2026/ika";
import { iyakuhinMasterHeaders } from "@master/2026/iyakuhin";
import { shikaMasterHeaders } from "@master/2026/shika";
import { shikaKihonChuMasterHeaders } from "@master/2026/shikaKihonChu";
import { shikaKihonKihonMasterHeaders } from "@master/2026/shikaKihonKihon";
import { shikaKihonTsureiMasterHeaders } from "@master/2026/shikaKihonTsurei";
import { shikaKihonZairyoMasterHeaders } from "@master/2026/shikaKihonZairyo";
import { shobyomeiMasterHeaders } from "@master/2026/shobyomei";
import { shushokugoMasterHeaders } from "@master/2026/shushokugo";
import { tokuteikizaiMasterHeaders } from "@master/2026/tokuteikizai";
import type React from "react";

interface SearchResultRecordProps {
  result: {
    masterName: string;
    displayName: string;
    matchType: "exact" | "partial";
  };
  record: Record<string, string>;
  renderFieldValue: (value: string) => React.ReactNode;
}

export const SearchResultRecord: React.FC<SearchResultRecordProps> = ({
  result,
  record,
  renderFieldValue,
}) => {
  const headersMap: Record<
    string,
    ReadonlyArray<{ name: string; value: string }>
  > = {
    shobyomei: shobyomeiMasterHeaders,
    iyakuhin: iyakuhinMasterHeaders,
    shika: shikaMasterHeaders,
    tokuteikizai: tokuteikizaiMasterHeaders,
    comment: commentMasterHeaders,
    ika: ikaMasterHeaders,
    shushokugo: shushokugoMasterHeaders,
    chozai: chozaiMasterHeaders,
    shikaKihonKihon: shikaKihonKihonMasterHeaders,
    shikaKihonChu: shikaKihonChuMasterHeaders,
    shikaKihonTsurei: shikaKihonTsureiMasterHeaders,
    shikaKihonZairyo: shikaKihonZairyoMasterHeaders,
  };

  const headerList = headersMap[result.masterName];

  return (
    <div className="relative isolate h-[300px] overflow-x-auto overflow-y-scroll rounded border bg-gray-50 transition-colors hover:bg-gray-100">
      <h3 className="sticky top-0 z-10 bg-gray-50 p-2 shadow">
        {result.displayName}マスター:{" "}
        {result.matchType === "exact" ? "完全一致" : "部分一致"}
      </h3>
      <table className="w-full">
        <tbody>
          {Object.entries(record).map(([key, value]) => (
            <tr key={key} className="border-b last:border-b-0">
              <th
                className="w-[30%] max-w-[300px] bg-gray-100 px-2 py-1 text-left font-medium text-gray-700"
                title={
                  headerList?.find((h) => h.name === key)?.value || undefined
                }
              >
                {key}
              </th>
              <td className="break-all px-2 py-1 text-gray-900">
                <details className="group">
                  <summary className="flex cursor-pointer items-center">
                    <span className="mr-2 rotate-0 select-none group-open:rotate-90">
                      ▶
                    </span>
                    <span className="w-full">{renderFieldValue(value)}</span>
                  </summary>
                  {headerList && (
                    <div className="mt-1.5 rounded bg-yellow-100 p-2 text-xs">
                      <p className="whitespace-pre-wrap">
                        {headerList.find((h) => h.name === key)?.value}
                      </p>
                    </div>
                  )}
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
