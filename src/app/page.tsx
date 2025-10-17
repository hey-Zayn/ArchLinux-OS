"use client";
import React from 'react';
import { AnimatePresence } from 'framer-motion';
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
  Globe 
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

export type AppId = 'terminal' | 'settings' | 'home' | 'editor' | 'music' | 'browser';

export interface App {
  id: AppId;
  title: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  component?: React.ReactNode;
  defaultSize: { width: number; height: number };
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

  // Apps configuration
  const APPS: Record<AppId, App> = React.useMemo(() => ({
    terminal: {
      id: 'terminal',
      title: 'Terminal',
      icon: Terminal,
      component: <TerminalComponent />,
      defaultSize: { width: 800, height: 500 },
    },
    settings: {
      id: 'settings',
      title: 'System Settings',
      icon: SettingsIcon,
      component: <Settings />,
      defaultSize: { width: 500, height: 600 },
    },
    home: {
      id: 'home',
      title: 'File Manager',
      icon: HomeIcon,
      defaultSize: { width: 700, height: 500 },
    },
    editor: {
      id: 'editor',
      title: 'Text Editor',
      icon: FileText,
      defaultSize: { width: 600, height: 450 },
    },
    music: {
      id: 'music',
      title: 'Music Player',
      icon: Music,
      component: <MusicPlayer fileSystem={fileSystem} onOpenFile={(path) => openWindow('music', path)} />,
      defaultSize: { width: 400, height: 550 },
    },
    browser: {
      id: 'browser',
      title: 'Web Browser',
      icon: Globe,
      component: <Browser />,
      defaultSize: { width: 1024, height: 768 },
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

  // Desktop items and icons
  const desktopItems = React.useMemo(() => {
    const homeDir = getPath([], fileSystem);
    if (homeDir?.type !== 'directory' || !homeDir.children.Home || homeDir.children.Home.type !== 'directory') {
      return [];
    }

    return Object.values(homeDir.children.Home.children).map(item => ({
      id: item.name,
      name: item.name,
      icon: item.type === 'directory' ? (item.name === 'Music' ? Music : Folder) : FileText,
      path: `~/Home/${item.name}`,
      action: () => openWindow(item.type === 'directory' ? 'home' : 'editor', `~/Home/${item.name}`),
    }));
  }, [fileSystem, openWindow]);

  const systemIcons = [
    { id: 'home-icon', name: 'Home', icon: HomeIcon, path: '~/Home', action: () => openWindow('home', '~/Home') },
    { id: 'trash', name: 'Trash', icon: Trash2, path: '~/Trash', action: () => console.log('Open Trash') },
  ];

  const allDesktopIcons = [...systemIcons, ...desktopItems];

  // Context menus
  const renderDesktopContextMenu = () => (
    <ContextMenuContent className="bg-white/10 backdrop-blur-md border-white/20">
      <ContextMenuItem onClick={() => handleCreateItem('~/Home', 'folder')}>
        <FolderPlus className="mr-2 h-4 w-4" />
        New Folder
      </ContextMenuItem>
      <ContextMenuItem onClick={() => handleCreateItem('~/Home', 'file')}>
        <FilePlus className="mr-2 h-4 w-4" />
        New Text File
      </ContextMenuItem>
    </ContextMenuContent>
  );

  const renderItemContextMenu = (item: { id: string; name: string; path: string }) => (
    <ContextMenuContent className="bg-white/10 backdrop-blur-md border-white/20">
      <ContextMenuItem onClick={() => handleRename(item.path, item.name)}>
        <Pencil className="mr-2 h-4 w-4" />
        Rename
      </ContextMenuItem>
      <ContextMenuItem 
        onClick={() => setItemToDelete(item.path)} 
        className="text-red-400 focus:text-red-300"
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
        className="h-screen w-screen overflow-hidden font-sans relative bg-cover bg-center"
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
            
            {/* Desktop Icons */}
            <div className="p-4 pt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {allDesktopIcons.map(item => {
                const Icon = item.icon;
                const isRenaming = itemToRename === item.path;

                return (
                  <ContextMenu key={item.id}>
                    <ContextMenuTrigger>
                      <div 
                        className="flex flex-col items-center gap-2 w-24 text-center cursor-pointer"
                        onDoubleClick={item.action}
                      >
                        <Icon className="h-12 w-12 text-white drop-shadow-lg" />
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
                              className="text-sm h-6 px-1 bg-white/90 text-black border-none focus:ring-1 focus:ring-white/30"
                              autoFocus
                            />
                          </form>
                        ) : (
                          <span className="text-white text-sm font-medium drop-shadow-md break-words w-full">
                            {item.name}
                          </span>
                        )}
                      </div>
                    </ContextMenuTrigger>
                    {item.id !== 'trash' && item.id !== 'home-icon' && renderItemContextMenu(item)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(isOpen) => !isOpen && setItemToDelete(null)}>
        <AlertDialogContent className="bg-white/10 backdrop-blur-md border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Item</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              This action cannot be undone. The item will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} variant="destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}