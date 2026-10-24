/**
 * pincodeData.js
 * Comprehensive hyper-local demographic, footfall, and competitor density data for top Indian business pincodes,
 * with deterministic procedural fallback for any 6-digit Indian PIN code.
 */

export const PINCODE_DATABASE = {
  // ── Pune ──
  "411038": {
    pincode: "411038",
    locality: "Kothrud & Paud Road",
    city: "Pune",
    state: "Maharashtra",
    footfallScore: 92,
    footfallLevel: "Very High",
    commercialSplit: 45,
    residentialSplit: 55,
    medianIncomeTier: "Upper Middle Class",
    avgMonthlyHouseholdSpend: "₹48,000",
    competitorDensityPerKm2: "Medium-High",
    topUnderservedGaps: ["Specialty Health & Diet Cafes", "Mobile Pet Grooming", "Quick EV 2-Wheeler Hubs"],
    bestFitBusinesses: ["Specialty Tea & Bakery", "Co-working Micro Lounge", "Organic Grocery Retail", "Cloud Kitchen Hub"],
    commercialRentRangePerSqFt: "₹90 – ₹160 / sq.ft",
    targetConsumerAgeBracket: "18 – 45 yrs"
  },
  "411057": {
    pincode: "411057",
    locality: "Hinjawadi IT Park Phase 1-3",
    city: "Pune",
    state: "Maharashtra",
    footfallScore: 96,
    footfallLevel: "Extremely High (Peak Evenings)",
    commercialSplit: 65,
    residentialSplit: 35,
    medianIncomeTier: "High Disposable Income (Tech Workforce)",
    avgMonthlyHouseholdSpend: "₹65,000",
    competitorDensityPerKm2: "High (QSR & Chai)",
    topUnderservedGaps: ["Late-Night Healthy Meal Delivery", "24/7 Co-working & Fitness", "Automated Laundry Express"],
    bestFitBusinesses: ["Cloud Kitchen", "Executive Gym & CrossFit", "Express QSR & Juice Bar", "EV Charging Station"],
    commercialRentRangePerSqFt: "₹110 – ₹210 / sq.ft",
    targetConsumerAgeBracket: "22 – 38 yrs"
  },
  "411004": {
    pincode: "411004",
    locality: "Deccan Gymkhana & FC Road",
    city: "Pune",
    state: "Maharashtra",
    footfallScore: 95,
    footfallLevel: "Extremely High (Student & Shopper Traffic)",
    commercialSplit: 70,
    residentialSplit: 30,
    medianIncomeTier: "Upper Middle Class & Youth",
    avgMonthlyHouseholdSpend: "₹52,000",
    competitorDensityPerKm2: "High",
    topUnderservedGaps: ["Budget Artisan Coffee", "Self-Service Study Workspaces", "Fast-Fashion Accessories"],
    bestFitBusinesses: ["Boba & Artisan Beverages", "Book Cafe / Creator Space", "Pocket Waffles & Street Bites"],
    commercialRentRangePerSqFt: "₹140 – ₹280 / sq.ft",
    targetConsumerAgeBracket: "16 – 32 yrs"
  },
  "411014": {
    pincode: "411014",
    locality: "Viman Nagar & Airport Road",
    city: "Pune",
    state: "Maharashtra",
    footfallScore: 94,
    footfallLevel: "Very High",
    commercialSplit: 55,
    residentialSplit: 45,
    medianIncomeTier: "High Income & Expats",
    avgMonthlyHouseholdSpend: "₹72,000",
    competitorDensityPerKm2: "Medium-High",
    topUnderservedGaps: ["Pet Daycare & Spa", "Artisan Sourdough Bakery", "Boutique Pilates / Yoga"],
    bestFitBusinesses: ["Specialty Pet Salon", "Continental Micro-Bistro", "Gourmet Dessert Lounge"],
    commercialRentRangePerSqFt: "₹120 – ₹240 / sq.ft",
    targetConsumerAgeBracket: "24 – 42 yrs"
  },

  // ── Mumbai ──
  "400050": {
    pincode: "400050",
    locality: "Bandra West & Linking Road",
    city: "Mumbai",
    state: "Maharashtra",
    footfallScore: 98,
    footfallLevel: "Ultra High",
    commercialSplit: 60,
    residentialSplit: 40,
    medianIncomeTier: "Affluent / High Net Worth",
    avgMonthlyHouseholdSpend: "₹1,20,000",
    competitorDensityPerKm2: "Very High",
    topUnderservedGaps: ["Organic Clean-Label Bakery", "Personalized Wellness & Cryo Therapy", "Luxury Pet Boarding"],
    bestFitBusinesses: ["Boutique Specialty Cafe", "Luxury Pet Care", "Health & Cold-Pressed Juicery", "Curated Fashion Kiosk"],
    commercialRentRangePerSqFt: "₹250 – ₹600 / sq.ft",
    targetConsumerAgeBracket: "20 – 50 yrs"
  },
  "400001": {
    pincode: "400001",
    locality: "Fort & Colaba Commercial District",
    city: "Mumbai",
    state: "Maharashtra",
    footfallScore: 90,
    footfallLevel: "Very High (Corporate Weekday)",
    commercialSplit: 80,
    residentialSplit: 20,
    medianIncomeTier: "Corporate & Professional",
    avgMonthlyHouseholdSpend: "₹85,000",
    competitorDensityPerKm2: "High",
    topUnderservedGaps: ["Corporate Subscription Meal Prep", "Grab & Go Salads & Protein Bowls", "Document Express Hub"],
    bestFitBusinesses: ["Express Business Lunch QSR", "Executive Coffee Roaster", "Corporate Catering"],
    commercialRentRangePerSqFt: "₹200 – ₹450 / sq.ft",
    targetConsumerAgeBracket: "25 – 60 yrs"
  },
  "400076": {
    pincode: "400076",
    locality: "Powai & Hiranandani Gardens",
    city: "Mumbai",
    state: "Maharashtra",
    footfallScore: 91,
    footfallLevel: "High (Affluent Gated Communities)",
    commercialSplit: 50,
    residentialSplit: 50,
    medianIncomeTier: "High Disposable Income",
    avgMonthlyHouseholdSpend: "₹95,000",
    competitorDensityPerKm2: "Medium",
    topUnderservedGaps: ["High-End EV Charging Stations", "Child Activity & STEM Hubs", "Artisan Cheese & Charcuterie"],
    bestFitBusinesses: ["Specialty Gym Studio", "Premium Bakery & Desserts", "Pet Care & Dog Park"],
    commercialRentRangePerSqFt: "₹130 – ₹280 / sq.ft",
    targetConsumerAgeBracket: "26 – 48 yrs"
  },

  // ── Bangalore ──
  "560034": {
    pincode: "560034",
    locality: "Koramangala 4th-7th Block",
    city: "Bangalore",
    state: "Karnataka",
    footfallScore: 97,
    footfallLevel: "Ultra High",
    commercialSplit: 65,
    residentialSplit: 35,
    medianIncomeTier: "High Income Startup & Tech Founders",
    avgMonthlyHouseholdSpend: "₹88,000",
    competitorDensityPerKm2: "High",
    topUnderservedGaps: ["Late-night Founder Cafes with High-Speed WiFi", "Healthy Meal Plans", "Direct Rooftop Workspaces"],
    bestFitBusinesses: ["Specialty Coffee & Roastery", "Cloud Kitchen Hub", "EV Fleet Charging", "Boutique Fitness Hub"],
    commercialRentRangePerSqFt: "₹140 – ₹320 / sq.ft",
    targetConsumerAgeBracket: "21 – 40 yrs"
  },
  "560038": {
    pincode: "560038",
    locality: "Indiranagar 100ft & 12th Main",
    city: "Bangalore",
    state: "Karnataka",
    footfallScore: 96,
    footfallLevel: "Ultra High",
    commercialSplit: 60,
    residentialSplit: 40,
    medianIncomeTier: "Affluent / High Disposable Spend",
    avgMonthlyHouseholdSpend: "₹1,05,000",
    competitorDensityPerKm2: "High",
    topUnderservedGaps: ["Specialty Pet Salon & Spa", "Plant-based Artisanal Dining", "Express Reformer Pilates"],
    bestFitBusinesses: ["Micro-Brewery Partner", "Pet Grooming & Bakery", "Cold-Brew Bar & Pastry Kiosk"],
    commercialRentRangePerSqFt: "₹160 – ₹350 / sq.ft",
    targetConsumerAgeBracket: "22 – 45 yrs"
  },
  "560100": {
    pincode: "560100",
    locality: "Electronic City Phase 1 & 2",
    city: "Bangalore",
    state: "Karnataka",
    footfallScore: 89,
    footfallLevel: "High (Shift & Tech Hours)",
    commercialSplit: 60,
    residentialSplit: 40,
    medianIncomeTier: "Middle to Upper-Middle Income",
    avgMonthlyHouseholdSpend: "₹50,000",
    competitorDensityPerKm2: "Medium",
    topUnderservedGaps: ["Affordable Clean Dining Options", "24-Hour Delivery Services", "EV 2W Battery Swapping"],
    bestFitBusinesses: ["Micro-Franchise Chai & Snacks", "Cloud Kitchen Network", "EV Swap Station"],
    commercialRentRangePerSqFt: "₹65 – ₹130 / sq.ft",
    targetConsumerAgeBracket: "22 – 36 yrs"
  },

  // ── Delhi NCR ──
  "110001": {
    pincode: "110001",
    locality: "Connaught Place (CP) & Central Delhi",
    city: "Delhi NCR",
    state: "Delhi",
    footfallScore: 98,
    footfallLevel: "Ultra High",
    commercialSplit: 85,
    residentialSplit: 15,
    medianIncomeTier: "High Income & Tourists",
    avgMonthlyHouseholdSpend: "₹90,000",
    competitorDensityPerKm2: "Very High",
    topUnderservedGaps: ["Fast Grab & Go Healthy Breakfasts", "Luggage & Transit Lockers", "Boutique Souvenir / Artisan Tea"],
    bestFitBusinesses: ["Heritage Cafe / Tea Salon", "Quick QSR Roll & Kebab Outlet", "Premium Co-working"],
    commercialRentRangePerSqFt: "₹250 – ₹550 / sq.ft",
    targetConsumerAgeBracket: "18 – 55 yrs"
  },
  "122002": {
    pincode: "122002",
    locality: "DLF Phase 1-2 & Golf Course Road",
    city: "Gurgaon",
    state: "Haryana",
    footfallScore: 95,
    footfallLevel: "Very High",
    commercialSplit: 55,
    residentialSplit: 45,
    medianIncomeTier: "Affluent / Ultra High",
    avgMonthlyHouseholdSpend: "₹1,40,000",
    competitorDensityPerKm2: "Medium-High",
    topUnderservedGaps: ["Grooming on Wheels / Mobile Pet Spa", "Gourmet Cheese & Bakery", "Home Automation & EV"],
    bestFitBusinesses: ["Luxury Pet Spa & Grooming", "Premium Coffee & Bistro", "Pilates & Strength Studio"],
    commercialRentRangePerSqFt: "₹150 – ₹380 / sq.ft",
    targetConsumerAgeBracket: "25 – 52 yrs"
  },

  // ── Hyderabad ──
  "500081": {
    pincode: "500081",
    locality: "HITEC City & Madhapur",
    city: "Hyderabad",
    state: "Telangana",
    footfallScore: 96,
    footfallLevel: "Ultra High",
    commercialSplit: 70,
    residentialSplit: 30,
    medianIncomeTier: "Upper Middle to High (Tech Corridor)",
    avgMonthlyHouseholdSpend: "₹62,000",
    competitorDensityPerKm2: "High",
    topUnderservedGaps: ["24-Hour Cloud Kitchens", "EV 2W Battery Swapping Hubs", "Specialty Healthy Breakfast QSR"],
    bestFitBusinesses: ["Specialty Irani Chai & Snack Bar", "Cloud Kitchen", "EV Charging & Fleet Hub", "Gym & Supplement Store"],
    commercialRentRangePerSqFt: "₹80 – ₹180 / sq.ft",
    targetConsumerAgeBracket: "21 – 38 yrs"
  },
  "500034": {
    pincode: "500034",
    locality: "Banjara Hills Road No 1-12",
    city: "Hyderabad",
    state: "Telangana",
    footfallScore: 93,
    footfallLevel: "Very High",
    commercialSplit: 50,
    residentialSplit: 50,
    medianIncomeTier: "Affluent / High Net Worth",
    avgMonthlyHouseholdSpend: "₹1,10,000",
    competitorDensityPerKm2: "Medium",
    topUnderservedGaps: ["Mobile Pet Grooming Van", "Organic Beauty & Wellness Clinic", "Specialty Coffee Roasters"],
    bestFitBusinesses: ["Luxury Pet Boutique", "Artisan Bakery & Cafe", "Premium Spa & Aesthetics"],
    commercialRentRangePerSqFt: "₹120 – ₹280 / sq.ft",
    targetConsumerAgeBracket: "24 – 55 yrs"
  },

  // ── Chennai ──
  "600028": {
    pincode: "600028",
    locality: "R.A. Puram & MRC Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    footfallScore: 89,
    footfallLevel: "High",
    commercialSplit: 40,
    residentialSplit: 60,
    medianIncomeTier: "Upper Middle Class",
    avgMonthlyHouseholdSpend: "₹58,000",
    competitorDensityPerKm2: "Medium",
    topUnderservedGaps: ["Filter Coffee & Tiffin Micro-Kiosks", "Pet Care & Veterinary Support", "Senior Citizen Wellness"],
    bestFitBusinesses: ["Traditional & Modern Filter Coffee Bar", "Health & Wellness Studio", "Organic Produce Store"],
    commercialRentRangePerSqFt: "₹75 – ₹160 / sq.ft",
    targetConsumerAgeBracket: "25 – 60 yrs"
  }
};

