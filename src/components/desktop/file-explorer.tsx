
"use client";

import { useState } from "react";
import { getPath, type Directory, type File as FileType } from "@/lib/file-system";
import { Folder, FileText, ArrowLeft, Pencil, Trash2, FolderPlus, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import type { AppId } from "@/app/page";
import { Input } from "@/components/ui/input";

type FileExplorerProps = {
    fileSystem: Directory;
    currentPath: string;
    onOpenFile: (appId: AppId, path: string) => void;
    onCreateFile: (path: string) => void;
    onCreateFolder: (path: string) => void;
    onDeleteItem: (path: string) => void;
    onRenameItem: (path: string, currentName: string) => void;
    itemToRename: string | null;
    renameValue: string;
    setRenameValue: (value: string) => void;
    onRenameSubmit: (e?: React.FormEvent) => void;
    setItemToRename: (path: string | null) => void;
};

export function FileExplorer({ 
    fileSystem, 
    onOpenFile, 
    currentPath: initialPath, 
    onCreateFile, 
    onCreateFolder, 
    onDeleteItem,
    onRenameItem,
    itemToRename,
    renameValue,
    setRenameValue,
    onRenameSubmit,
    setItemToRename
}: FileExplorerProps) {
    const [currentPath, setCurrentPath] = useState(initialPath);

    const navigateTo = (path: string) => {
        const pathWithoutTilde = path.startsWith('~/') ? path.substring(1) : path;
        const newPathParts = pathWithoutTilde.split('/').filter(p => p);
        const targetNode = getPath(newPathParts, fileSystem);
        
        if (targetNode && targetNode.type === 'directory') {
            setCurrentPath(path);
        }
    };
    
    const goBack = () => {
        if (currentPath === '~' || currentPath === '~/Home') {
            return;
        };
        const parts = currentPath.split('/');
        parts.pop();
        const newPath = parts.length <= 1 ? '~/Home' : parts.join('/');
        navigateTo(newPath);
    };

    const handleDoubleClick = (item: FileType | Directory) => {
        const newPath = currentPath === '~' ? `~/${item.name}` : `${currentPath}/${item.name}`;
        if (item.type === 'directory') {
            navigateTo(newPath);
        } else {
            onOpenFile('editor', newPath);
        }
    };

    const pathParts = currentPath.startsWith('~/') ? currentPath.split('/').slice(1) : currentPath === '~' ? [] : currentPath.split('/');
    const currentNode = getPath(pathParts, fileSystem);

    if (!currentNode || currentNode.type !== 'directory') {
        return <div className="p-4 text-destructive">Error: Path not found or not a directory. Current path: {currentPath}</div>;
    }
    
    const renderContextMenu = () => (
        <ContextMenuContent>
            <ContextMenuItem onClick={() => onCreateFolder(currentPath)}>
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onCreateFile(currentPath)}>
                <FilePlus className="mr-2 h-4 w-4" />
                New Text File
            </ContextMenuItem>
        </ContextMenuContent>
    );

    const renderItemContextMenu = (itemPath: string, itemName: string) => (
         <ContextMenuContent>
            <ContextMenuItem onClick={() => onRenameItem(itemPath, itemName)}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onDeleteItem(itemPath)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
            </ContextMenuItem>
        </ContextMenuContent>
    );

    const sortedChildren = Object.values(currentNode.children).sort((a, b) => {
        if (a.type === 'directory' && b.type !== 'directory') return -1;
        if (a.type !== 'directory' && b.type === 'directory') return 1;
        return a.name.localeCompare(b.name);
    });

    return (
        <div className="h-full w-full bg-card flex flex-col">
            <div className="flex-shrink-0 p-2 border-b border-border/50 flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={goBack} disabled={currentPath === '~/Home' || currentPath === '~'}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="px-2 py-1 bg-secondary rounded-md text-sm truncate">
                    {currentPath}
                </div>
            </div>
             <ContextMenu>
                <ContextMenuTrigger className="h-full w-full">
                    <div className="h-full w-full p-4 overflow-y-auto">
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-6">
                            {sortedChildren.map((item: FileType | Directory) => {
                                const itemPath = `${currentPath}/${item.name}`;
                                const isRenaming = itemToRename === itemPath;

                                return (
                                    <ContextMenu key={item.name}>
                                        <ContextMenuTrigger>
                                            <div
                                                className="flex flex-col items-center gap-2 cursor-pointer group"
                                                onDoubleClick={() => handleDoubleClick(item)}
                                            >
                                                <div className="p-3 rounded-lg group-hover:bg-secondary transition-colors">
                                                    {item.type === 'directory' ? (
                                                        <Folder className="h-10 w-10 text-primary" />
                                                    ) : (
                                                        <FileText className="h-10 w-10 text-foreground" />
                                                    )}
                                                </div>
                                                {isRenaming ? (
                                                    <form onSubmit={onRenameSubmit}>
                                                        <Input 
                                                            type="text"
                                                            value={renameValue}
                                                            onChange={(e) => setRenameValue(e.target.value)}
                                                            onBlur={() => onRenameSubmit()}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Escape') setItemToRename(null);
                                                            }}
                                                            className="text-xs h-6 px-1"
                                                            autoFocus
                                                        />
                                                    </form>
                                                ) : (
                                                    <span className="text-xs text-center text-foreground w-full break-words">{item.name}</span>
                                                )}
                                            </div>
                                        </ContextMenuTrigger>
                                        {renderItemContextMenu(itemPath, item.name)}
                                    </ContextMenu>
                                )
                            })}
                         </div>
                    </div>
                </ContextMenuTrigger>
                {renderContextMenu()}
            </ContextMenu>
        </div>
    );
}

    