import React from 'react';
import { Menu, History, Settings, Volume2, VolumeX, MessageSquarePlus } from 'lucide-react';
import { AbahMascot } from './AbahMascot';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenMenu: () => void;
  onNewChat: () => void;
  language: 'id' | 'en';
  onToggleLanguage: () => void;
  ambientSound: boolean;
  onToggleAmbientSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenSettings,
  onOpenMenu,
  onNewChat,
  language,
  onToggleLanguage,
  ambientSound,
  onToggleAmbientSound,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#050B17]/90 backdrop-blur-md border-b border-cyan-500/15 px-3 py-2.5 sm:px-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Menu & Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={onOpenMenu}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 active:scale-95 transition-all cursor-pointer"
            aria-label="Buka Menu"
            title="Menu Navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo with Mascot */}
          <div
            onClick={onNewChat}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            title="Mulai Percakapan Baru"
          >
            <div className="relative">
              <AbahMascot size="sm" showBadge={true} glow={true} />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base tracking-tight leading-none group-hover:text-cyan-300 transition-colors">
                  Abah AI
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 leading-none">
                  v1.00.1
                </span>
              </div>
              <p className="text-[11px] text-cyan-200/75 truncate max-w-[170px] sm:max-w-xs mt-0.5 leading-tight">
                Teman Pintar, Jawaban Lebih Jelas.
              </p>
            </div>
          </div>
        </div>

        {/* Right Controls: Single Language Selector, Audio, History, Settings */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all cursor-pointer"
            title="Chat Baru"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Chat Baru</span>
          </button>

          {/* Single Compact Language Selector */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#081226] border border-cyan-500/25 text-cyan-200 hover:border-cyan-400 text-xs font-medium transition-all cursor-pointer"
            title={language === 'id' ? 'Ganti ke Bahasa Inggris' : 'Switch to Indonesian'}
          >
            <span>{language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
          </button>

          {/* Ambient Background Audio Toggle */}
          <button
            onClick={onToggleAmbientSound}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              ambientSound
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] animate-pulse'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            aria-label={ambientSound ? 'Matikan Suara Belajar' : 'Nyalakan Suara Belajar Santai'}
            title={ambientSound ? 'Suara Belajar: Aktif' : 'Suara Belajar: Senyap'}
          >
            {ambientSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 active:scale-95 transition-all cursor-pointer"
            aria-label="Riwayat Percakapan"
            title="Riwayat Percakapan"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 active:scale-95 transition-all cursor-pointer"
            aria-label="Pengaturan"
            title="Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
