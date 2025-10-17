export interface CreateReservationParams {
  theater_name: string;
  selected_seat_ids: number[];
  auditorium_id: number;
  auditorium_name: string;
  schedules_id: number;
  movie_title: string;
  poster_path: string;
  showtime: string;
  total_amount: number;
}

export interface ReservationsTable {
  id: number;
  user_id: string;
  reserved_at: string;
  total_amount: number;
  payment_status: PaymentStatus;
  unique_code: string;
  cancelled_at: string | null;
  movie_id: number;
  auditorium_id: number;
  start_time: string;
  end_time: string;
  movie_title: string;
  poster_path: string | null;
  seats: string;
  paid_at: string | null;
}

export type PaymentStatus = "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";
