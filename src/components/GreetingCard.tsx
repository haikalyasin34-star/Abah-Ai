import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { AbahMascot } from './AbahMascot';
import { getPersonalizedGreeting, GreetingInfo } from '../utils/greeting';
import { Sparkles } from 'lucide-react';

interface GreetingCardProps {
  userProfile: UserProfile | null;
  language: 'id' | 'en';
  onEditProfile?: () => void;
}

export const GreetingCard: React.FC<GreetingCardProps> = ({
  userProfile,
  language,
  onEditProfile,
}) => {
  const [greeting, setGreeting] = useState<GreetingInfo>(() =>
    getPersonalizedGreeting(userProfile, language)
  );

  // Update greeting dynamically if the time changes during the session
  useEffect(() => {
    setGreeting(getPersonalizedGreeting(userProfile, language));

    // Check every minute for time-of-day changes
    const interval = setInterval(() => {
      setGreeting(getPersonalizedGreeting(userProfile, language));
    }, 60000);

    return () => clearInterval(interval);
  }, [userProfile, language]);

  return (
    <div className="relative w-full rounded-3xl p-4 sm:p-5 glass-card overflow-hidden shadow-[0_0_28px_rgba(6,182,212,0.18)] border border-cyan-500/25">
      {/* Background Soft Glow */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute left-8 top-0 w-24 h-24 bg-blue-600/15 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-center gap-3.5 sm:gap-4.5">
        {/* Mascot Avatar with Glowing Ring */}
        <div className="relative shrink-0">
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-[0_0_16px_rgba(6,182,212,0.4)]">
            <div className="rounded-full bg-[#071126] p-0.5">
              <AbahMascot size="lg" showBadge={false} glow={false} />
            </div>
          </div>
          {/* Status Dot */}
          <span
            className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#071126] rounded-full shadow-[0_0_8px_#34D399]"
            title="Abah AI Aktif"
          />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight">
              {greeting.fullGreetingLine}
            </h2>
            <span className="text-sm select-none">{greeting.timeIcon}</span>
          </div>

          <p className="text-sm font-semibold text-cyan-300 flex items-center gap-1.5 mt-0.5 leading-snug">
            <span>{greeting.secondLine}</span>
          </p>

          <p className="text-xs text-slate-300/85 mt-1.5 line-clamp-2 leading-relaxed">
            {greeting.supportingText}
          </p>
        </div>

        {/* Profile edit small button */}
        {onEditProfile && (
          <button
            onClick={onEditProfile}
            className="hidden sm:flex self-start p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 text-[11px] font-medium transition-all"
            title="Edit Profil"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
