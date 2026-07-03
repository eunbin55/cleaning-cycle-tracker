import { CleaningTask, CleaningHistory } from '../types';

// 날짜를 "YYYY-MM-DD" 문자열로 변환
export const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 날짜 문자열 파싱
export const parseDateString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// 두 날짜 간의 일수 차이 계산 (date2 - date1)
export const getDaysDifference = (dateStr1: string, dateStr2: string): number => {
  const d1 = parseDateString(dateStr1);
  const d2 = parseDateString(dateStr2);
  
  // 시간 부분 초기화하여 순수 일수만 비교
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

// 오늘 날짜 문자열 반환
export const getTodayStr = (): string => {
  return formatDateString(new Date());
};

// 날짜에 특정 일수 더하기
export const addDays = (dateStr: string, days: number): string => {
  const date = parseDateString(dateStr);
  date.setDate(date.getDate() + days);
  return formatDateString(date);
};

// 태스크 상태 계산
export type TaskStatus = 'overdue' | 'due_today' | 'upcoming' | 'clean';

export const getTaskStatus = (task: CleaningTask, todayStr: string = getTodayStr()): TaskStatus => {
  const daysDiff = getDaysDifference(todayStr, task.nextDueDate);
  if (daysDiff < 0) return 'overdue';
  if (daysDiff === 0) return 'due_today';
  if (daysDiff <= 2) return 'upcoming'; // 2일 이내 다가옴
  return 'clean';
};

export const getStatusLabel = (status: TaskStatus): string => {
  switch (status) {
    case 'overdue': return '지연됨';
    case 'due_today': return '오늘 청소';
    case 'upcoming': return '임박';
    case 'clean': return '완료됨/여유';
  }
};

// 오늘 날짜 기준으로 디폴트 데이터 날짜 조정하는 헬퍼
// 이 앱이 언제 실행되더라도 최상의 몰입감을 느낄 수 있도록 설정
export const getInitialData = () => {
  const today = new Date();
  const todayStr = formatDateString(today);
  
  // 오프셋 계산 (2026-06-30이 원래 기준)
  const originalBaseStr = '2026-06-30';
  const offsetDays = getDaysDifference(originalBaseStr, todayStr);
  
  // 디폴트 태스크 날짜 시프트
  const shiftTaskDates = (task: CleaningTask): CleaningTask => {
    return {
      ...task,
      lastCleanedDate: addDays(task.lastCleanedDate, offsetDays),
      nextDueDate: addDays(task.nextDueDate, offsetDays),
    };
  };

  // 디폴트 이력 날짜 시프트
  const shiftHistoryDates = (hist: CleaningHistory): CleaningHistory => {
    return {
      ...hist,
      completedDate: addDays(hist.completedDate, offsetDays),
    };
  };

  return {
    offsetDays,
    shiftTaskDates,
    shiftHistoryDates
  };
};

// 가용한 아이콘 후보군
export const AVAILABLE_ICONS = [
  { name: 'Sparkles', label: '반짝임' },
  { name: 'Droplet', label: '물청소' },
  { name: 'Flame', label: '주방/열' },
  { name: 'Bed', label: '침구류' },
  { name: 'WashingMachine', label: '세탁기' },
  { name: 'Wind', label: '에어컨/바람' },
  { name: 'Fan', label: '공기청정기/팬' },
  { name: 'Refrigerator', label: '냉장고' },
  { name: 'Tv', label: '가전/티비' },
  { name: 'Lightbulb', label: '전등/기타' },
  { name: 'Coffee', label: '식기/커피' },
  { name: 'Home', label: '일반 집안일' },
];

export const SUB_CATEGORIES = {
  regular: ['욕실', '거실', '주방', '침실', '베란다/현관', '기타'],
  appliance: ['세탁기', '에어컨', '공기청정기', '냉장고', '청소기', '식기세척기', '정수기', '기타']
};
