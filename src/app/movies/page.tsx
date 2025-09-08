import tmdbApi from "@/services/tmdbApi";
import MovieList from "@/components/movies/MovieList";
import { apiResponse,  } from "@/types/apiResponse";
import { ResponseMovies,ResponseMovies_results } from "@/types/movies";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import Header1 from "@/components/common/header1";
import Header2 from "@/components/common/header2";
import CarouselMovieList from "@/components/movies/CarouselMovieList";

// 現在上映中の映画データを取得
async function getNowPlayingMovieData() {
  try {
    const res: apiResponse<ResponseMovies_results<ResponseMovies[]>> =
      await tmdbApi.get("/movie/now_playing");
    console.log(res.data.results);
    return res.data.results;
  } catch (error) {
    console.log("Failed to fetch", error);
    return [];
  }
}

// 公開予定の映画データを取得
async function getUpcomingMovieData() {
  try {
    const res: apiResponse<ResponseMovies_results<ResponseMovies[]>> =
      await tmdbApi.get("/movie/upcoming");
    console.log(res.data.results);
    return res.data.results;
  } catch (error) {
    console.log("Failed to fetch", error);
    return [];
  }
}

// 公開予定の映画データを取得
async function getTop5MovieData() {
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

export default async function Page() {
  const [nowPlaying, upcoming, top5] = await Promise.all([
    getNowPlayingMovieData(),
    getUpcomingMovieData(),
    getTop5MovieData(),
  ]);
  const header1Text = "movies";
  const header2TextNowPlaying = "上映中";
  const header2TextUpcoming = "公開予定";

  return (
    <main style={{ padding: "10px" }}>
        <ThemeProviderWrapper>
          {/* ThemeProviderでテーマを適用 */}
          {/* ヘッダーコンポーネントを使用 */}
          <Header1 headerText={header1Text} />
          <CarouselMovieList movies={top5} />
          <Header2 headerText={header2TextNowPlaying} />
          {/* データをpropsとして子コンポーネントに渡す */}
          <MovieList movies={nowPlaying} />
          <Header2 headerText={header2TextUpcoming} />
          <MovieList movies={upcoming} />
        </ThemeProviderWrapper>
    </main>
  );
}
