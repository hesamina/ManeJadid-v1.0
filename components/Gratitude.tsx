
import React, { useState, useEffect } from 'react';
import { GratitudeEntry } from '../types';
import { Sparkles, Heart, Plus, Calendar, Minus, Trash2, Zap } from 'lucide-react';

interface GratitudeProps {
  entries: GratitudeEntry[];
  setEntries: React.Dispatch<React.SetStateAction<GratitudeEntry[]>>;
  addPoints: (amount: number) => void;
}

const Gratitude: React.FC<GratitudeProps> = ({ entries, setEntries, addPoints }) => {
  const [itemCount, setItemCount] = useState(() => {
    const saved = localStorage.getItem('mj-gratitude-count');
    return saved ? parseInt(saved) : 3;
  });
  
  const [items, setItems] = useState<string[]>(Array(itemCount).fill(''));
  const [isAdding, setIsAdding] = useState(false);
  const [flyingPoints, setFlyingPoints] = useState<{ val: number; id: number } | null>(null);

  useEffect(() => {
    setItems(prev => {
      const newItems = [...prev];
      if (itemCount > prev.length) {
        return [...newItems, ...Array(itemCount - prev.length).fill('')];
      } else {
        return newItems.slice(0, itemCount);
      }
    });
    localStorage.setItem('mj-gratitude-count', itemCount.toString());
  }, [itemCount]);

  const save = () => {
    const validItems = items.filter(i => i.trim());
    if (validItems.length === 0) return;
    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      items: validItems,
      date: new Date().toLocaleDateString('fa-IR')
    };
    setEntries([entry, ...entries]);
    setItems(Array(itemCount).fill(''));
    setIsAdding(false);
    
    const pointsToAdd = validItems.length;
    addPoints(pointsToAdd);
    
    // Trigger animation
    const animId = Date.now();
    setFlyingPoints({ val: pointsToAdd, id: animId });
    setTimeout(() => setFlyingPoints(null), 2000);
  };

  const deleteEntry = (id: string) => {
    if (window.confirm('آیا از حذف این شکرگزاری مطمئنی؟')) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const adjustCount = (val: number) => {
    const newCount = Math.min(Math.max(1, itemCount + val), 10);
    setItemCount(newCount);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 relative">
      
      {/* انیمیشن امتیاز پرنده */}
      {flyingPoints && (
        <div key={flyingPoints.id} className="fixed left-1/2 -translate-x-1/2 bottom-32 z-[2000] animate-point-fly pointer-events-none">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-full font-black text-2xl shadow-2xl flex items-center gap-2 border-4 border-white">
            <Zap size={24} fill="white" />
            +{flyingPoints.val}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <Sparkles className="absolute top-4 right-4 opacity-20 w-20 h-20" />
        <h2 className="text-2xl font-black mb-2">امروز برای چی شکرگزاری؟</h2>
        <p className="text-xs font-medium opacity-80 leading-relaxed">سپاسگزاری ارتعاش تو را به بالاترین سطح ممکن می‌برد.</p>
        <button 
          onClick={() => setIsAdding(true)} 
          className="mt-6 bg-white text-rose-600 px-6 py-3 rounded-2xl font-black text-sm active:scale-95 transition-all shadow-lg"
        >
          ثبت شکرگزاری
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-6 animate-in zoom-in-95 border-2 border-rose-100 dark:border-rose-900/20">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Heart className="text-rose-500 w-5 h-5 fill-rose-500" /> 
              خدایا شکرت
            </h3>
            
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700">
              <button type="button" onClick={() => adjustCount(-1)} className="p-1 hover:text-rose-500 text-slate-400"><Minus className="w-4 h-4" /></button>
              <span className="text-xs font-black tabular-nums text-slate-700 dark:text-slate-200">{itemCount}</span>
              <button type="button" onClick={() => adjustCount(1)} className="p-1 hover:text-emerald-500 text-slate-400"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="space-y-3 max-h-[40vh] overflow-y-auto no-scrollbar pr-1">
            {items.map((item, idx) => (
              <div key={idx} className="animate-in slide-in-from-right-2 duration-300">
                <input 
                  type="text" 
                  placeholder={`${idx + 1} - برای ...`}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none outline-none font-bold text-sm focus:ring-2 focus:ring-rose-500/20 dark:text-white"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx] = e.target.value;
                    setItems(newItems);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={save} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all">ثبت شکرگزاری</button>
            <button onClick={() => setIsAdding(false)} className="px-6 py-4 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-2xl font-black text-sm">لغو</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm group relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-slate-400">
                 <Calendar className="w-3.5 h-3.5" />
                 <span className="text-[10px] font-black">{entry.date}</span>
              </div>
              <button 
                onClick={() => deleteEntry(entry.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-4">
              {entry.items.map((it, i) => (
                <li key={i} className="flex items-start gap-4 text-slate-700 dark:text-slate-300 text-sm font-bold">
                  <div className="w-6 h-6 bg-rose-50 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-[11px] text-rose-500 flex-shrink-0 mt-0.5 shadow-sm">{i+1}</div>
                  <span className="leading-relaxed">{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
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

export default Gratitude;
