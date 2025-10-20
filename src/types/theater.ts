export interface TheaterSearchResponse {
  id: number;
  name: string;
  prefecture: string;
  city: string;
  address: string;
  photo_path: string;
  isShowingMovie: boolean;
}

export interface Theater {
  id: number;
  name: string;
  prefecture_id: number;
  city_id: number;
  post_code: string;
  address: string;
  photo_path: string;
}
