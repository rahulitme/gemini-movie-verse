
import React from 'react';
import { Movie } from '../types/movie';
import { Calendar, Star, Play } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.svg';

  return (
    <div
      className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/25"
      onClick={onClick}
    >
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.Title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-center mb-2">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        {/* Rating Badge */}
        {movie.imdbRating && movie.imdbRating !== 'N/A' && (
          <div className="absolute top-3 right-3 bg-yellow-500/90 backdrop-blur-sm text-black px-2 py-1 rounded-lg text-sm font-semibold flex items-center">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {movie.imdbRating}
          </div>
        )}
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {movie.Title}
        </h3>
        
        <div className="flex items-center text-gray-400 text-sm mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{movie.Year}</span>
        </div>

        {movie.Genre && (
          <div className="flex flex-wrap gap-1 mb-2">
            {movie.Genre.split(', ').slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
      </div>
    </div>
  );
};

export default MovieCard;
