
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";

interface VoiceRecordingPlayerProps {
  recordingUrl: string;
  label?: string;
  compact?: boolean;
}

const VoiceRecordingPlayer: React.FC<VoiceRecordingPlayerProps> = ({
  recordingUrl,
  label = "Recording",
  compact = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Create audio element when component mounts
  useEffect(() => {
    const audio = new Audio();
    
    // Add event listeners
    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('canplaythrough', () => {
      console.log('Audio can play through');
      setIsLoading(false);
      setDuration(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e, audio.error);
      setError(`Failed to load audio: ${audio.error?.message || 'Unknown error'}`);
      setIsPlaying(false);
      setIsLoading(false);
      
      toast({
        title: "Audio Error",
        description: "Could not play the voice recording. The file may be missing or in an unsupported format.",
        variant: "destructive",
      });
    });
    
    audioRef.current = audio;
    
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
        audioRef.current.removeEventListener('canplaythrough', () => setIsLoading(false));
        audioRef.current.removeEventListener('timeupdate', () => {});
        audioRef.current.removeEventListener('error', () => {});
      }
    };
  }, [toast]);

  // Update audio source when recordingUrl changes
  useEffect(() => {
    if (audioRef.current && recordingUrl) {
      console.log('Setting audio source to:', recordingUrl);
      audioRef.current.src = recordingUrl;
      audioRef.current.load();
      setError(null);
    }
  }, [recordingUrl]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) {
      console.error('Audio ref is null');
      return;
    }
    
    if (!recordingUrl) {
      console.error('No recording URL provided');
      toast({
        title: "Missing Audio",
        description: "No voice recording URL was provided.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (isPlaying) {
        console.log('Pausing audio');
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        console.log('Attempting to play audio from:', recordingUrl);
        setIsLoading(true);
        setError(null);
        
        // Ensure we're using the latest URL
        audioRef.current.src = recordingUrl;
        
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Audio playing successfully');
              setIsPlaying(true);
              toast({
                title: "Playing Recording",
                description: "Voice recording is now playing.",
              });
            })
            .catch(err => {
              console.error("Error playing audio:", err);
              setError(`Failed to play audio: ${err.message}`);
              setIsLoading(false);
              
              toast({
                title: "Audio Error",
                description: "Could not play the voice recording. The file may be missing or corrupted.",
                variant: "destructive",
              });
            });
        }
      }
    } catch (error: any) {
      console.error("VoiceRecordingPlayer error:", error);
      setError(`An unexpected error occurred: ${error.message}`);
      setIsLoading(false);
      
      toast({
        title: "Error",
        description: "An unexpected error occurred with the audio player.",
        variant: "destructive",
      });
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  // If URL is empty, show a different state
  if (!recordingUrl) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        disabled={true}
        className="border-gray-300 text-gray-400"
      >
        <AlertTriangle className="h-4 w-4 mr-1" />
        No Recording Available
      </Button>
    );
  }

  // Compact layout for list views
  if (compact) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        onClick={handlePlayPause}
        disabled={isLoading || !!error}
        className={`${error ? 'border-red-500 text-red-600 hover:bg-red-50' : 'border-purple-500 text-purple-600 hover:bg-purple-50'}`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </span>
        ) : isPlaying ? (
          <>
            <Pause className="h-4 w-4 mr-1" />
            Pause {label}
          </>
        ) : error ? (
          <>
            <AlertTriangle className="h-4 w-4 mr-1" />
            Audio Unavailable
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-1" />
            Play {label}
          </>
        )}
      </Button>
    );
  }

  // Full-featured player
  return (
    <div className="bg-gray-50 p-3 rounded-lg w-full">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">{label}</h4>
        <span className="text-xs text-gray-500">
          {formatTime(currentTime)} / {duration ? formatTime(duration) : '--:--'}
        </span>
      </div>
      
      <div className="space-y-2">
        {/* Playback progress slider */}
        {duration > 0 && (
          <Slider
            value={[currentTime]}
            min={0}
            max={duration}
            step={0.1}
            onValueChange={handleSeek}
            disabled={isLoading || !!error || !duration}
            className="my-2"
          />
        )}
        
        <div className="flex items-center space-x-2">
          <Button 
            size="sm"
            variant={isPlaying ? "secondary" : "default"}
            onClick={handlePlayPause}
            disabled={isLoading || !!error}
            className="w-24"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span className="ml-2">{isLoading ? "Loading" : isPlaying ? "Pause" : "Play"}</span>
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleMute}
                  disabled={isLoading || !!error}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMuted ? "Unmute" : "Mute"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            disabled={isLoading || !!error}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceRecordingPlayer;
