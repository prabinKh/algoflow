/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  ChevronRight, 
  Terminal, 
  Info,
  Github,
  Sparkles,
  BookOpen,
  Zap,
  Plus,
  Cpu,
  Database,
  Globe,
  Shield,
  Activity,
  Box,
  Layers,
  ListOrdered,
  Braces
} from 'lucide-react';

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
  ListOrdered,
  Braces,
  Sparkles
};
import { algorithms, categories } from './data/algorithms';
import { Algorithm, Category } from './types';
import { cn } from './lib/utils';
import { UserMenu } from './components/UserMenu';
import { LoginPage } from './pages/auth/Login';
import { RegisterPage } from './pages/auth/Register';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { Input } from './components/ui/Input';
import { Select } from './components/ui/Select';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AlgorithmViewer from './components/AlgorithmViewer';
import DocumentationView from './components/DocumentationView';
import Dashboard from './pages/Dashboard';
import ForgeAlgorithm from './pages/ForgeAlgorithm';

import { apiFetch } from './lib/api';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [algorithmsState, setAlgorithmsState] = useState<Algorithm[]>([]);
  const [categoriesState, setCategoriesState] = useState<Category[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [algosRes, catsRes] = await Promise.all([
        apiFetch('/api/algorithms/'),
        apiFetch('/api/categories/')
      ]);
      const algos = await algosRes.json();
      const cats = await catsRes.json();
      setAlgorithmsState(algos);
      setCategoriesState(cats);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Global error handler to filter out external extension errors (like MetaMask)
    const handleError = (event: ErrorEvent | PromiseRejectionEvent) => {
      const message = 'reason' in event ? event.reason?.message : event.message;
      if (message && (message.includes('MetaMask') || message.includes('ethereum') || message.includes('web3'))) {
        // Silently ignore MetaMask/Web3 extension errors as they are external to the app
        if ('preventDefault' in event) event.preventDefault();
        return;
      }
    };

    // Also intercept console.error for these specific extension messages
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args[0]?.toString() || '';
      if (message.includes('MetaMask') || message.includes('ethereum') || message.includes('web3')) {
        return;
      }
      originalConsoleError.apply(console, args);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
      console.error = originalConsoleError;
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredAlgorithms = algorithmsState.filter(algo => 
    algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    algo.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAlgorithm = async (newAlgo: Algorithm) => {
    try {
      const response = await apiFetch('/api/algorithms/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAlgo)
      });
      if (response.ok) {
        await fetchData();
        navigate(`/algorithm/${newAlgo.id}`);
      }
    } catch (error) {
      console.error('Error adding algorithm:', error);
    }
  };

  const handleDeleteAlgorithm = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this algorithm?')) {
      try {
        const response = await apiFetch(`/api/algorithms/${id}/`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await fetchData();
        }
      } catch (error) {
        console.error('Error deleting algorithm:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center transition-colors duration-300 font-sans",
        isDarkMode ? "dark bg-[#0a0a0a] text-slate-100" : "bg-slate-50 text-slate-900"
      )}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 font-sans overflow-x-hidden",
      isDarkMode ? "dark bg-[#0a0a0a] text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <span className="font-bold text-lg tracking-tight">AlgoFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <UserMenu />
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="flex relative">
        {/* Desktop Top Right Actions */}
        <div className="hidden lg:flex fixed top-6 right-8 z-[60] items-center gap-4">
          <UserMenu />
        </div>
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
          selectedAlgoId={location.pathname.startsWith('/algorithm/') ? location.pathname.split('/').pop() || null : null}
          setSelectedAlgoId={(id) => {
            if (!id) return;
            if (location.pathname === '/documentation') {
              const el = document.getElementById(`algo-${id}`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return;
              }
            }
            navigate(`/algorithm/${id}`);
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredAlgorithms={filteredAlgorithms}
          setView={(v) => {
            if (v === 'docs') navigate('/documentation');
            else if (v === 'dashboard') navigate('/dashboard');
            else navigate('/');
          }}
          categories={categoriesState}
        />

        {/* Mobile Backdrop */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 min-h-screen",
          isSidebarOpen ? "lg:ml-72" : "lg:ml-72 ml-0"
        )}>
          <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-32 pb-32"
                >
                  {/* Hero Section - Recipe 2 & 11 inspired */}
                  <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
                      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="space-y-8 max-w-6xl mx-auto"
                    >
                      <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl shadow-2xl">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Neural Matrix v4.0 Active</span>
                      </div>

                      <h1 className="text-[12vw] sm:text-[10vw] lg:text-[8vw] font-black tracking-tighter leading-[0.85] uppercase text-white">
                        Master the <br />
                        <span className="text-indigo-600">Neural Logic</span>
                      </h1>

                      <p className="text-lg lg:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
                        AlgoFlow is the definitive repository for algorithmic intelligence. 
                        Deep intuition, production-grade code, and real-time execution simulations.
                      </p>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8">
                        <Button 
                          onClick={() => setIsSidebarOpen(true)}
                          size="lg"
                          className="w-full sm:w-auto px-12 py-6 sm:py-8 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_60px_rgba(79,70,229,0.5)] transition-all active:scale-95"
                        >
                          <Zap size={20} className="mr-3" />
                          Initialize Learning
                        </Button>
                        <Button 
                          variant="secondary"
                          onClick={() => navigate('/documentation')}
                          size="lg"
                          className="w-full sm:w-auto px-12 py-6 sm:py-8 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border-white/10 hover:bg-white/10 transition-all active:scale-95"
                        >
                          <BookOpen size={20} className="mr-3" />
                          Knowledge Hub
                        </Button>
                      </div>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div 
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30"
                    >
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scroll to Explore</span>
                      <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
                    </motion.div>
                  </section>

                  {/* Features Grid - Bento Style */}
                  <section className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      <div className="md:col-span-8">
                        <Card variant="glass" className="p-12 h-full relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform">
                            <Terminal size={200} />
                          </div>
                          <div className="relative z-10">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 mb-6 sm:mb-8 border border-indigo-500/20">
                              <Terminal size={28} className="sm:size-[32px]" />
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-black mb-4 tracking-tight text-white uppercase">Production Matrix</h3>
                            <p className="text-base sm:text-xl text-slate-400 leading-relaxed max-w-xl font-medium">
                              Access clean, optimized implementations across the multi-language spectrum. 
                              Python, C++, C, and Rust implementations, ready for deployment.
                            </p>
                            <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
                              {['Python', 'C++', 'Rust', 'C'].map(lang => (
                                <span key={lang} className="px-3 py-1 sm:px-4 sm:py-1.5 bg-white/5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 border border-white/5">
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                        </Card>
                      </div>
                      <div className="md:col-span-4">
                        <Card variant="glass" className="p-8 sm:p-12 h-full bg-emerald-600 border-emerald-500 group">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-6 sm:mb-8 backdrop-blur-xl border border-white/20">
                            <Info size={28} className="sm:size-[32px]" />
                          </div>
                          <h3 className="text-2xl sm:text-4xl font-black mb-4 tracking-tight text-white uppercase">Visual Intuition</h3>
                          <p className="text-base sm:text-xl text-emerald-50 leading-relaxed font-medium">
                            Analogies and step-by-step breakdowns that transform complex logic into clear mental models.
                          </p>
                        </Card>
                      </div>
                      <div className="md:col-span-4">
                        <Card variant="glass" className="p-8 sm:p-12 h-full bg-slate-900 border-white/5 group">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 mb-6 sm:mb-8 border border-white/10">
                            <Cpu size={28} className="sm:size-[32px]" />
                          </div>
                          <h3 className="text-2xl sm:text-4xl font-black mb-4 tracking-tight text-white uppercase">Neural Console</h3>
                          <p className="text-base sm:text-xl text-slate-400 leading-relaxed font-medium">
                            Real-time execution simulations with step-by-step state tracking.
                          </p>
                        </Card>
                      </div>
                      <div className="md:col-span-8">
                        <Card variant="glass" className="p-12 h-full relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform">
                            <Database size={200} />
                          </div>
                          <div className="relative z-10">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-violet-600/10 flex items-center justify-center text-violet-500 mb-6 sm:mb-8 border border-violet-500/20">
                              <Database size={28} className="sm:size-[32px]" />
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-black mb-4 tracking-tight text-white uppercase">Knowledge Repository</h3>
                            <p className="text-base sm:text-xl text-slate-400 leading-relaxed max-w-xl font-medium">
                              A comprehensive database of algorithmic patterns, complexity analysis, and historical context.
                            </p>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </section>

                  {/* Library Explorer Section */}
                  <section className="max-w-7xl mx-auto px-4 space-y-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.3em]">
                          <Box size={14} />
                          Neural Inventory
                        </div>
                        <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase leading-[0.9]">
                          Explore the <br />
                          <span className="text-indigo-600">Matrix</span>
                        </h2>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <Button 
                          onClick={() => navigate('/forge')}
                          variant="success"
                          className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-emerald-500/10"
                        >
                          <Plus size={18} className="mr-2" />
                          Forge New Node
                        </Button>
                        <Button 
                          variant="ghost"
                          onClick={() => setIsSidebarOpen(true)}
                          className="text-indigo-400 hover:text-indigo-300 font-black text-[10px] uppercase tracking-[0.2em]"
                        >
                          View all {algorithmsState.length} nodes →
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {/* Create New Card */}
                      <Card
                        variant="glass"
                        onClick={() => navigate('/forge')}
                        className="p-8 sm:p-10 flex flex-col items-center justify-center gap-6 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group min-h-[250px] sm:min-h-[300px] cursor-pointer border-2 border-dashed border-white/10 rounded-[2rem] sm:rounded-[3rem]"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/5 flex items-center justify-center text-slate-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all shadow-2xl">
                          <Plus size={32} className="sm:size-[40px]" />
                        </div>
                        <div className="text-center">
                          <h3 className="font-black text-xl sm:text-2xl text-white uppercase tracking-tight">Forge New Node</h3>
                          <p className="text-[8px] sm:text-[10px] text-slate-500 mt-2 uppercase tracking-[0.3em] font-black">Expand the neural matrix</p>
                        </div>
                      </Card>

                      {algorithmsState.slice(0, 5).map((algo) => {
                        const Icon = iconMap[algo.icon || 'Sparkles'] || Sparkles;
                        return (
                          <Card
                            key={algo.id}
                            variant="glass"
                            onClick={() => navigate(`/algorithm/${algo.id}`)}
                            className="p-8 sm:p-10 hover:shadow-[0_32px_64px_-16px_rgba(79,70,229,0.2)] transition-all hover:-translate-y-2 text-left group cursor-pointer relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] border-white/10"
                          >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 blur-[60px] -z-10 group-hover:bg-indigo-600/10 transition-colors" />
                            
                            <div className="flex items-center justify-between mb-8 sm:mb-10">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all border border-indigo-500/20 shadow-lg">
                                  <Icon size={24} className="sm:size-[28px]" />
                                </div>
                                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 px-3 py-1 sm:px-4 sm:py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 shadow-sm">
                                  {algo.category}
                                </span>
                              </div>
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                                <ChevronRight size={16} className="sm:size-[20px]" />
                              </div>
                            </div>
                            <h3 className="font-black text-2xl sm:text-3xl mb-4 text-white group-hover:text-indigo-400 transition-colors tracking-tighter leading-none">{algo.name}</h3>
                            <p className="text-sm sm:text-base text-slate-500 line-clamp-2 leading-relaxed font-medium">
                              {algo.description}
                            </p>
                          </Card>
                        );
                      })}
                    </div>
                  </section>
                </motion.div>
              } />
              <Route path="/documentation" element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <button 
                    onClick={() => navigate('/')}
                    className="mb-8 flex items-center gap-2 text-indigo-600 font-bold hover:underline"
                  >
                    <ChevronRight className="rotate-180" size={18} />
                    Back to Home
                  </button>
                  <DocumentationView algorithms={algorithmsState} />
                </motion.div>
              } />
              <Route path="/dashboard" element={
                <Dashboard 
                  algorithms={algorithmsState} 
                  onDelete={handleDeleteAlgorithm}
                  onAdd={() => navigate('/forge')}
                  onSelect={(id) => navigate(`/algorithm/${id}`)}
                  onImport={async (data) => {
                    // For simplicity, we'll just loop and add
                    for (const algo of data) {
                      await apiFetch('/api/algorithms', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(algo)
                      });
                    }
                    await fetchData();
                  }}
                />
              } />
              <Route path="/forge" element={<ForgeAlgorithm />} />
              <Route path="/forge/:id" element={<ForgeAlgorithm />} />
              <Route path="/algorithm/:id" element={<AlgorithmRoute algorithms={algorithmsState} navigate={navigate} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function AlgorithmRoute({ algorithms, navigate }: { algorithms: Algorithm[], navigate: any }) {
  const { id } = useParams<{ id: string }>();
  const algo = algorithms.find(a => a.id === id);

  if (!algo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-3xl font-black mb-4">Algorithm Not Found</h2>
        <button onClick={() => navigate('/')} className="text-indigo-500 font-bold hover:underline">
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <AlgorithmViewer 
      algorithm={algo} 
      onClose={() => navigate('/')}
    />
  );
}
