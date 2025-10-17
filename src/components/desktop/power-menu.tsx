"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { PowerOff, Lock, Moon, Monitor, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PowerMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  onLock: () => void;
  onSleep?: () => void;
  onRestart?: () => void;
  onShutdown?: () => void;
};

type PowerOption = {
  icon: React.ElementType;
  label: string;
  action: () => void;
  variant: 'default' | 'destructive' | 'secondary';
};

export function PowerMenu({ isOpen, onClose, onLock, onSleep, onRestart, onShutdown }: PowerMenuProps) {
  const powerOptions: PowerOption[] = [
    {
      icon: Lock,
      label: "Lock Screen",
      action: () => {
        onLock();
        onClose();
      },
      variant: 'secondary'
    },
    {
      icon: Moon,
      label: "Sleep",
      action: () => {
        onSleep?.();
        onClose();
      },
      variant: 'secondary'
    },
    {
      icon: RotateCcw,
      label: "Restart",
      action: () => {
        onRestart?.();
        onClose();
      },
      variant: 'default'
    },
    {
      icon: PowerOff,
      label: "Shut Down",
      action: () => {
        onShutdown?.();
        onClose();
      },
      variant: 'destructive'
    },
  ];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-gray-900/95 backdrop-blur-md border border-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">System Actions</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-lg hover:bg-gray-800"
              >
                <X size={16} className="text-gray-400" />
              </Button>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-2 gap-3 p-6">
              {powerOptions.map((option, index) => (
                <PowerOption
                  key={option.label}
                  icon={option.icon}
                  label={option.label}
                  onClick={option.action}
                  variant={option.variant}
                  index={index}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800 bg-gray-800/20 rounded-b-xl">
              <p className="text-center text-gray-400 text-sm">
                Any unsaved work may be lost
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type PowerOptionProps = {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  variant: 'default' | 'destructive' | 'secondary';
  index: number;
}

function PowerOption({ icon: Icon, label, onClick, variant, index }: PowerOptionProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return 'border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 text-red-400 hover:text-red-300';
      case 'secondary':
        return 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50 text-gray-300 hover:text-white';
      default:
        return 'border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/10 text-blue-400 hover:text-blue-300';
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200
        bg-gray-800/30 backdrop-blur-sm cursor-pointer
        ${getVariantStyles()}
      `}
    >
      <div className="p-3 rounded-lg bg-black/20">
        <Icon size={20} />
      </div>
      <span className="font-medium text-sm text-center leading-tight">
        {label}
      </span>
    </motion.button>
  );
}