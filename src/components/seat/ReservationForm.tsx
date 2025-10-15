// components/seat/ReservationForm.tsx
"use client";
import { useState } from "react";
import useSWR from "swr";
import { Box, CircularProgress, Typography } from "@mui/material";
import { SeatWithTheaterAndMovieResponse } from "@/types/seat";
import SeatSelection from "@/components/seat/SeatSelection";
import SubmitButton from "@/components/common/SubmitButton";
import { ReservationRequestSchema } from "@/types/form";
import theme from "@/styles/theme";
import { getSeatDataForClient } from "@/actions/seatActions";
import { createReservation } from "@/actions/reservationActions";
import { useRouter } from "next/navigation";
import { Showtime } from "../../types/screen";

interface reservationProps {
  theaterName: string;
  auditoriumId: number;
  auditoriumName: string;
  schedulesId: number;
  movieId: number;
  movieTitle: string;
  showtime: string;
}

// SWR データ取得用fetcher関数
const fetcher = async (auditoriumId: number) => {
  const data = await getSeatDataForClient(String(auditoriumId));
  if (!data) {
    throw new Error("認証エラー 座席データの取得に失敗しました");
  }
  return data;
};

export default function ReservationForm({
  theaterName,
  auditoriumId,
  auditoriumName,
  schedulesId,
  movieId,
  movieTitle,
  showtime,
}: reservationProps) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [feeSum, setFeeSum] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitText = "予約する";
  const router = useRouter();

  const handleSeatsChange = (seats: number[], fee: number) => {
    setSelectedSeats(seats);
    setFeeSum(fee);
    setValidationErrors([]);
  };

  // SWRで座席データをフェッチ
  const { data, error, isLoading, mutate } =
    useSWR<SeatWithTheaterAndMovieResponse>(String(auditoriumId), fetcher, {
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
    setIsSubmitting(true);
    setValidationErrors([]);

    // 予約送信前のデータ
    const payload = {
      theater_name: theaterName,
      selected_seat_ids: selectedSeats,
      auditorium_id: auditoriumId,
      auditorium_name: auditoriumName,
      schedules_id: schedulesId,
      movie_id: movieId,
      movie_title: movieTitle,
      showtime: showtime,
      total_amount: feeSum,
    };

    // Zod バリデーションの実行
    const validationResult = ReservationRequestSchema.safeParse(payload);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(
        (issue) => issue.message
      );
      setValidationErrors(errorMessages);
      setIsSubmitting(false);
      return;
    }

    // Server Actionを呼び出し
    try {
      const result = await createReservation(payload);

      if (result.success) {
        // 成功時の処理
        alert(
          `予約が完了しました！\n予約コード: ${result.uniqueCode}\n予約ID: ${result.reservationId}`
        );
        // 予約完了ページへリダイレクト
        router.push(`/reservations/${result.reservationId}`);
      } else {
        // エラー時の処理
        setValidationErrors([result.error || "予約に失敗しました"]);
      }
    } catch (error) {
      console.error("Reservation error:", error);
      setValidationErrors(["予期しないエラーが発生しました"]);
    } finally {
      setIsSubmitting(false);
      // 座席データを再取得
      mutate();
    }
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
          isLoading={isSubmitting}
          buttonText={submitText}
        ></SubmitButton>
      </form>
    </Box>
  );
}
