// app/movies/[movie_id]/page.tsx
import tmdbApi from "@/services/tmdbApi";
import { apiResponse } from "@/types/apiResponse";
import { ResponseMovieDetail } from "@/types/movies";

// propsの型定義
interface MoviePageProps {
  params: {
    movie_id: number; // URLから渡される映画のID
  };
}

// 公開予定の映画データを取得
async function getUpcomingMovieData(movieId: number) {
  try {
    const res: apiResponse = await tmdbApi.get(`/movie/${movieId}`);
    console.log(res.data.results);
    return res.data.results;
  } catch (error) {
    console.log("Failed to fetch", error);
    return [];
  }
}

// SSRコンポーネントだからasync/await
export default async function MovieDetailsPage({ params }: MoviePageProps) {
  // paramsから動的なIDを取得
  const movieId = params.movie_id;

  // APIにリクエストを送信
  const response = await tmdbApi.get<apiResponse>(`/movie/${movieId}`);
  const movie = response.data.result;
  console.log(movie);

  return (
    <div>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
    </div>
  );
}
