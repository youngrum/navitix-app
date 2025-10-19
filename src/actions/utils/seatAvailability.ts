import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * 座席の可用性をチェックする
 * @param seatIds チェック対象の座席ID配列
 * @param auditoriumId 上映室ID
 * @returns 座席情報と可用性の結果
 */
export async function checkSeatAvailability(
  seatIds: number[],
  auditoriumId: number
) {
  const supabase = await createServerSupabaseClient();

  // 座席が存在するか確認
  const { data: seats, error: seatsError } = await supabase
    .from("seats")
    .select("id, auditorium_id, seat_number, seat_row")
    .in("id", seatIds)
    .eq("auditorium_id", auditoriumId);

  if (seatsError) {
    return {
      success: false,
      error: "座席情報の取得に失敗しました",
      seats: null,
    };
  }

  if (!seats || seats.length !== seatIds.length) {
    return {
      success: false,
      error: "無効な座席が含まれています",
      seats: null,
    };
  }

  // 予約状況を確認
  const { data: existingReservations, error: reservationCheckError } =
    await supabase
      .from("seat_reservations")
      .select("seat_id, status, locked_until")
      .in("seat_id", seatIds)
      .in("status", ["LOCKED", "RESERVED"]);

  if (reservationCheckError) {
    return {
      success: false,
      error: "座席の予約状況確認に失敗しました",
      seats: null,
    };
  }

  // 利用不可能な座席をフィルタリング
  const now = new Date();
  const unavailableSeats =
    existingReservations?.filter((res) => {
      if (res.status === "RESERVED") return true;
      if (res.status === "LOCKED" && res.locked_until) {
        const lockedUntil = new Date(res.locked_until);
        return lockedUntil > now;
      }
      return false;
    }) || [];

  if (unavailableSeats.length > 0) {
    const unavailableSeatIds = unavailableSeats
      .map((s) => s.seat_id)
      .join(", ");
    return {
      success: false,
      error: `座席 ${unavailableSeatIds} は既に予約されています`,
      seats: null,
    };
  }

  return {
    success: true,
    seats,
    error: null,
  };
}
