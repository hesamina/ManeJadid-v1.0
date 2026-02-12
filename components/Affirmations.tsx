
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, Sparkles, CheckCircle2, RotateCcw, ArrowRight, 
  Zap, Target, Star, Smile, Crown, Calendar as CalendarIcon,
  Video, Loader2, Play, Download, Key
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const AFFIRMATIONS_POOL = [
  "من لایقِ زیباترین نوعِ عشق هستم.",
  "من همین حالا کامل و کافی هستم.",
  "قلبِ من خانه‌یِ امنِ آرامش است.",
  "من آگاهانه عشق را انتخاب می‌کنم.",
  "من با خودم در صلحِ مطلق هستم.",
  "نوری که در من است، راه را می‌سازد.",
  "من به توانمندیِ بی‌پایانم ایمان دارم.",
  "هر تپشِ قلبم، ستایشی برایِ زندگی‌ست.",
  "من مسئولِ شادی و لبخندِ خودم هستم.",
  "من ارزشمندترین داراییِ خودم هستم.",
  "کائنات در هر قدم پشتیبانِ من است.",
  "من رها و رقصان در جریانِ زندگی‌ام.",
  "عشق از من شروع می‌شود و به من بازمی‌گردد.",
  "من معجزه‌یِ زنده‌یِ پروردگارم هستم.",
  "امروز بهترین رفیقِ خودم خواهم بود.",
  "من قدرتِ خلقِ رویاهایم را دارم.",
  "من در آرامشِ الهی غرق شده‌ام.",
  "تمامِ وجودم غرق در نور و سلامتی‌ست.",
  "من لایقِ احترامی بی‌پایان هستم.",
  "من با عشق، تمامِ گذشته را رها می‌کنم."
];

const LOADING_MESSAGES = [
  "در حال فراخوانیِ فرکانس‌هایِ نوری...",
  "هوش مصنوعی در حالِ بافتنِ رویاهایِ توست...",
  "کمی صبر کن، معجزه‌یِ بصریِ تو در راه است...",
  "ارتباط با منبعِ بی‌پایانِ خلاقیت برقرار شد...",
  "تجسمِ تو در حالِ تبدیل به واقعیت است..."
];

interface AffirmationsProps {
  addPoints: (p: number) => void;
}

