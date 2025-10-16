"use client";
import { formatTimestampToJST } from "@/lib/getShowTimeUtils";
import { ReservationData } from "@/types/tickets";
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

type TicketItemProps = {
  reservation: ReservationData;
};

export default function TicketItem({ reservation }: TicketItemProps) {
  const isCancelled = !!reservation.cancelled_at;

  const startTimeFormatted = new Date(
    reservation.start_time
  ).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTimeFormatted = new Date(reservation.end_time).toLocaleTimeString(
    "ja-JP",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const dateFormatted = new Date(reservation.start_time).toLocaleDateString(
    "ja-JP",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  );

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PENDING":
        return "warning";
      case "EXPIRED":
        return "error";
      case "CANCELLED":
        return "default";
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
      sx={{ textDecoration: "none" }}
    >
      <Card
        sx={{
          display: "flex",
          my: 4,
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: 4,
          },
          opacity: isCancelled ? 0.6 : 1,
        }}
      >
        {/* ポスター画像 */}
        <CardMedia
          component="img"
          sx={{
            width: 120,
            height: 160,
            objectFit: "cover",
            flexShrink: 0,
          }}
          image={`https://image.tmdb.org/t/p/w500${reservation.poster_path || "/images/placeholder.jpg"}`}
          alt={reservation.movie_title}
        />

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
              sx={{
                fontWeight: 600,
                flex: 1,
                pr: 1,
                textDecoration: isCancelled ? "line-through" : "none",
              }}
            >
              {reservation.movie_title}
            </Typography>
            <ChevronRightIcon sx={{ color: "text.secondary" }} />
          </Box>

          {/* ステータスチップ */}
          <Box sx={{ mb: 1 }}>
            <Chip
              label={getPaymentStatusLabel(reservation.payment_status)}
              size="small"
              color={getPaymentStatusColor(reservation.payment_status)}
              variant={isCancelled ? "outlined" : "filled"}
            />
            {isCancelled && (
              <Chip
                label="キャンセル"
                size="small"
                color="error"
                variant="outlined"
                sx={{ ml: 1 }}
              />
            )}
          </Box>

          {/* 上映時刻と日付 */}
          <Stack spacing={0.5} sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>{dateFormatted}</strong> · {startTimeFormatted} -{" "}
              {endTimeFormatted}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              スクリーン {reservation.auditorium_id}
            </Typography>
          </Stack>

          {/* キャンセル日時（キャンセルされた場合） */}
          {isCancelled && (
            <Typography variant="caption" color="error" sx={{ mt: "auto" }}>
              キャンセル日:{" "}
              {formatTimestampToJST(String(reservation.cancelled_at))}
            </Typography>
          )}
        </CardContent>
      </Card>
    </MuiLink>
  );
}
