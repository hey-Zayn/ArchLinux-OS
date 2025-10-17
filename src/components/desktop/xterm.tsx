"use client";
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Terminal, ITerminalOptions, ITerminalAddon } from "@xterm/xterm";

interface XTermProps {
  options?: ITerminalOptions;
  addons?: ITerminalAddon[];
  onKey?: (event: { key: string; domEvent: KeyboardEvent }) => void;
  [key: string]: any; // for other props
}

export const Xterm = forwardRef<
  { terminal: Terminal },
  XTermProps
>(({ options, addons, onKey, ...rest }, ref) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);

  useImperativeHandle(ref, () => ({
    get terminal() {
      if (!term.current) {
        throw new Error("Terminal has not been initialized yet.");
      }
      return term.current;
    },
  }));

  useEffect(() => {
    if (terminalRef.current && !term.current) {
      term.current = new Terminal(options);

      if (addons) {
        addons.forEach((addon) => {
          term.current?.loadAddon(addon);
        });
      }
      
      term.current.open(terminalRef.current);

      if (onKey) {
        term.current.onKey(onKey);
      }
    }
    
    return () => {
      // It might be useful to dispose of the terminal on unmount
      // term.current?.dispose();
      // term.current = null;
    };
  }, [options, addons, onKey]);

  return <div ref={terminalRef} {...rest} />;
});

Xterm.displayName = "Xterm";
