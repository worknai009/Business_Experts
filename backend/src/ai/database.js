import { BUSINESS_DATA } from "./businessData.js";

function titleCase(str) {
  return (str || "").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

export function getBusinessByName(name) {
  const cleanName = (name || "").trim().toLowerCase();

  // 1. Direct match in BUSINESS_DATA
  if (cleanName in BUSINESS_DATA) {
    const item = BUSINESS_DATA[cleanName];
    return {
      name: titleCase(name),
      investment: item.investment ?? 500000,
      revenue_multiplier: 2.2,
      expense_ratio: 0.65,
      demand: item.demand || "High",
      competition: item.competition || "Medium",
      risk: item.risk || "Low",
      related_businesses: (item.related || ["Coffee Shop", "Bakery"]).join(",")
    };
  }

  // 2. Fuzzy search in BUSINESS_DATA
  for (const [key, item] of Object.entries(BUSINESS_DATA)) {
    if (key.includes(cleanName) || cleanName.includes(key)) {
      return {
        name: titleCase(key),
        investment: item.investment ?? 500000,
        revenue_multiplier: 2.2,
        expense_ratio: 0.65,
        demand: item.demand || "High",
        competition: item.competition || "Medium",
        risk: item.risk || "Low",
        related_businesses: (item.related || ["Coffee Shop", "Bakery"]).join(",")
      };
    }
  }

  // 3. Default smart heuristic profile
  return {
    name: titleCase(name || "Venture"),
    investment: 500000,
    revenue_multiplier: 2.1,
    expense_ratio: 0.65,
    demand: "High",
    competition: "Medium",
    risk: "Low",
    related_businesses: "Coffee Shop,Bakery,Tea Shop"
  };
}

export function getBusinessesByNames(names) {
  const businesses = [];
  if (Array.isArray(names)) {
    for (const n of names) {
      if (typeof n === "string" && n.trim()) {
        const b = getBusinessByName(n.trim());
        if (b) {
          businesses.push(b);
        }
      }
    }
  }
  return businesses;
}
