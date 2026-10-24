export const HIGH_OPPORTUNITY_CITIES = [
  "mumbai",
  "pune",
  "bangalore",
  "delhi",
  "hyderabad",
  "chennai"
];

function titleCase(str) {
  return (str || "").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

export function analyzeLocation(location) {
  const locLower = (location || "").toLowerCase().trim();
  const formattedLoc = titleCase(locLower);

  if (HIGH_OPPORTUNITY_CITIES.includes(locLower)) {
    return {
      score: 20,
      message: `${formattedLoc} is a high-opportunity city.`
    };
  }

  return {
    score: 15,
    message: `${formattedLoc} has moderate business opportunities.`
  };
}
