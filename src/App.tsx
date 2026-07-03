import { useState, useEffect } from 'react';
import { CleaningTask, CleaningHistory, TabType } from './types';
import { DEFAULT_TASKS, DEFAULT_HISTORY } from './data/defaultTasks';
import { 
  getInitialData, 
  getTodayStr, 
  addDays, 
  formatDateString 
} from './utils/cleaningUtils';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { Stats } from './components/Stats';
import { ApplianceGuide } from './components/ApplianceGuide';
import { 
  Sparkles, 
  LayoutDashboard, 
  ListTodo, 
  WashingMachine, 
  BarChart3, 
  BookOpen, 
  Plus, 
  Check, 
  Info,
  RotateCcw,
  Bell,
  BellOff
} from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [history, setHistory] = useState<CleaningHistory[]>([]);
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CleaningTask | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>('default');

  // 로컬스토리지에서 상태 복원 및 초기 데이터 설정
  useEffect(() => {
    const savedTasks = localStorage.getItem('cleaning_tasks_v1');
    const savedHistory = localStorage.getItem('cleaning_history_v1');

    if (savedTasks && savedHistory) {
      setTasks(JSON.parse(savedTasks));
      setHistory(JSON.parse(savedHistory));
    } else {
      // 첫 로드 시 오늘 날짜 기준으로 디폴트 데이터의 상대적 오프셋 조정 적용하여 생동감 제공
      const { shiftTaskDates, shiftHistoryDates } = getInitialData();
      const initializedTasks = DEFAULT_TASKS.map(shiftTaskDates);
      const initializedHistory = DEFAULT_HISTORY.map(shiftHistoryDates);

      setTasks(initializedTasks);
      setHistory(initializedHistory);

      localStorage.setItem('cleaning_tasks_v1', JSON.stringify(initializedTasks));
      localStorage.setItem('cleaning_history_v1', JSON.stringify(initializedHistory));
    }

    // 알림 권한 최초 확인
    if ('Notification' in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  // 오늘 일정 푸시 알림 체크 (일 1회만 노출하기 위해 sessionStorage 활용)
  useEffect(() => {
    if (tasks.length === 0 || notificationStatus !== 'granted') return;

    const notifiedToday = sessionStorage.getItem('clean_notified_today');
    if (notifiedToday === getTodayStr()) return;

    // 오늘 마감되거나 밀린 청소 카운팅
    const todayStr = getTodayStr();
    const pendingTasks = tasks.filter(task => task.nextDueDate <= todayStr);

    if (pendingTasks.length > 0) {
      triggerNotification(
        '🧼 오늘 청소할 일정이 있어요!',
        `총 ${pendingTasks.length}건의 청소 주기가 도래했습니다. 오늘 일정을 완료해 보세요!`
      );
      sessionStorage.setItem('clean_notified_today', todayStr);
    }
  }, [tasks, notificationStatus]);

  // 기기 로컬 알림 발송 헬퍼
  const triggerNotification = (title: string, body: string) => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      try {
        // 모바일 디바이스 지원을 위해 ServiceWorker와 일반 알림 병행 시도
        if (navigator.serviceWorker && navigator.serviceWorker.ready) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title, {
              body,
              icon: '/icon.jpg',
              badge: '/icon.jpg',
              vibrate: [200, 100, 200],
              tag: 'cleaning-tracker-notification'
            } as any);
          });
        } else {
          new Notification(title, {
            body,
            icon: '/icon.jpg'
          });
        }
      } catch (err) {
        // Fallback
        new Notification(title, {
          body,
          icon: '/icon.jpg'
        });
      }
    }
  };

  // 알림 권한 획득 토글 함수
  const handleRequestNotification = async () => {
    if (!('Notification' in window)) {
      showToast('⚠️ 이 브라우저/기기는 시스템 알림을 지원하지 않습니다.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);
      
      if (permission === 'granted') {
        showToast('🔔 기기 알림이 성공적으로 설정되었습니다!');
        triggerNotification(
          '🎉 클린메이트 알림 연동 완료',
          '이제 주기별 청소 알 일정이 있을 때 모바일/PC로 알림을 보내드립니다!'
        );
      } else if (permission === 'denied') {
        showToast('❌ 알림 권한이 차단되었습니다. 브라우저 설정에서 해제해 주세요.');
      }
    } catch (err) {
      showToast('⚠️ 알림 설정 도중 오류가 발생했습니다.');
    }
  };

  // 테스트 알림 발송용
  const handleTestNotification = () => {
    if (notificationStatus !== 'granted') {
      showToast('🔔 먼저 상단 알림 아이콘을 클릭하여 권한을 승인해 주세요!');
      return;
    }
    triggerNotification(
      '🧹 테스트 알림 도착!',
      '데이터베이스 없이 스마트폰/PC 자체에서 보내는 초고속 로컬 알림입니다.'
    );
    showToast('🚀 기기로 알림을 전송했습니다!');
  };

  // 토스트 도우미
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 로컬스토리지에 태스크 저장 함수
  const saveTasksToStorage = (updatedTasks: CleaningTask[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('cleaning_tasks_v1', JSON.stringify(updatedTasks));
  };

  // 로컬스토리지에 이력 저장 함수
  const saveHistoryToStorage = (updatedHistory: CleaningHistory[]) => {
    setHistory(updatedHistory);
    localStorage.setItem('cleaning_history_v1', JSON.stringify(updatedHistory));
  };

  // 청소 완료 처리 핸들러
  const handleCompleteTask = (taskId: string, notes?: string) => {
    const todayStr = getTodayStr();
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const nextDue = addDays(todayStr, task.cycleDays);
        return {
          ...task,
          lastCleanedDate: todayStr,
          nextDueDate: nextDue
        };
      }
      return task;
    });

    const completedTask = tasks.find((t) => t.id === taskId);
    if (completedTask) {
      const newHistoryLog: CleaningHistory = {
        id: `hist-${Date.now()}`,
        taskId: completedTask.id,
        taskTitle: completedTask.title,
        category: completedTask.category,
        subCategory: completedTask.subCategory,
        completedDate: todayStr,
        notes: notes || '청소를 깔끔히 마쳤습니다.',
        cycleDays: completedTask.cycleDays
      };

      const updatedHistory = [newHistoryLog, ...history];
      saveTasksToStorage(updatedTasks);
      saveHistoryToStorage(updatedHistory);
      showToast(`✨ "${completedTask.title}" 청소를 완료 처리했습니다!`);
    }
  };

  // 이력 롤백/실행 취소 핸들러
  const handleUndoComplete = (historyId: string) => {
    const logToUndo = history.find((h) => h.id === historyId);
    if (!logToUndo) return;

    // 1. 해당 로그 삭제
    const updatedHistory = history.filter((h) => h.id !== historyId);

    // 2. 연관된 태스크의 청소 주기 날짜 되돌리기
    const updatedTasks = tasks.map((task) => {
      if (task.id === logToUndo.taskId) {
        // 해당 태스크에 대한 이전 청소 기록(지우려는 것 제외)이 존재하는지 조회
        const priorLogs = updatedHistory.filter((h) => h.taskId === task.id);
        
        if (priorLogs.length > 0) {
          // 가장 최근 기록순으로 정렬
          const sortedPrior = [...priorLogs].sort((a, b) => b.completedDate.localeCompare(a.completedDate));
          const lastLog = sortedPrior[0];
          return {
            ...task,
            lastCleanedDate: lastLog.completedDate,
            nextDueDate: addDays(lastLog.completedDate, task.cycleDays)
          };
        } else {
          // 이전 기록이 없을 경우 처음 상태(이전 날짜에서 뺀 것)로 리셋
          const originalLastCleaned = '';
          const revertedNextDue = addDays(task.nextDueDate, -task.cycleDays);
          return {
            ...task,
            lastCleanedDate: originalLastCleaned,
            nextDueDate: revertedNextDue
          };
        }
      }
      return task;
    });

    saveTasksToStorage(updatedTasks);
    saveHistoryToStorage(updatedHistory);
    showToast(`↩️ 청소 완료 기록을 취소하고 일정을 되돌렸습니다.`);
  };

  // 청소 항목 삭제 핸들러
  const handleDeleteTask = (taskId: string) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    if (window.confirm(`"${targetTask.title}" 청소 주기를 정말로 삭제하시겠습니까? 관련 알림 및 설정이 사라집니다.`)) {
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      // 관련 이력 로그도 원한다면 유지하거나 지울 수 있는데, 이력 자체는 통계용으로 유지하는 것이 바람직합니다.
      saveTasksToStorage(updatedTasks);
      showToast(`🗑️ "${targetTask.title}" 일정을 완전히 삭제했습니다.`);
    }
  };

  // 청소 항목 수정 폼 열기
  const handleEditTask = (task: CleaningTask) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  // 새로운 청소 항목/수정본 저장 핸들러 (커스텀 알림 설정 통합)
  const handleSaveTask = (taskInput: Omit<CleaningTask, 'id' | 'lastCleanedDate' | 'nextDueDate'> & { id?: string }) => {
    const todayStr = getTodayStr();

    if (taskInput.id) {
      // 1. 기존 항목 수정
      const updatedTasks = tasks.map((t) => {
        if (t.id === taskInput.id) {
          // 주기가 변했으면 다음 예정일 재정렬
          const baseDate = t.lastCleanedDate || todayStr;
          const nextDue = addDays(baseDate, taskInput.cycleDays);
          return {
            ...t,
            title: taskInput.title,
            category: taskInput.category,
            subCategory: taskInput.subCategory,
            cycleDays: taskInput.cycleDays,
            importance: taskInput.importance,
            iconName: taskInput.iconName,
            notes: taskInput.notes,
            nextDueDate: nextDue
          };
        }
        return t;
      });
      saveTasksToStorage(updatedTasks);
      showToast(`📝 "${taskInput.title}" 주기가 수정되었습니다.`);
    } else {
      // 2. 새로운 신규 항목 추가 (사용자 직접 주기 설정 커스텀 알림 옵션)
      const newId = `custom-${Date.now()}`;
      const nextDue = todayStr; // 추가하자마자 대시보드 및 체크리스트에 즉시 나타나 청소하도록 예정일 세팅

      const newCleanTask: CleaningTask = {
        id: newId,
        title: taskInput.title,
        category: taskInput.category,
        subCategory: taskInput.subCategory,
        cycleDays: taskInput.cycleDays,
        lastCleanedDate: '',
        nextDueDate: nextDue,
        isCustom: true,
        importance: taskInput.importance,
        iconName: taskInput.iconName,
        notes: taskInput.notes
      };

      const updatedTasks = [newCleanTask, ...tasks];
      saveTasksToStorage(updatedTasks);
      showToast(`✨ 새 청소 알림 "${taskInput.title}"이 등록되었습니다!`);
    }

    setIsFormOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-[#2E3440] bg-gradient-to-br from-[#4c566a] via-[#2e3440] to-[#1a1c23] text-white font-sans antialiased flex flex-col pb-12">
      {/* 고정 상단 네비게이션 헤더 */}
      <header className="sticky top-0 z-40 w-full bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* 브랜드 로고 */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <h1 className="font-extrabold text-base md:text-lg tracking-tight text-white">
                쓱싹쓱싹 <span className="text-indigo-400 font-black">클린 메이트</span>
              </h1>
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Smart Cleaning Cycle Planner</p>
            </div>
          </div>

          {/* 데스크탑 네비게이션 메뉴 */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'dashboard' 
                  ? 'bg-white/20 text-white font-extrabold shadow-sm border border-white/10' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard size={16} />
              대시보드
            </button>

            <button
              onClick={() => setCurrentTab('checklist')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'checklist' 
                  ? 'bg-white/20 text-white font-extrabold shadow-sm border border-white/10' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ListTodo size={16} />
              청소 체크리스트
            </button>

            <button
              onClick={() => setCurrentTab('appliances')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'appliances' 
                  ? 'bg-white/20 text-white font-extrabold shadow-sm border border-white/10' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <WashingMachine size={16} />
              가전 주기 관리
            </button>

            <button
              onClick={() => setCurrentTab('stats')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'stats' 
                  ? 'bg-white/20 text-white font-extrabold shadow-sm border border-white/10' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 size={16} />
              완료 통계
            </button>

            <button
              onClick={() => setCurrentTab('guide')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'guide' 
                  ? 'bg-white/20 text-white font-extrabold shadow-sm border border-white/10' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen size={16} />
              살림 가이드
            </button>
          </nav>

          {/* 알림 제어 컨트롤 및 일정 등록 */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRequestNotification}
              className={`p-2 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer h-9 md:h-10 ${
                notificationStatus === 'granted'
                  ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/25'
                  : notificationStatus === 'denied'
                  ? 'bg-rose-500/15 border-rose-500/25 text-rose-300 hover:bg-rose-500/25'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              }`}
              title={
                notificationStatus === 'granted'
                  ? '알림 허용됨 (클릭 시 권한 다시 요청)'
                  : notificationStatus === 'denied'
                  ? '알림 차단됨 (브라우저 설정 필요)'
                  : '기기 알림 활성화'
              }
            >
              {notificationStatus === 'granted' ? (
                <>
                  <Bell size={14} className="animate-pulse text-emerald-400" />
                  <span className="hidden sm:inline">알림 켬</span>
                </>
              ) : (
                <>
                  <BellOff size={14} className="text-white/40" />
                  <span className="hidden sm:inline">알림 끔</span>
                </>
              )}
            </button>

            {notificationStatus === 'granted' && (
              <button
                onClick={handleTestNotification}
                className="h-9 md:h-10 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 rounded-xl text-xs font-semibold transition-all cursor-pointer hidden md:block"
                title="기기로 테스트 푸시 알림 전송"
              >
                알림 테스트
              </button>
            )}

            <button
              onClick={() => {
                setEditingTask(null);
                setIsFormOpen(true);
              }}
              className="h-9 md:h-10 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Plus size={14} className="stroke-[3]" />
              일정 등록
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 하단 플로팅 탭바 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-2xl border-t border-white/10 py-2.5 flex justify-around shadow-lg px-2 rounded-t-2xl">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            currentTab === 'dashboard' ? 'text-indigo-300' : 'text-white/50'
          }`}
        >
          <LayoutDashboard size={20} />
          대시보드
        </button>

        <button
          onClick={() => setCurrentTab('checklist')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            currentTab === 'checklist' ? 'text-indigo-300' : 'text-white/50'
          }`}
        >
          <ListTodo size={20} />
          체크리스트
        </button>

        <button
          onClick={() => setCurrentTab('appliances')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            currentTab === 'appliances' ? 'text-indigo-300' : 'text-white/50'
          }`}
        >
          <WashingMachine size={20} />
          가전 점검
        </button>

        <button
          onClick={() => setCurrentTab('stats')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            currentTab === 'stats' ? 'text-indigo-300' : 'text-white/50'
          }`}
        >
          <BarChart3 size={20} />
          완료 이력
        </button>

        <button
          onClick={() => setCurrentTab('guide')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            currentTab === 'guide' ? 'text-indigo-300' : 'text-white/50'
          }`}
        >
          <BookOpen size={20} />
          살림 가이드
        </button>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 mb-16 md:mb-0">
        {currentTab === 'dashboard' && (
          <Dashboard 
            tasks={tasks} 
            onCompleteTask={handleCompleteTask} 
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'checklist' && (
          <TaskList 
            tasks={tasks}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onAddNewClick={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }}
            defaultCategory="regular"
          />
        )}

        {currentTab === 'appliances' && (
          <TaskList 
            tasks={tasks}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onAddNewClick={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }}
            defaultCategory="appliance"
          />
        )}

        {currentTab === 'stats' && (
          <Stats 
            history={history} 
            tasks={tasks} 
            onUndoComplete={handleUndoComplete}
          />
        )}

        {currentTab === 'guide' && (
          <ApplianceGuide />
        )}
      </main>

      {/* 모달: 새로운 일정 등록 / 수정 폼 (뒷배경 블러 처리되어 매혹적이고 모던함) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl">
            <TaskForm 
              onSave={handleSaveTask} 
              onCancel={() => {
                setIsFormOpen(false);
                setEditingTask(null);
              }} 
              editingTask={editingTask}
            />
          </div>
        </div>
      )}

      {/* 하단 미니 토스트 알림 팝업 */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white font-bold text-xs md:text-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-slide-up border border-white/10">
          <Check size={16} className="text-emerald-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
