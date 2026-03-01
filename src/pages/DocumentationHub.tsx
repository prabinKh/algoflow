import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  ChevronRight, 
  Zap, 
  LayoutGrid, 
  List,
  ArrowUpRight,
  Sparkles,
  Terminal,
  Cpu,
  Database,
  Globe,
  Shield,
  Activity,
  Box,
  Layers,
  Share2,
  ListOrdered,
  Braces
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Algorithm } from '../types';
import { cn } from '../lib/utils';

const iconMap: Record<string, any> = {
  Terminal, Cpu, Database, Globe, Zap, Shield, Activity, Box, Layers, Search, Share2, ListOrdered, Braces, Sparkles
};

interface DocumentationHubProps {
  algorithms: Algorithm[];
}

export default function DocumentationHub({ algorithms }: DocumentationHubProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const sortedAlgorithms = useMemo(() => {
    return [...algorithms].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [algorithms]);

  const filteredAlgorithms = useMemo(() => {
    return sortedAlgorithms.filter(algo => 
      algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedAlgorithms, searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 selection:bg-indigo-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <header className="relative z-10 border-b border-slate-800/50 bg-black/40 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">Documentation Hub</h1>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Neural Knowledge Base v2.0</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search the matrix..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white placeholder:text-slate-600"
              />
            </div>
            <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'grid' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'list' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-indigo-400" />
            <h2 className="text-xl font-black tracking-tight text-white uppercase tracking-widest">Recently Initialized</h2>
          </div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {filteredAlgorithms.length} Nodes Found
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            "grid gap-6",
            viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}
        >
          {filteredAlgorithms.map((algo, index) => {
            const Icon = iconMap[algo.icon || 'Sparkles'] || Sparkles;
            return (
              <motion.div
                key={algo.id}
                variants={itemVariants}
                onClick={() => navigate(`/algo/${algo.id}`)}
                className={cn(
                  "group relative bg-slate-900/40 border border-slate-800/50 rounded-[2rem] overflow-hidden cursor-pointer hover:border-indigo-500/50 transition-all duration-500",
                  viewMode === 'list' ? "flex items-center p-6 gap-8" : "p-8"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className={cn(
                  "relative z-10 flex items-center justify-center bg-slate-950 border border-slate-800 rounded-2xl text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all duration-500",
                  viewMode === 'list' ? "w-16 h-16 shrink-0" : "w-14 h-14 mb-6"
                )}>
                  <Icon size={viewMode === 'list' ? 28 : 24} />
                  {index === 0 && !searchQuery && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-indigo-500 rounded-full animate-ping" />
                  )}
                </div>

                <div className="relative z-10 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400/70 group-hover:text-indigo-400 transition-colors">
                      {algo.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-800" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/70">
                      {algo.complexity.time}
                    </span>
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-white group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-2">
                    {algo.name}
                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1 translate-x-1" />
                  </h3>
                  <p className="text-sm text-slate-500 mt-3 line-clamp-2 leading-relaxed group-hover:text-slate-400 transition-colors">
                    {algo.description}
                  </p>
                </div>

                {viewMode === 'grid' && (
                  <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Verified Implementation</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-700 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {filteredAlgorithms.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-slate-700 mb-6 border border-slate-800">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-black text-white mb-2">No Neural Nodes Found</h3>
            <p className="text-slate-500 text-sm max-w-xs">The search criteria did not match any algorithms in the current matrix.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-8 px-6 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-500/20 transition-all"
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </main>

      <footer className="relative z-10 border-t border-slate-800/50 py-12 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 border border-slate-800">
              <Zap size={16} />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AlgoFlow Knowledge Engine</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-[10px] font-black text-slate-600 hover:text-indigo-400 uppercase tracking-widest transition-colors">Documentation</a>
            <a href="#" className="text-[10px] font-black text-slate-600 hover:text-indigo-400 uppercase tracking-widest transition-colors">API Reference</a>
            <a href="#" className="text-[10px] font-black text-slate-600 hover:text-indigo-400 uppercase tracking-widest transition-colors">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
