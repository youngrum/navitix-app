// app/movies/[movie_id]/page.tsx
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import Header1 from "@/components/common/Header1";
import VideoContainer from "@/components/movies/detail/VideoContainer";
import CastList from "@/components/movies/detail/CastList";
import Header2 from "@/components/common/Header2";
import RatingStar from "@/components/movies/detail/RatingStar";
import { Stack } from "@mui/material";
import BackButton from "@/components/common/BackButton";
import _DetailInfo from "@/components/movies/detail/_DetailInfo";
import LinkButton from "@/components/common/LinkButton";
import {
  getMovieDetailData,
  getMovieVideoData,
  getMovieCasts,
  newGetMovileDetail,
  getLatestOfficialTrailerKey,
} from "@/lib/movieDetailUtils";

// propsの型定義
interface MovieIdProps {
  params: Promise<{
    movie_id: string; // URLから渡される映画のID
  }>;
}

// SSRコンポーネントだからasync/await
export default async function MovieDetailsPage({ params }: MovieIdProps) {
  // paramsから動的なIDを取得
  const { movie_id } = await params;
  const movieId = Number(movie_id);

  // APIにリクエストを送信
  const detail = await getMovieDetailData(movieId);
  const videos = await getMovieVideoData(movie_id);
  const casts = await getMovieCasts(movie_id);
  const newDetail = await newGetMovileDetail(movie_id);
  const header1Text = "映画詳細";

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
          <Header1 headerText={header1Text} />
        </Stack>
        <_DetailInfo MovieDetailProps={newDetail} />
        <Header2 headerText="トレーラー" />
        <VideoContainer trailerKeyProps={trailerKey} />
        <Header2 headerText="キャスト" />
        <CastList castsProps={casts} />
        <Header2 headerText="評価" />
        <RatingStar MovieDetailProps={detail} />
        <LinkButton
          buttonTextProps="予約する"
          toProps={`/theater?movie_id=${movie_id}`}
        />
      </ThemeProviderWrapper>
    </main>
  );
}
