import _DetailInfo from "@/components/movies/detail/_DetailInfo";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Box, Stack, Typography } from "@mui/material";
import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";
import ScreenScheduleSelector from "@/components/screen/ScreenScheduleSelector";
import Divider from "@mui/material/Divider";
import { getScreenData } from "@/lib/getScreenUtils";

export default async function page({
  params,
}: {
  params: Promise<{ theater_id: string }>;
}) {
  const { theater_id } = await params;
  const screenData = await getScreenData(theater_id);
  const theaterName = screenData?.theater_name || null;
  const header1Text = "上映中作品";

  return (
    <>
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
          {screenData &&
          screenData.auditoriums &&
          screenData.auditoriums.length > 0 ? (
            // 展開するのは audtoriums の配列
            screenData.auditoriums.map((auditorium) => (
              <Box key={auditorium.id} sx={{ my: 4 }}>
                {/* 映画詳細コンポーネント */}
                <_DetailInfo MovieDetailProps={auditorium.movie} />
                {/* スクリーン名 */}
                <Typography variant="h6" sx={{ my: 2, fontSize: "14px" }}>
                  {auditorium.name}
                </Typography>
                {/* スケジュール選択コンポーネント */}
                <ScreenScheduleSelector
                  schedulesProps={auditorium.schedules}
                  theaterId={theater_id}
                  auditoriumId={auditorium.id}
                />
                <Divider sx={{ my: 2 }} />
              </Box>
            ))
          ) : (
            <Box sx={{ my: 4, textAlign: "center" }}>
              <Typography variant="body1">上映中の作品がありません</Typography>
            </Box>
          )}
        </ThemeProviderWrapper>
      </main>
    </>
  );
}
