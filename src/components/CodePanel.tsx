import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Terminal, Code2, Play, Loader2, AlertCircle, Clock, ChevronDown, ChevronUp, Sun, Moon } from 'lucide-react';
import { Algorithm, Language } from '../types';
import { cn } from '../lib/utils';
import { GoogleGenAI, Type } from "@google/genai";

interface CodePanelProps {
  algorithm: Algorithm;
}

export default function CodePanel({ algorithm }: CodePanelProps) {
  const [selectedLang, setSelectedLang] = useState<Language>('python');
  const [isRecursive, setIsRecursive] = useState(false);
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
  const currentCode = isRecursive && codeSnippet.recursive ? codeSnippet.recursive : codeSnippet.iterative;

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

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
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
      setError("Failed to connect to execution engine.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full max-h-[800px]">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <Code2 size={18} className="text-indigo-600" />
          <span className="font-bold text-sm">Implementation</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-xs font-bold transition-all active:scale-95"
          >
            {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            Run
          </button>
          <button 
            onClick={handleCopy}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Language Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLang(lang.id)}
              className={cn(
                "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all",
                selectedLang === lang.id 
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Iterative/Recursive Toggle */}
        {codeSnippet.recursive && (
          <div className="flex items-center justify-between p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Recursive Version</span>
            <button 
              onClick={() => setIsRecursive(!isRecursive)}
              className={cn(
                "w-10 h-5 rounded-full transition-colors relative",
                isRecursive ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
              )}
            >
              <div className={cn(
                "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                isRecursive ? "left-6" : "left-1"
              )} />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar bg-slate-50 dark:bg-[#1e1e1e] border-b border-slate-200 dark:border-slate-800">
        <SyntaxHighlighter
          language={selectedLang === 'cpp' ? 'cpp' : selectedLang}
          style={atomDark}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            fontSize: '0.85rem',
            lineHeight: '1.6',
            background: 'transparent'
          }}
        >
          {currentCode}
        </SyntaxHighlighter>
      </div>

      {/* Console Output Section - Now below the code card */}
      <AnimatePresence>
        {showConsole && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-950 border-t border-slate-800 overflow-hidden"
          >
            <div className="p-2 border-b border-slate-800 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2 px-2">
                <Terminal size={14} className="text-indigo-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Console Output</span>
              </div>
              <button 
                onClick={() => setShowConsole(false)}
                className="p-1 hover:bg-slate-800 rounded text-slate-500"
              >
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="p-4 font-mono text-xs overflow-auto custom-scrollbar max-h-[300px]">
              {isRunning ? (
                <div className="flex items-center gap-3 text-slate-500 italic py-4">
                  <Loader2 size={14} className="animate-spin" />
                  Executing code...
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-rose-400 py-4">
                  <AlertCircle size={14} />
                  {error}
                </div>
              ) : output ? (
                <div className="space-y-4 py-2">
                  <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">{output}</pre>
                  <div className="flex items-center gap-2 text-slate-500 pt-3 border-t border-white/5">
                    <Clock size={12} />
                    <span>Execution time: {runtime}</span>
                  </div>
                </div>
              ) : (
                <div className="text-slate-600 py-4">No output yet. Click "Run" to execute.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time</p>
            <p className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{algorithm.complexity.time}</p>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Space</p>
            <p className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{algorithm.complexity.space}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
