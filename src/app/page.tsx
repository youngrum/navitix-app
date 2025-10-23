import MovieList from "@/components/movies/MovieList";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import Header1 from "@/components/common/Header1";
import Header2 from "@/components/common/Header2";
import CarouselMovieList from "@/components/movies/CarouselMovieList";
import {
  getNowPlayingMovieData,
  getUpcomingMovieData,
  getTop5MovieData,
} from "@/lib/movieDetailUtils";
import FadeInWrapper from "@/components/FadeInWrapper";

export default async function Page() {
  const [nowPlaying, upcoming, top5] = await Promise.all([
    getNowPlayingMovieData(),
    getUpcomingMovieData(),
    getTop5MovieData(),
  ]);
  const header1Text = "映画作品";
  const header2TextNowPlaying = "上映中";
  const header2TextUpcoming = "公開予定";

  return (
    <main>
      <ThemeProviderWrapper>
        <Header1 headerText={header1Text} />
        <FadeInWrapper duration={800} delay={200}>
          <CarouselMovieList movies={top5} />
          <Header2 headerText={header2TextNowPlaying} />
          {/* データをpropsとして子コンポーネントに渡す */}
          <MovieList movies={nowPlaying} />
          <Header2 headerText={header2TextUpcoming} />
          <MovieList movies={upcoming} />
        </FadeInWrapper>
      </ThemeProviderWrapper>
    </main>
  );
}
