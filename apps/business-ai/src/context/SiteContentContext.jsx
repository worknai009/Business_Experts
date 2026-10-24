import React, { createContext, useContext, useState, useEffect } from "react";

export const DEFAULT_SITE_CONTENT = {
  branding: {
    siteName: "BusinessAI",
    accentWord: "AI",
    tagline: "India's #1 AI-Powered Business Opportunity Finder"
  },
  hero: {
    badge: "AI-Powered Business Opportunity Finder",
    headingLine1: "Turn Business Ideas",
    headingLine2: "Into",
    highlight: "Profitable Decisions",
    headingSuffix: "in India.",
    description: "Scan 500+ Indian industries, validate local consumer demand, calculate 12-month unit economics, and unlock government PMEGP/MUDRA subsidies in 30 seconds.",
    mediaType: "video",
    mediaUrl: "/robot-video.mp4",
    primaryCtaLabel: "Analyze Your Opportunity",
    primaryCtaTo: "/business-finder",
    secondaryCtaLabel: "Explore Opportunities",
    secondaryCtaTo: "/analyze",
    stats: [
      { value: "50K+", label: "Ideas Analyzed" },
      { value: "₹20Cr+", label: "Revenue Mapped" },
      { value: "18,000+", label: "Opportunities Found" },
      { value: "96%", label: "Accuracy Rate" }
    ],
    dashboard: {
      score: 86,
      scoreLabel: "Excellent",
      trendLabel: "+18.4% YoY",
      sectors: [
        { label: "Technology", value: 34 },
        { label: "Health", value: 22 },
        { label: "Finance", value: 18 },
        { label: "Education", value: 16 },
        { label: "Others", value: 10 }
      ],
      metrics: [
        { label: "Payback", value: "8 mo" },
        { label: "Competition", value: "Low" },
        { label: "ROI Range", value: "30–45%" }
      ]
    }
  },
  howItWorks: {
    eyebrow: "5-Step Playbook",
    title: "From Raw Idea to Bank-Approved Business in 5 Steps",
    subtitle: "A structured, risk-free workflow designed for Indian founders and MSME investors.",
    steps: [
      { step: "01", title: "Input Budget & City", desc: "Specify your investment capacity (₹2L – ₹50L+) and target Indian metro." },
      { step: "02", title: "AI Scans 500+ Sectors", desc: "Our neural engine scans regional competition, rental benchmarks, and footfall density." },
      { step: "03", title: "12-Month Financials", desc: "Review projected monthly revenue, operating expenses, and break-even payback timelines." },
      { step: "04", title: "Subsidy Matching", desc: "Check instant pre-eligibility for PMEGP (15%–35%), MUDRA, and CGTMSE guarantee." },
      { step: "05", title: "Bank-Ready PDF Export", desc: "Download an official A4 Project Appraisal Dossier ready for bank branch appraisal." }
    ]
  },
  opportunityFinder: {
    title: "Top Evaluated Indian Business Opportunities",
    highlight: "High ROI Opportunities",
    subtitle: "Scan verified unit economics, break-even timelines, and subsidy grants.",
    opportunities: [
      {
        name: "Specialty Tea & Snack Kiosk",
        tag: "Fast ROI • High Margin",
        invest: "₹1,50,000 – ₹3,50,000",
        img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
        ctaLabel: "View Business Model",
        ctaTo: "/business-finder"
      },
      {
        name: "Cloud Kitchen / Dark Kitchen Hub",
        tag: "Delivery Only • Scalable",
        invest: "₹4,00,000 – ₹8,00,000",
        img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
        ctaLabel: "Analyze Kitchen Capex",
        ctaTo: "/business-finder"
      },
      {
        name: "EV Two-Wheeler Charging Hub",
        tag: "Clean Tech • Future Proof",
        invest: "₹8,50,000 – ₹15,00,000",
        img: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
        ctaLabel: "Explore EV Subsidies",
        ctaTo: "/business-finder"
      },
      {
        name: "Pet Care & Grooming Clinic",
        tag: "High Demand • Low Risk",
        invest: "₹3,20,000 – ₹6,00,000",
        img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
        ctaLabel: "Check Pet Demographics",
        ctaTo: "/business-finder"
      },
      {
        name: "B2B Digital Marketing Agency",
        tag: "Low Capex • High Margin",
        invest: "₹80,000 – ₹2,00,000",
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        ctaLabel: "Explore Agency Model",
        ctaTo: "/business-finder"
      }
    ],
    metrics: [
      { label: "AI Match", value: "96%", accent: false },
      { label: "Market Demand", value: "High", accent: true },
      { label: "Investment Range", value: "₹8L – ₹15L", accent: false },
      { label: "Profit Potential", value: "30% – 45%", accent: true }
    ]
  },
  audiences: {
    eyebrow: "Tailored For Growth",
    title: "Perfect for Every Aspiring Entrepreneur",
    subtitle: "Whether you are launching your first venture or scaling regional operations.",
    items: [
      {
        title: "First-Time Founders",
        badge: "Idea to Launch",
        desc: "Find low-capex business opportunities with government PMEGP/MUDRA subsidy backing.",
        img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=600&fit=crop&q=85",
        ctaLabel: "Explore Playbook",
        ctaTo: "/business-finder"
      },
      {
        title: "MSME & Retail Owners",
        badge: "Revenue Expansion",
        desc: "Identify high-demand franchise sectors, nearby micro-depots, and unit profit benchmarks.",
        img: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&h=600&fit=crop&q=85",
        ctaLabel: "Explore Playbook",
        ctaTo: "/business-finder"
      },
      {
        title: "Angel & Seed Investors",
        badge: "Deal Due Diligence",
        desc: "Perform 30-second unit economic stress tests and evaluate regional saturation metrics.",
        img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop&q=85",
        ctaLabel: "Explore Playbook",
        ctaTo: "/business-finder"
      },
      {
        title: "Entrepreneurs & Students",
        badge: "Market Mastery",
        desc: "Learn real-world business appraisal with Gemini AI Mentor guidance.",
        img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=85",
        ctaLabel: "Explore Playbook",
        ctaTo: "/business-finder"
      }
    ]
  },
  testimonials: {
    eyebrow: "What Users Say",
    title: "Trusted by Thousands of Entrepreneurs",
    reviews: [
      {
        name: "Rohit Sharma",
        role: "Cloud Kitchen Entrepreneur, Jaipur",
        text: "BusinessAI helped me find a cloud kitchen opportunity. Today I am earning 1.5L/month.",
        initials: "RS",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80"
      },
      {
        name: "Priya Mehta",
        role: "Small Business Owner, Pune",
        text: "The AI report is incredibly detailed and easy to understand. Highly recommended.",
        initials: "PM",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&q=80"
      },
      {
        name: "Aman Verma",
        role: "Angel Investor, Bengaluru",
        text: "I use BusinessAI to evaluate ideas before investing. It saves so much time.",
        initials: "AV",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80"
      },
      {
        name: "Sneha Patil",
        role: "Commerce Graduate, Mumbai",
        text: "Perfect for learning how market analysis actually works before starting out.",
        initials: "SP",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&q=80"
      }
    ]
  },
  pricing: {
    eyebrow: "Membership Plans",
    title: "Start validating before you start spending",
    subtitle: "Explore the tools you need to make smarter business decisions.",
    plans: [
      {
        name: "Free",
        price: "₹0",
        period: "forever",
        desc: "Opportunity search & matching, feasibility rating (0–100), core market demand and risk signals.",
        features: [
          "Opportunity search & matching",
          "Feasibility rating (0–100)",
          "Core market demand & risk signals",
          "Basic business recommendations"
        ],
        cta: "Explore Free",
        to: "/business-finder",
        highlight: false
      },
      {
        name: "Pro",
        price: "₹499",
        period: "/month",
        desc: "Unlimited AI reports, extended financial projections, multi-opportunity comparison, RAG mentor & PDF export.",
        features: [
          "Everything in Free",
          "Unlimited AI feasibility reports",
          "Extended financial projections",
          "Multi-opportunity comparison tool",
          "RAG AI Business Mentor chat",
          "PDF report export"
        ],
        cta: "Get Pro",
        to: "/subscription?plan=Pro",
        highlight: true
      },
      {
        name: "Business",
        price: "₹1,999",
        period: "/month",
        desc: "Up to 10 team seats, white-labelled reports, API access, priority data refresh & dedicated account manager.",
        features: [
          "Everything in Pro",
          "Up to 10 team seats",
          "White-labelled reports",
          "API access for integrations",
          "Priority data refresh",
          "Dedicated account manager"
        ],
        cta: "Contact Sales",
        to: "/subscription?plan=Business",
        highlight: false
      }
    ]
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions before you start?",
    subtitle: "Clear answers to questions about recommendation logic, estimates, and data accuracy.",
    items: [
      { q: "Can I search for any business?", a: "Yes. Enter any business idea or category. BusinessAI evaluates it using your budget, location, experience and interest, then surfaces matching opportunities." },
      { q: "How does the Government Subsidy check work?", a: "We automatically map your project capex, industry type, and applicant category to national schemes like PMEGP (15% to 35% capital grant), MUDRA loans, and CGTMSE collateral guarantees." },
      { q: "Can I export the report for bank loan approval?", a: "Yes! The Pro and Business tiers allow you to export official bank-ready Project Appraisal Dossiers in formatted PDF format ready for submission to SBI, HDFC, PNB, and cooperative banks." },
      { q: "Which cities and towns are covered in India?", a: "Our AI platform indexes tier-1 metros (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune) as well as 600+ tier-2 and tier-3 towns across India." },
      { q: "How accurate are the financial estimates?", a: "Financial figures are estimates to aid initial decision-making. Always validate assumptions with current local costs and professional advice before investing." },
      { q: "Does BusinessAI guarantee profit?", a: "No. No tool can guarantee profit. BusinessAI provides estimates, comparisons, and risk signals to help you make a more informed decision." }
    ]
  },
  finalCta: {
    eyebrow: "READY TO FIND YOUR OPPORTUNITY?",
    heading: "Find the business that fits your reality in India.",
    subtitle: "Tell us your budget, location and business idea.",
    ctaLabel: "Find My Business Opportunity",
    ctaTo: "/business-finder"
  },
  footer: {
    description: "AI-powered business research and opportunity matching. Validate your idea with market data before you invest.",
    copyright: "© 2026 BusinessAI. All rights reserved.",
    disclaimer: "Planning estimates only. Validate assumptions before investing."
  }
};

