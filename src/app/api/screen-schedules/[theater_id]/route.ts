import { theaters } from "@/lib/theaterTable";
import { auditoriums, schedules } from "@/lib/screenDB";
import tmdbApi from "@/services/tmdbApi";
import { apiResponse } from "@/types/apiResponse";
import { ResponseMovieDetail, ResponseReleaseDates_results } from "@/types/movies";

// 映画の詳細を取得
async function getMovieDetailData(movieId: number) {
  try {
    const res: apiResponse<ResponseMovieDetail> = await tmdbApi.get(
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

  // console.log("theaterData:",theaterData);

  if (!theaterData) {
    return new Response(JSON.stringify({ error: "映画館は見つかりませんでした" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const auditoriumData = auditoriums.find((auditorium) => auditorium.theater_id === theaterId);
  if (!auditoriumData) {
    return new Response(JSON.stringify({ error: "上映室が見つかりませんでした" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const schedulesForAuditorium = schedules.filter(
    (schedule) => schedule.auditorium_id === auditoriumData.id
  );
  if (!schedulesForAuditorium) {
    return new Response(JSON.stringify({ error: "スケジュールが見つかりませんでした" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 各上映室の上映作品を取得 上映室と作品は１対１なので最初の配列から１つ取得
  const movieDetail = await getMovieDetailData(schedulesForAuditorium[0].movie_id);
  console.log("movieDetail>>>>>>>>>>>>>>>>>>>", movieDetail);
  if (!movieDetail) {
    return new Response(JSON.stringify({ error: "スケジュールが見つかりませんでした" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const simplifiedMovieDetail = {
    id: movieDetail.id,
    overview: movieDetail.overview,
    genres: movieDetail.genres,
    release_date: movieDetail.release_date,
    poster_path: movieDetail.poster_path,
    runtime: movieDetail.runtime,
  };

  // スケジュール情報を簡略化
  const simplifiedSchedules = schedulesForAuditorium.map((schedule) => ({
    id: schedule.id,  
    movie_id: schedule.movie_id,
    auditorium_id: schedule.auditorium_id,
    start_time: schedule.start_time,
    end_time: schedule.end_time,
  }));

  const responseData = {
    ...auditoriumData,
    movie: simplifiedMovieDetail,
    schedules: simplifiedSchedules,
  };

  console.log("responseData>>>>>>",responseData);

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}