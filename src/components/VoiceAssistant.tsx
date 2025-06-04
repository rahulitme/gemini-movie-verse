
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
      // Process voice commands for movie search
      if (message.type === 'user_transcript' && message.text) {
        const searchMatch = message.text.toLowerCase().match(/search for (.+)|find (.+)|show me (.+)/);
        if (searchMatch && onMovieSearch) {
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
        // Note: You'll need to implement the agent creation and signed URL generation
        // For now, this is a placeholder for the voice functionality
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
    <div className="fixed bottom-6 right-6 z-50">
      {showApiInput && (
        <div className="mb-4 p-4 bg-gradient-to-r from-violet-900/90 to-purple-900/90 backdrop-blur-md border border-violet-500/30 rounded-2xl shadow-2xl">
          <p className="text-white text-sm mb-2">Enter your ElevenLabs API Key:</p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Your ElevenLabs API Key"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setShowApiInput(false)}
              className="px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm rounded-lg hover:from-violet-600 hover:to-purple-600 transition-all"
            >
              Save
            </button>
            <button
              onClick={() => setShowApiInput(false)}
              className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-3">
        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>

        {/* Voice Assistant Button */}
        <button
          onClick={toggleListening}
          className={`relative p-6 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 ${
            isListening
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse'
              : 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600'
          }`}
        >
          {isListening ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
          
          {/* Listening Indicator */}
          {isListening && (
            <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
          )}
        </button>
      </div>

      {/* Status Text */}
      {isListening && (
        <div className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-gradient-to-r from-violet-900/90 to-purple-900/90 backdrop-blur-md border border-violet-500/30 rounded-xl shadow-lg">
          <p className="text-white text-sm whitespace-nowrap">Listening... Say "search for [movie]"</p>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
