import { theaters } from "@/lib/theaterTable";
import { auditoriums, schedules } from "@/lib/screenDB";
import tmdbApi from "@/services/tmdbApi";
import { apiResponse } from "@/types/apiResponse";
import { ResponseMovieDetail } from "@/types/movies";
import { SchedulesForAuditorium } from "@/types/screen";

// 映画の詳細を取得する関数を修正
async function getMovieDetailData(movieId: number) {
  try {
    const res: apiResponse<ResponseMovieDetail[]> = await tmdbApi.get(
      `/movie/${movieId}`
    );
    const detail = res.data;
    // console.log("Fetched movie detail:", detail);
    return detail;
  } catch (error) {
    console.log("Failed to fetch movie detail", error);
    return null;
  }
}

export async function GET(req: Request, { params }: { params: { theater_id: string } }) {
  const { theater_id } = await params;
  // パスパラメーターを数値に変換
  const theaterId = Number(theater_id);

  // パスパラメーターのtheaterIdから映画館レコードを取得
  const theaterData = theaters.find((theater) => theater.id === theaterId);

  console.log("theaterData:",theaterData);

  if (!theaterData) {
    return new Response(JSON.stringify({ error: "映画館は見つかりませんでした" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 映画館に紐づく上映室レコードを取得
  const auditoriumData = auditoriums.filter((auditorium) => auditorium.theater_id === theaterId);
  console.log("auditoriumData>>>>>>>>>>>>>>>>>>>>>",auditoriumData);

  const screensWithSchedules = await Promise.all(
    auditoriumData.map(async (auditorium) => {
      const schedulesForEachAuditorium = schedules.filter(
        (schedule) => schedule.auditorium_id === auditorium.id
      );

      console.log("schedulesForAuditorium>>>>>>>>>>>>>>>>",schedulesForEachAuditorium);
      // 各スケジュールに映画詳細情報を追加
      const schedulesWithMovieData = await Promise.all(
        schedulesForEachAuditorium.map(async (schedule) => {
          console.log("schedule>>>>>>>>>>>>>>>>>>>>>>>>>>>",schedule);
          const movieDetail = await getMovieDetailData(schedule.movie_id);
          return {
            ...schedule,
            movie: movieDetail,
          };
        })
      );

      return {
        ...auditorium,
        schedules: schedulesWithMovieData,
      };
    })
  ) ;
  // データを統合してレスポンスとして返す
  const responseData = {
    ...theaterData,
    auditoriums: screensWithSchedules,
  };

  console.log("responseData>>>>>>>>>>>>>>>>>>>>>>>>>>",responseData);
  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}