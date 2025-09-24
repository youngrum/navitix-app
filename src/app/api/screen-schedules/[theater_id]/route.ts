import { theaters } from "@/lib/theaterTable";
import { auditoriums, schedules } from "@/lib/screenDB";
import tmdbApi from "@/services/tmdbApi";
import { apiResponse } from "@/types/apiResponse";
import { ResponseMovieDetail } from "@/types/movies";
import { NextRequest, NextResponse } from "next/server";

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
      const formattedGenres: string = movieDetail.genres?.map(genre => genre.name).join(', ') ?? '-';

      // 映画詳細を簡略化
      const simplifiedMovieDetail = {
        id: movieDetail.id,
        genres: formattedGenres,
        overview: movieDetail.overview as string | number,
        poster_path: movieDetail.poster_path as string,
        release_date: movieDetail.release_date,
        revenue:movieDetail.revenue,
        runtime: movieDetail.runtime as string | number,
        title: movieDetail.title,
        vote_average: movieDetail.vote_average,
        vote_count: movieDetail.vote_count,
        certification: movieDetail.certification,
      };

      // スケジュール情報を簡略化
      const simplifiedSchedules = schedulesForAuditorium.map(schedule => {
        // start_timeをDateオブジェクトに変換
        const startDate = new Date(schedule.start_time);

        // 日付、曜日、開始時刻を抽出
        const date = startDate.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const week = startDate.toLocaleDateString('ja-JP', { weekday: 'short' });
        const play_beginning = startDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

        return {
            ...schedule,
            date: date,
            week: week,
            play_beginning: play_beginning
        };
      });

      return {
        ...auditorium,
        movie: simplifiedMovieDetail,
        schedules: simplifiedSchedules,
      };
    })
  );

  // console.log("auditoriumsWithMoviesAndSchedules>>>>>>", auditoriumsWithMoviesAndSchedules);

  return new NextResponse(JSON.stringify(auditoriumsWithMoviesAndSchedules), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
