import {
  BlogPost,
  ContactMessage,
  Event,
  Faq,
  GalleryItem,
  Membership,
  Partner,
  Product,
  Project,
  Service,
  SiteSettings,
  Subscriber,
  Testimonial,
  TeamMember
} from "./models.js";
import { media } from "./seedMedia.js";

const defaultSettings = {
  brand: {
    name: "Business Experts",
    tagline: "Business Ecosystem Platform",
    logo: "",
    favicon: ""
  },
  announcement: {
    enabled: true,
    text: "Startup Investor Summit 2026 — early-bird registrations are now open.",
    link: "/events",
    linkLabel: "Reserve your seat"
  },
  popup: {
    enabled: false,
    title: "Join the Ecosystem",
    message: "Become a member and get access to investors, mentors and exclusive events.",
    image: "",
    buttonLabel: "Become a Member",
    buttonLink: "/memberships"
  },
  hero: {
    badge: "The Complete Business Ecosystem",
    title: "Build, Invest & Grow Together",
    subtitle:
      "A complete ecosystem where businesses, startups, investors, professionals, and communities connect to build successful futures.",
    image: media("hero.svg"),
    primaryCta: { label: "Explore Platform", url: "/#services" },
    secondaryCta: { label: "Become a Member", url: "/memberships" },
    stats: [
      { value: "500+", label: "Members" },
      { value: "120+", label: "Startups Supported" },
      { value: "₹15Cr+", label: "Investments Facilitated" },
      { value: "60+", label: "Events Hosted" }
    ]
  },
  sections: [
    { key: "services", label: "Services", enabled: true },
    { key: "projects", label: "Projects", enabled: true },
    { key: "products", label: "Products", enabled: true },
    { key: "events", label: "Events", enabled: true },
    { key: "memberships", label: "Memberships", enabled: true },
    { key: "testimonials", label: "Testimonials", enabled: true },
    { key: "gallery", label: "Gallery", enabled: true },
    { key: "blog", label: "Blog", enabled: true },
    { key: "partners", label: "Partners", enabled: true },
    { key: "faq", label: "FAQ", enabled: true },
    { key: "cta", label: "Contact CTA", enabled: true }
  ],
  contact: {
    email: "hello@businessexperts.asia",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    address: "Level 12, Horizon Business Tower, Mumbai, Maharashtra 400051, India",
    mapEmbed: "",
    hours: "Mon – Sat, 9:00 AM – 7:00 PM IST"
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    youtube: "https://youtube.com"
  },
  footer: {
    about:
      "Business Experts is a premium ecosystem connecting businesses, startups, investors, professionals and communities to build successful futures together.",
    copyright: "© {year} Business Experts. All rights reserved.",
    links: [
      { label: "About", url: "/about" },
      { label: "Services", url: "/#services" },
      { label: "Projects", url: "/projects" },
      { label: "Events", url: "/events" },
      { label: "Memberships", url: "/memberships" },
      { label: "Blog", url: "/blog" },
      { label: "Contact", url: "/contact" }
    ],
    newsletterEnabled: true,
    newsletterTitle: "Stay in the loop",
    newsletterText: "Monthly insights on business growth, funding and ecosystem events. No spam."
  },
  seo: {
    title: "Business Experts — Build, Invest & Grow Together",
    description:
      "A complete business ecosystem where businesses, startups, investors, professionals, and communities connect to build successful futures.",
    keywords: "business ecosystem, startup investment, business networking, memberships, community programs",
    ogImage: media("hero.svg")
  },
  theme: { primary: "#059669", dark: "#0B1220", gray: "#F4F6FA" }
};

