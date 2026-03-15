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
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Algorithm } from '../types';
import { cn } from '../lib/utils';

interface ExplanationPanelProps {
  algorithm: Algorithm;
}

export default function ExplanationPanel({ algorithm }: ExplanationPanelProps) {
  const { explanation } = algorithm;

  return (
    <Card variant="glass" className="flex flex-col h-full max-h-[800px] p-0 overflow-hidden group">
      <div className="p-6 border-b border-white/5 flex items-center gap-3 bg-white/5">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
          <BookOpen size={20} />
        </div>
        <div>
          <h3 className="font-black text-sm text-white uppercase tracking-tight">Learning Guide</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Knowledge Base</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        {/* Problem Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-indigo-400">
            <Target size={22} />
            <h3 className="font-black text-xl tracking-tighter uppercase">The Problem</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            {explanation.problem}
          </p>
        </section>

        {/* Intuition Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-amber-400">
            <Lightbulb size={22} />
            <h3 className="font-black text-xl tracking-tighter uppercase">Intuition</h3>
          </div>
          <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -z-10" />
            <p className="text-sm text-amber-200/80 italic leading-relaxed font-medium">
              "{explanation.intuition}"
            </p>
          </div>
        </section>

        {/* Walkthrough Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 text-indigo-400">
            <ArrowRight size={22} />
            <h3 className="font-black text-xl tracking-tighter uppercase">Neural Walkthrough</h3>
          </div>
          <div className="space-y-5">
            {explanation.walkthrough.split('\n').map((step, i) => (
              <div key={i} className="flex gap-4 group/step">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-indigo-400 group-hover/step:bg-indigo-600 group-hover/step:text-white transition-all">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-sm text-slate-400 pt-1.5 leading-relaxed font-medium group-hover/step:text-slate-200 transition-colors">
                  {step.replace(/^\d+\.\s*/, '')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* When to Use Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 size={22} />
            <h3 className="font-black text-xl tracking-tighter uppercase">Strategic Use</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed font-medium">
            {explanation.whenToUse}
          </p>
        </section>

        {/* Fun Fact Section */}
        {explanation.funFact && (
          <section className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -z-10" />
            <div className="flex items-center gap-3 text-indigo-400 mb-3">
              <History size={18} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Historical Context</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
              {explanation.funFact}
            </p>
          </section>
        )}
      </div>

      <div className="p-6 border-t border-white/5 bg-white/5">
        <Button variant="ghost" className="w-full py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
          Access Full Documentation
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </Card>
  );
}
