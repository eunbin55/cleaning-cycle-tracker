import React, { useState, useEffect } from 'react';
import { CleaningTask } from '../types';
import { AVAILABLE_ICONS, SUB_CATEGORIES, getTodayStr, addDays } from '../utils/cleaningUtils';
import { CleanIcon } from './CleanIcon';
import { X, Check } from 'lucide-react';

interface TaskFormProps {
  onSave: (task: Omit<CleaningTask, 'id' | 'lastCleanedDate' | 'nextDueDate'> & { id?: string }) => void;
  onCancel: () => void;
  editingTask?: CleaningTask | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSave, onCancel, editingTask }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'regular' | 'appliance'>('regular');
  const [subCategory, setSubCategory] = useState('');
  const [cycleValue, setCycleValue] = useState<number>(7);
  const [cycleUnit, setCycleUnit] = useState<'days' | 'weeks' | 'months'>('days');
  const [importance, setImportance] = useState<'high' | 'medium' | 'low'>('medium');
  const [iconName, setIconName] = useState('Sparkles');
  const [notes, setNotes] = useState('');

  // 카테고리 변경 시 서브카테고리 디폴트 설정
  useEffect(() => {
    if (!editingTask) {
      setSubCategory(SUB_CATEGORIES[category][0]);
    }
  }, [category, editingTask]);

  // 에디팅 상태일 때 값 불러오기
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCategory(editingTask.category);
      setSubCategory(editingTask.subCategory);
      setImportance(editingTask.importance);
      setIconName(editingTask.iconName);
      setNotes(editingTask.notes || '');

      // 주기 분해 (예: 30일 -> 1개월, 14일 -> 2주)
      const days = editingTask.cycleDays;
      if (days % 30 === 0) {
        setCycleValue(days / 30);
        setCycleUnit('months');
      } else if (days % 7 === 0) {
        setCycleValue(days / 7);
        setCycleUnit('weeks');
      } else {
        setCycleValue(days);
        setCycleUnit('days');
      }
    } else {
      // 초기화
      setTitle('');
      setCategory('regular');
      setSubCategory(SUB_CATEGORIES.regular[0]);
      setCycleValue(7);
      setCycleUnit('days');
      setImportance('medium');
      setIconName('Sparkles');
      setNotes('');
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // 주기 일수 계산
    let calculatedDays = cycleValue;
    if (cycleUnit === 'weeks') {
      calculatedDays = cycleValue * 7;
    } else if (cycleUnit === 'months') {
      calculatedDays = cycleValue * 30;
    }

    onSave({
      ...(editingTask ? { id: editingTask.id } : {}),
      title: title.trim(),
      category,
      subCategory,
      cycleDays: calculatedDays,
      importance,
      iconName,
      notes: notes.trim() || undefined,
      isCustom: true
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl p-6 md:p-8 max-w-xl mx-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          {editingTask ? '📝 청소 주기 수정하기' : '✨ 새로운 청소 주기 추가'}
        </h3>
        <button 
          onClick={onCancel}
          className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors cursor-pointer"
          type="button"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 청소 항목 이름 */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1.5">
            청소 항목 이름 <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="예) 화장실 바닥 및 솔질, 세탁기 통세척..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
          />
        </div>

        {/* 카테고리 분류 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">구분</label>
            <div className="flex rounded-xl bg-white/5 border border-white/5 p-1">
              <button
                type="button"
                onClick={() => setCategory('regular')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  category === 'regular'
                    ? 'bg-white/15 border border-white/10 text-indigo-300 font-extrabold shadow-md'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                일반 청소
              </button>
              <button
                type="button"
                onClick={() => setCategory('appliance')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  category === 'appliance'
                    ? 'bg-white/15 border border-white/10 text-indigo-300 font-extrabold shadow-md'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                가전제품 청소
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">세부 분류</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all cursor-pointer"
            >
              {SUB_CATEGORIES[category].map((sub) => (
                <option className="bg-[#2a2f3a] text-white" key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 주기 설정 (커스텀 알림 옵션) */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1.5">
            청소 주기 (알림 반복 간격)
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              min={1}
              required
              value={cycleValue}
              onChange={(e) => setCycleValue(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-24 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all font-semibold text-white"
            />
            <select
              value={cycleUnit}
              onChange={(e) => setCycleUnit(e.target.value as any)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all font-medium text-white cursor-pointer"
            >
              <option className="bg-[#2a2f3a] text-white" value="days">일 마다 (Days)</option>
              <option className="bg-[#2a2f3a] text-white" value="weeks">주일 마다 (Weeks)</option>
              <option className="bg-[#2a2f3a] text-white" value="months">개월 마다 (Months)</option>
            </select>
          </div>
          <p className="mt-1.5 text-[11px] text-white/50">
            * 설정하신 주기마다 알림이 리셋되며 다음 청소 일정이 자동 지정됩니다. (현재 설정: {cycleValue}
            {cycleUnit === 'days' ? '일' : cycleUnit === 'weeks' ? '주일' : '개월'})
          </p>
        </div>

        {/* 중요도 및 아이콘 선택 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 중요도 */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">중요도</label>
            <div className="flex gap-2">
              {(['high', 'medium', 'low'] as const).map((imp) => {
                const label = imp === 'high' ? '상' : imp === 'medium' ? '중' : '하';
                const activeColor = imp === 'high' 
                  ? 'bg-rose-500/25 text-rose-300 border-rose-500/40 font-extrabold shadow-md' 
                  : imp === 'medium'
                  ? 'bg-amber-500/25 text-amber-300 border-amber-500/40 font-extrabold shadow-md'
                  : 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40 font-extrabold shadow-md';
                
                return (
                  <button
                    key={imp}
                    type="button"
                    onClick={() => setImportance(imp)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      importance === imp
                        ? `${activeColor} border-2`
                        : 'border-white/10 text-white/50 hover:bg-white/5'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 아이콘 선택 */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1.5">아이콘</label>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-500/25 flex items-center justify-center text-indigo-300">
                <CleanIcon name={iconName} size={22} />
              </div>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-white cursor-pointer"
              >
                {AVAILABLE_ICONS.map((ico) => (
                  <option className="bg-[#2a2f3a] text-white" key={ico.name} value={ico.name}>{ico.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 청소 요령 및 메모 */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1.5">청소 팁 / 기억해둘 메모 (선택)</label>
          <textarea
            placeholder="나만의 청소 방법이나 사용 세제 등을 자유롭게 남겨보세요. (예: 물세척 후 그늘 건조, 과탄산소다 사용)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-sm"
          />
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-white/15 bg-white/5 hover:bg-white/10 text-white/85 font-semibold rounded-xl transition-all text-sm cursor-pointer"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 text-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check size={16} />
            {editingTask ? '수정 완료' : '추가하기'}
          </button>
        </div>
      </form>
    </div>
  );
};
