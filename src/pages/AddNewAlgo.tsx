import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Zap, 
  Sparkles, 
  Terminal, 
  Cpu, 
  Database, 
  Globe, 
  Shield, 
  Activity, 
  Box, 
  Layers, 
  Search, 
  Share2, 
  ListOrdered, 
  Braces,
  Clock,
  Target,
  Lightbulb,
  History,
  FileText,
  FileVideo,
  Image as ImageIcon,
  File,
  Trash2,
  Eye,
  Layout,
  Info,
  AlertCircle,
  Maximize2,
  Minimize2,
  Copy,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Algorithm, Language, Asset } from '../types';
import { cn } from '../lib/utils';
import CodePanel from '../components/CodePanel';
import ExplanationPanel from '../components/ExplanationPanel';
import AssetsPanel from '../components/AssetsPanel';

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

interface AddNewAlgoProps {
  onSave: (algo: Algorithm) => Promise<void>;
  categories: string[];
}

export default function AddNewAlgo({ onSave, categories }: AddNewAlgoProps) {
  const navigate = useNavigate();
  const [activeLang, setActiveLang] = useState<Language>('python');
  const [previewTab, setPreviewTab] = useState<'code' | 'info' | 'assets'>('code');
  const [focusedSection, setFocusedSection] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  const filteredCategories = useMemo(() => 
    categories.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase())),
    [categories, categorySearch]
  );
  
  const [formData, setFormData] = useState<Algorithm>({
    id: '',
    name: '',
    category: categories[0] || 'Uncategorized',
    description: '',
    icon: 'Sparkles',
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-indigo-500', 'ring-offset-4', 'ring-offset-[#0a0a0a]');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-4', 'ring-offset-[#0a0a0a]');
      }, 2000);
    }
  };

  const copyId = () => {
    const id = formData.name.toLowerCase().replace(/\s+/g, '-') || 'pending-id';
    navigator.clipboard.writeText(id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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
        ...prev.code,
        [lang]: { iterative: code }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      scrollToSection('identity');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newAlgo: Algorithm = {
        ...formData,
        id: formData.name.toLowerCase().replace(/\s+/g, '-') || Date.now().toString(),
      };
      await onSave(newAlgo);
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconMap: Record<string, any> = {
    Terminal, Cpu, Database, Globe, Zap, Shield, Activity, Box, Layers, Search, Share2, ListOrdered, Braces, Sparkles
  };
  const PreviewIcon = iconMap[formData.icon || 'Sparkles'] || Sparkles;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-slate-800/50 p-6">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 flex items-center justify-center bg-slate-900 hover:bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all border border-slate-800"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">Forge New Algorithm</h1>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">System Input v2.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Draft Mode</span>
            </div>
            <button 
              onClick={() => navigate(-1)}
              className="px-8 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:text-white hover:bg-slate-900 transition-all border border-transparent hover:border-slate-800"
            >
              Abort Mission
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={cn(
                "px-12 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-black tracking-tight shadow-xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap size={18} />
              )}
              {isSubmitting ? 'Initializing...' : 'Initialize Algorithm'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-8 grid grid-cols-1 xl:grid-cols-2 gap-12 relative">
        {/* Floating Section Nav */}
        <div className="hidden 2xl:block fixed left-8 top-1/2 -translate-y-1/2 space-y-4 z-30">
          {[
            { id: 'identity', icon: Sparkles, label: 'Identity' },
            { id: 'metrics', icon: Activity, label: 'Metrics' },
            { id: 'assets', icon: Layers, label: 'Assets' },
            { id: 'knowledge', icon: Info, label: 'Knowledge' },
            { id: 'code', icon: Terminal, label: 'Source' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="group flex items-center gap-3 p-3 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all"
              title={item.label}
            >
              <item.icon size={20} className="text-slate-500 group-hover:text-indigo-400" />
              <span className="max-w-0 overflow-hidden group-hover:max-w-[100px] transition-all text-[10px] font-black uppercase tracking-widest text-slate-400">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Left Side: Form */}
        <div className={cn(
          "space-y-12 pb-24 transition-all duration-500",
          focusedSection ? "xl:col-span-2" : ""
        )}>
          {/* Core Identity */}
          <section id="identity" className={cn(
            "space-y-8 transition-all duration-500",
            focusedSection === 'identity' ? "bg-slate-900/20 p-8 rounded-[3rem] border border-indigo-500/20" : ""
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-black tracking-tight text-white">Core Identity</h2>
              </div>
              <button 
                onClick={() => setFocusedSection(focusedSection === 'identity' ? null : 'identity')}
                className="p-2 text-slate-500 hover:text-white transition-colors"
              >
                {focusedSection === 'identity' ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Algorithm Designation</label>
                  {formData.name && (
                    <button 
                      onClick={copyId}
                      className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors"
                    >
                      {isCopied ? <Check size={10} /> : <Copy size={10} />}
                      ID: {formData.name.toLowerCase().replace(/\s+/g, '-')}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Quantum Sort"
                    className={cn(
                      "w-full bg-slate-900/50 border rounded-2xl px-6 py-5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white placeholder:text-slate-700",
                      formData.name ? "border-slate-800" : "border-rose-500/50"
                    )}
                  />
                  {!formData.name && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-rose-500">
                      <AlertCircle size={18} />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
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
                <div className="relative space-y-2">
                  {isAddingNewCategory ? (
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={newCategoryName}
                        onChange={e => {
                          setNewCategoryName(e.target.value);
                          setFormData({...formData, category: e.target.value});
                        }}
                        placeholder="New Category Name"
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white placeholder:text-slate-700"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="relative mb-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input 
                          type="text"
                          placeholder="Search classifications..."
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          className="w-full bg-slate-900/30 border border-slate-800/50 rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white"
                        />
                      </div>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none text-white"
                      >
                        {filteredCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        {filteredCategories.length === 0 && <option value="" disabled>No matches found</option>}
                      </select>
                      <div className="absolute right-6 bottom-5 pointer-events-none text-slate-500">
                        <Layers size={18} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Algorithm Icon (Neural Signature)</label>
              <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-13 gap-3">
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

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission Briefing (Description)</label>
              <textarea 
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the algorithm's primary objective..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-40 resize-none text-white placeholder:text-slate-700 leading-relaxed"
              />
            </div>
          </section>

          {/* Metrics & Assets */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div id="metrics" className={cn(
              "space-y-8 transition-all duration-500",
              focusedSection === 'metrics' ? "bg-slate-900/20 p-8 rounded-[3rem] border border-emerald-500/20" : ""
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Activity size={20} />
                  </div>
                  <h2 className="text-xl font-black tracking-tight text-white">Metrics</h2>
                </div>
                <button 
                  onClick={() => setFocusedSection(focusedSection === 'metrics' ? null : 'metrics')}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  {focusedSection === 'metrics' ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
              </div>
              
              <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-[2.5rem] space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Time Velocity</label>
                    <div className="flex gap-2">
                      {['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setFormData({...formData, complexity: {...formData.complexity, time: opt}})}
                          className="text-[8px] font-black px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.complexity.time}
                      onChange={e => setFormData({...formData, complexity: {...formData.complexity, time: e.target.value}})}
                      placeholder="O(n log n)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-emerald-400"
                    />
                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Memory Payload</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.complexity.space}
                      onChange={e => setFormData({...formData, complexity: {...formData.complexity, space: e.target.value}})}
                      placeholder="O(1)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-emerald-400"
                    />
                    <Database className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div id="assets" className={cn(
              "space-y-8 transition-all duration-500",
              focusedSection === 'assets' ? "bg-slate-900/20 p-8 rounded-[3rem] border border-amber-500/20" : ""
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Layers size={20} />
                  </div>
                  <h2 className="text-xl font-black tracking-tight text-white">Reference Assets</h2>
                </div>
                <button 
                  onClick={() => setFocusedSection(focusedSection === 'assets' ? null : 'assets')}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  {focusedSection === 'assets' ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { type: 'pdf', icon: FileText, label: 'PDF', accept: '.pdf' },
                  { type: 'text', icon: File, label: 'Text', accept: '.txt,.md' },
                  { type: 'image', icon: ImageIcon, label: 'Image', accept: 'image/*' },
                  { type: 'video', icon: FileVideo, label: 'Video', accept: 'video/*' },
                ].map((item) => (
                  <label key={item.type} className="cursor-pointer group">
                    <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-slate-950 border border-slate-800 group-hover:border-indigo-500/50 transition-all">
                      <item.icon size={24} className="text-slate-500 group-hover:text-indigo-400" />
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
                {formData.assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-950 border border-slate-800 group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500">
                        {asset.type === 'pdf' && <FileText size={20} />}
                        {asset.type === 'text' && <File size={20} />}
                        {asset.type === 'image' && <ImageIcon size={20} />}
                        {asset.type === 'video' && <FileVideo size={20} />}
                      </div>
                      <span className="text-sm font-bold text-slate-300 truncate max-w-[200px]">{asset.name}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeAsset(asset.id)}
                      className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Knowledge Base */}
          <section id="knowledge" className={cn(
            "space-y-8 transition-all duration-500",
            focusedSection === 'knowledge' ? "bg-slate-900/20 p-8 rounded-[3rem] border border-amber-500/20" : ""
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Info size={20} />
                </div>
                <h2 className="text-xl font-black tracking-tight text-white">Knowledge Base</h2>
              </div>
              <button 
                onClick={() => setFocusedSection(focusedSection === 'knowledge' ? null : 'knowledge')}
                className="p-2 text-slate-500 hover:text-white transition-colors"
              >
                {focusedSection === 'knowledge' ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Target size={14} className="text-rose-500" /> Objective
                  </label>
                  <textarea 
                    value={formData.explanation.problem}
                    onChange={e => setFormData({...formData, explanation: {...formData.explanation, problem: e.target.value}})}
                    placeholder="What problem does this solve?"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32 resize-none text-white leading-relaxed"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Lightbulb size={14} className="text-amber-500" /> Core Logic
                  </label>
                  <textarea 
                    value={formData.explanation.intuition}
                    onChange={e => setFormData({...formData, explanation: {...formData.explanation, intuition: e.target.value}})}
                    placeholder="The 'Aha!' moment behind the algorithm..."
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32 resize-none text-white leading-relaxed"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <History size={14} className="text-indigo-500" /> Execution Sequence
                </label>
                <div className="relative h-full min-h-[280px]">
                  <textarea 
                    value={formData.explanation.walkthrough}
                    onChange={e => setFormData({...formData, explanation: {...formData.explanation, walkthrough: e.target.value}})}
                    placeholder="Step 01: Initialize...&#10;Step 02: Iterate...&#10;Step 03: Return..."
                    className="w-full h-full bg-slate-900/50 border border-slate-800 rounded-[2.5rem] px-10 py-10 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-white leading-relaxed"
                  />
                  <div className="absolute left-5 top-10 bottom-10 w-px bg-gradient-to-b from-indigo-500/50 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </section>

          {/* Source Code Matrix */}
          <section id="code" className={cn(
            "space-y-8 transition-all duration-500",
            focusedSection === 'code' ? "bg-slate-900/20 p-8 rounded-[3rem] border border-indigo-500/20" : ""
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Terminal size={20} />
                </div>
                <h2 className="text-xl font-black tracking-tight text-white">Source Code Matrix</h2>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {(['python', 'c', 'cpp', 'rust'] as Language[]).map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLang(lang)}
                      className={cn(
                        "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        activeLang === lang 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                          : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      {lang === 'cpp' ? 'C++' : lang}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setFocusedSection(focusedSection === 'code' ? null : 'code')}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  {focusedSection === 'code' ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-100 transition-opacity" />
              <textarea 
                value={formData.code[activeLang]?.iterative || ''}
                onChange={e => updateCode(activeLang, e.target.value)}
                className="relative w-full bg-slate-950 border border-slate-800 rounded-[2.5rem] px-10 py-10 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-[400px] resize-none text-emerald-400 custom-scrollbar"
                placeholder={`// Implement ${activeLang.toUpperCase()} logic here...`}
              />
              <div className="absolute top-6 right-8 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest">Compiler Ready</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Side: Real-time Preview */}
        <div className={cn(
          "xl:sticky xl:top-[120px] h-[calc(100vh-160px)] overflow-hidden transition-all duration-500",
          focusedSection ? "opacity-0 pointer-events-none translate-x-12" : "opacity-100"
        )}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Eye size={20} />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">Neural Preview</h2>
            <div className="h-px flex-1 bg-slate-800/50 ml-4" />
          </div>

          <div className="h-full bg-slate-950/50 border border-slate-800/50 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
            
            {/* Preview Header */}
            <div className="p-8 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => scrollToSection('identity')}
                  className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20 hover:scale-110 transition-transform"
                >
                  <PreviewIcon size={24} />
                </button>
                <div className="flex-1 cursor-pointer" onClick={() => scrollToSection('identity')}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                      {formData.category || 'Classification Pending'}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); scrollToSection('metrics'); }}
                      className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      {formData.complexity.time}
                    </button>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-white truncate max-w-[300px]">
                    {formData.name || 'Untitled Algorithm'}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6 bg-slate-900/50 p-1 rounded-xl border border-slate-800/50 w-fit">
                {[
                  { id: 'code', icon: Terminal, label: 'Code' },
                  { id: 'info', icon: Info, label: 'Guide' },
                  { id: 'assets', icon: FileText, label: 'Assets' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setPreviewTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      previewTab === tab.id 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="space-y-8">
                {previewTab === 'code' && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/50">
                      <p className="text-sm text-slate-400 leading-relaxed italic">
                        "{formData.description || 'No description provided yet...'}"
                      </p>
                    </div>
                    <CodePanel algorithm={formData} />
                  </div>
                )}
                
                {previewTab === 'info' && (
                  <ExplanationPanel algorithm={formData} />
                )}

                {previewTab === 'assets' && (
                  <AssetsPanel algorithm={formData} />
                )}
              </div>
            </div>

            {/* Preview Footer Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 shadow-2xl">
              <Layout size={12} />
              Real-time Simulation Active
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