const SiteContentContext = createContext({
  content: DEFAULT_SITE_CONTENT,
  updateSection: () => {},
  saveAllContent: () => {},
  resetToDefault: () => {}
});

function deepMerge(defaults, custom) {
  if (!custom || typeof custom !== "object") return defaults;
  const result = { ...defaults };
  for (const key of Object.keys(custom)) {
    if (custom[key] && typeof custom[key] === "object" && !Array.isArray(custom[key]) && defaults[key]) {
      result[key] = deepMerge(defaults[key], custom[key]);
    } else if (custom[key] !== undefined && custom[key] !== null) {
      result[key] = custom[key];
    }
  }
  return result;
}

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const saved = localStorage.getItem("site_content");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Object.keys(parsed).length > 0) {
          return deepMerge(DEFAULT_SITE_CONTENT, parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load local site content", e);
    }
    return DEFAULT_SITE_CONTENT;
  });

  const loadBackendContent = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch("/api/content", {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (res && res.ok) {
        const remoteData = await res.json().catch(() => null);
        if (remoteData && typeof remoteData === "object" && Object.keys(remoteData).length > 0) {
          setContent((prev) => {
            const merged = deepMerge(DEFAULT_SITE_CONTENT, { ...prev, ...remoteData });
            try {
              localStorage.setItem("site_content", JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      }
    } catch (e) {
      // Silently fallback to cached/default content
    }
  };

  const broadcastContent = (newContent) => {
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel("site_content_channel");
        channel.postMessage(newContent);
        channel.close();
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadBackendContent();

    let channel;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        channel = new BroadcastChannel("site_content_channel");
        channel.onmessage = (event) => {
          if (event.data && typeof event.data === "object") {
            setContent((prev) => {
              const merged = { ...prev, ...event.data };
              try {
                localStorage.setItem("site_content", JSON.stringify(merged));
              } catch (e) {}
              return merged;
            });
          }
        };
      }
    } catch (e) {}

    const handleUpdateEvent = () => {
      try {
        const saved = localStorage.getItem("site_content");
        if (saved) {
          const parsed = JSON.parse(saved);
          setContent((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.warn(e);
      }
    };

    window.addEventListener("site_content_updated", handleUpdateEvent);
    window.addEventListener("storage", handleUpdateEvent);

    const handleFocus = () => loadBackendContent();
    const handleVisibility = () => {
      if (!document.hidden) loadBackendContent();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    const interval = setInterval(loadBackendContent, 2000);

    return () => {
      if (channel) channel.close();
      window.removeEventListener("site_content_updated", handleUpdateEvent);
      window.removeEventListener("storage", handleUpdateEvent);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(interval);
    };
  }, []);

  const updateSection = (sectionKey, newSectionData) => {
    setContent((prev) => {
      const updated = { ...prev, [sectionKey]: newSectionData };
      try {
        localStorage.setItem("site_content", JSON.stringify(updated));
      } catch (e) {}
      window.dispatchEvent(new Event("site_content_updated"));
      broadcastContent(updated);
      return updated;
    });
  };

  const saveAllContent = (newFullContent) => {
    const updated = { ...DEFAULT_SITE_CONTENT, ...newFullContent };
    setContent(updated);
    try {
      localStorage.setItem("site_content", JSON.stringify(updated));
    } catch (e) {}
    window.dispatchEvent(new Event("site_content_updated"));
    broadcastContent(updated);
  };

  const resetToDefault = () => {
    setContent(DEFAULT_SITE_CONTENT);
    try {
      localStorage.removeItem("site_content");
    } catch (e) {}
    window.dispatchEvent(new Event("site_content_updated"));
    broadcastContent(DEFAULT_SITE_CONTENT);
  };

  return (
    <SiteContentContext.Provider
      value={{ content, updateSection, saveAllContent, resetToDefault }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
