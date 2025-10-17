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

//  export const startTimeFormatted (utcTimestamp: string): string => {
//    new Date(    target
//   ).toLocaleTimeString("ja-JP", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

//  export endTimeFormatted = new Date(reservation.end_time).toLocaleTimeString(
//    "ja-JP",
//    {
//      hour: "2-digit",
//      minute: "2-digit",
//    }
//  );

//  export dateFormatted = new Date(reservation.start_time).toLocaleDateString(
//     "ja-JP",
//     {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     }
//   );
