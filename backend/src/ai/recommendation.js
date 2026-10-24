import { getBusinessByName, getBusinessesByNames } from "./database.js";

function titleCase(str) {
  return (str || "").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

export function getRecommendation(business, location = "", scoreData = {}, financeData = {}) {
  const bizName = titleCase(business || "Venture");
  const locName = titleCase(location || "Target City");

  const businessInfo = getBusinessByName(business);
  let relatedNames = [];
  if (businessInfo && businessInfo.related_businesses) {
    relatedNames = businessInfo.related_businesses
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
  }

  if (relatedNames.length === 0) {
    relatedNames = ["Cloud Kitchen", "Cafe & Bistro", "Bakery", "Juice Shop"];
  }

  const relatedData = getBusinessesByNames(relatedNames);
  const betterBusinesses = [];

  for (const item of relatedData) {
    const d = item.demand || "High";
    const c = item.competition || "Medium";
    const r = item.risk || "Low";

    let score = 50;
    if (d === "High") score += 25;
    else if (d === "Medium") score += 15;

    if (c === "Low") score += 15;
    else if (c === "Medium") score += 10;

    if (r === "Low") score += 15;
    else if (r === "Medium") score += 10;

    betterBusinesses.push({
      name: item.name || "Alternative",
      investment: item.investment ?? 500000,
      demand: d,
      competition: c,
      risk: r,
      ai_score: Math.min(score, 98)
    });
  }

  betterBusinesses.sort((a, b) => b.ai_score - a.ai_score);

  // Actionable 3-stage roadmap
  const actionPlan = [
    {
      step: 1,
      title: "Setup & Compliance (Days 1–15)",
      description: `Obtain Udyam MSME certificate, GST registration, local Shop Act (Gumasta) license in ${locName}, and open a current bank account.`
    },
    {
      step: 2,
      title: "Supplier Sourcing & Capex Deployment (Days 16–30)",
      description: "Procure initial equipment and raw inventory through wholesale channels; negotiate 15–30 day vendor credit terms."
    },
    {
      step: 3,
      title: "Hyper-Local Launch & Customer Acquisition (Days 31–60)",
      description: "Claim Google Business Profile, run geo-targeted local promotions, and introduce a customer referral cashback mechanism."
    }
  ];

  const insights = [
    `Location Advantage: Setting up ${bizName} in ${locName} gives strong access to targeted high-spend demographics.`,
    "Margin Benchmark: Maintain healthy 55%+ gross margins by consolidating primary suppliers.",
    `Financial Payback: Projected break-even timeline is ${financeData.break_even || "6.5 Months"} with diligent overhead control.`
  ];

  return {
    insights,
    action_plan: actionPlan,
    better_businesses: betterBusinesses.slice(0, 4),
    recommendation: insights.join("\n")
  };
}