const Affirmations: React.FC<AffirmationsProps> = ({ addPoints }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [dailyCompleted, setDailyCompleted] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return localStorage.getItem(`mj-affirm-complete-${today}`) === 'true';
  });

  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split('T')[0];

  useEffect(() => {
    if (isGeneratingVideo) {
      const interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isGeneratingVideo]);

  const persianDateParts = useMemo(() => {
    const dayFormatter = new Intl.DateTimeFormat('fa-IR', { day: 'numeric' });
    const monthFormatter = new Intl.DateTimeFormat('fa-IR', { month: 'long' });
    const weekdayFormatter = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' });
    const yearFormatter = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' });
    
    return {
      day: dayFormatter.format(todayDate),
      month: monthFormatter.format(todayDate),
      weekday: weekdayFormatter.format(todayDate),
      year: yearFormatter.format(todayDate)
    };
  }, [todayDate]);

  const dailyAffirmations = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const result: string[] = [];
    const pool = [...AFFIRMATIONS_POOL];
    
    for (let i = 0; i < 3; i++) {
      const index = (dayOfYear * 13 + i * 23) % pool.length;
      result.push(pool.splice(index, 1)[0]);
    }
    return result;
  }, [todayStr]);

  const handleTap = () => {
    if (count < 44) {
      const newCount = count + 1;
      setCount(newCount);
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(15);
      if (newCount === 44) {
        setIsFinished(true);
        addPoints(44);
      }
    }
  };

  const generateSoulVideo = async () => {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }

    setIsGeneratingVideo(true);
    setVideoUrl(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `A cinematic, highly spiritual and artistic video representing this affirmation: "${selected}". Visual style: Ethereal particles of light, a person glowing from within, standing in a field of cosmic flowers or golden ocean. Soft lighting, cinematic 4k, meditative atmosphere, shades of rose quartz, gold and soft indigo. Symbols of rebirth and self-love.`;
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '9:16'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);
      setVideoUrl(localUrl);
    } catch (error) {
      console.error("Video Generation Error:", error);
      alert("خطایی در تولید ویدیو رخ داد. لطفاً از اتصال اینترنت و کلید API معتبر اطمینان حاصل کنید.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleDailyComplete = () => {
    if (dailyCompleted) return;
    setDailyCompleted(true);
    localStorage.setItem(`mj-affirm-complete-${todayStr}`, 'true');
    addPoints(20);
  };

  const reset = () => {
    setCount(0);
    setIsFinished(false);
    setSelected(null);
    setVideoUrl(null);
  };

  if (isGeneratingVideo) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-950 text-white text-center space-y-12 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Video size={40} className="text-rose-500 animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-black">{LOADING_MESSAGES[loadingMsgIdx]}</h2>
          <p className="text-sm font-bold text-slate-400 leading-relaxed italic px-4">
            « {selected} »
          </p>
        </div>
      </div>
    );
  }

  if (videoUrl) {
    return (
      <div className="h-full flex flex-col bg-slate-950 animate-in zoom-in duration-500 relative">
        <video 
          src={videoUrl} 
          autoPlay 
          loop 
          playsInline 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col items-center text-center">
          <QuoteIcon className="text-rose-500 mb-6 opacity-60" size={32} />
          <p className="text-xl font-black text-white leading-relaxed mb-10 px-4">
            {selected}
          </p>
          <div className="flex gap-4 w-full max-w-xs">
            <button onClick={reset} className="flex-1 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2">
              <RotateCcw size={16} /> دوباره
            </button>
            <a href={videoUrl} download="SoulReflection.mp4" className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30">
              <Download size={16} /> ذخیره
            </a>
          </div>
        </div>
        <button onClick={reset} className="absolute top-10 left-6 p-4 bg-black/20 backdrop-blur-md rounded-full text-white border border-white/10">
          <RotateCcw size={20} />
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500 p-8 text-center bg-gradient-to-b from-rose-50/50 to-white dark:from-slate-950 dark:to-slate-950">
        <div className="relative">
          <div className="w-36 h-36 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-[0_20px_50px_rgba(244,63,94,0.4)] border-8 border-white dark:border-slate-800 animate-bounce">
             <Crown size={64} strokeWidth={2} />
          </div>
          <Sparkles className="absolute -top-4 -right-4 text-amber-400 animate-pulse" size={32} />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">فرکانس عشق ثبت شد!</h2>
          <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed px-4">
            تحسینت می‌کنم! تو ۴۴ بار ارتعاشِ قدرت را در سلول‌هایت جاری کردی. الان تو در هماهنگیِ کامل با کائنات و خودِ برترت هستی.
          </p>
        </div>
        
        <div className="w-full space-y-3">
          <button 
            onClick={generateSoulVideo}
            className="w-full max-w-xs py-5 bg-gradient-to-r from-rose-500 to-indigo-600 text-white rounded-[2rem] font-black text-sm shadow-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-all group overflow-hidden relative"
          >
            <div className="flex items-center gap-2 relative z-10">
              <Video size={20} /> تجسمِ بصریِ روح
            </div>
            <span className="text-[8px] opacity-70 relative z-10">تبدیلِ این جمله به ویدیو با هوش مصنوعی</span>
          </button>

          <button 
            onClick={reset}
            className="w-full max-w-xs py-5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-[2rem] font-black text-sm active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <RotateCcw size={18} /> بازگشت به لیست جملات
          </button>
        </div>
      </div>
    );
  }

  if (selected) {
    const progress = (count / 44) * 100;
    return (
      <div className="h-full flex flex-col items-center justify-between py-12 px-6 animate-in fade-in duration-500 bg-white dark:bg-slate-950">
        <header className="text-center space-y-4">
           <div className="inline-block px-4 py-1.5 bg-rose-100 dark:bg-rose-900/30 rounded-full border border-rose-200 dark:border-rose-800">
              <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-[0.3em]">Self-Love Activation</span>
           </div>
           <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-relaxed px-4 h-32 flex items-center justify-center">
              « {selected} »
           </h3>
        </header>

        <div className="relative flex items-center justify-center group cursor-pointer w-72 h-72" onClick={handleTap}>
           <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 240 240">
             <circle 
                cx="120" cy="120" r="105" 
                className="stroke-slate-100 dark:stroke-slate-900" 
                strokeWidth="10" fill="transparent" 
             />
             <circle 
                cx="120" cy="120" r="105" 
                className="stroke-rose-500 transition-all duration-300 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]" 
                strokeWidth="10" fill="transparent"
                strokeDasharray={105 * 2 * Math.PI}
                strokeDashoffset={105 * 2 * Math.PI * (1 - progress / 100)}
                strokeLinecap="round"
             />
           </svg>
           
           <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-10px font-black text-rose-300 uppercase tracking-widest mb-1">Self Love</span>
              <span className="text-7xl font-black text-rose-500 tabular-nums animate-in zoom-in-50">{count}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">تکرار آگاهانه</span>
           </div>
        </div>

        <div className="w-full space-y-6 text-center">
           <div className="flex flex-col items-center gap-3">
              <p className="text-xs font-bold text-slate-400 px-10 leading-relaxed">با هر بار لمسِ این دایره‌ی جادویی، این جمله را در قلبت تکرار کن</p>
              <div className="flex gap-1.5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i < (count % 8) ? 'bg-rose-500 scale-125' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                ))}
              </div>
           </div>
           <button onClick={() => setSelected(null)} className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-rose-500 transition-colors">انصراف و انتخاب جمله دیگر</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-8 animate-in slide-in-from-bottom-4 duration-700 bg-slate-50 dark:bg-slate-950">
      <header className="bg-gradient-to-br from-rose-500 via-pink-600 to-indigo-700 pt-10 pb-12 px-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden mx-1 flex flex-col items-center text-center">
        <Heart size={160} className="absolute -right-16 -top-16 opacity-10 rotate-12" />
        <Heart size={160} className="absolute -left-16 -bottom-16 opacity-10 -rotate-12" />
        
        <div className="w-16 h-16 bg-white/20 backdrop-blur-2xl rounded-[1.5rem] flex items-center justify-center shadow-inner group transition-transform hover:scale-110 mb-6 z-10 border border-white/30">
           <Heart className="text-white fill-white" size={32} />
        </div>

        <div className="relative z-10 space-y-4 w-full">
          <div>
            <h2 className="text-4xl font-black leading-none mb-2">سلف لاو</h2>
            <div className="flex items-center justify-center gap-2 opacity-90">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/70">Frequency Activation</span>
               <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="flex justify-center w-full">
            <div className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-6 flex flex-col items-center justify-center min-w-[160px] shadow-[inset_0_4px_12px_rgba(255,255,255,0.1)] border border-white/20">
               <div className="flex items-center gap-2 mb-1">
                  <CalendarIcon size={12} className="opacity-60" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{persianDateParts.weekday}</span>
               </div>
               <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tabular-nums leading-none drop-shadow-lg">{persianDateParts.day}</span>
                  <span className="text-sm font-black opacity-80">{persianDateParts.month}</span>
               </div>
               <span className="text-[10px] font-bold mt-2 opacity-50 tabular-nums">{persianDateParts.year}</span>
            </div>
          </div>

          <p className="text-xs font-medium opacity-90 leading-relaxed max-w-[280px] mx-auto italic">
            « ۴۴ بار تکرارِ آگاهانه برایِ بازسازیِ معماریِ ذهن »
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-6 px-3">
        <div className="flex items-center gap-3 opacity-50 px-4 justify-center">
           <div className="w-12 h-px bg-rose-400/30"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-600 dark:text-rose-400">DAILY WISDOM</span>
           <div className="w-12 h-px bg-rose-400/30"></div>
        </div>
        
        <div className="grid gap-4">
          {dailyAffirmations.map((text, idx) => (
            <button 
              key={idx}
              onClick={() => setSelected(text)}
              className="bg-white dark:bg-slate-900 p-6 rounded-[2.8rem] border border-slate-100 dark:border-slate-800 text-right shadow-sm hover:shadow-xl hover:border-rose-200 dark:hover:border-rose-900/50 active:scale-[0.97] transition-all group flex items-center gap-5"
            >
              <div className="w-14 h-14 bg-rose-50 dark:bg-rose-900/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                 <ArrowRight size={22} />
              </div>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200 leading-relaxed flex-1">
                {text}
              </p>
            </button>
          ))}
        </div>

        <div className="pt-4 pb-10">
          <button 
            onClick={handleDailyComplete}
            disabled={dailyCompleted}
            className={`w-full py-6 rounded-[2.5rem] font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
              dailyCompleted 
                ? 'bg-emerald-500 text-white shadow-emerald-500/20 scale-105 border-none' 
                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-2 border-dashed border-rose-200 dark:border-rose-900/50'
            }`}
          >
            {dailyCompleted ? (
              <>
                <CheckCircle2 size={24} className="animate-in zoom-in" />
                تثبیت شد! امروز ۴۴ بار تکرار کردم
              </>
            ) : (
              <>
                <Smile size={20} className="text-rose-500" />
                امروز ۴۴ بار تکرار کردم
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const QuoteIcon: React.FC<{className?: string, size?: number}> = ({className, size}) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L14.017 3C14.017 1.89543 14.9124 1 16.017 1H19.017C21.2261 1 23.017 2.79086 23.017 5V15C23.017 18.3137 20.3307 21 17.017 21H14.017Z" />
    <path d="M1.017 21L1.017 18C1.017 16.8954 1.91243 16 3.017 16H6.017C6.56928 16 7.017 15.5523 7.017 15V9C7.017 8.44772 6.56928 8 6.017 8H3.017C1.91243 8 1.017 7.10457 1.017 6V3L1.017 3C1.017 1.89543 1.91243 1 3.017 1H6.017C8.22614 1 10.017 2.79086 10.017 5V15C10.017 18.3137 7.33065 21 4.017 21H1.017Z" />
  </svg>
);

export default Affirmations;
