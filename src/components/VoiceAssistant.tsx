import React, { useState, useEffect } from 'react';
import { useConversation } from '@11labs/react';
import VoiceAssistantSetup from './VoiceAssistantSetup';
import VoiceAssistantButton from './VoiceAssistantButton';
import VoiceAssistantControls from './VoiceAssistantControls';

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

  // Helper function to check if a message should trigger a movie search
  const shouldTriggerMovieSearch = (messageText: string): boolean => {
    const lowerMessage = messageText.toLowerCase();
    
    // Skip AI support responses
    const skipPatterns = [
      'i am sorry',
      'i cannot fulfill',
      'i do not have the functionality',
      'how can i help you',
      'anything else i can help',
      'elevenlabs support',
      'i\'m not familiar with',
      'could you please clarify'
    ];
    
    if (skipPatterns.some(pattern => lowerMessage.includes(pattern))) {
      return false;
    }
    
    // Check for movie search intentions
    const moviePatterns = [
      /search for (.+)/,
      /find (.+)/,
      /show me (.+)/,
      /look for (.+)/,
      /movie (.+)/,
      /film (.+)/,
      /watch (.+)/,
      /recommend (.+)/
    ];
    
    return moviePatterns.some(pattern => pattern.test(lowerMessage));
  };

  // Helper function to extract movie query from user message
  const extractMovieQuery = (messageText: string): string | null => {
    const lowerMessage = messageText.toLowerCase();
    
    const searchPatterns = [
      /search for (.+)/,
      /find (.+)/,
      /show me (.+)/,
      /look for (.+)/,
      /movie (.+)/,
      /film (.+)/,
      /watch (.+)/,
      /recommend (.+)/
    ];
    
    for (const pattern of searchPatterns) {
      const match = lowerMessage.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return null;
  };

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
        const messageText = message.message;
        console.log('Processing message:', messageText);
        
        // Only process user messages, not AI responses
        if (message.source === 'user' && shouldTriggerMovieSearch(messageText)) {
          const query = extractMovieQuery(messageText);
          if (query) {
            console.log('Extracted movie search query:', query);
            onMovieSearch(query);
          }
        } else if (message.source === 'ai') {
          console.log('Skipping AI response:', messageText);
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
        <VoiceAssistantSetup
          apiKey={apiKey}
          agentId={agentId}
          onApiKeyChange={setApiKey}
          onAgentIdChange={setAgentId}
          onSave={saveApiKey}
          onCancel={() => setShowApiInput(false)}
        />
      )}
      
      <div className="flex flex-col gap-4">
        {/* Mute/Unmute Button */}
        {isListening && (
          <VoiceAssistantControls
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />
        )}

        {/* Voice Assistant Button */}
        <VoiceAssistantButton
          isListening={isListening}
          onClick={toggleListening}
        />
      </div>
    </div>
  );
};

export default VoiceAssistant;
