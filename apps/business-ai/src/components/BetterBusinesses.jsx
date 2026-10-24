import { useState, useEffect } from "react";
import {
  TrendingUp, ShieldCheck, IndianRupee, Sparkles,
  ArrowRight, ChevronDown, ChevronUp, CheckCircle2,
  Tag, Lightbulb, BarChart2, X
} from "lucide-react";

const demandColor = { High: '#10b981', Medium: '#f59e0b', Low: '#ef4444' };
const riskColor   = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' };

function ScoreBadge({ score, isLight }) {
  const color = score >= 75 ? (isLight ? '#15803d' : '#10b981') : score >= 55 ? (isLight ? '#4338ca' : '#6366f1') : score >= 35 ? (isLight ? '#b45309' : '#f59e0b') : (isLight ? '#b91c1c' : '#ef4444');
  const label = score >= 75 ? 'Excellent' : score >= 55 ? 'Good' : score >= 35 ? 'Average' : 'Low';
  return (
    <div className="flex items-center gap-1.5">
      <div style={{ position: 'relative', width: 38, height: 38 }}>
        <svg width="38" height="38" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="19" cy="19" r="15" fill="none" stroke={isLight ? '#e2e8f0' : 'rgba(30,41,59,0.8)'} strokeWidth="4" />
          <circle cx="19" cy="19" r="15" fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 15}`}
            strokeDashoffset={`${2 * Math.PI * 15 * (1 - score / 100)}`}
            strokeLinecap="round" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', itemsCenter: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '9px', fontWeight: 900, color: color }}>{score}</span>
        </div>
      </div>
      <span style={{ fontSize: '11px', fontWeight: 800, color }}>{label}</span>
    </div>
  );
}

function AlternativeCard({ alt, index, isLight }) {
  const [expanded, setExpanded] = useState(false);
  const inv = Number(alt.investment || 0);
  const withinBudget = (alt.budget_fit || '').toLowerCase().includes('within');
  const roi = alt.estimated_roi || '0%';
  const profit = alt.estimated_monthly_profit || 0;

  const cardBg = isLight ? '#ffffff' : 'rgba(10,15,30,0.7)';
  const cardBorder = expanded
    ? (isLight ? '#8b5cf6' : 'rgba(139,92,246,0.5)')
    : (isLight ? '#cbd5e1' : 'rgba(30,41,59,0.8)');
  const titleColor = isLight ? '#0f172a' : '#f1f5f9';
  const subtextColor = isLight ? '#334155' : '#64748b';
  const innerBg = isLight ? '#f8fafc' : 'rgba(15,23,42,0.6)';
  const innerBorder = isLight ? '#e2e8f0' : 'rgba(30,41,59,0.7)';
  const valueColor = isLight ? '#15803d' : '#10b981';

  return (
    <div style={{
      background: cardBg,
      border: `1px solid ${cardBorder}`,
      borderRadius: '16px',
      transition: 'all 0.25s ease',
      overflow: 'hidden',
      boxShadow: isLight ? '0 4px 14px rgba(15, 23, 42, 0.05)' : 'none',
    }}>
      <div style={{ padding: '16px 18px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: isLight ? '#f3e8ff' : 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(99,102,241,0.15))',
              border: isLight ? '1px solid #d8b4fe' : '1px solid rgba(139,92,246,0.3)', flexShrink: 0,
              fontSize: '13px', fontWeight: 900, color: isLight ? '#6b21a8' : '#a78bfa'
            }}>
              {index + 1}
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '14px', color: titleColor, lineHeight: 1.2 }}>{alt.name}</div>
              {alt.category && (
                <div style={{ fontSize: '10px', color: subtextColor, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                  <Tag size={9} />{alt.category}
                </div>
              )}
            </div>
          </div>
          <ScoreBadge score={alt.score || 0} isLight={isLight} />
        </div>

        {/* Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          {[
            { label: 'Investment', value: `₹${inv.toLocaleString('en-IN')}`, sub: alt.budget_fit, color: withinBudget ? (isLight ? '#15803d' : '#10b981') : (isLight ? '#b45309' : '#f59e0b') },
            { label: 'Monthly Profit', value: `₹${Number(profit).toLocaleString('en-IN')}`, sub: 'est.', color: isLight ? '#4338ca' : '#6366f1' },
            { label: 'Annual ROI', value: roi, sub: 'est.', color: isLight ? '#b45309' : '#f59e0b' },
          ].map((m, i) => (
            <div key={i} style={{ background: innerBg, borderRadius: '10px', padding: '10px', border: `1px solid ${innerBorder}` }}>
              <div style={{ fontSize: '11px', color: m.color, fontWeight: 900 }}>{m.value}</div>
              <div style={{ fontSize: '9px', color: subtextColor, fontWeight: 700, marginTop: '2px' }}>{m.label}</div>
              {m.sub && <div style={{ fontSize: '9px', color: subtextColor, marginTop: '1px' }}>{m.sub}</div>}
            </div>
          ))}
        </div>

        {/* Signals */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {alt.demand && (
            <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px',
              background: isLight ? '#dcfce7' : `${demandColor[alt.demand]}18`,
              color: isLight ? '#15803d' : demandColor[alt.demand],
              border: isLight ? '1px solid #86efac' : `1px solid ${demandColor[alt.demand]}30` }}>
              Demand: {alt.demand}
            </span>
          )}
          {alt.risk && (
            <span style={{ fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px',
              background: isLight ? '#e0e7ff' : 'rgba(99,102,241,0.1)',
              color: isLight ? '#4338ca' : '#818cf8',
              border: isLight ? '1px solid #c7d2fe' : '1px solid rgba(99,102,241,0.2)' }}>
              Risk: {alt.risk}
            </span>
          )}
        </div>

        {/* Why Recommended */}
        {alt.why_recommended && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '8px 10px', borderRadius: '8px',
            background: isLight ? '#f3e8ff' : 'rgba(139,92,246,0.06)', border: isLight ? '1px solid #d8b4fe' : '1px solid rgba(139,92,246,0.15)' }}>
            <Lightbulb size={12} style={{ color: isLight ? '#6b21a8' : '#a78bfa', marginTop: '1px', flexShrink: 0 }} />
            <span style={{ fontSize: '10px', color: isLight ? '#334155' : '#94a3b8', lineHeight: 1.5, fontWeight: 700 }}>{alt.why_recommended}</span>
          </div>
        )}

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ marginTop: '10px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
            fontSize: '10px', fontWeight: 800, color: isLight ? '#6b21a8' : '#7c3aed', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
          {expanded ? <><ChevronUp size={12} /> Less detail</> : <><ChevronDown size={12} /> More detail</>}
        </button>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div style={{ padding: '12px 18px 16px', borderTop: `1px solid ${cardBorder}`, background: isLight ? '#f8fafc' : 'rgba(7,10,20,0.5)' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: subtextColor, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BarChart2 size={12} style={{ color: isLight ? '#4338ca' : '#6366f1' }} /> Financial Overview
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {[
              { label: 'Est. Monthly Revenue', value: `₹${Number(alt.estimated_monthly_revenue || 0).toLocaleString('en-IN')}` },
              { label: 'Est. Monthly Profit',  value: `₹${Number(alt.estimated_monthly_profit || 0).toLocaleString('en-IN')}` },
              { label: 'Est. Annual Profit',   value: `₹${Number(alt.estimated_monthly_profit * 12 || 0).toLocaleString('en-IN')}` },
              { label: 'Estimated ROI',        value: alt.estimated_roi || '0%' },
            ].map((f, i) => (
              <div key={i} style={{ background: isLight ? '#ffffff' : 'rgba(15,23,42,0.7)', borderRadius: '8px', padding: '8px 10px', border: `1px solid ${innerBorder}` }}>
                <div style={{ fontSize: '12px', fontWeight: 900, color: titleColor }}>{f.value}</div>
                <div style={{ fontSize: '9px', color: subtextColor, marginTop: '2px', fontWeight: 700 }}>{f.label}</div>
              </div>
            ))}
          </div>

          {Array.isArray(alt.related) && alt.related.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: subtextColor, marginBottom: '5px' }}>Related businesses</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {alt.related.slice(0, 4).map((r, i) => (
                  <span key={i} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '6px', fontWeight: 700,
                    background: isLight ? '#f1f5f9' : 'rgba(30,41,59,0.6)', color: subtextColor, border: `1px solid ${innerBorder}` }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BetterBusinesses({ result }) {
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

  const smartAlts = result?.smart_alternatives;
  const legacyList = result?.better_businesses;

  const cardBg = isLight ? '#ffffff' : 'rgba(10,15,30,0.7)';
  const cardBorder = isLight ? '#cbd5e1' : 'rgba(30,41,59,0.8)';
  const titleColor = isLight ? '#0f172a' : '#f1f5f9';
  const subtextColor = isLight ? '#334155' : '#64748b';

  if (Array.isArray(smartAlts) && smartAlts.length > 0) {
    return (
      <section className="better-section">
        <div className="section-heading compact better-heading">
          <div className="section-icon"><Sparkles size={20} /></div>
          <div>
            <p className="section-eyebrow">AI SMART ALTERNATIVES</p>
            <h2>Better Business Opportunities</h2>
            <p>Personalised suggestions based on your budget, location, and business idea — ranked by market opportunity score.</p>
          </div>
          <span className="ai-picks">AI PICKS</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
          {smartAlts.map((alt, i) => (
            <AlternativeCard key={alt.name + i} alt={alt} index={i} isLight={isLight} />
          ))}
        </div>
      </section>
    );
  }

  if (Array.isArray(legacyList) && legacyList.length > 0) {
    return (
      <section className="better-section">
        <div className="section-heading compact better-heading">
          <div className="section-icon"><Sparkles size={20} /></div>
          <div>
            <p className="section-eyebrow">ALTERNATIVES</p>
            <h2>Better Business Opportunities</h2>
            <p>Other ideas the AI considers promising in this market.</p>
          </div>
          <span className="ai-picks">AI PICKS</span>
        </div>
        <div className="business-grid">
          {legacyList.map((name, i) => (
            <div key={i} style={{
              background: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: '14px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{ width: 32, height: 32, borderRadius: '10px', background: isLight ? '#f3e8ff' : 'rgba(139,92,246,0.15)',
                border: isLight ? '1px solid #d8b4fe' : '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 900, color: isLight ? '#6b21a8' : '#a78bfa', flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: titleColor }}>{name}</div>
                <div style={{ fontSize: '10px', color: subtextColor, marginTop: '2px' }}>Recommended alternative</div>
              </div>
              <ArrowRight size={14} style={{ color: isLight ? '#6b21a8' : '#7c3aed', marginLeft: 'auto', flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return null;
}
