// components/seat/SeatSelectionClient.tsx
"use client";
import { useState, useEffect } from "react";

import { Box, Typography, Button } from "@mui/material";

interface Props {
  theaterId: string;
  auditoriumId: string;
  date: string;
  scheduleId: string;
  seatData: any; // 座席データの型定義
}

export default function SeatSelection({ date }: Props) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSeatClick = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  return (
    <Box>
      <Typography>{date}</Typography>

      {/* 座席マップ表示 */}
      <Box sx={{ my: 4 }}>{/* seatDataを使って座席UIを描画 */}</Box>

      <Button
        variant="contained"
        fullWidth
        disabled={selectedSeats.length === 0}
      >
        予約を確定する
      </Button>
    </Box>
  );
}
