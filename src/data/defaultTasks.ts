import { CleaningTask, CleaningHistory } from '../types';

// 기준일: 2026-06-30 (현재 local_time 기준)
export const DEFAULT_TASKS: CleaningTask[] = [
  {
    id: 'def-1',
    title: '화장실 물청소 및 배수구 소독',
    category: 'regular',
    subCategory: '욕실',
    cycleDays: 7,
    lastCleanedDate: '2026-06-25',
    nextDueDate: '2026-07-02',
    isCustom: false,
    importance: 'high',
    iconName: 'Droplet',
    notes: '베이킹소다와 식초를 배수구에 붓고 뜨거운 물로 소독하세요. 바닥 물때는 솔로 닦아냅니다.'
  },
  {
    id: 'def-2',
    title: '거실 및 방 바닥 청소기 & 물걸레',
    category: 'regular',
    subCategory: '거실',
    cycleDays: 3,
    lastCleanedDate: '2026-06-27',
    nextDueDate: '2026-06-30', // 오늘 예정
    isCustom: false,
    importance: 'high',
    iconName: 'Sparkles',
    notes: '구석구석 먼지를 먼저 흡입한 후 물걸레 청소포로 마무리합니다.'
  },
  {
    id: 'def-3',
    title: '주방 렌지후드 필터 기름때 세척',
    category: 'regular',
    subCategory: '주방',
    cycleDays: 30,
    lastCleanedDate: '2026-05-20',
    nextDueDate: '2026-06-19', // 지남 (미뤄짐)
    isCustom: false,
    importance: 'medium',
    iconName: 'Flame',
    notes: '뜨거운 물에 과탄산소다를 풀어 15분간 불린 후 중성세제로 헹궈냅니다.'
  },
  {
    id: 'def-4',
    title: '침대 침구류 먼지 털기 및 세탁',
    category: 'regular',
    subCategory: '침실',
    cycleDays: 14,
    lastCleanedDate: '2026-06-20',
    nextDueDate: '2026-07-04',
    isCustom: false,
    importance: 'medium',
    iconName: 'Bed',
    notes: '알레르기 방지를 위해 뜨거운 물(60도 이상) 코스로 세탁하고 일광건조합니다.'
  },
  {
    id: 'def-5',
    title: '세탁기 세탁조 내부 살균 세척',
    category: 'appliance',
    subCategory: '세탁기',
    cycleDays: 90,
    lastCleanedDate: '2026-04-01',
    nextDueDate: '2026-06-30', // 오늘 예정
    isCustom: false,
    importance: 'high',
    iconName: 'WashingMachine',
    notes: '전용 세탁조 클리너를 넣고 통세척 코스(또는 삶음 코스)를 가동합니다. 세제통과 배수 필터도 탈거하여 닦아주세요.'
  },
  {
    id: 'def-6',
    title: '에어컨 극세필터 물세척',
    category: 'appliance',
    subCategory: '에어컨',
    cycleDays: 30,
    lastCleanedDate: '2026-06-25',
    nextDueDate: '2026-07-25',
    isCustom: false,
    importance: 'medium',
    iconName: 'Wind',
    notes: '전면 그릴을 열고 프리필터를 꺼내 샤워기 물살로 먼지를 씻어내고 그늘에서 완전히 말려 장착하세요.'
  },
  {
    id: 'def-7',
    title: '공기청정기 프리필터 청소 & 집진필터 점검',
    category: 'appliance',
    subCategory: '공기청정기',
    cycleDays: 14,
    lastCleanedDate: '2026-06-10',
    nextDueDate: '2026-06-24', // 지남
    isCustom: false,
    importance: 'high',
    iconName: 'Fan',
    notes: '겉면 프리필터의 먼지는 청소기로 흡입하거나 물로 세척하세요. 헤파필터는 교체 주기를 확인합니다.'
  },
  {
    id: 'def-8',
    title: '냉장고 선반 탈거 및 내부 소독',
    category: 'appliance',
    subCategory: '냉장고',
    cycleDays: 60,
    lastCleanedDate: '2026-05-15',
    nextDueDate: '2026-07-14',
    isCustom: false,
    importance: 'low',
    iconName: 'Refrigerator',
    notes: '먹다 남은 유통기한 지난 음식을 정리하고 소주나 소독용 에탄올을 분무하여 행주로 닦아줍니다.'
  }
];

export const DEFAULT_HISTORY: CleaningHistory[] = [
  {
    id: 'hist-1',
    taskId: 'def-2',
    taskTitle: '거실 및 방 바닥 청소기 & 물걸레',
    category: 'regular',
    subCategory: '거실',
    completedDate: '2026-06-27',
    notes: '깨끗하게 청소 완료 및 환기 30분 진행',
    cycleDays: 3
  },
  {
    id: 'hist-2',
    taskId: 'def-1',
    taskTitle: '화장실 물청소 및 배수구 소독',
    category: 'regular',
    subCategory: '욕실',
    completedDate: '2026-06-25',
    notes: '배수구 락스 살균 소독 완료',
    cycleDays: 7
  },
  {
    id: 'hist-3',
    taskId: 'def-6',
    taskTitle: '에어컨 극세필터 물세척',
    category: 'appliance',
    subCategory: '에어컨',
    completedDate: '2026-06-25',
    notes: '본격 여름 대비 필터 청소 후 건조 조립',
    cycleDays: 3
  },
  {
    id: 'hist-4',
    taskId: 'def-2',
    taskTitle: '거실 및 방 바닥 청소기 & 물걸레',
    category: 'regular',
    subCategory: '거실',
    completedDate: '2026-06-24',
    notes: '로봇청소기 가동 후 미진한 곳 직접 물걸레질',
    cycleDays: 3
  },
  {
    id: 'hist-5',
    taskId: 'def-2',
    taskTitle: '거실 및 방 바닥 청소기 & 물걸레',
    category: 'regular',
    subCategory: '거실',
    completedDate: '2026-06-21',
    notes: '먼지가 많아 청소기 집중 가동',
    cycleDays: 3
  },
  {
    id: 'hist-6',
    taskId: 'def-4',
    taskTitle: '침대 침구류 먼지 털기 및 세탁',
    category: 'regular',
    subCategory: '침실',
    completedDate: '2026-06-20',
    notes: '이불커버 및 베개커버 모두 탈수 세탁',
    cycleDays: 14
  },
  {
    id: 'hist-7',
    taskId: 'def-1',
    taskTitle: '화장실 물청소 및 배수구 소독',
    category: 'regular',
    subCategory: '욕실',
    completedDate: '2026-06-18',
    notes: '줄눈 물때 집중 제거',
    cycleDays: 7
  },
  {
    id: 'hist-8',
    taskId: 'def-3',
    taskTitle: '주방 렌지후드 필터 기름때 세척',
    category: 'regular',
    subCategory: '주방',
    completedDate: '2026-05-20',
    notes: '처음으로 과탄산소다 세척해봄. 대만족.',
    cycleDays: 30
  }
];
