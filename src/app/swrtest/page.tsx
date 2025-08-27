// src/app/page.tsx
import fetchTMDB from "@/services/tmdbApi";
import MovieList from "@/components/MovieList";
import { SWRConfig } from "swr";

// APIから取得するデータの型を定義
interface MovieData {
  results: any[];
}

// サーバーコンポーネントは async にできる
export default async function Page() {
  const url = "/movie/now_playing";
  let initialData: MovieData | null = null;
  
  try {
    // サーバー上で直接 await を使ってAPIを呼び出す
    const res = await fetchTMDB.get(url);
    initialData = res.data;
  } catch (error) {
    console.error("Failed to fetch initial data:", error);
  }

  // サーバーサイドで取得したデータを SWRConfig の fallback に渡す
  const fallback = initialData ? { [url]: initialData } : {};

  return (
    // クライアントコンポーネントである movieList をラップ
    // この中で useSWR が動く
    <SWRConfig value={{ fallback }}>
      {/* 以下のクライアントコンポーネントにデータを渡す必要はありません */}
      <MovieList />
    </SWRConfig>
  );
}