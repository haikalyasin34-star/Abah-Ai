import React from 'react';
import { ArrowRight, Sparkles, BookOpen, Globe2, Code, Atom, Leaf, Landmark, TrendingUp } from 'lucide-react';
import { PopularQuestion } from '../types';
import { POPULAR_QUESTIONS } from '../data/popularQuestions';

interface PopularQuestionsProps {
  onSelectQuestion: (questionText: string) => void;
}

export const PopularQuestions: React.FC<PopularQuestionsProps> = ({ onSelectQuestion }) => {
  const getSubjectIcon = (iconType: PopularQuestion['iconType']) => {
    switch (iconType) {
      case 'math':
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-500/30 flex items-center justify-center font-serif text-lg font-bold shrink-0">
            π
          </div>
        );
      case 'science':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
        );
      case 'physics':
        return (
          <div className="w-8 h-8 rounded-xl bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Atom className="w-4 h-4" />
          </div>
        );
      case 'coding':
        return (
          <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center justify-center font-mono text-xs font-bold shrink-0">
            &lt;/&gt;
          </div>
        );
      case 'indonesian':
        return (
          <div className="w-8 h-8 rounded-xl bg-sky-600/30 text-sky-300 border border-sky-500/30 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
        );
      case 'english':
        return (
          <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Globe2 className="w-4 h-4" />
          </div>
        );
      case 'history':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-600/30 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Landmark className="w-4 h-4" />
          </div>
        );
      case 'economy':
        return (
          <div className="w-8 h-8 rounded-xl bg-rose-600/30 text-rose-300 border border-rose-500/30 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Pertanyaan Populer
          </h3>
        </div>
        <span className="text-[11px] text-cyan-400/80 font-medium">Pilih untuk bertanya</span>
      </div>

      {/* Responsive Grid (1 column on narrow, 2 columns on mobile/tablet) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {POPULAR_QUESTIONS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectQuestion(item.fullQuestion)}
            className="w-full text-left p-3 rounded-2xl glass-card-interactive flex items-center justify-between gap-3 group cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              {getSubjectIcon(item.iconType)}

              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                  {item.subject}
                </span>
                <span className="text-[11px] text-slate-300 truncate group-hover:text-white transition-colors">
                  {item.shortLabel}
                </span>
              </div>
            </div>

            <div className="p-1 rounded-lg text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
