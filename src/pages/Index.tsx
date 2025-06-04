
import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Film, Star, Calendar, Clock, TrendingUp } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import MovieDetails from '../components/MovieDetails';
import AIRecommendations from '../components/AIRecommendations';
import { Movie } from '../types/movie';
import { searchMovies, getMovieDetails } from '../services/movieService';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load featured movies on initial load
    loadFeaturedMovies();
  }, []);

  const loadFeaturedMovies = async () => {
    const featured = ['Inception', 'The Dark Knight', 'Interstellar', 'Pulp Fiction', 'The Matrix', 'Avatar'];
    const moviePromises = featured.map(title => getMovieDetails(title));
    try {
      const movieResults = await Promise.all(moviePromises);
      setFeaturedMovies(movieResults.filter(movie => movie !== null));
    } catch (error) {
      console.error('Error loading featured movies:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await searchMovies(searchQuery);
      setMovies(results);
      if (results.length === 0) {
        toast({
          title: "No movies found",
          description: "Try searching with different keywords",
        });
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMovieSelect = async (imdbID: string) => {
    try {
      const movieDetails = await getMovieDetails(imdbID);
      if (movieDetails) {
        setSelectedMovie(movieDetails);
      }
    } catch (error) {
      toast({
        title: "Error loading movie details",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-3xl"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Film className="w-12 h-12 text-purple-400 mr-4" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                CineAI
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover movies with the power of AI. Get personalized recommendations, detailed analysis, and explore the world of cinema.
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for any movie..."
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </form>

            {/* AI Recommendations Button */}
            <button
              onClick={() => setShowRecommendations(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get AI Recommendations
            </button>
          </div>
        </div>
      </div>

      {/* Featured Movies Section */}
      {featuredMovies.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center mb-8">
            <TrendingUp className="w-6 h-6 text-purple-400 mr-3" />
            <h2 className="text-3xl font-bold text-white">Featured Movies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {featuredMovies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onClick={() => handleMovieSelect(movie.imdbID)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {movies.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-white mb-8">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onClick={() => handleMovieSelect(movie.imdbID)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {/* AI Recommendations Modal */}
      {showRecommendations && (
        <AIRecommendations
          onClose={() => setShowRecommendations(false)}
          onMovieSelect={handleMovieSelect}
        />
      )}
    </div>
  );
};

export default Index;
