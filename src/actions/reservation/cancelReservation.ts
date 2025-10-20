// src/actions/reservation/cancelReservation.ts
"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface CancelReservationParams {
  reservationId: number;
  reason?: string;
}

/**
 * チケット予約をキャンセル
 * - PENDING状態: 座席と予約レコードのみ削除
 * - PAID状態: Stripe払い戻し + 座席と予約レコード削除
 */
export async function cancelReservation(
  params: CancelReservationParams
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
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

    const { reservationId, reason } = params;

    console.log(`\n=== キャンセル処理開始: reservation ${reservationId} ===`);

    // 予約情報を取得
    const { data: reservations, error: fetchError } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", reservationId)
      .eq("user_id", user.id);

    if (fetchError || !reservations || reservations.length === 0) {
      console.error("予約が見つかりません");
      return {
        success: false,
        error: "予約が見つかりません",
      };
    }

    const reservation = reservations[0];
    console.log(`Payment Status: ${reservation.payment_status}`);
    console.log(`Stripe Payment ID: ${reservation.stripe_payment_id}`);

    // キャンセル済みまたは期限切れの予約はキャンセル不可
    if (
      reservation.payment_status === "CANCELLED" ||
      reservation.payment_status === "EXPIRED"
    ) {
      return {
        success: false,
        error: "この予約はキャンセルできません",
      };
    }

    // PAID状態の場合、Stripeで払い戻し処理を行う
    if (reservation.payment_status === "PAID") {
      console.log("PAID状態 → Stripe払い戻し処理を実行");
      const refundResult = await refundStripePayment(reservationId);

      if (!refundResult.success) {
        console.error("Stripe払い戻し失敗:", refundResult.error);
        return {
          success: false,
          error:
            refundResult.error ||
            "払い戻し処理に失敗しました。Stripeサポートにお問い合わせください",
        };
      }

      console.log("Stripe払い戻し完了");
    } else {
      console.log("PENDING状態 → DB更新のみ実行");
    }

    // 座席予約（seat_reservations）から座席IDを取得
    const { data: seatReservations, error: fetchSeatsError } = await supabase
      .from("seat_reservations")
      .select("seat_id")
      .eq("reservation_id", reservationId);

    if (fetchSeatsError) {
      console.error("座席情報取得エラー:", fetchSeatsError);
    }

    if (seatReservations && seatReservations.length > 0) {
      const seatIds = seatReservations.map((s) => s.seat_id);
      console.log(`座席を復元: ${seatIds.join(", ")}`);

      // 座席の可用性を復元
      const { error: seatsUpdateError } = await supabase
        .from("seats")
        .update({ is_available: true })
        .in("id", seatIds);

      if (seatsUpdateError) {
        console.error("座席復元エラー:", seatsUpdateError);
      }
    }

    // 座席予約（seat_reservations）を削除
    const { error: seatDeleteError } = await supabase
      .from("seat_reservations")
      .delete()
      .eq("reservation_id", reservationId);

    if (seatDeleteError) {
      console.error("座席削除エラー:", seatDeleteError);
      return {
        success: false,
        error: "座席情報の削除に失敗しました",
      };
    }

    console.log("seat_reservations削除完了");

    // 予約ステータスを CANCELLED に更新
    const { error: updateError } = await supabase
      .from("reservations")
      .update({
        payment_status: "CANCELLED",
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason || null,
      })
      .eq("id", reservationId);

    if (updateError) {
      console.error("予約ステータス更新エラー:", updateError);
      return {
        success: false,
        error: "予約ステータスの更新に失敗しました",
      };
    }

    console.log(`=== キャンセル処理完了: reservation ${reservationId} ===\n`);

    return {
      success: true,
      message: "予約をキャンセルしました",
    };
  } catch (error) {
    console.error("予期しないエラー:", error);
    return {
      success: false,
      error: "予期しないエラーが発生しました",
    };
  }
}

/**
 * Stripeの払い戻し処理
 */
