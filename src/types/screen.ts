export interface ScreenResponse {
  id: number;
  theater_id: number;
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
