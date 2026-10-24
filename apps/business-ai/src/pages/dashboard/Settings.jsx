import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, ArrowLeft, User, Mail, Bell, Shield, CheckCircle } from 'lucide-react';
import { formatDisplayName } from '../../utils/nameFormatter';

export default function Settings() {
  const userStr = localStorage.getItem('user') || '{}';
  const user = JSON.parse(userStr);

  const userEmail = user.email || user.emailAddress || '';
  const initialName = formatDisplayName(user.fullName || user.name || userEmail);

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(userEmail);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    const finalName = formatDisplayName(name || email);
    const updated = { ...user, fullName: finalName, name: finalName, email };
    localStorage.setItem('user', JSON.stringify(updated));
    setName(finalName);
    setSavedMsg('Profile preferences updated successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-6 text-[#0f172a] dark:text-white font-sans antialiased">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1 text-left">
          <Link to="/dashboard" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1">
            <ArrowLeft size={14} /> <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight flex items-center space-x-2">
            <SettingsIcon className="text-emerald-600 dark:text-emerald-400" size={28} />
            <span>Account &amp; Security Settings</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Manage personal contact details, security credentials, and email alert preferences.
          </p>
        </div>
      </div>

      {savedMsg && (
        <div className="p-4 bg-[#dcfce7] border border-[#86efac] text-[#065f46] font-bold text-xs rounded-2xl flex items-center space-x-2 text-left">
          <CheckCircle size={16} />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Settings Form Card - Mint Frosted Theme */}
      <div className="bg-[#f0fdf4] dark:bg-[#0b1329] p-6 sm:p-8 rounded-3xl border border-[#bbf7d0] dark:border-slate-800 shadow-sm space-y-6 text-left transition-colors duration-200">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-[#065f46] dark:text-slate-200 flex items-center gap-1.5">
              <User size={13} className="text-[#059669] dark:text-emerald-400" /> Full Name / Founder Handle
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 rounded-2xl bg-white dark:bg-slate-950 border border-[#bbf7d0] dark:border-slate-700 text-sm font-semibold text-[#0f172a] dark:text-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition shadow-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-[#065f46] dark:text-slate-200 flex items-center gap-1.5">
              <Mail size={13} className="text-[#059669] dark:text-emerald-400" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 rounded-2xl bg-white dark:bg-slate-950 border border-[#bbf7d0] dark:border-slate-700 text-sm font-semibold text-[#0f172a] dark:text-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition shadow-xs"
              required
            />
          </div>

          <div className="pt-2 border-t border-[#bbf7d0] dark:border-slate-800">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-[#047857] focus:ring-emerald-500 border-slate-300 dark:border-slate-700 accent-[#047857]"
              />
              <span className="text-xs font-semibold text-[#334155] dark:text-slate-300">
                Receive weekly MSME Market Radar alerts &amp; government subsidy announcements
              </span>
            </label>
          </div>

          <button
            type="submit"
            style={{ backgroundColor: '#047857', color: '#ffffff' }}
            className="px-6 py-3 rounded-2xl bg-[#047857] hover:bg-[#065f46] text-white font-black text-xs transition cursor-pointer shadow-md shadow-[#047857]/20 border-0"
          >
            Save Account Settings
          </button>
        </form>
      </div>

    </div>
  );
}
