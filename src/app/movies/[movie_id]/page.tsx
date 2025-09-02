// app/movies/[movie_id]/page.tsx
import tmdbApi from "@/services/tmdbApi";
import { apiResponse } from "@/types/apiResponse";
import { ResponseMovieDetail } from "@/types/movies";

// propsの型定義
interface MovieIdProps {
  params: {
    movie_id: string; // URLから渡される映画のID
  };
}

// 映画の詳細を取得
async function getMovieDtailData(movieId: string){
  try {
    const res: apiResponse<ResponseMovieDetail> = await tmdbApi.get(`/movie/${movieId}`);
    const detail = res.data;
    console.log(detail);
    return detail;
  } catch (error) {
    console.log("Failed to fetch", error);
    return null;
  }
}

// SSRコンポーネントだからasync/await
export default async function MovieDetailsPage({ params }: MovieIdProps) {
  // paramsから動的なIDを取得
  const {movie_id} = await params;

  // APIにリクエストを送信
  const detail = await getMovieDtailData(movie_id);

  return (
    <main>
      <h1>{detail?.title ?? "タイトル不明"}</h1>
      <p>{detail?.overview ?? "概要情報がありません。"}</p>
    </main>
  );
}
