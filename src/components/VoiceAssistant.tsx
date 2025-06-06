
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useConversation } from '@11labs/react';

interface VoiceAssistantProps {
  onMovieSearch?: (query: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onMovieSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('elevenlabs_api_key') || '';
  });
  const [showApiInput, setShowApiInput] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [agentId, setAgentId] = useState(() => {
    return localStorage.getItem('elevenlabs_agent_id') || '';
  });

  const conversation = useConversation({
    onConnect: () => {
      console.log('Voice assistant connected');
      setIsListening(true);
    },
    onDisconnect: () => {
      setIsListening(false);
      setConversationId(null);
      console.log('Voice assistant disconnected');
    },
    onMessage: (message) => {
      console.log('Voice message received:', message);
      if (message.message && onMovieSearch) {
        const messageText = message.message.toLowerCase();
        console.log('Processing message:', messageText);
        
        // Look for movie search patterns
        const searchPatterns = [
          /search for (.+)/,
          /find (.+)/,
          /show me (.+)/,
          /look for (.+)/,
          /movie (.+)/,
          /film (.+)/
        ];
        
        for (const pattern of searchPatterns) {
          const match = messageText.match(pattern);
          if (match && match[1]) {
            const query = match[1].trim();
            console.log('Extracted search query:', query);
            onMovieSearch(query);
            return;
          }
        }
        
        // If no pattern matches, try to use the entire message as a search query
        // Remove common voice command words
        const cleanedMessage = messageText
          .replace(/^(search for|find|show me|look for|movie|film)\s+/i, '')
          .trim();
        
        if (cleanedMessage.length > 2) {
          console.log('Using cleaned message as search query:', cleanedMessage);
          onMovieSearch(cleanedMessage);
        }
      }
    },
    onError: (error) => {
      console.error('Voice assistant error:', error);
      setIsListening(false);
      setConversationId(null);
    }
  });

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('elevenlabs_api_key', apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    if (agentId) {
      localStorage.setItem('elevenlabs_agent_id', agentId);
    }
  }, [agentId]);

  const toggleListening = async () => {
    if (!apiKey.trim()) {
      setShowApiInput(true);
      return;
    }

    if (!agentId.trim()) {
      alert('Please enter your ElevenLabs Agent ID. You can find this in your ElevenLabs dashboard under Conversational AI.');
      setShowApiInput(true);
      return;
    }

    if (isListening && conversationId) {
      try {
        await conversation.endSession();
        setIsListening(false);
        setConversationId(null);
      } catch (error) {
        console.error('Error ending session:', error);
        setIsListening(false);
        setConversationId(null);
      }
    } else {
      try {
        // Request microphone access first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Generate signed URL for the conversation - using GET request with query parameter
        const response = await fetch(
          `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
          {
            method: 'GET',
            headers: {
              'xi-api-key': apiKey,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Failed to get signed URL:', errorData);
          alert('Failed to connect to ElevenLabs. Please check your API key and Agent ID. Make sure you have created a Conversational AI agent in your ElevenLabs dashboard.');
          return;
        }

        const data = await response.json();
        const id = await conversation.startSession({
          signedUrl: data.signed_url,
        });
        setConversationId(id);
        setIsListening(true);
        console.log('Conversation started with ID:', id);
      } catch (error) {
        console.error('Error starting conversation:', error);
        if (error.message?.includes('Permission denied')) {
          alert('Microphone access is required for voice commands. Please allow microphone access and try again.');
        } else if (error.message?.includes('401') || error.message?.includes('authorization')) {
          alert('Invalid API key. Please check your ElevenLabs API key and try again.');
        } else if (error.message?.includes('agent')) {
          alert('No Conversational AI agent found. Please create an agent in your ElevenLabs dashboard first.');
        } else {
          alert('Failed to start voice assistant. Please check your API key and Agent ID.');
        }
        setIsListening(false);
      }
    }
  };

  const toggleMute = async () => {
    try {
      const newVolume = isMuted ? 1 : 0;
      await conversation.setVolume({ volume: newVolume });
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const saveApiKey = () => {
    if (apiKey.trim() && agentId.trim()) {
      localStorage.setItem('elevenlabs_api_key', apiKey);
      localStorage.setItem('elevenlabs_agent_id', agentId);
      setShowApiInput(false);
    } else {
      alert('Please enter both API key and Agent ID');
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {showApiInput && (
        <div className="mb-6 p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-purple-200 dark:border-purple-700 rounded-3xl shadow-2xl max-w-sm glow-purple">
          <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
            🎤 Voice Assistant Setup
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
            Enter your ElevenLabs credentials:
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API Key (sk_...)"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 mb-3"
          />
          <input
            type="text"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            placeholder="Agent ID"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={saveApiKey}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Save
            </button>
            <button
              onClick={() => setShowApiInput(false)}
              className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            <p>Your credentials are stored locally and never sent to our servers.</p>
            <p className="mt-2 text-red-500">⚠️ Create a Conversational AI agent in your ElevenLabs dashboard first!</p>
            <p className="mt-1 text-blue-500">💡 Find your Agent ID in the ElevenLabs dashboard under Conversational AI.</p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-4">
        {/* Mute/Unmute Button */}
        {isListening && (
          <button
            onClick={toggleMute}
            className="p-4 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 glow-pink"
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        )}

        {/* Voice Assistant Button */}
        <button
          onClick={toggleListening}
          className={`relative p-8 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 ${
            isListening
              ? 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-red-600 hover:via-pink-600 hover:to-purple-600 animate-pulse glow-pink'
              : 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 glow-purple'
          }`}
        >
          {isListening ? (
            <MicOff className="w-10 h-10 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
          
          {/* Listening Indicator */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-white/40 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-2 border-white/60 animate-pulse"></div>
            </>
          )}
        </button>
      </div>

      {/* Status Text */}
      {isListening && (
        <div className="absolute bottom-full right-0 mb-6 px-6 py-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-purple-200 dark:border-purple-700 rounded-2xl shadow-2xl glow-purple">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 animate-pulse"></div>
            <p className="text-gray-900 dark:text-white text-sm font-semibold whitespace-nowrap">
              🎤 Listening... Say "search for [movie name]"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
