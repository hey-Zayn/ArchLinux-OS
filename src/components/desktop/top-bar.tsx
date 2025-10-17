"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Wifi, 
  Volume2, 
  Battery, 
  Power, 
  Terminal,
  Search,
  Settings,
  Cpu,
  MemoryStick,
  HardDrive,
  Monitor,
  Network
} from 'lucide-react';
import { PowerMenu } from './power-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SystemStatus {
  cpu: number;
  memory: number;
  disk: number;
  temp: number;
}

interface Workspace {
  id: number;
  name: string;
  active: boolean;
}

interface TopBarProps {
  appTitle?: string;
  onLock: () => void;
  className?: string;
  currentWorkspace?: number;
  onWorkspaceChange?: (id: number) => void;
}

const WORKSPACES: Workspace[] = [
  { id: 1, name: "", active: true },
  { id: 2, name: "", active: false },
  { id: 3, name: "", active: false },
  { id: 4, name: "", active: false },
  { id: 5, name: "", active: false },
];

export function TopBar({ 
  appTitle = "arch", 
  onLock, 
  className, 
  currentWorkspace = 1,
  onWorkspaceChange 
}: TopBarProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState(new Date());
  const [isPowerMenuOpen, setIsPowerMenuOpen] = useState(false);
  const [volume, setVolume] = useState(65);
  const [brightness, setBrightness] = useState(80);
  const [isWifiOn, setIsWifiOn] = useState(true);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cpu: 24,
    memory: 68,
    disk: 42,
    temp: 52
  });

  // Simulate system status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() * 8 - 4))),
        memory: Math.min(100, Math.max(20, prev.memory + (Math.random() * 6 - 3))),
        disk: prev.disk,
        temp: Math.min(75, Math.max(40, prev.temp + (Math.random() * 3 - 1.5)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
      setDate(now);
    };
    
    updateClock();
    const timer = setInterval(updateClock, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const togglePowerMenu = useCallback(() => {
    setIsPowerMenuOpen(prev => !prev);
  }, []);

  const getUsageColor = (usage: number) => {
    if (usage < 60) return 'text-green-400';
    if (usage < 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTempColor = (temp: number) => {
    if (temp < 50) return 'text-green-400';
    if (temp < 65) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <>
      {/* Hyprland-style Glass Top Bar */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 h-10",
          "bg-black/10 backdrop-blur-2xl border-b border-white/10",
          "text-white text-sm font-mono",
          "flex items-center justify-between",
          "px-6 z-50",
          "transition-all duration-200",
          className
        )}
      >
        {/* Left Section - Workspaces & System */}
        <div className="flex items-center gap-6">
          {/* Arch Logo */}
          <div className="flex items-center gap-2">
            {/* <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-sm" /> */}
            {/* <span className="font-semibold text-white">arch</span> */}
            <img src="./arch-logo.png" alt="Arch Linux logo" className="w-6 h-6 cursor-pointer" />
          </div>

          {/* Workspaces */}
          <div className="flex items-center gap-1">
            {WORKSPACES.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => onWorkspaceChange?.(workspace.id)}
                className={cn(
                  "w-7 h-6 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm",
                  workspace.id === currentWorkspace
                    ? "bg-white/20 text-white shadow-inner"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                )}
              >
                {workspace.name}
              </button>
            ))}
          </div>
        </div>

        {/* Center Section - System Stats */}
        <div className="flex items-center gap-6">
          {/* CPU */}
          <div className="flex items-center gap-2">
            <Cpu size={14} className={getUsageColor(systemStatus.cpu)} />
            <div className="text-xs">
              <span className={getUsageColor(systemStatus.cpu)}>
                {Math.round(systemStatus.cpu)}%
              </span>
            </div>
          </div>

          {/* Memory */}
          <div className="flex items-center gap-2">
            <MemoryStick size={14} className={getUsageColor(systemStatus.memory)} />
            <div className="text-xs">
              <span className={getUsageColor(systemStatus.memory)}>
                {Math.round(systemStatus.memory)}%
              </span>
            </div>
          </div>

          {/* Temperature */}
          <div className="flex items-center gap-2">
            <div className="text-xs">
              <span className={getTempColor(systemStatus.temp)}>
                {Math.round(systemStatus.temp)}°C
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center gap-4">
          {/* Network Status */}
          <div className="flex items-center gap-4 text-white/80">
            <div className="flex items-center gap-2">
              <Wifi 
                size={16} 
                className={cn(
                  "transition-colors",
                  isWifiOn ? "text-green-400" : "text-white/40"
                )} 
              />
              <span className="text-xs">wlp3s0</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Volume2 size={16} className="text-blue-400" />
              <span className="text-xs w-8">{volume}%</span>
            </div>

            <div className="flex items-center gap-2">
              <Battery size={16} className="text-green-400" />
              <span className="text-xs">85%</span>
            </div>
          </div>

          {/* Separator */}
          <div className="w-px h-4 bg-white/20" />

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
            >
              <Terminal size={14} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
            >
              <Search size={14} />
            </Button>
          </div>

          {/* Separator */}
          <div className="w-px h-4 bg-white/20" />

          {/* Date & Time */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="px-3 py-1 rounded-lg hover:bg-white/5 transition-colors text-xs font-medium backdrop-blur-sm">
                <div className="text-right">
                  <div>{time}</div>
                  <div className="text-white/60 text-[10px]">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white/10 backdrop-blur-2xl border-white/20">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border-none bg-transparent"
              />
            </PopoverContent>
          </Popover>

          {/* System Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                <Settings size={16} className="text-white/80" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-white/10 backdrop-blur-2xl border-white/20">
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold text-white">System Controls</h3>
                <p className="text-white/60 text-xs mt-1">Hyprland Session</p>
              </div>

              {/* Quick Stats */}
              <div className="p-4 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Cpu size={16} className={getUsageColor(systemStatus.cpu)} />
                  <div>
                    <div className="text-white text-sm">CPU</div>
                    <div className={cn("text-xs", getUsageColor(systemStatus.cpu))}>
                      {Math.round(systemStatus.cpu)}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <MemoryStick size={16} className={getUsageColor(systemStatus.memory)} />
                  <div>
                    <div className="text-white text-sm">Memory</div>
                    <div className={cn("text-xs", getUsageColor(systemStatus.memory))}>
                      {Math.round(systemStatus.memory)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi size={16} className="text-green-400" />
                    <span className="text-sm text-white">Wi-Fi</span>
                  </div>
                  <Switch 
                    checked={isWifiOn} 
                    onCheckedChange={setIsWifiOn}
                    className="data-[state=checked]:bg-green-400"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Volume</span>
                    <span className="text-white/60">{volume}%</span>
                  </div>
                  <Slider 
                    value={[volume]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0])}
                    className="flex-1"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Brightness</span>
                    <span className="text-white/60">{brightness}%</span>
                  </div>
                  <Slider 
                    value={[brightness]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setBrightness(value[0])}
                    className="flex-1"
                  />
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Power Section */}
              <div className="p-3">
                <button 
                  onClick={togglePowerMenu}
                  className="w-full px-3 py-2 text-left rounded-lg bg-red-600/50 hover:bg-red-600/80 text-white transition-colors text-sm flex items-center gap-2"
                >
                  <Power size={16} />
                  <span>Power Options</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      <PowerMenu 
        isOpen={isPowerMenuOpen} 
        onClose={togglePowerMenu} 
        onLock={onLock} 
      />
    </>
  );
}