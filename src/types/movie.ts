
export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  Plot?: string;
  Director?: string;
  Actors?: string;
  Runtime?: string;
  Genre?: string;
  imdbRating?: string;
  Released?: string;
  Writer?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
}

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
}
