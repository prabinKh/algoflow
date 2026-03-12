import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus, 
  Terminal, 
  Info, 
  Sparkles, 
  Clock, 
  aaky,
  Database, 
  Target, 
  Lightbulb, 
  History,
  Cpu,
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
  FileText,
  FileVideo,
  Image as ImageIcon,
  File,
  Upload,
  Trash2,
  ChevronLeft,
  Save,
  Wand2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { Algorithm, Language, Asset, Question, CodeSnippet } from '../types';
import { cn } from '../lib/utils';
import { useNavigate, useParams } from 'react-router-dom';
import AlgorithmViewer from '../components/AlgorithmViewer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { DEMO_ALGORITHMS } from '../data/demos';

const AVAILABLE_ICONS = [
  { name: 'Terminal', icon: Terminal },
  { name: 'Cpu', icon: Cpu },
  { name: 'Database', icon: Database },
  { name: 'Globe', icon: Globe },
  { name: 'Zap', icon: Zap },
  { name: 'Shield', icon: Shield },
  { name: 'Activity', icon: Activity },
  { name: 'Box', icon: Box },
  { name: 'Layers', icon: Layers },
  { name: 'Search', icon: Search },
  { name: 'Share2', icon: Share2 },
  { name: 'ListOrdered', icon: ListOrdered },
  { name: 'Braces', icon: Braces },
  { name: 'Sparkles', icon: Sparkles },
];

import { GoogleGenAI, Type } from "@google/genai";
import { apiFetch, createAiClient, getApiConfig, saveApiConfig } from '../lib/api';

