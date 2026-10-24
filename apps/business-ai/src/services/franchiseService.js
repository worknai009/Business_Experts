/**
 * franchiseService.js
 * Verified Indian Franchise Brands & Equipment/Raw Material Supplier Directory
 */

export const FRANCHISE_SUPPLIERS = [
  // ── QSR & Food / Beverages ──
  {
    id: "fran-1",
    name: "Chai Point Express Kiosk",
    category: "QSR & Beverages",
    type: "Franchise Brand",
    investment: 350000,
    investmentFormatted: "₹3.5 Lakhs",
    minSpaceSqFt: 120,
    royaltyModel: "0% Royalty (Supply Markup Only)",
    estMonthlyProfit: 68000,
    estRoi: "233%",
    paybackMonths: 5.2,
    verified: true,
    rating: 4.9,
    description: "Turnkey automated tea dispenser kiosk with proprietary tea leaves, snacks supply chain, and digital billing.",
    supportProvided: ["Complete Machine & Kiosk Setup", "Daily Raw Material Supply", "Staff Training & POS Billing"],
    contactPerson: "Aditya Sharma (Franchise Head)",
    phone: "+91 98230 44120",
    email: "franchise@chaipointexpress.in"
  },
  {
    id: "fran-2",
    name: "MBA Chai Wala Lounge & Bites",
    category: "QSR & Beverages",
    type: "Franchise Brand",
    investment: 750000,
    investmentFormatted: "₹7.5 Lakhs",
    minSpaceSqFt: 350,
    royaltyModel: "4% of Gross Sales",
    estMonthlyProfit: 125000,
    estRoi: "200%",
    paybackMonths: 6.0,
    verified: true,
    rating: 4.8,
    description: "Iconic youth-centric tea cafe lounge featuring fusion snacks, mocktails, and social seating layout.",
    supportProvided: ["Architectural Layout & Interior 3D Design", "Exclusive Spice Blends Supply", "Marketing & PR Launch Campaign"],
    contactPerson: "Rahul Verma (Partner Network)",
    phone: "+91 97110 88234",
    email: "partner@mbachaiwala.com"
  },
  {
    id: "fran-3",
    name: "WOW! Momo & Rolls Cloud Pod",
    category: "QSR & Fast Food",
    type: "Cloud Kitchen / Franchise",
    investment: 600000,
    investmentFormatted: "₹6.0 Lakhs",
    minSpaceSqFt: 200,
    royaltyModel: "5% Monthly Royalty",
    estMonthlyProfit: 110000,
    estRoi: "220%",
    paybackMonths: 5.5,
    verified: true,
    rating: 4.9,
    description: "Compact delivery-focused cloud kitchen and take-away counter offering high-margin frozen momos and appetizers.",
    supportProvided: ["Blast Freezers & Steamer Setup", "Daily Frozen Stock Delivery", "Zomato / Swiggy Onboarding & Top-Placement"],
    contactPerson: "Siddharth Roy (Expansion Manager)",
    phone: "+91 98450 33910",
    email: "cloud@wowmomos.com"
  },
  {
    id: "fran-4",
    name: "Waffle Bites & Shake Bar",
    category: "Desserts & Bakery",
    type: "Franchise Brand",
    investment: 450000,
    investmentFormatted: "₹4.5 Lakhs",
    minSpaceSqFt: 150,
    royaltyModel: "Fixed ₹5,000 / mo",
    estMonthlyProfit: 85000,
    estRoi: "226%",
    paybackMonths: 5.3,
    verified: true,
    rating: 4.7,
    description: "High-margin dessert concept with stick waffles, thick shakes, and bubble tea designed for high student footfall.",
    supportProvided: ["Commercial Waffle Makers & Mixers", "Proprietary Batter Premixes & Chocolate Spreads", "Social Media Launch Kit"],
    contactPerson: "Kavita Nair (Franchise Lead)",
    phone: "+91 99201 55670",
    email: "grow@wafflebites.in"
  },

  // ── Pet Care & Specialty Services ──
  {
    id: "fran-5",
    name: "PetSpa On Wheels (Mobile Van Setup)",
    category: "Pet Care & Services",
    type: "Turnkey Supplier / Business Model",
    investment: 850000,
    investmentFormatted: "₹8.5 Lakhs",
    minSpaceSqFt: 0, // Mobile Van
    royaltyModel: "0% Royalty (100% Owner Kept)",
    estMonthlyProfit: 160000,
    estRoi: "225%",
    paybackMonths: 5.3,
    verified: true,
    rating: 4.9,
    description: "Fully customized Maruti Eeco / Tata Winger van fitted with hydro-bath tub, high-velocity dryer, and grooming tools.",
    supportProvided: ["Complete Certified Van Fabrication", "Groomer Professional Certification (14 Days)", "Pet Parent Lead Generation App"],
    contactPerson: "Vikram Mehta (Mobility Architect)",
    phone: "+91 98860 12340",
    email: "support@petspaonwheels.com"
  },
  {
    id: "fran-6",
    name: "Pawsome Pets Nutrition & Pharmacy",
    category: "Pet Care & Services",
    type: "Franchise Store",
    investment: 500000,
    investmentFormatted: "₹5.0 Lakhs",
    minSpaceSqFt: 250,
    royaltyModel: "0% Royalty (Direct Wholesale Discount)",
    estMonthlyProfit: 95000,
    estRoi: "228%",
    paybackMonths: 5.2,
    verified: true,
    rating: 4.8,
    description: "Curated pet food, premium supplements, accessories, and veterinary medication retail counter with repeat subscriptions.",
    supportProvided: ["Direct Brand Dealerships (Royal Canin, Pedigree, Farmina)", "Billing Software & Barcode System", "Veterinarian Tele-Consult Integration"],
    contactPerson: "Ananya Deshmukh",
    phone: "+91 98220 77190",
    email: "partners@pawsomepets.in"
  },

  // ── EV Mobility & Clean Energy ──
  {
    id: "fran-7",
    name: "VoltSpeed 2W/3W EV Battery Swap Point",
    category: "EV & Green Tech",
    type: "Franchise / Infrastructure Partner",
    investment: 400000,
    investmentFormatted: "₹4.0 Lakhs",
    minSpaceSqFt: 80,
    royaltyModel: "₹8 per battery swap revenue share",
    estMonthlyProfit: 75000,
    estRoi: "225%",
    paybackMonths: 5.3,
    verified: true,
    rating: 4.9,
    description: "Compact 12-slot automated EV battery swapping kiosk serving delivery riders, bike taxis, and e-rickshaws.",
    supportProvided: ["Smart IoT Battery Swapping Cabinet", "12 Fast-Charge Li-Ion Batteries", "Zomato/Swiggy Delivery Fleet Agreement"],
    contactPerson: "Prashant Kulkarni (EV Partnerships)",
    phone: "+91 97660 34820",
    email: "partner@voltspeed.io"
  },
  {
    id: "fran-8",
    name: "ChargeGrid Ultra Fast EV Station",
    category: "EV & Green Tech",
    type: "Commercial Supplier",
    investment: 1200000,
    investmentFormatted: "₹12.0 Lakhs",
    minSpaceSqFt: 500,
    royaltyModel: "10% Platform Fee",
    estMonthlyProfit: 190000,
    estRoi: "190%",
    paybackMonths: 6.3,
    verified: true,
    rating: 4.8,
    description: "Dual-gun 60kW DC fast charger for electric cars and commercial fleets with automated QR pay & mobile app.",
    supportProvided: ["Discom Electricity Load Approval Support", "60kW CCS2 DC Fast Charger Hardware", "24/7 Remote Monitoring & Cloud Billing"],
    contactPerson: "Manish Singhal",
    phone: "+91 98110 44550",
    email: "ev@chargegridindia.com"
  },

  // ── Fitness & Wellness ──
  {
    id: "fran-9",
    name: "IronCore 24/7 Smart Micro-Gym",
    category: "Fitness & Wellness",
    type: "Franchise Gym Network",
    investment: 1500000,
    investmentFormatted: "₹15.0 Lakhs",
    minSpaceSqFt: 1200,
    royaltyModel: "Fixed ₹12,000 / mo",
    estMonthlyProfit: 240000,
    estRoi: "192%",
    paybackMonths: 6.2,
    verified: true,
    rating: 4.9,
    description: "Keyless RFID entry 24/7 neighborhood smart gym with commercial biomechanic strength equipment and trainer apps.",
    supportProvided: ["Complete Heavy-Duty Commercial Gym Equipment Set", "Biometric Turnstile & Member Access App", "Trainer Certification & Member Presale Campaign"],
    contactPerson: "Samir Khan (Fitness Director)",
    phone: "+91 98900 11223",
    email: "franchise@ironcoregyms.com"
  },
  {
    id: "fran-10",
    name: "Nirvana Reformer Pilates & Yoga Hub",
    category: "Fitness & Wellness",
    type: "Boutique Studio Franchise",
    investment: 900000,
    investmentFormatted: "₹9.0 Lakhs",
    minSpaceSqFt: 600,
    royaltyModel: "5% of Monthly Subscriptions",
    estMonthlyProfit: 170000,
    estRoi: "226%",
    paybackMonths: 5.3,
    verified: true,
    rating: 4.8,
    description: "High-ticket boutique reformer pilates and aerial yoga studio commanding ₹4,000–₹8,000 monthly membership fees.",
    supportProvided: ["4x Commercial Wood Reformer Beds", "Certified Master Trainer Training Module", "Online Booking & Class Scheduling App"],
    contactPerson: "Radhika Sen",
    phone: "+91 98330 99401",
    email: "partner@nirvanapilates.in"
  },

  // ── Retail, Grocery & Laundry ──
  {
    id: "fran-11",
    name: "FreshKart Organic Micro-Supermarket",
    category: "Retail & Grocery",
    type: "Franchise Network",
    investment: 800000,
    investmentFormatted: "₹8.0 Lakhs",
    minSpaceSqFt: 400,
    royaltyModel: "0% Royalty (Direct Margin)",
    estMonthlyProfit: 145000,
    estRoi: "217%",
    paybackMonths: 5.5,
    verified: true,
    rating: 4.8,
    description: "Neighborhood chemical-free produce, A2 milk, cold-pressed oils, and artisanal pantry store with WhatsApp home delivery.",
    supportProvided: ["Racks, Chillers & POS Barcode Billing Setup", "Daily Morning Farm-to-Store Supply Line", "Local WhatsApp Broadcast Ordering Bot"],
    contactPerson: "Ganesh Patil",
    phone: "+91 98224 88301",
    email: "franchise@freshkartorganic.com"
  },
  {
    id: "fran-12",
    name: "SpeedWash Smart Laundromat & Dry Clean",
    category: "Services & Laundry",
    type: "Turnkey Equipment Supplier",
    investment: 650000,
    investmentFormatted: "₹6.5 Lakhs",
    minSpaceSqFt: 250,
    royaltyModel: "0% Royalty (100% Owned)",
    estMonthlyProfit: 115000,
    estRoi: "212%",
    paybackMonths: 5.6,
    verified: true,
    rating: 4.7,
    description: "Commercial stackable coin/QR washers and dryers for students, bachelors, and residential societies with pickup service.",
    supportProvided: ["3x Commercial SpeedQueen Washers & Dryers", "Plumbing & Steam Boiler Installation", "Delivery Rider & Counter Booking Software"],
    contactPerson: "Deepak Choudhary",
    phone: "+91 98401 22980",
    email: "sales@speedwashindia.com"
  }
];

export function getFranchises(filter = {}) {
  let list = [...FRANCHISE_SUPPLIERS];

  if (filter.category && filter.category !== "All") {
    list = list.filter(f => f.category.toLowerCase().includes(filter.category.toLowerCase()));
  }

  if (filter.maxInvestment) {
    list = list.filter(f => f.investment <= filter.maxInvestment);
  }

  if (filter.searchQuery) {
    const q = filter.searchQuery.toLowerCase();
    list = list.filter(f => 
      f.name.toLowerCase().includes(q) || 
      f.category.toLowerCase().includes(q) || 
      f.description.toLowerCase().includes(q)
    );
  }

  return list;
}

export function saveFranchiseInquiry(inquiry) {
  const saved = JSON.parse(localStorage.getItem('franchise_inquiries') || '[]');
  const newInquiry = {
    ...inquiry,
    id: `inq-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    status: 'Confirmed'
  };
  saved.unshift(newInquiry);
  localStorage.setItem('franchise_inquiries', JSON.stringify(saved));
  return newInquiry;
}
