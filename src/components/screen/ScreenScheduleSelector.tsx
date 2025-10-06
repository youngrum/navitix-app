// components/screen/ScreenScheduleSelector.tsx
"use client";
import { ScreenSchedule } from "@/types/screen";
import { useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import LinkButton from "@/components/common/LinkButton";

interface ScreenProps {
  schedulesProps: ScreenSchedule[];
  theaterId: string;
  auditoriumId: number;
}

interface CustomButtonProps {
  isSelected: boolean;
}

// 日付選択ボタンデザイン定義
const CustomDateButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<CustomButtonProps>(({ theme, isSelected }) => ({
  borderRadius: "4px",
  margin: "0 12px 0 0",
  color: isSelected
    ? theme.palette.background.default
    : theme.palette.text.primary,
  backgroundColor: isSelected
    ? theme.palette.secondary.main
    : theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[300]}`,
  display: "flex",
  flexDirection: "column",
}));
// 上映開始時間選択ボタンデザイン定義
const CustomShowtimeButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<CustomButtonProps>(({ theme, isSelected }) => ({
  borderRadius: "4px",
  margin: "4px 16px 0 0",
  color: isSelected
    ? theme.palette.background.default
    : theme.palette.text.primary,
  backgroundColor: isSelected
    ? theme.palette.secondary.main
    : theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[300]}`,
  display: "flex",
  flexDirection: "column",
}));

export default function ScreenScheduleSelector({
  schedulesProps,
  theaterId,
  auditoriumId,
}: ScreenProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    schedulesProps?.[0]?.date || ""
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    schedulesProps?.[0]?.showtimes[0].start_time || ""
  );

  // 選択された日付を取得
  const selectedSchedule = schedulesProps?.find((s) => s.date === selectedDate);
  // 選択された上映時間を取得
  const selectedShowtime = selectedSchedule?.showtimes.find(
    (st) => st.start_time === selectedTime
  );

  // クエリパラメータ付きURLを動的に生成
  const getSeatSelectionUrl = () => {
    if (!selectedShowtime || !selectedSchedule) return "";
    return `/theater/${theaterId}/screen/${auditoriumId}/seat`;
  };

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
            key={schedule.day}
            onClick={() => {
              //日付変更時に、自動的にその日の最初の上映時間を選択する
              setSelectedDate(schedule.date);
              if (schedule.showtimes.length > 0) {
                // その日付の最初の上映時間を選択
                setSelectedTime(schedule.showtimes[0].start_time);
              } else {
                // スケジュールがない場合は時間をリセット
                setSelectedTime("");
              }
            }}
            // 日付ボタンの選択状態
            isSelected={selectedDate === schedule.date}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
              {schedule.day}
            </Typography>
            <Typography sx={{ fontSize: "14px" }}>({schedule.week})</Typography>
          </CustomDateButton>
        ))}
      </Box>

      {/* 上映時間ボタン */}
      <Box sx={{ display: "flex", overflowX: "auto" }}>
        {selectedSchedule?.showtimes.map((showtime) => (
          <CustomShowtimeButton
            key={showtime.id}
            onClick={() => setSelectedTime(showtime.start_time)}
            isSelected={selectedTime === showtime.start_time}
          >
            {showtime.play_beginning}
          </CustomShowtimeButton>
        ))}
      </Box>
      {/* 座席選択へ進むボタン */}
      <LinkButton
        buttonTextProps="座席選択へ進む"
        toProps={getSeatSelectionUrl()}
      />
    </>
  );
}
