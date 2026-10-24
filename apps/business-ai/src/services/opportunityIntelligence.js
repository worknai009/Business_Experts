/**
 * Opportunity Intelligence Engine
 * Provides realistic Indian MSME unit economics, domain classification,
 * and hyper-personalized better business opportunity recommendations.
 */

const CITY_TIERS = {
  tier1: ['mumbai', 'delhi', 'new delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'kolkata', 'pune', 'ahmedabad', 'gurgaon', 'gurugram', 'noida'],
  tier2: ['jaipur', 'surat', 'lucknow', 'kanpur', 'nagpur', 'indore', 'bhopal', 'patna', 'vadodara', 'coimbatore', 'ludhiana', 'agra', 'nashik', 'varanasi', 'aurangabad', 'ranchi', 'guwahati', 'mysore', 'jodhpur', 'chandigarh', 'kochi', 'vizag', 'visakhapatnam']
};

export function getCityMultiplier(location = '') {
  const loc = (location || '').toLowerCase().trim();
  if (CITY_TIERS.tier1.some(c => loc.includes(c))) return { multiplier: 1.15, tier: 'Tier-1 Metro', rentFactor: 1.3 };
  if (CITY_TIERS.tier2.some(c => loc.includes(c))) return { multiplier: 1.05, tier: 'Tier-2 City', rentFactor: 1.0 };
  return { multiplier: 0.95, tier: 'Tier-3 / Regional Hub', rentFactor: 0.75 };
}

export function classifyBusinessDomain(businessName = '') {
  const b = (businessName || '').toLowerCase().trim();

  if (/(tea|chai|coffee|cafe|bakery|cake|sweet|juice|smoothie|food|kitchen|tiffin|restaurant|shawarma|burger|pizza|momo|chaat|pani puri|snack|catering|ice cream|biryani|dosa|fast food)/.test(b)) {
    return 'food_dining';
  }
  if (/(pet|dog|cat|grooming|vet|animal|puppy|aquarium)/.test(b)) {
    return 'pet_care';
  }
  if (/(gym|fitness|yoga|pilates|crossfit|workout|sports|turf|boxing|martial arts|swimming)/.test(b)) {
    return 'fitness_sports';
  }
  if (/(salon|parlour|spa|beauty|makeup|hair|nail|skin|cosmetic|barber|aesthetic)/.test(b)) {
    return 'beauty_wellness';
  }
  if (/(clinic|pharmacy|medical|dental|doctor|diagnostic|pathology|ayurveda|physiotherapy|hospital|nursing|health)/.test(b)) {
    return 'healthcare_medical';
  }
  if (/(agency|marketing|digital|tech|software|saas|ai|app|website|seo|consulting|it service|design|media)/.test(b)) {
    return 'tech_agency';
  }
  if (/(cloth|apparel|fashion|boutique|garment|shoe|footwear|jewel|bag|accessory|retail|dress)/.test(b)) {
    return 'fashion_retail';
  }
  if (/(grocery|supermarket|organic|fruit|vegetable|dry fruit|spices|mart|kirana)/.test(b)) {
    return 'grocery_organic';
  }
  if (/(car|bike|automobile|auto|vehicle|ev|electric|charging|wash|detailing|mechanic|garage|tyre|spare)/.test(b)) {
    return 'automotive_ev';
  }
  if (/(coaching|tuition|school|education|academy|institute|class|daycare|kids|preschool|training|ielts|coding)/.test(b)) {
    return 'education_skills';
  }
  if (/(logistics|courier|delivery|transport|warehouse|storage|freight|pack|fulfillment)/.test(b)) {
    return 'logistics_supply';
  }
  if (/(solar|renewable|green|bio|waste|recycle|plant|energy|water|packaging|manufacturing|factory)/.test(b)) {
    return 'green_energy_mfg';
  }
  if (/(coworking|real estate|property|interior|furniture|cleaning|pest|security|laundry|dry clean|event)/.test(b)) {
    return 'services_real_estate';
  }
  return 'general_venture';
}

export function generateSmartOpportunities(businessName, location, budget) {
  const bgt = Math.max(Number(budget) || 500000, 25000);
  const domain = classifyBusinessDomain(businessName);
  const cityInfo = getCityMultiplier(location);
  const title = (businessName || 'Business').replace(/\b\w/g, l => l.toUpperCase());

  const catalog = {
    food_dining: [
      {
        name: 'Multi-Brand Cloud Kitchen Hub',
        category: 'Food & Beverage',
        invRatio: 0.65,
        revRatio: 0.38,
        margin: 0.32,
        demand: 'High',
        competition: 'Medium',
        risk: 'Low',
        score: 93,
        why_recommended: `Eliminates expensive prime high-street commercial rent in ${location}. Focuses 100% of capital on high-margin delivery orders on Swiggy & Zomato.`
      },
      {
        name: 'Specialty Chai & Gourmet Samosa Cafe',
        category: 'QSR & Beverage',
        invRatio: 0.45,
        revRatio: 0.32,
        margin: 0.42,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 95,
        why_recommended: `Beverages carry 65%+ gross margins. High daily ticket frequency near office parks and colleges in ${location}.`
      },
      {
        name: 'Cold-Pressed Juice & Protein Smoothie Bar',
        category: 'Healthy Living & QSR',
        invRatio: 0.50,
        revRatio: 0.30,
        margin: 0.38,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 90,
        why_recommended: `Boasts rising demand from health-conscious urban professionals. Low cooking equipment capex and rapid 8-month payback.`
      },
      {
        name: 'Artisanal Dessert & Bakery Kiosk',
        category: 'Bakery & Confectionery',
        invRatio: 0.70,
        revRatio: 0.35,
        margin: 0.35,
        demand: 'High',
        competition: 'Medium',
        risk: 'Low',
        score: 88,
        why_recommended: `High Average Order Value (AOV) on festive and celebration gifting cakes with central commissary distribution.`
      }
    ],

    pet_care: [
      {
        name: 'Mobile Doorstep Pet Spa & Grooming Van',
        category: 'Pet Care Services',
        invRatio: 0.60,
        revRatio: 0.34,
        margin: 0.44,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 96,
        why_recommended: `Zero fixed store rental cost. Commands premium ₹1,500–₹3,000 per session from high-income pet parents in ${location}.`
      },
      {
        name: 'Boutique Pet Daycare & Training Lounge',
        category: 'Pet Hospitality',
        invRatio: 0.75,
        revRatio: 0.36,
        margin: 0.38,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 91,
        why_recommended: `High repeat monthly subscriptions from working corporate pet owners who travel frequently.`
      },
      {
        name: 'Organic Pet Nutrition & Treat D2C Brand',
        category: 'Pet Food & Retail',
        invRatio: 0.40,
        revRatio: 0.28,
        margin: 0.40,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 89,
        why_recommended: `Capitalizes on the humanization of pet nutrition with 50%+ gross margin direct-to-consumer sales.`
      }
    ],

    fitness_sports: [
      {
        name: 'Boutique Functional Strength & HIIT Studio',
        category: 'Health & Fitness',
        invRatio: 0.75,
        revRatio: 0.38,
        margin: 0.42,
        demand: 'High',
        competition: 'Medium',
        risk: 'Low',
        score: 94,
        why_recommended: `Commands 2x higher monthly membership fees than traditional open gyms through small-group trainer-led classes.`
      },
      {
        name: 'Women-Centric Pilates & Yoga Lounge',
        category: 'Wellness & Mind-Body',
        invRatio: 0.55,
        revRatio: 0.32,
        margin: 0.46,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 92,
        why_recommended: `Ultra-high customer retention and community loyalty with low equipment wear-and-tear.`
      },
      {
        name: 'Multi-Sport Box Turf & Box Cricket Arena',
        category: 'Sports Infrastructure',
        invRatio: 0.85,
        revRatio: 0.45,
        margin: 0.55,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 90,
        why_recommended: `Hourly booking model (₹1,000–₹1,800/hr) with virtually zero raw material inventory and massive weekend demand.`
      }
    ],

    beauty_wellness: [
      {
        name: 'Express Hair & Beard Grooming Bar',
        category: 'Personal Care',
        invRatio: 0.50,
        revRatio: 0.35,
        margin: 0.40,
        demand: 'High',
        competition: 'Medium',
        risk: 'Low',
        score: 93,
        why_recommended: `High frequency repeat visits every 2–3 weeks with fast 20-minute client turnaround times.`
      },
      {
        name: 'Clinical Skin Aesthetics & Hydra-Facial Studio',
        category: 'Medical Aesthetics',
        invRatio: 0.70,
        revRatio: 0.40,
        margin: 0.48,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 95,
        why_recommended: `High-ticket treatments (₹2,500–₹8,000 per session) with high customer lifetime value (LTV).`
      },
      {
        name: 'Nail Art Studio & Lash Extension Lounge',
        category: 'Specialty Beauty',
        invRatio: 0.40,
        revRatio: 0.28,
        margin: 0.45,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 89,
        why_recommended: `Compact space requirement (250–400 sq.ft.) and very low raw material consumable cost.`
      }
    ],

    tech_agency: [
      {
        name: 'AI Workflow Automation & CRM Agency',
        category: 'Enterprise Tech & AI',
        invRatio: 0.30,
        revRatio: 0.35,
        margin: 0.52,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 97,
        why_recommended: `Asset-light venture with zero inventory. High monthly retainer contracts (₹50k–₹2L/mo) helping MSMEs automate operations.`
      },
      {
        name: 'E-Commerce Growth & Performance Studio',
        category: 'Digital Marketing',
        invRatio: 0.25,
        revRatio: 0.32,
        margin: 0.48,
        demand: 'High',
        competition: 'Medium',
        risk: 'Low',
        score: 92,
        why_recommended: `Direct revenue-share model with D2C brands scaling on Meta, Google and Amazon.`
      },
      {
        name: 'B2B Cybersecurity & Cloud Architecture Firm',
        category: 'IT Infrastructure',
        invRatio: 0.40,
        revRatio: 0.38,
        margin: 0.50,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 94,
        why_recommended: `Critical compliance requirement for fintech, healthcare, and export companies with high sticky annual contracts.`
      }
    ],

    automotive_ev: [
      {
        name: 'Multi-Brand EV Two-Wheeler Service & Battery Depot',
        category: 'Clean Mobility',
        invRatio: 0.65,
        revRatio: 0.36,
        margin: 0.36,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 95,
        why_recommended: `EV scooter adoption is growing 40%+ YoY in ${location}, but authorized servicing infrastructure is severely underserved.`
      },
      {
        name: 'Ceramic Coating & Paint Protection Film (PPF) Studio',
        category: 'Automotive Care',
        invRatio: 0.70,
        revRatio: 0.42,
        margin: 0.45,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 93,
        why_recommended: `High premium billing ticket (₹25,000–₹90,000 per car) catering to new vehicle owners in ${location}.`
      },
      {
        name: 'Waterless Doorstep Car Detailing Network',
        category: 'On-Demand Automotive',
        invRatio: 0.35,
        revRatio: 0.28,
        margin: 0.48,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 91,
        why_recommended: `App-based monthly subscription model servicing gated residential communities early morning.`
      }
    ],

    healthcare_medical: [
      {
        name: 'Generic Medicine Pharmacy & Diagnostic Collection',
        category: 'Healthcare & Pharma',
        invRatio: 0.60,
        revRatio: 0.40,
        margin: 0.30,
        demand: 'High',
        competition: 'Medium',
        risk: 'Low',
        score: 94,
        why_recommended: `Generic medicines offer 40–60% margins with high consumer demand under government Jan Aushadhi push.`
      },
      {
        name: 'Specialized Physiotherapy & Posture Rehab Clinic',
        category: 'Allied Healthcare',
        invRatio: 0.50,
        revRatio: 0.32,
        margin: 0.45,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 92,
        why_recommended: `High demand from IT professionals for ergonomics and sports injury recovery with minimal recurring overhead.`
      },
      {
        name: 'Dental Care & Clear Aligners Studio',
        category: 'Dental Aesthetics',
        invRatio: 0.80,
        revRatio: 0.42,
        margin: 0.44,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 90,
        why_recommended: `High margin cosmetic orthodontics procedures with bank EMI financing options for patients.`
      }
    ],

    education_skills: [
      {
        name: 'STEM Robotics & AI Coding Lab for Kids',
        category: 'EdTech & Training',
        invRatio: 0.50,
        revRatio: 0.32,
        margin: 0.46,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 95,
        why_recommended: `Parents prioritize practical future-tech skills with recurring quarterly tuition fees and weekend workshop revenue.`
      },
      {
        name: 'IELTS & Study Abroad Prep Academy',
        category: 'Higher Education',
        invRatio: 0.40,
        revRatio: 0.30,
        margin: 0.50,
        demand: 'High',
        competition: 'Medium',
        risk: 'Low',
        score: 91,
        why_recommended: `Generates dual revenue: student course training fees + high foreign university student recruitment commissions.`
      },
      {
        name: 'Montessori Activity Pre-School & Daycare',
        category: 'Early Child Education',
        invRatio: 0.75,
        revRatio: 0.38,
        margin: 0.38,
        demand: 'High',
        competition: 'Medium',
        risk: 'Low',
        score: 89,
        why_recommended: `Critical necessity for dual-income working parents in urban hubs with upfront annual admission fees.`
      }
    ],

    green_energy_mfg: [
      {
        name: 'Rooftop Solar EPC & Grid Installation',
        category: 'Renewable Energy',
        invRatio: 0.70,
        revRatio: 0.45,
        margin: 0.34,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 96,
        why_recommended: `Backed by PM Surya Ghar Muft Bijli Yojana subsidies with strong residential and industrial payback demand.`
      },
      {
        name: 'Biodegradable Packaging & Paper Bag Unit',
        category: 'Eco-Manufacturing',
        invRatio: 0.60,
        revRatio: 0.35,
        margin: 0.30,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 93,
        why_recommended: `Single-use plastic bans create guaranteed wholesale volume demand across retail stores and cloud kitchens.`
      },
      {
        name: 'Commercial RO Water Purification & Bottling',
        category: 'Clean Water Infrastructure',
        invRatio: 0.65,
        revRatio: 0.38,
        margin: 0.36,
        demand: 'High',
        competition: 'Medium',
        risk: 'Low',
        score: 90,
        why_recommended: `Recurring daily 20-liter water can deliveries to offices, cafes, and residential towers.`
      }
    ],

    general_venture: [
      {
        name: `Asset-Light ${title} On-Demand Service`,
        category: 'Managed Services & D2C',
        invRatio: 0.45,
        revRatio: 0.30,
        margin: 0.42,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 94,
        why_recommended: `Minimizes heavy initial infrastructure capex in ${location}. Reinvests working capital directly into customer acquisition.`
      },
      {
        name: `Boutique ${title} Experience Center`,
        category: 'Specialized Retail & Service',
        invRatio: 0.70,
        revRatio: 0.38,
        margin: 0.36,
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 91,
        why_recommended: `Positions your offering at the premium segment with higher average order value (AOV) and customer retention.`
      },
      {
        name: `Turnkey ${title} Franchise & Supply Network`,
        category: 'Distribution & Franchise',
        invRatio: 0.85,
        revRatio: 0.42,
        margin: 0.30,
        demand: 'High',
        competition: 'Medium',
        risk: 'Low',
        score: 88,
        why_recommended: `Proven operational playbooks and pre-negotiated wholesale vendor pricing ensure faster break-even.`
      }
    ]
  };

  const domainList = catalog[domain] || catalog.general_venture;

  return domainList.map(item => {
    const inv = Math.max(Math.round(bgt * item.invRatio), 30000);
    const rev = Math.round(inv * item.revRatio * cityInfo.multiplier);
    const profit = Math.round(rev * item.margin);
    const annualProfit = profit * 12;
    const roi = Math.round((annualProfit / inv) * 100);
    const gap = Math.max(0, inv - bgt);

    return {
      name: item.name,
      category: item.category,
      investment: inv,
      demand: item.demand,
      competition: item.competition,
      risk: item.risk,
      score: item.score,
      budget_fit: gap === 0 ? 'Within budget' : `Need ₹${gap.toLocaleString('en-IN')} more`,
      estimated_monthly_revenue: rev,
      estimated_monthly_profit: profit,
      estimated_roi: `${roi}%`,
      why_recommended: item.why_recommended,
    };
  });
}
