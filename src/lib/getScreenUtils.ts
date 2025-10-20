import searchTheaterLocalApi from "@/services/searchTheaterLocalApi";
import { apiResponse } from "@/types/apiResponse";
import { ScreenResponse } from "@/types/screen";

export async function getScreenData(
  theater_id: string
): Promise<ScreenResponse | null> {
  try {
    const res: apiResponse<ScreenResponse> = await searchTheaterLocalApi.get(
      `/screen-schedules/${theater_id}/`
    );
    // console.log("%o", res.data);
    return res.data;
  } catch (error) {
    console.log("Failed to fetch", error);
    return null;
  }
}

// schedulesテーブルのデータ構造を定義（Next.jsプロジェクト内で利用することを想定）
type Schedule = {
  id: number;
  movie_id: number;
  auditorium_id: number;
  start_time: string; // ISO 8601形式のタイムスタンプ文字列
  end_time: string; // ISO 8601形式のタイムスタンプ文字列
};

/**
 * 指定された期間と上映室に対して映画スケジュールデータを生成する関数
 * @param startDate 開始日 (YYYY-MM-DD)
 * @param endDate 終了日 (YYYY-MM-DD)
 * @param totalAuditoriums 上映室の総数（例: 90）
 * @returns Scheduleオブジェクトの配列
 */
export const generateScheduleData = (): Schedule[] => {
  const START_DATE = "2025-10-20";
  const END_DATE = "2025-11-19";
  const TOTAL_AUDITORIUMS = 90;
  const schedules: Schedule[] = [];
  let idCounter = 1;

  // 映画ごとの上映時間と開始時刻の定義
  const movieConfigs = [
    {
      movieId: 533533,
      durationMinutes: 90,
      startTimes: ["10:00:00", "12:00:00", "14:00:00", "16:00:00", "18:00:00"],
    },
    {
      movieId: 1218925,
      durationMinutes: 110,
      startTimes: ["10:10:00", "12:20:00", "14:30:00", "16:40:00", "19:00:00"],
    },
    {
      movieId: 1249423,
      durationMinutes: 90,
      startTimes: ["10:30:00", "12:30:00", "14:30:00", "16:30:00", "18:30:00"],
    },
  ];

  // 日付の範囲をループ
  const currentDate = new Date(START_DATE);
  const endDate = new Date(END_DATE);

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split("T")[0];

    // 1. 上映室のIDをループ
    for (let audId = 1; audId <= TOTAL_AUDITORIUMS; audId++) {
      // 2. 上映室IDに応じて映画を1つ選択（101、102、103を順番に割り当て）
      const config = movieConfigs[(audId - 1) % movieConfigs.length];

      // 3. その日の開始時刻をループ
      for (const time of config.startTimes) {
        const startDateTime = new Date(`${dateString}T${time}+09:00`);
        const endDateTime = new Date(
          startDateTime.getTime() + config.durationMinutes * 60000
        );

        schedules.push({
          id: idCounter++,
          movie_id: config.movieId,
          auditorium_id: audId,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
        });
      }
    }

    // 次の日へ進める
    currentDate.setDate(currentDate.getDate() + 1);
  }
  // console.log(schedules);
  return schedules;
};
