
import React, { useState, useMemo } from 'react';
import { Task, Priority, TaskCategory } from '../types';
import { Plus, Check, Trash2, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle2, Edit2, Save, X, AlertCircle, Zap } from 'lucide-react';

interface DailyPlannerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addPoints: (amount: number) => void;
}

const DailyPlanner: React.FC<DailyPlannerProps> = ({ tasks, setTasks, addPoints }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [flyingPoint, setFlyingPoint] = useState<number | null>(null);
  
  // States for Editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const dateKey = currentDate.toISOString().split('T')[0];
  
  const persianDate = useMemo(() => {
    return new Intl.DateTimeFormat('fa-IR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    }).format(currentDate);
  }, [currentDate]);

  const formatShortPersianDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('fa-IR', { day: 'numeric', month: 'long' }).format(d);
    } catch (e) {
      return dateStr;
    }
  };

  const calculateDelay = (originalDate: string, completedDate: string) => {
    const start = new Date(originalDate);
    const end = new Date(completedDate);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const todayTasks = useMemo(() => {
    return tasks.filter(t => t.date === dateKey);
  }, [tasks, dateKey]);

  const overdueTasks = useMemo(() => {
    return tasks.filter(t => 
      t.date < dateKey && 
      (!t.completed || t.completedAtDate === dateKey)
    );
  }, [tasks, dateKey]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTitle,
      priority: Priority.Medium,
      category: TaskCategory.Personal,
      completed: false,
      createdAt: Date.now(),
      date: dateKey,
      timeSlot: 'morning'
    };

    setTasks([task, ...tasks]);
    setNewTitle('');
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isCompleting = !t.completed;
        addPoints(isCompleting ? 1 : -1);
        
        if (isCompleting) {
           setFlyingPoint(Date.now());
           setTimeout(() => setFlyingPoint(null), 1500);
        }

        return { 
          ...t, 
          completed: isCompleting,
          completedAtDate: isCompleting ? dateKey : undefined 
        };
      }
      return t;
    }));
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = (id: string) => {
    if (!editingTitle.trim()) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, title: editingTitle } : t));
    setEditingId(null);
  };

  const changeDay = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset);
    setCurrentDate(newDate);
    setIsAdding(false);
    setEditingId(null);
  };

  const renderTask = (task: Task, isOverdueMode: boolean = false) => {
    const isActuallyOverdue = task.date < dateKey;
    const hasDelay = task.completed && task.completedAtDate && task.completedAtDate > task.date;
    const delayDays = hasDelay ? calculateDelay(task.date, task.completedAtDate!) : 0;

    return (
      <div 
        key={task.id} 
        className={`group relative p-1 rounded-[2.2rem] transition-all duration-500 ${
          task.completed 
            ? 'bg-emerald-500 shadow-emerald-500/20 shadow-lg' 
            : isOverdueMode 
              ? 'bg-white/40 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800' 
              : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm'
        }`}
      >
        <div className={`flex items-center justify-between p-5 rounded-[2rem] transition-all duration-500 ${
          task.completed ? 'bg-emerald-500' : 'bg-transparent'
        }`}>
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => toggleTask(task.id)} 
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                task.completed 
                  ? 'bg-white text-emerald-600 shadow-lg scale-110 rotate-[360deg]' 
                  : 'bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-300 hover:border-indigo-300'
              }`}
            >
              {task.completed ? <CheckCircle2 className="w-7 h-7 stroke-[3]" /> : <Check className="w-6 h-6 stroke-[3]" />}
            </button>
            
            <div className="text-right flex-1">
              {editingId === task.id ? (
                <div className="flex items-center gap-2">
                  <input 
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-sm font-bold w-full outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                    autoFocus
                  />
                  <button onClick={() => saveEdit(task.id)} className="p-2 text-emerald-500"><Save size={18}/></button>
                  <button onClick={() => setEditingId(null)} className="p-2 text-rose-500"><X size={18}/></button>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-black transition-all ${task.completed ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                      {task.title}
                    </p>
                    {task.completed && (
                      <span className="bg-white/20 text-white text-[9px] px-2 py-0.5 rounded-full font-black animate-in fade-in zoom-in">
                        {hasDelay && task.date === dateKey ? `انجام شد با ${delayDays} روز تاخیر` : "انجام شد"}
                      </span>
                    )}
                  </div>
                  {isActuallyOverdue && (
                     <div className={`flex items-center gap-1 mt-1 ${task.completed ? 'text-white/60' : 'text-amber-600'}`}>
                       <AlertCircle size={10} />
                       <span className="text-[9px] font-black">
                         {task.completed ? `عقب‌افتاده از ${formatShortPersianDate(task.date)} (تکمیل شد)` : `عقب‌افتاده از ${formatShortPersianDate(task.date)}`}
                       </span>
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {!task.completed && editingId !== task.id && (
              <button 
                onClick={() => startEditing(task)} 
                className={`p-2 transition-all rounded-xl ${isOverdueMode ? 'text-slate-400' : 'text-slate-300'} hover:text-indigo-500`}
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} 
              className={`p-2 transition-all rounded-xl ${task.completed ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-slate-200 hover:text-rose-500'}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {task.completed && (
          <div className="absolute inset-0 pointer-events-none rounded-[2.2rem] overflow-hidden">
             <div className="glint-effect opacity-30"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 relative">
      
      {/* انیمیشن امتیاز پرنده */}
      {flyingPoint && (
        <div key={flyingPoint} className="fixed left-1/2 -translate-x-1/2 bottom-32 z-[2000] animate-point-fly pointer-events-none">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-full font-black text-2xl shadow-2xl flex items-center gap-2 border-4 border-white">
            <Zap size={24} fill="white" />
            +1
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => changeDay(-1)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-indigo-500 transition-all active:scale-90"><ChevronRight className="w-6 h-6" /></button>
          <div className="text-center">
            <h2 className="text-xl font-black text-slate-800 dark:text-white tabular-nums">{persianDate}</h2>
            <button onClick={() => setCurrentDate(new Date())} className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1 hover:underline">برگشت به امروز</button>
          </div>
          <button onClick={() => changeDay(1)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-indigo-500 transition-all active:scale-90"><ChevronLeft className="w-6 h-6" /></button>
        </div>

        <div className="flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/20 p-5 rounded-[2rem] border-2 border-dashed border-indigo-100 dark:border-indigo-800">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="block text-xs font-black text-indigo-900 dark:text-indigo-200">برنامه روزانه</span>
                <span className="text-[10px] text-indigo-600/60 dark:text-indigo-400 font-bold">{todayTasks.length} برنامه فعال</span>
              </div>
           </div>
           <button onClick={() => setIsAdding(!isAdding)} className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all ${isAdding ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white'}`}>
             {isAdding ? <Plus className="w-6 h-6 rotate-45" /> : <Plus className="w-7 h-7" />}
           </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={addTask} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl border-4 border-indigo-50 dark:border-indigo-900/30 space-y-6 animate-in slide-in-from-top-4">
          <div className="space-y-4">
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 mr-2 uppercase tracking-widest">برنامه‌ت چیه واسه امروز؟</label>
            <input 
              type="text" 
              placeholder="مثلاً: خرید کتاب جدید" 
              className="w-full p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border-none outline-none font-bold text-sm focus:ring-4 focus:ring-indigo-500/10 dark:text-white transition-all shadow-inner"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-700 active:scale-95 transition-all">ثبت برنامه</button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-sm active:scale-95 transition-all">لغو</button>
          </div>
        </form>
      )}

      {/* لیست عقب‌افتاده‌ها */}
      {overdueTasks.length > 0 && (
        <div className="space-y-4 px-1">
          <div className="flex items-center gap-3 mr-2 opacity-50">
            <div className="w-6 h-1 bg-amber-500 rounded-full"></div>
            <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">عقب‌افتاده‌ها</h3>
          </div>
          {overdueTasks.map(t => renderTask(t, true))}
        </div>
      )}

      {/* لیست تسک‌های امروز */}
      <div className="space-y-4 px-1">
        <div className="flex items-center gap-3 mr-2 opacity-50">
          <div className="w-6 h-1 bg-indigo-500 rounded-full"></div>
          <h3 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">برنامه روز</h3>
        </div>
        {todayTasks.length === 0 && overdueTasks.length === 0 ? (
          <div className="text-center py-24 opacity-20 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
               <CalendarIcon className="w-10 h-10" />
            </div>
            <p className="text-sm font-black text-slate-800 dark:text-white">هنوز برنامه‌ای برای این روز نداری...</p>
          </div>
        ) : (
          todayTasks.map(t => renderTask(t))
        )}
      </div>

      <style>{`
        @keyframes point-fly {
          0% { transform: translate(-50%, 0); opacity: 0; scale: 0.5; }
          20% { opacity: 1; scale: 1.2; }
          100% { transform: translate(-50%, -100vh); opacity: 0; scale: 0.8; }
        }
        .animate-point-fly {
          animation: point-fly 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default DailyPlanner;
