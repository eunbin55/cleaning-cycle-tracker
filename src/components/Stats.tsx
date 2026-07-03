import React, { useState } from 'react';
import { CleaningHistory, CleaningTask } from '../types';
import { CleanIcon } from './CleanIcon';
import { getTodayStr, parseDateString } from '../utils/cleaningUtils';
import { 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  Award, 
  RotateCcw, 
  TrendingUp, 
  FileSpreadsheet,
  Trash2,
  ListTodo
} from 'lucide-react';

interface StatsProps {
  history: CleaningHistory[];
  tasks: CleaningTask[];
  onUndoComplete: (historyId: string) => void;
}

export const Stats: React.FC<StatsProps> = ({ history, tasks, onUndoComplete }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`; // "YYYY-MM"
  });

  // 사용 가능한 월 목록 추출 (중복 제거 정렬)
  const availableMonths: string[] = Array.from(
    new Set<string>(
      history.map((h) => {
        const parts = h.completedDate.split('-');
        return `${parts[0]}-${parts[1]}`;
      })
    )
  ).sort((a, b) => b.localeCompare(a)); // 최신순 정렬

  // 만약 이번 달이 아직 목록에 없으면 수동 추가
  const currentYearMonth = (() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  })();
  if (!availableMonths.includes(currentYearMonth)) {
    availableMonths.unshift(currentYearMonth);
  }

  // 선택된 월의 이력 필터링
  const filteredHistory = history.filter((h) => h.completedDate.startsWith(selectedMonth));

  // 1. 이번 달 총 청소 횟수
  const totalCompletedInMonth = filteredHistory.length;

  // 2. 카테고리별 분배 계산 (일반 청소 vs 가전제품 청소)
  const regularCount = filteredHistory.filter(h => h.category === 'regular').length;
  const applianceCount = filteredHistory.filter(h => h.category === 'appliance').length;

  // 3. 서브카테고리별 청소 분포
  const subCategoryStats: Record<string, number> = {};
  filteredHistory.forEach((h) => {
    subCategoryStats[h.subCategory] = (subCategoryStats[h.subCategory] || 0) + 1;
  });

  const sortedSubCategoryStats = Object.entries(subCategoryStats)
    .sort((a, b) => b[1] - a[1]);

  // 4. 월별 청소 추이 데이터 구성 (최근 5개월)
  const getLastMonths = (count: number) => {
    const months = [];
    const date = new Date();
    for (let i = 0; i < count; i++) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      months.unshift(`${year}-${month}`);
      date.setMonth(date.getMonth() - 1);
    }
    return months;
  };

  const last5Months = getLastMonths(5);
  const monthlyCounts = last5Months.map((m) => {
    const count = history.filter((h) => h.completedDate.startsWith(m)).length;
    const [year, month] = m.split('-');
    return {
      monthStr: `${parseInt(month)}월`,
      raw: m,
      count
    };
  });

  // 최대 청소 횟수 구하기 (차트 높이 조절용)
  const maxCount = Math.max(...monthlyCounts.map(m => m.count), 5);

  // 이달의 청소 왕 타이틀 선정
  const getCleaningCrown = (count: number) => {
    if (count >= 15) return { title: '🧹 완벽한 살림 전문가', desc: '집안 모든 구석을 반짝이게 케어하셨네요!' };
    if (count >= 8) return { title: '✨ 성실한 청소 메이트', desc: '꾸준한 청소 주기로 쾌적함을 잘 유지 중입니다.' };
    if (count >= 3) return { title: '🌱 초보 살림꾼', desc: '조금씩 청소 습관을 들이고 계시군요. 훌륭합니다!' };
    return { title: '💤 청소 충전 중', desc: '가볍게 환기와 테이블 정리부터 시작해보세요!' };
  };

  const crown = getCleaningCrown(totalCompletedInMonth);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 타이틀 */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="text-indigo-400" size={22} />
          월간 청소 통계 및 이력 관리
        </h2>
        <p className="text-xs text-white/60 mt-1">
          개인 청소 주기와 가전제품 필터 케어 이력을 한눈에 비교하고, 누적된 완료 기록을 확인하고 관리할 수 있습니다.
        </p>
      </div>

      {/* 분석 상단: 종합 훈장 & 월간 횟수 추이 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 청소 훈장 */}
        <div className="bg-gradient-to-br from-indigo-550 to-purple-600 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-indigo-500/35 to-purple-600/25 border border-white/10 backdrop-blur-xl">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none">
            <Award size={160} className="text-indigo-300" />
          </div>
          <div className="space-y-3 relative z-10">
            <span className="bg-white/15 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 uppercase">
              이달의 칭호
            </span>
            <h3 className="text-lg font-black text-white">{crown.title}</h3>
            <p className="text-xs text-indigo-200 leading-relaxed">
              {crown.desc}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center relative z-10">
            <div>
              <p className="text-[10px] text-white/60">선택된 월 완료 횟수</p>
              <p className="text-2xl font-black text-white">{totalCompletedInMonth}회</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/60">누적 청소 이력</p>
              <p className="text-sm font-bold text-indigo-200">{history.length}회 완료됨</p>
            </div>
          </div>
        </div>

        {/* 월별 청소 완료 추이 차트 */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between md:col-span-2 text-white">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <TrendingUp size={16} className="text-indigo-400" />
              최근 5개월 청소 횟수 추이
            </h4>
            <span className="text-[10px] text-white/50 font-semibold">단위: 완료 횟수</span>
          </div>

          {/* 차트 캔버스 */}
          <div className="flex items-end justify-between h-36 px-4 pt-6">
            {monthlyCounts.map((m) => {
              const barHeightPercent = Math.max(8, (m.count / maxCount) * 100);
              const isSelected = m.raw === selectedMonth;

              return (
                <div key={m.monthStr} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setSelectedMonth(m.raw)}>
                  <div className="relative flex flex-col items-center">
                    {/* 호버 시 값 표시 */}
                    <span className="absolute -top-6 text-xs font-black text-indigo-200 bg-[#2a2f3a]/90 backdrop-blur-lg px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-20">
                      {m.count}회
                    </span>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-indigo-300 font-extrabold' : 'text-white/40'} mb-1`}>
                      {m.count}회
                    </span>
                    {/* 차트 바 */}
                    <div 
                      className={`w-10 sm:w-12 rounded-t-lg transition-all duration-500 ${
                        isSelected 
                          ? 'bg-gradient-to-t from-indigo-500 to-purple-400 shadow-lg shadow-indigo-500/30' 
                          : 'bg-white/10 group-hover:bg-white/20'
                      }`}
                      style={{ height: `${barHeightPercent}px` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-indigo-300 font-bold' : 'text-white/50'}`}>
                    {m.monthStr}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 월 선택 필터 및 리스트 본문 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 왼쪽 사이드: 세부 카테고리 비율 */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg space-y-6 text-white">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">📊 청소 분류별 비율</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>일반 가사 청소</span>
                  <span className="font-bold text-indigo-300">{regularCount}회 ({totalCompletedInMonth > 0 ? Math.round((regularCount / totalCompletedInMonth) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="bg-indigo-400 h-full rounded-full transition-all" 
                    style={{ width: `${totalCompletedInMonth > 0 ? (regularCount / totalCompletedInMonth) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>가전제품 주기점검</span>
                  <span className="font-bold text-purple-300">{applianceCount}회 ({totalCompletedInMonth > 0 ? Math.round((applianceCount / totalCompletedInMonth) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="bg-purple-400 h-full rounded-full transition-all" 
                    style={{ width: `${totalCompletedInMonth > 0 ? (applianceCount / totalCompletedInMonth) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5 space-y-4">
            <h4 className="text-sm font-bold text-white">🧹 최다 청소 구역 순위</h4>
            {sortedSubCategoryStats.length === 0 ? (
              <p className="text-xs text-white/40">이번 달 청소 기록이 아직 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {sortedSubCategoryStats.map(([subCat, count], index) => {
                  const maxSubCount = sortedSubCategoryStats[0][1];
                  const percent = (count / maxSubCount) * 100;
                  
                  return (
                    <div key={subCat} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="font-bold text-white/30 w-4">{index + 1}</span>
                        <span className="font-bold text-white/80 w-16 truncate">{subCat}</span>
                        <div className="flex-1 bg-white/5 h-2.5 rounded-full overflow-hidden pr-8 border border-white/5">
                          <div 
                            className="bg-indigo-400 h-full rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                      <span className="font-bold text-white/70 ml-2">{count}회</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽 메인: 해당 월의 청소 이력 리스트 */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg space-y-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <h4 className="font-bold text-white text-sm md:text-base flex items-center gap-1.5">
                <FileSpreadsheet className="text-emerald-400" size={18} />
                청소 완료 내역 기록부
              </h4>
              <p className="text-xs text-white/60 mt-0.5">선택한 월에 완료된 상세 청소 역사 목록입니다.</p>
            </div>

            {/* 월별 셀렉터 */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all self-start sm:self-auto cursor-pointer"
            >
              {availableMonths.map((ym) => {
                const [year, month] = ym.split('-');
                return (
                  <option className="bg-[#2a2f3a] text-white" key={ym} value={ym}>
                    {year}년 {parseInt(month)}월 ({history.filter(h => h.completedDate.startsWith(ym)).length}건)
                  </option>
                );
              })}
            </select>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                <ListTodo size={20} />
              </div>
              <p className="text-xs font-semibold text-white/60">선택된 달의 완료 이력이 비어있습니다.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {filteredHistory.map((log) => {
                const associatedTask = tasks.find(t => t.id === log.taskId);

                return (
                  <div 
                    key={log.id} 
                    className="flex items-start justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex gap-3 min-w-0">
                      {/* 아이콘 */}
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 flex items-center justify-center flex-shrink-0">
                        <CleanIcon name={associatedTask?.iconName || 'CheckCircle'} size={18} />
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-white/10 text-white/70 rounded">
                            {log.subCategory}
                          </span>
                          <span className="text-[10px] text-white/50 flex items-center gap-1 font-medium">
                            <Calendar size={10} />
                            {log.completedDate} 완료
                          </span>
                        </div>
                        <h5 className="font-bold text-white text-xs md:text-sm truncate">
                          {log.taskTitle}
                        </h5>
                        {log.notes && (
                          <p className="text-xs text-white/70 bg-white/5 p-2 rounded border border-white/5 mt-1 max-w-lg">
                            📝 {log.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 취소 / 원상복구 버튼 */}
                    <button
                      onClick={() => onUndoComplete(log.id)}
                      className="p-1.5 rounded-lg text-white/40 hover:text-rose-300 hover:bg-white/5 transition-colors flex-shrink-0 self-center cursor-pointer"
                      title="완료 취소 및 되돌리기"
                    >
                      <RotateCcw size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
