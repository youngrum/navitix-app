export interface ScreenResponse {
  id: number;
  theater_id: number;
  name: string;
  total_seats: number;
  movie: ScreenMovie;
  schedules: ScreenSchedule[];
};

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
};

export interface ScreenGenre {
  id: number;
  name: string;
};

export interface ScreenSchedule {
  id: number;
  movie_id: number;
  auditorium_id: number;
  start_time: string;
  end_time: string;
  date: string;
  week: string;
  play_beginning: string;
};
