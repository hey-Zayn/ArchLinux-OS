
"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type TextEditorProps = {
  initialContent: string;
  onSave: (newContent: string) => void;
  fileName: string;
};

export function TextEditor({ initialContent, onSave, fileName }: TextEditorProps) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = () => {
    onSave(content);
  };

  return (
    <div className="h-full w-full flex flex-col bg-card">
      <div className="flex-shrink-0 p-2 border-b border-border/50 flex items-center justify-between">
        <span className="text-sm font-medium">{fileName}</span>
        <Button size="sm" onClick={handleSave}>Save</Button>
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-grow w-full h-full p-4 bg-transparent border-none focus-visible:ring-0 resize-none font-code"
        placeholder="Start typing..."
      />
    </div>
  );
}
