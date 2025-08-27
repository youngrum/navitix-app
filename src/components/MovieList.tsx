// app/components/MovieList.tsx
"use client";

import useSWR from "swr";
import Image from "next/image";
import { NowPlaying } from "@/types/response/MovieData";

export default function MovieList() {
  const movieFetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR("/api/movies/now-playing", movieFetcher);

  if (error) return <div>データの取得に失敗しました</div>;
  if (!data) return <div>読み込み中...</div>;
  if (data) console.log(data);

  return (
    <div>
      <h1>現在上映中の映画</h1>
      <ul>
        {data.results.map((movie: NowPlaying) => (
          <li key={movie.id}>
            {movie.title}
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
