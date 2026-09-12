export interface SpotHistoryItem {
  id: string;
  name: string;
  amount: number;
  isCurrent?: boolean;
  carName?: string;
  timestamp?: number;
}

export interface CollectorCarPost {
  id: string;
  carName: string;
  collectorName: string;
  collectorHandle: string;
  collectorAvatar: string;
  rarity: string;
  year: string;
  shortDescription: string;
  imageUrl: string;
  upvotes: number;
  hasUpvoted: boolean;
  hype: number; // e.g. 98.6
  currentStatus: string; // e.g. "👑 #1 on The Wall"
  spotPrice: number;
  inductedAt: number; // Timestamp in ms when this car was put on the spot
}
