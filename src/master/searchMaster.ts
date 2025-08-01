import { chozaiMasterStore } from "./chozai/instance";
import { commentMasterStore } from "./comment/instance";
import { ikaMasterStore } from "./ika/instance";
import { iyakuhinMasterStore } from "./iyakuhin/instance";
import { shikaMasterStore } from "./shika/instance";
import { shikaKihonChuMasterStore } from "./shikaKihonChu/instance";
import { shikaKihonKihonMasterStore } from "./shikaKihonKihon/instance";
import { shikaKihonTsureiMasterStore } from "./shikaKihonTsurei/instance";
import { shikaKihonZairyoMasterStore } from "./shikaKihonZairyo/instance";
import { shobyomeiMasterStore } from "./shobyomei/instance";
import { shushokugoMasterStore } from "./shushokugo/instance";
import { tokuteikizaiMasterStore } from "./tokuteikizai/instance";

type MasterData = Record<string, string>[];

interface MasterStore {
  name: string;
  store: LocalForage;
  displayName: string;
}

export interface SearchResult {
  masterName: string;
  displayName: string;
  data: MasterData;
  score: number;
  matchType: "exact" | "partial";
}

export const masterStores: MasterStore[] = [
  { name: "shobyomei", store: shobyomeiMasterStore, displayName: "傷病名" },
  { name: "iyakuhin", store: iyakuhinMasterStore, displayName: "医薬品" },
  { name: "shika", store: shikaMasterStore, displayName: "歯科" },
  {
    name: "tokuteikizai",
    store: tokuteikizaiMasterStore,
    displayName: "特定器材",
  },
  { name: "comment", store: commentMasterStore, displayName: "コメント" },
  { name: "ika", store: ikaMasterStore, displayName: "医科" },
  { name: "shushokugo", store: shushokugoMasterStore, displayName: "修飾語" },
  { name: "chozai", store: chozaiMasterStore, displayName: "調剤" },
  {
    name: "shikaKihonKihon",
    store: shikaKihonKihonMasterStore,
    displayName: "歯科基本（基本・材料）",
  },
  {
    name: "shikaKihonChu",
    store: shikaKihonChuMasterStore,
    displayName: "歯科基本（基本・注加算）",
  },
  {
    name: "shikaKihonTsurei",
    store: shikaKihonTsureiMasterStore,
    displayName: "歯科基本通例",
  },
  {
    name: "shikaKihonZairyo",
    store: shikaKihonZairyoMasterStore,
    displayName: "歯科基本材料",
  },
];

const calculateScore = (
  data: MasterData,
  keywords: string[],
  isExactMatch: boolean,
): number => {
  if (isExactMatch) return 100;

  let score = 0;

  for (const record of data) {
    for (const [key, value] of Object.entries(record)) {
      const lowerValue = value.toLowerCase();
      const lowerKey = key.toLowerCase();

      // 各キーワードに対してスコアを計算
      for (const keyword of keywords) {
        const lowerKeyword = keyword.toLowerCase();

        if (lowerValue === lowerKeyword) {
          score += 50;
        } else if (lowerValue.startsWith(lowerKeyword)) {
          score += 30;
        } else if (lowerValue.includes(lowerKeyword)) {
          score += 10;
        }

        if (lowerKey.includes(lowerKeyword)) {
          score += 5;
        }
      }
    }
  }

  return Math.min(score, 99);
};

