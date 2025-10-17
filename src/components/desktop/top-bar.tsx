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
  Bell,
  BellOff,
  Bluetooth,
  Monitor,
  Zap,
  Clock,
  Calendar as CalendarIcon,
  Network,
  HardDrive,
  Thermometer,
  User,
  Moon,
  Sun,
  ActivitySquare
} from 'lucide-react';
import { PowerMenu } from './power-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SystemStatus {
  cpu: number;
  memory: number;
  disk: number;
  temp: number;
  network: number;
}

interface Workspace {
  id: number;
  name: string;
  active: boolean;
  apps: string[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface TopBarProps {
  appTitle?: string;
  onLock: () => void;
  className?: string;
  currentWorkspace?: number;
  onWorkspaceChange?: (id: number) => void;
  onOpenApp?: (appId: string) => void;
}

const WORKSPACES: Workspace[] = [
  { id: 1, name: "", active: true, apps: ["term", "code"] },
  { id: 2, name: "", active: false, apps: ["browser"] },
  { id: 3, name: "", active: false, apps: [] },
  { id: 4, name: "", active: false, apps: ["music"] },
  { id: 5, name: "", active: false, apps: [] },
];

const NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'System Update', message: 'Security patches available', time: '2m', read: false },
  { id: '2', title: 'Backup Complete', message: 'System backup successful', time: '1h', read: true },
];

