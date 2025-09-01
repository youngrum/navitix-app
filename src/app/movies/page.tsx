import tmdbApi from '@/services/tmdbApi';
import MovieList from '@/components/movies/MovieList'
import { NOW_PLAYING } from '@/types/movies';
import { apiResponse } from '@/types/apiResponse';

async function getMovieData() {
    try {
        const res:apiResponse = await tmdbApi.get("/movie/now_playing");
        console.log(res.data.results);
        return res.data.results;
    }catch(error){
        console.log("Failed to fetch", error);
        return [];
    }
}
export default async function Page() {
    const results:NOW_PLAYING[] = await getMovieData();

    return (
    <div>
      <h1>投稿一覧</h1>
      
      {/* データをpropsとして子コンポーネントに渡す */}
      <MovieList movies={results} />
    </div>
  );
}