
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Book, Bookmark, BookmarkCheck, Loader2, Sparkles, 
  Trash2, Inbox, Quote, Home, ArrowLeft, Droplets, Calendar
} from 'lucide-react';
import { BookPage, ViewType } from '../types';

// بانک محلی خلاصه‌کتاب‌های برتر - طراحی شده برای عملکرد آفلاین و روایی
const LOCAL_BOOKS_DATABASE = [
  {
    title: "قدرت حال",
    author: "اکهارت تله",
    content: "تله در این شاهکار معنوی، ما را به سفری به درونِ لحظه‌ی ابدیِ اکنون می‌برد. او معتقد است که ذهنِ انسانی، با پرسه زدن در خاطرات تلخ گذشته و اضطراب‌های آینده، قفسی برای روح ساخته است. بیداری واقعی زمانی رخ می‌دهد که ما درک کنیم ما افکارمان نیستیم، بلکه آن حضورِ آگاه و ناظری هستیم که در پسِ افکار نشسته است. \n\n در عمق این آموزه‌ها، مفهوم 'بدنِ دردمند' نهفته است؛ توده‌ای از انرژی‌های منفی انباشته شده که از دردهای گذشته تغذیه می‌کند. با حضور کامل در لحظه، این توده انرژی در نورِ آگاهی ذوب می‌شود. پذیرش، کلیدِ طلایی این تحول است؛ نه به معنای تسلیم، بلکه به معنای موافقت قلبی با جریانِ زندگی در همین ثانیه. \n\n او توضیح می‌دهد که چگونه هرگونه مقاومت در برابر 'آنچه هست'، رنج ایجاد می‌کند. وقتی ما با لحظه حال می‌جنگیم، در واقع با کلِ کائنات در ستیز هستیم. با رها کردن این مقاومت، انرژیِ عظیمی آزاد می‌شود که پیش از این صرفِ اصطکاک‌های ذهنی می‌شد. این انرژی، همان آرامشی است که فراتر از فهمِ منطقی است. \n\n سکوت، زبانِ خداوند است و هر آنچه در این جهان می‌بینیم، ترجمه‌ای ناتمام از آن سکوتِ عمیق است. تله ما را تشویق می‌کند که در فواصل میان افکار، آن خلأِ مقدس را بیابیم. آنجاست که خلاقیتِ بی‌پایان و عشقِ بی‌قید و شرط ریشه دارند. \n\n در نهایت، او تاکید می‌کند که شما نمی‌توانید خود را در آینده پیدا کنید؛ تنها جایی که حقیقت وجود دارد، 'اینجا' و تنها زمانی که واقعیت دارد، 'اکنون' است. بیدار شدن یعنی درک این نکته که هیچ چیز ارزشمندتر از حضورِ جاری شما در این لحظه نیست."
  },
  {
    title: "چهار میثاق",
    author: "دون میگوئل روئیز",
    content: "خرد باستانی تولتک‌ها به ما می‌آموزد که زندگی ما نتیجه‌ی هزاران میثاقی است که با خود و جامعه بسته‌ایم، میثاق‌هایی که اغلب بر پایه ترس و قضاوت هستند. اولین و مهم‌ترین میثاق، 'با کلام خود گناه نکردن' است. کلام، نیروی خلاقه‌ی شماست؛ جادویی که می‌تواند بهشت بسازد یا جهنمی از باورهای سمی خلق کند. پاک بودن کلام یعنی استفاده از کلمات در جهتِ عشق و حقیقت. \n\n میثاق دوم، سپری در برابر رنج‌های بیهوده است: 'هیچ چیز را به خود نگیرید'. وقتی درک کنید که رفتار و گفتار دیگران تنها بازتابی از رویاها و کابوس‌های درونی خودشان است، دیگر قربانیِ نظرات آن‌ها نخواهید بود. این میثاق به شما آزادی مطلق می‌دهد تا بدون ترس از قضاوت، خودِ واقعی‌تان باشید. \n\n در میثاق سوم، روئیز ما را از 'تصورات باطل' برحذر می‌دارد. ذهن ما استادِ ساختن داستان‌هایی است که واقعیت ندارند. ما فرضیاتی می‌سازیم، آن‌ها را باور می‌کنیم و سپس بر اساسِ این توهمات رنج می‌کشیم. شجاعتِ پرسیدن و شفاف‌سازی، تنها راهِ شکستن این چرخه و رسیدن به صلحِ درونی است. \n\n میثاق چهارم، یعنی 'همیشه بیشترین تلاش خود را بکنید'، روحِ سه میثاق قبلی است. این تلاش بسته به حالِ شما در هر لحظه متفاوت است؛ گاهی زیاد و گاهی کم. مهم این است که از خودتان انتظارِ کمال نداشته باشید، بلکه فقط صادقانه حضور داشته باشید تا از ملامتِ خود رها شوید. \n\n با رعایت این چهار میثاق، شما 'رویای سیاره' را تغییر می‌دهید. شما از یک قربانیِ ناآگاه به یک خالقِ آگاه تبدیل می‌شوید که زندگیش را نه بر اساسِ شرطی‌سازی‌های قدیمی، بلکه بر اساسِ اراده و عشقِ ناب بنا می‌کند."
  },
  {
    title: "تائوت‌چینگ",
    author: "لائوتسه",
    content: "تائو، حقیقتی است که نمی‌توان آن را در قالب کلمات گنجاند؛ جریانی ابدی که تمام هستی را در بر گرفته است. لائوتسه ما را به فضیلتِ 'وو-وی' یا عملِ بدونِ تلاش دعوت می‌کند. این به معنای تنبلی نیست، بلکه به معنای هماهنگ شدن با آهنگِ طبیعی کائنات است، همان‌طور که آب بدونِ تلاش صخره‌ها را می‌شوید و پیش می‌رود. \n\n نرمی بر سختی پیروز می‌شود و سادگی بر پیچیدگی. او معتقد است که هر چه بیشتر در پیِ کنترلِ جهان باشیم، بیشتر از حقیقتِ آن دور می‌شویم. یک رهبرِ تائوئیست، کسی است که وقتی کارش به پایان می‌رساند، مردم می‌گویند: 'ما خودمان این کار را انجام دادیم'. فروتنی، ریشه‌ی هر عظمتی است. \n\n جهان هستی، تعادلی ظریف میان یین و یانگ است. در هر تاریکی، نوری نهفته و در هر پایانی، آغازی. پذیرشِ این تضادها، فرد را به آرامشی عمیق می‌رساند. کسی که می‌داند 'کافی، کافی است'، همیشه ثروتمند خواهد بود. قناعت در اندیشه، ثروتِ واقعی روح است. \n\n لائوتسه ما را به بازگشت به 'کنده ناتراشیده' یا همان ذاتِ دست‌نخورده‌ی انسانی دعوت می‌کند. پیش از آنکه القاب، دانش‌های صوری و منصب‌ها ما را تعریف کنند، ما چه بودیم؟ یافتنِ آن منِ اصیل، هدفِ نهاییِ پیمودنِ راهِ تائو است. \n\n در نهایت، پیمودن تائو یعنی بازگشت به خانه. جایی که نیاز به اثباتِ خود نداریم و با کلِ هستی یگانه هستیم. در این یگانگی، ترس ناپدید می‌شود و جای خود را به مهربانیِ بی‌دریغ نسبت به تمام موجودات می‌دهد."
  }
];

