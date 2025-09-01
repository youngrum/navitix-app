import tmdbApi from '@/services/tmdbApi';
import MovieList from '@/components/movies/MovieList'
import { NOW_PLAYING } from '@/types/movies';

async function getMovieData() {
    try {
        const res:NOW_PLAYING[] = await tmdbApi.get("/movie/now-playing");
        return res;
    }catch(error){
        console.log("Failed to fetch", error);
        return [];
    }
}
export default async function Page() {
    const data:NOW_PLAYING[] = await getMovieData();

    return (
    <div>
      <h1>投稿一覧</h1>
      
      {/* データをpropsとして子コンポーネントに渡す */}
      <MovieList movies={data} />
    </div>
  );
}