async function refundStripePayment(reservationId: number): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createServerSupabaseClient();

    // reservationsテーブルからstripe_payment_idを取得
    const { data: reservation, error: fetchError } = await supabase
      .from("reservations")
      .select("stripe_payment_id, stripe_session_id")
      .eq("id", reservationId)
      .single();

    if (fetchError || !reservation) {
      console.error("予約情報取得エラー:", fetchError);
      return {
        success: false,
        error: "予約情報が見つかりません",
      };
    }

    console.log(`stripe_payment_id: ${reservation.stripe_payment_id}`);
    console.log(`stripe_session_id: ${reservation.stripe_session_id}`);

    if (!reservation.stripe_payment_id) {
      console.warn(
        "stripe_payment_idが保存されていません。チェックアウトセッションから取得を試みます"
      );

      // セッションから支払いIDを取得
      if (reservation.stripe_session_id) {
        try {
          const session = await stripe.checkout.sessions.retrieve(
            reservation.stripe_session_id
          );

          console.log(`Session payment_intent: ${session.payment_intent}`);

          if (!session.payment_intent) {
            return {
              success: false,
              error: "支払い情報が見つかりません",
            };
          }

          // payment_idをDBに保存
          await supabase
            .from("reservations")
            .update({
              stripe_payment_id: session.payment_intent as string,
            })
            .eq("id", reservationId);
        } catch (sessionError) {
          console.error("セッション取得エラー:", sessionError);
          return {
            success: false,
            error: "支払い情報の取得に失敗しました",
          };
        }
      }
    }

    const paymentIntentId =
      reservation.stripe_payment_id ||
      (await stripe.checkout.sessions
        .retrieve(reservation.stripe_session_id as string)
        .then((s) => s.payment_intent as string));

    console.log(`払い戻し対象: ${paymentIntentId}`);

    // Stripeで払い戻し処理を実行
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: "requested_by_customer",
    });

    console.log(`✓ Refund created: ${refund.id} (Status: ${refund.status})`);

    // 払い戻しIDをreservationsテーブルに保存
    const { error: updateError } = await supabase
      .from("reservations")
      .update({
        stripe_refund_id: refund.id,
        payment_status: "REFUNDED",
      })
      .eq("id", reservationId);

    if (updateError) {
      console.error("払い戻しID保存エラー:", updateError);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Stripe払い戻しエラー:", error);

    if (error instanceof Stripe.errors.StripeError) {
      console.error(`Stripeエラーコード: ${error.code}`);
      console.error(`Stripeエラーメッセージ: ${error.message}`);
    }

    return {
      success: false,
      error: "Stripeの払い戻し処理に失敗しました",
    };
  }
}

/**
 * Webhook用: charge.refunded イベントハンドラー
 */
export async function handleChargeRefunded(event: Stripe.Event): Promise<void> {
  const charge = event.data.object as Stripe.Charge;

  console.log("\n=== charge.refunded イベント受信 ===");
  console.log(`Charge ID: ${charge.id}`);
  console.log(`Payment Intent: ${charge.payment_intent}`);
  console.log(`Refunded: ${charge.refunded}`);
  console.log(`Amount Refunded: ${charge.amount_refunded}`);

  const supabase = createAdminClient();

  // payment_intentから予約IDを検索
  const { data: reservations, error } = await supabase
    .from("reservations")
    .select("id, payment_status")
    .eq("stripe_payment_id", charge.payment_intent);

  console.log(`検索結果: ${reservations?.length || 0}件`);

  if (error) {
    console.error("DB検索エラー:", error);
    return;
  }

  if (!reservations || reservations.length === 0) {
    console.error(
      `No reservation found for payment_intent: ${charge.payment_intent}`
    );
    return;
  }

  const reservation = reservations[0];

  // ステータスをREFUNDEDに更新
  const { error: updateError } = await supabase
    .from("reservations")
    .update({
      payment_status: "REFUNDED",
      refunded_at: new Date().toISOString(),
    })
    .eq("id", reservation.id);

  if (updateError) {
    console.error("ステータス更新エラー:", updateError);
    return;
  }

  console.log(`✓ Reservation ${reservation.id} updated to REFUNDED`);
  console.log("=== charge.refunded 処理完了 ===\n");
}
