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
import { createReservation } from "@/actions/reservation/createReservation";
import { useRouter } from "next/navigation";
import NoticeModal from "@/components/common/NoticeModal";
import { modalStatus } from "@/types/modalStatus";

interface reservationProps {
  theaterName: string;
  auditoriumId: number;
  auditoriumName: string;
  schedulesId: number;
  movieId: number;
  movieTitle: string;
  posterPath: string;
  showtime: string;
}

// SWR データ取得用fetcher関数
const fetcher = async ([auditoriumId, schedulesId]: [number, number]) => {
  // "seats-1-3" から ["1", "3"] を抽出
  const data = await getSeatDataForClient(
    String(auditoriumId),
    String(schedulesId)
  );
  if (!data) {
    throw new Error("座席データの取得に失敗しました");
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
  posterPath,
  showtime,
}: reservationProps) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [feeSum, setFeeSum] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessageHeader, setModalMessageHeader] = useState("");
  const [modalIconStatus, setModalIconStatus] =
    useState<modalStatus>("mail-success");
  const [modalMessage, setModalMessage] = useState("");
  const submitText = "予約する";
  const router = useRouter();

  const handleSeatsChange = (seats: number[], fee: number) => {
    setSelectedSeats(seats);
    setFeeSum(fee);
    setValidationErrors([]);
  };

  // SWRで座席データをフェッチ
  const { data, error, isLoading, mutate } =
    useSWR<SeatWithTheaterAndMovieResponse>(
      [auditoriumId, schedulesId],
      fetcher,
      {
        revalidateOnFocus: true,
        refreshInterval: 10000,
      }
    );

  // ロード中・エラーの処理
  if (error) {
    console.log(error);
    return (
      <Typography color="error">座席データの取得に失敗しました。</Typography>
    );
  }
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
      poster_path: posterPath,
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
        setModalMessageHeader("Reservation Complete!");
        setModalIconStatus("mail-success");
        setModalMessage(
          `予約が完了しました!\n予約コード: ${result.uniqueCode}\n予約ID: ${result.reservationId}`
        );
        setModalOpen(true);

        // 予約完了ページへリダイレクト
        router.push(`/tickets/${result.reservationId}`);
      } else {
        // エラー時の処理
        setValidationErrors([result.error || "予約に失敗しました"]);
      }
    } catch (error) {
      console.error("Reservation error:", error);
      setValidationErrors(["予期しないエラーが発生しました"]);
      setModalMessageHeader("System Error");
      setModalIconStatus("notice");
      setModalMessage("予期しないエラーが発生しました");
      setModalOpen(true);
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
      <NoticeModal
        openProps={modalOpen}
        messageProps={modalMessage}
        messageHeaderProps={modalMessageHeader}
        stausProps={modalIconStatus}
      />
    </Box>
  );
}