const services = [
  {
    title: "Business Growth Sessions",
    description:
      "Expert-led sessions to help businesses scale through strategy, marketing, sales, operations, and leadership.",
    image: media("service-growth.svg"),
    icon: "trending-up",
    features: ["Strategy & positioning", "Marketing & sales systems", "Leadership development"],
    order: 1
  },
  {
    title: "Support Management",
    description:
      "Professional business support including operations, customer management, workflow optimization, documentation, and digital transformation.",
    image: media("service-support.svg"),
    icon: "headset",
    features: ["Operations & workflows", "Customer management", "Digital transformation"],
    order: 2
  },
  {
    title: "Startup Investment",
    description:
      "Connect startups with investors and discover investment opportunities for long-term growth.",
    image: media("service-investment.svg"),
    icon: "handshake",
    features: ["Investor matchmaking", "Pitch preparation", "Due-diligence support"],
    order: 3
  },
  {
    title: "Old Citizen Membership Program",
    description:
      "A dedicated membership program providing support, community activities, healthcare guidance, and networking opportunities for senior citizens.",
    image: media("service-seniors.svg"),
    icon: "heart-handshake",
    features: ["Community activities", "Healthcare guidance", "Dedicated support desk"],
    order: 4
  },
  {
    title: "Business Networking",
    description:
      "Meet entrepreneurs, founders, mentors, investors, and professionals through exclusive networking events.",
    image: media("service-networking.svg"),
    icon: "network",
    features: ["Exclusive meetups", "Founder roundtables", "Mentor connections"],
    order: 5
  },
  {
    title: "Community Programs",
    description:
      "Professional community initiatives supporting education, employment, innovation, and entrepreneurship.",
    image: media("service-community.svg"),
    icon: "users",
    features: ["Education & skilling", "Employment drives", "Innovation challenges"],
    order: 6
  }
];

const memberships = [
  {
    name: "Business Membership",
    tagline: "For established companies ready to scale",
    price: "₹24,999",
    period: "per year",
    description: "Full ecosystem access for growing businesses.",
    benefits: [
      "Quarterly growth strategy sessions",
      "Priority access to all events",
      "Business support desk",
      "Partner & vendor network",
      "Brand listing on the platform"
    ],
    icon: "briefcase",
    isPopular: true,
    order: 1
  },
  {
    name: "Startup Membership",
    tagline: "For founders building the future",
    price: "₹9,999",
    period: "per year",
    description: "Everything a startup needs to find capital and customers.",
    benefits: [
      "Investor pitch opportunities",
      "Mentor matching",
      "Founder community access",
      "Discounted event passes",
      "Startup toolkit resources"
    ],
    icon: "rocket",
    order: 2
  },
  {
    name: "Investor Membership",
    tagline: "For angels, VCs and family offices",
    price: "₹49,999",
    period: "per year",
    description: "Curated deal flow and closed-door investor forums.",
    benefits: [
      "Curated startup deal flow",
      "Closed-door investor forums",
      "Due-diligence support",
      "Co-investment network",
      "Annual investor summit invite"
    ],
    icon: "trending-up",
    order: 3
  },
  {
    name: "Professional Membership",
    tagline: "For executives, consultants and experts",
    price: "₹4,999",
    period: "per year",
    description: "Grow your network and your career inside the ecosystem.",
    benefits: [
      "Networking events access",
      "Professional community groups",
      "Speaking & mentoring opportunities",
      "Job & consulting board",
      "Learning sessions"
    ],
    icon: "user-check",
    order: 4
  },
  {
    name: "Senior Citizen Membership",
    tagline: "Support, community and care for seniors",
    price: "₹2,499",
    period: "per year",
    description: "A dedicated program for senior citizens in our community.",
    benefits: [
      "Community activities & clubs",
      "Healthcare guidance sessions",
      "Dedicated support helpline",
      "Social & wellness events",
      "Family concierge support"
    ],
    icon: "heart-handshake",
    order: 5
  }
];

