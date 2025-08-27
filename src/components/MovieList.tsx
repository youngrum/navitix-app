// app/components/MovieList.tsx
"use client";

import fetchTMDB from "@/services/tmdbApi";
import useSWR from "swr";
import Image from "next/image";
import { NowPlaying } from "@/types/response/MovieData";

export default function MovieList() {
  const movieFetcher = (url: string) =>
    fetchTMDB.get(url).then((res) => {
      console.log(res.data);
      return res.data;
    });

  const { data, error } = useSWR("/movie/now_playing", movieFetcher);

  if (error) return <div>データの取得に失敗しました</div>;
  if (!data) return <div>読み込み中...</div>;

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
