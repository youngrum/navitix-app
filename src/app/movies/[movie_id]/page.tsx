// app/movies/[movie_id]/page.tsx
import tmdbApi from "@/services/tmdbApi";
import { apiResponse, apiResponseData_Movies } from "@/types/apiResponse";
import {
  ReleaseDatesResponse,
  ResponseMovieDetail,
  ResponseMovieReleaseDates,
  ResponseMovies,
} from "@/types/movies";

// propsの型定義
interface MovieIdProps {
  params: {
    movie_id: string; // URLから渡される映画のID
  };
}

// 映画の詳細を取得
async function getMovieDtailData(movieId: string) {
  try {
    const res: apiResponse<ResponseMovieDetail> = await tmdbApi.get(
      `/movie/${movieId}`
    );
    const detail = res.data;
    console.log(detail);
    return detail;
  } catch (error) {
    console.log("Failed to fetch", error);
    return null;
  }
}

// 映画の詳細を取得
async function getMovieReleaseData(movieId: string) {
  try {
    const res: apiResponse<ReleaseDatesResponse> = await tmdbApi.get(
      `/movie/${movieId}/release_dates`
    );
    const releaseData = res.data.results;
    console.log(releaseData);
    return releaseData;
  } catch (error) {
    console.log("Failed to fetch", error);
    return null;
  }
}

// SSRコンポーネントだからasync/await
export default async function MovieDetailsPage({ params }: MovieIdProps) {
  // paramsから動的なIDを取得
  const { movie_id } = await params;

  // APIにリクエストを送信
  const detail = await getMovieDtailData(movie_id);
  const release = await getMovieReleaseData(movie_id);

  // 日本の年齢制限を取得
  const releaseInfo = release?.find((result) => result.iso_3166_1 === "JP");
  const release_date = releaseInfo?.release_dates[0]?.release_date;
  const certification = releaseInfo?.release_dates[0]?.certification;

  return (
    <main>
      <h1>{detail?.title ?? "タイトル不明"}</h1>
      <p>{detail?.overview ?? "概要情報がありません。"}</p>
      <p>
        公開日:{" "}
        {release_date ? new Date(release_date).toLocaleDateString() : "不明"}
      </p>
      <p>年齢制限: {certification ?? "不明"}</p>
    </main>
  );
}
