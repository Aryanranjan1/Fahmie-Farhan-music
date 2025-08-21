"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

interface Track {
  title: string;
  artist: string;
  duration: string;
  category: string;
  image: string;
  audioUrl?: string;
}

interface AudioPlayerProps {
  tracks: Track[];
  currentTrack: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onTrackChange: (index: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
}

export default function AudioPlayer({
  tracks,
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onTrackChange,
  volume,
  onVolumeChange,
  isMuted,
  onMuteToggle
}: AudioPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrackData = tracks[currentTrack];

  // Generate demo audio using Web Audio API
  useEffect(() => {
    if (isPlaying && !audioRef.current) {
      // Create a simple demo tone using Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start();
        
        // Simulate track duration
        setDuration(30); // 30 seconds demo
        const startTime = Date.now();
        
        const interval = setInterval(() => {
          const elapsed = (Date.now() - startTime) / 1000;
          setCurrentTime(elapsed);
          
          if (elapsed >= 30) {
            clearInterval(interval);
            oscillator.stop();
            onNext();
          }
        }, 100);
        
        return () => {
          clearInterval(interval);
          oscillator.stop();
        };
      } catch (error) {
        console.error('Error creating audio context:', error);
      }
    }
  }, [isPlaying, currentTrack, onNext]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  return (
    <Card className="bg-charcoal-dark/90 backdrop-blur-sm border-fantasy-gold/30 overflow-hidden shadow-2xl">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          {/* Album Art */}
          <div className="w-20 h-20 bg-gradient-to-br from-fantasy-gold/10 to-purple-500/10 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={currentTrackData.image}
              alt={currentTrackData.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate text-fantasy-gold">
              {currentTrackData.title}
            </h3>
            <p className="text-sm text-text-muted truncate">
              {currentTrackData.artist}
            </p>
            <p className="text-xs text-text-muted">
              {currentTrackData.category} • {currentTrackData.duration}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrevious}
              className="text-fantasy-gold hover:text-fantasy-gold/80"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={onPlayPause}
              className="bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90 w-10 h-10 rounded-full"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              className="text-fantasy-gold hover:text-fantasy-gold/80"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            {/* Volume Control */}
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMuteToggle}
                className="text-fantasy-gold hover:text-fantasy-gold/80"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={(value) => onVolumeChange(value[0])}
                max={100}
                step={1}
                className="w-20"
              />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <Slider
            value={[currentTime]}
            onValueChange={handleSeek}
            max={duration || 100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-text-muted mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}