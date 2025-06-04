
import React, { useState, useEffect } from 'react';
import { Movie } from '../types/movie';
import { X, Star, Calendar, Clock, Globe, Award, DollarSign, Play, Sparkles } from 'lucide-react';
import { analyzeMovie } from '../services/geminiService';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    if (movie.Plot && movie.Plot !== 'N/A') {
      loadAIAnalysis();
    }
  }, [movie]);

  const loadAIAnalysis = async () => {
    setLoadingAnalysis(true);
    try {
      const analysis = await analyzeMovie(movie.Title, movie.Plot || '');
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error loading AI analysis:', error);
      setAiAnalysis('AI analysis is currently unavailable.');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const posterUrl = movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.svg';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 border border-white/20 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900/90 to-purple-900/90 backdrop-blur-md p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">{movie.Title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Poster */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <img
                  src={posterUrl}
                  alt={movie.Title}
                  className="w-full rounded-2xl shadow-2xl"
                />
                
                {/* Quick Stats */}
                <div className="mt-6 space-y-3">
                  {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 mr-2 fill-current" />
                        <span className="text-white font-medium">IMDb Rating</span>
                      </div>
                      <span className="text-yellow-400 font-bold">{movie.imdbRating}/10</span>
                    </div>
                  )}
                  
                  {movie.Released && movie.Released !== 'N/A' && (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-blue-400 mr-2" />
                        <span className="text-white font-medium">Released</span>
                      </div>
                      <span className="text-blue-400">{movie.Released}</span>
                    </div>
                  )}
                  
                  {movie.Runtime && movie.Runtime !== 'N/A' && (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-green-400 mr-2" />
                        <span className="text-white font-medium">Runtime</span>
                      </div>
                      <span className="text-green-400">{movie.Runtime}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Plot */}
              {movie.Plot && movie.Plot !== 'N/A' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Plot</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">{movie.Plot}</p>
                </div>
              )}

              {/* Genres */}
              {movie.Genre && movie.Genre !== 'N/A' && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.Genre.split(', ').map((genre) => (
                      <span
                        key={genre}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full border border-purple-500/30"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cast & Crew */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {movie.Director && movie.Director !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Director</h3>
                    <p className="text-gray-300">{movie.Director}</p>
                  </div>
                )}
                
                {movie.Writer && movie.Writer !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Writer</h3>
                    <p className="text-gray-300">{movie.Writer}</p>
                  </div>
                )}
              </div>

              {movie.Actors && movie.Actors !== 'N/A' && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Cast</h3>
                  <p className="text-gray-300">{movie.Actors}</p>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {movie.Language && movie.Language !== 'N/A' && (
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Globe className="w-5 h-5 text-blue-400 mr-2" />
                      <span className="text-white font-medium">Language</span>
                    </div>
                    <p className="text-gray-300">{movie.Language}</p>
                  </div>
                )}
                
                {movie.Awards && movie.Awards !== 'N/A' && (
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Award className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="text-white font-medium">Awards</span>
                    </div>
                    <p className="text-gray-300">{movie.Awards}</p>
                  </div>
                )}
                
                {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center mb-2">
                      <DollarSign className="w-5 h-5 text-green-400 mr-2" />
                      <span className="text-white font-medium">Box Office</span>
                    </div>
                    <p className="text-gray-300">{movie.BoxOffice}</p>
                  </div>
                )}
              </div>

              {/* AI Analysis */}
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <Sparkles className="w-6 h-6 text-purple-400 mr-3" />
                  <h3 className="text-2xl font-bold text-white">AI Analysis</h3>
                </div>
                
                {loadingAnalysis ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-300">Analyzing movie...</span>
                  </div>
                ) : (
                  <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{aiAnalysis}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
