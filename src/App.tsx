import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TakeSpotModal, NewSpotSubmission } from './components/TakeSpotModal';
import { CollectorCarPostCard } from './components/CollectorCarPostCard';
import { SpotHistoryList } from './components/SpotHistoryList';
import { ShareModal } from './components/ShareModal';
import { SpotHistoryItem, CollectorCarPost } from './types';
import { CheckCircle2, Award, Sparkles, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Default initial state sorted in descending order with top amount at the top
const DEFAULT_INITIAL_HISTORY: SpotHistoryItem[] = [
  { id: '5', name: 'Alex', amount: 7.50, isCurrent: true, carName: "1971 Datsun 240Z 'Chameleon' RLC" },
  { id: '4', name: 'Ryan', amount: 5.00 },
  { id: '3', name: 'David', amount: 3.75 },
  { id: '2', name: 'Mike', amount: 3.00 },
  { id: '1', name: 'Jordan', amount: 2.50 },
];

const INITIAL_DEMO_TIME_OFFSET_MS = (18 * 60 + 42) * 1000; // 18m 42s ago

const DEFAULT_POST: CollectorCarPost = {
  id: 'post-top-1',
  carName: "1971 Datsun 240Z 'Chameleon' RLC",
  collectorName: 'Alex',
  collectorHandle: '@alex_diecast',
  collectorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  rarity: 'RLC Exclusive',
  year: '1971 / 2025 Edition',
  shortDescription: 'Flawless Spectraflame chameleon finish shifting from emerald green to royal violet on deep-dish Real Riders with mirror chrome chassis.',
  imageUrl: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=1200&auto=format&fit=crop&q=85',
  upvotes: 1248,
  hasUpvoted: false,
  hype: 99.2,
  currentStatus: '👑 #1 Wall of Fame',
  spotPrice: 7.50,
  inductedAt: Date.now() - INITIAL_DEMO_TIME_OFFSET_MS,
};

export default function App() {
  // Persisted state for demo realism
  const [history, setHistory] = useState<SpotHistoryItem[]>(() => {
    const saved = localStorage.getItem('diecast_spotlight_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure sorted descending by amount
        return [...parsed].sort((a, b) => b.amount - a.amount);
      } catch (e) {
        console.error('Error parsing history', e);
      }
    }
    return DEFAULT_INITIAL_HISTORY;
  });

  const [post, setPost] = useState<CollectorCarPost>(() => {
    const saved = localStorage.getItem('diecast_spotlight_post');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.inductedAt) {
          parsed.inductedAt = Date.now() - INITIAL_DEMO_TIME_OFFSET_MS;
        }
        return parsed;
      } catch (e) {
        console.error('Error parsing post', e);
      }
    }
    return DEFAULT_POST;
  });

  const [isTakeModalOpen, setIsTakeModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [modalInitialPrice, setModalInitialPrice] = useState<number | undefined>(undefined);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('diecast_spotlight_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('diecast_spotlight_post', JSON.stringify(post));
  }, [post]);

  // Current holder & spot price (from the top amount at the top of history)
  const sortedHistory = [...history].sort((a, b) => b.amount - a.amount);
  const currentTopItem = sortedHistory[0] || DEFAULT_INITIAL_HISTORY[0];
  const currentHolder = currentTopItem.name;
  const currentSpotPrice = currentTopItem.amount;

  // Handle Upvotes
  const handleUpvote = () => {
    setPost((prev) => ({
      ...prev,
      hasUpvoted: !prev.hasUpvoted,
      upvotes: prev.hasUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
    }));
  };

  // Open modal with pre-configured custom price
  const handleOpenPutOnWallModal = (initialCustomPrice?: number) => {
    setModalInitialPrice(initialCustomPrice);
    setIsTakeModalOpen(true);
  };

  // Confirm Put on the Wall with uploaded image & edited price
  const handleConfirmPutOnWall = (submission: NewSpotSubmission) => {
    const newEntry: SpotHistoryItem = {
      id: String(Date.now()),
      name: submission.collectorName,
      amount: submission.price,
      isCurrent: true,
      carName: submission.carName,
      timestamp: Date.now(),
    };

    // Prepend new top bid, ensuring descending order
    setHistory((prev) => [newEntry, ...prev].sort((a, b) => b.amount - a.amount));

    // Update social post to showcase the user's uploaded Hot Wheels
    // CRITICAL: reset inductedAt to Date.now() so the duration timer resets to 0s!
    const newInductedAt = Date.now();

    setPost({
      id: `post-${Date.now()}`,
      carName: submission.carName,
      collectorName: submission.collectorName,
      collectorHandle: `@${submission.collectorName.toLowerCase().replace(/\s+/g, '_')}`,
      collectorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      rarity: submission.rarity,
      year: submission.year,
      shortDescription: submission.shortDescription,
      imageUrl: submission.imageUrl,
      upvotes: 1,
      hasUpvoted: true,
      hype: 99.8,
      currentStatus: '👑 #1 Wall of Fame',
      spotPrice: submission.price,
      inductedAt: newInductedAt, // RESETS timer to 0!
    });

    setIsTakeModalOpen(false);

    // Toast notification
    setSuccessToast(
      `Induction complete! "${submission.carName}" is now #1 on THE WALL OF FAME at $${submission.price.toFixed(2)}! Timer reset to 0s.`
    );
    setTimeout(() => {
      setSuccessToast(null);
    }, 5000);
  };

  // Reset Demo
  const handleResetDemo = () => {
    const resetTime = Date.now() - INITIAL_DEMO_TIME_OFFSET_MS;
    setHistory(DEFAULT_INITIAL_HISTORY);
    setPost({
      ...DEFAULT_POST,
      inductedAt: resetTime,
    });
    localStorage.removeItem('diecast_spotlight_history');
    localStorage.removeItem('diecast_spotlight_post');
    setSuccessToast('Demo reset: Wall of Fame returned to Alex ($7.50) & 1971 Datsun 240Z');
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-[#e6e8ee] carbon-grid flex flex-col justify-between selection:bg-[#f59e0b] selection:text-black">
      {/* Toast Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 inset-x-4 max-w-md mx-auto z-50 p-3.5 rounded-xl bg-gradient-to-r from-amber-950/90 via-[#1e1b10] to-black/90 border border-[#f59e0b]/60 shadow-2xl shadow-[#f59e0b]/20 text-white text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#f59e0b] shrink-0" />
              <span>{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-neutral-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <Header
        onResetDemo={handleResetDemo}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        currentSpotPrice={currentSpotPrice}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 md:py-8 flex flex-col justify-center">
        {/* Wall of Fame Hero Banner */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 mb-2">
            <Crown className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#f59e0b]">
              The Official Wall of Fame
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl tracking-wider uppercase text-white drop-shadow-md">
            THE WALL OF FAME
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-md mx-auto font-medium">
            Upload your Hot Wheels photo & outbid the spot to immortalize your casting as #1
          </p>
        </div>

        {/* Desktop Two-Column / Mobile Stacked Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* ========================================================================= */}
          {/* LEFT: Wall of Fame Inductee Social Post with Live Spot Timer              */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col">
            <CollectorCarPostCard
              post={post}
              onUpvote={handleUpvote}
              onOpenPutOnWallModal={handleOpenPutOnWallModal}
              onOpenShareModal={() => setIsShareModalOpen(true)}
            />
          </div>

          {/* ========================================================================= */}
          {/* RIGHT: Spot History (Descending order • Top amount at top)                */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col">
            <SpotHistoryList
              history={history}
              currentHolder={currentHolder}
            />
          </div>
        </div>
      </main>

      {/* Put On The Wall Modal with Real Photo Upload & Price Editor */}
      <TakeSpotModal
        isOpen={isTakeModalOpen}
        onClose={() => setIsTakeModalOpen(false)}
        currentSpotPrice={currentSpotPrice}
        initialPrice={modalInitialPrice}
        onConfirmPutOnWall={handleConfirmPutOnWall}
      />

      {/* Share in Any Media Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        post={post}
      />

      {/* Minimal Wall of Fame Footer */}
      <footer className="border-t border-[#f59e0b]/20 py-4 px-4 sm:px-6 text-center text-xs text-neutral-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 justify-center">
            <Award className="w-3.5 h-3.5 text-[#f59e0b]" />
            <strong className="text-white">Diecast Spotlight</strong> — THE WALL OF FAME
          </span>
          <span className="text-neutral-400 text-[11px] font-mono">
            Live Spot Reign Timer • Top Amount Descending History
          </span>
        </div>
      </footer>
    </div>
  );
}
