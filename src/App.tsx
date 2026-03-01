/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Terminal, 
  Info,
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
  Search,
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
import { categories } from './data/algorithms';
import { Algorithm, Category } from './types';
import { cn } from './lib/utils';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import AlgorithmViewer from './components/AlgorithmViewer';
import DocumentationView from './components/DocumentationView';
import CreateAlgorithmModal from './components/CreateAlgorithmModal';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import AddNewAlgo from './pages/AddNewAlgo';
import Login from './pages/Login';
import DocumentationHub from './pages/DocumentationHub';
import AlgorithmDetail from './pages/AlgorithmDetail';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout, token } = useAuth();
  const [algorithmsState, setAlgorithmsState] = useState<Algorithm[]>([]);
  const [categoriesState, setCategoriesState] = useState<Category[]>(categories);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAlgorithm, setEditingAlgorithm] = useState<Algorithm | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlgorithms = async () => {
    try {
      setIsLoading(true);
      const [algoRes, catRes] = await Promise.all([
        fetch('/api/algorithms'),
        fetch('/api/categories')
      ]);
      
      const algos = await algoRes.json();
      const cats = await catRes.json();
      
      setAlgorithmsState(algos);
      
      // Merge categories from API with categories derived from algorithms
      const algoCategories = Array.from(new Set(algos.map((a: Algorithm) => a.category)));
      const allCategoryNames = Array.from(new Set([...cats.map((c: any) => c.name), ...algoCategories]));
      
      setCategoriesState(allCategoryNames.map(name => {
        const existing = cats.find((c: any) => c.name === name) || categories.find(c => c.name === name);
        const algoIds = algos.filter((a: Algorithm) => a.category === name).map((a: Algorithm) => a.id);
        return {
          name,
          icon: existing?.icon || 'Box',
          algorithms: algoIds
        };
      }));
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (name: string, icon: string = 'Box') => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Token ${token}` : '',
        },
        body: JSON.stringify({ name, icon })
      });
      if (!res.ok) throw new Error('Failed to add category');
      await fetchAlgorithms();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlgorithms();
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
      // Ensure category exists in backend
      await handleAddCategory(newAlgo.category);

      const res = await fetch('/api/algorithms', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Token ${token}` : '',
        },
        body: JSON.stringify(newAlgo)
      });
      if (!res.ok) throw new Error('Failed to add algorithm');
      
      await fetchAlgorithms();
      navigate(`/algorithm/${newAlgo.id}`);
    } catch (err) {
      console.error(err);
      alert('Error adding algorithm');
    }
  };

  const handleDeleteAlgorithm = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this algorithm?')) {
      try {
        const res = await fetch(`/api/algorithms/${id}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': token ? `Token ${token}` : '',
          },
        });
        if (!res.ok) throw new Error('Failed to delete algorithm');
        
        await fetchAlgorithms();
        if (location.pathname.includes(id)) {
          navigate('/');
        }
      } catch (err) {
        console.error(err);
        alert('Error deleting algorithm');
      }
    }
  };

  const handleUpdateAlgorithm = async (updatedAlgo: Algorithm) => {
    try {
      const res = await fetch(`/api/algorithms/${updatedAlgo.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Token ${token}` : '',
        },
        body: JSON.stringify(updatedAlgo)
      });
      if (!res.ok) throw new Error('Failed to update algorithm');
      
      await fetchAlgorithms();
    } catch (err) {
      console.error(err);
      alert('Error updating algorithm');
    }
  };

  const handleImport = async (data: Algorithm[]) => {
    try {
      const res = await fetch('/api/algorithms/import', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Token ${token}` : '',
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to import algorithms');
      
      await fetchAlgorithms();
      alert('Library imported successfully!');
    } catch (err) {
      console.error(err);
      alert('Error importing algorithms');
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 font-sans",
      isDarkMode ? "dark bg-[#0a0a0a] text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <span className="font-bold text-lg tracking-tight">AlgoFlow</span>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <button
              onClick={logout}
              className="p-2 text-sm text-slate-500 hover:text-rose-500 transition-colors"
            >
              Logout
            </button>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      
      {/* Desktop Header with User Menu */}
      <header className="hidden lg:flex fixed top-0 right-0 z-50 p-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{user?.username}</span>
                <span className="text-[10px] text-slate-500 uppercase">{user?.role}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
              title="Logout"
            >
              <Shield size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all"
          >
            <Shield size={18} />
            Login
          </button>
        )}
      </header>

      <div className="flex relative">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
          selectedAlgoId={location.pathname.startsWith('/algorithm/') ? location.pathname.split('/').pop() || null : null}
          setSelectedAlgoId={(id) => navigate(`/algorithm/${id}`)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredAlgorithms={filteredAlgorithms}
          onAdd={() => navigate('/addnewalgo')}
          setView={(v) => {
            if (v === 'docs') navigate('/docs');
            else if (v === 'dashboard') navigate('/dashboard');
            else navigate('/');
          }}
          categories={categoriesState}
          isAdmin={isAdmin}
        />

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 min-h-screen",
          isSidebarOpen ? "lg:ml-72" : "ml-0"
        )}>
          <div className="max-w-[1600px] mx-auto p-4 lg:p-8">
            <Routes>
              <Route path="/" element={
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center min-h-[80vh] text-center"
                >
                  <div className="relative mb-8">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 6, repeat: Infinity }}
                      className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-500/20"
                    >
                      AF
                    </motion.div>
                    <motion.div 
                      className="absolute -top-4 -right-4 text-indigo-500"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles size={32} />
                    </motion.div>
                  </div>
                  
                  <h1 className="text-5xl lg:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent leading-tight">
                    Master the Art of Algorithms
                  </h1>
                  <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mb-12 leading-relaxed">
                    AlgoFlow is your personal mentor for Data Structures and Algorithms. 
                    Explore production-ready code, deep intuitive guides, and real-time execution simulations.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-16">
                    {[
                      { 
                        icon: Terminal, 
                        title: "Production Code", 
                        desc: "Clean, optimized implementations in Python, C++, C, and Rust.",
                        color: "text-indigo-600",
                        bg: "bg-indigo-50 dark:bg-indigo-900/20"
                      },
                      { 
                        icon: Info, 
                        title: "Visual Guides", 
                        desc: "Step-by-step breakdowns and analogies that make complex logic simple.",
                        color: "text-emerald-600",
                        bg: "bg-emerald-50 dark:bg-emerald-900/20"
                      }
                    ].map((feature, i) => (
                      <div key={i} className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", feature.bg)}>
                          <feature.icon className={feature.color} size={32} />
                        </div>
                        <h3 className="font-bold text-2xl mb-3">{feature.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
                    <button 
                      onClick={() => setIsSidebarOpen(true)}
                      className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20 flex items-center gap-2"
                    >
                      <Zap size={20} />
                      Start Learning
                    </button>
                    <button 
                      onClick={() => navigate('/docs')}
                      className="px-8 py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full font-bold text-lg transition-all flex items-center gap-2"
                    >
                      <BookOpen size={20} />
                      Documentation Hub
                    </button>
                  </div>

                  {/* Quick Start Grid */}
                  <div className="w-full max-w-5xl text-left">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-black tracking-tight">Library Explorer</h2>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => navigate('/addnewalgo')}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
                        >
                          <Plus size={18} />
                          Add Algorithm
                        </button>
                        <button 
                          onClick={() => setIsSidebarOpen(true)}
                          className="text-indigo-600 font-bold text-sm hover:underline"
                        >
                          View all {algorithmsState.length} algorithms →
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Create New Card */}
                      <button
                        onClick={() => navigate('/addnewalgo')}
                        className="p-6 rounded-3xl bg-slate-100/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group min-h-[200px]"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <Plus size={24} />
                        </div>
                        <div className="text-center">
                          <h3 className="font-bold text-lg">Add New</h3>
                          <p className="text-xs text-slate-500">Expand the library</p>
                        </div>
                      </button>

                      {algorithmsState.slice(0, 5).map((algo) => {
                        const Icon = iconMap[algo.icon || 'Sparkles'] || Sparkles;
                        return (
                          <button
                            key={algo.id}
                            onClick={() => navigate(`/algorithm/${algo.id}`)}
                            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 text-left group"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                  <Icon size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                  {algo.category}
                                </span>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <ChevronRight size={16} />
                              </div>
                            </div>
                            <h3 className="font-bold text-xl mb-2">{algo.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {algo.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              } />
              <Route path="/docs" element={
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
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute requireAdmin>
                  <Dashboard 
                    algorithms={algorithmsState} 
                    categories={categoriesState.map(c => c.name)}
                    onDelete={handleDeleteAlgorithm}
                    onAdd={() => navigate('/addnewalgo')}
                    onAddCategory={handleAddCategory}
                    onEdit={(algo) => setEditingAlgorithm(algo)}
                    onSelect={(id) => navigate(`/algorithm/${id}`)}
                    onImport={handleImport}
                  />
                </ProtectedRoute>
              } />
              <Route path="/addnewalgo" element={
                <ProtectedRoute requireAdmin>
                  <AddNewAlgo 
                    onSave={handleAddAlgorithm}
                    categories={categoriesState.map(c => c.name)}
                  />
                </ProtectedRoute>
              } />
              <Route path="/algorithm/:id" element={
                <AlgorithmRoute 
                  algorithms={algorithmsState} 
                  navigate={navigate} 
                  onUpdate={handleUpdateAlgorithm}
                  onDelete={handleDeleteAlgorithm}
                />
              } />
              <Route path="/algo/:id" element={
                <AlgorithmDetailRoute 
                  algorithms={algorithmsState} 
                  navigate={navigate}
                />
              } />
              <Route path="/hub" element={
                <DocumentationHub algorithms={algorithmsState} />
              } />
            </Routes>
          </div>
        </main>
      </div>

      <CreateAlgorithmModal 
        isOpen={isCreateModalOpen || !!editingAlgorithm}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingAlgorithm(undefined);
        }}
        onSave={(algo) => {
          if (editingAlgorithm) {
            handleUpdateAlgorithm(algo);
          } else {
            handleAddAlgorithm(algo);
          }
          setIsCreateModalOpen(false);
          setEditingAlgorithm(undefined);
        }}
        initialData={editingAlgorithm}
        categories={categoriesState.map(c => c.name)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AlgorithmRoute({ algorithms, navigate, onUpdate, onDelete }: { 
  algorithms: Algorithm[], 
  navigate: any,
  onUpdate: (algo: Algorithm) => void,
  onDelete: (id: string) => void
}) {
  const { id } = useParams<{ id: string }>();
  const algo = algorithms.find(a => a.id === id);

  if (!algo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-3xl font-black mb-4">Algorithm Not Found</h2>
        <button onClick={() => navigate('/')} className="text-indigo-50 font-bold hover:underline">
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <AlgorithmViewer 
      algorithm={algo} 
      onClose={() => navigate('/')}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  );
}

function DocumentationHubRoute({ algorithms, navigate }: { 
  algorithms: Algorithm[], 
  navigate: any
}) {
  return (
    <DocumentationHub algorithms={algorithms} />
  );
}

function AlgorithmDetailRoute({ algorithms, navigate }: { 
  algorithms: Algorithm[], 
  navigate: any
}) {
  const { id } = useParams<{ id: string }>();
  const algo = algorithms.find(a => a.id === id);

  if (!algo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center bg-[#050505]">
        <h2 className="text-3xl font-black mb-4 text-white">Algorithm Not Found</h2>
        <button onClick={() => navigate('/hub')} className="text-indigo-400 font-bold hover:underline">
          Return to Documentation Hub
        </button>
      </div>
    );
  }

  return (
    <AlgorithmDetail 
      algorithm={algo} 
      onBack={() => navigate('/hub')}
    />
  );
}
