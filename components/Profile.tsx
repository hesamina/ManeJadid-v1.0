
import React from 'react';
import { UserStats } from '../types';
import { Award, Shield, Star, LogOut, Settings, ChevronLeft } from 'lucide-react';

interface ProfileProps {
  stats: UserStats;
}

const Profile: React.FC<ProfileProps> = ({ stats }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header */}
      <div className="flex flex-col items-center py-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl p-1 shadow-xl">
            <div className="w-full h-full bg-white dark:bg-slate-800 rounded-[1.4rem] flex items-center justify-center text-4xl">
              👤
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-white dark:border-slate-900">
            <Shield className="w-4 h-4" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-4">کاربر پیشرو</h2>
        <p className="text-slate-500 text-sm">عضویت از فروردین ۱۴۰۳</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
          <Star className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <span className="block text-xl font-bold">{stats.level}</span>
          <span className="text-xs text-slate-500">سطح فعلی</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
          <Award className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
          <span className="block text-xl font-bold">{stats.badges.filter(b => b.unlocked).length}</span>
          <span className="text-xs text-slate-500">نشان‌های کسب شده</span>
        </div>
      </div>

      {/* Badges Section */}
      <div>
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Award className="text-amber-500 w-5 h-5" />
          نشان‌های افتخار
        </h3>
        <div className="space-y-3">
          {stats.badges.map(badge => (
            <div 
              key={badge.id}
              className={`p-4 rounded-2xl flex items-center gap-4 border transition-all ${
                badge.unlocked 
                  ? 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-slate-700' 
                  : 'bg-slate-50 dark:bg-slate-900 border-transparent opacity-50 grayscale'
              }`}
            >
              <div className="text-3xl">{badge.icon}</div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{badge.name}</h4>
                <p className="text-xs text-slate-500">{badge.description}</p>
              </div>
              {badge.unlocked && <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full"><Shield className="w-3 h-3" /></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Menu Actions */}
      <div className="space-y-2">
        <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-medium">تنظیمات حساب</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-slate-300" />
        </button>
        <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-rose-500">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">خروج از حساب</span>
          </div>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center pb-8">
        <p className="text-[10px] text-slate-400">نسخه ۱.۰.۰ - ساخته شده با ❤️ برای تحول تو</p>
      </div>
    </div>
  );
};

export default Profile;
