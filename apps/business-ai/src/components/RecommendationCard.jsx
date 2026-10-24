import { FaRobot, FaChartLine, FaClock, FaStar, FaWallet, FaLightbulb } from "react-icons/fa";

function RecommendationCard({ result }) {
  if (!result) return null;

  const budget = Number(result.budget ?? 0);
  const required = Number(result.estimated_investment ?? 0);
  const score = Number(result.score ?? 0);
  const affordable = required > 0 && budget >= required;
  const strongOpportunity = score >= 81 && affordable;
  const cautionOpportunity = score >= 61;
  const statusText = strongOpportunity ? "Recommended" : cautionOpportunity ? "Recommended with caution" : "Not recommended yet";
  const statusClass = strongOpportunity ? "positive" : cautionOpportunity ? "caution" : "negative";
  const actionItems = strongOpportunity
    ? ["Validate the location before committing capital", "Keep a working-capital reserve", "Start with a controlled launch and track margins"]
    : [
        `Increase available capital toward ₹${required.toLocaleString("en-IN")}`,
        "Consider a smaller kiosk, home-based or lower-capital model",
        "Keep a separate working-capital reserve after setup costs",
      ];

  return (
    <section className="insights-section">
      <div className="insights-header">
        <div className="insights-brand">
          <div className="insights-icon"><FaRobot /></div>
          <div>
            <p className="section-eyebrow">AI DECISION SUPPORT</p>
            <h2>AI Recommendation</h2>
            <p>What the numbers suggest before you commit your money.</p>
          </div>
        </div>
        <span className={`recommendation-status ${statusClass}`}>
          {statusText}
        </span>
      </div>

      <div className="insight-grid">
        <Insight icon={<FaChartLine />} title="Growth" value={result.growth_potential} />
        <Insight icon={<FaClock />} title="Break-even" value={result.break_even} />
        <Insight icon={<FaStar />} title="Rating" value={result.rating} />
        <Insight icon={<FaWallet />} title="Funding gap" value={required > budget ? `₹${(required - budget).toLocaleString("en-IN")}` : "₹0"} />
      </div>

      <div className="recommendation-box">
        <div className="recommendation-label">RECOMMENDATION</div>
        <p>{result.recommendation}</p>
      </div>

      <div className="recommendation-actions">
        <div className="recommendation-actions-title"><FaLightbulb /> What you should do next</div>
        <ul>
          {actionItems.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>

      <p className="financial-basis">{result.financial_basis}</p>
    </section>
  );
}

function Insight({ icon, title, value }) {
  return (
    <div className="insight-card">
      <span className="insight-icon">{icon}</span>
      <span>{title}</span>
      <strong>{value ?? "N/A"}</strong>
    </div>
  );
}
export default RecommendationCard;
