"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dock } from '@/components/desktop/dock';
import dynamic from 'next/dynamic';
import { 
  Settings as SettingsIcon, 
  Terminal, 
  Trash2, 
  Home as HomeIcon, 
  FileText, 
  Folder, 
  FolderPlus, 
  FilePlus, 
  Pencil, 
  Trash, 
  Music, 
  Globe,
  Users,
  Network,
  Calculator,
  Calendar,
  Mail,
  MessageCircle
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { Settings } from '@/components/desktop/settings';
import { TopBar } from '@/components/desktop/top-bar';
import { AppGallery } from '@/components/desktop/app-gallery';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { LockScreen } from '@/components/desktop/lock-screen';
import { 
  initialFileSystem, 
  getPath, 
  getUniqueName, 
  type Directory, 
  type File as FileType, 
  deleteItem as deleteFsItem, 
  renameItem as renameFsItem 
} from '@/lib/file-system';
import { TextEditor } from '@/components/desktop/text-editor';
import { produce } from 'immer';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

// Dynamic imports for better performance
const Window = dynamic(() => import('@/components/desktop/window').then(mod => mod.Window), {
  ssr: false,
  loading: () => null,
});

const TerminalComponent = dynamic(() => import('@/components/desktop/terminal'), {
  ssr: false,
  loading: () => null,
});

const FileExplorer = dynamic(() => import('@/components/desktop/file-explorer').then(mod => mod.FileExplorer), {
  ssr: false,
  loading: () => null,
});

const MusicPlayer = dynamic(() => import('@/components/desktop/music-player').then(mod => mod.MusicPlayer), {
  ssr: false,
  loading: () => null,
});

const Browser = dynamic(() => import('@/components/desktop/browser').then(mod => mod.Browser), {
  ssr: false,
  loading: () => null,
});

// Import the new Calculator and Calendar components
const CalculatorApp = dynamic(() => import('@/components/desktop/calculator').then(mod => mod.Calculator), {
  ssr: false,
  loading: () => null,
});

const CalendarApp = dynamic(() => import('@/components/desktop/calendar').then(mod => mod.Calendar), {
  ssr: false,
  loading: () => null,
});

export type AppId = 'terminal' | 'settings' | 'home' | 'editor' | 'music' | 'browser' | 'calculator' | 'calendar' | 'mail' | 'messages';

export interface App {
  id: AppId;
  title: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  component?: React.ReactNode;
  defaultSize: { width: number; height: number };
  category?: string;
  description?: string;
}

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  path?: string;
}

let windowCount = 0;

