/**
 * BankReportExporter.js
 * Backward-compatible proxy to the enhanced ReportPdfExporter.
 */
import { exportFeasibilityPdfReport } from './ReportPdfExporter';

export function exportBankProjectReport(result) {
  return exportFeasibilityPdfReport(result);
}

export default exportBankProjectReport;
