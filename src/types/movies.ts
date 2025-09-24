// movie/now_playingと movie/upcommong の レスポンスdata型
export interface ResponseMovies_results<T> {
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

// movie/{movie_id}/videos のレスポンスdata型
export interface ResponseVideos_results {
  id: number;
  results: ResponseMovieVideos[];
}

// movie/{movie_id}/credits のレスポンスdata型
export interface ResponseCredits_casts {
  id: number;
  cast: ResponseMovieCredits[];
}


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
  poster_path: string | null;
  id: number;
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  popularity: number;
  release_date: string;
  revenue: number;
  runtime: number | null;
  status: string;
  tagline: string | null;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// movie/{movie_id}/release_dates のレスポンスdata.results型
export interface ResponseReleaseDates_release_dates {
  iso_3166_1: string; // 国コード (例: "JP", "US")
  release_dates: ResponseMovieReleaseDates[] | null | undefined;
}

// movie/{movie_id}/release_dates のレスポンスdata.results.release_dates型
export interface ResponseMovieReleaseDates {
  certification: string;
  descriptors: string[];
  iso_639_1: string;
  note: string;
  release_date: string | null;
  type: number;
}

// movie/{movie_id}/videos のレスポンスdata.results型
export interface ResponseMovieVideos {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string; // ISO 8601形式の文字列
  id: string;
}

export interface ResponseMovieCredits {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

// movie/get-detail/[movie_id]/のレスポンス型
export interface _ResponseMovieDetail {
    id : number,
    genres: { id: number; name: string }[] | string;
    overview: number | string;
    poster_path: string;
    release_date: string;
    revenue: number | string;
    runtime: number | string;
    title: string;
    vote_average: number;
    vote_count: number;
    certification: string;
}
