
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVoiceChatbot = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatResponse, setChatResponse] = useState('');

  const startListening = useCallback(() => {
    setIsListening(true);
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setIsProcessing(true);

      try {
        const response = await supabase.functions.invoke('voice-chatbot', {
          body: JSON.stringify({ query: transcript })
        });

        setChatResponse(response.data?.response || 'Sorry, I could not understand.');
        speakResponse(response.data?.response);
      } catch (error) {
        console.error('Chatbot error:', error);
        setChatResponse('An error occurred while processing your request.');
      } finally {
        setIsProcessing(false);
        setIsListening(false);
      }
    };
    recognition.start();
  }, []);

  const speakResponse = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return {
    startListening,
    isListening,
    isProcessing,
    chatResponse
  };
};
