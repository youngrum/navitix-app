// movie/now_playingと movie/upcommong のdata.results型
export interface ResponseMovies {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// movie/{movie_id} のレスポンス型
export interface ResponseMovieDetail {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: object | null;
  overview: string | null;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// movie/{movie_id}/release_dates のレスポンス型
export interface ResponseMovieReleaseDates {
  certification: string;
  descriptors: string[];
  iso_639_1: string;
  note: string;
  release_date: string; // ISO 8601形式の文字列
  type: number;
}

// 2. 特定の国の公開日情報を表す型
export interface CountryRelease {
  iso_3166_1: string; // 国コード (例: "JP", "US")
  release_dates: ResponseMovieReleaseDates[];
}

// 3. 全体のAPIレスポンスを表す型
export interface ReleaseDatesResponse {
  id: number;
  results: CountryRelease[];
}
