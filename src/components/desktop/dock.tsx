"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { App, WindowInstance, AppId } from "@/app/page";
import { cn } from "@/lib/utils";
import { 
  Monitor, 
  Grid3X3, 
  Power, 
  Settings, 
  User, 
  LogOut, 
  Laptop,
  Shield,
  Network,
  HardDrive,
  Bell,
  Moon,
  Search,
  Terminal,
  FileText,
  Camera,
  Music,
  Video,
  Wifi,
  Battery,
  Volume2,
  Star
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

type DockProps = {
  apps: App[];
  windows: WindowInstance[];
  openWindow: (appId: AppId) => void;
  onDockIconClick: (windowId: string) => void;
  toggleGallery: () => void;
};

type MenuItem = {
  icon: React.ComponentType<any>;
  label: string;
  description?: string;
  action: () => void;
  category: string;
  isFeatured?: boolean;
};

export function Dock({ apps, windows, openWindow, onDockIconClick, toggleGallery }: DockProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("favorites");
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || (e.ctrlKey && e.key === ' ')) {
        e.preventDefault();
        setIsMenuOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const menuCategories = {
    favorites: [
      { 
        icon: Terminal, 
        label: "Terminal", 
        description: "System terminal",
        action: () => openWindow('terminal'), 
        category: "favorites",
        isFeatured: true
      },
      { 
        icon: FileText, 
        label: "Files", 
        description: "File manager",
        action: () => openWindow('files'), 
        category: "favorites",
        isFeatured: true
      },
      { 
        icon: Settings, 
        label: "Settings", 
        description: "System configuration",
        action: () => openWindow('settings'), 
        category: "favorites",
        isFeatured: true
      },
      { 
        icon: Laptop, 
        label: "System Monitor", 
        description: "Resource usage",
        action: () => openWindow('system-monitor'), 
        category: "favorites",
        isFeatured: true
      },
    ],
    applications: [
      { icon: Camera, label: "Camera", action: () => openWindow('camera'), category: "applications" },
      { icon: Music, label: "Music", action: () => openWindow('music'), category: "applications" },
      { icon: Video, label: "Video", action: () => openWindow('video'), category: "applications" },
    ],
    system: [
      { icon: Shield, label: "Security", action: () => console.log("Security"), category: "system" },
      { icon: Network, label: "Network", action: () => console.log("Network"), category: "system" },
      { icon: HardDrive, label: "Disks", action: () => console.log("Disks"), category: "system" },
    ],
    power: [
      { icon: Moon, label: "Sleep", action: () => console.log("Sleep"), category: "power" },
      { icon: Power, label: "Restart", action: () => console.log("Restart"), category: "power" },
      { icon: LogOut, label: "Log Out", action: () => console.log("Log out"), category: "power" },
    ]
  };

  const allMenuItems = Object.values(menuCategories).flat();
  const filteredItems = searchQuery 
    ? allMenuItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : menuCategories[activeCategory as keyof typeof menuCategories];

  const featuredItems = menuCategories.favorites.filter(item => item.isFeatured);

  return (
    <>
      {/* Enhanced Startup Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              ref={menuRef}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-700/50 bg-gradient-to-b from-gray-800/50 to-transparent">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <img src="./arch.svg" alt="Arch" className="w-6 h-6 filter brightness-0 invert" />
                    </div>
                    <div>
                      <h1 className="text-white font-bold text-xl">Applications</h1>
                      <p className="text-gray-400 text-sm">Arch Linux • Hyprland</p>
                    </div>
                  </div>
                  
                  {/* System Status */}
                  <div className="flex items-center gap-4 ml-auto text-gray-400">
                    <div className="flex items-center gap-2 text-sm">
                      <Wifi className="w-4 h-4" />
                      <span>Connected</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Battery className="w-4 h-4" />
                      <span>87%</span>
                    </div>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <div className="flex h-96">
                {/* Sidebar */}
                <div className="w-48 border-r border-gray-700/50 bg-gray-800/20 p-4">
                  <div className="space-y-2">
                    {Object.keys(menuCategories).map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setActiveCategory(category);
                          setSearchQuery("");
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          activeCategory === category
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                        )}
                      >
                        <div className={cn(
                          "p-1.5 rounded-lg",
                          activeCategory === category ? "bg-cyan-500/20" : "bg-gray-700/50"
                        )}>
                          {category === 'favorites' && <Star className="w-4 h-4" />}
                          {category === 'applications' && <Grid3X3 className="w-4 h-4" />}
                          {category === 'system' && <Settings className="w-4 h-4" />}
                          {category === 'power' && <Power className="w-4 h-4" />}
                        </div>
                        <span className="capitalize">{category}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {searchQuery ? (
                    <div>
                      <h3 className="text-gray-400 text-sm font-medium mb-4">
                        Search results for "{searchQuery}"
                      </h3>
                      <div className="grid grid-cols-4 gap-4">
                        {filteredItems.map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <motion.button
                              key={item.label}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.05 }}
                              onClick={() => {
                                item.action();
                                setIsMenuOpen(false);
                                setSearchQuery("");
                              }}
                              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:border-cyan-500/30 transition-all duration-200"
                            >
                              <div className="p-3 bg-gray-700/50 rounded-lg">
                                <Icon className="w-6 h-6 text-gray-300" />
                              </div>
                              <span className="text-white text-sm font-medium text-center">
                                {item.label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Featured Apps */}
                      {activeCategory === 'favorites' && (
                        <div>
                          <h3 className="text-gray-400 text-sm font-medium mb-4">Frequently Used</h3>
                          <div className="grid grid-cols-4 gap-4 mb-6">
                            {featuredItems.map((item, index) => {
                              const Icon = item.icon;
                              return (
                                <motion.button
                                  key={item.label}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                  whileHover={{ scale: 1.05 }}
                                  onClick={() => {
                                    item.action();
                                    setIsMenuOpen(false);
                                  }}
                                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700/30 hover:border-cyan-500/50 transition-all duration-200"
                                >
                                  <div className="p-3 bg-cyan-500/20 rounded-lg">
                                    <Icon className="w-7 h-7 text-cyan-400" />
                                  </div>
                                  <div className="text-center">
                                    <div className="text-white text-sm font-semibold">{item.label}</div>
                                    <div className="text-cyan-400/70 text-xs mt-1">{item.description}</div>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Regular Apps */}
                      <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-4">
                          {activeCategory === 'favorites' ? 'All Applications' : 'Applications'}
                        </h3>
                        <div className="grid grid-cols-4 gap-4">
                          {filteredItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                              <motion.button
                                key={item.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => {
                                  item.action();
                                  setIsMenuOpen(false);
                                }}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-200"
                              >
                                <div className="p-2 bg-gray-700/50 rounded-lg">
                                  <Icon className="w-5 h-5 text-gray-300" />
                                </div>
                                <span className="text-white text-xs font-medium text-center">
                                  {item.label}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-gray-700/50 bg-gray-800/20 flex justify-between items-center">
                <div className="text-gray-400 text-xs">
                  Press <kbd className="px-2 py-1 bg-gray-700 rounded border border-gray-600">Super</kbd> to toggle
                </div>
                <div className="text-gray-400 text-xs">
                  {filteredItems.length} items
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <motion.div
          className="flex items-end gap-2 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 px-3 py-2 shadow-2xl h-16"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Startup Menu Button */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className={cn(
                  "h-10 w-10 flex items-center justify-center rounded-lg transition-all duration-200",
                  isMenuOpen 
                    ? "bg-white/10 border border-white/20" 
                    : "bg-transparent hover:bg-white/5"
                )}
                aria-label="Startup Menu"
              >
                <img 
                  src="./arch.svg" 
                  alt="Arch Linux logo" 
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isMenuOpen ? "brightness-100" : "brightness-80"
                  )} 
                />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="bg-black/80 backdrop-blur-sm border-white/10 text-white text-xs"
            >
              Applications Menu
            </TooltipContent>
          </Tooltip>

          {/* Separator */}
          <div className="w-px h-6 bg-white/10 mx-1" />

          {/* App Icons */}
          {apps.map(app => {
            const openInstances = windows.filter(w => w.appId === app.id);
            const isAppOpen = openInstances.length > 0;
            const isMinimized = isAppOpen && openInstances.every(w => w.isMinimized);

            const handleClick = () => {
              if (isAppOpen) {
                const activeWindow = openInstances.find(w => !w.isMinimized) || openInstances[0];
                onDockIconClick(activeWindow.id);
              } else {
                openWindow(app.id);
              }
            };

            return (
              <Tooltip key={app.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div className="relative flex flex-col items-center justify-end h-12">
                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClick}
                      className={cn(
                        "h-10 w-10 flex items-center justify-center rounded-lg transition-all duration-200",
                        isAppOpen 
                          ? "bg-white/10 border border-white/20" 
                          : "bg-transparent hover:bg-white/5"
                      )}
                      aria-label={`Open ${app.title}`}
                    >
                      <app.icon className={cn(
                        "h-5 w-5 transition-colors",
                        isAppOpen ? "text-white" : "text-white/70"
                      )} />
                    </motion.button>
                    
                    {/* Active indicator */}
                    {isAppOpen && (
                      <div className={cn(
                        "h-0.5 w-6 rounded-full mt-1 transition-colors",
                        isMinimized ? "bg-white/40" : "bg-white"
                      )} />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="bg-black/80 backdrop-blur-sm border-white/10 text-white text-xs"
                >
                  {app.title}
                  {isAppOpen && (
                    <span className="text-white/60 ml-1">
                      ({openInstances.length})
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
          
          {/* Separator */}
          <div className="w-px h-6 bg-white/10 mx-1" />
          
          {/* App Gallery Button */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleGallery}
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-transparent hover:bg-white/5 transition-all duration-200"
                aria-label="Show all applications"
              >
                <Grid3X3 className="h-5 w-5 text-white/70" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="bg-black/80 backdrop-blur-sm border-white/10 text-white text-xs"
            >
              App Gallery
            </TooltipContent>
          </Tooltip>
        </motion.div>
      </div>
    </>
  );
}