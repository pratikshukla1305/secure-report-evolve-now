
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface VoiceVisualizerProps {
  isActive: boolean;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isActive }) => {
  const maxBars = 12;
  
  const getRandomHeight = () => Math.random() * 50 + 10;
  
  return (
    <div className="flex items-center justify-center h-12">
      <div className="flex items-end space-x-1 h-full">
        {Array.from({ length: maxBars }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ height: 5 }}
            animate={{ 
              height: isActive ? [5, getRandomHeight(), 5] : 5
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.05,
              ease: "easeInOut"
            }}
            className="w-1 bg-blue-500 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export default VoiceVisualizer;
