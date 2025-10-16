import { SeatWithTheaterAndMovieResponse } from "@/types/seat";
import { Theater } from "@/types/theater";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import { getMovieDetailData } from "./movieDetailUtils";
import { schedules } from "./screenDB";

// シートのデータ取得
export async function getSeatData(auditoriumId: string, scheduleId: string) {
  const auditorium_id = Number(auditoriumId);
  const schedule_id = Number(scheduleId);

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
    .from("auditoriums")
    .select("id, theater_id, name")
    .eq("id", auditorium_id)
    .maybeSingle();

  if (auditoriumError || !auditoriumsData) {
    console.error("Supabase auditorium data fetch error:", auditoriumError);
    return null;
  }
  const auditoriumName = auditoriumsData.name;
  const theaterId = auditoriumsData.theater_id;

  // theatersテーブルから対象の上映室を持つ映画館レコードを取得
  const { data: theaterData, error: theaterError } = await supabase
    .from("theaters")
    .select("id, name, address")
    .eq("id", theaterId)
    .maybeSingle<Theater>();

  if (theaterError || !theaterData) {
    console.error("Supabase theater data fetch error:", theaterError);
    return null;
  }

  // スケジュールデータを取得
  const scheduleData = schedules.find(
    (schedule) =>
      schedule.auditorium_id === auditorium_id && schedule.id === schedule_id
  );

  if (!scheduleData) {
    console.error("スケジュール取得エラー");
    return null;
  }

  // スケジュールデータから movie_id を取得
  const movieId = scheduleData.movie_id;
  if (!movieId) {
    console.error("映画ID取得エラー");
    return null;
  }
  const startTime = scheduleData.start_time;
  const endTime = scheduleData.end_time;

  if (!startTime || !endTime) {
    console.error("上映時間情報取得エラー");
    return null;
  }

  // movie_id を使用して、映画データを取得
  const movieData = await getMovieDetailData(movieId);
  if (!movieData) {
    console.error("映画データ取得エラー");
    return null;
  }

  const movieTitle = movieData.title;
  const posterPath = movieData.poster_path ?? "-";

  // seatsテーブルから対象の上映室を持つレコードを取得
  const { data: seatData, error: seatError } = await supabase
    .from("seats")
    .select("*")
    .eq("auditorium_id", auditorium_id);

  if (seatError || !seatData || seatData.length === 0) {
    console.error("Supabase seat data fetch error:", seatError);
    return null;
  }

  // 指定された上映時間の予約情報を取得
  // reservations と seat_reservations を結合して、どの座席が予約済みかを判定
  const { data: reservedSeats, error: reservedSeatsError } = await supabase
    .from("seat_reservations")
    .select("seat_id")
    .in(
      "reservation_id",
      (
        await supabase
          .from("reservations")
          .select("id")
          .eq("auditorium_id", auditorium_id)
          .eq("start_time", startTime)
          .eq("end_time", endTime)
          .in("payment_status", ["PAID", "PENDING"])
      ).data?.map((r: any) => r.id) || []
    );

  if (reservedSeatsError) {
    console.error("Reserved seats fetch error:", reservedSeatsError);
    return null;
  }

  // 予約済み座席のIDをセットで保持（検索効率化）
  const reservedSeatIds = new Set(
    (reservedSeats || []).map((r: any) => r.seat_id)
  );

  // 座席データに is_available フラグを追加
  const seatsWithAvailability = seatData.map((seat: any) => ({
    ...seat,
    is_available: !reservedSeatIds.has(seat.id),
  }));

  const responseData: SeatWithTheaterAndMovieResponse = {
    theaterData: theaterData,
    schedulesId: schedule_id,
    auditoriumName: auditoriumName,
    seatData: seatsWithAvailability,
    movieTitle: movieTitle,
    movieId: movieId,
    posterPath: posterPath,
    startTime: startTime,
    endTime: endTime,
  };

  return responseData;
}
