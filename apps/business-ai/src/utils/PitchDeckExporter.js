/**
 * PitchDeckExporter.js
 * Generates an executive 10-slide Investor Pitch Deck formatted for landscape A4 presentation and PDF export.
 */

export function generatePitchDeckData(result) {
  if (!result) return [];

  const title = result.business || result.title || "Venture Opportunity";
  const location = result.location || "Target City, India";
  const budget = Number(result.budget || result.investment || 500000);
  const reqInv = Number(result.estimated_investment || result.investment || Math.round(budget * 0.85));
  const mProf = Number(result.monthly_profit || result.estimated_profit || Math.round(reqInv * 0.22));
  const mRev = Number(result.monthly_revenue || result.estimated_revenue || Math.round(mProf / 0.35));
  const mExp = Math.max(0, mRev - mProf);
  const annualProfit = mProf * 12;
  const annualRev = mRev * 12;
  const roi = result.roi || `${Math.round((annualProfit / (reqInv || 1)) * 100)}%`;
  const payback = result.break_even || `${(reqInv / Math.max(mProf, 1)).toFixed(1)} Months`;
  const score = result.score || 88;
  const category = result.category || "Commercial Venture";

  const capexItems = [
    { label: "Machinery & Equipment", amount: Math.round(reqInv * 0.38), pct: "38%" },
    { label: "Fit-out & Commercial Interior", amount: Math.round(reqInv * 0.22), pct: "22%" },
    { label: "Initial Inventory & Supplies", amount: Math.round(reqInv * 0.18), pct: "18%" },
    { label: "Working Capital Reserve (90 Days)", amount: Math.round(reqInv * 0.14), pct: "14%" },
    { label: "Licenses, Branding & Marketing Launch", amount: Math.round(reqInv * 0.08), pct: "8%" },
  ];

  const y1Rev = annualRev;
  const y2Rev = Math.round(annualRev * 1.45);
  const y3Rev = Math.round(annualRev * 2.15);

  const y1Prof = annualProfit;
  const y2Prof = Math.round(annualProfit * 1.55);
  const y3Prof = Math.round(annualProfit * 2.35);

  return [
    // Slide 1: Cover Slide
    {
      slideNumber: 1,
      tag: "INVESTOR PRESENTATION",
      title: title,
      subtitle: `Commercial Feasibility & Scalable Growth Strategy in ${location}`,
      bullets: [
        `Target Capital Requirement: ₹${reqInv.toLocaleString('en-IN')}`,
        `Projected Annual ROI: ${roi}`,
        `Estimated Break-Even: ${payback}`,
        `Market Viability Score: ${score}/100`
      ],
      metrics: [
        { label: "Required Capital", value: `₹${reqInv.toLocaleString('en-IN')}` },
        { label: "Annual Revenue (Y1)", value: `₹${annualRev.toLocaleString('en-IN')}` },
        { label: "Net Margin", value: "32%–38%" },
        { label: "Payback Period", value: payback }
      ]
    },

    // Slide 2: Problem & Pain Point
    {
      slideNumber: 2,
      tag: "MARKET PROBLEM",
      title: "The Unmet Consumer & Commercial Gap",
      subtitle: `Why customers in ${location} are underserved by current options`,
      bullets: [
        "Fragmented local supply chain causing inconsistent service quality and high customer churn.",
        "Overpriced incumbent options lacking transparent pricing, digital ordering, and swift fulfillment.",
        `High localized demand in ${location} with insufficient organized, branded alternatives.`,
        "Modern consumers seeking reliable, hygienic, and tech-enabled experience without luxury markups."
      ],
      metrics: [
        { label: "Customer Dissatisfaction", value: "68%" },
        { label: "Unmet Demand Gap", value: "High" },
        { label: "Incumbent Margin Bloat", value: "35%+" }
      ]
    },

    // Slide 3: The Solution & Value Proposition
    {
      slideNumber: 3,
      tag: "THE SOLUTION",
      title: `The ${title} Advantage`,
      subtitle: "A modern, asset-light, and high-velocity operating model",
      bullets: [
        "Standardized Standard Operating Procedures (SOPs) ensuring rapid turnaround and consistent quality.",
        "Direct-to-consumer and micro-hub logistics eliminating middleman markup.",
        "Omnichannel presence: Walk-in experience + WhatsApp / Digital instant ordering.",
        "High customer retention driven by localized loyalty rewards and value-first pricing."
      ],
      metrics: [
        { label: "Order Turnaround", value: "< 5 Mins" },
        { label: "Customer LTV", value: "High" },
        { label: "Gross Margin", value: "55%+" }
      ]
    },

    // Slide 4: Market Size & Demographics
    {
      slideNumber: 4,
      tag: "MARKET OPPORTUNITY",
      title: "Target Market & Demographic Reach",
      subtitle: `Addressable consumer base across ${location} and surrounding tier-1 clusters`,
      bullets: [
        `Total Addressable Market (TAM): ₹8,500 Cr organized ${category} industry in India.`,
        `Serviceable Addressable Market (SAM): ₹650 Cr across urban clusters in ${location}.`,
        `Serviceable Obtainable Market (SOM): ₹18.5 Cr capture targeted in Years 1–3.`,
        "Primary demographic: 22–48 age bracket with discretionary monthly spend exceeding ₹15,000."
      ],
      metrics: [
        { label: "TAM", value: "₹8,500 Cr" },
        { label: "SAM", value: "₹650 Cr" },
        { label: "SOM (3-Yr Target)", value: "₹18.5 Cr" }
      ]
    },

    // Slide 5: Unit Economics & Monetization
    {
      slideNumber: 5,
      tag: "UNIT ECONOMICS",
      title: "Sustainable Unit Economics & Contribution Margin",
      subtitle: "Per-order profitability built for positive cash flow from Month 1",
      bullets: [
        "Average Order Value / Transaction: ₹350 – ₹1,200 depending on SKU selection.",
        "Direct Raw Material / COGS: 35% of revenue with volume procurement rebates.",
        "Direct Labor & Fulfillment: 18% of revenue with multi-skilled micro-teams.",
        `Contribution Margin (CM2): ~47% before rent and localized overheads.`
      ],
      metrics: [
        { label: "Avg Ticket Size", value: "₹550" },
        { label: "COGS %", value: "35%" },
        { label: "Contribution Margin", value: "47%" },
        { label: "CAC Payback", value: "< 45 Days" }
      ]
    },

    // Slide 6: Capital Allocation & Capex Split
    {
      slideNumber: 6,
      tag: "CAPEX ALLOCATION",
      title: "Use of Initial Startup Capital",
      subtitle: `Disciplined deployment of ₹${reqInv.toLocaleString('en-IN')} total capital`,
      bullets: capexItems.map(c => `${c.label}: ₹${c.amount.toLocaleString('en-IN')} (${c.pct})`),
      metrics: capexItems.slice(0, 3).map(c => ({ label: c.label, value: `₹${(c.amount / 100000).toFixed(1)}L (${c.pct})` }))
    },

    // Slide 7: 3-Year Financial Forecast
    {
      slideNumber: 7,
      tag: "FINANCIAL PROJECTIONS",
      title: "3-Year Revenue & EBITDA Roadmap",
      subtitle: "Conservative baseline forecast with rapid margin expansion",
      bullets: [
        `Year 1: ₹${y1Rev.toLocaleString('en-IN')} Revenue • ₹${y1Prof.toLocaleString('en-IN')} Net Profit (${Math.round((y1Prof / y1Rev) * 100)}% Margin)`,
        `Year 2: ₹${y2Rev.toLocaleString('en-IN')} Revenue • ₹${y2Prof.toLocaleString('en-IN')} Net Profit (Scale via 2nd outlet/channel)`,
        `Year 3: ₹${y3Rev.toLocaleString('en-IN')} Revenue • ₹${y3Prof.toLocaleString('en-IN')} Net Profit (Multi-unit franchise expansion)`,
        "Cash flow positive projected within the first 90 days of commercial launch."
      ],
      metrics: [
        { label: "Y1 Net Profit", value: `₹${y1Prof.toLocaleString('en-IN')}` },
        { label: "Y2 Net Profit", value: `₹${y2Prof.toLocaleString('en-IN')}` },
        { label: "Y3 Net Profit", value: `₹${y3Prof.toLocaleString('en-IN')}` }
      ]
    },

    // Slide 8: Competitive Advantage & Moat
    {
      slideNumber: 8,
      tag: "COMPETITIVE MOAT",
      title: "Defensible Moats & Differentiation",
      subtitle: "Why competitors cannot easily replicate our cost and speed advantage",
      bullets: [
        "Supplier Lock-in: Exclusive bulk pricing contracts with certified Grade-A suppliers.",
        "Hyper-local Brand Equity: Community engagement, Google 5-star review flywheel & referral loops.",
        "Proprietary SOPs: Fast onboarding protocol allowing new staff to be operational in 48 hours.",
        "Technology Edge: Real-time inventory tracking avoiding stockouts and food/material spoilage."
      ],
      metrics: [
        { label: "Gross Margin Edge", value: "+12%" },
        { label: "Customer Retention", value: "74%" },
        { label: "Staff Training Time", value: "48 Hrs" }
      ]
    },

    // Slide 9: 90-Day Go-To-Market Execution
    {
      slideNumber: 9,
      tag: "GO-TO-MARKET",
      title: "90-Day Launch & Customer Acquisition Playbook",
      subtitle: "Zero to 1,000 recurring customers milestone plan",
      bullets: [
        "Days 1–30: Commercial fitout, supplier onboarding, trade licensing & soft friends-and-family launch.",
        "Days 31–60: Grand Launch campaign across Instagram Ads, Meta geo-fencing (3km radius) & local influencer tasting.",
        "Days 61–90: Corporate B2B tie-ups, monthly subscription pass rollout & institutional supplier contracts.",
        "Target KPI: 50+ daily transacting customers by Day 45; 150+ daily customers by Day 90."
      ],
      metrics: [
        { label: "Day 30 Target", value: "Soft Launch" },
        { label: "Day 60 Target", value: "₹2.5L GMV" },
        { label: "Day 90 Target", value: "Break-even Runrate" }
      ]
    },

    // Slide 10: The Ask & Milestone Timeline
    {
      slideNumber: 10,
      tag: "THE ASK & ROADMAP",
      title: "Investment Ask & Value Creation Milestones",
      subtitle: "Partnering for high-margin, scalable enterprise value",
      bullets: [
        `Seeking ₹${reqInv.toLocaleString('en-IN')} in Debt / Equity / Hybrid Capital to execute Launch Phase.`,
        "Full capital deployment targeted across Months 1–2; operating cash flow self-sustaining by Month 4.",
        `Target Investor Payback: ${payback} with ${roi} annual return expectation.`,
        "Governance: Monthly audited P&L reporting, transparent dashboard access & quarterly advisory syncs."
      ],
      metrics: [
        { label: "Total Ask", value: `₹${reqInv.toLocaleString('en-IN')}` },
        { label: "Target IRR / ROI", value: roi },
        { label: "Reporting Cadence", value: "Monthly P&L" },
        { label: "Next Milestone", value: "Commercial Launch" }
      ]
    }
  ];
}

