// src/swrtest/page.tsx
import { createTMDBInstance } from "@/services/tmdbApi";
import MovieList from "@/components/MovieList";
import { SWRConfig } from "swr";

interface MovieData {
  results: any[];
}

export default async function Page() {
  const url = "/movie/now_playing";
  let initialData: MovieData | null = null;

  // サーバーサイドでトークンを取得
  const tmdbToken = process.env.TMDB_ACCESS_TOKEN;
  if (!tmdbToken) {
    console.error("TMDB_ACCESS_TOKEN is not defined.");
    return <div>Error: API token is missing.</div>;
  }

  // トークンを使って新しいインスタンスを生成
  const fetchTMDB = createTMDBInstance(tmdbToken);

  try {
    const res = await fetchTMDB.get(url);
    initialData = res.data;
  } catch (error) {
    console.error("Failed to fetch initial data:", error);
  }

  const fallback = initialData ? { [url]: initialData } : {};

  return (
    <SWRConfig value={{ fallback }}>
      <MovieList />
    </SWRConfig>
  );
}
