import React from 'react';
import {
  Smartphone,
  Laptop,
  ShoppingCart,
  MessageSquare,
  Home,
  Wifi,
  User,
  Settings,
  Mail,
  Globe,
} from 'lucide-react';

export const TechBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* Deep Navy Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#040816] via-[#07132B] to-[#030712]" />

      {/* Cyber Digital Radial Lighting */}
      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-blue-600/10 to-transparent rounded-full blur-[90px] opacity-70" />
      <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-sky-400/10 rounded-full blur-[60px]" />

      {/* Futuristic Constellation Grid & Nodes (SVG) */}
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[640px] opacity-25"
        viewBox="0 0 720 640"
        fill="none"
      >
        {/* Concentric Digital Globe Orbits */}
        <circle cx="360" cy="220" r="160" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="360" cy="220" r="220" stroke="#00F0FF" strokeWidth="0.75" opacity="0.6" />
        <ellipse cx="360" cy="220" rx="160" ry="70" stroke="#38BDF8" strokeWidth="1" opacity="0.4" />
        <ellipse cx="360" cy="220" rx="70" ry="160" stroke="#38BDF8" strokeWidth="1" opacity="0.4" />

        {/* Network Connection Lines */}
        <path d="M180 120 L270 170 L360 220 L450 170 L540 120" stroke="#38BDF8" strokeWidth="1.2" opacity="0.5" />
        <path d="M220 280 L290 240 L360 220 L430 240 L500 280" stroke="#38BDF8" strokeWidth="1" opacity="0.4" />
        <path d="M270 170 L290 240 M450 170 L430 240 M360 120 L360 320" stroke="#00F0FF" strokeWidth="0.8" opacity="0.3" />

        {/* Glowing Network Nodes */}
        <circle cx="180" cy="120" r="4" fill="#00F0FF" className="animate-pulse" />
        <circle cx="270" cy="170" r="4.5" fill="#38BDF8" />
        <circle cx="360" cy="220" r="6" fill="#00F0FF" />
        <circle cx="450" cy="170" r="4.5" fill="#38BDF8" />
        <circle cx="540" cy="120" r="4" fill="#00F0FF" className="animate-pulse" />
        <circle cx="220" cy="280" r="4" fill="#38BDF8" />
        <circle cx="500" cy="280" r="4" fill="#38BDF8" />
      </svg>

      {/* Floating Translucent Holographic Tech Tiles (Recreating Reference Screenshot exactly) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-md h-80 px-4">
        {/* Shopping Cart Tile */}
        <div className="absolute top-16 left-[22%] -translate-x-1/2 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-400/30 backdrop-blur-xs shadow-[0_0_15px_rgba(6,182,212,0.25)] text-cyan-300 transform -rotate-6 animate-float">
          <ShoppingCart className="w-5 h-5 opacity-90" />
        </div>

        {/* Smartphone Tile */}
        <div className="absolute top-4 left-[58%] -translate-x-1/2 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-400/30 backdrop-blur-xs shadow-[0_0_15px_rgba(6,182,212,0.25)] text-cyan-300 transform rotate-3">
          <Smartphone className="w-5 h-5 opacity-90" />
        </div>

        {/* Home Tile */}
        <div className="absolute top-14 right-[12%] p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-400/30 backdrop-blur-xs shadow-[0_0_15px_rgba(6,182,212,0.25)] text-cyan-300 transform rotate-6 animate-float">
          <Home className="w-5 h-5 opacity-90" />
        </div>

        {/* Chat Message Bubble Tile */}
        <div className="absolute top-36 left-[14%] p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-400/30 backdrop-blur-xs shadow-[0_0_15px_rgba(6,182,212,0.25)] text-cyan-300 transform -rotate-3">
          <MessageSquare className="w-5 h-5 opacity-90" />
        </div>

        {/* User / Profile Avatar Tile */}
        <div className="absolute top-48 left-[34%] p-2 rounded-xl bg-cyan-950/40 border border-cyan-400/30 backdrop-blur-xs shadow-[0_0_15px_rgba(6,182,212,0.25)] text-cyan-300">
          <User className="w-4 h-4 opacity-85" />
        </div>

        {/* Wi-Fi Waves Tile */}
        <div className="absolute top-32 left-[48%] -translate-x-1/2 p-2 rounded-xl bg-cyan-950/35 border border-cyan-400/25 backdrop-blur-xs shadow-[0_0_12px_rgba(6,182,212,0.2)] text-cyan-300 transform rotate-6">
          <Wifi className="w-4 h-4 opacity-85" />
        </div>

        {/* Settings / Gear Tile */}
        <div className="absolute top-52 right-[42%] p-2 rounded-xl bg-cyan-950/35 border border-cyan-400/25 backdrop-blur-xs shadow-[0_0_12px_rgba(6,182,212,0.2)] text-cyan-300">
          <Settings className="w-4 h-4 opacity-85" />
        </div>

        {/* Mail Envelope Tile */}
        <div className="absolute top-44 right-[24%] p-2 rounded-xl bg-cyan-950/40 border border-cyan-400/30 backdrop-blur-xs shadow-[0_0_15px_rgba(6,182,212,0.25)] text-cyan-300 transform -rotate-6">
          <Mail className="w-4 h-4 opacity-85" />
        </div>

        {/* Global Web Tile */}
        <div className="absolute top-36 right-[8%] p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-400/30 backdrop-blur-xs shadow-[0_0_15px_rgba(6,182,212,0.25)] text-cyan-300 transform rotate-3 animate-float">
          <Globe className="w-5 h-5 opacity-90" />
        </div>

        {/* Laptop Hologram Tile */}
        <div className="absolute top-52 right-[6%] p-2 rounded-xl bg-cyan-950/35 border border-cyan-400/25 backdrop-blur-xs shadow-[0_0_12px_rgba(6,182,212,0.2)] text-cyan-300">
          <Laptop className="w-4 h-4 opacity-85" />
        </div>
      </div>

      {/* Dark Navy Readability Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050B17]/70 to-[#050B17]/95" />
    </div>
  );
};
