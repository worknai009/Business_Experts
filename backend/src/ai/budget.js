import { BUSINESS_DATA } from "./businessData.js";

export function findBusinessProfile(businessName) {
  const b = (businessName || "").trim().toLowerCase();
  if (b in BUSINESS_DATA) {
    return BUSINESS_DATA[b];
  }
  for (const [k, v] of Object.entries(BUSINESS_DATA)) {
    if (k.includes(b) || b.includes(k)) {
      return v;
    }
  }
  // Category / keyword fallback
  const words = b.split(/\s+/);
  for (const w of words) {
    if (w.length > 2) {
      for (const [k, v] of Object.entries(BUSINESS_DATA)) {
        if (k.includes(w)) {
          return v;
        }
      }
    }
  }
  return { investment: 500000, demand: "High", competition: "Medium", risk: "Low" };
}

export function analyzeBudget(business, userBudget) {
  const profile = findBusinessProfile(business);
  const requiredBudget = profile.investment ?? 500000;

  const percentage = requiredBudget > 0 ? (userBudget / requiredBudget) * 100 : 100;

  if (percentage >= 100) {
    return {
      score: 20,
      required_investment: requiredBudget,
      message: "Your allocated budget is fully sufficient for launch."
    };
  } else if (percentage >= 80) {
    return {
      score: 15,
      required_investment: requiredBudget,
      message: "Budget is slightly low. Consider bootstrapping equipment or leasing."
    };
  } else if (percentage >= 60) {
    return {
      score: 10,
      required_investment: requiredBudget,
      message: "Budget is low. You may need working capital assistance or a MUDRA loan."
    };
  } else if (percentage >= 40) {
    return {
      score: 5,
      required_investment: requiredBudget,
      message: "Budget is very low compared to standard industry Capex."
    };
  } else {
    return {
      score: 0,
      required_investment: requiredBudget,
      message: "Budget is insufficient for full-scale standalone setup."
    };
  }
}
