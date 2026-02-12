
import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { Plus, Trash2, Clock, Flame, Zap } from 'lucide-react';

interface JournalProps {
  entries: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  addPoints: (amount: number) => void;
}

const Journal: React.FC<JournalProps> = ({ entries, setEntries, addPoints }) => {
  const [content, setContent] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [burningId, setBurningId] = useState<string | null>(null);
  const [flyingPoint, setFlyingPoint] = useState<number | null>(null);

  const save = () => {
    if (!content.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      content: content,
      date: new Date().toLocaleDateString('fa-IR'),
    };
    setEntries([entry, ...entries]);
    setContent('');
    setIsWriting(false);
    
    // Add 1 point
    addPoints(1);
    
    // Trigger animation
    setFlyingPoint(Date.now());
    setTimeout(() => setFlyingPoint(null), 1500);
  };

  const burnAndRelease = (id: string) => {
    setBurningId(id);
    addPoints(1);
    setTimeout(() => {
      setEntries(prev => prev.filter(e => e.id !== id));
      setBurningId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 relative">
      
      {/* انیمیشن امتیاز پرنده */}
      {flyingPoint && (
        <div key={flyingPoint} className="fixed left-1/2 -translate-x-1/2 bottom-32 z-[2000] animate-point-fly pointer-events-none">
          <div className="bg-indigo-500 text-white px-6 py-3 rounded-full font-black text-2xl shadow-2xl flex items-center gap-2 border-4 border-white">
            <Zap size={24} fill="white" />
            +1
          </div>
        </div>
      )}

      <div className="flex justify-between items-end bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">ژورنال رهایی</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">تخلیه ذهن از افکار مزاحم</p>
        </div>
        <button onClick={() => setIsWriting(!isWriting)} className="bg-slate-950 dark:bg-white dark:text-slate-950 text-white p-4 rounded-2xl shadow-xl active:scale-95 transition-all">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {isWriting && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-4 animate-in slide-in-from-top-4">
          <textarea 
            className="w-full h-48 p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border-none outline-none text-sm font-bold resize-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            placeholder="هر چیزی که در ذهنت سنگینی می‌کند را اینجا رها کن..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={save} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all">ثبت و رهایی</button>
        </div>
      )}

      <div className="space-y-4">
        {entries.map(entry => {
          const isBurning = burningId === entry.id;
          return (
            <div 
              key={entry.id} 
              className={`bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 group relative transition-all duration-500 ${isBurning ? 'burning-effect ring-4 ring-orange-500/50' : 'hover:shadow-md'}`}
            >
               {isBurning && (
                 <div className="absolute inset-0 z-20 flex items-center justify-center bg-orange-500/5 backdrop-blur-[2px] rounded-[2.5rem]">
                    <Flame className="w-16 h-16 text-orange-500 animate-bounce" />
                 </div>
               )}

               <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-slate-400">
                     <Clock className="w-3.5 h-3.5" />
                     <span className="text-[10px] font-black">{entry.date}</span>
                  </div>
                  <button onClick={() => setEntries(entries.filter(e => e.id !== entry.id))} className="text-slate-200 hover:text-rose-500 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
               
               <p className={`text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-bold mb-6 whitespace-pre-wrap ${isBurning ? 'blur-sm' : ''}`}>{entry.content}</p>

               <button 
                  onClick={() => burnAndRelease(entry.id)}
                  disabled={isBurning}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 via-rose-500 to-orange-600 text-white rounded-2xl text-[10px] font-black shadow-[0_8px_20px_-5px_rgba(249,115,22,0.4)] hover:shadow-orange-500/50 active:scale-95 transition-all flex items-center justify-center gap-2 relative overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                  <Flame className="w-4 h-4" />
                  سوزاندن و رهایی همیشگی
                </button>
            </div>
          );
        })}
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

export default Journal;
