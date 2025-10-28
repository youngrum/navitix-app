"use server";

import { toJSTISOString } from "@/lib/formatter";
import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * 期限切れの仮予約を削除するクリーンアップ関数
 */
export async function cleanupExpiredLocks() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("seat_reservations")
      .delete()
      .eq("status", "LOCKED")
      .lt("locked_until", toJSTISOString(new Date()))
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
