// app/movies/[movie_id]/page.tsx
import tmdbApi from "@/services/tmdbApi";
import {
  apiResponse,
  apiResponseMovies_results,
  ResponseCredits_casts,
  ResponseReleaseDates_results,
} from "@/types/apiResponse";
import { ResponseMovieDetail, ResponseMovieVideos } from "@/types/movies";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import DetailInfo from "../../../components/movies/detail/DetailInfo";
import Header1 from "@/components/common/header1";
import VideoContainer from "@/components/movies/detail/VideoContainer";
import CastList from "@/components/movies/detail/CastList";
import Header2 from "../../../components/common/header2";
import RatingStar from "@/components/movies/detail/RatingStar";
import { Stack } from "@mui/material";
import BackButton from "@/components/common/BackButton";
import SubmitButton from "@/components/common/SubmitButton";

// propsの型定義
interface MovieIdProps {
  params: Promise<{
    movie_id: string; // URLから渡される映画のID
  }>;
}

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

// 映画の詳細を取得
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
    return null;
  }
}
// 映画の動画情報を取得
async function getMovieVideoData(movieId: string) {
  try {
    const res: apiResponse<apiResponseMovies_results<ResponseMovieVideos[]>> =
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
async function getMovieCasts(movie_id: string) {
  try {
    const res: apiResponse<ResponseCredits_casts> = await tmdbApi.get(
      `/movie/${movie_id}/credits`
    );
    const castsData = res.data.cast;
    console.log(castsData);
    return castsData;
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
  const detail = await getMovieDetailData(movie_id);
  const release = await getMovieReleaseData(movie_id);
  const videos = await getMovieVideoData(movie_id);
  const casts = await getMovieCasts(movie_id);

  // 日本でのリリース情報を取得
  const releaseInfo =
    release?.find((result) => result.iso_3166_1 === "JP") || null;

  function getLatestOfficialTrailerKey(videoList: ResponseMovieVideos[]) {
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
  }

  // 最新の公式予告編のキーを取得
  let trailerKey = null;
  if (videos && videos.length > 0) {
    trailerKey = getLatestOfficialTrailerKey(videos);
  }

  return (
    <main>
      <ThemeProviderWrapper>
        <Stack direction="row" alignItems="center" spacing={2}>
          <BackButton returnPath="/movies" />
          <Header1 headerText="detail" />
        </Stack>
        <DetailInfo
          MovieDetailProps={detail}
          ReleaseInfoProps={releaseInfo}
          videosProps={videos}
        />
        <Header2 headerText="トレーラー" />
        <VideoContainer trailerKeyProps={trailerKey} />
        <Header2 headerText="キャスト" />
        <CastList castsProps={casts} />
        <Header2 headerText="評価" />
        <RatingStar MovieDetailProps={detail} />
        <SubmitButton isLoading={false} buttonText="予約する" />
      </ThemeProviderWrapper>
    </main>
  );
}
