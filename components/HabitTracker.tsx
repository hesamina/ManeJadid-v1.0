
import React, { useState, useMemo } from 'react';
import { Habit } from '../types';
import { 
  Library, Star, X, ChevronRight, ChevronLeft, Check, Activity, TrendingUp, Plus, Info, MinusCircle, GripVertical, List, LayoutGrid
} from 'lucide-react';

interface HabitTrackerProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  addPoints: (amount: number) => void;
  resetToDefaults: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'ریشه': 'bg-rose-600',
  'خاجی': 'bg-orange-600',
  'خورشیدی': 'bg-amber-500',
  'قلب': 'bg-emerald-600',
  'گلو': 'bg-sky-600',
  'چشم‌سوم': 'bg-indigo-700',
  'تاج': 'bg-purple-700',
  'شخصی': 'bg-slate-600'
};

const CATEGORY_TEXT_COLORS: Record<string, string> = {
  'ریشه': 'text-rose-600',
  'خاجی': 'text-orange-600',
  'خورشیدی': 'text-amber-500',
  'قلب': 'text-emerald-600',
  'گلو': 'text-sky-600',
  'چشم‌سوم': 'text-indigo-700',
  'تاج': 'text-purple-700',
  'شخصی': 'text-slate-600'
};

const CATEGORY_BORDER_COLORS: Record<string, string> = {
  'ریشه': 'border-rose-200 dark:border-rose-900/30',
  'خاجی': 'border-orange-200 dark:border-orange-900/30',
  'خورشیدی': 'border-amber-200 dark:border-amber-900/30',
  'قلب': 'border-emerald-200 dark:border-emerald-900/30',
  'گلو': 'border-sky-200 dark:border-sky-900/30',
  'چشم‌سوم': 'border-indigo-200 dark:border-indigo-900/30',
  'تاج': 'border-purple-200 dark:border-purple-900/30',
  'شخصی': 'border-slate-200 dark:border-slate-800'
};

