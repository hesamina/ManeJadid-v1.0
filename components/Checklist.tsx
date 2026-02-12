
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, CheckCircle, Circle, ListChecks, Edit2, Save, X } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const Checklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('mj-simple-checklist-v2');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newItemText, setNewItemText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    localStorage.setItem('mj-simple-checklist-v2', JSON.stringify(items));
  }, [items]);

  const addItem = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newItemText.trim()) return;
    
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      completed: false,
      createdAt: Date.now()
    };
    
    setItems([newItem, ...items]);
    setNewItemText('');
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
    if (window.navigator.vibrate) window.navigator.vibrate(10);
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const startEditing = (item: ChecklistItem) => {
    setEditingId(item.id);
    setEditingText(item.text);
  };

  const saveEdit = () => {
    if (!editingText.trim()) return;
    setItems(prev => prev.map(item => 
      item.id === editingId ? { ...item, text: editingText.trim() } : item
    ));
    setEditingId(null);
  };

  // مرتب‌سازی هوشمند: انجام نشده‌ها بالا، انجام شده‌ها پایین
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.completed === b.completed) {
        return b.createdAt - a.createdAt; // جدیدترها در هر بخش بالاتر
      }
      return a.completed ? 1 : -1; // انجام نشده‌ها (false) اول می‌آیند
    });
  }, [items]);

  const remainingCount = items.filter(i => !i.completed).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24 px-1">
      {/* هدر مینی‌مال */}
      <header className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden flex flex-col items-center text-center">
        <ListChecks size={140} className="absolute -right-16 -top-16 opacity-10 rotate-12" />
        <div className="w-16 h-16 bg-white/20 backdrop-blur-2xl rounded-[1.5rem] flex items-center justify-center mb-4 border border-white/30 shadow-inner">
          <ListChecks size={32} />
        </div>
        <h2 className="text-3xl font-black">نظمِ ذهنی</h2>
        <div className="flex items-center gap-2 mt-2 bg-white/10 px-4 py-1 rounded-full backdrop-blur-md border border-white/10">
           <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Remaining:</span>
           <span className="text-xs font-black tabular-nums">{remainingCount}</span>
        </div>
      </header>

      {/* ورودی تسک جدید */}
      <form onSubmit={addItem} className="flex gap-2 bg-white dark:bg-slate-900 p-2 rounded-[2.2rem] shadow-lg border border-slate-100 dark:border-slate-800">
        <input 
          type="text" 
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="چه کاری باید انجام بشه؟"
          className="flex-1 py-4 px-6 bg-transparent outline-none font-bold text-sm dark:text-white"
        />
        <button 
          type="submit"
          disabled={!newItemText.trim()}
          className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50 disabled:grayscale"
        >
          <Plus size={28} />
        </button>
      </form>

      {/* لیست تسک‌ها */}
      <div className="space-y-3">
        {sortedItems.length === 0 ? (
          <div className="text-center py-20 opacity-20 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
               <ListChecks size={40} />
            </div>
            <p className="text-sm font-black">لیستِ تو خالیه، یه هدف بنویس...</p>
          </div>
        ) : (
          sortedItems.map(item => (
            <div 
              key={item.id} 
              className={`group flex items-center justify-between p-4 rounded-[2rem] border transition-all duration-500 ${
                item.completed 
                  ? 'bg-slate-50 dark:bg-slate-950 border-transparent opacity-50 grayscale scale-[0.98]' 
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <button 
                  onClick={() => toggleItem(item.id)}
                  className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl transition-all ${
                    item.completed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'
                  }`}
                >
                  {item.completed ? <CheckCircle size={28} /> : <Circle size={28} />}
                </button>

                {editingId === item.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input 
                      autoFocus
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={saveEdit}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                      className="w-full bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-sm font-bold dark:text-white outline-none ring-2 ring-indigo-500"
                    />
                    <button onClick={saveEdit} className="text-emerald-500"><Save size={18}/></button>
                  </div>
                ) : (
                  <span 
                    onClick={() => toggleItem(item.id)}
                    className={`text-sm font-bold truncate leading-relaxed dark:text-white transition-all ${
                      item.completed ? 'line-through' : ''
                    }`}
                  >
                    {item.text}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!item.completed && editingId !== item.id && (
                  <button onClick={() => startEditing(item)} className="p-2 text-slate-300 hover:text-indigo-500 transition-colors">
                    <Edit2 size={16} />
                  </button>
                )}
                <button onClick={() => deleteItem(item.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* پیام تشویقی وقتی همه تموم شدن */}
      {items.length > 0 && remainingCount === 0 && (
        <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30 animate-in zoom-in">
           <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">فوق‌العاده‌ای! تمامِ لیستِ امروزت تیک خورد. ✨</p>
        </div>
      )}
    </div>
  );
};

export default Checklist;