const searchInMaster = async (
  masterStore: MasterStore,
  keywords: string[],
): Promise<SearchResult[]> => {
  const results: SearchResult[] = [];

  // 単一キーワードの場合は完全一致検索も行う
  if (keywords.length === 1) {
    const keyword = keywords[0];
    const exactMatch = (await masterStore.store.getItem(
      keyword,
    )) as MasterData | null;
    if (exactMatch) {
      results.push({
        masterName: masterStore.name,
        displayName: masterStore.displayName,
        data: exactMatch,
        score: 100,
        matchType: "exact",
      });
    }
  }

  // 部分一致検索（AND検索対応）
  const partialMatches: MasterData = [];
  const matchedKeys = new Set<string>();

  await masterStore.store.iterate((value, key) => {
    const dataValue = value as MasterData;
    const lowerKey = key.toLowerCase();

    // キー名に全てのキーワードが含まれるかチェック
    const keyMatchesAll = keywords.every((keyword) =>
      lowerKey.includes(keyword.toLowerCase()),
    );

    if (keyMatchesAll && (keywords.length > 1 || key !== keywords[0])) {
      partialMatches.push(...dataValue);
      matchedKeys.add(key);
      return;
    }

    // レコードの値に全てのキーワードが含まれるかチェック
    for (const record of dataValue) {
      const recordText = Object.values(record).join(" ").toLowerCase();
      const matchesAllKeywords = keywords.every((keyword) =>
        recordText.includes(keyword.toLowerCase()),
      );

      if (matchesAllKeywords) {
        // 重複を避けるため、すでに追加済みのキーからのレコードは追加しない
        if (!matchedKeys.has(key)) {
          partialMatches.push(record);
        }
        break;
      }
    }
  });

  if (partialMatches.length > 0) {
    results.push({
      masterName: masterStore.name,
      displayName: masterStore.displayName,
      data: partialMatches,
      score: calculateScore(partialMatches, keywords, false),
      matchType: "partial",
    });
  }

  return results;
};

export const searchMaster = async (
  keyword: string,
): Promise<SearchResult[]> => {
  if (!keyword || keyword.trim() === "") {
    return [];
  }

  // スペース区切りでキーワードを分割し、空文字列を除去
  const keywords = keyword
    .trim()
    .split(/\s+/)
    .filter((k) => k.length > 0);

  if (keywords.length === 0) {
    return [];
  }

  // 並列検索
  const searchPromises = masterStores.map((store) =>
    searchInMaster(store, keywords),
  );
  const allResults = await Promise.all(searchPromises);

  // フラット化してスコア順にソート
  const flatResults = allResults.flat();
  flatResults.sort((a, b) => b.score - a.score);

  return flatResults;
};

// デバウンス検索用ヘルパー関数
export const debounce = <T extends (...params: never[]) => void>(
  func: T,
  wait: number,
): T => {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

// 検索結果のハイライト用ヘルパー関数
export const highlightKeyword = (text: string, keyword: string): string => {
  if (!keyword || keyword.trim() === "") return text;

  // スペース区切りでキーワードを分割
  const keywords = keyword
    .trim()
    .split(/\s+/)
    .filter((k) => k.length > 0);

  if (keywords.length === 0) return text;

  let result = text;

  // 各キーワードに対してハイライト処理
  for (const kw of keywords) {
    // 正規表現の特殊文字をエスケープ
    const escapedKeyword = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedKeyword})`, "gi");
    result = result.replace(regex, '<mark class="bg-yellow-300">$1</mark>');
  }

  return result;
};

// 検索フィルター用オプション
export interface SearchFilterOptions {
  masterTypes?: string[];
  matchType?: "all" | "exact" | "partial";
  minScore?: number;
}

// フィルター付き検索
export const searchMasterWithFilter = async (
  keyword: string,
  options?: SearchFilterOptions,
): Promise<SearchResult[]> => {
  let results = await searchMaster(keyword);

  if (options) {
    // マスタータイプでフィルター
    if (options.masterTypes && options.masterTypes.length > 0) {
      results = results.filter((r) =>
        options.masterTypes?.includes(r.masterName),
      );
    }

    // マッチタイプでフィルター
    if (options.matchType && options.matchType !== "all") {
      results = results.filter((r) => r.matchType === options.matchType);
    }

    // 最小スコアでフィルター
    if (options.minScore !== undefined && options.minScore !== null) {
      const minScore = options.minScore;
      results = results.filter((r) => r.score >= minScore);
    }
  }

  return results;
};
