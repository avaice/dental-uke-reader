import { Button } from "@components/_parts/Button";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { reloadMaster } from "@master/loadMaster";
import type { SearchResult } from "@master/searchMaster";
import { debounce, searchMaster } from "@master/searchMaster";
import { cn } from "@misc/tools";
import { useCallback, useMemo, useState } from "react";

export const Tools = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const debouncedSearch = useMemo(
    () => debounce(performSearch, 300),
    [performSearch],
  );

  const handleSearch = useCallback(() => {
    performSearch(keyword);
  }, [keyword, performSearch]);

  const renderFieldValue = useCallback(
    (value: string) => {
      if (!keyword) return value;

      // ハイライト処理をReactで安全に実装
      const parts = [];
      const lowerValue = value.toLowerCase();
      const lowerKeyword = keyword.toLowerCase();
      let lastIndex = 0;
      let index = lowerValue.indexOf(lowerKeyword);

      while (index !== -1) {
        // マッチ前の部分
        if (index > lastIndex) {
          parts.push(
            <span key={`${lastIndex}-text`}>
              {value.substring(lastIndex, index)}
            </span>,
          );
        }

        // マッチ部分をハイライト
        parts.push(
          <mark key={`${index}-mark`} className="bg-yellow-300">
            {value.substring(index, index + keyword.length)}
          </mark>,
        );

        lastIndex = index + keyword.length;
        index = lowerValue.indexOf(lowerKeyword, lastIndex);
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
            <h3 className="mb-2 font-bold text-lg">マスター検索</h3>
            <div className="flex gap-2">
              <input
                type="text"
                className="w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="検索キーワードを入力..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                }}
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
                  "shrink-0",
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
              : searchResults.map((result, index) => (
                  <div
                    key={`${result.masterName}-${index}`}
                    className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-bold text-blue-600 text-lg">
                        {result.displayName}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-2 py-1 text-xs ${
                            result.matchType === "exact"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {result.matchType === "exact"
                            ? "完全一致"
                            : "部分一致"}
                        </span>
                        <span className="text-gray-500 text-xs">
                          スコア: {result.score}
                        </span>
                      </div>
                    </div>

                    <div className="max-h-96 space-y-2 overflow-y-auto">
                      {result.data.map((record, recordIndex) => (
                        <div
                          key={`${result.masterName}-record-${recordIndex}`}
                          className="rounded bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                        >
                          <dl className="grid grid-cols-1 gap-1">
                            {Object.entries(record).map(([key, value]) => (
                              <div key={key} className="flex">
                                <dt className="min-w-[120px] font-medium text-gray-700">
                                  {key}:
                                </dt>
                                <dd className="ml-2 break-all text-gray-900">
                                  {renderFieldValue(value)}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
          </div>

          <div className="mt-8 pt-4">
            <Button
              className="w-full"
              onClick={async () => {
                await reloadMaster(setMessage);
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
