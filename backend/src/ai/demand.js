import { BUSINESS_DATA } from "./businessData.js";

export function getDemand(businessName) {
  const b = (businessName || "").trim().toLowerCase();
  if (b in BUSINESS_DATA) {
    return BUSINESS_DATA[b].demand || "High";
  }
  for (const [k, v] of Object.entries(BUSINESS_DATA)) {
    if (k.includes(b) || b.includes(k)) {
      return v.demand || "High";
    }
  }
  const words = b.split(/\s+/);
  for (const w of words) {
    if (w.length > 2) {
      for (const [k, v] of Object.entries(BUSINESS_DATA)) {
        if (k.includes(w)) {
          return v.demand || "High";
        }
      }
    }
  }
  return "High";
}

export function analyzeDemand(business) {
  const demand = getDemand(business);

  let score = 10;
  let msg = "Niche market demand requiring focused targeted promotion.";

  if (demand === "High") {
    score = 20;
    msg = "Strong consumer search volume and sustained demand.";
  } else if (demand === "Medium") {
    score = 15;
    msg = "Consistent moderate consumer interest with stable recurring transactions.";
  }

  return {
    score,
    level: demand,
    message: msg
  };
}
