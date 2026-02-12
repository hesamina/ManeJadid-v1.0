
import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, BookOpen, Home, Mail, Heart, Calendar, Zap, Settings as SettingsIcon, 
  MoreHorizontal, SlidersHorizontal, XCircle, ArrowUpCircle, HelpCircle, ImageIcon, Book, PenLine, 
  Sparkles as SparklesIcon,
  MessageCircle, ListChecks, Hash, Sparkles
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import HabitTracker from './components/HabitTracker';
import Journal from './components/Journal';
import AngelMessages from './components/AngelMessages';
import Settings from './components/Settings';
import VisionBoard from './components/VisionBoard';
import Gratitude from './components/Gratitude';
import DailyPlanner from './components/DailyPlanner';
import IntuitionGame from './components/IntuitionGame';
import StudyRoom from './components/StudyRoom';
import Affirmations from './components/Affirmations';
import Checklist from './components/Checklist';
import Counter from './components/Counter';
import AIChat from './components/AIChat';
import { ViewType, Task, Habit, JournalEntry, UserStats, GratitudeEntry, ViewConfig } from './types';

export const COLOR_THEMES = [
  { id: 'indigo', name: 'نیلی کلاسیک', hex: '#4f46e5', onMain: '#ffffff' },
  { id: 'rose', name: 'رز مدرن', hex: '#e11d48', onMain: '#ffffff' },
  { id: 'emerald', name: 'سبز حیات', hex: '#059669', onMain: '#ffffff' },
  { id: 'amber', name: 'کهربایی', hex: '#d97706', onMain: '#ffffff' },
  { id: 'purple', name: 'بنفش عمیق', hex: '#7c3aed', onMain: '#ffffff' },
];

