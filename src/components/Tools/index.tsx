import { Button } from "@components/_parts/Button";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { getMasterStatus, reloadMaster } from "@master/loadMaster";
import type { SearchResult } from "@master/searchMaster";
import { masterStores, searchMaster } from "@master/searchMaster";
import { cn } from "@misc/tools";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchResultRecord } from "./SearchResultRecord";

export const Tools = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [masterStatus, setMasterStatus] = useState<
    Record<string, string | null>
  >({});

  useEffect(() => {
    getMasterStatus().then((status) => {
      setMasterStatus(status);
    });
  }, []);

  const performSearch = useCallback(async (searchKeyword: string) => {
    if (!searchKeyword.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMaster(searchKeyword);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    const input = inputRef.current;
    if (input) {
      setKeyword(input.value);
      performSearch(input.value);
    }
  }, [performSearch]);

  const renderFieldValue = useCallback(
    (value: string) => {
      if (!keyword || keyword.trim() === "") return value;

      // スペース区切りでキーワードを分割
      const keywords = keyword
        .trim()
        .split(/\s+/)
        .filter((k) => k.length > 0);

      if (keywords.length === 0) return value;

      // 複数キーワードのハイライト処理
      const matches: { start: number; end: number; keyword: string }[] = [];

      // 各キーワードのマッチ位置を収集
      for (const kw of keywords) {
        const lowerValue = value.toLowerCase();
        const lowerKeyword = kw.toLowerCase();
        let searchIndex = 0;

        while (searchIndex < lowerValue.length) {
          const index = lowerValue.indexOf(lowerKeyword, searchIndex);
          if (index === -1) break;

          matches.push({
            start: index,
            end: index + kw.length,
            keyword: kw,
          });

          searchIndex = index + 1;
        }
      }

      if (matches.length === 0) return value;

      // 重複しないようにマッチをソート・マージ
      matches.sort((a, b) => a.start - b.start);

      const parts = [];
      let lastIndex = 0;

      for (const match of matches) {
        // 重複チェック
        if (match.start < lastIndex) continue;

        // マッチ前の部分
        if (match.start > lastIndex) {
          parts.push(
            <span key={`${lastIndex}-text`}>
              {value.substring(lastIndex, match.start)}
            </span>,
          );
        }

        // マッチ部分をハイライト
        parts.push(
          <mark key={`${match.start}-mark`} className="bg-yellow-300">
            {value.substring(match.start, match.end)}
          </mark>,
        );

        lastIndex = match.end;
      }

      // 最後の部分
      if (lastIndex < value.length) {
        parts.push(
          <span key={`${lastIndex}-text-end`}>
            {value.substring(lastIndex)}
          </span>,
        );
      }

      return <>{parts}</>;
    },
    [keyword],
  );

  const totalResults = useMemo(() => {
    return searchResults.reduce((sum, result) => sum + result.data.length, 0);
  }, [searchResults]);

  return (
    <>
      <div className="relative h-full overflow-y-scroll px-4 pb-4">
        <div className="space-y-4">
          <div className="sticky top-0 z-10 bg-white py-4">
            {/* <h3 className="mb-2 font-bold text-lg">マスター検索</h3> */}
            <div className="flex gap-2">
              <input
                type="text"
                className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="検索キーワードを入力（スペース区切りでAND検索）..."
                ref={inputRef}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    handleSearch();
                  }
                }}
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className={cn(
                  "w-[80px] shrink-0",
                  isSearching && "cursor-not-allowed opacity-50",
                )}
              >
                {isSearching ? "検索中..." : "検索"}
              </Button>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 text-gray-600 text-sm">
                {totalResults > 300
                  ? "100件以上の結果が見つかりました。検索キーワードを絞り込んでください。"
                  : `${totalResults}件の結果が見つかりました`}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {searchResults.length === 0 && keyword && !isSearching && (
              <div className="py-8 text-center text-gray-500">
                「{keyword}」に一致する結果が見つかりませんでした
              </div>
            )}

            {totalResults > 300
              ? []
              : searchResults.map((result) =>
                  result.data.map((record, recordIndex) => (
                    <SearchResultRecord
                      key={`${result.masterName}-record-${recordIndex}`}
                      result={result}
                      record={record}
                      renderFieldValue={renderFieldValue}
                    />
                  )),
                )}
          </div>

          <div className="mt-8 pt-4">
            <h3 className="mb-2 font-bold text-lg">マスター読み込み状況</h3>
            <ul className="mb-4">
              {masterStores.map((store) => {
                const key = `${store.name}MasterVersion`;
                const value = masterStatus[key];
                return (
                  <li key={key} className="flex">
                    <span className="w-[200px] shrink-0">
                      {store.displayName}:
                    </span>
                    {value ? (
                      value
                    ) : (
                      <span className="text-gray-500">Not Loaded</span>
                    )}
                  </li>
                );
              })}
            </ul>
            <Button
              className="w-full"
              onClick={async () => {
                await reloadMaster(setMessage);
                const status = await getMasterStatus();
                setMasterStatus(status);
                setMessage(null);
              }}
            >
              マスターの再読み込み
            </Button>
          </div>
        </div>
      </div>
      {message && <LoadingOverlay message={message} />}
    </>
  );
};
