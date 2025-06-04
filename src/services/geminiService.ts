
const GEMINI_API_KEY = 'AIzaSyBSJpsfaBZdDjxSAOW868s48KXl-kBVEHE';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export const getMovieRecommendations = async (preferences: string): Promise<string[]> => {
  try {
    const prompt = `Based on these preferences: "${preferences}", recommend 6 popular movies. Return ONLY a JSON array of movie titles, like: ["Movie 1", "Movie 2", "Movie 3", "Movie 4", "Movie 5", "Movie 6"]. No additional text or explanation.`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data: GeminiResponse = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text || '';
    
    try {
      const recommendations = JSON.parse(text);
      return Array.isArray(recommendations) ? recommendations : [];
    } catch {
      // If JSON parsing fails, try to extract movie titles from the text
      const lines = text.split('\n').filter(line => line.trim());
      return lines.slice(0, 6).map(line => line.replace(/^\d+\.\s*/, '').replace(/^["\-\*\s]+/, '').replace(/["\s]+$/, ''));
    }
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return ['The Dark Knight', 'Inception', 'Pulp Fiction', 'The Matrix', 'Interstellar', 'The Godfather'];
  }
};

export const analyzeMovie = async (movieTitle: string, plot: string): Promise<string> => {
  try {
    const prompt = `Analyze the movie "${movieTitle}" with this plot: "${plot}". Provide a thoughtful analysis covering themes, cinematography, performances, and overall impact. Keep it engaging and informative, around 200-300 words.`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data: GeminiResponse = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'Analysis not available.';
  } catch (error) {
    console.error('Error analyzing movie:', error);
    return 'Unable to analyze this movie at the moment.';
  }
};

export const getRandomRecommendations = async (): Promise<string[]> => {
  try {
    const prompt = 'Recommend 6 diverse, popular movies from different genres and time periods. Return ONLY a JSON array of movie titles, like: ["Movie 1", "Movie 2", "Movie 3", "Movie 4", "Movie 5", "Movie 6"]. No additional text.';
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    const data: GeminiResponse = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text || '';
    
    try {
      const recommendations = JSON.parse(text);
      return Array.isArray(recommendations) ? recommendations : [];
    } catch {
      return ['The Dark Knight', 'Spirited Away', 'Casablanca', 'Mad Max: Fury Road', 'Parasite', 'The Grand Budapest Hotel'];
    }
  } catch (error) {
    console.error('Error getting random recommendations:', error);
    return ['The Dark Knight', 'Spirited Away', 'Casablanca', 'Mad Max: Fury Road', 'Parasite', 'The Grand Budapest Hotel'];
  }
};
