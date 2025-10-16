"use client";
import { formatTimestampToJST } from "@/lib/getShowTimeUtils";
import { ReservationData } from "@/types/tickets";

// プロパティの型定義
type TicketItemProps = {
  reservation: ReservationData;
};

// スタイル（className）を除外したコンポーネント
export default function TicketItem({ reservation }: TicketItemProps) {
  const isCancelled = !!reservation.cancelled_at;

  const endTimeFormatted = reservation.end_time
    ? new Date(reservation.end_time).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <div>
      <div>
        <h3>映画タイトル (ID: {reservation.movie_id}) 🍿</h3>
        {reservation.payment_status}
      </div>

      {/* グリッドレイアウトも一般的な<div>に変更 */}
      <div>
        <p>
          <strong>予約日時:</strong>
          <span>{formatTimestampToJST(reservation.reserved_at)}</span>
        </p>
        <p>
          <strong>上映時刻:</strong>
          <span>
            {formatTimestampToJST(reservation.start_time)} - {endTimeFormatted}
          </span>
        </p>

        <p>
          <strong>合計金額:</strong>
          <span>{reservation.total_amount}</span>
        </p>
        <p>
          <strong>予約コード:</strong>
          <span>{reservation.unique_code}</span>
        </p>

        <p>
          <strong>上映スクリーン:</strong>
          <span>{reservation.auditorium_id}</span>
        </p>
        <p>
          <strong>予約ID:</strong>
          <span>{reservation.id}</span>
        </p>
      </div>

      {isCancelled && (
        <p>
          キャンセル処理日時:{" "}
          {formatTimestampToJST(String(reservation.cancelled_at))}
        </p>
      )}
    </div>
  );
}
