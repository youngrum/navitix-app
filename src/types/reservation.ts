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
