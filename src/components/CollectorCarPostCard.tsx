import React, { useState, useEffect } from 'react';
import { CollectorCarPost } from '../types';
import { Heart, Flame, Zap, Trophy, Sparkles, Edit3, ShieldCheck, Share2, Award, Crown, Timer, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface CollectorCarPostCardProps {
  post: CollectorCarPost;
  onUpvote: () => void;
  onOpenPutOnWallModal: (initialCustomPrice?: number) => void;
  onOpenShareModal: () => void;
}

// Utility to format total seconds into a readable string
function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) {
    return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  }
  if (m > 0) {
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  }
  return `${s}s`;
}

export const CollectorCarPostCard: React.FC<CollectorCarPostCardProps> = ({
  post,
  onUpvote,
  onOpenPutOnWallModal,
  onOpenShareModal,
}) => {
  const minBidPrice = Math.round((post.spotPrice + 0.50) * 100) / 100;
  const [customPrice, setCustomPrice] = useState<number>(minBidPrice);
  const [heartAnim, setHeartAnim] = useState(false);

  // Live timer for total time this particular car has been on the spot
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    setNow(Date.now());
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [post.inductedAt]);

  const elapsedSeconds = Math.max(0, Math.floor((now - (post.inductedAt || Date.now())) / 1000));
  const formattedTimeOnSpot = formatDuration(elapsedSeconds);

  useEffect(() => {
    if (customPrice < minBidPrice) {
      setCustomPrice(minBidPrice);
    }
  }, [post.spotPrice, minBidPrice]);

  const handleHeartClick = () => {
    onUpvote();
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 800);
  };

  const handlePriceQuickIncrement = (delta: number) => {
    const updated = Math.max(minBidPrice, Math.round((customPrice + delta) * 100) / 100);
    setCustomPrice(updated);
  };

  return (
    <article
      id="collector-social-post"
      className="relative w-full h-full rounded-2xl bg-[#0e1017]/95 border-2 border-[#f59e0b]/40 backdrop-blur-2xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col justify-between"
    >
      {/* Wall of Fame Golden Glow */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#f59e0b]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-72 h-72 bg-[#ff5500]/10 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. COLLECTOR HEADER                                                       */}
      {/* ========================================================================= */}
      <header className="px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3 border-b border-[#f59e0b]/20 bg-gradient-to-r from-[#18140e] via-[#0f1118] to-[#12141f] shrink-0 z-10">
        <div className="flex items-center gap-2.5">
          {/* Inductee Avatar */}
          <div className="relative">
            <img
              src={post.collectorAvatar}
              alt={post.collectorName}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-[#f59e0b] shadow-md shadow-[#f59e0b]/30"
            />
            <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center text-black shadow-md">
              <Crown className="w-2.5 h-2.5 fill-black text-black" />
            </div>
          </div>

          {/* Inductee Name & Title */}
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-black text-sm sm:text-base text-white tracking-wide">
                {post.collectorName}
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#f59e0b] font-mono font-semibold">
              <Award className="w-3 h-3 text-[#f59e0b]" />
              <span>Wall of Fame Champion</span>
            </div>
          </div>
        </div>

        {/* Live Timer Pill & Status Crest */}
        <div className="flex items-center gap-2">
          {/* Live Timer Pill */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-[#f59e0b]/30 text-neutral-200"
            title="Time on the spot. Resets to 0s when another collector takes #1."
          >
            <Clock className="w-3.5 h-3.5 text-[#f59e0b] animate-pulse" />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[8px] font-mono text-[#f59e0b] font-bold uppercase">On Spot</span>
              <span className="text-xs font-mono font-bold text-white mt-0.5">{formattedTimeOnSpot}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#f59e0b]/25 to-[#ff5500]/25 border border-[#f59e0b]/50 text-white shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
            <span className="font-display font-bold text-[11px] uppercase tracking-wider text-[#fbbf24]">
              {post.currentStatus}
            </span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CAR IMAGE                                                              */}
      {/* ========================================================================= */}
      <div 
        className="relative w-full flex-1 min-h-[160px] max-h-[220px] sm:max-h-[260px] bg-gradient-to-b from-[#181510] via-black to-[#0a0c10] overflow-hidden group cursor-pointer"
        onDoubleClick={handleHeartClick}
        title="Double click to upvote"
      >
        <div className="absolute inset-x-0 -top-8 h-24 bg-radial from-[#f59e0b]/30 via-transparent to-transparent blur-xl pointer-events-none" />

        <img
          src={post.imageUrl}
          alt={post.carName}
          className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

        {/* Heart Burst on Double Tap */}
        {heartAnim && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <Heart className="w-20 h-20 text-rose-500 fill-rose-500 drop-shadow-[0_0_25px_rgba(244,63,94,0.9)]" />
          </motion.div>
        )}

        {/* Rarity Plaque Badge */}
        <div className="absolute top-2.5 right-2.5 z-20">
          <span className="px-2.5 py-0.5 rounded-lg bg-black/85 backdrop-blur-md border border-[#f59e0b]/40 text-[10px] sm:text-[11px] font-bold text-[#f59e0b] tracking-wide uppercase shadow-lg flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            <span>{post.rarity}</span>
          </span>
        </div>

        {/* Inscription on Image */}
        <div className="absolute bottom-2.5 left-3 right-3 z-20 pointer-events-none">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#f59e0b] uppercase block">
            {post.year}
          </span>
          <h2 className="font-display font-black text-lg sm:text-xl md:text-2xl text-white tracking-wide uppercase drop-shadow-md leading-tight">
            {post.carName}
          </h2>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SOCIAL METRICS BAR                                                     */}
      {/* ========================================================================= */}
      <div className="px-3.5 py-2 bg-black/60 border-y border-[#f59e0b]/20 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          {/* Upvotes */}
          <button
            onClick={handleHeartClick}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
              post.hasUpvoted
                ? 'bg-rose-500/20 border-rose-500/60 text-rose-400 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300 hover:text-white'
            }`}
            title="Upvote this Wall of Fame induction"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                post.hasUpvoted ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
              }`}
            />
            <span className="font-mono text-xs font-bold">
              {post.upvotes.toLocaleString()}
            </span>
            <span className="text-[10px] text-neutral-400 hidden sm:inline">Upvotes</span>
          </button>

          {/* Hype Score */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300">
            <Flame className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b] animate-pulse" />
            <span className="font-mono text-xs font-bold">
              {post.hype}%
            </span>
            <span className="text-[10px] text-amber-300/80 uppercase tracking-wider font-semibold hidden sm:inline">
              Hype
            </span>
          </div>
        </div>

        {/* Current Spot Price Callout */}
        <div className="flex items-center gap-1.5 text-right shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            CURRENT SPOT:
          </span>
          <span className="font-impact text-2xl text-[#f59e0b] leading-none">
            ${post.spotPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. DESCRIPTION & INSCRIPTION                                              */}
      {/* ========================================================================= */}
      <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 shrink-0 bg-[#0c0e14]">
        <p className="text-xs text-neutral-300 font-medium leading-normal line-clamp-2">
          {post.shortDescription}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 5. PRICE INPUT & PUT ON THE WALL PRIMARY CTA                              */}
      {/* ========================================================================= */}
      <div className="p-3 sm:p-3.5 bg-black/80 border-t border-[#f59e0b]/30 space-y-2 shrink-0">
        {/* Inline Price Control Bar */}
        <div className="flex items-center justify-between gap-2">
          <label 
            htmlFor="inline-spot-price-input"
            className="text-[11px] font-bold uppercase tracking-wider text-[#f59e0b] flex items-center gap-1 shrink-0"
          >
            <Edit3 className="w-3 h-3" />
            <span>Your Spot Price:</span>
          </label>

          {/* Quick Increment Chips */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => handlePriceQuickIncrement(0.50)}
              className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-[11px] font-mono font-bold transition-colors cursor-pointer"
            >
              +$0.50
            </button>
            <button
              type="button"
              onClick={() => handlePriceQuickIncrement(1.00)}
              className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-[11px] font-mono font-bold transition-colors cursor-pointer"
            >
              +$1.00
            </button>
            <button
              type="button"
              onClick={() => handlePriceQuickIncrement(2.50)}
              className="px-2 py-0.5 rounded-lg bg-[#f59e0b]/20 hover:bg-[#f59e0b]/30 border border-[#f59e0b]/40 text-[#f59e0b] text-[11px] font-mono font-bold transition-colors cursor-pointer"
            >
              +$2.50
            </button>
          </div>
        </div>

        {/* Input & Primary CTA Row */}
        <div className="flex items-center gap-2">
          {/* Price Input */}
          <div className="relative flex items-center w-28 sm:w-32 shrink-0">
            <span className="absolute left-2.5 font-mono font-black text-sm text-[#f59e0b]">
              $
            </span>
            <input
              id="inline-spot-price-input"
              type="number"
              step="0.25"
              min={minBidPrice}
              value={customPrice}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  setCustomPrice(val);
                }
              }}
              className="w-full pl-6 pr-2 py-1.5 rounded-xl bg-[#151821] border border-[#f59e0b]/40 text-white font-mono text-sm font-black focus:outline-none focus:border-[#f59e0b] transition-all"
            />
          </div>

          {/* Put on the Wall Action Button */}
          <button
            id="put-on-wall-button"
            onClick={() => onOpenPutOnWallModal(customPrice)}
            className="flex-1 py-2.5 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#ff6a00] to-[#ff2d55] hover:brightness-110 active:scale-[0.99] text-white font-display text-sm sm:text-base font-black tracking-wider uppercase shadow-lg shadow-[#f59e0b]/25 transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/20 group"
          >
            <Zap className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
            <span>Put on Wall — ${Math.max(minBidPrice, customPrice).toFixed(2)}</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Timer resets on new induction • Upload your own Hot Wheels photo</span>
        </div>
      </div>
    </article>
  );
};

