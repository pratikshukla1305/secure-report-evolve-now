
import React from 'react';
import { Mic, StopCircle } from 'lucide-react';
import { useVoiceChatbot } from '@/utils/voiceChatbot';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceChatbot: React.FC = () => {
  const { startListening, isListening, isProcessing, chatResponse } = useVoiceChatbot();

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Card className="w-80 shadow-xl">
        <CardContent className="p-4">
          <div className="flex flex-col items-center">
            <Button 
              onClick={startListening} 
              disabled={isListening || isProcessing}
              className="mb-4"
              variant={isListening ? 'destructive' : 'default'}
            >
              {isListening ? (
                <>
                  <StopCircle className="mr-2" /> Stop Listening
                </>
              ) : (
                <>
                  <Mic className="mr-2" /> Start Voice Command
                </>
              )}
            </Button>

            <AnimatePresence>
              {(isProcessing || chatResponse) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="text-center"
                >
                  {isProcessing && (
                    <p className="text-muted-foreground animate-pulse">Processing...</p>
                  )}
                  {chatResponse && (
                    <p className="mt-2 text-sm">{chatResponse}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceChatbot;
