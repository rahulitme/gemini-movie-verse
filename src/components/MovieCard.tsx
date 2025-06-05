
import React from 'react';
import { Movie } from '../types/movie';
import { Calendar, Star, Play, Clock } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.svg';

  return (
    <div
      className="group relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-purple-200 dark:border-purple-700 rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 dark:hover:shadow-purple-400/25 glow-purple"
      onClick={onClick}
    >
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-3xl">
        <img
          src={posterUrl}
          alt={movie.Title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full shadow-2xl transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-200 glow-purple">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-white text-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300">
              Click to view details
            </p>
          </div>
        </div>
        
        {/* Enhanced Rating Badge */}
        {movie.imdbRating && movie.imdbRating !== 'N/A' && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 backdrop-blur-sm text-white px-4 py-2 rounded-2xl text-sm font-bold flex items-center shadow-xl transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
            <Star className="w-4 h-4 mr-1 fill-current animate-pulse" />
            {movie.imdbRating}
          </div>
        )}

        {/* New Badge for recent movies */}
        {parseInt(movie.Year) >= 2020 && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
            NEW
          </div>
        )}
      </div>

      {/* Enhanced Movie Info */}
      <div className="p-6">
        <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-500 group-hover:bg-clip-text transition-all duration-300">
          {movie.Title}
        </h3>
        
        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors duration-300">
          <Calendar className="w-4 h-4 mr-2 text-purple-500 dark:text-purple-400" />
          <span className="font-medium">{movie.Year}</span>
          {movie.Runtime && (
            <>
              <Clock className="w-4 h-4 ml-4 mr-2 text-blue-500 dark:text-blue-400" />
              <span className="font-medium">{movie.Runtime}</span>
            </>
          )}
        </div>

        {movie.Genre && (
          <div className="flex flex-wrap gap-2 mb-3">
            {movie.Genre.split(', ').slice(0, 3).map((genre, index) => (
              <span
                key={genre}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300 ${
                  index === 0 
                    ? 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600' 
                    : index === 1
                    ? 'bg-gradient-to-r from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-600'
                    : 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600'
                }`}
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {movie.Plot && (
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            {movie.Plot}
          </p>
        )}
      </div>

      {/* Enhanced Hover Glow Effect */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-gradient"></div>
      </div>
    </div>
  );
};

export default MovieCard;
