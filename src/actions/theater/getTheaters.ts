"use server";

import { generateScheduleData } from "@/lib/getScreenUtils";
import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * 全ての theaters を返し、movie_id があれば isShowingMovie フラグを追加
 * @param params.movie_id optional - 映画ID (例: "533533")
 * @returns オブジェクト { data: Theater[] | null, error: string | null }
 */
export async function getTheaters(params?: { movie_id?: string }) {
  const supabase = await createServerSupabaseClient();

  try {
    const movieId = params?.movie_id;

    // 全ての theaters を取得
    const { data: allTheaters, error: theaterErr } = await supabase
      .from("theaters")
      .select("*")
      .order("id");

    if (theaterErr) {
      return { data: null, error: theaterErr.message };
    }

    if (!allTheaters) {
      return { data: [], error: null };
    }

    // movie_id がない場合そのまま全theaters を返す
    if (!movieId) {
      return { data: allTheaters, error: null };
    }

    // movie_id がある場合 isShowingMovie フラグを追加して返す

    // 全スケジュールを取得
    const allSchedules = generateScheduleData();

    // movie_id でフィルタリング
    const schedulesForMovie = allSchedules.filter(
      (schedule) => schedule.movie_id === parseInt(movieId)
    );

    // auditorium_id のリストを重複除去して取得
    const auditoriumIds = [
      ...new Set(schedulesForMovie.map((s) => s.auditorium_id)),
    ];

    // auditorium_id から theater_id を取得
    const { data: auditoriums, error: audErr } = await supabase
      .from("auditoriums")
      .select("theater_id")
      .in("id", auditoriumIds);

    if (audErr) {
      return { data: null, error: audErr.message };
    }

    // theater_id のセットを作成
    const theaterIdsShowingMovie = new Set(
      (auditoriums || []).map((a) => a.theater_id)
    );

    // 全theaters に isShowingMovie フラグを追加
    const theatersWithFlag = allTheaters.map((theater) => ({
      ...theater,
      isShowingMovie: theaterIdsShowingMovie.has(theater.id),
    }));

    return { data: theatersWithFlag, error: null };
  } catch (e) {
    return {
      data: null,
    };
  }
}
