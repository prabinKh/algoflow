import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, CheckCircle2, XCircle, ChevronRight, RefreshCcw, Lock, Eye } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Algorithm, Question } from '../types';
import { cn } from '../lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '../auth';
import { useNavigate } from 'react-router-dom';

interface QuestionsPanelProps {
  algorithm: Algorithm;
}

export default function QuestionsPanel({ algorithm }: QuestionsPanelProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const questions = algorithm.questions || [];
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const handleRevealAnswer = (questionId: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    setRevealedAnswers(prev => ({ ...prev, [questionId]: true }));
  };

  if (questions.length === 0) {
    return (
      <Card variant="glass" className="p-20 text-center flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 text-slate-600 border border-white/10 shadow-2xl">
          <HelpCircle size={48} />
        </div>
        <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter">No Neural Assessment</h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium leading-relaxed">
          This algorithm node currently lacks interactive logic assessment modules.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
          <HelpCircle size={24} />
        </div>
        <div>
          <h3 className="font-black text-sm uppercase tracking-tight text-white">Algorithm Assessment Matrix</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{questions.length} Logic Challenges</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {questions.map((question, idx) => {
          const isRevealed = revealedAnswers[question.id];
          
          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card variant="glass" className="p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-[60px] -z-10 group-hover:bg-indigo-600/10 transition-colors" />

                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-[10px] font-black shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="text-lg font-bold text-white leading-tight tracking-tight">
                      {question.text}
                    </h4>
                  </div>

                  {!isRevealed ? (
                    <div className="flex items-center justify-between p-6 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3 text-slate-400">
                        <Lock size={18} />
                        <span className="text-sm font-bold">Solution locked</span>
                      </div>
                      <Button
                        onClick={() => handleRevealAnswer(question.id)}
                        variant="primary"
                        size="sm"
                        className="shadow-lg shadow-indigo-500/20"
                      >
                        <Eye size={16} className="mr-2" />
                        Reveal Answer
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Neural Solution</span>
                        <span className="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                          {question.language}
                        </span>
                      </div>

                      <div className="rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                        <SyntaxHighlighter
                          language={question.language}
                          style={atomDark}
                          customStyle={{
                            margin: 0,
                            padding: '1.5rem',
                            fontSize: '12px',
                            background: 'rgba(0,0,0,0.4)',
                          }}
                        >
                          {question.answer}
                        </SyntaxHighlighter>
                      </div>

                      {question.explanation && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <div className="flex items-center gap-2 mb-2 text-indigo-400">
                            <CheckCircle2 size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Logic Insight</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
