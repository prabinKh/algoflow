import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus, 
  Terminal, 
  Info, 
  Sparkles, 
  Clock, 
  Database, 
  Target, 
  Lightbulb, 
  History,
  Cpu,
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
  FileText,
  FileVideo,
  Image as ImageIcon,
  File,
  Upload,
  Trash2
} from 'lucide-react';
import { Algorithm, Language, Asset } from '../types';
import { cn } from '../lib/utils';

const AVAILABLE_ICONS = [
  { name: 'Terminal', icon: Terminal },
  { name: 'Cpu', icon: Cpu },
  { name: 'Database', icon: Database },
  { name: 'Globe', icon: Globe },
  { name: 'Zap', icon: Zap },
  { name: 'Shield', icon: Shield },
  { name: 'Activity', icon: Activity },
  { name: 'Box', icon: Box },
  { name: 'Layers', icon: Layers },
  { name: 'Search', icon: Search },
  { name: 'Share2', icon: Share2 },
  { name: 'ListOrdered', icon: ListOrdered },
  { name: 'Braces', icon: Braces },
];

interface CreateAlgorithmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (algo: Algorithm) => void;
  categories: string[];
  initialData?: Algorithm;
}

export default function CreateAlgorithmModal({ isOpen, onClose, onSave, categories, initialData }: CreateAlgorithmModalProps) {
  const [activeLang, setActiveLang] = useState<Language>('python');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [formData, setFormData] = useState<Partial<Algorithm>>(() => initialData || {
    name: '',
    category: categories[0] || '',
    description: '',
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
      timeRating: 'average',
      spaceRating: 'good',
    },
    code: {
      python: { iterative: '' },
      cpp: { iterative: '' },
      c: { iterative: '' },
      rust: { iterative: '' },
    },
    explanation: {
      problem: '',
      intuition: '',
      walkthrough: '',
      whenToUse: '',
    },
    assets: []
  });

  React.useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {
        name: '',
        category: categories[0] || '',
        description: '',
        complexity: {
          time: 'O(n)',
          space: 'O(1)',
          timeRating: 'average',
          spaceRating: 'good',
        },
        code: {
          python: { iterative: '' },
          cpp: { iterative: '' },
          c: { iterative: '' },
          rust: { iterative: '' },
        },
        explanation: {
          problem: '',
          intuition: '',
          walkthrough: '',
          whenToUse: '',
        },
        assets: []
      });
    }
  }, [isOpen, initialData, categories]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: Asset['type']) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newAsset: Asset = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type,
        data: event.target?.result as string
      };
      setFormData(prev => ({
        ...prev,
        assets: [...(prev.assets || []), newAsset]
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeAsset = (id: string) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets?.filter(a => a.id !== id)
    }));
  };

  const updateCode = (lang: Language, code: string) => {
    setFormData(prev => ({
      ...prev,
      code: {
        ...prev.code!,
        [lang]: { iterative: code }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlgo: Algorithm = {
      ...formData as Algorithm,
      id: initialData?.id || formData.name?.toLowerCase().replace(/\s+/g, '-') || Date.now().toString(),
    };
    onSave(newAlgo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40, rotateX: 10 }}
          className="bg-slate-950 border border-slate-800/50 w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-[3rem] shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)] flex flex-col relative"
        >
          {/* Futuristic Background Accents */}
          <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
          <div className="absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
          
          <div className="p-8 border-b border-slate-800/50 flex items-center justify-between bg-slate-950/50 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/40 rotate-3">
                <Plus size={24} className={cn(initialData && "rotate-45")} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  {initialData ? 'Update Neural Node' : 'Forge New Algorithm'}
                </h2>
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  {initialData ? 'Modify existing core logic' : 'System Input v2.0'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-12 h-12 flex items-center justify-center hover:bg-slate-800 rounded-2xl transition-all text-slate-400 hover:text-white border border-transparent hover:border-slate-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
            {/* Basic Info */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-white">Core Identity</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Algorithm Designation</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Quantum Sort"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white placeholder:text-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Classification</label>
                      <button 
                        type="button"
                        onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                        className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-400 transition-colors"
                      >
                        {isAddingNewCategory ? 'Select Existing' : 'Add New'}
                      </button>
                    </div>
                    <div className="relative">
                      {isAddingNewCategory ? (
                        <input 
                          type="text"
                          value={newCategoryName}
                          onChange={e => {
                            setNewCategoryName(e.target.value);
                            setFormData({...formData, category: e.target.value});
                          }}
                          placeholder="New Category Name"
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white placeholder:text-slate-700"
                        />
                      ) : (
                        <>
                          <select 
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none text-white"
                          >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            {categories.length === 0 && <option value="Uncategorized">Uncategorized</option>}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <Layers size={16} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Algorithm Icon (Neural Signature)</label>
                  <div className="grid grid-cols-5 sm:grid-cols-7 gap-3">
                    {AVAILABLE_ICONS.map(({ name, icon: Icon }) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setFormData({...formData, icon: name})}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-all border",
                          formData.icon === name 
                            ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/40 scale-110" 
                            : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                        )}
                        title={name}
                      >
                        <Icon size={20} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission Briefing (Description)</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the algorithm's primary objective..."
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32 resize-none text-white placeholder:text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Activity size={18} />
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-white">Metrics</h3>
                </div>
                
                <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-[2rem] space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Time Velocity</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.complexity?.time}
                        onChange={e => setFormData({...formData, complexity: {...formData.complexity!, time: e.target.value}})}
                        placeholder="O(n log n)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-emerald-400"
                      />
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Memory Payload</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.complexity?.space}
                        onChange={e => setFormData({...formData, complexity: {...formData.complexity!, space: e.target.value}})}
                        placeholder="O(1)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-emerald-400"
                      />
                      <Database className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                    </div>
                  </div>
                </div>

                {/* Reference Assets */}
                <div className="space-y-6 pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Layers size={18} />
                    </div>
                    <h3 className="text-lg font-black tracking-tight text-white">Reference Assets</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { type: 'pdf', icon: FileText, label: 'PDF', accept: '.pdf' },
                      { type: 'text', icon: File, label: 'Text', accept: '.txt,.md' },
                      { type: 'image', icon: ImageIcon, label: 'Image', accept: 'image/*' },
                      { type: 'video', icon: FileVideo, label: 'Video', accept: 'video/*' },
                    ].map((item) => (
                      <label key={item.type} className="cursor-pointer group">
                        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-950 border border-slate-800 group-hover:border-indigo-500/50 transition-all">
                          <item.icon size={20} className="text-slate-500 group-hover:text-indigo-400" />
                          <span className="text-[10px] font-black text-slate-600 group-hover:text-slate-400 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <input 
                          type="file" 
                          accept={item.accept} 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, item.type as any)} 
                        />
                      </label>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {formData.assets?.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500">
                            {asset.type === 'pdf' && <FileText size={16} />}
                            {asset.type === 'text' && <File size={16} />}
                            {asset.type === 'image' && <ImageIcon size={16} />}
                            {asset.type === 'video' && <FileVideo size={16} />}
                          </div>
                          <span className="text-xs font-bold text-slate-300 truncate max-w-[150px]">{asset.name}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeAsset(asset.id)}
                          className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Learning Guide */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Info size={18} />
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-white">Knowledge Base</h3>
                </div>
                <div className="h-px flex-1 bg-slate-800/50 mx-6" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Target size={12} className="text-rose-500" /> Objective
                    </label>
                    <textarea 
                      value={formData.explanation?.problem}
                      onChange={e => setFormData({...formData, explanation: {...formData.explanation!, problem: e.target.value}})}
                      placeholder="What problem does this solve?"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Lightbulb size={12} className="text-amber-500" /> Core Logic
                    </label>
                    <textarea 
                      value={formData.explanation?.intuition}
                      onChange={e => setFormData({...formData, explanation: {...formData.explanation!, intuition: e.target.value}})}
                      placeholder="The 'Aha!' moment behind the algorithm..."
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <History size={12} className="text-indigo-500" /> Execution Sequence
                  </label>
                  <div className="relative">
                    <textarea 
                      value={formData.explanation?.walkthrough}
                      onChange={e => setFormData({...formData, explanation: {...formData.explanation!, walkthrough: e.target.value}})}
                      placeholder="Step 01: Initialize...&#10;Step 02: Iterate...&#10;Step 03: Return..."
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-[2rem] px-8 py-8 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-[224px] resize-none text-white leading-relaxed"
                    />
                    <div className="absolute left-4 top-8 bottom-8 w-px bg-gradient-to-b from-indigo-500/50 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </section>

            {/* Code Implementation */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Terminal size={18} />
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-white">Source Code Matrix</h3>
                </div>
                
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {(['python', 'c', 'cpp', 'rust'] as Language[]).map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLang(lang)}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        activeLang === lang 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                          : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      {lang === 'cpp' ? 'C++' : lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 rounded-[2rem] blur opacity-25 group-focus-within:opacity-100 transition-opacity" />
                <textarea 
                  value={formData.code?.[activeLang]?.iterative || ''}
                  onChange={e => updateCode(activeLang, e.target.value)}
                  className="relative w-full bg-slate-950 border border-slate-800 rounded-[2rem] px-8 py-8 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-80 resize-none text-emerald-400 custom-scrollbar"
                  placeholder={`// Implement ${activeLang.toUpperCase()} logic here...`}
                />
                <div className="absolute top-4 right-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest">Compiler Ready</span>
                </div>
              </div>
            </section>
          </form>

          <div className="p-8 border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-md flex items-center justify-end gap-4">
            <button 
              onClick={onClose}
              className="px-8 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:text-white hover:bg-slate-900 transition-all border border-transparent hover:border-slate-800"
            >
              Abort Mission
            </button>
            <button 
              onClick={handleSubmit}
              className="px-12 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-black tracking-tight shadow-xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <Zap size={18} />
              {initialData ? 'Update Algorithm' : 'Initialize Algorithm'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
