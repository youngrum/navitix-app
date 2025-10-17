import {
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Box,
} from "@mui/material";
import { ReservationsTable } from "@/types/reservation";

interface ReservationDetailProps {
  // 予約データ
  ticketData: ReservationsTable;
  // 画像には含まれていないが、表示に必要な情報をPropsで渡す
  theaterName: string;
  screenName: string; // No.3など
}

const ReservationDetailCard: React.FC<ReservationDetailProps> = ({
  ticketData,
  theaterName,
  screenName,
}) => {
  // 💡 seatsカラムのカンマ区切りを画像のような形式に変換（例: A列5番, A列6番 -> A5, A6）
  // 実際のデータ形式に応じて調整してください
  const formattedSeats = ticketData.seats
    .split(", ")
    .map((s) => s.replace(/列|番/g, "").trim())
    .join(", ");

  // 合計金額を税込みの日本円表示に変換
  const formattedTotalAmount = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(ticketData.total_amount);

  // 詳細アイテム表示用のヘルパーコンポーネント
  const DetailItem: React.FC<{ label: string; value: string | number }> = ({
    label,
    value,
  }) => (
    <Grid container spacing={1} sx={{ marginBottom: 0.5 }}>
      <Grid item xs={6}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={6} sx={{ textAlign: "right" }}>
        <Typography variant="body2" fontWeight="bold">
          {value}
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <Card sx={{ maxWidth: 400, margin: "auto", borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        {/* === タイトル部分 === */}
        <Typography variant="h6" gutterBottom fontWeight="bold">
          予約詳細
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* === 詳細情報 === */}
        <Box>
          <DetailItem label="映画館" value={theaterName} />
          <DetailItem label="スクリーン" value={screenName} />

          {/* 複数の座席をスペース区切りで表示する場合 */}
          <DetailItem label="座席" value={formattedSeats} />

          <DetailItem label="日程" value={ticketData.start_time} />
          <DetailItem
            label="時間"
            value={`${ticketData.start_time} ~ ${ticketData.end_time}`}
          />

          <DetailItem label="予約番号" value={ticketData.unique_code} />

          <DetailItem
            label="決済日時"
            // paid_atはstring | nullなので、nullの場合は適切な表示に
            value={ticketData.paid_at ? ticketData.paid_at : "未決済"}
          />

          <Divider sx={{ mt: 2, mb: 2 }} />

          <DetailItem label="支払金額(税込)" value={formattedTotalAmount} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReservationDetailCard;
