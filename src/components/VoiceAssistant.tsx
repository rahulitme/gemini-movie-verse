
import React, { useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useConversation } from '@11labs/react';

interface VoiceAssistantProps {
  onMovieSearch?: (query: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onMovieSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Voice assistant connected');
    },
    onDisconnect: () => {
      setIsListening(false);
      console.log('Voice assistant disconnected');
    },
    onMessage: (message) => {
      console.log('Voice message:', message);
      if (message.message && onMovieSearch) {
        const searchMatch = message.message.toLowerCase().match(/search for (.+)|find (.+)|show me (.+)/);
        if (searchMatch) {
          const query = searchMatch[1] || searchMatch[2] || searchMatch[3];
          onMovieSearch(query);
        }
      }
    },
    onError: (error) => {
      console.error('Voice assistant error:', error);
      setIsListening(false);
    }
  });

  const toggleListening = async () => {
    if (!apiKey) {
      setShowApiInput(true);
      return;
    }

    if (isListening) {
      await conversation.endSession();
      setIsListening(false);
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsListening(true);
      } catch (error) {
        console.error('Microphone access denied:', error);
      }
    }
  };

  const toggleMute = async () => {
    const newVolume = isMuted ? 1 : 0;
    await conversation.setVolume({ volume: newVolume });
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {showApiInput && (
        <div className="mb-6 p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-purple-200 dark:border-purple-700 rounded-3xl shadow-2xl max-w-sm glow-purple">
          <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
            🎤 Voice Assistant Setup
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">Enter your ElevenLabs API Key to enable voice commands:</p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Your ElevenLabs API Key"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowApiInput(false)}
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
        </div>
      )}
      
      <div className="flex flex-col gap-4">
        {/* Enhanced Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="p-4 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 glow-pink"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>

        {/* Enhanced Voice Assistant Button */}
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
          
          {/* Enhanced Listening Indicator */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-white/40 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-2 border-white/60 animate-pulse"></div>
            </>
          )}
        </button>
      </div>

      {/* Enhanced Status Text */}
      {isListening && (
        <div className="absolute bottom-full right-0 mb-6 px-6 py-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-purple-200 dark:border-purple-700 rounded-2xl shadow-2xl glow-purple">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 animate-pulse"></div>
            <p className="text-gray-900 dark:text-white text-sm font-semibold whitespace-nowrap">
              🎤 Listening... Say "search for [movie]"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
