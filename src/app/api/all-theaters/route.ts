// src/api/all-theaters/route.ts

import { theaters, theater_details, prefectures, cities } from '@/lib/theaterTable';

export async function GET() {

  const allData = theaters
    .map(theater => {
      const detail = theater_details.find(d => d.theater_id === theater.id);
      const prefecture = prefectures.find(p => p.id === theater.prefecture_id);
      const city = cities.find(c => c.id === theater.city_id);

      // データの結合
        return {
        id: theater.id,
        name: theater.name,
        prefecture: prefecture?.name || '',
        city: city?.name || '',
        address: detail?.address || ''
        };
    })

  return Response.json(allData);
}