import { ResponseMovies } from "@/types/movies";

export interface apiResponse {
  config: [];
  data: apiResponseData;
  headers: [];
  request: [];
  status: number;
  stausText: string;
}

export interface apiResponseData {
  dates: [];
  page: number;
  results: ResponseMovies[];
  total_pages: number;
  total_results: number;
}
