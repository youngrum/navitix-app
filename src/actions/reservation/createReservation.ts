"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { generateUniqueCode } from "@/actions/utils/generateUniqueCode";
import { checkSeatAvailability } from "@/actions/utils/seatAvailability";
import {
  validateReservationRequest,
  validateUniqueSeatIds,
  validateSchedule,
} from "@/actions/validation/reservationValidation";
import { createStripeSession } from "@/actions/payment/createStripeSession";
import { sendPaymentEmail } from "@/actions/payment/sendPaymentEmail";
import { CreateReservationParams } from "@/types/reservation";
import { toJSTISOString } from "@/lib/formatter";

/**
 * メイン予約作成処理
 */
export async function createReservation(formData: CreateReservationParams) {
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
    const validationResult = validateReservationRequest(formData);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error,
      };
    }

    const validatedData = validationResult.data;
    const { selected_seat_ids, auditorium_id, schedules_id, total_amount } =
      validatedData;

    // 座席IDの重複チェック
    const uniqueCheck = validateUniqueSeatIds(selected_seat_ids);
    if (!uniqueCheck.success) {
      return {
        success: false,
        error: uniqueCheck.error,
      };
    }

    // スケジュール情報を取得
    const scheduleValidation = validateSchedule(schedules_id);
    if (!scheduleValidation.success) {
      return {
        success: false,
        error: scheduleValidation.error,
      };
    }
    const scheduleData = scheduleValidation.data!;

    // 座席の可用性チェック
    const availabilityCheck = await checkSeatAvailability(
      selected_seat_ids,
      auditorium_id
    );
    if (!availabilityCheck.success) {
      return {
        success: false,
        error: availabilityCheck.error,
      };
    }
    const seats = availabilityCheck.seats!;

    // 座席情報を整形
    const seatInfo = seats
      .map((s) => `${s.seat_row}列${s.seat_number}番`)
      .join(", ");

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
        movie_title: formData.movie_title,
        poster_path: formData.poster_path,
        theater_name: formData.theater_name,
        auditorium_id: auditorium_id,
        auditorium_name: formData.auditorium_name,
        start_time: scheduleData.start_time,
        end_time: scheduleData.end_time,
        seats: seatInfo,
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
    const now = new Date();
    const lockedUntil = toJSTISOString(
      new Date(now.getTime() + 60 * 60 * 1000)
    );

    // seat_reservationsテーブルに複数レコードを一括作成
    const seatReservationsData = selected_seat_ids.map((seatId) => ({
      seat_id: seatId,
      reservation_id: reservation.id,
      status: "LOCKED" as const,
      locked_until: lockedUntil,
    }));

    const { data: createdSeatReservations, error: seatReservationsError } =
      await supabase
        .from("seat_reservations")
        .insert(seatReservationsData)
        .select();

    if (seatReservationsError) {
      console.error("Seat reservations creation error:", seatReservationsError);
      await supabase.from("reservations").delete().eq("id", reservation.id);
      return {
        success: false,
        error: "座席の予約登録に失敗しました",
      };
    }

    if (
      !createdSeatReservations ||
      createdSeatReservations.length !== selected_seat_ids.length
    ) {
      console.error("Seat reservations count mismatch");
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

    // Stripe Checkout セッション作成
    const stripeResult = await createStripeSession({
      movieTitle: formData.movie_title,
      theaterName: formData.theater_name,
      auditoriumName: formData.auditorium_name,
      showtime: formData.showtime,
      seatInfo,
      totalAmount: total_amount,
      reservationId: reservation.id,
      uniqueCode,
      lockedUntil,
    });

    if (!stripeResult.success || !stripeResult.session) {
      // Stripe失敗時もロールバック
      await supabase
        .from("seat_reservations")
        .delete()
        .eq("reservation_id", reservation.id);
      await supabase.from("reservations").delete().eq("id", reservation.id);

      return {
        success: false,
        error: stripeResult.error || "決済セッションの作成に失敗しました",
      };
    }

    const paymentIntentId = stripeResult.session.payment_intent as string;
    const sessionId = stripeResult.session.id;

    const { error: updateError } = await supabase
      .from("reservations")
      .update({
        stripe_payment_id: paymentIntentId,
        stripe_session_id: sessionId,
      })
      .eq("id", reservation.id);

    if (updateError) {
      console.error("Failed to save Stripe payment info:", updateError);
      console.warn("Continuing despite payment info save error");
    } else {
      console.log(
        `Stripe payment info saved for reservation ${reservation.id}`
      );
    }

    // ===================================================

    // メール送信
    if (stripeResult.session.url && user.email) {
      await sendPaymentEmail(
        user.email,
        stripeResult.session.url,
        uniqueCode,
        formData.movie_title,
        selected_seat_ids.length,
        formData.theater_name,
        seatInfo
      );
    }

    return {
      success: true,
      reservationId: reservation.id,
      uniqueCode: uniqueCode,
      seatCount: createdSeatReservations.length,
      checkoutUrl: stripeResult.session.url,
      stripeSessionId: stripeResult.session.id,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "予期しないエラーが発生しました",
    };
  }
}
