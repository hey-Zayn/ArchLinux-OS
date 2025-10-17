"use client";
import { motion, PanInfo, useDragControls } from 'framer-motion';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface WindowProps {
  id: string;
  title: string;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  children: React.ReactNode;
  defaultSize: { width: number; height: number };
  isMaximized: boolean;
  zIndex: number;
}

// Layout constants
const LAYOUT = {
  TOP_BAR_HEIGHT: 32,
  DOCK_HEIGHT: 64,
  DOCK_MARGIN: 16,
  WINDOW_MARGIN: 8,
  MIN_WIDTH: 300,
  MIN_HEIGHT: 200,
} as const;

export function Window({
  id,
  title,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
  children,
  defaultSize,
  isMaximized,
  zIndex,
}: WindowProps) {
  const [size, setSize] = useState(defaultSize);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const [isMounted, setIsMounted] = useState(false);

  // Calculate window boundaries
  const windowBoundaries = {
    top: LAYOUT.TOP_BAR_HEIGHT,
    left: 0,
    right: 0,
    bottom: LAYOUT.DOCK_HEIGHT + LAYOUT.DOCK_MARGIN,
  };

  // Calculate maximized dimensions
  const maximizedDimensions = {
    width: `calc(100vw - ${LAYOUT.WINDOW_MARGIN * 2}px)`,
    height: `calc(100vh - ${LAYOUT.TOP_BAR_HEIGHT + LAYOUT.DOCK_HEIGHT + LAYOUT.DOCK_MARGIN + 8}px)`,
    x: LAYOUT.WINDOW_MARGIN,
    y: LAYOUT.TOP_BAR_HEIGHT + 4,
  };

  // Initial position calculation
  const getInitialPosition = useCallback(() => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    
    return {
      x: window.innerWidth / 2 - defaultSize.width / 2 + (Math.random() - 0.5) * 100,
      y: window.innerHeight / 3 - defaultSize.height / 2 + (Math.random() - 0.5) * 50,
    };
  }, [defaultSize]);

  const [initialPosition] = useState(getInitialPosition);

  // Handle window resize
  const handleResize = useCallback((
    _event: MouseEvent | TouchEvent | PointerEvent, 
    info: PanInfo, 
    direction: string
  ) => {
    let newWidth = size.width;
    let newHeight = size.height;

    // Calculate new dimensions based on resize direction
    if (direction.includes('r')) newWidth += info.delta.x;
    if (direction.includes('l')) newWidth -= info.delta.x;
    if (direction.includes('b')) newHeight += info.delta.y;
    if (direction.includes('t')) newHeight -= info.delta.y;
    
    // Apply minimum size constraints
    newWidth = Math.max(newWidth, LAYOUT.MIN_WIDTH);
    newHeight = Math.max(newHeight, LAYOUT.MIN_HEIGHT);
    
    setSize({ width: newWidth, height: newHeight });
  }, [size]);

  // Start drag handler
  const startDrag = useCallback((event: React.PointerEvent) => {
    if (!isMaximized) {
      dragControls.start(event, { snapToCursor: false });
    }
  }, [isMaximized, dragControls]);

  // Mount effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Drag constraints boundary */}
      <div 
        ref={constraintsRef} 
        className="absolute inset-0 pointer-events-none" 
        style={windowBoundaries}
      />
      
      {/* Window container */}
      <motion.div
        key={id}
        drag
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        initial={{
          opacity: 0,
          scale: 0.9,
          x: initialPosition.x,
          y: initialPosition.y,
        }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          width: isMaximized ? maximizedDimensions.width : size.width,
          height: isMaximized ? maximizedDimensions.height : size.height,
          x: isMaximized ? maximizedDimensions.x : undefined,
          y: isMaximized ? maximizedDimensions.y : undefined,
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.9, 
          transition: { duration: 0.15 } 
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 500, 
          damping: 40 
        }}
        onMouseDown={onFocus}
        onTapStart={onFocus}
        style={{
          zIndex,
          position: 'absolute',
          ...(isMaximized && {
            top: `${maximizedDimensions.y}px`,
            left: `${maximizedDimensions.x}px`,
          }),
        }}
        className="flex flex-col bg-black/20 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl overflow-hidden"
      >
        {/* Window header */}
        <motion.header 
          onPointerDown={startDrag}
          className="flex items-center justify-between px-3 py-2 bg-black/40 cursor-grab active:cursor-grabbing border-b border-white/10"
        >
          <div className="flex items-center gap-2 pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm font-medium text-white">{title}</span>
          </div>
          
          {/* Window controls */}
          <div className="flex items-center gap-1">
            <button 
              onClick={onMinimize}
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
              aria-label="Minimize window"
            >
              <Minus size={14} className="text-white/70" />
            </button>
            
            <button 
              onClick={onMaximize}
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
              aria-label={isMaximized ? "Restore window" : "Maximize window"}
            >
              {isMaximized ? (
                <Minimize2 size={14} className="text-white/70" />
              ) : (
                <Maximize2 size={14} className="text-white/70" />
              )}
            </button>
            
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-red-500/20 transition-colors group"
              aria-label="Close window"
            >
              <X size={14} className="text-white/70 group-hover:text-red-600 transition-colors" />
            </button>
          </div>
        </motion.header>

        {/* Window content */}
        <div className="flex-grow overflow-auto">
          {children}
        </div>

        {/* Resize handles (only when not maximized) */}
        {!isMaximized && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Horizontal handles */}
            <motion.div 
              onPan={(e, i) => handleResize(e, i, 't')}
              className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize pointer-events-auto"
            />
            <motion.div 
              onPan={(e, i) => handleResize(e, i, 'b')}
              className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize pointer-events-auto"
            />
            
            {/* Vertical handles */}
            <motion.div 
              onPan={(e, i) => handleResize(e, i, 'l')}
              className="absolute top-0 left-0 bottom-0 w-2 cursor-ew-resize pointer-events-auto"
            />
            <motion.div 
              onPan={(e, i) => handleResize(e, i, 'r')}
              className="absolute top-0 right-0 bottom-0 w-2 cursor-ew-resize pointer-events-auto"
            />
            
            {/* Corner handles */}
            <motion.div 
              onPan={(e, i) => handleResize(e, i, 'tl')}
              className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize pointer-events-auto"
            />
            <motion.div 
              onPan={(e, i) => handleResize(e, i, 'tr')}
              className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize pointer-events-auto"
            />
            <motion.div 
              onPan={(e, i) => handleResize(e, i, 'bl')}
              className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize pointer-events-auto"
            />
            <motion.div 
              onPan={(e, i) => handleResize(e, i, 'br')}
              className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize pointer-events-auto"
            />
          </div>
        )}
      </motion.div>
    </>
  );
}