import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Terminal, Code2, Play, Loader2, AlertCircle, Clock, ChevronDown, ChevronUp, Sun, Moon, Braces, Cpu, History } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Algorithm, Language } from '../types';
import { cn } from '../lib/utils';
import { Type } from "@google/genai";
import { createAiClient } from '../lib/api';

interface CodePanelProps {
  algorithm: Algorithm;
}

export default function CodePanel({ algorithm }: CodePanelProps) {
  const [selectedLang, setSelectedLang] = useState<Language>('python');
  const [viewMode, setViewMode] = useState<'class' | 'function' | 'recursive'>('function');
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [runtime, setRuntime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConsole, setShowConsole] = useState(false);

  const languages: { id: Language; label: string }[] = [
    { id: 'python', label: 'Python' },
    { id: 'cpp', label: 'C++' },
    { id: 'c', label: 'C' },
    { id: 'rust', label: 'Rust' }
  ];

  const codeSnippet = algorithm.code[selectedLang];
  
  const getCode = () => {
    switch (viewMode) {
      case 'class': return codeSnippet.classCode || '';
      case 'function': return codeSnippet.functionCode || '';
      case 'recursive': return codeSnippet.recursiveCode || '';
      default: return codeSnippet.functionCode || '';
    }
  };

  const currentCode = getCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setOutput(null);
    setRuntime(null);
    setShowConsole(true);

    // If manual outcome and runtime are provided, use them
    if (codeSnippet.outcome || codeSnippet.runtime) {
      // Simulate a small delay for "running" feel
      await new Promise(resolve => setTimeout(resolve, 800));
      setOutput(codeSnippet.outcome || "Execution successful (No output provided).");
      setRuntime(codeSnippet.runtime || "N/A");
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
      setError("The AI Neural Engine (Gemini API) could not be reached. This is likely a network issue or an invalid API configuration. Please ensure you are online and your environment is correctly set up.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card variant="glass" className="flex flex-col h-full max-h-[800px] p-0 overflow-hidden group">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Code2 size={20} />
          </div>
          <div>
            <h3 className="font-black text-sm text-white uppercase tracking-tight">Implementation</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Source Matrix</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleRun}
            disabled={isRunning}
            size="sm"
            className="shadow-lg shadow-indigo-500/20"
          >
            {isRunning ? <Loader2 size={16} className="animate-spin mr-2" /> : <Play size={16} className="mr-2" />}
            Run
          </Button>
          <Button 
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="w-10 h-10 text-slate-500"
          >
            {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Language Tabs */}
        <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLang(lang.id)}
              className={cn(
                "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                selectedLang === lang.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                  : "text-slate-500 hover:text-slate-300"
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
            { id: 'function', label: 'Function', icon: Cpu },
            { id: 'recursive', label: 'Recursive', icon: History }
          ].map((mode) => {
            const Icon = mode.icon;
            const hasCode = mode.id === 'class' ? !!codeSnippet.classCode : 
                           mode.id === 'function' ? !!codeSnippet.functionCode : 
                           !!codeSnippet.recursiveCode;
            
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={cn(
                  "flex-1 py-2 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                  viewMode === mode.id 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                    : hasCode ? "text-slate-400 hover:text-slate-200" : "text-slate-700 cursor-not-allowed"
                )}
                disabled={!hasCode && viewMode !== mode.id}
              >
                <Icon size={12} />
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar bg-black/40 border-y border-white/5">
        <SyntaxHighlighter
          language={selectedLang === 'cpp' ? 'cpp' : selectedLang}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: '2rem',
            fontSize: '0.85rem',
            lineHeight: '1.7',
            background: 'transparent'
          }}
        >
          {currentCode}
        </SyntaxHighlighter>
      </div>

      {/* Console Output Section */}
      <AnimatePresence>
        {showConsole && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black/80 border-t border-white/10 overflow-hidden backdrop-blur-xl"
          >
            <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3 px-3">
                <Terminal size={14} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Neural Console</span>
              </div>
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => setShowConsole(false)}
                className="w-8 h-8 text-slate-500"
              >
                <ChevronDown size={18} />
              </Button>
            </div>
            <div className="p-6 font-mono text-xs overflow-auto custom-scrollbar max-h-[300px]">
              {isRunning ? (
                <div className="flex items-center gap-4 text-slate-500 italic py-6">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Loader2 size={18} /></motion.div>
                  <span className="uppercase tracking-widest font-black text-[10px]">Executing Neural Logic...</span>
                </div>
              ) : error ? (
                <div className="flex items-center gap-3 text-rose-400 py-6">
                  <AlertCircle size={18} />
                  <span className="font-bold">{error}</span>
                </div>
              ) : output ? (
                <div className="space-y-6 py-2">
                  <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed font-medium">{output}</pre>
                  <div className="flex items-center gap-3 text-slate-500 pt-4 border-t border-white/5">
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Execution Latency: {runtime}</span>
                  </div>
                </div>
              ) : (
                <div className="text-slate-600 py-6 uppercase tracking-widest font-black text-[10px]">No output yet. Click "Run" to execute.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 bg-white/5">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Time Complexity</p>
            <p className="text-sm font-mono font-black text-indigo-400">{algorithm.complexity.time}</p>
          </div>
          <div className="w-px h-10 bg-white/5" />
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Space Complexity</p>
            <p className="text-sm font-mono font-black text-indigo-400">{algorithm.complexity.space}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
