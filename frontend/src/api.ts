export type Link = { label: string; url: string };

export type Settings = {
  brand: { name: string; tagline: string; logo: string; logoHeight?: number; favicon: string };
  announcement: { enabled: boolean; text: string; link: string; linkLabel: string };
  popup: {
    enabled: boolean;
    title: string;
    message: string;
    image: string;
    buttonLabel: string;
    buttonLink: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    image: string;
    primaryCta: Link;
    secondaryCta: Link;
    stats: { value: string; label: string }[];
  };
  sections: { key: string; label: string; enabled: boolean }[];
  businessStory: { enabled: boolean; title: string; description: string; video: string };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    mapEmbed: string;
    hours: string;
  };
  social: Record<string, string>;
  footer: {
    about: string;
    copyright: string;
    links: Link[];
    newsletterEnabled: boolean;
    newsletterTitle: string;
    newsletterText: string;
  };
  seo: { title: string; description: string; keywords: string; ogImage: string };
  theme: { primary: string; dark: string; gray: string };
};

export type Service = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription: string;
  image: string;
  icon: string;
  features: string[];
};

export type Project = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  gallery: string[];
  video: string;
  logo: string;
  technologies: string[];
  status: string;
  liveUrl: string;
  githubUrl: string;
  completionDate?: string;
  isFeatured: boolean;
};

export type Course = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  duration: string;
  mode: string;
  level: string;
  price: number;
  priceLabel: string;
  syllabus: string[];
  highlights: string[];
  enrollLink: string;
  video: string;
  startDate?: string;
  isFeatured: boolean;
};

export type EventItem = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  banner: string;
  date?: string;
  time: string;
  venue: string;
  seats: number;
  registrationLink: string;
  gallery: string[];
};

export type Membership = {
  _id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  description: string;
  benefits: string[];
  icon: string;
  isPopular: boolean;
};

export type Testimonial = {
  _id: string;
  name: string;
  company: string;
  role: string;
  image: string;
  rating: number;
  review: string;
  videoUrl: string;
};

export type SuccessStory = {
  _id: string;
  name: string;
  trainingProgram: string;
  achievement: string;
  story: string;
  image: string;
  video: string;
};

export type GalleryItem = {
  _id: string;
  title: string;
  type: "photo" | "video";
  url: string;
  thumbnail: string;
  category: string;
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  banner: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  author: string;
  publishDate?: string;
  seoTitle: string;
  seoDescription: string;
};

export type Faq = { _id: string; question: string; answer: string };

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin: string;
};

export type Partner = { _id: string; name: string; logo: string; url: string; type: string };

export type HomeData = {
  settings: Settings;
  services: Service[];
  projects: Project[];
  courses: Course[];
  events: EventItem[];
  memberships: Membership[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  blogs: BlogPost[];
  faqs: Faq[];
  partners: Partner[];
};

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`/api${path}`);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((data as { error?: string }).error || "Request failed.");
  return data as T;
}

export function formatDate(value?: string, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options
  });
}

// Accepts any YouTube/Vimeo URL a user might paste (share link, watch link, or
// already an embed URL) and normalizes it into something safe to put in an iframe.
export function toEmbedUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();

  const youtuBe = trimmed.match(/^https?:\/\/youtu\.be\/([\w-]+)/);
  if (youtuBe) return `https://www.youtube.com/embed/${youtuBe[1]}`;

  const youtubeWatch = trimmed.match(/^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([\w-]+)/);
  if (youtubeWatch) return `https://www.youtube.com/embed/${youtubeWatch[1]}`;

  const youtubeShorts = trimmed.match(/^https?:\/\/(?:www\.)?youtube\.com\/shorts\/([\w-]+)/);
  if (youtubeShorts) return `https://www.youtube.com/embed/${youtubeShorts[1]}`;

  const vimeo = trimmed.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return trimmed;
}
