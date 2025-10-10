// src/api/all-theaters/route.ts

import {
  theaters,
  prefectures,
  cities,
  
} from "@/lib/theaterTable";

export async function GET() {
  const allData = theaters.map((theater) => {
    const prefecture = prefectures.find((p) => p.id === theater.prefecture_id);
    const city = cities.find((c) => c.id === theater.city_id);
    const post_code = theater.post_code;
    const address = theater.address;
    const photo_path = theater.photo_path;

    // データの結合
    return {
      id: theater.id,
      name: theater.name,
      prefecture: prefecture?.name || "",
      city: city?.name || "",
      postCode : post_code || "",
      address: address || "",
      photoPath: photo_path || "",
    };
  });

  return Response.json(allData);
}
