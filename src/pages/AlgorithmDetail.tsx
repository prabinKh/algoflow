import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Clock, 
  Database, 
  Code2, 
  BookOpen, 
  Layers,
  Terminal,
  Cpu,
  Globe,
  Zap,
  Shield,
  Activity,
  Box,
  Share2,
  ListOrdered,
  Braces,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  FileCode,
  Image as ImageIcon,
  Video,
  ExternalLink
} from 'lucide-react';
import { Algorithm } from '../types';
import { cn } from '../lib/utils';

const iconMap: Record<string, any> = {
  Terminal, Cpu, Database, Globe, Zap, Shield, Activity, Box, Share2, ListOrdered, Braces, Sparkles
};

interface AlgorithmDetailProps {
  algorithm: Algorithm;
  onBack: () => void;
}

const languageColors: Record<string, string> = {
  python: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  javascript: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  cpp: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  c: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  rust: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

export default function AlgorithmDetail({ algorithm, onBack }: AlgorithmDetailProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'explanation' | 'assets'>('explanation');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [copied, setCopied] = useState(false);

  const Icon = iconMap[algorithm.icon || 'Sparkles'] || Sparkles;
  
  // Handle code structure - could be string or CodeSnippet object
  const rawCode = algorithm.code || {};
  const code: Record<string, string> = {};
  Object.entries(rawCode).forEach(([lang, snippet]) => {
    if (typeof snippet === 'string') {
      code[lang] = snippet;
    } else if (snippet && typeof snippet === 'object') {
      // If it's a CodeSnippet object, use iterative version
      const snippetObj = snippet as { iterative?: string; recursive?: string };
      code[lang] = snippetObj.iterative || snippetObj.recursive || '';
    }
  });
  
  // Handle explanation structure
  const rawExplanation = (algorithm.explanation || {}) as {
    problem?: string;
    intuition?: string;
    walkthrough?: string;
    whenToUse?: string;
  };
  const explanation = {
    text: rawExplanation.intuition || '',
    problem: rawExplanation.problem || '',
    intuition: rawExplanation.intuition || '',
    steps: rawExplanation.walkthrough ? [rawExplanation.walkthrough] : [],
    walkthrough: rawExplanation.walkthrough || '',
    whenToUse: rawExplanation.whenToUse || '',
  };
  
  // Handle assets
  const rawAssets = algorithm.assets || [];
  const assets = rawAssets.map(asset => ({
    type: asset.type as 'image' | 'video' | 'link',
    url: asset.data,
    name: asset.name,
    description: '',
  }));

  const languages = Object.keys(code).filter(lang => code[lang] && code[lang].trim() !== '');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 bg-black/40 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/30">
              <Icon size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">{algorithm.name}</h1>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>{algorithm.category}</span>
                <span>•</span>
                <span className="text-indigo-400">{algorithm.complexity?.time || 'O(?)'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Description Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8 mb-8"
        >
          <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-indigo-400" />
            Description
          </h2>
          <p className="text-slate-400 leading-relaxed text-lg">
            {algorithm.description}
          </p>

          {/* Complexity Badges */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Clock size={16} className="text-indigo-400" />
              <span className="text-sm font-bold text-indigo-400">Time: {algorithm.complexity?.time || 'O(?)'}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Database size={16} className="text-emerald-400" />
              <span className="text-sm font-bold text-emerald-400">Space: {algorithm.complexity?.space || 'O(?)'}</span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'explanation', label: 'Explanation', icon: BookOpen },
            { id: 'code', label: 'Code Reference', icon: Code2 },
            { id: 'assets', label: 'Assets', icon: Layers },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "bg-slate-900/40 text-slate-400 hover:bg-slate-800 border border-slate-800/50"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Explanation Tab */}
          {activeTab === 'explanation' && (
            <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8">
              {explanation.text && (
                <div className="mb-8">
                  <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-400" />
                    Overview
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{explanation.text}</p>
                </div>
              )}

              {explanation.problem && (
                <div className="mb-8">
                  <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <Terminal size={18} className="text-rose-400" />
                    Problem Statement
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{explanation.problem}</p>
                </div>
              )}

              {explanation.intuition && (
                <div className="mb-8">
                  <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-yellow-400" />
                    Intuition
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{explanation.intuition}</p>
                </div>
              )}

              {explanation.steps && explanation.steps.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <ListOrdered size={18} className="text-emerald-400" />
                    Algorithm Steps
                  </h3>
                  <ol className="space-y-3">
                    {explanation.steps.map((step: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 font-bold text-sm">
                          {idx + 1}
                        </span>
                        <span className="text-slate-400 leading-relaxed pt-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {explanation.walkthrough && (
                <div className="mb-8">
                  <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <BookOpen size={18} className="text-blue-400" />
                    Walkthrough
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{explanation.walkthrough}</p>
                </div>
              )}

              {explanation.whenToUse && (
                <div>
                  <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <Shield size={18} className="text-purple-400" />
                    When to Use
                  </h3>
                  <p className="text-slate-400 leading-relaxed">{explanation.whenToUse}</p>
                </div>
              )}
            </div>
          )}

          {/* Code Tab */}
          {activeTab === 'code' && (
            <div>
              {/* Language Selector */}
              {languages.length > 0 && (
                <div className="flex gap-2 mb-6 flex-wrap">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={cn(
                        "px-4 py-2 rounded-xl font-bold text-sm transition-all border",
                        selectedLanguage === lang
                          ? languageColors[lang] || 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                          : "bg-slate-900/40 text-slate-400 border-slate-800/50 hover:bg-slate-800"
                      )}
                    >
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {/* Code Display */}
              {selectedLanguage && code[selectedLanguage] && (
                <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-2">
                      <FileCode size={18} className="text-slate-500" />
                      <span className="text-sm font-bold text-slate-400">
                        {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} Implementation
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(code[selectedLanguage])}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold text-slate-400 transition-colors"
                    >
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-6 overflow-x-auto">
                    <pre className="text-sm font-mono text-slate-300 leading-relaxed">
                      <code>{code[selectedLanguage]}</code>
                    </pre>
                  </div>
                </div>
              )}

              {!languages.length && (
                <div className="text-center py-16 bg-slate-900/40 border border-slate-800/50 rounded-3xl">
                  <Code2 size={48} className="text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">No code available for this algorithm.</p>
                </div>
              )}
            </div>
          )}

          {/* Assets Tab */}
          {activeTab === 'assets' && (
            <div>
              {assets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {assets.map((asset: any, idx: number) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-slate-900/40 border border-slate-800/50 rounded-3xl overflow-hidden group hover:border-indigo-500/30 transition-all"
                    >
                      {asset.type === 'image' && asset.url && (
                        <div className="aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                          <img 
                            src={asset.url} 
                            alt={asset.name || 'Asset'} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      {asset.type === 'video' && asset.url && (
                        <div className="aspect-video bg-slate-950 flex items-center justify-center">
                          <video 
                            src={asset.url} 
                            controls 
                            className="w-full h-full"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          {asset.type === 'image' && <ImageIcon size={16} className="text-indigo-400" />}
                          {asset.type === 'video' && <Video size={16} className="text-rose-400" />}
                          {asset.type === 'link' && <ExternalLink size={16} className="text-emerald-400" />}
                          <span className="text-xs font-black uppercase tracking-widest text-slate-500">
                            {asset.type}
                          </span>
                        </div>
                        <h3 className="font-bold text-white mb-2">{asset.name || 'Untitled Asset'}</h3>
                        {asset.description && (
                          <p className="text-sm text-slate-500">{asset.description}</p>
                        )}
                        {asset.type === 'link' && asset.url && (
                          <a 
                            href={asset.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-4 text-indigo-400 hover:text-indigo-300 font-bold text-sm"
                          >
                            Open Link
                            <ChevronRight size={14} />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-900/40 border border-slate-800/50 rounded-3xl">
                  <Layers size={48} className="text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">No assets available for this algorithm.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
