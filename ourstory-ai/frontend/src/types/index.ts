export type MemoryType = 'FIRST_MEETING' | 'MEMORY' | 'HER_INFO' | 'HIS_INFO' | 'EVENT' | 'NOTE';

export interface RelationshipMemory {
  id: number;
  type: MemoryType;
  title: string;
  content: string;
  date?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemoryRequest {
  type: MemoryType;
  title: string;
  content: string;
  date?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  memoriesUsed?: number;
}

export interface ChatResponse {
  message: string;
  reply: string;
  timestamp: string;
  memoriesUsed: number;
  model: string;
}

export interface MemoryStats {
  total: number;
  FIRST_MEETING: number;
  MEMORY: number;
  HER_INFO: number;
  HIS_INFO: number;
  EVENT: number;
  NOTE: number;
}

export const MEMORY_TYPE_CONFIG: Record<MemoryType, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  FIRST_MEETING: {
    label: 'First Meeting',
    emoji: '✨',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  MEMORY: {
    label: 'Memory',
    emoji: '💝',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
  HER_INFO: {
    label: 'Her Info',
    emoji: '🌸',
    color: 'text-pink-700',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
  },
  HIS_INFO: {
    label: 'His Info',
    emoji: '💙',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  EVENT: {
    label: 'Event',
    emoji: '🎉',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  NOTE: {
    label: 'Note',
    emoji: '📝',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
  },
};
