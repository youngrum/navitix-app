// src/app/api/movies/now-playing/route.ts
// クライアントからトークンをセキュアに利用してリクエストするための機能

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const token = process.env.TMDB_ACCESS_TOKEN;
    const url = "https://api.themoviedb.org/3/movie/now_playing";

    const res = await axios.get(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        language: "ja",
        region: "JP",
      },
    });

    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
