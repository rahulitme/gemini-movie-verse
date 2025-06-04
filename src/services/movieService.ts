
import { Movie, SearchResponse } from '../types/movie';

const OMDB_API_KEY = '2bcb4192';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await fetch(`${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
    const data: SearchResponse = await response.json();
    
    if (data.Response === 'True' && data.Search) {
      return data.Search;
    }
    return [];
  } catch (error) {
    console.error('Error searching movies:', error);
    throw new Error('Failed to search movies');
  }
};

export const getMovieDetails = async (imdbID: string): Promise<Movie | null> => {
  try {
    const response = await fetch(`${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`);
    const data: Movie = await response.json();
    
    if (data.imdbID) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw new Error('Failed to fetch movie details');
  }
};

export const getMovieByTitle = async (title: string): Promise<Movie | null> => {
  try {
    const response = await fetch(`${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&plot=full`);
    const data: Movie = await response.json();
    
    if (data.imdbID) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching movie by title:', error);
    return null;
  }
};
