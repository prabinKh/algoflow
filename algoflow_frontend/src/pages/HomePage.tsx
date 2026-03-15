import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  BookOpen,
  Code2,
  Cpu,
  Database,
  Globe,
  Shield,
  Activity,
  Box,
  Layers,
  ListOrdered,
  Search,
  Share2,
  Braces,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Target,
  Clock,
  Star,
  GitBranch,
  Terminal,
  Play,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Flame,
  BarChart3
} from 'lucide-react';
import { Algorithm, Category } from '../types';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

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

interface HomePageProps {
  algorithms: Algorithm[];
  categories: Category[];
  setIsSidebarOpen: (open: boolean) => void;
  onNavigate: (path: string) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function HomePage({ algorithms, categories, setIsSidebarOpen, onNavigate }: HomePageProps) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate statistics
  const stats = {
    totalAlgorithms: algorithms.length,
    totalCategories: categories.length,
    totalImplementations: algorithms.reduce((acc, algo) => {
      return acc + Object.values(algo.code).filter(c => c.functionCode || c.classCode || c.recursiveCode).length;
    }, 0),
    avgComplexity: algorithms.length > 0 
      ? Array.from(new Set(algorithms.map(a => a.complexity.time))).slice(0, 3).join(', ')
      : 'N/A',
    completionRate: algorithms.length > 0
      ? Math.round((algorithms.filter(algo => {
          const langs = ['python', 'c', 'cpp', 'rust'];
          return langs.every(l => algo.code[l]?.functionCode || algo.code[l]?.classCode || algo.code[l]?.recursiveCode);
        }).length / algorithms.length) * 100)
      : 0
  };

