
import React, { useState } from 'react';
import { COLOR_THEMES } from '../App';
import { 
  Palette, LayoutGrid, Eye, EyeOff, GripVertical, SlidersHorizontal
} from 'lucide-react';
import { ViewConfig, UserStats, Habit, JournalEntry } from '../types';

interface SettingsProps {
  currentThemeId: string;
  setTheme: (id: string) => void;
  navConfig: ViewConfig[];
  setNavConfig: React.Dispatch<React.SetStateAction<ViewConfig[]>>;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  setJournalEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}

const Settings: React.FC<SettingsProps> = ({ 
  currentThemeId, setTheme, navConfig, setNavConfig
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const toggleView = (id: string) => {
    setNavConfig(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // For transparent drag image styling
    const target = e.target as HTMLElement;
    target.style.opacity = "0.4";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const newConfig = [...navConfig];
    const item = newConfig.splice(draggedIndex, 1)[0];
    newConfig.splice(index, 0, item);
    
    setDraggedIndex(index);
    setNavConfig(newConfig);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = "1";
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-1">
      <header className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-brand-main text-on-brand rounded-2xl shadow-2xl transition-all duration-500">
            <SlidersHorizontal className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">مهندسی فرکانس</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] opacity-80">Interface Calibration</p>
          </div>
        </div>
      </header>

      {/* بخش تم‌های رنگی */}
      <section className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[3rem] p-6 border border-white/50 dark:border-slate-800 shadow-xl overflow-hidden relative">
        <h3 className="text-[10px] font-black text-brand-main uppercase tracking-[0.3em] mb-6 block px-4 opacity-70 flex items-center gap-2">
            <Palette size={12}/> انتخاب تم رنگی
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {COLOR_THEMES.map((theme) => {
            const isActive = currentThemeId === theme.id;
            return (
              <button key={theme.id} onClick={() => setTheme(theme.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all border-2 ${isActive ? 'border-brand-main bg-white dark:bg-slate-800 shadow-md' : 'border-transparent bg-white/40 dark:bg-slate-800/30'}`}
              >
                <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: theme.hex }}></div>
                <span className={`text-[11px] font-black ${isActive ? 'text-brand-main' : 'text-slate-600 dark:text-slate-300'}`}>{theme.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* مدیریت نوار ابزار با قابلیت Drag & Drop اصلاح شده */}
      <section className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[3rem] p-6 border border-white/50 dark:border-slate-800 shadow-xl relative">
        <div className="flex justify-between items-center mb-6 px-4">
          <h3 className="text-[10px] font-black text-brand-main uppercase tracking-[0.3em] opacity-70 flex items-center gap-2">
              <LayoutGrid size={12}/> معماری نوار ابزار
          </h3>
          <span className="text-[8px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">Drag & Drop فعال</span>
        </div>
        
        <div className="space-y-2.5">
          {navConfig.map((view, index) => (
            <div 
              key={view.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all cursor-move touch-none ${draggedIndex === index ? 'opacity-50 scale-95 shadow-inner bg-indigo-50 dark:bg-indigo-900/20' : 'hover:border-indigo-300 shadow-sm'}`}
            >
               <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg">
                    <GripVertical size={16} className="text-slate-400" />
                  </div>
                  <span className={`text-[11px] font-black ${view.enabled ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{view.label}</span>
               </div>
               <button onClick={() => toggleView(view.id)} className={`p-2 rounded-xl transition-all ${view.enabled ? 'bg-emerald-500 text-white shadow-emerald-500/20 shadow-lg' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                  {view.enabled ? <Eye size={18}/> : <EyeOff size={18}/>}
               </button>
            </div>
          ))}
        </div>
        <p className="text-[8px] font-bold text-slate-400 mt-4 px-4 leading-relaxed">
          * ۵ گزینه اول نوار اصلی پایین را تشکیل می‌دهند. بقیه موارد در بخش «ابزارها» قرار می‌گیرند.
        </p>
      </section>

      <div className="text-center space-y-4 opacity-70 pt-8">
        <div className="w-12 h-1.5 bg-brand-main/20 mx-auto rounded-full"></div>
        <p className="text-[10px] font-bold text-slate-500 italic px-12 leading-relaxed text-center">
          «ساختار دنیای بیرون، بازتابی از تمرکز درون توست.»
        </p>
      </div>
    </div>
  );
};

export default Settings;
