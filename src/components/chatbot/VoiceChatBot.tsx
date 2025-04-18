
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, MessageCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Avatar } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import VoiceVisualizer from './VoiceVisualizer';
import { processSpeechToText, processTextToSpeech } from '@/services/voiceService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const VoiceChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  // Initialize welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: "Hello! I'm your voice assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    // Check if the browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Try using Chrome or Edge.",
        variant: "destructive"
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = async (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');

      if (event.results[0].isFinal) {
        setInputValue(transcript);
        if (transcript.trim()) {
          await handleSendMessage(transcript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      toast({
        title: "Voice Recognition Error",
        description: `Error: ${event.error}. Please try again.`,
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      if (isListening) {
        recognition.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak clearly into your microphone",
        });
      } catch (err) {
        console.error('Error starting recognition:', err);
        toast({
          title: "Error",
          description: "Couldn't start the voice recognition. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      // Process with OpenAI
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from assistant');
      }

      const data = await response.json();
      const botResponse = data.message || "I'm sorry, I couldn't process that request.";

      // Add bot message
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Convert bot response to speech
      setIsSpeaking(true);
      await processTextToSpeech(botResponse);
      setIsSpeaking(false);
      
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "There was an issue processing your request. Please try again.",
        variant: "destructive"
      });
      
      // Add error message from bot
      const errorMessage: Message = {
        id: `bot-error-${Date.now()}`,
        text: "I'm sorry, I encountered an error processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button 
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-stripe-blue-dark hover:bg-stripe-blue-dark/90 shadow-lg"
            aria-label="Open chatbot"
          >
            <MessageCircle size={24} className="text-white" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[85vh] rounded-t-xl p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-stripe-blue-dark to-blue-700 text-white rounded-t-xl">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-white/20">
                  <div className="text-xs font-semibold">AI</div>
                </Avatar>
                <div>
                  <h3 className="font-medium">Shield Assistant</h3>
                  <p className="text-xs text-gray-200">
                    {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'How can I help?'}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-blue-500 text-white rounded-tr-none' 
                          : 'bg-white border shadow-sm rounded-tl-none'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start mb-4"
                  >
                    <div className="bg-white border p-3 rounded-lg rounded-tl-none shadow-sm">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        <span className="text-sm text-gray-500">Processing...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </div>
            
            {/* Visualizer */}
            {isListening && (
              <div className="px-4 py-2 bg-gray-50 border-t">
                <VoiceVisualizer isActive={isListening} />
              </div>
            )}
            
            {/* Input area */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  className={`rounded-full ${isListening ? 'animate-pulse' : ''}`}
                  onClick={toggleListening}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </Button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message or use voice..."
                    className="w-full p-2 pl-3 pr-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button
                  disabled={!inputValue.trim() || isProcessing}
                  onClick={() => handleSendMessage()}
                  size="icon"
                  className="rounded-full bg-stripe-blue-dark hover:bg-stripe-blue-dark/90"
                >
                  <Send size={18} className="text-white" />
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default VoiceChatBot;
