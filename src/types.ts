export type ActiveTab = 'home' | 'ai-tools' | 'convenience' | 'profile';

export type ActiveTool =
  | null
  | 'text-generator'
  | 'translator'
  | 'bg-removal'
  | 'watermark-removal'
  | 'photo-restoration'
  | 'anime-avatar'
  | 'convenience-detail';

export interface HistoryRecord {
  id: string;
  toolName: string;
  timestamp: string;
  inputDescription: string;
  pointsCost: number;
  resultUrl?: string;
  resultText?: string;
}

export interface UserStats {
  nickname: string;
  level: number;
  points: number;
  adsSeenToday: number;
  maxAdsPerDay: number;
}

export interface ConvenienceToolInfo {
  id: string;
  name: string;
  icon: string;
  isFree: boolean;
}
