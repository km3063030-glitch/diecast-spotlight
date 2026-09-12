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
      className="sticky top-0 z-40 bg-[#08090c]/95 backdrop-blur-xl border-b border-[#f59e0b]/20 px-4 sm:px-6 py-3"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Concept Identity: Diecast Spotlight + THE WALL OF FAME */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f59e0b] via-[#d97706] to-[#b45309] flex items-center justify-center shadow-lg shadow-[#f59e0b]/25 text-black font-impact text-2xl tracking-tighter shrink-0 border border-[#fef3c7]/30">
            <Crown className="w-5 h-5 fill-black text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#f59e0b] flex items-center gap-1">
                <span>Diecast Spotlight</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="text-[10px] font-mono text-amber-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-ping" />
                Live Inductee
              </span>
            </div>
            <h1 className="font-display font-black text-lg sm:text-xl md:text-2xl text-white tracking-wider uppercase leading-none flex items-center gap-2">
              <span>THE WALL OF FAME</span>
            </h1>
          </div>
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

          {/* Reset Demo button for repeatable testing */}
          <button
            onClick={onResetDemo}
            title="Reset to Initial Demo State ($7.50 / Alex)"
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
