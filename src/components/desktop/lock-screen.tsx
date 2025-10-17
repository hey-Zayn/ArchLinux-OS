"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { KeyRound, User, ArrowRight, Wifi, Battery, Volume2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CORRECT_PASSWORD = 'arch';

type LockScreenProps = {
  onUnlock: () => void;
  userName?: string;
  userAvatar?: string;
};

export function LockScreen({ onUnlock, userName = "arch", userAvatar }: LockScreenProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
      setDate(now.toLocaleDateString([], { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric'
      }));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(false);
  };

  const handleUnlockAttempt = async () => {
    if (!password.trim()) return;

    setIsLoading(true);
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (password === CORRECT_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setPassword('');
    }
    
    setIsLoading(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUnlockAttempt();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUnlockAttempt();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-2xl"
    >
      {/* Hyprland-style background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-purple-500/5 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-cyan-500/5 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      {/* Top Bar System Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-6 left-6 right-6 flex justify-between items-center text-white/80"
      >
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Wifi size={14} className="text-green-400" />
            <span>wlp3s0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Volume2 size={14} className="text-blue-400" />
            <span>65%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Battery size={14} className="text-cyan-400" />
            <span>85%</span>
          </div>
        </div>
        
        <div className="text-sm font-mono bg-black/20 px-3 py-1 rounded-lg border border-white/10">
          Arch Linux
        </div>
      </motion.div>

      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="flex flex-col items-center text-center w-full max-w-sm">
          {/* Time Display */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h1 className="text-6xl font-light text-white mb-2 font-mono tracking-tight">
              {time}
            </h1>
            <p className="text-lg text-white/60 font-light">
              {date}
            </p>
          </motion.div>

          {/* Glass Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            {/* User Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="flex flex-col items-center mb-6"
            >
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-white/20 bg-white/10">
                  {userAvatar ? (
                    <AvatarImage src={userAvatar} alt={userName} />
                  ) : (
                    <AvatarFallback className="bg-transparent">
                      <User className="h-8 w-8 text-white/60" />
                    </AvatarFallback>
                  )}
                </Avatar>
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/20" />
              </div>
              <h2 className="text-xl font-medium text-white mt-3">
                {userName}
              </h2>
              <p className="text-sm text-white/40 mt-1">
                Ready to work
              </p>
            </motion.div>

            {/* Login Form */}
            <motion.form 
              onSubmit={handleFormSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative mb-4">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                <Input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className="w-full bg-white/10 border-white/20 pl-10 pr-4 h-12 text-white placeholder:text-white/30 focus:bg-white/15 focus:border-white/30 rounded-xl transition-all duration-200 font-mono"
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400 text-sm mb-3 font-mono"
                  >
                    Access denied
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                onClick={handleUnlockAttempt}
                disabled={isLoading || !password.trim()}
                className="w-full h-12 bg-white/20 hover:bg-white/30 border border-white/20 text-white rounded-xl transition-all duration-200 font-medium flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    Authenticate
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </motion.form>

            {/* Demo Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xs text-white/30 mt-4 font-mono"
            >
              $ passwd: arch
            </motion.p>
          </motion.div>

          {/* Bottom Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 flex items-center gap-4 text-sm text-white/40"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span>Hyprland</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
              <span>Wayland</span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
              <span>nvidia</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-white/10 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-white/10 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-white/10 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-white/10 rounded-br-2xl" />
    </motion.div>
  );
}