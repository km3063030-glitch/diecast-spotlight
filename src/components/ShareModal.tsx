import React, { useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, MessageCircle, Twitter, Facebook, Sparkles, Trophy, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CollectorCarPost } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: CollectorCarPost | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  post,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://diecast-spotlight.app';
  const shareTitle = post
    ? `🏆 ${post.collectorName}'s ${post.carName} on THE WALL OF FAME ($${post.spotPrice.toFixed(2)})`
    : `🏆 DIECAST SPOTLIGHT — THE WALL OF FAME`;
  const shareText = post
    ? `Check out ${post.collectorName}'s ${post.carName} reigning as #1 on DIECAST SPOTLIGHT — THE WALL OF FAME at $${post.spotPrice.toFixed(2)}! Can anyone beat this spot?`
    : `Check out DIECAST SPOTLIGHT — THE WALL OF FAME! Outbid the spot to immortalize your Hot Wheels casting as #1!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${currentUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or share failed, silently ignore
      }
    } else {
      handleCopyLink();
    }
  };

  // Media share destinations
  const shareChannels = [
    {
      name: 'X / Twitter',
      icon: Twitter,
      color: 'bg-black hover:bg-neutral-900 text-white border-white/20',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      },
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border-[#25D366]/40',
      action: () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      },
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-[#1877F2] border-[#1877F2]/40',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      },
    },
    {
      name: 'Reddit',
      icon: ExternalLink,
      color: 'bg-[#FF4500]/20 hover:bg-[#FF4500]/30 text-[#FF4500] border-[#FF4500]/40',
      action: () => {
        const url = `https://www.reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(shareTitle)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      },
    },
  ];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md rounded-2xl bg-[#0f1117] border border-[#f59e0b]/30 p-6 shadow-2xl shadow-black/90 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle gold glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#f59e0b]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#ff5500]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close share dialog"
            className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center pt-2 pb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-[#f59e0b] mb-3 shadow-lg shadow-[#f59e0b]/10">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-black uppercase tracking-wide text-white">
              SHARE WALL OF FAME
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Broadcast the reigning #1 Hot Wheels to any media
            </p>
          </div>

          {/* Preview Card */}
          {post ? (
            <div className="p-3 rounded-xl bg-black/50 border border-[#f59e0b]/20 flex items-center gap-3 mb-5">
              <img
                src={post.imageUrl}
                alt={post.carName}
                className="w-16 h-12 rounded-lg object-cover border border-white/10 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider">
                  <Award className="w-3 h-3" />
                  <span>Wall of Fame Inductee</span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">
                  {post.carName}
                </h4>
                <p className="text-[11px] text-neutral-400 font-mono">
                  By {post.collectorName} • ${post.spotPrice.toFixed(2)}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-black/50 border border-[#f59e0b]/20 flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b]/40 flex items-center justify-center shrink-0 text-[#f59e0b]">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider">
                  <Award className="w-3 h-3" />
                  <span>Wall of Fame Open</span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">
                  Diecast Spotlight Leaderboard
                </h4>
                <p className="text-[11px] text-neutral-400 font-mono">
                  Be the first #1 inductee
                </p>
              </div>
            </div>
          )}

          {/* Native Device Share (if available on mobile/supported browser) */}
          {'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full mb-3 py-3 px-4 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#ff7700] to-[#ff2d55] text-white font-display text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#ff5500]/20 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share to Any App (Instagram, TikTok, Messages)</span>
            </button>
          )}

          {/* Social Channels Grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {shareChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <button
                  key={channel.name}
                  onClick={channel.action}
                  className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${channel.color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{channel.name}</span>
                </button>
              );
            })}
          </div>

          {/* Copy Link Field */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#161922] border border-white/15">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="w-full bg-transparent px-2 text-xs text-neutral-300 font-mono focus:outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
