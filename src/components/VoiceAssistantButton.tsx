
import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceAssistantButtonProps {
  isListening: boolean;
  onClick: () => void;
}

const VoiceAssistantButton: React.FC<VoiceAssistantButtonProps> = ({
  isListening,
  onClick,
}) => {
  return (
    <div className="relative">
      <button
        onClick={onClick}
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

export default VoiceAssistantButton;
