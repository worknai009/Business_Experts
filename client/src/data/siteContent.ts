import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  Factory,
  FileCheck2,
  Globe2,
  Handshake,
  LandPlot,
  LineChart,
  Scale,
  ShieldCheck,
  TrendingUp,
  UsersRound
} from "lucide-react";

export type Service = {
  title: string;
  copy: string;
  icon: LucideIcon;
  image: string;
};

export const images = {
  hero: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=85",
  boardroom: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1300&q=85",
  india: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1300&q=85",
  investment: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1300&q=85",
  handshake: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1300&q=85",
  factory: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1300&q=85",
  compliance: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1300&q=85",
  team: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1300&q=85",
  contact: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1300&q=85"
};

export const stats = [
  { value: "200+", label: "Projects" },
  { value: "10+", label: "Years" },
  { value: "100%", label: "Success" }
];

export const services: Service[] = [
  {
    title: "Mandatory Registrations",
    copy: "Company incorporation, LLP, liaison office setup, GST, PAN, TAN, and regulatory documentation.",
    icon: FileCheck2,
    image: images.compliance
  },
  {
    title: "Govt. Approvals",
    copy: "Licensing, approvals, tax registration, and compliance coordination with Indian authorities.",
    icon: BadgeCheck,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "FDI & Ventures",
    copy: "FDI route advisory, FEMA/RBI compliance, joint ventures, and investor-ready structuring.",
    icon: Handshake,
    image: images.handshake
  },
  {
    title: "Real Estate",
    copy: "Industrial land acquisition, commercial leasing, title verification, and due diligence.",
    icon: LandPlot,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85"
  },
  {
    title: "Factory Setup",
    copy: "DPR, EPC registration, vendor sourcing, logistics, factory compliance, and setup execution.",
    icon: Factory,
    image: images.factory
  },
  {
    title: "Growth Strategy",
    copy: "Market entry roadmap, ROI planning, investor meetings, partnerships, and scale-up strategy.",
    icon: TrendingUp,
    image: images.boardroom
  }
];

export const whyIndia = [
  { icon: Globe2, text: "One of the world's fastest-growing major economies." },
  { icon: UsersRound, text: "Large young workforce and expanding consumer market." },
  { icon: LineChart, text: "Strong FDI policy support with high ROI potential." },
  { icon: Building2, text: "Manufacturing growth through PLI and infrastructure programs." }
];

export const strengths = [
  { icon: ShieldCheck, text: "Single-window execution with full compliance visibility." },
  { icon: Scale, text: "Legal, tax, land, licensing, and operational advisory under one roof." },
  { icon: BarChart3, text: "Customized ROI-focused market entry and growth strategy." },
  { icon: CheckCircle2, text: "Local execution support with global investor understanding." }
];
