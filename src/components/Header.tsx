import React from 'react';
import { RotateCcw, Share2, Award, Sparkles, Crown } from 'lucide-react';

interface HeaderProps {
  onResetDemo: () => void;
  onOpenShareModal: () => void;
  currentSpotPrice: number;
}

export const Header: React.FC<HeaderProps> = ({
  onResetDemo,
  onOpenShareModal,
  currentSpotPrice,
}) => {
  return (
    <header 
      id="main-header" 
      className="shrink-0 z-40 bg-[#08090c]/95 backdrop-blur-xl border-b border-[#f59e0b]/20 px-4 sm:px-6 py-2.5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Concept Identity: Diecast Spotlight + THE WALL OF FAME */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f59e0b] via-[#d97706] to-[#b45309] flex items-center justify-center shadow-lg shadow-[#f59e0b]/25 text-black shrink-0 border border-[#fef3c7]/30">
            <Crown className="w-4 h-4 fill-black text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#f59e0b]">
                Diecast Spotlight
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="text-[10px] font-mono text-amber-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-ping" />
                Live #1 Inductee
              </span>
            </div>
            <h1 className="font-display font-black text-base sm:text-lg md:text-xl text-white tracking-wider uppercase leading-none flex items-center gap-2">
              <span>THE WALL OF FAME</span>
            </h1>
          </div>
        </div>

        {/* Subtitle / Callout Tagline on Desktop */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/25 text-xs text-neutral-300">
          <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span>Upload your Hot Wheels & outbid to immortalize your casting as #1</span>
        </div>

        {/* Right side: Share in Any Media + Reset Demo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Share Button in Header */}
          <button
            onClick={onOpenShareModal}
            className="px-3 py-1.5 rounded-xl bg-[#f59e0b]/15 hover:bg-[#f59e0b]/25 border border-[#f59e0b]/40 text-[#f59e0b] hover:text-amber-200 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Share the Wall of Fame to any media"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Share Media</span>
          </button>

          {/* Clear Data button */}
          <button
            onClick={onResetDemo}
            title="Clear all spot data and return to blank Wall of Fame"
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-neutral-400 hover:text-rose-300 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};

