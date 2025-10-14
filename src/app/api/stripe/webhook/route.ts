"use server"; // ファイルの先頭に必ず記述します

import { createServerSupabaseClient } from "@/utils/supabase/server";
import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/**
 * 映画の予約申し込み（仮押さえ）とStripeセッションの作成
 */
export async function createReservationAndCheckout(formData: FormData) {
  // 1. ユーザー情報、座席情報などをformDataから取得・検証

  // 2. データベース処理（仮押さえ）
  //    - Reservations/seat_reservationsにレコード追加
  //    - locked_untilに1時間後のタイムスタンプを設定
  const supabase = await createServerSupabaseClient();
  const reservationId = await supabase.update(/* ... */);

  // 3. Stripeセッションの作成
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      // 動的な商品情報（映画館、座席単価など）
      {
        price_data: {
          currency: "jpy",
          product_data: {
            name: "映画チケット予約",
            // description: 映画情報、座席名など
          },
          unit_amount: 1500 * 100, // 単価をセント/円単位で
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation/cancel`,
    metadata: { reservationId: reservationId }, // 予約IDを渡す
  });

  // **API Routesと異なる点: メール送信ではなく、決済フォームへ直接リダイレクトさせる**
  // メール送信をしたい場合は、ここで送信処理を実装します。
  if (session.url) {
    redirect(session.url);
  }
}

/**
 * Webhookによる予約確定処理 (これはAPI Routesとして残すのが一般的)
 * Webhookは外部サービスからのHTTPリクエストを受けるため、API Routesとして実装する方が自然です。
 * 処理内容：予約IDを元にReservationsテーブルのreserved_atを更新
 */
// export async function handleStripeWebhook(event: Stripe.Event) { /* ... */ }
