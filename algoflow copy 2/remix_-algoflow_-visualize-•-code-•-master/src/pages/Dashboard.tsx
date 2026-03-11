import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
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
  BarChart3
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
  CartesianGrid
} from 'recharts';

interface DashboardProps {
  algorithms: Algorithm[];
  onDelete: (id: string) => void;
  onAdd: () => void;
  onSelect: (id: string) => void;
  onImport: (data: Algorithm[]) => void;
}

export default function Dashboard({ algorithms, onDelete, onAdd, onSelect, onImport }: DashboardProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
    return [...algorithms].reverse().slice(0, 4);
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

  const stats = [
    { label: 'Neural Nodes', value: algorithms.length, icon: Cpu, color: 'text-indigo-400', bg: 'bg-indigo-500/10', glow: 'shadow-indigo-500/20' },
    { label: 'Data Clusters', value: categories.length - 1, icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20' },
    { label: 'Active Matrix', value: totalImplementations, icon: Activity, color: 'text-rose-400', bg: 'bg-rose-500/10', glow: 'shadow-rose-500/20' },
    { label: 'Global Sync', value: '99.9%', icon: Globe, color: 'text-amber-400', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/20' },
  ];

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    algorithms.forEach(a => {
      const time = a.complexity.time;
      counts[time] = (counts[time] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [algorithms]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

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
    if (missing.length === 0) return { label: 'Complete', color: 'text-emerald-500', icon: CheckCircle2 };
    if (missing.length < 4) return { label: 'Partial', color: 'text-amber-500', icon: AlertCircle };
    return { label: 'Empty', color: 'text-rose-500', icon: AlertCircle };
  };

  return (
    <div className="space-y-12 pb-20 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-500 font-black text-xs uppercase tracking-[0.3em]">
            <Shield size={14} />
            Secure Admin Access
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white">
            Command <span className="text-indigo-500">Center</span>
          </h1>
          <p className="text-slate-500 max-w-xl text-base sm:text-lg leading-relaxed">
            Orchestrate your algorithm ecosystem. Monitor real-time performance and expand the neural network.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
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
          <Button 
            onClick={onAdd}
            size="lg"
            className="w-full md:w-auto px-10 py-6 text-lg rounded-[1.5rem] shadow-2xl shadow-indigo-500/40"
          >
            <Plus size={22} className="mr-2" />
            Initialize Node
          </Button>
        </div>
      </header>

      {/* Stats & Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
        <div className="md:col-span-2 xl:col-span-1 2xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <Card
              key={stat.label}
              variant="glass"
              className={cn(
                "p-6 sm:p-8 relative group hover:border-slate-700 transition-all shadow-xl",
                stat.glow
              )}
            >
              <div className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon size={24} className="sm:size-[28px]" />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white">{stat.value}</h3>
              </div>
            </Card>
          ))}
        </div>

        <Card variant="glass" className="p-6 sm:p-8 md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <BarChart3 size={20} />
            </div>
            <h3 className="text-lg font-black tracking-tight text-white uppercase">Complexity</h3>
          </div>
          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {chartData.slice(0, 3).map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[10px] font-bold text-slate-400 truncate w-20">{entry.name}</span>
                </div>
                <span className="text-[10px] font-black text-white">{entry.value} nodes</span>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="glass" className="p-6 sm:p-8 md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Clock size={20} />
            </div>
            <h3 className="text-lg font-black tracking-tight text-white uppercase">Recent Nodes</h3>
          </div>
          <div className="space-y-4">
            {recentActivity.map((algo) => (
              <div key={algo.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/50 group cursor-pointer hover:border-indigo-500/50 transition-all" onClick={() => onSelect(algo.id)}>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-xs font-black">
                  {algo.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{algo.name}</p>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{algo.category}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Algorithm Management Table */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-slate-800/50 to-emerald-500/10 rounded-[2rem] sm:rounded-[3rem] blur-xl opacity-50" />
        <Card variant="glass" className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl p-0">
          <div className="p-4 sm:p-6 lg:p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1 uppercase">Neural Inventory</h2>
                <p className="text-xs sm:text-sm text-slate-500">Manage and deploy algorithms across the platform.</p>
              </div>
              {selectedIds.length > 0 && (
                <Button
                  variant="danger"
                  onClick={handleBulkDelete}
                  className="shadow-lg shadow-rose-500/20 w-full sm:w-auto"
                >
                  <Trash2 size={18} className="mr-2" />
                  Purge {selectedIds.length} Nodes
                </Button>
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
          
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-4 md:px-6 lg:px-10 py-6 w-10">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.length === filteredAlgos.length && filteredAlgos.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                    />
                  </th>
                  <th className="px-4 md:px-6 lg:px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Designation</th>
                  <th className="px-4 md:px-6 lg:px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden xl:table-cell">Health</th>
                  <th className="px-4 md:px-6 lg:px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden 2xl:table-cell">Matrix Support</th>
                  <th className="px-4 md:px-6 lg:px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hidden 2xl:table-cell">Complexity</th>
                  <th className="px-4 md:px-6 lg:px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAlgos.map((algo) => {
                  const health = getHealthStatus(algo);
                  const isSelected = selectedIds.includes(algo.id);
                  return (
                    <tr key={algo.id} className={cn("hover:bg-indigo-500/[0.02] transition-colors group", isSelected && "bg-indigo-500/[0.05]")}>
                      <td className="px-4 md:px-6 lg:px-10 py-8">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelect(algo.id)}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                        />
                      </td>
                      <td className="px-4 md:px-6 lg:px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-lg shadow-lg">
                            {algo.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-black text-base lg:text-lg text-white group-hover:text-indigo-400 transition-colors truncate">{algo.name}</p>
                            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest truncate">{algo.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 lg:px-10 py-8 hidden xl:table-cell">
                        <div className={cn("flex items-center gap-2 font-bold text-xs", health.color)}>
                          <health.icon size={16} />
                          {health.label}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 lg:px-10 py-8 hidden 2xl:table-cell">
                        <div className="flex items-center gap-1.5">
                          {Object.keys(algo.code).map(lang => (
                            <div 
                              key={lang} 
                              className={cn(
                                "w-6 h-6 rounded-lg flex items-center justify-center text-[8px] font-black uppercase border transition-all",
                                (algo.code[lang as keyof typeof algo.code]?.functionCode || algo.code[lang as keyof typeof algo.code]?.classCode || algo.code[lang as keyof typeof algo.code]?.recursiveCode) 
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                                  : "bg-slate-800/50 border-slate-700/50 text-slate-600"
                              )}
                              title={lang}
                            >
                              {lang.charAt(0)}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 lg:px-10 py-8 hidden 2xl:table-cell">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-600 uppercase w-4">T:</span>
                            <span className="text-xs font-mono text-indigo-400">{algo.complexity.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-600 uppercase w-4">S:</span>
                            <span className="text-xs font-mono text-slate-500">{algo.complexity.space}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 lg:px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-2 lg:gap-3">
                          <Button 
                            variant="ghost"
                            size="icon"
                            onClick={() => onSelect(algo.id)}
                            className="w-9 h-9 lg:w-10 lg:h-10 hover:bg-indigo-600 hover:text-white"
                          >
                            <ExternalLink size={16} />
                          </Button>
                          <Button 
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/forge/${algo.id}`)}
                            className="w-9 h-9 lg:w-10 lg:h-10 hover:bg-amber-600 hover:text-white"
                          >
                            <Edit3 size={16} />
                          </Button>
                          <Button 
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(algo.id)}
                            className="w-9 h-9 lg:w-10 lg:h-10 hover:bg-rose-600 hover:text-white"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-white/5">
            {filteredAlgos.map((algo) => {
              const health = getHealthStatus(algo);
              const isSelected = selectedIds.includes(algo.id);
              return (
                <div key={algo.id} className={cn("p-6 space-y-4", isSelected && "bg-indigo-500/[0.05]")}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelect(algo.id)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                      />
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-lg">
                        {algo.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-sm text-white truncate">{algo.name}</p>
                        <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest truncate">{algo.category}</p>
                      </div>
                    </div>
                    <div className={cn("flex items-center gap-1.5 font-bold text-[10px] flex-shrink-0", health.color)}>
                      <health.icon size={12} />
                      {health.label}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-slate-600 uppercase">Time:</span>
                        <span className="text-[10px] font-mono text-indigo-400">{algo.complexity.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-slate-600 uppercase">Space:</span>
                        <span className="text-[10px] font-mono text-slate-500">{algo.complexity.space}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onSelect(algo.id)} className="w-8 h-8">
                        <ExternalLink size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/forge/${algo.id}`)} className="w-8 h-8">
                        <Edit3 size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(algo.id)} className="w-8 h-8">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAlgos.length === 0 && (
            <div className="p-12 sm:p-20 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
                <Search size={32} className="sm:size-[40px]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">No Nodes Found</h3>
              <p className="text-xs sm:text-sm text-slate-500">Adjust your filters or designation search.</p>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
