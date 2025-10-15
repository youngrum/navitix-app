// app/api/stripe/webhook/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// Supabaseクライアント Service Role
const supabase = createAdminClient();

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("=== Session Metadata ===");
      console.log("Metadata:", session.metadata);
      console.log("Reservation ID:", session.metadata?.reservation_id);

      await handleCheckoutCompleted(session);
      break;

    case "checkout.session.expired":
      await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("=== handleCheckoutCompleted ===");
  console.log("Full session object:", JSON.stringify(session, null, 2));

  const reservationId = session.metadata?.reservation_id;

  if (!reservationId) {
    console.error("No reservation_id in session metadata");
    console.error("Available metadata:", session.metadata);
    return;
  }

  console.log(`Payment completed for reservation: ${reservationId}`);
  console.log(`Reservation ID type: ${typeof reservationId}`);

  // Service Role Keyの確認
  const key = process.env.SUPABASE_SECRET_KEY;
  console.log("Using Service Role Key:", key?.substring(0, 15) + "...");

  try {
    // IDの型を確認して適切に変換
    const idToQuery = isNaN(Number(reservationId))
      ? reservationId
      : Number(reservationId);

    console.log("Querying with ID:", idToQuery, "Type:", typeof idToQuery);

    // まず、レコードが存在するか確認（.single()なし）
    const { data: existingReservations, error: fetchError } = await supabase
      .from("reservations")
      .select("*")
      .eq("id", idToQuery);

    console.log("Query result count:", existingReservations?.length);
    console.log("Existing reservations:", existingReservations);
    console.log("Fetch error:", fetchError);

    if (!existingReservations || existingReservations.length === 0) {
      console.error(`Reservation ${reservationId} not found`);
      return;
    }

    const existingReservation = existingReservations[0];

    if (existingReservation.payment_status !== "PENDING") {
      console.log(
        `Reservation already processed: ${existingReservation.payment_status}`
      );
      return;
    }

    // 更新実行
    const { data: reservationData, error: reservationError } = await supabase
      .from("reservations")
      .update({
        payment_status: "PAID",
      })
      .eq("id", idToQuery)
      .eq("payment_status", "PENDING")
      .select();

    if (reservationError) {
      console.error("Failed to update reservation:", reservationError);
      return;
    }

    console.log("Updated reservation:", reservationData);

    // seat_reservationsテーブルを更新
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

    console.log(`Successfully updated reservation ${reservationId} to PAID`);
  } catch (error) {
    console.error("Error handling checkout completion:", error);
  }
}

/**
 * セッション期限切れ時の処理
 */
async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const reservationId = session.metadata?.reservation_id;

  if (!reservationId) {
    console.error("No reservation_id in session metadata");
    return;
  }

  console.log(`Session expired for reservation: ${reservationId}`);

  try {
    // 予約IDに紐づく全ての座席IDを取得
    // statusがLOCKEDまたはRESERVEDの座席を対象とする
    const { data: expiredSeats, error: fetchSeatsError } = await supabase
      .from("seat_reservations")
      .select("seat_id")
      .eq("reservation_id", reservationId)
      .in("status", ["LOCKED", "RESERVED"]);

    if (fetchSeatsError) {
      console.error("Failed to fetch seats for cleanup:", fetchSeatsError);
    }

    // seatsテーブルの is_available を TRUE に更新（一括更新）
    if (expiredSeats && expiredSeats.length > 0) {
      const seatIdsToRelease = expiredSeats.map((s) => s.seat_id);

      const { error: seatsUpdateError } = await supabase
        .from("seats")
        .update({ is_available: true }) // FALSEからTRUEに戻す
        .in("id", seatIdsToRelease);

      if (seatsUpdateError) {
        console.error(
          "Failed to set expired seats to available (TRUE):",
          seatsUpdateError
        );
      } else {
        console.log(`Successfully released ${seatIdsToRelease.length} seats.`);
      }
    }
    // ------------------------------------------------------------------

    // reservationsテーブルを削除または期限切れステータスに更新
    const { error: reservationError } = await supabase
      .from("reservations")
      .update({
        payment_status: "EXPIRED",
      })
      .eq("id", reservationId)
      .eq("payment_status", "PENDING"); // PENDINGの場合のみ

    if (reservationError) {
      console.error("Failed to update expired reservation:", reservationError);
    }

    // seat_reservationsテーブルから削除
    const { error: seatError } = await supabase
      .from("seat_reservations")
      .delete()
      .eq("reservation_id", reservationId);
    // .eq("status", "RESERVED"); // セッション切れの場合、statusはLOCKEDかRESERVEDの可能性があるため、
    // 削除時にステータス条件は付けず、reservation_idで全て削除するのが安全です。

    if (seatError) {
      console.error("Failed to delete seat reservations:", seatError);
    }

    console.log(`Successfully handled expired reservation ${reservationId}`);
  } catch (error) {
    console.error("Error handling checkout expiration:", error);
  }
}
