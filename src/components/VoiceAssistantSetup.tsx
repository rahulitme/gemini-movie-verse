
import React from 'react';

interface VoiceAssistantSetupProps {
  apiKey: string;
  agentId: string;
  onApiKeyChange: (key: string) => void;
  onAgentIdChange: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const VoiceAssistantSetup: React.FC<VoiceAssistantSetupProps> = ({
  apiKey,
  agentId,
  onApiKeyChange,
  onAgentIdChange,
  onSave,
  onCancel,
}) => {
  return (
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
        onChange={(e) => onApiKeyChange(e.target.value)}
        placeholder="API Key (sk_...)"
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 mb-3"
      />
      <input
        type="text"
        value={agentId}
        onChange={(e) => onAgentIdChange(e.target.value)}
        placeholder="Agent ID"
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
      />
      <div className="flex gap-3 mt-4">
        <button
          onClick={onSave}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Save
        </button>
        <button
          onClick={onCancel}
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
  );
};

export default VoiceAssistantSetup;