const projects = [
  {
    title: "InvestLink Portal",
    category: "FinTech Platform",
    shortDescription: "A digital platform matching vetted startups with verified investors across Asia.",
    fullDescription:
      "InvestLink is our flagship investment-matchmaking platform. Startups create data-rich profiles, investors define their thesis, and our matching engine connects both sides with due-diligence tooling, secure data rooms and deal tracking built in.\n\nThe portal has facilitated introductions leading to multiple funded rounds and continues to grow with new investor cohorts onboarded every quarter.",
    coverImage: media("project-fintech.svg"),
    gallery: [media("project-fintech.svg"), media("gallery-4.svg")],
    technologies: ["React", "Node.js", "MongoDB", "AWS"],
    status: "Completed",
    liveUrl: "https://example.com",
    completionDate: new Date("2026-02-15"),
    isFeatured: true,
    order: 1
  },
  {
    title: "BizGrow CRM",
    category: "SaaS Product",
    shortDescription: "A lightweight CRM built for small businesses in the ecosystem to manage leads and clients.",
    fullDescription:
      "BizGrow CRM gives member businesses a simple, affordable way to track leads, manage pipelines and automate follow-ups. Built with feedback from over 40 member companies, it focuses on the 20% of CRM features that small teams actually use.",
    coverImage: media("project-crm.svg"),
    gallery: [media("project-crm.svg")],
    technologies: ["React", "Express", "MongoDB", "TailwindCSS"],
    status: "In Progress",
    isFeatured: true,
    order: 2
  },
  {
    title: "Community Connect App",
    category: "Community Platform",
    shortDescription: "A mobile-first app connecting members to events, programs and each other.",
    fullDescription:
      "Community Connect brings the entire ecosystem into one app — event registrations, member directory, discussion groups and program applications. The senior citizen program module includes simplified navigation and a one-tap support helpline.",
    coverImage: media("project-community.svg"),
    gallery: [media("project-community.svg"), media("gallery-2.svg")],
    technologies: ["React Native", "Node.js", "MongoDB"],
    status: "Completed",
    completionDate: new Date("2025-11-20"),
    isFeatured: true,
    order: 3
  }
];

const products = [
  {
    name: "Business Starter Toolkit",
    category: "Digital Toolkit",
    price: 4999,
    priceLabel: "₹4,999",
    description:
      "A complete digital toolkit for new businesses — incorporation checklists, financial model templates, brand guidelines starter, and 50+ legal and HR document templates.",
    thumbnail: media("product-toolkit.svg"),
    images: [media("product-toolkit.svg")],
    features: ["50+ ready templates", "Financial model included", "Lifetime updates"],
    tags: ["templates", "startup", "legal"],
    isFeatured: true,
    order: 1
  },
  {
    name: "Market Research Report 2026",
    category: "Research",
    price: 12999,
    priceLabel: "₹12,999",
    description:
      "An in-depth 120-page report covering startup funding trends, sector opportunities and consumer shifts across Indian and Southeast Asian markets in 2026.",
    thumbnail: media("product-report.svg"),
    images: [media("product-report.svg")],
    features: ["120 pages of analysis", "12 sector deep-dives", "Quarterly data refresh"],
    tags: ["research", "investment", "market"],
    isFeatured: true,
    order: 2
  },
  {
    name: "Pitch Deck Pro Template",
    category: "Digital Toolkit",
    price: 2499,
    priceLabel: "₹2,499",
    description:
      "The exact 14-slide structure used by our funded startups, with investor-reviewed storytelling guidance, financial slide formulas and design system included.",
    thumbnail: media("product-pitch.svg"),
    images: [media("product-pitch.svg")],
    features: ["14 investor-tested slides", "Storytelling guide", "Figma + PowerPoint files"],
    tags: ["pitch", "fundraising", "startup"],
    order: 3
  }
];

const events = [
  {
    title: "Startup Investor Summit 2026",
    description:
      "Our flagship annual summit bringing together 300+ founders, angels and VCs for a full day of pitches, panels and curated 1:1 investor meetings.",
    banner: media("event-summit.svg"),
    date: new Date("2026-08-22T09:30:00+05:30"),
    time: "9:30 AM – 6:00 PM",
    venue: "Horizon Convention Centre, Mumbai",
    seats: 300,
    registrationLink: "https://example.com/register",
    gallery: [media("gallery-1.svg"), media("gallery-4.svg")],
    isFeatured: true,
    order: 1
  },
  {
    title: "Business Networking Meetup — Q3",
    description:
      "An evening of structured networking for members: founder roundtables, speed-networking rounds and an open mixer with mentors and investors.",
    banner: media("event-meetup.svg"),
    date: new Date("2026-09-12T17:00:00+05:30"),
    time: "5:00 PM – 9:00 PM",
    venue: "The Grand Business Hub, Mumbai",
    seats: 120,
    registrationLink: "https://example.com/register",
    gallery: [media("gallery-3.svg")],
    order: 2
  }
];

