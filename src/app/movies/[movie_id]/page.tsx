// app/movies/[movie_id]/page.tsx
import Header2 from "@/components/common/header2";
import tmdbApi from "@/services/tmdbApi";
import {
  apiResponse,
  apiResponseMovies_results,
  ResponseReleaseDates_results,
} from "@/types/apiResponse";
import { ResponseMovieDetail, ResponseMovieVideos } from "@/types/movies";
import { Box, Container } from "@mui/material";
import MovieList from "../../../components/movies/MovieList";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import DetailInfo from "../../../components/movies/detail/DetailInfo";

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
    const res: apiResponse<ResponseReleaseDates_results> = await tmdbApi.get(
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
// 映画の動画情報を取得
async function getMovieVideoData(movieId: string) {
  try {
    const res: apiResponse<apiResponseMovies_results<ResponseMovieVideos[]>> =
      await tmdbApi.get(`/movie/${movieId}/videos`);
    const videoData = res.data.results;
    console.log(videoData);
    return videoData;
  } catch (error) {
    console.log("Failed to fetch", error);
    return null;
  }
}

function getLatestOfficialTrailerKey(movies: ResponseMovieVideos[]) {
  if (!movies || movies.length === 0) {
    return null; // データが存在しない場合はnullを返す
  }

  // 条件に合う動画をフィルタリング
  const trailers = movies.filter(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  // フィルタリングされた動画が存在しない場合はnullを返す
  if (trailers.length === 0) {
    return null;
  }

  // published_atが最新のものを見つけるためにソート
  trailers.sort((a, b) => {
    // 日付文字列を比較して新しい順に並べる
    return (
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  });

  // ソート後の配列の最初の要素（最も新しいもの）のキーを返す
  return trailers[0].key;
}

// SSRコンポーネントだからasync/await
export default async function MovieDetailsPage({ params }: MovieIdProps) {
  // paramsから動的なIDを取得
  const { movie_id } = await params;

  // APIにリクエストを送信
  const detail = await getMovieDtailData(movie_id);
  const release = await getMovieReleaseData(movie_id);
  const videos = await getMovieVideoData(movie_id);

  // 日本の年齢制限を取得
  const releaseInfo = release?.find((result) => result.iso_3166_1 === "JP");
  const release_date = releaseInfo?.release_dates[0]?.release_date;
  const certification =
    releaseInfo?.release_dates[0]?.certification === ""
      ? "全年齢対象"
      : releaseInfo?.release_dates[0]?.certification;

  // 最新の公式予告編のキーを取得
  let trailerKey = null;
  if (videos) {
    trailerKey = getLatestOfficialTrailerKey(videos);
  }

  return (
    <main>
      <Container sx={{ p: 1 }}>
        <ThemeProviderWrapper>
          <DetailInfo MovieDetail={detail} />
          <Header2 headerText="詳細情報" />
          <p>
            公開日:{" "}
            {release_date
              ? new Date(release_date).toLocaleDateString()
              : "不明"}
          </p>
          <p>年齢制限: {certification ?? "-"}</p>
          <Box sx={{ mt: 4, maxWidth: "500px" }}>
            {trailerKey && (
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Latest Official Trailer"
                allowFullScreen
                width="100%"
              ></iframe>
            )}
          </Box>
        </ThemeProviderWrapper>
      </Container>
    </main>
  );
}
