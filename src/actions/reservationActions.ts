"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { ReservationRequestSchema } from "@/types/form";
import { schedules } from "@/lib/screenDB";

// ユニークコード生成関数
function generateUniqueCode(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`.toUpperCase();
}

export async function createReservation(formData: {
  selected_seat_ids: number[];
  auditorium_id: number;
  schedules_id: number;
  total_amount: number;
}) {
  try {
    const supabase = await createServerSupabaseClient();

    // ユーザー認証チェック
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "認証エラー: ログインが必要です",
      };
    }

    // バリデーション
    const validationResult = ReservationRequestSchema.safeParse(formData);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0].message,
      };
    }

    const { selected_seat_ids, auditorium_id, schedules_id, total_amount } =
      validationResult.data;

    // 座席IDの重複チェック
    const uniqueSeatIds = new Set(selected_seat_ids);
    if (uniqueSeatIds.size !== selected_seat_ids.length) {
      return {
        success: false,
        error: "重複した座席が選択されています",
      };
    }

    // スケジュール情報を取得
    const scheduleData = schedules.find((s) => s.id === schedules_id);
    if (!scheduleData) {
      return {
        success: false,
        error: "スケジュール情報が見つかりません",
      };
    }

    // 選択された座席が存在するか確認
    const { data: seats, error: seatsError } = await supabase
      .from("seats")
      .select("id, auditorium_id")
      .in("id", selected_seat_ids)
      .eq("auditorium_id", auditorium_id);

    if (seatsError) {
      console.error("Seats fetch error:", seatsError);
      return {
        success: false,
        error: "座席情報の取得に失敗しました",
      };
    }

    // 全ての座席が存在し、正しい上映室に属しているか確認
    if (!seats || seats.length !== selected_seat_ids.length) {
      return {
        success: false,
        error: "無効な座席が含まれています",
      };
    }

    // 座席の予約可能状態を確認
    const { data: existingReservations, error: reservationCheckError } =
      await supabase
        .from("seat_reservations")
        .select("seat_id, status, locked_until")
        .in("seat_id", selected_seat_ids)
        .in("status", ["LOCKED", "RESERVED"]);

    if (reservationCheckError) {
      console.error("Reservation check error:", reservationCheckError);
      return {
        success: false,
        error: "座席の予約状況確認に失敗しました",
      };
    }

    // 既に予約またはロックされている座席をフィルタリング
    const now = new Date();
    const unavailableSeats =
      existingReservations?.filter((res) => {
        // RESERVEDの場合は常に利用不可
        if (res.status === "RESERVED") return true;

        // LOCKEDの場合は期限が切れていないかチェック
        if (res.status === "LOCKED" && res.locked_until) {
          const lockedUntil = new Date(res.locked_until);
          return lockedUntil > now; // 期限が未来の場合は利用不可
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
      };
    }

    // ユニークコード生成
    const uniqueCode = generateUniqueCode();

    // reservationsテーブルにレコード作成
    const { data: reservation, error: reservationError } = await supabase
      .from("reservations")
      .insert({
        user_id: user.id,
        total_amount: total_amount,
        payment_status: "PENDING",
        unique_code: uniqueCode,
        movie_id: scheduleData.movie_id,
        auditorium_id: auditorium_id,
        start_time: scheduleData.start_time,
        end_time: scheduleData.end_time,
      })
      .select()
      .single();

    if (reservationError || !reservation) {
      console.error("Reservation creation error:", reservationError);
      return {
        success: false,
        error: "予約の作成に失敗しました",
      };
    }

    // 予約日時＋1時間のタイムスタンプを生成
    const lockedUntil = new Date(now.getTime() + 60 * 60 * 1000).toISOString();

    // seat_reservationsテーブルに複数レコードを一括作成
    const seatReservationsData = selected_seat_ids.map((seatId) => ({
      seat_id: seatId,
      reservation_id: reservation.id,
      status: "RESERVED" as const,
      locked_until: lockedUntil,
    }));

    const { data: createdSeatReservations, error: seatReservationsError } =
      await supabase
        .from("seat_reservations")
        .insert(seatReservationsData)
        .select();

    if (seatReservationsError) {
      console.error("Seat reservations creation error:", seatReservationsError);

      // ロールバック処理: 作成した予約レコードを削除
      await supabase.from("reservations").delete().eq("id", reservation.id);

      return {
        success: false,
        error: "座席の予約登録に失敗しました",
      };
    }

    // 作成された座席予約数を確認
    if (
      !createdSeatReservations ||
      createdSeatReservations.length !== selected_seat_ids.length
    ) {
      console.error("Seat reservations count mismatch");

      // ロールバック処理
      await supabase
        .from("seat_reservations")
        .delete()
        .eq("reservation_id", reservation.id);
      await supabase.from("reservations").delete().eq("id", reservation.id);

      return {
        success: false,
        error: "座席予約の作成中にエラーが発生しました",
      };
    }

    return {
      success: true,
      reservationId: reservation.id,
      uniqueCode: uniqueCode,
      seatCount: createdSeatReservations.length,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "予期しないエラーが発生しました",
    };
  }
}

// 座席の仮予約（ロック）機能 - 複数座席を一括ロック
export async function lockSeats(
  seatIds: number[],
  auditoriumId: number,
  durationMinutes: number = 10
) {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "認証エラー",
      };
    }

    // 座席が存在するか確認
    const { data: seats, error: seatsError } = await supabase
      .from("seats")
      .select("id")
      .in("id", seatIds)
      .eq("auditorium_id", auditoriumId);

    if (seatsError || !seats || seats.length !== seatIds.length) {
      return {
        success: false,
        error: "無効な座席が含まれています",
      };
    }

    // 既存の予約をチェック
    const { data: existingReservations } = await supabase
      .from("seat_reservations")
      .select("seat_id, status, locked_until")
      .in("seat_id", seatIds)
      .in("status", ["LOCKED", "RESERVED"]);

    const now = new Date();
    const unavailable =
      existingReservations?.filter((res) => {
        if (res.status === "RESERVED") return true;
        if (res.status === "LOCKED" && res.locked_until) {
          return new Date(res.locked_until) > now;
        }
        return false;
      }) || [];

    if (unavailable.length > 0) {
      return {
        success: false,
        error: "選択した座席の一部が既に予約されています",
      };
    }

    // ロック期限を計算
    const lockedUntil = new Date();
    lockedUntil.setMinutes(lockedUntil.getMinutes() + durationMinutes);

    // 複数座席を一括でロック
    const lockData = seatIds.map((seatId) => ({
      seat_id: seatId,
      status: "LOCKED" as const,
      locked_until: lockedUntil.toISOString(),
      reservation_id: null, // 仮予約時はnull
    }));

    const { error } = await supabase
      .from("seat_reservations")
      .upsert(lockData, {
        onConflict: "seat_id",
        ignoreDuplicates: false,
      });

    if (error) {
      console.error("Lock seats error:", error);
      return {
        success: false,
        error: "座席のロックに失敗しました",
      };
    }

    return {
      success: true,
      lockedUntil: lockedUntil.toISOString(),
      lockedCount: seatIds.length,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "予期しないエラーが発生しました",
    };
  }
}

// 期限切れの仮予約を削除するクリーンアップ関数
export async function cleanupExpiredLocks() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("seat_reservations")
      .delete()
      .eq("status", "LOCKED")
      .lt("locked_until", new Date().toISOString())
      .select();

    if (error) {
      console.error("Cleanup expired locks error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      deletedCount: data?.length || 0,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "予期しないエラーが発生しました",
    };
  }
}
