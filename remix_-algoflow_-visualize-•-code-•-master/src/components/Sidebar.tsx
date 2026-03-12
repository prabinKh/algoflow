import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // ← fixed import
import {
  Search,
  ChevronDown,
  ChevronRight,
  ListOrdered,
  Search as SearchIcon,
  Share2,
  Layers,
  Zap,
  Box,
  Hash,
  GitBranch,
  Activity,
  Cpu,
  BookOpen,
  Sun,
  Moon,
  LayoutDashboard,
  Database,
  Globe,
  Shield,
  Terminal,
  Braces,
  Wand2,
} from 'lucide-react';
import { Algorithm, Category } from '../types';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useNavigate, useLocation } from 'react-router-dom';

const iconMap: Record<string, React.ComponentType<any>> = {
  ListOrdered,
  Search: SearchIcon,
  Share2,
  Layers,
  Zap,
  Box,
  Hash,
  GitBranch,
  Activity,
  Cpu,
  Database,
  Globe,
  Shield,
  Terminal,
  Braces,
};

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedAlgoId: string | null;
  setSelectedAlgoId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredAlgorithms: Algorithm[];
  categories: Category[];
  setView: (v: 'app' | 'docs' | 'dashboard') => void;
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  selectedAlgoId,
  setSelectedAlgoId,
  searchQuery,
  setSearchQuery,
  filteredAlgorithms,
  setView,
  categories,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    () => categories.map((c) => c.name)
  );

  const isDocsActive = location.pathname === '/documentation';
  const isDashboardActive = location.pathname === '/dashboard';

  useEffect(() => {
    // Close sidebar on mobile when route changes
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname, setIsOpen]);

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const goToHome = () => {
    navigate('/');
    // Optional: close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-white dark:bg-[#0d0d0d] border-r border-slate-200 dark:border-slate-800 z-40 transition-all duration-300 overflow-hidden flex flex-col",
          isOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full lg:w-72 lg:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
          {/* Clickable logo area */}
          <button
            onClick={goToHome}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
            aria-label="Go to home"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
              A
            </div>
            <div className="text-left">
              <h2 className="font-black text-xl tracking-tight leading-none">AlgoFlow</h2>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">
                Code • Learn • Master
              </p>
            </div>
          </button>
        </div>

        <div className="p-4 space-y-2">
          <Button
            onClick={() => {
              setView('docs');
              setSelectedAlgoId('');
            }}
            variant={isDocsActive ? 'primary' : 'ghost'}
            className={cn(
              "w-full justify-start gap-3 p-3 rounded-xl transition-all",
              !isDocsActive && "bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 hover:bg-indigo-500/10"
            )}
          >
            <BookOpen size={18} />
            <span className="text-sm font-bold">Documentation Hub</span>
          </Button>

          <Button
            onClick={() => setView('dashboard')}
            variant={isDashboardActive ? 'primary' : 'ghost'}
            className={cn(
              "w-full justify-start gap-3 p-3 rounded-xl transition-all",
              !isDashboardActive && "text-slate-400 hover:bg-white/5"
            )}
          >
            <LayoutDashboard size={18} />
            <span className="text-sm font-bold">Admin Dashboard</span>
          </Button>

          <Button
            onClick={() => navigate('/forge')}
            variant="ghost"
            className="w-full justify-start gap-3 p-3 text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all border border-transparent hover:border-emerald-500/20"
          >
            <Wand2 size={18} />
            <span className="text-sm font-bold">Forge New Node</span>
          </Button>

          <div className="pt-2">
            <Input
              placeholder="Search algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={18} />}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Box;
            const isExpanded = expandedCategories.includes(category.name);
            const algosInCategory = filteredAlgorithms.filter((a) =>
              category.algorithms.includes(a.id)
            );

            if (algosInCategory.length === 0 && searchQuery) return null;

            return (
              <div key={category.name} className="space-y-1">
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500 group-hover:text-indigo-500 transition-colors">
                      <Icon size={16} />
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                      {category.name}
                    </span>
                  </div>
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4 space-y-1"
                    >
                      {algosInCategory.map((algo) => (
                        <div
                          key={algo.id}
                          onClick={() => setSelectedAlgoId(algo.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedAlgoId(algo.id);
                            }
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 rounded-lg text-sm transition-all relative overflow-hidden group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                            selectedAlgoId === algo.id
                              ? "bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                          )}
                        >
                          {selectedAlgoId === algo.id && (
                            <motion.div
                              layoutId="active-pill"
                              className="absolute inset-0 bg-indigo-600 -z-10"
                            />
                          )}
                          <div className="relative z-10 flex items-center justify-between w-full">
                            <span className="truncate">{algo.name}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate('/documentation');
                                  setTimeout(() => {
                                    const el = document.getElementById(`algo-${algo.id}`);
                                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }, 100);
                                }}
                                className="p-1 hover:bg-white/20 rounded-md transition-colors"
                                title="View Documentation"
                              >
                                <BookOpen size={12} />
                              </button>
                              {selectedAlgoId !== algo.id && <ChevronRight size={14} />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                System Online
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={10} className="text-amber-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Synced
              </span>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">PRO TIP</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Master the intuition behind each algorithm with our deep-dive guides and multi-language implementations.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}