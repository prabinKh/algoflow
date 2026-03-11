import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Download,
  Edit3,
  Terminal,
  Play,
  Info,
  Sparkles,
  Cpu,
  Database,
  Globe,
  Zap,
  Shield,
  Activity,
  Box,
  Layers,
  Search,
  ListOrdered,
  Braces,
  FileText,
  HelpCircle
} from 'lucide-react';
import { Algorithm } from '../types';
import CodePanel from './CodePanel';
import ExplanationPanel from './ExplanationPanel';
import AssetsPanel from './AssetsPanel';
import QuestionsPanel from './QuestionsPanel';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useNavigate } from 'react-router-dom';

const iconMap: Record<string, any> = {
  Terminal,
  Cpu,
  Database,
  Globe,
  Zap,
  Shield,
  Activity,
  Box,
  Layers,
  Search,
  Share2,
  ListOrdered,
  Braces,
  Sparkles
};

interface AlgorithmViewerProps {
  algorithm: Algorithm;
  onClose: () => void;
}

export default function AlgorithmViewer({ algorithm, onClose }: AlgorithmViewerProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'code' | 'info' | 'assets' | 'assessment'>('code');
  const Icon = iconMap[algorithm.icon || 'Sparkles'] || Sparkles;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <Card variant="glass" className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] -z-10 group-hover:bg-indigo-600/10 transition-colors" />
        
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 border border-white/20">
            <Icon size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                {algorithm.category}
              </span>
              <div className="flex gap-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                  algorithm.complexity.timeRating === 'good' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  algorithm.complexity.timeRating === 'average' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                  "bg-rose-500/10 text-rose-400 border-rose-500/20"
                )}>
                  Time: {algorithm.complexity.time}
                </span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-white">{algorithm.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex bg-white/5 p-1 rounded-2xl border border-white/10">
            {[
              { id: 'code', icon: Terminal, label: 'Source' },
              { id: 'info', icon: Info, label: 'Guide' },
              { id: 'assets', icon: FileText, label: 'Assets' },
              { id: 'assessment', icon: HelpCircle, label: 'Quiz' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-11 h-11 text-slate-500">
              <Share2 size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(`/forge/${algorithm.id}`)}
              className="w-11 h-11 text-slate-500 hover:text-amber-400"
            >
              <Edit3 size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="w-11 h-11 text-slate-500 hover:text-rose-400"
            >
              <X size={24} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Mobile Tabs */}
      <div className="flex lg:hidden bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-xl overflow-x-auto no-scrollbar">
        {[
          { id: 'code', icon: Terminal, label: 'Source' },
          { id: 'info', icon: Info, label: 'Guide' },
          { id: 'assets', icon: FileText, label: 'Assets' },
          { id: 'assessment', icon: HelpCircle, label: 'Quiz' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                : "text-slate-500 hover:bg-white/5"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Code Panel */}
        <div className={cn(
          "space-y-6",
          activeTab !== 'code' && "hidden lg:block"
        )}>
          <CodePanel algorithm={algorithm} />
        </div>

        {/* Right: Explanation Panel or Assets Panel or Questions Panel */}
        <div className={cn(
          "space-y-6",
          activeTab === 'code' && "hidden lg:block",
          (activeTab === 'assets' || activeTab === 'assessment') && "lg:hidden"
        )}>
          {activeTab === 'info' && <ExplanationPanel algorithm={algorithm} />}
          {activeTab === 'assets' && <div className="lg:hidden"><AssetsPanel algorithm={algorithm} /></div>}
          {activeTab === 'assessment' && <div className="lg:hidden"><QuestionsPanel algorithm={algorithm} /></div>}
        </div>

        {/* Desktop Assets Panel (Full Width if active) */}
        {activeTab === 'assets' && (
          <div className="hidden lg:block lg:col-span-2">
            <AssetsPanel algorithm={algorithm} />
          </div>
        )}

        {/* Desktop Questions Panel (Full Width if active) */}
        {activeTab === 'assessment' && (
          <div className="hidden lg:block lg:col-span-2">
            <QuestionsPanel algorithm={algorithm} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
