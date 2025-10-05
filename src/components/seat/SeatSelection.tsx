// components/seat/SeatSelection.tsx
"use client";
import { useState } from "react";
import { Box, Typography, Button, Paper, Stack, Divider } from "@mui/material";
import { SeatsData } from "@/types/seat";
import { styled } from "@mui/material/styles";
import { BorderAll, BorderColor } from "@mui/icons-material";
import theme from "@/styles/theme";
interface CustomButtonProps {
  isSelected: boolean;
  isAvailable: boolean;
}

interface Props {
  seatsData: SeatsData[];
}

const CustomButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "isAvailable",
})<CustomButtonProps>(({ theme, isSelected, isAvailable }) => ({
  // FlexBox内のサイズ設定
  flexGrow: 1,
  minWidth: 28,
  minHeight: 28,
  p: 0,
  fontSize: "11px",
  fontWeight: "bold",
  border: `1px solid ${theme.palette.grey[300]}`,

  // 背景色と文字色の設定
  backgroundColor: isSelected
    ? theme.palette.secondary.main // 選択中
    : isAvailable // 空席
    ? theme.palette.background.default
    : theme.palette.grey[100], // 予約済
  color: isSelected ? theme.palette.common.white : theme.palette.common.black,

  // ボーダーの設定
  borderColor: isSelected
    ? "none" // 選択中
    : isAvailable // 空席
    ? "none"
    : theme.palette.grey[300],

  // 無効化（予約済）時のスタイル
  "&.Mui-disabled": {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.text.disabled,
    borderColor: "none",
  },
}));

export default function SeatSelection({ seatsData }: Props) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [feeSum, setFeeSum] = useState(0);

  // 座席データを行ごとにグループ化してソート
  const seatsByRow = seatsData.reduce((acc, seat) => {
    if (!acc[seat.seat_row]) {
      acc[seat.seat_row] = [];
    }
    acc[seat.seat_row].push(seat);
    return acc;
  }, {} as Record<string, SeatsData[]>);

  const sortedRows = Object.keys(seatsByRow).sort();

  sortedRows.forEach((row) => {
    seatsByRow[row].sort(
      (a, b) => parseInt(a.seat_number) - parseInt(b.seat_number)
    );
  });

  // 料金合計を計算・更新するヘルパー関数を追加
  const calculateFeeSum = (currentSelectedIds: number[]) => {
    const sum = seatsData.reduce((total, seat) => {
      if (currentSelectedIds.includes(seat.id)) {
        return total + seat.fee;
      }
      return total;
    }, 0);
    setFeeSum(sum);
  };

  const handleSeatClick = (seatId: number, isAvailable: boolean) => {
    if (!isAvailable) return;
    const newSelectedSeats = selectedSeats.includes(seatId)
      ? selectedSeats.filter((id) => id !== seatId) // 選択解除
      : [...selectedSeats, seatId]; // 新たに選択
    setSelectedSeats(newSelectedSeats);
    calculateFeeSum(newSelectedSeats);
  };

  return (
    <Box>
      {/* 座席マップ */}
      <Box sx={{ mb: 4 }}>
        {sortedRows.map((row) => (
          <Box
            key={row}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 0.5,
              mb: 1,
            }}
          >
            {seatsByRow[row].map((seat) => {
              const isSelected = selectedSeats.includes(seat.id);
              const seatNum = parseInt(seat.seat_number);

              return (
                <Box
                  key={seat.id}
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    minWidth: 0,
                    minHeight: 0,
                    aspectRatio: "1 / 0.6",
                  }}
                >
                  {/* 5と6の間にスペース */}
                  {seatNum === 6 && <Box sx={{ width: "2rem" }} />}

                  <CustomButton
                    onClick={() => handleSeatClick(seat.id, seat.is_available)}
                    disabled={!seat.is_available}
                    isSelected={isSelected}
                    isAvailable={seat.is_available}
                  >
                    {seat.seat_row}
                    {seat.seat_number}
                  </CustomButton>
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 3, justifyContent: "center" }}
      >
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          paddingRight={4}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              bgcolor: `${theme.palette.background.default}`,
              border: `solid 1px ${theme.palette.grey[300]}`,
              borderRadius: "2px",
            }}
          />
          <Typography variant="caption">空席</Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          paddingRight={4}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              bgcolor: `${theme.palette.grey[300]}`,
              border: "none",
              borderRadius: "2px",
            }}
          />
          <Typography variant="caption">予約済</Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          paddingRight={4}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              bgcolor: `${theme.palette.secondary.main}`,
              border: "none",
              borderRadius: "2px",
            }}
          />
          <Typography variant="caption">選択中</Typography>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        {/** 合計金額 */}
        <Box sx={{ textAlign: "center", width: "50%", pb: 2 }}>
          <Typography variant="body2" fontWeight="normal" fontSize="14px">
            合計料金(税抜)
          </Typography>
          <Typography variant="body2" fontSize="18px" sx={{ mt: 1 }}>
            ¥ {feeSum.toLocaleString()} 円
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* 選択座席情報 */}

        <Stack sx={{ textAlign: "center", width: "50%", pb: 2 }}>
          <Typography variant="body2" fontWeight="normal" fontSize={"14px"}>
            選択中の座席
          </Typography>
          <Box // Stackを使って横並びにする
            display="flex"
            justifyContent="center"
            flexWrap="wrap"
            gap={1}
          >
            {selectedSeats.map((seatId) => {
              const seat = seatsData.find((s) => s.id === seatId);
              return seat ? (
                <Box
                  key={seat.id}
                  sx={{
                    color: `${theme.palette.background.default}`,
                    bgcolor: `${theme.palette.secondary.main}`,
                    borderRadius: "4px",
                    py: 0.4,
                    px: 0.5,
                    mt: 1,
                    aspectRatio: "1 / 0.6",
                    fontSize: "12px",
                  }}
                >
                  {seat.seat_row}
                  {seat.seat_number}
                </Box>
              ) : (
                ""
              );
            })}
          </Box>
        </Stack>
      </Box>
      {/* 予約確定ボタン */}
      <Button
        variant="contained"
        fullWidth
        disabled={selectedSeats.length === 0}
        sx={{ py: 1.5 }}
      >
        予約を確定する ({selectedSeats.length}席)
      </Button>
    </Box>
  );
}
