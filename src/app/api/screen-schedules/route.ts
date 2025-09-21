import { theaters } from "@/lib/theaterTable";
import { auditoriums, schedules } from "@/lib/screenDB";
import tmdbApi from "@/services/tmdbApi";
import { apiResponse } from "@/types/apiResponse";
import { ResponseMovieDetail } from "@/types/movies";

// 映画の詳細を取得
async function getMovieDetailData(movieId: string) {
  try {
    const res: apiResponse<ResponseMovieDetail> = await tmdbApi.get(
      `/movie/${movieId}`
    );
    const detail = res.data;
    // console.log(detail);
    return detail;
  } catch (error) {
    console.log("Failed to fetch", error);
    return null;
  }
}

export async function GET() {
  const screenData = theaters.map((theater) => {
    // theater.idと一致したauditoriumテーブルカラム
    const auditorium = auditoriums.filter((auditorium) => {
      console.log("auditorium:", auditorium);
      auditorium.theater_id === theater.id;
      const schedule = schedules.filter((schedule) => {
        schedule.auditorium_id === auditorium.id;
        console.log("schedule:", schedule);
      });
    });
    // auditorium.idと一致したschedulesテーブルカラム

    // データの結合
    return {
      id: theater.id,
      auditorium: auditorium || "",
      // schedule: schedule || "",
    };
  });

  return Response.json(screenData);
}
