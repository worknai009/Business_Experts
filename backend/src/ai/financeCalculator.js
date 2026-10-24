import { getBusinessByName } from "./database.js";

export function calculateFinance(
  business,
  location = "",
  budget = 500000,
  demand = "High",
  competition = "Medium",
  risk = "Low"
) {
  const loc = (location || "").trim().toLowerCase();

  // Location multiplier for metropolitan hubs
  let locationMultiplier = 1.0;
  if (loc.includes("mumbai")) {
    locationMultiplier = 1.18;
  } else if (loc.includes("bangalore") || loc.includes("bengaluru")) {
    locationMultiplier = 1.15;
  } else if (loc.includes("pune")) {
    locationMultiplier = 1.10;
  } else if (loc.includes("delhi") || loc.includes("ncr")) {
    locationMultiplier = 1.12;
  } else if (loc.includes("hyderabad")) {
    locationMultiplier = 1.08;
  }

  const profile = getBusinessByName(business);

  let revenueMultiplier = profile ? Number(profile.revenue_multiplier || 2.2) : 2.1;
  const expenseRatio = profile ? Number(profile.expense_ratio || 0.65) : 0.65;
  const requiredInvestment = profile ? Number(profile.investment || budget || 500000) : (budget || 500000);

  // Demand modifier
  if (demand === "High") {
    revenueMultiplier += 0.3;
  } else if (demand === "Medium") {
    revenueMultiplier += 0.1;
  }

  // Competition modifier
  if (competition === "High") {
    revenueMultiplier -= 0.15;
  }

  // Risk modifier
  if (risk === "High") {
    revenueMultiplier -= 0.1;
  }

  const effectiveBudget = Math.max(budget || 0, 50000);

  // Annual calculations
  const annualRevenue = Math.floor(effectiveBudget * revenueMultiplier * locationMultiplier);
  const annualExpenses = Math.floor(annualRevenue * expenseRatio);
  const annualProfit = Math.max(0, annualRevenue - annualExpenses);

  // Monthly calculations
  const monthlyRevenue = Math.floor(annualRevenue / 12);
  const monthlyExpenses = Math.floor(annualExpenses / 12);
  const monthlyNetProfit = Math.floor(annualProfit / 12);

  const roiPct = effectiveBudget > 0 ? Math.round((annualProfit / effectiveBudget) * 100) : 0;
  const breakEvenMonths = monthlyNetProfit > 0 ? Math.round((effectiveBudget / monthlyNetProfit) * 10) / 10 : 12.0;

  let growth = "Stable";
  if (roiPct >= 100) {
    growth = "High Growth";
  } else if (roiPct >= 60) {
    growth = "Moderate Growth";
  }

  return {
    required_investment: requiredInvestment,
    monthly_revenue: monthlyRevenue,
    monthly_expenses: monthlyExpenses,
    monthly_net_profit: monthlyNetProfit,
    estimated_revenue: annualRevenue,
    estimated_expenses: annualExpenses,
    estimated_profit: annualProfit,
    annual_roi_percent: roiPct,
    roi: `${roiPct}%`,
    break_even_months: breakEvenMonths,
    break_even: `${breakEvenMonths} Months`,
    growth_potential: growth
  };
}
