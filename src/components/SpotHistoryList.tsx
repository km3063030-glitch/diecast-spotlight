import React from 'react';
import { SpotHistoryItem } from '../types';
import { Crown, Sparkles, Award, ArrowDownNarrowWide } from 'lucide-react';
import { motion } from 'motion/react';

interface SpotHistoryListProps {
  history: SpotHistoryItem[];
  currentHolder: string;
}

export const SpotHistoryList: React.FC<SpotHistoryListProps> = ({
  history,
  currentHolder,
}) => {
  // Sort descending by amount so the top amount is strictly at the top
  const sortedHistory = [...history].sort((a, b) => b.amount - a.amount);
  const highestItem = sortedHistory[0];
  const lowestItem = sortedHistory[sortedHistory.length - 1];

  return (
    <div className="w-full rounded-2xl bg-[#0e1017]/95 border-2 border-[#f59e0b]/30 p-5 sm:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col h-full">
      {/* Subtle gold / bronze ambient glows */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#f59e0b]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d97706]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#f59e0b]/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-[#f59e0b]" />
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-wider uppercase text-white">
              SPOT HISTORY
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-medium flex items-center gap-1">
            <ArrowDownNarrowWide className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Ranked in descending order • Top amount at top</span>
          </p>
        </div>

        {/* Live counter & sort tag */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[11px] text-[#f59e0b] font-mono font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
          <span>{sortedHistory.length} Spots (Desc)</span>
        </div>
      </div>

      {/* History Items List (Descending Order: Top Amount at the Top) */}
      <div className="relative flex-1 flex flex-col justify-start space-y-2.5 my-auto">
        {/* Subtle connector spine linking spots */}
        <div className="absolute left-[18px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#f59e0b] via-[#f59e0b]/30 to-white/5" />

        {sortedHistory.map((item, index) => {
          const isTopRank = index === 0;

          return (
            <motion.div
              key={item.id || `${item.name}-${item.amount}-${index}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className={`relative z-10 flex items-center justify-between px-3.5 sm:px-4 py-3 rounded-xl transition-all ${
                isTopRank
                  ? 'bg-gradient-to-r from-[#f59e0b]/25 via-[#ff5500]/15 to-[#161822] border-2 border-[#f59e0b] shadow-xl shadow-[#f59e0b]/20'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-neutral-400'
              }`}
            >
              {/* Left: Rank & Collector Name */}
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-all ${
                    isTopRank
                      ? 'bg-gradient-to-br from-[#f59e0b] to-[#d97706] text-black shadow-md shadow-[#f59e0b]/40 ring-2 ring-[#f59e0b]/50'
                      : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  {isTopRank ? (
                    <Crown className="w-4 h-4 fill-black text-black" />
                  ) : (
                    <span>#{index + 1}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold text-sm sm:text-base ${
                      isTopRank ? 'text-white font-bold' : 'text-neutral-300'
                    }`}
                  >
                    {item.name}
                  </span>

                  {isTopRank && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f59e0b]/25 text-[#f59e0b] border border-[#f59e0b]/50">
                      <Sparkles className="w-2.5 h-2.5" />
                      Top Spot
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Amount (e.g. Alex — $7.50) */}
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 font-mono text-xs">—</span>
                <span
                  className={`font-mono font-bold tracking-tight ${
                    isTopRank
                      ? 'text-lg sm:text-xl text-[#f59e0b] font-black'
                      : 'text-sm sm:text-base text-neutral-300'
                  }`}
                >
                  ${item.amount.toFixed(2)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Summary Bar */}
      <div className="mt-4 pt-3 border-t border-[#f59e0b]/20 flex items-center justify-between text-xs text-neutral-400">
        <span className="flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span>Top Holder:</span>
          <strong className="text-white font-bold">{highestItem?.name || currentHolder}</strong>
        </span>
        <span className="font-mono text-[#f59e0b] font-semibold">
          High: ${highestItem?.amount.toFixed(2)} • Floor: ${lowestItem?.amount.toFixed(2)}
        </span>
      </div>
    </div>
  );
};
