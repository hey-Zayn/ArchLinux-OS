
"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCw, Home, Lock } from "lucide-react";

export function Browser() {
  const [url, setUrl] = useState("https://www.google.com/webhp?igu=1");
  const [history, setHistory] = useState([url]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newUrl = url;
    if (!/^https?:\/\//i.test(newUrl)) {
      newUrl = 'https://' + newUrl;
    }
     if (iframeRef.current) {
      iframeRef.current.src = newUrl;
    }
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  const navigate = (direction: 'back' | 'forward') => {
      let newIndex = historyIndex;
      if(direction === 'back' && historyIndex > 0) {
          newIndex--;
      }
      if(direction === 'forward' && historyIndex < history.length -1) {
          newIndex++;
      }
      setHistoryIndex(newIndex);
      setUrl(history[newIndex]);
      if (iframeRef.current) {
        iframeRef.current.src = history[newIndex];
      }
  }

  const refresh = () => {
       if (iframeRef.current) {
            iframeRef.current.contentWindow?.location.reload();
        }
  }

  const goHome = () => {
      const homeUrl = "https://www.google.com/webhp?igu=1";
      setUrl(homeUrl);
      if (iframeRef.current) {
        iframeRef.current.src = homeUrl;
      }
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(homeUrl);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
  }

  return (
    <div className="h-full w-full bg-background flex flex-col">
      <div className="flex-shrink-0 p-2 border-b border-border/50 flex items-center gap-2 bg-secondary/30">
        <Button variant="ghost" size="icon" onClick={() => navigate('back')} disabled={historyIndex === 0}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => navigate('forward')} disabled={historyIndex === history.length - 1}>
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={refresh}>
            <RotateCw className="h-4 w-4" />
        </Button>
         <Button variant="ghost" size="icon" onClick={goHome}>
            <Home className="h-4 w-4" />
        </Button>
        <form onSubmit={handleSubmit} className="flex-grow relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-background rounded-full px-10"
              placeholder="Search Google or type a URL"
            />
        </form>
      </div>
      <iframe
        ref={iframeRef}
        src={url}
        className="flex-grow w-full h-full border-none"
        title="Web Browser"
        sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation"
      />
    </div>
  );
}
