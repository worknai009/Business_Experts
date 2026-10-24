import { BUSINESS_DATA } from "./businessData.js";

export function getCompetition(businessName) {
  const b = (businessName || "").trim().toLowerCase();
  if (b in BUSINESS_DATA) {
    return BUSINESS_DATA[b].competition || "Medium";
  }
  for (const [k, v] of Object.entries(BUSINESS_DATA)) {
    if (k.includes(b) || b.includes(k)) {
      return v.competition || "Medium";
    }
  }
  const words = b.split(/\s+/);
  for (const w of words) {
    if (w.length > 2) {
      for (const [k, v] of Object.entries(BUSINESS_DATA)) {
        if (k.includes(w)) {
          return v.competition || "Medium";
        }
      }
    }
  }
  return "Medium";
}

export function analyzeCompetition(business) {
  const competition = getCompetition(business);

  let score = 10;
  let msg = "High concentration of established players. High-quality branding needed.";

  if (competition === "Low") {
    score = 20;
    msg = "Favorable competitive landscape with strong untapped market share.";
  } else if (competition === "Medium") {
    score = 15;
    msg = "Moderate competition. Differentiation and customer loyalty will drive success.";
  }

  return {
    score,
    level: competition,
    message: msg
  };
}
