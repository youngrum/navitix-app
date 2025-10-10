// src/api/search-theater/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  theaters,
  prefectures,
  cities,
} from "@/lib/theaterTable";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("keyword");

  if (typeof q !== "string" || q.trim() === "") {
    // 検索クエリがない場合は全件返すか、空配列を返す
    return Response.json({ status: 200, data: [] });
  }

  const query = q.toLowerCase();

  const results = theaters
    .map((theater) => {
      const prefecture = prefectures.find(
        (p) => p.id === theater.prefecture_id
      );
      const city = cities.find((c) => c.id === theater.city_id);

      // データの結合
      return {
        ...theater,
        address: theater?.address || "",
        prefecture_name: prefecture?.name || "",
        city_name: city?.name || "",
      };
    })
    .filter((item) => {
      // 検索ロジック
      const nameMatch = item.name.toLowerCase().includes(query);
      const addressMatch = item.address.toLowerCase().includes(query);
      const prefectureMatch = item.prefecture_name
        .toLowerCase()
        .includes(query);
      const cityMatch = item.city_name.toLowerCase().includes(query);

      return nameMatch || addressMatch || prefectureMatch || cityMatch;
    })
    .map((item) => ({
      // レスポンス用に整形
      id: item.id,
      name: item.name,
      prefecture: item.prefecture_name,
      city: item.city_name,
      address: item.address,
      photo_path:
        item.photo_path || "",
    }));

  return NextResponse.json(results);
}
