import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { PieChart as PieIcon, DollarSign, Wallet } from 'lucide-react';

const COLORS = ['#16a34a', '#0d9488', '#0284c7', '#8b5cf6'];

export default function CapexBreakdownChart({ investment = 500000 }) {
  const inv = Number(investment || 500000);
  
  const data = [
    { name: 'Equipment & Setup', value: Math.round(inv * 0.40), percentage: '40%' },
    { name: 'Lease & Interior Fitout', value: Math.round(inv * 0.30), percentage: '30%' },
    { name: 'Initial Inventory & Stock', value: Math.round(inv * 0.20), percentage: '20%' },
    { name: 'Working Capital Reserve', value: Math.round(inv * 0.10), percentage: '10%' },
  ];

  return (
    <section className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 space-y-5 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <PieIcon size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">FINANCIAL ALLOCATION</span>
            <h3 className="text-lg font-black text-[#0f172a] dark:text-white">Capex vs. Opex Capital Allocation</h3>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
          Total Investment: <strong className="text-[#0f172a] dark:text-white font-black">₹{inv.toLocaleString('en-IN')}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Recharts Pie */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, color: '#fff', fontSize: '12px' }}
                formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown Legend Cards */}
        <div className="space-y-2.5">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx] }} />
                <span className="font-bold text-[#0f172a] dark:text-slate-300">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="font-black text-[#0f172a] dark:text-white block">₹{item.value.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-500 font-semibold">{item.percentage} of capital</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
