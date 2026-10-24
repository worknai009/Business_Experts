import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { FaChartBar } from "react-icons/fa";

const money = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

function FinancialChart({ result }) {
  if (!result) return null;

  const revenue = Number(result.estimated_revenue ?? 0);
  const expenses = Number(result.estimated_expenses ?? 0);
  const profit = Number(result.estimated_profit ?? 0);

  // Planning projection only: a modest 2% month-over-month growth assumption.
  const chartData = Array.from({ length: 6 }, (_, index) => {
    const factor = Math.pow(1.02, index);
    const projectedRevenue = Math.round(revenue * factor);
    const projectedExpenses = Math.round(expenses * factor);
    return {
      month: `M${index + 1}`,
      revenue: projectedRevenue,
      expenses: projectedExpenses,
      profit: Math.max(0, projectedRevenue - projectedExpenses),
    };
  });

  return (
    <section className="chart-section">
      <div className="section-heading compact">
        <div className="section-icon"><FaChartBar /></div>
        <div>
          <p className="section-eyebrow">FINANCIAL PROJECTION</p>
          <h2>6-month revenue, expenses & profit</h2>
          <p>Planning projection based on the estimated monthly figures. Actual results will vary.</p>
        </div>
      </div>

      <div className="chart-summary-row">
        <span><b>Revenue</b> {money(revenue)}</span>
        <span><b>Expenses</b> {money(expenses)}</span>
        <span><b>Net profit</b> {money(profit)}</span>
      </div>

      <div className="chart-frame">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 18, right: 18, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(110,140,190,.14)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8ea0bc" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#8ea0bc" }} axisLine={false} tickLine={false}
              tickFormatter={(v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${Math.round(v / 1000)}k`} />
            <Tooltip
              contentStyle={{ background: "#0b1428", border: "1px solid rgba(55,110,210,.35)", borderRadius: 12, color: "#fff" }}
              formatter={(value, name) => [money(value), name === "revenue" ? "Revenue" : name === "expenses" ? "Expenses" : "Net profit"]}
            />
            <Legend wrapperStyle={{ color: "#a9b8cf", fontSize: 12 }} />
            <Line type="monotone" dataKey="revenue" stroke="#1688ff" strokeWidth={3} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="expenses" stroke="#ff6b7a" strokeWidth={3} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="profit" stroke="#19d3b1" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
export default FinancialChart;
