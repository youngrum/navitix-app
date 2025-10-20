"use server";

import { createServerSupabaseClient } from "@/utils/supabase/server";
import { ReservationRequestSchema } from "@/types/form";
import { schedules } from "@/lib/screenDB";
import { Resend } from "resend";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// ユニークコード生成関数
function generateUniqueCode(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`.toUpperCase();
}

// メール送信関数
async function sendPaymentEmail(
  email: string,
  checkoutUrl: string,
  uniqueCode: string,
  movieTitle: string,
  seatCount: number,
  theaterName: string,
  seatInfo: string
) {
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "onboarding@resend.dev", // テスト用アドレス
        to: email,
        subject: "【映画予約】決済手続きのご案内",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">映画チケット予約受付完了</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>予約番号:</strong> ${uniqueCode}</p>
              <p><strong>映画館:</strong> ${theaterName}</p>
              <p><strong>上映作品:</strong> ${movieTitle}</p>
              <p><strong>座席(${seatCount}):</strong> ${seatInfo}</p>
            </div>
            <p>以下のリンクから決済を完了してください。</p>
            <p style="color: #d9534f;"><strong>有効期限: 1時間</strong></p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${checkoutUrl}" 
                style="background: #007bff; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 4px; display: inline-block;">
                決済ページへ進む
              </a>
            </div>
            <p style="font-size: 12px; color: #666;">
              ※このメールは送信専用です。返信はできません。
            </p>
          </div>
        `,
      });

      console.log("✓ メール送信成功:", email);
      console.log("=== 決済メール送信 ===");
      console.log("To:", email);
      console.log("予約番号:", uniqueCode);
      console.log("決済URL:", checkoutUrl);
      console.log("==================");
    } catch (error) {
      console.error("メール送信エラー:", error);
      // メール送信失敗してもエラーにしない（決済URLは生成済み）
    }
  } else {
    // 開発環境用: コンソールに出力
    console.log("=== 決済メール送信（開発モード） ===");
    console.log("To:", email);
    console.log("予約番号:", uniqueCode);
    console.log("決済URL:", checkoutUrl);
    console.log("============================");
  }
}

export async function createReservation(formData: {
  theater_name: string;
  selected_seat_ids: number[];
  auditorium_id: number;
  auditorium_name: string;
  schedules_id: number;
  movie_title: string;
  poster_path: string;
  showtime: string;
  total_amount: number;
}) {
  console.log("formData>>>>>>>", formData);
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
      .select("id, auditorium_id, seat_number, seat_row")
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
        error: "座席の予約状態確認に失敗しました",
      };
    }

    // 既に予約またはロックされている座席をフィルタリング
    const now = new Date();
    const unavailableSeats =
      existingReservations?.filter((res) => {
        if (res.status === "RESERVED") return true;
        if (res.status === "LOCKED" && res.locked_until) {
          const lockedUntil = new Date(res.locked_until);
          return lockedUntil > now;
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

    // レコードに渡す変数
    const movieTitle = formData?.movie_title;
    const posterPath = formData?.poster_path;

    // reservationsテーブルにレコード作成
    const { data: reservation, error: reservationError } = await supabase
      .from("reservations")
      .insert({
        user_id: user.id,
        total_amount: total_amount,
        payment_status: "PENDING",
        unique_code: uniqueCode,
        movie_id: scheduleData.movie_id,
        movie_title: movieTitle,
        poster_path: posterPath,
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

    // 決済フォームに渡す予約情報
    const theaterName = formData?.theater_name;
    const auditoriumName = formData?.auditorium_name;
    const Showtime = formData?.showtime;

    // Stripe Checkout セッション作成
    try {
      // 座席情報を整形
      const seatInfo = seats
        .map((s) => `${s.seat_row}列${s.seat_number}番`)
        .join(", ");

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "jpy",
              product_data: {
                name: `映画チケット予約：${movieTitle}\n`,
                description: `【映画館】${theaterName} 【スクリーン】${auditoriumName} 【上映開始時刻】${Showtime} 【座席】 ${seatInfo}`,
              },
              unit_amount: total_amount, // 既に単位は渡されている想定
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation/complete?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation/cancel?reservation_id=${reservation.id}`,
        metadata: {
          reservation_id: reservation.id.toString(),
          unique_code: uniqueCode,
        },
        expires_at: Math.floor(new Date(lockedUntil).getTime() / 1000), // 1時間後に期限切れ
      });

      // メール送信
      if (session.url && user.email) {
        await sendPaymentEmail(
          user.email,
          session.url,
          uniqueCode,
          movieTitle,
          selected_seat_ids.length,
          theaterName,
          seatInfo
        );
      }

      return {
        success: true,
        reservationId: reservation.id,
        uniqueCode: uniqueCode,
        seatCount: createdSeatReservations.length,
        checkoutUrl: session.url,
        stripeSessionId: session.id,
      };
    } catch (stripeError) {
      console.error("Stripe session creation error:", stripeError);

      // Stripe失敗時もロールバック
      await supabase
        .from("seat_reservations")
        .delete()
        .eq("reservation_id", reservation.id);
      await supabase.from("reservations").delete().eq("id", reservation.id);

      return {
        success: false,
        error: "決済セッションの作成に失敗しました",
      };
    }
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
      locked_until: lockedUntil.toISOString(),
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
