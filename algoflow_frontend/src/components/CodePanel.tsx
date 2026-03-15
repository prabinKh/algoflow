import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Cpu, Braces, Terminal, History, Play, Loader2, Lock, Edit3, Save, X } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Algorithm, Language, CodeSnippet } from '../types';
import { cn } from '../lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '../auth';
import { createAiClient } from '../lib/api';
import { Type } from "@google/genai";

interface CodePanelProps {
  algorithm: Algorithm;
}

export default function CodePanel({ algorithm }: CodePanelProps) {
  const { isAuthenticated } = useAuth();
  const [selectedLang, setSelectedLang] = useState<Language>('python');
  const [viewMode, setViewMode] = useState<'class' | 'function' | 'recursive'>('function');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [runtime, setRuntime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConsole, setShowConsole] = useState(false);
  const [showOutcomeEditor, setShowOutcomeEditor] = useState(false);
  const [customOutcome, setCustomOutcome] = useState('');
  const [customRuntime, setCustomRuntime] = useState('');

  const languages: { id: Language; label: string }[] = [
    { id: 'python', label: 'Python' },
    { id: 'cpp', label: 'C++' },
    { id: 'c', label: 'C' },
    { id: 'rust', label: 'Rust' }
  ];

  const codeSnippet = algorithm.code[selectedLang] || {
    classCode: '',
    functionCode: '',
    recursiveCode: '',
    outcome: '',
    runtime: ''
  };

  const getCode = () => {
    switch (viewMode) {
      case 'class': return codeSnippet.classCode || '';
      case 'function': return codeSnippet.functionCode || '';
      case 'recursive': return codeSnippet.recursiveCode || '';
      default: return codeSnippet.functionCode || '';
    }
  };

  const getOutcome = () => {
    switch (viewMode) {
      case 'class': return codeSnippet.classOutcome || codeSnippet.outcome || '';
      case 'function': return codeSnippet.functionOutcome || codeSnippet.outcome || '';
      case 'recursive': return codeSnippet.recursiveOutcome || codeSnippet.outcome || '';
      default: return codeSnippet.outcome || '';
    }
  };

  const getRuntime = () => {
    switch (viewMode) {
      case 'class': return codeSnippet.classRuntime || codeSnippet.runtime || '';
      case 'function': return codeSnippet.functionRuntime || codeSnippet.runtime || '';
      case 'recursive': return codeSnippet.recursiveRuntime || codeSnippet.runtime || '';
      default: return codeSnippet.runtime || '';
    }
  };

  const currentCode = getCode();
  const currentOutcome = getOutcome();
  const currentRuntime = getRuntime();

  // Update custom outcome/runtime when view mode changes
  React.useEffect(() => {
    setCustomOutcome(currentOutcome);
    setCustomRuntime(currentRuntime);
  }, [viewMode, selectedLang, currentOutcome, currentRuntime]);

  const handleSaveOutcome = () => {
    // This would need to be passed from parent component (ForgeAlgorithm)
    // For now, we'll store in localStorage as a demo
    const key = `outcome_${algorithm.id}_${selectedLang}_${viewMode}`;
    const runtimeKey = `runtime_${algorithm.id}_${selectedLang}_${viewMode}`;
    localStorage.setItem(key, customOutcome);
    localStorage.setItem(runtimeKey, customRuntime);
    setShowOutcomeEditor(false);
    alert(`Saved custom outcome and runtime for ${viewMode} implementation!`);
  };

  const handleRun = async () => {
    if (!isAuthenticated) {
      alert('Please login to run code');
      return;
    }

    setIsRunning(true);
    setError(null);
    setOutput(null);
    setRuntime(null);
    setShowConsole(true);

    // If manual outcome and runtime are provided for current view mode, use them
    if (currentOutcome || currentRuntime) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setOutput(currentOutcome || "Execution successful (No output provided).");
      setRuntime(currentRuntime || "N/A");
      setIsRunning(false);
      return;
    }

    try {
      const ai = createAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Simulate the execution of the following ${selectedLang} code for the algorithm "${algorithm.name}".
        Provide a realistic test case, the expected output, and a simulated runtime in milliseconds.

        Code:
        ${currentCode}

        Return the result in JSON format.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              testCase: { type: Type.STRING, description: "The input used for testing" },
              output: { type: Type.STRING, description: "The console output of the execution" },
              runtimeMs: { type: Type.NUMBER, description: "Simulated runtime in milliseconds" },
              status: { type: Type.STRING, enum: ["success", "error"] }
            },
            required: ["testCase", "output", "runtimeMs", "status"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      if (result.status === "success") {
        setOutput(`Test Case: ${result.testCase}\n\nOutput:\n${result.output}`);
        setRuntime(`${result.runtimeMs}ms`);
      } else {
        setError("Execution failed during simulation.");
      }
    } catch (err) {
      console.error("Run error:", err);
      setError("The AI Neural Engine (Gemini API) could not be reached. This is likely a network issue or an invalid API configuration.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Language Tabs */}
      <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setSelectedLang(lang.id)}
            className={cn(
              "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
              selectedLang === lang.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            )}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* View Mode Tabs */}
      <div className="flex p-1 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
        {[
          { id: 'class', label: 'Class', icon: Braces },
          { id: 'function', label: 'Function', icon: Terminal },
          { id: 'recursive', label: 'Recursive', icon: History }
        ].map((mode) => {
          const Icon = mode.icon;
          const hasCode = mode.id === 'class' ? !!codeSnippet.classCode :
                         mode.id === 'function' ? !!codeSnippet.functionCode :
                         !!codeSnippet.recursiveCode;

          return (
            <button
              key={mode.id}
              onClick={() => hasCode && setViewMode(mode.id as any)}
              className={cn(
                "flex-1 py-3 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                viewMode === mode.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : hasCode
                    ? "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    : "text-slate-700 cursor-not-allowed opacity-50"
              )}
              disabled={!hasCode && viewMode !== mode.id}
            >
              <Icon size={12} />
              {mode.label}
            </button>
          );
        })}
      </div>

      {/* Code Display with Run Button */}
      <Card variant="glass" className="relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -z-10 group-hover:bg-indigo-600/10 transition-colors" />
        
        {/* Header with Run Button */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Terminal size={20} />
            </div>
            <div>
              <h3 className="font-black text-sm text-white uppercase tracking-tight">Source Code</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                {selectedLang} • {viewMode} Implementation
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowOutcomeEditor(!showOutcomeEditor)}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-amber-400"
              title="Edit outcome and runtime"
            >
              <Edit3 size={16} />
            </Button>
            <Button
              onClick={handleRun}
              disabled={isRunning || !isAuthenticated}
              size="sm"
              className={cn(
                "shadow-lg shadow-indigo-500/20",
                (!isAuthenticated) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isRunning ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : !isAuthenticated ? (
                <Lock size={16} className="mr-2" />
              ) : (
                <Play size={16} className="mr-2" />
              )}
              {!isAuthenticated ? 'Login to Run' : 'Run'}
            </Button>
          </div>
        </div>

        {/* Code Display */}
        <div className="relative">
          <SyntaxHighlighter
            language={selectedLang === 'cpp' ? 'cpp' : selectedLang}
            style={atomDark}
            customStyle={{
              margin: 0,
              padding: '2rem',
              fontSize: '0.85rem',
              lineHeight: '1.7',
              background: 'transparent',
              minHeight: '400px',
            }}
            showLineNumbers={true}
          >
            {currentCode}
          </SyntaxHighlighter>
        </div>

        {/* Outcome Editor */}
        <AnimatePresence>
          {showOutcomeEditor && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/5 bg-indigo-500/5 p-6 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                    <Edit3 size={18} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-white uppercase tracking-tight">
                      Edit {viewMode} Outcome & Runtime
                    </h4>
                    <p className="text-[10px] text-slate-500">Set custom output and execution time for this implementation</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowOutcomeEditor(false)}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">
                    Expected Output (Outcome)
                  </label>
                  <textarea
                    value={customOutcome}
                    onChange={(e) => setCustomOutcome(e.target.value)}
                    placeholder="Enter expected output..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all h-32 resize-none text-white placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 block">
                    Execution Time (Runtime)
                  </label>
                  <input
                    type="text"
                    value={customRuntime}
                    onChange={(e) => setCustomRuntime(e.target.value)}
                    placeholder="e.g., 12ms, 0.5s, 24ms"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all text-white placeholder:text-slate-600"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    onClick={() => {
                      setCustomOutcome(currentOutcome);
                      setCustomRuntime(currentRuntime);
                      setShowOutcomeEditor(false);
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveOutcome}
                    variant="success"
                    size="sm"
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Console Output */}
        <AnimatePresence>
          {showConsole && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-black/80 border-t border-white/10 overflow-hidden backdrop-blur-xl"
            >
              <div className="flex items-center justify-between p-3 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-3 px-3">
                  <Terminal size={14} className={cn(error ? "text-rose-400" : "text-indigo-400")} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {error ? 'Error' : 'Console'}
                  </span>
                </div>
              </div>
              <div className="p-6 font-mono text-xs overflow-auto max-h-[300px]">
                {isRunning ? (
                  <div className="flex items-center gap-4 text-slate-500 italic py-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Loader2 size={18} />
                    </motion.div>
                    <span className="uppercase tracking-widest font-black text-[10px]">
                      Executing Neural Logic...
                    </span>
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-3 text-rose-400 py-6">
                    <Terminal size={18} />
                    <span className="font-bold">{error}</span>
                  </div>
                ) : output ? (
                  <div className="space-y-4 py-2">
                    <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed font-medium">
                      {output}
                    </pre>
                    {runtime && (
                      <div className="flex items-center gap-3 text-slate-500 pt-4 border-t border-white/5">
                        <Terminal size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Runtime: {runtime}
                        </span>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Complexity Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Time Complexity</p>
              <p className="text-xl font-mono font-black text-indigo-400">{algorithm.complexity.time}</p>
            </div>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: algorithm.complexity.timeRating === 'good' ? '90%' : algorithm.complexity.timeRating === 'average' ? '60%' : '30%' }}
              transition={{ duration: 1 }}
              className={cn(
                "h-full rounded-full",
                algorithm.complexity.timeRating === 'good' ? "bg-emerald-500" :
                algorithm.complexity.timeRating === 'average' ? "bg-amber-500" :
                "bg-rose-500"
              )}
            />
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-2">
            Rating: {algorithm.complexity.timeRating}
          </p>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Cpu size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Space Complexity</p>
              <p className="text-xl font-mono font-black text-emerald-400">{algorithm.complexity.space}</p>
            </div>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: algorithm.complexity.spaceRating === 'good' ? '90%' : algorithm.complexity.spaceRating === 'average' ? '60%' : '30%' }}
              transition={{ duration: 1 }}
              className={cn(
                "h-full rounded-full",
                algorithm.complexity.spaceRating === 'good' ? "bg-emerald-500" :
                algorithm.complexity.spaceRating === 'average' ? "bg-amber-500" :
                "bg-rose-500"
              )}
            />
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-2">
            Rating: {algorithm.complexity.spaceRating}
          </p>
        </Card>
      </div>
    </div>
  );
}
