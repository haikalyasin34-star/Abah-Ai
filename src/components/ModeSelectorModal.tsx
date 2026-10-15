import React from 'react';
import { AIMode } from '../types';
import { AbahMascot } from './AbahMascot';
import { Check, ChevronRight, X, GraduationCap, Calculator, Terminal, Zap } from 'lucide-react';

interface ModeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: AIMode;
  onSelectMode: (mode: AIMode) => void;
}

export const ModeSelectorModal: React.FC<ModeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
}) => {
  if (!isOpen) return null;

  const modes: {
    id: AIMode;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'standard',
      title: 'Mode Belajar Umum',
      description: 'Penjelasan terstruktur, langkah demi langkah, ramah dan mudah dipahami siswa.',
      icon: <GraduationCap className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/40 bg-cyan-950/20',
    },
    {
      id: 'math',
      title: 'Matematika & Sains Khusus',
      description: 'Perhitungan detail, diketahui/ditanyakan, rumus lengkap, dan verifikasi hasil.',
      icon: <Calculator className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-500/40 bg-blue-950/20',
    },
    {
      id: 'coding',
      title: 'Pemrograman & Koding',
      description: 'Sintaks rapi, penjelasan baris demi baris, cara menjalankan, dan contoh output.',
      icon: <Terminal className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/40 bg-purple-950/20',
    },
    {
      id: 'quick',
      title: 'Ringkas & Cepat',
      description: 'Jawaban langsung ke inti pertanyaan tanpa penjelasan yang berlebihan.',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/40 bg-amber-950/20',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#030712]/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0A1226] border border-cyan-500/30 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_0_40px_rgba(6,182,212,0.3)] text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
          <div className="flex items-center gap-2.5">
            <AbahMascot size="sm" showBadge={false} glow={false} />
            <div>
              <h3 className="text-base font-bold text-white">Pilih Mode Belajar AI</h3>
              <p className="text-[11px] text-cyan-300/80">Sesuaikan gaya penjelasan Abah AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode List */}
        <div className="space-y-2.5 my-4">
          {modes.map((mode) => {
            const isSelected = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  onSelectMode(mode.id);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                  isSelected
                    ? `${mode.color} ring-1 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]`
                    : 'bg-[#060D1E] border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  {mode.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{mode.title}</span>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {mode.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 text-center text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/50 hover:bg-cyan-900/50 rounded-xl border border-cyan-500/20 transition-all cursor-pointer"
        >
          Selesai
        </button>
      </div>
    </div>
  );
};
