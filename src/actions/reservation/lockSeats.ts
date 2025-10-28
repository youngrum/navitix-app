"use server";

import { toJSTISOString } from "@/lib/formatter";
import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * 座席の仮予約（ロック）機能 - 複数座席を一括ロック
 */
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

    const lockedUntil = new Date();
    lockedUntil.setMinutes(lockedUntil.getMinutes() + durationMinutes);

    const lockData = seatIds.map((seatId) => ({
      seat_id: seatId,
      status: "LOCKED" as const,
      locked_until: toJSTISOString(lockedUntil),
      reservation_id: null,
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
      lockedUntil: toJSTISOString(lockedUntil),
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
