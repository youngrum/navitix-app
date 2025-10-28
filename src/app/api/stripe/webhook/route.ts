// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import Stripe from "stripe";
import { handleChargeRefunded } from "@/actions/reservation/cancelReservation";
import { toJSTISOString } from "@/lib/formatter";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// Supabaseクライアント Service Role
const supabase = createAdminClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  // console.log("\n=== Webhook受信 ===");

  if (!signature) {
    console.error("No signature provided");
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log(`Event Type: ${event.type}`);
    console.log(`Event ID: ${event.id}`);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("=== checkout.session.completed ===");
        // console.log("Session ID:", session.id);
        // console.log("Payment Intent:", session.payment_intent);
        // console.log("Metadata:", session.metadata);
        await handleCheckoutCompleted(session);
        break;

      case "charge.refunded":
        console.log("=== charge.refunded イベント ===");
        await handleChargeRefunded(event);
        break;

      case "checkout.session.expired":
        console.log("=== checkout.session.expired ===");
        await handleCheckoutExpired(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("\n=== handleCheckoutCompleted 処理開始 ===");

  const reservationId = session.metadata?.reservation_id;
  const paymentIntentId = session.payment_intent as string;

  if (!reservationId) {
    console.error("No reservation_id in session metadata");
    return;
  }

  const idToQuery = isNaN(Number(reservationId))
    ? reservationId
    : Number(reservationId);

  // console.log(`Reservation ID: ${idToQuery}`);
  // console.log(`Payment Intent ID: ${paymentIntentId}`);

  try {
    // 予約が存在するか確認
    const { data: existingReservations, error: fetchError } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", idToQuery);

    if (
      fetchError ||
      !existingReservations ||
      existingReservations.length === 0
    ) {
      console.error(`Reservation ${idToQuery} not found`);
      return;
    }

    const existingReservation = existingReservations[0];
    // console.log(`Current Status: ${existingReservation.payment_status}`);

    // 既に処理済みの場合はスキップ
    if (existingReservation.payment_status !== "PENDING") {
      console.log(
        `Reservation already processed: ${existingReservation.payment_status}`
      );
      return;
    }

    const paidAt =
      session.payment_status === "paid" && session.created
        ? toJSTISOString(new Date(session.created * 1000))
        : toJSTISOString(new Date());

    // 予約ステータスを PAID に更新 + stripe_payment_idを保存
    const { data: reservationData, error: reservationError } = await supabase
      .from("reservations")
      .update({
        payment_status: "PAID",
        paid_at: paidAt,
        stripe_payment_id: paymentIntentId,
        stripe_session_id: session.id,
      })
      .eq("id", idToQuery)
      .eq("payment_status", "PENDING")
      .select();

    if (reservationError) {
      console.error("Failed to update reservation:", reservationError);
      return;
    }

    // console.log("✓ Reservation updated to PAID");
    // console.log(`  Payment Intent ID: ${paymentIntentId}`);

    // seat_reservations テーブルを更新
    const { error: seatError } = await supabase
      .from("seat_reservations")
      .update({
        status: "PAID",
      })
      .eq("reservation_id", idToQuery)
      .eq("status", "LOCKED");

    if (seatError) {
      console.error("Failed to update seat reservations:", seatError);
      return;
    }

    // console.log("✓ Seat reservations updated to PAID");
    // console.log("=== handleCheckoutCompleted 処理完了 ===\n");
  } catch (error) {
    console.error("Error handling checkout completion:", error);
  }
}

/**
 * セッション期限切れ時の処理
 */
async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  console.log("\n=== handleCheckoutExpired 処理開始 ===");

  const reservationId = session.metadata?.reservation_id;

  if (!reservationId) {
    console.error("No reservation_id in session metadata");
    return;
  }

  console.log(`Reservation ID: ${reservationId}`);

  try {
    // 座席予約から座席IDを取得
    const { data: expiredSeats, error: fetchSeatsError } = await supabase
      .from("seat_reservations")
      .select("seat_id")
      .eq("reservation_id", reservationId)
      .in("status", ["LOCKED", "RESERVED"]);

    if (fetchSeatsError) {
      console.error("Failed to fetch seats for cleanup:", fetchSeatsError);
    }

    // 予約ステータスを EXPIRED に更新
    const { error: reservationError } = await supabase
      .from("reservations")
      .update({
        payment_status: "EXPIRED",
      })
      .eq("id", reservationId)
      .eq("payment_status", "PENDING");

    if (reservationError) {
      console.error("Failed to update expired reservation:", reservationError);
    } else {
      console.log("✓ Reservation updated to EXPIRED");
    }

    // 座席予約を削除
    const { error: seatError } = await supabase
      .from("seat_reservations")
      .delete()
      .eq("reservation_id", reservationId);

    if (seatError) {
      console.error("Failed to delete seat reservations:", seatError);
    } else {
      console.log("✓ Seat reservations deleted");
    }

    console.log("=== handleCheckoutExpired 処理完了 ===\n");
  } catch (error) {
    console.error("Error handling checkout expiration:", error);
  }
}
