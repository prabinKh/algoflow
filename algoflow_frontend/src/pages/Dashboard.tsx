import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  TrendingUp,
  Users,
  Code2,
  BookOpen,
  Zap,
  Cpu,
  Database,
  Globe,
  Activity,
  Shield,
  Search,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target,
  Award,
  TrendingDown,
  RefreshCcw,
  Eye,
  GitBranch,
  Layers,
  Terminal,
  Play,
  Star,
  Flame,
  Timer,
  HardDrive,
  Network,
  Server,
  Box,
  Layers as LayersIcon
} from 'lucide-react';
import { Algorithm, Language } from '../types';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useAuth } from '../auth';

interface DashboardProps {
  algorithms: Algorithm[];
  onDelete: (id: string) => void;
  onAdd: () => void;
  onSelect: (id: string) => void;
  onImport: (data: Algorithm[]) => void;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  bg: string;
  glow: string;
  trend?: number;
  delay?: number;
}

const StatCard = ({ label, value, icon: Icon, color, bg, glow, trend, delay = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.02, y: -4 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <Card
      variant="glass"
      className={cn(
        "relative p-6 sm:p-8 overflow-hidden border-white/5 hover:border-white/10 transition-all duration-500 shadow-2xl",
        glow
      )}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px] animate-pulse" />
      </div>
      
      {/* Floating particles */}
      <div className="absolute top-4 right-4 flex gap-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
            }}
            className="w-1 h-1 rounded-full bg-current"
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <motion.div 
            className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", bg, color)}
          >
            <Icon size={28} />
          </motion.div>
          {trend !== undefined && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn("flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider", trend >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}
            >
              {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(trend)}%
            </motion.div>
          )}
        </div>
        
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{label}</p>
        <motion.h3 
          className="text-4xl sm:text-5xl font-black tracking-tight text-white"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: delay + 0.2 }}
        >
          {value}
        </motion.h3>
        
        {/* Progress bar */}
        <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (Number(value) || 0) / 10)}%` }}
            transition={{ duration: 1, delay: delay + 0.3 }}
            className={cn("h-full rounded-full", color.replace('text-', 'bg-'))}
          />
        </div>
      </div>
    </Card>
  </motion.div>
);

export default function Dashboard({ algorithms, onDelete, onAdd, onSelect, onImport }: DashboardProps) {
  const navigate = useNavigate();
  const { user, isAdmin, isStaff } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'algorithms' | 'analytics'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(() =>
    ['All', ...Array.from(new Set(algorithms.map(a => a.category)))],
    [algorithms]
  );

  const filteredAlgos = useMemo(() => {
    return algorithms.filter(algo => {
      const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          algo.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || algo.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [algorithms, searchQuery, filterCategory]);

  const recentActivity = useMemo(() => {
    return [...algorithms].reverse().slice(0, 5);
  }, [algorithms]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAlgos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAlgos.map(a => a.id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} algorithms?`)) {
      selectedIds.forEach(id => onDelete(id));
      setSelectedIds([]);
    }
  };

  const totalImplementations = useMemo(() => {
    return algorithms.reduce((acc, algo) => {
      return acc + Object.values(algo.code).filter(c => c.functionCode || c.classCode || c.recursiveCode).length;
    }, 0);
  }, [algorithms]);

  const avgComplexity = useMemo(() => {
    const complexities = algorithms.map(a => a.complexity.time);
    const unique = new Set(complexities);
    return Array.from(unique).slice(0, 3).join(', ') || 'N/A';
  }, [algorithms]);

  const completionRate = useMemo(() => {
    if (algorithms.length === 0) return 0;
    const complete = algorithms.filter(algo => {
      const langs: Language[] = ['python', 'c', 'cpp', 'rust'];
      return langs.every(l => algo.code[l]?.functionCode || algo.code[l]?.classCode || algo.code[l]?.recursiveCode);
    }).length;
    return Math.round((complete / algorithms.length) * 100);
  }, [algorithms]);

  const languageStats = useMemo(() => {
    const stats = { python: 0, cpp: 0, c: 0, rust: 0 };
    algorithms.forEach(algo => {
      Object.keys(algo.code).forEach(lang => {
        if (algo.code[lang as Language]?.functionCode || algo.code[lang as Language]?.classCode) {
          stats[lang as keyof typeof stats]++;
        }
      });
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [algorithms]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    algorithms.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [algorithms]);

  const complexityData = useMemo(() => {
    const counts: Record<string, number> = {};
    algorithms.forEach(a => {
      const time = a.complexity.time;
      counts[time] = (counts[time] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [algorithms]);

  const activityData = useMemo(() => {
    // Mock activity data - in real app, track over time
    return algorithms.slice(0, 7).reverse().map((algo, i) => ({
      name: algo.name.slice(0, 10),
      views: Math.floor(Math.random() * 100) + 10,
      runs: Math.floor(Math.random() * 50) + 5,
    }));
  }, [algorithms]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  const handleExport = () => {
    const dataStr = JSON.stringify(algorithms, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'algoflow_backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImport(json);
          alert('Library imported successfully!');
        }
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const getHealthStatus = (algo: Algorithm) => {
    const langs: Language[] = ['python', 'c', 'cpp', 'rust'];
    const missing = langs.filter(l => !(algo.code[l]?.functionCode || algo.code[l]?.classCode || algo.code[l]?.recursiveCode));
    if (missing.length === 0) return { label: 'Complete', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 };
    if (missing.length < 4) return { label: 'Partial', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: AlertCircle };
    return { label: 'Empty', color: 'text-rose-500', bg: 'bg-rose-500/10', icon: AlertCircle };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] rounded-full"
        />
      </div>

      {/* Header Section */}
      <header className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <motion.div 
                className="flex items-center gap-3 text-indigo-400 font-black text-xs uppercase tracking-[0.3em]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Shield size={16} />
                </motion.div>
                {isAdmin ? 'Administrator' : isStaff ? 'Staff Member' : 'Dashboard'} Access
              </motion.div>
              
              <motion.h1 
                className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Center</span>
              </motion.h1>
              
              <motion.p 
                className="text-slate-400 max-w-2xl text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Orchestrate your algorithm ecosystem. Monitor real-time performance, analyze patterns, and expand the neural network.
              </motion.p>

              {/* User info */}
              <motion.div 
                className="flex items-center gap-4 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                {(isAdmin || isStaff) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border", isAdmin ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20")}
                  >
                    {isAdmin ? '👑 Admin' : '⭐ Staff'}
                  </motion.div>
                )}
              </motion.div>
            </div>

            <motion.div 
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 w-full md:w-auto">
                <label className="cursor-pointer flex-1 md:flex-none">
                  <Button variant="secondary" className="pointer-events-none w-full">
                    <Upload size={18} className="mr-2" />
                    Import
                  </Button>
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
                <Button variant="secondary" onClick={handleExport} className="flex-1 md:flex-none">
                  <Download size={18} className="mr-2" />
                  Export
                </Button>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onAdd}
                  size="lg"
                  className="px-8 py-6 text-lg rounded-[1.5rem] shadow-2xl shadow-indigo-500/40 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                >
                  <Plus size={22} className="mr-2" />
                  Initialize Node
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Algorithms"
          value={algorithms.length}
          icon={Cpu}
          color="text-indigo-400"
          bg="bg-indigo-500/10"
          glow="shadow-indigo-500/20"
          trend={12}
          delay={0.1}
        />
        <StatCard
          label="Categories"
          value={categories.length - 1}
          icon={Layers}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          glow="shadow-emerald-500/20"
          trend={8}
          delay={0.2}
        />
        <StatCard
          label="Implementations"
          value={totalImplementations}
          icon={Code2}
          color="text-rose-400"
          bg="bg-rose-500/10"
          glow="shadow-rose-500/20"
          trend={24}
          delay={0.3}
        />
        <StatCard
          label="Completion Rate"
          value={`${completionRate}%`}
          icon={Target}
          color="text-amber-400"
          bg="bg-amber-500/10"
          glow="shadow-amber-500/20"
          trend={completionRate > 80 ? 5 : -3}
          delay={0.4}
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="glass" className="p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -z-10 group-hover:bg-indigo-600/10 transition-colors" />
            
            <div className="flex items-center gap-4 mb-8">
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20"
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Terminal size={28} />
              </motion.div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-white uppercase">Language Matrix</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Implementation Distribution</p>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={languageStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: '1px solid #1e293b', 
                      borderRadius: '12px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]}>
                    {languageStats.map((entry, index) => (
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
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="glass" className="p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px] -z-10 group-hover:bg-emerald-600/10 transition-colors" />
            
            <div className="flex items-center gap-4 mb-8">
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20"
                whileHover={{ scale: 1.1 }}
              >
                <PieChartIcon size={28} />
              </motion.div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-white uppercase">Category Clusters</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Algorithm Distribution</p>
              </div>
            </div>

            <div className="h-[250px] w-full">
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
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      border: '1px solid #1e293b', 
                      borderRadius: '12px' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card variant="glass" className="p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 blur-[120px] -z-10 group-hover:bg-purple-600/10 transition-colors" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                <Activity size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-white uppercase">Activity Trends</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Views & Execution Metrics</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-xs font-bold text-slate-400">Views</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-400">Runs</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #1e293b', 
                    borderRadius: '12px' 
                  }} 
                />
                <Area type="monotone" dataKey="views" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                <Area type="monotone" dataKey="runs" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Algorithms */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="lg:col-span-2"
        >
          <Card variant="glass" className="p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/5 blur-[100px] -z-10" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                  <Clock size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-white uppercase">Recent Nodes</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Latest Additions</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setActiveTab('algorithms')} className="text-indigo-400 hover:text-indigo-300">
                View All <ExternalLink size={16} className="ml-2 inline" />
              </Button>
            </div>

            <div className="space-y-4">
              {recentActivity.map((algo, index) => (
                <motion.div
                  key={algo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
                  onClick={() => onSelect(algo.id)}
                >
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-lg group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 5 }}
                  >
                    {algo.name.charAt(0)}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-indigo-400 transition-colors">{algo.name}</p>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{algo.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase", 
                      algo.complexity.timeRating === 'good' ? "bg-emerald-500/10 text-emerald-400" :
                      algo.complexity.timeRating === 'average' ? "bg-amber-500/10 text-amber-400" :
                      "bg-rose-500/10 text-rose-400"
                    )}>
                      {algo.complexity.time}
                    </div>
                    <ExternalLink size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card variant="glass" className="p-8 relative overflow-hidden group h-full">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/5 blur-[100px] -z-10" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
                <Award size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-white uppercase">Performance</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest">System Metrics</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">System Health</span>
                  <span className="text-sm font-black text-emerald-400">98.5%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '98.5%' }}
                    transition={{ duration: 1, delay: 1 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Storage Used</span>
                  <span className="text-sm font-black text-indigo-400">45.2 GB</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">API Calls</span>
                  <span className="text-sm font-black text-amber-400">12,458</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
                    transition={{ duration: 1, delay: 1.4 }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <Flame size={20} className="text-rose-400" />
                    <span className="text-xs font-bold text-slate-400">Hot Algorithms</span>
                  </div>
                  <span className="text-sm font-black text-white">24</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <Star size={20} className="text-amber-400" />
                    <span className="text-xs font-bold text-slate-400">Favorites</span>
                  </div>
                  <span className="text-sm font-black text-white">18</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <Play size={20} className="text-emerald-400" />
                    <span className="text-xs font-bold text-slate-400">Total Runs</span>
                  </div>
                  <span className="text-sm font-black text-white">5,847</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Algorithm Management Table */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
        <Card variant="glass" className="relative rounded-[2rem] overflow-hidden shadow-2xl p-0">
          <div className="p-6 lg:p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1 uppercase">Neural Inventory</h2>
                <p className="text-sm text-slate-500">Manage and deploy algorithms across the platform.</p>
              </div>
              {selectedIds.length > 0 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Button
                    variant="danger"
                    onClick={handleBulkDelete}
                    className="shadow-lg shadow-rose-500/20"
                  >
                    <Trash2 size={18} className="mr-2" />
                    Purge {selectedIds.length} Nodes
                  </Button>
                </motion.div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <Input
                placeholder="Filter nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={18} />}
                className="w-full sm:w-64"
              />
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full sm:w-48"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
                  <th className="px-6 py-5 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredAlgos.length && filteredAlgos.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Designation</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden lg:table-cell">Category</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden xl:table-cell">Health</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden 2xl:table-cell">Languages</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden lg:table-cell">Complexity</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {filteredAlgos.map((algo, index) => {
                    const health = getHealthStatus(algo);
                    const isSelected = selectedIds.includes(algo.id);
                    return (
                      <motion.tr
                        key={algo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn("hover:bg-indigo-500/[0.03] transition-colors group", isSelected && "bg-indigo-500/[0.08]")}
                      >
                        <td className="px-6 py-5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(algo.id)}
                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <motion.div 
                              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-lg group-hover:scale-110 transition-transform"
                              whileHover={{ rotate: 5 }}
                            >
                              {algo.name.charAt(0)}
                            </motion.div>
                            <div className="min-w-0">
                              <p className="font-black text-base text-white group-hover:text-indigo-400 transition-colors truncate">{algo.name}</p>
                              <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest truncate">{algo.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden lg:table-cell">
                          <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-400">
                            {algo.category}
                          </span>
                        </td>
                        <td className="px-6 py-5 hidden xl:table-cell">
                          <motion.div 
                            className={cn("flex items-center gap-2 font-bold text-xs px-3 py-1.5 rounded-full inline-flex", health.color, health.bg)}
                            whileHover={{ scale: 1.05 }}
                          >
                            <health.icon size={14} />
                            {health.label}
                          </motion.div>
                        </td>
                        <td className="px-6 py-5 hidden 2xl:table-cell">
                          <div className="flex items-center gap-1.5">
                            {Object.keys(algo.code).map(lang => (
                              <motion.div
                                key={lang}
                                className={cn(
                                  "w-7 h-7 rounded-lg flex items-center justify-center text-[8px] font-black uppercase border transition-all",
                                  (algo.code[lang as keyof typeof algo.code]?.functionCode || algo.code[lang as keyof typeof algo.code]?.classCode)
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                                    : "bg-slate-800/50 border-slate-700/50 text-slate-600"
                                )}
                                title={lang}
                                whileHover={{ scale: 1.2, y: -2 }}
                              >
                                {lang.charAt(0)}
                              </motion.div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden lg:table-cell">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black text-slate-600 uppercase w-5">Time:</span>
                              <span className={cn("text-xs font-mono font-bold", 
                                algo.complexity.timeRating === 'good' ? "text-emerald-400" :
                                algo.complexity.timeRating === 'average' ? "text-amber-400" :
                                "text-rose-400"
                              )}>{algo.complexity.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black text-slate-600 uppercase w-5">Space:</span>
                              <span className="text-xs font-mono text-slate-500">{algo.complexity.space}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <motion.div className="flex" whileHover={{ scale: 1.1 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onSelect(algo.id)}
                                className="w-10 h-10 hover:bg-indigo-600 hover:text-white"
                              >
                                <ExternalLink size={18} />
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/forge/${algo.id}`)}
                                className="w-10 h-10 hover:bg-amber-600 hover:text-white"
                              >
                                <Edit3 size={18} />
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(algo.id)}
                                className="w-10 h-10 hover:bg-rose-600 hover:text-white"
                              >
                                <Trash2 size={18} />
                              </Button>
                            </motion.div>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredAlgos.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-16 text-center"
            >
              <motion.div 
                className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700"
                animate={{ rotate: [0, 360, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Search size={40} />
              </motion.div>
              <h3 className="text-2xl font-black text-white mb-2">No Nodes Found</h3>
              <p className="text-sm text-slate-500 mb-6">Adjust your filters or search query.</p>
              <Button onClick={() => { setSearchQuery(''); setFilterCategory('All'); }}>
                Clear Filters
              </Button>
            </motion.div>
          )}
        </Card>
      </section>
    </div>
  );
}
