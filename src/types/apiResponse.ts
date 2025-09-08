// tmdb API全般のレスポンス型
export interface apiResponse<T> {
  config: [];
  data: T;
  headers: [];
  request: [];
  status: number;
  stausText: string;
}

