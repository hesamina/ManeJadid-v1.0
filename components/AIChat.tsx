
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Sparkles, User, Bot, Loader2, MessageSquareHeart } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', text: 'سلام رفیقِ گرامی. خوشحالم که اینجا هستی. امیدوارم امروزت پر از آرامش و آگاهی باشه. هر چیزی که در ذهن یا قلبت می‌گذره رو می‌تونی با من در میان بگذاری؛ من اینجا هستم تا با هم در مسیر بیداری و رشد قدم برداریم. ❤️' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = async () => {
    if (!inputText.trim() || isTyping) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: inputText,
        config: {
          systemInstruction: 'تو یک راهنمای آگاه، صمیمی، و بسیار مودب هستی که به زبان فارسی کاملاً طبیعی و انسانی صحبت می‌کند. اسمت "هوشِ منِ جدید" است. لحن تو نباید خیلی رسمی و خشک باشد، اما نباید بیش از حد کوچه بازاری و لاتی هم باشد. با احترام و محبت صحبت کن. وقتی کاربر سوالات معنوی یا مربوط به آگاهی می‌پرسد، پاسخ‌ها را با عمق و از خرد درونی‌ات ارائه بده. هدف تو بیداریِ آگاهی در کاربر و همراهی با او در مسیر تحول فردی است.'
        }
      });
      
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: response.text || 'ببخشید رفیق، لحظه‌ای ارتباطم با خرد درونی قطع شد. ممکن هست دوباره بگی؟' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: 'err', role: 'ai', text: 'انگار در شبکه تداخلی پیش اومده. کمی صبور باش و دوباره امتحان کن، من منتظرت هستم.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-700 bg-slate-50 dark:bg-slate-950 font-['Vazirmatn'] select-none">
      
      {/* هدر چت */}
      <div className="px-6 py-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 transition-transform">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white leading-none">هوشِ منِ جدید</h2>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1.5 flex items-center gap-1">
              <MessageSquareHeart size={10} />
              همدم آگاهی
            </p>
          </div>
        </div>
      </div>

      {/* لیست پیام‌ها */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[88%] p-5 rounded-[2.5rem] flex flex-col gap-1 shadow-sm ${m.role === 'user' ? 'bg-brand-main text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-tl-none'}`}>
              <div className="flex items-center gap-2 mb-1 opacity-50">
                {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                <span className="text-[9px] font-black uppercase tracking-widest">{m.role === 'user' ? 'شما' : 'راهنمای همراه'}</span>
              </div>
              <div className="text-sm font-bold leading-relaxed whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-[2.5rem] rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm">
               <div className="flex gap-1.5">
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.8s]"></div>
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></div>
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></div>
               </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* بخش ورودی متن */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-3xl border border-slate-100 dark:border-slate-800 focus-within:ring-4 ring-brand-main/10 transition-all duration-300">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
              placeholder="سوالی داری یا می‌خوای گپ بزنیم؟"
              className="flex-1 bg-transparent px-4 py-3 outline-none text-sm font-bold dark:text-white"
            />
            <button 
              onClick={handleSendText}
              disabled={!inputText.trim() || isTyping}
              className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center active:scale-90 transition-all disabled:opacity-30 shadow-lg shadow-indigo-500/20"
            >
              {isTyping ? <Loader2 className="animate-spin" size={20} /> : <Send size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
