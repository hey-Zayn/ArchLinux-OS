"use client";

import { motion, AnimatePresence } from "framer-motion";
import { App, AppId } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Grid3X3, List, Clock, Filter } from "lucide-react";
import { useState, useMemo } from "react";

type AppGalleryProps = {
  isOpen: boolean;
  onClose: () => void;
  apps: App[];
  openWindow: (appId: AppId) => void;
  recentApps?: AppId[];
};

type ViewMode = "grid" | "list";

export function AppGallery({ isOpen, onClose, apps, openWindow, recentApps = [] }: AppGalleryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const allCategories = apps.map(app => app.category).filter(Boolean);
    return ["all", ...Array.from(new Set(allCategories))] as string[];
  }, [apps]);

  const filteredApps = useMemo(() => {
    let filtered = apps;

    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(app => app.category === selectedCategory);
    }

    return filtered;
  }, [apps, searchQuery, selectedCategory]);

  const recentAppsList = useMemo(() => {
    return apps.filter(app => recentApps.includes(app.id));
  }, [apps, recentApps]);

  const handleAppClick = (appId: AppId) => {
    openWindow(appId);
    onClose();
    setSearchQuery("");
  };

  const handleClose = () => {
    onClose();
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-black/10 border border-gray-800 rounded-xl w-full max-w-5xl max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Applications</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'} available
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-900 rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-8 px-3 rounded-md"
                    >
                      <Grid3X3 size={16} />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-8 px-3 rounded-md"
                    >
                      <List size={16} />
                    </Button>
                  </div>

                  <Button
                    onClick={handleClose}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md hover:bg-gray-800"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-12 bg-gray-900/50 border-gray-700 focus:border-gray-600 text-white rounded-lg"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white"
                  >
                    <X size={14} />
                  </Button>
                )}
              </div>
            </div>

            {/* Categories */}
            {categories.length > 1 && (
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <Filter size={16} className="text-gray-400" />
                  <span className="text-gray-400 text-sm font-medium">Categories</span>
                </div>
                <div className="flex gap-1 overflow-x-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors
                        ${selectedCategory === category 
                          ? 'bg-gray-800 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Apps Section */}
            {recentAppsList.length > 0 && !searchQuery && selectedCategory === "all" && (
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-300">Recently Used</h3>
                </div>
                <div className="grid grid-cols-8 gap-3">
                  {recentAppsList.slice(0, 8).map((app) => {
                    const Icon = app.icon;
                    return (
                      <motion.div
                        key={app.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex flex-col items-center gap-2 cursor-pointer group"
                        onClick={() => handleAppClick(app.id)}
                      >
                        <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                          <Icon className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-xs text-gray-400 text-center group-hover:text-white transition-colors">
                          {app.title}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Apps Grid/List */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
              {filteredApps.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 text-lg mb-2">No applications found</div>
                  <div className="text-gray-500 text-sm">Try adjusting your search or filter</div>
                </div>
              ) : viewMode === "grid" ? (
                <motion.div
                  layout
                  className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4"
                >
                  {filteredApps.map((app) => {
                    const Icon = app.icon;
                    return (
                      <motion.div
                        key={app.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex flex-col items-center gap-3 cursor-pointer group"
                        onClick={() => handleAppClick(app.id)}
                      >
                        <div className="relative p-4 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                          <Icon className="h-8 w-8 text-gray-300 group-hover:text-white transition-colors" />
                          {app.category && app.category !== "all" && (
                            <div className="absolute -top-1 -right-1">
                              <div className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded capitalize">
                                {app.category}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <span className="text-sm text-gray-200 font-medium group-hover:text-white transition-colors block">
                            {app.title}
                          </span>
                          {app.description && (
                            <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors block mt-1">
                              {app.description}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                // List View
                <motion.div layout className="space-y-2">
                  {filteredApps.map((app) => {
                    const Icon = app.icon;
                    return (
                      <motion.div
                        key={app.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
                        className="flex items-center gap-4 p-4 rounded-lg cursor-pointer border border-transparent hover:border-gray-700 transition-all"
                        onClick={() => handleAppClick(app.id)}
                      >
                        <div className="p-3 bg-gray-800 rounded-lg">
                          <Icon className="h-6 w-6 text-gray-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-gray-200 font-medium">{app.title}</div>
                          {app.description && (
                            <div className="text-gray-400 text-sm">{app.description}</div>
                          )}
                        </div>
                        {app.category && app.category !== "all" && (
                          <div className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded capitalize">
                            {app.category}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}