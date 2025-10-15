import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface CreateStripeSessionParams {
  movieTitle: string;
  theaterName: string;
  auditoriumName: string;
  showtime: string;
  seatInfo: string;
  totalAmount: number;
  reservationId: number;
  uniqueCode: string;
  lockedUntil: string;
}

/**
 * Stripe決済セッションを作成
 */
export async function createStripeSession(
  params: CreateStripeSessionParams
): Promise<{
  success: boolean;
  session?: Stripe.Checkout.Session;
  error?: string;
}> {
  try {
    const {
      movieTitle,
      theaterName,
      auditoriumName,
      showtime,
      seatInfo,
      totalAmount,
      reservationId,
      uniqueCode,
      lockedUntil,
    } = params;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: `映画チケット予約：${movieTitle}\n`,
              description: `【映画館】${theaterName} 【スクリーン】${auditoriumName} 【上映開始時刻】${showtime} 【座席】 ${seatInfo}`,
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation/cancel?reservation_id=${reservationId}`,
      metadata: {
        reservation_id: reservationId.toString(),
        unique_code: uniqueCode,
      },
      expires_at: Math.floor(new Date(lockedUntil).getTime() / 1000),
    });

    return {
      success: true,
      session,
    };
  } catch (error) {
    console.error("Stripe session creation error:", error);
    return {
      success: false,
      error: "決済セッションの作成に失敗しました",
    };
  }
}
