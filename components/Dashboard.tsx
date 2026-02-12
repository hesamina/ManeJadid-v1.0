
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Habit, UserStats, ViewType, Task } from '../types';
import { Orbit, Calendar, Trophy, Sparkles, ArrowUp, Rocket } from 'lucide-react';
import AIInsight from './AIInsight';

interface DashboardProps {
  tasks: Task[];
  habits: Habit[];
  stats: UserStats;
  setActiveView: (view: ViewType) => void;
}

const SKY_STAGES = [
  { id: 0, name: 'سطح زمین', min: 0, color: 'from-slate-200 to-slate-400', message: 'سفر تو از همین‌جا شروع شد. قدم‌های اول همیشه سخت‌ترین هستند.' },
  { id: 1, name: 'آسمان اول', min: 11, color: 'from-blue-200 to-indigo-400', message: 'تبریک! تو از جاذبه زمین رها شدی. حالا در آسمان اول پرواز می‌کنی.' },
  { id: 2, name: 'آسمان دوم', min: 77, color: 'from-indigo-300 to-purple-500', message: 'فوق‌العاده است! ارتعاش تو حالا در آسمان دوم طنین‌انداز شده.' },
  { id: 3, name: 'آسمان سوم', min: 222, color: 'from-amber-300 to-orange-500', message: 'تو به یک منبع قدرت تبدیل شدی. آسمان سوم با حضور تو روشن‌تر است.' },
  { id: 4, name: 'آسمان چهارم', min: 777, color: 'from-emerald-300 to-teal-500', message: 'بیداری کامل! تو حالا در اوج آسمان چهارم، خالق واقعیت خود هستی.' },
];

