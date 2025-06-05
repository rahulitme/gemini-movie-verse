import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Film, Star, Calendar, Clock, TrendingUp, Play } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import MovieDetails from '../components/MovieDetails';
import AIRecommendations from '../components/AIRecommendations';
import VoiceAssistant from '../components/VoiceAssistant';
import ThemeToggle from '../components/ThemeToggle';
import { Movie } from '../types/movie';
import { searchMovies, getMovieByTitle } from '../services/movieService';
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
    loadFeaturedMovies();
  }, []);

  const loadFeaturedMovies = async () => {
    const featured = ['Inception', 'The Dark Knight', 'Interstellar', 'Pulp Fiction', 'The Matrix', 'Avatar'];
    const moviePromises = featured.map(title => getMovieByTitle(title));
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

  const handleVoiceSearch = (query: string) => {
    setSearchQuery(query);
    handleSearchByQuery(query);
  };

  const handleSearchByQuery = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchMovies(query);
      setMovies(results);
      if (results.length === 0) {
        toast({
          title: "No movies found",
          description: "Try searching with different keywords",
        });
      } else {
        toast({
          title: "Voice search successful",
          description: `Found ${results.length} movies for "${query}"`,
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
      const movieDetails = await getMovieByTitle(imdbID);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-indigo-950 dark:to-slate-950 transition-all duration-700">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 dark:from-purple-600/30 dark:via-pink-600/30 dark:to-blue-600/30 backdrop-blur-3xl animate-gradient"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/30 to-cyan-400/30 blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <Film className="w-16 h-16 text-purple-500 dark:text-purple-400 mr-4 animate-bounce" />
                <div className="absolute inset-0 w-16 h-16 bg-purple-500/30 rounded-full blur-xl animate-pulse"></div>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent animate-gradient">
                CineAI
              </h1>
            </div>
            
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              🎬 Discover movies with AI-powered recommendations and voice commands. 
              Experience cinema like never before with our intelligent search and personalized suggestions.
            </p>
            
            {/* Enhanced Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-purple-200 dark:border-purple-700 rounded-3xl p-2">
                  <div className="flex items-center">
                    <Search className="absolute left-6 text-purple-500 dark:text-purple-400 w-6 h-6" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for any movie... or use voice command 🎤"
                      className="w-full pl-14 pr-32 py-4 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none text-lg"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="absolute right-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-8 py-3 rounded-2xl transition-all duration-300 disabled:opacity-50 font-semibold glow-purple"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        'Search'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Enhanced AI Recommendations Button */}
            <button
              onClick={() => setShowRecommendations(true)}
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 hover:from-purple-700 hover:via-pink-600 hover:to-blue-600 text-white font-bold rounded-3xl transition-all duration-300 transform hover:scale-105 glow-purple text-lg shadow-2xl"
            >
              <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
              Get AI Recommendations ✨
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Featured Movies Section */}
      {featuredMovies.length > 0 && (
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl px-8 py-4 border border-purple-200 dark:border-purple-700 glow-purple">
              <TrendingUp className="w-8 h-8 text-purple-500 dark:text-purple-400 mr-4" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                🔥 Trending Now
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            {featuredMovies.map((movie, index) => (
              <div key={movie.imdbID} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <MovieCard
                  movie={movie}
                  onClick={() => handleMovieSelect(movie.imdbID)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Search Results */}
      {movies.length > 0 && (
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
              🎯 Search Results
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Found {movies.length} amazing movies for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {movies.map((movie, index) => (
              <div key={movie.imdbID} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                <MovieCard
                  movie={movie}
                  onClick={() => handleMovieSelect(movie.imdbID)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voice Assistant with enhanced styling */}
      <VoiceAssistant onMovieSearch={handleVoiceSearch} />

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
