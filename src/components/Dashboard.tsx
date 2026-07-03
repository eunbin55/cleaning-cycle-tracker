import React, { useState } from 'react';
import { CleaningTask, CleaningHistory } from '../types';
import { getTaskStatus, getDaysDifference, getTodayStr, TaskStatus } from '../utils/cleaningUtils';
import { CleanIcon } from './CleanIcon';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  Check, 
  Calendar, 
  BookOpen,
  ArrowRight,
  Droplet
} from 'lucide-react';

interface DashboardProps {
  tasks: CleaningTask[];
  onCompleteTask: (taskId: string, notes?: string) => void;
  onNavigate: (tab: 'checklist' | 'appliances' | 'stats' | 'guide') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, onCompleteTask, onNavigate }) => {
  const [selectedTaskIdForMemo, setSelectedTaskIdForMemo] = useState<string | null>(null);
  const [completeMemo, setCompleteMemo] = useState('');

  const todayStr = getTodayStr();

  // 상태별 분류
  const overdueTasks = tasks.filter(t => getTaskStatus(t, todayStr) === 'overdue');
  const dueTodayTasks = tasks.filter(t => getTaskStatus(t, todayStr) === 'due_today');
  const upcomingTasks = tasks.filter(t => getTaskStatus(t, todayStr) === 'upcoming');
  const totalTasksCount = tasks.length;

  // 전체 청소 점수 계산 (지연 비율 기준)
  const overdueCount = overdueTasks.length;
  const healthScore = totalTasksCount > 0 
    ? Math.max(0, Math.round(100 - (overdueCount / totalTasksCount) * 100))
    : 100;

  // 쾌적도 한마디 매칭
  const getHealthComment = (score: number) => {
    if (score === 100) return '온 집안이 눈이 부시도록 깨끗합니다! ✨ 완벽해요.';
    if (score >= 80) return '매우 쾌적하고 청결하게 관리되고 있어요. 👏';
    if (score >= 60) return '평균적인 관리 상태입니다. 지연된 청소를 조금 시작해볼까요? 🧹';
    return '집안 곳곳이 청소를 기다리고 있어요! 가벼운 환기부터 시작해보세요. 🧼';
  };

  const handleQuickComplete = (taskId: string) => {
    // 메모 작성 활성화
    setSelectedTaskIdForMemo(taskId);
    setCompleteMemo('');
  };

  const submitComplete = (taskId: string) => {
    onCompleteTask(taskId, completeMemo.trim() || undefined);
    setSelectedTaskIdForMemo(null);
    setCompleteMemo('');
  };

  const activeTodoTasks = [...dueTodayTasks, ...overdueTasks];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 웰컴 배너 / 청정 종합 점수 */}
      <div className="bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-xl text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-white/10 relative overflow-hidden">
        {/* 장식용 버블 */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />
 
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <span className="bg-white/15 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10 backdrop-blur-md uppercase tracking-wider">
              우리 집 청결 쾌적도
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-snug">
              {getHealthComment(healthScore)}
            </h2>
            <p className="text-white/70 text-sm">
              정기 청소 및 가전 관리를 포함한 총 {totalTasksCount}개의 항목이 점검 중입니다.
            </p>
          </div>
 
          <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-lg">
            <div className="relative flex items-center justify-center">
              {/* 원형 프로그래스 */}
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  className="stroke-white/10"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  className="stroke-indigo-400 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * healthScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-white">{healthScore}</span>
                <span className="text-[10px] text-indigo-200 font-semibold uppercase">Clean Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* 종합 현황 카드 그리드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('checklist')}
          className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg flex items-center gap-4 cursor-pointer hover:bg-white/15 hover:border-white/20 transition-all group"
        >
          <div className="p-3 bg-rose-500/25 text-rose-300 rounded-xl group-hover:scale-110 transition-transform">
            <AlertCircle size={22} />
          </div>
          <div>
            <p className="text-xs text-white/60 font-semibold">지연된 청소</p>
            <p className="text-xl font-bold text-white">{overdueCount}건</p>
          </div>
        </div>
 
        <div 
          onClick={() => onNavigate('checklist')}
          className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg flex items-center gap-4 cursor-pointer hover:bg-white/15 hover:border-white/20 transition-all group"
        >
          <div className="p-3 bg-amber-500/25 text-amber-300 rounded-xl group-hover:scale-110 transition-transform">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-white/60 font-semibold">오늘 해야 할 청소</p>
            <p className="text-xl font-bold text-white">{dueTodayTasks.length}건</p>
          </div>
        </div>
 
        <div 
          onClick={() => onNavigate('checklist')}
          className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg flex items-center gap-4 cursor-pointer hover:bg-white/15 hover:border-white/20 transition-all group"
        >
          <div className="p-3 bg-indigo-500/25 text-indigo-300 rounded-xl group-hover:scale-110 transition-transform">
            <Calendar size={22} />
          </div>
          <div>
            <p className="text-xs text-white/60 font-semibold">2일 내 예정</p>
            <p className="text-xl font-bold text-white">{upcomingTasks.length}건</p>
          </div>
        </div>
 
        <div 
          onClick={() => onNavigate('appliances')}
          className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg flex items-center gap-4 cursor-pointer hover:bg-white/15 hover:border-white/20 transition-all group"
        >
          <div className="p-3 bg-emerald-500/25 text-emerald-300 rounded-xl group-hover:scale-110 transition-transform">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-xs text-white/60 font-semibold">가전제품 필터/케어</p>
            <p className="text-xl font-bold text-white">
              {tasks.filter(t => t.category === 'appliance').length}건
            </p>
          </div>
        </div>
      </div>
 
      {/* 메인 섹션: 오늘 해야 할 체크리스트 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle className="text-emerald-400" size={20} />
                오늘의 청소 체크리스트
              </h3>
              <p className="text-xs text-white/60 mt-0.5">완료된 항목을 체크하면 다음 일정으로 자동 예약됩니다.</p>
            </div>
            <span className="text-xs bg-white/15 text-white/95 px-2.5 py-1 rounded-full font-bold border border-white/10">
              대기 {activeTodoTasks.length}개
            </span>
          </div>
 
          {activeTodoTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 animate-bounce">
                <Sparkles size={32} />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-white text-base">오늘 해야 할 청소 완료! 🫧</p>
                <p className="text-xs text-white/60 max-w-sm">
                  모든 청소와 필터 주기 일정이 최적의 상태입니다. 쾌적한 하루를 즐겨보세요!
                </p>
              </div>
              <button 
                onClick={() => onNavigate('checklist')}
                className="text-xs text-indigo-300 hover:text-indigo-200 font-semibold flex items-center gap-1 hover:underline pt-2"
              >
                전체 청소 일정 관리하러 가기 <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {activeTodoTasks.map((task) => {
                const status = getTaskStatus(task, todayStr);
                const isOverdue = status === 'overdue';
                const daysLate = isOverdue ? getDaysDifference(task.nextDueDate, todayStr) : 0;
                const isMemoOpen = selectedTaskIdForMemo === task.id;
 
                return (
                  <div key={task.id} className="py-4 first:pt-0 last:pb-0 group transition-all">
                    <div className="flex items-start gap-4">
                      {/* 체크박스 */}
                      <button
                        onClick={() => handleQuickComplete(task.id)}
                        className={`mt-1 w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                          isMemoOpen
                            ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                            : 'border-white/30 text-transparent hover:border-indigo-400 hover:bg-white/10'
                        }`}
                      >
                        <Check size={14} className={isMemoOpen ? 'stroke-[3]' : ''} />
                      </button>
 
                      {/* 정보영역 */}
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            task.category === 'appliance' 
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/25' 
                              : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/25'
                          }`}>
                            {task.subCategory}
                          </span>
 
                          {isOverdue ? (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/25 flex items-center gap-0.5 animate-pulse">
                              <AlertCircle size={10} />
                              지연 {daysLate}일째
                            </span>
                          ) : (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/25">
                              오늘 예정
                            </span>
                          )}
 
                          {task.importance === 'high' && (
                            <span className="text-[10px] font-bold text-rose-400 border border-rose-500/30 bg-rose-500/10 px-1.5 rounded">
                              중요도: 상
                            </span>
                          )}
                        </div>
 
                        <h4 className="font-bold text-white text-sm md:text-base group-hover:text-indigo-300 transition-colors">
                          {task.title}
                        </h4>
 
                        {task.notes && (
                          <p className="text-xs text-white/70 bg-white/5 p-2.5 rounded-xl border border-dashed border-white/10 mt-1">
                            💡 {task.notes}
                          </p>
                        )}
 
                        {/* 인라인 완료 메모 입력 폼 */}
                        {isMemoOpen && (
                          <div className="mt-3 bg-indigo-950/45 border border-indigo-500/20 rounded-xl p-3 space-y-2 animate-slide-down">
                            <label className="block text-xs font-bold text-indigo-300">
                              ✍️ 청소 완료 기록 작성 (선택)
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="예) 깔끔히 완료, 필터 물세척 등 기록..."
                                value={completeMemo}
                                onChange={(e) => setCompleteMemo(e.target.value)}
                                className="flex-1 bg-white/10 px-3 py-1.5 text-xs rounded-lg border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-400 text-white placeholder-white/40"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') submitComplete(task.id);
                                }}
                              />
                              <button
                                onClick={() => submitComplete(task.id)}
                                className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-0.5 flex-shrink-0 cursor-pointer"
                              >
                                <Check size={12} />
                                저장
                              </button>
                              <button
                                onClick={() => setSelectedTaskIdForMemo(null)}
                                className="px-2 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg text-xs transition-colors flex-shrink-0 cursor-pointer"
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
 
                      {/* 아이콘 */}
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-all flex-shrink-0">
                        <CleanIcon name={task.iconName} size={20} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
 
        {/* 오른쪽 측면 패널: 가전제품 케어 알리미 및 꿀팁 */}
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Droplet className="text-purple-400" size={18} />
              가전제품 점검 알림
            </h3>
            <p className="text-xs text-white/60">필터 교체 및 내부 세척 주기가 도래한 가전제품을 확인하세요.</p>
 
            <div className="space-y-3">
              {tasks.filter(t => t.category === 'appliance').slice(0, 3).map((appTask) => {
                const status = getTaskStatus(appTask, todayStr);
                const isWarn = status === 'overdue' || status === 'due_today' || status === 'upcoming';
                const daysDiff = getDaysDifference(todayStr, appTask.nextDueDate);
 
                return (
                  <div key={appTask.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isWarn ? 'bg-purple-500/25 text-purple-300' : 'bg-white/5 text-white/40'
                      }`}>
                        <CleanIcon name={appTask.iconName} size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{appTask.title}</p>
                        <p className="text-[10px] text-white/50">서브분류: {appTask.subCategory}</p>
                      </div>
                    </div>
 
                    <div className="text-right flex-shrink-0">
                      {daysDiff < 0 ? (
                        <span className="text-[10px] font-extrabold text-rose-300 bg-rose-500/20 border border-rose-500/25 px-2 py-1 rounded-full">
                          {Math.abs(daysDiff)}일 초과
                        </span>
                      ) : daysDiff === 0 ? (
                        <span className="text-[10px] font-extrabold text-amber-300 bg-amber-500/20 border border-amber-500/25 px-2 py-1 rounded-full">
                          오늘
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-white/60 bg-white/5 px-2 py-1 rounded-full border border-white/10">
                          {daysDiff}일 남음
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
 
              <button
                onClick={() => onNavigate('appliances')}
                className="w-full text-center py-2.5 text-xs font-bold text-purple-300 hover:text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl transition-all border border-purple-500/20 cursor-pointer"
              >
                가전 점검 주기 전체보기
              </button>
            </div>
          </div>
 
          {/* 퀵 꿀팁 배너 */}
          <div className="bg-gradient-to-br from-indigo-500/80 to-purple-600/80 backdrop-blur-xl border border-white/10 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-2 bottom-2 text-white/5 pointer-events-none">
              <BookOpen size={90} className="transform rotate-12" />
            </div>
            <div className="relative z-10 space-y-3">
              <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                청소 보감 💡
              </span>
              <h4 className="font-bold text-sm">과탄산소다 200% 활용법</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                가전 필터나 기름때 렌지후드를 세척할 때는 뜨거운 물에 과탄산소다를 풀어 녹인 뒤 필터를 10~15분간 가만히 담가두면 기름때가 마법처럼 저절로 녹아내립니다!
              </p>
              <button
                onClick={() => onNavigate('guide')}
                className="text-xs font-bold flex items-center gap-1 text-indigo-200 hover:text-indigo-100 hover:underline pt-1 cursor-pointer"
              >
                더 많은 살림 가이드 보기 <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