export function TopBar({ 
  appTitle = "arch", 
  onLock, 
  className, 
  currentWorkspace = 1,
  onWorkspaceChange,
  onOpenApp 
}: TopBarProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState(new Date());
  const [isPowerMenuOpen, setIsPowerMenuOpen] = useState(false);
  const [volume, setVolume] = useState(65);
  const [brightness, setBrightness] = useState(80);
  const [isWifiOn, setIsWifiOn] = useState(true);
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);
  const [isDND, setIsDND] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(1);
  const [batteryTime, setBatteryTime] = useState('3h 45m');
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cpu: 24,
    memory: 68,
    disk: 42,
    temp: 52,
    network: 45
  });

  // Simulate system status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() * 8 - 4))),
        memory: Math.min(100, Math.max(20, prev.memory + (Math.random() * 6 - 3))),
        disk: prev.disk,
        temp: Math.min(75, Math.max(40, prev.temp + (Math.random() * 3 - 1.5))),
        network: Math.min(100, Math.max(10, prev.network + (Math.random() * 20 - 10)))
      }));
    }, 2000);

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
    if (usage < 60) return 'text-gray-400';
    if (usage < 80) return 'text-gray-300';
    return 'text-gray-200';
  };

  const getBatteryColor = (level: number) => {
    if (level > 70) return 'text-gray-300';
    if (level > 30) return 'text-gray-400';
    return 'text-gray-500';
  };

  const handleMarkAllAsRead = useCallback(() => {
    setUnreadNotifications(0);
  }, []);

  const currentWorkspaceData = useMemo(() => 
    WORKSPACES.find(ws => ws.id === currentWorkspace),
    [currentWorkspace]
  );

  return (
    <>
      {/* Modern Minimalist Top Bar */}
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 h-10",
          "bg-black/10 backdrop-blur-2xl border-b border-gray-800",
          "text-gray-400 text-sm font-mono",
          "flex items-center justify-between",
          "px-4 z-50",
          "transition-all duration-200",
          className
        )}
      >
        {/* Left Section - Enhanced Workspaces */}
        <div className="flex items-center gap-4">
          {/* Arch Logo with Status */}
          <div className="flex items-center gap-2">
            <img src="./arch-logo.png" alt="" className='w-8 h-8' />
          </div>

          {/* Enhanced Workspaces with App Indicators */}
          <div className="flex items-center gap-1">
            {WORKSPACES.map((workspace) => (
              <Popover key={workspace.id}>
                <PopoverTrigger asChild>
                  <button
                    onClick={() => onWorkspaceChange?.(workspace.id)}
                    className={cn(
                      "w-6 h-6 rounded text-xs transition-all duration-200 relative group",
                      workspace.id === currentWorkspace
                        ? "bg-white/30 text-gray-900"
                        : "bg-white/10 text-gray-400 hover:bg-white/20 "
                    )}
                  >
                   
                    {/* App activity dots */}
                    {workspace.apps.length > 0 && (
                      <div className="absolute -bottom-1 inset-x-0 flex justify-center gap-0.5">
                        {workspace.apps.slice(0, 2).map((_, index) => (
                          <div key={index} className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        ))}
                      </div>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-32 p-2 bg-black/95 backdrop-blur-2xl border-gray-700">
                  <div className="text-xs text-gray-500 px-1 py-0.5">Workspace {workspace.id}</div>
                  {workspace.apps.length > 0 && (
                    <div className="space-y-1 mt-1">
                      {workspace.apps.map((app, index) => (
                        <div key={index} className="text-xs text-gray-400 px-1 py-0.5">
                          {app}
                        </div>
                      ))}
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>

        {/* Center Section - Enhanced System Stats */}
        <div className="flex items-center gap-6">
          {/* CPU with Live Graph */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer group">
                <Cpu size={12} className={getUsageColor(systemStatus.cpu)} />
                <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-400 rounded-full transition-all duration-500"
                    style={{ width: `${systemStatus.cpu}%` }}
                  />
                </div>
                <span className={cn("text-xs w-6", getUsageColor(systemStatus.cpu))}>
                  {Math.round(systemStatus.cpu)}%
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-3 bg-black/95 backdrop-blur-2xl border-gray-700">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">CPU Usage</span>
                  <span className={cn("text-xs font-mono", getUsageColor(systemStatus.cpu))}>
                    {Math.round(systemStatus.cpu)}%
                  </span>
                </div>
                <Progress value={systemStatus.cpu} className="h-1 bg-gray-800" />
                <div className="text-xs text-gray-500">8 cores • 3.2GHz</div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Memory */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer group">
                <MemoryStick size={12} className={getUsageColor(systemStatus.memory)} />
                <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-400 rounded-full transition-all duration-500"
                    style={{ width: `${systemStatus.memory}%` }}
                  />
                </div>
                <span className={cn("text-xs w-6", getUsageColor(systemStatus.memory))}>
                  {Math.round(systemStatus.memory)}%
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-3 bg-black/95 backdrop-blur-2xl border-gray-700">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Memory</span>
                  <span className={cn("text-xs font-mono", getUsageColor(systemStatus.memory))}>
                    {Math.round(systemStatus.memory)}%
                  </span>
                </div>
                <Progress value={systemStatus.memory} className="h-1 bg-gray-800" />
                <div className="text-xs text-gray-500">5.2/16 GB used</div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Temperature */}
          <div className="flex items-center gap-2">
            <Thermometer size={12} className={getUsageColor(systemStatus.temp)} />
            <span className={cn("text-xs", getUsageColor(systemStatus.temp))}>
              {Math.round(systemStatus.temp)}°
            </span>
          </div>
        </div>

        {/* Right Section - Enhanced Controls */}
        <div className="flex items-center gap-3">
          {/* Status Cluster */}
          <div className="flex items-center gap-3">
            {/* Network */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer group">
                  <Network size={12} className={isWifiOn ? "text-gray-300" : "text-gray-600"} />
                  <span className="text-xs">{systemStatus.network}Mb</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-3 bg-black/95 backdrop-blur-2xl border-gray-700">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Network</span>
                    <Switch 
                      checked={isWifiOn} 
                      onCheckedChange={setIsWifiOn}
                      className="scale-75"
                    />
                  </div>
                  <div className="text-xs text-gray-500">wlp3s0 • 5GHz</div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Bluetooth */}
            <Switch 
              checked={isBluetoothOn} 
              onCheckedChange={setIsBluetoothOn}
              className="scale-75"
            >
              <Bluetooth size={12} className={isBluetoothOn ? "text-gray-300" : "text-gray-600"} />
            </Switch>

            {/* Volume */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer group">
                  <Volume2 size={12} className="text-gray-300" />
                  <span className="text-xs w-6">{volume}%</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-32 p-3 bg-black/95 backdrop-blur-2xl border-gray-700">
                <div className="space-y-2">
                  <div className="text-xs text-gray-300 text-center">Volume</div>
                  <Slider 
                    value={[volume]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0])}
                  />
                </div>
              </PopoverContent>
            </Popover>

            {/* Battery with Time */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer group">
                  <Battery size={12} className={getBatteryColor(85)} />
                  <span className="text-xs">{batteryTime}</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-3 bg-black/95 backdrop-blur-2xl border-gray-700">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-300">Battery</span>
                    <span className="text-gray-400">85%</span>
                  </div>
                  <Progress value={85} className="h-1 bg-gray-800" />
                  <div className="text-xs text-gray-500">{batteryTime} remaining</div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-px h-4 bg-gray-700" />

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenApp?.('terminal')}
              className="w-6 h-6 p-0 hover:bg-gray-800 transition-colors"
              title="Terminal"
            >
              <Terminal size={12} className="text-gray-400" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenApp?.('search')}
              className="w-6 h-6 p-0 hover:bg-gray-800 transition-colors"
              title="Search"
            >
              <Search size={12} className="text-gray-400" />
            </Button>

            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 hover:bg-gray-800 transition-colors relative"
                  title="Notifications"
                >
                  {isDND ? (
                    <BellOff size={12} className="text-gray-500" />
                  ) : (
                    <Bell size={12} className="text-gray-400" />
                  )}
                  {unreadNotifications > 0 && !isDND && (
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-black"></div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 bg-black/95 backdrop-blur-2xl border-gray-700">
                <div className="p-2 border-b border-gray-700 flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Notifications</span>
                  <div className="flex gap-1">
                    <Switch 
                      checked={isDND}
                      onCheckedChange={setIsDND}
                      className="scale-75"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="h-5 text-xs text-gray-400 hover:text-gray-300 px-2"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {NOTIFICATIONS.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-2 border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer",
                        !notification.read && "bg-gray-800/30"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-gray-200 text-xs font-medium">{notification.title}</span>
                        <span className="text-gray-500 text-xs">{notification.time}</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-0.5">{notification.message}</p>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-px h-4 bg-gray-700" />

          {/* Enhanced Time & Date */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="px-2 py-1 rounded text-xs hover:bg-gray-800 transition-colors flex items-center gap-1">
                <Clock size={10} className="text-gray-400" />
                {time}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 bg-black/95 backdrop-blur-2xl border-gray-700">
              <div className="p-3 border-b border-gray-700">
                <div className="text-gray-200 text-sm font-medium">Calendar</div>
                <div className="text-gray-400 text-xs mt-1">
                  {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded border-none bg-transparent p-3"
              />
            </PopoverContent>
          </Popover>

          {/* Enhanced System Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-800 transition-colors border border-gray-800">
                <Settings size={12} className="text-gray-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-72 p-0 bg-black/95 backdrop-blur-2xl border-gray-700"
              align="end"
            >
              {/* Quick Settings Grid */}
              <div className="p-3 grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded border border-gray-700 hover:bg-gray-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    {isDarkMode ? <Moon size={12} className="text-gray-300" /> : <Sun size={12} className="text-gray-300" />}
                    <span className="text-xs text-gray-300">Theme</span>
                  </div>
                </button>

                <button 
                  onClick={onLock}
                  className="p-2 rounded border border-gray-700 hover:bg-gray-800 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <User size={12} className="text-gray-300" />
                    <span className="text-xs text-gray-300">Lock</span>
                  </div>
                </button>

                <button className="p-2 rounded border border-gray-700 hover:bg-gray-800 transition-colors text-left">
                  <div className="flex items-center gap-2">
                    <Monitor size={12} className="text-gray-300" />
                    <span className="text-xs text-gray-300">Display</span>
                  </div>
                </button>

                <button className="p-2 rounded border border-gray-700 hover:bg-gray-800 transition-colors text-left">
                  <div className="flex items-center gap-2">
                    <Zap size={12} className="text-gray-300" />
                    <span className="text-xs text-gray-300">Power</span>
                  </div>
                </button>
              </div>

              <Separator className="bg-gray-700" />

              {/* System Info */}
              <div className="p-3">
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-gray-500">Uptime</div>
                    <div className="text-gray-300">2:34</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Processes</div>
                    <div className="text-gray-300">247</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Load</div>
                    <div className="text-gray-300">1.2</div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Power Options */}
              <div className="p-2">
                <button 
                  onClick={togglePowerMenu}
                  className="w-full px-3 py-2 text-left rounded text-sm text-gray-300 hover:bg-gray-800 transition-colors flex items-center gap-2 border border-gray-700"
                >
                  <Power size={12} />
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