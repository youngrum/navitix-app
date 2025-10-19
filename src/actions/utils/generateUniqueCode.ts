/**
 * ユニークな予約コードを生成する
 * @returns タイムスタンプとランダム文字列を組み合わせた一意のコード
 */
export function generateUniqueCode(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`.toUpperCase();
}
