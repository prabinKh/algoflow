import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink,
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
  X,
  Layers
} from 'lucide-react';
import { Algorithm, Language } from '../types';
import { cn } from '../lib/utils';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip
} from 'recharts';

interface DashboardProps {
  algorithms: Algorithm[];
  categories: string[];
  onDelete: (id: string) => void;
  onAdd: () => void;
  onAddCategory: (name: string, icon: string) => void;
  onEdit: (algo: Algorithm) => void;
  onSelect: (id: string) => void;
  onImport: (data: Algorithm[]) => void;
}

export default function Dashboard({ algorithms, categories: existingCategories, onDelete, onAdd, onAddCategory, onEdit, onSelect, onImport }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'Box' });
  const [categorySearch, setCategorySearch] = useState('');

  const filteredExistingCategories = useMemo(() => 
    existingCategories.filter(c => c !== 'All' && c.toLowerCase().includes(categorySearch.toLowerCase())),
    [existingCategories, categorySearch]
  );

  const categories = useMemo(() => 
    ['All', ...existingCategories.filter(c => c !== 'All')],
    [existingCategories]
  );

  const filteredAlgos = useMemo(() => {
    return algorithms.filter(algo => {
      const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          algo.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          algo.category.toLowerCase().includes(searchQuery.toLowerCase());
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

  const stats = [
    { label: 'Neural Nodes', value: algorithms.length, icon: Cpu, color: 'text-indigo-400', bg: 'bg-indigo-500/10', glow: 'shadow-indigo-500/20' },
    { label: 'Data Clusters', value: categories.length - 1, icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20' },
    { label: 'Active Matrix', value: '1,284', icon: Activity, color: 'text-rose-400', bg: 'bg-rose-500/10', glow: 'shadow-rose-500/20' },
    { label: 'Global Sync', value: '99.9%', icon: Globe, color: 'text-amber-400', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/20' },
  ];

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    algorithms.forEach(a => {
      const time = a.complexity?.time || 'Unknown';
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
    const missing = langs.filter(l => !algo.code[l]?.iterative);
    if (missing.length === 0) return { label: 'Complete', color: 'text-emerald-500', icon: CheckCircle2 };
    if (missing.length < 4) return { label: 'Partial', color: 'text-amber-500', icon: AlertCircle };
    return { label: 'Empty', color: 'text-rose-500', icon: AlertCircle };
  };

  return (
    <div className="space-y-12 pb-20 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />
      
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-500 font-black text-xs uppercase tracking-[0.3em]">
            <Shield size={14} />
            Secure Admin Access
          </div>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-white">
            Command <span className="text-indigo-500">Center</span>
          </h1>
          <p className="text-slate-500 max-w-xl text-lg leading-relaxed">
            Orchestrate your algorithm ecosystem. Monitor real-time performance and expand the neural network.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <label className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-2xl font-bold border border-slate-800 transition-all">
            <Upload size={18} />
            Import
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-2xl font-bold border border-slate-800 transition-all"
          >
            <Download size={18} />
            Export
          </button>
          <button 
            onClick={() => setIsAddCategoryModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-2xl font-bold border border-slate-800 transition-all"
          >
            <Plus size={18} />
            Add Classification
          </button>
          <button 
            onClick={onAdd}
            className="group relative flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black tracking-tight transition-all shadow-2xl shadow-indigo-500/40 active:scale-95 overflow-hidden"
          >
            <Plus size={22} />
            Initialize Node
          </button>
        </div>
      </header>

      {/* Stats & Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-8 rounded-[2.5rem] bg-slate-900/50 border border-slate-800/50 backdrop-blur-md relative group hover:border-slate-700 transition-all shadow-xl",
                stat.glow
              )}
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon size={28} />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-4xl font-black tracking-tight text-white">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-slate-800/50 backdrop-blur-md shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <BarChart3 size={20} />
            </div>
            <h3 className="text-lg font-black tracking-tight text-white">Complexity</h3>
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
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-slate-800/50 backdrop-blur-md shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Clock size={20} />
            </div>
            <h3 className="text-lg font-black tracking-tight text-white">Recent Nodes</h3>
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
        </motion.div>
      </div>

      {/* Algorithm Management Table */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-slate-800/50 to-emerald-500/10 rounded-[3rem] blur-xl opacity-50" />
        <div className="relative bg-slate-950/80 border border-slate-800/50 backdrop-blur-xl rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-slate-800/50 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-white mb-1">Neural Inventory</h2>
                <p className="text-sm text-slate-500">Manage and deploy algorithms across the platform.</p>
              </div>
              {selectedIds.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold shadow-lg shadow-rose-500/20 transition-all"
                >
                  <Trash2 size={18} />
                  Purge {selectedIds.length} Nodes
                </motion.button>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text"
                  placeholder="Search name or classification..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white"
                />
              </div>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full sm:w-48 bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white appearance-none"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-900/30">
                  <th className="px-10 py-6 w-10">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.length === filteredAlgos.length && filteredAlgos.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                    />
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Designation</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Health</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Matrix Support</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Complexity</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {filteredAlgos.map((algo) => {
                  const health = getHealthStatus(algo);
                  const isSelected = selectedIds.includes(algo.id);
                  return (
                    <tr key={algo.id} className={cn("hover:bg-indigo-500/[0.02] transition-colors group", isSelected && "bg-indigo-500/[0.05]")}>
                      <td className="px-10 py-8">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelect(algo.id)}
                          className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                        />
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-lg shadow-lg">
                            {algo.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-lg text-white group-hover:text-indigo-400 transition-colors">{algo.name}</p>
                            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">{algo.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className={cn("flex items-center gap-2 font-bold text-xs", health.color)}>
                          <health.icon size={16} />
                          {health.label}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-1.5">
                          {Object.keys(algo.code).map(lang => (
                            <div 
                              key={lang} 
                              className={cn(
                                "w-6 h-6 rounded-lg flex items-center justify-center text-[8px] font-black uppercase border transition-all",
                                algo.code[lang as keyof typeof algo.code]?.iterative 
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
                      <td className="px-10 py-8">
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
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => onEdit(algo)}
                            className="w-10 h-10 flex items-center justify-center bg-slate-900 hover:bg-indigo-600 rounded-xl text-slate-500 hover:text-white transition-all border border-slate-800 hover:border-indigo-500 shadow-lg"
                            title="Edit Node"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => onSelect(algo.id)}
                            className="w-10 h-10 flex items-center justify-center bg-slate-900 hover:bg-indigo-600 rounded-xl text-slate-500 hover:text-white transition-all border border-slate-800 hover:border-indigo-500 shadow-lg"
                            title="Deploy Node"
                          >
                            <ExternalLink size={18} />
                          </button>
                          <button 
                            onClick={() => onDelete(algo.id)}
                            className="w-10 h-10 flex items-center justify-center bg-slate-900 hover:bg-rose-600 rounded-xl text-slate-500 hover:text-white transition-all border border-slate-800 hover:border-rose-500 shadow-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredAlgos.length === 0 && (
              <div className="p-20 text-center">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
                  <Search size={40} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">No Nodes Found</h3>
                <p className="text-slate-500">Adjust your filters or designation search.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Add Category Modal */}
      <AnimatePresence>
        {isAddCategoryModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-950 border border-slate-800/50 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-black text-white mb-6">New Classification</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Classification Name</label>
                  <input 
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="e.g. Machine Learning"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Existing Classifications</label>
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600" size={10} />
                      <input 
                        type="text"
                        placeholder="Search..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg py-1 pl-6 pr-2 text-[10px] focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white w-24"
                      />
                    </div>
                  </div>
                  <div className="max-h-32 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                    {filteredExistingCategories.map(cat => (
                      <div key={cat} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400">
                        <Layers size={12} className="text-indigo-500" />
                        {cat}
                      </div>
                    ))}
                    {filteredExistingCategories.length === 0 && (
                      <div className="text-center py-4 text-[10px] text-slate-600 uppercase tracking-widest">
                        No matches found
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-4">
                  <button 
                    onClick={() => setIsAddCategoryModalOpen(false)}
                    className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (newCategory.name) {
                        onAddCategory(newCategory.name, newCategory.icon);
                        setIsAddCategoryModalOpen(false);
                        setNewCategory({ name: '', icon: 'Box' });
                      }
                    }}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-black transition-all"
                  >
                    Create Classification
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
