import { ReservationRequestSchema } from "@/types/form";
import { schedules } from "@/lib/screenDB";
import { z } from "zod";
import { CreateReservationParams } from "@/types/reservation";

type ReservationData = z.infer<typeof ReservationRequestSchema>;

/**
 * 予約リクエストのバリデーション
 */
export function validateReservationRequest(
  formData: CreateReservationParams
):
  | { success: true; error: null; data: ReservationData }
  | { success: false; error: string; data: null } {
  const validationResult = ReservationRequestSchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.issues[0].message,
      data: null,
    };
  }

  return {
    success: true,
    error: null,
    data: validationResult.data,
  };
}

/**
 * 座席IDの重複チェック
 */
export function validateUniqueSeatIds(seatIds: number[]) {
  const uniqueSeatIds = new Set(seatIds);

  if (uniqueSeatIds.size !== seatIds.length) {
    return {
      success: false,
      error: "重複した座席が選択されています",
    };
  }

  return {
    success: true,
    error: null,
  };
}

/**
 * スケジュール情報の検証
 */
export function validateSchedule(schedulesId: number) {
  const scheduleData = schedules.find((s) => s.id === schedulesId);

  if (!scheduleData) {
    return {
      success: false,
      error: "スケジュール情報が見つかりません",
      data: null,
    };
  }

  return {
    success: true,
    error: null,
    data: scheduleData,
  };
}
