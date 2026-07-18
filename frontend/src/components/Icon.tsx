import {
  Box,
  Briefcase,
  Building2,
  Calendar,
  Handshake,
  Headset,
  HeartHandshake,
  Image,
  Mic,
  Network,
  PenLine,
  Rocket,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users
} from "lucide-react";

const ICONS: Record<string, typeof Sparkles> = {
  "trending-up": TrendingUp,
  headset: Headset,
  handshake: Handshake,
  "heart-handshake": HeartHandshake,
  network: Network,
  users: Users,
  briefcase: Briefcase,
  rocket: Rocket,
  "user-check": UserCheck,
  box: Box,
  calendar: Calendar,
  pen: PenLine,
  image: Image,
  mic: Mic,
  building: Building2
};

export default function Icon({ name, className }: { name?: string; className?: string }) {
  const Component = (name && ICONS[name]) || Sparkles;
  return <Component className={className} aria-hidden />;
}
