import React from 'react';
import { UserProfile, AIMode } from '../types';
import { AbahMascot } from './AbahMascot';
import {
  X,
  MessageSquare,
  History,
  Settings,
  HelpCircle,
  GraduationCap,
  Sparkles,
  Smartphone,
  ChevronRight,
  User,
} from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onNewChat: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenModeSelector: () => void;
  onEditProfile: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  userProfile,
  onNewChat,
  onOpenHistory,
  onOpenSettings,
  onOpenModeSelector,
  onEditProfile,
  onSelectPrompt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#02050E]/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xs bg-[#081226] border-r border-cyan-500/25 h-full flex flex-col z-10 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-slate-100">
        {/* Top Header */}
        <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AbahMascot size="sm" showBadge={false} glow={true} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base">Abah AI</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  v1.00.1
                </span>
              </div>
              <p className="text-[11px] text-cyan-300/80">Teman Pintar, Jawaban Lebih Jelas.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-3.5 mx-3 my-3 rounded-2xl bg-[#060D1E] border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Siswa Aktif
              </p>
              <p className="text-xs font-bold text-white truncate">
                {userProfile?.gender === 'female' ? 'Nona ' : 'Tuan '}
                {userProfile?.name || 'Pelajar'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              onEditProfile();
            }}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold px-2 py-1 rounded-lg hover:bg-cyan-950/40"
          >
            Ubah
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1.5">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-2xl text-left hover:bg-cyan-950/40 text-slate-200 hover:text-cyan-200 transition-all cursor-pointer group"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Percakapan Baru</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenHistory();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-2xl text-left hover:bg-cyan-950/40 text-slate-200 hover:text-cyan-200 transition-all cursor-pointer group"
          >
            <History className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Riwayat Obrolan</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenModeSelector();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-2xl text-left hover:bg-cyan-950/40 text-slate-200 hover:text-cyan-200 transition-all cursor-pointer group"
          >
            <GraduationCap className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Mode AI Edukasi</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-2xl text-left hover:bg-cyan-950/40 text-slate-200 hover:text-cyan-200 transition-all cursor-pointer group"
          >
            <Settings className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Pengaturan Aplikasi</span>
          </button>

          {/* Quick Subjects */}
          <div className="pt-3 mt-2 border-t border-cyan-500/15">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider px-3 mb-2 block">
              Materi Belajar Cepat
            </span>
            <div className="space-y-1">
              {[
                { label: 'Rumus Persamaan Kuadrat', q: 'Jelaskan rumus persamaan kuadrat dan contoh soalnya' },
                { label: 'Proses Fotosintesis Tumbuhan', q: 'Bagaimana proses fotosintesis pada tumbuhan dan rumusnya?' },
                { label: 'Hukum Newton 1, 2, 3', q: 'Jelaskan hukum Newton 1, 2, dan 3 dengan contoh sehari-hari' },
                { label: 'Belajar Coding Python', q: 'Buatkan contoh belajar dasar pemrograman Python untuk pemula' },
              ].map((subj, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectPrompt(subj.q);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs text-slate-300 hover:text-cyan-300 hover:bg-cyan-950/30 transition-all"
                >
                  <span className="truncate">{subj.label}</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer with Creator Branding */}
        <div className="p-4 border-t border-cyan-500/20 bg-[#050B17]/90 text-center">
          <p className="text-[11px] font-bold text-white">Abah AI v1.00.1</p>
          <p className="text-[10px] text-cyan-300/80 mt-0.5">
            Karya Muhammad Haikal Yasin (Aaba)
          </p>
          <p className="text-[9px] text-slate-500 mt-1">
            Dioptimalkan untuk Android & Web Modern
          </p>
        </div>
      </div>
    </div>
  );
};
