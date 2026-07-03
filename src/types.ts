export interface CleaningTask {
  id: string;
  title: string;
  category: 'regular' | 'appliance';
  subCategory: string; // "욕실", "거실", "주방", "침실", "가전", "기타" 등
  cycleDays: number; // 주기 (일 단위)
  lastCleanedDate: string; // "YYYY-MM-DD"
  nextDueDate: string; // "YYYY-MM-DD"
  isCustom: boolean;
  notes?: string;
  importance: 'high' | 'medium' | 'low';
  iconName: string;
}

export interface CleaningHistory {
  id: string;
  taskId: string;
  taskTitle: string;
  category: 'regular' | 'appliance';
  subCategory: string;
  completedDate: string; // "YYYY-MM-DD"
  notes?: string;
  cycleDays: number;
}

export type TabType = 'dashboard' | 'checklist' | 'appliances' | 'stats' | 'guide';