const FULL_HABITS_POOL: Habit[] = [
  // ریشه - ۷ عادت
  { id: 'r1', name: 'پیاده‌روی آگاهانه', category: 'ریشه', icon: '👣', color: 'bg-rose-600', completions: [], streak: 0, frequency: 7, active: true },
  { id: 'r2', name: 'تغذیه ارگانیک', category: 'ریشه', icon: '🍎', color: 'bg-rose-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'r3', name: 'نظم محیط زندگی', category: 'ریشه', icon: '🏠', color: 'bg-rose-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'r4', name: 'ورزش قدرتی', category: 'ریشه', icon: '💪', color: 'bg-rose-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'r5', name: 'تماس با طبیعت', category: 'ریشه', icon: '🌳', color: 'bg-rose-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'r6', name: 'خواب باکیفیت', category: 'ریشه', icon: '🌙', color: 'bg-rose-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'r7', name: 'انضباط مالی', category: 'ریشه', icon: '💰', color: 'bg-rose-600', completions: [], streak: 0, frequency: 7, active: false },

  // خاجی - ۷ عادت
  { id: 's1', name: 'نرمش صبحگاهی', category: 'خاجی', icon: '🏃', color: 'bg-orange-600', completions: [], streak: 0, frequency: 7, active: true },
  { id: 's2', name: 'نوشیدن آب کافی', category: 'خاجی', icon: '💧', color: 'bg-orange-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 's3', name: 'فعالیت خلاقانه', category: 'خاجی', icon: '🎨', color: 'bg-orange-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 's4', name: 'دوش آب سرد', category: 'خاجی', icon: '🚿', color: 'bg-orange-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 's5', name: 'رقص یا حرکت آزاد', category: 'خاجی', icon: '💃', color: 'bg-orange-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 's6', name: 'لذت از مسیر', category: 'خاجی', icon: '🌈', color: 'bg-orange-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 's7', name: 'معاشرت مثبت', category: 'خاجی', icon: '🤝', color: 'bg-orange-600', completions: [], streak: 0, frequency: 7, active: false },

  // خورشیدی - ۷ عادت
  { id: 'k1', name: 'نظم شخصی', category: 'خورشیدی', icon: '⚡', color: 'bg-amber-500', completions: [], streak: 0, frequency: 7, active: true },
  { id: 'k2', name: 'مدیریت زمان', category: 'خورشیدی', icon: '⏱️', color: 'bg-amber-500', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'k3', name: 'تصمیم‌گیری قاطع', category: 'خورشیدی', icon: '🎯', color: 'bg-amber-500', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'k4', name: 'آفتاب گرفتن', category: 'خورشیدی', icon: '☀️', color: 'bg-amber-500', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'k5', name: 'مطالعه تخصصی', category: 'خورشیدی', icon: '📖', color: 'bg-amber-500', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'k6', name: 'حل چالش روزانه', category: 'خورشیدی', icon: '🧩', color: 'bg-amber-500', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'k7', name: 'تمرین اعتماد بنفس', category: 'خورشیدی', icon: '🦁', color: 'bg-amber-500', completions: [], streak: 0, frequency: 7, active: false },

  // قلب - ۷ عادت
  { id: 'h1', name: 'شکرگزاری روزانه', category: 'قلب', icon: '💖', color: 'bg-emerald-600', completions: [], streak: 0, frequency: 7, active: true },
  { id: 'h2', name: 'بخشش خود و دیگران', category: 'قلب', icon: '🕊️', color: 'bg-emerald-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'h3', name: 'کمک بی‌چشم‌داشت', category: 'قلب', icon: '🎁', color: 'bg-emerald-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'h4', name: 'تنفس عمیق قلبی', category: 'قلب', icon: '🫁', color: 'bg-emerald-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'h5', name: 'محبت به حیوانات', category: 'قلب', icon: '🐾', color: 'bg-emerald-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'h6', name: 'مهربانی با غریبه', category: 'قلب', icon: '🌻', color: 'bg-emerald-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'h7', name: 'ثبت لحظات شاد', category: 'قلب', icon: '📸', color: 'bg-emerald-600', completions: [], streak: 0, frequency: 7, active: false },

  // گلو - ۷ عادت
  { id: 't1', name: 'مطالعه آگاهانه', category: 'گلو', icon: '📚', color: 'bg-sky-600', completions: [], streak: 0, frequency: 7, active: true },
  { id: 't2', name: 'نوشتن روزانه', category: 'گلو', icon: '✍️', color: 'bg-sky-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 't3', name: 'بیان شفاف احساس', category: 'گلو', icon: '🗣️', color: 'bg-sky-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 't4', name: 'آواز خواندن', category: 'گلو', icon: '🎤', color: 'bg-sky-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 't5', name: 'پادکست آموزشی', category: 'گلو', icon: '🎧', color: 'bg-sky-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 't6', name: 'گوش دادن فعال', category: 'گلو', icon: '👂', color: 'bg-sky-600', completions: [], streak: 0, frequency: 7, active: false },
  { id: 't7', name: 'یادگیری زبان جدید', category: 'گلو', icon: '🌍', color: 'bg-sky-600', completions: [], streak: 0, frequency: 7, active: false },

  // چشم‌سوم - ۷ عادت
  { id: 'th1', name: 'تمرکز ذهنی', category: 'چشم‌سوم', icon: '👁️', color: 'bg-indigo-700', completions: [], streak: 0, frequency: 7, active: true },
  { id: 'th2', name: 'مشاهده افکار', category: 'چشم‌سوم', icon: '🧘‍♂️', color: 'bg-indigo-700', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'th3', name: 'تصویرسازی مثبت', category: 'چشم‌سوم', icon: '🔮', color: 'bg-indigo-700', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'th4', name: 'یوگا', category: 'چشم‌سوم', icon: '🤸', color: 'bg-indigo-700', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'th5', name: 'دوری از نمایشگر', category: 'چشم‌سوم', icon: '📵', color: 'bg-indigo-700', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'th6', name: 'سکوت اختیاری', category: 'چشم‌سوم', icon: '🤫', color: 'bg-indigo-700', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'th7', name: 'پرسشگری عمیق', category: 'چشم‌سوم', icon: '❓', color: 'bg-indigo-700', completions: [], streak: 0, frequency: 7, active: false },

  // تاج - ۷ عادت
  { id: 'c1', name: 'مدیتیشن روزانه', category: 'تاج', icon: '🧘', color: 'bg-purple-700', completions: [], streak: 0, frequency: 7, active: true },
  { id: 'c2', name: 'نیایش یا دعا', category: 'تاج', icon: '🙏', color: 'bg-purple-700', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'c3', name: 'تفکر در هستی', category: 'تاج', icon: '🌌', color: 'bg-purple-700', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'c4', name: 'مطالعه معنوی', category: 'تاج', icon: '📜', color: 'bg-purple-700', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'c5', name: 'شکرگزاری عمیق', category: 'تاج', icon: '✨', color: 'bg-purple-700', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'c6', name: 'وانهادگی کامل', category: 'تاج', icon: '🕯️', color: 'bg-purple-700', completions: [], streak: 0, frequency: 7, active: false },
  { id: 'c7', name: 'خدمت بی‌منت', category: 'تاج', icon: '🤍', color: 'bg-purple-700', completions: [], streak: 0, frequency: 7, active: false },
];

const INITIAL_NAV_CONFIG: ViewConfig[] = [
  { id: 'dashboard', label: 'خانه', icon: 'Home', enabled: true },
  { id: 'habits', label: 'عادت‌ها', icon: 'CheckCircle2', enabled: true },
  { id: 'planner', label: 'برنامه', icon: 'Calendar', enabled: true },
  { id: 'gratitude', label: 'شکرگزاری', icon: 'Heart', enabled: true },
  { id: 'journal', label: 'ژورنال', icon: 'PenLine', enabled: true },
  { id: 'aiChat', label: 'هوشِ من', icon: 'Sparkles', enabled: true },
  { id: 'vision', label: 'ویژن', icon: 'ImageIcon', enabled: true },
  { id: 'spiritualStudy', label: 'مطالعه', icon: 'Book', enabled: true },
  { id: 'affirmations', label: 'سلف لاو', icon: 'Heart', enabled: true },
  { id: 'checklist', label: 'چک‌لیست', icon: 'ListChecks', enabled: true },
  { id: 'counter', label: 'شمارنده', icon: 'Hash', enabled: true },
  { id: 'angels', label: 'فرشته', icon: 'Mail', enabled: true },
  { id: 'intuition', label: 'شهود و رنگ', icon: 'Zap', enabled: true },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('mj-dark-mode') === 'true');
  const [themeId, setThemeId] = useState(() => localStorage.getItem('mj-theme') || 'indigo');
  const [navConfig, setNavConfig] = useState<ViewConfig[]>(() => {
    const saved = localStorage.getItem('mj-nav-config-v18');
    return saved ? JSON.parse(saved) : INITIAL_NAV_CONFIG;
  });
  
  const [isEditingNav, setIsEditingNav] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('mj-stats');
    return saved ? JSON.parse(saved) : { points: 0, level: 1, badges: [] };
  });

  const currentTheme = useMemo(() => COLOR_THEMES.find(t => t.id === themeId) || COLOR_THEMES[0], [themeId]);

  useEffect(() => {
    const savedHabits = localStorage.getItem('mj-habits-v18');
    if (savedHabits && JSON.parse(savedHabits).length > 0) {
      setHabits(JSON.parse(savedHabits));
    } else {
      setHabits(FULL_HABITS_POOL);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mj-nav-config-v18', JSON.stringify(navConfig));
  }, [navConfig]);

  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('mj-habits-v18', JSON.stringify(habits));
    }
  }, [habits]);

  useEffect(() => {
    document.documentElement.style.setProperty('--brand-main', currentTheme.hex);
    document.documentElement.style.setProperty('--on-brand', currentTheme.onMain);
    if (isDarkMode) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark');
  }, [currentTheme, isDarkMode]);

  const primaryNavItems = navConfig.filter(c => c.enabled).slice(0, 5);
  const extraNavItems = navConfig.filter(c => c.enabled).slice(5);

  const getIcon = (iconName: string, size = 18) => {
    const icons: any = { 
      CheckCircle2, Home, Calendar, Heart, ImageIcon, Mail, BookOpen, 
      Zap, SettingsIcon, Book, PenLine, MessageCircle, ListChecks, Hash, Sparkles
    };
    const IconComp = icons[iconName] || Home;
    return <IconComp size={size} />;
  };

  const moveToTools = (id: string) => {
    const index = navConfig.findIndex(c => c.id === id);
    if (index === -1) return;
    const newConfig = [...navConfig];
    const [item] = newConfig.splice(index, 1);
    newConfig.push(item);
    setNavConfig(newConfig);
  };

  const moveToMain = (id: string) => {
    const index = navConfig.findIndex(c => c.id === id);
    if (index === -1) return;
    const newConfig = [...navConfig];
    const [item] = newConfig.splice(index, 1);
    newConfig.unshift(item);
    setNavConfig(newConfig);
  };

  return (
    <div className={`h-screen flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className="px-6 py-4 flex justify-between items-center bg-brand-main text-on-brand shadow-lg z-[60]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-2xl rounded-xl flex items-center justify-center font-black">mj</div>
          <h1 className="text-xl font-black tracking-tighter">منِ جدید</h1>
        </div>
        <div className="flex items-center gap-2">
          {isEditingNav ? (
            <button onClick={() => setIsEditingNav(false)} className="px-4 py-1.5 bg-white text-brand-main rounded-xl font-black text-[10px] shadow-lg border-2 border-white animate-pulse">ذخیره تغییرات</button>
          ) : (
            <div className="bg-white/10 px-3 py-1 rounded-lg font-black text-[10px] tabular-nums">{stats.points} امتیاز</div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto no-scrollbar p-4 custom-scroll">
          {activeView === 'dashboard' && <Dashboard tasks={tasks} habits={habits} stats={stats} setActiveView={setActiveView} />}
          {activeView === 'habits' && <HabitTracker habits={habits} setHabits={setHabits} addPoints={(p) => setStats(s => ({...s, points: s.points+p}))} resetToDefaults={() => setHabits(FULL_HABITS_POOL)} />}
          {activeView === 'planner' && <DailyPlanner tasks={tasks} setTasks={setTasks} addPoints={(p) => setStats(s => ({...s, points: s.points+p}))} />}
          {activeView === 'gratitude' && <Gratitude entries={gratitudeEntries} setEntries={setGratitudeEntries} addPoints={(p) => setStats(s => ({...s, points: s.points+p}))} />}
          {activeView === 'journal' && <Journal entries={journalEntries} setEntries={setJournalEntries} addPoints={(p) => setStats(s => ({...s, points: s.points+p}))} />}
          {activeView === 'vision' && <VisionBoard />}
          {activeView === 'angels' && <AngelMessages />}
          {activeView === 'intuition' && <IntuitionGame onHome={() => setActiveView('dashboard')} />}
          {activeView === 'affirmations' && <Affirmations addPoints={(p) => setStats(s => ({...s, points: s.points+p}))} />}
          {activeView === 'spiritualStudy' && <StudyRoom addPoints={(p) => setStats(s => ({...s, points: s.points+p}))} setActiveView={setActiveView} />}
          {activeView === 'checklist' && <Checklist />}
          {activeView === 'counter' && <Counter />}
          {activeView === 'aiChat' && <AIChat />}
          {activeView === 'settings' && <Settings currentThemeId={themeId} setTheme={setThemeId} navConfig={navConfig} setNavConfig={setNavConfig} stats={stats} setStats={setStats} setHabits={setHabits} setJournalEntries={setJournalEntries} />}
        </div>
      </main>

      <nav className={`bg-brand-main text-on-brand px-1 pt-3 pb-6 z-[70] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] relative transition-all ${isEditingNav ? 'bg-opacity-90 ring-4 ring-white/20' : ''}`}>
        <div className="flex max-w-lg mx-auto justify-between items-center relative h-14">
          {primaryNavItems.map((item) => (
            <div key={item.id} className="flex-1 relative h-full flex flex-col items-center justify-center transition-all">
              <NavItem 
                active={activeView === item.id} 
                onClick={() => { if(!isEditingNav) { setActiveView(item.id); setShowToolsMenu(false); } }} 
                onLongPress={() => setIsEditingNav(true)}
                icon={getIcon(item.icon, 20)} 
                label={item.label} 
              />
              {isEditingNav && (
                <button 
                  onClick={(e) => { e.stopPropagation(); moveToTools(item.id); }}
                  className="absolute -top-1 -right-1 bg-white text-rose-600 rounded-full shadow-lg border-2 border-rose-50 z-50"
                >
                  <XCircle size={18} fill="white" />
                </button>
              )}
            </div>
          ))}
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <button onClick={() => setShowToolsMenu(!showToolsMenu)} className={`flex flex-col items-center gap-1 transition-all ${showToolsMenu ? 'opacity-100 scale-105' : 'opacity-40'}`}>
               <div className={`p-2 rounded-xl ${showToolsMenu ? 'bg-white/30' : ''}`}><MoreHorizontal size={20} /></div>
               <span className="text-[7px] font-black">ابزارها</span>
            </button>
          </div>
        </div>

        {showToolsMenu && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[94%] max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl border border-slate-100 dark:border-slate-800 z-[100]">
             <div className="flex flex-wrap justify-center gap-x-4 gap-y-6">
                {extraNavItems.map((item) => (
                  <div key={item.id} className="relative">
                    <button onClick={() => { if(!isEditingNav) { setActiveView(item.id); setShowToolsMenu(false); } }} className="flex flex-col items-center gap-2 w-16 group">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeView === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                         {getIcon(item.icon, 24)}
                      </div>
                      <span className={`text-[9px] font-black ${activeView === item.id ? 'text-indigo-600' : 'text-slate-500'}`}>{item.label}</span>
                    </button>
                    {isEditingNav && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); moveToMain(item.id); }}
                        className="absolute -top-1 -right-1 bg-white text-emerald-600 rounded-full shadow-lg border-2 border-emerald-50 p-0.5 z-50"
                      >
                        <ArrowUpCircle size={20} fill="white" />
                      </button>
                    )}
                  </div>
                ))}
             </div>
          </div>
        )}
      </nav>
      {(isEditingNav || showToolsMenu) && <div className="fixed inset-0 z-[65] bg-black/15 backdrop-blur-[2px]" onClick={() => { setIsEditingNav(false); setShowToolsMenu(false); }} />}
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; onLongPress: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, onLongPress, icon, label }) => {
  let timer: any;
  const handleStart = () => { timer = setTimeout(onLongPress, 700); };
  const handleEnd = () => { clearTimeout(timer); };

  return (
    <button 
      onClick={onClick} 
      onMouseDown={handleStart} onMouseUp={handleEnd} 
      onTouchStart={handleStart} onTouchEnd={handleEnd}
      className={`flex flex-col items-center gap-1 w-full transition-all ${active ? 'opacity-100 scale-110' : 'opacity-40'}`}
    >
      <div className={`p-2 rounded-xl transition-all ${active ? 'bg-white/20 shadow-inner' : ''}`}>{icon}</div>
      <span className="text-[7px] font-black whitespace-nowrap">{label}</span>
    </button>
  );
};

export default App;
