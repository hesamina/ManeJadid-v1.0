
export enum Priority {
  Low = 'کم',
  Medium = 'متوسط',
  High = 'بالا'
}

export enum TaskCategory {
  Deep = 'تمرکز عمیق',
  Personal = 'شخصی',
  Social = 'اجتماعی',
  Health = 'سلامتی'
}

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  category: TaskCategory;
  completed: boolean;
  createdAt: number;
  date: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  startTime?: string;
  completedAtDate?: string; 
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  completions: string[];
  streak: number;
  frequency: number;
  active: boolean;
}

export interface VisionBoardItem {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  date: string;
}

export interface BookPage {
  id: string;
  title: string;
  author: string;
  content: string;
  date: string;
  saved?: boolean;
}

export interface GratitudeEntry {
  id: string;
  items: string[];
  date: string;
}

export interface UserStats {
  points: number;
  level: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export type ViewType = 'dashboard' | 'habits' | 'planner' | 'gratitude' | 'journal' | 'angels' | 'intuition' | 'settings' | 'vision' | 'spiritualStudy' | 'affirmations' | 'checklist' | 'counter' | 'aiChat';

export interface ViewConfig {
  id: ViewType;
  label: string;
  icon: string;
  enabled: boolean;
}