const Dashboard: React.FC<DashboardProps> = ({ tasks, habits, stats, setActiveView }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [celebratedSkyId, setCelebratedSkyId] = useState<number>(() => {
    const saved = localStorage.getItem('mj-last-celebrated-sky');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentSky = useMemo(() => {
    return [...SKY_STAGES].reverse().find(s => stats.points >= s.min) || SKY_STAGES[0];
  }, [stats.points]);

  useEffect(() => {
    if (currentSky.id > celebratedSkyId) {
      setShowLevelUp(true);
      setCelebratedSkyId(currentSky.id);
      localStorage.setItem('mj-last-celebrated-sky', currentSky.id.toString());
      if (window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 200, 50, 300]);
      }
    }
  }, [currentSky.id, celebratedSkyId]);

  const persianFullDate = useMemo(() => {
    return new Intl.DateTimeFormat('fa-IR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    }).format(currentTime);
  }, [currentTime]);

  const chakraData = useMemo(() => {
    const categoryConfig = [
      { name: 'ریشه', hex: '#FF0040', glow: 'rgba(255, 0, 64, 0.4)' },
      { name: 'خاجی', hex: '#FF6D00', glow: 'rgba(255, 109, 0, 0.4)' },
      { name: 'خورشیدی', hex: '#FFD600', glow: 'rgba(255, 214, 0, 0.4)' },
      { name: 'قلب', hex: '#00E676', glow: 'rgba(0, 230, 118, 0.4)' },
      { name: 'گلو', hex: '#00B0FF', glow: 'rgba(0, 176, 255, 0.4)' },
      { name: 'چشم‌سوم', hex: '#3D5AFE', glow: 'rgba(61, 90, 254, 0.4)' },
      { name: 'تاج', hex: '#D500F9', glow: 'rgba(213, 0, 249, 0.4)' }
    ];
    
    return categoryConfig.map(cat => {
      const activeInCat = habits.filter(h => h.active && h.category === cat.name);
      const totalTicks = activeInCat.reduce((sum, h) => sum + h.completions.length, 0);
      return { ...cat, ticks: totalTicks };
    });
  }, [habits]);

  const nextSky = SKY_STAGES[currentSky.id + 1] || { min: stats.points, name: 'اوج نهایی' };
  const xpLeft = Math.max(0, nextSky.min - stats.points);
  const progress = Math.min(100, ((stats.points - currentSky.min) / (nextSky.min - currentSky.min || 1)) * 100);

  const energyPoints = chakraData.map((c, i) => {
    const angle = (i * (360 / 7)) - 90;
    const radius = 110; 
    const radian = angle * (Math.PI / 180);
    return {
      x: 150 + radius * Math.cos(radian), 
      y: 150 + radius * Math.sin(radian),
      ...c
    };
  });

  return (
    <div className="min-h-full flex flex-col gap-6 py-2 overflow-x-hidden animate-in fade-in select-none">
      
      {/* پیام تبریک صعود */}
      {showLevelUp && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center p-8 bg-slate-950/90 backdrop-blur-2xl animate-in zoom-in duration-500 text-center">
          <div className="relative mb-8">
            <div className={`w-40 h-40 bg-gradient-to-br ${currentSky.color} rounded-[3rem] flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] animate-bounce border-4 border-white`}>
              <Rocket size={80} className="text-white" />
            </div>
            <Sparkles className="absolute -top-6 -right-6 text-amber-400 animate-pulse" size={48} />
            <Sparkles className="absolute -bottom-6 -left-6 text-indigo-400 animate-pulse" size={32} />
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white tracking-tighter">صعود به {currentSky.name}!</h2>
            <p className="text-xl font-bold text-slate-300 leading-relaxed max-w-sm mx-auto">
              {currentSky.message}
            </p>
          </div>

          <button 
            onClick={() => setShowLevelUp(false)}
            className="mt-12 w-full max-w-xs py-6 bg-white text-slate-900 rounded-[2.5rem] font-black text-lg shadow-2xl active:scale-95 transition-all"
          >
            ادامه مسیر صعود
          </button>
        </div>
      )}

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10">
          <Calendar size={12} className="text-brand-main" />
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 tabular-nums">{persianFullDate}</span>
        </div>
        <div className="relative">
          <p className="text-[10px] font-black text-brand-main uppercase tracking-[0.3em] mb-1">لحظه اکنون</p>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tabular-nums drop-shadow-sm">
             {currentTime.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
          </h2>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-brand-main/20 rounded-full"></div>
        </div>
      </div>

      <AIInsight habits={habits} tasks={tasks} stats={stats} />

      <div className="relative h-[300px] flex items-center justify-center flex-shrink-0">
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10 overflow-visible" viewBox="0 0 300 300">
            {energyPoints.map((p, i) => (
              <line key={i} x1="150" y1="150" x2={p.x} y2={p.y} stroke={p.hex} strokeWidth="2" />
            ))}
          </svg>

          {energyPoints.map((p, i) => (
            <div 
              key={i} 
              className="chakra-node absolute w-[52px] h-[52px] rounded-full flex flex-col items-center justify-center z-20 overflow-hidden glint-trigger animate-float-node"
              style={{ 
                left: `${p.x}px`, 
                top: `${p.y}px`, 
                transform: 'translate(-50%, -50%)',
                backgroundColor: p.hex,
                boxShadow: `0 0 25px ${p.glow}`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            >
              <span className="text-[13px] font-black text-white tabular-nums relative z-10 drop-shadow-md">{p.ticks}</span>
              <span className="absolute -bottom-5 text-[7px] font-black text-slate-400 dark:text-slate-500 whitespace-nowrap uppercase tracking-tighter">{p.name}</span>
            </div>
          ))}

          <div className={`w-36 h-36 bg-gradient-to-br ${currentSky.color} rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[8px] border-white dark:border-slate-800 flex flex-col items-center justify-center z-10 transition-all duration-500 relative animate-pulse-slow`}>
             <Orbit className="w-7 h-7 mb-1 opacity-20 text-slate-900 dark:text-white" />
             <h3 className="text-sm font-black text-center px-4 leading-tight text-slate-800 dark:text-white">{currentSky.name}</h3>
             {xpLeft > 0 && <div className="absolute -top-2 -right-2 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-lg animate-pulse">L{currentSky.id}</div>}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 mx-1">
        <div className="flex justify-between items-end mb-3">
          <div className="text-right">
            <h4 className="text-[8px] font-black text-brand-main uppercase tracking-widest mb-1">ماموریت صعود</h4>
            <p className="text-sm font-black text-slate-900 dark:text-white leading-none">
                {xpLeft > 0 ? `${xpLeft} امتیاز تا ${nextSky.name}` : 'در اوج نهایی'}
            </p>
          </div>
          <div className="text-left flex items-center gap-2">
            <ArrowUp size={14} className="text-emerald-500" />
            <span className="text-xl font-black tabular-nums text-slate-700 dark:text-slate-300">{stats.points} / {nextSky.min}</span>
          </div>
        </div>
        <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
           <div className={`h-full rounded-full bg-gradient-to-r ${currentSky.color} transition-all duration-1000 shadow-lg`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <style>{`
        @keyframes float-node {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }
        .animate-float-node {
          animation: float-node linear infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
