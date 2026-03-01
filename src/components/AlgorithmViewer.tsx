import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Download,
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
  Edit,
  Trash2
} from 'lucide-react';
import { Algorithm } from '../types';
import CodePanel from './CodePanel';
import ExplanationPanel from './ExplanationPanel';
import AssetsPanel from './AssetsPanel';
import CreateAlgorithmModal from './CreateAlgorithmModal';
import { cn } from '../lib/utils';

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
  onUpdate: (algo: Algorithm) => void;
  onDelete: (id: string) => void;
}

export default function AlgorithmViewer({ algorithm, onClose, onUpdate, onDelete }: AlgorithmViewerProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'info' | 'assets'>('code');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const Icon = iconMap[algorithm.icon || 'Sparkles'] || Sparkles;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <Icon size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                {algorithm.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              <div className="flex gap-1">
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                  algorithm.complexity.timeRating === 'good' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                  algorithm.complexity.timeRating === 'average' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                )}>
                  Time: {algorithm.complexity.time}
                </span>
              </div>
            </div>
            <h2 className="text-3xl font-black tracking-tight">{algorithm.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            {[
              { id: 'code', icon: Terminal, label: 'Code' },
              { id: 'info', icon: Info, label: 'Guide' },
              { id: 'assets', icon: FileText, label: 'Assets' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500">
            <Share2 size={20} />
          </button>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-indigo-500"
            title="Edit Algorithm"
          >
            <Edit size={20} />
          </button>
          <button 
            onClick={() => {
              onDelete(algorithm.id);
              onClose();
            }}
            className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-xl transition-colors text-rose-500"
            title="Delete Algorithm"
          >
            <Trash2 size={20} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-xl transition-colors text-slate-500 hover:text-rose-600"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="flex lg:hidden bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {[
          { id: 'code', icon: Terminal, label: 'Code' },
          { id: 'info', icon: Info, label: 'Guide' },
          { id: 'assets', icon: FileText, label: 'Assets' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === tab.id 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
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

        {/* Right: Explanation Panel or Assets Panel */}
        <div className={cn(
          "space-y-6",
          activeTab === 'code' && "hidden lg:block",
          activeTab === 'assets' && "lg:hidden"
        )}>
          {activeTab === 'info' ? <ExplanationPanel algorithm={algorithm} /> : <AssetsPanel algorithm={algorithm} />}
        </div>

        {/* Desktop Assets Panel (Full Width if active) */}
        {activeTab === 'assets' && (
          <div className="hidden lg:block lg:col-span-2">
            <AssetsPanel algorithm={algorithm} />
          </div>
        )}
      </div>

      <CreateAlgorithmModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(updated) => {
          onUpdate(updated);
          setIsEditModalOpen(false);
        }}
        initialData={algorithm}
        categories={[]} // This will be handled inside if needed or passed down
      />
    </motion.div>
  );
}
