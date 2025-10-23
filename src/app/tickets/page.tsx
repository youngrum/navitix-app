// app/tickets/page.tsx
import { createServerSupabaseClient } from "@/utils/supabase/server";
import TicketList from "@/components/tickets/TicketList";
import { Box, Stack, Typography } from "@mui/material";
import { ReservationsTable } from "@/types/reservation";
import { requireAuth } from "@/lib/auth";
import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";

export default async function Page() {
  const header1Text = "予約チケット";
  // 認証ユーザーのID取得
  const data = await requireAuth();
  const currentUserId = data.user?.id;
  // 予約データの取得
  const supabase = await createServerSupabaseClient();
  const { data: reservationsData, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("user_id", currentUserId)
    .order("reserved_at", { ascending: false });

  if (error) {
    console.error("予約の取得エラー:", error);
    return (
      <Box sx={{ color: "#FFFFFF", padding: 4 }}>
        チケット情報の取得に失敗しました。時間をおいて再度お試しください。
      </Box>
    );
  }

  return (
    <main>
      <ThemeProviderWrapper>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <BackButton returnPath="/movies" />
          <Header1 headerText={header1Text} />
        </Stack>
        {reservationsData ? (
          <TicketList reservations={reservationsData as ReservationsTable[]} />
        ) : (
          <Typography>予約済みのチケットはありません</Typography>
        )}
      </ThemeProviderWrapper>
    </main>
  );
}
