"use client";

import type { CommandAssistanceOutput } from "@/ai/flows/command-assistance";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

type AIAssistanceProps = {
  assistance: CommandAssistanceOutput;
  onSuggestionClick: (suggestion: string) => void;
};

export function AIAssistance({ assistance, onSuggestionClick }: AIAssistanceProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="p-3 text-sm bg-secondary/30 rounded-md border border-border/50"
    >
      <div className="flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <div className="flex-grow">
          <h4 className="font-bold text-foreground">AI Assistance</h4>
          <p className="text-muted-foreground mt-1 mb-3">{assistance.explanation}</p>
          <div className="flex flex-wrap gap-2">
            {assistance.suggestions.map((s, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick(s)}
                className="font-code"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
