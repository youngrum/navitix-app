// app/theater/[theater_id]/screen/[auditorium_id]/seat/page.tsx
import { notFound } from "next/navigation";
import { getSeatData } from "@/lib/getSeatsUtils";
import { SeatWithTheaterAndMovieResponse } from "@/types/seat";
import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import Image from "next/image";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Stack, Divider, Typography, Box } from "@mui/material";
import ReservationForm from "@/components/seat/ReservationForm";
import { formatTimestampToJST } from "@/lib/getShowTimeUtils";

interface SeatPageProps {
  params: Promise<{
    theater_id: string;
    auditorium_id: string;
  }>;
  searchParams: Promise<{
    scheduleId: string; // クエリパラメータとして渡されることを期待
  }>;
}

export default async function Page({ params, searchParams }: SeatPageProps) {
  const { auditorium_id } = await params;
  const { scheduleId } = await searchParams;

  // APIから座席データ・映画タイトル・映画館を取得
  const responseData: SeatWithTheaterAndMovieResponse | null =
    await getSeatData(auditorium_id, scheduleId);
  if (!responseData) {
    notFound();
  }
  const header1Text = "座席指定";
  const theater_name = responseData?.theaterData.name;
  const movie_title = responseData?.movieTitle;
  const movie_id = responseData?.movieId;
  const posert_path = responseData?.posterPath;
  const auditorium_name = responseData?.auditoriumName;
  const schedules_id = responseData?.schedulesId;
  const showtime = formatTimestampToJST(responseData?.startTime);

  return (
    <main>
      <ThemeProviderWrapper>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <BackButton returnPath="/theater" />
          <Header1 headerText={header1Text} />
        </Stack>
        <Divider />
        {theater_name && (
          <Typography variant="h6" sx={{ my: 1, fontSize: "14px" }}>
            {theater_name}
          </Typography>
        )}
        <Divider />
        {movie_title && (
          <Typography variant="h6" sx={{ my: 1, fontSize: "14px" }}>
            {movie_title}
          </Typography>
        )}
        <Divider />
        {showtime && (
          <Typography variant="h6" sx={{ my: 1, fontSize: "14px" }}>
            {showtime}
          </Typography>
        )}
        <Divider />
        {/* スクリーン表示 */}
        <Box
          sx={{
            textAlign: "center",
            width: "100%",
            my: 6,
            position: "relative",
            height: "5rem",
            mx: "auto",
          }}
        >
          <Image
            src="/screen/screenBase.png"
            alt={auditorium_name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
          />
          {auditorium_name && (
            <Typography
              sx={{
                position: "absolute",
                fontSize: "14px",
                top: 30,
                width: "100%",
              }}
            >
              {auditorium_name}
            </Typography>
          )}
        </Box>
        <ReservationForm
          theaterName={theater_name}
          auditoriumId={Number(auditorium_id)}
          auditoriumName={auditorium_name}
          schedulesId={schedules_id}
          movieId={movie_id}
          movieTitle={movie_title}
          posterPath={posert_path}
          showtime={showtime}
        />
      </ThemeProviderWrapper>
    </main>
  );
}
