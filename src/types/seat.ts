// types/seat.ts

export type SeatType = "STANDARD"; // 将来的に "WHEELCHAIR" | "COUPLE" | "PREMIUM"なども追加可能
export type SeatStatus = "AVAILABLE" | "RESERVED" | "LOCKED";

export interface Seat {
  id: number;
  auditorium_id: number;
  seat_row: string;
  seat_number: string;
  seat_type: SeatType;
  is_available: boolean;
}

export interface SeatReservation {
  id: number;
  seat_id: number;
  schedule_id: number;
  reservation_id: number | null;
  status: SeatStatus;
}

export interface SeatWithStatus extends Seat {
  status: SeatStatus;
  reservation_id: number | null;
}

export interface SeatsResponse {
  schedule_id: number;
  auditorium_id: number;
  theater_id: number;
  movie_id: number;
  start_time: string;
  end_time: string;
  seats: SeatWithStatus[];
}