export function exportPitchDeckPdf(result) {
  const slides = generatePitchDeckData(result);
  if (!slides || slides.length === 0) return;

  const title = result.business || result.title || "Business Venture";
  const location = result.location || "India";

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - 10 Slide Investor Pitch Deck</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=JetBrains+Mono:wght@700&display=swap');

    @page {
      size: A4 landscape;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #061c16;
      color: #ffffff;
    }

    .slide {
      width: 297mm;
      height: 210mm;
      page-break-after: always;
      position: relative;
      background: linear-gradient(135deg, #061c16 0%, #032b20 50%, #061c16 100%);
      padding: 18mm 22mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    /* Ambient background glow */
    .slide::before {
      content: '';
      position: absolute;
      top: -100px;
      right: -100px;
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(187, 247, 208, 0.2);
      padding-bottom: 5mm;
    }

    .slide-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 0.05em;
      color: #34d399;
    }

    .slide-tag {
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #6ee7b7;
      padding: 4px 12px;
      border-radius: 20px;
    }

    .slide-number {
      font-size: 12px;
      font-weight: 800;
      color: #94a3b8;
    }

    .slide-body {
      flex: 1;
      padding-top: 8mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .slide-title {
      font-size: 32px;
      font-weight: 900;
      color: #ffffff;
      line-height: 1.2;
      margin: 0 0 4px 0;
    }

    .slide-subtitle {
      font-size: 14px;
      color: #a7f3d0;
      font-weight: 600;
      margin-bottom: 8mm;
    }

    .slide-content-grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: 8mm;
      align-items: start;
    }

    .bullets-box {
      background: rgba(6, 43, 32, 0.6);
      border: 1px solid rgba(187, 247, 208, 0.2);
      border-radius: 16px;
      padding: 6mm 8mm;
    }

    .bullet-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 13px;
      line-height: 1.6;
      color: #e2e8f0;
      margin-bottom: 4mm;
    }

    .bullet-item:last-child {
      margin-bottom: 0;
    }

    .bullet-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      margin-top: 7px;
      flex-shrink: 0;
    }

    .metrics-stack {
      display: flex;
      flex-direction: column;
      gap: 4mm;
    }

    .metric-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(187, 247, 208, 0.25);
      border-radius: 14px;
      padding: 5mm 6mm;
      text-align: left;
    }

    .metric-card-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 24px;
      font-weight: 900;
      color: #34d399;
    }

    .metric-card-lbl {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #94a3b8;
      margin-top: 2px;
    }

    .slide-footer {
      border-top: 1px solid rgba(187, 247, 208, 0.15);
      padding-top: 4mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #64748b;
      font-weight: 700;
    }

    .print-bar {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 9999;
      display: flex;
      gap: 8px;
    }

    .btn-print {
      background: #047857;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 12px;
      font-weight: 900;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
    }

    @media print {
      .print-bar { display: none; }
      body { background: #061c16; }
    }
  </style>
</head>
<body>

  <div class="print-bar">
    <button class="btn-print" onclick="window.print()">📥 Print / Save Landscape PDF</button>
  </div>

  ${slides.map((s) => `
    <div class="slide">
      <div class="slide-header">
        <div class="slide-brand">
          <span>⚡ BusinessAI</span>
          <span style="color: #64748b;">|</span>
          <span style="color: #ffffff;">${title}</span>
        </div>
        <div class="slide-tag">${s.tag}</div>
        <div class="slide-number">Slide ${s.slideNumber} / 10</div>
      </div>

      <div class="slide-body">
        <h1 class="slide-title">${s.title}</h1>
        <div class="slide-subtitle">${s.subtitle}</div>

        <div class="slide-content-grid">
          <div class="bullets-box">
            ${s.bullets.map(b => `
              <div class="bullet-item">
                <span class="bullet-dot"></span>
                <span>${b}</span>
              </div>
            `).join('')}
          </div>

          <div class="metrics-stack">
            ${(s.metrics || []).map(m => `
              <div class="metric-card">
                <div class="metric-card-val">${m.value}</div>
                <div class="metric-card-lbl">${m.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="slide-footer">
        <span>Confidential Investor Deck • ${location} Market</span>
        <span>Generated by BusinessAI Enterprise Feasibility Engine</span>
      </div>
    </div>
  `).join('')}

  <script>
    function triggerAutoPrint() {
      setTimeout(() => {
        try {
          window.focus();
          window.print();
        } catch (e) {
          console.warn('Auto print error:', e);
        }
      }, 600);
    }
    if (document.readyState === 'complete') {
      triggerAutoPrint();
    } else {
      window.addEventListener('load', triggerAutoPrint);
    }
  </script>
</body>
</html>
`;

  try {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl, '_blank');

    if (!printWindow || printWindow.closed || typeof printWindow.closed === 'undefined') {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 1000);
    }
  } catch (err) {
    console.error("Blob URL export fallback:", err);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }
  }
}
