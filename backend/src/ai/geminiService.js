export async function getAIMentorReply(message, business = "General Business", location = "India") {
  const apiKey = process.env.GEMINI_API_KEY;
  const biz = business || "General Business";
  const loc = location || "India";
  const q = (message || "").toLowerCase();

  // Try live Gemini API if key is present
  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert Indian business advisor. The user is asking about ${biz} in ${loc}. Question: ${message}`
                  }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText && candidateText.trim()) {
          return candidateText.trim();
        }
      }
    } catch (e) {
      console.warn("Gemini call failed, falling back to rule-based logic:", e.message);
    }
  }

  // Rule-based high-accuracy Indian business advisor responses
  if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("help") || q.includes("namaste")) {
    return (
      `Hello founder! 👋 I am your AI Business Mentor.\n\n` +
      `I can help you with:\n` +
      `1. **Government Schemes**: PMEGP, MUDRA, Stand-Up India, CGTMSE\n` +
      `2. **Capex & ROI**: Break-even timelines and margin audit\n` +
      `3. **Vendor Strategy**: Sourcing and 30-day credit terms\n` +
      `4. **Location Due Diligence**: Commercial lease terms in ${loc}`
    );
  }

  if (
    q.includes("scheme") ||
    q.includes("loan") ||
    q.includes("subsidy") ||
    q.includes("funding") ||
    q.includes("pmegp") ||
    q.includes("mudra")
  ) {
    return (
      `### 🏛️ Government Subsidies & Loans for ${biz}:\n\n` +
      `• **PMEGP Scheme**: 15%–35% capital subsidy on project costs up to ₹50 Lakhs (Manufacturing) / ₹20 Lakhs (Services).\n` +
      `• **MUDRA Loan**: Shishu (up to ₹50k), Kishore (₹50k–₹5L), Tarun (₹5L–₹10L).\n` +
      `• **CGTMSE**: Up to ₹5 Crore collateral-free credit cover via partner banks.`
    );
  }

  if (q.includes("negotiat") || q.includes("vendor") || q.includes("supplier") || q.includes("procure")) {
    return (
      `### 🤝 Vendor & Supplier Negotiation Strategy for ${biz}:\n\n` +
      `1. **Dual Sourcing**: Never depend on a single vendor. Always request quotes from 3 local and regional suppliers to maintain pricing leverage.\n` +
      `2. **Staggered Credit Terms**: Start with 50% upfront / 50% on delivery for Order 1, then transition to **Net-30 credit terms** after 60 days of consistent orders.\n` +
      `3. **Volume Tier Commitments**: Lock in wholesale tier pricing by committing to a 3-month rolling procurement forecast without paying upfront.\n` +
      `4. **Damaged Goods Buffer**: Enforce a contract clause where defective or damaged stock is replaced immediately at vendor cost.`
    );
  }

  if (q.includes("customer") || q.includes("acqui") || q.includes("marketing") || q.includes("sales") || q.includes("growth")) {
    return (
      `### 🚀 0 to 100 Customers Launch Blueprint for ${biz} in ${loc}:\n\n` +
      `• **Week 1 (Hyper-Local Infiltration)**:\n` +
      `  - Launch Google Business Profile with verified local location, photos, and introductory pricing.\n` +
      `  - Distribute 1,000 QR-code vouchers offering 20% off on first purchase to nearby offices and residential societies.\n\n` +
      `• **Week 2 (Referral Flywheel)**:\n` +
      `  - Introduce *"Give ₹100, Get ₹100"* friend referral program on WhatsApp.\n` +
      `  - Partner with 3 complementary non-competing local merchants for cross-promotion.\n\n` +
      `• **Week 3–4 (Digital Retargeting)**:\n` +
      `  - Run Meta / Instagram localized ads targeting a 3 km radius around your location with high-converting video reels.`
    );
  }

  if (q.includes("unit economic") || q.includes("margin") || q.includes("profit") || q.includes("cashflow") || q.includes("roi")) {
    return (
      `### 📊 Unit Economics & Profitability Benchmarks for ${biz}:\n\n` +
      `• **Gross Profit Margin**: Target 45%–60% (Revenue minus direct Raw Materials/COGS).\n` +
      `• **Operating Overheads (Opex)**: Keep rent under 15% and staffing under 20% of monthly gross revenue.\n` +
      `• **Net Operating Margin**: 22%–32% net take-home profit before corporate tax.\n` +
      `• **Break-Even Target**: Achieve Month 3 revenue where Gross Profit equals fixed monthly costs.\n` +
      `• **Payback Horizon**: Reclaim total capital expenditure within 8 to 12 months.`
    );
  }

  if (q.includes("lease") || q.includes("location") || q.includes("site") || q.includes("rent")) {
    return (
      `### 🏢 Commercial Lease Due Diligence in ${loc}:\n\n` +
      `• **Rent-to-Revenue Ratio**: Monthly rent should NOT exceed 12% to 15% of your projected gross revenue.\n` +
      `• **Fitout Rent-Free Period**: Negotiate a **30 to 45 day rent-free period** while doing interior setup and equipment installation.\n` +
      `• **Lock-in Period**: Insist on a 1-year lock-in for the landlord, with an exit notice clause of 60 days for yourself.\n` +
      `• **Utility Clearance**: Verify commercial electricity sanction (3-phase power) and water connections before signing.`
    );
  }

  // Default strategic advice
  return (
    `Here is strategic executive advice for **${biz}** in **${loc}**:\n\n` +
    `• **Market Opportunity**: Capitalize on high footfall & growing customer demand in ${loc}.\n` +
    `• **Unit Economics**: Target minimum 45%+ gross margin and 22%+ net profit margin.\n` +
    `• **Government Subsidies**: Apply for PMEGP (up to 35% capital subsidy) or MUDRA Kishore credit.\n` +
    `• **Working Capital**: Keep 90 days operating cash buffer.`
  );
}
