/**
 * InvoicePdfExporter.js
 * Generates an official, bank-grade GST Tax Invoice and Payment Receipt formatted for A4 printing and PDF export.
 */

export function exportInvoicePdf(invoice, user = {}) {
  if (!invoice) return;

  const userStr = localStorage.getItem('user') || '{}';
  const currentUser = { ...JSON.parse(userStr), ...user };

  const invoiceId = invoice.invoiceId || invoice.id || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = invoice.date || invoice.transactionDate || new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  const planName = invoice.plan || invoice.planName || currentUser.plan || 'Pro Enterprise Plan';
  
  // Extract numeric amount
  const rawAmountStr = String(invoice.amount || '₹499').replace(/[^0-9.]/g, '');
  const totalAmount = Number(rawAmountStr) || 499;
  
  // 18% GST (9% CGST + 9% SGST) breakdown calculation
  const baseAmount = Math.round((totalAmount / 1.18) * 100) / 100;
  const totalGst = Math.round((totalAmount - baseAmount) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst / 2) * 100) / 100;

  const customerName = currentUser.fullName || currentUser.name || 'Valued Subscriber';
  const customerEmail = currentUser.email || 'user@businessai.com';
  const paymentMethod = invoice.paymentMethod || 'Stripe Gateway (Credit / Debit Card)';
  const status = invoice.status || 'PAID';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GST Tax Invoice — ${invoiceId}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 12mm 14mm;
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
      line-height: 1.5;
      font-size: 12px;
    }
    
    /* Top Interactive Floating Bar (Hidden during print) */
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
    .invoice-card {
      max-width: 210mm;
      margin: 24px auto;
      background: #ffffff;
      padding: 18mm 18mm 18mm 18mm;
      box-shadow: 0 4px 25px rgba(0,0,0,0.08);
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    @media print {
      body {
        background: #ffffff !important;
      }
      .no-print-bar {
        display: none !important;
      }
      .invoice-card {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        border: none !important;
      }
    }

    /* Header */
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #059669;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-title span {
      color: #059669;
    }
    .brand-tagline {
      font-size: 10.5px;
      color: #64748b;
      margin-top: 2px;
      font-weight: 600;
    }
    .tax-invoice-badge {
      text-align: right;
    }
    .badge-title {
      font-size: 18px;
      font-weight: 900;
      color: #059669;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .status-pill {
      display: inline-block;
      margin-top: 4px;
      background: #dcfce7;
      color: #166534;
      border: 1px solid #86efac;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.5px;
    }

    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
      background: #f8fafc;
      padding: 16px 20px;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }
    .info-block h3 {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #059669;
      margin: 0 0 8px 0;
    }
    .info-line {
      font-size: 11.5px;
      color: #334155;
      margin-bottom: 3px;
    }
    .info-line strong {
      color: #0f172a;
    }

    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 10px 14px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 800;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      font-size: 11.5px;
    }
    .text-right {
      text-align: right;
    }

    /* Totals Box */
    .totals-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 24px;
    }
    .totals-table {
      width: 320px;
      border-collapse: collapse;
    }
    .totals-table td {
      padding: 6px 12px;
      border: none;
      font-size: 11.5px;
    }
    .totals-table tr.border-top td {
      border-top: 1.5px solid #cbd5e1;
    }
    .grand-total {
      font-size: 15px;
      font-weight: 900;
      color: #059669;
    }

    /* Footer & Compliance */
    .compliance-footer {
      border-top: 1.5px solid #e2e8f0;
      padding-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 10px;
      color: #64748b;
    }
    .sign-box {
      text-align: right;
    }
    .sign-line {
      width: 160px;
      border-bottom: 1px solid #94a3b8;
      margin-bottom: 4px;
    }
    .barcode {
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 3px;
      font-weight: 700;
      font-size: 11px;
      color: #0f172a;
      margin-top: 4px;
    }
  </style>
