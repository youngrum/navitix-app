import { ResponseMovieReleaseDates, ResponseMovies } from "@/types/movies";

// tmdb API全般のレスポンス型
export interface apiResponse<T> {
  config: [];
  data: T;
  headers: [];
  request: [];
  status: number;
  stausText: string;
}

// movie/now_playingと movie/upcommong の レスポンスdata型
export interface apiResponseData_Movies<T> {
  dates: [];
  page: number;
  results: T;
  total_pages: number;
  total_results: number;
}
