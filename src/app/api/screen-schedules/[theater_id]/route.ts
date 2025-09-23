import { theaters } from "@/lib/theaterTable";
import { auditoriums, schedules } from "@/lib/screenDB";
import tmdbApi from "@/services/tmdbApi";
import { apiResponse } from "@/types/apiResponse";
import { ResponseMovieDetail } from "@/types/movies";
import { NextRequest } from "next/server";

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

export async function GET(
  req: NextRequest, // 第一引数にrequestオブジェクトおかないとparamsが取れない
  { params }: { params: Promise<{ theater_id: string }> }
) {
  // Next.js 15+ では params が Promise の場合がある
  const { theater_id } = await params;

  if (!params || !theater_id) {
    return new Response(
      JSON.stringify({ error: "theater_id パラメータが見つかりませんでした" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // パスパラメーターを数値に変換
  const theaterId = Number(theater_id);

  // パスパラメーターのtheaterIdから映画館レコードを取得
  const theaterData = theaters.find((theater) => theater.id === theaterId);

  // console.log("theaterData:",theaterData);

  if (!theaterData) {
    return new Response(
      JSON.stringify({ error: "映画館は見つかりませんでした" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 映画館の上映室取得
  const auditoriumData = auditoriums.filter(
    (auditorium) => auditorium.theater_id === theaterId
  );

  if (!auditoriumData || auditoriumData.length === 0) {
    return new Response(
      JSON.stringify({ error: "上映室が見つかりませんでした" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // 各上映室オブジェクトに対して上映作品、スケジュールを追加
  const auditoriumsWithMoviesAndSchedules = await Promise.all(
    auditoriumData.map(async (auditorium) => {
      // 各上映室のスケジュールを取得
      const schedulesForAuditorium = schedules.filter(
        (schedule) => schedule.auditorium_id === auditorium.id
      );

      if (!schedulesForAuditorium) {
        return {
          ...auditorium,
          movie: null,
          schedules: [],
          error: "スケジュールが見つかりませんでした",
        };
      }

      // 各上映室の上映作品を取得 上映室と作品は１対１なので最初の配列から１つ取得
      const movieDetail = await getMovieDetailData(
        schedulesForAuditorium[0].movie_id
      );

      if (!movieDetail) {
        return {
          ...auditorium,
          movie: null,
          schedules: [],
          error: "上映作品が見つかりませんでした",
        };
      }

      // 映画詳細を簡略化
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

      return {
        ...auditorium,
        movie: simplifiedMovieDetail,
        schedules: simplifiedSchedules,
      };
    })
  );

  // console.log("auditoriumsWithMoviesAndSchedules>>>>>>", auditoriumsWithMoviesAndSchedules);

  return new Response(JSON.stringify(auditoriumsWithMoviesAndSchedules), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
