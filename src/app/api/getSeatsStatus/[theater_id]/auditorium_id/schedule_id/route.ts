// app/api/getSeatsStatus/[theater_id]/[auditorium_id]/[schedule_id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { schedules, auditoriums } from "@/lib/screenDB";
import { seats, seatReservations } from "@/lib/seatTable";

interface SeatsParams {
  theater_id: string;
  auditorium_id: string;
  schedule_id: string;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<SeatsParams> }
) {
  try {
    const { theater_id, auditorium_id, schedule_id } = await params;

    // パラメータを数値に変換
    const theaterIdNum = parseInt(theater_id);
    const auditoriumIdNum = parseInt(auditorium_id);
    const scheduleIdNum = parseInt(schedule_id);
    console.log(
      "testconsolelog>>>>>>>",
      theaterIdNum,
      auditoriumIdNum,
      scheduleIdNum
    );

    // バリデーション
    if (isNaN(theaterIdNum) || isNaN(auditoriumIdNum) || isNaN(scheduleIdNum)) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    // スケジュールの存在確認
    const schedule = schedules.find((s) => s.id === scheduleIdNum);
    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    // auditoriumの存在確認
    const auditorium = auditoriums.find(
      (a) => a.id === auditoriumIdNum && a.theater_id === theaterIdNum
    );
    if (!auditorium) {
      return NextResponse.json(
        { error: "Auditorium not found" },
        { status: 404 }
      );
    }

    // 該当するauditoriumの座席マスタを取得
    const auditoriumSeats = seats.filter(
      (s) => s.auditorium_id === auditoriumIdNum
    );

    // 該当するスケジュールの予約状況を取得
    const reservations = seatReservations.filter(
      (r) => r.schedule_id === scheduleIdNum
    );

    // 座席マスタと予約状況をマージ
    const seatsWithStatus = auditoriumSeats.map((seat) => {
      const reservation = reservations.find((r) => r.seat_id === seat.id);
      return {
        id: seat.id,
        auditorium_id: seat.auditorium_id,
        seat_row: seat.seat_row,
        seat_number: seat.seat_number,
        seat_type: seat.seat_type,
        is_available: seat.is_available,
        status: reservation?.status || "available",
        reservation_id: reservation?.reservation_id || null,
      };
    });

    // レスポンスデータを構築
    const response = {
      schedule_id: scheduleIdNum,
      auditorium_id: auditoriumIdNum,
      auditorium_name: auditorium.name,
      theater_id: theaterIdNum,
      movie_id: schedule.movie_id,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      total_seats: auditorium.total_seats,
      available_seats: seatsWithStatus.filter((s) => s.status === "available")
        .length,
      seats: seatsWithStatus,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching seats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
