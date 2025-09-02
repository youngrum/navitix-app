import { ResponseMovies } from "@/types/movies";

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
export interface apiResponseData_Movies {
  dates: [];
  page: number;
  results: ResponseMovies[];
  total_pages: number;
  total_results: number;
}
