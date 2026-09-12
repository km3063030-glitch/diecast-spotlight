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
  // Resets whenever post.inductedAt changes (i.e. another user uploads and takes the spot)
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    // Immediate sync
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
      className="relative w-full rounded-2xl bg-[#0e1017]/95 border-2 border-[#f59e0b]/40 backdrop-blur-2xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col justify-between"
    >
      {/* Wall of Fame Golden Glow & Pedestal Lighting */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#f59e0b]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-72 h-72 bg-[#ff5500]/10 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. WALL OF FAME HEADER: Collector Identity & Prestigious Status           */}
      {/* ========================================================================= */}
      <header className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-[#f59e0b]/20 bg-gradient-to-r from-[#18140e] via-[#0f1118] to-[#12141f] z-10">
        <div className="flex items-center gap-3">
          {/* Inductee Avatar with Golden Laurel Frame */}
          <div className="relative">
            <img
              src={post.collectorAvatar}
              alt={post.collectorName}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-[#f59e0b] shadow-lg shadow-[#f59e0b]/30"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#b45309] flex items-center justify-center text-black text-[9px] font-black shadow-md">
              <Crown className="w-3 h-3 fill-black text-black" />
            </div>
          </div>

          {/* Inductee Name & Hall of Fame Title */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-base sm:text-xl text-white tracking-wide">
                {post.collectorName}
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#f59e0b] font-mono font-semibold">
              <Award className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Wall of Fame Champion</span>
            </div>
          </div>
        </div>

        {/* Current Status Pill, Live Spot Timer, & Quick Share Button */}
        <div className="flex items-center gap-2">
          {/* Live Timer Pill in Header */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-[#f59e0b]/30 text-neutral-200"
            title="Total time this car has been on the spot. Resets to 0s when another user uploads."
          >
            <Clock className="w-3.5 h-3.5 text-[#f59e0b] animate-pulse" />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[9px] font-mono text-[#f59e0b] font-bold uppercase">On Spot</span>
              <span className="text-xs font-mono font-bold text-white mt-0.5">{formattedTimeOnSpot}</span>
            </div>
          </div>

          {/* Share Button (Any Media) */}
          <button
            onClick={onOpenShareModal}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-[#f59e0b]/20 border border-white/15 hover:border-[#f59e0b]/50 text-neutral-300 hover:text-[#f59e0b] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Share this car to any social media"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Inductee Crest Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#f59e0b]/25 to-[#ff5500]/25 border border-[#f59e0b]/50 text-white shadow-md shadow-[#f59e0b]/20">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
            <span className="font-display font-bold text-xs uppercase tracking-wider text-[#fbbf24]">
              {post.currentStatus}
            </span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. LARGE CAR IMAGE with Wall of Fame Hall Illumination                    */}
      {/* ========================================================================= */}
      <div 
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-b from-[#181510] via-black to-[#0a0c10] overflow-hidden group cursor-pointer"
        onDoubleClick={handleHeartClick}
        title="Double click to upvote"
      >
        {/* Overhead Hall of Fame Gallery Spotlight Cone */}
        <div className="absolute inset-x-0 -top-8 h-32 bg-radial from-[#f59e0b]/30 via-transparent to-transparent blur-2xl pointer-events-none" />

        {/* The Diecast Photograph */}
        <img
          src={post.imageUrl}
          alt={post.carName}
          className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Darkened Vignette & Inset Golden Rim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/25 pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-[#f59e0b]/30 rounded-none pointer-events-none" />

        {/* Heart Burst on Double Tap */}
        {heartAnim && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-[0_0_25px_rgba(244,63,94,0.9)]" />
          </motion.div>
        )}

        {/* Top-Left Live Time-On-Spot HUD Ticker */}
        <div className="absolute top-3 left-3 z-20">
          <div className="px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-[#f59e0b]/50 text-white shadow-xl flex items-center gap-2">
            <Timer className="w-3.5 h-3.5 text-[#f59e0b] animate-spin" style={{ animationDuration: '8s' }} />
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <span className="text-neutral-400 font-sans text-[10px] uppercase tracking-wide">Time On Spot:</span>
              <strong className="text-[#f59e0b] font-bold">{formattedTimeOnSpot}</strong>
            </div>
          </div>
        </div>

        {/* Top-Right Rarity Plaque Badge */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <span className="px-3 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-[#f59e0b]/40 text-[11px] font-bold text-[#f59e0b] tracking-wide uppercase shadow-xl flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            <span>{post.rarity}</span>
          </span>
        </div>

        {/* Bottom Inductee Plaque Inscription on Image */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-20 pointer-events-none">
          <div>
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#f59e0b] uppercase block drop-shadow-md">
              {post.year}
            </span>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white tracking-wide uppercase drop-shadow-lg">
              {post.carName}
            </h2>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SOCIAL & WALL METRICS: Upvotes, Hype, Time on Spot & Current Spot Price */}
      {/* ========================================================================= */}
      <div className="px-4 sm:px-6 py-3 bg-black/50 border-y border-[#f59e0b]/20 flex items-center justify-between gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
        {/* Left: Upvotes, Hype & Live Time on Spot */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Upvotes */}
          <button
            onClick={handleHeartClick}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              post.hasUpvoted
                ? 'bg-rose-500/20 border-rose-500/60 text-rose-400 shadow-sm shadow-rose-500/25'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300 hover:text-white'
            }`}
            title="Upvote this Wall of Fame induction"
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform active:scale-125 ${
                post.hasUpvoted ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
              }`}
            />
            <span className="font-mono text-xs sm:text-sm font-bold">
              {post.upvotes.toLocaleString()}
            </span>
            <span className="text-[10px] text-neutral-400 hidden xs:inline">Upvotes</span>
          </button>

          {/* Hype Score */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300">
            <Flame className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b] animate-pulse" />
            <span className="font-mono text-xs sm:text-sm font-bold">
              {post.hype}%
            </span>
            <span className="text-[10px] text-amber-300/80 uppercase tracking-wider font-semibold hidden xs:inline">
              Hype
            </span>
          </div>

          {/* Dedicated Live Time On Spot Counter */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-white"
            title="Duration this car has been holding #1 on the spot. Resets to 0 when another user uploads."
          >
            <Timer className="w-4 h-4 text-[#f59e0b] animate-spin" style={{ animationDuration: '8s' }} />
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#f59e0b] font-bold">
                Time On Spot
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-white mt-0.5">
                {formattedTimeOnSpot}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Current Spot Price Callout */}
        <div className="text-right shrink-0 ml-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
            CURRENT SPOT
          </span>
          <span className="font-impact text-2xl sm:text-3xl text-[#f59e0b] leading-none">
            ${post.spotPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. WALL PLAQUE DETAILS: Casting notes & Description                       */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-6 space-y-3.5">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>Wall of Fame Inscription:</span>
            </span>
            <span className="text-xs font-mono font-semibold text-neutral-300 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
              {post.rarity} • {post.year}
            </span>
          </div>

          <h4 className="font-display font-black text-lg sm:text-xl text-white tracking-wide uppercase">
            {post.carName}
          </h4>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed mt-1 line-clamp-2 sm:line-clamp-none">
            {post.shortDescription}
          </p>
        </div>

        {/* ======================================================================= */}
        {/* 5. EDITABLE PRICE CONTROL: People can edit the price                    */}
        {/* ======================================================================= */}
        <div className="rounded-xl bg-black/60 border border-[#f59e0b]/30 p-3 sm:p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <label 
              htmlFor="inline-spot-price-input"
              className="text-xs font-bold uppercase tracking-wider text-[#f59e0b] flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Your Spot Price:</span>
            </label>

            <span className="text-[11px] font-mono text-neutral-400">
              Floor: ${minBidPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Custom Price Input */}
            <div className="relative flex items-center flex-1">
              <span className="absolute left-3 font-mono font-black text-base text-[#f59e0b]">
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
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#151821] border border-[#f59e0b]/30 text-white font-mono text-lg font-black focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition-all"
              />
            </div>

            {/* Quick Increment Chips */}
            <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => handlePriceQuickIncrement(0.50)}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                +$0.50
              </button>
              <button
                type="button"
                onClick={() => handlePriceQuickIncrement(1.00)}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                +$1.00
              </button>
              <button
                type="button"
                onClick={() => handlePriceQuickIncrement(2.50)}
                className="px-2.5 py-1.5 rounded-lg bg-[#f59e0b]/20 hover:bg-[#f59e0b]/30 border border-[#f59e0b]/40 text-[#f59e0b] text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                +$2.50
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 6. “PUT ON THE WALL” PRIMARY ACTION BUTTON                              */}
        {/* ======================================================================= */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            id="put-on-wall-button"
            onClick={() => onOpenPutOnWallModal(customPrice)}
            className="flex-1 py-3.5 sm:py-4 px-6 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#ff6a00] to-[#ff2d55] hover:brightness-110 active:scale-[0.99] text-white font-display text-lg sm:text-xl font-black tracking-wider uppercase shadow-xl shadow-[#f59e0b]/25 transition-all cursor-pointer flex items-center justify-center gap-2.5 border border-white/20 group"
          >
            <Zap className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform" />
            <span>Put on the Wall — ${Math.max(minBidPrice, customPrice).toFixed(2)}</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="py-3.5 sm:py-4 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-display text-base font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            title="Share in any media"
          >
            <Share2 className="w-4 h-4 text-[#f59e0b]" />
            <span>Share</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 pt-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Timer resets upon each new induction • Upload your own Hot Wheels</span>
        </div>
      </div>
    </article>
  );
};
