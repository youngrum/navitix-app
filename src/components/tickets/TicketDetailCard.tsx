import {
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Box,
} from "@mui/material";
import { ReservationsTable } from "@/types/reservation";

import {
  formatCurrency,
  formatDate,
  formatTime,
  formatPaidAt,
} from "@/lib/formatter";
import theme from "@/styles/theme";

interface ReservationDetailProps {
  // 予約データ
  ticketData: ReservationsTable;
  // 画像には含まれていないが、表示に必要な情報をPropsで渡す
}

export function TicketDetailCard({ ticketData }: ReservationDetailProps) {
  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 1,
        border: `1px solid ${theme.palette.grey[300]}`,
        bgcolor: `${theme.palette.grey[50]}`,
        mt: 2,
      }}
    >
      <CardContent sx={{ padding: "16px", "&:last-child": { pb: 2 } }}>
        {/* タイトル */}
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{ mb: 1.5, fontSize: "16px" }}
        >
          予約詳細
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {/* 映画館 */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary" fontSize={14}>
              映画館
            </Typography>
            <Typography fontWeight="500" fontSize={14}>
              {ticketData.theater_name}
            </Typography>
          </Box>

          {/* スクリーン */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary" fontSize={14}>
              スクリーン
            </Typography>
            <Typography fontWeight="500" fontSize={14}>
              {ticketData.auditorium_name}
            </Typography>
          </Box>

          {/* 座席 */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary" fontSize={14}>
              座席
            </Typography>
            <Typography fontWeight="500" fontSize={14}>
              {ticketData.seats}
            </Typography>
          </Box>

          {/* 日程 */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary" fontSize={14}>
              日程
            </Typography>
            <Typography fontWeight="500" fontSize={14}>
              {formatDate(ticketData.start_time)}
            </Typography>
          </Box>
          {/* 日程 */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary" fontSize={14}>
              時間
            </Typography>
            <Typography fontWeight="500" fontSize={14}>
              {formatTime(ticketData.start_time)} ～{" "}
              {formatTime(ticketData.end_time)}
            </Typography>
          </Box>
          {/* 予約番号 */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary" fontSize={14}>
              予約番号
            </Typography>
            <Typography fontWeight="500" fontSize={14}>
              {ticketData.unique_code}
            </Typography>
          </Box>

          {/* 決済日時 */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary" fontSize={14}>
              決済日時
            </Typography>
            <Typography fontWeight="500" fontSize={14}>
              {formatPaidAt(ticketData.paid_at)}
            </Typography>
          </Box>

          {/* 支払金額 */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography color="text.secondary" fontSize={14}>
              支払金額(税込)
            </Typography>
            <Typography
              variant="caption"
              fontWeight="500"
              sx={{ fontSize: "14px", color: "#000" }}
            >
              {formatCurrency(ticketData.total_amount)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TicketDetailCard;
