/**
 * yyyymmdd形式の文字列をDateに変換する
 * @param date yyyymmdd形式の文字列
 */
export const toDate = (date: string) => {
  // 年は4桁、月は01-12、日は01-31までをまず正規表現でチェック
  const result = date.match(/^(\d{4})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/);
  if (!result) {
    throw new Error(`yyyymmdd形式で入力してください: ${date}`);
  }

  const yyyy = parseInt(result[1], 10);
  const mm = parseInt(result[2], 10);
  const dd = parseInt(result[3], 10);

  // Dateで生成して実際に同じ年月日になるか検証（2月29日や月の日数不足を検出）
  const d = new Date(`${yyyy}/${mm}/${dd}`);
  if (
    d.getFullYear() !== yyyy ||
    d.getMonth() !== mm - 1 ||
    d.getDate() !== dd
  ) {
    throw new Error(`不正な日付です: ${date}`);
  }

  return d;
};
