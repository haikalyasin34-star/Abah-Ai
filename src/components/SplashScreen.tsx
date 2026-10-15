import React, { useEffect, useState } from 'react';
import { AbahMascot } from './AbahMascot';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Menyiapkan Abah AI...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(45);
      setStatusText('Memuat modul pembelajaran cerdas...');
    }, 600);

    const timer2 = setTimeout(() => {
      setProgress(85);
      setStatusText('Menghubungkan ke sistem edukasi...');
    }, 1200);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Siap belajar!');
    }, 1800);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#040817] px-6 py-12 select-none overflow-hidden">
      {/* Background radial blue glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-gradient-to-tr from-blue-600/25 via-cyan-500/20 to-purple-600/20 rounded-full blur-[80px] animate-pulse pointer-events-none" />

      {/* Decorative top spacer */}
      <div className="w-full flex justify-end">
        <span className="text-[11px] font-mono tracking-widest text-cyan-400/60 uppercase">
          v1.00.1 • AI Edu
        </span>
      </div>

      {/* Center Logo & Branding */}
      <div className="relative flex flex-col items-center justify-center text-center max-w-xs">
        {/* Animated Mascot */}
        <div className="relative mb-6 transform transition-transform duration-700 animate-float">
          <div className="absolute -inset-3 rounded-full bg-cyan-400/20 blur-xl animate-glow-pulse" />
          <AbahMascot size="2xl" showBadge={true} glow={true} />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 flex items-center justify-center gap-2">
          <span>Abah</span>
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
            AI
          </span>
        </h1>

        {/* Slogan */}
        <p className="text-sm font-medium text-cyan-200/90 tracking-wide">
          Teman Pintar, Jawaban Lebih Jelas.
        </p>

        {/* Creator Info */}
        <p className="text-[11px] text-slate-400 mt-2">
          Karya Muhammad Haikal Yasin (Aaba)
        </p>
      </div>

      {/* Bottom Loading Progress */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3">
        <div className="w-full bg-slate-900/80 rounded-full h-1.5 p-0.5 border border-cyan-500/30 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-sky-300 rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_#38BDF8]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between w-full text-[11px] text-slate-400 font-medium">
          <span className="text-cyan-300/80 animate-pulse">{statusText}</span>
          <span className="font-mono text-cyan-400">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