const testimonials = [
  {
    name: "Rohan Sharma",
    company: "NexaPay",
    role: "Founder & CEO",
    image: media("avatar-1.svg"),
    rating: 5,
    review:
      "Through the investor network here we closed our seed round in under four months. The pitch preparation support alone was worth the membership.",
    order: 1
  },
  {
    name: "Ananya Patel",
    company: "GreenKart Retail",
    role: "Managing Director",
    image: media("avatar-2.svg"),
    rating: 5,
    review:
      "The business growth sessions completely restructured our sales process. We grew revenue 60% in a year and hired with confidence.",
    order: 2
  },
  {
    name: "Vikram Khanna",
    company: "Khanna Capital",
    role: "Angel Investor",
    image: media("avatar-3.svg"),
    rating: 4,
    review:
      "Curated, high-quality deal flow without the noise. I have made three investments through the platform and the diligence support is excellent.",
    order: 3
  }
];

const blogs = [
  {
    title: "5 Growth Levers Every Small Business Should Pull in 2026",
    banner: media("blog-growth.svg"),
    excerpt:
      "Most businesses chase new customers while ignoring the levers that compound: pricing, retention, referrals, positioning and operational leverage.",
    content:
      "Most businesses chase new customers while ignoring the levers that compound quietly in the background.\n\n**1. Pricing.** The fastest profit lever in any business. A 5% price increase, positioned correctly, usually outperforms months of new marketing spend.\n\n**2. Retention.** Acquiring a customer costs five times more than keeping one. Build a simple 90-day onboarding journey before spending another rupee on ads.\n\n**3. Referrals.** Happy customers refer when you make it effortless. Create a named, visible referral program — not a hidden link in a footer.\n\n**4. Positioning.** Narrow your promise until it is impossible to confuse you with a competitor. Specific beats broad in every crowded market.\n\n**5. Operational leverage.** Document your top five processes so growth doesn't depend on any single person — including you.\n\nMembers can book a Business Growth Session to workshop these levers with our experts.",
    tags: ["growth", "strategy", "small business"],
    category: "Business Growth",
    author: "Business Experts Editorial",
    publishDate: new Date("2026-06-28")
  },
  {
    title: "What Investors Actually Look For in a First Meeting",
    banner: media("blog-funding.svg"),
    excerpt:
      "After facilitating hundreds of investor introductions, we've seen the same patterns decide outcomes in the first twenty minutes.",
    content:
      "After facilitating hundreds of investor introductions on our platform, the patterns are remarkably consistent.\n\n**Founder clarity beats deck polish.** Investors forgive an ugly slide; they don't forgive a founder who can't explain the business in two sentences.\n\n**Evidence of learning speed.** Early-stage investing is a bet on iteration. Show what you believed six months ago, what you learned, and what you changed.\n\n**A real wedge.** \"We'll capture 1% of a huge market\" is a red flag. A specific customer, with a painful problem, paying you today, is a green one.\n\n**Honest numbers.** Know your CAC, churn and margin cold — and flag the ugly ones yourself before the investor finds them.\n\nStartup members get pitch preparation and mock investor sessions before every summit.",
    tags: ["fundraising", "investors", "startup"],
    category: "Investment",
    author: "Business Experts Editorial",
    publishDate: new Date("2026-07-06")
  },
  {
    title: "Networking That Works: A Playbook for Introverts",
    banner: media("blog-network.svg"),
    excerpt:
      "Great networking isn't about working the room. It's about preparation, curiosity, and following up better than everyone else.",
    content:
      "The best networkers at our events are rarely the loudest people in the room.\n\n**Prepare three questions.** Curiosity is more memorable than a rehearsed pitch. Ask about the other person's hardest current problem.\n\n**Set a small target.** Two genuine conversations beat twenty business cards. Depth compounds; volume evaporates.\n\n**Use structured formats.** Our roundtables and speed-networking rounds exist precisely so you never have to cold-approach a stranger at a buffet table.\n\n**Follow up within 48 hours.** A short, specific message referencing your conversation puts you ahead of 90% of attendees.\n\nSee the Events page for the next networking meetup.",
    tags: ["networking", "events", "community"],
    category: "Networking",
    author: "Business Experts Editorial",
    publishDate: new Date("2026-07-12")
  }
];

