"use client";

import React from "react";
import {
  Slide,
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import CancelIcon from "@mui/icons-material/Cancel";
import { ReservationsTable } from "@/types/reservation";
import { formatTimestampToJST } from "@/lib/formatter";

interface QrCodeDisplayProps {
  qrCodeValue: string; // QRコードに含めるデータ
  ticketData: ReservationsTable;
  containerRef: React.RefObject<HTMLDivElement>;
  onClose: () => void; // 閉じるボタンのハンドラ
}

/**
 * QRコードの表示と、画像のデザイン（添付画像参照）を模したコンポーネント
 */
export default function QrCodeDisplay({
  qrCodeValue,
  ticketData,
  onClose,
  containerRef,
}: QrCodeDisplayProps) {
  const isChecked = Boolean(qrCodeValue);
  const showtime = formatTimestampToJST(ticketData.start_time);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <Slide direction="up" in={isChecked} container={containerRef.current}>
        <Box
          sx={{
            px: 1,
            pt: 1,
            pb: 0,
            backgroundColor: "secondary.main",
            boxSizing: "border-box",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              backgroundImage: 'url("/tickets/ticket-bgimg.png")', // Replace with your image path
              backgroundRepeat: "no-repeat", // Prevents image repetition
              backgroundSize: "cover", // Scales the image to cover the entire container
              backgroundPosition: "center", // Centers the image within the container
              height: "100%",
              width: "100%",
              maxWidth: "400px",
              px: 8,
            }}
          >
            {/* QRコード表示 */}
            <Box sx={{ my: 4 }}>
              {qrCodeValue && (
                <QRCodeSVG
                  value={qrCodeValue}
                  level="H"
                  style={{
                    height: "auto",
                    maxWidth: "256px",
                    width: "100%",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              )}
            </Box>
            <Box sx={{ mt: 5, pt: 5 }}>
              <Typography variant="h6">{ticketData.movie_title}</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {ticketData.theater_name} - {ticketData.auditorium_name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {showtime}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }} color="secondary">
                {ticketData.seats}
              </Typography>
              <Divider sx={{ my: 5 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="text.secondary" fontSize={14}>
                  予約番号
                </Typography>
                <Typography fontSize={14}>{ticketData.unique_code}</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 15, textAlign: "center" }}>
              <IconButton onClick={onClose}>
                <CancelIcon sx={{ color: "gray", width: 50, height: 50 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Slide>
    </Box>
  );
}
