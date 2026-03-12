// src/components/DocumentationView.tsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Code2,
  Target,
  Lightbulb,
  ArrowRight,
  ChevronRight,
  Clock,
  Database,
  History,
  Terminal,
  Search,
  ChevronDown,
  Calendar,
  Filter,
  CheckCircle2,
  FileText,
  Zap,
  ExternalLink,
  Download,
  Layers,
  Sparkles,
  Hash,
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { cn } from '../lib/utils';
// import { useNavigate } from 'react-router-dom'; // unused → removed
import { Algorithm, Language } from '../types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function AlgorithmDocCard({ algo }: { algo: Algorithm }) {
  const [selectedLang, setSelectedLang] = useState<Language>('python');

  const codeSnippet =
    algo.code?.[selectedLang]?.functionCode ||
    algo.code?.[selectedLang]?.classCode ||
    algo.code?.[selectedLang]?.recursiveCode ||
    'No implementation available.';

  const getLanguageForHighlighter = (lang: Language) => {
    switch (lang) {
      case 'python': return 'python';
      case 'cpp':    return 'cpp';
      case 'c':      return 'c';
      case 'rust':   return 'rust';
      
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative z-0 scroll-mt-20"
      id={`algo-${algo.id}`}
    >
      {/* Latest Badge */}
      {algo.createdAt && (
        <div className="absolute -top-5 left-8 sm:left-12 z-10 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/30 border border-emerald-400/20">
          <Calendar size={13} />
          Latest: {new Date(algo.createdAt).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      )}

      <Card
        variant="glass"
        className="p-0 rounded-[2rem] sm:rounded-[3rem] overflow-hidden hover:border-indigo-500/30 transition-all duration-500 group/main shadow-2xl"
      >
        <div className="p-5 sm:p-8 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[120px] -z-10 group-hover/main:bg-indigo-600/10 transition-colors duration-700" />

          <div className="flex flex-col gap-16 sm:gap-24">
            {/* Header: Centered Name & Description */}
            <div className="text-center max-w-7xl mx-auto space-y-8 sm:space-y-12">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-xs sm:text-sm font-black uppercase tracking-widest rounded-full border border-indigo-500/20 shadow-sm">
                  {algo.category}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <span className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Hash size={14} /> {algo.id}
                </span>
              </div>

              <h2 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter text-white leading-none uppercase">
                {algo.name}
              </h2>

              <div className="space-y-8 max-w-5xl mx-auto">
                <p className="text-slate-300 text-xl sm:text-2xl lg:text-3xl leading-relaxed font-medium">
                  {algo.description}
                </p>

                <div className="flex flex-wrap justify-center gap-6 sm:gap-10 pt-4">
                  <div className="flex items-center gap-3 px-7 py-4 bg-white/5 rounded-2xl border border-white/10 shadow-xl">
                    <Clock size={20} className="text-indigo-400" />
                    <span className="text-sm font-black uppercase tracking-widest text-slate-200">
                      Time: {algo.complexity?.time ?? '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 px-7 py-4 bg-white/5 rounded-2xl border border-white/10 shadow-xl">
                    <Database size={20} className="text-indigo-400" />
                    <span className="text-sm font-black uppercase tracking-widest text-slate-200">
                      Space: {algo.complexity?.space ?? '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Source Code Section */}
            <div className="space-y-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-4 sm:px-0">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <Terminal size={28} />
                  </div>
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">Source Matrix</h3>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">Neural Implementation</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10">
                  {Object.entries(algo.code ?? {}).map(([lang, snippet]) => {
                    if (!snippet?.functionCode && !snippet?.classCode && !snippet?.recursiveCode) return null;
                    return (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang(lang as Language)}
                        className={cn(
                          "px-6 py-3 text-xs sm:text-sm font-black uppercase tracking-widest transition-all rounded-xl",
                          selectedLang === lang
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                            : "text-slate-400 hover:text-white hover:bg-white/10"
                        )}
                      >
                        {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-black/60 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[4rem] border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-6 sm:p-12 lg:p-16 overflow-auto max-h-[700px] lg:max-h-[900px] custom-scrollbar">
                  <SyntaxHighlighter
                    language={getLanguageForHighlighter(selectedLang)}
                    style={atomDark}
                    customStyle={{
                      margin: 0,
                      padding: 0,
                      background: 'transparent',
                      fontSize: '1.05rem',
                      lineHeight: '1.75',
                    }}
                    wrapLongLines
                  >
                    {codeSnippet}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>

            {/* Execution Sequence */}
            {algo.explanation?.walkthrough && (
              <div className="space-y-12">
                <div className="flex items-center gap-5 px-4 sm:px-0">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <Zap size={28} />
                  </div>
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">Execution Sequence</h3>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">Step-by-Step Walkthrough</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                  {algo.explanation.walkthrough.split('\n').filter(s => s.trim()).map((step, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-6 p-8 lg:p-10 bg-white/[0.03] rounded-[2.5rem] border border-white/8 hover:border-indigo-500/30 hover:bg-white/[0.06] transition-all duration-300 group/step shadow-xl"
                    >
                      <div className="flex items-center gap-6">
                        <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-600 text-white text-base font-black flex items-center justify-center shadow-lg shadow-indigo-600/40 group-hover/step:scale-105 transition-transform">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="h-px flex-1 bg-white/10 group-hover/step:bg-indigo-500/30 transition-all" />
                      </div>
                      <p className="text-base lg:text-lg text-slate-300 leading-relaxed group-hover/step:text-slate-100 transition-colors">
                        {step.replace(/^\d+\.\s*/, '')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategic Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="p-8 lg:p-10 bg-white/[0.03] rounded-[2.5rem] border border-white/8 hover:border-rose-500/30 transition-all group/item shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-6 border border-rose-500/20 shadow-lg shadow-rose-500/10 group-hover/item:scale-105 transition-transform">
                  <Target size={28} />
                </div>
                <h4 className="text-2xl font-black mb-4 uppercase tracking-tight text-white">The Problem</h4>
                <p className="text-base text-slate-300 leading-relaxed">{algo.explanation?.problem ?? '—'}</p>
              </div>

              <div className="p-8 lg:p-10 bg-white/[0.03] rounded-[2.5rem] border border-white/8 hover:border-amber-500/30 transition-all group/item shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-6 border border-amber-500/20 shadow-lg shadow-amber-500/10 group-hover/item:scale-105 transition-transform">
                  <Lightbulb size={28} />
                </div>
                <h4 className="text-2xl font-black mb-4 uppercase tracking-tight text-white">Intuition</h4>
                <p className="text-base text-slate-300 leading-relaxed italic">
                  {algo.explanation?.intuition ? `"${algo.explanation.intuition}"` : '—'}
                </p>
              </div>

              <div className="p-8 lg:p-10 bg-white/[0.03] rounded-[2.5rem] border border-white/8 hover:border-emerald-500/30 transition-all group/item shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20 shadow-lg shadow-emerald-500/10 group-hover/item:scale-105 transition-transform">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="text-2xl font-black mb-4 uppercase tracking-tight text-white">Strategic Use</h4>
                <p className="text-base text-slate-300 leading-relaxed">{algo.explanation?.whenToUse ?? '—'}</p>
              </div>
            </div>

            {/* Assets Section */}
            {algo.assets && algo.assets.length > 0 && (
              <div className="space-y-10 pt-8">
                <div className="flex items-center gap-5 px-4 sm:px-0">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 border border-white/10">
                    <FileText size={28} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tight text-white uppercase">Reference Library</h3>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1">
                      Documentation & Media Assets
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {algo.assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-6 bg-white/[0.04] rounded-3xl border border-white/8 hover:bg-white/8 hover:border-indigo-500/30 transition-all group/asset flex flex-col"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center text-slate-400 border border-white/10 mb-4 group-hover/asset:text-indigo-400 transition-colors">
                        <FileText size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-semibold text-white mb-1 truncate">{asset.name}</p>
                        <p className="text-xs uppercase tracking-wider text-slate-500">{asset.type || 'File'}</p>
                      </div>
                      <Button
                        variant="ghost"
                        className="mt-4 w-full bg-white/5 hover:bg-indigo-600/80 hover:text-white rounded-xl py-5 text-sm font-semibold"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = asset.data;
                          link.download = asset.name;
                          link.click();
                        }}
                      >
                        <Download size={18} className="mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.section>
  );
}

export default function DocumentationView({ algorithms }: { algorithms: Algorithm[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAndSortedAlgorithms = useMemo(() => {
    let result = [...algorithms];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (algo) =>
          algo.name.toLowerCase().includes(q) ||
          algo.category.toLowerCase().includes(q) ||
          algo.id.toLowerCase().includes(q)
      );
    }

    if (selectedAlgoId !== 'all') {
      result = result.filter((algo) => algo.id === selectedAlgoId);
    }

    return result.sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
  }, [algorithms, searchQuery, selectedAlgoId]);

  const latestAlgo = useMemo(() => {
    if (!algorithms.length) return null;
    return [...algorithms].sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    })[0];
  }, [algorithms]);

  const selectedAlgoName =
    algorithms.find((a) => a.id === selectedAlgoId)?.name || 'All Algorithms';

  return (
    <div className="space-y-16 pb-32">
      <header className="text-center max-w-4xl mx-auto space-y-6 relative z-10 px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
          Algorithm <span className="text-indigo-500">Documentation</span>
        </h1>
        <p className="text-slate-400 text-lg sm:text-xl leading-relaxed">
          In-depth guide to implementations, complexity, and strategic usage.
        </p>

        {latestAlgo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-6 px-4"
          >
            <Card
              variant="glass"
              className="p-6 sm:p-8 bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border-indigo-500/30 text-white rounded-3xl shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4 opacity-90">
                <Zap size={16} />
                <span className="text-xs font-black uppercase tracking-widest">Latest Upload</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-3">{latestAlgo.name}</h3>
              <p className="text-indigo-100 mb-6 line-clamp-2">{latestAlgo.description}</p>
              <Button
                onClick={() => {
                  setSelectedAlgoId(latestAlgo.id);
                  document.getElementById(`algo-${latestAlgo.id}`)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }}
                className="w-full sm:w-auto bg-white text-indigo-700 hover:bg-indigo-100 font-bold"
              >
                View Details
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Search & Filter Controls */}
        <div className="px-4">
          <Card
            variant="glass"
            className="flex flex-col md:flex-row gap-5 sm:gap-8 mt-10 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-white/10 shadow-2xl"
          >
            <div className="relative flex-1">
              <Input
                placeholder="Search algorithms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={20} />}
                className="w-full"
              />
            </div>

            <div className="relative min-w-full md:min-w-[340px]" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={cn(
                  "w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-black uppercase tracking-wider flex items-center justify-between text-white hover:bg-white/10 transition-all shadow-lg",
                  isDropdownOpen && "border-indigo-500/50 bg-white/10"
                )}
              >
                <div className="flex items-center gap-3 truncate">
                  <Layers size={18} className="text-indigo-400" />
                  <span className="truncate">{selectedAlgoName}</span>
                </div>
                <ChevronDown className={cn("transition-transform", isDropdownOpen && "rotate-180")} size={20} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    className="absolute top-full left-0 right-0 mt-3 z-50"
                  >
                    <Card variant="glass" className="border-white/10 shadow-2xl max-h-[420px] overflow-hidden">
                      <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                        <button
                          onClick={() => { setSelectedAlgoId('all'); setIsDropdownOpen(false); }}
                          className={cn(
                            "w-full text-left px-6 py-4 rounded-xl text-sm font-black uppercase tracking-wider flex items-center gap-3 transition-all",
                            selectedAlgoId === 'all' ? "bg-indigo-600 text-white" : "hover:bg-white/8 text-slate-300 hover:text-white"
                          )}
                        >
                          <Filter size={18} />
                          All Algorithms
                        </button>

                        <div className="h-px bg-white/10 my-2 mx-4" />

                        {algorithms.map((algo) => (
                          <button
                            key={algo.id}
                            onClick={() => { setSelectedAlgoId(algo.id); setIsDropdownOpen(false); }}
                            className={cn(
                              "w-full text-left px-6 py-4 rounded-xl text-sm font-medium flex items-center gap-3 transition-all",
                              selectedAlgoId === algo.id ? "bg-indigo-600/90 text-white" : "hover:bg-white/8 text-slate-300 hover:text-white"
                            )}
                          >
                            <Sparkles size={18} className={selectedAlgoId === algo.id ? "text-white" : "text-indigo-400"} />
                            <div className="flex flex-col min-w-0">
                              <span className="truncate">{algo.name}</span>
                              <span className="text-xs text-slate-500 mt-0.5">{algo.category}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-24 lg:gap-32 px-4 sm:px-6">
        {filteredAndSortedAlgorithms.map((algo) => (
          <AlgorithmDocCard key={algo.id} algo={algo} />
        ))}

        {filteredAndSortedAlgorithms.length === 0 && (
          <div className="text-center py-40 bg-gradient-to-b from-slate-900/30 to-transparent rounded-[3rem] border border-dashed border-slate-700/50">
            <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center text-slate-400 mx-auto mb-8">
              <Filter size={48} />
            </div>
            <h3 className="text-3xl font-black mb-4">No algorithms found</h3>
            <p className="text-slate-400 text-lg mb-8">Try adjusting your search or filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedAlgoId('all'); }}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all shadow-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}