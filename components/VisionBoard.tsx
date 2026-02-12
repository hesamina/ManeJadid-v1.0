
import React, { useState, useRef } from 'react';
import { Plus, X, Star, Sparkles, Image as ImageIcon, Camera, Maximize2 } from 'lucide-react';
import { VisionBoardItem } from '../types';

const VisionBoard: React.FC = () => {
  const [items, setItems] = useState<VisionBoardItem[]>(() => {
    const saved = localStorage.getItem('mj-vision-v4');
    return saved ? JSON.parse(saved) : [
      { id: 'v1', title: 'سفر به دور دنیا', imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', category: 'تجربه' },
      { id: 'v2', title: 'خانه مدرن', imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', category: 'موفقیت' },
      { id: 'v3', title: 'آرامش ذهنی', imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', category: 'روحانی' },
    ];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedItemForView, setSelectedItemForView] = useState<VisionBoardItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !selectedFile) return;

    const newItem: VisionBoardItem = {
      id: `v-${Date.now()}`,
      title: newTitle.trim(),
      imageUrl: selectedFile,
      category: 'آرزو'
    };

    const newItems = [newItem, ...items];
    setItems(newItems);
    localStorage.setItem('mj-vision-v4', JSON.stringify(newItems));
    
    setNewTitle('');
    setSelectedFile(null);
    setIsAdding(false);
  };

  const deleteItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem('mj-vision-v4', JSON.stringify(updated));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-700 pb-10 h-full flex flex-col overflow-hidden">
      <header className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">پازل رویاها</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">تجسم، بذرِ واقعیت است</p>
        </div>
        <button 
            onClick={() => setIsAdding(true)} 
            className="w-12 h-12 bg-indigo-600 text-white rounded-2xl shadow-xl active:scale-90 transition-all flex items-center justify-center"
        >
          <Plus size={28} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-1 custom-scroll">
          {isAdding && (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-2xl space-y-6 animate-in slide-in-from-top-4 border-2 border-indigo-100 dark:border-indigo-900/20 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                    <ImageIcon size={22} />
                </div>
                <h3 className="font-black text-slate-800 dark:text-white">ثبت در تابلوی تجسم</h3>
              </div>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-square bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all"
              >
                {selectedFile ? (
                   <img src={selectedFile} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center p-6">
                    <Camera className="text-slate-300 mb-3 mx-auto" size={48} />
                    <p className="text-xs font-black text-slate-400">انتخاب عکس از گالری</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>

              <input 
                type="text" 
                placeholder="این تصویر نماد چیست؟" 
                className="w-full p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border-none outline-none font-bold text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />

              <div className="flex gap-3">
                <button 
                  onClick={addItem} 
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all disabled:opacity-50"
                  disabled={!selectedFile || !newTitle.trim()}
                >
                  ثبت در پازل
                </button>
                <button onClick={() => setIsAdding(false)} className="px-8 py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-2xl font-black text-sm">لغو</button>
              </div>
            </div>
          )}

          {/* شبکه اینستاگرامی ۳ ستونه */}
          <div className="grid grid-cols-3 gap-2">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="puzzle-item relative aspect-square bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm cursor-pointer border border-white dark:border-slate-900"
                onClick={() => setSelectedItemForView(item)}
              >
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 size={16} className="text-white" />
                </div>
              </div>
            ))}
            {/* خانه‌های خالی پازل برای حفظ استایل */}
            {[...Array(Math.max(0, 9 - items.length))].map((_, i) => (
              <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800"></div>
            ))}
          </div>
      </div>

      {/* نمایش فول اسکرین به سبک اینستاگرام */}
      {selectedItemForView && (
        <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in" onClick={() => setSelectedItemForView(null)}>
           <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[3.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full duration-500" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white"><ImageIcon size={20}/></div>
                    <div>
                       <h3 className="text-sm font-black dark:text-white leading-tight">{selectedItemForView.title}</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{selectedItemForView.category}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedItemForView(null)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full"><X size={20}/></button>
              </div>
              
              <div className="w-full aspect-square bg-black">
                 <img src={selectedItemForView.imageUrl} className="w-full h-full object-contain" alt={selectedItemForView.title} />
              </div>
              
              <div className="p-8 space-y-4">
                 <div className="flex items-center gap-2 text-amber-500">
                    <Star size={16} fill="currentColor" />
                    <span className="text-xs font-black">ارتعاش تجسم فعال است</span>
                 </div>
                 <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                    «هر بار که به این تصویر نگاه می‌کنی، در حال ارسال یک فرکانس قدرتمند به کائنات هستی. ایمان داشته باش که این رویا پیش از این خلق شده است.»
                 </p>
                 <button 
                  onClick={() => { deleteItem(selectedItemForView.id); setSelectedItemForView(null); }} 
                  className="w-full py-4 border-2 border-rose-100 dark:border-rose-900/20 text-rose-500 rounded-2xl text-[10px] font-black hover:bg-rose-50 transition-all"
                >
                   حذف از تابلوی تجسم
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default VisionBoard;
