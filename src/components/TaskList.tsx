import React, { useState } from 'react';
import { CleaningTask } from '../types';
import { getTaskStatus, getDaysDifference, getTodayStr, getStatusLabel, TaskStatus } from '../utils/cleaningUtils';
import { CleanIcon } from './CleanIcon';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  Edit, 
  Check, 
  RotateCcw, 
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface TaskListProps {
  tasks: CleaningTask[];
  onCompleteTask: (taskId: string, notes?: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: CleaningTask) => void;
  onAddNewClick: () => void;
  defaultCategory?: 'all' | 'regular' | 'appliance';
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onCompleteTask, 
  onDeleteTask, 
  onEditTask, 
  onAddNewClick,
  defaultCategory = 'all'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'regular' | 'appliance'>(defaultCategory);
  const [statusFilter, setStatusFilter] = useState<'all' | 'overdue' | 'due_today' | 'upcoming' | 'clean'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'importance' | 'cycle'>('dueDate');
  const [selectedTaskForNotes, setSelectedTaskForNotes] = useState<string | null>(null);
  const [quickMemo, setQuickMemo] = useState('');

  const todayStr = getTodayStr();

  // 필터링 적용
  const filteredTasks = tasks.filter((task) => {
    // 1. 검색어 필터
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. 카테고리 필터
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    
    // 3. 상태 필터
    const status = getTaskStatus(task, todayStr);
    const matchesStatus = statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // 정렬 적용
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return a.nextDueDate.localeCompare(b.nextDueDate);
    }
    
    if (sortBy === 'importance') {
      const impWeight = { high: 3, medium: 2, low: 1 };
      return impWeight[b.importance] - impWeight[a.importance];
    }
    
    if (sortBy === 'cycle') {
      return a.cycleDays - b.cycleDays;
    }
    
    return 0;
  });

  const getImportanceBadge = (imp: 'high' | 'medium' | 'low') => {
    switch (imp) {
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-rose-500/20 text-rose-300 border border-rose-500/25">중요: 상</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-amber-500/20 text-amber-300 border border-amber-500/25">중요: 중</span>;
      case 'low':
        return <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/25">중요: 하</span>;
    }
  };

  const getCycleLabel = (days: number) => {
    if (days % 30 === 0) return `매 ${days / 30}개월`;
    if (days % 7 === 0) return `매 ${days / 7}주일`;
    return `매 ${days}일`;
  };

  const handleCompleteClick = (taskId: string) => {
    setSelectedTaskForNotes(taskId);
    setQuickMemo('');
  };

  const submitComplete = (taskId: string) => {
    onCompleteTask(taskId, quickMemo.trim() || undefined);
    setSelectedTaskForNotes(null);
    setQuickMemo('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 헤더 및 추가 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            {categoryFilter === 'appliance' ? '🔌 가전제품 청소 & 주기 점검' : '📅 전체 청소 주기 & 체크리스트'}
          </h2>
          <p className="text-xs text-white/60 mt-1">
            {categoryFilter === 'appliance' 
              ? '가전제품의 내부 청소, 살균 세척, 필터 교체 주기를 정확하게 추적하고 관리합니다.'
              : '나의 소중한 청소 주기와 가전제품 정기 점검 일정을 통합하여 꼼꼼하게 관리합니다.'}
          </p>
        </div>

        <button
          onClick={onAddNewClick}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 self-start sm:self-auto transition-all transform active:scale-95 cursor-pointer"
        >
          <Plus size={16} className="stroke-[3]" />
          새 주기 일정 추가
        </button>
      </div>

      {/* 필터 및 검색 바 */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-4 md:p-5 space-y-4 shadow-lg text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
            <input
              type="text"
              placeholder="항목이나 카테고리 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all bg-white/5 text-white placeholder-white/40"
            />
          </div>

          {/* 카테고리 분류 탭 */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-semibold text-white/60">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                categoryFilter === 'all' ? 'bg-white/20 text-white shadow-sm font-bold border border-white/10' : 'hover:text-white'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setCategoryFilter('regular')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                categoryFilter === 'regular' ? 'bg-white/20 text-white shadow-sm font-bold border border-white/10' : 'hover:text-white'
              }`}
            >
              일반 청소
            </button>
            <button
              onClick={() => setCategoryFilter('appliance')}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                categoryFilter === 'appliance' ? 'bg-white/20 text-white shadow-sm font-bold border border-white/10' : 'hover:text-white'
              }`}
            >
              가전제품
            </button>
          </div>

          {/* 정렬 셀렉터 */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-white/50" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all cursor-pointer"
            >
              <option className="bg-[#2a2f3a] text-white" value="dueDate">⏳ 다음 예정일순</option>
              <option className="bg-[#2a2f3a] text-white" value="importance">🔥 중요도 높은순</option>
              <option className="bg-[#2a2f3a] text-white" value="cycle">🔄 청소 주기 짧은순</option>
            </select>
          </div>
        </div>

        {/* 세부 상태 필터 */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10 text-xs">
          <span className="text-white/50 font-medium self-center mr-1">상태 필터:</span>
          {[
            { id: 'all', label: '전체보기' },
            { id: 'overdue', label: '지연됨 🔴' },
            { id: 'due_today', label: '오늘 예정 🟡' },
            { id: 'upcoming', label: '2일 내 임박 🔵' },
            { id: 'clean', label: '여유 🟢' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id as any)}
              className={`px-3 py-1.5 rounded-full border transition-all font-semibold cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-200 font-bold'
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* 태스크 목록 그리드 */}
      {sortedTasks.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center space-y-4 shadow-lg text-white">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 mx-auto">
            <Search size={22} />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-white text-base">검색 조건에 맞는 청소 일정이 없습니다.</p>
            <p className="text-xs text-white/60">필터를 지우거나 새로운 청소 일정을 등록해보세요.</p>
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setStatusFilter('all');
            }}
            className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-white/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            필터 및 검색 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedTasks.map((task) => {
            const status = getTaskStatus(task, todayStr);
            const isOverdue = status === 'overdue';
            const daysLeft = getDaysDifference(todayStr, task.nextDueDate);
            const isMemoOpen = selectedTaskForNotes === task.id;

            // 상태별 시각 테두리
            const statusCardStyles = 
              status === 'overdue' 
                ? 'border-rose-500/30 bg-rose-500/10 hover:border-rose-500/40' 
                : status === 'due_today'
                ? 'border-amber-500/30 bg-amber-500/10 hover:border-amber-500/40'
                : status === 'upcoming'
                ? 'border-indigo-500/20 hover:border-indigo-500/30 bg-white/5'
                : 'border-white/10 hover:border-white/20 bg-white/5';

            return (
              <div 
                key={task.id} 
                className={`bg-white/10 backdrop-blur-xl rounded-3xl border p-5 flex flex-col justify-between transition-all shadow-lg text-white ${statusCardStyles}`}
              >
                <div className="space-y-3">
                  {/* 카드 상단 배지 및 액션 */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        task.category === 'appliance' 
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/25' 
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/25'
                      }`}>
                        {task.subCategory}
                      </span>
                      {getImportanceBadge(task.importance)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* 편집 */}
                      <button
                        onClick={() => onEditTask(task)}
                        className="p-1.5 rounded-lg text-white/50 hover:text-indigo-300 hover:bg-white/5 transition-all cursor-pointer"
                        title="수정하기"
                      >
                        <Edit size={14} />
                      </button>
                      {/* 삭제 */}
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 rounded-lg text-white/50 hover:text-rose-300 hover:bg-white/5 transition-all cursor-pointer"
                        title="삭제하기"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* 카드 메인 타이틀 및 주기 */}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/70 flex-shrink-0">
                      <CleanIcon name={task.iconName} size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm md:text-base leading-snug">
                        {task.title}
                      </h4>
                      <p className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                        <Clock size={12} className="text-indigo-300" />
                        주기: {getCycleLabel(task.cycleDays)}
                      </p>
                    </div>
                  </div>

                  {/* 청소 요령 설명 */}
                  {task.notes && (
                    <div className="bg-white/5 p-3 rounded-xl border border-dashed border-white/10">
                      <p className="text-xs text-white/70 leading-relaxed">
                        💡 {task.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* 카드 하단 날짜 정보 및 완료 액션 */}
                <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-semibold tracking-wider">이전 청소일</p>
                      <p className="font-bold text-white/80">{task.lastCleanedDate || '기록 없음'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/40 uppercase font-semibold tracking-wider">다음 예정일</p>
                      <p className={`font-bold ${isOverdue ? 'text-rose-300 animate-pulse' : 'text-white/80'}`}>
                        {task.nextDueDate}
                      </p>
                    </div>
                  </div>

                  {/* 날짜 타이머 바 */}
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden flex border border-white/5">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverdue 
                          ? 'bg-rose-500 w-full' 
                          : daysLeft === 0 
                          ? 'bg-amber-500 w-full'
                          : daysLeft <= 2 
                          ? 'bg-indigo-400 w-3/4'
                          : 'bg-emerald-400 w-1/3'
                      }`}
                    />
                  </div>

                  <div className="flex justify-between items-center gap-2">
                    <span className={`text-xs font-bold flex items-center gap-1 ${
                      isOverdue 
                        ? 'text-rose-300' 
                        : daysLeft === 0
                        ? 'text-amber-300'
                        : daysLeft <= 2
                        ? 'text-indigo-300'
                        : 'text-emerald-300'
                    }`}>
                      <AlertCircle size={14} />
                      {daysLeft < 0 
                        ? `${Math.abs(daysLeft)}일 미뤄짐 🚨` 
                        : daysLeft === 0 
                        ? '오늘 청소일! 🧹' 
                        : `${daysLeft}일 후 청소`}
                    </span>

                    {/* 완료 체크 버튼 */}
                    <button
                      onClick={() => handleCompleteClick(task.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                        isMemoOpen
                          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-white'
                      }`}
                    >
                      <Check size={12} className="stroke-[3]" />
                      청소 완료
                    </button>
                  </div>

                  {/* 완료 메모 폼 */}
                  {isMemoOpen && (
                    <div className="mt-1 bg-indigo-950/45 border border-indigo-500/20 rounded-xl p-3 space-y-2 animate-slide-down">
                      <label className="block text-xs font-bold text-indigo-300">✍️ 청소 이력에 남길 메모 (선택)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="특이사항을 적어두세요 (예: 구연산 세척)"
                          value={quickMemo}
                          onChange={(e) => setQuickMemo(e.target.value)}
                          className="flex-1 bg-white/10 px-3 py-1.5 text-xs rounded-lg border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-400 text-white placeholder-white/40"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') submitComplete(task.id);
                          }}
                        />
                        <button
                          onClick={() => submitComplete(task.id)}
                          className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg text-xs transition-colors flex-shrink-0 cursor-pointer"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setSelectedTaskForNotes(null)}
                          className="px-2 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg text-xs transition-colors flex-shrink-0 cursor-pointer"
                        >
                          닫기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
