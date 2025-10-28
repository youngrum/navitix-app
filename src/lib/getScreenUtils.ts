import searchTheaterLocalApi from "@/services/searchTheaterLocalApi";
import { apiResponse } from "@/types/apiResponse";
import { ScreenResponse, ScreenSchedule } from "@/types/screen";
import { toJSTISOString } from "@/lib/formatter";

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
  const TOTAL_AUDITORIUMS = 90;
  const schedules: Schedule[] = [];
  let idCounter = 1;

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const today = new Date();
  // 今日の日付を START_DATE に設定
  const START_DATE_ISO = formatDate(today);

  // 今日から1週間後（+7日）の日付を END_DATE に設定
  const sevenDaysLater = new Date(today);
  sevenDaysLater.setDate(today.getDate() + 7);
  const END_DATE_ISO = formatDate(sevenDaysLater);

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
  // START_DATE_ISO と END_DATE_ISO は YYYY-MM-DD 形式
  const currentDate = new Date(START_DATE_ISO);
  const endDate = new Date(END_DATE_ISO);

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
          start_time: toJSTISOString(startDateTime),
          end_time: toJSTISOString(endDateTime),
        });
      }
    }

    // 次の日へ進める
    currentDate.setDate(currentDate.getDate() + 1);
  }
  // console.log(schedules);
  return schedules;
};

// 上映開始時間が予約締切時間（現在時刻から1時間以内）を過ぎているか判定する
export const isShowtimeDisabled = (
  start_time: string,
  currentTime: Date
): boolean => {
  const RESERVATION_DEADLINE_MS = 60 * 60 * 1000;
  // 上映開始時刻をDateオブジェクトとしてパース
  const startTime = new Date(start_time);
  // 現在時刻からの差分 (ミリ秒) を計算
  const timeDifference = startTime.getTime() - currentTime.getTime();
  // 差分が RESERVATION_DEADLINE_MS (1時間) 未満であれば true (選択不可)
  return timeDifference < RESERVATION_DEADLINE_MS;
};

// 予約可能な最初のスケジュール時刻をセットする
export const findFirstAvailableTime = (
  schedules: ScreenSchedule[] | undefined,
  currentTime: Date
): string => {
  if (!schedules || schedules.length === 0 || !schedules[0].showtimes) {
    return "";
  }

  // 初日の予約可能な最初の時間を見つける
  const firstAvailableShowtime = schedules[0].showtimes.find(
    (showtime) => !isShowtimeDisabled(showtime.start_time, currentTime)
  );

  return firstAvailableShowtime?.start_time || "";
};
