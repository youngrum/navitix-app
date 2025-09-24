import searchTheaterLocalApi from "@/services/searchTheaterLocalApi";
import { apiResponse } from "@/types/apiResponse";
import { ScreenResponse } from "@/types/screen";
import _DetailInfo from '@/components/movies/detail/_DetailInfo';
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import { Stack } from "@mui/material";
import BackButton from "@/components/common/BackButton";
import Header1 from "@/components/common/Header1";

async function getScreenData(theater_id: string): Promise<ScreenResponse[]> {
  try {
    const res: apiResponse<ScreenResponse[]> = await searchTheaterLocalApi.get(
      `/screen-schedules/${theater_id}/`
    );
    console.log('%o',res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch", error);
    return [];
  }
}

export default async function page({
  params,
}: { params: Promise<{ theater_id: string }> }) {
  const { theater_id } = await params;
  const screenData = await getScreenData(theater_id);
  const header1Text = "上映中作品"
  
  return(
    <>
      <main>
        <ThemeProviderWrapper>
          <Stack direction="row" alignItems="center" spacing={2}>
            <BackButton returnPath="/theater" />
            <Header1 headerText={header1Text} />
          </Stack>
          {screenData && (screenData).map(
            (screen) => (
              <_DetailInfo key={screen.id} MovieDetailProps={screen.movie} />
            )
          )}
        </ThemeProviderWrapper>
      </main>
    </> 
  );
}
