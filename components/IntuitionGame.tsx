
import React, { useState, useEffect, useMemo } from 'react';
import { UserStats } from '../types';
import { RefreshCw, Home, Trophy, Brain, Zap, Target, Sparkles, Waves } from 'lucide-react';

interface IntuitionGameProps {
  onHome: () => void;
}

const RANKS = [
  { name: 'نوآموز شهود', min: 0, color: 'text-slate-400', glow: 'shadow-slate-500/20', bg: 'bg-slate-500/10' },
  { name: 'بینای فرکانس', min: 50, color: 'text-emerald-400', glow: 'shadow-emerald-500/20', bg: 'bg-emerald-500/10' },
  { name: 'ارباب رنگ‌ها', min: 150, color: 'text-blue-400', glow: 'shadow-blue-500/20', bg: 'bg-blue-500/10' },
  { name: 'چشمِ بصیرت', min: 350, color: 'text-purple-400', glow: 'shadow-purple-500/20', bg: 'bg-purple-500/10' },
  { name: 'استادِ شهود', min: 600, color: 'text-amber-400', glow: 'shadow-amber-500/30', bg: 'bg-amber-500/10' }
];

const IntuitionGame: React.FC<IntuitionGameProps> = ({ onHome }) => {
  const [gameState, setGameState] = useState<'playing' | 'result'>('playing');
  const [hiddenColor, setHiddenColor] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [streak, setStreak] = useState(0);
  const [showFloatingPoints, setShowFloatingPoints] = useState<number | null>(null);
  
  const [intuitionXP, setIntuitionXP] = useState(() => {
    const saved = localStorage.getItem('mj-intuition-xp');
    return saved ? parseInt(saved) : 0;
  });

  const colors = [
    { name: 'نیلی', hex: 'bg-indigo-600' },
    { name: 'زرشکی', hex: 'bg-rose-600' },
    { name: 'زمردی', hex: 'bg-emerald-600' },
    { name: 'طلایی', hex: 'bg-amber-500' }
  ];

  const currentRank = useMemo(() => {
    return [...RANKS].reverse().find(r => intuitionXP >= r.min) || RANKS[0];
  }, [intuitionXP]);

  const nextRank = useMemo(() => {
    return RANKS[RANKS.indexOf(currentRank) + 1] || null;
  }, [currentRank]);

  const progressToNext = useMemo(() => {
    if (!nextRank) return 100;
    const range = nextRank.min - currentRank.min;
    const currentProgressValue = intuitionXP - currentRank.min;
    return Math.max(1, (currentProgressValue / range) * 100);
  }, [intuitionXP, currentRank, nextRank]);

  const pointsNeeded = useMemo(() => {
    if (!nextRank) return 0;
    return nextRank.min - intuitionXP;
  }, [intuitionXP, nextRank]);

  useEffect(() => {
    startNewRound();
  }, []);

  useEffect(() => {
    localStorage.setItem('mj-intuition-xp', intuitionXP.toString());
  }, [intuitionXP]);

  const startNewRound = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)].hex;
    setHiddenColor(randomColor);
    setGameState('playing');
    setShowFloatingPoints(null);
  };

  const handleGuess = (color: string) => {
    setSelectedColor(color);
    setGameState('result');
    
    if (color === hiddenColor) {
      setIntuitionXP(prev => prev + 3);
      setShowFloatingPoints(3);
      setStreak(s => s + 1);
    } else {
      setIntuitionXP(prev => Math.max(0, prev - 1));
      setShowFloatingPoints(-1);
      setStreak(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#020617] flex flex-col items-center justify-start overflow-hidden select-none animate-in fade-in duration-500 font-['Vazirmatn']">
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(79,70,229,0.1),transparent_70%)] opacity-60"></div>
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-indigo-600/5 blur-[100px] rounded-full animate-pulse"></div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full text-center px-12 opacity-5 scale-125 select-none">
          <p className="text-white text-[10px] font-bold leading-relaxed whitespace-pre-wrap">
            آرامم کن همونطور که دریا را... آرامم کن بعد از هر طوفانی...
          </p>
        </div>
      </div>

      <div className="w-full max-w-md px-8 pt-8 space-y-4 z-20 animate-in slide-in-from-top-10 duration-700">
        <div className="flex justify-between items-center bg-white/5 backdrop-blur-2xl p-4 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-brand-main flex items-center justify-center text-white shadow-lg">
                <Target size={20} />
             </div>
             <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">انرژی بصیرت</p>
                <p className={`text-lg font-black transition-all duration-500 text-white tabular-nums`}>{intuitionXP} XP</p>
             </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onHome(); }} 
            className="w-10 h-10 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center active:scale-90 transition-all hover:bg-white/10"
          >
             <Home size={18} />
          </button>
        </div>
        
        <div className="space-y-3 px-1">
           <div className="flex justify-between items-end">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 ${currentRank.color}`}>
                {currentRank.name}
              </span>
              {nextRank && (
                <span className="text-[10px] font-black text-slate-400 flex items-center gap-1.5">
                  <Sparkles size={11} className="text-amber-400 animate-pulse" />
                  <span className="tabular-nums">{pointsNeeded}</span> تا سطح بعد
                </span>
              )}
           </div>
           
           <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] relative"
                style={{ width: `${progressToNext}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
              </div>
           </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-md px-8 flex flex-col items-center justify-center relative z-10 pb-16">
        
        {showFloatingPoints !== null && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 animate-score-float flex flex-col items-center pointer-events-none z-50">
            <div className={`font-black text-5xl px-12 py-5 rounded-[2.5rem] shadow-2xl border-4 border-white/40 animate-bounce flex items-center gap-3 ${showFloatingPoints > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}>
              {showFloatingPoints > 0 ? `+${showFloatingPoints}` : showFloatingPoints}
              <Zap size={28} className="fill-white" />
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="w-full space-y-12 animate-in slide-in-from-bottom-12 flex flex-col items-center">
            <div className="text-center space-y-5 px-4 relative">
              <h4 className="text-white font-black text-xl leading-relaxed text-center px-2 drop-shadow-md">
                این چهار رنگو ببین و چند تا نفس عمیق بکش و حالا چشاتو ببند اولین گزینه‌ای(رنگ) که تو اون سیاهی میبینی رو انتخاب کن. <br/> <span className="text-brand-main">به حس شهودت ایمان داشته باش</span>
              </h4>
              <div className="flex justify-center gap-3 opacity-50">
                 <Waves className="w-5 h-5 text-brand-main animate-pulse" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-5 w-full max-w-[320px]">
              {colors.map((c) => (
                <button 
                  key={c.name} 
                  onClick={() => handleGuess(c.hex)} 
                  className={`h-28 rounded-[3.5rem] ${c.hex} border-[6px] border-white/10 shadow-2xl active:scale-90 transition-all hover:scale-[1.05] relative group overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <div className="absolute inset-0 shadow-[inset_0_4px_12px_rgba(255,255,255,0.2)]"></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center space-y-10 animate-in zoom-in duration-500 w-full max-w-sm flex flex-col items-center">
            <div className={`w-56 h-72 ${hiddenColor} rounded-[4rem] shadow-[0_40px_80px_rgba(0,0,0,0.6)] border-[14px] border-white/10 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-700`}>
                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                {selectedColor === hiddenColor ? (
                  <Trophy className="w-32 h-32 text-white/50 animate-bounce" />
                ) : (
                  <Brain className="w-32 h-32 text-white/20" />
                )}
            </div>
            
            <div className="space-y-3">
              <h3 className={`text-4xl font-black ${selectedColor === hiddenColor ? 'text-emerald-400' : 'text-rose-400'} drop-shadow-xl`}>
                {selectedColor === hiddenColor ? 'اتصال برقرار شد!' : 'تداخل فرکانسی!'}
              </h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">
                {selectedColor === hiddenColor ? 'INSIGHTFUL CONNECTION' : 'SENSORY INTERFERENCE'}
              </p>
            </div>

            <div className="w-full max-w-[300px] mt-4">
               <button 
                 onClick={(e) => { e.stopPropagation(); startNewRound(); }} 
                 className="w-full py-6 bg-brand-main text-white rounded-[2.5rem] font-black text-xl shadow-[0_20px_40px_rgba(79,70,229,0.3)] active:scale-95 transition-all flex items-center justify-center gap-4 group"
               >
                 <RefreshCw size={24} className="group-active:rotate-180 transition-transform duration-500" />
                 ادامه مسیر
               </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes score-float {
          0% { transform: translate(-50%, 60px); opacity: 0; scale: 0.5; }
          20% { transform: translate(-50%, 0); opacity: 1; scale: 1.2; }
          80% { transform: translate(-50%, -60px); opacity: 1; scale: 1; }
          100% { transform: translate(-50%, -120px); opacity: 0; scale: 0.8; }
        }
        .animate-score-float { animation: score-float 2.5s forwards cubic-bezier(0.16, 1, 0.3, 1); }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default IntuitionGame;
