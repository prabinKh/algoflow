import React from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Code2, 
  Target, 
  Lightbulb, 
  ArrowRight, 
  ChevronRight,
  Clock,
  Database,
  History,
  Terminal
} from 'lucide-react';
import { algorithms } from '../data/algorithms';
import { cn } from '../lib/utils';
import { Algorithm } from '../types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function DocumentationView({ algorithms }: { algorithms: Algorithm[] }) {
  return (
    <div className="space-y-12 pb-20">
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl lg:text-6xl font-black tracking-tight">Algorithm Library</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          A comprehensive guide to the world's most important algorithms. 
          Understand the implementation, the intuition, and the complexity.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-16">
        {algorithms.map((algo, idx) => (
          <motion.section 
            key={algo.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            <div className="p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Left: Info */}
                <div className="lg:w-1/2 space-y-8">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 block">
                      {algo.category}
                    </span>
                    <h2 className="text-4xl font-black tracking-tight mb-4">{algo.name}</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {algo.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Clock size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Time Complexity</span>
                      </div>
                      <p className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">{algo.complexity.time}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Database size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Space Complexity</span>
                      </div>
                      <p className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">{algo.complexity.space}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 flex-shrink-0">
                        <Target size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">The Problem</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{algo.explanation.problem}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 flex-shrink-0">
                        <Lightbulb size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Intuition</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">"{algo.explanation.intuition}"</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <History size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Step-by-Step History</h4>
                        <div className="space-y-2 mt-2">
                          {algo.explanation.walkthrough.split('\n').map((step, i) => (
                            <div key={i} className="flex gap-2 text-sm text-slate-500 dark:text-slate-400">
                              <span className="font-bold text-indigo-600">{i + 1}.</span>
                              <span>{step.replace(/^\d+\.\s*/, '')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Code */}
                <div className="lg:w-1/2 flex flex-col">
                  <div className="bg-slate-50 dark:bg-[#1e1e1e] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-full">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
                      <div className="flex items-center gap-2">
                        <Terminal size={16} className="text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Python Implementation</span>
                      </div>
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto max-h-[500px] custom-scrollbar">
                      <SyntaxHighlighter
                        language="python"
                        style={atomDark}
                        customStyle={{
                          margin: 0,
                          padding: '2rem',
                          fontSize: '0.9rem',
                          lineHeight: '1.7',
                          background: 'transparent'
                        }}
                      >
                        {algo.code.python.iterative}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
