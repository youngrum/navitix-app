import { SeatWithTheaterAndMovieResponse } from "@/types/seat";
import { Theater } from "@/types/theater";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { getMovieDetailData } from "./movieDetailUtils";
import { schedules } from "./screenDB";

// シートのデータ取得
export async function getSeatData(auditoriumId: string) {
  const auditorium_id = Number(auditoriumId);

  // supabaseクライアント宣言
  const supabase = await createServerSupabaseClient();

  // ユーザーチェック
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // 認証されていない場合は 401 Unauthorized を返す
    return null;
  }

  // パスパラメーターのauditorium_idから上映室レコードを取得
  const { data: auditoriumsData, error: auditoriumError } = await supabase
    .from("auditoriums") // テーブル名: 'auditoriums'
    .select("id, theater_id, name") // 必要なカラムを選択
    .eq("id", auditorium_id)
    .maybeSingle(); // 1件のみ取得

  if (auditoriumError || !auditoriumsData) {
    console.error("Supabase auditorium data fetch error:", auditoriumError);
    return null;
  }
  const auditoriumName = auditoriumsData.name;
  const theaterId = auditoriumsData.theater_id;

  // theatersテーブルから対象の上映室を持つ映画館レコードを取得
  const { data: theaterData, error: theaterError } = await supabase
    .from("theaters") // テーブル名: 'theaters'
    .select("id, name, address") // 必要なカラムを選択（Theater型に合わせる）
    .eq("id", theaterId)
    .maybeSingle<Theater>();

  if (theaterError || !theaterData) {
    console.error("Supabase theater data fetch error:", theaterError);
    return null;
  }
  //スケジュールデータを取得 schedulesテーブルは配列で疑似的なテーブルを構成
  const scheduleData = schedules.find(
    (schedule) => schedule.auditorium_id === auditorium_id
  );

  if (!scheduleData) {
    return null;
  }
  const scheduleId = scheduleData.id;

  // スケジュールデータから movie_id を取得
  const movieId = scheduleData.movie_id;
  if (!movieId) {
    return null;
  }
  const startTime = scheduleData.start_time;
  const endTime = scheduleData.end_time;

  if (!startTime || !endTime) {
    console.error("上映時間情報取得エラー");
    return null;
  }

  // movie_id を使用して、座席データをフィルタリング
  const movieData = await getMovieDetailData(movieId);
  if (!movieData) {
    return null;
  }

  const movieTitle = movieData.title;
  const posterPath = movieData.poster_path ?? "-";

  // seatsテーブルから対象の上映室を持つレコードを取得
  const { data: seatData, error: seatError } = await supabase
    .from("seats") // テーブル名: 'seats'
    .select("*") // 全ての座席データを取得
    .eq("auditorium_id", auditorium_id);

  if (seatError || !seatData || seatData.length === 0) {
    console.error("Supabase seat data fetch error:", seatError);
    return null;
  }
  // console.log("seatData>>>>>>", seatData);

  const responseData: SeatWithTheaterAndMovieResponse = {
    theaterData: theaterData,
    schedulesId: scheduleId,
    auditoriumName: auditoriumName,
    seatData: seatData,
    movieTitle: movieTitle,
    movieId: movieId,
    posterPath: posterPath,
    startTime: startTime,
    endTime: endTime,
  };

  return responseData;
}
