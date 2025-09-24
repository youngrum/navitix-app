import { theaters } from "@/lib/theaterTable";
import { auditoriums, schedules } from "@/lib/screenDB";
import tmdbApi from "@/services/tmdbApi";
import { apiResponse } from "@/types/apiResponse";
import {
  _ResponseMovieDetail,
  ResponseMovieDetail,
  ResponseReleaseDates_release_dates,
  ResponseReleaseDates_results,
} from "@/types/movies";
import { NextRequest, NextResponse } from "next/server";
import { release } from "os";

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

// 映画作品のリリース情報を取得
async function getMovieReleaseData(movieId: number) {
  try {
    const res: apiResponse<ResponseReleaseDates_results> = await tmdbApi.get(
      `/movie/${movieId}/release_dates`
    );
    const releaseData = res.data.results;
    // console.log(releaseData);
    return releaseData;
  } catch (error) {
    console.log("Failed to fetch", error);
    return [];
  }
}

// release_datesからcertificationの値を取得する関数 release_datesに複数要素あるので全部回してcertificationを取得
const getCertification = (
  release: ResponseReleaseDates_release_dates[] | null
) => {
  const releaseInfo =
    release?.find((result) => result.iso_3166_1 === "JP") || null;
  const release_dates = releaseInfo?.release_dates ?? null;
  // find()メソッドを使用して、空文字列ではないcertificationを持つ要素を探す
  const certifiedItem = release_dates?.find(
    (item) => item.certification !== ""
  );
  console.log(certifiedItem);

  // 条件に合う要素が見つかればそのcertificationを、なければ'-'を返す
  return certifiedItem ? certifiedItem.certification : "-";
};

/**
 * 映画の詳細データを整形する関数
 * @param detail TMDB APIからの映画詳細データ
 * @param release TMDB APIからのリリース日データ
 * @returns 整形された映画詳細オブジェクト
 */
const formatMovieDetail = (
  detail: ResponseMovieDetail,
  release: ResponseReleaseDates_release_dates[]
): _ResponseMovieDetail => {
  const formattedGenres: string =
    detail.genres?.map((genre) => genre.name).join(", ") ?? "-";
  const formattedOverview =
    detail.overview || "解説・あらすじを取得できませんでした";
  const formattedPosterPath =
    detail.poster_path || "https://example.com/default-poster.jpg";
  const formattedReleaseDate = detail.release_date || "不明";
  const formattedRevenue = detail.revenue || "不明";
  const formattedRuntime = detail.runtime || 0;
  const formattedTitle = detail.title || "タイトル不明";
  const formattedVoteAverage = detail.vote_average || 0;
  const formattedVoteCount = detail.vote_count || 0;
  const certificationValue = getCertification(release);

  return {
    id: detail.id,
    genres: formattedGenres,
    overview: formattedOverview,
    poster_path: formattedPosterPath,
    release_date: formattedReleaseDate,
    revenue: formattedRevenue,
    runtime: formattedRuntime,
    title: formattedTitle,
    vote_average: formattedVoteAverage,
    vote_count: formattedVoteCount,
    certification: certificationValue,
  };
};

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

      // 映画作品のリリース情報を取得
      const release = await getMovieReleaseData(
        schedulesForAuditorium[0].movie_id
      );

      // 映画詳細を簡略化
      const simplifiedMovieDetail = formatMovieDetail(movieDetail, release);

      // スケジュール情報を簡略化
      const simplifiedSchedules = schedulesForAuditorium.map((schedule) => {
        // start_timeをDateオブジェクトに変換
        const startDate = new Date(schedule.start_time);

        // 日付、曜日、開始時刻を抽出
        const date = startDate.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const week = startDate.toLocaleDateString("ja-JP", {
          weekday: "short",
        });
        const play_beginning = startDate.toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return {
          ...schedule,
          date: date,
          week: week,
          play_beginning: play_beginning,
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
