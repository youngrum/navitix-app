import {
  ResponseReleaseDates_release_dates,
  ResponseMovieVideos,
} from "@/types/movies";

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
export interface apiResponseMovies_results<T> {
  dates: [];
  page: number;
  results: T;
  total_pages: number;
  total_results: number;
}

// movie/{movie_id}/release_dates のレスポンスdata型
export interface ResponseReleaseDates_results {
  id: number;
  results: ResponseReleaseDates_release_dates[];
}

export interface ResponseVideos_results {
  id: number;
  results: ResponseMovieVideos[];
}
