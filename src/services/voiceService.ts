
// Service for handling speech-to-text and text-to-speech operations

// Process speech to text using browser's Web Speech API
export const processSpeechToText = (
  onResult: (text: string) => void,
  onError?: (error: string) => void
): { stop: () => void } => {
  // Check if browser supports speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    if (onError) onError('Speech recognition not supported in this browser');
    return { stop: () => {} };
  }
  
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = true;
  
  recognition.onresult = (event: any) => {
    const transcript = Array.from(event.results)
      .map((result: any) => result[0])
      .map((result) => result.transcript)
      .join('');
      
    if (event.results[0].isFinal) {
      onResult(transcript);
    }
  };
  
  recognition.onerror = (event: any) => {
    if (onError) onError(event.error);
    console.error('Speech recognition error:', event.error);
  };
  
  recognition.start();
  
  return {
    stop: () => recognition.stop()
  };
};

// Text to speech using Web Speech API
export const processTextToSpeech = async (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      reject('Speech synthesis not supported in this browser');
      return;
    }

    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice and speech parameters
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to use a higher quality voice if available
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || voice.name.includes('Samantha')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onend = () => {
      resolve();
    };
    
    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      reject(error);
    };
    
    speechSynthesis.speak(utterance);
  });
};
