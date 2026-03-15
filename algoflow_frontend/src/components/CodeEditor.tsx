import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Copy,
  Check,
  Download,
  Share2,
  Maximize2,
  Minimize2,
  Code2,
  Terminal,
  Save,
  Undo,
  Redo,
  Settings,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { Language, CodeSnippet } from '../types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '../auth';

interface CodeEditorProps {
  code: CodeSnippet;
  language: Language;
  onChange?: (code: CodeSnippet) => void;
  onRun?: (code: string) => Promise<void>;
  readOnly?: boolean;
  className?: string;
}

export default function CodeEditor({
  code,
  language,
  onChange,
  onRun,
  readOnly = false,
  className
}: CodeEditorProps) {
  const { isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<'class' | 'function' | 'recursive'>('function');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [runtime, setRuntime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  const getCode = () => {
    switch (viewMode) {
      case 'class': return code.classCode || '';
      case 'function': return code.functionCode || '';
      case 'recursive': return code.recursiveCode || '';
      default: return code.functionCode || '';
    }
  };

  const currentCode = getCode();

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentCode]);

  const handleDownload = useCallback(() => {
    const extensions: Record<Language, string> = {
      python: 'py',
      cpp: 'cpp',
      c: 'c',
      rust: 'rs'
    };
    
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `algorithm.${extensions[language]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currentCode, language]);

  const handleRun = async () => {
    if (!isAuthenticated) {
      alert('Please login to run code');
      return;
    }

    setIsRunning(true);
    setError(null);
    setOutput(null);
    setRuntime(null);

    try {
      if (onRun) {
        await onRun(currentCode);
      } else {
        // Simulate execution if no onRun handler
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOutput(code.outcome || 'Execution successful (No output provided).');
        setRuntime(code.runtime || 'N/A');
      }
    } catch (err: any) {
      setError(err.message || 'Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleEditorChange = (newCode: string) => {
    if (!onChange || readOnly) return;

    const updatedCode = { ...code };
    switch (viewMode) {
      case 'class': updatedCode.classCode = newCode; break;
      case 'function': updatedCode.functionCode = newCode; break;
      case 'recursive': updatedCode.recursiveCode = newCode; break;
    }
    onChange(updatedCode);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <Card className={cn("p-0 overflow-hidden flex flex-col", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Code2 size={20} />
          </div>
          <div>
            <h3 className="font-black text-sm text-white uppercase tracking-tight">Code Editor</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
              {language} • {viewMode} Implementation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 text-slate-500 hover:text-white"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="w-9 h-9 text-slate-500 hover:text-white"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="w-9 h-9 text-slate-500 hover:text-emerald-400"
          >
            {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="w-9 h-9 text-slate-500 hover:text-indigo-400"
          >
            <Download size={18} />
          </Button>
          {!readOnly && onRun && (
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
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Terminal size={16} />
                </motion.div>
              ) : (
                <Play size={16} />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* View Mode Tabs */}
      {!readOnly && (
        <div className="flex p-2 bg-indigo-500/5 border-b border-white/5">
          {[
            { id: 'class', label: 'Class', icon: Code2 },
            { id: 'function', label: 'Function', icon: Terminal },
            { id: 'recursive', label: 'Recursive', icon: Share2 }
          ].map((mode) => {
            const Icon = mode.icon;
            const hasCode = mode.id === 'class' ? !!code.classCode :
                           mode.id === 'function' ? !!code.functionCode :
                           !!code.recursiveCode;

            return (
              <button
                key={mode.id}
                onClick={() => hasCode && setViewMode(mode.id as any)}
                className={cn(
                  "flex-1 py-2 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                  viewMode === mode.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : hasCode
                      ? "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      : "text-slate-700 cursor-not-allowed opacity-50"
                )}
                disabled={!hasCode}
              >
                <Icon size={12} />
                {mode.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Editor Area */}
      <div className="flex-1 relative">
        <SyntaxHighlighter
          language={language === 'cpp' ? 'cpp' : language}
          style={darkMode ? atomDark : prism}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            fontSize: `${fontSize}px`,
            lineHeight: '1.7',
            background: darkMode ? '#0f172a' : '#f8fafc',
            minHeight: '400px',
          }}
          showLineNumbers={showLineNumbers}
          startingLineNumber={1}
          wrapLines={true}
        >
          {currentCode}
        </SyntaxHighlighter>

        {!readOnly && onChange && (
          <textarea
            value={currentCode}
            onChange={(e) => handleEditorChange(e.target.value)}
            className="absolute inset-0 w-full h-full p-[1.5rem] font-mono resize-none bg-transparent text-transparent caret-white outline-none"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: '1.7',
              tabSize: 4,
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
          />
        )}
      </div>

      {/* Console Output */}
      {(output || error || isRunning) && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-t border-white/5 bg-black/80 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between p-3 border-b border-white/5">
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
                  <Terminal size={18} />
                </motion.div>
                <span className="uppercase tracking-widest font-black text-[10px]">
                  Executing...
                </span>
              </div>
            ) : error ? (
              <div className="flex items-start gap-3 text-rose-400 py-6">
                <Terminal size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-2">Execution Error</p>
                  <pre className="whitespace-pre-wrap text-rose-300">{error}</pre>
                </div>
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

      {/* Status Bar */}
      <div className="flex items-center justify-between p-3 border-t border-white/5 bg-white/5 text-[10px]">
        <div className="flex items-center gap-4">
          <span className="text-slate-500 uppercase tracking-widest font-black">
            {language.toUpperCase()}
          </span>
          <span className="text-slate-600">
            {currentCode.split('\n').length} lines
          </span>
          <span className="text-slate-600">
            {currentCode.length} chars
          </span>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              checked={showLineNumbers}
              onChange={(e) => setShowLineNumbers(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="uppercase tracking-widest font-black">Line Numbers</span>
          </label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-400 outline-none focus:border-indigo-500"
          >
            {[12, 14, 16, 18, 20].map(size => (
              <option key={size} value={size}>{size}px</option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}
