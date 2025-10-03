import { seats, seatReservations } from "@/lib/seatTable";
import { schedules } from "@/lib/screenDB";
import searchTheaterLocalApi from "@/services/searchTheaterLocalApi";

// シートのデータ取得
export async function getSeatData(
  theaterId: string,
  auditoriumId: string,
  scheduleId: string
) {
  const theater_id = Number(theaterId);
  const auditorium_id = Number(auditoriumId);
  const schedule_id = Number(scheduleId);

  console.log("seat page params:", theater_id, auditorium_id, schedule_id);
  try {
    const res = await searchTheaterLocalApi.get(
      `/getSeatsStatus/${theater_id}/${auditorium_id}/${schedule_id}/`
    );
    return res.data;
  } catch (error) {
    console.error("Failed to fetch seat data", error);
    return null;
  }
}

// 特定の上映回の座席情報を取得する関数
export function getSeatsForSchedule(
  theaterId: number,
  auditoriumId: number,
  scheduleId: number
) {
  // 該当するスケジュールを取得
  const schedule = schedules.find((s) => s.id === scheduleId);
  if (!schedule) return null;

  // 該当する劇場の座席マスタを取得
  const auditoriumSeats = seats.filter((s) => s.auditorium_id === auditoriumId);

  // 該当するスケジュールの予約状況を取得
  const reservations = seatReservations.filter(
    (r) => r.schedule_id === scheduleId
  );

  // 座席マスタと予約状況をマージ
  const seatsWithStatus = auditoriumSeats.map((seat) => {
    const reservation = reservations.find((r) => r.seat_id === seat.id);
    return {
      ...seat,
      status: reservation?.status || "available",
      reservation_id: reservation?.reservation_id || null,
    };
  });

  return {
    schedule_id: scheduleId,
    auditorium_id: auditoriumId,
    theater_id: theaterId,
    movie_id: schedule.movie_id,
    start_time: schedule.start_time,
    end_time: schedule.end_time,
    seats: seatsWithStatus,
  };
}
