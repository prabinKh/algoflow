import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  ChevronRight, 
  ListOrdered, 
  Plus,
  Search,
  Share2, 
  Layers,
  Zap,
  Box,
  Activity,
  Cpu,
  BookOpen,
  LayoutDashboard,
  Database,
  Terminal,
  Braces
} from 'lucide-react';
import { Algorithm, Category } from '../types';
import { cn } from '../lib/utils';

const iconMap: Record<string, any> = {
  ListOrdered,
  Search,
  Share2,
  Layers,
  Zap,
  Box,
  Activity,
  Cpu,
  Database,
  Terminal,
  Braces
};

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedAlgoId: string | null;
  setSelectedAlgoId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredAlgorithms: any[];
  categories: Category[];
  isAdmin?: boolean;
}

export default function Sidebar({ 
  isOpen, 
  setIsOpen, 
  selectedAlgoId, 
  setSelectedAlgoId,
  searchQuery,
  setSearchQuery,
  filteredAlgorithms,
  onAdd,
  setView,
  categories,
  isAdmin = false
}: SidebarProps & { 
  onAdd: () => void;
  setView: (v: 'app' | 'docs' | 'dashboard') => void;
}) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(() => categories.map(c => c.name));

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  return (
    <aside className={cn(
      "fixed top-0 left-0 h-screen bg-white dark:bg-[#0d0d0d] border-r border-slate-200 dark:border-slate-800 z-40 transition-all duration-300 overflow-hidden flex flex-col",
      isOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full lg:w-0 lg:translate-x-0"
    )}>
      <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
          A
        </div>
        <div>
          <h2 className="font-black text-xl tracking-tight leading-none">AlgoFlow</h2>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Code • Learn • Master</p>
        </div>
      </div>

      <div className="p-4">
        <button 
          onClick={() => {
            window.location.href = '/hub';
            setSelectedAlgoId('');
          }}
          className="w-full flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all mb-2"
        >
          <BookOpen size={18} />
          <span className="text-sm font-bold">Documentation Hub</span>
        </button>
        {isAdmin && (
          <button 
            onClick={() => setView('dashboard')}
            className="w-full flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl transition-all mb-4"
          >
            <LayoutDashboard size={18} />
            <span className="text-sm font-bold">Admin Dashboard</span>
          </button>
        )}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search algorithms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        {isAdmin && (
          <button 
            onClick={onAdd}
            className="w-full flex items-center justify-center gap-2 mt-4 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Plus size={18} />
            <span className="text-sm">Add Algorithm</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || Box;
          const isExpanded = expandedCategories.includes(category.name);
          const algosInCategory = filteredAlgorithms.filter(a => category.algorithms.includes(a.id));

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
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{category.name}</span>
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
                      <button
                        key={algo.id}
                        onClick={() => setSelectedAlgoId(algo.id)}
                        className={cn(
                          "w-full text-left px-4 py-2 rounded-lg text-sm transition-all relative overflow-hidden group",
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
                        <span className="relative z-10">{algo.name}</span>
                        {selectedAlgoId !== algo.id && (
                          <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={14} />
                          </div>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">PRO TIP</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Master the intuition behind each algorithm with our deep-dive guides and multi-language implementations.
          </p>
        </div>
      </div>
    </aside>
  );
}
