// components/screen/ScreenScheduleSelector.tsx
"use client";
import { ScreenSchedule } from "@/types/screen";
import { useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import theme from "@/styles/theme";
import { Box, Typography } from "@mui/material";

interface Props {
  schedulesProps: ScreenSchedule[];
  screenNameProps?: string;
}

// 日付選択ボタンデザイン定義
const CustomDateButton = styled(Button)({
  borderRadius: "4px",
  width: "50px",
  height: "50px",
  margin: "4px 8px 0 0",
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[300]}`,
  display: "flex",
  flexDirection: "column",
});
// 上映開始時間選択ボタンデザイン定義
const CustomShowtimeButton = styled(Button)({
  borderRadius: "4px",
  margin: "4px 12px 0 0",
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[300]}`,
  display: "flex",
  flexDirection: "column",
});

export default function ScreenScheduleSelector({
  schedulesProps,
  screenNameProps,
}: Props) {
  const [selectedDate, setSelectedDate] = useState<string>(
    schedulesProps?.[0]?.date || ""
  );

  const selectedSchedule = schedulesProps?.find((s) => s.date === selectedDate);

  // schedulesが空またはundefinedの場合は何も表示しない
  if (!schedulesProps || schedulesProps.length === 0) {
    return <div>スケジュールがありません</div>;
  }

  return (
    <>
      {/* 日付ボタン */}
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          marginBottom: "8px",
          paddingBottom: "8px",
        }}
      >
        {schedulesProps.map((schedule) => (
          <CustomDateButton
            key={schedule.date}
            onClick={() => setSelectedDate(schedule.date)}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
              {schedule.day}
            </Typography>
            <Typography sx={{ fontSize: "14px" }}>({schedule.week})</Typography>
          </CustomDateButton>
        ))}
      </Box>

      {/* 上映時間ボタン */}
      <Box sx={{ display: "flex", overflowX: "auto" }}>
        {selectedSchedule?.showtimes.map((showtime) => (
          <CustomShowtimeButton key={showtime.id}>
            {showtime.play_beginning}
          </CustomShowtimeButton>
        ))}
      </Box>
    </>
  );
}
