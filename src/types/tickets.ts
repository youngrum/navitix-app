export interface ReservationData {
  id: number;
  user_id: string;
  reserved_at: string;
  total_amount: number;
  payment_status: "PENDING" | "PAID";
  unique_code: string;
  cancelled_at: string | null;
  movie_id: number;
  movie_title: string;
  poster_path: string;
  auditorium_id: number;
  start_time: string;
  end_time: string;
}
