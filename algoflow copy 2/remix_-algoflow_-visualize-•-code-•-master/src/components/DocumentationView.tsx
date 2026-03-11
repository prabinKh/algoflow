import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Hash
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { Algorithm, Language } from '../types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function AlgorithmDocCard({ algo }: { algo: Algorithm }) {
  const [selectedLang, setSelectedLang] = useState<Language>('python');

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative z-0"
      id={`algo-${algo.id}`}
    >
      {/* Latest Badge */}
      {algo.createdAt && (
        <div className="absolute -top-4 left-12 z-10 flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
          <Calendar size={12} />
          Latest Upload: {new Date(algo.createdAt).toLocaleString()}
        </div>
      )}

      <Card variant="glass" className="p-0 rounded-[2rem] sm:rounded-[3rem] overflow-hidden hover:border-indigo-500/30 transition-all duration-500 group/main">
        <div className="p-5 sm:p-8 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[120px] -z-10 group-hover/main:bg-indigo-600/10 transition-colors" />
          
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-16">
            {/* Left: Info */}
            <div className="lg:w-1/2 space-y-6 sm:space-y-12">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-6">
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-500/20 shadow-sm">
                    {algo.category}
                  </span>
                  <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/10" />
                  <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Hash size={10} className="sm:size-[12px]" /> {algo.id}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-4 sm:mb-8 text-white group-hover/main:text-indigo-400 transition-colors leading-[0.9] break-words">
                  {algo.name}
                </h2>
                <p className="text-slate-400 text-sm sm:text-xl leading-relaxed font-medium break-words">
                  {algo.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <div className="p-5 sm:p-8 bg-white/5 rounded-[1.5rem] sm:rounded-[2rem] border border-white/5 group/card hover:border-indigo-500/20 transition-all shadow-xl">
                  <div className="flex items-center gap-2 sm:gap-3 text-slate-500 mb-2 sm:mb-3">
                    <Clock size={16} className="sm:size-[18px] group-hover/card:text-indigo-400 transition-colors" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">Time Complexity</span>
                  </div>
                  <p className="text-xl sm:text-3xl font-mono font-black text-indigo-400 tracking-tighter break-all">{algo.complexity.time}</p>
                </div>
                <div className="p-5 sm:p-8 bg-white/5 rounded-[1.5rem] sm:rounded-[2rem] border border-white/5 group/card hover:border-indigo-500/20 transition-all shadow-xl">
                  <div className="flex items-center gap-2 sm:gap-3 text-slate-500 mb-2 sm:mb-3">
                    <Database size={16} className="sm:size-[18px] group-hover/card:text-indigo-400 transition-colors" />
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">Space Complexity</span>
                  </div>
                  <p className="text-xl sm:text-3xl font-mono font-black text-indigo-400 tracking-tighter break-all">{algo.complexity.space}</p>
                </div>
              </div>

              <div className="space-y-6 sm:space-y-14">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 group/item">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 flex-shrink-0 border border-rose-500/20 shadow-lg shadow-rose-500/5 group-hover/item:scale-110 transition-transform">
                    <Target size={20} className="sm:size-[28px]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base sm:text-xl font-black mb-1 sm:mb-3 uppercase tracking-tight text-white">The Problem</h4>
                    <p className="text-xs sm:text-base text-slate-400 leading-relaxed font-medium break-words">{algo.explanation.problem}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 group/item">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0 border border-amber-500/20 shadow-lg shadow-amber-500/5 group-hover/item:scale-110 transition-transform">
                    <Lightbulb size={20} className="sm:size-[28px]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base sm:text-xl font-black mb-1 sm:mb-3 uppercase tracking-tight text-white">Intuition</h4>
                    <p className="text-xs sm:text-base text-slate-400 italic leading-relaxed font-medium break-words">"{algo.explanation.intuition}"</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 group/item">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0 border border-emerald-500/20 shadow-lg shadow-emerald-500/5 group-hover/item:scale-110 transition-transform">
                    <CheckCircle2 size={20} className="sm:size-[28px]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base sm:text-xl font-black mb-1 sm:mb-3 uppercase tracking-tight text-white">Strategic Use</h4>
                    <p className="text-xs sm:text-base text-slate-400 leading-relaxed font-medium break-words">{algo.explanation.whenToUse}</p>
                  </div>
                </div>
                {algo.explanation.funFact && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 group/item">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 flex-shrink-0 border border-violet-500/20 shadow-lg shadow-violet-500/5 group-hover/item:scale-110 transition-transform">
                      <History size={20} className="sm:size-[28px]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base sm:text-xl font-black mb-1 sm:mb-3 uppercase tracking-tight text-white">Historical Note</h4>
                      <p className="text-xs sm:text-base text-slate-400 leading-relaxed font-medium break-words">{algo.explanation.funFact}</p>
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 group/item">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0 border border-indigo-500/20 shadow-lg shadow-indigo-500/5 group-hover/item:scale-110 transition-transform">
                    <Terminal size={20} className="sm:size-[28px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base sm:text-xl font-black mb-3 sm:mb-6 uppercase tracking-tight text-white">Execution Sequence</h4>
                    <div className="space-y-3 sm:space-y-5">
                      {algo.explanation.walkthrough.split('\n').filter(s => s.trim()).map((step, i) => (
                        <div key={i} className="flex gap-3 sm:gap-5 p-3 sm:p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all group/step">
                          <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-600 text-white text-[8px] sm:text-[10px] font-black flex items-center justify-center shadow-2xl shadow-indigo-500/40 group-hover/step:scale-110 transition-transform">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-[10px] sm:text-sm text-slate-400 leading-relaxed font-medium group-hover/step:text-slate-200 transition-colors break-words">
                            {step.replace(/^\d+\.\s*/, '')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Assets Section */}
                {algo.assets && algo.assets.length > 0 && (
                  <div className="flex gap-8 group/item">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 flex-shrink-0 border border-white/10 shadow-lg group-hover/item:scale-110 transition-transform">
                      <FileText size={28} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-black mb-6 uppercase tracking-tight text-white">Reference Library</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {algo.assets.map((asset) => (
                          <div key={asset.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all group/asset">
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-slate-500 shadow-inner border border-white/5 group-hover/asset:text-indigo-400 transition-colors">
                                <FileText size={18} />
                              </div>
                              <span className="text-xs font-black uppercase tracking-tight truncate text-slate-300">{asset.name}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = asset.data;
                                link.download = asset.name;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="w-10 h-10 text-slate-500 hover:text-indigo-400"
                            >
                              <Download size={18} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Code */}
            <div className="lg:w-1/2 min-w-0">
              <div className="sticky top-32 bg-black/60 backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col">
                <div className="p-5 sm:p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      <Terminal size={16} className="sm:size-[20px]" />
                    </div>
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Source Matrix</span>
                      <p className="text-[7px] sm:text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] mt-0.5">Neural Implementation</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2.5">
                    <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-rose-500/20 border border-rose-500/30" />
                    <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-amber-500/20 border border-amber-500/30" />
                    <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
                  </div>
                </div>
                
                {/* Language Tabs */}
                <div className="flex border-b border-white/5 bg-black/40 p-1 sm:p-1.5 overflow-x-auto custom-scrollbar">
                  {Object.entries(algo.code).map(([lang, snippet]) => (
                    (snippet.functionCode || snippet.classCode || snippet.recursiveCode) && (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang(lang as Language)}
                        className={cn(
                          "flex-1 min-w-[60px] py-2 sm:py-3 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-lg sm:rounded-xl",
                          "hover:text-white",
                          selectedLang === lang ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-500 hover:bg-white/5"
                        )}
                      >
                        {lang === 'cpp' ? 'C++' : lang}
                      </button>
                    )
                  ))}
                </div>

                <div className="overflow-auto max-h-[400px] sm:max-h-[750px] custom-scrollbar bg-black/20">
                  <SyntaxHighlighter
                    language={selectedLang === 'python' ? 'python' : selectedLang === 'cpp' ? 'cpp' : selectedLang === 'c' ? 'c' : 'rust'}
                    style={atomDark}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem sm:3rem',
                      fontSize: '0.75rem sm:0.9rem',
                      lineHeight: '1.6 sm:1.8',
                      background: 'transparent'
                    }}
                  >
                    {algo.code[selectedLang]?.functionCode || algo.code[selectedLang]?.classCode || algo.code[selectedLang]?.recursiveCode || 'No implementation available.'}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
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
  const navigate = useNavigate();

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

    // Filter by search query (Name, Category, ID)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(algo => 
        algo.name.toLowerCase().includes(query) ||
        algo.category.toLowerCase().includes(query) ||
        algo.id.toLowerCase().includes(query)
      );
    }

    // Filter by selected algorithm
    if (selectedAlgoId !== 'all') {
      result = result.filter(algo => algo.id === selectedAlgoId);
    }

    // Sort by latest (createdAt)
    return result.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [algorithms, searchQuery, selectedAlgoId]);

  const latestAlgo = useMemo(() => {
    if (algorithms.length === 0) return null;
    return [...algorithms].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })[0];
  }, [algorithms]);

  const selectedAlgoName = algorithms.find(a => a.id === selectedAlgoId)?.name || 'All Algorithms';

  return (
    <div className="space-y-16 pb-32">
      <header className="text-center max-w-3xl mx-auto space-y-6 relative z-[60]">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white break-words px-4">
          Algorithm <span className="text-indigo-600">Documentation</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed break-words px-6">
          Comprehensive guide to algorithm implementations, complexity analysis, and strategic use cases.
        </p>

        {/* Latest Upload Highlight */}
        {latestAlgo && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-4 px-4"
          >
            <Card variant="glass" className="p-6 sm:p-8 text-left shadow-xl bg-indigo-600 border-indigo-500 text-white rounded-3xl overflow-hidden relative z-0">
              <div className="flex items-center gap-3 mb-4 opacity-80">
                <Zap size={16} className="flex-shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest truncate">Latest Neural Upload</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-2 break-words">{latestAlgo.name}</h3>
              <p className="text-indigo-100 mb-6 line-clamp-2 font-medium opacity-90 break-words">{latestAlgo.description}</p>
              <Button 
                onClick={() => {
                  setSelectedAlgoId(latestAlgo.id);
                  const el = document.getElementById(`algo-${latestAlgo.id}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-indigo-50 font-bold"
              >
                View Documentation
                <ArrowRight size={18} className="ml-2 flex-shrink-0" />
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Controls Matrix */}
        <div className="px-4">
          <Card variant="glass" className="flex flex-col md:flex-row gap-4 sm:gap-8 mt-12 sm:mt-20 p-5 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-white/10 shadow-2xl relative z-50 overflow-visible">
            <div className="relative flex-1 group min-w-0">
              <Input 
                placeholder="Search neural signatures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={20} className="sm:size-[24px] flex-shrink-0" />}
                className="w-full"
              />
            </div>
            
            <div className="relative min-w-full md:min-w-[350px]" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={cn(
                  "w-full bg-white/5 border border-white/10 rounded-2xl py-4 sm:py-6 px-6 sm:px-10 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-between text-white hover:bg-white/10 hover:border-indigo-500/50 transition-all shadow-xl",
                  isDropdownOpen && "border-indigo-500/50 bg-white/10"
                )}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <Layers size={18} className="sm:size-[20px] text-indigo-400 flex-shrink-0" />
                  <span className="truncate">{selectedAlgoName}</span>
                </div>
                <ChevronDown className={cn("text-slate-500 transition-transform duration-300 flex-shrink-0", isDropdownOpen && "rotate-180 text-white")} size={20} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-4 z-[100]"
                  >
                    <Card variant="glass" className="p-2 sm:p-3 border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] backdrop-blur-3xl overflow-hidden">
                      <div className="max-h-[300px] sm:max-h-[450px] overflow-auto custom-scrollbar space-y-1">
                        <button
                          onClick={() => { setSelectedAlgoId('all'); setIsDropdownOpen(false); }}
                          className={cn(
                            "w-full text-left px-6 sm:px-8 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 sm:gap-4",
                            selectedAlgoId === 'all' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "hover:bg-white/5 text-slate-400 hover:text-white"
                          )}
                        >
                          <Filter size={16} className="sm:size-[18px] flex-shrink-0" />
                          <span className="truncate">All Algorithms</span>
                        </button>
                        <div className="h-px bg-white/5 my-2 sm:my-3 mx-4 sm:mx-6" />
                        {algorithms.map(algo => (
                          <button
                            key={algo.id}
                            onClick={() => { setSelectedAlgoId(algo.id); setIsDropdownOpen(false); }}
                            className={cn(
                              "w-full text-left px-6 sm:px-8 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 sm:gap-4",
                              selectedAlgoId === algo.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "hover:bg-white/5 text-slate-400 hover:text-white"
                            )}
                          >
                            <Sparkles size={16} className={cn("sm:size-[18px] flex-shrink-0", selectedAlgoId === algo.id ? "text-white" : "text-indigo-400")} />
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs sm:text-sm tracking-tight truncate">{algo.name}</span>
                              <span className={cn("text-[7px] sm:text-[8px] uppercase tracking-[0.3em] mt-0.5 sm:mt-1 opacity-60 truncate", selectedAlgoId === algo.id ? "text-white" : "text-slate-500")}>
                                {algo.category}
                              </span>
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

      <div className="grid grid-cols-1 gap-32">
        {filteredAndSortedAlgorithms.map((algo) => (
          <AlgorithmDocCard key={algo.id} algo={algo} />
        ))}

        {filteredAndSortedAlgorithms.length === 0 && (
          <div className="text-center py-40 bg-white dark:bg-slate-900 rounded-[4rem] border border-dashed border-slate-200 dark:border-slate-800 shadow-inner">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-400 mx-auto mb-8 shadow-sm">
              <Filter size={48} />
            </div>
            <h3 className="text-3xl font-black mb-3">No neural signatures found</h3>
            <p className="text-slate-500 text-lg">Try adjusting your search or filter criteria to find the algorithm.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedAlgoId('all'); }}
              className="mt-10 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
            >
              Reset Matrix Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
