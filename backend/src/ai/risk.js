import { BUSINESS_DATA } from "./businessData.js";

export function getRisk(businessName) {
  const b = (businessName || "").trim().toLowerCase();
  if (b in BUSINESS_DATA) {
    return BUSINESS_DATA[b].risk || "Low";
  }
  for (const [k, v] of Object.entries(BUSINESS_DATA)) {
    if (k.includes(b) || b.includes(k)) {
      return v.risk || "Low";
    }
  }
  const words = b.split(/\s+/);
  for (const w of words) {
    if (w.length > 2) {
      for (const [k, v] of Object.entries(BUSINESS_DATA)) {
        if (k.includes(w)) {
          return v.risk || "Low";
        }
      }
    }
  }
  return "Low";
}

export function analyzeRisk(business) {
  const risk = getRisk(business);

  let score = 8;
  let msg = "Elevated capital risk. Tight supplier agreements and cash reserves recommended.";

  if (risk === "Low") {
    score = 20;
    msg = "Low structural and regulatory risk with steady cash flow.";
  } else if (risk === "Medium") {
    score = 15;
    msg = "Manageable operational risks. Requires discipline in inventory and rent control.";
  }

  return {
    score,
    level: risk,
    message: msg
  };
}
