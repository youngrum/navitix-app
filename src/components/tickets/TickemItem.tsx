"use client";
import { formatTimestampToJST } from "@/lib/getShowTimeUtils";
import { ReservationsTable } from "@/types/reservation";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Link as MuiLink,
} from "@mui/material";
import NextLink from "next/link";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import theme from "@/styles/theme";
import { formatDate } from "@/lib/formatter";

type TicketItemProps = {
  reservation: ReservationsTable;
};

export default function TicketItem({ reservation }: TicketItemProps) {
  const isCancelled = !!reservation.cancelled_at;
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PENDING":
        return "warning";
      case "EXPIRED":
        return "error";
      case "CANCELLED":
        return "secondary";
      default:
        return "default";
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PAID: "支払済",
      PENDING: "未決済",
      EXPIRED: "期限切れ",
      CANCELLED: "キャンセル済",
    };
    return labels[status] || status;
  };

  return (
    <MuiLink
      component={NextLink}
      href={`/tickets/${reservation.id}`}
      underline="none"
    >
      <Card
        sx={{
          display: "flex",
          my: 4,
          p: 2,
          alignItems: "center",
          border: `1px solid ${theme.palette.grey[300]}`,
        }}
      >
        <Box
          sx={{
            aspectRatio: 1 / 1.5,
            maxWidh: "100%",
            position: "relative",
          }}
        >
          {/* ポスター画像 */}
          <CardMedia
            component="img"
            sx={{
              width: 120,
              height: 180,
              objectFit: "cover",
              flexShrink: 0,
            }}
            image={
              !reservation.poster_path
                ? "/noPosterImage.png"
                : `https://image.tmdb.org/t/p/w500${reservation.poster_path}`
            }
            alt={reservation.movie_title}
          />
        </Box>

        {/* コンテンツ */}
        <CardContent
          sx={{
            flex: 1,
            py: 2,
            px: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Typography
              variant="h6"
              fontSize={16}
              sx={{
                fontWeight: 600,
                flex: 1,
                pr: 1,
              }}
            >
              {reservation.movie_title}
            </Typography>
          </Box>

          {/* ステータスチップ */}
          <Box sx={{ mb: 1 }}>
            <Chip
              label={getPaymentStatusLabel(reservation.payment_status)}
              size="small"
              color={getPaymentStatusColor(reservation.payment_status)}
              variant={isCancelled ? "outlined" : "filled"}
            />
          </Box>

          {/* 上映時刻と日付 */}
          <Stack spacing={0.5} sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {formatTimestampToJST(reservation.start_time)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              スクリーン {reservation.auditorium_id}
            </Typography>
          </Stack>

          {/* キャンセル日時（キャンセルされた場合） */}
          {isCancelled && (
            <Typography variant="caption" color="error" sx={{ mt: "auto" }}>
              キャンセル日: {formatDate(String(reservation.cancelled_at))}
            </Typography>
          )}
        </CardContent>
        <Box>
          <ChevronRightIcon sx={{ color: "text.secondary" }} />
        </Box>
      </Card>
    </MuiLink>
  );
}
