// app/components/MovieList.tsx
'use client';

import fetchTMDB from '@/services/tmdbApi';
import useSWR from 'swr';

export default function MovieList() {
  const movieFetcher = (url: string) => fetchTMDB.get(url).then(res => res.data);
  const { data, error } = useSWR("/movie/now_playing", movieFetcher);
  
  // SWRConfigのfallbackがあるため、通常このローディング状態はスキップされる
  if (error) return <div>データの取得に失敗しました</div>;
  if (!data) return <div>読み込み中...</div>;

  return (
    <div>
      <h1>現在上映中の映画</h1>
      <ul>
        {data.results.map((movie: any) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}