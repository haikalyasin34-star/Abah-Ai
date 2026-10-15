export type Gender = 'male' | 'female';

export interface UserProfile {
  name: string;
  gender: Gender;
  language: 'id' | 'en';
  createdAt: number;
}

export type AIMode = 'standard' | 'math' | 'coding' | 'quick';

export interface AttachedImage {
  data: string; // base64
  mimeType: string;
  previewUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  image?: {
    data: string;
    mimeType: string;
  };
  isStreaming?: boolean;
  error?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  mode: AIMode;
}

export interface PopularQuestion {
  id: string;
  subject: string;
  iconType: 'math' | 'science' | 'physics' | 'coding' | 'indonesian' | 'english' | 'history' | 'economy';
  shortLabel: string;
  fullQuestion: string;
  badgeColor: string;
}
