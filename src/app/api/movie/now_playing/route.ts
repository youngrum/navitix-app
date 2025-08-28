// src/app/api/movies/now-playing/route.ts
// クライアントからトークンをセキュアに利用してリクエストするための機能
import { NextResponse } from "next/server";
import { createTMDBInstance } from "@/services/tmdbApi";

export async function GET() {

  const fetchTMDB = createTMDBInstance();
  try {
    const res = await fetchTMDB.get("/movie/now_playing");
    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
