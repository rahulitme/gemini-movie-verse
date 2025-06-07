
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceAssistantControlsProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

const VoiceAssistantControls: React.FC<VoiceAssistantControlsProps> = ({
  isMuted,
  onToggleMute,
}) => {
  return (
    <button
      onClick={onToggleMute}
      className="p-4 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 glow-pink"
    >
      {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
    </button>
  );
};

export default VoiceAssistantControls;
