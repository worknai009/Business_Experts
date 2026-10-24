import React, { useState, useEffect } from "react";
import { Search, Sparkles, Zap, BarChart3, ShieldCheck } from "lucide-react";

function EmptyState() {
  const [isLight, setIsLight] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('light') : false
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const checkTheme = () => setIsLight(document.documentElement.classList.contains('light'));
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const styles = {
    cardBg: isLight ? '#ffffff' : '#070b19',
    cardBorder: isLight ? '#cbd5e1' : 'rgba(30, 41, 59, 0.8)',
    titleColor: isLight ? '#0f172a' : '#ffffff',
    bodyColor: isLight ? '#334155' : '#cbd5e1',
    descColor: isLight ? '#475569' : '#94a3b8',
    accentColor: isLight ? '#15803d' : '#4ade80',
    stepBg: isLight ? '#f8fafc' : '#03050a',
    stepBorder: isLight ? '#cbd5e1' : 'rgba(30, 41, 59, 0.8)',
    badgeBg: isLight ? '#f0fdf4' : 'rgba(34, 197, 94, 0.1)',
    badgeBorder: isLight ? '#bbf7d0' : 'rgba(34, 197, 94, 0.3)',
    pillBg: isLight ? '#f1f5f9' : '#03050a',
    pillBorder: isLight ? '#cbd5e1' : 'rgba(30, 41, 59, 0.8)',
  };

  return (
    <div
      className="w-full max-w-full my-6 sm:my-10 relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-14 text-center transition-all duration-300 shadow-2xl"
      style={{
        backgroundColor: styles.cardBg,
        borderColor: styles.cardBorder,
        borderWidth: '1px',
        borderStyle: 'solid',
        color: styles.titleColor,
      }}
    >
      {/* Ambient Green Glowing Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none opacity-30" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-500/15 rounded-full blur-3xl pointer-events-none opacity-30" />

      <div className="relative z-10 w-full max-w-5xl mx-auto space-y-8">

        {/* Top Header Badge */}
        <div className="space-y-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm"
            style={{
              backgroundColor: styles.badgeBg,
              borderColor: styles.badgeBorder,
              borderWidth: '1px',
              borderStyle: 'solid',
              color: styles.accentColor,
            }}
          >
            <Zap size={14} style={{ color: styles.accentColor }} />
            <span>READY WHEN YOU ARE</span>
          </div>

          <h2
            className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-4xl mx-auto"
            style={{ color: styles.titleColor }}
          >
            Validate your business idea{" "}
            <span
              style={{
                backgroundImage: isLight
                  ? 'linear-gradient(to right, #15803d, #16a34a)'
                  : 'linear-gradient(to right, #4ade80, #86efac)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                fontWeight: 900,
              }}
            >
              before you invest.
            </span>
          </h2>

          <p
            className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-semibold"
            style={{ color: styles.bodyColor }}
          >
            Enter the idea, location and budget above. BusinessAI will calculate a transparent opportunity score, financial projection and practical recommendation.
          </p>
        </div>

        {/* 3 Step Interactive Workflow Cards - Full Screen Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-4 text-left">

          {/* Step 01 */}
          <div
            className="p-6 rounded-2xl space-y-3 relative group transition duration-300 shadow-md"
            style={{
              backgroundColor: styles.stepBg,
              borderColor: styles.stepBorder,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center"
                style={{
                  backgroundColor: isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.15)',
                  borderColor: isLight ? '#86efac' : 'rgba(34, 197, 94, 0.3)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: styles.accentColor,
                }}
              >
                01
              </span>
              <Search style={{ color: styles.accentColor }} size={20} />
            </div>
            <div>
              <h3 className="text-base font-black" style={{ color: styles.titleColor }}>
                Enter idea
              </h3>
              <p className="text-xs font-semibold mt-1.5 leading-relaxed" style={{ color: styles.descColor }}>
                Provide your target business concept, preferred city, and investment capital limit.
              </p>
            </div>
          </div>

          {/* Step 02 */}
          <div
            className="p-6 rounded-2xl space-y-3 relative group transition duration-300 shadow-md"
            style={{
              backgroundColor: styles.stepBg,
              borderColor: styles.stepBorder,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center"
                style={{
                  backgroundColor: isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.15)',
                  borderColor: isLight ? '#86efac' : 'rgba(34, 197, 94, 0.3)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: styles.accentColor,
                }}
              >
                02
              </span>
              <BarChart3 style={{ color: styles.accentColor }} size={20} />
            </div>
            <div>
              <h3 className="text-base font-black" style={{ color: styles.titleColor }}>
                AI analyzes
              </h3>
              <p className="text-xs font-semibold mt-1.5 leading-relaxed" style={{ color: styles.descColor }}>
                Our AI model evaluates real-time market demand, competition density, and financial feasibility.
              </p>
            </div>
          </div>

          {/* Step 03 */}
          <div
            className="p-6 rounded-2xl space-y-3 relative group transition duration-300 shadow-md"
            style={{
              backgroundColor: styles.stepBg,
              borderColor: styles.stepBorder,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center"
                style={{
                  backgroundColor: isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.15)',
                  borderColor: isLight ? '#86efac' : 'rgba(34, 197, 94, 0.3)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: styles.accentColor,
                }}
              >
                03
              </span>
              <ShieldCheck style={{ color: styles.accentColor }} size={20} />
            </div>
            <div>
              <h3 className="text-base font-black" style={{ color: styles.titleColor }}>
                Get report
              </h3>
              <p className="text-xs font-semibold mt-1.5 leading-relaxed" style={{ color: styles.descColor }}>
                Receive your score breakdown, ROI timeline, break-even period, and actionable recommendations.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Pill */}
        <div className="pt-2">
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-bold shadow-inner"
            style={{
              backgroundColor: styles.pillBg,
              borderColor: styles.pillBorder,
              borderWidth: '1px',
              borderStyle: 'solid',
              color: styles.titleColor,
            }}
          >
            <Sparkles size={15} style={{ color: styles.accentColor }} />
            <span className="font-extrabold" style={{ color: styles.titleColor }}>
              AI-powered business intelligence • Instant market validation
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default EmptyState;
