import tmdbApi from "@/services/tmdbApi";
import MovieList from "@/components/movies/MovieList";
import { NOW_PLAYING } from "@/types/movies";
import { apiResponse } from "@/types/apiResponse";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import Header1 from "@/components/common/header1";
import { Box } from "@mui/material";

async function getMovieData() {
  try {
    const res: apiResponse = await tmdbApi.get("/movie/now_playing");
    console.log(res.data.results);
    return res.data.results;
  } catch (error) {
    console.log("Failed to fetch", error);
    return [];
  }
}
export default async function Page() {
  const results: NOW_PLAYING[] = await getMovieData();
  const headerText = "movies";

  return (
    <main>
      <Box sx={{ p: 1 }}>
        <ThemeProviderWrapper>
          <Header1 headerText={headerText} />
          {/* データをpropsとして子コンポーネントに渡す */}
          <MovieList movies={results} />
        </ThemeProviderWrapper>
      </Box>
    </main>
  );
}