/**
 * Procedural fallback demographic generator for any other 6-digit Indian PIN code.
 */
export function getPincodeIntelligence(pincodeInput, cityName = "") {
  if (!pincodeInput) return null;
  const pin = String(pincodeInput).replace(/\D/g, '').slice(0, 6);
  if (pin.length < 6) return null;

  if (PINCODE_DATABASE[pin]) {
    return PINCODE_DATABASE[pin];
  }

  // Deterministic procedural generation based on PIN code numbers
  const seed = pin.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  const footfall = Math.min(95, Math.max(68, 70 + (seed % 25)));
  const commSplit = 30 + (seed % 35);
  const resSplit = 100 - commSplit;
  
  const incomeTiers = ["Middle Income Cluster", "Upper-Middle Class", "Emerging Urban Hub", "Commercial Market Hub"];
  const selectedTier = incomeTiers[seed % incomeTiers.length];
  const avgSpend = `₹${Math.round(28000 + (seed * 850)).toLocaleString('en-IN')}`;

  const gapPool = [
    "Organized Quick Service Food (QSR)",
    "Hygienic Tea & Snack Micro-Kiosk",
    "Doorstep Pet Grooming & Supplies",
    "24/7 Cloud Kitchen Food Delivery",
    "EV 2-Wheeler Battery Swap Kiosk",
    "Fitness & Strength Training Studio",
    "Organic & Farm Fresh Grocery Retail",
    "Express Laundry & Dry Cleaning"
  ];

  const gaps = [
    gapPool[seed % gapPool.length],
    gapPool[(seed + 2) % gapPool.length],
    gapPool[(seed + 4) % gapPool.length],
  ];

  const rentMin = 45 + (seed % 30);
  const rentMax = rentMin + 40 + (seed % 50);

  return {
    pincode: pin,
    locality: `Postal Cluster ${pin} (${cityName || "Local Area"})`,
    city: cityName || "Regional Hub",
    state: "India",
    footfallScore: footfall,
    footfallLevel: footfall >= 85 ? "High Footfall" : "Moderate-to-High",
    commercialSplit: commSplit,
    residentialSplit: resSplit,
    medianIncomeTier: selectedTier,
    avgMonthlyHouseholdSpend: avgSpend,
    competitorDensityPerKm2: footfall >= 85 ? "Moderate-High" : "Low-Moderate",
    topUnderservedGaps: gaps,
    bestFitBusinesses: [
      "Specialty Tea & Refreshment Kiosk",
      "Express Retail / Grocery Hub",
      "Cloud Kitchen Delivery Point",
      "EV & Mobility Support Point"
    ],
    commercialRentRangePerSqFt: `₹${rentMin} – ₹${rentMax} / sq.ft`,
    targetConsumerAgeBracket: "18 – 48 yrs"
  };
}
