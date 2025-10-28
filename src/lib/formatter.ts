/**
 * ISO 8601形式のUTCタイムスタンプを、指定された形式のJST文字列に変換する関数
 * @param utcTimestamp - ISO 8601形式のタイムスタンプ（例: '2025-10-12T01:00:00.000Z'）
 * @returns 変換されたJSTの日付と時刻の文字列（例: '2025年10月12日 10:00～'）
 */
export const formatTimestampToJST = (utcTimestamp: string): string => {
  // 1. Dateオブジェクトを作成
  const date = new Date(utcTimestamp);

  // 2. JSTにローカライズされた形式を設定
  const formatter = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24時間表記を使用
    timeZone: "Asia/Tokyo", // タイムゾーンを日本に指定
  });

  // 3. 変換後の文字列を取得し、区切り文字を調整してご要望の形式に合わせる
  // 例: "2025/10/12 10:00" -> "2025年10月12日 10:00"
  const formattedString = formatter
    .format(date)
    .replace(/\//g, "年") // スラッシュを「年」に置換
    .replace(" ", "日 "); // 半角スペースを「日」+半角スペースに置換

  // 4. 末尾に「～」を追加して返す
  return `${formattedString}～`;
};

/**
 * 金額をJPY形式にフォーマット
 * @param amount - 金額（数値）
 * @returns JPY形式の文字列（例: ¥10,000）
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(amount);
}

/**
 * タイムスタンプを日付にフォーマット
 * @param timestamp - タイムスタンプ（ISO文字列またはDate）
 * @returns 日付文字列（例: 2025年08月15日）
 */
export function formatDate(timestamp: string | Date): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}年${month}月${day}日`;
}

/**
 * タイムスタンプを時刻にフォーマット
 * @param timestamp - タイムスタンプ（ISO文字列またはDate）
 * @returns 時刻文字列（例: 10:00）
 */
export function formatTime(timestamp: string | Date): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * タイムスタンプを日付と時刻にフォーマット
 * @param timestamp - タイムスタンプ（ISO文字列またはDate）
 * @returns 日付と時刻の文字列（例: 2025年08月15日 10:00）
 */
export function formatDateTime(timestamp: string | Date): string {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const formattedTime = date.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formattedDate} ${formattedTime}`;
}

/**
 * 決済日時をフォーマット（nullの場合は「未決済」）
 * @param timestamp - タイムスタンプ（ISO文字列、Date、またはnull）
 * @returns 日付文字列、またはnullの場合は「未決済」
 */
export function formatPaidAt(timestamp: string | Date | null): string {
  if (!timestamp) {
    return "未決済";
  }
  return formatDate(timestamp);
}

/**
 * Dateオブジェクトを日本時間(JST)のISO 8601形式文字列（タイムゾーンオフセット付き）に変換する
 * 例: "2025-10-28T10:00:00+09:00"
 */
export const toJSTISOString = (date: Date): string => {
  const pad = (num: number): string => num.toString().padStart(2, "0");
  // ローカル（JST）の時刻要素を取得
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // getMonth()は0から始まる
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  // 日本時間（JST）のタイムゾーンオフセットを付与
  const timezoneOffset = "+09:00";

  return `${year}-${month}-${day}T${hour}:${minute}:${second}${timezoneOffset}`;
};
