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
