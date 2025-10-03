export interface ScreenResponse {
  theater_id: number;
  theater_name: string;
  location: string;
  auditoriums: Auditorium[];
}

export interface Auditorium {
  id: number;
  name: string;
  total_seats: number;
  movie: ScreenMovie;
  schedules: ScreenSchedule[];
}

export interface ScreenMovie {
  id: number;
  certification: string;
  genres: ScreenGenre[];
  overview: string;
  poster_path: string;
  release_date: string;
  revenue: number;
  runtime: number;
  title: string;
  vote_average: number;
  vote_count: number;
}

export interface ScreenGenre {
  id: number;
  name: string;
}

export interface ScreenSchedule {
  date: string; // "2025/09/26"
  week: string; // "金"
  day: string; // "26"
  showtimes: Showtime[];
}

export interface Showtime {
  id: number;
  play_beginning: string; // "10:00"
  start_time: string; // "2025/09/26 10:00"
  end_time: string; // "2025/09/26 12:00"
}

export const seats = [
  // スクリーンNo.1 (150席) - 10行×15列を想定
  ...Array.from({ length: 10 }, (_, rowIndex) =>
    Array.from({ length: 15 }, (_, seatIndex) => ({
      id: rowIndex * 15 + seatIndex + 1,
      auditorium_id: 1,
      seat_row: String.fromCharCode(65 + rowIndex), // A, B, C...
      seat_number: (seatIndex + 1).toString(),
      seat_type: "standard" as const,
      is_available: true,
    }))
  ).flat(),
];