const faqs = [
  {
    question: "What is the Business Experts platform?",
    answer:
      "We are a business ecosystem that connects businesses, startups, investors, professionals and communities through memberships, events, growth programs and an investment network.",
    order: 1
  },
  {
    question: "How do startup–investor introductions work?",
    answer:
      "Startup members submit their profile and pitch materials. Our team curates matches based on investor theses and arranges introductions, with pitch preparation and due-diligence support included.",
    order: 2
  },
  {
    question: "Which membership is right for me?",
    answer:
      "Choose Business if you run an established company, Startup if you are raising or scaling, Investor for deal flow access, Professional for networking and career growth, and Senior Citizen for our dedicated community support program.",
    order: 3
  },
  {
    question: "Are events open to non-members?",
    answer:
      "Selected events offer public passes, but members always get priority access and discounted or free entry. Check each event's registration page for details.",
    order: 4
  },
  {
    question: "What does the Senior Citizen Membership include?",
    answer:
      "Community activities, healthcare guidance sessions, wellness events, a dedicated support helpline and networking opportunities designed specifically for senior citizens.",
    order: 5
  }
];

const team = [
  {
    name: "Suraj Kurrey",
    role: "Founder & CEO",
    bio: "Building the ecosystem that connects Indian businesses, startups and investors under one roof.",
    image: media("avatar-4.svg"),
    linkedin: "https://linkedin.com",
    order: 1
  },
  {
    name: "Neha Gupta",
    role: "Head of Investments",
    bio: "Leads investor relations, deal curation and the annual Startup Investor Summit.",
    image: media("avatar-5.svg"),
    linkedin: "https://linkedin.com",
    order: 2
  },
  {
    name: "Deepak Joshi",
    role: "Community Director",
    bio: "Runs community programs, networking events and the senior citizen membership initiative.",
    image: media("avatar-6.svg"),
    linkedin: "https://linkedin.com",
    order: 3
  }
];

const partners = [
  { name: "NovaBank Financial", logo: media("logo-1.svg"), url: "https://example.com", type: "Partner", order: 1 },
  { name: "TechBridge Labs", logo: media("logo-2.svg"), url: "https://example.com", type: "Partner", order: 2 },
  { name: "GrowthWorks Capital", logo: media("logo-3.svg"), url: "https://example.com", type: "Sponsor", order: 3 },
  { name: "UnityCorp Group", logo: media("logo-4.svg"), url: "https://example.com", type: "Sponsor", order: 4 }
];

const gallery = [
  { title: "Investor Summit 2025 — main stage", url: media("gallery-1.svg"), category: "Events", order: 1 },
  { title: "Community skilling workshop", url: media("gallery-2.svg"), category: "Community", order: 2 },
  { title: "Founder networking evening", url: media("gallery-3.svg"), category: "Events", order: 3 },
  { title: "Growth masterclass session", url: media("gallery-4.svg"), category: "Workshops", order: 4 },
  { title: "Business support clinic", url: media("gallery-5.svg"), category: "Workshops", order: 5 },
  { title: "Senior citizen community day", url: media("gallery-6.svg"), category: "Community", order: 6 }
];

export async function seedDatabase() {
  const jobs = [
    [SiteSettings, [defaultSettings]],
    [Service, services],
    [Membership, memberships],
    [Project, projects],
    [Product, products],
    [Event, events],
    [Testimonial, testimonials],
    [BlogPost, blogs],
    [Faq, faqs],
    [TeamMember, team],
    [Partner, partners],
    [GalleryItem, gallery]
  ];

  for (const [Model, docs] of jobs) {
    if ((await Model.estimatedDocumentCount()) === 0) {
      await Model.create(docs);
      console.log(`Seeded ${Model.modelName} (${docs.length})`);
    }
  }

  // Keep collections registered even when empty so stats endpoints never fail.
  await Promise.all([ContactMessage.init(), Subscriber.init()]);
}
