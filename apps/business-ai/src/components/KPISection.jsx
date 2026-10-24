import { FaMoneyBillWave, FaWallet, FaChartLine, FaBullseye } from "react-icons/fa";

function formatMoney(value) {
  const num = Number(value ?? 0);
  return `₹${num.toLocaleString("en-IN")}`;
}

function KPISection({ result }) {
  if (!result) return null;

  const cards = [
    { title: "Required investment", subtitle: "Estimated startup capital", value: formatMoney(result.estimated_investment), icon: <FaWallet />, tone: "blue" },
    { title: "Revenue", subtitle: "Estimated monthly", value: formatMoney(result.estimated_revenue), icon: <FaMoneyBillWave />, tone: "green" },
    { title: "Expenses", subtitle: "Estimated monthly", value: formatMoney(result.estimated_expenses), icon: <FaWallet />, tone: "red" },
    { title: "Net profit", subtitle: "Estimated monthly", value: formatMoney(result.estimated_profit), icon: <FaChartLine />, tone: "purple" },
    { title: "ROI", subtitle: "Monthly profit / capital", value: result.roi ?? "N/A", icon: <FaBullseye />, tone: "cyan" },
  ];

  return (
    <section className="metrics-section">
      <div className="section-heading compact">
        <div className="section-icon"><FaChartLine /></div>
        <div>
          <p className="section-eyebrow">FINANCIALS</p>
          <h2>Financial snapshot</h2>
          <p>AI-generated estimates based on your business inputs.</p>
        </div>
      </div>

      <div className="metric-grid">
        {cards.map((card) => (
          <article className={`metric-card ${card.tone}`} key={card.title}>
            <div className="metric-top">
              <span className="metric-icon">{card.icon}</span>
              <span className="metric-ai">AI</span>
            </div>
            <span className="metric-title">{card.title}</span>
            <strong>{card.value}</strong>
            <span className="metric-subtitle">{card.subtitle}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default KPISection;
