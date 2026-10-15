import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { UserProfile, Gender } from '../types';
import { AbahMascot } from './AbahMascot';
import { User, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface FirstTimeProfileModalProps {
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
  isEditMode?: boolean;
  onCancel?: () => void;
}

export const FirstTimeProfileModal: React.FC<FirstTimeProfileModalProps> = ({
  onSave,
  initialProfile,
  isEditMode = false,
  onCancel,
}) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [gender, setGender] = useState<Gender | null>(initialProfile?.gender || null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Silakan masukkan nama atau panggilanmu terlebih dahulu.');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Nama minimal terdiri dari 2 karakter.');
      return;
    }

    if (trimmedName.length > 40) {
      setError('Nama maksimal 40 karakter ya.');
      return;
    }

    if (!gender) {
      setError('Silakan pilih salah satu opsi jenis kelamin (Laki-laki atau Perempuan).');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Trigger a joyful celebratory confetti burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00F0FF', '#38BDF8', '#3B82F6', '#8B5CF6'],
      });
    } catch {
      // Ignore if confetti fails
    }

    const newProfile: UserProfile = {
      name: trimmedName,
      gender,
      language: initialProfile?.language || 'id',
      createdAt: initialProfile?.createdAt || Date.now(),
    };

    setTimeout(() => {
      onSave(newProfile);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0A1226]/95 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(6,182,212,0.25)] text-slate-100 overflow-hidden my-auto">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Mascot Avatar Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <AbahMascot size="lg" glow={true} />
            <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-[#050B17] p-1 rounded-full shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isEditMode ? 'Ubah Profil Abah AI' : 'Kenalan dulu dengan Abah AI'}
          </h2>
          <p className="text-sm text-cyan-200/80 mt-1 max-w-xs">
            {isEditMode
              ? 'Sesuaikan nama dan sapaan personal favoritmu.'
              : 'Agar Abah AI bisa menyapamu dengan lebih personal.'}
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Validation Error Message */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2">
              Nama atau Panggilan <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                maxLength={40}
                placeholder="Contoh: Budi, Sarah, Haikal"
                className="w-full pl-10 pr-4 py-3 bg-[#060D1E] border border-cyan-500/30 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                disabled={isSubmitting}
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 pl-1">
              Nama ini akan digunakan Abah AI saat menyapamu saat belajar.
            </p>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2">
              Panggilan Santun <span className="text-cyan-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Laki-laki */}
              <button
                type="button"
                onClick={() => {
                  setGender('male');
                  if (error) setError(null);
                }}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all ${
                  gender === 'male'
                    ? 'bg-blue-600/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50'
                    : 'bg-[#060D1E] border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                <div className="text-2xl mb-1">👦</div>
                <span className="text-sm font-semibold">Laki-laki</span>
                <span className="text-[10px] text-cyan-400/80 mt-0.5">Sapaan: "Tuan"</span>
              </button>

              {/* Perempuan */}
              <button
                type="button"
                onClick={() => {
                  setGender('female');
                  if (error) setError(null);
                }}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all ${
                  gender === 'female'
                    ? 'bg-cyan-600/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50'
                    : 'bg-[#060D1E] border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                <div className="text-2xl mb-1">👧</div>
                <span className="text-sm font-semibold">Perempuan</span>
                <span className="text-[10px] text-cyan-400/80 mt-0.5">Sapaan: "Nona"</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400 hover:from-blue-500 hover:via-cyan-400 hover:to-sky-300 text-[#050B17] font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all transform active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-[#050B17] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEditMode ? 'Simpan Perubahan' : 'Simpan dan Mulai'}</span>
                </>
              )}
            </button>

            {isEditMode && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-medium cursor-pointer"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
