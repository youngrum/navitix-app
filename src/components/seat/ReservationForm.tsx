// components/seat/ReservationForm.tsx
"use client";
import { useState } from "react";
import useSWR from "swr";
import { Box, CircularProgress, Typography } from "@mui/material";
import { SeatWithTheaterAndMovieResponse } from "@/types/seat";
import SeatSelection from "./SeatSelection"; // 修正した子コンポーネントをインポート
import SubmitButton from "../common/SubmitButton";
import { ReservationRequestSchema } from "@/types/form";
import theme from "@/styles/theme";
import { getSeatDataForClient } from "@/actions/seatActions";

interface reservationProps {
  auditoriumId: number;
  schedulesId: number;
}

// SWR データ取得用fetcher関数
const fetcher = async (auditoriumId: number) => {
  // Server Action を呼び出す
  const data = await getSeatDataForClient(String(auditoriumId));
  if (!data) {
    // データが null の場合は SWR にエラーをスローさせる
    throw new Error("認証エラー 座席データの取得に失敗しました");
  }
  return data;
};

export default function ReservationForm({
  auditoriumId,
  schedulesId,
}: reservationProps) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [feeSum, setFeeSum] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const submitText = "予約する";

  const handleSeatsChange = (seats: number[], fee: number) => {
    setSelectedSeats(seats);
    setFeeSum(fee);
    setValidationErrors([]);
  };

  // SWRで座席データをフェッチ
  const { data, error, isLoading, mutate } =
    useSWR<SeatWithTheaterAndMovieResponse>(String(auditoriumId), fetcher, {
      // 第一引数を auditoriumId に変更
      revalidateOnFocus: true,
      refreshInterval: 10000,
    });
  // ロード中・エラーの処理
  if (error)
    return (
      <Typography color="error">座席データの取得に失敗しました。</Typography>
    );
  if (isLoading || !data)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  // SWRで取得した最新の座席データ
  const latesSeatstData = data?.seatData;

  // 送信処理
  const handleReservation = async () => {
    // 予約送信前のデータ
    const payload = {
      selected_seat_ids: selectedSeats,
      auditorium_id: auditoriumId, // 上映室ID 映画館＋上映作品が紐づく
      schedules_id: schedulesId, // 上映スケジュールID
      total_amount: feeSum, // クライアント側で計算した料金
    };

    //Zod バリデーションの実行
    const validationResult = ReservationRequestSchema.safeParse(payload);
    // バリデーションエラーメッセージをstateに代入
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(
        (issue) => issue.message
      );
      setValidationErrors(errorMessages);
      return;
    }
    setValidationErrors([]); //バリデーションエラー初期化

    // バリデーション成功後の処理 APIリクエスト
    alert(JSON.stringify(payload, null, 2));
  };

  return (
    <Box>
      <SeatSelection
        seatsData={latesSeatstData}
        onSeatsChange={handleSeatsChange}
      />
      {validationErrors.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {validationErrors.map((error, index) => (
            <Typography
              key={index}
              variant="h6"
              sx={{
                mb: 1,
                color: `${theme.palette.secondary.main}`,
                fontSize: "12px",
              }}
            >
              {error}
            </Typography>
          ))}
        </Box>
      )}
      <form action={handleReservation}>
        <SubmitButton
          isLoading={isLoading}
          buttonText={submitText}
        ></SubmitButton>
      </form>
    </Box>
  );
}
