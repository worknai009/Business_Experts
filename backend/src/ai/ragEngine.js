export const GOVERNMENT_SCHEMES_DB = [
  {
    title: "Prime Minister Employment Generation Programme (PMEGP)",
    max_subsidy: "Up to ₹25 Lakhs (35% capital subsidy for rural area)",
    eligibility: "First-time entrepreneurs, age 18+, MSME manufacturing or service ventures.",
    link: "https://kviconline.gov.in"
  },
  {
    title: "MUDRA Loan Scheme (Kishor / Tarun)",
    max_subsidy: "Collateral-free business credit up to ₹10 Lakhs",
    eligibility: "Small business enterprises, vendors, traders, food service operators.",
    link: "https://www.mudra.org.in"
  },
  {
    title: "Stand-Up India Scheme",
    max_subsidy: "Bank loans from ₹10 Lakhs to ₹1 Crore",
    eligibility: "Women entrepreneurs or SC/ST founders setting up greenfield units.",
    link: "https://www.standupmitra.in"
  }
];

export const MARKET_INSIGHTS_DB = [
  {
    id: 1,
    title: "Rising Demand for Cloud Kitchens in Tier 1 & Tier 2 Cities",
    category: "Food & Beverage",
    growth: "+24% YoY",
    summary: "Online food delivery adoption is creating high-margin opportunities for low-rent cloud kitchens with lower initial capex.",
    recommended_cities: ["Mumbai", "Pune", "Bangalore", "Delhi", "Hyderabad"]
  },
  {
    id: 2,
    title: "Electronics & Mobile Repair Services Surge in Commercial Hubs",
    category: "Services & Repair",
    growth: "+18% YoY",
    summary: "High device ownership combined with rising refurbishment demand makes local repair hubs low-risk, high-ROI ventures.",
    recommended_cities: ["Pune", "Bangalore", "Hyderabad", "Delhi"]
  },
  {
    id: 3,
    title: "Specialty Coffee Shops Outperforming Traditional Cafes",
    category: "Food & Beverage",
    growth: "+31% YoY",
    summary: "Young professionals favor premium artisanal coffee and comfortable working ambiances in tech hubs.",
    recommended_cities: ["Bangalore", "Mumbai", "Pune", "Hyderabad"]
  }
];

export function retrieveRagContext(business = "", location = "") {
  const businessLower = (business || "").toLowerCase();
  const locationLower = (location || "").toLowerCase();

  const relevantSchemes = GOVERNMENT_SCHEMES_DB;
  let relevantInsights = MARKET_INSIGHTS_DB.filter(
    (item) =>
      item.recommended_cities.some((c) => locationLower.includes(c.toLowerCase())) ||
      businessLower.includes(item.category.toLowerCase())
  );

  if (relevantInsights.length === 0) {
    relevantInsights = MARKET_INSIGHTS_DB.slice(0, 2);
  }

  return {
    schemes: relevantSchemes,
    insights: relevantInsights
  };
}
