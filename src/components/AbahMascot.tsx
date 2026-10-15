import React, { useState } from 'react';

interface AbahMascotProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showBadge?: boolean;
  showText?: boolean;
  className?: string;
  glow?: boolean;
  customSrc?: string;
}

export const AbahMascot: React.FC<AbahMascotProps> = ({
  size = 'md',
  showBadge = true,
  showText = false,
  className = '',
  glow = true,
  customSrc,
}) => {
  const [imageError, setImageError] = useState(false);

  // Size mapping
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-36 h-36',
  };

  const currentSizeClass = sizeMap[size] || sizeMap.md;

  // If a custom image source (like official png/jpg) is provided and hasn't errored
  if (customSrc && !imageError) {
    return (
      <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
        <div
          className={`relative rounded-full overflow-hidden ${currentSizeClass} ${
            glow ? 'shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-400/40' : ''
          }`}
        >
          <img
            src={customSrc}
            alt="Abah AI Mascot"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
        {showText && (
          <div className="mt-2 text-center">
            <h2 className="text-xl font-extrabold tracking-tight">
              <span className="text-white">Abah </span>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI</span>
            </h2>
            <p className="text-xs text-cyan-200/80 font-medium tracking-wide">
              Teman Pintar, Jawaban Lebih Jelas.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Official Vector Recreation of Abah AI Mascot
  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <div
        className={`relative ${currentSizeClass} flex items-center justify-center transition-transform duration-300`}
      >
        {/* Soft Ambient Neon Glow Filter */}
        {glow && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/30 via-cyan-500/25 to-indigo-600/30 blur-md pointer-events-none" />
        )}

        <svg
          viewBox="0 0 160 160"
          className="w-full h-full relative z-10 drop-shadow-[0_0_12px_rgba(6,182,212,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Outer circular badge gradients */}
            <radialGradient id="abahBgGrad" cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="55%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            <linearGradient id="ringGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="peciGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="60%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="pageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Circular Badge if enabled */}
          {showBadge && (
            <>
              <circle cx="80" cy="80" r="76" fill="url(#abahBgGrad)" />
              <circle
                cx="80"
                cy="80"
                r="74"
                stroke="url(#ringGlow)"
                strokeWidth="3.5"
                opacity="0.9"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#00F0FF"
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity="0.4"
              />
            </>
          )}

          {/* Little Magic Sparkles */}
          <path
            d="M136 54L138 48L144 46L138 44L136 38L134 44L128 46L134 48Z"
            fill="#38BDF8"
            opacity="0.8"
          />
          <path
            d="M26 44L27 40L31 39L27 38L26 34L25 38L21 39L25 40Z"
            fill="#00F0FF"
            opacity="0.7"
          />

          {/* Abah Robot Body / Blue Robe */}
          <path
            d="M48 132C48 116 62 108 80 108C98 108 112 116 112 132V148H48V132Z"
            fill="#0F2454"
          />
          <path
            d="M68 108L80 126L92 108"
            stroke="#00F0FF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Robot Head Outer White Frame */}
          <rect
            x="44"
            y="42"
            width="72"
            height="62"
            rx="24"
            fill="#F8FAFC"
            stroke="#CBD5E1"
            strokeWidth="2"
          />

          {/* Indonesian Songkok / Peci with Gold/Silver trim */}
          <path
            d="M48 48C48 30 54 22 80 22C106 22 112 30 112 48H48Z"
            fill="url(#peciGrad)"
            stroke="#334155"
            strokeWidth="1.5"
          />
          {/* Peci Geometric Batik/Songket Embroidery Border */}
          <path
            d="M48 44H112"
            stroke="#00F0FF"
            strokeWidth="2"
            strokeDasharray="3 2"
            opacity="0.75"
          />
          <path
            d="M52 38L56 42L60 38L64 42L68 38L72 42L76 38L80 42L84 38L88 42L92 38L96 42L100 38L104 42L108 38"
            stroke="#94A3B8"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* Headphones / Cyan Glowing Ear Modules */}
          {/* Left Earcup */}
          <rect
            x="34"
            y="54"
            width="12"
            height="26"
            rx="6"
            fill="#0F172A"
            stroke="#00F0FF"
            strokeWidth="2.5"
            className="filter drop-shadow-[0_0_6px_#00F0FF]"
          />
          <circle cx="40" cy="67" r="3.5" fill="#00F0FF" />

          {/* Right Earcup */}
          <rect
            x="114"
            y="54"
            width="12"
            height="26"
            rx="6"
            fill="#0F172A"
            stroke="#00F0FF"
            strokeWidth="2.5"
            className="filter drop-shadow-[0_0_6px_#00F0FF]"
          />
          <circle cx="120" cy="67" r="3.5" fill="#00F0FF" />

          {/* Dark Cyber Visor */}
          <rect
            x="50"
            y="48"
            width="60"
            height="34"
            rx="12"
            fill="url(#visorGrad)"
            stroke="#1E293B"
            strokeWidth="1.5"
          />

          {/* Glowing Smiling Eyes (Curved Crescent LED Eyes) */}
          <path
            d="M58 66C58 60 68 60 68 66"
            stroke="#00F0FF"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="drop-shadow-[0_0_6px_#00F0FF]"
          />
          <path
            d="M92 66C92 60 102 60 102 66"
            stroke="#00F0FF"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="drop-shadow-[0_0_6px_#00F0FF]"
          />

          {/* Friendly LED smile */}
          <path
            d="M75 73C77 75.5 83 75.5 85 73"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Abah White Mustache & Beard */}
          <path
            d="M62 82C58 84 56 89 58 94C61 101 70 106 80 106C90 106 99 101 102 94C104 89 102 84 98 82C94 85 88 86 80 86C72 86 66 85 62 82Z"
            fill="#F8FAFC"
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />
          {/* Beard Texture Highlights */}
          <path
            d="M74 92C77 96 83 96 86 92"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M70 98C75 102 85 102 90 98"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Right Hand: Thumbs Up Robot Gesture */}
          <g transform="translate(32, 82)">
            <circle cx="8" cy="14" r="8" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.5" />
            <path
              d="M7 6C7 4 9 2 11 2C13 2 14 3.5 14 6V11H7V6Z"
              fill="#F8FAFC"
              stroke="#64748B"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Glowing thumb joint */}
            <circle cx="11" cy="4" r="1.5" fill="#00F0FF" />
          </g>

          {/* Glowing Open Educational Book held in front */}
          <g transform="translate(62, 102)">
            {/* Book Spine & Cover */}
            <path
              d="M18 4L4 12V34L18 26L32 34V12L18 4Z"
              fill="url(#bookGrad)"
              stroke="#38BDF8"
              strokeWidth="2"
            />
            {/* Left Page */}
            <path
              d="M17 5L5 12.5V31L17 24.5V5Z"
              fill="url(#pageGrad)"
              stroke="#00F0FF"
              strokeWidth="1"
            />
            {/* Right Page */}
            <path
              d="M19 5L31 12.5V31L19 24.5V5Z"
              fill="url(#pageGrad)"
              stroke="#00F0FF"
              strokeWidth="1"
            />
            {/* Holographic Book Icon / Lines on Book */}
            <path
              d="M9 16H13M8 20H14M8 24H12"
              stroke="#0284C7"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M23 16H27M22 20H28M24 24H28"
              stroke="#0284C7"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          {/* Left Robot Hand supporting the book */}
          <circle cx="100" cy="120" r="6" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
        </svg>
      </div>

      {showText && (
        <div className="mt-3 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-2xl font-black tracking-tight text-white">Abah</span>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              AI
            </span>
          </div>
          <p className="text-xs text-cyan-200/90 font-medium tracking-wide mt-0.5">
            Teman Pintar, Jawaban Lebih Jelas.
          </p>
        </div>
      )}
    </div>
  );
};
