// types/seat.ts

import { Theater } from "./theater";

export type SeatType = "STANDARD"; // 将来的に "WHEELCHAIR" | "COUPLE" | "PREMIUM"なども追加可能
export type SeatStatus = "AVAILABLE" | "RESERVED" | "LOCKED";

export interface SeatsData {
  id: number;
  auditorium_id: number;
  seat_row: string;
  seat_number: string;
  seat_type: SeatType;
  is_available: boolean;
  fee: number;
}

export interface SeatReservation {
  id: number;
  seat_id: number;
  schedule_id: number;
  reservation_id: number | null;
  status: SeatStatus;
}

export interface SeatWithStatus extends SeatsData {
  status: SeatStatus;
  reservation_id: number | null;
}

// /theater/[theater_id]/screen/[auditorium_id]/seatのAPIレスポンス型
export interface SeatWithTheaterAndMovieResponse {
  theaterData: Theater;
  schedulesId: number;
  auditoriumName: string;
  seatData: SeatsData[];
  movieTitle: string;
  movieId: number;
  startTime: string; // ISO 8601形式の日時文字列
  endTime: string; // ISO 8601形式の日時文字列
}
