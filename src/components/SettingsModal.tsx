import React, { useState } from 'react';
import { UserProfile } from '../types';
import { AbahMascot } from './AbahMascot';
import {
  X,
  User,
  Volume2,
  VolumeX,
  Globe2,
  Trash2,
  Info,
  CheckCircle,
  AlertTriangle,
  Code,
  Heart,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onEditProfile: () => void;
  language: 'id' | 'en';
  onChangeLanguage: (lang: 'id' | 'en') => void;
  ambientSound: boolean;
  onToggleAmbientSound: () => void;
  onClearAllHistory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onEditProfile,
  language,
  onChangeLanguage,
  ambientSound,
  onToggleAmbientSound,
  onClearAllHistory,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#030712]/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0A1226] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-[0_0_40px_rgba(6,182,212,0.25)] text-slate-100 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
          <div className="flex items-center gap-2.5">
            <AbahMascot size="xs" showBadge={false} glow={true} />
            <h3 className="text-lg font-bold text-white tracking-tight">Pengaturan Abah AI</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* User Profile Section */}
          <div className="p-3.5 rounded-2xl bg-[#060D1E] border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400">Profil Pelajar</span>
                  <h4 className="text-sm font-bold text-white">
                    {userProfile?.gender === 'female' ? 'Nona ' : 'Tuan '}
                    {userProfile?.name || 'Pelajar'}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onEditProfile();
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all cursor-pointer"
              >
                Ubah
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="p-3.5 rounded-2xl bg-[#060D1E] border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-400">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Bahasa Aplikasi</h4>
                  <p className="text-[11px] text-slate-400">Bahasa utama Abah AI</p>
                </div>
              </div>

              <div className="flex items-center bg-[#030712] p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => onChangeLanguage('id')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    language === 'id'
                      ? 'bg-cyan-500 text-[#050B17] shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇮🇩 ID
                </button>
                <button
                  onClick={() => onChangeLanguage('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    language === 'en'
                      ? 'bg-cyan-500 text-[#050B17] shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇬🇧 EN
                </button>
              </div>
            </div>
          </div>

          {/* Ambient Study Sound */}
          <div className="p-3.5 rounded-2xl bg-[#060D1E] border border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400">
                  {ambientSound ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Suara Latar Santai</h4>
                  <p className="text-[11px] text-slate-400">
                    Sintesis gelombang tenang penunjang fokus belajar
                  </p>
                </div>
              </div>

              <button
                onClick={onToggleAmbientSound}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  ambientSound ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
                role="switch"
                aria-checked={ambientSound}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    ambientSound ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Clear History Button & Confirmation */}
          <div className="p-3.5 rounded-2xl bg-[#060D1E] border border-rose-500/20">
            {showClearConfirm ? (
              <div className="space-y-2.5">
                <div className="flex items-start gap-2 text-rose-300 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>
                    Yakin ingin menghapus seluruh riwayat percakapan? Tindakan ini tidak dapat dibatalkan.
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      onClearAllHistory();
                      setShowClearConfirm(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs text-white font-bold shadow-md"
                  >
                    Hapus Semua
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-400">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Hapus Riwayat</h4>
                    <p className="text-[11px] text-slate-400">Bersihkan seluruh data obrolan lokal</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
                >
                  Bersihkan
                </button>
              </div>
            )}
          </div>

          {/* Official Brand & Creator Credits */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#061129] to-[#040816] border border-cyan-500/25 space-y-2.5">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                Informasi Aplikasi
              </span>
            </div>

            <div className="text-xs space-y-1.5 text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Nama Aplikasi:</span>
                <span className="font-semibold text-white">Abah AI</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Versi:</span>
                <span className="font-mono text-cyan-400">v1.00.1</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Slogan Resmi:</span>
                <span className="font-medium text-cyan-200">“Teman Pintar, Jawaban Lebih Jelas.”</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Pembuat Aplikasi:</span>
                <span className="font-semibold text-white">Muhammad Haikal Yasin (Aaba)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Model AI Terpasang:</span>
                <span className="font-mono text-slate-300">Gemini 3 Flash (Auto-Resilient)</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400/80 leading-relaxed pt-2 border-t border-slate-800/60">
              Abah AI adalah asisten belajar ramah untuk membantu siswa memahami pelajaran matematika,
              sains, bahasa, sejarah, hingga pemrograman dengan penjelasan langkah demi langkah.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-cyan-500/15">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-center text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/40 rounded-xl border border-cyan-500/20 transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
