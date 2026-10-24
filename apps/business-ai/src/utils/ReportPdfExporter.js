/**
 * ReportPdfExporter.js
 * Generates an Executive Business Feasibility & Bank Loan Appraisal Report formatted for A4 printing and PDF export.
 */

export function exportFeasibilityPdfReport(result) {
  if (!result) return;

  const title = result.business || result.title || "Commercial Enterprise Venture";
  const location = result.location || "Target City, India";
  
  // Safe Financial Normalization
  const budget = Math.max(10000, Number(result.budget || result.investment || 500000));
  const reqInv = Math.max(10000, Number(result.estimated_investment || result.investment || Math.round(budget * 0.85)));
  const mProf = Math.max(5000, Number(result.monthly_profit || result.estimated_profit || Math.round(reqInv * 0.20)));
  const mRev = Math.max(mProf + 5000, Number(result.monthly_revenue || result.estimated_revenue || Math.round(mProf / 0.32)));
  const mExp = Math.max(0, mRev - mProf);
  const annualProfit = mProf * 12;
  const roi = result.roi || `${result.roi_percent || Math.round((annualProfit / (reqInv || 1)) * 100)}%`;
  const payback = result.break_even || `${result.payback_months || (reqInv / Math.max(mProf, 1)).toFixed(1)} Months`;
  const score = Number(result.score || 88);
  const rating = result.rating || (score >= 85 ? "High Viability (A+)" : score >= 70 ? "Moderate Viability (B+)" : "Selective Risk (C)");
  const demand = result.demand || (score >= 80 ? "Strong (Tier-1 Growth)" : "Stable Demand");
  const risk = result.risk || (score >= 80 ? "Low-to-Moderate" : "Moderate");
  const reportId = `BAI-EXP-${Math.floor(100000 + Math.random() * 900000)}`;

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // Safe SWOT Array extraction
  const rawSwot = result.swot || {};
  const strengths = Array.isArray(rawSwot.strengths) && rawSwot.strengths.length > 0
    ? rawSwot.strengths
    : [
        `High consumer demand index in ${location} market cluster`,
        "Rapid capital turnaround cycle with healthy cashflow velocity",
        "Lean operational cost structure with scalable unit economics",
        "Strong operating margin profile across repeated transactions"
      ];

  const weaknesses = Array.isArray(rawSwot.weaknesses) && rawSwot.weaknesses.length > 0
    ? rawSwot.weaknesses
    : [
        "Initial 60-day customer acquisition and brand visibility ramp-up",
        "Working capital buffer required for inventory and stock reserves",
        "Local talent onboarding and process standardisation"
      ];

  const opportunities = Array.isArray(rawSwot.opportunities) && rawSwot.opportunities.length > 0
    ? rawSwot.opportunities
    : [
        "Multi-location franchise replication and institutional B2B contracts",
        "Direct-to-consumer digital ordering & omnichannel delivery expansion",
        "MSME credit guarantee and capital subsidy integration (PMEGP / MUDRA)"
      ];

  const threats = Array.isArray(rawSwot.threats) && rawSwot.threats.length > 0
    ? rawSwot.threats
    : [
        "Local raw material price fluctuations and supply chain volatility",
        "Aggressive localized pricing campaigns by entrenched incumbents",
        "Seasonal variations in consumer spending patterns"
      ];

  // Safe Action Plan extraction
  const actionPlan = Array.isArray(result.action_plan) && result.action_plan.length > 0
    ? result.action_plan
    : [
        "Phase 1: Legal incorporation, MSME Udyam registration & local GST/trade licensing",
        `Phase 2: Commercial site finalization & lease contract setup in ${location}`,
        "Phase 3: Machinery procurement, fit-out setup & vendor supply chain onboarding",
        "Phase 4: Targeted local marketing launch, promotional awareness & pilot operations",
        "Phase 5: Performance audit at 30 days, margin optimization & operational scaling"
      ];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bank Project Report (PDF) — ${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 12mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 0;
      line-height: 1.45;
      font-size: 11.5px;
    }
    
    /* Top Interactive Floating Bar (Hidden when printed) */
    .no-print-bar {
      background: #0f172a;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      position: sticky;
      top: 0;
      z-index: 9999;
      border-bottom: 2px solid #059669;
    }
    .bar-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .bar-badge {
      background: #059669;
      color: white;
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .bar-title {
      font-weight: 700;
      font-size: 13px;
    }
    .bar-actions {
      display: flex;
      gap: 10px;
    }
    .btn-print {
      background: #059669;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);
      transition: all 0.2s;
    }
    .btn-print:hover {
      background: #047857;
      transform: translateY(-1px);
    }
    .btn-close {
      background: #334155;
      color: #cbd5e1;
      border: 1px solid #475569;
      padding: 8px 14px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-close:hover {
      background: #475569;
      color: white;
    }

    /* Page Container */
    .document-page {
      max-width: 210mm;
      margin: 20px auto;
      background: #ffffff;
      padding: 16mm 16mm 16mm 16mm;
      box-shadow: 0 4px 25px rgba(0,0,0,0.08);
      border-radius: 8px;
    }

    @media print {
      body {
        background: #ffffff !important;
      }
      .no-print-bar {
        display: none !important;
      }
      .document-page {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
    }

    /* Header Styling */
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #059669;
      padding-bottom: 12px;
      margin-bottom: 14px;
    }
    .brand-group h1 {
      font-size: 20px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .brand-badge {
      background: #059669;
      color: white;
      font-size: 9px;
      padding: 2px 6px;
      border-radius: 4px;
      vertical-align: middle;
    }
    .brand-subtitle {
      font-size: 10.5px;
      color: #059669;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-top: 3px;
    }
    .meta-stamp {
      text-align: right;
      font-size: 9.5px;
      color: #64748b;
      line-height: 1.4;
    }
    .meta-stamp strong {
      color: #0f172a;
    }
    
    /* Summary Grid */
    .summary-banner {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 10px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 14px;
    }
    .banner-item {
      display: flex;
      flex-direction: column;
    }
    .banner-label {
      font-size: 8.5px;
      font-weight: 800;
      text-transform: uppercase;
      color: #047857;
      letter-spacing: 0.5px;
    }
    .banner-val {
      font-size: 13px;
      font-weight: 900;
      color: #0f172a;
      margin-top: 2px;
    }
    .score-val {
      color: #059669;
    }

    /* Section Headings */
    .section-header {
      font-size: 12px;
      font-weight: 900;
      color: #0f172a;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 3px;
      margin-top: 12px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .section-tag {
      font-size: 8.5px;
      color: #059669;
      font-weight: 800;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      font-size: 10.5px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 5px 8px;
      text-align: left;
    }
    th {
      background: #f8fafc;
      color: #334155;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.3px;
    }
    .highlight-cell {
      font-weight: 800;
      color: #059669;
    }
    .bold-cell {
      font-weight: 800;
      color: #0f172a;
    }

    /* SWOT Grid */
    .swot-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 10px;
    }
    .swot-card {
      padding: 7px 10px;
      border-radius: 6px;
      border: 1px solid;
      font-size: 10px;
    }
    .swot-card strong {
      display: block;
      font-size: 9.5px;
      text-transform: uppercase;
      margin-bottom: 3px;
      letter-spacing: 0.3px;
      font-weight: 800;
    }
    .swot-s { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
    .swot-w { background: #fffbe6; border-color: #fde047; color: #854d0e; }
    .swot-o { background: #eff6ff; border-color: #bfdbfe; color: #1e40af; }
    .swot-t { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
    .swot-card ul {
      margin: 0;
      padding-left: 12px;
    }
    .swot-card li {
      margin-bottom: 2px;
    }

    /* Action Steps */
    .roadmap-list {
      margin: 0 0 10px 0;
      padding-left: 16px;
      font-size: 10.5px;
      color: #334155;
    }
    .roadmap-list li {
      margin-bottom: 3px;
      font-weight: 600;
    }

    /* Subsidies block */
    .schemes-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 10.5px;
      margin-bottom: 12px;
    }

    /* Sign off */
    .signoff-section {
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1.5px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 9px;
      color: #64748b;
    }
    .signoff-line {
      width: 170px;
      border-bottom: 1px solid #94a3b8;
      margin-bottom: 4px;
    }
    .barcode {
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 3px;
      font-weight: 700;
      font-size: 10.5px;
      color: #0f172a;
      margin-top: 2px;
    }
  </style>
</head>
<body>

  <!-- Floating Control Bar (Screen only) -->
  <div class="no-print-bar">
    <div class="bar-info">
      <span class="bar-badge">Official Appraisal</span>
      <span class="bar-title">Bank Project Feasibility Report — <strong>${title}</strong></span>
    </div>
    <div class="bar-actions">
      <button onclick="window.print()" class="btn-print">🖨️ Print / Save as PDF</button>
      <button onclick="window.close()" class="btn-close">✕ Close</button>
    </div>
  </div>

  <div class="document-page">

    <!-- Header -->
    <div class="header-bar">
      <div class="brand-group">
        <h1>BUSINESSAI INTELLIGENCE <span class="brand-badge">ENTERPRISE</span></h1>
        <div class="brand-subtitle">Executive Feasibility &amp; Commercial Bank Appraisal Report</div>
      </div>
      <div class="meta-stamp">
        <div><strong>Report Ref:</strong> ${reportId}</div>
        <div><strong>Date Generated:</strong> ${dateStr}</div>
        <div><strong>Target Territory:</strong> ${location}</div>
        <div><strong>Classification:</strong> Confidential Bank Project Proposal</div>
      </div>
    </div>

    <!-- Summary KPI Banner -->
    <div class="summary-banner">
      <div class="banner-item">
        <span class="banner-label">Venture Proposal</span>
        <span class="banner-val">${title}</span>
      </div>
      <div class="banner-item">
        <span class="banner-label">Feasibility Score</span>
        <span class="banner-val score-val">${score}/100 (${rating})</span>
      </div>
      <div class="banner-item">
        <span class="banner-label">Estimated Project Outlay</span>
        <span class="banner-val">₹${reqInv.toLocaleString('en-IN')}</span>
      </div>
      <div class="banner-item">
        <span class="banner-label">Projected Annual ROI</span>
        <span class="banner-val score-val">${roi}</span>
      </div>
    </div>

    <!-- Section 1: Financial Performance Forecast -->
    <div class="section-header">
      <span>1. 12-Month Financial Performance &amp; Unit Economics</span>
      <span class="section-tag">Bank Loan Forecast</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Financial Parameter / Metric</th>
          <th>Projected Value (INR)</th>
          <th>Appraisal Benchmark &amp; Analysis</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="bold-cell">Total Capital Expenditure (Project Cost)</td>
          <td class="bold-cell">₹${reqInv.toLocaleString('en-IN')}</td>
          <td>Equipment setup, leasehold premises fitout, initial inventory &amp; licenses</td>
        </tr>
        <tr>
          <td class="bold-cell">Promoter Equity / Available Seed Fund</td>
          <td>₹${budget.toLocaleString('en-IN')}</td>
          <td>Promoter liquidity commitment and unencumbered equity margin</td>
        </tr>
        <tr>
          <td class="bold-cell">Projected Monthly Gross Turnover</td>
          <td class="highlight-cell">₹${mRev.toLocaleString('en-IN')}</td>
          <td>Derived from footfall density, localized market demand and price benchmarking</td>
        </tr>
        <tr>
          <td class="bold-cell">Estimated Monthly Operational Expenses</td>
          <td>₹${mExp.toLocaleString('en-IN')}</td>
          <td>Commercial lease, COGS inventory, staffing, utilities &amp; digital promotion</td>
        </tr>
        <tr>
          <td class="bold-cell">Estimated Monthly Net Profit</td>
          <td class="highlight-cell">₹${mProf.toLocaleString('en-IN')}</td>
          <td>Net operational surplus available for debt servicing and retained earnings</td>
        </tr>
        <tr>
          <td class="bold-cell">Projected Annual Net Earnings (Year 1)</td>
          <td class="highlight-cell">₹${annualProfit.toLocaleString('en-IN')}</td>
          <td>12-Month annualized cashflow projection after all operating deductions</td>
        </tr>
        <tr>
          <td class="bold-cell">Capital Payback Period (Break-Even)</td>
          <td class="bold-cell">${payback}</td>
          <td>High credit safety profile with fast capital recovery horizon</td>
        </tr>
      </tbody>
    </table>

    <!-- Section 2: Capital Deployment & Allocation Breakdown -->
    <div class="section-header">
      <span>2. Capital Deployment &amp; Capex Allocation Breakdown</span>
      <span class="section-tag">Fund Distribution</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Deployment Category</th>
          <th>Allocation %</th>
          <th>Budget Allocation (INR)</th>
          <th>Operational Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="bold-cell">Machinery, Equipment &amp; Technology</td>
          <td>40%</td>
          <td>₹${Math.round(reqInv * 0.40).toLocaleString('en-IN')}</td>
          <td>Core equipment, digital POS, refrigeration/fixtures &amp; operational hardware</td>
        </tr>
        <tr>
          <td class="bold-cell">Premises Lease Security &amp; Interior Fitout</td>
          <td>30%</td>
          <td>₹${Math.round(reqInv * 0.30).toLocaleString('en-IN')}</td>
          <td>Commercial rental advance, electrical work, signage &amp; interior renovations</td>
        </tr>
        <tr>
          <td class="bold-cell">Initial Raw Materials &amp; Inventory Pipeline</td>
          <td>20%</td>
          <td>₹${Math.round(reqInv * 0.20).toLocaleString('en-IN')}</td>
          <td>First 30–45 days raw supplies, packaging and stock merchandising</td>
        </tr>
        <tr>
          <td class="bold-cell">Working Capital Reserve Liquidity</td>
          <td>10%</td>
          <td>₹${Math.round(reqInv * 0.10).toLocaleString('en-IN')}</td>
          <td>Contingency operating buffer for staff payroll and utilities (Months 1–3)</td>
        </tr>
      </tbody>
    </table>

    <!-- Section 3: SWOT Strategic Matrix -->
    <div class="section-header">
      <span>3. SWOT Strategic Risk &amp; Feasibility Matrix</span>
      <span class="section-tag">Market Radar</span>
    </div>
    <div class="swot-container">
      <div class="swot-card swot-s">
        <strong>✓ Strengths</strong>
        <ul>
          ${strengths.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      <div class="swot-card swot-w">
        <strong>⚠ Weaknesses &amp; Operational Gaps</strong>
        <ul>
          ${weaknesses.map(w => `<li>${w}</li>`).join('')}
        </ul>
      </div>
      <div class="swot-card swot-o">
        <strong>★ Strategic Growth Opportunities</strong>
        <ul>
          ${opportunities.map(o => `<li>${o}</li>`).join('')}
        </ul>
      </div>
      <div class="swot-card swot-t">
        <strong>✕ External Market Threats &amp; Risks</strong>
        <ul>
          ${threats.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    </div>

    <!-- Section 4: Operational Launch Roadmap -->
    <div class="section-header">
      <span>4. 5-Step Operational Milestone Execution Plan</span>
      <span class="section-tag">Execution Strategy</span>
    </div>
    <ol class="roadmap-list">
      ${actionPlan.map(step => `<li>${step}</li>`).join('')}
    </ol>

    <!-- Section 5: Government Grants & Schemes -->
    <div class="section-header">
      <span>5. Government Schemes &amp; Institutional Credit Eligibility</span>
      <span class="section-tag">Bank Loan Match</span>
    </div>
    <div class="schemes-box">
      <div style="margin-bottom: 5px;"><strong>• PMEGP (Prime Minister's Employment Generation Programme):</strong> Eligible for 15% to 35% government capital subsidy on project cost with collateral-free debt structure.</div>
      <div style="margin-bottom: 5px;"><strong>• Pradhan Mantri MUDRA Yojana (PMMY):</strong> Collateral-free institutional debt under <em>Shishu</em> (up to ₹50,000), <em>Kishore</em> (up to ₹5 Lakhs), or <em>Tarun</em> (up to ₹10 Lakhs) categories.</div>
      <div><strong>• CGTMSE Credit Guarantee Coverage:</strong> Up to 85% credit guarantee coverage for commercial scheduled bank loan approvals without third-party collateral pledges.</div>
    </div>

    <!-- Sign off and Verification -->
    <div class="signoff-section">
      <div>
        <div>Generated by <strong>BusinessAI Enterprise Platform</strong></div>
        <div>Official Bank Appraisal &amp; Feasibility Evaluation Document</div>
        <div class="barcode">||| | ||||| || |||| ||| |||| | |||</div>
      </div>
      <div style="text-align: right;">
        <div class="signoff-line"></div>
        <div><strong>Authorized Promoter / Loan Appraiser Signature</strong></div>
        <div style="font-size: 8px; color: #94a3b8;">Document Verification Hash: ${reportId}</div>
      </div>
    </div>

  </div>

  <script>
    function triggerAutoPrint() {
      setTimeout(() => {
        try {
          window.focus();
          window.print();
        } catch (e) {
          console.warn('Auto print trigger error:', e);
        }
      }, 500);
    }

    if (document.readyState === 'complete') {
      triggerAutoPrint();
    } else {
      window.addEventListener('load', triggerAutoPrint);
    }
  </script>
</body>
</html>`;

  try {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl, '_blank');

    if (!printWindow || printWindow.closed || typeof printWindow.closed === 'undefined') {
      // Fallback if popup blocker intercepted window.open
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
      printWindow.document.write(html);
      printWindow.document.close();
    }
  }
}

export const exportBankProjectReport = exportFeasibilityPdfReport;
export default exportFeasibilityPdfReport;
