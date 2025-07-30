import { Button } from "@components/_parts/Button";
import { LoadingOverlay } from "@components/LoadingOverlay";
import { reloadMaster } from "@master/loadMaster";
import { searchMaster } from "@master/searchMaster";
import { useCallback, useMemo, useState } from "react";

export const Tools = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [result, setResult] = useState<{
    shobyomeiMasterResult: Record<string, string>[];
    iyakuhinMasterResult: Record<string, string>[];
    shikaMasterResult: Record<string, string>[];
    tokuteikizaiMasterResult: Record<string, string>[];
    commentMasterResult: Record<string, string>[];
    ikaMasterResult: Record<string, string>[];
    shushokugoMasterResult: Record<string, string>[];
    chozaiMasterResult: Record<string, string>[];
    shikaKihonKihonMasterResult: Record<string, string>[];
    shikaKihonChuMasterResult: Record<string, string>[];
    shikaKihonTsureiMasterResult: Record<string, string>[];
    shikaKihonZairyoMasterResult: Record<string, string>[];
  } | null>(null);

  const handleSearch = useCallback(async () => {
    const result = await searchMaster(keyword);
    // biome-ignore lint/suspicious/noExplicitAny: <一時的な措置>
    setResult(result as any);
  }, [keyword]);

  const formattedResult = useMemo(() => {
    if (!result) return [];
    return Object.entries(result).map(([key, value]) => {
      return {
        key,
        value,
      };
    });
  }, [result]);

  console.log(formattedResult);

  return (
    <>
      <div className="relative h-full overflow-y-scroll px-4 pb-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="sticky top-0 z-10 bg-white py-4">
              <h3 className="font-bold text-lg">Search Master</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-full rounded border p-2"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      handleSearch();
                    }
                  }}
                />
                <Button onClick={handleSearch}>Search</Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {formattedResult.map((item) => (
                <div key={item.key}>
                  <h4 className="font-bold text-lg">
                    {item.key.replace("Result", "")}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {item.value ? (
                      item.value.map((value) => (
                        <div
                          key={JSON.stringify(value)}
                          className="flex flex-col gap-1"
                        >
                          {Object.entries(value).map(([key, value]) => (
                            <div key={key}>
                              {key}: {value}
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div>No result</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
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
