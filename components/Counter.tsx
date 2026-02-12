
import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, Trophy, Sparkles, Volume2, VolumeX, 
  Infinity as InfinityIcon, CheckCircle2, Edit3,
  RotateCcw, ChevronUp, ChevronDown, Repeat, RefreshCw,
  Zap, ArrowLeftRight
} from 'lucide-react';

const Counter: React.FC = () => {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('mj-counter-val-v8');
    return saved ? parseInt(saved) : 0;
  });
  
  const [hasTarget, setHasTarget] = useState(() => {
    const saved = localStorage.getItem('mj-counter-has-target-v8');
    return saved === 'true'; // پیش‌فرض روی False (حالت آزاد) است
  });

  const [target, setTarget] = useState(() => {
    const saved = localStorage.getItem('mj-counter-target-v8');
    return saved ? parseInt(saved) : 40;
  });

  const [isMuted, setIsMuted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isEditingCount, setIsEditingCount] = useState(false);
  const [tempCount, setTempCount] = useState(count.toString());
  const [tempTarget, setTempTarget] = useState(target.toString());

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem('mj-counter-val-v8', count.toString());
    localStorage.setItem('mj-counter-has-target-v8', hasTarget.toString());
    localStorage.setItem('mj-counter-target-v8', target.toString());

    if (hasTarget && count > 0 && count === target) {
      triggerGoalReached();
    }
  }, [count, target, hasTarget]);

  const playDing = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) { console.error(e); }
  };

  const handleIncrement = () => {
    if (isEditingCount || showSettings) return;
    setCount(prev => prev + 1);
    if (window.navigator.vibrate) window.navigator.vibrate(15);
  };

  const triggerGoalReached = () => {
    playDing();
    setShowCelebration(true);
    if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100, 50, 200]);
  };

  const resetToZero = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('آیا می‌خواهید شمارنده را صفر کنید؟')) {
      setCount(0);
      setTempCount("0");
      setShowCelebration(false);
      if (window.navigator.vibrate) window.navigator.vibrate([30, 80]);
    }
  };

  const saveManualCount = () => {
    const val = parseInt(tempCount);
    if (!isNaN(val) && val >= 0) {
      setCount(val);
      setIsEditingCount(false);
    }
  };

  const saveTargetValue = () => {
    const val = parseInt(tempTarget);
    if (!isNaN(val) && val > 0) {
      setTarget(val);
      setHasTarget(true);
      setShowSettings(false);
      if (count === val) triggerGoalReached();
    }
  };

  const toggleMode = () => {
    if (!hasTarget) {
      setShowSettings(true);
    } else {
      setHasTarget(false);
    }
  };

  const progress = hasTarget ? Math.min(100, (count / target) * 100) : 0;
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = hasTarget ? circumference - (progress / 100) * circumference : circumference;

  return (
    <div className="h-full flex flex-col items-center justify-between py-8 px-6 animate-in fade-in duration-700 bg-slate-50 dark:bg-slate-950 relative overflow-hidden font-['Vazirmatn'] select-none">
      
      {/* هدر: دکمه سوئیچ بزرگ و واضح */}
      <div className="w-full flex flex-col gap-4 z-20">
        <div className="flex justify-between items-center px-2">
            <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center text-slate-400 active:scale-90 transition-all border border-slate-100 dark:border-slate-800"
            >
                {isMuted ? <VolumeX size={20}/> : <Volume2 size={20}/>}
            </button>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">شمارنده هوشمند</h2>
        </div>

        <button 
          onClick={toggleMode}
          className={`group w-full flex items-center justify-between p-2 pr-5 rounded-[2rem] transition-all duration-500 shadow-xl active:scale-[0.98] border-2 ${
            hasTarget 
              ? 'bg-indigo-600 border-indigo-400 text-white' 
              : 'bg-emerald-500 border-emerald-400 text-white'
          }`}
        >
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                {hasTarget ? <Target size={24}/> : <InfinityIcon size={24}/>}
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black opacity-70 uppercase tracking-wider leading-none mb-1">حالت فعلی:</p>
                <p className="text-lg font-black leading-none">{hasTarget ? 'هدف‌دار' : 'آزاد'}</p>
             </div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
             <span className="text-[10px] font-bold">تغییر حالت</span>
             <ArrowLeftRight size={14} className="opacity-50" />
          </div>
        </button>
      </div>

      {/* بخش مرکزی شمارنده */}
      <div className="relative flex flex-col items-center gap-12 w-full max-w-[320px]">
        
        <div className="relative flex items-center justify-center w-full aspect-square group">
          {/* هاله نوری پس‌زمینه بر اساس حالت */}
          <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-all duration-1000 ${hasTarget ? 'bg-indigo-600 scale-100' : 'bg-emerald-500 scale-90'}`} />

          {/* نوار پیشرفت دایره‌ای */}
          <svg className="w-full h-full -rotate-90 overflow-visible z-10" viewBox="0 0 240 240">
             <circle 
                cx="120" cy="120" r={radius} 
                className="stroke-slate-200 dark:stroke-slate-900" 
                strokeWidth="14" fill="transparent" 
             />
             <circle 
                cx="120" cy="120" r={radius} 
                className={`${hasTarget ? 'stroke-indigo-600' : 'stroke-emerald-500'} transition-all duration-700 ease-out`} 
                strokeWidth="14" fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={hasTarget ? strokeDashoffset : 0}
                strokeLinecap="round"
             />
          </svg>
          
          <div 
            onClick={handleIncrement}
            className="absolute inset-4 rounded-full z-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900 shadow-2xl border-[10px] border-slate-50 dark:border-slate-800 active:scale-95 transition-all cursor-pointer group-hover:border-slate-100 dark:group-hover:border-slate-800/80 overflow-hidden"
          >
             <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 transition-colors ${hasTarget ? 'text-indigo-600' : 'text-emerald-500'}`}>
               {hasTarget ? 'In Focus' : 'Free Spirit'}
             </span>
             
             <div className="relative flex flex-col items-center select-none">
                <span className="text-9xl font-black text-slate-800 dark:text-white tabular-nums leading-none tracking-tighter drop-shadow-md">
                  {count}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setTempCount(count.toString()); setIsEditingCount(true); }}
                  className="mt-4 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-300 hover:text-indigo-500 transition-all shadow-inner"
                >
                  <Edit3 size={18} />
                </button>
             </div>

             {hasTarget && (
               <div className="mt-5 flex flex-col items-center gap-1">
                 <div className="h-1.5 w-12 bg-indigo-100 dark:bg-slate-800 rounded-full"></div>
                 <span className="text-xs font-black text-slate-400 tabular-nums">
                   مقصد: {target}
                 </span>
               </div>
             )}
          </div>
        </div>

        {/* دکمه جدید و واضح صفر کردن */}
        <button 
          onClick={resetToZero}
          className="group relative w-full flex items-center justify-center gap-4 py-7 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 shadow-[0_30px_60px_rgba(0,0,0,0.1)] active:scale-95 transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-slate-900/[0.02] group-hover:bg-indigo-500/[0.05] transition-colors"></div>
          <RefreshCw size={28} className="text-indigo-600 group-hover:rotate-180 transition-transform duration-1000 ease-in-out" />
          <div className="text-right">
             <span className="block text-lg font-black text-slate-800 dark:text-white leading-none">صفر کردن فرکانس</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Reset Counter to Zero</span>
          </div>
        </button>
      </div>

      {/* مودال تنظیمات هدف */}
      {showSettings && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
           <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3.5rem] p-10 shadow-2xl border-t-8 border-indigo-600 space-y-10">
              <div className="text-center space-y-2">
                 <h3 className="text-2xl font-black dark:text-white">تعیین مقصد نهایی</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Selection</p>
              </div>

              <div className="relative flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={() => setTempTarget((parseInt(tempTarget || "0") + 1).toString())}
                    className="p-4 text-slate-300 hover:text-indigo-500 transition-colors"
                  >
                    <ChevronUp size={48} />
                  </button>
                  <input 
                    type="number" 
                    autoFocus
                    value={tempTarget}
                    onChange={(e) => setTempTarget(e.target.value)}
                    className="w-full bg-transparent text-8xl font-black text-center dark:text-white outline-none tabular-nums py-2"
                    onFocus={(e) => e.target.select()}
                  />
                  <button 
                    onClick={() => setTempTarget(Math.max(1, parseInt(tempTarget || "1") - 1).toString())}
                    className="p-4 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <ChevronDown size={48} />
                  </button>
              </div>

              <div className="flex flex-col gap-3">
                 <button 
                   onClick={saveTargetValue}
                   className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-sm shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                 >
                   <CheckCircle2 size={20} /> شروع حالت هدف‌دار
                 </button>
                 <button 
                  onClick={() => setShowSettings(false)} 
                  className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest"
                 >
                   انصراف
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* مودال ویرایش دستی عدد */}
      {isEditingCount && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
           <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-8 shadow-2xl border-4 border-slate-100 dark:border-slate-800 space-y-6">
              <h3 className="text-2xl font-black dark:text-white text-center">ویرایش مستقیم</h3>
              <input 
                type="number" 
                autoFocus
                value={tempCount}
                onChange={(e) => setTempCount(e.target.value)}
                className="w-full p-8 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border-none outline-none font-black text-8xl text-center dark:text-white tabular-nums shadow-inner"
                onFocus={(e) => e.target.select()}
              />
              <div className="flex gap-3">
                <button onClick={saveManualCount} className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl">ذخیره</button>
                <button onClick={() => setIsEditingCount(false)} className="px-8 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-sm">لغو</button>
              </div>
           </div>
        </div>
      )}

      {/* صفحه تبریک هدف */}
      {showCelebration && (
        <div className="fixed inset-0 z-[1200] flex flex-col items-center justify-center p-8 bg-indigo-600 text-white animate-in zoom-in duration-500 text-center space-y-8">
           <div className="relative">
              <div className="w-56 h-56 bg-white/20 rounded-[4rem] flex items-center justify-center shadow-2xl animate-bounce border-8 border-white/30">
                 <Trophy size={110} />
              </div>
              <div className="absolute -top-4 -right-4 bg-amber-400 p-4 rounded-[1.5rem] text-slate-900 shadow-xl rotate-12">
                <Sparkles size={40} />
              </div>
           </div>

           <div className="space-y-4 z-10">
              <h3 className="text-5xl font-black tracking-tighter">تبریک!</h3>
              <p className="text-xl font-bold opacity-90 leading-relaxed px-4 max-w-xs">
                تو به عدد {target} رسیدی. اراده‌ی تو تحسین‌برانگیز است.
              </p>
           </div>

           <button 
             onClick={() => { setCount(0); setShowCelebration(false); }}
             className="w-full max-w-xs py-6 bg-white text-indigo-600 rounded-[2.5rem] font-black text-sm shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
           >
              <RefreshCw size={22} /> صفر کردن و شروع مجدد
           </button>
           <button onClick={() => setShowCelebration(false)} className="text-xs font-bold opacity-60">بستن این پیام</button>
        </div>
      )}

      <div className="w-full max-w-sm text-center py-4">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic opacity-60">
             {hasTarget ? 'در مسیر رسیدن به کمال...' : 'آزادی یعنی حضور در لحظه‌ی اکنون...'}
           </p>
      </div>

    </div>
  );
};

export default Counter;