export default function ForgeAlgorithm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [activeLang, setActiveLang] = useState<Language>('python');
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPreview, setShowPreview] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const [apiConfig, setApiConfig] = useState(getApiConfig());

  const [formData, setFormData] = useState<Partial<Algorithm>>({
    name: '',
    category: '',
    description: '',
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
      timeRating: 'average',
      spaceRating: 'good',
    },
    code: {
      python: { classCode: '', functionCode: '', recursiveCode: '' },
      cpp: { classCode: '', functionCode: '', recursiveCode: '' },
      c: { classCode: '', functionCode: '', recursiveCode: '' },
      rust: { classCode: '', functionCode: '', recursiveCode: '' },
    },
    explanation: {
      problem: '',
      intuition: '',
      walkthrough: '',
      whenToUse: '',
    },
    assets: [],
    questions: []
  });

  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [isQuestionGenerating, setIsQuestionGenerating] = useState<string | null>(null);

  const loadDemo = (demo: Partial<Algorithm>) => {
    setFormData(prev => ({
      ...prev,
      ...demo,
      code: {
        ...prev.code,
        ...demo.code
      }
    }));
  };

  const generateCodeQuestion = async (lang: Language) => {
    if (!formData.name || (!formData.code?.[lang]?.functionCode && !formData.code?.[lang]?.classCode)) {
      alert(`Please enter algorithm name and ${lang} code first.`);
      return;
    }

    const qId = Math.random().toString(36).substr(2, 9);
    setIsQuestionGenerating(qId);
    try {
      const ai = createAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a technical question for the algorithm "${formData.name}" where the answer is a specific code snippet in ${lang}.
        The question should ask about a specific part of the implementation or a common variation.
        
        The provided code is:
        ${formData.code[lang].functionCode || formData.code[lang].classCode}

        Return the result in JSON format matching this schema:
        {
          "text": string,
          "answer": string (the code snippet),
          "explanation": string
        }`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              answer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["text", "answer", "explanation"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      const newQuestion: Question = {
        id: qId,
        text: result.text,
        answer: result.answer,
        language: lang,
        explanation: result.explanation
      };

      setFormData(prev => ({
        ...prev,
        questions: [...(prev.questions || []), newQuestion]
      }));
    } catch (error) {
      console.error('Error generating question:', error);
      alert('Failed to generate question.');
    } finally {
      setIsQuestionGenerating(null);
    }
  };

  const handleActivateAssistant = async () => {
    if (!formData.name) {
      alert('Please enter an algorithm name first.');
      return;
    }

    setIsAssistantLoading(true);
    try {
      const ai = createAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate detailed information for the algorithm "${formData.name}". 
        Provide a description, complexity (time/space and ratings), code snippets in Python, C++, C, and Rust, 
        and a detailed explanation (problem, intuition, walkthrough, when to use).
        For each language, provide three versions of the code: "classCode" (OOP implementation), "functionCode" (procedural implementation), and "recursiveCode" (recursive implementation).
        Also provide a realistic "outcome" (what the code would print/return) and a "runtime" (e.g. "12ms").
        
        Return the result in JSON format matching this schema:
        {
          "description": string,
          "complexity": { "time": string, "space": string, "timeRating": "good"|"average"|"bad", "spaceRating": "good"|"average"|"bad" },
          "code": { 
            "python": { "classCode": string, "functionCode": string, "recursiveCode": string, "outcome": string, "runtime": string }, 
            "cpp": { "classCode": string, "functionCode": string, "recursiveCode": string, "outcome": string, "runtime": string }, 
            "c": { "classCode": string, "functionCode": string, "recursiveCode": string, "outcome": string, "runtime": string }, 
            "rust": { "classCode": string, "functionCode": string, "recursiveCode": string, "outcome": string, "runtime": string } 
          },
          "explanation": { "problem": string, "intuition": string, "walkthrough": string, "whenToUse": string }
        }`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              complexity: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  space: { type: Type.STRING },
                  timeRating: { type: Type.STRING, enum: ["good", "average", "bad"] },
                  spaceRating: { type: Type.STRING, enum: ["good", "average", "bad"] }
                },
                required: ["time", "space", "timeRating", "spaceRating"]
              },
              code: {
                type: Type.OBJECT,
                properties: {
                  python: { 
                    type: Type.OBJECT, 
                    properties: { 
                      classCode: { type: Type.STRING }, 
                      functionCode: { type: Type.STRING }, 
                      recursiveCode: { type: Type.STRING }, 
                      outcome: { type: Type.STRING }, 
                      runtime: { type: Type.STRING } 
                    }, 
                    required: ["classCode", "functionCode", "recursiveCode", "outcome", "runtime"] 
                  },
                  cpp: { 
                    type: Type.OBJECT, 
                    properties: { 
                      classCode: { type: Type.STRING }, 
                      functionCode: { type: Type.STRING }, 
                      recursiveCode: { type: Type.STRING }, 
                      outcome: { type: Type.STRING }, 
                      runtime: { type: Type.STRING } 
                    }, 
                    required: ["classCode", "functionCode", "recursiveCode", "outcome", "runtime"] 
                  },
                  c: { 
                    type: Type.OBJECT, 
                    properties: { 
                      classCode: { type: Type.STRING }, 
                      functionCode: { type: Type.STRING }, 
                      recursiveCode: { type: Type.STRING }, 
                      outcome: { type: Type.STRING }, 
                      runtime: { type: Type.STRING } 
                    }, 
                    required: ["classCode", "functionCode", "recursiveCode", "outcome", "runtime"] 
                  },
                  rust: { 
                    type: Type.OBJECT, 
                    properties: { 
                      classCode: { type: Type.STRING }, 
                      functionCode: { type: Type.STRING }, 
                      recursiveCode: { type: Type.STRING }, 
                      outcome: { type: Type.STRING }, 
                      runtime: { type: Type.STRING } 
                    }, 
                    required: ["classCode", "functionCode", "recursiveCode", "outcome", "runtime"] 
                  }
                },
                required: ["python", "cpp", "c", "rust"]
              },
              explanation: {
                type: Type.OBJECT,
                properties: {
                  problem: { type: Type.STRING },
                  intuition: { type: Type.STRING },
                  walkthrough: { type: Type.STRING },
                  whenToUse: { type: Type.STRING }
                },
                required: ["problem", "intuition", "walkthrough", "whenToUse"]
              }
            },
            required: ["description", "complexity", "code", "explanation"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      setFormData(prev => ({
        ...prev,
        description: result.description,
        complexity: result.complexity,
        code: result.code,
        explanation: result.explanation
      }));
    } catch (error) {
      console.error('Error activating assistant:', error);
      alert('Failed to activate assistant. Please check your API key.');
    } finally {
      setIsAssistantLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const catRes = await apiFetch('/api/categories/');
        const cats = await catRes.json();
        setCategories(cats.map((c: any) => c.name));
        
        if (!formData.category && cats.length > 0) {
          setFormData(prev => ({ ...prev, category: cats[0].name }));
        }

        if (isEditing) {
          const algoRes = await apiFetch(`/api/algorithms/${id}/`);
          if (algoRes.ok) {
            const algo = await algoRes.json();
            setFormData(algo);
          } else {
            navigate('/forge');
          }
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [id, isEditing, navigate]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: Asset['type']) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newAsset: Asset = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type,
        data: event.target?.result as string
      };
      setFormData(prev => ({
        ...prev,
        assets: [...(prev.assets || []), newAsset]
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeAsset = (assetId: string) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets?.filter(a => a.id !== assetId)
    }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      answer: '',
      language: 'python',
      explanation: ''
    };
    setFormData(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions?.map(q => q.id === id ? { ...q, ...updates } : q)
    }));
  };

  const removeQuestion = (id: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions?.filter(q => q.id !== id)
    }));
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories(prev => [...prev, newCategory]);
      setFormData(prev => ({ ...prev, category: newCategory }));
      setNewCategory('');
      setIsAddingCategory(false);
    }
  };

  const updateCodeSnippet = (lang: Language, updates: Partial<CodeSnippet>) => {
    setFormData(prev => ({
      ...prev,
      code: {
        ...prev.code!,
        [lang]: { ...prev.code![lang], ...updates }
      }
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    const algoData: Algorithm = {
      ...formData as Algorithm,
      id: isEditing ? id : (formData.name?.toLowerCase().replace(/\s+/g, '-') || Date.now().toString()),
    };

    try {
      const response = await apiFetch(isEditing ? `/api/algorithms/${id}/` : '/api/algorithms/', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(algoData)
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => {
          navigate(`/algorithm/${algoData.id}`);
        }, 1500);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error saving algorithm:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 py-4 sm:py-6">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
                  {isEditing ? 'Refine Algorithm' : 'Forge New Node'}
                </h1>
                <span className="hidden xs:inline px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20">
                  {isEditing ? 'Revision' : 'Creation'}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-1">
                Constructing high-fidelity neural signatures.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2">Demo:</span>
              {DEMO_ALGORITHMS.map((demo, idx) => (
                <button
                  key={idx}
                  onClick={() => loadDemo(demo)}
                  className="w-7 h-7 flex items-center justify-center text-[10px] font-black bg-indigo-600/10 hover:bg-indigo-600/30 text-indigo-400 rounded-lg transition-all border border-indigo-500/10"
                  title={`Load ${demo.name} Demo`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <Button 
              variant="ghost"
              onClick={() => setShowPreview(!showPreview)}
              className={cn(
                "flex-1 sm:flex-none flex items-center justify-center gap-2 px-3",
                showPreview && "bg-indigo-600/20 text-indigo-400"
              )}
            >
              {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
              <span className="text-xs sm:text-sm">{showPreview ? 'Hide' : 'Preview'}</span>
            </Button>
            <Button 
              onClick={() => handleSubmit()}
              disabled={isSaving || !formData.name || !formData.category}
              isLoading={isSaving}
              variant={saveStatus === 'success' ? 'success' : saveStatus === 'error' ? 'danger' : 'primary'}
              className="flex-1 sm:flex-none min-w-[100px] sm:min-w-[140px] px-3"
            >
              {!isSaving && (
                saveStatus === 'success' ? <CheckCircle2 size={18} className="mr-2" /> : 
                saveStatus === 'error' ? <AlertCircle size={18} className="mr-2" /> : 
                <Save size={18} className="mr-2" />
              )}
              <span className="text-xs sm:text-sm">
                {saveStatus === 'success' ? 'Synced' : saveStatus === 'error' ? 'Failed' : isEditing ? 'Update' : 'Initialize'}
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-12 gap-12 transition-all duration-500"
        )}>
          {/* Left Column: Core Data (The Entry Form) */}
          <div className={cn(
            "space-y-12",
            // Hides the entire form when preview is active
            showPreview ? "hidden" : "lg:col-span-8"
          )}>
            {/* Identity Section */}
            <Card variant="glass" className="p-6 sm:p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] -z-10 group-hover:bg-indigo-600/10 transition-colors" />
              
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-white uppercase">Core Identity</h2>
                  <p className="text-xs text-slate-500">Define the unique signature of this algorithm.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input
                  label="Designation"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Dijkstra's Pathfinding"
                />
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Classification</label>
                  <div className="flex gap-2">
                    <Select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      icon={<Layers size={16} />}
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </Select>
                    <Button 
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => setIsAddingCategory(!isAddingCategory)}
                      className="w-14 h-14"
                    >
                      <Plus size={20} />
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    {isAddingCategory && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex gap-2 mt-2"
                      >
                        <Input 
                          value={newCategory}
                          onChange={e => setNewCategory(e.target.value)}
                          placeholder="New Category Name..."
                          className="py-2 text-xs"
                        />
                        <Button 
                          type="button"
                          onClick={handleAddCategory}
                          size="sm"
                        >
                          Add
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Neural Signature (Icon)</label>
                <div className="flex flex-wrap gap-3">
                  {AVAILABLE_ICONS.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setFormData({...formData, icon: name})}
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all border",
                        formData.icon === name 
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/40 scale-110" 
                          : "bg-white/5 border-white/10 text-slate-600 hover:border-white/20 hover:text-slate-300"
                      )}
                      title={name}
                    >
                      <Icon size={20} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Mission Briefing</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Provide a high-level overview of the algorithm's purpose..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32 resize-none text-white placeholder:text-slate-700 leading-relaxed"
                />
              </div>
            </Card>

            {/* Knowledge Base Section */}
            <Card variant="glass" className="p-6 sm:p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-white uppercase">Knowledge Base</h2>
                  <p className="text-xs text-slate-500">The deep logic and intuition behind the code.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                      <Target size={14} className="text-rose-500" /> Objective
                    </label>
                    <textarea 
                      value={formData.explanation?.problem}
                      onChange={e => setFormData({...formData, explanation: {...formData.explanation!, problem: e.target.value}})}
                      placeholder="What specific problem does this algorithm solve?"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none text-white placeholder:text-slate-700"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                      <Lightbulb size={14} className="text-amber-500" /> The 'Aha!' Moment
                    </label>
                    <textarea 
                      value={formData.explanation?.intuition}
                      onChange={e => setFormData({...formData, explanation: {...formData.explanation!, intuition: e.target.value}})}
                      placeholder="Explain the intuition in simple terms..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none text-white placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <History size={14} className="text-indigo-500" /> Execution Sequence
                  </label>
                  <div className="relative h-full">
                    <textarea 
                      value={formData.explanation?.walkthrough}
                      onChange={e => setFormData({...formData, explanation: {...formData.explanation!, walkthrough: e.target.value}})}
                      placeholder="Step-by-step walkthrough of the logic..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] px-8 py-8 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-[232px] resize-none text-white placeholder:text-slate-700 leading-relaxed"
                    />
                    <div className="absolute left-4 top-8 bottom-8 w-px bg-gradient-to-b from-indigo-500/30 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Source Code Section */}
            <Card variant="glass" className="p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <Terminal size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-white uppercase">Source Matrix</h2>
                    <p className="text-xs text-slate-500">Multi-language implementations.</p>
                  </div>
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
                  {(['python', 'c', 'cpp', 'rust'] as Language[]).map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setActiveLang(lang)}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        activeLang === lang 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                          : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      {lang === 'cpp' ? 'C++' : lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Braces size={14} className="text-indigo-400" /> Class Implementation
                    </label>
                    <textarea 
                      value={formData.code?.[activeLang]?.classCode || ''}
                      onChange={e => updateCodeSnippet(activeLang, { classCode: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-48 resize-none text-emerald-400 custom-scrollbar leading-relaxed"
                      placeholder={`class ${formData.name?.replace(/\s+/g, '')} { ... }`}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Cpu size={14} className="text-emerald-400" /> Function Implementation
                    </label>
                    <textarea 
                      value={formData.code?.[activeLang]?.functionCode || ''}
                      onChange={e => updateCodeSnippet(activeLang, { functionCode: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-48 resize-none text-emerald-400 custom-scrollbar leading-relaxed"
                      placeholder={`function solve() { ... }`}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <History size={14} className="text-amber-400" /> Recursive Implementation
                    </label>
                    <textarea 
                      value={formData.code?.[activeLang]?.recursiveCode || ''}
                      onChange={e => updateCodeSnippet(activeLang, { recursiveCode: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-48 resize-none text-emerald-400 custom-scrollbar leading-relaxed"
                      placeholder={`function recursiveSolve() { ... }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Terminal size={14} className="text-indigo-400" /> Expected Outcome
                    </label>
                    <textarea 
                      value={formData.code?.[activeLang]?.outcome || ''}
                      onChange={e => updateCodeSnippet(activeLang, { outcome: e.target.value })}
                      placeholder="What is the expected result of this code?"
                      className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none text-white placeholder:text-slate-700"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Clock size={14} className="text-amber-400" /> Expected Runtime
                    </label>
                    <Input 
                      value={formData.code?.[activeLang]?.runtime || ''}
                      onChange={e => updateCodeSnippet(activeLang, { runtime: e.target.value })}
                      placeholder="e.g. 12ms"
                      icon={<Zap size={16} />}
                      className="py-4"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Assessment Section */}
            <Card variant="glass" className="p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <HelpCircle size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-white uppercase">Assessment Matrix</h2>
                    <p className="text-xs text-slate-500">Add interactive questions to test knowledge.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    {(['python', 'cpp', 'rust'] as Language[]).map(lang => (
                      <button
                        key={lang}
                        onClick={() => generateCodeQuestion(lang)}
                        disabled={!!isQuestionGenerating}
                        className="px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 hover:bg-white/5 transition-all flex items-center gap-2"
                      >
                        <Wand2 size={12} />
                        {lang === 'cpp' ? 'C++' : lang} Quiz
                      </button>
                    ))}
                  </div>
                  <Button 
                    type="button"
                    onClick={addQuestion}
                    className="w-full sm:w-auto"
                  >
                    <Plus size={16} className="mr-2" /> Add Question
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {formData.questions?.map((question, qIndex) => (
                  <motion.div 
                    key={question.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 relative group"
                  >
                    <button 
                      onClick={() => removeQuestion(question.id)}
                      className="absolute top-4 right-4 p-2 text-slate-600 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-[8px]">{qIndex + 1}</span>
                          Question Text
                        </label>
                        <textarea 
                          value={question.text}
                          onChange={e => updateQuestion(question.id, { text: e.target.value })}
                          placeholder="What is the core logic for...?"
                          className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Neural Answer (Code)</label>
                          <textarea 
                            value={question.answer}
                            onChange={e => updateQuestion(question.id, { answer: e.target.value })}
                            placeholder="Enter the code answer..."
                            className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-48 resize-none text-emerald-400"
                          />
                        </div>
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Language</label>
                            <select 
                              value={question.language}
                              onChange={e => updateQuestion(question.id, { language: e.target.value as Language })}
                              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="python">Python</option>
                              <option value="cpp">C++</option>
                              <option value="c">C</option>
                              <option value="rust">Rust</option>
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Explanation (Optional)</label>
                            <textarea 
                              value={question.explanation}
                              onChange={e => updateQuestion(question.id, { explanation: e.target.value })}
                              placeholder="Explain why this is the correct logic..."
                              className="w-full bg-black border border-white/10 rounded-2xl px-6 py-3 text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 resize-none text-slate-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isQuestionGenerating && (
                  <div className="p-12 text-center border-2 border-dashed border-indigo-500/20 rounded-[2rem] animate-pulse">
                    <Wand2 size={32} className="mx-auto mb-4 text-indigo-500" />
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Forging Neural Question...</p>
                  </div>
                )}

                {(!formData.questions || formData.questions.length === 0) && !isQuestionGenerating && (
                  <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-700 mx-auto mb-4">
                      <MessageSquare size={24} />
                    </div>
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">No Questions Defined</p>
                    <p className="text-[10px] text-slate-700 mt-1">Add interactive assessments or use AI Forge to generate code quizzes.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Meta & Assets or Preview */}
          <div className={cn(
            "space-y-12",
            // Expands to full width when preview is active
            showPreview ? "lg:col-span-12" : "lg:col-span-4"
          )}>
            {showPreview ? (
              <div className="sticky top-32 min-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar pr-2 pb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <Eye size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight text-white uppercase">Live Matrix</h2>
                    <p className="text-[10px] text-slate-500">Real-time neural rendering.</p>
                  </div>
                </div>
                <div className="bg-slate-950 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative group/preview">
                  <AlgorithmViewer 
                    algorithm={formData as Algorithm} 
                    onClose={() => setShowPreview(false)} 
                  />
                </div>
              </div>
            ) : (
              <>
                {/* AI Forge Section */}
                <Card variant="glass" className="p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[40px] -z-10" />
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      <Wand2 size={20} />
                    </div>
                    <h2 className="text-lg font-black tracking-tight text-white uppercase">AI Forge</h2>
                  </div>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                    Let the AI Assistant generate a high-fidelity blueprint for your algorithm. 
                    Enter a name first, then activate the forge.
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={handleActivateAssistant}
                      isLoading={isAssistantLoading}
                      className="w-full"
                    >
                      {!isAssistantLoading && <Sparkles size={18} className="mr-2" />}
                      {isAssistantLoading ? 'Forging Logic...' : 'Activate AI Forge'}
                    </Button>

                    <div className="grid grid-cols-5 gap-2">
                      {DEMO_ALGORITHMS.map((demo, idx) => (
                        <button
                          key={idx}
                          onClick={() => loadDemo(demo)}
                          className="py-2 text-[10px] font-black bg-white/5 hover:bg-indigo-600/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-all border border-white/5 hover:border-indigo-500/30"
                          title={`Load ${demo.name} Demo`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                    <p className="text-[9px] text-center text-slate-600 uppercase tracking-widest font-black">Load Demo Templates</p>
                  </div>
                </Card>

                {/* API Matrix Section */}
                <Card variant="glass" className="p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[40px] -z-10" />
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      <Globe size={20} />
                    </div>
                    <h2 className="text-lg font-black tracking-tight text-white uppercase">API Matrix</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Forge API (Gemini Key)</label>
                      <div className="relative">
                        <input 
                          type="password"
                          value={apiConfig.geminiKey || ''}
                          onChange={e => {
                            const newConfig = { ...apiConfig, geminiKey: e.target.value };
                            setApiConfig(newConfig);
                            saveApiConfig(newConfig);
                          }}
                          placeholder="••••••••••••••••"
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Shield size={14} className="text-slate-600" />
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-600 italic">Defaults to system key if empty.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Frontend API (Backend URL)</label>
                      <Input 
                        value={apiConfig.backendUrl || ''}
                        onChange={e => {
                          const newConfig = { ...apiConfig, backendUrl: e.target.value };
                          setApiConfig(newConfig);
                          saveApiConfig(newConfig);
                        }}
                        placeholder="e.g. https://api.example.com"
                        className="py-3 text-xs"
                      />
                      <p className="text-[9px] text-slate-600 italic">Leave empty for relative paths (/api).</p>
                    </div>
                  </div>
                </Card>

                {/* Complexity Section */}
                <Card variant="glass" className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
                      <Activity size={20} />
                    </div>
                    <h2 className="text-lg font-black tracking-tight text-white uppercase">Complexity</h2>
                  </div>

                  <div className="space-y-6">
                    <Input
                      label="Time Complexity"
                      value={formData.complexity?.time}
                      onChange={e => setFormData({...formData, complexity: {...formData.complexity!, time: e.target.value}})}
                      placeholder="O(n log n)"
                      icon={<Clock size={16} />}
                      className="font-mono text-indigo-400"
                    />
                    <Input
                      label="Space Complexity"
                      value={formData.complexity?.space}
                      onChange={e => setFormData({...formData, complexity: {...formData.complexity!, space: e.target.value}})}
                      placeholder="O(1)"
                      icon={<Database size={16} />}
                      className="font-mono text-indigo-400"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Time Rating</label>
                        <select 
                          value={formData.complexity?.timeRating}
                          onChange={e => setFormData({...formData, complexity: {...formData.complexity!, timeRating: e.target.value as any}})}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none"
                        >
                          <option value="good">Good</option>
                          <option value="average">Average</option>
                          <option value="bad">Bad</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Space Rating</label>
                        <select 
                          value={formData.complexity?.spaceRating}
                          onChange={e => setFormData({...formData, complexity: {...formData.complexity!, spaceRating: e.target.value as any}})}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none"
                        >
                          <option value="good">Good</option>
                          <option value="average">Average</option>
                          <option value="bad">Bad</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Asset Management */}
                <Card variant="glass" className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                      <Upload size={20} />
                    </div>
                    <h2 className="text-lg font-black tracking-tight text-white uppercase">Assets</h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {[
                      { type: 'pdf', icon: FileText, label: 'PDF', accept: '.pdf' },
                      { type: 'text', icon: File, label: 'Text', accept: '.txt,.md' },
                      { type: 'image', icon: ImageIcon, label: 'Image', accept: 'image/*' },
                      { type: 'video', icon: FileVideo, label: 'Video', accept: 'video/*' },
                    ].map((item) => (
                      <label key={item.type} className="cursor-pointer group">
                        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-black border border-white/10 group-hover:border-indigo-500/50 transition-all">
                          <item.icon size={18} className="text-slate-600 group-hover:text-indigo-400" />
                          <span className="text-[8px] font-black text-slate-700 group-hover:text-slate-400 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <input 
                          type="file" 
                          accept={item.accept} 
                          className="hidden" 
                          onChange={(e) => handleFileChange(e, item.type as any)} 
                        />
                      </label>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {formData.assets?.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-4 rounded-2xl bg-black border border-white/5 group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-600">
                            {asset.type === 'pdf' && <FileText size={14} />}
                            {asset.type === 'text' && <File size={14} />}
                            {asset.type === 'image' && <ImageIcon size={14} />}
                            {asset.type === 'video' && <FileVideo size={14} />}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 truncate max-w-[120px]">{asset.name}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeAsset(asset.id)}
                          className="p-2 text-slate-700 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {(!formData.assets || formData.assets.length === 0) && (
                      <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">No Assets Linked</p>
                      </div>
                    )}
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