  // Language distribution data
  const languageData = useMemo(() => {
    const counts = { python: 0, cpp: 0, c: 0, rust: 0 };
    algorithms.forEach(algo => {
      Object.keys(algo.code).forEach(lang => {
        if (algo.code[lang]?.functionCode || algo.code[lang]?.classCode) {
          counts[lang as keyof typeof counts]++;
        }
      });
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [algorithms]);

  // Category distribution
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    algorithms.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [algorithms]);

  // Complexity distribution
  const complexityData = useMemo(() => {
    const counts: Record<string, number> = {};
    algorithms.forEach(a => {
      counts[a.complexity.time] = (counts[a.complexity.time] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [algorithms]);

  // Recent algorithms
  const recentAlgorithms = useMemo(() => {
    return [...algorithms].reverse().slice(0, 6);
  }, [algorithms]);

  // Top algorithms (mock data - could be based on views/runs)
  const topAlgorithms = useMemo(() => {
    return algorithms.slice(0, 5).map(algo => ({
      ...algo,
      views: Math.floor(Math.random() * 1000) + 100,
      runs: Math.floor(Math.random() * 500) + 50
    }));
  }, [algorithms]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-20 pb-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 blur-[200px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 5 }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 blur-[200px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 18, repeat: Infinity, delay: 10 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/10 blur-[200px] rounded-full"
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-indigo-400/30 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * 1000,
              }}
              animate={{
                y: [null, Math.random() * -200],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-7xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl shadow-2xl hover:bg-white/10 transition-all cursor-pointer"
            onClick={() => onNavigate('/dashboard')}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
              System Online • v4.0
            </span>
            <ExternalLink size={12} className="text-slate-500" />
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-[15vw] sm:text-[10vw] lg:text-[8vw] font-black tracking-tighter leading-[0.85] text-white">
              Master the
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
                Neural Logic
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed font-medium px-4">
              AlgoFlow is the definitive repository for algorithmic intelligence.
              <br className="hidden sm:block" />
              Deep intuition, production-grade code, and real-time execution simulations.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Button
              onClick={() => setIsSidebarOpen(true)}
              size="lg"
              className="w-full sm:w-auto px-12 py-6 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_30px_70px_rgba(79,70,229,0.5)] transition-all active:scale-95 group"
            >
              <Zap size={20} className="mr-3 group-hover:animate-pulse" />
              Explore Library
            </Button>
            <Button
              variant="secondary"
              onClick={() => onNavigate('/documentation')}
              size="lg"
              className="w-full sm:w-auto px-12 py-6 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border-white/10 hover:bg-white/10 transition-all active:scale-95"
            >
              <BookOpen size={20} className="mr-3" />
              Documentation
            </Button>
            <Button
              variant="ghost"
              onClick={() => onNavigate('/forge')}
              size="lg"
              className="w-full sm:w-auto px-12 py-6 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 transition-all active:scale-95"
            >
              <Sparkles size={20} className="mr-3" />
              AI Forge
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-4xl mx-auto"
          >
            {[
              { label: 'Algorithms', value: stats.totalAlgorithms, icon: Code2, color: 'text-indigo-400' },
              { label: 'Categories', value: stats.totalCategories, icon: Layers, color: 'text-emerald-400' },
              { label: 'Implementations', value: stats.totalImplementations, icon: Terminal, color: 'text-rose-400' },
              { label: 'Completion', value: `${stats.completionRate}%`, icon: Target, color: 'text-amber-400' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all group cursor-pointer"
                onClick={() => onNavigate('/dashboard')}
              >
                <stat.icon size={24} className={cn("mb-3", stat.color)} />
                <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Scroll to Explore</span>
          <div className="w-px h-16 bg-gradient-to-b from-indigo-500 to-transparent" />
        </motion.div>
      </section>

      {/* Statistics Dashboard Section */}
      <section className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.3em]">
                <BarChart3 size={14} />
                Analytics Dashboard
              </div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase">
                Platform <span className="text-indigo-500">Insights</span>
              </h2>
              <p className="text-slate-400 max-w-2xl text-lg">
                Real-time metrics and comprehensive analysis of the algorithm ecosystem
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate('/dashboard')}
              className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl"
            >
              View Full Dashboard <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: 'Total Algorithms',
                value: stats.totalAlgorithms,
                icon: Code2,
                color: 'text-indigo-400',
                bg: 'bg-indigo-500/10',
                trend: 12,
              },
              {
                label: 'Active Categories',
                value: stats.totalCategories,
                icon: Layers,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                trend: 8,
              },
              {
                label: 'Code Implementations',
                value: stats.totalImplementations,
                icon: Terminal,
                color: 'text-rose-400',
                bg: 'bg-rose-500/10',
                trend: 24,
              },
              {
                label: 'Avg Completion',
                value: `${stats.completionRate}%`,
                icon: Target,
                color: 'text-amber-400',
                bg: 'bg-amber-500/10',
                trend: stats.completionRate > 80 ? 5 : -3,
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Card className="p-6 relative overflow-hidden border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                      <stat.icon size={24} />
                    </div>
                    <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black", stat.trend >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
                      {stat.trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {Math.abs(stat.trend)}%
                    </div>
                  </div>
                  <p className="text-4xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                  <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(100, (Number(stat.value) || 0) / 10)}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={cn("h-full rounded-full", stat.color.replace('text-', 'bg-'))}
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Language Distribution */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -z-10" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <Code2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase text-white">Language Matrix</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Implementation Distribution</p>
                  </div>
                </div>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={languageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      />
                      <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]}>
                        {languageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px] -z-10" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase text-white">Category Clusters</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Algorithm Distribution</p>
                  </div>
                </div>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Top Algorithms Section */}
      <section className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 text-[10px] font-black uppercase tracking-[0.3em]">
                <Flame size={14} />
                Trending Now
              </div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase">
                Top <span className="text-amber-500">Performers</span>
              </h2>
              <p className="text-slate-400 max-w-2xl text-lg">
                Most viewed and executed algorithms this week
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topAlgorithms.map((algo, i) => {
              const Icon = iconMap[algo.icon || 'Sparkles'] || Sparkles;
              return (
                <motion.div
                  key={algo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="group cursor-pointer"
                  onClick={() => onNavigate(`/algorithm/${algo.id}`)}
                >
                  <Card className="p-6 relative overflow-hidden border-white/5 hover:border-indigo-500/50 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[60px] -z-10 group-hover:bg-indigo-600/10 transition-colors" />
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                          <Icon size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">#{i + 1}</p>
                          <p className="text-sm font-bold text-white">{algo.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-black">
                        <Flame size={12} />
                        {algo.views}
                      </div>
                    </div>

                    <h3 className="text-xl font-black text-white mb-3 group-hover:text-indigo-400 transition-colors">
                      {algo.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {algo.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("px-2 py-1 rounded text-[9px] font-black uppercase",
                          algo.complexity.timeRating === 'good' ? "bg-emerald-500/10 text-emerald-400" :
                          algo.complexity.timeRating === 'average' ? "bg-amber-500/10 text-amber-400" :
                          "bg-rose-500/10 text-rose-400"
                        )}>
                          {algo.complexity.time}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 text-xs">
                        <Play size={12} />
                        {algo.runs} runs
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={14} />
              Platform Features
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase">
              Why <span className="text-purple-500">AlgoFlow</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Terminal,
                title: 'Multi-Language Support',
                description: 'Production-ready implementations in Python, C++, C, and Rust. Choose your weapon.',
                color: 'indigo',
              },
              {
                icon: BookOpen,
                title: 'Deep Explanations',
                description: 'Understand the intuition, walkthrough, and when to use each algorithm effectively.',
                color: 'emerald',
              },
              {
                icon: Cpu,
                title: 'Interactive Console',
                description: 'Run algorithms in real-time with step-by-step execution tracking and output visualization.',
                color: 'rose',
              },
              {
                icon: Sparkles,
                title: 'AI-Powered Forge',
                description: 'Generate complete algorithm documentation with code using advanced AI assistance.',
                color: 'amber',
              },
              {
                icon: Target,
                title: 'Complexity Analysis',
                description: 'Detailed time and space complexity breakdowns with visual comparisons.',
                color: 'purple',
              },
              {
                icon: Award,
                title: 'Quiz & Assessment',
                description: 'Test your understanding with interactive questions and code challenges.',
                color: 'pink',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group"
              >
                <Card className="p-8 relative overflow-hidden border-white/5 hover:border-white/10 transition-all">
                  <div className={cn(
                    "absolute top-0 right-0 w-48 h-48 blur-[80px] -z-10 transition-opacity opacity-5 group-hover:opacity-10",
                    feature.color === 'indigo' ? 'bg-indigo-600' :
                    feature.color === 'emerald' ? 'bg-emerald-600' :
                    feature.color === 'rose' ? 'bg-rose-600' :
                    feature.color === 'amber' ? 'bg-amber-600' :
                    feature.color === 'purple' ? 'bg-purple-600' :
                    'bg-pink-600'
                  )} />
                  
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6",
                    feature.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-400' :
                    feature.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                    feature.color === 'rose' ? 'bg-rose-500/10 text-rose-400' :
                    feature.color === 'amber' ? 'bg-amber-500/10 text-amber-400' :
                    feature.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-pink-500/10 text-pink-400'
                  )}>
                    <feature.icon size={28} />
                  </div>
                  
                  <h3 className="text-xl font-black text-white mb-3 uppercase">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card className="p-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            
            <div className="relative z-10 text-center space-y-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
                <Sparkles size={16} className="text-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Ready to Begin?</span>
              </div>
              
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase">
                Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Journey</span>
              </h2>
              
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Join thousands of developers mastering algorithms with AlgoFlow's comprehensive learning platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  onClick={() => setIsSidebarOpen(true)}
                  size="lg"
                  className="px-12 py-6 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_30px_70px_rgba(79,70,229,0.5)] transition-all"
                >
                  <Zap size={20} className="mr-3" />
                  Explore Library
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => onNavigate('/forge')}
                  size="lg"
                  className="px-12 py-6 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border-white/10 hover:bg-white/10 transition-all"
                >
                  <Sparkles size={20} className="mr-3" />
                  Create with AI
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
