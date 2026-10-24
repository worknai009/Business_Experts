import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Bell, CheckCircle2, AlertCircle, Sparkles, Award, Trash2 } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'REPORT_READY',
      title: 'AI Feasibility Report Ready',
      message: 'Your deep analysis for "Cloud Kitchen in Mumbai" is ready for review.',
      date: '10 mins ago',
      read: false,
      icon: Sparkles,
      color: 'text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    },
    {
      id: 2,
      type: 'SCHEME_MATCH',
      title: 'New Government Scheme Match',
      message: 'PMEGP Subsidy Scheme matches your saved interest in Food Processing.',
      date: '2 hours ago',
      read: false,
      icon: Award,
      color: 'text-amber-700 dark:text-amber-400 border-amber-500/30 bg-amber-500/10'
    },
    {
      id: 3,
      type: 'SYSTEM',
      title: 'Plan Expiry Notice',
      message: 'Your Pro Plan auto-renewal is scheduled for 1st of next month.',
      date: '1 day ago',
      read: true,
      icon: CheckCircle2,
      color: 'text-teal-700 dark:text-teal-400 border-teal-500/30 bg-teal-500/10'
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <DashboardLayout title="Notification Center">
      <div className="max-w-4xl mx-auto space-y-6 text-left">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#0f172a] dark:text-white">Notifications</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Stay updated on your feasibility reports, market alerts &amp; government schemes.</p>
          </div>

          <button
            onClick={markAllRead}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition cursor-pointer shadow-xs"
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
              <Bell size={32} className="mx-auto text-slate-400" />
              <div className="text-sm font-bold text-[#0f172a] dark:text-white">No Notifications</div>
              <div className="text-xs text-slate-500">You are all caught up!</div>
            </div>
          ) : (
            notifications.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition duration-150 flex items-start justify-between gap-4 ${
                    item.read
                      ? 'bg-white dark:bg-[#0b1329] border-slate-200 dark:border-slate-800/80 opacity-90 shadow-xs'
                      : 'bg-white dark:bg-[#0b1329] border-emerald-500/40 dark:border-emerald-500/30 shadow-md shadow-emerald-950/5'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl border ${item.color} shrink-0 mt-0.5`}>
                      <Icon size={18} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#0f172a] dark:text-white">{item.title}</span>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{item.message}</p>
                      <span className="text-[10px] text-slate-400 block pt-1">{item.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteNotification(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
