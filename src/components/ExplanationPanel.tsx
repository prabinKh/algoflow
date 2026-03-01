import React from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  BookOpen, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle, 
  History,
  Target,
  ArrowRight
} from 'lucide-react';
import { Algorithm } from '../types';
import { cn } from '../lib/utils';

interface ExplanationPanelProps {
  algorithm: Algorithm;
}

export default function ExplanationPanel({ algorithm }: ExplanationPanelProps) {
  const { explanation } = algorithm;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full max-h-[800px]">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/50">
        <BookOpen size={18} className="text-indigo-600" />
        <span className="font-bold text-sm">Learning Guide</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Problem Section */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Target size={20} />
            <h3 className="font-black text-lg tracking-tight">The Problem</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {explanation.problem}
          </p>
        </section>

        {/* Intuition Section */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Lightbulb size={20} />
            <h3 className="font-black text-lg tracking-tight">Intuition</h3>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl">
            <p className="text-sm text-amber-800 dark:text-amber-300 italic leading-relaxed">
              "{explanation.intuition}"
            </p>
          </div>
        </section>

        {/* Walkthrough Section */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <ArrowRight size={20} />
            <h3 className="font-black text-lg tracking-tight">Step-by-Step</h3>
          </div>
          <div className="space-y-4">
            {explanation.walkthrough.split('\n').map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-400 pt-0.5">
                  {step.replace(/^\d+\.\s*/, '')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* When to Use Section */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={20} />
            <h3 className="font-black text-lg tracking-tight">When to Use</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {explanation.whenToUse}
          </p>
        </section>

        {/* Fun Fact Section */}
        {explanation.funFact && (
          <section className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
              <History size={16} />
              <h4 className="text-xs font-bold uppercase tracking-widest">Historical Note</h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {explanation.funFact}
            </p>
          </section>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <button className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
          View Full Documentation
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