interface StudyRoomProps {
  addPoints: (p: number) => void;
  setActiveView?: (view: ViewType) => void;
}

const StudyRoom: React.FC<StudyRoomProps> = ({ addPoints, setActiveView }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'library'>('daily');
  const [page, setPage] = useState<BookPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedPages, setSavedPages] = useState<BookPage[]>([]);
  const [selectedLibraryPage, setSelectedLibraryPage] = useState<BookPage | null>(null);
  
  const [fontSize] = useState(22);
  const [lineHeight] = useState(1.9);
  const [readingTheme, setReadingTheme] = useState<'paper' | 'sepia'>(() => 
    (localStorage.getItem('mj-reading-theme') as 'paper' | 'sepia') || 'paper'
  );
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const todayPersian = useMemo(() => {
    return new Intl.DateTimeFormat('fa-IR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric',
      calendar: 'persian' 
    } as any).format(new Date());
  }, []);

  useEffect(() => {
    localStorage.setItem('mj-reading-theme', readingTheme);
    loadLibrary();
  }, [readingTheme]);

  const loadLibrary = () => {
    const bookmarks = JSON.parse(localStorage.getItem('mj-bookmarked-pages') || '[]');
    setSavedPages(bookmarks);
  };

  const fetchDailyPage = () => {
    const today = new Date().toISOString().split('T')[0];
    const savedToday = localStorage.getItem(`mj-study-local-v2-${today}`);
    
    if (savedToday) {
      setPage(JSON.parse(savedToday));
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      
      const bookIndex = dayOfYear % LOCAL_BOOKS_DATABASE.length;
      const selectedBook = LOCAL_BOOKS_DATABASE[bookIndex];

      const newPage: BookPage = {
        id: `local-book-${today}`,
        title: selectedBook.title,
        author: selectedBook.author,
        content: selectedBook.content,
        date: today
      };

      setPage(newPage);
      localStorage.setItem(`mj-study-local-v2-${today}`, JSON.stringify(newPage));
      setLoading(false);
    }, 1200);
  };

  useEffect(() => {
    fetchDailyPage();
  }, []);

  const isSaved = useMemo(() => {
    if (!page) return false;
    return savedPages.some(p => p.id === page.id);
  }, [page, savedPages]);

  const toggleSave = () => {
    if (!page) return;
    let updated;
    if (isSaved) {
      updated = savedPages.filter(p => p.id !== page.id);
    } else {
      updated = [...savedPages, page];
      addPoints(70);
    }
    setSavedPages(updated);
    localStorage.setItem('mj-bookmarked-pages', JSON.stringify(updated));
  };

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(progress);
    }
  };

  const renderReader = (currentPage: BookPage) => (
    <div className={`fixed inset-0 z-[1000] flex flex-col transition-all duration-500 animate-in fade-in ${readingTheme === 'paper' ? 'bg-white text-slate-900' : 'bg-[#fcf8ef] text-[#433422]'}`}>
      
      {/* Top Header: Date Only (Formatting buttons removed) */}
      <div className="flex flex-col border-b border-black/5 bg-opacity-95 backdrop-blur-xl shadow-sm">
        <div className="flex items-center justify-between p-4 px-6 md:px-16 border-b border-black/5">
           <div className="flex items-center gap-2 text-brand-main">
              <Calendar size={18} />
              <span className="text-xs font-black tabular-nums">{todayPersian}</span>
           </div>
           <div className="flex items-center gap-3">
             <div className="text-left hidden sm:block">
                <p className="text-[9px] font-black text-brand-main uppercase tracking-widest">Digital Wisdom</p>
                <h4 className="text-[11px] font-black truncate max-w-[100px]">{currentPage.title}</h4>
             </div>
             <div className="w-10 h-10 bg-brand-main/10 rounded-xl flex items-center justify-center text-brand-main">
                <Droplets size={20} className="animate-pulse" />
             </div>
          </div>
        </div>

        {/* Tabs: Text color changed to black for clarity as requested */}
        <div className="flex items-center justify-center p-3">
          <div className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-2xl w-full max-w-sm">
             <button 
                onClick={() => { setActiveTab('daily'); setSelectedLibraryPage(null); }} 
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'daily' && !selectedLibraryPage ? 'bg-brand-main text-white shadow-lg' : 'text-slate-950'}`}
             >
                خلاصه امروز
             </button>
             <button 
                onClick={() => setActiveTab('library')} 
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'library' || selectedLibraryPage ? 'bg-brand-main text-white shadow-lg' : 'text-slate-950'}`}
             >
                قفسه من ({savedPages.length})
             </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div ref={contentRef} onScroll={handleScroll} className="flex-1 overflow-y-auto no-scrollbar relative px-10 py-12 md:px-64">
        <div className="max-w-2xl mx-auto space-y-12">
          <header className="text-center space-y-8 animate-in slide-in-from-bottom-4 duration-700">
             <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-brand-main/5 rounded-2xl flex items-center justify-center text-brand-main">
                   <Droplets size={28} className="animate-bounce" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black leading-tight text-slate-900">عصاره‌گیری از: <br/> <span className="text-brand-main">« {currentPage.title} »</span></h1>
             </div>
             <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                <p className="text-[10px] font-black text-slate-400 mb-1 tracking-widest uppercase">AUTHOR</p>
                <h2 className="text-xl font-black text-slate-800">{currentPage.author}</h2>
             </div>
          </header>

          <article style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }} className="text-justify font-medium transition-all duration-300 pb-20 text-slate-800 antialiased">
             {currentPage.content.split('\n').filter(p => p.trim()).map((para, i) => (
               <p key={i} className="mb-10 indent-8 leading-relaxed">{para}</p>
             ))}
          </article>

          {/* Signature Footer: Beautifully designed for Man-e-Jadid */}
          <footer className="pt-24 pb-48 border-t border-black/5 flex flex-col items-center gap-4">
             <div className="flex items-center gap-4 opacity-40">
                <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-slate-400"></div>
                <span className="text-sm font-black tracking-[0.3em] font-serif text-slate-600">MAN-E-JADID</span>
                <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-slate-400"></div>
             </div>
             <div className="text-center">
                <p className="text-3xl font-black text-brand-main bg-clip-text">منِ جدید</p>
                <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-slate-400 mt-2">Awakening Through Wisdom</p>
             </div>
          </footer>
        </div>
      </div>

      {/* Navigation Dock */}
      <div className="flex items-center justify-between p-5 px-8 md:px-24 backdrop-blur-3xl border-t border-black/5 bg-opacity-95 z-[1001] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
         <button onClick={() => setActiveView ? setActiveView('dashboard') : null} className="flex items-center gap-2 px-6 h-14 bg-slate-100 rounded-2xl text-slate-600 font-black text-xs active:scale-95 transition-all shadow-sm">
           <ArrowLeft size={18} /> بازگشت به خانه
         </button>

         <div className="flex gap-3 p-1.5 bg-slate-100/50 rounded-2xl">
            {(['paper', 'sepia'] as const).map(t => (
               <button key={t} onClick={() => setReadingTheme(t)} className={`w-11 h-11 rounded-xl border-2 transition-all ${readingTheme === t ? 'ring-4 ring-brand-main border-white' : 'border-transparent'} ${t === 'paper' ? 'bg-white' : 'bg-[#fcf8ef]'}`} />
            ))}
         </div>

         {/* Bookmark Button: Clear visual feedback */}
         <button 
            onClick={toggleSave} 
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-90 ${isSaved ? 'bg-emerald-600 ring-4 ring-amber-400/30' : 'bg-emerald-600/90'}`}
          >
            {isSaved ? <BookmarkCheck size={28} className="text-amber-400" /> : <Bookmark size={28} className="text-white" />}
         </button>
      </div>

      <div className="fixed top-0 left-0 h-1.5 bg-brand-main z-[1002] transition-all duration-300" style={{ width: `${scrollProgress}%` }}></div>
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center space-y-10 animate-in fade-in bg-white">
        <div className="relative">
          <div className="w-32 h-32 bg-brand-main/5 rounded-[2.5rem] animate-pulse"></div>
          <Droplets className="absolute inset-0 m-auto w-12 h-12 text-brand-main animate-bounce" />
        </div>
        <div className="text-center">
           <h3 className="text-2xl font-black text-slate-800">در حال عصاره‌گیری کتاب...</h3>
           <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-widest">آماده‌سازی دانش برای بیداری شما</p>
        </div>
      </div>
    );
  }

  if (activeTab === 'library' && !selectedLibraryPage) {
     return (
        <div className="fixed inset-0 z-[1000] flex flex-col bg-slate-50 animate-in fade-in">
           <div className="flex flex-col border-b border-black/5 bg-white p-4 px-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                 <h2 className="text-2xl font-black text-slate-900">قفسه شخصی</h2>
                 <button onClick={() => setActiveView ? setActiveView('dashboard') : null} className="p-3 bg-slate-100 rounded-xl text-slate-400 active:scale-90 transition-all"><Home size={20}/></button>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-2xl w-full">
                 <button onClick={() => setActiveTab('daily')} className="flex-1 py-2.5 rounded-xl text-xs font-black text-slate-950 hover:text-brand-main transition-colors">خلاصه امروز</button>
                 <button className="flex-1 py-2.5 rounded-xl text-xs font-black bg-brand-main text-white shadow-lg">قفسه من ({savedPages.length})</button>
              </div>
           </div>
           <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {savedPages.length === 0 ? (
                <div className="text-center py-40 opacity-20 flex flex-col items-center">
                  <Inbox className="w-20 h-20 mb-6" />
                  <p className="font-black text-sm uppercase tracking-widest">هنوز گنجینه‌ای ذخیره نشده</p>
                </div>
              ) : (
                savedPages.map((p) => (
                  <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group shadow-sm active:scale-[0.98] transition-all">
                    <button onClick={() => setSelectedLibraryPage(p)} className="flex items-center gap-5 text-right flex-1">
                      <div className="w-14 h-14 bg-brand-main/5 rounded-2xl flex items-center justify-center text-brand-main">
                        <Book size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 leading-tight">{p.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">اثر: {p.author}</p>
                      </div>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); const updated = savedPages.filter(item => item.id !== p.id); setSavedPages(updated); localStorage.setItem('mj-bookmarked-pages', JSON.stringify(updated)); }} className="p-4 text-slate-200 hover:text-rose-500 rounded-xl transition-colors"><Trash2 size={20} /></button>
                  </div>
                ))
              )}
           </div>
           <div className="p-5 bg-white border-t border-black/5">
              <button onClick={() => setActiveTab('daily')} className="w-full py-5 bg-slate-900 text-white rounded-[1.8rem] font-black text-sm shadow-xl active:scale-95 transition-all">بازگشت به مطالعه روزانه</button>
           </div>
        </div>
     );
  }

  return (
    <div className="h-full flex flex-col space-y-8 pb-24 px-1">
      {selectedLibraryPage ? renderReader(selectedLibraryPage) : (page ? renderReader(page) : null)}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default StudyRoom;
