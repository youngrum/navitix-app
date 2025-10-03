// app/theater/[theater_id]/screen/[auditorium_id]/seat/page.tsx
import { notFound } from "next/navigation";
import SeatSelection from "@/components/seat/SeatSelection";
import { getSeatData } from "@/lib/getSeatsUtils";

interface SeatPageProps {
  params: Promise<{ theater_id: string; auditorium_id: string }>;
  searchParams: Promise<{ date?: string; schedule_id?: string }>;
}

export default async function Page({ params, searchParams }: SeatPageProps) {
  const { theater_id, auditorium_id } = await params;
  const { date, schedule_id } = await searchParams;

  // クエリパラメータのバリデーション
  if (!date || !schedule_id) {
    notFound(); // 404ページへ
  }
  // APIから座席データを取得
  const [seatData] = await Promise.all([
    getSeatData(theater_id, auditorium_id, schedule_id),
  ]);

  if (!seatData) {
    notFound();
  }

  // Server Componentでデータを渡し、 Componentで座席選択UIを表示
  return (
    <main>
      <SeatSelection
        theaterId={theater_id}
        auditoriumId={auditorium_id}
        date={date}
        scheduleId={schedule_id}
        seatData={seatData}
      />
    </main>
  );
}
