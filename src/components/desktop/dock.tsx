"use client";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { App, WindowInstance, AppId } from "@/app/page";
import { cn } from "@/lib/utils";
import { ArchLogo } from "@/components/icons/arch-logo";
import { Monitor, Grid3X3 } from "lucide-react";

type DockProps = {
  apps: App[];
  windows: WindowInstance[];
  openWindow: (appId: AppId) => void;
  onDockIconClick: (windowId: string) => void;
  toggleGallery: () => void;
};

export function Dock({ apps, windows, openWindow, onDockIconClick, toggleGallery }: DockProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        className="flex items-end gap-1 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 px-3 py-2 shadow-2xl h-16"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
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
              {/* <Grid3X3 className="h-5 w-5 text-white/70" /> */}
              <img src="./arch.svg" alt="Arch Linux logo" className="w-6 h-6 cursor-pointer" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            className="bg-black/80 backdrop-blur-sm border-white/10 text-white text-xs"
          >
            App Gallery
          </TooltipContent>
        </Tooltip>

        {/* Arch Logo - System Menu */}
        {/* <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="h-10 w-10 flex items-center justify-center rounded-lg bg-transparent hover:bg-white/5 transition-all duration-200"
              aria-label="System Menu"
            >
              
             <Grid3X3 className="h-5 w-5 text-white/70" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent 
            side="top" 
            className="bg-black/80 backdrop-blur-sm border-white/10 text-white text-xs"
          >
            System Menu
          </TooltipContent>
        </Tooltip> */}
      </motion.div>
    </div>
  );
}