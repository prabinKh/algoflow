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
import HomePage from './pages/HomePage';
import { ProtectedRoute } from './auth';
import { LoginPage, RegisterPage, VerifyEmailPage, ResetPasswordPage } from './auth';

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
          <span className="font-bold text-lg tracking-tight">AlgoFlow </span>
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
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/" element={
                <HomePage
                  algorithms={algorithmsState}
                  categories={categoriesState}
                  setIsSidebarOpen={setIsSidebarOpen}
                  onNavigate={navigate}
                />
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
                <ProtectedRoute requireVerified>
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
                </ProtectedRoute>
              } />
              <Route path="/forge" element={
                <ProtectedRoute requireStaff>
                  <ForgeAlgorithm />
                </ProtectedRoute>
              } />
              <Route path="/forge/:id" element={
                <ProtectedRoute requireStaff>
                  <ForgeAlgorithm />
                </ProtectedRoute>
              } />
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
