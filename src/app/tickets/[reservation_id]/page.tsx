import { newGetMovileDetail } from "@/lib/movieDetailUtils";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import _DetailInfo from "@/components/movies/detail/_DetailInfo";
import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { ReservationsTable } from "@/types/reservation";
import TicketDetailCard from "@/components/tickets/TicketDetailCard";

export default async function page({
  params,
}: {
  params: Promise<{ reservation_id: string }>;
}) {
  const { reservation_id } = await params;
  const reservationId = Number(reservation_id);
  const header1Text = "予約詳細";

  // 予約データの取得
  const supabase = await createServerSupabaseClient();
  const { data: reservationData, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", reservationId);

  if (error) {
    console.error("予約レコードの取得エラー:", error);
    return (
      <Typography sx={{ color: "secondary", padding: 4 }}>
        チケット情報の取得に失敗しました。時間をおいて再度お試しください。
      </Typography>
    );
  }
  const ticketData: ReservationsTable = reservationData[0];
  const newDetail = await newGetMovileDetail(reservationData[0].movie_id);

  return (
    <main>
      <ThemeProviderWrapper>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <BackButton returnPath="/movies" />
          <Header1 headerText={header1Text} />
        </Stack>
        <_DetailInfo MovieDetailProps={newDetail} />
        <TicketDetailCard ticketData={ticketData} />
        <Divider sx={{ my: 4 }} />
      </ThemeProviderWrapper>
    </main>
  );
}
