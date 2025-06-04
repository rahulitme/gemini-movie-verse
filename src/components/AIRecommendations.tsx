
import React, { useState, useEffect } from 'react';
import { X, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { getMovieRecommendations, getRandomRecommendations } from '../services/geminiService';
import { getMovieByTitle } from '../services/movieService';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface AIRecommendationsProps {
  onClose: () => void;
  onMovieSelect: (imdbID: string) => void;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ onClose, onMovieSelect }) => {
  const [preferences, setPreferences] = useState('');
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Load random recommendations on mount
    loadRandomRecommendations();
  }, []);

  const loadRandomRecommendations = async () => {
    setLoading(true);
    try {
      const titles = await getRandomRecommendations();
      const moviePromises = titles.map(title => getMovieByTitle(title));
      const movies = await Promise.all(moviePromises);
      setRecommendations(movies.filter(movie => movie !== null));
    } catch (error) {
      console.error('Error loading random recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    if (!preferences.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    try {
      const titles = await getMovieRecommendations(preferences);
      const moviePromises = titles.map(title => getMovieByTitle(title));
      const movies = await Promise.all(moviePromises);
      setRecommendations(movies.filter(movie => movie !== null));
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    onMovieSelect(movie.imdbID);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 border border-white/20 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900/90 to-purple-900/90 backdrop-blur-md p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sparkles className="w-8 h-8 text-purple-400 mr-3" />
              <h2 className="text-3xl font-bold text-white">AI Movie Recommendations</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Preferences Input */}
          <div className="mb-8">
            <label className="block text-white text-lg font-semibold mb-4">
              Tell me what you're in the mood for:
            </label>
            <div className="space-y-4">
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="e.g., Action movies with superheroes, romantic comedies from the 90s, sci-fi films with time travel, psychological thrillers..."
                className="w-full h-32 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={handleGetRecommendations}
                  disabled={loading || !preferences.trim()}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  {loading ? 'Getting Recommendations...' : 'Get AI Recommendations'}
                </button>
                
                <button
                  onClick={loadRandomRecommendations}
                  disabled={loading}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Random Picks
                </button>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">
              {hasSearched ? 'Recommended for You' : 'Popular Picks'}
            </h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-300">Finding perfect movies for you...</span>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    onClick={() => handleMovieClick(movie)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">
                  Tell me what you're looking for and I'll find the perfect movies for you!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
