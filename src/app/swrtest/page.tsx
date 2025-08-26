"use client";

import useSWR from "swr";
import fetchTMDB from "@/services/tmdbApi";

const fetcher = async (url: string): Promise<any> => {
  const res = await fetchTMDB();
  console.log(res);
  return res.data;
};

export default function testPage() {
  const { data, error } = useSWR("/movie/now_playing", fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>TMDB Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