export default function Desktop() {
  const [windows, setWindows] = React.useState<WindowInstance[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [isLocked, setIsLocked] = React.useState(true);
  const [isMounted, setIsMounted] = React.useState(false);
  const [fileSystem, setFileSystem] = React.useState<Directory>(initialFileSystem);
  const { toast } = useToast();
  
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
  const [itemToRename, setItemToRename] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");

  // Enhanced Apps configuration with working Calculator and Calendar
  const APPS: Record<AppId, App> = React.useMemo(() => ({
    terminal: {
      id: 'terminal',
      title: 'Terminal',
      icon: Terminal,
      component: <TerminalComponent />,
      defaultSize: { width: 800, height: 500 },
      category: 'system',
      description: 'Command line interface'
    },
    settings: {
      id: 'settings',
      title: 'System Settings',
      icon: SettingsIcon,
      component: <Settings />,
      defaultSize: { width: 500, height: 600 },
      category: 'system',
      description: 'System configuration'
    },
    home: {
      id: 'home',
      title: 'File Manager',
      icon: HomeIcon,
      defaultSize: { width: 700, height: 500 },
      category: 'utilities',
      description: 'Browse and manage files'
    },
    editor: {
      id: 'editor',
      title: 'Text Editor',
      icon: FileText,
      defaultSize: { width: 600, height: 450 },
      category: 'utilities',
      description: 'Edit text files'
    },
    music: {
      id: 'music',
      title: 'Music Player',
      icon: Music,
      component: <MusicPlayer fileSystem={fileSystem} onOpenFile={(path) => openWindow('music', path)} />,
      defaultSize: { width: 400, height: 550 },
      category: 'multimedia',
      description: 'Play audio files'
    },
    browser: {
      id: 'browser',
      title: 'Web Browser',
      icon: Globe,
      component: <Browser />,
      defaultSize: { width: 1024, height: 768 },
      category: 'internet',
      description: 'Browse the web'
    },
    calculator: {
      id: 'calculator',
      title: 'Calculator',
      icon: Calculator,
      component: <CalculatorApp />,
      defaultSize: { width: 320, height: 480 },
      category: 'utilities',
      description: 'Scientific calculator'
    },
    calendar: {
      id: 'calendar',
      title: 'Calendar',
      icon: Calendar,
      component: <CalendarApp />,
      defaultSize: { width: 800, height: 600 },
      category: 'utilities',
      description: 'Schedule and events'
    },
    mail: {
      id: 'mail',
      title: 'Email',
      icon: Mail,
      component: <div className="p-8 text-white text-center">Email Client - Coming Soon</div>,
      defaultSize: { width: 800, height: 600 },
      category: 'internet',
      description: 'Email client'
    },
    messages: {
      id: 'messages',
      title: 'Messages',
      icon: MessageCircle,
      component: <div className="p-8 text-white text-center">Messaging App - Coming Soon</div>,
      defaultSize: { width: 400, height: 600 },
      category: 'internet',
      description: 'Instant messaging'
    },
  }), [fileSystem]);

  // File system operations
  const handleCreateItem = React.useCallback((path: string, type: 'file' | 'folder') => {
    setFileSystem(produce(draft => {
      const pathParts = path.startsWith('~/') ? path.split('/').slice(1) : path === '~' ? [] : path.split('/');
      const parentNode = getPath(pathParts, draft);
      
      if (parentNode && parentNode.type === 'directory') {
        const baseName = type === 'file' ? 'Untitled' : 'New Folder';
        const newName = getUniqueName(parentNode, baseName, type === 'file' ? 'file' : 'directory');

        if (type === 'file') {
          parentNode.children[newName] = { type: 'file', name: newName, content: '' };
        } else {
          parentNode.children[newName] = { type: 'directory', name: newName, children: {} };
        }
      }
    }));
  }, []);

  const handleDeleteItem = React.useCallback(() => {
    if (!itemToDelete) return;
    
    setFileSystem(produce(draft => {
      deleteFsItem(itemToDelete, draft);
    }));
    
    toast({ 
      title: "Item Deleted", 
      description: `"${itemToDelete.split('/').pop()}" was moved to Trash.`
    });
    setItemToDelete(null);
  }, [itemToDelete, toast]);

  const handleRename = React.useCallback((path: string, name: string) => {
    setItemToRename(path);
    setRenameValue(name);
  }, []);

  const handleRenameSubmit = React.useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!itemToRename || !renameValue.trim()) {
      setItemToRename(null);
      return;
    }
    
    const parentPath = itemToRename.substring(0, itemToRename.lastIndexOf('/')) || '~';
    const parentNode = getPath(parentPath === '~' ? [] : parentPath.split('/').slice(1), fileSystem);

    if (parentNode?.type === 'directory' && parentNode.children[renameValue] && itemToRename !== `${parentPath}/${renameValue}`) {
      toast({ 
        variant: 'destructive', 
        title: "Rename Error", 
        description: "An item with this name already exists."
      });
      return;
    }

    setFileSystem(produce(draft => {
      renameFsItem(itemToRename, renameValue, draft);
    }));
    
    toast({ 
      title: "Item Renamed", 
      description: "Successfully renamed item." 
    });
    setItemToRename(null);
    setRenameValue("");
  }, [itemToRename, renameValue, fileSystem, toast]);

  // Window management
  const openWindow = React.useCallback((appId: AppId, path?: string) => {
    const app = APPS[appId];
    if (!app) return;

    // Check for existing windows
    if ((appId === 'home' || appId === 'editor') && path) {
      const existingWindow = windows.find(w => w.appId === appId && w.path === path);
      if (existingWindow) {
        bringToFront(existingWindow.id);
        return;
      }
    }

    const maxZIndex = windows.reduce((max, w) => Math.max(max, w.zIndex), 0);
    
    let title = app.title;
    if ((appId === 'editor' || appId === 'home') && path) {
      const parts = path.split('/');
      title = parts[parts.length - 1] || (appId === 'home' ? 'Home' : app.title);
    }

    const newWindow: WindowInstance = {
      id: `${appId}-${++windowCount}`,
      appId,
      title,
      isMinimized: false,
      isMaximized: false,
      zIndex: maxZIndex + 1,
      path
    };
    
    setWindows(prev => [...prev, newWindow]);
  }, [APPS, windows]);

  const closeWindow = React.useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const bringToFront = React.useCallback((id: string) => {
    setWindows(prev => {
      const maxZIndex = prev.reduce((max, w) => Math.max(max, w.zIndex), 0);
      const targetWindow = prev.find(w => w.id === id);

      if (targetWindow && targetWindow.zIndex === maxZIndex && !targetWindow.isMinimized) {
        return prev;
      }
      
      return prev.map(w => 
        w.id === id 
          ? { ...w, zIndex: maxZIndex + 1, isMinimized: false }
          : w
      );
    });
  }, []);

  const toggleMinimize = React.useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  }, []);

  const toggleMaximize = React.useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
    
    if (!windows.find(w => w.id === id)?.isMaximized) {
      bringToFront(id);
    }
  }, [bringToFront, windows]);

  const toggleGallery = React.useCallback(() => {
    setIsGalleryOpen(prev => !prev);
  }, []);

  const handleLock = React.useCallback(() => {
    setIsLocked(true);
  }, []);

  const handleUnlock = React.useCallback(() => {
    setIsLocked(false);
  }, []);

  const handleSaveFile = React.useCallback((path: string, newContent: string) => {
    setFileSystem(produce(draft => {
      const pathParts = path.startsWith('~/') ? path.split('/').slice(1) : path.split('/');
      const fileNode = getPath(pathParts, draft);

      if (fileNode && fileNode.type === 'file') {
        fileNode.content = newContent;
      }
    }));
    
    toast({ 
      title: "File Saved", 
      description: `Saved ${path}` 
    });
  }, [toast]);

  // System icons including Calculator and Calendar
  const systemIcons = [
    { 
      id: 'home-icon', 
      name: 'Home', 
      icon: HomeIcon, 
      path: '~/Home', 
      action: () => openWindow('home', '~/Home'),
      color: 'text-white'
    },
    // { 
    //   id: 'calculator', 
    //   name: 'Calculator', 
    //   icon: Calculator, 
    //   path: '', 
    //   action: () => openWindow('calculator'),
    //   color: 'text-white'
    // },
    // { 
    //   id: 'calendar', 
    //   name: 'Calendar', 
    //   icon: Calendar, 
    //   path: '', 
    //   action: () => openWindow('calendar'),
    //   color: 'text-white'
    // },
    // { 
    //   id: 'trash', 
    //   name: 'Trash', 
    //   icon: Trash2, 
    //   path: '~/Trash', 
    //   action: () => console.log('Open Trash'),
    //   color: 'text-white'
    // },
    // { 
    //   id: 'network', 
    //   name: 'Network', 
    //   icon: Network, 
    //   path: '~/Network', 
    //   action: () => console.log('Open Network'),
    //   color: 'text-white'
    // },
    // { 
    //   id: 'users', 
    //   name: 'Users', 
    //   icon: Users, 
    //   path: '~/Users', 
    //   action: () => console.log('Open Users'),
    //   color: 'text-white'
    // },
  ];

  const allDesktopIcons = systemIcons;

  // Context menus
  const renderDesktopContextMenu = () => (
    <ContextMenuContent className="bg-gray-900/95 backdrop-blur-xl border-gray-700/50 text-white">
      <ContextMenuItem onClick={() => handleCreateItem('~/Home', 'folder')} className="hover:bg-gray-700/50">
        <FolderPlus className="mr-2 h-4 w-4" />
        New Folder
      </ContextMenuItem>
      <ContextMenuItem onClick={() => handleCreateItem('~/Home', 'file')} className="hover:bg-gray-700/50">
        <FilePlus className="mr-2 h-4 w-4" />
        New Text File
      </ContextMenuItem>
    </ContextMenuContent>
  );

  const renderItemContextMenu = (item: { id: string; name: string; path: string }) => (
    <ContextMenuContent className="bg-gray-900/95 backdrop-blur-xl border-gray-700/50 text-white">
      <ContextMenuItem onClick={() => handleRename(item.path, item.name)} className="hover:bg-gray-700/50">
        <Pencil className="mr-2 h-4 w-4" />
        Rename
      </ContextMenuItem>
      <ContextMenuItem 
        onClick={() => setItemToDelete(item.path)} 
        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
      >
        <Trash className="mr-2 h-4 w-4" />
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  );

  // Focus management
  const focusedWindow = React.useMemo(() => {
    if (!isMounted || windows.length === 0) return null;
    const activeWindows = windows.filter(w => !w.isMinimized);
    return activeWindows.reduce((top, w) => (w.zIndex > top.zIndex ? w : top), activeWindows[0]);
  }, [windows, isMounted]);

  const focusedApp = focusedWindow ? APPS[focusedWindow.appId] : null;
  const apps = React.useMemo(() => Object.values(APPS).filter(app => app.id !== 'editor'), [APPS]);

  // Effects
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <main
        className="h-screen w-screen overflow-hidden font-sans relative bg-cover bg-center select-none"
        style={{
          backgroundImage: "url('./arch-linux.jpg')",
        }}
      >
        <ContextMenu>
          <ContextMenuTrigger className="h-full w-full">
            <TopBar 
              appTitle={focusedApp?.title} 
              onLock={handleLock} 
            />
            
            {/* System Icons including Calculator and Calendar */}
            <div className="p-6 pt-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {allDesktopIcons.map(item => {
                const Icon = item.icon;
                const isRenaming = itemToRename === item.path;
                const iconColor = 'text-white';

                return (
                  <ContextMenu key={item.id}>
                    <ContextMenuTrigger>
                      <motion.div 
                        className="flex flex-col items-center gap-3 w-28 text-center cursor-pointer group"
                        onDoubleClick={item.action}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Enhanced Icon Container */}
                        <div className="relative">
                          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-300 shadow-lg">
                            <Icon className={`h-6 w-6 ${iconColor} drop-shadow-lg transition-transform duration-300 group-hover:scale-110`} />
                          </div>
                          
                          {/* Selection Indicator */}
                          <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/40 transition-all duration-300" />
                        </div>
                        
                        {/* Label */}
                        {isRenaming ? (
                          <form onSubmit={handleRenameSubmit} className="w-full">
                            <Input 
                              type="text"
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onBlur={handleRenameSubmit}
                              onKeyDown={(e) => {
                                if (e.key === 'Escape') {
                                  setItemToRename(null);
                                  setRenameValue("");
                                }
                              }}
                              className="text-sm h-7 px-2 bg-white/90 text-black border-none focus:ring-2 focus:ring-cyan-500/50 rounded-md backdrop-blur-sm"
                              autoFocus
                            />
                          </form>
                        ) : (
                          <span className="text-white text-sm font-medium drop-shadow-lg break-words w-full bg-black/30 backdrop-blur-sm rounded-md px-2 py-1 transition-all duration-300 group-hover:bg-black/50">
                            {item.name}
                          </span>
                        )}
                      </motion.div>
                    </ContextMenuTrigger>
                    {item.id !== 'trash' && item.id !== 'home-icon' && item.id !== 'calculator' && item.id !== 'calendar' && renderItemContextMenu(item)}
                  </ContextMenu>
                );
              })}
            </div>

            {/* Windows */}
            <AnimatePresence>
              {isMounted && windows.filter(win => !win.isMinimized).map((win) => {
                let component;
                const app = APPS[win.appId];

                if (win.appId === 'home') {
                  component = (
                    <FileExplorer 
                      fileSystem={fileSystem} 
                      onOpenFile={openWindow}
                      currentPath={win.path || '~/Home'}
                      onCreateFile={(path) => handleCreateItem(path, 'file')}
                      onCreateFolder={(path) => handleCreateItem(path, 'folder')}
                      onDeleteItem={setItemToDelete}
                      onRenameItem={handleRename}
                      itemToRename={itemToRename}
                      renameValue={renameValue}
                      setRenameValue={setRenameValue}
                      onRenameSubmit={handleRenameSubmit}
                      setItemToRename={setItemToRename}
                    />
                  );
                } else if (win.appId === 'editor' && win.path) {
                  const pathParts = win.path.startsWith('~/') ? win.path.split('/').slice(1) : win.path.split('/');
                  const fileNode = getPath(pathParts, fileSystem);
                  if (fileNode && fileNode.type === 'file') {
                    component = (
                      <TextEditor
                        key={win.path}
                        initialContent={fileNode.content}
                        onSave={(newContent) => handleSaveFile(win.path!, newContent)}
                        fileName={fileNode.name}
                      />
                    );
                  }
                } else {
                  component = app.component;
                }

                if (!component) return null;

                return (
                  <Window
                    key={win.id}
                    id={win.id}
                    title={win.title}
                    onClose={() => closeWindow(win.id)}
                    onFocus={() => bringToFront(win.id)}
                    onMinimize={() => toggleMinimize(win.id)}
                    onMaximize={() => toggleMaximize(win.id)}
                    isMaximized={win.isMaximized}
                    defaultSize={app.defaultSize}
                    zIndex={win.zIndex}
                  >
                    {React.cloneElement(component as React.ReactElement, { key: win.id })}
                  </Window>
                );
              })}
            </AnimatePresence>
          </ContextMenuTrigger>
          {renderDesktopContextMenu()}
        </ContextMenu>
        
        {/* Overlays */}
        <AppGallery 
          isOpen={isGalleryOpen} 
          onClose={toggleGallery}
          apps={apps}
          openWindow={openWindow}
        />
        
        <Dock 
          apps={apps}
          windows={windows}
          openWindow={openWindow}
          onDockIconClick={bringToFront}
          toggleGallery={toggleGallery}
        />
      </main>

      {/* Lock Screen */}
      <AnimatePresence>
        {isLocked && <LockScreen onUnlock={handleUnlock} />}
      </AnimatePresence>

      {/* Enhanced Delete Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(isOpen) => !isOpen && setItemToDelete(null)}>
        <AlertDialogContent className="bg-gray-900/95 backdrop-blur-xl border-gray-700/50 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Item</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete "{itemToDelete?.split('/').pop()}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setItemToDelete(null)}
              className="bg-gray-700/50 border-gray-600/50 hover:bg-gray-600/50 text-white"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteItem} 
              className="bg-red-500/80 border-red-400/50 hover:bg-red-500 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}