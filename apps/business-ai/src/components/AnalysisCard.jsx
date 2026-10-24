import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Brain,
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
  Star,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

function getBadge(value = "") {
  const level = String(value).toLowerCase();
  if (level.includes("excellent") || level.includes("high")) return "success";
  if (level.includes("good") || level.includes("medium") || level.includes("moderate")) return "warning";
  if (level.includes("low") || level.includes("poor")) return "danger";
  return "neutral";
}

function AnalysisCard({ result }) {
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

  if (!result) return null;

  const budgetMessage = result.budget_analysis?.message ?? "Budget fit was included in the score.";
  const breakdown = Array.isArray(result.score_breakdown)
    ? result.score_breakdown
    : [
        { key: "budget", label: "Budget fit", score: Number(result.budget_analysis?.score ?? 0), max_score: 60 },
        { key: "demand", label: "Market demand", score: Number(result.demand_analysis?.score ?? 0), max_score: 10 },
        { key: "competition", label: "Competition", score: Number(result.competition_analysis?.score ?? 0), max_score: 10 },
        { key: "risk", label: "Risk", score: Number(result.risk_analysis?.score ?? 0), max_score: 10 },
        { key: "location", label: "Location", score: Number(result.location_analysis?.score ?? 0), max_score: 10 },
      ];
  const calculatedScore = breakdown.reduce((sum, item) => sum + Number(item.score || 0), 0);
  const rawScore = Math.max(0, Math.min(100, Math.round(calculatedScore)));
  const derivedRating = rawScore >= 81 ? "Excellent" : rawScore >= 61 ? "Good" : rawScore >= 41 ? "Average" : rawScore >= 21 ? "Poor" : "Very Poor";
  const progressValue = rawScore;
  const scoreText = `${rawScore}`;

  const budgetTier = result.budget_tier;
  const matchedBiz = result.matched_business;
  const decisionStatus = result.decision_status;

  const decisionColors = isLight ? {
    'Highly Recommended': { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
    'Recommended': { bg: '#eef2ff', border: '#c7d2fe', text: '#4338ca' },
    'Recommended with caution': { bg: '#fffbeb', border: '#fde68a', text: '#b45309' },
    'Not recommended yet': { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' },
  } : {
    'Highly Recommended': { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.35)', text: '#34d399' },
    'Recommended': { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.35)', text: '#818cf8' },
    'Recommended with caution': { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)', text: '#fbbf24' },
    'Not recommended yet': { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
  };
  const dc = decisionColors[decisionStatus] || decisionColors['Recommended with caution'];

  const details = [
    { icon: <BriefcaseBusiness size={17} />, label: "Business", value: result.business ?? "N/A", type: "text" },
    ...(matchedBiz && matchedBiz.toLowerCase() !== (result.business || '').toLowerCase() ? [{ icon: <Brain size={17} />, label: "Matched to", value: matchedBiz, type: "text" }] : []),
    { icon: <MapPin size={17} />, label: "Location", value: result.location ?? "N/A", type: "text" },
    { icon: <IndianRupee size={17} />, label: "Your Budget", value: result.budget != null ? `₹${Number(result.budget).toLocaleString("en-IN")}` : "N/A", type: "text" },
    { icon: <IndianRupee size={17} />, label: "Est. Required", value: result.estimated_investment != null ? `₹${Number(result.estimated_investment).toLocaleString("en-IN")}` : "N/A", type: "text" },
    { icon: <Star size={17} />, label: "Rating", value: result.rating ?? "N/A", type: "badge" },
    { icon: <TrendingUp size={17} />, label: "Market demand", value: result.demand_analysis?.level ?? "N/A", type: "badge" },
    { icon: <ShieldAlert size={17} />, label: "Competition", value: result.competition_analysis?.level ?? "N/A", type: "badge" },
    { icon: <ShieldCheck size={17} />, label: "Risk level", value: result.risk_analysis?.level ?? "N/A", type: "badge" },
  ];

  return (
    <section className="analysis-section">
      <div className="section-heading">
        <div className="section-icon"><Brain size={20} /></div>
        <div>
          <p className="section-eyebrow">AI REPORT</p>
          <h2>Business opportunity score</h2>
          <p>One clear view of the factors behind the AI recommendation.</p>
        </div>
      </div>

      <div className="analysis-main-grid">
        <div className="score-panel">
          <div className="score-ring">
            <CircularProgressbar
              value={progressValue}
              text={scoreText}
              styles={buildStyles({
                textSize: "22px",
                pathColor: isLight ? "#16a34a" : "#1688ff",
                textColor: isLight ? "#0f172a" : "#f8fafc",
                trailColor: isLight ? "#cbd5e1" : "#16233d",
                strokeLinecap: "round",
              })}
            />
          </div>
          <span className="score-label">AI BUSINESS SCORE</span>
          <strong>{rawScore}/100</strong>
          <div className="score-rating-pill">{derivedRating} opportunity</div>
          <p>Calculated from five transparent weighted signals. The displayed score is the exact sum of the contributions shown below.</p>
          <span className="score-budget-note">{budgetMessage}</span>
          <span className="score-formula-note">{result.score_formula ?? "Budget 60 + demand 10 + competition 10 + risk 10 + location 10 = 100 points"}</span>
        </div>

        <div className="overview-panel">
          <div className="overview-title">
            <div>
              <p className="section-eyebrow">BUSINESS SNAPSHOT</p>
              <h3>Key signals</h3>
            </div>
            <span className={`confidence-badge ${getBadge(result.rating)}`}>{derivedRating}</span>
          </div>
          {decisionStatus && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0 4px', padding: '8px 12px', borderRadius: '10px', background: dc.bg, border: `1px solid ${dc.border}` }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: dc.text }}>🎯 {decisionStatus}</span>
              {budgetTier && <span style={{ fontSize: '10px', color: isLight ? '#475569' : '#64748b', marginLeft: 'auto', fontWeight: 700 }}>{budgetTier.emoji} {budgetTier.label}</span>}
            </div>
          )}

          <div className="overview-grid">
            {details.map((item) => (
              <div className="overview-item" key={item.label}>
                <div className="overview-item-top">
                  <span className="overview-item-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.type === "badge" ? (
                  <span className={`signal-badge ${getBadge(item.value)}`}>{item.value}</span>
                ) : (
                  <strong>{item.value}</strong>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="score-breakdown">
        <div className="score-breakdown-head">
          <div>
            <p className="section-eyebrow">SCORE CALCULATION</p>
            <h3>Why this score?</h3>
          </div>
          <span className="score-total-chip">{rawScore} / 100</span>
        </div>
        <div className="score-breakdown-grid">
          {breakdown.map((item) => {
            const percentage = item.max_score ? Math.min(100, (item.score / item.max_score) * 100) : 0;
            return (
              <div className="score-breakdown-item" key={item.key}>
                <div className="score-breakdown-row">
                  <span>{item.label}</span>
                  <strong>{item.score}/{item.max_score}</strong>
                </div>
                <div className="score-breakdown-track">
                  <span style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="score-breakdown-note">Budget fit carries 60 points; demand, competition, risk and location contribute 10 points each. The final score is the exact sum of these five contributions.</p>
      </div>
    </section>
  );
}

export default AnalysisCard;
