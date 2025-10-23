import searchTheaterLocalApi from "@/services/searchTheaterLocalApi";
import tmdbApi from "@/services/tmdbApi";
import { apiResponse } from "@/types/apiResponse";
import {
  _ResponseMovieDetail,
  ResponseCredits_casts,
  ResponseMovieDetail,
  ResponseMovies,
  ResponseMovies_results,
  ResponseMovieVideos,
  ResponseReleaseDates_release_dates,
  ResponseReleaseDates_results,
} from "@/types/movies";

// 映画の詳細を取得
export async function getMovieDetailData(movie_id: number) {
  try {
    const res: apiResponse<ResponseMovieDetail> = await tmdbApi.get(
      `/movie/${movie_id}`
    );
    const detail = res.data;
    // console.log("Fetched movie detail:", detail);
    return detail;
  } catch (error) {
    console.log("Failed to fetch movie detail", error);
    return null;
  }
}

// DetailInfoコンポーネント用映画情報詳細レスポンスAPI
export async function newGetMovileDetail(movie_id: string) {
  try {
    const res: apiResponse<_ResponseMovieDetail> =
      await searchTheaterLocalApi.get(`/movie/get-detail/${movie_id}/`);
    // console.log("/movie/get-detail/${movie_id}/>>>>>>>>",res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch", error);
    return null;
  }
}

// 映画作品のリリース情報を取得
export async function getMovieReleaseData(movieId: number) {
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
export const getCertification = (
  release: ResponseReleaseDates_release_dates[] | null
) => {
  const releaseInfo =
    release?.find((result) => result.iso_3166_1 === "JP") || null;
  const release_dates = releaseInfo?.release_dates ?? null;
  // find()メソッドを使用して、空文字列ではないcertificationを持つ要素を探す
  const certifiedItem = release_dates?.find(
    (item) => item.certification !== ""
  );
  console.log("certifiedItem>>>>>>>>>", certifiedItem);

  // 条件に合う要素が見つかればそのcertificationを、なければ'-'を返す
  return certifiedItem ? certifiedItem.certification : "-";
};

/**
 * 映画の詳細データを整形する関数
 * @param detail TMDB APIからの映画詳細データ
 * @param release TMDB APIからのリリース日データ
 * @returns 整形された映画詳細オブジェクト
 */
export const formatMovieDetail = (
  detail: ResponseMovieDetail,
  release: ResponseReleaseDates_release_dates[]
): _ResponseMovieDetail => {
  const formattedGenres: string =
    detail.genres?.map((genre) => genre.name).join(", ") ?? "-";
  const formattedOverview =
    detail.overview || "解説・あらすじを取得できませんでした";
  const formattedPosterPath = detail.poster_path || "";
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

export const getLatestOfficialTrailerKey = (
  videoList: ResponseMovieVideos[]
) => {
  if (!videoList || videoList.length === 0) {
    return null; // データが存在しない場合はnullを返す
  }

  // 条件に合う動画をフィルタリング
  const filtered_videos = videoList.filter(
    (video) =>
      (video.type === "Trailer" || video.type === "Teaser") &&
      video.site === "YouTube"
  );

  // フィルタリングされた動画が存在しない場合はnullを返す
  if (filtered_videos.length === 0) {
    return null;
  }

  // published_atが最新のものを見つけるためにソート
  filtered_videos.sort((a, b) => {
    // 日付文字列を比較して新しい順に並べる
    return (
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  });

  // ソート後の配列の最初の要素（最も新しいもの）のキーを返す
  return filtered_videos[0].key;
};

// 映画の動画情報を取得
export async function getMovieVideoData(movieId: string) {
  try {
    const res: apiResponse<ResponseMovies_results<ResponseMovieVideos[]>> =
      await tmdbApi.get(`/movie/${movieId}/videos`);
    const videoData = res.data.results;
    // console.log(videoData);
    return videoData;
  } catch (error) {
    console.log("Failed to fetch", error);
    return null;
  }
}
// 映画のキャスト情報を取得
export async function getMovieCasts(movie_id: string) {
  try {
    const res: apiResponse<ResponseCredits_casts> = await tmdbApi.get(
      `/movie/${movie_id}/credits`
    );
    const castsData = res.data.cast;
    // console.log("castsData>>>>>>>>",castsData);
    return castsData;
  } catch (error) {
    console.log("Failed to fetch", error);
    return [];
  }
}

// 現在上映中の映画データを取得
export async function getNowPlayingMovieData() {
  try {
    const res: apiResponse<ResponseMovies_results<ResponseMovies[]>> =
      await tmdbApi.get("/movie/now_playing");
    // console.log("/movie/now_playing>>>>>>",res.data.results);
    return res.data.results;
  } catch (error) {
    console.log("Failed to fetch", error);
    return [];
  }
}

// 公開予定の映画データを取得
export async function getUpcomingMovieData() {
  try {
    const res: apiResponse<ResponseMovies_results<ResponseMovies[]>> =
      await tmdbApi.get("/movie/upcoming");
    // console.log("/movie/upcoming>>>>>>",res.data.results);
    return res.data.results;
  } catch (error) {
    console.log("Failed to fetch", error);
    return [];
  }
}

// 公開予定の映画データを取得
export async function getTop5MovieData() {
  try {
    const response = await tmdbApi.get("/movie/now_playing");
    const allMovies = response.data.results;

    // 1. vote_averageが高い順にソート
    allMovies.sort(
      (a: { vote_average: number }, b: { vote_average: number }) =>
        b.vote_average - a.vote_average
    );

    // 2. 上位5件を抽出
    const top5Movies = allMovies.slice(0, 5);

    return top5Movies;
  } catch (error) {
    console.error("Failed to fetch and sort movies:", error);
    return []; // エラー時は空の配列を返す
  }
}
