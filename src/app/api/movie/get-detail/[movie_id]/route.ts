import tmdbApi from "@/services/tmdbApi";
import { apiResponse } from "@/types/apiResponse";
import { _ResponseMovieDetail, ResponseMovieDetail, ResponseMovieReleaseDates, ResponseReleaseDates_release_dates, ResponseReleaseDates_results } from "@/types/movies";
import { NextRequest, NextResponse } from "next/server";

// 映画作品の詳細を取得
async function getMovieDetailData(movieId: string): Promise<ResponseMovieDetail | null> {
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

// 映画作品のリリース情報を取得
async function getMovieReleaseData(movieId: string) {
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
const getCertification = (release: ResponseReleaseDates_release_dates[] | null) => {
    const releaseInfo = release?.find((result) => result.iso_3166_1 === "JP") || null;
    const release_dates = releaseInfo?.release_dates ?? null;
    // find()メソッドを使用して、空文字列ではないcertificationを持つ要素を探す
    const certifiedItem = release_dates?.find(item => item.certification !== '');
    console.log(certifiedItem);

    // 条件に合う要素が見つかればそのcertificationを、なければ'-'を返す
    return certifiedItem ? certifiedItem.certification : '-';
};

/**
 * 映画の詳細データを整形する関数
 * @param detail TMDB APIからの映画詳細データ
 * @param release TMDB APIからのリリース日データ
 * @returns 整形された映画詳細オブジェクト
 */
const formatMovieDetail = (detail: ResponseMovieDetail, release: ResponseReleaseDates_release_dates[]): _ResponseMovieDetail => {

  const formattedGenres: string = detail.genres?.map(genre => genre.name).join(', ') ?? '-';
  const formattedOverview = detail.overview || "解説・あらすじを取得できませんでした";
  const formattedPosterPath = detail.poster_path || "https://example.com/default-poster.jpg";
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
  { params }: { params: Promise<{ movie_id: string }> }
) {
    const { movie_id } = await params;

    if (!params || !movie_id) {
      return NextResponse.json(
        { error: "映画情報が見つかりませんでした" },
        { status: 400 }
      );
    }
  
    // TMDBにリクエストを送信
    const detail = await getMovieDetailData(movie_id);
        if ( !detail ) {
      return NextResponse.json(
        { error: "映画情報が見つかりませんでした" },
        { status: 400 }
      );
    }
    const release = await getMovieReleaseData(movie_id);

    // オブジェクトの各プロパティを整形
    const simplifiedMovieDetail = formatMovieDetail( detail, release );

    return NextResponse.json(simplifiedMovieDetail, { status: 200 });
}