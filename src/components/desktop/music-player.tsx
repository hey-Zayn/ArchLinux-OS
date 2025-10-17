
"use client";
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Rewind, FastForward, ListMusic, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { getPath, type Directory, type File } from '@/lib/file-system';
import { cn } from '@/lib/utils';

type MusicPlayerProps = {
  fileSystem: Directory;
  onOpenFile: (path: string) => void;
};

type Song = {
  name: string;
  url: string;
};

export function MusicPlayer({ fileSystem }: MusicPlayerProps) {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const musicDir = getPath(['Home', 'Music'], fileSystem);
    if (musicDir && musicDir.type === 'directory') {
      const songs = Object.values(musicDir.children)
        .filter((item): item is File => item.type === 'file' && item.name.endsWith('.mp3'))
        .map(file => ({ name: file.name.replace('.mp3', ''), url: file.content }));
      setPlaylist(songs);
    }
  }, [fileSystem]);
  
  useEffect(() => {
    if (playlist.length > 0 && audioRef.current) {
        audioRef.current.src = playlist[currentTrackIndex].url;
        if(isPlaying) {
            audioRef.current.play();
        }
    }
  }, [currentTrackIndex, playlist, isPlaying]);
  
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };
  
  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (value: number[]) => {
      if(audioRef.current) {
          audioRef.current.currentTime = value[0];
          setProgress(value[0]);
      }
  }

  const handleVolumeChange = (value: number[]) => {
      if(audioRef.current) {
          audioRef.current.volume = value[0];
          setVolume(value[0]);
      }
  }
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  if (playlist.length === 0) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-card text-foreground">
            <p>No music found in ~/Home/Music</p>
        </div>
      )
  }

  const currentSong = playlist[currentTrackIndex];

  return (
    <div className="h-full w-full bg-card text-foreground flex flex-col p-4">
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={playNext}
        src={currentSong.url}
      />
      
      <Card className="bg-secondary/50 border-none flex-grow flex flex-col">
        <CardContent className="p-6 flex flex-col items-center justify-center flex-grow">
          <ListMusic className="w-24 h-24 text-primary/70 mb-4" />
          <h2 className="text-lg font-bold text-center">{currentSong.name}</h2>
          <p className="text-sm text-muted-foreground">Unknown Artist</p>
        </CardContent>
        <div className="p-6 pt-0 space-y-4">
            <div className="space-y-1">
                <Slider 
                    value={[progress]}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleProgressChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" onClick={playPrev}>
              <Rewind className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="w-16 h-16 rounded-full bg-primary/20 hover:bg-primary/30" onClick={togglePlayPause}>
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNext}>
              <FastForward className="h-6 w-6" />
            </Button>
          </div>
           <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider 
                    defaultValue={[volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                />
            </div>
        </div>
      </Card>
      
      <div className="flex-shrink-0 mt-4 h-1/3 overflow-y-auto">
        <h3 className="text-sm font-semibold mb-2 px-2">Playlist</h3>
        <div className="space-y-1">
            {playlist.map((song, index) => (
                <button 
                    key={index} 
                    className={cn("w-full text-left p-2 rounded-md text-sm",
                        index === currentTrackIndex ? 'bg-primary/20 text-primary' : 'hover:bg-secondary/50'
                    )}
                    onClick={() => setCurrentTrackIndex(index)}
                >
                    {song.name}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}
