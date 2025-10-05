// app/theater/[theater_id]/screen/[auditorium_id]/seat/page.tsx
import { notFound } from "next/navigation";
import SeatSelection from "@/components/seat/SeatSelection";
import { getSeatData } from "@/lib/getSeatsUtils";
import { SeatWithTheaterAndMovieResponse } from "@/types/seat";
import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import Image from "next/image";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Stack, Divider, Typography, Box } from "@mui/material";

export default async function Page({
  params,
}: {
  params: Promise<{
    theater_id: string;
    auditorium_id: string;
  }>;
}) {
  const { auditorium_id } = await params;

  // APIから座席データ・映画タイトル・映画館を取得
  const responseData: SeatWithTheaterAndMovieResponse = await getSeatData(
    auditorium_id
  );
  const header1Text = "座席指定";
  const theaterName = responseData?.theaterData.name;
  const movieTitle = responseData?.movieTitle;
  const auditoriumName = responseData?.auditoriumName;

  if (!responseData) {
    notFound();
  }
  console.log("seat page seatData:", responseData);
  return (
    <main>
      <ThemeProviderWrapper>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <BackButton returnPath="/theater" />
          <Header1 headerText={header1Text} />
        </Stack>
        <Divider />
        {theaterName && (
          <Typography variant="h6" sx={{ my: 1, fontSize: "14px" }}>
            {theaterName}
          </Typography>
        )}
        <Divider />
        {movieTitle && (
          <Typography variant="h6" sx={{ my: 1, fontSize: "14px" }}>
            {movieTitle}
          </Typography>
        )}
        <Divider />
        {/* スクリーン表示 */}

        <Box
          sx={{
            textAlign: "center",
            width: "100%",
            my: 2,
            position: "relative",
            height: 60,
            mx: "auto",
          }}
        >
          <Image src="/screen/screenBase.png" alt={auditoriumName} fill />
          {auditoriumName && (
            <Typography
              sx={{
                position: "absolute",
                fontSize: "14px",
                top: 20,
                width: "100%",
              }}
            >
              {auditoriumName}
            </Typography>
          )}
        </Box>
        <SeatSelection seatsData={responseData.seatData} />
      </ThemeProviderWrapper>
    </main>
  );
}