const CATEGORY_ICONS: Record<string, string> = {
  'ریشه': '👣',
  'خاجی': '🏃',
  'خورشیدی': '⚡',
  'قلب': '💖',
  'گلو': '📚',
  'چشم‌سوم': '👁️',
  'تاج': '🧘',
  'شخصی': '✨'
};

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, setHabits, addPoints, resetToDefaults }) => {
  const [showArchive, setShowArchive] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [isListView, setIsListView] = useState(false); 
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCat, setNewHabitCat] = useState('شخصی');

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const chakraOrder = ['ریشه', 'خاجی', 'خورشیدی', 'قلب', 'گلو', 'چشم‌سوم', 'تاج', 'شخصی'];

  const calendarWeekDays = useMemo(() => {
    const days = [];
    const now = new Date();
    const dayOfWeek = (now.getDay() + 1) % 7; 
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek + (weekOffset * 7));
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dStr = d.toISOString().split('T')[0];
      days.push({
        dateStr: dStr,
        dayNum: new Intl.DateTimeFormat('fa-IR', { day: 'numeric', calendar: 'persian' } as any).format(d),
        weekday: new Intl.DateTimeFormat('fa-IR', { weekday: 'narrow', calendar: 'persian' } as any).format(d),
        isToday: dStr === todayStr
      });
    }
    return days;
  }, [weekOffset, todayStr]);

  const activeHabits = useMemo(() => {
    return habits.filter(h => h.active);
  }, [habits]);

  const toggleHabitDay = (habitId: string, dateStr: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const isDone = h.completions.includes(dateStr);
        addPoints(isDone ? -1 : 1);
        return { ...h, completions: isDone ? h.completions.filter(d => d !== dateStr) : [...h.completions, dateStr] };
      }
      return h;
    }));
  };

  const deactivateHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, active: false } : h));
  };

  const handleCreateHabit = () => {
    if (!newHabitName.trim()) return;
    const newHabit: Habit = {
      id: `custom-${Date.now()}`,
      name: newHabitName,
      category: newHabitCat,
      icon: CATEGORY_ICONS[newHabitCat] || '✨',
      color: CATEGORY_COLORS[newHabitCat] || 'bg-slate-600',
      completions: [],
      streak: 0,
      frequency: 7,
      active: true
    };
    setHabits(prev => [...prev, newHabit]);
    setNewHabitName('');
    setShowAddHabit(false);
  };

  const onDragStart = (idx: number) => setDraggedIdx(idx);
  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const newHabits = [...habits];
    const hA = activeHabits[draggedIdx];
    const hB = activeHabits[idx];
    const iA = habits.findIndex(h => h.id === hA.id);
    const iB = habits.findIndex(h => h.id === hB.id);
    const temp = newHabits[iA];
    newHabits[iA] = newHabits[iB];
    newHabits[iB] = temp;
    setHabits(newHabits);
    setDraggedIdx(idx);
  };

  return (
    <div className="space-y-3 pb-6 h-full flex flex-col overflow-hidden">
      {/* هدر دکمه‌های اصلی */}
      <div className="flex gap-2 items-center px-1">
        <button onClick={() => setShowArchive(true)} className="flex-1 py-4 bg-indigo-600 text-white rounded-3xl text-[10px] font-black flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
          <Library size={16} /> مدیریت
        </button>
        <button onClick={() => setShowAddHabit(true)} className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all border-4 border-white dark:border-slate-800 flex-shrink-0">
          <Plus size={28} />
        </button>
        <button onClick={() => setIsListView(!isListView)} className="flex-1 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-3xl text-[10px] font-black flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
          {isListView ? <LayoutGrid size={16} /> : <List size={16} />}
          {isListView ? 'نمای کارت' : 'نمای لیست'}
        </button>
        <button onClick={() => setShowStats(true)} className="w-11 h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-500 rounded-2xl flex items-center justify-center shadow-sm active:scale-95 transition-all flex-shrink-0">
          <TrendingUp size={20} />
        </button>
      </div>

      {/* تقویم نواری هفته */}
      <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/40 p-1.5 rounded-3xl border border-slate-100 dark:border-slate-800/50">
        <button onClick={() => setWeekOffset(prev => prev - 1)} className="p-1 text-slate-400 hover:text-indigo-500 transition-colors"><ChevronRight size={18}/></button>
        <div className="flex-1 grid grid-cols-7 gap-1 text-center">
          {calendarWeekDays.map((day) => (
            <button 
              key={day.dateStr}
              onClick={() => setSelectedDateStr(day.dateStr)}
              className={`flex flex-col items-center justify-center h-12 rounded-xl transition-all border
                ${selectedDateStr === day.dateStr ? 'bg-indigo-600 border-indigo-400 text-white shadow-md' : 'bg-white dark:bg-slate-800 border-transparent text-slate-400'}
                ${day.isToday && selectedDateStr !== day.dateStr ? 'ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-slate-900' : ''}
              `}
            >
              <span className="text-[7px] font-black uppercase opacity-60 leading-none mb-1">{day.weekday}</span>
              <span className="text-xs font-black tabular-nums leading-none">{day.dayNum}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setWeekOffset(prev => prev + 1)} className="p-1 text-slate-400 hover:text-indigo-500 transition-colors"><ChevronLeft size={18}/></button>
      </div>

      {/* لیست عادت‌ها */}
      <div className="flex-1 space-y-2 custom-scroll overflow-y-auto px-1">
        {activeHabits.map((habit, idx) => (
          isListView ? (
            <div 
              key={habit.id} 
              className="bg-white dark:bg-slate-900 py-2 px-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3 relative transition-all"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                <span className="text-sm">{habit.icon}</span>
                <h4 className="text-[10px] font-black dark:text-white truncate">{habit.name}</h4>
              </div>
              
              <div className="grid grid-cols-7 gap-1 w-48 flex-shrink-0">
                {calendarWeekDays.map((day, dIdx) => {
                  const isDone = habit.completions.includes(day.dateStr);
                  const isSelected = day.dateStr === selectedDateStr;
                  return (
                    <button 
                      key={dIdx} 
                      onClick={() => toggleHabitDay(habit.id, day.dateStr)}
                      className={`h-6 rounded-md flex items-center justify-center transition-all border relative overflow-hidden
                        ${isDone ? `${habit.color} text-white border-transparent glint-effect` : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-200'}
                        ${isSelected ? 'ring-2 ring-indigo-500 ring-inset' : ''}
                      `}
                    >
                      {isDone ? <Check size={10} strokeWidth={4} /> : <span className="text-[6px]">{day.dayNum}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div 
              key={habit.id} 
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={(e) => onDragOver(e, idx)}
              onDragEnd={() => setDraggedIdx(null)}
              className={`bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-3 relative overflow-hidden transition-all duration-300 ${draggedIdx === idx ? 'opacity-40 scale-95' : ''}`}
            >
              <button onClick={() => deactivateHabit(habit.id)} className="absolute top-3 left-3 text-slate-200 hover:text-rose-500 transition-colors"><MinusCircle size={16} /></button>
              <div className="absolute top-1/2 -translate-y-1/2 right-2 text-slate-200 opacity-20"><GripVertical size={16} /></div>
              
              <div className="flex items-center gap-3 pr-4 pl-6">
                 <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${habit.color} bg-opacity-10 text-slate-800 dark:text-white`}>{habit.icon}</div>
                 <div>
                    <h4 className="text-xs font-black dark:text-white">{habit.name}</h4>
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">{habit.category}</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 px-1">
                 {calendarWeekDays.map((day, dIdx) => {
                   const isDone = habit.completions.includes(day.dateStr);
                   const isSelected = day.dateStr === selectedDateStr;
                   return (
                     <button 
                       key={dIdx} 
                       onClick={() => toggleHabitDay(habit.id, day.dateStr)}
                        className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all border-2 relative overflow-hidden
                          ${isDone ? `${habit.color} text-white border-transparent shadow-sm glint-effect` : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-300'}
                          ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900 z-10' : ''}
                        `}
                     >
                       {isDone ? <Check size={12} strokeWidth={4} /> : <span className="text-[8px] opacity-40">{day.dayNum}</span>}
                       {day.isToday && <div className="absolute -bottom-1 w-1 h-1 bg-emerald-500 rounded-full"></div>}
                     </button>
                   );
                 })}
              </div>
            </div>
          )
        ))}
      </div>

      {showStats && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3.5rem] p-8 shadow-2xl flex flex-col border border-slate-100 dark:border-slate-800 max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-black dark:text-white">تحلیل ماهانه</h3>
                 <button onClick={() => setShowStats(false)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl active:scale-90 transition-all"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 px-1">
                <div className="grid grid-cols-2 gap-3">
                  {chakraOrder.map(cat => {
                    const count = habits.filter(h => h.category === cat).reduce((acc, h) => acc + h.completions.length, 0);
                    return (
                      <div key={cat} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col items-center">
                         <span className="text-2xl mb-1">{CATEGORY_ICONS[cat]}</span>
                         <span className="text-[9px] font-black text-slate-400 uppercase mb-1">{cat}</span>
                         <span className="text-xl font-black text-indigo-600 tabular-nums">{count} تیک</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button onClick={() => setShowStats(false)} className="w-full py-5 bg-slate-950 dark:bg-white dark:text-slate-950 text-white rounded-[2rem] font-black text-sm shadow-xl mt-6">بستن</button>
           </div>
        </div>
      )}

      {showAddHabit && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-8 shadow-2xl flex flex-col border-4 border-emerald-50 dark:border-slate-800">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-2xl dark:text-white">عادت جدید</h3>
                <button onClick={() => setShowAddHabit(false)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl"><X size={20}/></button>
             </div>
             <input 
               type="text" 
               value={newHabitName}
               onChange={(e) => setNewHabitName(e.target.value)}
               className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none outline-none font-bold text-sm dark:text-white mb-4 shadow-inner"
               placeholder="نام عادت جدید..."
             />
             <div className="grid grid-cols-2 gap-2 mb-6">
                {chakraOrder.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setNewHabitCat(cat)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all 
                      ${newHabitCat === cat 
                        ? `${CATEGORY_COLORS[cat]} border-transparent text-white shadow-lg scale-105` 
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500'}`}
                  >
                     <span className="text-xs">{CATEGORY_ICONS[cat]}</span>
                     <span className="text-[10px] font-black">{cat}</span>
                  </button>
                ))}
             </div>
             <button onClick={handleCreateHabit} className="w-full py-5 bg-emerald-500 text-white rounded-[2rem] font-black text-sm shadow-xl active:scale-95 transition-all">ایجاد عادت جدید</button>
          </div>
        </div>
      )}

      {showArchive && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3.5rem] p-8 shadow-2xl flex flex-col h-[85vh] border-4 border-slate-50 dark:border-slate-800">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-2xl dark:text-white">مدیریت عادت‌ها</h3>
                <button onClick={() => setShowArchive(false)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl active:scale-90 transition-all"><X size={20} /></button>
             </div>
             <div className="flex-1 overflow-y-auto custom-scroll no-scrollbar space-y-2 px-1">
                {habits.map(h => {
                  const chakraColor = CATEGORY_COLORS[h.category] || 'bg-slate-600';
                  const chakraBorder = CATEGORY_BORDER_COLORS[h.category] || 'border-slate-200';
                  const chakraTextColor = CATEGORY_TEXT_COLORS[h.category] || 'text-slate-600';
                  
                  return (
                    <div 
                      key={h.id} 
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all
                        ${h.active 
                          ? `${chakraColor} bg-opacity-10 ${chakraBorder}` 
                          : 'bg-slate-50 dark:bg-slate-800 border-transparent opacity-60'}`}
                    >
                      <div className="flex items-center gap-3">
                         <span className="text-xl">{h.icon}</span>
                         <div className="flex flex-col">
                            <span className={`text-[10px] font-black ${h.active ? 'dark:text-white' : 'text-slate-500'}`}>{h.name}</span>
                            <span className={`text-[7px] font-bold uppercase ${h.active ? chakraTextColor : 'text-slate-400'}`}>{h.category}</span>
                         </div>
                      </div>
                      <button 
                        onClick={() => setHabits(prev => prev.map(item => item.id === h.id ? {...item, active: !item.active} : item))}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black transition-all ${h.active ? `${chakraColor} text-white shadow-md` : 'bg-slate-200 dark:bg-slate-700 text-slate-600'}`}
                      >
                        {h.active ? 'فعال' : 'بایگانی'}
                      </button>
                    </div>
                  );
                })}
             </div>
             <button onClick={() => setShowArchive(false)} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-sm shadow-xl mt-4">ذخیره و بازگشت</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