</head>
<body>

  <!-- Floating Screen Action Bar -->
  <div class="no-print-bar">
    <div class="bar-info">
      <span class="bar-badge">Tax Invoice</span>
      <span class="bar-title">GST Tax Receipt — <strong>${invoiceId}</strong></span>
    </div>
    <div class="bar-actions">
      <button onclick="window.print()" class="btn-print">🖨️ Print / Save as PDF</button>
      <button onclick="window.close()" class="btn-close">✕ Close</button>
    </div>
  </div>

  <div class="invoice-card">

    <!-- Header -->
    <div class="invoice-header">
      <div>
        <h1 class="brand-title">BUSINESS<span>AI</span> ENTERPRISE</h1>
        <div class="brand-tagline">AI-Powered Business Feasibility &amp; Market Intelligence Platform</div>
        <div style="font-size: 10px; color: #475569; margin-top: 4px;">
          GSTIN: <strong>27AAACB2026A1Z5</strong> • CIN: U72900MH2026PTC109842<br>
          Cyber City Tech Park, Tower B, Pune, Maharashtra 411014, India
        </div>
      </div>
      <div class="tax-invoice-badge">
        <div class="badge-title">TAX INVOICE</div>
        <div class="status-pill">● ${status}</div>
      </div>
    </div>

    <!-- Info Grid -->
    <div class="info-grid">
      <div class="info-block">
        <h3>Billed To (Subscriber)</h3>
        <div class="info-line"><strong>Name:</strong> ${customerName}</div>
        <div class="info-line"><strong>Email:</strong> ${customerEmail}</div>
        <div class="info-line"><strong>Place of Supply:</strong> India (Domestic)</div>
        <div class="info-line"><strong>Membership Tier:</strong> ${planName}</div>
      </div>
      <div class="info-block">
        <h3>Invoice &amp; Transaction Details</h3>
        <div class="info-line"><strong>Invoice No:</strong> ${invoiceId}</div>
        <div class="info-line"><strong>Invoice Date:</strong> ${dateStr}</div>
        <div class="info-line"><strong>Payment Mode:</strong> ${paymentMethod}</div>
        <div class="info-line"><strong>SAC Code:</strong> 998313 (Software &amp; AI Cloud Services)</div>
      </div>
    </div>

    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th>Description of Service</th>
          <th>SAC Code</th>
          <th>Billing Cycle</th>
          <th class="text-right">Taxable Value</th>
          <th class="text-right">GST Rate</th>
          <th class="text-right">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>BusinessAI Enterprise Intelligence Subscription (${planName})</strong><br>
            <span style="font-size: 10px; color: #64748b;">Includes AI Opportunity Analysis, Feasibility Reports, Pitch Decks &amp; Market Radar.</span>
          </td>
          <td>998313</td>
          <td>Monthly</td>
          <td class="text-right">₹${baseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          <td class="text-right">18%</td>
          <td class="text-right"><strong>₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
        </tr>
      </tbody>
    </table>

    <!-- Totals Table -->
    <div class="totals-wrapper">
      <table class="totals-table">
        <tbody>
          <tr>
            <td>Taxable Subtotal:</td>
            <td class="text-right">₹${baseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td>Central GST (CGST @ 9%):</td>
            <td class="text-right">₹${cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
          <tr>
            <td>State GST (SGST @ 9%):</td>
            <td class="text-right">₹${sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
          <tr class="border-top">
            <td class="grand-total">Total Amount Paid:</td>
            <td class="text-right grand-total">₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Compliance Footer -->
    <div class="compliance-footer">
      <div>
        <div>This is a computer-generated tax invoice issued by <strong>BusinessAI Enterprise</strong>.</div>
        <div>All services rendered digitally under Indian IT Act &amp; GST Rule 46.</div>
        <div class="barcode">||| | ||||| || |||| ||| |||| | |||</div>
      </div>
      <div class="sign-box">
        <div class="sign-line"></div>
        <div><strong>Authorized Signatory</strong></div>
        <div style="font-size: 8.5px; color: #94a3b8;">BusinessAI Finance Operations</div>
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
          console.warn('Auto print error:', e);
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
    console.error("Invoice Blob URL fallback:", err);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    }
  }
}

export default exportInvoicePdf;
