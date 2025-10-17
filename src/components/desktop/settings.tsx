"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const defaultTheme = {
  background: "0 0% 16%",
  primary: "275 100% 25%",
  accent: "288 100% 50%",
};

type Theme = typeof defaultTheme;

export function Settings() {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem("archsim-theme");
    let initialTheme = defaultTheme;
    if (savedTheme) {
      try {
        initialTheme = JSON.parse(savedTheme);
      } catch (e) {
        console.error("Failed to parse theme from localStorage", e);
      }
    }
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (themeToApply: Theme) => {
    const root = document.documentElement;
    root.style.setProperty("--background", themeToApply.background);
    root.style.setProperty("--primary", themeToApply.primary);
    root.style.setProperty("--accent", themeToApply.accent);
    root.style.setProperty("--ring", themeToApply.accent);
  };

  const handleThemeChange = (key: keyof Theme, value: string) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  const saveTheme = () => {
    localStorage.setItem("archsim-theme", JSON.stringify(theme));
    applyTheme(theme);
  };
  
  const resetTheme = () => {
    localStorage.removeItem("archsim-theme");
    setTheme(defaultTheme);
    applyTheme(defaultTheme);
  };

  if (!isMounted) {
    return null; // Avoid rendering until localStorage is read
  }

  return (
    <div className="h-full w-full bg-card/50 p-4 overflow-y-auto">
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader>
          <CardTitle>Theme Customization</CardTitle>
          <CardDescription>
            Customize the look and feel of ArchSim. Values are HSL (Hue Saturation Lightness).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="background">Background Color</Label>
            <Input 
              id="background" 
              value={theme.background}
              onChange={e => handleThemeChange("background", e.target.value)}
              placeholder="e.g., 0 0% 16%"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primary">Primary Color</Label>
            <Input 
              id="primary" 
              value={theme.primary}
              onChange={e => handleThemeChange("primary", e.target.value)}
              placeholder="e.g., 275 100% 25%"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accent">Accent Color</Label>
            <Input 
              id="accent" 
              value={theme.accent}
              onChange={e => handleThemeChange("accent", e.target.value)}
              placeholder="e.g., 288 100% 50%"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button onClick={saveTheme}>Apply & Save</Button>
            <Button variant="ghost" onClick={resetTheme}>Reset to Default</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
