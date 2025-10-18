// app/tickets/page.tsx
import { createServerSupabaseClient } from "@/utils/supabase/server";
import TicketList from "@/components/tickets/TicketList";
import { Box, Stack } from "@mui/material";
import { ReservationData } from "@/types/tickets";
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
    // ユーザーにエラーメッセージを表示
    return (
      <Box sx={{ color: "#FFFFFF", padding: 4 }}>
        チケット情報の取得に失敗しました。時間をおいて再度お試しください。
      </Box>
    );
  }

  // 4. データがない場合のハンドリング（オプション）
  if (!reservationsData || reservationsData.length === 0) {
    return (
      <Box sx={{ color: "#FFFFFF", padding: 4 }}>
        現在、予約済みのチケットはありません。
      </Box>
    );
  }

  // 5. 取得したデータをコンポーネントに渡して表示
  // 取得したデータは、型キャストするか、Supabaseのジェネリック型を使用するのが理想です
  return (
    <main>
      <ThemeProviderWrapper>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <BackButton returnPath="/movies" />
          <Header1 headerText={header1Text} />
        </Stack>
        <TicketList reservations={reservationsData as ReservationData[]} />
      </ThemeProviderWrapper>
    </main>
  );
}
